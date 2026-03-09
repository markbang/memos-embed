import { describe, expect, it, vi } from "vitest";
import * as memosEmbed from "memos-embed";
import { defineMemosEmbedElement } from "../index";

describe("defineMemosEmbedElement", () => {
	it("registers custom element", () => {
		defineMemosEmbedElement();
		expect(customElements.get("memos-embed")).toBeTruthy();
	});

	it("renders through core snippet helpers", async () => {
		defineMemosEmbedElement();
		const fetchMemoSpy = vi.spyOn(memosEmbed, "fetchMemo").mockResolvedValue({
			id: "1",
			name: "memos/1",
			content: "Hello",
			tags: [],
			attachments: [],
			reactions: [],
		});
		const renderStateSpy = vi.spyOn(memosEmbed, "renderMemoStateHtmlSnippet");
		const renderSnippetSpy = vi.spyOn(memosEmbed, "renderMemoHtmlSnippet");

		const element = document.createElement("memos-embed");
		element.setAttribute("memo-id", "1");
		element.setAttribute("base-url", "https://demo.usememos.com");
		element.setAttribute("link-target", "_blank");
		document.body.appendChild(element);

		await Promise.resolve();
		await Promise.resolve();

		expect(renderStateSpy).toHaveBeenCalledWith("Loading memo…");
		expect(fetchMemoSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				baseUrl: "https://demo.usememos.com",
				memoId: "1",
				signal: expect.any(AbortSignal),
			}),
		);
		expect(renderSnippetSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				content: "Hello",
			}),
			expect.objectContaining({
				linkTarget: "_blank",
			}),
		);
		expect(element.shadowRoot?.innerHTML).toContain("Hello");

		element.remove();
		fetchMemoSpy.mockRestore();
		renderStateSpy.mockRestore();
		renderSnippetSpy.mockRestore();
	});
});
