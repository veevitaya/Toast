export const EVENT_WEIGHTS: Record<string, number> = {
  recommendation_accepted: 10,
  restaurant_detail_opened: 4,
  saved: 5,
  swipe_right: 2,
  long_dwell: 1.5,
  recommendation_rejected: -4,
  swipe_left: -2,
  fast_skip: -1,
  alternative_requested: -3,
  hero_impression: 0.5,
  refine_applied: 1,
  refine_opened: 0.2,
  primary_cta_clicked: 3,
  detail_viewed: 4,
  session_abandoned: -2,
};

export const DECAY_CONSTANTS = {
  shortTermMood: 7,
  cuisineChoices: 21,
  repeatSelections: 45,
};

export const LEARNING_RATES = {
  strongAccept: 0.02,
  mediumEvent: 0.01,
  weakEvent: 0.005,
  repeatedNegative: -0.015,
};

export function getEventWeight(eventType: string): number {
  return EVENT_WEIGHTS[eventType] ?? 0;
}

export function computeDecay(daysSinceEvent: number, decayConstant: number): number {
  return Math.exp(-daysSinceEvent / decayConstant);
}

export function computeEffectiveWeight(
  baseWeight: number,
  daysSinceEvent: number,
  decayConstant: number
): number {
  return baseWeight * computeDecay(daysSinceEvent, decayConstant);
}

export function getDaysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(0, (now - then) / (1000 * 60 * 60 * 24));
}
