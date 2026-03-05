const CUISINE_KEYWORDS: Record<string, { patterns: string[]; style: string }> = {
  Thai: { patterns: ["thai", "pad thai", "som tum", "tom yum", "som tam", "isaan", "isan", "papaya", "sticky rice", "larb", "green curry"], style: "Street food" },
  Japanese: { patterns: ["japanese", "sushi", "ramen", "udon", "soba", "izakaya", "tempura", "yakitori", "tonkatsu", "gyudon", "donburi", "omakase", "teppanyaki", "matcha"], style: "Sushi" },
  Korean: { patterns: ["korean", "bbq", "bibimbap", "kimchi", "bulgogi", "galbi", "samgyeopsal", "kbbq", "tteokbokki", "jjigae"], style: "BBQ" },
  Chinese: { patterns: ["chinese", "dim sum", "dumpling", "noodle", "wonton", "peking", "szechuan", "sichuan", "cantonese", "hotpot", "hot pot", "malatang"], style: "Dim sum" },
  Indian: { patterns: ["indian", "curry", "tandoori", "naan", "biryani", "masala", "tikka", "paneer", "dal", "vindaloo", "korma"], style: "Curry" },
  Italian: { patterns: ["italian", "pizza", "pasta", "risotto", "trattoria", "osteria", "gelato", "focaccia", "prosciutto", "bruschetta"], style: "Modern" },
  Mexican: { patterns: ["mexican", "taco", "burrito", "enchilada", "quesadilla", "guacamole", "nacho", "tamale", "mole", "cantina"], style: "Street food" },
  American: { patterns: ["american", "burger", "steak", "bbq", "grill", "diner", "wings", "ribs", "fries", "hot dog"], style: "Burgers" },
  Vietnamese: { patterns: ["vietnamese", "pho", "banh mi", "bun", "spring roll", "vermicelli", "com tam"], style: "Noodles" },
  French: { patterns: ["french", "bistro", "brasserie", "croissant", "crepe", "patisserie", "boulangerie", "soufflé"], style: "Bistro" },
  Mediterranean: { patterns: ["mediterranean", "falafel", "hummus", "shawarma", "kebab", "gyro", "pita", "mezze"], style: "Grill" },
  Seafood: { patterns: ["seafood", "fish", "lobster", "crab", "shrimp", "oyster", "prawn", "clam", "mussel"], style: "Fresh catch" },
  Cafe: { patterns: ["cafe", "café", "coffee", "latte", "espresso", "brunch", "breakfast", "bakery", "pastry", "croissant", "toast"], style: "Brunch" },
  Dessert: { patterns: ["dessert", "ice cream", "gelato", "cake", "sweet", "chocolate", "waffle", "crepe", "kakigori", "bingsu"], style: "Sweets" },
  Vegetarian: { patterns: ["vegetarian", "vegan", "plant-based", "organic", "health", "salad", "green"], style: "Healthy" },
  Buffet: { patterns: ["buffet", "all you can eat", "unlimited", "eat all"], style: "All-you-can-eat" },
};

