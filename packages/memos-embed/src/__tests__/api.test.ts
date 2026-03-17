import { describe, expect, it, vi } from "vitest";
import {
	createMemoClient,
	fetchMemo,
	fetchMemoHtmlSnippet,
	fetchMemoListHtmlSnippet,
	fetchMemos,
} from "../api";

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

	it.each([
		"https://demo.usememos.com",
		"https://demo.usememos.com/api",
	])("normalizes %s to the api/v1 memo endpoint", async (baseUrl) => {
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
			baseUrl,
			memoId: "123",
			fetcher,
		});

		expect(fetcher).toHaveBeenCalled();
		const calls = fetcher.mock.calls as Array<unknown[]>;
		const firstCall = calls[0];
		const url = firstCall ? String(firstCall[0]) : "";
		expect(url).toContain("https://demo.usememos.com/api/v1/memos/123");
	});

	it("normalizes repeated trailing slashes in baseUrl", async () => {
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
			baseUrl: "https://demo.usememos.com///",
			memoId: "123",
			fetcher,
		});

		const calls = fetcher.mock.calls as Array<unknown[]>;
		const firstCall = calls[0];
		const url = firstCall ? String(firstCall[0]) : "";
		expect(url).toBe("https://demo.usememos.com/api/v1/memos/123");
	});
});

describe("fetchMemos", () => {
	it("fetches multiple memos in order and shares creator lookups", async () => {
		const fetcher = vi.fn(async (url: RequestInfo | URL) => {
			const href = String(url);
			if (href.includes("/users/1")) {
				return {
					ok: true,
					json: async () => ({
						name: "users/1",
						username: "bangwu",
						displayName: "棒无",
						avatarUrl: "/api/v1/users/1/avatar",
					}),
				} as Response;
			}

			const memoId = href.endsWith("/memos/2") ? "2" : "1";
			return {
				ok: true,
				json: async () => ({
					name: `memos/${memoId}`,
					creator: "users/1",
					content: `Memo ${memoId}`,
					tags: [],
				}),
			} as Response;
		});

		const memos = await fetchMemos({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoIds: ["1", "2"],
			fetcher,
		});

		expect(memos.map((memo) => memo.id)).toEqual(["1", "2"]);
		expect(memos[0]?.creatorDisplayName).toBe("棒无");
		expect(fetcher).toHaveBeenCalledTimes(3);
	});

	it("reuses duplicate memo ids inside a single batch request", async () => {
		const fetcher = vi.fn(async (url: RequestInfo | URL) => ({
			ok: true,
			json: async () => ({
				name: "memos/1",
				content: `Fetched ${String(url)}`,
				tags: [],
			}),
		} as Response));

		const memos = await fetchMemos({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoIds: ["1", "memos/1"],
			includeCreator: false,
			fetcher,
		});

		expect(memos).toHaveLength(2);
		expect(memos[0]?.id).toBe("1");
		expect(memos[1]?.id).toBe("1");
		expect(fetcher).toHaveBeenCalledTimes(1);
	});
});

