import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
	CheckIcon,
	GithubIcon,
	MenuIcon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
	XIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	applySiteTheme,
	readStoredSiteTheme,
	SITE_THEME_MEDIA_QUERY,
	type SiteThemeMode,
} from "@/lib/site-theme";
import { m } from "@/paraglide/messages";
import ParaglideLocaleSwitcher from "./LocaleSwitcher";

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

const themeOptions: Array<{
	value: SiteThemeMode;
	labelKey: string;
	icon: typeof SunIcon;
}> = [
	{ value: "light", labelKey: "theme_light", icon: SunIcon },
	{ value: "dark", labelKey: "theme_dark", icon: MoonIcon },
	{ value: "system", labelKey: "theme_system", icon: MonitorIcon },
];

const getThemeLabel = (key: string) => {
	const labels: Record<string, () => string> = {
		theme_light: () => m.theme_light(),
		theme_dark: () => m.theme_dark(),
		theme_system: () => m.theme_system(),
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
								<div className="absolute right-0 top-full z-50 mt-2 min-w-40 overflow-hidden rounded-md border bg-popover p-1 shadow-md">
									{themeOptions.map((option) => {
										const Icon = option.icon;
										const isActive = themeMode === option.value;
										return (
											<button
												type="button"
												key={option.value}
												onClick={() => handleThemeChange(option.value)}
												className="focus:bg-accent focus:text-accent-foreground flex w-full items-center justify-between gap-6 rounded-sm px-2 py-1.5 text-sm outline-hidden"
											>
												<span className="inline-flex items-center gap-2">
													<Icon className="size-4" />
													{getThemeLabel(option.labelKey)}
												</span>
												{isActive ? <CheckIcon className="size-4" /> : null}
											</button>
										);
									})}
								</div>
							) : null}
						</div>
						<div className="hidden sm:block">
							<ParaglideLocaleSwitcher />
						</div>
					</nav>
				</div>
			</header>

			{isMobileNavOpen ? (
				<>
					<button
						type="button"
						className="fixed inset-0 z-40 bg-black/50 md:hidden"
						aria-label="Close menu"
						onClick={closeMobileNav}
					/>
					<div className="fixed inset-y-0 left-0 z-50 flex w-3/4 max-w-sm flex-col gap-4 border-r bg-background shadow-lg md:hidden">
						<div className="flex items-start justify-between p-4">
							<div className="space-y-1 pr-4">
								<p className="font-semibold">Memos Embed</p>
								<p className="text-sm text-muted-foreground">
									{m.nav_explore_desc()}
								</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Close menu"
								onClick={closeMobileNav}
							>
								<XIcon className="size-4" />
							</Button>
						</div>
						<nav className="flex flex-col gap-4 px-4">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="block px-2 py-1 text-lg"
									onClick={closeMobileNav}
								>
									{getNavLabel(link.labelKey)}
								</Link>
							))}
						</nav>
						<div className="mx-4 h-px bg-border" />
						<div className="space-y-4 px-4 pb-4">
							<ParaglideLocaleSwitcher />
							<a
								href="https://github.com/markbang/memos-embed"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<GithubIcon className="size-4" />
								GitHub
							</a>
						</div>
					</div>
				</>
			) : null}
		</>
	);
}
