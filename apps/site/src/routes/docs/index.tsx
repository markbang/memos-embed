import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/docs/")({
	component: DocsComponent,
});

function DocsComponent() {
	return (
		<div className="container mx-auto py-10 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-4xl font-bold">Documentation</CardTitle>
					<CardDescription>
						Learn how to use Memos Embed in your projects.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="prose dark:prose-invert max-w-none">
						<p>
							Memos Embed allows you to easily embed memos from your Memos
							instance into any website.
						</p>
						<h3>Quick Start</h3>
						<pre className="bg-muted p-4 rounded-md overflow-auto">
							<code>
								{`import { MemoEmbed } from '@memos-embed/react';

<MemoEmbed
  baseUrl="https://demo.usememos.com/api/v1"
  memoId="1"
/>`}
							</code>
						</pre>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
