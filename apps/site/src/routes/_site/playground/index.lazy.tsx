import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { PlaygroundExperience } from "@/components/PlaygroundExperience";
import {
	normalizePlaygroundSearch,
	type PlaygroundState,
} from "@/lib/playground-state";

export const Route = createLazyFileRoute("/_site/playground/")({
	component: PlaygroundComponent,
});

function PlaygroundComponent() {
	const rawSearch = Route.useSearch();
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
		<PlaygroundExperience
			initialState={normalizePlaygroundSearch(
				rawSearch as Record<string, unknown>,
			)}
			embedBaseUrl={embedBaseUrl}
			onStateChange={handleStateChange}
			registerWebComponent={registerWebComponent}
		/>
	);
}
