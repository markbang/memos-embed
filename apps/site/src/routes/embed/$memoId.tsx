import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { getMemo } from "@/data/memos";
import { buildEmbedCss, renderMemoHtml } from "memos-embed";
import type { EmbedRenderOptions } from "memos-embed";

type SearchParams = {
	baseUrl?: string;
	theme?: string;
	density?: EmbedRenderOptions["density"];
};

export const Route = createFileRoute("/embed/$memoId")({
	loader: async ({ params, location }) => {
		const { baseUrl, theme, density } = location.search as SearchParams;

		if (!baseUrl) {
			return {
				html: `<style>${buildEmbedCss()}</style><div class="memos-embed__state">Missing baseUrl.</div>`,
			};
		}

		try {
			const memo = await getMemo({
				data: {
					baseUrl,
					memoId: params.memoId,
				},
			});

			const html = renderMemoHtml(memo, { theme, density });

			return {
				html: `<style>${buildEmbedCss()}</style>${html}`,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to load memo.";
			return {
				html: `<style>${buildEmbedCss()}</style><div class="memos-embed__state">${message}</div>`,
			};
		}
	},
	component: EmbedComponent,
	validateSearch: (search: Record<string, unknown>): SearchParams => ({
		baseUrl: search.baseUrl as string | undefined,
		theme: search.theme as string | undefined,
		density: search.density as EmbedRenderOptions["density"] | undefined,
	}),
});

function EmbedComponent() {
	const { html } = Route.useLoaderData();
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}
		containerRef.current.innerHTML = html;
	}, [html]);

	return <div ref={containerRef} />;
}
