import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmbedPreview } from "@/routes/embed/$memoId";

const createDomRect = (height: number): DOMRect =>
	({
		x: 0,
		y: 0,
		width: 0,
		height,
		top: 0,
		right: 0,
		bottom: height,
		left: 0,
		toJSON: () => ({}),
	} as DOMRect);

let originalParentDescriptor = Object.getOwnPropertyDescriptor(window, "parent");
let originalResizeObserverDescriptor = Object.getOwnPropertyDescriptor(
	globalThis,
	"ResizeObserver",
);

afterEach(() => {
	vi.restoreAllMocks();
	if (originalParentDescriptor) {
		Object.defineProperty(window, "parent", originalParentDescriptor);
	}
	if (originalResizeObserverDescriptor) {
		Object.defineProperty(
			globalThis,
			"ResizeObserver",
			originalResizeObserverDescriptor,
		);
	}
});

describe("EmbedPreview", () => {
	it("renders html and posts resize updates when embedded in an iframe", async () => {
		const parentWindow = { postMessage: vi.fn() };
		Object.defineProperty(window, "parent", {
			value: parentWindow,
			configurable: true,
		});

		class ResizeObserverMock {
			observe = vi.fn();
			disconnect = vi.fn();
			constructor(_callback: ResizeObserverCallback) {}
		}
		Object.defineProperty(globalThis, "ResizeObserver", {
			value: ResizeObserverMock,
			configurable: true,
		});

		vi.spyOn(window, "requestAnimationFrame").mockImplementation(
			(callback: FrameRequestCallback) => {
				callback(0);
				return 1;
			},
		);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
		Object.defineProperty(document.documentElement, "scrollHeight", {
			value: 220,
			configurable: true,
		});
		Object.defineProperty(document.body, "scrollHeight", {
			value: 200,
			configurable: true,
		});

		const { container, unmount } = render(
			<EmbedPreview html="<article>Rendered memo</article>" frameId="frame-1" />,
		);
		const root = container.firstElementChild as HTMLDivElement;
		vi.spyOn(root, "getBoundingClientRect").mockReturnValue(createDomRect(180));

		await waitFor(() => {
			expect(container.textContent).toContain("Rendered memo");
			expect(parentWindow.postMessage).toHaveBeenCalledWith(
				{ type: "memos-embed:resize", frameId: "frame-1", height: 220 },
				"*",
			);
		});

		unmount();
	});
});
