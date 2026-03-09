import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import * as memosEmbed from "memos-embed";
import {
	MemoClientProvider,
	MemoEmbed,
	MemoEmbedList,
	useMemoClient,
} from "../index";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("@memos-embed/react", () => {
	it("exports components and hooks", () => {
		expect(typeof MemoEmbed).toBe("function");
		expect(typeof MemoEmbedList).toBe("function");
		expect(typeof MemoClientProvider).toBe("function");
		expect(typeof useMemoClient).toBe("function");
	});

	it("renders single loaded content through core snippet helper", async () => {
		const customFetcher = vi.fn<typeof fetch>();
		const fetchMemoSpy = vi.spyOn(memosEmbed, "fetchMemo").mockResolvedValue({
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
					includeCreator: false,
					fetcher: customFetcher,
					linkTarget: "_blank",
					className: "memo-wrapper",
				}),
			);
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(fetchMemoSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				baseUrl: "https://demo.usememos.com",
				memoId: "1",
				includeCreator: false,
				fetcher: customFetcher,
				signal: expect.any(AbortSignal),
			}),
		);
		expect(renderSnippetSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				content: "Hello",
			}),
			expect.objectContaining({
				includeStyles: true,
				linkTarget: "_blank",
			}),
		);
		expect(container.querySelector(".memo-wrapper")).toBeTruthy();
		expect(container.innerHTML).toContain("Hello");
		expect(container.textContent).not.toContain("Loading memo…");

		await act(async () => {
			root.unmount();
		});
		container.remove();
		fetchMemoSpy.mockRestore();
		renderSnippetSpy.mockRestore();
	});

	it("can render a provided memo without fetching and without built-in styles", async () => {
		const memo = {
			id: "99",
			name: "memos/99",
			content: "Prefetched",
			tags: [],
			attachments: [],
			reactions: [],
		};
		const fetchMemoSpy = vi.spyOn(memosEmbed, "fetchMemo");
		const renderSnippetSpy = vi.spyOn(memosEmbed, "renderMemoHtmlSnippet");
		const onLoad = vi.fn();
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);

		await act(async () => {
			root.render(
				createElement(MemoEmbed, {
					memo,
					includeStyles: false,
					onLoad,
				}),
			);
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(fetchMemoSpy).not.toHaveBeenCalled();
		expect(renderSnippetSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				content: "Prefetched",
			}),
			expect.objectContaining({
				includeStyles: false,
			}),
		);
		expect(onLoad).toHaveBeenCalledWith(memo);
		expect(container.innerHTML).toContain("Prefetched");
		expect(container.innerHTML).not.toContain("<style>");

		await act(async () => {
			root.unmount();
		});
		container.remove();
		fetchMemoSpy.mockRestore();
		renderSnippetSpy.mockRestore();
	});

	it("renders memo roundups through shared list helpers", async () => {
		const customFetcher = vi.fn<typeof fetch>();
		const memos = [
			{
				id: "1",
				name: "memos/1",
				content: "One",
				tags: [],
				attachments: [],
				reactions: [],
			},
			{
				id: "2",
				name: "memos/2",
				content: "Two",
				tags: [],
				attachments: [],
				reactions: [],
			},
		];
		const fetchMemosSpy = vi
			.spyOn(memosEmbed, "fetchMemos")
			.mockResolvedValue(memos);
		const renderListSpy = vi.spyOn(memosEmbed, "renderMemoListHtmlSnippet");
		const onLoad = vi.fn();
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);

		await act(async () => {
			root.render(
				createElement(MemoEmbedList, {
					baseUrl: "https://demo.usememos.com",
					memoIds: ["1", "2"],
					includeCreator: false,
					fetcher: customFetcher,
					layout: "grid",
					gap: "20px",
					className: "memo-list",
					onLoad,
				}),
			);
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(fetchMemosSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				baseUrl: "https://demo.usememos.com",
				memoIds: ["1", "2"],
				includeCreator: false,
				fetcher: customFetcher,
				signal: expect.any(AbortSignal),
			}),
		);
		expect(renderListSpy).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({ content: "One" }),
				expect.objectContaining({ content: "Two" }),
			]),
			expect.objectContaining({
				includeStyles: true,
				layout: "grid",
				gap: "20px",
			}),
		);
		expect(onLoad).toHaveBeenCalledWith(memos);
		expect(container.querySelector(".memo-list")).toBeTruthy();
		expect(container.innerHTML).toContain("memos-embed-list--grid");
		expect(container.innerHTML).toContain("One");
		expect(container.innerHTML).toContain("Two");

		await act(async () => {
			root.unmount();
		});
		container.remove();
		fetchMemosSpy.mockRestore();
		renderListSpy.mockRestore();
	});

	it("can use a shared memo client from provider and prime prefetched data", async () => {
		const memo = {
			id: "1",
			name: "memos/1",
			content: "Shared",
			tags: [],
			attachments: [],
			reactions: [],
		};
		const memos = [memo, { ...memo, id: "2", name: "memos/2", content: "More" }];
		const client = {
			fetchMemo: vi.fn(async () => memo),
			fetchMemos: vi.fn(async () => memos),
			primeMemo: vi.fn(),
			primeMemos: vi.fn(),
			clear: vi.fn(),
		};
		const coreFetchMemoSpy = vi.spyOn(memosEmbed, "fetchMemo");
		const coreFetchMemosSpy = vi.spyOn(memosEmbed, "fetchMemos");
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);

		await act(async () => {
			root.render(
				createElement(
					MemoClientProvider,
					{ client },
					createElement("div", null, [
						createElement(MemoEmbed, {
							key: "single",
							baseUrl: "https://demo.usememos.com/api/v1",
							memo,
						}),
						createElement(MemoEmbedList, {
							key: "list",
							baseUrl: "https://demo.usememos.com/api/v1",
							memoIds: ["1", "2"],
							className: "provider-list",
						}),
					]),
				),
			);
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(client.primeMemo).toHaveBeenCalledWith(
			expect.objectContaining({
				baseUrl: "https://demo.usememos.com/api/v1",
				memo: expect.objectContaining({ content: "Shared" }),
			}),
		);
		expect(client.fetchMemos).toHaveBeenCalledWith(
			expect.objectContaining({
				baseUrl: "https://demo.usememos.com/api/v1",
				memoIds: ["1", "2"],
			}),
		);
		expect(coreFetchMemoSpy).not.toHaveBeenCalled();
		expect(coreFetchMemosSpy).not.toHaveBeenCalled();
		expect(container.querySelector(".provider-list")).toBeTruthy();
		expect(container.innerHTML).toContain("More");

		await act(async () => {
			root.unmount();
		});
		container.remove();
		coreFetchMemoSpy.mockRestore();
		coreFetchMemosSpy.mockRestore();
	});
});
