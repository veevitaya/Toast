import { motion } from 'framer-motion';
import { Zap, Flame, Heart, Star, MapPin, Share2, ChevronRight, Trophy } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 300, damping: 28 };

const STATS = [
  { label: 'hrs saved', value: '9.2', sub: 'scrolling', tone: 'amber' as const, icon: Zap },
  { label: 'new spots', value: '8', sub: 'tried', tone: 'neutral' as const, icon: MapPin },
  { label: 'love rate', value: '94%', sub: 'friends loved', tone: 'rose' as const, icon: Heart },
  { label: 'week streak', value: '4', sub: 'in a row', tone: 'flame' as const, icon: Flame },
];

const RECENT = [
  { name: 'Som Tam Nua', date: 'Tonight', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&auto=format&fit=crop&q=80', rating: 5 },
  { name: 'Vertigo · 60F', date: 'Tue', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop&q=80', rating: 5 },
  { name: 'After You', date: 'Mon', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&auto=format&fit=crop&q=80', rating: 4 },
  { name: 'Tep Bar', date: 'Sat', img: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=200&auto=format&fit=crop&q=80', rating: 5 },
];

// 28-day grid (heatmap)
const HEATMAP = Array.from({ length: 28 }).map((_, i) => {
  const intensities = [0, 0, 1, 0, 2, 1, 3, 0, 1, 2, 0, 3, 2, 1, 0, 2, 3, 1, 2, 3, 1, 2, 3, 0, 1, 3, 2, 3];
  return intensities[i];
});

const heatColor = (n: number) => {
  if (n === 0) return 'bg-neutral-100';
  if (n === 1) return 'bg-amber-100';
  if (n === 2) return 'bg-amber-300';
  return 'bg-[#FFCC02]';
};

export default function DecideStreak() {
  return (
    <div className="w-[390px] h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-y-auto overflow-x-hidden" data-testid="decide-streak">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" alt="You" className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 leading-none">April 2026</p>
            <p className="text-[13px] font-black text-neutral-900 leading-tight mt-0.5">Mai's Toast year</p>
          </div>
        </div>
        <button aria-label="Share" data-testid="button-share" className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <Share2 size={14} className="text-neutral-900" strokeWidth={2.4} />
        </button>
      </div>

      {/* Hero number */}
      <div className="px-5 mt-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-1.5">
          <Trophy size={12} className="text-[#FFCC02] fill-[#FFCC02]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFCC02]">This month</p>
        </motion.div>
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="flex items-end gap-2 mt-1">
          <span className="text-[88px] font-black text-neutral-900 leading-[0.92] tracking-[-0.04em]">12</span>
          <div className="pb-3">
            <p className="text-[16px] font-black text-neutral-900 leading-tight">Toast decisions</p>
            <p className="text-[11px] text-neutral-500 font-semibold">+3 vs last month</p>
          </div>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-2">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          const bg = s.tone === 'amber' ? 'bg-amber-50' : s.tone === 'rose' ? 'bg-rose-50' : s.tone === 'flame' ? 'bg-orange-50' : 'bg-neutral-100';
          const ic = s.tone === 'amber' ? 'text-[#B58900]' : s.tone === 'rose' ? 'text-rose-500' : s.tone === 'flame' ? 'text-orange-500' : 'text-neutral-700';
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 + i * 0.05 }}
              className={`p-3 rounded-2xl ${bg}`}
            >
              <Icon size={14} className={`${ic} ${s.tone === 'rose' || s.tone === 'flame' || s.tone === 'amber' ? 'fill-current opacity-90' : ''}`} />
              <p className="text-[22px] font-black text-neutral-900 leading-none mt-2 tracking-[-0.01em]">{s.value}</p>
              <p className="text-[10px] text-neutral-600 font-semibold mt-1">{s.label} <span className="text-neutral-400">· {s.sub}</span></p>
            </motion.div>
          );
        })}
      </div>

      {/* Heatmap */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">Last 28 days</p>
          <p className="text-[10px] text-neutral-400 font-semibold">tap a day to revisit</p>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-2.5 grid grid-cols-7 gap-1.5">
          {HEATMAP.map((n, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.012, duration: 0.25 }}
              className={`aspect-square rounded-md ${heatColor(n)}`}
            />
          ))}
        </motion.div>
        <div className="flex items-center gap-1.5 mt-2 text-[9px] text-neutral-400 font-semibold">
          <span>less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-100" />
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-100" />
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-300" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FFCC02]" />
          <span>more</span>
        </div>
      </div>

      {/* Recent decisions */}
      <div className="mt-6">
        <div className="px-5 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">Recent decisions</p>
          <button className="text-[10px] font-bold text-neutral-700 flex items-center gap-0.5" data-testid="see-all">all <ChevronRight size={11} /></button>
        </div>
        <div className="mt-2.5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 px-5 pr-8">
            {RECENT.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: 0.5 + i * 0.05 }}
                className="shrink-0 w-[120px] rounded-2xl overflow-hidden bg-white border border-neutral-100"
              >
                <div className="relative h-[80px] bg-neutral-100">
                  <img src={r.img} alt={r.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <Star key={k} size={6} className="fill-neutral-900 text-neutral-900" />
                    ))}
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-black text-neutral-900 truncate leading-tight">{r.name}</p>
                  <p className="text-[9px] text-neutral-500 font-semibold mt-0.5">{r.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[110px]" />

      {/* Sticky CTA — back to deciding */}
      <motion.div initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.6 }} className="fixed left-0 right-0 bottom-0 max-w-[390px] mx-auto px-5 pb-7 pt-3 bg-gradient-to-t from-white via-white to-white/0">
        <motion.button whileTap={{ scale: 0.97 }} className="relative w-full h-[56px] rounded-2xl bg-[#FFCC02] text-neutral-900 font-black text-[15px] flex items-center justify-center gap-2 shadow-[0_14px_32px_-8px_rgba(255,204,2,0.55)] overflow-hidden" data-testid="cta-decide-tonight">
          <Zap size={16} className="fill-neutral-900" strokeWidth={2.5} />
          Decide tonight's spot
        </motion.button>
        <p className="text-center text-[10px] text-neutral-500 font-semibold mt-2">Keep the streak alive 🔥</p>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[8px] uppercase tracking-[0.18em] text-neutral-300 z-20 pointer-events-none">Toast · Decide · Habit / streak</p>
    </div>
  );
}
