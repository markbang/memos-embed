import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useId } from "react";
import Footer from "@/components/Footer";
import { buildPageHead, SITE_DESCRIPTION } from "@/lib/site-meta";
import { buildThemeInitializationScript } from "@/lib/site-theme";
import { getLocale } from "@/paraglide/runtime";
import Header from "../components/Header";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		// Other redirect strategies are possible; see
		// https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "theme-color",
				content: "#111827",
			},
			...buildPageHead({
				description: SITE_DESCRIPTION,
			}).meta,
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

export const getRootBodyClassName = (pathname: string) =>
	pathname.startsWith("/embed/") ? "memos-embed-route" : undefined;

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const bodyClassName = getRootBodyClassName(pathname);
	const isEmbedRoute = bodyClassName === "memos-embed-route";
	const mainContentId = useId();
	const showDevtools = import.meta.env.DEV;

	return (
		<html lang={getLocale()}>
			<head>
				<HeadContent />
				<script>{buildThemeInitializationScript()}</script>
			</head>
			<body className={bodyClassName}>
				<a
					href={`#${mainContentId}`}
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground"
				>
					Skip to content
				</a>
				<Header />
				<main
					id={mainContentId}
					className={isEmbedRoute ? undefined : "flex-1"}
				>
					{children}
				</main>
				{isEmbedRoute ? null : <Footer />}
				{showDevtools ? (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				) : null}
				<Scripts />
			</body>
		</html>
	);
}
