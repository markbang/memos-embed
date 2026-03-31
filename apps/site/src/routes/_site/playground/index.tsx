import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import {
	normalizePlaygroundSearch,
	type PlaygroundState,
} from "@/lib/playground-state";
import { buildPageHead } from "@/lib/site-meta";

const PlaygroundExperience = lazy(() =>
	import("@/components/PlaygroundExperience").then((mod) => ({
		default: mod.PlaygroundExperience,
	})),
);

export const Route = createFileRoute("/_site/playground/")({
	validateSearch: normalizePlaygroundSearch,
	component: PlaygroundComponent,
	head: () =>
		buildPageHead({
			title: "Playground",
			description:
				"Preview Memos embeds, tweak themes, link behavior, and visibility, then copy iframe, Web Component, or React snippets.",
		}),
});

function PlaygroundComponent() {
	const search = Route.useSearch();
	const [embedBaseUrl, setEmbedBaseUrl] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		setEmbedBaseUrl(window.location.origin);
	}, []);

	const registerWebComponent = useCallback(async () => {
		if (typeof window === "undefined") {
			return;
		}

		const mod = await import("@memos-embed/wc");
		mod.defineMemosEmbedElement();
	}, []);

	const handleStateChange = useCallback((state: PlaygroundState) => {
		if (typeof window === "undefined") {
			return;
		}

		const url = new URL(window.location.href);
		url.searchParams.set("baseUrl", state.baseUrl);
		url.searchParams.set("memoId", state.memoId);
		url.searchParams.set("theme", state.theme);
		url.searchParams.set("density", state.density);
		url.searchParams.set("linkTarget", state.linkTarget);
		url.searchParams.set("showTags", String(state.showTags));
		url.searchParams.set("showAttachments", String(state.showAttachments));
		url.searchParams.set("showReactions", String(state.showReactions));
		url.searchParams.set("showMeta", String(state.showMeta));
		window.history.replaceState(null, "", url.toString());
	}, []);

	return (
		<Suspense fallback={<PlaygroundLoadingState />}>
			<PlaygroundExperience
				initialState={search}
				embedBaseUrl={embedBaseUrl}
				onStateChange={handleStateChange}
				registerWebComponent={registerWebComponent}
			/>
		</Suspense>
	);
}

const loadingCardKeys = ["config", "share", "snippets"] as const;

function PlaygroundLoadingState() {
	return (
		<div className="container mx-auto px-4 py-10">
			<div className="grid gap-8 lg:grid-cols-2">
				<div className="space-y-6">
					{loadingCardKeys.map((key) => (
						<div
							key={key}
							className="h-48 animate-pulse rounded-2xl border bg-muted/30"
						/>
					))}
				</div>
				<div className="h-[640px] animate-pulse rounded-2xl border bg-muted/30" />
			</div>
		</div>
	);
}
