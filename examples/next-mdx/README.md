# Next.js App Router example

Use this pattern when your blog is built with the Next.js App Router and you want to avoid a client-side fetch waterfall.

## What it demonstrates
- fetch memo data on the server with `fetchMemo()`
- pass the serialized memo object into `@memos-embed/react`
- align the embed with your site theme by using `extendTheme()` and CSS variables

## Files
- `app/components/MemoEmbedCard.tsx`
- `app/blog/[slug]/page.tsx`
- `lib/memos.ts`

The React wrapper is a client component, so the page fetches on the server and hands the result to `<MemoEmbed memo={memo} />`.
