import type {
	FetchMemoOptions,
	Memo,
	MemoApiResponse,
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

const normalizeAvatarUrl = (avatarUrl: string | undefined, baseUrl: string) => {
	if (!avatarUrl) {
		return undefined;
	}
	if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
		return avatarUrl;
	}
	const origin = getInstanceOrigin(baseUrl);
	if (avatarUrl.startsWith("/")) {
		return `${origin}${avatarUrl}`;
	}
	return `${origin}/${avatarUrl}`;
};

const getIdFromName = (name: string) => {
	const parts = name.split("/");
	return parts[parts.length - 1];
};

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

const normalizeMemo = (memo: MemoApiResponse, user?: User): Memo => {
	const content = memo.content ?? "";
	const tags = memo.tags ?? [];
	const attachments = memo.attachments ?? [];
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
		creatorAvatarUrl: user?.avatarUrl,
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

const fetchUser = async ({
	baseUrl,
	userId,
	fetcher,
	signal,
}: {
	baseUrl: string;
	userId: string;
	fetcher: typeof fetch;
	signal?: AbortSignal;
}): Promise<User | undefined> => {
	if (!userId) {
		return undefined;
	}

	const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
	const id = userId.includes("/") ? getIdFromName(userId) : userId;
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

	const normalized = normalizeUser(data);
	return {
		...normalized,
		avatarUrl: normalizeAvatarUrl(normalized.avatarUrl, baseUrl),
	};
};

export const fetchMemo = async ({
	baseUrl,
	memoId,
	includeCreator = true,
	fetcher,
	signal,
}: FetchMemoOptions): Promise<Memo> => {
	if (!baseUrl) {
		throw new Error("baseUrl is required");
	}
	if (!memoId) {
		throw new Error("memoId is required");
	}

	const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
	const id = memoId.includes("/") ? getIdFromName(memoId) : memoId;
	const endpoint = `${normalizedBaseUrl}/memos/${id}`;
	const fetchImpl = fetcher ?? fetch;

	const response = await fetchImpl(endpoint, {
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
		user = await fetchUser({
			baseUrl,
			userId: data.creator,
			fetcher: fetchImpl,
			signal,
		});
	}

	return normalizeMemo(data, user);
};
