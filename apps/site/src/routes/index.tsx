import { createFileRoute, Link } from "@tanstack/react-router";
import { Code, Layout, Zap } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { buildPageHead } from "@/lib/site-meta";

export const Route = createFileRoute("/")({
	component: App,
	head: () =>
		buildPageHead({
			description:
				"Customize polished Memos embeds with shareable playground presets, then ship them as iframe, Web Component, or React snippets.",
		}),
});

type LinkButton = {
	to: string;
	label: string;
	variant?: "default" | "outline";
};

type LinkRenderer = (props: LinkButton) => ReactNode;

const defaultRenderLink: LinkRenderer = ({
	to,
	label,
	variant = "default",
}) => (
	<Button asChild size="lg" variant={variant}>
		<a href={to}>{label}</a>
	</Button>
);

const featurePills = [
	"Iframe embeds",
	"React component",
	"Web Component",
	"Theme presets",
	"Auto-resize support",
] as const;

const stats = [
	{ label: "Integration modes", value: "3" },
	{ label: "Theme presets", value: "5" },
	{ label: "Copy-paste setup", value: "< 5 min" },
] as const;

const featureCards = [
	{
		icon: <Layout className="h-12 w-12 text-primary" />,
		title: "Beautiful Embeds",
		description:
			"Give memo cards a polished surface with themes, density presets, grouped reactions, and image previews.",
	},
	{
		icon: <Code className="h-12 w-12 text-primary" />,
		title: "Developer Friendly",
		description:
			"Start with an iframe, then move to a Web Component or React wrapper when you need tighter integration.",
	},
	{
		icon: <Zap className="h-12 w-12 text-primary" />,
		title: "Performance First",
		description:
			"Use shareable playground presets, lightweight rendering helpers, and auto-resizing embeds without custom glue code.",
	},
] as const;

const integrationCards = [
	{
		title: "Iframe",
		bestFor: "Docs, CMS pages, and no-build environments",
		body: "Host the embed route once and drop in responsive iframe markup anywhere.",
		code: `<iframe
  src="https://your-site.com/embed/1?..."
  title="memos-embed"
  loading="lazy"
/>`,
	},
	{
		title: "Web Component",
		bestFor: "Static sites, Astro, Eleventy, and progressive enhancement",
		body: "Register a custom element and keep integration as simple as HTML attributes.",
		code: `<script type="module"
  src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed memo-id="1" />`,
	},
	{
		title: "React",
		bestFor: "Dashboards, product surfaces, and app shells",
		body: "Reach for the React wrapper when you want stateful configuration and callbacks.",
		code: `import { MemoEmbed } from "@memos-embed/react";

<MemoEmbed
  baseUrl="https://demo.usememos.com/api/v1"
  memoId="1"
/>`,
	},
] as const;

const heroButtons: readonly LinkButton[] = [
	{ to: "/playground", label: "Open Playground" },
	{ to: "/docs", label: "Read Docs", variant: "outline" },
] as const;

