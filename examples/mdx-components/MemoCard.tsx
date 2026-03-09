"use client";

import { MemoEmbed } from "@memos-embed/react";
import { extendTheme } from "memos-embed";

const mdxTheme = extendTheme("minimal", {
	fontFamily: "inherit",
	tokens: {
		background: "var(--card)",
		foreground: "var(--card-foreground)",
		border: "var(--border)",
		accent: "var(--primary)",
		accentForeground: "var(--primary-foreground)",
		mutedForeground: "var(--muted-foreground)",
		codeBackground: "var(--muted)",
	},
});

export function MemoCard({ memoId }: { memoId: string }) {
	return (
		<MemoEmbed
			baseUrl="https://demo.usememos.com/api/v1"
			memoId={memoId}
			theme={mdxTheme}
			linkTarget="_blank"
			className="my-8"
		/>
	);
}
