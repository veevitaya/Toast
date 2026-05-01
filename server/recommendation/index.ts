import type { Restaurant, TasteDna, TasteContextPattern, RecentMealMemory, UserBehaviorEvent } from "@shared/schema";
import { generateCandidates, type CandidateContext } from "./candidateGenerator";
import { rankCandidates, selectPrimaryAndAlternatives, type MomentContext, type UserHistory, type RankedCandidate } from "./rankingEngine";
import { computeConfidence, computeUserDataCompleteness, computeContextClarity, type ConfidenceResult } from "./confidenceModel";
import { generateReasonChips, generateConfidenceText } from "./explanationEngine";
import { getEventWeight, computeEffectiveWeight, getDaysSince, DECAY_CONSTANTS } from "./eventWeighting";

export interface RecommendationRequest {
  userId: string;
  daypart: string;
  mood?: string;
  areaLabel?: string;
  weatherLabel?: string;
  isWeekend: boolean;
  groupSize?: number;
  pricePref?: number;
  avoidTags?: string[];
  cuisineBoosts?: string[];
}

export interface RecommendationResult {
  primary: {
    restaurantId: number;
    name: string;
    imageUrl: string;
    category: string;
    address: string;
    district: string | null;
    rating: string;
    priceLevel: number;
    confidenceLabel: string;
    reasonChips: string[];
    match: number;
    distanceText: string | null;
  };
  alternatives: Array<{
    restaurantId: number;
    name: string;
    imageUrl: string;
    category: string;
    address: string;
    district: string | null;
    rating: string;
    priceLevel: number;
    match: number;
    reasonChips: string[];
  }>;
  confidence: ConfidenceResult;
  sessionMeta: {
    candidateCount: number;
    totalRestaurants: number;
    engineVersion: string;
  };
}

export function buildUserHistory(
  events: Array<{ eventType: string; restaurantId: number | null; metadata: string | null; timestamp: string }>,
  behaviorEvents: UserBehaviorEvent[]
): UserHistory {
  const categoryAffinities: Record<string, number> = {};
  const recentAcceptedIds = new Set<number>();
  const recentRejectedIds = new Set<number>();
  const savedIds = new Set<number>();
  const viewedIds = new Set<number>();
  const recentCuisines: Array<{ cuisine: string; date: string }> = [];
  const recentRestaurants: Array<{ id: number; date: string }> = [];

  for (const evt of events) {
    const daysSince = getDaysSince(evt.timestamp);
    const baseWeight = getEventWeight(evt.eventType);
    const effectiveWeight = computeEffectiveWeight(baseWeight, daysSince, DECAY_CONSTANTS.cuisineChoices);

    if (evt.restaurantId) {
      if (evt.eventType === "swipe_right" || evt.eventType === "recommendation_accepted" || evt.eventType === "primary_cta_clicked") {
        recentAcceptedIds.add(evt.restaurantId);
        recentRestaurants.push({ id: evt.restaurantId, date: evt.timestamp });
      }
      if (evt.eventType === "swipe_left" || evt.eventType === "recommendation_rejected") recentRejectedIds.add(evt.restaurantId);
      if (evt.eventType === "save" || evt.eventType === "saved") savedIds.add(evt.restaurantId);
      if (evt.eventType === "view_detail" || evt.eventType === "restaurant_detail_opened" || evt.eventType === "detail_viewed") viewedIds.add(evt.restaurantId);
    }

    if (evt.metadata) {
      try {
        const meta = JSON.parse(evt.metadata);
        if (meta.category) {
          const cats = meta.category.split(/[,·•]/).map((c: string) => c.trim().toLowerCase());
          for (const cat of cats) {
            if (!cat) continue;
            categoryAffinities[cat] = (categoryAffinities[cat] || 0) + effectiveWeight;
            if (evt.eventType === "recommendation_accepted" || evt.eventType === "saved") {
              recentCuisines.push({ cuisine: cat, date: evt.timestamp });
            }
          }
        }
      } catch {}
    }
  }

  for (const evt of behaviorEvents) {
    const daysSince = getDaysSince(evt.createdAt);
    const baseWeight = evt.eventWeight || getEventWeight(evt.eventType);
    const effectiveWeight = computeEffectiveWeight(baseWeight, daysSince, DECAY_CONSTANTS.cuisineChoices);

    if (evt.cuisineTag) {
      categoryAffinities[evt.cuisineTag] = (categoryAffinities[evt.cuisineTag] || 0) + effectiveWeight;
    }
  }

  return { categoryAffinities, recentAcceptedIds, recentRejectedIds, savedIds, viewedIds, recentCuisines, recentRestaurants };
}

