export const VIBE_TAGS = [
  "spicy",
  "drinks",
  "budget",
  "healthy",
  "outdoor",
  "date_night",
  "delivery",
  "late_night",
  "sweets",
  "brunch",
  "street_food",
  "rooftop",
  "family",
  "cafe",
] as const;

export type VibeTag = typeof VIBE_TAGS[number];

export const VIBE_LABELS: Record<VibeTag, string> = {
  spicy: "Spicy",
  drinks: "Drinks",
  budget: "Budget",
  healthy: "Healthy",
  outdoor: "Outdoor",
  date_night: "Date Night",
  delivery: "Delivery",
  late_night: "Late Night",
  sweets: "Sweets",
  brunch: "Brunch",
  street_food: "Street Food",
  rooftop: "Rooftop",
  family: "Family",
  cafe: "Cafe",
};

export const VIBE_EMOJI: Record<VibeTag, string> = {
  spicy: "🌶️",
  drinks: "🍸",
  budget: "💰",
  healthy: "🥗",
  outdoor: "⛱️",
  date_night: "💕",
  delivery: "🛵",
  late_night: "🌙",
  sweets: "🍰",
  brunch: "🥞",
  street_food: "🍜",
  rooftop: "🏙️",
  family: "🤗",
  cafe: "☕",
};

export const MODE_TO_VIBE: Record<string, VibeTag> = {
  hot: "spicy",
  drinks: "drinks",
  cheap: "budget",
  healthy: "healthy",
  outdoor: "outdoor",
  partner: "date_night",
  delivery: "delivery",
  late: "late_night",
  sweet: "sweets",
  brunch: "brunch",
  streetfood: "street_food",
  rooftop: "rooftop",
  family: "family",
  cafe: "cafe",
};

export const BANGKOK_DISTRICTS = [
  "Ari",
  "Asoke",
  "Bang Rak",
  "Charoen Krung",
  "Chinatown",
  "Ekkamai",
  "Khao San",
  "Langsuan",
  "Lat Phrao",
  "Nana",
  "Old Town",
  "On Nut",
  "Phaya Thai",
  "Phrom Phong",
  "Phra Nakhon",
  "Ratchathewi",
  "Riverside",
  "Sathorn",
  "Siam",
  "Silom",
  "Sukhumvit",
  "Thonglor",
  "Victory Monument",
  "Wireless",
] as const;

interface VibeRule {
  vibe: VibeTag;
  hardFilter?: boolean;
  requiredCategoryTypes?: string[];
  categoryKeywords?: string[];
  descriptionKeywords?: string[];
  excludeCategoryTypes?: string[];
  priceLevelMax?: number;
  priceLevelMin?: number;
}

const VIBE_RULES: VibeRule[] = [
  {
    vibe: "drinks",
    hardFilter: true,
    requiredCategoryTypes: [
      "bar", "pub", "cocktail bar", "cocktail", "speakeasy", "wine bar",
      "brewery", "taproom", "izakaya", "beer bar", "craft beer",
      "whisky bar", "whiskey bar", "rum bar", "gin bar", "tiki bar",
      "lounge", "rooftop bar", "jazz bar", "sports bar",
    ],
    excludeCategoryTypes: [
      "restaurant", "cafe", "bakery", "dessert", "brunch",
      "breakfast", "noodle", "rice", "curry", "sushi",
      "ramen", "pizza", "burger", "steak", "seafood",
    ],
  },
  {
    vibe: "spicy",
    categoryKeywords: ["spicy", "isaan", "chili", "hot pot"],
    descriptionKeywords: ["spicy", "chili", "hot", "fiery", "capsicum"],
  },
  {
    vibe: "healthy",
    categoryKeywords: ["salad", "vegan", "vegetarian", "organic", "poke", "healthy", "acai", "smoothie", "juice"],
    descriptionKeywords: ["healthy", "organic", "plant-based", "vegan", "vegetarian", "clean eating", "superfood"],
  },
  {
    vibe: "outdoor",
    categoryKeywords: ["outdoor", "garden", "terrace", "riverside", "by the river"],
    descriptionKeywords: ["outdoor", "terrace", "garden", "open-air", "al fresco", "riverside"],
  },
  {
    vibe: "date_night",
    categoryKeywords: ["fine dining", "omakase", "kaiseki", "premium", "upscale"],
    descriptionKeywords: ["romantic", "intimate", "fine dining", "upscale", "elegant", "premium"],
    priceLevelMin: 3,
  },
  {
    vibe: "sweets",
    categoryKeywords: ["dessert", "bakery", "ice cream", "kakigori", "cake", "pastry", "sweet", "honey toast", "gelato", "chocolate"],
    descriptionKeywords: ["dessert", "sweet", "pastry", "cake", "ice cream", "gelato", "chocolate", "confection"],
  },
  {
    vibe: "brunch",
    categoryKeywords: ["brunch", "breakfast", "morning", "pancake", "waffle"],
    descriptionKeywords: ["brunch", "breakfast", "morning", "eggs benedict", "pancake", "waffle"],
  },
  {
    vibe: "street_food",
    categoryKeywords: ["street food", "night market", "hawker", "stall", "cart", "food truck"],
    descriptionKeywords: ["street food", "night market", "roadside", "hawker", "food truck", "stall"],
  },
  {
    vibe: "rooftop",
    categoryKeywords: ["rooftop"],
    descriptionKeywords: ["rooftop", "sky bar", "skyline", "panoramic view"],
  },
  {
    vibe: "family",
    categoryKeywords: ["family", "buffet", "food court", "casual", "home-style", "traditional", "home cooking"],
    descriptionKeywords: ["family", "kid-friendly", "casual dining", "home-style", "home cooking", "comfort"],
  },
  {
    vibe: "cafe",
    hardFilter: true,
    requiredCategoryTypes: [
      "cafe", "coffee", "coffee shop", "tea house", "tea room",
      "bakery cafe", "specialty coffee",
    ],
    categoryKeywords: ["cafe", "coffee", "tea"],
    descriptionKeywords: ["cafe", "coffee", "latte", "espresso", "pour over", "drip", "brew"],
  },
];

