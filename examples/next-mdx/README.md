# Next.js App Router example

Use this pattern when your blog is built with the Next.js App Router and you want to avoid a client-side fetch waterfall.

## What it demonstrates
- fetch memo data on the server with `fetchMemo()`
- pass the serialized memo object into `@memos-embed/react`
- render multi-memo roundups with `fetchMemos()` + `renderMemoListHtmlSnippet()`
- align the embed with your site theme by using `extendTheme()` and CSS variables

## Files
- `app/components/MemoEmbedCard.tsx`
- `app/components/MemoRoundupHtml.tsx`
- `app/blog/[slug]/page.tsx`
- `app/notes/week-in-review/page.tsx`
- `lib/memos.ts`

The React wrapper is a client component, so the page fetches on the server and hands the result to `<MemoEmbed memo={memo} />`. For roundup pages, you can stay fully server-rendered and emit one shared style block for multiple memos.
