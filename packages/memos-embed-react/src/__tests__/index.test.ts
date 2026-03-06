import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import * as memosEmbed from "memos-embed";
import { MemoEmbed } from "../index";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("MemoEmbed", () => {
	it("exports a component", () => {
		expect(typeof MemoEmbed).toBe("function");
	});

	it("renders loaded content through core snippet helper", async () => {
		const fetchMemoSpy = vi
			.spyOn(memosEmbed, "fetchMemo")
			.mockResolvedValue({
				id: "1",
				name: "memos/1",
				content: "Hello",
				tags: [],
				attachments: [],
				reactions: [],
			});
		const renderSnippetSpy = vi.spyOn(memosEmbed, "renderMemoHtmlSnippet");
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);

		await act(async () => {
			root.render(
				createElement(MemoEmbed, {
					baseUrl: "https://demo.usememos.com",
					memoId: "1",
				}),
			);
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(fetchMemoSpy).toHaveBeenCalledWith({
			baseUrl: "https://demo.usememos.com",
			memoId: "1",
		});
		expect(renderSnippetSpy).toHaveBeenCalled();
		expect(container.innerHTML).toContain("Hello");
		expect(container.textContent).not.toContain("Loading memo…");

		await act(async () => {
			root.unmount();
		});
		container.remove();
		fetchMemoSpy.mockRestore();
		renderSnippetSpy.mockRestore();
	});
});
