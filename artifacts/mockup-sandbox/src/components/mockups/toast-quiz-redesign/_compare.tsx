import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Crown } from 'lucide-react';
import './_group.css';

export const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

export type Prefs = {
  mood: string | null;
  cuisine: string | null;
  scene: string | null;
  budget: string | null;
};

export type Dish = {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  emoji: string;
  img: string;
  rating: string;
  dist: string;
  price: '฿' | '฿฿' | '฿฿฿';
  moods: string[];
  scenes: string[];
  base: number;
};

export type ScoredDish = Dish & { match: number; crown: boolean };

export const MOODS: { label: string; value: string | null; emoji: string }[] = [
  { label: 'Any', value: null, emoji: '✨' },
  { label: 'Spicy', value: 'spicy', emoji: '🌶️' },
  { label: 'Comfort', value: 'comfort', emoji: '🍲' },
  { label: 'Healthy', value: 'healthy', emoji: '🥗' },
  { label: 'Sweets', value: 'sweets', emoji: '🍰' },
  { label: 'Drinks', value: 'drinks', emoji: '🍹' },
];

export const CUISINES = ['Any', 'Thai', 'Japanese', 'Korean', 'Italian', 'Western'];

export const SCENES: { label: string; value: string | null; emoji: string }[] = [
  { label: 'Any', value: null, emoji: '✨' },
  { label: 'Street food', value: 'street', emoji: '🍢' },
  { label: 'Restaurants', value: 'restaurant', emoji: '🍽️' },
  { label: 'Near BTS', value: 'bts', emoji: '🚇' },
  { label: 'Trendy', value: 'trendy', emoji: '📈' },
  { label: 'Late night', value: 'latenight', emoji: '🌙' },
];

