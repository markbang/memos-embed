import {
	MEMOS_EMBED_MEASURE_MESSAGE_TYPE,
	MEMOS_EMBED_RESIZE_MESSAGE_TYPE,
} from "memos-embed";

export const measureEmbedHeight = (
	container: HTMLElement,
	currentDocument: Document = document,
) =>
	Math.max(
		Math.ceil(container.getBoundingClientRect().height),
		currentDocument.documentElement.scrollHeight,
		currentDocument.body.scrollHeight,
	);

export const createEmbedResizeMessage = (frameId: string, height: number) => ({
	type: MEMOS_EMBED_RESIZE_MESSAGE_TYPE,
	frameId,
	height,
});

export const isEmbedMeasureRequest = (
	data: unknown,
	frameId: string,
): data is { type: string; frameId?: string } => {
	if (!data || typeof data !== "object") {
		return false;
	}

	const message = data as { type?: string; frameId?: string };
	if (message.type !== MEMOS_EMBED_MEASURE_MESSAGE_TYPE) {
		return false;
	}

	return !message.frameId || message.frameId === frameId;
};

export const bindEmbedAutoResize = ({
	frameId,
	container,
	currentWindow = window,
	currentDocument = document,
	parentWindow = window.parent,
	ResizeObserverCtor = typeof ResizeObserver === "undefined"
		? undefined
		: ResizeObserver,
}: {
	frameId: string;
	container: HTMLElement;
	currentWindow?: Window & typeof globalThis;
	currentDocument?: Document;
	parentWindow?: Pick<Window, "postMessage">;
	ResizeObserverCtor?: typeof ResizeObserver | undefined;
}) => {
	const postHeight = () => {
		parentWindow.postMessage(
			createEmbedResizeMessage(
				frameId,
				measureEmbedHeight(container, currentDocument),
			),
			"*",
		);
	};

	const resizeObserver = ResizeObserverCtor
		? new ResizeObserverCtor(() => {
				postHeight();
			})
		: undefined;
	resizeObserver?.observe(container);

	const rafId = currentWindow.requestAnimationFrame(postHeight);
	const timeoutId = currentWindow.setTimeout(postHeight, 120);
	const onMessage = (event: MessageEvent<unknown>) => {
		if (!isEmbedMeasureRequest(event.data, frameId)) {
			return;
		}
		postHeight();
	};

	currentWindow.addEventListener("message", onMessage);
	currentWindow.addEventListener("load", postHeight);

	return () => {
		currentWindow.cancelAnimationFrame(rafId);
		currentWindow.clearTimeout(timeoutId);
		currentWindow.removeEventListener("message", onMessage);
		currentWindow.removeEventListener("load", postHeight);
		resizeObserver?.disconnect();
	};
};
