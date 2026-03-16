import type { TasteDna, TasteContextPattern, RecentMealMemory, Restaurant } from "@shared/schema";
import { LEARNING_RATES } from "./eventWeighting";

export interface TasteDnaUpdate {
  comfortScore?: number;
  explorationScore?: number;
  healthyScore?: number;
  indulgentScore?: number;
  spiceScore?: number;
  distanceScore?: number;
  budgetScore?: number;
  noveltyScore?: number;
  speedPreferenceScore?: number;
  cuisineAffinityJson?: Record<string, number>;
  cuisineDislikeJson?: Record<string, number>;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function adjustScore(current: number, delta: number): number {
  return clampScore(current + delta * 100);
}

export function computeTasteDnaUpdates(
  currentDna: TasteDna,
  eventType: string,
  restaurant: Restaurant | null,
  metadata: any
): TasteDnaUpdate {
  const updates: TasteDnaUpdate = {};
  if (!restaurant) return updates;

  const rCats = restaurant.category.toLowerCase().split(/[,·•]/).map(c => c.trim());
  const vibes = restaurant.vibes || [];

  const isPositive = ["recommendation_accepted", "saved", "swipe_right", "restaurant_detail_opened", "primary_cta_clicked"].includes(eventType);
  const isStrongPositive = ["recommendation_accepted", "saved"].includes(eventType);
  const isNegative = ["recommendation_rejected", "swipe_left", "session_abandoned"].includes(eventType);

  const rate = isStrongPositive ? LEARNING_RATES.strongAccept
    : isPositive ? LEARNING_RATES.mediumEvent
    : isNegative ? LEARNING_RATES.repeatedNegative
    : LEARNING_RATES.weakEvent;

  const comfortCats = ["ramen", "noodles", "curry", "soup", "stew", "comfort"];
  const healthyCats = ["salad", "healthy", "vegan", "poke", "smoothie"];
  const indulgentCats = ["bbq", "fried", "burger", "dessert", "pizza", "fine dining"];
  const spicyCats = ["thai", "isaan", "korean", "mexican", "indian", "sichuan"];
  const quickCats = ["street food", "fast", "quick", "noodles"];

  if (rCats.some(c => comfortCats.some(cc => c.includes(cc)))) {
    updates.comfortScore = adjustScore(currentDna.comfortScore || 50, rate);
  }
  if (rCats.some(c => healthyCats.some(hc => c.includes(hc)))) {
    updates.healthyScore = adjustScore(currentDna.healthyScore || 50, rate);
  }
  if (rCats.some(c => indulgentCats.some(ic => c.includes(ic)))) {
    updates.indulgentScore = adjustScore(currentDna.indulgentScore || 50, rate);
  }
  if (rCats.some(c => spicyCats.some(sc => c.includes(sc)))) {
    updates.spiceScore = adjustScore(currentDna.spiceScore || 50, rate);
  }
  if (rCats.some(c => quickCats.some(qc => c.includes(qc)))) {
    updates.speedPreferenceScore = adjustScore(currentDna.speedPreferenceScore || 50, rate);
  }

  if (restaurant.isNew) {
    updates.noveltyScore = adjustScore(currentDna.noveltyScore || 50, rate * 0.5);
    updates.explorationScore = adjustScore(currentDna.explorationScore || 50, rate * 0.5);
  }

  const budgetRate = rate * 0.3;
  if (restaurant.priceLevel <= 1) {
    updates.budgetScore = adjustScore(currentDna.budgetScore || 50, budgetRate);
  } else if (restaurant.priceLevel >= 3) {
    updates.budgetScore = adjustScore(currentDna.budgetScore || 50, -budgetRate);
  }

  const currentAffinity = (currentDna.cuisineAffinityJson as Record<string, number>) || {};
  const currentDislike = (currentDna.cuisineDislikeJson as Record<string, number>) || {};
  const updatedAffinity = { ...currentAffinity };
  const updatedDislike = { ...currentDislike };

  for (const cat of rCats) {
    if (isPositive) {
      updatedAffinity[cat] = Math.min(10, (updatedAffinity[cat] || 0) + (isStrongPositive ? 1.0 : 0.5));
      if (updatedDislike[cat]) updatedDislike[cat] = Math.max(0, updatedDislike[cat] - 0.2);
    } else if (isNegative) {
      updatedAffinity[cat] = Math.max(0, (updatedAffinity[cat] || 0) - 0.3);
      updatedDislike[cat] = Math.min(10, (updatedDislike[cat] || 0) + 0.5);
      if (updatedAffinity[cat] && updatedAffinity[cat] > 0) {
        updatedAffinity[cat] = Math.max(0, updatedAffinity[cat] - 0.1);
      }
    }
  }

  updates.cuisineAffinityJson = updatedAffinity;
  updates.cuisineDislikeJson = updatedDislike;

  return updates;
}

export function computeContextPatternUpdate(
  current: TasteContextPattern | null,
  daypart: string,
  isWeekend: boolean,
  restaurant: Restaurant
): Partial<TasteContextPattern> {
  const rCats = restaurant.category.toLowerCase().split(/[,·•]/).map(c => c.trim());

  const contextKey = isWeekend
    ? (daypart === "lunch" || daypart === "morning" ? "weekendLunchJson" : "weekendDinnerJson")
    : (daypart === "lunch" || daypart === "morning" ? "weekdayLunchJson" : "weekdayDinnerJson");

  const currentData = current ? ((current as any)[contextKey] as Record<string, number>) || {} : {};
  const updated = { ...currentData };

  for (const cat of rCats) {
    updated[cat] = Math.min(10, (updated[cat] || 0) + 0.5);
  }

  return { [contextKey]: updated, updatedAt: new Date().toISOString() };
}

export function computeRecentMealUpdate(
  current: RecentMealMemory | null,
  restaurant: Restaurant
): Partial<RecentMealMemory> {
  const rCats = restaurant.category.toLowerCase().split(/[,·•]/).map(c => c.trim());
  const now = new Date().toISOString();

  const recentCuisines = current ? [...((current.recentCuisinesJson as any[]) || [])] : [];
  for (const cat of rCats) {
    recentCuisines.unshift({ cuisine: cat, date: now });
  }
  const trimmedCuisines = recentCuisines.slice(0, 20);

  const recentRestaurants = current ? [...((current.recentRestaurantsJson as any[]) || [])] : [];
  recentRestaurants.unshift({ id: restaurant.id, date: now });
  const trimmedRestaurants = recentRestaurants.slice(0, 15);

  return {
    recentCuisinesJson: trimmedCuisines,
    recentRestaurantsJson: trimmedRestaurants,
    updatedAt: now,
  };
}
