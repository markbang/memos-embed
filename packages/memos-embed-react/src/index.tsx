"use client";

import {
	createContext,
	type CSSProperties,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type {
	EmbedHtmlOptions,
	EmbedRenderOptions,
	Memo,
	MemoClient,
	MemoListRenderOptions,
	ThemeInput,
} from "memos-embed";
import {
	fetchMemo,
	fetchMemos,
	renderMemoHtmlSnippet,
	renderMemoListHtmlSnippet,
	renderMemoStateHtmlSnippet,
} from "memos-embed";

type BaseEmbedProps = {
	client?: MemoClient;
	theme?: ThemeInput;
	density?: EmbedRenderOptions["density"];
	locale?: string;
	showTags?: boolean;
	showAttachments?: boolean;
	showReactions?: boolean;
	showMeta?: boolean;
	linkTarget?: EmbedRenderOptions["linkTarget"];
	includeStyles?: boolean;
	className?: string;
	style?: CSSProperties;
	onError?: (error: Error) => void;
};

type MemoEmbedSharedProps = BaseEmbedProps & {
	onLoad?: (memo: Memo) => void;
};

type MemoEmbedFetchProps = MemoEmbedSharedProps & {
	memo?: undefined;
	memoId: string;
	baseUrl: string;
	includeCreator?: boolean;
	fetcher?: typeof fetch;
};

type MemoEmbedProvidedProps = MemoEmbedSharedProps & {
	memo: Memo;
	memoId?: string;
	baseUrl?: string;
	includeCreator?: boolean;
	fetcher?: typeof fetch;
};

export type MemoEmbedProps = MemoEmbedFetchProps | MemoEmbedProvidedProps;

type MemoEmbedListSharedProps = BaseEmbedProps & {
	layout?: MemoListRenderOptions["layout"];
	gap?: MemoListRenderOptions["gap"];
	onLoad?: (memos: Memo[]) => void;
};

type MemoEmbedListFetchProps = MemoEmbedListSharedProps & {
	memos?: undefined;
	memoIds: readonly string[];
	baseUrl: string;
	includeCreator?: boolean;
	fetcher?: typeof fetch;
};

type MemoEmbedListProvidedProps = MemoEmbedListSharedProps & {
	memos: readonly Memo[];
	memoIds?: readonly string[];
	baseUrl?: string;
	includeCreator?: boolean;
	fetcher?: typeof fetch;
};

export type MemoEmbedListProps =
	| MemoEmbedListFetchProps
	| MemoEmbedListProvidedProps;

const MemoClientContext = createContext<MemoClient | null>(null);

export const MemoClientProvider = ({
	client,
	children,
}: {
	client: MemoClient;
	children: ReactNode;
}) => (
	<MemoClientContext.Provider value={client}>
		{children}
	</MemoClientContext.Provider>
);

export const useMemoClient = (client?: MemoClient) =>
	client ?? useContext(MemoClientContext);

const renderHtml = ({
	html,
	className,
	style,
}: {
	html: string;
	className?: string;
	style?: CSSProperties;
}) => (
	<div
		className={className}
		style={style}
		dangerouslySetInnerHTML={{ __html: html }}
	/>
);

const renderState = ({
	message,
	className,
	style,
	includeStyles,
}: {
	message: string;
	className?: string;
	style?: CSSProperties;
	includeStyles?: boolean;
}) =>
	renderHtml({
		html: renderMemoStateHtmlSnippet(message, { includeStyles }),
		className,
		style,
	});

const useEmbedHtmlOptions = ({
	theme,
	density,
	locale,
	showTags,
	showAttachments,
	showReactions,
	showMeta,
	linkTarget,
	includeStyles,
}: {
	theme?: ThemeInput;
	density?: EmbedRenderOptions["density"];
	locale?: string;
	showTags?: boolean;
	showAttachments?: boolean;
	showReactions?: boolean;
	showMeta?: boolean;
	linkTarget?: EmbedRenderOptions["linkTarget"];
	includeStyles: boolean;
}) => {
	const renderOptions: EmbedRenderOptions = useMemo(
		() => ({
			theme,
			density,
			locale,
			showTags,
			showAttachments,
			showReactions,
			showMeta,
			linkTarget,
		}),
		[
			theme,
			density,
			locale,
			showTags,
			showAttachments,
			showReactions,
			showMeta,
			linkTarget,
		],
	);

	return useMemo<EmbedHtmlOptions>(
		() => ({
			...renderOptions,
			includeStyles,
		}),
		[renderOptions, includeStyles],
	);
};

const useMemoListHtmlOptions = ({
	theme,
	density,
	locale,
	showTags,
	showAttachments,
	showReactions,
	showMeta,
	linkTarget,
	includeStyles,
	layout,
	gap,
}: {
	theme?: ThemeInput;
	density?: EmbedRenderOptions["density"];
	locale?: string;
	showTags?: boolean;
	showAttachments?: boolean;
	showReactions?: boolean;
	showMeta?: boolean;
	linkTarget?: EmbedRenderOptions["linkTarget"];
	includeStyles: boolean;
	layout?: MemoListRenderOptions["layout"];
	gap?: MemoListRenderOptions["gap"];
}) => {
	const htmlOptions = useEmbedHtmlOptions({
		theme,
		density,
		locale,
		showTags,
		showAttachments,
		showReactions,
		showMeta,
		linkTarget,
		includeStyles,
	});

	return useMemo<MemoListRenderOptions>(
		() => ({
			...htmlOptions,
			layout,
			gap,
		}),
		[htmlOptions, layout, gap],
	);
};

export const MemoEmbed = ({
	memo: providedMemo,
	memoId,
	baseUrl,
	client,
	theme,
	density,
	locale,
	showTags,
	showAttachments,
	showReactions,
	showMeta,
	linkTarget,
	includeStyles = true,
	className,
	style,
	includeCreator = true,
	fetcher,
	onError,
	onLoad,
}: MemoEmbedProps) => {
	const [fetchedMemo, setFetchedMemo] = useState<Memo | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const memoClient = useMemoClient(client);
	const htmlOptions = useEmbedHtmlOptions({
		theme,
		density,
		locale,
		showTags,
		showAttachments,
		showReactions,
		showMeta,
		linkTarget,
		includeStyles,
	});

	const resolvedMemo = providedMemo ?? fetchedMemo;
	const canFetch = !providedMemo && Boolean(baseUrl) && Boolean(memoId);
	const html = useMemo(
		() =>
			resolvedMemo
				? renderMemoHtmlSnippet(resolvedMemo, htmlOptions)
				: null,
		[resolvedMemo, htmlOptions],
	);

	useEffect(() => {
		if (!providedMemo) {
			return;
		}

		setFetchedMemo(null);
		setError(null);
		if (memoClient && baseUrl) {
			memoClient.primeMemo({
				baseUrl,
				memo: providedMemo,
				includeCreator,
			});
		}
		onLoad?.(providedMemo);
	}, [providedMemo, memoClient, baseUrl, includeCreator, onLoad]);

	useEffect(() => {
		if (!canFetch || !baseUrl || !memoId) {
			return;
		}

		let isMounted = true;
		setError(null);
		setFetchedMemo(null);

		if (memoClient) {
			memoClient
				.fetchMemo({
					baseUrl,
					memoId,
					includeCreator,
					fetcher,
				})
				.then((data: Memo) => {
					if (!isMounted) {
						return;
					}
					setFetchedMemo(data);
					onLoad?.(data);
				})
				.catch((fetchError: Error) => {
					if (!isMounted) {
						return;
					}
					setError(fetchError);
					onError?.(fetchError);
				});

			return () => {
				isMounted = false;
			};
		}

		const controller = new AbortController();

		fetchMemo({
			baseUrl,
			memoId,
			includeCreator,
			fetcher,
			signal: controller.signal,
		})
			.then((data: Memo) => {
				if (!isMounted || controller.signal.aborted) {
					return;
				}
				setFetchedMemo(data);
				onLoad?.(data);
			})
			.catch((fetchError: Error) => {
				if (!isMounted || controller.signal.aborted) {
					return;
				}
				setError(fetchError);
				onError?.(fetchError);
			});

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [
		baseUrl,
		memoId,
		includeCreator,
		fetcher,
		onError,
		onLoad,
		canFetch,
		memoClient,
	]);

	if (!providedMemo && (!baseUrl || !memoId)) {
		return renderState({
			message: "baseUrl and memoId are required when memo is not provided.",
			className,
			style,
			includeStyles,
		});
	}

	if (error) {
		return renderState({
			message: error.message || "Failed to load memo.",
			className,
			style,
			includeStyles,
		});
	}

	if (!resolvedMemo || !html) {
		return renderState({
			message: "Loading memo…",
			className,
			style,
			includeStyles,
		});
	}

	return renderHtml({
		html,
		className,
		style,
	});
};

export const MemoEmbedList = ({
	memos: providedMemos,
	memoIds = [],
	baseUrl,
	client,
	theme,
	density,
	locale,
	showTags,
	showAttachments,
	showReactions,
	showMeta,
	linkTarget,
	includeStyles = true,
	layout,
	gap,
	className,
	style,
	includeCreator = true,
	fetcher,
	onError,
	onLoad,
}: MemoEmbedListProps) => {
	const [fetchedMemos, setFetchedMemos] = useState<Memo[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const memoClient = useMemoClient(client);
	const memoIdsKey = memoIds.join("\u001f");
	const stableMemoIds = useMemo(() => Array.from(memoIds), [memoIdsKey]);
	const htmlOptions = useMemoListHtmlOptions({
		theme,
		density,
		locale,
		showTags,
		showAttachments,
		showReactions,
		showMeta,
		linkTarget,
		includeStyles,
		layout,
		gap,
	});

	const resolvedMemos = providedMemos ?? fetchedMemos;
	const canFetch = !providedMemos && Boolean(baseUrl) && stableMemoIds.length > 0;
	const html = useMemo(
		() =>
			resolvedMemos
				? renderMemoListHtmlSnippet(resolvedMemos, htmlOptions)
				: null,
		[resolvedMemos, htmlOptions],
	);

	useEffect(() => {
		if (!providedMemos) {
			return;
		}

		setFetchedMemos(null);
		setError(null);
		if (memoClient && baseUrl) {
			memoClient.primeMemos({
				baseUrl,
				memos: providedMemos,
				includeCreator,
			});
		}
		onLoad?.(Array.from(providedMemos));
	}, [providedMemos, memoClient, baseUrl, includeCreator, onLoad]);

	useEffect(() => {
		if (!canFetch || !baseUrl) {
			return;
		}

		let isMounted = true;
		setError(null);
		setFetchedMemos(null);

		if (memoClient) {
			memoClient
				.fetchMemos({
					baseUrl,
					memoIds: stableMemoIds,
					includeCreator,
					fetcher,
				})
				.then((data: Memo[]) => {
					if (!isMounted) {
						return;
					}
					setFetchedMemos(data);
					onLoad?.(data);
				})
				.catch((fetchError: Error) => {
					if (!isMounted) {
						return;
					}
					setError(fetchError);
					onError?.(fetchError);
				});

			return () => {
				isMounted = false;
			};
		}

		const controller = new AbortController();

		fetchMemos({
			baseUrl,
			memoIds: stableMemoIds,
			includeCreator,
			fetcher,
			signal: controller.signal,
		})
			.then((data: Memo[]) => {
				if (!isMounted || controller.signal.aborted) {
					return;
				}
				setFetchedMemos(data);
				onLoad?.(data);
			})
			.catch((fetchError: Error) => {
				if (!isMounted || controller.signal.aborted) {
					return;
				}
				setError(fetchError);
				onError?.(fetchError);
			});

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [
		baseUrl,
		stableMemoIds,
		includeCreator,
		fetcher,
		onError,
		onLoad,
		canFetch,
		memoClient,
	]);

	if (!providedMemos && !baseUrl) {
		return renderState({
			message: "baseUrl is required when memos are not provided.",
			className,
			style,
			includeStyles,
		});
	}

	if (!providedMemos && stableMemoIds.length === 0) {
		return renderState({
			message: "memoIds are required when memos are not provided.",
			className,
			style,
			includeStyles,
		});
	}

	if (error) {
		return renderState({
			message: error.message || "Failed to load memos.",
			className,
			style,
			includeStyles,
		});
	}

	if (!resolvedMemos || !html) {
		return renderState({
			message: "Loading memos…",
			className,
			style,
			includeStyles,
		});
	}

	if (resolvedMemos.length === 0) {
		return null;
	}

	return renderHtml({
		html,
		className,
		style,
	});
};
