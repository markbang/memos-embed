import { MEMOS_EMBED_MEASURE_MESSAGE_TYPE } from "memos-embed";
import { describe, expect, it, vi } from "vitest";
import {
	bindEmbedAutoResize,
	createEmbedResizeMessage,
	isEmbedMeasureRequest,
	measureEmbedHeight,
} from "@/lib/embed-resize";

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
	}) as DOMRect;

describe("embed resize helpers", () => {
	it("measures the tallest available embed height", () => {
		const container = document.createElement("div");
		vi.spyOn(container, "getBoundingClientRect").mockReturnValue(
			createDomRect(180),
		);
		Object.defineProperty(document.documentElement, "scrollHeight", {
			value: 240,
			configurable: true,
		});
		Object.defineProperty(document.body, "scrollHeight", {
			value: 200,
			configurable: true,
		});

		expect(measureEmbedHeight(container, document)).toBe(240);
	});

	it("recognizes valid measure requests and creates resize payloads", () => {
		expect(
			isEmbedMeasureRequest(
				{ type: MEMOS_EMBED_MEASURE_MESSAGE_TYPE, frameId: "frame-1" },
				"frame-1",
			),
		).toBe(true);
		expect(
			isEmbedMeasureRequest(
				{ type: MEMOS_EMBED_MEASURE_MESSAGE_TYPE, frameId: "frame-2" },
				"frame-1",
			),
		).toBe(false);
		expect(createEmbedResizeMessage("frame-1", 320)).toEqual({
			type: "memos-embed:resize",
			frameId: "frame-1",
			height: 320,
		});
	});

	it("binds resize observers and responds to measurement requests", () => {
		const parentWindow = { postMessage: vi.fn() };
		const container = document.createElement("div");
		vi.spyOn(container, "getBoundingClientRect").mockReturnValue(
			createDomRect(190),
		);
		Object.defineProperty(document.documentElement, "scrollHeight", {
			value: 210,
			configurable: true,
		});
		Object.defineProperty(document.body, "scrollHeight", {
			value: 160,
			configurable: true,
		});

		const observe = vi.fn();
		const disconnect = vi.fn();
		let observerCallback: (() => void) | undefined;
		class ResizeObserverMock {
			constructor(callback: () => void) {
				observerCallback = callback;
			}
			observe = observe;
			disconnect = disconnect;
		}

		const rafSpy = vi
			.spyOn(window, "requestAnimationFrame")
			.mockImplementation((callback: FrameRequestCallback) => {
				callback(0);
				return 1;
			});
		const cancelSpy = vi
			.spyOn(window, "cancelAnimationFrame")
			.mockImplementation(() => {});

		const cleanup = bindEmbedAutoResize({
			frameId: "frame-1",
			container,
			currentWindow: window,
			currentDocument: document,
			parentWindow: parentWindow as never,
			ResizeObserverCtor: ResizeObserverMock as never,
		});

		expect(observe).toHaveBeenCalledWith(container);
		expect(parentWindow.postMessage).toHaveBeenCalledWith(
			{ type: "memos-embed:resize", frameId: "frame-1", height: 210 },
			"*",
		);

		const callCount = parentWindow.postMessage.mock.calls.length;
		window.dispatchEvent(
			new MessageEvent("message", {
				data: { type: MEMOS_EMBED_MEASURE_MESSAGE_TYPE, frameId: "other" },
			}),
		);
		expect(parentWindow.postMessage).toHaveBeenCalledTimes(callCount);

		window.dispatchEvent(
			new MessageEvent("message", {
				data: { type: MEMOS_EMBED_MEASURE_MESSAGE_TYPE, frameId: "frame-1" },
			}),
		);
		expect(parentWindow.postMessage).toHaveBeenCalledTimes(callCount + 1);

		observerCallback?.();
		expect(parentWindow.postMessage).toHaveBeenCalledTimes(callCount + 2);

		cleanup();
		expect(disconnect).toHaveBeenCalled();
		expect(cancelSpy).toHaveBeenCalledWith(1);

		rafSpy.mockRestore();
		cancelSpy.mockRestore();
	});
});
