# @memos-embed/wc

Web Component wrapper for Memos embed cards.

## Install
```bash
pnpm add @memos-embed/wc
```

## Usage
```html
<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed
  base-url="https://demo.usememos.com/api/v1"
  memo-id="1"
  theme="minimal"
  density="comfortable"
  show-tags="true"
  show-attachments="true"
  show-reactions="true"
  show-meta="true"
></memos-embed>
```

## JS Usage
```ts
import { defineMemosEmbedElement } from '@memos-embed/wc'

defineMemosEmbedElement()
```

## Supported attributes
- `memo-id`
- `base-url`
- `theme`
- `density`
- `locale`
- `show-tags`
- `show-attachments`
- `show-reactions`
- `show-meta`

The custom element aborts stale requests when attributes change rapidly, making it safer for dynamic dashboards and previews.
