import type { Restaurant } from "@shared/schema";
import type { ScoreBreakdown } from "./rankingEngine";

interface ReasonChip {
  key: string;
  text: string;
  priority: number;
}

const CONTRIBUTOR_TO_REASON: Record<string, (r: Restaurant) => string> = {
  cuisine_affinity: () => "Matches your usual taste",
  spice_fit: () => "Fits your spice preference",
  price_fit: () => "Good fit for your usual budget",
  daypart_fit: () => "Fits your current meal time",
  time_match: (r) => `Great for ${getDaypartLabel()}`,
  mood_fit: () => "Matches your current mood",
  nearby: () => "Close to your area",
  novelty_boost: () => "A fresh pick that still fits your style",
  fresh_pick: () => "Something new to explore",
  highly_rated: (r) => `Highly rated (${r.rating})`,
  trending: () => "Trending nearby",
};

function getDaypartLabel(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 11) return "morning";
  if (h >= 11 && h < 14) return "lunch";
  if (h >= 14 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "dinner";
  return "late night";
}

export function generateReasonChips(
  restaurant: Restaurant,
  breakdown: ScoreBreakdown,
  maxChips: number = 3
): string[] {
  const chips: ReasonChip[] = [];

  for (const contributor of breakdown.topContributors) {
    const generator = CONTRIBUTOR_TO_REASON[contributor];
    if (generator) {
      const text = generator(restaurant);
      chips.push({ key: contributor, text, priority: breakdown.topContributors.indexOf(contributor) });
    }
  }

  if (chips.length < maxChips) {
    if (breakdown.longTermFit > 0.65 && !chips.some(c => c.key === "cuisine_affinity")) {
      chips.push({ key: "taste_match", text: "Matches your taste profile", priority: 10 });
    }
    if (breakdown.contextFit > 0.65 && !chips.some(c => c.key === "time_match" || c.key === "daypart_fit")) {
      chips.push({ key: "context_match", text: "Perfect for right now", priority: 11 });
    }
    if (breakdown.marketQualityFit > 0.7 && !chips.some(c => c.key === "highly_rated" || c.key === "trending")) {
      const rating = parseFloat(restaurant.rating) || 4.0;
      if (rating >= 4.5) {
        chips.push({ key: "quality", text: "Top-rated spot", priority: 12 });
      }
    }
    if (restaurant.priceLevel <= 1 && !chips.some(c => c.key === "price_fit")) {
      chips.push({ key: "value", text: "Great value", priority: 13 });
    }
    if ((restaurant.trendingScore || 0) > 70 && !chips.some(c => c.key === "trending")) {
      chips.push({ key: "popular", text: "Popular right now", priority: 14 });
    }
  }

  chips.sort((a, b) => a.priority - b.priority);

  const seen = new Set<string>();
  const unique = chips.filter(c => {
    if (seen.has(c.text)) return false;
    seen.add(c.text);
    return true;
  });

  return unique.slice(0, maxChips).map(c => c.text);
}

export function generateConfidenceText(
  confidenceLabel: string,
  daypart: string
): string {
  const timeLabel = daypart === "morning" ? "this morning" :
    daypart === "lunch" ? "for lunch" :
    daypart === "afternoon" ? "this afternoon" :
    daypart === "dinner" ? "for dinner" : "right now";

  return `${confidenceLabel} ${timeLabel}`;
}
