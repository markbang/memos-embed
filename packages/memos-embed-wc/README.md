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
  link-target="_blank"
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
- `link-target`
- `include-styles`
- `show-tags`
- `show-attachments`
- `show-reactions`
- `show-meta`

## Styling from your site
Keep the built-in styles and tweak the exposed parts:

```css
memos-embed::part(container) {
  border-radius: 24px;
}

memos-embed::part(user-name) {
  color: var(--brand-fg);
}
```

If you want to bring all styles yourself, set `include-styles="false"` and target the exposed `::part(...)` hooks from your site stylesheet.

The custom element aborts stale requests when attributes change rapidly, making it safer for dynamic dashboards and previews.
