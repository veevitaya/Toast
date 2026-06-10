export type Mood = 'comforting' | 'exciting' | 'healthy' | 'cheap' | 'worth' | 'surprise';

export const MOODS: { key: Mood; label: string; emoji: string }[] = [
  { key: 'comforting', label: 'Comforting', emoji: '🍲' },
  { key: 'exciting', label: 'Exciting', emoji: '🔥' },
  { key: 'healthy', label: 'Healthy', emoji: '🥗' },
  { key: 'cheap', label: 'Budget', emoji: '💸' },
  { key: 'worth', label: 'Worth it', emoji: '💎' },
  { key: 'surprise', label: 'Surprise', emoji: '🎲' },
];

export const CUISINES = ['Any', 'Thai', 'Japanese', 'Korean', 'Italian', 'Indian'] as const;
export const SCENES = ['Any', 'Street food', 'Sit-down', 'Café', 'Near BTS'] as const;
export const BUDGETS = ['Any', '฿', '฿฿', '฿฿฿'] as const;

export type Prefs = {
  mood: Mood;
  cuisine: (typeof CUISINES)[number];
  scene: (typeof SCENES)[number];
  budget: (typeof BUDGETS)[number];
};

export type Spot = {
  name: string;
  cuisine: (typeof CUISINES)[number];
  scene: (typeof SCENES)[number];
  budget: '฿' | '฿฿' | '฿฿฿';
  moods: Mood[];
  img: string;
  rating: number;
  dist: string;
};

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=500&q=70`;

export const SPOTS: Spot[] = [
  { name: 'Pad Kra Pao', cuisine: 'Thai', scene: 'Street food', budget: '฿', moods: ['comforting', 'cheap', 'exciting'], img: u('1569562211093-4ed0d0758f12'), rating: 4.7, dist: '6 min' },
  { name: 'Khao Soi', cuisine: 'Thai', scene: 'Sit-down', budget: '฿฿', moods: ['comforting', 'worth'], img: u('1534422298391-e4f8c172dddb'), rating: 4.6, dist: '11 min' },
  { name: 'Som Tam', cuisine: 'Thai', scene: 'Street food', budget: '฿', moods: ['healthy', 'cheap', 'exciting'], img: u('1512621776951-a57141f2eefd'), rating: 4.5, dist: '5 min' },
  { name: 'Tonkotsu Ramen', cuisine: 'Japanese', scene: 'Sit-down', budget: '฿฿', moods: ['comforting', 'worth'], img: u('1557872943-16a5ac26437e'), rating: 4.8, dist: '9 min' },
  { name: 'Omakase Sushi', cuisine: 'Japanese', scene: 'Sit-down', budget: '฿฿฿', moods: ['worth', 'exciting', 'healthy'], img: u('1579584425555-c3ce17fd4351'), rating: 4.9, dist: '14 min' },
  { name: 'Matcha Café Set', cuisine: 'Japanese', scene: 'Café', budget: '฿฿', moods: ['worth', 'surprise'], img: u('1495474472287-4d71bcdd2085'), rating: 4.4, dist: '8 min' },
  { name: 'Bibimbap', cuisine: 'Korean', scene: 'Sit-down', budget: '฿฿', moods: ['healthy', 'comforting'], img: u('1512621776951-a57141f2eefd'), rating: 4.6, dist: '10 min' },
  { name: 'Korean Fried Chicken', cuisine: 'Korean', scene: 'Street food', budget: '฿฿', moods: ['exciting', 'comforting'], img: u('1568901346375-23c9450c58cd'), rating: 4.7, dist: '12 min' },
  { name: 'Margherita Pizza', cuisine: 'Italian', scene: 'Sit-down', budget: '฿฿', moods: ['comforting', 'worth'], img: u('1565299624946-b28f40a0ae38'), rating: 4.5, dist: '13 min' },
  { name: 'Truffle Pasta', cuisine: 'Italian', scene: 'Sit-down', budget: '฿฿฿', moods: ['worth', 'exciting'], img: u('1565299624946-b28f40a0ae38'), rating: 4.8, dist: '16 min' },
  { name: 'Butter Chicken', cuisine: 'Indian', scene: 'Sit-down', budget: '฿฿', moods: ['comforting', 'worth'], img: u('1585937421612-70a008356fbe'), rating: 4.6, dist: '15 min' },
  { name: 'Masala Dosa', cuisine: 'Indian', scene: 'Street food', budget: '฿', moods: ['cheap', 'healthy', 'surprise'], img: u('1585937421612-70a008356fbe'), rating: 4.4, dist: '9 min' },
];

export type ScoredSpot = Spot & { match: number; crown: boolean; price: string };

function score(spot: Spot, prefs: Prefs): number {
  let s = 0;
  if (spot.moods.includes(prefs.mood)) s += 3;
  if (prefs.cuisine !== 'Any' && spot.cuisine === prefs.cuisine) s += 2.5;
  if (prefs.scene !== 'Any' && spot.scene === prefs.scene) s += 1.8;
  if (prefs.budget !== 'Any' && spot.budget === prefs.budget) s += 1.8;
  s += (spot.rating - 4.4) * 2;
  return s;
}

export function getTop2(prefs: Prefs): [ScoredSpot, ScoredSpot] {
  const ranked = SPOTS
    .map((spot) => ({ spot, s: score(spot, prefs) }))
    .sort((a, b) => b.s - a.s);

  let ordered = ranked;
  if (prefs.cuisine !== 'Any') {
    const matching = ranked.filter((e) => e.spot.cuisine === prefs.cuisine);
    const others = ranked.filter((e) => e.spot.cuisine !== prefs.cuisine);
    ordered = [...matching, ...others];
  }

  const top = ordered.slice(0, 2);
  const toScored = (entry: { spot: Spot; s: number }, crown: boolean): ScoredSpot => ({
    ...entry.spot,
    price: entry.spot.budget,
    match: Math.max(60, Math.min(99, Math.round(72 + entry.s * 4))),
    crown,
  });

  return [toScored(top[0], true), toScored(top[1], false)];
}
