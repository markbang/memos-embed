import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { useId } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { m } from "@/paraglide/messages";

export const Route = createLazyFileRoute("/_site")({
	component: SiteLayout,
});

function SiteLayout() {
	const mainContentId = useId();

	return (
		<>
			<a
				href={`#${mainContentId}`}
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground"
			>
				{m.skip_to_content()}
			</a>
			<Header />
			<main id={mainContentId} className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</>
	);
}
