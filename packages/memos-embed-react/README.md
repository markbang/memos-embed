# @memos-embed/react

React wrapper for Memos embed cards.

## Install
```bash
pnpm add @memos-embed/react
```

## Usage
```tsx
import { MemoEmbed } from '@memos-embed/react'

<MemoEmbed
  baseUrl="https://demo.usememos.com/api/v1"
  memoId="1"
  theme="glass"
  density="comfortable"
  linkTarget="_blank"
  showTags
  showAttachments
  showReactions
  showMeta
/>
```

## Pre-fetched usage
```tsx
import { fetchMemo } from 'memos-embed'
import { MemoEmbed } from '@memos-embed/react'

const memo = await fetchMemo({
  baseUrl: 'https://demo.usememos.com/api/v1',
  memoId: '1',
})

<MemoEmbed memo={memo} className="my-8" />
```

## Notes
- Pass `memo` to render already-fetched data and avoid a client-side request waterfall
- `fetcher` and `includeCreator` are forwarded to the shared `fetchMemo()` helper when the component fetches its own data
- `linkTarget` keeps markdown and attachment links consistent with iframe and Web Component embeds
- Fetch requests are cancelled when props change or the component unmounts
- Rendering is powered by the shared `memos-embed` core package, so output stays consistent with the iframe and Web Component versions
