---
name: Group-swipe real-time match polling
description: Why match polling must stay decoupled from the session-lookup endpoint, and the render-order rule that surfaces matches to a waiting user.
---

# Group-swipe real-time match polling (GroupSwipe.tsx)

## Rule 1 — never couple match detection to the session-lookup endpoint
`GET /api/group/sessions/:code` (session lookup) is rate-limited (~20/min/IP).
`GET /api/group/sessions/:code/matches` and `/tiebreaker` are NOT rate-limited and
the matches endpoint returns sanitized `members` alongside matches.

The poll is split: match detection runs every ~2s against the unlimited matches
endpoint and derives member count from `matchData.members.length`; the session
lookup (availability/membership/host/`completed`) runs on a slower cadence
(~every 6s, ~10/min) so it stays under the limit. A 429 on the session lookup is
harmless and must NOT short-circuit match polling.

**Why:** earlier code fetched the session lookup first and skipped match
detection whenever it failed. At any poll cadence above 20/min the session lookup
429s for part of every minute, which silently starved the real-time match path —
a user waiting on the results screen never saw the match. Lowering the interval
made it worse, not better.

**How to apply:** if you touch the GroupSwipe poll, keep match detection
independent of the session lookup. Do not "simplify" by merging them or by gating
matches on the session response. Don't just lower the poll interval to chase
"real-time" — the unlimited matches endpoint is what delivers it.

## Rule 2 — render-order: a waiting user's match overlay must beat the results guard
The results/`sessionEnded` early-return in render must be guarded so it does NOT
fire when a match overlay or dish-restaurants view should show:
`if ((showResults || sessionEnded) && !showMatchOverlay && !showDishList)`.

**Why:** a user who finished their deck sits on the results screen; the poll then
sets `fullMatch`, but if the results guard runs first the overlay is suppressed
and they appear to need to swipe again. The match overlay / dish-list blocks live
*after* the results guard in render order, so the guard has to yield to them.

**How to apply:** compute `showMatchOverlay = fullMatch && matchedItem && !sessionEnded`
and `showDishList = showDishRestaurants && matchedDish`, and keep them in the
results-guard condition. Use refs (e.g. `fullMatchRef`, `showDishRestaurantsRef`)
inside the long-lived poll effect instead of state, to avoid stale closures.

## Rule 3 — pause the parent poll while a tie-breaker is active
When `tieBreakerActive`, the rendered `GroupTieBreakerGame` owns `/tiebreaker`
polling and fires `onComplete` once on finished. The parent poll early-returns
(via `tieBreakerActiveRef`) to avoid duplicate requests. On menu-mode completion,
resolve the winning dish from loaded `dishItems` OR fetch `/api/menu-items/:id`
before showing its restaurants, so a deep-link/refresh race doesn't dump the user
on the generic results screen.
