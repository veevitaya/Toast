---
name: Group session host identity & waiting-room gotchas
description: Why host-only group actions 403 in tests, and why the waiting room can show 0 members — identity + geolocation pitfalls.
---

# Group session host identity

The server identifies the group-session host purely by `session.hostLineUserId === <client-supplied lineUserId>` (status/start/delete endpoints). The client's id comes from `useLineProfile`, which with no LINE falls back to a **stable guest profile** persisted in `localStorage.toast_guest_profile`. Session creation (the "Set the plan" screen) and host-only actions (waiting room "Lock it in") must use that SAME id.

**Why:** A session created with an arbitrary host id cannot be started by the browser → the start endpoint returns 403 "Only the host can change session status".

**How to apply:**
- To e2e test the host flow, **drive the real browser flow** (Send → Taste → Waiting) so the session's host id equals the browser's guest id. Do NOT seed a session via raw API `POST /api/group/sessions` with a made-up `hostLineUserId` and then try to "Lock it in" — it 403s, and the host row renders as a name instead of "You".
- To add extra members in a test, after the real flow creates the session, read the `session=` code from the URL and `POST /api/group/sessions/:code/join` for the extra members only.

# Waiting room: don't block member load on geolocation

The waiting room's host fetch must not `await getUserLocation()` before the session GET — geolocation is only needed on the join/create path (lat/lng body). If the host GET waits on geolocation and the user ignores/denies the prompt (or a headless browser hangs), `members` never loads, `sessionCreated` never flips true, polling never starts, and the lobby is stuck on "0 joined".

**Why:** caused a permanent "0 joined" even though the server had the members.

**How to apply:** fetch location lazily, only on the code path that actually sends lat/lng.
