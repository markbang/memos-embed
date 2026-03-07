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
import { m } from "@/paraglide/messages";

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
	labelKey: string;
	variant?: "default" | "outline";
};

type LinkRenderer = (props: LinkButton) => ReactNode;

const defaultRenderLink: LinkRenderer = ({
	to,
	labelKey,
	variant = "default",
}) => (
	<Button asChild size="lg" variant={variant}>
		<a href={to}>{labelKey}</a>
	</Button>
);

const integrationCardCodes = {
	iframe: `<iframe
  src="https://your-site.com/embed/1?..."
  title="memos-embed"
  loading="lazy"
/>`,
	wc: `<script type="module"
  src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed memo-id="1" />`,
	react: `import { MemoEmbed } from "@memos-embed/react";

<MemoEmbed
  baseUrl="https://demo.usememos.com/api/v1"
  memoId="1"
/>`,
} as const;

export function HomePageContent({
	renderLink = defaultRenderLink,
}: {
	renderLink?: LinkRenderer;
}) {
	const featurePills = [
		m.pill_iframe(),
		m.pill_react(),
		m.pill_wc(),
		m.pill_themes(),
		m.pill_resize(),
	];

	const stats = [
		{ label: m.stat_modes(), value: "3" },
		{ label: m.stat_themes(), value: "5" },
		{ label: m.stat_setup(), value: m.stat_setup_value() },
	];

	const featureCards = [
		{
			icon: <Layout className="h-12 w-12 text-primary" />,
			title: m.feature_beautiful_title(),
			description: m.feature_beautiful_desc(),
		},
		{
			icon: <Code className="h-12 w-12 text-primary" />,
			title: m.feature_developer_title(),
			description: m.feature_developer_desc(),
		},
		{
			icon: <Zap className="h-12 w-12 text-primary" />,
			title: m.feature_performance_title(),
			description: m.feature_performance_desc(),
		},
	];

	const integrationCards = [
		{
			title: m.integration_iframe(),
			bestFor: m.integration_iframe_best(),
			body: m.integration_iframe_body(),
			code: integrationCardCodes.iframe,
		},
		{
			title: m.integration_wc(),
			bestFor: m.integration_wc_best(),
			body: m.integration_wc_body(),
			code: integrationCardCodes.wc,
		},
		{
			title: m.integration_react(),
			bestFor: m.integration_react_best(),
			body: m.integration_react_body(),
			code: integrationCardCodes.react,
		},
	];

	const heroButtons: readonly LinkButton[] = [
		{ to: "/playground", labelKey: m.hero_btn_playground() },
		{ to: "/docs", labelKey: m.hero_btn_docs(), variant: "outline" },
	];

	return (
		<div className="bg-background">
			<section className="border-b bg-gradient-to-b from-muted/30 via-background to-background px-6 py-20 sm:py-24">
				<div className="container mx-auto grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="space-y-8">
						<div className="space-y-4">
							<div className="inline-flex rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
								{m.hero_badge()}
							</div>
							<h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
								{m.hero_title_main()}{" "}
								<span className="text-primary">{m.hero_title_highlight()}</span>
							</h1>
							<p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
								{m.hero_description()}
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
							<CardTitle>{m.hero_card_title()}</CardTitle>
							<CardDescription>
								{m.hero_card_desc()}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="rounded-xl border bg-muted/40 p-4 font-mono text-xs leading-6 text-muted-foreground sm:text-sm">
								<div className="mb-3 flex items-center justify-between">
									<span className="font-semibold text-foreground">
										{m.hero_card_snippet_label()}
									</span>
									<span className="rounded-full bg-background px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
										{m.hero_card_snippet_badge()}
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
									{m.hero_card_why_title()}
								</p>
								<ul className="mt-2 space-y-2">
									<li>
										• {m.hero_card_why_1()}
									</li>
									<li>
										• {m.hero_card_why_2()}
									</li>
									<li>
										• {m.hero_card_why_3()}
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
							{m.section_integration_title()}
						</h2>
						<p className="text-muted-foreground">
							{m.section_integration_desc()}
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
							{m.section_why_title()}
						</h2>
						<p className="text-muted-foreground">
							{m.section_why_desc()}
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
									{m.cta_title()}
								</h2>
								<p className="text-muted-foreground">
									{m.cta_desc()}
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
			renderLink={({ to, labelKey, variant = "default" }) => (
				<Button asChild size="lg" variant={variant}>
					<Link to={to}>{labelKey}</Link>
				</Button>
			)}
		/>
	);
}
