---
name: Group tie-breaker trigger gating
description: Why the "Can't decide?" opt-in tie-breaker button on the GroupSwipe results page must be gated on !sessionEnded.
---

The group tie-breaker mini-game (RPS for 2, Longest Fry for 3+) is launched opt-in from a
"Can't decide?" button on the GroupSwipe results/top-picks page — NOT auto-launched on session end.

**Rule:** The button must stay gated on `!sessionEnded` (in addition to 2+ full matches, no finalPick, no active game). Any session member can start it (server checks membership, not host).

**Why:** Non-initiating members auto-join an active tie-breaker via a ~2s poll, but that poll's
tie-breaker detection is guarded by `!sessionEndedRef.current`. Once a session is formally
completed (host "End Session"/"Wrap it up" → status=completed → every member's poll sets
sessionEnded=true), the poll stops looking for new games, so a game started after that point
would only render for the initiator and strand everyone else. The two approved wrap-up paths
("View My Top Picks" and deck-exhaust) deliberately set `showResults=true` but leave
`sessionEnded=false`, so the poll-based multiplayer join still works there.

**How to apply:** If you ever want the game to be startable after a formal end, you must FIRST
remove/relax the `!sessionEndedRef.current` guard on the poll's tie-breaker detection (and ensure
finished games don't re-trigger) — otherwise non-initiators silently won't join. Don't just drop
the `!sessionEnded` button gate.

Eligibility count must match the server: both sides count only `right`/`super` swipes, require
distinct-voter count >= current member count, and filter by current swipeType ("menu" pre-phase,
else "restaurant"). Keep them in lockstep or the button will show when the server returns 400.
