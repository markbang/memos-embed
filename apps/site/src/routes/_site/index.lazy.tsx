import { createLazyFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/HomePage";

export const Route = createLazyFileRoute("/_site/")({
	component: HomePage,
});
