import { createLazyFileRoute } from "@tanstack/react-router";
import { DocsPage } from "@/components/DocsPage";

export const Route = createLazyFileRoute("/_site/docs/")({
	component: DocsPage,
});
