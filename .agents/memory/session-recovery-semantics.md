---
name: Group session recovery semantics
description: What counts as a "rejoinable" session for the home Rejoin card, and why solo waiting rooms are excluded.
---

The home "Rejoin Session" card is driven by `GET /api/sessions/active/:userId`
(`storage.getActiveSessionForUser`). It must only surface sessions genuinely
worth rejoining:

- `swiping` (within 24h) — real progress, always recover.
- `completed` (within 2h) — to view results.
- `waiting` (within 24h) — ONLY if the room has 2+ members.

**Why:** a `waiting` room with just the host (members < 2) is an abandoned /
never-really-started session. With the generous 24h window, every such solo room
reappeared as a phantom "Rejoin Session" on every home open (the original bug).
Requiring members >= 2 for waiting kills the phantom while preserving recovery of
rooms friends actually joined.

**How to apply:** if you ever loosen recovery (e.g. "show all waiting sessions"),
you will reintroduce the phantom card. Keep the members>=2 gate for `waiting`.
Trade-off accepted: a host sitting alone in a waiting room who navigates to home
loses the home-screen recovery card — they're still on the waiting-room page via
its `?session=` URL, so this is intentional, not a regression.

**Client reconciliation:** `SessionBar` removes local `toast_sessions`
(sessionStorage) group cards when the endpoint returns `{session:null}`. Because
the store hydrates from sessionStorage before the async server check, a stale card
can briefly flash on reload before being reconciled away — acceptable for fresh
starts (empty sessionStorage = no flash).
