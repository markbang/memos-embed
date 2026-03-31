import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site-meta";

export const Route = createFileRoute("/docs/")({
	component: lazyRouteComponent(() => import("@/components/DocsPage"), "DocsPage"),
	head: () =>
		buildPageHead({
			title: "Documentation",
			description:
				"Learn how to ship Memos embeds as server-rendered HTML, iframe routes, Web Components, or React components.",
		}),
});