export const BUDGETS: { label: string; value: string | null }[] = [
  { label: 'Any', value: null },
  { label: '฿', value: '฿' },
  { label: '฿฿', value: '฿฿' },
  { label: '฿฿฿', value: '฿฿฿' },
];

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=70&auto=format&fit=crop`;

export const DISHES: Dish[] = [
  { id: 'padkrapao', name: 'Pad Kra Pao', type: 'Thai · Street food', cuisine: 'Thai', emoji: '🌶️', img: u('1569562211093-4ed0d0758f12'), rating: '4.7', dist: '6 min', price: '฿', moods: ['spicy', 'comfort'], scenes: ['street', 'latenight'], base: 88 },
  { id: 'tomyum', name: 'Tom Yum Goong', type: 'Thai · Spicy soup', cuisine: 'Thai', emoji: '🦐', img: u('1569718212165-3a8278d5f624'), rating: '4.6', dist: '9 min', price: '฿฿', moods: ['spicy'], scenes: ['restaurant'], base: 84 },
  { id: 'khaosoi', name: 'Khao Soi', type: 'Thai · Curry noodles', cuisine: 'Thai', emoji: '🍜', img: u('1534422298391-e4f8c172dddb'), rating: '4.6', dist: '11 min', price: '฿฿', moods: ['comfort'], scenes: ['restaurant', 'trendy'], base: 83 },
  { id: 'somtam', name: 'Som Tam', type: 'Thai · Papaya salad', cuisine: 'Thai', emoji: '🥗', img: u('1512621776951-a57141f2eefd'), rating: '4.5', dist: '5 min', price: '฿', moods: ['spicy', 'healthy'], scenes: ['street'], base: 80 },
  { id: 'sushi', name: 'Sushi Omakase', type: 'Japanese · Sushi', cuisine: 'Japanese', emoji: '🍣', img: u('1579871494447-9811cf80d66c'), rating: '4.8', dist: '14 min', price: '฿฿฿', moods: ['healthy'], scenes: ['restaurant', 'trendy'], base: 87 },
  { id: 'ramen', name: 'Tonkotsu Ramen', type: 'Japanese · Ramen', cuisine: 'Japanese', emoji: '🍥', img: u('1557872943-16a5ac26437e'), rating: '4.7', dist: '8 min', price: '฿฿', moods: ['comfort'], scenes: ['restaurant', 'latenight'], base: 85 },
  { id: 'koreanbbq', name: 'Korean BBQ', type: 'Korean · Grill', cuisine: 'Korean', emoji: '🥩', img: u('1590301157890-4810ed352733'), rating: '4.7', dist: '12 min', price: '฿฿฿', moods: ['comfort'], scenes: ['restaurant', 'trendy'], base: 86 },
  { id: 'bibimbap', name: 'Bibimbap', type: 'Korean · Rice bowl', cuisine: 'Korean', emoji: '🍲', img: u('1553163147-622ab57be1c7'), rating: '4.5', dist: '7 min', price: '฿฿', moods: ['healthy', 'comfort'], scenes: ['restaurant', 'bts'], base: 81 },
  { id: 'pasta', name: 'Truffle Pasta', type: 'Italian · Pasta', cuisine: 'Italian', emoji: '🍝', img: u('1551183053-bf91a1d81141'), rating: '4.6', dist: '13 min', price: '฿฿฿', moods: ['comfort'], scenes: ['restaurant', 'trendy'], base: 83 },
  { id: 'pizza', name: 'Margherita Pizza', type: 'Italian · Pizza', cuisine: 'Italian', emoji: '🍕', img: u('1513104890138-7c749659a591'), rating: '4.5', dist: '10 min', price: '฿฿', moods: ['comfort'], scenes: ['restaurant'], base: 80 },
  { id: 'matcha', name: 'Matcha Lava Cake', type: 'Café · Dessert', cuisine: 'Western', emoji: '🍰', img: u('1565958011703-44f9829ba187'), rating: '4.6', dist: '6 min', price: '฿฿', moods: ['sweets'], scenes: ['trendy', 'bts'], base: 79 },
  { id: 'mango', name: 'Mango Sticky Rice', type: 'Thai · Dessert', cuisine: 'Thai', emoji: '🥭', img: u('1505253758473-96b7015fcd40'), rating: '4.7', dist: '4 min', price: '฿', moods: ['sweets'], scenes: ['street', 'restaurant'], base: 81 },
  { id: 'milktea', name: 'Thai Milk Tea', type: 'Café · Drinks', cuisine: 'Thai', emoji: '🧋', img: u('1525803377221-4f6ccc0a8d6f'), rating: '4.5', dist: '3 min', price: '฿', moods: ['drinks'], scenes: ['street', 'bts'], base: 78 },
  { id: 'smoothie', name: 'Berry Smoothie Bowl', type: 'Café · Healthy', cuisine: 'Western', emoji: '🥤', img: u('1502741224143-90386d7f8c82'), rating: '4.4', dist: '8 min', price: '฿฿', moods: ['drinks', 'healthy'], scenes: ['trendy', 'bts'], base: 79 },
];

function scoreDish(d: Dish, p: Prefs): number {
  let s = d.base;
  if (p.mood) s += d.moods.includes(p.mood) ? 11 : -16;
  if (p.cuisine && p.cuisine !== 'Any') s += d.cuisine === p.cuisine ? 12 : -20;
  if (p.scene) s += d.scenes.includes(p.scene) ? 7 : -8;
  if (p.budget) s += d.price === p.budget ? 7 : -9;
  return Math.max(61, Math.min(99, Math.round(s)));
}

export function matchCount(p: Prefs): number {
  return DISHES.filter((d) => scoreDish(d, p) >= 75).length || 2;
}

export function topTwo(p: Prefs): ScoredDish[] {
  const scored = DISHES.map((d) => ({ d, s: scoreDish(d, p) }))
    .sort((a, b) => (b.s - a.s) || (b.d.base - a.d.base));
  return scored.slice(0, 2).map((x, i) => ({ ...x.d, match: x.s, crown: i === 0 }));
}

export function activeChips(p: Prefs): string[] {
  const out: string[] = [];
  const m = MOODS.find((x) => x.value === p.mood);
  if (m && m.value) out.push(`${m.emoji} ${m.label}`);
  if (p.cuisine && p.cuisine !== 'Any') out.push(p.cuisine);
  const s = SCENES.find((x) => x.value === p.scene);
  if (s && s.value) out.push(`${s.emoji} ${s.label}`);
  if (p.budget) out.push(p.budget);
  if (out.length === 0) out.push('✨ Anything goes');
  return out;
}

export function CompareCard({ data, side }: { data: ScoredDish; side: 'l' | 'r' }) {
  const [ok, setOk] = useState(true);
  return (
    <motion.div
      key={data.id}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className="flex-1 rounded-3xl overflow-hidden bg-white border border-black/[0.05]"
      style={{ boxShadow: data.crown ? '0 14px 34px -12px rgba(255,204,2,0.45)' : '0 6px 20px -10px rgba(0,0,0,0.12)' }}
      data-testid={`compare-${side}`}
    >
      <div className="relative h-[118px]">
        {ok ? (
          <img src={data.img} alt={data.name} onError={() => setOk(false)} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF1C2 0%, #FFE08A 100%)' }}>
            <span className="text-[44px] leading-none">{data.emoji}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-extrabold text-neutral-900 flex items-center gap-1">
          <Star size={10} className="text-amber-500 fill-amber-500" />{data.rating}
        </div>
        {data.crown && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center shadow">
            <Crown size={12} className="text-neutral-900" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[15px] font-extrabold text-neutral-900 leading-tight truncate">{data.name}</p>
        <p className="text-[11px] text-neutral-500 truncate">{data.type}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-neutral-600">
          <span className="flex items-center gap-0.5"><MapPin size={10} className="text-neutral-400" />{data.dist}</span>
          <span>·</span><span>{data.price}</span>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div className="h-full rounded-full bg-[#FFCC02]" animate={{ width: `${data.match}%` }} transition={spring} />
        </div>
        <p className="text-[10px] font-bold text-[#9A7400] mt-1">{data.match}% your taste</p>
      </div>
    </motion.div>
  );
}

export function VersusRow({ left, right }: { left: ScoredDish; right: ScoredDish }) {
  return (
    <div className="flex gap-2.5 items-center">
      <CompareCard data={left} side="l" />
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg z-10 -mx-1">
        <span className="text-[11px] font-extrabold text-white">VS</span>
      </div>
      <CompareCard data={right} side="r" />
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`flex-shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors ${
        active ? 'bg-[#FFCC02] text-[#2d2000]' : 'bg-neutral-100 text-neutral-600'
      }`}
      style={active ? { boxShadow: '0 4px 12px -4px rgba(255,204,2,0.6)' } : undefined}
    >
      {children}
    </motion.button>
  );
}

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1 px-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="text-[10px] font-extrabold text-[#9A7400]">{value}</p>
      </div>
      <div className="relative">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar px-0.5 pb-0.5">{children}</div>
      </div>
    </div>
  );
}

export function EditControls({ prefs, onChange }: { prefs: Prefs; onChange: (p: Prefs) => void }) {
  const set = (patch: Partial<Prefs>) => onChange({ ...prefs, ...patch });
  const moodLabel = MOODS.find((m) => m.value === prefs.mood)?.label ?? 'Any';
  const sceneLabel = SCENES.find((s) => s.value === prefs.scene)?.label ?? 'Any';
  return (
    <div className="space-y-2.5">
      <Row label="Mood" value={moodLabel}>
        {MOODS.map((m) => (
          <Pill key={m.label} active={prefs.mood === m.value} onClick={() => set({ mood: m.value })}>
            {m.value ? `${m.emoji} ${m.label}` : m.label}
          </Pill>
        ))}
      </Row>
      <Row label="Cuisine" value={prefs.cuisine ?? 'Any'}>
        {CUISINES.map((c) => (
          <Pill key={c} active={(prefs.cuisine ?? 'Any') === c} onClick={() => set({ cuisine: c === 'Any' ? null : c })}>
            {c}
          </Pill>
        ))}
      </Row>
      <Row label="Scene" value={sceneLabel}>
        {SCENES.map((s) => (
          <Pill key={s.label} active={prefs.scene === s.value} onClick={() => set({ scene: s.value })}>
            {s.value ? `${s.emoji} ${s.label}` : s.label}
          </Pill>
        ))}
      </Row>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-0.5">Budget</p>
        <div className="flex gap-1 p-1 rounded-full bg-neutral-100">
          {BUDGETS.map((b) => {
            const active = (prefs.budget ?? null) === b.value;
            return (
              <motion.button
                key={b.label}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => set({ budget: b.value })}
                className={`relative flex-1 py-1.5 rounded-full text-[12px] font-bold transition-colors ${active ? 'bg-[#FFCC02] text-[#2d2000]' : 'text-neutral-500'}`}
                style={active ? { boxShadow: '0 4px 12px -4px rgba(255,204,2,0.6)' } : undefined}
              >
                {b.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
