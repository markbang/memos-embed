import { fetchMemo } from "memos-embed";

export const getBlogMemo = async (memoId: string) =>
	fetchMemo({
		baseUrl: process.env.MEMOS_BASE_URL ?? "https://demo.usememos.com/api/v1",
		memoId,
	});
