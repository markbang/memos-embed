import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { GithubIcon, MenuIcon, MoonIcon, SunIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	applySiteTheme,
	readStoredSiteTheme,
	SITE_THEME_MEDIA_QUERY,
	type SiteThemeMode,
} from "@/lib/site-theme";
import { m } from "@/paraglide/messages";
import ParaglideLocaleSwitcher from "./LocaleSwitcher";

const HeaderThemeMenu = lazy(() =>
	import("./HeaderThemeMenu").then((mod) => ({
		default: mod.HeaderThemeMenu,
	})),
);

const HeaderMobileNav = lazy(() =>
	import("./HeaderMobileNav").then((mod) => ({
		default: mod.HeaderMobileNav,
	})),
);

const navLinks = [
	{ to: "/", labelKey: "nav_home" },
	{ to: "/docs", labelKey: "nav_docs" },
	{ to: "/playground", labelKey: "nav_playground" },
] as const;

const getNavLabel = (key: string) => {
	const labels: Record<string, () => string> = {
		nav_home: () => m.nav_home(),
		nav_docs: () => m.nav_docs(),
		nav_playground: () => m.nav_playground(),
	};
	return labels[key]?.() ?? key;
};

export default function Header() {
	const [themeMode, setThemeMode] = useState<SiteThemeMode>(() =>
		typeof window === "undefined"
			? "system"
			: readStoredSiteTheme(window.localStorage),
	);
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
	const themeMenuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const syncTheme = () => {
			applySiteTheme({
				theme: themeMode,
				storage: window.localStorage,
				currentWindow: window,
				rootElement: document.documentElement,
			});
		};

		syncTheme();

		if (themeMode !== "system" || !window.matchMedia) {
			return;
		}

		const mediaQuery = window.matchMedia(SITE_THEME_MEDIA_QUERY);
		const handleChange = () => {
			syncTheme();
		};

		if (typeof mediaQuery.addEventListener === "function") {
			mediaQuery.addEventListener("change", handleChange);
			return () => {
				mediaQuery.removeEventListener("change", handleChange);
			};
		}

		mediaQuery.addListener?.(handleChange);
		return () => {
			mediaQuery.removeListener?.(handleChange);
		};
	}, [themeMode]);

	useEffect(() => {
		if (typeof document === "undefined") {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (
				isThemeMenuOpen &&
				themeMenuRef.current &&
				!themeMenuRef.current.contains(event.target as Node)
			) {
				setIsThemeMenuOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") {
				return;
			}

			setIsThemeMenuOpen(false);
			setIsMobileNavOpen(false);
		};

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isThemeMenuOpen]);

	useEffect(() => {
		if (typeof document === "undefined") {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		if (isMobileNavOpen) {
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isMobileNavOpen]);

	const closeMobileNav = () => {
		setIsMobileNavOpen(false);
	};

	const toggleThemeMenu = () => {
		setIsMobileNavOpen(false);
		setIsThemeMenuOpen((current) => !current);
	};

	const handleThemeChange = (nextTheme: SiteThemeMode) => {
		setThemeMode(nextTheme);
		setIsThemeMenuOpen(false);
	};

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
				<div className="container mx-auto flex h-14 items-center gap-3 px-4">
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						aria-label={m.open_nav_menu()}
						aria-expanded={isMobileNavOpen}
						onClick={() => {
							setIsThemeMenuOpen(false);
							setIsMobileNavOpen(true);
						}}
					>
						<MenuIcon className="size-5" />
					</Button>

					<div className="flex min-w-0 flex-1 items-center gap-4">
						<Link to="/" className="flex min-w-0 items-center gap-3">
							<div className="hidden rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
								{m.open_source()}
							</div>
							<div className="min-w-0">
								<p className="truncate font-semibold">Memos Embed</p>
								<p className="hidden text-xs text-muted-foreground md:block">
									{m.site_tagline()}
								</p>
							</div>
						</Link>

						<nav className="hidden items-center gap-6 text-sm font-medium md:flex">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="text-foreground/60 transition-colors hover:text-foreground"
									activeProps={{ className: "text-foreground" }}
								>
									{getNavLabel(link.labelKey)}
								</Link>
							))}
						</nav>
					</div>

					<nav className="flex items-center gap-2">
						<Button
							asChild
							variant="ghost"
							size="icon"
							className="hidden md:inline-flex"
						>
							<a
								href="https://github.com/markbang/memos-embed"
								target="_blank"
								rel="noreferrer"
								aria-label="Open GitHub repository"
							>
								<GithubIcon className="size-4" />
							</a>
						</Button>
						<div ref={themeMenuRef} className="relative">
							<Button
								variant="ghost"
								size="icon"
								aria-label={m.theme_toggle()}
								aria-expanded={isThemeMenuOpen}
								onClick={toggleThemeMenu}
							>
								<SunIcon className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<MoonIcon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							</Button>
							{isThemeMenuOpen ? (
								<Suspense fallback={null}>
									<HeaderThemeMenu
										themeMode={themeMode}
										onThemeChange={handleThemeChange}
									/>
								</Suspense>
							) : null}
						</div>
						<div className="hidden sm:block">
							<ParaglideLocaleSwitcher />
						</div>
					</nav>
				</div>
			</header>

			{isMobileNavOpen ? (
				<Suspense fallback={null}>
					<HeaderMobileNav
						closeMobileNav={closeMobileNav}
						getNavLabel={getNavLabel}
						navLinks={navLinks}
					/>
				</Suspense>
			) : null}
		</>
	);
}
