import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import StaticHeadContent from "@/components/StaticHeadContent";
import { isStaticMarketingPath } from "@/lib/route-mode";
import { buildPageHead, SITE_DESCRIPTION } from "@/lib/site-meta";
import { buildThemeInitializationScript } from "@/lib/site-theme";
import { getLocale } from "@/paraglide/runtime";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<object>()({
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

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const isMarketingPage = isStaticMarketingPath(pathname);
	const showDevtools = import.meta.env.DEV && !isMarketingPage;

	return (
		<html lang={getLocale()}>
			<head>
				{isMarketingPage ? <StaticHeadContent /> : <HeadContent />}
				<script>{buildThemeInitializationScript()}</script>
			</head>
			<body>
				{children}
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
						]}
					/>
				) : null}
				{isMarketingPage ? null : <Scripts />}
			</body>
		</html>
	);
}
