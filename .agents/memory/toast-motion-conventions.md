---
name: Toast motion conventions
description: Reduce-motion gating policy, the pressable exception, pointer-gated tilt, and layoutId-per-region pills for Toast UI animation work.
---

# Toast motion conventions (framer-motion)

Rules that govern adding/graduating animations into the real Toast app.

## Reduce-motion gating
- Every NEW transform/loop/scroll animation must be a no-op under `useReducedMotion()` (render plain/static/opacity-only). Shared primitives (BlurImage, CountUp, TextMask, Reveal, TiltCard) already self-gate internally.
- The `squishable` press preset is a transform, so it must be gated at EACH call site, e.g. `{...(reduce ? {} : squishable)}` or `whileTap={reduce ? undefined : squishable.whileTap}`. Spreading it unconditionally is a reduce-motion bug.
- **Exception:** the pre-existing global `pressable` preset is intentionally NOT reduce-gated and is used app-wide. Do not "fix" it to match `squishable`; only new presets need gating.
**Why:** architect requirement — new transforms must respect prefers-reduced-motion; `pressable` predates the policy and changing it would churn the whole app.

## Pointer-gated tilt
- The 3D `TiltCard` must render a plain wrapper unless BOTH reduce-motion is off AND `matchMedia('(hover: hover) and (pointer: fine)')` matches. Mouse-only is not enough on hybrid/coarse devices.
**How to apply:** keep all hooks (useSpring/useState/useEffect) unconditional, then early-return the plain `<div>` on `reduce || !fine` before wiring `onMouseMove`.

## layoutId-per-region pills (slide pill / shared-ring)
- Sliding pills/rings driven by `layoutId` must use a UNIQUE id per visual region. BottomNav uses one `navPill`. EmojiFilter takes a `pillId` prop wired distinctly in BottomSheet: `vibePillMain` for the main rows vs `vibePillModal` for the more-vibes modal.
**Why:** reusing one layoutId across two regions makes the pill jump/animate between unrelated containers when both can have an active item.
- EmojiFilter ring is an `absolute inset-0 ring-2 pointer-events-none` overlay rendered only when `active && pillId` — keeps it scoped to where BottomSheet opts in and leaves other EmojiFilter usages visually unchanged.

## Reveal + overflow
- `Reveal` uses small ±22px x-offsets; the scroll container/page root must be `overflow-x-hidden` or the offset creates a transient horizontal scrollbar. RestaurantDetail root carries it.
