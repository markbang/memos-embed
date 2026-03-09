"use client";

import { MemoEmbed } from "@memos-embed/react";
import { extendTheme, type Memo } from "memos-embed";

const blogTheme = extendTheme("paper", {
	fontFamily: "inherit",
	radius: "var(--radius)",
	tokens: {
		background: "var(--card)",
		foreground: "var(--card-foreground)",
		mutedForeground: "var(--muted-foreground)",
		border: "var(--border)",
		accent: "var(--primary)",
		accentForeground: "var(--primary-foreground)",
		codeBackground: "var(--muted)",
	},
});

export function MemoEmbedCard({ memo }: { memo: Memo }) {
	return (
		<MemoEmbed
			memo={memo}
			theme={blogTheme}
			density="comfortable"
			linkTarget="_blank"
			className="my-10"
		/>
	);
}
