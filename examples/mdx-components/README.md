# Generic MDX component example

Use this pattern when your blog system supports React components inside MDX.

## What it demonstrates
- create a thin wrapper component around `MemoEmbed`
- centralize theme and link behavior
- let authors drop `<MemoCard memoId="123" />` directly into MDX

If your MDX pipeline supports server-side data loading, fetch the memo before rendering and pass `memo={memo}` instead of letting the client fetch.
