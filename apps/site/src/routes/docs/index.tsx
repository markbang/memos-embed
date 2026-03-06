import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { themePresets, type ThemePresetName } from "memos-embed";

export const Route = createFileRoute("/docs/")({
	component: DocsComponent,
});

const themeOptions = (Object.keys(themePresets) as ThemePresetName[]).map(
	(name) => themePresets[name],
);

function DocsComponent() {
	return (
		<div className="container mx-auto space-y-8 px-4 py-10">
			<section className="max-w-3xl space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
				<p className="text-lg text-muted-foreground">
					Memos Embed gives you three ways to ship beautiful memo cards:
					server-rendered HTML snippets, a React component, and a Web Component.
				</p>
			</section>

			<div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
				<Card>
					<CardHeader>
						<CardTitle>Quick Start</CardTitle>
						<CardDescription>
							Install the package that matches your stack.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<DocSection
							title="Core HTML API"
							code={`pnpm add memos-embed

import { fetchMemo, renderMemoHtmlSnippet } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

const html = renderMemoHtmlSnippet(memo, {
  theme: 'paper',
  density: 'comfortable',
  includeStyles: true,
})`}
						/>
						<DocSection
							title="React"
							code={`pnpm add @memos-embed/react

import { MemoEmbed } from '@memos-embed/react'

<MemoEmbed
  baseUrl="https://demo.usememos.com/api/v1"
  memoId="1"
  theme="glass"
  showAttachments
  showReactions
/>`}
						/>
						<DocSection
							title="Web Component"
							code={`pnpm add @memos-embed/wc

import { defineMemosEmbedElement } from '@memos-embed/wc'

defineMemosEmbedElement()`}
						/>
						<DocSection
							title="Iframe"
							code={`import { renderIframeHtml } from 'memos-embed'

const iframe = renderIframeHtml({
  embedBaseUrl: 'https://your-site.com',
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
  height: 240,
  autoResize: true,
})`}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>What’s Improved</CardTitle>
						<CardDescription>
							Recent upgrades shipped across the core library and demo site.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>• Richer markdown rendering with headings, task lists, quotes, and fenced code blocks.</li>
							<li>• Image attachments render previews instead of plain file links.</li>
							<li>• Reactions are grouped into compact count badges.</li>
							<li>• The playground now supports shareable URLs, copy-to-clipboard snippets, and auto-resizing iframe code.</li>
							<li>• React and Web Component wrappers cancel stale fetches for safer updates.</li>
							<li>• Iframe embeds can now resize automatically through a postMessage handshake.</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Rendering Options</CardTitle>
						<CardDescription>
							Most options are shared across HTML, React, and Web Component entry
							points.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead className="border-b text-muted-foreground">
									<tr>
										<th className="py-2 pr-4 font-medium">Option</th>
										<th className="py-2 pr-4 font-medium">Type</th>
										<th className="py-2 font-medium">Description</th>
									</tr>
								</thead>
								<tbody className="align-top text-muted-foreground">
									<TableRow
										name="theme"
										type="minimal | glass | paper | midnight | terminal"
										description="Switch card tone without rewriting CSS."
									/>
									<TableRow
										name="density"
										type="comfortable | compact"
										description="Adjust padding, spacing, and avatar size."
									/>
									<TableRow
										name="showMeta"
										type="boolean"
										description="Toggle author, avatar, and time metadata."
									/>
									<TableRow
										name="showTags"
										type="boolean"
										description="Hide or show memo hashtags."
									/>
									<TableRow
										name="showAttachments"
										type="boolean"
										description="Show file links and image previews."
									/>
									<TableRow
										name="showReactions"
										type="boolean"
										description="Render grouped emoji reaction chips."
									/>
									<TableRow
										name="linkTarget"
										type="_blank | _self"
										description="Control how markdown links and attachment links open."
									/>
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Theme Presets</CardTitle>
						<CardDescription>
							The same presets work in the playground, iframe route, and npm APIs.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{themeOptions.map((theme) => (
							<div
								key={theme.name}
								className="rounded-lg border p-4"
								style={{
									backgroundColor: theme.tokens.background,
									borderColor: theme.tokens.border,
									color: theme.tokens.foreground,
								}}
							>
								<div className="flex items-center justify-between gap-3">
									<div>
										<h3 className="font-semibold capitalize">{theme.name}</h3>
										<p className="text-sm opacity-80">
											Accent {theme.tokens.accent} · Radius {theme.radius}
										</p>
									</div>
									<div className="flex gap-2">
										<ColorSwatch color={theme.tokens.background} label="Background" />
										<ColorSwatch color={theme.tokens.accent} label="Accent" />
										<ColorSwatch color={theme.tokens.codeBackground} label="Code" />
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function DocSection({ title, code }: { title: string; code: string }) {
	return (
		<div className="space-y-3">
			<h2 className="text-lg font-semibold">{title}</h2>
			<pre className="overflow-auto rounded-lg border bg-muted/40 p-4 text-sm">
				<code>{code}</code>
			</pre>
		</div>
	);
}

function TableRow({
	name,
	type,
	description,
}: {
	name: string;
	type: string;
	description: string;
}) {
	return (
		<tr className="border-b last:border-b-0">
			<td className="py-3 pr-4 font-mono text-foreground">{name}</td>
			<td className="py-3 pr-4">{type}</td>
			<td className="py-3">{description}</td>
		</tr>
	);
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
	return (
		<div className="flex flex-col items-center gap-1 text-xs">
			<span
				className="size-6 rounded-full border"
				style={{ backgroundColor: color }}
				title={`${label}: ${color}`}
			/>
			<span className="text-[10px] opacity-75">{label}</span>
		</div>
	);
}
