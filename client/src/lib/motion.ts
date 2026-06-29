import type { Variants, Transition } from "framer-motion";

// Toast motion language — one source of truth so every surface moves the same way.
// Goal: premium yet fun. Smooth, confident settles (no linear/ease), a little life on
// entrances and presses, never bouncy-to-the-point-of-childish.

// Easing curves
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]; // signature premium settle
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

// Springs
export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 30 };
export const springSnappy: Transition = { type: "spring", stiffness: 420, damping: 28 };
export const springBouncy: Transition = { type: "spring", stiffness: 500, damping: 18 };

// Durations (seconds)
export const DUR = { fast: 0.18, base: 0.34, slow: 0.5 } as const;

// --- Entrances ---
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: springSoft },
};

// --- Staggered lists (rows, grids, cards) ---
export const staggerContainer = (stagger = 0.06, delayChildren = 0.04): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
};

// --- Pop-scale list entrance (use as the stagger child where a livelier pop fits) ---
export const popItem: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 480, damping: 24, mass: 0.7 },
  },
};

// --- Press feedback for tappable cards/buttons ---
export const pressable = {
  whileTap: { scale: 0.97 },
  transition: springSnappy,
} as const;

// --- Squish press: gentle non-uniform compress for tappables (opt-in; not for
// image-heavy cards that already tilt). Settles with a snappy spring. ---
export const squishable = {
  whileTap: { scaleX: 1.02, scaleY: 0.95 },
  transition: springSnappy,
} as const;

// --- Page transitions (enter-only, keyed remount — robust with wouter routing) ---
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE_OUT } },
};