const KNOWN_CHAINS: Record<string, { type: "chain" | "franchise"; cuisine: string; priceLevel: number }> = {
  "shake shack": { type: "chain", cuisine: "American", priceLevel: 2 },
  "mcdonald": { type: "chain", cuisine: "American", priceLevel: 1 },
  "kfc": { type: "chain", cuisine: "American", priceLevel: 1 },
  "burger king": { type: "chain", cuisine: "American", priceLevel: 1 },
  "subway": { type: "chain", cuisine: "American", priceLevel: 1 },
  "starbucks": { type: "chain", cuisine: "Cafe", priceLevel: 2 },
  "pizza hut": { type: "chain", cuisine: "Italian", priceLevel: 2 },
  "domino": { type: "chain", cuisine: "Italian", priceLevel: 1 },
  "sizzler": { type: "chain", cuisine: "American", priceLevel: 3 },
  "yoshinoya": { type: "chain", cuisine: "Japanese", priceLevel: 1 },
  "sukiya": { type: "chain", cuisine: "Japanese", priceLevel: 1 },
  "coco ichibanya": { type: "chain", cuisine: "Japanese", priceLevel: 2 },
  "mos burger": { type: "chain", cuisine: "Japanese", priceLevel: 2 },
  "pepper lunch": { type: "chain", cuisine: "Japanese", priceLevel: 2 },
  "fuji": { type: "franchise", cuisine: "Japanese", priceLevel: 2 },
  "oishi": { type: "franchise", cuisine: "Japanese", priceLevel: 2 },
  "bonchon": { type: "franchise", cuisine: "Korean", priceLevel: 2 },
  "after you": { type: "franchise", cuisine: "Dessert", priceLevel: 2 },
  "greyhound cafe": { type: "franchise", cuisine: "Thai", priceLevel: 3 },
  "nara": { type: "franchise", cuisine: "Thai", priceLevel: 3 },
  "som tam nua": { type: "franchise", cuisine: "Thai", priceLevel: 2 },
  "roast": { type: "franchise", cuisine: "Cafe", priceLevel: 3 },
  "dean & deluca": { type: "franchise", cuisine: "Cafe", priceLevel: 3 },
  "bar b q plaza": { type: "franchise", cuisine: "Thai", priceLevel: 2 },
  "mk": { type: "franchise", cuisine: "Thai", priceLevel: 2 },
  "shabushi": { type: "franchise", cuisine: "Japanese", priceLevel: 2 },
  "suki teen": { type: "franchise", cuisine: "Thai", priceLevel: 1 },
  "the pizza company": { type: "franchise", cuisine: "Italian", priceLevel: 2 },
  "s&p": { type: "franchise", cuisine: "Thai", priceLevel: 2 },
  "black canyon": { type: "franchise", cuisine: "Cafe", priceLevel: 2 },
  "true coffee": { type: "franchise", cuisine: "Cafe", priceLevel: 2 },
  "amazon": { type: "franchise", cuisine: "Cafe", priceLevel: 1 },
  "cafe amazon": { type: "franchise", cuisine: "Cafe", priceLevel: 1 },
  "wingstop": { type: "franchise", cuisine: "American", priceLevel: 2 },
  "five guys": { type: "chain", cuisine: "American", priceLevel: 3 },
  "tim hortons": { type: "chain", cuisine: "Cafe", priceLevel: 2 },
  "krispy kreme": { type: "chain", cuisine: "Dessert", priceLevel: 2 },
  "dunkin": { type: "chain", cuisine: "Cafe", priceLevel: 1 },
  "baskin robbins": { type: "chain", cuisine: "Dessert", priceLevel: 2 },
  "dairy queen": { type: "chain", cuisine: "Dessert", priceLevel: 1 },
  "swensen": { type: "franchise", cuisine: "Dessert", priceLevel: 2 },
  "haagen-dazs": { type: "chain", cuisine: "Dessert", priceLevel: 3 },
  "cold stone": { type: "chain", cuisine: "Dessert", priceLevel: 2 },
  "chili's": { type: "chain", cuisine: "American", priceLevel: 2 },
  "outback": { type: "chain", cuisine: "American", priceLevel: 3 },
};

const FINE_DINING_SIGNALS = [
  "fine dining", "michelin", "omakase", "degustation", "tasting menu",
  "chef's table", "prix fixe", "haute cuisine", "gastronomic",
];

const STYLE_MAP: Record<string, string> = {
  bar: "Bar & Grill",
  cafe: "Brunch",
  bakery: "Bakery",
  meal_takeaway: "Takeaway",
  meal_delivery: "Delivery",
  night_club: "Nightlife",
  lodging: "Hotel dining",
};

export interface GooglePlaceRaw {
  name: string;
  types?: string[];
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  formatted_address?: string;
  place_id?: string;
  geometry?: { location?: { lat: number; lng: number } };
  photos?: { photo_reference: string }[];
  business_status?: string;
  opening_hours?: { open_now?: boolean };
}

export interface ClassifiedRestaurant {
  name: string;
  description: string;
  category: string;
  priceLevel: number;
  trendingScore: number;
  isNew: boolean;
  ownershipType: "chain" | "franchise" | "independent";
  confidence: number;
  cuisineDetected: string;
  styleDetected: string;
  reviewCount: number;
}

function detectChain(name: string): { type: "chain" | "franchise"; cuisine: string; priceLevel: number } | null {
  const lower = name.toLowerCase();
  for (const [brand, info] of Object.entries(KNOWN_CHAINS)) {
    if (lower.includes(brand)) return info;
  }
  return null;
}

