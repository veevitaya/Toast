---
name: Confetti keyframes (swipe-match vs tie-breaker)
description: Why swipe-match confetti uses its own dissolve-in-flight keyframe instead of the tie-breaker's cannon.
---

Swipe-match celebration confetti (the `ConfettiExplosion` component, duplicated in GroupSwipe + SwipePage) must use a keyframe that fades pieces to `opacity: 0` *in flight* (`swipe-confettiCannon`), NOT the tie-breaker reveal's cannon (`tbd-confettiCannon`).

**Why:** A confetti "cannon" that decelerates into an apex while holding `opacity: 1` leaves pieces visibly hovering opaque in the upper-middle of the screen — users read this as "confetti stuck in the middle." The tie-breaker (`DestinationReveal`) gets away with that physics only because an opaque payoff card slides over the confetti ~3.25s in and hides the hang. The plain swipe-match overlay has no such cover, so any apex-hang is exposed.

**How to apply:** Keep the two keyframes separate. Any "cannon"-style burst on an *uncovered* overlay must dissolve mid-air (fade out near the apex) rather than hang opaque or fall back slowly. Don't "unify" the swipe confetti back onto `tbd-confettiCannon`. If you must change celebration confetti, verify it on the uncovered swipe-match overlay, not just the tie-breaker.
