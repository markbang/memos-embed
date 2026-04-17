![Memos Embed Logo](./apps/site/public/android-chrome-512x512.png)

# Memos Embed

[![CI](https://github.com/markbang/memos-embed/actions/workflows/ci.yml/badge.svg)](https://github.com/markbang/memos-embed/actions/workflows/ci.yml)
[![npm memos-embed](https://img.shields.io/npm/v/memos-embed.svg?label=memos-embed)](https://www.npmjs.com/package/memos-embed)
[![npm @memos-embed/react](https://img.shields.io/npm/v/%40memos-embed%2Freact.svg?label=%40memos-embed%2Freact)](https://www.npmjs.com/package/@memos-embed/react)
[![npm @memos-embed/wc](https://img.shields.io/npm/v/%40memos-embed%2Fwc.svg?label=%40memos-embed%2Fwc)](https://www.npmjs.com/package/@memos-embed/wc)

Embeddable memo cards for Memos, delivered as a website and npm packages.

## Try it live
- Website: [memos-embed.bangwu.top](https://memos-embed.bangwu.top)
- Docs: [memos-embed.bangwu.top/docs](https://memos-embed.bangwu.top/docs)
- Playground: [memos-embed.bangwu.top/playground](https://memos-embed.bangwu.top/playground)
- Example gallery: [`examples/`](./examples/README.md)

## Features
- Rich memo cards with themes, density presets, and extendable design tokens
- Core HTML renderer for SSR and static-site workflows
- Batch multi-memo fetching and shared-style list rendering for note digests and weekly roundups
- Shared memo client for cross-embed request deduping on React and MDX pages
- React components for single embeds and multi-memo roundups, with optional pre-fetched memo rendering
- Web Component wrapper with exposed `::part(...)` hooks
- Iframe embed route for no-build integrations
- Lightweight markdown support for headings, lists, task lists, quotes, links, and fenced code blocks
- Attachment previews for images and grouped reaction badges
- Optional auto-resizing iframe snippets via `postMessage`

## Workspace Layout
- `apps/site`: TanStack Start website (docs, playground, iframe embeds)
- `packages/memos-embed`: core API + SSR HTML helpers
- `packages/memos-embed-react`: React component wrapper
- `packages/memos-embed-wc`: Web Component wrapper

## Choose the right integration

| Entry point | Install | Best for | Start here |
| --- | --- | --- | --- |
| Core HTML API | `pnpm add memos-embed` | SSR/SSG pipelines, MDX blogs, custom render flows, and iframe helpers | [`packages/memos-embed`](./packages/memos-embed/README.md) |
| React | `pnpm add @memos-embed/react` | Next.js, TanStack Start, Astro islands, and React pages that want SSR-ready embeds | [`examples/next-mdx`](./examples/next-mdx/README.md) |
| Web Component | `pnpm add @memos-embed/wc` | Static sites, CMS pages, and custom-element-friendly apps without a React runtime | [`packages/memos-embed-wc`](./packages/memos-embed-wc/README.md) |
| Iframe helpers | `pnpm add memos-embed` | Copy-paste embeds, stricter style isolation, and platforms where raw HTML snippets are awkward | [`examples/static-html`](./examples/static-html/README.md) |

Install `memos-embed` alongside `@memos-embed/react` whenever you import shared helpers like `fetchMemo()`, `fetchMemos()`, `createMemoClient()`, or `extendTheme()` in the same app.

The React and Web Component packages both build on top of the shared `memos-embed` core, so you can mix wrappers, pre-fetched memo data, and iframe helpers in the same project.

## Quick Start
```bash
pnpm install
pnpm dev
```

Open:
- site: `http://localhost:3000`
- playground: `http://localhost:3000/playground`

## Build
```bash
pnpm -r build
```

## Tests
```bash
pnpm test
pnpm test:artifacts
```

## Validation
```bash
pnpm validate
```

## Git Hooks
This repo uses [`prek`](https://github.com/j178/prek) for local Git hooks.

- `pnpm install` auto-installs the configured `pre-commit` and `pre-push` hooks when possible
- `pre-commit` runs `pnpm check`
- `pre-push` runs `pnpm validate`
- to reinstall hooks manually: `pnpm prek:install`
- to run all configured hooks on demand: `pnpm prek:run`

## Releasing
- Add a changeset for package changes with `pnpm changeset`
- The `Publish Packages` workflow versions changed packages directly on `main`, publishes them to npm, pushes the package-specific Git tags created by Changesets (for example `@memos-embed/react@0.4.4`), and creates matching GitHub Releases with `changelogithub`
- If your `main` branch blocks workflow pushes or release creation, add a `CHANGESETS_GITHUB_TOKEN` secret with repo write access
- Set `NPM_TOKEN` so package publishing can authenticate with npm

## Base URL handling
`baseUrl` accepts any of these forms and normalizes them internally:
- `https://demo.usememos.com`
- `https://demo.usememos.com/api`
- `https://demo.usememos.com/api/v1`

Use whichever shape you already have. The client resolves memo and user requests against `/api/v1` automatically.

## Usage
### Core package
```ts
import { extendTheme, fetchMemo, renderMemoHtmlSnippet } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

const blogTheme = extendTheme('paper', {
  radius: 'var(--radius)',
  fontFamily: 'inherit',
  tokens: {
    background: 'var(--card)',
    foreground: 'var(--card-foreground)',
    border: 'var(--border)',
    accent: 'var(--primary)',
    accentForeground: 'var(--primary-foreground)',
    mutedForeground: 'var(--muted-foreground)',
    codeBackground: 'var(--muted)',
  },
})

const html = renderMemoHtmlSnippet(memo, {
  includeStyles: true,
  theme: blogTheme,
  density: 'comfortable',
  showAttachments: true,
  showReactions: true,
  linkTarget: '_blank',
})
```

### Multiple memos on one page
```ts
import { fetchMemos, renderMemoListHtmlSnippet } from 'memos-embed'

const memos = await fetchMemos({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoIds: ['1', '2', '3'],
})

const html = renderMemoListHtmlSnippet(memos, {
  layout: 'stack',
  gap: '20px',
  theme: 'paper',
})
```

### Shared memo client
```ts
import { createMemoClient } from 'memos-embed'

const memoClient = createMemoClient()
```

### React
```tsx
import { MemoEmbed } from '@memos-embed/react'

<MemoEmbed
  baseUrl="https://demo.usememos.com/api/v1"
  memoId="1"
  theme="glass"
  density="compact"
  linkTarget="_blank"
  showAttachments
  showReactions
/>
```

### React with pre-fetched data
```tsx
import { fetchMemo } from 'memos-embed'
import { MemoEmbed } from '@memos-embed/react'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

<MemoEmbed memo={memo} />
```

When you pass a pre-fetched `memo`, the React component now renders the full embed HTML during SSR/SSG instead of waiting for hydration.

### React roundup component
```tsx
import { MemoEmbedList } from '@memos-embed/react'

<MemoEmbedList
  baseUrl="https://demo.usememos.com/api/v1"
  memoIds={["1", "2", "3"]}
  layout="stack"
  gap="20px"
  theme="paper"
/>
```

### React shared client
```tsx
import { createMemoClient } from 'memos-embed'
import { MemoClientProvider, MemoEmbed, MemoEmbedList } from '@memos-embed/react'

const client = createMemoClient()

<MemoClientProvider client={client}>
  <MemoEmbed baseUrl="https://demo.usememos.com/api/v1" memoId="1" />
  <MemoEmbedList baseUrl="https://demo.usememos.com/api/v1" memoIds={["2", "3"]} />
</MemoClientProvider>
```

Use a shared client when multiple embeds on one page should reuse memo and creator fetches instead of issuing duplicate requests.

### React shared client with pre-fetched data
```tsx
import { createMemoClient, fetchMemo, fetchMemos } from 'memos-embed'
import { MemoClientProvider, MemoEmbed, MemoEmbedList } from '@memos-embed/react'

const client = createMemoClient()

const [heroMemo, roundupMemos] = await Promise.all([
  fetchMemo({
    baseUrl: 'https://demo.usememos.com/api/v1',
    memoId: '1',
  }),
  fetchMemos({
    baseUrl: 'https://demo.usememos.com/api/v1',
    memoIds: ['2', '3'],
  }),
])

<MemoClientProvider client={client}>
  <MemoEmbed
    baseUrl="https://demo.usememos.com/api/v1"
    memo={heroMemo}
  />
  <MemoEmbedList
    baseUrl="https://demo.usememos.com/api/v1"
    memos={roundupMemos}
  />
</MemoClientProvider>
```

Passing `memo` or `memos` while a `MemoClientProvider` is active primes the shared client cache, so later embeds for the same ids can reuse already-fetched data. Those pre-fetched props also render immediately in the initial HTML response for SSR/SSG pages.

### Web Component
```html
<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed
  base-url="https://demo.usememos.com/api/v1"
  memo-id="1"
  theme="midnight"
  link-target="_blank"
  show-tags="true"
  show-attachments="true"
  show-reactions="true"
></memos-embed>
```

```css
memos-embed::part(container) {
  border-radius: 24px;
}
```

### Iframe
```ts
import { renderIframeHtml } from 'memos-embed'

const iframe = renderIframeHtml({
  embedBaseUrl: 'https://your-site.com',
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
  height: 240,
  autoResize: true,
})
```

`autoResize` works through a `postMessage` handshake keyed by `frameId`. `renderIframeHtml()` keeps that wiring aligned for you. If you hand-roll the iframe markup, make sure the iframe element `id` matches the `frameId` query param you send to `/embed/:memoId`.

For pages with multiple embeds, give each iframe a distinct `frameId` to keep resize events scoped correctly.

## Blog integration examples
- `examples/next-mdx`: Next.js App Router + server-fetched memo data
- `examples/mdx-components`: reusable MDX component pattern for React-based blogs
- `examples/astro-blog`: Astro + MDX blog usage
- `examples/static-html`: iframe and Web Component copy-paste examples for static sites and CMS pages

## Development Notes
- The site uses source aliases so local changes in `packages/*` show up immediately in `apps/site`
- The playground keeps its configuration in the URL for easy sharing
- Package builds are powered by `tsup`; site builds use Vite + TanStack Start
- CI runs `pnpm validate`, including lint, Biome checks, tests, package-consumer smoke tests, and the site build
- Releases are managed with Changesets on `main`: the workflow versions packages, commits the release changes, publishes to npm, pushes package-specific Changesets tags, and creates matching `changelogithub`-powered GitHub Releases automatically
