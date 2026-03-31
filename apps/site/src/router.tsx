import { createRouter } from "@tanstack/react-router";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	return createRouter({
		routeTree,

		// Paraglide URL rewrite docs: https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#rewrite-url
		rewrite: {
			input: ({ url }) => deLocalizeUrl(url),
			output: ({ url }) => localizeUrl(url),
		},

		defaultPreload: "intent",
	});
};
