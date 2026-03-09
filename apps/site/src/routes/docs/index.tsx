import { createFileRoute } from "@tanstack/react-router";
import { type ThemePresetName, themePresets } from "memos-embed";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { buildPageHead } from "@/lib/site-meta";

export const Route = createFileRoute("/docs/")({
	component: DocsComponent,
	head: () =>
		buildPageHead({
			title: "Documentation",
			description:
				"Learn how to ship Memos embeds as server-rendered HTML, iframe routes, Web Components, or React components.",
		}),
});

const themeOptions = (Object.keys(themePresets) as ThemePresetName[]).map(
	(name) => themePresets[name],
);

const repoExampleBaseUrl =
	"https://github.com/markbang/memos-embed/tree/main/examples";

const integrationGuides = [
	{
		title: "Next.js App Router",
		description:
			"Fetch memo data on the server, pass serialized memo props into the React wrapper, and avoid client-side waterfalls.",
		href: `${repoExampleBaseUrl}/next-mdx`,
		label: "Open Next.js example",
	},
	{
		title: "MDX component pattern",
		description:
			"Create a reusable MemoCard component for long-form posts so authors can embed notes with a single tag.",
		href: `${repoExampleBaseUrl}/mdx-components`,
		label: "Open MDX example",
	},
	{
		title: "Astro blog",
		description:
			"Render memo cards inside Astro pages and MDX content while keeping styling aligned with your site tokens.",
		href: `${repoExampleBaseUrl}/astro-blog`,
		label: "Open Astro example",
	},
	{
		title: "Static HTML / CMS",
		description:
			"Drop in an iframe or Web Component when you do not control a React build pipeline.",
		href: `${repoExampleBaseUrl}/static-html`,
		label: "Open static example",
	},
] as const;

const customThemeSnippet = `import { extendTheme } from 'memos-embed'

const blogTheme = extendTheme('minimal', {
  fontFamily: 'inherit',
  radius: 'var(--radius)',
  tokens: {
    background: 'var(--card)',
    foreground: 'var(--card-foreground)',
    mutedForeground: 'var(--muted-foreground)',
    border: 'var(--border)',
    accent: 'var(--primary)',
    accentForeground: 'var(--primary-foreground)',
    codeBackground: 'var(--muted)',
  },
})`;

const webComponentStylingSnippet = `<memos-embed
  base-url="https://demo.usememos.com/api/v1"
  memo-id="1"
  include-styles="false"
></memos-embed>

<style>
  memos-embed::part(container) {
    border: 1px solid var(--border);
    border-radius: 24px;
    background: var(--card);
  }

  memos-embed::part(user-name) {
    color: var(--card-foreground);
  }
</style>`;

