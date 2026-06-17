---
name: Visual self-verify via mockup sandbox
description: How to actually SEE a component when runTest won't hand back screenshots — render it self-contained in the mockup sandbox and screenshot its preview URL.
---

# Seeing a component yourself when runTest gives no images

**Problem:** `runTest` (Playwright testing skill) reliably returns `screenshotPaths: []` and saves nothing to `/tmp/testing-screenshots`, even on `status: success`. Its agent describes what it saw, but you cannot view the pixels. For subjective/visual work (a user saying "this looks bad, make it better"), a text description is not enough to verify.

**Workaround that works:** copy the presentational component into the already-running mockup sandbox as a self-contained file with mock data, then screenshot the preview URL directly.

- Put the file in `artifacts/mockup-sandbox/src/components/mockups/<folder>/<Name>.tsx`, exporting a function whose name matches the filename.
- Strip app-only imports — inline any pure-presentational helpers, fabricate mock props/data. This is trivial when the component uses only inline styles + tailwind utils + hex colors (no app-scoped CSS classes or context).
- Restart workflow `artifacts/mockup-sandbox: Component Preview Server`, then `screenshot` (type `external_url`) the URL `https://${REPLIT_DOMAINS}/__mockup/preview/<folder>/<Name>` — no port suffix.
- Delete the temp folder afterward and restart the sandbox once more so the generated registry (`.generated/mockup-components.ts`) drops the entry. A leftover harmless reorder in that generated file is just watcher noise.

**Why:** it lets you eyeball the real rendered result instead of trusting a second-hand description, which is what subjective visual requests actually require.

**How to apply:** reach for this whenever you need to confirm the *look* of a self-contained component and the only driver (runTest / a click-gated demo) won't surface an image you can open.
