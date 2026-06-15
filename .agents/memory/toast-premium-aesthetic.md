---
name: Toast premium aesthetic
description: What "friendly + premium, not childish" means for Toast UI, plus the hard background rule.
---

# Toast premium ≠ childish

Toast's brand is #FFCC02 golden yellow, Plus Jakarta Sans headings + Inter body, mobile-first. When asked for "friendly and premium that appeals to all ages," the user repeatedly rejected childish treatments.

**Avoid:** candy/pastel filled tiles, oversized emoji, emoji inside colored background chips, bouncing/rotated/spring mascot "stamps", default-selected-looking accents (a gold ring on one card reads as pre-selected — they did not want that).

**Prefer:** uniform plain-white cards with hairline borders (border-black/[0.06]) and soft low shadows; enlarged emoji shown directly (no chip); gold used sparingly as an accent (eyebrow pills, check bubbles, verdict callouts, tinted dividers), not as large fills. Reduce font weights (bold/semibold over extrabold). Unify related surfaces into one editorial card rather than several separate blocks.

**Why:** the user's taste is mature/editorial; bright fills and playful motion read as "kids app." Consistency with the existing white-card system beats novel per-card coloring.

**Exception (explicitly requested):** on the group taste screen (`client/src/pages/GroupTaste.tsx`, route `/group/taste`) the user explicitly chose colorful food emoji on the mood/cuisine/restriction chips to match the onboarding cuisine screen (`client/src/pages/Onboarding.tsx`). Keep these emoji; do not strip them. This overrides the general "avoid emoji in chips" guidance for this one screen.

**Hard rule — never violate:** the Solo screens (`client/src/pages/SoloJourney.tsx`, route `/solo`) must keep `bg-background`. Never hardcode a cream/custom page background. The user has restated this many times.

**How to apply:** any redesign of SoloJourney intent/result screens — match the white-card language, keep gold as accent only, leave the page background as `bg-background`.
