import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import type {
	EmbedHtmlOptions,
	EmbedRenderOptions,
	Memo,
	ThemeInput,
} from "memos-embed";
import {
	fetchMemo,
	renderMemoHtmlSnippet,
	renderMemoStateHtmlSnippet,
} from "memos-embed";

type SharedMemoEmbedProps = {
	theme?: ThemeInput;
	density?: EmbedRenderOptions["density"];
	locale?: string;
	showTags?: boolean;
	showAttachments?: boolean;
	showReactions?: boolean;
	showMeta?: boolean;
	linkTarget?: EmbedRenderOptions["linkTarget"];
	className?: string;
	style?: CSSProperties;
	onError?: (error: Error) => void;
	onLoad?: (memo: Memo) => void;
};

type MemoEmbedFetchProps = SharedMemoEmbedProps & {
	memo?: undefined;
	memoId: string;
	baseUrl: string;
	includeCreator?: boolean;
	fetcher?: typeof fetch;
};

type MemoEmbedProvidedProps = SharedMemoEmbedProps & {
	memo: Memo;
	memoId?: string;
	baseUrl?: string;
	includeCreator?: boolean;
	fetcher?: typeof fetch;
};

export type MemoEmbedProps = MemoEmbedFetchProps | MemoEmbedProvidedProps;

const renderState = ({
	message,
	className,
	style,
}: {
	message: string;
	className?: string;
	style?: CSSProperties;
}) => (
	<div
		className={className}
		style={style}
		dangerouslySetInnerHTML={{
			__html: renderMemoStateHtmlSnippet(message),
		}}
	/>
);

export const MemoEmbed = ({
	memo: providedMemo,
	memoId,
	baseUrl,
	theme,
	density,
	locale,
	showTags,
	showAttachments,
	showReactions,
	showMeta,
	linkTarget,
	className,
	style,
	includeCreator = true,
	fetcher,
	onError,
	onLoad,
}: MemoEmbedProps) => {
	const [fetchedMemo, setFetchedMemo] = useState<Memo | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

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

	const htmlOptions: EmbedHtmlOptions = useMemo(
		() => ({
			...renderOptions,
			includeStyles: true,
		}),
		[renderOptions],
	);

	const resolvedMemo = providedMemo ?? fetchedMemo;
	const canFetch = !providedMemo && Boolean(baseUrl) && Boolean(memoId);

	useEffect(() => {
		if (!providedMemo) {
			return;
		}

		setFetchedMemo(null);
		setError(null);
		onLoad?.(providedMemo);
	}, [providedMemo, onLoad]);

	useEffect(() => {
		if (!canFetch || !baseUrl || !memoId) {
			return;
		}

		const controller = new AbortController();
		let isMounted = true;
		setError(null);
		setFetchedMemo(null);

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
	}, [baseUrl, memoId, includeCreator, fetcher, onError, onLoad, canFetch]);

	useEffect(() => {
		if (!resolvedMemo || !containerRef.current) {
			return;
		}
		containerRef.current.innerHTML = renderMemoHtmlSnippet(resolvedMemo, htmlOptions);
	}, [resolvedMemo, htmlOptions]);

	if (!providedMemo && (!baseUrl || !memoId)) {
		return renderState({
			message: "baseUrl and memoId are required when memo is not provided.",
			className,
			style,
		});
	}

	if (error) {
		return renderState({
			message: error.message || "Failed to load memo.",
			className,
			style,
		});
	}

	if (!resolvedMemo) {
		return renderState({
			message: "Loading memo…",
			className,
			style,
		});
	}

	return <div className={className} style={style} ref={containerRef} />;
};