export function DocsPageContent() {
	return (
		<div className="container mx-auto space-y-8 px-4 py-10">
			<section className="max-w-3xl space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
				<p className="text-lg text-muted-foreground">
					Memos Embed gives you three ways to ship beautiful memo cards:
					server-rendered HTML snippets, a React component, and a Web Component.
				</p>
				<div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
					<a
						href="/playground"
						className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors hover:text-foreground"
					>
						Open the playground
					</a>
					<a
						href="https://www.npmjs.com/package/memos-embed"
						target="_blank"
						rel="noreferrer"
						className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors hover:text-foreground"
					>
						View npm package
					</a>
				</div>
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
							title="Multiple memos on one page"
							code={`import { fetchMemos, renderMemoListHtmlSnippet } from 'memos-embed'

const memos = await fetchMemos({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoIds: ['1', '2', '3'],
})

const html = renderMemoListHtmlSnippet(memos, {
  layout: 'stack',
  gap: '20px',
  theme: 'paper',
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
  linkTarget="_blank"
  showAttachments
  showReactions
/>`}
						/>
						<DocSection
							title="Pre-fetched React data"
							code={`import { fetchMemo } from 'memos-embed'
import { MemoEmbed } from '@memos-embed/react'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

<MemoEmbed memo={memo} linkTarget="_blank" />`}
						/>
						<DocSection
							title="Web Component"
							code={`pnpm add @memos-embed/wc

import { defineMemosEmbedElement } from '@memos-embed/wc'

defineMemosEmbedElement()

<memos-embed
  base-url="https://demo.usememos.com/api/v1"
  memo-id="1"
  link-target="_blank"
></memos-embed>`}
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
							<li>
								• Richer markdown rendering with headings, task lists, quotes,
								and fenced code blocks.
							</li>
							<li>
								• Image attachments render previews instead of plain file links.
							</li>
							<li>• Reactions are grouped into compact count badges.</li>
							<li>
								• The playground now supports shareable URLs, link-target
								tuning, copy-to-clipboard snippets, and auto-resizing iframe
								code.
							</li>
							<li>
								• React and Web Component wrappers cancel stale fetches for
								safer updates, and React can render pre-fetched memo data
								without a client-side waterfall.
							</li>
							<li>
								• `extendTheme()` and bring-your-own-style controls make it
								easier to match personal blogs and docs sites.
							</li>
							<li>
								• `fetchMemos()` and `renderMemoListHtmlSnippet()` help note
								roundups and weekly digests render multiple memos with shared
								styles.
							</li>
							<li>
								• Iframe embeds can now resize automatically through a
								postMessage handshake.
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Rendering Options</CardTitle>
						<CardDescription>
							Most options are shared across HTML, React, and Web Component
							entry points.
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
										type="minimal | glass | paper | midnight | terminal | custom"
										description="Switch card tone or extend a preset with blog-specific design tokens."
									/>
									<TableRow
										name="density"
										type="comfortable | compact"
										description="Adjust padding, spacing, and avatar size."
									/>
									<TableRow
										name="includeStyles"
										type="boolean"
										description="Disable the built-in style block for bring-your-own CSS setups in core, React, and Web Component flows."
									/>
									<TableRow
										name="layout / gap"
										type="stack | grid / string"
										description="Arrange multiple memos with shared list styles for roundups and archive pages."
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
							The same presets work in the playground, iframe route, and npm
							APIs.
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
										<ColorSwatch
											color={theme.tokens.background}
											label="Background"
										/>
										<ColorSwatch color={theme.tokens.accent} label="Accent" />
										<ColorSwatch
											color={theme.tokens.codeBackground}
											label="Code"
										/>
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Match your blog theme</CardTitle>
						<CardDescription>
							Use CSS variables or design tokens from your site to keep embeds
							visually consistent.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<pre className="overflow-auto rounded-lg border bg-muted/40 p-4 text-sm">
							<code>{customThemeSnippet}</code>
						</pre>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								• Use `extendTheme()` when you want blog colors, radius, and
								font choices without rewriting the renderer.
							</li>
							<li>
								• Pass `includeStyles={false}` in React when you want to own the
								entire CSS layer yourself.
							</li>
							<li>
								• Pre-fetched `memo` props are ideal for server-rendered blogs,
								MDX pages, and content collections.
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Style the Web Component from your site</CardTitle>
						<CardDescription>
							Lean on shadow DOM isolation by default, then opt into
							`::part(...)` when you want finer control.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<pre className="overflow-auto rounded-lg border bg-muted/40 p-4 text-sm">
							<code>{webComponentStylingSnippet}</code>
						</pre>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								• Keep built-in styles when you just need a few targeted tweaks.
							</li>
							<li>
								• Set `include-styles="false"` for fully custom component
								shells.
							</li>
							<li>
								• Use `link-target` when blog links should stay in-page or open
								in a new tab.
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			<section className="space-y-4">
				<div className="max-w-2xl space-y-2">
					<h2 className="text-3xl font-semibold tracking-tight">
						Blog Integration Guides
					</h2>
					<p className="text-muted-foreground">
						Start from a copy-paste example that matches your publishing stack,
						then adapt the theme and rendering options to your blog.
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{integrationGuides.map((guide) => (
						<Card key={guide.title} className="h-full">
							<CardHeader>
								<CardTitle>{guide.title}</CardTitle>
								<CardDescription>{guide.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<a
									href={guide.href}
									target="_blank"
									rel="noreferrer"
									className="inline-flex rounded-md border border-border/70 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
								>
									{guide.label}
								</a>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}

function DocsComponent() {
	return <DocsPageContent />;
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
