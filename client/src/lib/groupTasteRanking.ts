export interface MemberTaste {
  lineUserId?: string;
  mood?: string | null;
  cuisines?: string[] | null;
  budget?: number | null;
  diet?: string[] | null;
}

export interface RankableCard {
  name: string;
  nameLocal?: string | null;
  category?: string;
  tags?: string[];
  description?: string | null;
  priceLevel?: number;
}

const MOOD_KEYWORDS: Record<string, string[]> = {
  Comfort: ["comfort", "cozy", "classic", "homestyle", "hearty", "warm"],
  Adventurous: ["spicy", "exotic", "fusion", "street", "unique", "bold", "adventurous"],
  Light: ["healthy", "salad", "light", "fresh", "vegetarian", "vegan", "clean"],
  Indulgent: ["rich", "cheesy", "fried", "dessert", "sweet", "creamy", "indulgent", "decadent"],
};

const PORK_TERMS = ["pork", "หมู", "bacon", "ham", "sausage", "char siu", "moo"];
const NUT_TERMS = ["nut", "peanut", "ถั่ว", "almond", "cashew", "walnut"];
const ALCOHOL_TERMS = ["beer", "wine", "alcohol", "cocktail", "เบียร์", "เหล้า"];
const VEG_POSITIVE = ["vegetarian", "vegan", "veggie", "plant", "tofu", "เจ", "มังสวิรัติ", "salad"];
const MEAT_TERMS = ["pork", "beef", "chicken", "meat", "seafood", "shrimp", "fish", "เนื้อ", "ไก่", "หมู"];

function cardText(card: RankableCard): string {
  return [
    card.name,
    card.nameLocal || "",
    card.category || "",
    (card.tags || []).join(" "),
    card.description || "",
  ]
    .join(" ")
    .toLowerCase();
}

function includesAny(haystack: string, terms: string[]): boolean {
  return terms.some((t) => haystack.includes(t.toLowerCase()));
}

/**
 * Score a single card against one member's taste.
 * Positive = the card fits this member; negative = conflicts (e.g. dietary).
 */
function scoreForMember(card: RankableCard, taste: MemberTaste, text: string): number {
  let score = 0;

  const cuisines = taste.cuisines || [];
  for (const cuisine of cuisines) {
    const c = cuisine.toLowerCase().replace(" food", "").trim();
    if (c && text.includes(c)) {
      score += 3;
    }
  }

  if (taste.mood && MOOD_KEYWORDS[taste.mood]) {
    if (includesAny(text, MOOD_KEYWORDS[taste.mood])) score += 2;
  }

  if (typeof taste.budget === "number" && typeof card.priceLevel === "number" && card.priceLevel > 0) {
    const target = taste.budget + 1;
    const diff = Math.abs(card.priceLevel - target);
    if (diff === 0) score += 2;
    else if (diff === 1) score += 1;
    else score -= 1;
  }

  const diet = taste.diet || [];
  for (const restriction of diet) {
    const r = restriction.toLowerCase();
    if (r.includes("pork") || r === "no pork") {
      if (includesAny(text, PORK_TERMS)) score -= 8;
    }
    if (r.includes("halal")) {
      if (includesAny(text, PORK_TERMS) || includesAny(text, ALCOHOL_TERMS)) score -= 8;
    }
    if (r.includes("nut")) {
      if (includesAny(text, NUT_TERMS)) score -= 8;
    }
    if (r.includes("veg")) {
      if (includesAny(text, VEG_POSITIVE)) score += 3;
      else if (includesAny(text, MEAT_TERMS)) score -= 2;
    }
  }

  return score;
}

/**
 * Rank a deck of cards by the overlap of all members' taste preferences.
 * Cards that fit the most members rank highest. Dietary conflicts sink to
 * the bottom but are never removed, so the deck is never emptied.
 *
 * When no member has set any taste, the original order is preserved (caller
 * is expected to have already shuffled if desired).
 */
export function rankByGroupTaste<T extends RankableCard>(cards: T[], tastes: MemberTaste[]): T[] {
  const meaningful = (tastes || []).filter(
    (t) => t && ((t.cuisines && t.cuisines.length) || t.mood || typeof t.budget === "number" || (t.diet && t.diet.length)),
  );

  if (meaningful.length === 0) return cards;

  const scored = cards.map((card, index) => {
    const text = cardText(card);
    let total = 0;
    for (const taste of meaningful) {
      total += scoreForMember(card, taste, text);
    }
    return { card, score: total, index, jitter: Math.random() };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.jitter - b.jitter;
  });

  return scored.map((s) => s.card);
}
