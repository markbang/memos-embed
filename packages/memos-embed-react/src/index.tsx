import { useEffect, useMemo, useRef, useState } from "react";
import type {
	EmbedHtmlOptions,
	EmbedRenderOptions,
	Memo,
	ThemeInput,
} from "memos-embed";
import { buildEmbedCss, fetchMemo, renderMemoHtml } from "memos-embed";

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
		let isMounted = true;
		setError(null);
		setMemo(null);

		fetchMemo({ baseUrl, memoId })
			.then((data: Memo) => {
				if (!isMounted) {
					return;
				}
				setMemo(data);
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
	}, [baseUrl, memoId, onError, onLoad]);

	useEffect(() => {
		if (!memo || !containerRef.current) {
			return;
		}
		const html = renderMemoHtml(memo, htmlOptions);
		containerRef.current.innerHTML = `<style>${buildEmbedCss()}</style>${html}`;
	}, [memo, htmlOptions]);

	if (error) {
		return <div className="memos-embed__state">Failed to load memo.</div>;
	}

	if (!memo) {
		return <div className="memos-embed__state">Loading memo…</div>;
	}

	return <div className="memos-embed__container" ref={containerRef} />;
};
