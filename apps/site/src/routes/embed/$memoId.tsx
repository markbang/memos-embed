import { createFileRoute } from "@tanstack/react-router";

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
		const showTags =
			typeof search.showTags === "boolean"
				? search.showTags
				: search.showTags === "true"
					? true
					: search.showTags === "false"
						? false
						: true;
		const showAttachments =
			typeof search.showAttachments === "boolean"
				? search.showAttachments
				: search.showAttachments === "true"
					? true
					: search.showAttachments === "false"
						? false
						: true;
		const showReactions =
			typeof search.showReactions === "boolean"
				? search.showReactions
				: search.showReactions === "true"
					? true
					: search.showReactions === "false"
						? false
						: true;
		const showMeta =
			typeof search.showMeta === "boolean"
				? search.showMeta
				: search.showMeta === "true"
					? true
					: search.showMeta === "false"
						? false
						: true;
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
