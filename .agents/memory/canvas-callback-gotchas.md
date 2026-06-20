---
name: Canvas callback gotchas
description: Exact param shapes for applyCanvasActions update + presentArtifact that aren't obvious and cost repeated failed calls.
---

Canvas callbacks (code_execution sandbox) are camelCase: `getCanvasState`, `applyCanvasActions`, `presentArtifact` (NOT snake_case).

**applyCanvasActions update action** — patch key is `updates` (NOT `shape`; `shape` is the create payload). The `updates` object MUST include `shapeType` (e.g. `"iframe"`) so fields serialize correctly. To flip a placeholder iframe live:
`{ type: "update", shapeId, updates: { shapeType: "iframe", state: "live", url } }`

**presentArtifact** requires `artifactId` AND it must be an EXISTING artifact id, not a free slug. For mockup-sandbox work the id is the artifact path, e.g. `"artifacts/mockup-sandbox"`. If unsure, an invalid id error lists available artifacts. Call: `presentArtifact({ artifactId: "artifacts/mockup-sandbox", shapeIds: [...], title })`.

**getCanvasState** returns `{ focusedShapes, blurryShapes, peripheralClusters, summary, viewport }` — only shapes near the current viewport, NOT a flat global list. Don't expect to find shapes you placed far away (e.g. y≈22000) unless the viewport is there; reference them by the shapeIds you assigned at create time instead.

**Live iframes of the SAME app must use DISTINCT `id` params** in the `/__replco/workspace_iframe.html?initialPath=…&id=…` URL. The wrapper is served by Vite for ANY `id` (it's just a preview/beacon label, not a server selector — a no-id request still returns the full app), so two canvas frames pointing at the same app can each be live. But if they SHARE one `id` (e.g. both `default-start-application`), the workspace syncs them to a single route — the last `initialPath` set wins and BOTH frames mirror it. Symptom: the consumer artifact frame suddenly shows `/admin/login` because a second frame reused `default-start-application`. Fix: give the non-artifact frame its own id (e.g. `id=toast-admin-preview`) and keep the managed artifact frame on `default-start-application`. Direct (non-wrapper) app URLs can't be embedded cross-origin (Helmet X-Frame-Options SAMEORIGIN) — always use the wrapper.

**Why:** burned ~5 failed calls discovering these param shapes during the Toast group-decision canvas mockups, then a separate session where two canvas frames shared `default-start-application` and the consumer frame kept showing the admin login.
