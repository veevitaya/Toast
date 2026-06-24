import type { ReactNode } from "react";
import { Star, MapPin } from "lucide-react";
import type { GroupTieBreaker } from "@shared/schema";

// Shared motion language for the tie-breaker flow — keeps entrances, springs and
// list staggers consistent across the intro, champion picker and both mini-games.
export const TB_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const TB_SPRING = { type: "spring" as const, stiffness: 380, damping: 26 };

export const tbListContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
export const tbListItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: TB_EASE } },
};

export type SwipeMode = "menu" | "restaurant";

export type TieBreakerItem = {
  id: number;
  menuItem: any | null;
  restaurant: any | null;
};

export type TieBreakerMember = {
  lineUserId: string;
  displayName: string;
  pictureUrl?: string | null;
};

export type TieBreakerPayload = {
  tieBreaker: GroupTieBreaker | null;
  items: TieBreakerItem[];
  members: TieBreakerMember[];
};

export type DisplayItem = {
  id: number;
  name: string;
  sub: string;
  place?: string;
  image: string;
  rating: string;
  area: string;
  price: string;
  emoji: string;
  cuisine: string;
};

const EMOJI_RULES: Array<[RegExp, string]> = [
  [/noodle|ramen|pho|soi|pasta|spaghet/i, "🍜"],
  [/sushi|sashimi|japan/i, "🍣"],
  [/burger/i, "🍔"],
  [/pizza/i, "🍕"],
  [/steak|beef|grill|bbq|barbe/i, "🥩"],
  [/chicken|wing|fried/i, "🍗"],
  [/salad|veg|healthy|som ?tam|papaya/i, "🥗"],
  [/curry|rice|thai/i, "🍛"],
  [/seafood|fish|prawn|shrimp|crab/i, "🦐"],
  [/dessert|cake|sweet|ice ?cream|bingsu/i, "🍰"],
  [/coffee|cafe|café|latte|tea|cocktail|bar\b|drink/i, "☕"],
  [/taco|mexican|burrito/i, "🌮"],
  [/dim ?sum|dumpling|bao|chinese/i, "🥟"],
  [/bread|bakery|brunch|toast|egg/i, "🥐"],
  [/hot ?pot|shabu|soup/i, "🍲"],
];

export function emojiFor(text: string): string {
  const t = text || "";
  for (let i = 0; i < EMOJI_RULES.length; i++) {
    if (EMOJI_RULES[i][0].test(t)) return EMOJI_RULES[i][1];
  }
  return "🍽️";
}

export function priceText(level?: number): string {
  const n = Math.max(1, Math.min(level ?? 1, 4));
  return "฿".repeat(n);
}

export function toDisplayItem(item: TieBreakerItem, swipeType: SwipeMode): DisplayItem {
  const r = item.restaurant;
  if (swipeType === "menu" && item.menuItem) {
    const mi = item.menuItem;
    return {
      id: item.id,
      name: mi.name,
      sub: mi.nameLocal || mi.category || "Dish",
      place: r?.name,
      image: mi.imageUrl || r?.imageUrl || "",
      rating: r?.rating || "—",
      area: r?.district || r?.address || "",
      price: priceText(r?.priceLevel),
      emoji: emojiFor(mi.category || mi.name || ""),
      cuisine: mi.description || mi.category || "",
    };
  }
  return {
    id: item.id,
    name: r?.name || `Spot ${item.id}`,
    sub: r?.category || "Restaurant",
    place: r?.name,
    image: r?.imageUrl || "",
    rating: r?.rating || "—",
    area: r?.district || r?.address || "",
    price: priceText(r?.priceLevel),
    emoji: emojiFor(r?.category || r?.name || ""),
    cuisine: r?.description || r?.category || "",
  };
}

export function memberName(members: TieBreakerMember[], id: string, meId: string): string {
  if (id === meId) return "You";
  const m = members.find((x) => x.lineUserId === id);
  return m?.displayName || "Friend";
}

export function memberPic(members: TieBreakerMember[], id: string): string | null {
  return members.find((x) => x.lineUserId === id)?.pictureUrl || null;
}

export function Avatar({
  pic,
  name,
  className = "",
}: {
  pic: string | null;
  name: string;
  className?: string;
}) {
  if (pic) {
    return <img src={pic} alt={name} className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 ${className}`}>
      <span className="font-bold text-amber-700">{(name || "?").charAt(0).toUpperCase()}</span>
    </div>
  );
}

export function Shell({ children, testId }: { children: ReactNode; testId?: string }) {
  return (
    <div className="toast-tiebreaker toast-rps-bg min-h-[100dvh] w-full" data-testid={testId || "group-tiebreaker"}>
      <div
        className="max-w-[430px] mx-auto min-h-[100dvh] flex flex-col relative overflow-hidden"
        style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
      >
        {/* ambient warmth */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-[#FFCC02]/20 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-[#FFE08A]/25 blur-3xl" />
        </div>
        {children}
      </div>
    </div>
  );
}

export function WinnerHeroCard({
  item,
  heading,
  badge,
}: {
  item: DisplayItem;
  heading: string;
  badge: string;
}) {
  return (
    <div
      className="toast-card overflow-hidden flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
      data-testid={`winner-item-${item.id}`}
    >
      <div className="relative h-[200px] w-full bg-slate-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">{item.emoji}</div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="text-base">{item.emoji}</span>
          <span className="font-bold text-xs toast-ink tracking-wide">{badge}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2 gap-3">
          <h2 className="text-2xl font-bold toast-ink leading-tight">{heading}</h2>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-sm">{item.rating}</span>
          </div>
        </div>
        {item.cuisine && <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.cuisine}</p>}
        <div className="flex gap-4 flex-wrap">
          {item.area && (
            <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
              <MapPin className="w-4 h-4 text-slate-400" />
              {item.area}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
            <span className="text-slate-400 font-bold">{item.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
