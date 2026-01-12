import { describe, expect, it } from "vitest";
import { renderMemoHtml } from "../render";
import type { Memo } from "../types";

describe("renderMemoHtml", () => {
	it("renders memo content with container class", () => {
		const memo: Memo = {
			id: "1",
			name: "memos/1",
			content: "Hello **world**",
			tags: [],
			attachments: [],
			reactions: [],
		};

		const html = renderMemoHtml(memo, { theme: "minimal" });

		expect(html).toContain("memos-embed");
		expect(html).toContain("<strong>world</strong>");
	});
});
