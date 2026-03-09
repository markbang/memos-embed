import { renderMemoHtmlSnippet, renderMemoListHtmlSnippet } from "./render";
import type {
	FetchMemoHtmlSnippetOptions,
	FetchMemoListHtmlSnippetOptions,
	FetchMemoOptions,
	FetchMemosOptions,
	Memo,
	MemoApiResponse,
	MemoAttachment,
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

type FetchContext = {
	baseUrl: string;
	normalizedBaseUrl: string;
	fetchImpl: typeof fetch;
	signal?: AbortSignal;
	includeCreator: boolean;
	userCache: Map<string, Promise<User | undefined>>;
};

const fetchUserWithCache = async ({
	context,
	userId,
}: {
	context: FetchContext;
	userId: string;
}): Promise<User | undefined> => {
	if (!userId) {
		return undefined;
	}

	const id = userId.includes("/") ? getIdFromName(userId) : userId;
	const cached = context.userCache.get(id);
	if (cached) {
		return cached;
	}

	const request = (async () => {
		const endpoint = `${context.normalizedBaseUrl}/users/${id}`;
		const response = await context.fetchImpl(endpoint, {
			method: "GET",
			signal: context.signal,
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

	context.userCache.set(id, request);
	return request;
};

const fetchMemoWithContext = async ({
	memoId,
	context,
}: {
	memoId: string;
	context: FetchContext;
}): Promise<Memo> => {
	if (!memoId) {
		throw new Error("memoId is required");
	}

	const id = normalizeMemoId(memoId);
	const endpoint = `${context.normalizedBaseUrl}/memos/${id}`;
	const response = await context.fetchImpl(endpoint, {
		method: "GET",
		signal: context.signal,
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch memo (${response.status})`);
	}

	const data = (await response.json()) as MemoApiResponse;
	if (!data || typeof data.name !== "string") {
		throw new Error("Invalid memo response");
	}

	let user: User | undefined;
	if (context.includeCreator && data.creator) {
		user = await fetchUserWithCache({
			context,
			userId: data.creator,
		});
	}

	return normalizeMemo(data, context.baseUrl, user);
};

const createFetchContext = ({
	baseUrl,
	includeCreator = true,
	fetcher,
	signal,
}: Omit<FetchMemoOptions, "memoId">): FetchContext => {
	if (!baseUrl) {
		throw new Error("baseUrl is required");
	}

	return {
		baseUrl,
		normalizedBaseUrl: normalizeBaseUrl(baseUrl),
		fetchImpl: fetcher ?? fetch,
		signal,
		includeCreator,
		userCache: new Map<string, Promise<User | undefined>>(),
	};
};

export const fetchMemo = async ({
	baseUrl,
	memoId,
	includeCreator = true,
	fetcher,
	signal,
}: FetchMemoOptions): Promise<Memo> => {
	const context = createFetchContext({
		baseUrl,
		includeCreator,
		fetcher,
		signal,
	});

	return fetchMemoWithContext({
		memoId,
		context,
	});
};

export const fetchMemos = async ({
	baseUrl,
	memoIds,
	includeCreator = true,
	fetcher,
	signal,
}: FetchMemosOptions): Promise<Memo[]> => {
	const context = createFetchContext({
		baseUrl,
		includeCreator,
		fetcher,
		signal,
	});
	const memoCache = new Map<string, Promise<Memo>>();

	return Promise.all(
		memoIds.map((memoId) => {
			const id = normalizeMemoId(memoId);
			const cached = memoCache.get(id);
			if (cached) {
				return cached;
			}

			const request = fetchMemoWithContext({
				memoId,
				context,
			});
			memoCache.set(id, request);
			return request;
		}),
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
