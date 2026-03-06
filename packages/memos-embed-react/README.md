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
  showTags
  showAttachments
  showReactions
  showMeta
/>
```

## Notes
- Fetch requests are cancelled when props change or the component unmounts
- Rendering is powered by the shared `memos-embed` core package, so output stays consistent with the iframe and Web Component versions
