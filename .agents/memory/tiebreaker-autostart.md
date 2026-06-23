---
name: Tie-breaker auto-start (group mode)
description: When/how the group tie-breaker minigame auto-launches, and the deliberate single-trigger-per-session decision.
---

# Group tie-breaker auto-start

The group tie-breaker minigame auto-launches (no longer opt-in only) when the group reaches 3 full matches (everyone in) in the current swipe phase. Host-only triggers the start; other members are pulled in by the existing tiebreaker poll that flips `tieBreakerActive`. Game type stays server-chosen by participant count (2 → RPS, 3+ → Longest Fry).

## Single-trigger-per-session (intentional)
Auto-start fires at most ONCE per session, not once per phase. After it fires — or after a menu→restaurant phase transition — it stays suppressed for the rest of that session.
**Why:** re-firing a minigame right after the group just played one is annoying; this was endorsed as the right default. The manual "Can't decide?" button on the results page is the intended path for a second/again run.
**How to apply:** a per-session sessionStorage lock (`toast_tb_autostart_${sessionCode}`) plus a sticky ref both gate it; reset only on a new `sessionCode`. Don't "fix" this to re-trigger per phase without product sign-off.

## Lock-after-success, not before
Persist the sessionStorage lock only AFTER the server confirms a started game; on failure (or null profile) reset the in-flight ref so the next poll tick can retry.
**Why:** setting the lock before a valid/successful start can permanently suppress auto-launch if the start request transiently fails or the profile hasn't loaded yet.

## Phase-count hygiene
The per-phase full-match count must reset to 0 on `swipePhase`/`sessionCode` change, or a stale count of 3 (carried from a prior phase) can launch a game before the new phase's matches have been polled.
