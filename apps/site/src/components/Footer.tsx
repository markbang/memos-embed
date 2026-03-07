import { Link } from "@tanstack/react-router";
import { ExternalLink, Github, Package } from "lucide-react";
import { m } from "@/paraglide/messages";

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
	const productLinks = [
		{ to: "/", label: m.footer_home() },
		{ to: "/docs", label: m.footer_docs() },
		{ to: "/playground", label: m.footer_playground() },
	];

	return (
		<footer className="border-t bg-muted/20">
			<div className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-[1.3fr_0.7fr]">
				<div className="space-y-4">
					<div className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
						{m.footer_badge()}
					</div>
					<div className="space-y-2">
						<h2 className="text-xl font-semibold">{m.footer_title()}</h2>
						<p className="max-w-xl text-sm text-muted-foreground">
							{m.footer_desc()}
						</p>
					</div>
				</div>

				<div className="grid gap-8 sm:grid-cols-2">
					<div className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
							{m.footer_site()}
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
							{m.footer_resources()}
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
					<p>{m.footer_copyright({ year: String(currentYear) })}</p>
					<p>{m.footer_built_for()}</p>
				</div>
			</div>
		</footer>
	);
}
