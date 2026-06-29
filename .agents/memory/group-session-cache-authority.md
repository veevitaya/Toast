---
name: Group session cache authority
description: Why the client treats group sessions as server-authoritative and never resurfaces cached group cards on app start.
---

# Group session SessionBar is server-authoritative on app start

On a fresh app start, `client/src/lib/sessionStore.ts` (restore-from-sessionStorage)
must NOT resurface any `type:"group"` card. `SessionBar.checkServerSession`
re-hydrates a genuinely active / recently-completed group session from
`GET /api/sessions/active/:userId` (works for guests too — keyed by their
`guest_*` id). Only solo sessions are trusted from the local cache.

**Why:** the local cache is exactly what goes stale. When a group session ended,
the local card was often never marked terminal (handleEndSession / tie-breaker /
poll only updated server + React state), so it kept `status:undefined` (green
"Live" dot) and persisted in sessionStorage. The only pruner
(checkServerSession) is gated on a profile and swallowed fetch timeouts, so ended
sessions "sometimes" showed as Live after restart. Trusting only the server kills
this whole class of bug.

**How to apply:** keep solo sessions in cache; drop all group sessions on restore.
Also mark the local card terminal at every real end-point for snappy in-tab UX
(poll "deleted"→removeSession; poll/handleEndSession/tie-breaker "completed"→
updateSession status completed), and gate host fire-and-forget completion POSTs on
`res.ok` before marking local completed. Note: server intentionally returns null
for a <2-member "waiting" room (abandoned) — so a solo host's waiting room
legitimately shows no card, and that is not a regression.
