import { describe, expect, it } from "vitest";
import {
	renderMemoHtml,
	renderMemoHtmlSnippet,
	renderMemoStateHtmlSnippet,
} from "../render";
import type { Memo } from "../types";

const memo: Memo = {
	id: "1",
	name: "memos/1",
	creatorDisplayName: "棒无",
	creatorUsername: "bangwu",
	content: `# Hello

[Docs](https://example.com)

- one
- [x] done
- [ ] todo

\`\`\`ts
const answer = 42;
\`\`\``,
	tags: ["note"],
	attachments: [
		{
			name: "cover",
			filename: "cover.png",
			content: "https://example.com/cover.png",
			type: "image/png",
			size: "18 KB",
		},
	],
	reactions: [
		{ name: "reactions/1", reactionType: "👍" },
		{ name: "reactions/2", reactionType: "👍" },
		{ name: "reactions/3", reactionType: "🔥" },
	],
};

describe("renderMemoHtml", () => {
	it("renders advanced markdown, grouped reactions, and image attachments", () => {
		const html = renderMemoHtml(memo, {
			theme: "minimal",
			linkTarget: "_self",
		});

		expect(html).toContain("memos-embed");
		expect(html).toContain("<h1>Hello</h1>");
		expect(html).toContain('<a href="https://example.com" target="_self">Docs</a>');
		expect(html).toContain("<ul data-task-list=\"true\">");
		expect(html).toContain('class="memos-embed__task-item"');
		expect(html).toContain('data-language="ts"');
		expect(html).toContain("棒无");
		expect(html).toContain("@bangwu");
		expect(html).toContain("memos-embed__attachment-preview");
		expect(html).toContain("18 KB");
		expect(html).toContain('memos-embed__reaction-count">2</span>');
	});
});

describe("renderMemoHtmlSnippet", () => {
	it("includes styles by default", () => {
		const html = renderMemoHtmlSnippet(memo);

		expect(html).toContain("<style>");
		expect(html).toContain("memos-embed__task-checkbox");
		expect(html).toContain("pre[data-language]::before");
	});

	it("can omit styles", () => {
		const html = renderMemoHtmlSnippet(memo, { includeStyles: false });

		expect(html).not.toContain("<style>");
		expect(html).toContain("memos-embed");
	});
});

describe("renderMemoStateHtmlSnippet", () => {
	it("renders state markup with shared class", () => {
		const html = renderMemoStateHtmlSnippet("Loading memo…");

		expect(html).toContain("<style>");
		expect(html).toContain(
			'<div class="memos-embed__state">Loading memo…</div>',
		);
	});
});
