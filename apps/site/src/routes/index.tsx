import { createFileRoute, Link } from "@tanstack/react-router";
import { Code, Layout, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: App });

type LinkRenderer = (props: { to: string; children: ReactNode }) => ReactNode;

const defaultRenderLink: LinkRenderer = ({ to, children }) => (
	<a href={to}>{children}</a>
);

const features = [
	{
		icon: <Layout className="h-12 w-12 text-primary" />,
		title: "Beautiful Embeds",
		description:
			"Embed your Memos seamlessly into any website with themes that adapt to your design.",
	},
	{
		icon: <Code className="h-12 w-12 text-primary" />,
		title: "Developer Friendly",
		description:
			"Available as an iframe, Web Component, or React Component. Type-safe and easy to use.",
	},
	{
		icon: <Zap className="h-12 w-12 text-primary" />,
		title: "Performance First",
		description:
			"Lightweight and optimized for fast loading times. Built with modern web standards.",
	},
];

export function HomePageContent({
	renderLink = defaultRenderLink,
}: {
	renderLink?: LinkRenderer;
}) {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
			<section className="flex flex-1 flex-col items-center justify-center space-y-8 bg-background px-6 py-20 text-center">
				<div className="max-w-3xl space-y-4">
					<h1 className="text-4xl font-bold tracking-tight md:text-6xl">
						Share your thoughts <br />
						<span className="text-primary">anywhere</span>
					</h1>
					<p className="mx-auto max-w-2xl text-xl text-muted-foreground">
						The easiest way to embed Memos in your website, blog, or
						documentation. Customizable, responsive, and beautiful.
					</p>
				</div>
				<div className="flex gap-4">
					{renderLink({
						to: "/docs",
						children: <Button size="lg">Get Started</Button>,
					})}
					{renderLink({
						to: "/playground",
						children: (
							<Button size="lg" variant="outline">
								Try Playground
							</Button>
						),
					})}
				</div>
			</section>

			<section className="bg-muted/30 px-6 py-20">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="rounded-lg border bg-card p-6 shadow-sm"
							>
								<div className="mb-4">{feature.icon}</div>
								<h2 className="mb-2 text-xl font-semibold">{feature.title}</h2>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

function App() {
	return (
		<HomePageContent
			renderLink={({ to, children }) => <Link to={to}>{children}</Link>}
		/>
	);
}