export function HomePageContent({
	renderLink = defaultRenderLink,
}: {
	renderLink?: LinkRenderer;
}) {
	return (
		<div className="bg-background">
			<section className="border-b bg-gradient-to-b from-muted/30 via-background to-background px-6 py-20 sm:py-24">
				<div className="container mx-auto grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="space-y-8">
						<div className="space-y-4">
							<div className="inline-flex rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
								Open-source memo embeds
							</div>
							<h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
								Share your thoughts{" "}
								<span className="text-primary">anywhere</span>
							</h1>
							<p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
								Turn Memos posts into polished, portable cards for docs,
								changelogs, marketing pages, and product surfaces.
							</p>
						</div>

						<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
							{featurePills.map((pill) => (
								<span
									key={pill}
									className="rounded-full border border-border/70 bg-background px-3 py-1"
								>
									{pill}
								</span>
							))}
						</div>

						<div className="flex flex-wrap gap-3">
							{heroButtons.map((button) => (
								<Fragment key={button.to}>{renderLink(button)}</Fragment>
							))}
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
							{stats.map((stat) => (
								<div
									key={stat.label}
									className="rounded-xl border bg-card px-4 py-4 shadow-sm"
								>
									<p className="text-2xl font-semibold">{stat.value}</p>
									<p className="text-sm text-muted-foreground">{stat.label}</p>
								</div>
							))}
						</div>
					</div>

					<Card className="border-border/70 bg-card/80 shadow-lg">
						<CardHeader>
							<CardTitle>Copy a working embed in minutes</CardTitle>
							<CardDescription>
								Start from the hosted playground, tune the output, and share the
								exact configuration with your team.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="rounded-xl border bg-muted/40 p-4 font-mono text-xs leading-6 text-muted-foreground sm:text-sm">
								<div className="mb-3 flex items-center justify-between">
									<span className="font-semibold text-foreground">
										Iframe snippet
									</span>
									<span className="rounded-full bg-background px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
										Auto-resize ready
									</span>
								</div>
								<pre className="overflow-x-auto">
									<code>{`<iframe
  src="https://your-site.com/embed/1?theme=midnight"
  title="memos-embed"
  loading="lazy"
></iframe>`}</code>
								</pre>
							</div>
							<div className="rounded-xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
								<p className="font-medium text-foreground">
									Why teams keep the playground open
								</p>
								<ul className="mt-2 space-y-2">
									<li>
										• Compare iframe, Web Component, and React output
										side-by-side.
									</li>
									<li>
										• Share the full configuration in the URL for async reviews.
									</li>
									<li>
										• Copy production-ready snippets instead of hand-writing
										params.
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			<section className="px-6 py-20">
				<div className="container mx-auto space-y-8">
					<div className="max-w-2xl space-y-3">
						<h2 className="text-3xl font-semibold tracking-tight">
							Choose the integration that fits your stack
						</h2>
						<p className="text-muted-foreground">
							Start simple with an iframe, then graduate to a Web Component or
							React wrapper when you need tighter control.
						</p>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						{integrationCards.map((card) => (
							<Card key={card.title} className="h-full">
								<CardHeader>
									<CardTitle>{card.title}</CardTitle>
									<CardDescription>{card.bestFor}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm text-muted-foreground">{card.body}</p>
									<pre className="overflow-x-auto rounded-xl border bg-muted/40 p-4 text-xs leading-6 text-muted-foreground">
										<code>{card.code}</code>
									</pre>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="bg-muted/30 px-6 py-20">
				<div className="container mx-auto space-y-8">
					<div className="max-w-2xl space-y-3">
						<h2 className="text-3xl font-semibold tracking-tight">
							Why teams pick Memos Embed
						</h2>
						<p className="text-muted-foreground">
							Designed for product updates, personal publishing, and internal
							docs that still need a production-ready presentation layer.
						</p>
					</div>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{featureCards.map((feature) => (
							<div
								key={feature.title}
								className="rounded-lg border bg-card p-6 shadow-sm"
							>
								<div className="mb-4">{feature.icon}</div>
								<h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="px-6 py-20">
				<div className="container mx-auto">
					<div className="rounded-3xl border bg-card px-6 py-10 shadow-sm sm:px-10">
						<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
							<div className="max-w-2xl space-y-3">
								<h2 className="text-3xl font-semibold tracking-tight">
									Prototype fast, then ship with confidence
								</h2>
								<p className="text-muted-foreground">
									Open the playground to generate a shareable configuration,
									then use the docs to move that setup into production.
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								{heroButtons.map((button) => (
									<Fragment key={button.to}>{renderLink(button)}</Fragment>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

function App() {
	return (
		<HomePageContent
			renderLink={({ to, label, variant = "default" }) => (
				<Button asChild size="lg" variant={variant}>
					<Link to={to}>{label}</Link>
				</Button>
			)}
		/>
	);
}
