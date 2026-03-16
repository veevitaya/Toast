import type { Restaurant } from "@shared/schema";

export interface CandidateContext {
  daypart: string;
  areaLabel?: string;
  pricePref?: number;
  avoidTags?: string[];
  cuisineBoosts?: string[];
  maxCandidates?: number;
}

const DAYPART_CATEGORIES: Record<string, string[]> = {
  morning: ["cafe", "brunch", "coffee", "bakery", "breakfast"],
  lunch: ["thai", "japanese", "noodles", "street food", "quick", "chinese", "korean", "indian"],
  afternoon: ["cafe", "dessert", "tea", "boba", "snack", "bakery"],
  dinner: ["bbq", "fine dining", "sushi", "italian", "korean", "seafood", "thai", "japanese", "chinese", "indian", "french", "steakhouse"],
  latenight: ["street food", "ramen", "noodles", "thai", "bar", "izakaya"],
};

export function generateCandidates(
  allRestaurants: Restaurant[],
  context: CandidateContext
): Restaurant[] {
  const { daypart, areaLabel, pricePref, avoidTags = [], maxCandidates = 50 } = context;

  const avoidSet = new Set(avoidTags.map(t => t.toLowerCase()));
  const daypartCats = DAYPART_CATEGORIES[daypart] || [];

  const candidates = allRestaurants.filter(r => {
    const rCats = r.category.toLowerCase().split(/[,·•]/).map(c => c.trim());

    for (const cat of rCats) {
      if (avoidSet.has(cat)) return false;
    }

    if (pricePref !== undefined && r.priceLevel > pricePref + 1) return false;

    return true;
  });

  const scored = candidates.map(r => {
    let relevance = 0;
    const rCats = r.category.toLowerCase().split(/[,·•]/).map(c => c.trim());

    for (const cat of rCats) {
      if (daypartCats.some(dc => cat.includes(dc) || dc.includes(cat))) relevance += 2;
    }

    if (areaLabel && r.district?.toLowerCase() === areaLabel.toLowerCase()) relevance += 3;

    const rating = parseFloat(r.rating) || 4.0;
    relevance += rating;
    relevance += (r.trendingScore || 0) * 0.01;

    if (context.cuisineBoosts) {
      for (const cat of rCats) {
        if (context.cuisineBoosts.some(b => cat.includes(b) || b.includes(cat))) relevance += 5;
      }
    }

    return { restaurant: r, relevance };
  });

  scored.sort((a, b) => b.relevance - a.relevance);

  return scored.slice(0, maxCandidates).map(s => s.restaurant);
}
