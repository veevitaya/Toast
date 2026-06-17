---
name: Capturing member-gated app screens
description: Why app_preview + runTest can't easily produce screenshot files of auth/member-gated screens, and what does work.
---

# Capturing screenshots of member-gated screens (e.g. group session screens)

When asked to capture image files of screens that require an in-app identity (LINE profile or persistent guest), these two tools both fall short:

- **`app_preview` screenshot tool**: navigates the *preview* browser, which carries its OWN persistent identity (`toast_guest_profile` localStorage, or `lineProfile`). You cannot set its localStorage or reliably discover its guest id, so any session it is not a member of renders the "Session Unavailable" page. Seeding the session and even adding candidate `guest_*` ids as members does NOT help — the preview's id is unknown. The `/taste` request it fires often goes out with an empty `lineUserId` (profile null during the load race), so server logs don't reveal the id either.
- **`runTest` (testing subagent)**: CAN authenticate (it sets `localStorage` via `page.evaluate`) and drive the full flow, but its returned `screenshotPaths` is **empty on `status: "success"`** — it only surfaces a diagnostic screenshot on a genuine **failure** run (saved under `/tmp/testing-screenshots/<id>.jpeg`). Trying to force a fake failure ("assert a missing testid") backfires: the subagent rationalizes reaching the target screen as success and returns no shots. The subagent also cannot write into the workspace filesystem.

**Net:** there is no built-in, dependency-free way to export PNG/JPEG files of a member-gated screen on a *successful* run. Use `runTest` to *verify* the flow works (reliable), but to actually hand the user image files you need a browser you control (e.g. install `playwright-core` + a chromium binary) — which is a new dependency, so confirm with the user first per their preferences.

**Why:** the preview browser's identity is opaque/unsettable from the agent side, and the test harness treats screenshots as failure diagnostics rather than deliverables.

**How to apply:** for "show me a screenshot of <member-gated screen>" requests, don't burn cycles on app_preview/runTest screenshot harvesting. Verify the flow with runTest, then ask the user before adding a headless-browser dependency to capture real images.
