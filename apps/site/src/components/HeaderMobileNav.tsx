import { Link } from "@tanstack/react-router";
import { GithubIcon, XIcon } from "@/components/icons/shell";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import ParaglideLocaleSwitcher from "./LocaleSwitcher";

const shellIconButtonClassName =
	"inline-flex size-9 shrink-0 items-center justify-center rounded-md outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-accent/50";

export function HeaderMobileNav({
	closeMobileNav,
	getNavLabel,
	navLinks,
}: {
	closeMobileNav: () => void;
	getNavLabel: (key: string) => string;
	navLinks: ReadonlyArray<{ to: string; labelKey: string }>;
}) {
	return (
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
					<button
						type="button"
						className={cn(shellIconButtonClassName)}
						aria-label="Close menu"
						onClick={closeMobileNav}
					>
						<XIcon className="size-4" />
					</button>
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
	);
}
