import { createFileRoute } from "@tanstack/react-router";

const normalizeBooleanSearchValue = (value: unknown) =>
	typeof value === "boolean" ? value : value !== "false";

export const Route = createFileRoute("/embed/$memoId")({
	loader: async ({ params, location }) => {
		const search = location.search as Record<string, unknown>;
		const baseUrl =
			typeof search.baseUrl === "string" ? search.baseUrl : undefined;
		const theme = typeof search.theme === "string" ? search.theme : undefined;
		const density =
			search.density === "compact" || search.density === "comfortable"
				? search.density
				: undefined;
		const showTags = normalizeBooleanSearchValue(search.showTags);
		const showAttachments = normalizeBooleanSearchValue(search.showAttachments);
		const showReactions = normalizeBooleanSearchValue(search.showReactions);
		const showMeta = normalizeBooleanSearchValue(search.showMeta);
		const linkTarget =
			search.linkTarget === "_self" || search.linkTarget === "_blank"
				? search.linkTarget
				: undefined;
		const frameId =
			typeof search.frameId === "string" ? search.frameId : undefined;
		const { renderMemoHtmlSnippet, renderMemoStateHtmlSnippet } = await import(
			"memos-embed"
		);

		if (!baseUrl) {
			return {
				html: renderMemoStateHtmlSnippet("Missing baseUrl."),
				frameId,
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
				frameId,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to load memo.";
			return {
				html: renderMemoStateHtmlSnippet(message),
				frameId,
			};
		}
	},
});
