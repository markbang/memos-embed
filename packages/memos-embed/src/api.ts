import { renderMemoHtmlSnippet, renderMemoListHtmlSnippet } from "./render";
import type {
	FetchMemoHtmlSnippetOptions,
	FetchMemoListHtmlSnippetOptions,
	FetchMemoOptions,
	FetchMemosOptions,
	Memo,
	MemoApiResponse,
	MemoAttachment,
	MemoClient,
	MemoClientConfig,
	PrimeMemoOptions,
	PrimeMemosOptions,
	User,
	UserApiResponse,
} from "./types";

const normalizeBaseUrl = (value: string) => {
	const trimmed = value.replace(/\/$/, "");
	if (trimmed.endsWith("/api/v1")) {
		return trimmed;
	}
	if (trimmed.endsWith("/api")) {
		return `${trimmed}/v1`;
	}
	return `${trimmed}/api/v1`;
};

const getInstanceOrigin = (value: string) => {
	const trimmed = value.replace(/\/$/, "");
	if (trimmed.endsWith("/api/v1")) {
		return trimmed.slice(0, -"/api/v1".length);
	}
	if (trimmed.endsWith("/api")) {
		return trimmed.slice(0, -"/api".length);
	}
	return trimmed;
};

const normalizeResourceUrl = (
	resourceUrl: string | undefined,
	baseUrl: string,
) => {
	if (!resourceUrl) {
		return undefined;
	}

	const origin = getInstanceOrigin(baseUrl);

	try {
		return new URL(resourceUrl, `${origin}/`).toString();
	} catch {
		return resourceUrl;
	}
};

const normalizeAttachment = (
	attachment: MemoAttachment,
	baseUrl: string,
): MemoAttachment => ({
	...attachment,
	content: normalizeResourceUrl(attachment.content, baseUrl),
	externalLink: normalizeResourceUrl(attachment.externalLink, baseUrl),
});

const getIdFromName = (name: string) => {
	const parts = name.split("/");
	return parts[parts.length - 1];
};

const normalizeMemoId = (memoId: string) =>
	memoId.includes("/") ? getIdFromName(memoId) : memoId;

const getMemoId = (memo: Memo) => memo.id || (memo.name ? getIdFromName(memo.name) : "");

const createMemoCacheKey = ({
	baseUrl,
	memoId,
	includeCreator = true,
}: {
	baseUrl: string;
	memoId: string;
	includeCreator?: boolean;
}) =>
	`${normalizeBaseUrl(baseUrl)}::${normalizeMemoId(memoId)}::${
		includeCreator ? "creator" : "plain"
	}`;

const normalizeUser = (user: UserApiResponse): User => {
	const id = user.name ? getIdFromName(user.name) : "";
	return {
		id,
		name: user.name,
		username: user.username,
		displayName: user.displayName,
		avatarUrl: user.avatarUrl,
	};
};

const normalizeMemo = (
	memo: MemoApiResponse,
	baseUrl: string,
	user?: User,
): Memo => {
	const content = memo.content ?? "";
	const tags = memo.tags ?? [];
	const attachments = (memo.attachments ?? []).map((attachment) =>
		normalizeAttachment(attachment, baseUrl),
	);
	const reactions = memo.reactions ?? [];
	const id = memo.name ? getIdFromName(memo.name) : "";
	const creatorFallback = memo.creator
		? getIdFromName(memo.creator)
		: memo.creator;

	return {
		id,
		name: memo.name,
		creator: user?.username ?? creatorFallback,
		creatorDisplayName: user?.displayName,
		creatorUsername: user?.username,
		creatorAvatarUrl: normalizeResourceUrl(user?.avatarUrl, baseUrl),
		createTime: memo.createTime,
		updateTime: memo.updateTime,
		displayTime: memo.displayTime,
		content,
		visibility: memo.visibility,
		tags,
		pinned: memo.pinned,
		attachments,
		reactions,
		snippet: memo.snippet,
	};
};

type UserCache = Map<string, Promise<User | undefined>>;
type MemoCache = Map<string, Promise<Memo>>;

const fetchUserWithCache = async ({
	baseUrl,
	userId,
	fetcher,
	signal,
	userCache,
}: {
	baseUrl: string;
	userId: string;
	fetcher: typeof fetch;
	signal?: AbortSignal;
	userCache: UserCache;
}): Promise<User | undefined> => {
	if (!userId) {
		return undefined;
	}

	const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
	const id = userId.includes("/") ? getIdFromName(userId) : userId;
	const cached = userCache.get(id);
	if (cached) {
		return cached;
	}

	const request = (async () => {
		const endpoint = `${normalizedBaseUrl}/users/${id}`;
		const response = await fetcher(endpoint, {
			method: "GET",
			signal,
		});

		if (!response.ok) {
			return undefined;
		}

		const data = (await response.json()) as UserApiResponse;
		if (!data || typeof data.name !== "string") {
			return undefined;
		}

		return normalizeUser(data);
	})();

	userCache.set(id, request);

	try {
		return await request;
	} catch (error) {
		userCache.delete(id);
		throw error;
	}
};

