---
name: Polled turn-game atomic guards (server-coordinated)
description: For polled multiplayer turn state, make submissions idempotent via single-UPDATE WHERE guards, and include the round/phase count so delayed duplicates can't leak across phases.
---

The group tie-breaker (RPS / Longest Fry) is server-coordinated and client-polled
(no websockets). State lives in one jsonb column on `group_tiebreakers`.

**Rule:** every player submission (champion pick, RPS move, fry pull) is applied as a
SINGLE `UPDATE ... SET gameState=jsonb_set(...) WHERE <guards>` — never read-modify-write
in JS. Guards live in the same statement: e.g. move = `status='playing' AND
pendingMoves->user IS NULL`; fry = also `NOT EXISTS (jsonb_each_text(picks) value=fryId)`.

**Why:** under READ COMMITTED, when a concurrent UPDATE touches the same row, Postgres
re-evaluates the WHERE qual (EvalPlanQual) against the latest committed row, so the losing
writer updates 0 rows (returns undefined) — driver-agnostic, no explicit transaction needed.
A 0-row result is treated as a harmless no-op (return current state / 409 for fry).

**Round-safety trap:** `pendingMoves` resets to `{}` when a round advances, so a guard of
only `pendingMoves->user IS NULL` lets a DELAYED duplicate from the prior round leak in as
the NEXT round's move. Fix: client sends the in-progress round index
(`gameState.rounds.length`, since `rounds` holds only completed rounds); storage adds
`jsonb_array_length(coalesce(gameState->'rounds','[]')) = expectedRound` to the same guarded
UPDATE. Same idea applies to any phase-countered polled game.
