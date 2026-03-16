import type { Restaurant, TasteDna, TasteContextPattern, RecentMealMemory } from "@shared/schema";
import { computeEffectiveWeight, getDaysSince, DECAY_CONSTANTS } from "./eventWeighting";

export interface MomentContext {
  daypart: string;
  mood?: string;
  areaLabel?: string;
  weatherLabel?: string;
  isWeekend: boolean;
  groupSize?: number;
}

export interface UserHistory {
  categoryAffinities: Record<string, number>;
  recentAcceptedIds: Set<number>;
  recentRejectedIds: Set<number>;
  savedIds: Set<number>;
  viewedIds: Set<number>;
  recentCuisines: Array<{ cuisine: string; date: string }>;
  recentRestaurants: Array<{ id: number; date: string }>;
}

export interface ScoreBreakdown {
  longTermFit: number;
  contextFit: number;
  recencyNoveltyFit: number;
  marketQualityFit: number;
  explorationBonus: number;
  recentCuisinePenalty: number;
  repeatedRestaurantPenalty: number;
  finalScore: number;
  topContributors: string[];
}

export interface RankedCandidate {
  restaurant: Restaurant;
  score: number;
  breakdown: ScoreBreakdown;
}

const MOOD_CUISINE_MAP: Record<string, string[]> = {
  comforting: ["ramen", "noodles", "curry", "soup", "thai", "stew"],
  healthy: ["salad", "poke", "smoothie", "vegan", "healthy", "juice"],
  fun: ["burgers", "tacos", "pizza", "bbq", "street food"],
  indulgent: ["fried chicken", "dessert", "pasta", "fine dining", "steak"],
  spicy: ["thai", "isaan", "korean", "mexican", "indian", "sichuan"],
  quick: ["street food", "noodles", "fast", "quick", "sandwich"],
  fresh: ["salad", "poke", "sushi", "seafood", "japanese"],
  warm: ["ramen", "curry", "soup", "thai", "hotpot"],
  adventurous: ["fusion", "ethiopian", "peruvian", "middle eastern"],
};

const DAYPART_ATTRIBUTE_MAP: Record<string, string[]> = {
  morning: ["quick", "budget-friendly"],
  lunch: ["quick", "budget-friendly"],
  afternoon: ["comforting"],
  dinner: ["group-friendly", "indulgent"],
  latenight: ["late-night", "quick"],
};

export function rankCandidates(
  candidates: Restaurant[],
  tasteDna: TasteDna | null,
  contextPatterns: TasteContextPattern | null,
  mealMemory: RecentMealMemory | null,
  moment: MomentContext,
  history: UserHistory
): RankedCandidate[] {
  const ranked = candidates.map(r => {
    const breakdown = computeScoreBreakdown(r, tasteDna, contextPatterns, mealMemory, moment, history);
    return { restaurant: r, score: breakdown.finalScore, breakdown };
  });

  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}

function computeScoreBreakdown(
  r: Restaurant,
  dna: TasteDna | null,
  ctx: TasteContextPattern | null,
  memory: RecentMealMemory | null,
  moment: MomentContext,
  history: UserHistory
): ScoreBreakdown {
  const rCats = r.category.toLowerCase().split(/[,·•]/).map(c => c.trim());
  const vibes = r.vibes || [];
  const contributors: Array<{ label: string; value: number }> = [];

  const longTermFit = computeLongTermFit(rCats, vibes, dna, history, contributors, r.priceLevel || 2);
  const contextFit = computeContextFit(rCats, vibes, r, moment, ctx, contributors);
  const recencyNoveltyFit = computeRecencyNoveltyFit(rCats, r, dna, memory, history, contributors);
  const marketQualityFit = computeMarketQualityFit(r, contributors);
  const explorationBonus = computeExplorationBonus(rCats, dna, history, contributors);

  let recentCuisinePenalty = 0;
  let repeatedRestaurantPenalty = 0;

  if (memory) {
    const recentCuisines = (memory.recentCuisinesJson as any[]) || [];
    for (const entry of recentCuisines) {
      const cuisine = typeof entry === "string" ? entry : entry?.cuisine;
      const date = typeof entry === "object" ? entry?.date : null;
      if (cuisine && rCats.some(c => c.includes(cuisine) || cuisine.includes(c))) {
        const days = date ? getDaysSince(date) : 0;
        recentCuisinePenalty += 0.1 * computeEffectiveWeight(1, days, DECAY_CONSTANTS.cuisineChoices);
      }
    }

    const recentRestaurants = (memory.recentRestaurantsJson as any[]) || [];
    for (const entry of recentRestaurants) {
      const id = typeof entry === "number" ? entry : entry?.id;
      const date = typeof entry === "object" ? entry?.date : null;
      if (id === r.id) {
        const days = date ? getDaysSince(date) : 0;
        repeatedRestaurantPenalty = 0.2 * computeEffectiveWeight(1, days, DECAY_CONSTANTS.shortTermMood);
      }
    }
  }

  if (history.recentAcceptedIds.has(r.id)) {
    repeatedRestaurantPenalty = Math.max(repeatedRestaurantPenalty, 0.15);
  }

  const finalScore =
    0.35 * longTermFit +
    0.30 * contextFit +
    0.15 * recencyNoveltyFit +
    0.15 * marketQualityFit +
    0.05 * explorationBonus -
    recentCuisinePenalty -
    repeatedRestaurantPenalty;

  contributors.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const topContributors = contributors.slice(0, 5).map(c => c.label);

  return {
    longTermFit,
    contextFit,
    recencyNoveltyFit,
    marketQualityFit,
    explorationBonus,
    recentCuisinePenalty,
    repeatedRestaurantPenalty,
    finalScore,
    topContributors,
  };
}

