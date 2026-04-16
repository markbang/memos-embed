import { type ThemePresetName, themePresets } from "memos-embed";
import { useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const copyScript = `
(function() {
  function initCopyButtons() {
    document.querySelectorAll('pre[data-copyable="true"]').forEach(function(pre) {
      if (pre.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn absolute right-2 top-2 rounded border border-border bg-background px-2 py-1 text-xs opacity-0 transition-opacity hover:bg-accent focus:opacity-100 group-hover:opacity-100';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.setAttribute('type', 'button');
      btn.onclick = function() {
        var code = pre.querySelector('code');
        if (!code) return;
        navigator.clipboard.writeText(code.innerText).then(function() {
          btn.textContent = 'Copied!';
          setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
        });
      };
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
`;

const initCopyButtons = () => {
	if (typeof window === "undefined") return;
	document
		.querySelectorAll('pre[data-copyable="true"]')
		.forEach((pre: Element) => {
			const p = pre as HTMLElement;
			if (p.querySelector(".copy-btn")) return;
			const btn = document.createElement("button");
			btn.className =
				"copy-btn absolute right-2 top-2 rounded border border-border bg-background px-2 py-1 text-xs opacity-0 transition-opacity hover:bg-accent focus:opacity-100 group-hover:opacity-100";
			btn.textContent = "Copy";
			btn.setAttribute("aria-label", "Copy code");
			btn.setAttribute("type", "button");
			btn.onclick = () => {
				const code = p.querySelector("code");
				if (!code) return;
				navigator.clipboard.writeText(code.innerText).then(() => {
					btn.textContent = "Copied!";
					setTimeout(() => {
						btn.textContent = "Copy";
					}, 2000);
				});
			};
			p.style.position = "relative";
			p.appendChild(btn);
		});
};

const themeOptions = (Object.keys(themePresets) as ThemePresetName[]).map(
	(name) => themePresets[name],
);

const repoExampleBaseUrl =
	"https://github.com/markbang/memos-embed/tree/main/examples";

const packageRegistryLinks = [
	{
		label: "View core npm package",
		href: "https://www.npmjs.com/package/memos-embed",
	},
	{
		label: "View React npm package",
		href: "https://www.npmjs.com/package/@memos-embed/react",
	},
	{
		label: "View Web Component npm package",
		href: "https://www.npmjs.com/package/@memos-embed/wc",
	},
] as const;

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

const entryPoints = [
	{
		name: "Core HTML API",
		install: "pnpm add memos-embed",
		bestFor:
			"SSR/SSG pipelines, MDX blogs, custom render flows, and iframe helpers.",
		startHref:
			"https://github.com/markbang/memos-embed/tree/main/packages/memos-embed#readme",
		startLabel: "Open core package docs",
	},
	{
		name: "React",
		install: "pnpm add @memos-embed/react",
		bestFor:
			"Next.js, TanStack Start, Astro islands, and React pages that want SSR-ready embeds.",
		startHref: `${repoExampleBaseUrl}/next-mdx`,
		startLabel: "Open React example",
	},
	{
		name: "Web Component",
		install: "pnpm add @memos-embed/wc",
		bestFor:
			"Static sites, CMS pages, and custom-element-friendly apps without a React runtime.",
		startHref: `${repoExampleBaseUrl}/static-html`,
		startLabel: "Open static example",
	},
	{
		name: "Iframe helpers",
		install: "pnpm add memos-embed",
		bestFor:
			"Copy-paste embeds, stricter style isolation, and platforms where raw HTML snippets are awkward.",
		startHref: `${repoExampleBaseUrl}/static-html`,
		startLabel: "Open iframe example",
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
	useEffect(() => {
		if (typeof window === "undefined") return;
		initCopyButtons();
	}, []);

	return (
		<div className="container mx-auto space-y-8 px-4 py-10">
			{/* Script tag for prerendered static pages */}
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Static script for client-side copy functionality */}
			<script dangerouslySetInnerHTML={{ __html: copyScript }} />

			<section className="max-w-3xl space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
				<p className="text-lg text-muted-foreground">
					Memos Embed ships flexible entry points for memo cards: core HTML
					helper APIs, React components, a Web Component, and iframe helpers.
				</p>
				<div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
					<a
						href="/playground"
						className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors hover:text-foreground"
					>
						Open the playground
					</a>
					<a
						href={repoExampleBaseUrl}
						target="_blank"
						rel="noreferrer"
						className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors hover:text-foreground"
					>
						Browse example gallery
					</a>
					{packageRegistryLinks.map((pkg) => (
						<a
							key={pkg.href}
							href={pkg.href}
							target="_blank"
							rel="noreferrer"
							className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors hover:text-foreground"
						>
							{pkg.label}
						</a>
					))}
				</div>
			</section>

			<Card>
				<CardHeader>
					<CardTitle>Choose your entry point</CardTitle>
					<CardDescription>
						Start with the lowest-complexity integration that matches your
						stack, then mix in the shared core APIs if you need more control.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="border-b text-muted-foreground">
								<tr>
									<th className="py-2 pr-4 font-medium">Entry point</th>
									<th className="py-2 pr-4 font-medium">Install</th>
									<th className="py-2 pr-4 font-medium">Best for</th>
									<th className="py-2 font-medium">Start here</th>
								</tr>
							</thead>
							<tbody className="align-top text-muted-foreground">
								{entryPoints.map((entryPoint) => (
									<tr key={entryPoint.name} className="border-b last:border-0">
										<td className="py-3 pr-4 font-medium text-foreground">
											{entryPoint.name}
										</td>
										<td className="py-3 pr-4">
											<code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">
												{entryPoint.install}
											</code>
										</td>
										<td className="py-3 pr-4">{entryPoint.bestFor}</td>
										<td className="py-3">
											<a
												href={entryPoint.startHref}
												target="_blank"
												rel="noreferrer"
												className="text-sm font-medium text-foreground underline underline-offset-4"
											>
												{entryPoint.startLabel}
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="text-sm text-muted-foreground">
						Tip: the React and Web Component packages both sit on top of the
						shared <code>memos-embed</code> core, so you can mix wrappers,
						prefetched memo data, and iframe helpers in the same project.
					</p>
				</CardContent>
			</Card>

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
							title="React memo roundup"
							code={`import { MemoEmbedList } from '@memos-embed/react'

<MemoEmbedList
  baseUrl="https://demo.usememos.com/api/v1"
  memoIds={["1", "2", "3"]}
  layout="stack"
  gap="20px"
  theme="paper"
/>`}
						/>
						<DocSection
							title="Shared React memo client"
							code={`import { createMemoClient } from 'memos-embed'
import { MemoClientProvider, MemoEmbed, MemoEmbedList } from '@memos-embed/react'

const client = createMemoClient()

<MemoClientProvider client={client}>
  <MemoEmbed baseUrl="https://demo.usememos.com/api/v1" memoId="1" />
  <MemoEmbedList baseUrl="https://demo.usememos.com/api/v1" memoIds={["2", "3"]} />
</MemoClientProvider>`}
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
								safer updates, React can render pre-fetched memo data without a
								client-side waterfall, `MemoEmbedList` helps roundup pages share
								one style block, and shared clients can dedupe fetches across a
								whole page.
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
					<CardContent className="group space-y-4">
						<pre
							data-copyable="true"
							className="relative overflow-auto rounded-lg border bg-muted/40 p-4 text-sm"
						>
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
					<CardContent className="group space-y-4">
						<pre
							data-copyable="true"
							className="relative overflow-auto rounded-lg border bg-muted/40 p-4 text-sm"
						>
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

export function DocsPage() {
	return <DocsPageContent />;
}

function DocSection({ title, code }: { title: string; code: string }) {
	return (
		<div className="group space-y-3">
			<h2 className="text-lg font-semibold">{title}</h2>
			<pre
				data-copyable="true"
				className="relative overflow-auto rounded-lg border bg-muted/40 p-4 text-sm"
			>
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
