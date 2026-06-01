---
name: recommendation engine guaranteePick
description: How the recommendation engine's honest-match threshold and guaranteePick option behave, and the dead-end risk when filtering candidate pools by exclusion.
---

# Recommendation engine: honest match + guaranteePick

The engine (`server/recommendation/index.ts` `generateRecommendation`) maps a raw
0–1 fit score onto a 0–99% "honest match" and, by default, returns `null` when the
top pick is below the 90% threshold — it would rather show a learning/empty state
than recommend something it doesn't believe in.

`guaranteePick: true` (a request flag) bypasses the 90% gate for the primary AND
relaxes the alternative threshold to 0. Under it, the ONLY null-return paths are an
empty candidate set or empty ranked set — i.e. a genuinely empty corpus.

**Why:** the Solo "Toast Decides" flow must always land one confident pick; strict
callers (`/api/personalized`, `/api/session/bootstrap`) must keep the honest 90%
behavior, so the flag is opt-in per request.

**How to apply:** When a caller filters the candidate pool by exclusion (e.g.
"Another option" excludeIds), filtering can empty the pool and the engine then
returns null even with guaranteePick — re-introducing a dead-end. Always fall back
to the unfiltered pool when the filtered pool is empty before calling the engine.

# Personalization auth convention (app-wide)

Personalization endpoints in `server/routes.ts` (`/api/personalized`,
`/api/solo/decide`, etc.) trust `userId` from the request body and load that user's
TasteDNA/events without token/session verification. This is the established
LIFF-based pattern across the whole app, not a per-endpoint choice. Stay consistent;
don't harden a single endpoint in isolation — it would be an app-wide change.
