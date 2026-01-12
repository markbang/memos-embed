# Memos Embed

Embeddable memo cards for Memos, delivered as a website and npm packages.

## Workspace Layout
- `apps/site`: TanStack Start website (docs, playground, iframe embeds)
- `packages/memos-embed`: core API + SSR HTML helpers
- `packages/memos-embed-react`: React component wrapper
- `packages/memos-embed-wc`: Web Component wrapper

## Development
```bash
pnpm install
pnpm dev
```

## Build
```bash
pnpm build
pnpm -r build
```

## Tests
```bash
pnpm test
```

## Shadcn
Run from the site app:
```bash
pnpm --filter @memos-embed/site dlx shadcn@latest add button
```
