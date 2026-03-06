import { useEffect, useMemo, useRef, useState } from "react";
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

export type MemoEmbedProps = {
	memoId: string;
	baseUrl: string;
	theme?: ThemeInput;
	density?: EmbedRenderOptions["density"];
	locale?: string;
	showTags?: boolean;
	showAttachments?: boolean;
	showReactions?: boolean;
	showMeta?: boolean;
	onError?: (error: Error) => void;
	onLoad?: (memo: Memo) => void;
};

export const MemoEmbed = ({
	memoId,
	baseUrl,
	theme,
	density,
	locale,
	showTags,
	showAttachments,
	showReactions,
	showMeta,
	onError,
	onLoad,
}: MemoEmbedProps) => {
	const [memo, setMemo] = useState<Memo | null>(null);
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
		}),
		[
			theme,
			density,
			locale,
			showTags,
			showAttachments,
			showReactions,
			showMeta,
		],
	);

	const htmlOptions: EmbedHtmlOptions = useMemo(
		() => ({
			...renderOptions,
			includeStyles: true,
		}),
		[renderOptions],
	);

	useEffect(() => {
		const controller = new AbortController();
		let isMounted = true;
		setError(null);
		setMemo(null);

		fetchMemo({ baseUrl, memoId, signal: controller.signal })
			.then((data: Memo) => {
				if (!isMounted || controller.signal.aborted) {
					return;
				}
				setMemo(data);
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
	}, [baseUrl, memoId, onError, onLoad]);

	useEffect(() => {
		if (!memo || !containerRef.current) {
			return;
		}
		containerRef.current.innerHTML = renderMemoHtmlSnippet(memo, htmlOptions);
	}, [memo, htmlOptions]);

	if (error) {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: renderMemoStateHtmlSnippet("Failed to load memo."),
				}}
			/>
		);
	}

	if (!memo) {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: renderMemoStateHtmlSnippet("Loading memo…"),
				}}
			/>
		);
	}

	return <div className="memos-embed__container" ref={containerRef} />;
};
