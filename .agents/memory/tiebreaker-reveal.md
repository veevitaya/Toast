---
name: Tie-breaker reveal architecture
description: How the group tie-breaker payoff reveals (fry race / duel) are built — dark handoff, honesty guard, and poll-safe timers.
---

# Tie-breaker reveal (fry race / duel → destination)

The resolved tie-breaker games render a full-screen DARK stage (`#070B16`, `absolute inset-0 z-[60]`) that runs its own timed sequence, then hands off to the shared `DestinationReveal`, which itself opens on a dark "sealed" cloche phase (sealed→lifting→reveal→payoff). Keep the pre-handoff stage dark so the cut into DestinationReveal is seamless — a light/cream stage flashes.

**Honesty guard (never fabricate a winner).** A resolved reveal must only crown a winner whose REAL data is present — `tb.winnerLineUserId` set, that id is in `participants`, and their pulled item exists (e.g. the fry `carton.find(picks[winnerId])`). If the resolved payload hasn't fully arrived, hold on the dark loader and let the poll fill it in.
**Why:** matches Toast's app-wide honesty principle (no fake fallbacks); a transient lagged/partial poll payload otherwise crowns a bogus winner — defaulting to `participants[0]` or flooring a length to `lenToCm(0)` = 7cm — for a split second.
**How to apply:** any resolved/settled reveal branch in `FryView`/`DuelView` — guard before rendering the celebratory reveal; render the dark loader otherwise.

**Poll-safe timers.** These reveals mount under a parent that re-renders on the ~1.5s tie-breaker poll. A timed/animation sequence must survive parent re-renders without restarting or double-firing:
- Stabilize parent callbacks (e.g. `onDone`) through a ref (`onDoneRef.current = onDone`) and guard the one-time handoff with a `doneRef` boolean, so the handoff effect can depend only on `[phase]`.
- Key the rAF/animation effect on primitive deps only (e.g. `[phase, maxCm]` where `maxCm` is a number) so re-renders with equal values don't re-run it; `setState` ticks inside the loop won't interrupt it.
**Why:** if an effect depends on a freshly-created callback identity or a recomputed object, every poll re-render cancels/restarts the animation or re-fires the handoff.
