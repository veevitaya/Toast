---
name: Group session host identity & waiting-room gotchas
description: Why host-only group actions 403 in tests, and why the waiting room can show 0 members — identity + geolocation pitfalls.
---

# Group session host identity

The server identifies the group-session host purely by `session.hostLineUserId === <client-supplied lineUserId>` (status/start/delete endpoints). The client's id comes from `useLineProfile`, which with no LINE falls back to a **stable guest profile** persisted in `localStorage.toast_guest_profile`. Session creation (the "Set the plan" screen) and host-only actions (waiting room "Let's start!") must use that SAME id.

**Why:** A session created with an arbitrary host id cannot be started by the browser → the start endpoint returns 403 "Only the host can change session status".

**How to apply:**
- To e2e test the host flow, **drive the real browser flow** (Send → Taste → Waiting) so the session's host id equals the browser's guest id. Do NOT seed a session via raw API `POST /api/group/sessions` with a made-up `hostLineUserId` and then try to "Let's start!" — it 403s, and the host row renders as a name instead of "You".
- To add extra members in a test, after the real flow creates the session, read the `session=` code from the URL and `POST /api/group/sessions/:code/join` for the extra members only.

# Waiting room: don't block member load on geolocation

The waiting room's host fetch must not `await getUserLocation()` before the session GET — geolocation is only needed on the join/create path (lat/lng body). If the host GET waits on geolocation and the user ignores/denies the prompt (or a headless browser hangs), `members` never loads, `sessionCreated` never flips true, polling never starts, and the lobby is stuck on "0 joined".

**Why:** caused a permanent "0 joined" even though the server had the members.

**How to apply:** fetch location lazily, only on the code path that actually sends lat/lng.

# GroupSwipe identity is async — gate per-member fetches on useLineProfile loading

In GroupSwipe the member identity used for per-member API calls (e.g. fetching group taste) is NOT reliably available on first render. Only the **guest-join** path writes the session-scoped `localStorage.toast_guest_<sessionCode>` synchronously; LINE users (including the host) get their id from `useLineProfile`, which resolves **asynchronously**. An effect keyed only on `[sessionCode]` fires before `lineProfile` resolves, so any call needing identity gets the empty/anonymous id.

**Why:** a member-auth'd GET (taste endpoint requires `lineUserId` query or verified `X-Line-Access-Token` and rejects non-members with 403) silently 403s on the first run, the result is swallowed, and the deck is never re-ranked because the effect doesn't re-run.

**How to apply:** destructure `loading` from `useLineProfile` and `return` early while it's true; add `loading` (and `profile?.userId`) to the effect deps. `useLineProfile` always flips `loading` to false (LINE profile or stable guest fallback), so gating never deadlocks. This yields a single load with identity known.

# Group endpoints trust client-supplied lineUserId (app-wide pattern)

All group-session endpoints (join, swipe, finalize-stats, complete, location, taste) identify the caller by the `lineUserId` in the request body/query plus a membership check — there is no signed per-member token for guests. LINE users can additionally pass `X-Line-Access-Token`, which the server verifies and uses to override the claimed id.

**Why:** guests have no auth credential by design; introducing a signed member token for one endpoint would diverge from every other group endpoint.

**How to apply:** for new group endpoints, follow the same pattern (verify LINE token when present, else trust client id + membership check). Don't single out one endpoint for stronger guest auth unless the whole group surface is migrated together.
