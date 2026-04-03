import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
	component: NotFound,
});

function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
			<h1 className="text-6xl font-bold tracking-tight">404</h1>
			<p className="mt-4 text-lg text-muted-foreground">
				This page could not be found.
			</p>
			<div className="mt-8">
				<Link
					to="/"
					className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Back to Home
				</Link>
			</div>
		</div>
	);
}
