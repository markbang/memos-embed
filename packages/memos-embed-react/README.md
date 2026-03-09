# @memos-embed/react

React wrapper for Memos embed cards.

## Install
```bash
pnpm add @memos-embed/react
```

## Usage
```tsx
import { MemoEmbed } from '@memos-embed/react'

export function App() {
  return (
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
      onLoad={(memo) => console.log('loaded memo', memo.name)}
      onError={(error) => console.error(error)}
    />
  )
}
```

## Roundup usage
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

## Shared client usage
```tsx
import { createMemoClient } from 'memos-embed'
import { MemoClientProvider, MemoEmbed, MemoEmbedList } from '@memos-embed/react'

const client = createMemoClient()

<MemoClientProvider client={client}>
  <MemoEmbed baseUrl="https://demo.usememos.com/api/v1" memoId="1" />
  <MemoEmbedList baseUrl="https://demo.usememos.com/api/v1" memoIds={["2", "3"]} />
</MemoClientProvider>
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

## Styling with your blog theme
```tsx
import { extendTheme } from 'memos-embed'

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

<MemoEmbed memo={memo} theme={blogTheme} />
```

If you want to bring all styles yourself, pass `includeStyles={false}` and render your own CSS around the generated markup.

## Props and notes
- `memoId`: target memo id
- `baseUrl`: Memos API base URL, for example `https://demo.usememos.com/api/v1`
- `theme`: theme preset or custom theme input
- `density`: `compact` or `comfortable`
- `locale`: locale passed to date formatting
- `showTags`: show memo tags
- `showAttachments`: show attachments
- `showReactions`: show reactions
- `showMeta`: show creator and timestamp metadata
- `linkTarget`: keeps markdown and attachment links consistent with iframe and Web Component embeds
- `onLoad`: called after memo data is loaded
- `onError`: called when loading fails
- Pass `memo` to render already-fetched data and avoid a client-side request waterfall
- Use `MemoEmbedList` when you want multiple memo cards with one shared style block in React
- Use `MemoClientProvider` with `createMemoClient()` when many embeds on one page should share request and cache state
- `fetcher` and `includeCreator` are forwarded to the shared `fetchMemo()` and `fetchMemos()` helpers when components fetch their own data
- `includeStyles={false}` disables the built-in `<style>` block for bring-your-own styling setups
- Fetch requests are cancelled when props change or the component unmounts when you are not using a shared client; shared clients favor deduped requests over per-component aborting
- Rendering is powered by the shared `memos-embed` core package, so output stays consistent with the iframe and Web Component versions
