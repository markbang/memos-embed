import { Link } from "@tanstack/react-router";
import { ExternalLink, Github, Package } from "lucide-react";

const productLinks = [
	{ to: "/", label: "Home" },
	{ to: "/docs", label: "Documentation" },
	{ to: "/playground", label: "Playground" },
];

const resourceLinks = [
	{
		href: "https://github.com/markbang/memos-embed",
		label: "GitHub",
		icon: Github,
	},
	{
		href: "https://www.npmjs.com/package/memos-embed",
		label: "npm",
		icon: Package,
	},
];

const currentYear = new Date().getFullYear();

export default function Footer() {
	return (
		<footer className="border-t bg-muted/20">
			<div className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-[1.3fr_0.7fr]">
				<div className="space-y-4">
					<div className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
						Open-source Memos embeds
					</div>
					<div className="space-y-2">
						<h2 className="text-xl font-semibold">
							Ship polished memo embeds faster
						</h2>
						<p className="max-w-xl text-sm text-muted-foreground">
							Use the hosted playground to tune your embed, then copy the
							iframe, Web Component, or React snippet that fits your stack.
						</p>
					</div>
				</div>

				<div className="grid gap-8 sm:grid-cols-2">
					<div className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
							Site
						</h3>
						<ul className="space-y-2 text-sm">
							{productLinks.map((link) => (
								<li key={link.to}>
									<Link
										to={link.to}
										className="transition-colors hover:text-foreground text-muted-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
							Resources
						</h3>
						<ul className="space-y-2 text-sm">
							{resourceLinks.map((link) => {
								const Icon = link.icon;
								return (
									<li key={link.href}>
										<a
											href={link.href}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
										>
											<Icon className="size-4" />
											<span>{link.label}</span>
											<ExternalLink className="size-3.5" />
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
			<div className="border-t">
				<div className="container mx-auto flex flex-col gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>© {currentYear} Memos Embed.</p>
					<p>Built for blogs, changelogs, docs, and product updates.</p>
				</div>
			</div>
		</footer>
	);
}