function computeLongTermFit(
  rCats: string[],
  vibes: string[],
  dna: TasteDna | null,
  history: UserHistory,
  contributors: Array<{ label: string; value: number }>,
  priceLevel: number
): number {
  let score = 0.5;

  if (dna) {
    const cuisineAffinity = (dna.cuisineAffinityJson as Record<string, number>) || {};
    const cuisineDislike = (dna.cuisineDislikeJson as Record<string, number>) || {};

    for (const cat of rCats) {
      if (cuisineAffinity[cat]) {
        const boost = Math.min(0.3, cuisineAffinity[cat] * 0.05);
        score += boost;
        if (boost > 0.05) contributors.push({ label: "cuisine_affinity", value: boost });
      }
      if (cuisineDislike[cat]) {
        const penalty = Math.min(0.2, cuisineDislike[cat] * 0.04);
        score -= penalty;
      }
    }

    const spiceScore = (dna.spiceScore || 50) / 100;
    const isSpicy = rCats.some(c => ["thai", "isaan", "korean", "mexican", "indian", "sichuan"].some(s => c.includes(s)));
    if (isSpicy) {
      score += (spiceScore - 0.5) * 0.15;
      if (spiceScore > 0.6) contributors.push({ label: "spice_fit", value: spiceScore * 0.1 });
    }

    const healthyScore = (dna.healthyScore || 50) / 100;
    const isHealthy = rCats.some(c => ["salad", "healthy", "vegan", "poke"].some(s => c.includes(s)));
    const isIndulgent = rCats.some(c => ["bbq", "fried", "dessert", "burger"].some(s => c.includes(s)));
    if (isHealthy) score += (healthyScore - 0.5) * 0.1;
    if (isIndulgent) score += ((dna.indulgentScore || 50) / 100 - 0.5) * 0.1;

    const budgetNorm = (dna.budgetScore || 50) / 100;
    const priceFit = 1 - Math.abs(budgetNorm - (priceLevel / 4));
    score += (priceFit - 0.5) * 0.1;
    if (priceFit > 0.7) contributors.push({ label: "price_fit", value: priceFit * 0.05 });
  }

  for (const cat of rCats) {
    if (history.categoryAffinities[cat]) {
      score += Math.min(0.15, history.categoryAffinities[cat] * 0.02);
    }
  }

  return Math.max(0, Math.min(1, score));
}

function computeContextFit(
  rCats: string[],
  vibes: string[],
  r: Restaurant,
  moment: MomentContext,
  ctx: TasteContextPattern | null,
  contributors: Array<{ label: string; value: number }>
): number {
  let score = 0.5;

  const daypartAttrs = DAYPART_ATTRIBUTE_MAP[moment.daypart] || [];
  for (const attr of daypartAttrs) {
    if (vibes.some(v => v.toLowerCase().includes(attr))) {
      score += 0.1;
      contributors.push({ label: "daypart_fit", value: 0.1 });
      break;
    }
  }

  const DAYPART_CATS: Record<string, string[]> = {
    morning: ["cafe", "brunch", "coffee", "bakery", "breakfast"],
    lunch: ["thai", "japanese", "noodles", "street food", "quick"],
    afternoon: ["cafe", "dessert", "tea", "boba", "snack"],
    dinner: ["bbq", "fine dining", "sushi", "italian", "korean", "seafood"],
    latenight: ["street food", "ramen", "noodles", "thai", "bar"],
  };

  const timeCats = DAYPART_CATS[moment.daypart] || [];
  for (const cat of rCats) {
    if (timeCats.some(tc => cat.includes(tc) || tc.includes(cat))) {
      score += 0.12;
      contributors.push({ label: "time_match", value: 0.12 });
      break;
    }
  }

  if (moment.mood) {
    const moodCuisines = MOOD_CUISINE_MAP[moment.mood.toLowerCase()] || [];
    for (const cat of rCats) {
      if (moodCuisines.some(mc => cat.includes(mc) || mc.includes(cat))) {
        score += 0.15;
        contributors.push({ label: "mood_fit", value: 0.15 });
        break;
      }
    }
  }

  if (moment.areaLabel && r.district?.toLowerCase() === moment.areaLabel.toLowerCase()) {
    score += 0.08;
    contributors.push({ label: "nearby", value: 0.08 });
  }

  if (ctx) {
    const contextKey = moment.isWeekend
      ? (moment.daypart === "lunch" ? "weekendLunchJson" : "weekendDinnerJson")
      : (moment.daypart === "lunch" ? "weekdayLunchJson" : "weekdayDinnerJson");
    const patternData = (ctx as any)[contextKey] as Record<string, number> | null;
    if (patternData) {
      for (const cat of rCats) {
        if (patternData[cat]) {
          score += Math.min(0.1, patternData[cat] * 0.02);
        }
      }
    }
  }

  return Math.max(0, Math.min(1, score));
}