const fetchMemoOnce = async ({
	baseUrl,
	memoId,
	includeCreator = true,
	fetcher,
	signal,
	userCache,
}: FetchMemoOptions & {
	fetcher: typeof fetch;
	userCache: UserCache;
}): Promise<Memo> => {
	if (!baseUrl) {
		throw new Error("baseUrl is required");
	}
	if (!memoId) {
		throw new Error("memoId is required");
	}

	const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
	const id = normalizeMemoId(memoId);
	const endpoint = `${normalizedBaseUrl}/memos/${id}`;
	const response = await fetcher(endpoint, {
		method: "GET",
		signal,
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch memo (${response.status})`);
	}

	const data = (await response.json()) as MemoApiResponse;
	if (!data || typeof data.name !== "string") {
		throw new Error("Invalid memo response");
	}

	let user: User | undefined;
	if (includeCreator && data.creator) {
		user = await fetchUserWithCache({
			baseUrl,
			userId: data.creator,
			fetcher,
			signal,
			userCache,
		});
	}

	return normalizeMemo(data, baseUrl, user);
};

const fetchMemoWithCache = async ({
	baseUrl,
	memoId,
	includeCreator = true,
	fetcher,
	signal,
	userCache,
	memoCache,
}: FetchMemoOptions & {
	fetcher: typeof fetch;
	userCache: UserCache;
	memoCache: MemoCache;
}): Promise<Memo> => {
	const cacheKey = createMemoCacheKey({
		baseUrl,
		memoId,
		includeCreator,
	});
	const cached = memoCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const request = fetchMemoOnce({
		baseUrl,
		memoId,
		includeCreator,
		fetcher,
		signal,
		userCache,
	});
	memoCache.set(cacheKey, request);

	try {
		return await request;
	} catch (error) {
		memoCache.delete(cacheKey);
		throw error;
	}
};

const primeMemoInCache = ({
	memoCache,
	baseUrl,
	memo,
	includeCreator = true,
}: PrimeMemoOptions & {
	memoCache: MemoCache;
}) => {
	if (!baseUrl) {
		return;
	}

	const memoId = getMemoId(memo);
	if (!memoId) {
		return;
	}

	memoCache.set(
		createMemoCacheKey({
			baseUrl,
			memoId,
			includeCreator,
		}),
		Promise.resolve(memo),
	);
};

export const createMemoClient = (
	config: MemoClientConfig = {},
): MemoClient => {
	const memoCache: MemoCache = new Map();
	const userCache: UserCache = new Map();

	const clientFetchMemo: MemoClient["fetchMemo"] = async ({
		baseUrl,
		memoId,
		includeCreator = true,
		fetcher,
	}) =>
		fetchMemoWithCache({
			baseUrl,
			memoId,
			includeCreator,
			fetcher: fetcher ?? config.fetcher ?? fetch,
			userCache,
			memoCache,
		});

	const clientFetchMemos: MemoClient["fetchMemos"] = async ({
		memoIds,
		...options
	}) => Promise.all(memoIds.map((memoId) => clientFetchMemo({ ...options, memoId })));

	const primeMemo: MemoClient["primeMemo"] = (options) => {
		primeMemoInCache({
			memoCache,
			...options,
		});
	};

	const primeMemos: MemoClient["primeMemos"] = ({
		baseUrl,
		memos,
		includeCreator = true,
	}) => {
		for (const memo of memos) {
			primeMemoInCache({
				memoCache,
				baseUrl,
				memo,
				includeCreator,
			});
		}
	};

	return {
		fetchMemo: clientFetchMemo,
		fetchMemos: clientFetchMemos,
		primeMemo,
		primeMemos,
		clear: () => {
			memoCache.clear();
			userCache.clear();
		},
	};
};

export const fetchMemo = async ({
	baseUrl,
	memoId,
	includeCreator = true,
	fetcher,
	signal,
}: FetchMemoOptions): Promise<Memo> =>
	fetchMemoOnce({
		baseUrl,
		memoId,
		includeCreator,
		fetcher: fetcher ?? fetch,
		signal,
		userCache: new Map(),
	});

export const fetchMemos = async ({
	baseUrl,
	memoIds,
	includeCreator = true,
	fetcher,
	signal,
}: FetchMemosOptions): Promise<Memo[]> => {
	const memoCache: MemoCache = new Map();
	const userCache: UserCache = new Map();
	const fetchImpl = fetcher ?? fetch;

	return Promise.all(
		memoIds.map((memoId) =>
			fetchMemoWithCache({
				baseUrl,
				memoId,
				includeCreator,
				fetcher: fetchImpl,
				signal,
				userCache,
				memoCache,
			}),
		),
	);
};

export const fetchMemoHtmlSnippet = async (
	options: FetchMemoHtmlSnippetOptions,
) => {
	const memo = await fetchMemo(options);
	return renderMemoHtmlSnippet(memo, options);
};

export const fetchMemoListHtmlSnippet = async (
	options: FetchMemoListHtmlSnippetOptions,
) => {
	const memos = await fetchMemos(options);
	return renderMemoListHtmlSnippet(memos, options);
};
