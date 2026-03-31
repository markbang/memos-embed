import type { EmbedRenderOptions, ThemePresetName } from "memos-embed";

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

const themeNames: ThemePresetName[] = [
	"minimal",
	"glass",
	"paper",
	"midnight",
	"terminal",
];

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

const normalizePlaygroundStateForOutput = (
	state: PlaygroundState,
): PlaygroundState => ({
	...state,
	baseUrl: state.baseUrl.trim(),
	memoId: state.memoId.trim(),
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

export const trimPlaygroundState = (state: PlaygroundState): PlaygroundState =>
	normalizePlaygroundStateForOutput(state);
