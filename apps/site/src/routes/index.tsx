import { createFileRoute, Link } from "@tanstack/react-router";
import { Code, Layout, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const features = [
		{
			icon: <Layout className="w-12 h-12 text-primary" />,
			title: "Beautiful Embeds",
			description:
				"Embed your Memos seamlessly into any website with themes that adapt to your design.",
		},
		{
			icon: <Code className="w-12 h-12 text-primary" />,
			title: "Developer Friendly",
			description:
				"Available as an iframe, Web Component, or React Component. Type-safe and easy to use.",
		},
		{
			icon: <Zap className="w-12 h-12 text-primary" />,
			title: "Performance First",
			description:
				"Lightweight and optimized for fast loading times. Built with modern web standards.",
		},
	];

	return (
		<div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
			<section className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 bg-background">
				<div className="space-y-4 max-w-3xl">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
						Share your thoughts <br />
						<span className="text-primary">anywhere</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						The easiest way to embed Memos in your website, blog, or
						documentation. Customizable, responsive, and beautiful.
					</p>
				</div>
				<div className="flex gap-4">
					<Link to="/docs">
						<Button size="lg">Get Started</Button>
					</Link>
					<Link to="/playground">
						<Button variant="outline" size="lg">
							Try Playground
						</Button>
					</Link>
				</div>
			</section>

			<section className="py-20 px-6 bg-muted/30">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="bg-card p-6 rounded-lg border shadow-sm"
							>
								<div className="mb-4">{feature.icon}</div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