export function generateRecommendation(
  allRestaurants: Restaurant[],
  request: RecommendationRequest,
  tasteDna: TasteDna | null,
  contextPatterns: TasteContextPattern | null,
  mealMemory: RecentMealMemory | null,
  userHistory: UserHistory,
  eventCount: number
): RecommendationResult | null {
  const candidateContext: CandidateContext = {
    daypart: request.daypart,
    areaLabel: request.areaLabel,
    pricePref: request.pricePref,
    avoidTags: request.avoidTags,
    cuisineBoosts: request.cuisineBoosts,
    maxCandidates: 50,
  };

  const candidates = generateCandidates(allRestaurants, candidateContext);
  if (candidates.length === 0) return null;

  const momentContext: MomentContext = {
    daypart: request.daypart,
    mood: request.mood,
    areaLabel: request.areaLabel,
    weatherLabel: request.weatherLabel,
    isWeekend: request.isWeekend,
    groupSize: request.groupSize,
  };

  const ranked = rankCandidates(candidates, tasteDna, contextPatterns, mealMemory, momentContext, userHistory);
  if (ranked.length === 0) return null;

  const { primary, familiarAlternative, exploratoryAlternative } = selectPrimaryAndAlternatives(ranked);

  const runnerUp = familiarAlternative || (ranked.length > 1 ? ranked[1] : null);

  const dataCompleteness = computeUserDataCompleteness(
    !!tasteDna,
    eventCount,
    !!contextPatterns,
    !!mealMemory
  );
  const contextClarity = computeContextClarity(
    !!request.daypart,
    !!request.mood,
    !!request.areaLabel,
    !!request.weatherLabel
  );
  const confidence = computeConfidence(primary, runnerUp, dataCompleteness, contextClarity);

  const primaryChips = generateReasonChips(primary.restaurant, primary.breakdown, 3);
  const confidenceText = generateConfidenceText(confidence.label, request.daypart);

  // Calibrated, honest match scoring grounded in the user's Taste DNA.
  // The ranking engine produces a raw score in roughly 0.30..0.85 where ~0.60+
  // means "this restaurant aligns well with the user's DNA + current context".
  // We map that linearly onto a 0..99 percentage (60+raw*50), so:
  //   - raw 0.60 -> 90% (just clears the personalization bar)
  //   - raw 0.70 -> 95%
  //   - raw 0.80 -> 99%
  //   - raw 0.50 -> 85% (filtered out)
  // Restaurants below 90% are NOT shown -- we'd rather show an empty/learning
  // state than recommend something we don't really believe is a great match.
  const honestMatch = (raw: number) =>
    Math.round(Math.max(0, Math.min(99, 60 + raw * 50)));
  const matchScore = honestMatch(primary.score);

  const MATCH_THRESHOLD = 90;
  if (matchScore < MATCH_THRESHOLD) {
    return null;
  }

  const alternatives: RecommendationResult["alternatives"] = [];
  const usedIds = new Set([primary.restaurant.id]);
  for (const alt of [familiarAlternative, exploratoryAlternative]) {
    if (!alt || usedIds.has(alt.restaurant.id)) continue;
    const altMatch = honestMatch(alt.score);
    if (altMatch < MATCH_THRESHOLD) continue;
    usedIds.add(alt.restaurant.id);
    alternatives.push({
      restaurantId: alt.restaurant.id,
      name: alt.restaurant.name,
      imageUrl: alt.restaurant.imageUrl,
      category: alt.restaurant.category,
      address: alt.restaurant.address,
      district: alt.restaurant.district || null,
      rating: alt.restaurant.rating,
      priceLevel: alt.restaurant.priceLevel,
      match: altMatch,
      reasonChips: generateReasonChips(alt.restaurant, alt.breakdown, 2),
    });
  }

  if (alternatives.length < 2) {
    for (const r of ranked) {
      if (usedIds.has(r.restaurant.id)) continue;
      const rMatch = honestMatch(r.score);
      if (rMatch < MATCH_THRESHOLD) continue;
      usedIds.add(r.restaurant.id);
      alternatives.push({
        restaurantId: r.restaurant.id,
        name: r.restaurant.name,
        imageUrl: r.restaurant.imageUrl,
        category: r.restaurant.category,
        address: r.restaurant.address,
        district: r.restaurant.district || null,
        rating: r.restaurant.rating,
        priceLevel: r.restaurant.priceLevel,
        match: rMatch,
        reasonChips: generateReasonChips(r.restaurant, r.breakdown, 2),
      });
      if (alternatives.length >= 2) break;
    }
  }

  return {
    primary: {
      restaurantId: primary.restaurant.id,
      name: primary.restaurant.name,
      imageUrl: primary.restaurant.imageUrl,
      category: primary.restaurant.category,
      address: primary.restaurant.address,
      district: primary.restaurant.district || null,
      rating: primary.restaurant.rating,
      priceLevel: primary.restaurant.priceLevel,
      confidenceLabel: confidenceText,
      reasonChips: primaryChips,
      match: matchScore,
      distanceText: null,
    },
    alternatives,
    confidence,
    sessionMeta: {
      candidateCount: candidates.length,
      totalRestaurants: allRestaurants.length,
      engineVersion: "1.0.0",
    },
  };
}
