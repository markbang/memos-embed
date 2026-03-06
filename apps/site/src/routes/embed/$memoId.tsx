import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { getMemo } from "@/data/memos";
import { bindEmbedAutoResize } from "@/lib/embed-resize";
import { normalizeBooleanSearchValue } from "@/lib/playground";
import { renderMemoHtmlSnippet, renderMemoStateHtmlSnippet } from "memos-embed";
import type { EmbedRenderOptions } from "memos-embed";

type SearchParams = {
	baseUrl?: string;
	theme?: string;
	density?: EmbedRenderOptions["density"];
	showTags?: boolean;
	showAttachments?: boolean;
	showReactions?: boolean;
	showMeta?: boolean;
	linkTarget?: "_blank" | "_self";
	frameId?: string;
};

export const Route = createFileRoute("/embed/$memoId")({
	loader: async ({ params, location }) => {
		const {
			baseUrl,
			theme,
			density,
			showTags,
			showAttachments,
			showReactions,
			showMeta,
			linkTarget,
		} = location.search as SearchParams;

		if (!baseUrl) {
			return {
				html: renderMemoStateHtmlSnippet("Missing baseUrl."),
			};
		}

		try {
			const memo = await getMemo({
				data: {
					baseUrl,
					memoId: params.memoId,
				},
			});

			return {
				html: renderMemoHtmlSnippet(memo, {
					theme,
					density,
					showTags,
					showAttachments,
					showReactions,
					showMeta,
					linkTarget,
				}),
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to load memo.";
			return {
				html: renderMemoStateHtmlSnippet(message),
			};
		}
	},
	component: EmbedComponent,
	validateSearch: (search: Record<string, unknown>): SearchParams => ({
		baseUrl: search.baseUrl as string | undefined,
		theme: search.theme as string | undefined,
		density: search.density as EmbedRenderOptions["density"] | undefined,
		showTags: normalizeBooleanSearchValue(search.showTags, true),
		showAttachments: normalizeBooleanSearchValue(search.showAttachments, true),
		showReactions: normalizeBooleanSearchValue(search.showReactions, true),
		showMeta: normalizeBooleanSearchValue(search.showMeta, true),
		linkTarget:
			search.linkTarget === "_self" || search.linkTarget === "_blank"
				? search.linkTarget
				: undefined,
		frameId: search.frameId as string | undefined,
	}),
});

export function EmbedPreview({
	html,
	frameId,
}: {
	html: string;
	frameId?: string;
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}
		containerRef.current.innerHTML = html;
	}, [html]);

	useEffect(() => {
		if (!containerRef.current || !frameId) {
			return;
		}
		if (typeof window === "undefined" || window.parent === window) {
			return;
		}

		return bindEmbedAutoResize({
			frameId,
			container: containerRef.current,
		});
	}, [frameId, html]);

	return <div ref={containerRef} />;
}

function EmbedComponent() {
	const { html } = Route.useLoaderData();
	const { frameId } = Route.useSearch();

	return <EmbedPreview html={html} frameId={frameId} />;
}
