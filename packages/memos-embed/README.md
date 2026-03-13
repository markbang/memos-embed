# memos-embed

Core embed utilities for Memos.

## Install
```bash
pnpm add memos-embed
```

## What it includes
- `fetchMemo` / `fetchMemos` for loading and normalizing memo data from a Memos instance
- `renderMemoHtml` / `renderMemoHtmlSnippet` for generating themed embed markup
- `renderMemoListHtml` / `renderMemoListHtmlSnippet` for note collections, digests, and roundups with shared styles
- `buildEmbedCss` for extracting the shared styles
- `buildEmbedUrl` / `renderIframeHtml` for iframe-based embeds, including optional auto-resize support

## Base URL handling
`baseUrl` accepts any of these forms and normalizes them internally:
- `https://demo.usememos.com`
- `https://demo.usememos.com/api`
- `https://demo.usememos.com/api/v1`

Use whichever shape you already have. The client will resolve memo and user requests against `/api/v1` automatically.

## Usage
### Fetch a memo
```ts
import { fetchMemo } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com',
  memoId: '1',
})
```

### Render a complete HTML snippet
```ts
import { fetchMemo, renderMemoHtmlSnippet } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

const html = renderMemoHtmlSnippet(memo, {
  includeStyles: true,
  theme: 'minimal',
  density: 'comfortable',
  showTags: true,
  showAttachments: true,
  showReactions: true,
  showMeta: true,
  linkTarget: '_blank',
})
```

### Render HTML only and inject your own styles
```ts
import { buildEmbedCss, fetchMemo, renderMemoHtml } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

const css = buildEmbedCss()
const html = renderMemoHtml(memo, {
  theme: 'light',
  locale: 'en',
})
```

### Build an iframe URL or HTML wrapper
```ts
import { buildEmbedUrl, renderIframeHtml } from 'memos-embed'

const src = buildEmbedUrl({
  embedBaseUrl: 'https://your-site.com',
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

const iframe = renderIframeHtml({
  embedBaseUrl: 'https://your-site.com',
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
  title: 'Memos Embed',
  height: 320,
  autoResize: true,
  sandbox: 'allow-scripts allow-same-origin',
  referrerPolicy: 'strict-origin-when-cross-origin',
})
```

### Fetch a roundup and render a memo list
```ts
import { fetchMemos, renderMemoListHtmlSnippet } from 'memos-embed'

const memos = await fetchMemos({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoIds: ['1', '2', '3'],
})

const html = renderMemoListHtmlSnippet(memos, {
  layout: 'grid',
  gap: '20px',
  theme: 'paper',
})
```

### Create a shared client
```ts
import { createMemoClient } from 'memos-embed'

const client = createMemoClient()

await Promise.all([
  client.fetchMemo({ baseUrl: 'https://demo.usememos.com/api/v1', memoId: '1' }),
  client.fetchMemos({ baseUrl: 'https://demo.usememos.com/api/v1', memoIds: ['1', '2'] }),
])
```

Use a shared client when multiple embeds on one page should reuse memo and creator fetches.

## Custom blog theming
```ts
import { extendTheme, renderMemoHtmlSnippet } from 'memos-embed'

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
})

const html = renderMemoHtmlSnippet(memo, {
  theme: blogTheme,
})
```

Use `includeStyles: false` when you want to provide all CSS yourself.

## Render behavior
The renderer supports:
- headings, lists, task lists, quotes, inline code, links, and fenced code blocks
- image previews for attachment URLs
- grouped reaction counts
- optional postMessage-based iframe auto-resize
- stack or grid list rendering for multi-memo pages
- theme presets: `minimal`, `glass`, `paper`, `midnight`, `terminal`
- `extendTheme()` for blog-aligned design tokens and CSS variable-based theming
