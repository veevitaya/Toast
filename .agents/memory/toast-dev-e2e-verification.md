---
name: Toast dev e2e verification (runTest vs screenshots)
description: Why the testing subagent over-budgets on this app in dev, and how to verify user flows reliably instead.
---

# Verifying Toast flows when runTest always over-budgets

**Symptom:** `runTest` (testing subagent) ALWAYS hits "Maximum testing iterations (10) reached" — even on trivial 2-step plans, and even after warming every route first.

**Cause:** runTest spins up a FRESH browser context. That triggers Vite's dep-optimizer to re-bundle ("Invalid hook call / more than one copy of React", "Failed to fetch dynamically imported module: ...") → blank page → ErrorBoundary → reload loop → 10 iterations. This is DEV-ONLY (production is pre-bundled); the app is NOT broken — the server serves 200s and the warm preview browser renders everything.

**Reliable workarounds (use these, don't burn turns retrying runTest):**
- **Render / read-only checks:** use the `app_preview` screenshot tool. It drives the WARM persistent preview browser and renders pages correctly. PARALLEL screenshots of DIFFERENT paths are SAFE — each captures its own path. Browser log is clean except expected LIFF + vite-websocket warnings.
- **Backend / server logic** (group match, idempotency, RBAC 403s, etc.): verify deterministically via `code_execution` fetch to http://localhost:5000/api/... — no browser needed.
- **Interactive flows needing typed input** (home search overlay via `/?search=1`, create-list): screenshot the rendered control + read the (usually simple, client-side) logic to confirm correctness. runTest is not viable for these in dev.

**Toast specifics worth knowing:** campaign detail (`/campaign/:id`) is MOCK-driven (ids `camp_1`..`camp_6` from CampaignBanner), NOT the DB campaigns table — unknown ids correctly show "Deal not found". Legal docs are a frontend config (`client/src/legal/config.ts`), slugs like `privacy-policy`; not a DB table.

**How to apply:** for any QA/hardening pass on this app, go straight to screenshots (render) + localhost API fetch (logic). Treat a runTest over-budget here as an environment artifact, not a bug.