const CUISINE_SPICY = ["thai", "indian", "mexican", "korean", "isaan", "northern", "southern"];

function detectDistrictFromAddress(address: string): string | null {
  const lower = address.toLowerCase();
  const districtMap: Record<string, string[]> = {
    "Ari": ["ari"],
    "Asoke": ["asoke"],
    "Bang Rak": ["bang rak"],
    "Charoen Krung": ["charoen krung"],
    "Chinatown": ["chinatown", "yaowarat"],
    "Ekkamai": ["ekkamai"],
    "Khao San": ["khao san"],
    "Langsuan": ["langsuan"],
    "Lat Phrao": ["lat phrao", "ladprao"],
    "Nana": ["nana", "sukhumvit 3", "sukhumvit 4"],
    "Old Town": ["old town", "rattanakosin"],
    "On Nut": ["on nut", "onnut"],
    "Phaya Thai": ["phaya thai", "phayathai"],
    "Phrom Phong": ["phrom phong"],
    "Phra Nakhon": ["phra nakhon", "maha chai", "maharat", "maha rat"],
    "Ratchathewi": ["ratchathewi"],
    "Riverside": ["riverside", "charoen nakhon"],
    "Sathorn": ["sathorn"],
    "Siam": ["siam", "central world"],
    "Silom": ["silom"],
    "Sukhumvit": ["sukhumvit"],
    "Thonglor": ["thonglor", "thong lor", "sukhumvit 55"],
    "Victory Monument": ["victory monument", "victory mon"],
    "Wireless": ["wireless"],
  };
  for (const [district, keywords] of Object.entries(districtMap)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return district;
    }
  }
  return null;
}

interface RestaurantLike {
  category: string;
  priceLevel: number;
  address: string;
  operatingHours?: string | null;
  description?: string;
}

export interface VibeMatchExplanation {
  vibe: string;
  matched: boolean;
  reasons: string[];
}