describe("createMemoClient", () => {
	it("reuses cached memo requests across repeated fetches", async () => {
		const fetcher = vi.fn(async (url: RequestInfo | URL) => ({
			ok: true,
			json: async () => ({
				name: "memos/1",
				content: `Fetched ${String(url)}`,
				tags: [],
			}),
		} as Response));
		const client = createMemoClient({ fetcher });

		const [first, second] = await Promise.all([
			client.fetchMemo({
				baseUrl: "https://demo.usememos.com/api/v1",
				memoId: "1",
				includeCreator: false,
			}),
			client.fetchMemo({
				baseUrl: "https://demo.usememos.com/api/v1",
				memoId: "1",
				includeCreator: false,
			}),
		]);

		expect(first.id).toBe("1");
		expect(second.id).toBe("1");
		expect(fetcher).toHaveBeenCalledTimes(1);
	});

	it("reuses cached batch memo requests across repeated list fetches", async () => {
		const fetcher = vi.fn(async (url: RequestInfo | URL) => {
			const href = String(url);
			const memoId = href.endsWith("/memos/2") ? "2" : "1";
			return {
				ok: true,
				json: async () => ({
					name: `memos/${memoId}`,
					content: `Memo ${memoId}`,
					tags: [],
				}),
			} as Response;
		});
		const client = createMemoClient({ fetcher });

		const [first, second] = await Promise.all([
			client.fetchMemos({
				baseUrl: "https://demo.usememos.com/api/v1",
				memoIds: ["1", "2"],
				includeCreator: false,
			}),
			client.fetchMemos({
				baseUrl: "https://demo.usememos.com/api/v1",
				memoIds: ["1", "2"],
				includeCreator: false,
			}),
		]);

		expect(first.map((memo) => memo.id)).toEqual(["1", "2"]);
		expect(second.map((memo) => memo.id)).toEqual(["1", "2"]);
		expect(fetcher).toHaveBeenCalledTimes(2);
	});

	it("can be primed with prefetched memos", async () => {
		const fetcher = vi.fn<typeof fetch>();
		const client = createMemoClient({ fetcher });
		client.primeMemo({
			baseUrl: "https://demo.usememos.com/api/v1",
			memo: {
				id: "1",
				name: "memos/1",
				content: "Prefetched",
				tags: [],
				attachments: [],
				reactions: [],
			},
			includeCreator: false,
		});

		const memo = await client.fetchMemo({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			includeCreator: false,
		});

		expect(memo.content).toBe("Prefetched");
		expect(fetcher).not.toHaveBeenCalled();
	});

	it("can be primed with prefetched memo lists", async () => {
		const fetcher = vi.fn<typeof fetch>();
		const client = createMemoClient({ fetcher });
		client.primeMemos({
			baseUrl: "https://demo.usememos.com/api/v1",
			memos: [
				{
					id: "1",
					name: "memos/1",
					content: "Prefetched 1",
					tags: [],
					attachments: [],
					reactions: [],
				},
				{
					id: "2",
					name: "memos/2",
					content: "Prefetched 2",
					tags: [],
					attachments: [],
					reactions: [],
				},
			],
			includeCreator: false,
		});

		const memos = await client.fetchMemos({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoIds: ["1", "2"],
			includeCreator: false,
		});

		expect(memos.map((memo) => memo.content)).toEqual([
			"Prefetched 1",
			"Prefetched 2",
		]);
		expect(fetcher).not.toHaveBeenCalled();
	});

	it("reuses primed creator data when fetching memo lists with includeCreator enabled", async () => {
		const fetcher = vi.fn(async (url: RequestInfo | URL) => {
			const href = String(url);
			if (href.includes("/users/")) {
				return {
					ok: true,
					json: async () => ({
						name: "users/1",
						username: "bangwu",
						displayName: "棒无",
						avatarUrl: "/api/v1/users/1/avatar",
					}),
				} as Response;
			}

			return {
				ok: true,
				json: async () => ({
					name: href.endsWith("/memos/2") ? "memos/2" : "memos/1",
					creator: "users/1",
					content: href.endsWith("/memos/2") ? "Fetched 2" : "Fetched 1",
					tags: [],
				}),
			} as Response;
		});
		const client = createMemoClient({ fetcher });

		client.primeMemos({
			baseUrl: "https://demo.usememos.com/api/v1",
			memos: [
				{
					id: "1",
					name: "memos/1",
					creator: "bangwu",
					creatorUsername: "bangwu",
					creatorDisplayName: "棒无",
					creatorAvatarUrl: "https://demo.usememos.com/api/v1/users/1/avatar",
					content: "Prefetched 1",
					tags: [],
					attachments: [],
					reactions: [],
				},
				{
					id: "2",
					name: "memos/2",
					creator: "bangwu",
					creatorUsername: "bangwu",
					creatorDisplayName: "棒无",
					creatorAvatarUrl: "https://demo.usememos.com/api/v1/users/1/avatar",
					content: "Prefetched 2",
					tags: [],
					attachments: [],
					reactions: [],
				},
			],
		});

		const memos = await client.fetchMemos({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoIds: ["1", "2"],
		});

		expect(memos.map((memo) => memo.creatorDisplayName)).toEqual([
			"棒无",
			"棒无",
		]);
		expect(fetcher).not.toHaveBeenCalled();
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

describe("fetchMemoListHtmlSnippet", () => {
	it("returns a single styled snippet for multiple memos", async () => {
		const html = await fetchMemoListHtmlSnippet({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoIds: ["1", "2"],
			includeCreator: false,
			layout: "grid",
			gap: "20px",
			fetcher: async (url: RequestInfo | URL) => {
				const href = String(url);
				const memoId = href.endsWith("/memos/2") ? "2" : "1";
				return {
					ok: true,
					json: async () => ({
						name: `memos/${memoId}`,
						content: `Hello ${memoId}`,
						tags: [],
					}),
				} as Response;
			},
		});

		expect(html).toContain("<style>");
		expect(html).toContain("memos-embed-list--grid");
		expect(html).toContain("Hello 1");
		expect(html).toContain("Hello 2");
	});
});