function computeRecencyNoveltyFit(
  rCats: string[],
  r: Restaurant,
  dna: TasteDna | null,
  memory: RecentMealMemory | null,
  history: UserHistory,
  contributors: Array<{ label: string; value: number }>
): number {
  let score = 0.5;

  const noveltyPref = dna ? (dna.noveltyScore || 50) / 100 : 0.5;

  const isNew = r.isNew;
  const hasBeenTried = history.recentAcceptedIds.has(r.id) || history.savedIds.has(r.id) || history.viewedIds.has(r.id);

  if (!hasBeenTried && noveltyPref > 0.5) {
    score += (noveltyPref - 0.5) * 0.3;
    contributors.push({ label: "novelty_boost", value: (noveltyPref - 0.5) * 0.2 });
  }

  if (isNew) {
    score += 0.05;
  }

  if (memory) {
    const recentCuisines = (memory.recentCuisinesJson as any[]) || [];
    const recentCuisineSet = new Set(recentCuisines.map((e: any) => typeof e === "string" ? e : e?.cuisine).filter(Boolean));
    const overlap = rCats.filter(c => recentCuisineSet.has(c));
    if (overlap.length > 0) {
      score -= 0.1 * overlap.length;
    }
  }

  if (history.recentRejectedIds.has(r.id)) {
    score -= 0.2;
  }

  return Math.max(0, Math.min(1, score));
}

function computeMarketQualityFit(
  r: Restaurant,
  contributors: Array<{ label: string; value: number }>
): number {
  let score = 0.5;

  const rating = parseFloat(r.rating) || 4.0;
  const ratingBoost = (rating - 3.5) / 2.0;
  score += Math.max(-0.2, Math.min(0.3, ratingBoost));

  if (rating >= 4.5) {
    contributors.push({ label: "highly_rated", value: ratingBoost });
  }

  const popularity = (r.trendingScore || 0) / 100;
  score += popularity * 0.15;

  if (popularity > 0.7) {
    contributors.push({ label: "trending", value: popularity * 0.1 });
  }

  return Math.max(0, Math.min(1, score));
}

function computeExplorationBonus(
  rCats: string[],
  dna: TasteDna | null,
  history: UserHistory,
  contributors: Array<{ label: string; value: number }>
): number {
  const explorationPref = dna ? (dna.explorationScore || 50) / 100 : 0.5;

  const hasNoHistory = !history.categoryAffinities || Object.keys(history.categoryAffinities).length === 0;
  const isUnfamiliar = rCats.every(c => !history.categoryAffinities[c]);

  let bonus = 0.3;

  if (hasNoHistory) {
    bonus += 0.2;
  } else if (isUnfamiliar && explorationPref > 0.5) {
    bonus += explorationPref * 0.3;
    contributors.push({ label: "fresh_pick", value: explorationPref * 0.2 });
  }

  bonus += Math.random() * 0.1;

  return Math.max(0, Math.min(1, bonus));
}

export function selectPrimaryAndAlternatives(ranked: RankedCandidate[]): {
  primary: RankedCandidate;
  familiarAlternative: RankedCandidate | null;
  exploratoryAlternative: RankedCandidate | null;
} {
  const primary = ranked[0];

  let familiarAlternative: RankedCandidate | null = null;
  let exploratoryAlternative: RankedCandidate | null = null;

  for (let i = 1; i < ranked.length; i++) {
    const candidate = ranked[i];
    if (!familiarAlternative && candidate.breakdown.longTermFit > 0.5) {
      familiarAlternative = candidate;
    } else if (!exploratoryAlternative && candidate.breakdown.explorationBonus > 0.5) {
      exploratoryAlternative = candidate;
    }
    if (familiarAlternative && exploratoryAlternative) break;
  }

  if (!familiarAlternative && ranked.length > 1) familiarAlternative = ranked[1];
  if (!exploratoryAlternative && ranked.length > 2) exploratoryAlternative = ranked[2];

  return { primary, familiarAlternative, exploratoryAlternative };
}
