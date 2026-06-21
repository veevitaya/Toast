---
name: Group-swipe match overlay acknowledgement
description: Why menu-phase match overlays in GroupSwipe need a "seen" set, and the poll-vs-immediate dual-detection trap.
---

# Menu-phase match overlays must track acknowledgement

In `GroupSwipe.tsx` the dish/menu-phase match overlay is opened from TWO places that
both just call `setFullMatch(true)` when a dish has `voters >= memberCount`:
1. the 2s background poll (`fetchMatches`), and
2. the immediate swipe-response handler (`handleDishSwipe`).

**Rule:** any overlay driven by a recurring poll over *server-persisted* state must
track which items were already acknowledged (a `seenMenuMatchesRef` Set), or it
re-fires forever. A guard like `!fullMatchRef.current` only suppresses *while the
overlay is open* — once the user dismisses ("Keep Swiping" → `fullMatch=false`) the
match still exists server-side, so the next poll re-opens the same one.

**Why:** the menu match is durable (both members' right-swipes persist). Dismissal
is client-only state; without a seen-set the poll and the immediate handler keep
re-detecting the same dish. The restaurant phase does NOT have this bug because it
dedups into `allMatches` and only triggers the overlay when the array length grows.

**How to apply:** when adding/observing poll-driven "match"/"notification" overlays
in group flows, confirm there is acknowledgement tracking, add the id to the seen-set
*before* `setFullMatch(true)` in every detection path, and reset the set when
`sessionCode` changes (Wouter may reuse the component across sessions).
