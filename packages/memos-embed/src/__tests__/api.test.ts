import { describe, expect, it, vi } from "vitest";
import { fetchMemo, fetchMemoHtmlSnippet } from "../api";

describe("fetchMemo", () => {
	it("throws when baseUrl is missing", async () => {
		await expect(fetchMemo({ baseUrl: "", memoId: "1" })).rejects.toThrow(
			"baseUrl is required",
		);
	});

	it("throws when memoId is missing", async () => {
		await expect(
			fetchMemo({ baseUrl: "https://demo.usememos.com/api/v1", memoId: "" }),
		).rejects.toThrow("memoId is required");
	});

	it("normalizes memo response", async () => {
		const response = {
			ok: true,
			json: async () => ({
				name: "memos/123",
				content: "Hello",
				tags: ["note"],
			}),
		} as Response;

		const memo = await fetchMemo({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "123",
			fetcher: async () => response,
			includeCreator: false,
		});

		expect(memo.id).toBe("123");
		expect(memo.content).toBe("Hello");
		expect(memo.tags).toEqual(["note"]);
	});

	it("normalizes attachment urls against the instance origin", async () => {
		const memo = await fetchMemo({
			baseUrl: "https://demo.usememos.com",
			memoId: "123",
			includeCreator: false,
			fetcher: async () =>
				({
					ok: true,
					json: async () => ({
						name: "memos/123",
						content: "Hello",
						tags: [],
						attachments: [
							{
								name: "attachments/1",
								filename: "cover.png",
								content: "/file/cover.png",
							},
						],
					}),
				} as Response),
		});

		expect(memo.attachments[0]?.content).toBe(
			"https://demo.usememos.com/file/cover.png",
		);
	});

	it("resolves creator details", async () => {
		const fetcher = vi.fn(async (url: RequestInfo | URL) => {
			const href = String(url);
			if (href.includes("/memos/123")) {
				return {
					ok: true,
					json: async () => ({
						name: "memos/123",
						creator: "users/1",
						content: "Hello",
						tags: [],
					}),
				} as Response;
			}
			return {
				ok: true,
				json: async () => ({
					name: "users/1",
					username: "bangwu",
					displayName: "棒无",
					avatarUrl: "/api/v1/users/1/avatar",
				}),
			} as Response;
		});

		const memo = await fetchMemo({
			baseUrl: "https://demo.usememos.com",
			memoId: "123",
			fetcher,
		});

		expect(memo.creator).toBe("bangwu");
		expect(memo.creatorUsername).toBe("bangwu");
		expect(memo.creatorDisplayName).toBe("棒无");
		expect(memo.creatorAvatarUrl).toBe(
			"https://demo.usememos.com/api/v1/users/1/avatar",
		);
	});

	it("uses api/v1 when baseUrl is instance root", async () => {
		const response = {
			ok: true,
			json: async () => ({
				name: "memos/123",
				content: "Hello",
				tags: [],
			}),
		} as Response;
		const fetcher = vi.fn(async () => response);

		await fetchMemo({
			baseUrl: "https://demo.usememos.com",
			memoId: "123",
			fetcher,
		});

		expect(fetcher).toHaveBeenCalled();
		const calls = fetcher.mock.calls as Array<unknown[]>;
		const firstCall = calls[0];
		const url = firstCall ? String(firstCall[0]) : "";
		expect(url).toContain("https://demo.usememos.com/api/v1/memos/123");
	});
});

describe("fetchMemoHtmlSnippet", () => {
	it("returns a rendered html snippet", async () => {
		const html = await fetchMemoHtmlSnippet({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "123",
			fetcher: async () =>
				({
					ok: true,
					json: async () => ({
						name: "memos/123",
						content: "Hello",
						tags: [],
					}),
				} as Response),
			includeCreator: false,
			includeStyles: false,
		});

		expect(html).toContain("memos-embed");
		expect(html).not.toContain("<style>");
		expect(html).toContain("<p>Hello</p>");
	});

	it("rethrows fetch errors", async () => {
		await expect(
			fetchMemoHtmlSnippet({
				baseUrl: "https://demo.usememos.com/api/v1",
				memoId: "123",
				fetcher: async () =>
					({
						ok: false,
						status: 500,
					} as Response),
			}),
		).rejects.toThrow("Failed to fetch memo (500)");
	});
});
