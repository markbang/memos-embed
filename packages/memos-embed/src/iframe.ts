import type { IframeEmbedOptions } from "./types";
import { resolveTheme } from "./theme";

const normalizeBaseUrl = (value: string) => value.replace(/\/$/, "");

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

export const buildEmbedUrl = ({
	embedBaseUrl,
	baseUrl,
	memoId,
	theme,
	density,
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
	url.searchParams.set("baseUrl", baseUrl);
	if (density) {
		url.searchParams.set("density", density);
	}
	const themeName = encodeTheme(theme);
	if (themeName) {
		url.searchParams.set("theme", themeName);
	}

	return url.toString();
};

export const renderIframeHtml = (options: IframeEmbedOptions) => {
	const src = buildEmbedUrl(options);
	const width = options.width ?? "100%";
	const height = options.height ?? 280;
	const title = options.title ?? "Memos Embed";

	return `<iframe src="${src}" title="${title}" width="${width}" height="${height}" loading="lazy" style="border:none;border-radius:16px;width:${width};height:${height}px"></iframe>`;
};