function detectCuisine(name: string, types: string[]): { cuisine: string; style: string; confidence: number } {
  const lower = name.toLowerCase();
  const typesStr = types.join(" ").toLowerCase();
  const combined = `${lower} ${typesStr}`;

  let bestMatch = { cuisine: "Restaurant", style: "General", confidence: 30 };
  let bestScore = 0;

  for (const [cuisine, data] of Object.entries(CUISINE_KEYWORDS)) {
    let score = 0;
    let matchedStyle = data.style;

    for (const pattern of data.patterns) {
      if (lower.includes(pattern)) {
        score += 3;
        if (pattern === lower.trim() || lower.startsWith(pattern + " ") || lower.endsWith(" " + pattern)) {
          score += 2;
        }
      } else if (combined.includes(pattern)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      const confidenceVal = Math.min(95, 40 + score * 12);

      if (cuisine === "Japanese") {
        if (lower.includes("ramen")) matchedStyle = "Ramen";
        else if (lower.includes("sushi")) matchedStyle = "Sushi";
        else if (lower.includes("izakaya")) matchedStyle = "Izakaya";
        else if (lower.includes("tempura")) matchedStyle = "Tempura";
        else if (lower.includes("udon") || lower.includes("soba")) matchedStyle = "Noodles";
        else if (lower.includes("yakiniku") || lower.includes("teppanyaki")) matchedStyle = "Grill";
        else if (lower.includes("omakase")) matchedStyle = "Omakase";
      } else if (cuisine === "Italian") {
        if (lower.includes("pizza")) matchedStyle = "Pizza";
        else if (lower.includes("pasta")) matchedStyle = "Pasta";
        else if (lower.includes("gelato")) matchedStyle = "Gelato";
      } else if (cuisine === "Thai") {
        if (lower.includes("street") || lower.includes("pad thai") || lower.includes("som tam")) matchedStyle = "Street food";
        else if (lower.includes("seafood") || lower.includes("fish") || lower.includes("prawn")) matchedStyle = "Seafood";
        else if (lower.includes("curry")) matchedStyle = "Curry";
        else if (lower.includes("noodle")) matchedStyle = "Noodles";
        else if (lower.includes("dessert") || lower.includes("sweet")) matchedStyle = "Dessert";
      } else if (cuisine === "American") {
        if (lower.includes("burger")) matchedStyle = "Burgers";
        else if (lower.includes("steak")) matchedStyle = "Steakhouse";
        else if (lower.includes("bbq") || lower.includes("grill")) matchedStyle = "Grill";
        else if (lower.includes("wings") || lower.includes("chicken")) matchedStyle = "Wings";
      } else if (cuisine === "Korean") {
        if (lower.includes("bbq") || lower.includes("grill")) matchedStyle = "BBQ";
        else if (lower.includes("fried chicken") || lower.includes("bonchon")) matchedStyle = "Fried chicken";
      }

      bestMatch = { cuisine, style: matchedStyle, confidence: confidenceVal };
    }
  }

  for (const typeKey of types) {
    if (STYLE_MAP[typeKey] && bestMatch.cuisine === "Restaurant") {
      bestMatch.style = STYLE_MAP[typeKey];
      bestMatch.confidence = Math.max(bestMatch.confidence, 50);
    }
  }

  return bestMatch;
}

function computeTrendingScore(rating: number, reviewCount: number): number {
  const ratingComponent = (rating / 5) * 50;

  let reviewComponent: number;
  if (reviewCount >= 1000) reviewComponent = 50;
  else if (reviewCount >= 500) reviewComponent = 40;
  else if (reviewCount >= 200) reviewComponent = 30;
  else if (reviewCount >= 50) reviewComponent = 20;
  else if (reviewCount >= 10) reviewComponent = 10;
  else reviewComponent = 5;

  return Math.min(99, Math.round(ratingComponent + reviewComponent));
}

function inferPriceLevel(googlePriceLevel: number | undefined, name: string, types: string[]): number {
  if (googlePriceLevel !== undefined && googlePriceLevel >= 0 && googlePriceLevel <= 4) {
    return Math.max(1, googlePriceLevel);
  }

  const lower = name.toLowerCase();
  const combined = `${lower} ${types.join(" ")}`;

  if (FINE_DINING_SIGNALS.some((s) => combined.includes(s))) return 4;
  if (combined.includes("street food") || combined.includes("food stall") || combined.includes("hawker")) return 1;
  if (combined.includes("fine") || combined.includes("premium") || combined.includes("luxury")) return 4;
  if (combined.includes("bistro") || combined.includes("brasserie")) return 3;

  return 2;
}

function generateDescription(name: string, cuisine: string, style: string, vicinity: string): string {
  const templates: Record<string, string[]> = {
    Thai: [
      `Authentic ${style.toLowerCase()} Thai cuisine in the heart of Bangkok.`,
      `Traditional Thai flavors with a modern twist.`,
      `Beloved local spot serving genuine Thai ${style.toLowerCase()}.`,
    ],
    Japanese: [
      `Fresh and authentic Japanese ${style.toLowerCase()} experience.`,
      `Premium Japanese dining with carefully sourced ingredients.`,
      `Quality ${style.toLowerCase()} crafted with attention to detail.`,
    ],
    Korean: [
      `Vibrant Korean ${style.toLowerCase()} with bold flavors.`,
      `Authentic Korean dining experience with premium ingredients.`,
    ],
    Italian: [
      `Classic Italian ${style.toLowerCase()} made with imported ingredients.`,
      `Artisan Italian cuisine in a warm, inviting atmosphere.`,
    ],
    Cafe: [
      `Cozy café featuring specialty coffee and all-day ${style.toLowerCase()}.`,
      `Your perfect coffee stop with freshly made treats.`,
    ],
  };

  const cuisineTemplates = templates[cuisine] || [
    `${cuisine} ${style.toLowerCase()} restaurant serving quality dishes.`,
    `Discover authentic ${cuisine.toLowerCase()} cuisine at ${name}.`,
  ];

  return cuisineTemplates[Math.floor(Math.random() * cuisineTemplates.length)];
}

export function classifyRestaurant(place: GooglePlaceRaw): ClassifiedRestaurant {
  const name = place.name || "Unknown Restaurant";
  const types = place.types || [];
  const rating = place.rating || 4.0;
  const reviewCount = place.user_ratings_total || 0;
  const vicinity = place.vicinity || place.formatted_address || "";

  const chainInfo = detectChain(name);
  const cuisineInfo = chainInfo
    ? { cuisine: chainInfo.cuisine, style: CUISINE_KEYWORDS[chainInfo.cuisine]?.style || "General", confidence: 90 }
    : detectCuisine(name, types);

  const isFine = FINE_DINING_SIGNALS.some((s) => name.toLowerCase().includes(s));
  if (isFine) {
    cuisineInfo.style = "Fine dining";
    cuisineInfo.confidence = Math.max(cuisineInfo.confidence, 85);
  }

  const priceLevel = chainInfo?.priceLevel || inferPriceLevel(place.price_level, name, types);
  const trendingScore = computeTrendingScore(rating, reviewCount);
  const isNew = reviewCount < 50 || trendingScore >= 85;

  const category = `${cuisineInfo.cuisine}  •  ${cuisineInfo.style}`;
  const description = generateDescription(name, cuisineInfo.cuisine, cuisineInfo.style, vicinity);

  return {
    name,
    description,
    category,
    priceLevel,
    trendingScore,
    isNew,
    ownershipType: chainInfo?.type || "independent",
    confidence: cuisineInfo.confidence,
    cuisineDetected: cuisineInfo.cuisine,
    styleDetected: cuisineInfo.style,
    reviewCount,
  };
}

export const VERIFICATION_CHECKLIST_TEMPLATE = [
  { id: "biz_reg_match", label: "Business registration matches restaurant name", checked: false },
  { id: "address_match", label: "Address on documents matches restaurant location", checked: false },
  { id: "owner_name_match", label: "Owner name matches claim submitter", checked: false },
  { id: "ownership_type_verified", label: "Ownership type verified (single/franchise/all branches)", checked: false },
  { id: "doc_validity", label: "Document validity confirmed (not expired)", checked: false },
  { id: "photo_id_match", label: "Photo ID matches claim submitter", checked: false },
];
