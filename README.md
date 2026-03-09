![Memos Embed Logo](./apps/site/public/android-chrome-512x512.png)

# Memos Embed

[![CI](https://github.com/markbang/memos-embed/actions/workflows/ci.yml/badge.svg)](https://github.com/markbang/memos-embed/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/memos-embed.svg)](https://www.npmjs.com/package/memos-embed)

Embeddable memo cards for Memos, delivered as a website and npm packages.

## Features
- Rich memo cards with themes, density presets, and extendable design tokens
- Core HTML renderer for SSR and static-site workflows
- Batch multi-memo fetching and shared-style list rendering for note digests and weekly roundups
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

## Releasing
- Add a changeset for package changes with `pnpm changeset`
- The `Publish Packages` workflow opens or updates a release PR on `main`
- Merging the release PR publishes changed packages to npm

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
- Releases are managed with Changesets release PRs and publish automatically after the release PR lands on `main`
