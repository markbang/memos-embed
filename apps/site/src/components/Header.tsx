import { Link } from "@tanstack/react-router";
import { Check, Github, Menu, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	applySiteTheme,
	readStoredSiteTheme,
	SITE_THEME_MEDIA_QUERY,
	type SiteThemeMode,
} from "@/lib/site-theme";
import ParaglideLocaleSwitcher from "./LocaleSwitcher";

const navLinks = [
	{ to: "/", label: "Home" },
	{ to: "/docs", label: "Docs" },
	{ to: "/playground", label: "Playground" },
] as const;

const themeOptions: Array<{
	value: SiteThemeMode;
	label: string;
	icon: typeof Sun;
}> = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "System", icon: Monitor },
];

export default function Header() {
	const [themeMode, setThemeMode] = useState<SiteThemeMode>(() =>
		typeof window === "undefined"
			? "system"
			: readStoredSiteTheme(window.localStorage),
	);

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

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
			<div className="container mx-auto flex h-14 items-center gap-3 px-4">
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							aria-label="Open navigation menu"
						>
							<Menu className="size-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="pr-0">
						<SheetHeader>
							<SheetTitle>Memos Embed</SheetTitle>
							<SheetDescription>
								Explore the docs, playground, and open-source packages.
							</SheetDescription>
						</SheetHeader>
						<nav className="mt-4 flex flex-col gap-4">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="block px-2 py-1 text-lg"
								>
									{link.label}
								</Link>
							))}
						</nav>
						<Separator className="my-4" />
						<div className="space-y-4 px-2">
							<ParaglideLocaleSwitcher />
							<a
								href="https://github.com/markbang/memos-embed"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<Github className="size-4" />
								GitHub
							</a>
						</div>
					</SheetContent>
				</Sheet>

				<div className="flex min-w-0 flex-1 items-center gap-4">
					<Link to="/" className="flex min-w-0 items-center gap-3">
						<div className="hidden rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
							Open source
						</div>
						<div className="min-w-0">
							<p className="truncate font-semibold">Memos Embed</p>
							<p className="hidden text-xs text-muted-foreground md:block">
								Embeddable memo cards for Memos
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
								{link.label}
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
							<Github className="size-4" />
						</a>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" aria-label="Toggle theme">
								<Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{themeOptions.map((option) => {
								const Icon = option.icon;
								const isActive = themeMode === option.value;
								return (
									<DropdownMenuItem
										key={option.value}
										onClick={() => setThemeMode(option.value)}
										className="justify-between gap-6"
									>
										<span className="inline-flex items-center gap-2">
											<Icon className="size-4" />
											{option.label}
										</span>
										{isActive ? <Check className="size-4" /> : null}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
					<div className="hidden sm:block">
						<ParaglideLocaleSwitcher />
					</div>
				</nav>
			</div>
		</header>
	);
}
