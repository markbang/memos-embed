import { useLocation } from "@tanstack/react-router";
import { GithubIcon, MenuIcon, XIcon } from "@/components/icons/shell";
import { isStaticMarketingPath, normalizeSitePath } from "@/lib/route-mode";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import {
	deLocalizeHref,
	getLocale,
	locales,
	localizeHref,
} from "@/paraglide/runtime";

const navLinks = [
	{ to: "/", label: () => m.nav_home() },
	{ to: "/docs", label: () => m.nav_docs() },
	{ to: "/playground", label: () => m.nav_playground() },
] as const;

const localeDisplayNames: Record<string, string> = {
	en: "EN",
	de: "DE",
	zh: "中文",
};

const navLinkClassName =
	"block px-2 py-1 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground md:inline-block md:text-sm md:px-0";

export default function MarketingHeader() {
	const location = useLocation();
	const currentLocale = getLocale();
	const currentPath = normalizeSitePath(location.pathname);
	const baseHref = deLocalizeHref(location.pathname);

	if (!isStaticMarketingPath(location.pathname)) {
		return null;
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
			<div className="container mx-auto flex h-14 items-center gap-4 px-4">
				<a href={localizeHref("/")} className="flex min-w-0 items-center gap-3">
					<div className="hidden rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
						{m.open_source()}
					</div>
					<div className="min-w-0">
						<p className="truncate font-semibold">Memos Embed</p>
						<p className="hidden text-xs text-muted-foreground md:block">
							{m.site_tagline()}
						</p>
					</div>
				</a>

				{/* Desktop Nav */}
				<nav className="hidden items-center gap-6 text-sm font-medium md:flex">
					{navLinks.map((link) => {
						const isActive = currentPath === normalizeSitePath(link.to);
						return (
							<a
								key={link.to}
								href={localizeHref(link.to)}
								className={cn(
									"text-foreground/60 transition-colors hover:text-foreground",
									isActive && "text-foreground",
								)}
								aria-current={isActive ? "page" : undefined}
							>
								{link.label()}
							</a>
						);
					})}
				</nav>

				<div className="ml-auto flex items-center gap-3">
					{/* Locale Switcher */}
					<div className="hidden items-center gap-2 sm:flex">
						{locales.map((locale) => {
							const isActive = locale === currentLocale;
							return (
								<a
									key={locale}
									href={localizeHref(baseHref, { locale })}
									aria-current={isActive ? "page" : undefined}
									className={cn(
										"rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
										isActive
											? "border-foreground bg-foreground text-background"
											: "border-border/70 text-muted-foreground hover:text-foreground",
									)}
								>
									{localeDisplayNames[locale] ?? locale.toUpperCase()}
								</a>
							);
						})}
					</div>

					<a
						href="https://github.com/markbang/memos-embed"
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
						aria-label="GitHub"
					>
						<GithubIcon className="size-4" />
					</a>

					{/* Mobile Menu (No JS) */}
					<details className="group relative md:hidden">
						<summary className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground list-none [&::-webkit-details-marker]:hidden">
							<MenuIcon className="size-5 group-open:hidden" />
							<XIcon className="size-5 hidden group-open:block" />
							<span className="sr-only">{m.open_nav_menu()}</span>
						</summary>

						<div className="fixed inset-0 top-14 z-50 bg-background/95 backdrop-blur md:hidden">
							<nav className="flex flex-col gap-2 p-6">
								{navLinks.map((link) => {
									const isActive = currentPath === normalizeSitePath(link.to);
									return (
										<a
											key={link.to}
											href={localizeHref(link.to)}
											className={cn(
												navLinkClassName,
												isActive && "text-foreground",
											)}
										>
											{link.label()}
										</a>
									);
								})}
							</nav>
							<div className="px-6">
								<div className="flex flex-wrap gap-2">
									{locales.map((locale) => {
										const isActive = locale === currentLocale;
										return (
											<a
												key={locale}
												href={localizeHref(baseHref, { locale })}
												aria-current={isActive ? "page" : undefined}
												className={cn(
													"rounded-full border px-3 py-1 text-xs font-medium transition-colors",
													isActive
														? "border-foreground bg-foreground text-background"
														: "border-border/70 text-muted-foreground hover:text-foreground",
												)}
											>
												{localeDisplayNames[locale] ?? locale.toUpperCase()}
											</a>
										);
									})}
								</div>
							</div>
						</div>
					</details>
				</div>
			</div>
		</header>
	);
}
