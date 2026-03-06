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
	content: "Hello **world**",
	tags: [],
	attachments: [],
	reactions: [],
};

describe("renderMemoHtml", () => {
	it("renders memo content with container class", () => {
		const html = renderMemoHtml(memo, { theme: "minimal" });

		expect(html).toContain("memos-embed");
		expect(html).toContain("<strong>world</strong>");
	});
});

describe("renderMemoHtmlSnippet", () => {
	it("includes styles by default", () => {
		const html = renderMemoHtmlSnippet(memo);

		expect(html).toContain("<style>");
		expect(html).toContain("memos-embed__content");
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
		expect(html).toContain('<div class="memos-embed__state">Loading memo…</div>');
	});
});
