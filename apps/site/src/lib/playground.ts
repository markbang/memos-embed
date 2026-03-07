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
			? search.baseUrl
			: defaultPlaygroundState.baseUrl,
	memoId:
		typeof search.memoId === "string" && search.memoId.trim()
			? search.memoId
			: defaultPlaygroundState.memoId,
	theme: isThemePresetName(search.theme)
		? search.theme
		: defaultPlaygroundState.theme,
	density:
		search.density === "compact" || search.density === "comfortable"
			? search.density
			: defaultPlaygroundState.density,
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

export const serializePlaygroundState = (state: PlaygroundState) => ({
	baseUrl: state.baseUrl,
	memoId: state.memoId,
	theme: state.theme,
	density: state.density,
	showTags: String(state.showTags),
	showAttachments: String(state.showAttachments),
	showReactions: String(state.showReactions),
	showMeta: String(state.showMeta),
});

export const buildEmbedPreviewUrl = (
	embedBaseUrl: string,
	state: PlaygroundState,
) =>
	buildEmbedUrl({
		embedBaseUrl,
		baseUrl: state.baseUrl,
		memoId: state.memoId,
		theme: state.theme,
		density: state.density,
		showTags: state.showTags,
		showAttachments: state.showAttachments,
		showReactions: state.showReactions,
		showMeta: state.showMeta,
	});

export const buildIframeCode = (embedBaseUrl: string, state: PlaygroundState) =>
	renderIframeHtml({
		embedBaseUrl,
		baseUrl: state.baseUrl,
		memoId: state.memoId,
		theme: state.theme,
		density: state.density,
		showTags: state.showTags,
		showAttachments: state.showAttachments,
		showReactions: state.showReactions,
		showMeta: state.showMeta,
		height: 240,
		title: "memos-embed",
		autoResize: true,
	});

export const buildWebComponentCode = (
	state: PlaygroundState,
) => `<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed
  base-url="${state.baseUrl}"
  memo-id="${state.memoId}"
  theme="${state.theme}"
  density="${state.density}"
  show-tags="${String(state.showTags)}"
  show-attachments="${String(state.showAttachments)}"
  show-reactions="${String(state.showReactions)}"
  show-meta="${String(state.showMeta)}"
></memos-embed>`;

export const buildReactCode = (
	state: PlaygroundState,
) => `import { MemoEmbed } from '@memos-embed/react'

<MemoEmbed
  baseUrl="${state.baseUrl}"
  memoId="${state.memoId}"
  theme="${state.theme}"
  density="${state.density}"
  showTags={${String(state.showTags)}}
  showAttachments={${String(state.showAttachments)}}
  showReactions={${String(state.showReactions)}}
  showMeta={${String(state.showMeta)}}
/>`;

export const buildShareUrl = (origin: string, state: PlaygroundState) => {
	const url = new URL(`${origin}/playground`);
	for (const [key, value] of Object.entries(serializePlaygroundState(state))) {
		url.searchParams.set(key, value);
	}
	return url.toString();
};
