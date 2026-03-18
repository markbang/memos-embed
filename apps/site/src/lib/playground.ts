import {
	buildEmbedUrl,
	type EmbedRenderOptions,
	renderIframeHtml,
	type ThemePresetName,
	themePresets,
} from "memos-embed";

export type PlaygroundState = {
	baseUrl: string;
	memoId: string;
	theme: ThemePresetName;
	density: NonNullable<EmbedRenderOptions["density"]>;
	linkTarget: NonNullable<EmbedRenderOptions["linkTarget"]>;
	showTags: boolean;
	showAttachments: boolean;
	showReactions: boolean;
	showMeta: boolean;
};

export const defaultPlaygroundState: PlaygroundState = {
	baseUrl: "https://demo.usememos.com/api/v1",
	memoId: "1",
	theme: "minimal",
	density: "comfortable",
	linkTarget: "_blank",
	showTags: true,
	showAttachments: true,
	showReactions: true,
	showMeta: true,
};

export const themeNames = Object.keys(themePresets) as ThemePresetName[];

export const isThemePresetName = (value: unknown): value is ThemePresetName =>
	typeof value === "string" && themeNames.includes(value as ThemePresetName);

export const normalizeBooleanSearchValue = (
	value: unknown,
	fallback: boolean,
) => {
	if (typeof value === "boolean") {
		return value;
	}
	if (typeof value === "string") {
		if (value === "true") {
			return true;
		}
		if (value === "false") {
			return false;
		}
	}
	return fallback;
};

export const normalizePlaygroundSearch = (
	search: Record<string, unknown>,
): PlaygroundState => ({
	baseUrl:
		typeof search.baseUrl === "string" && search.baseUrl.trim()
			? search.baseUrl.trim()
			: defaultPlaygroundState.baseUrl,
	memoId:
		typeof search.memoId === "string" && search.memoId.trim()
			? search.memoId.trim()
			: defaultPlaygroundState.memoId,
	theme: isThemePresetName(search.theme)
		? search.theme
		: defaultPlaygroundState.theme,
	density:
		search.density === "compact" || search.density === "comfortable"
			? search.density
			: defaultPlaygroundState.density,
	linkTarget:
		search.linkTarget === "_self" || search.linkTarget === "_blank"
			? search.linkTarget
			: defaultPlaygroundState.linkTarget,
	showTags: normalizeBooleanSearchValue(
		search.showTags,
		defaultPlaygroundState.showTags,
	),
	showAttachments: normalizeBooleanSearchValue(
		search.showAttachments,
		defaultPlaygroundState.showAttachments,
	),
	showReactions: normalizeBooleanSearchValue(
		search.showReactions,
		defaultPlaygroundState.showReactions,
	),
	showMeta: normalizeBooleanSearchValue(
		search.showMeta,
		defaultPlaygroundState.showMeta,
	),
});

const normalizePlaygroundMemoId = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) {
		return trimmed;
	}

	const parts = trimmed.split("/").filter(Boolean);
	return parts[parts.length - 1] ?? trimmed;
};

const normalizePlaygroundStateForOutput = (
	state: PlaygroundState,
): PlaygroundState => ({
	...state,
	baseUrl: state.baseUrl.trim(),
	memoId: normalizePlaygroundMemoId(state.memoId),
});

export const serializePlaygroundState = (state: PlaygroundState) => {
	const normalizedState = normalizePlaygroundStateForOutput(state);

	return {
		baseUrl: normalizedState.baseUrl,
		memoId: normalizedState.memoId,
		theme: normalizedState.theme,
		density: normalizedState.density,
		linkTarget: normalizedState.linkTarget,
		showTags: String(normalizedState.showTags),
		showAttachments: String(normalizedState.showAttachments),
		showReactions: String(normalizedState.showReactions),
		showMeta: String(normalizedState.showMeta),
	};
};

export const buildEmbedPreviewUrl = (
	embedBaseUrl: string,
	state: PlaygroundState,
) => {
	const normalizedState = normalizePlaygroundStateForOutput(state);

	return buildEmbedUrl({
		embedBaseUrl,
		baseUrl: normalizedState.baseUrl,
		memoId: normalizedState.memoId,
		theme: normalizedState.theme,
		density: normalizedState.density,
		linkTarget: normalizedState.linkTarget,
		showTags: normalizedState.showTags,
		showAttachments: normalizedState.showAttachments,
		showReactions: normalizedState.showReactions,
		showMeta: normalizedState.showMeta,
	});
};

export const buildIframeCode = (embedBaseUrl: string, state: PlaygroundState) => {
	const normalizedState = normalizePlaygroundStateForOutput(state);

	return renderIframeHtml({
		embedBaseUrl,
		baseUrl: normalizedState.baseUrl,
		memoId: normalizedState.memoId,
		theme: normalizedState.theme,
		density: normalizedState.density,
		linkTarget: normalizedState.linkTarget,
		showTags: normalizedState.showTags,
		showAttachments: normalizedState.showAttachments,
		showReactions: normalizedState.showReactions,
		showMeta: normalizedState.showMeta,
		height: 240,
		title: "memos-embed",
		autoResize: true,
	});
};

export const buildWebComponentCode = (state: PlaygroundState) => {
	const normalizedState = normalizePlaygroundStateForOutput(state);

	return `<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed
  base-url="${normalizedState.baseUrl}"
  memo-id="${normalizedState.memoId}"
  theme="${normalizedState.theme}"
  density="${normalizedState.density}"
  link-target="${normalizedState.linkTarget}"
  show-tags="${String(normalizedState.showTags)}"
  show-attachments="${String(normalizedState.showAttachments)}"
  show-reactions="${String(normalizedState.showReactions)}"
  show-meta="${String(normalizedState.showMeta)}"
></memos-embed>`;
};

export const buildReactCode = (state: PlaygroundState) => {
	const normalizedState = normalizePlaygroundStateForOutput(state);

	return `import { MemoEmbed } from '@memos-embed/react'

<MemoEmbed
  baseUrl="${normalizedState.baseUrl}"
  memoId="${normalizedState.memoId}"
  theme="${normalizedState.theme}"
  density="${normalizedState.density}"
  linkTarget="${normalizedState.linkTarget}"
  showTags={${String(normalizedState.showTags)}}
  showAttachments={${String(normalizedState.showAttachments)}}
  showReactions={${String(normalizedState.showReactions)}}
  showMeta={${String(normalizedState.showMeta)}}
/>`;
};

export const buildShareUrl = (origin: string, state: PlaygroundState) => {
	const url = new URL(`${origin}/playground`);
	for (const [key, value] of Object.entries(serializePlaygroundState(state))) {
		url.searchParams.set(key, value);
	}
	return url.toString();
};
