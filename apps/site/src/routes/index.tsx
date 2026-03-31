import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site-meta";

export const Route = createFileRoute("/")({
	component: lazyRouteComponent(() => import("@/components/HomePage"), "HomePage"),
	head: () =>
		buildPageHead({
			description:
				"Customize polished Memos embeds with shareable playground presets, then ship them as iframe, Web Component, or React snippets.",
		}),
});
