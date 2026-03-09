import { extendTheme, renderMemoListHtmlSnippet, type Memo } from "memos-embed";

const roundupTheme = extendTheme("paper", {
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

export function MemoRoundupHtml({ memos }: { memos: Memo[] }) {
	const html = renderMemoListHtmlSnippet(memos, {
		layout: "stack",
		gap: "20px",
		theme: roundupTheme,
		linkTarget: "_blank",
	});

	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
