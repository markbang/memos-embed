import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlaygroundExperience } from "@/components/PlaygroundExperience";
import { defaultPlaygroundState } from "@/lib/playground";

vi.mock("@memos-embed/react", () => ({
	MemoEmbed: () => <div data-testid="memo-embed-react">React preview</div>,
}));

describe("PlaygroundExperience", () => {
	const writeText = vi.fn(async () => undefined);
	const iframeAttributes = new WeakMap<
		HTMLIFrameElement,
		Map<string, string>
	>();
	const originalSetAttribute = HTMLIFrameElement.prototype.setAttribute;
	const originalGetAttribute = HTMLIFrameElement.prototype.getAttribute;

	beforeEach(() => {
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
		Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", {
			value: () => false,
			configurable: true,
		});
		Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
			value: () => {},
			configurable: true,
		});
		Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", {
			value: () => {},
			configurable: true,
		});
		HTMLIFrameElement.prototype.setAttribute = function (
			name: string,
			value: string,
		) {
			if (name.toLowerCase() === "src") {
				const attrs = iframeAttributes.get(this) ?? new Map<string, string>();
				attrs.set("src", value);
				iframeAttributes.set(this, attrs);
				return;
			}
			return originalSetAttribute.call(this, name, value);
		};
		HTMLIFrameElement.prototype.getAttribute = function (name: string) {
			if (name.toLowerCase() === "src") {
				return iframeAttributes.get(this)?.get("src") ?? null;
			}
			return originalGetAttribute.call(this, name);
		};
		writeText.mockClear();
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		HTMLIFrameElement.prototype.setAttribute = originalSetAttribute;
		HTMLIFrameElement.prototype.getAttribute = originalGetAttribute;
	});

	it("updates preview, share url, and copy output when users change controls", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("<html><body></body></html>", {
				status: 200,
				headers: { "content-type": "text/html" },
			}),
		);
		const onStateChange = vi.fn();
		const registerWebComponent = vi.fn();

		render(
			<PlaygroundExperience
				initialState={defaultPlaygroundState}
				embedBaseUrl="https://embed.example.com"
				onStateChange={onStateChange}
				registerWebComponent={registerWebComponent}
			/>,
		);

		expect(registerWebComponent).not.toHaveBeenCalled();

		const previewFrame = screen.getByTitle("Preview") as HTMLIFrameElement;
		expect(previewFrame.getAttribute("src") ?? "").toContain(
			"showAttachments=true",
		);
		expect(previewFrame.getAttribute("src") ?? "").toContain(
			"linkTarget=_blank",
		);

		const baseUrlInput = screen.getByLabelText("Base URL") as HTMLInputElement;
		fireEvent.change(baseUrlInput, {
			target: { value: " https://memos.example.com/api/v1 " },
		});

		const memoIdInput = screen.getByLabelText("Memo ID") as HTMLInputElement;
		fireEvent.change(memoIdInput, {
			target: { value: " 1 " },
		});

		const attachmentsSwitch = screen.getByLabelText("Attachments");
		fireEvent.click(attachmentsSwitch);

		await waitFor(() => {
			const previewSrc = previewFrame.getAttribute("src") ?? "";
			expect(previewSrc).toContain(
				"baseUrl=https%3A%2F%2Fmemos.example.com%2Fapi%2Fv1",
			);
			expect(previewSrc).toContain("/embed/1");
			expect(previewSrc).not.toContain("%20");
			expect(previewSrc).toContain("showAttachments=false");
			expect(previewSrc).toContain("linkTarget=_blank");
		});

		const shareUrlInput = screen.getByLabelText(
			"Share URL",
		) as HTMLInputElement;
		expect(shareUrlInput.value).toContain(
			"baseUrl=https%3A%2F%2Fmemos.example.com%2Fapi%2Fv1",
		);
		expect(shareUrlInput.value).toContain("showAttachments=false");
		expect(shareUrlInput.value).toContain("linkTarget=_blank");

		const iframeCode = screen.getByLabelText(
			"Iframe embed code",
		) as HTMLTextAreaElement;
		expect(iframeCode.value).toContain("showAttachments=false");
		expect(iframeCode.value).toContain("linkTarget=_blank");
		expect(iframeCode.value).toContain("memos-embed:resize");

		fireEvent.click(screen.getByRole("button", { name: "Copy iframe code" }));

		await waitFor(() => {
			expect(writeText).toHaveBeenCalledTimes(1);
			expect(writeText.mock.calls[0]?.[0]).toContain(
				"baseUrl=https%3A%2F%2Fmemos.example.com%2Fapi%2Fv1",
			);
			expect(writeText.mock.calls[0]?.[0]).toContain("/embed/1?");
			expect(writeText.mock.calls[0]?.[0]).not.toContain("%20");
			expect(onStateChange).toHaveBeenLastCalledWith(
				expect.objectContaining({
					baseUrl: " https://memos.example.com/api/v1 ",
					memoId: " 1 ",
					showAttachments: false,
					linkTarget: "_blank",
				}),
			);
		});

		const previewCard = screen
			.getByText("Preview")
			.closest('[data-slot="card"]');
		if (!previewCard) {
			throw new Error("Preview card not found");
		}

		const previewScope = within(previewCard);
		const webComponentPreviewTab = previewScope.getByRole("tab", {
			name: "Web Component",
		});
		fireEvent.mouseDown(webComponentPreviewTab);
		fireEvent.mouseUp(webComponentPreviewTab);
		fireEvent.click(webComponentPreviewTab);

		await waitFor(() => {
			expect(registerWebComponent).toHaveBeenCalledTimes(1);
			expect(webComponentPreviewTab.getAttribute("data-state")).toBe("active");
		});
	});

	it("supports select and tabs interactions for theme, density, link target, and code views", async () => {
		const onStateChange = vi.fn();

		const view = render(
			<PlaygroundExperience
				initialState={defaultPlaygroundState}
				embedBaseUrl="https://embed.example.com"
				onStateChange={onStateChange}
			/>,
		);
		const scoped = within(view.container);

		const themeTrigger = scoped.getByLabelText("Theme");
		fireEvent.keyDown(themeTrigger, { key: "Enter" });
		fireEvent.click(await screen.findByRole("option", { name: "midnight" }));

		const densityTrigger = scoped.getByLabelText("Density");
		fireEvent.keyDown(densityTrigger, { key: "Enter" });
		fireEvent.click(await screen.findByRole("option", { name: "Compact" }));

		const linkTargetTrigger = scoped.getByLabelText("Link target");
		fireEvent.keyDown(linkTargetTrigger, { key: "Enter" });
		fireEvent.click(await screen.findByRole("option", { name: "Same tab" }));

		await waitFor(() => {
			expect(onStateChange).toHaveBeenLastCalledWith(
				expect.objectContaining({
					theme: "midnight",
					density: "compact",
					linkTarget: "_self",
				}),
			);
		});

		const shareUrlInput = scoped.getByLabelText(
			"Share URL",
		) as HTMLInputElement;
		expect(shareUrlInput.value).toContain("theme=midnight");
		expect(shareUrlInput.value).toContain("density=compact");
		expect(shareUrlInput.value).toContain("linkTarget=_self");

		const codeCard = screen
			.getByText("Code Snippets")
			.closest('[data-slot="card"]');
		if (!codeCard) {
			throw new Error("Code snippets card not found");
		}
		const codeScope = within(codeCard);

		const reactTab = codeScope.getByRole("tab", { name: "React" });
		fireEvent.mouseDown(reactTab);
		fireEvent.mouseUp(reactTab);
		fireEvent.click(reactTab);
		await waitFor(() => {
			expect(reactTab.getAttribute("data-state")).toBe("active");
		});

		const reactCode = codeScope.getByLabelText(
			"React embed code",
		) as HTMLTextAreaElement;
		expect(reactCode.value).toContain('theme="midnight"');
		expect(reactCode.value).toContain('density="compact"');
		expect(reactCode.value).toContain('linkTarget="_self"');

		const webComponentTab = codeScope.getByRole("tab", {
			name: "Web Component",
		});
		fireEvent.mouseDown(webComponentTab);
		fireEvent.mouseUp(webComponentTab);
		fireEvent.click(webComponentTab);
		await waitFor(() => {
			expect(webComponentTab.getAttribute("data-state")).toBe("active");
		});

		const wcCode = codeScope.getByLabelText(
			"Web Component embed code",
		) as HTMLTextAreaElement;
		expect(wcCode.value).toContain('theme="midnight"');
		expect(wcCode.value).toContain('density="compact"');
		expect(wcCode.value).toContain('link-target="_self"');
	});
});
