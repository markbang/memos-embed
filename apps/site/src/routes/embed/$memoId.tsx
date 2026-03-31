import { createFileRoute } from "@tanstack/react-router";
import type { EmbedRenderOptions } from "memos-embed";
import { lazy, Suspense, useEffect, useRef } from "react";
import { normalizeBooleanSearchValue } from "@/lib/playground-state";

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

const EmbedPreview = lazy(() =>
	import("@/components/EmbedPreview").then((mod) => ({
		default: mod.EmbedPreview,
	})),
);

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
		const { renderMemoHtmlSnippet, renderMemoStateHtmlSnippet } = await import(
			"memos-embed"
		);

		if (!baseUrl) {
			return {
				html: renderMemoStateHtmlSnippet("Missing baseUrl."),
			};
		}

		try {
			const { getMemo } = await import("@/data/memos");
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

function EmbedComponent() {
	const { html } = Route.useLoaderData();
	const { frameId } = Route.useSearch();

	return (
		<Suspense fallback={<EmbedPreviewFallback html={html} />}>
			<EmbedPreview html={html} frameId={frameId} />
		</Suspense>
	);
}

function EmbedPreviewFallback({ html }: { html: string }) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		containerRef.current.innerHTML = html;
	}, [html]);

	return <div ref={containerRef} />;
}
