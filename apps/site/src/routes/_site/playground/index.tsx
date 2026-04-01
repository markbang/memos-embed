import { createFileRoute } from "@tanstack/react-router";
import { normalizePlaygroundSearch } from "@/lib/playground-state";
import { buildPageHead } from "@/lib/site-meta";

export const Route = createFileRoute("/_site/playground/")({
	validateSearch: normalizePlaygroundSearch,
	head: () =>
		buildPageHead({
			title: "Playground",
			description:
				"Preview Memos embeds, tweak themes, link behavior, and visibility, then copy iframe, Web Component, or React snippets.",
		}),
});