function tokenizeCategory(cat: string): string[] {
  const segments = cat.split(/[·•/,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const tokens: string[] = [];
  for (const seg of segments) {
    tokens.push(seg);
    const words = seg.split(/\s+/);
    tokens.push(...words);
  }
  return [...new Set(tokens)];
}

function matchesCategoryType(catTokens: string[], catLower: string, requiredType: string): boolean {
  const typeLower = requiredType.toLowerCase();
  const typeWords = typeLower.split(/\s+/);

  if (typeWords.length > 1) {
    return catLower.includes(typeLower);
  }

  return catTokens.some(token => {
    if (token === typeLower) return true;
    if (token.length > typeLower.length && token.endsWith(typeLower)) {
      const prefix = token.slice(0, token.length - typeLower.length);
      return prefix.endsWith(" ") || prefix.endsWith("-");
    }
    if (token.length > typeLower.length && token.startsWith(typeLower)) {
      const suffix = token.slice(typeLower.length);
      return suffix.startsWith(" ") || suffix.startsWith("-") || suffix.startsWith("s");
    }
    return false;
  });
}

export function autoAssignVibes(r: RestaurantLike): string[] {
  return autoAssignVibesWithExplanation(r).filter(e => e.matched).map(e => e.vibe);
}

export function autoAssignVibesWithExplanation(r: RestaurantLike): VibeMatchExplanation[] {
  const catLower = r.category.toLowerCase();
  const descLower = (r.description || "").toLowerCase();
  const catTokens = tokenizeCategory(r.category);
  const results: VibeMatchExplanation[] = [];

  for (const rule of VIBE_RULES) {
    const entry: VibeMatchExplanation = { vibe: rule.vibe, matched: false, reasons: [] };

    if (rule.hardFilter && rule.requiredCategoryTypes) {
      const matchedType = rule.requiredCategoryTypes.find(type =>
        matchesCategoryType(catTokens, catLower, type)
      );

      if (rule.excludeCategoryTypes && !matchedType) {
        const isExcluded = rule.excludeCategoryTypes.some(exc =>
          matchesCategoryType(catTokens, catLower, exc)
        );
        if (isExcluded) {
          entry.reasons.push(`excluded: category contains excluded type`);
          results.push(entry);
          continue;
        }
      }

      if (!matchedType) {
        const hasKeyword = rule.categoryKeywords?.some(kw => catLower.includes(kw)) ||
                          rule.descriptionKeywords?.some(kw => descLower.includes(kw));
        if (hasKeyword) {
          entry.reasons.push(`keyword match but missing required category type for hard-filter vibe`);
        } else {
          entry.reasons.push(`no required category type found`);
        }
        results.push(entry);
        continue;
      }
      entry.matched = true;
      entry.reasons.push(`category contains required type: ${matchedType}`);
    } else {
      if (rule.categoryKeywords) {
        const matchedKw = rule.categoryKeywords.filter(kw => catLower.includes(kw));
        if (matchedKw.length > 0) {
          entry.matched = true;
          entry.reasons.push(`category keyword: ${matchedKw.join(", ")}`);
        }
      }

      if (rule.descriptionKeywords) {
        const matchedKw = rule.descriptionKeywords.filter(kw => descLower.includes(kw));
        if (matchedKw.length > 0) {
          entry.matched = true;
          entry.reasons.push(`description keyword: ${matchedKw.join(", ")}`);
        }
      }
    }

    if (rule.priceLevelMin && r.priceLevel < rule.priceLevelMin && !entry.matched) {
      entry.reasons.push(`price level ${r.priceLevel} below minimum ${rule.priceLevelMin}`);
    }

    if (rule.priceLevelMax && r.priceLevel > rule.priceLevelMax) {
      entry.matched = false;
      entry.reasons.push(`price level ${r.priceLevel} above maximum ${rule.priceLevelMax}`);
    }

    results.push(entry);
  }

  const spicyEntry = results.find(e => e.vibe === "spicy");
  if (spicyEntry) {
    for (const token of catTokens) {
      if (CUISINE_SPICY.some(c => token.includes(c))) {
        spicyEntry.matched = true;
        spicyEntry.reasons.push(`cuisine typically spicy: ${token}`);
        break;
      }
    }
  }

  if (r.priceLevel <= 2) {
    results.push({ vibe: "budget", matched: true, reasons: [`price level ${r.priceLevel} <= 2`] });
  } else {
    results.push({ vibe: "budget", matched: false, reasons: [`price level ${r.priceLevel} > 2`] });
  }

  if (r.priceLevel <= 3) {
    results.push({ vibe: "delivery", matched: true, reasons: [`price level ${r.priceLevel} <= 3, delivery eligible`] });
  } else {
    results.push({ vibe: "delivery", matched: false, reasons: [`price level ${r.priceLevel} > 3`] });
  }

  if (r.operatingHours) {
    const match = r.operatingHours.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
    if (match) {
      const openHour = parseInt(match[1]);
      const closeHour = parseInt(match[2]);
      if (closeHour >= 0 && closeHour <= 5) {
        results.push({ vibe: "late_night", matched: true, reasons: [`closes at ${closeHour}:xx (after midnight)`] });
      }
      if (openHour >= 6 && openHour <= 10) {
        const brunchEntry = results.find(e => e.vibe === "brunch");
        if (brunchEntry) {
          brunchEntry.matched = true;
          brunchEntry.reasons.push(`opens at ${openHour}:xx (morning)`);
        } else {
          results.push({ vibe: "brunch", matched: true, reasons: [`opens at ${openHour}:xx (morning)`] });
        }
      }
    }
  }

  const rooftopEntry = results.find(e => e.vibe === "rooftop");
  if (rooftopEntry?.matched) {
    const outdoorEntry = results.find(e => e.vibe === "outdoor");
    if (outdoorEntry) {
      outdoorEntry.matched = true;
      outdoorEntry.reasons.push("rooftop implies outdoor");
    }
  }

  const seen = new Set<string>();
  const deduped: VibeMatchExplanation[] = [];
  for (const entry of results) {
    if (!seen.has(entry.vibe)) {
      seen.add(entry.vibe);
      deduped.push(entry);
    } else {
      const existing = deduped.find(e => e.vibe === entry.vibe);
      if (existing) {
        if (entry.matched) existing.matched = true;
        existing.reasons.push(...entry.reasons);
      }
    }
  }

  return deduped.sort((a, b) => a.vibe.localeCompare(b.vibe));
}

export function autoDetectDistrict(address: string): string | null {
  return detectDistrictFromAddress(address);
}
