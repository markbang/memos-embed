import { escapeHtml } from "./html";
import { resolveTheme } from "./theme";
import type { IframeEmbedOptions } from "./types";

const normalizeBaseUrl = (value: string) => value.replace(/\/$/, "");
const frameIdPrefix = "memos-embed-frame";

export const MEMOS_EMBED_MEASURE_MESSAGE_TYPE = "memos-embed:measure";
export const MEMOS_EMBED_RESIZE_MESSAGE_TYPE = "memos-embed:resize";

const encodeTheme = (theme?: IframeEmbedOptions["theme"]) => {
	if (!theme) {
		return "";
	}
	if (typeof theme === "string") {
		return theme;
	}

	const resolved = resolveTheme(theme);
	return resolved.name;
};

const formatDimension = (value: number | string | undefined, fallback: string) => {
	if (value === undefined || value === null || value === "") {
		return fallback;
	}
	return typeof value === "number" ? `${value}px` : value;
};

const formatAttributeDimension = (
	value: number | string | undefined,
	fallback: string,
) => {
	if (value === undefined || value === null || value === "") {
		return fallback;
	}
	return typeof value === "number" ? String(value) : value;
};

const createFrameId = () =>
	`${frameIdPrefix}-${Math.random().toString(36).slice(2, 10)}`;

const normalizeFrameId = (value?: string) => {
	if (!value) {
		return createFrameId();
	}

	const sanitized = value.trim().replace(/[^a-zA-Z0-9_-]/g, "-");
	return sanitized || createFrameId();
};

const serializeScriptValue = (value: string) =>
	JSON.stringify(value).replace(/<\//g, "<\\/");

export const buildEmbedUrl = ({
	embedBaseUrl,
	baseUrl,
	memoId,
	theme,
	density,
	showTags,
	showAttachments,
	showReactions,
	showMeta,
	linkTarget,
	frameId,
}: IframeEmbedOptions) => {
	if (!embedBaseUrl) {
		throw new Error("embedBaseUrl is required");
	}
	if (!baseUrl) {
		throw new Error("baseUrl is required");
	}
	if (!memoId) {
		throw new Error("memoId is required");
	}

	const url = new URL(`${normalizeBaseUrl(embedBaseUrl)}/embed/${memoId}`);
	url.searchParams.set("baseUrl", normalizeBaseUrl(baseUrl));
	if (density) {
		url.searchParams.set("density", density);
	}
	const themeName = encodeTheme(theme);
	if (themeName) {
		url.searchParams.set("theme", themeName);
	}
	if (typeof showTags === "boolean") {
		url.searchParams.set("showTags", String(showTags));
	}
	if (typeof showAttachments === "boolean") {
		url.searchParams.set("showAttachments", String(showAttachments));
	}
	if (typeof showReactions === "boolean") {
		url.searchParams.set("showReactions", String(showReactions));
	}
	if (typeof showMeta === "boolean") {
		url.searchParams.set("showMeta", String(showMeta));
	}
	if (linkTarget) {
		url.searchParams.set("linkTarget", linkTarget);
	}
	if (frameId) {
		url.searchParams.set("frameId", frameId);
	}

	return url.toString();
};

export const buildIframeResizeScript = ({
	frameId,
	src,
}: {
	frameId: string;
	src: string;
}) => {
	const origin = new URL(src).origin;
	const frameIdValue = serializeScriptValue(frameId);
	const originValue = serializeScriptValue(origin);
	const resizeType = serializeScriptValue(MEMOS_EMBED_RESIZE_MESSAGE_TYPE);
	const measureType = serializeScriptValue(MEMOS_EMBED_MEASURE_MESSAGE_TYPE);

	return `<script>(function(){var iframe=document.getElementById(${frameIdValue});if(!iframe){return;}var expectedOrigin=${originValue};var applyHeight=function(value){var height=Number(value);if(!Number.isFinite(height)||height<=0){return;}var nextHeight=Math.ceil(height)+"px";iframe.style.height=nextHeight;iframe.height=String(Math.ceil(height));};var onMessage=function(event){var data=event.data;if(!data||data.type!==${resizeType}||data.frameId!==${frameIdValue}){return;}if(event.origin!==expectedOrigin){return;}if(iframe.contentWindow&&event.source!==iframe.contentWindow){return;}applyHeight(data.height);};window.addEventListener("message",onMessage);iframe.addEventListener("load",function(){if(!iframe.contentWindow){return;}iframe.contentWindow.postMessage({type:${measureType},frameId:${frameIdValue}},expectedOrigin);});})();</script>`;
};

export const renderIframeHtml = (options: IframeEmbedOptions) => {
	const autoResize = options.autoResize ?? false;
	const frameId = autoResize ? normalizeFrameId(options.frameId) : options.frameId;
	const src = buildEmbedUrl({
		...options,
		frameId,
	});
	const width = formatDimension(options.width, "100%");
	const height = formatDimension(options.height, "280px");
	const widthAttr = formatAttributeDimension(options.width, "100%");
	const heightAttr = formatAttributeDimension(options.height, "280");
	const title = options.title ?? "Memos Embed";
	const loading = options.loading ?? "lazy";
	const id = frameId ? ` id="${escapeHtml(frameId)}"` : "";
	const className = options.className
		? ` class="${escapeHtml(options.className)}"`
		: "";
	const allow = options.allow ? ` allow="${escapeHtml(options.allow)}"` : "";
	const referrerPolicy = options.referrerPolicy
		? ` referrerpolicy="${escapeHtml(options.referrerPolicy)}"`
		: "";
	const sandbox = options.sandbox
		? ` sandbox="${escapeHtml(options.sandbox)}"`
		: "";

	const iframe = `<iframe${id}${className} src="${escapeHtml(src)}" title="${escapeHtml(title)}" width="${escapeHtml(widthAttr)}" height="${escapeHtml(heightAttr)}" loading="${escapeHtml(loading)}" style="border:none;border-radius:16px;width:${escapeHtml(width)};height:${escapeHtml(height)}"${allow}${referrerPolicy}${sandbox}></iframe>`;

	if (!autoResize || !frameId) {
		return iframe;
	}

	return `${iframe}${buildIframeResizeScript({ frameId, src })}`;
};
