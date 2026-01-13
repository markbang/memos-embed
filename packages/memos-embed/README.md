# memos-embed

Core embed utilities for Memos.

## Install
```bash
pnpm add memos-embed
```

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

const html = renderMemoHtmlSnippet(memo, { includeStyles: true })
```

### `renderIframeHtml`
```ts
import { renderIframeHtml } from 'memos-embed'

const iframe = renderIframeHtml({
  embedBaseUrl: 'https://your-site.com',
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})
```
