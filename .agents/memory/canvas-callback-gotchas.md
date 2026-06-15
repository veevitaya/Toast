---
name: Canvas callback gotchas
description: Exact param shapes for applyCanvasActions update + presentArtifact that aren't obvious and cost repeated failed calls.
---

Canvas callbacks (code_execution sandbox) are camelCase: `getCanvasState`, `applyCanvasActions`, `presentArtifact` (NOT snake_case).

**applyCanvasActions update action** — patch key is `updates` (NOT `shape`; `shape` is the create payload). The `updates` object MUST include `shapeType` (e.g. `"iframe"`) so fields serialize correctly. To flip a placeholder iframe live:
`{ type: "update", shapeId, updates: { shapeType: "iframe", state: "live", url } }`

**presentArtifact** requires `artifactId` AND it must be an EXISTING artifact id, not a free slug. For mockup-sandbox work the id is the artifact path, e.g. `"artifacts/mockup-sandbox"`. If unsure, an invalid id error lists available artifacts. Call: `presentArtifact({ artifactId: "artifacts/mockup-sandbox", shapeIds: [...], title })`.

**getCanvasState** returns `{ focusedShapes, blurryShapes, peripheralClusters, summary, viewport }` — only shapes near the current viewport, NOT a flat global list. Don't expect to find shapes you placed far away (e.g. y≈22000) unless the viewport is there; reference them by the shapeIds you assigned at create time instead.

**Why:** burned ~5 failed calls discovering these param shapes during the Toast group-decision canvas mockups.
