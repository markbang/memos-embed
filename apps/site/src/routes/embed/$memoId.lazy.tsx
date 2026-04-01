import { createLazyFileRoute } from "@tanstack/react-router";
import { EmbedPreview } from "@/components/EmbedPreview";

export const Route = createLazyFileRoute("/embed/$memoId")({
	component: EmbedComponent,
});

function EmbedComponent() {
	const { html, frameId } = Route.useLoaderData();

	return <EmbedPreview html={html} frameId={frameId} />;
}
