---
name: Mockup preview screenshot cache
description: external_url screenshots of /__mockup component previews are cached by URL; bust with a query param.
---

The `screenshot` tool (external_url / Firecrawl) caches results by exact URL. When re-capturing a `/__mockup/preview/...` component after editing its source, the same URL can return a STALE image — e.g. a blank-white frame captured during an earlier HMR/restart churn window, even though the component now renders correctly.

**Symptom:** a mockup preview shows blank white on repeated captures while sibling components render, and the source has no findable runtime error.

**Fix:** append a cache-busting query param to force a fresh capture, e.g. `.../preview/toast-group-session/SummaryCard?cb=991`. The mockup harness routes off `window.location.pathname` (`/^\/preview\/(.+)$/`), so a `?cb=N` query does not affect component resolution.

**Why:** identical-URL caching makes screenshots after edits unreliable; concurrent subagent edits / workflow restarts can poison the first capture.

**Also note:** `app_preview` screenshots hit the main app on port 5000, which does NOT proxy `/__mockup` (returns the app's 404). Use `external_url` against the public replit.dev domain for mockup previews.

**Lazy-compile blank race (related):** the preview server compiles each component on first request, so the FIRST capture right after editing a file is often blank because it lands before Vite finishes the on-demand compile/HMR. Workaround: from `code_execution`, warm the route by `fetch`-ing the preview URL ~3x with ~800ms gaps before screenshotting, then capture with a fresh `?cb=N`. A single blank frame == retry once (the second attempt almost always renders); only investigate the component if repeated retries stay blank.

**Canvas iframe pinned to a stale `?v=` URL (the "I don't see the changes" trap):** a placed mockup iframe shape stores a `url` ending in `?v=<timestamp>`. The frame renders that exact URL and does NOT auto-pick-up source edits if HMR isn't connected — so after editing the backing component the user still sees the OLD render even though the file and server are correct. Fix: `getCanvasState`, then `applyCanvasActions` to update the shape `state: "modifying"` → `state: "live"` with a NEW `url` carrying a fresh `?v=${Date.now()}`. Changing the `?v=` forces the iframe to reload. Do this after every meaningful edit to a component already on the canvas.
