import { createServerFn } from "@tanstack/react-start";
import { fetchMemo, type Memo } from "memos-embed";

type MemoInput = {
	baseUrl: string;
	memoId: string;
};

export const getMemo = createServerFn({ method: "GET" })
	.inputValidator((data: MemoInput) => data)
	.handler(async ({ data }): Promise<Memo> => {
		return fetchMemo({ baseUrl: data.baseUrl, memoId: data.memoId });
	});
