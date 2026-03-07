![Memos Embed Logo](./apps/site/public/android-chrome-512x512.png)

# Memos Embed

[![CI](https://github.com/markbang/memos-embed/actions/workflows/ci.yml/badge.svg)](https://github.com/markbang/memos-embed/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/memos-embed.svg)](https://www.npmjs.com/package/memos-embed)

Embeddable memo cards for Memos, delivered as a website and npm packages.

## Features
- Rich memo cards with themes and density presets
- Core HTML renderer for SSR and static-site workflows
- React component wrapper
- Web Component wrapper
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
import { fetchMemo, renderMemoHtmlSnippet } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

const html = renderMemoHtmlSnippet(memo, {
  includeStyles: true,
  theme: 'paper',
  density: 'comfortable',
  showAttachments: true,
  showReactions: true,
  linkTarget: '_blank',
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
  showAttachments
  showReactions
/>
```

### Web Component
```html
<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed
  base-url="https://demo.usememos.com/api/v1"
  memo-id="1"
  theme="midnight"
  show-tags="true"
  show-attachments="true"
  show-reactions="true"
></memos-embed>
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

## Development Notes
- The site uses source aliases so local changes in `packages/*` show up immediately in `apps/site`
- The playground keeps its configuration in the URL for easy sharing
- Package builds are powered by `tsup`; site builds use Vite + TanStack Start
- CI runs `pnpm validate`, including lint, Biome checks, tests, package-consumer smoke tests, and the site build
- Releases are managed with Changesets release PRs and publish automatically after the release PR lands on `main`
