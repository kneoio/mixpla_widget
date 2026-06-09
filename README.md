# mixpla_widget

Embeddable radio player widget for Mixpla stations.

## Embed

Add two lines to any HTML page:

```html
<mixpla-player slug="your-station-slug" label="Station Name"></mixpla-player>
<script src="https://your-cdn.com/mixpla-widget.iife.js"></script>
```

| Attribute | Required | Description |
|-----------|----------|-------------|
| `slug`    | yes      | Station slug from Mixpla |
| `label`   | no       | Display name (falls back to slug) |

## Build

```bash
npm install
npm run build
```

Output: `dist/mixpla-widget.iife.js` — host this file and update the `src` above.

## Dev

```bash
npm run dev
```

Opens on `http://localhost:5177`.
