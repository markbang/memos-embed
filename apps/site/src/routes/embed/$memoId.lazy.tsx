import { createLazyFileRoute } from "@tanstack/react-router";
import { EmbedPreview } from "@/components/EmbedPreview";

export const Route = createLazyFileRoute("/embed/$memoId")({
	component: EmbedComponent,
});

function EmbedComponent() {
	const { html } = Route.useLoaderData();
	const { frameId } = Route.useSearch();

	return <EmbedPreview html={html} frameId={frameId} />;
}
