# @memos-embed/wc

Web Component wrapper for Memos embed cards.

## Install
```bash
pnpm add @memos-embed/wc
```

## Usage
```html
<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed base-url="https://demo.usememos.com/api/v1" memo-id="1"></memos-embed>
```

## JS Usage
```ts
import { defineMemosEmbedElement } from '@memos-embed/wc'

defineMemosEmbedElement()
```
