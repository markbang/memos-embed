![Memos Embed Logo](./apps/site/public/android-chrome-512x512.png)

# Memos Embed

[![CI](https://github.com/markbang/memos-embed/actions/workflows/ci.yml/badge.svg)](https://github.com/markbang/memos-embed/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/memos-embed.svg)](https://www.npmjs.com/package/memos-embed)

Embeddable memo cards for Memos, delivered as a website and npm packages.

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

## Build
```bash
pnpm -r build
```

## Tests
```bash
pnpm test
```

## Usage
### Core package
```ts
import { fetchMemo, renderMemoHtmlSnippet } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

const html = renderMemoHtmlSnippet(memo, { includeStyles: true })
```

### React
```tsx
import { MemoEmbed } from '@memos-embed/react'

<MemoEmbed baseUrl="https://demo.usememos.com/api/v1" memoId="1" />
```

### Web Component
```html
<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed base-url="https://demo.usememos.com/api/v1" memo-id="1"></memos-embed>
```

### Iframe
```html
<iframe
  src="https://your-site.com/embed/1?baseUrl=https%3A%2F%2Fdemo.usememos.com%2Fapi%2Fv1"
  style="width: 100%; height: 240px; border: none;"
  title="memos-embed"
></iframe>
```
