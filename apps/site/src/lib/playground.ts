import {
	buildEmbedUrl,
	renderIframeHtml,
	type ThemePresetName,
	themePresets,
} from "memos-embed";
import {
	type PlaygroundState,
	serializePlaygroundState,
	trimPlaygroundState,
} from "./playground-state";

export type { PlaygroundState } from "./playground-state";
export {
	defaultPlaygroundState,
	normalizePlaygroundSearch,
	serializePlaygroundState,
} from "./playground-state";

export const buildEmbedPreviewUrl = (
	embedBaseUrl: string,
	state: PlaygroundState,
) => {
	const normalizedState = trimPlaygroundState(state);

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

export const buildIframeCode = (
	embedBaseUrl: string,
	state: PlaygroundState,
) => {
	const normalizedState = trimPlaygroundState(state);

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
	const normalizedState = trimPlaygroundState(state);

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
	const normalizedState = trimPlaygroundState(state);

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

export const themeNames = Object.keys(themePresets) as ThemePresetName[];
