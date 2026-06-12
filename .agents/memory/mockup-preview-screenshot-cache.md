---
name: Mockup preview screenshot cache
description: external_url screenshots of /__mockup component previews are cached by URL; bust with a query param.
---

The `screenshot` tool (external_url / Firecrawl) caches results by exact URL. When re-capturing a `/__mockup/preview/...` component after editing its source, the same URL can return a STALE image — e.g. a blank-white frame captured during an earlier HMR/restart churn window, even though the component now renders correctly.

**Symptom:** a mockup preview shows blank white on repeated captures while sibling components render, and the source has no findable runtime error.

**Fix:** append a cache-busting query param to force a fresh capture, e.g. `.../preview/toast-group-session/SummaryCard?cb=991`. The mockup harness routes off `window.location.pathname` (`/^\/preview\/(.+)$/`), so a `?cb=N` query does not affect component resolution.

**Why:** identical-URL caching makes screenshots after edits unreliable; concurrent subagent edits / workflow restarts can poison the first capture.

**Also note:** `app_preview` screenshots hit the main app on port 5000, which does NOT proxy `/__mockup` (returns the app's 404). Use `external_url` against the public replit.dev domain for mockup previews.
