import { MemoEmbed } from "@memos-embed/react";
import type { PlaygroundState } from "@/lib/playground";

export function PlaygroundReactPreview({ state }: { state: PlaygroundState }) {
	return (
		<MemoEmbed
			baseUrl={state.baseUrl}
			memoId={state.memoId}
			theme={state.theme}
			density={state.density}
			linkTarget={state.linkTarget}
			showTags={state.showTags}
			showAttachments={state.showAttachments}
			showReactions={state.showReactions}
			showMeta={state.showMeta}
		/>
	);
}
