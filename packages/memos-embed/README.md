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

## API
### `fetchMemo`
```ts
import { fetchMemo } from 'memos-embed'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})
```

### `renderMemoHtmlSnippet`
```ts
import { renderMemoHtmlSnippet } from 'memos-embed'

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

### `renderIframeHtml`
```ts
import { renderIframeHtml } from 'memos-embed'

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

### `fetchMemos` + `renderMemoListHtmlSnippet`
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

### `createMemoClient`
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
