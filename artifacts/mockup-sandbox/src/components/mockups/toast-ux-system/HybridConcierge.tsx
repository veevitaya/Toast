import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, MapPin, ArrowRight, Star, Clock, Wand2, RefreshCw } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 300, damping: 28 };

type Period = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

function getTimeCtx() {
  const h = new Date().getHours();
  if (h < 11) return { label: 'This morning', period: 'morning' as Period, emoji: '☀️' };
  if (h < 14) return { label: 'Lunch time', period: 'midday' as Period, emoji: '🌤️' };
  if (h < 17) return { label: 'This afternoon', period: 'afternoon' as Period, emoji: '🌅' };
  if (h < 21) return { label: 'Tonight', period: 'evening' as Period, emoji: '🌆' };
  return { label: 'Late night', period: 'night' as Period, emoji: '🌙' };
}

const HERO: Record<Period, { title: string; reason: string; sub: string; image: string; type: string; rating: string }> = {
  morning: { title: 'Roots Coffee', reason: 'Top-rated specialty cafe near you', sub: 'Pourover & pastries · 5 min walk', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60', type: 'Cafe', rating: '4.9' },
  midday: { title: 'Supanniga Eating Room', reason: 'Great for a quick elevated lunch', sub: 'Thai comfort food · Thonglor', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60', type: 'Restaurant', rating: '4.8' },
  afternoon: { title: 'After You Dessert', reason: 'Perfect afternoon treat', sub: 'Shibuya Honey Toast · Siam', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60', type: 'Dessert', rating: '4.7' },
  evening: { title: 'Dinner + Drinks Plan', reason: 'We picked a combo that fits tonight', sub: 'Izakaya → rooftop bar · Sukhumvit', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60', type: 'Plan', rating: '4.9' },
  night: { title: 'Iron Fairies', reason: 'Still open and worth it', sub: 'Jazz bar · craft cocktails · Thonglor', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60', type: 'Bar', rating: '4.6' },
};

const MOOD_CARDS: { id: string; emoji: string; label: string; sub: Record<Period, string> }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', sub: { morning: 'Coffee or breakfast?', midday: 'Let\'s find lunch', afternoon: 'Snack break', evening: 'Find food first', night: 'Late-night bites' } },
  { id: 'fun', emoji: '🎯', label: 'Something fun', sub: { morning: 'Start exploring', midday: 'Break from routine', afternoon: 'Do something after', evening: 'Activities tonight', night: 'Keep the vibe' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', sub: { morning: 'Worth stepping out', midday: 'Get out for lunch', afternoon: 'Find a spot', evening: 'Where tonight?', night: 'One more stop' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', sub: { morning: 'Brunch date', midday: 'Lunch together', afternoon: 'Something right together', evening: 'Romantic evening', night: 'Intimate bar' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', sub: { morning: 'Grab & go', midday: 'Fast lunch', afternoon: 'Low effort, good options', evening: '30 seconds', night: 'Fastest option' } },
];

export default function HybridConcierge() {
  const [tapped, setTapped] = useState<string | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const time = getTimeCtx();
  const hero = HERO[time.period];

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
      <div className="h-[44px]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 flex items-center justify-between mt-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px]">{time.emoji}</span>
          <span className="text-[13px] font-semibold text-neutral-500">{time.label}</span>
          <span className="text-neutral-300">·</span>
          <span className="text-[11px] text-neutral-400 flex items-center gap-1"><MapPin size={9} />Bangkok</span>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <User size={14} className="text-neutral-500" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="px-6 mt-4"
      >
        <p className="text-[13px] text-neutral-400">Here's what we think fits</p>
        <h1 className="text-[26px] font-extrabold text-neutral-900 leading-tight mt-0.5">Right now</h1>
      </motion.div>

      <AnimatePresence>
        {heroReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="px-6 mt-5"
          >
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="relative h-[170px]">
                <img src={hero.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <div className="px-2 py-0.5 bg-[#FFCC02] rounded-full flex items-center gap-1">
                    <Wand2 size={9} className="text-neutral-900" />
                    <span className="text-[9px] font-bold text-neutral-900 uppercase tracking-wider">AI Pick</span>
                  </div>
                  <div className="px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-full">
                    <span className="text-[9px] font-bold text-white">{hero.type}</span>
                  </div>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-[20px] font-bold text-white leading-tight">{hero.title}</p>
                  <p className="text-[12px] text-white/70 mt-0.5">{hero.sub}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles size={12} className="text-[#FFCC02]" />
                  <span className="text-[12px] text-neutral-500">{hero.reason}</span>
                  <div className="ml-auto flex items-center gap-0.5">
                    <Star size={10} className="text-[#FFCC02] fill-[#FFCC02]" />
                    <span className="text-[11px] font-bold text-neutral-700">{hero.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 h-12 bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 font-bold text-[14px] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
                  >
                    <ArrowRight size={15} />
                    Do this
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="h-12 px-4 bg-neutral-100 rounded-2xl flex items-center justify-center gap-1.5 font-semibold text-[13px] text-neutral-600"
                  >
                    <RefreshCw size={13} />
                    Change
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="px-6 mt-6"
      >
        <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Or choose your mood</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MOOD_CARDS.map((card, i) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.38 + i * 0.04 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTapped(card.id)}
              className={`flex-shrink-0 w-[100px] p-3 rounded-2xl text-left transition-colors ${
                tapped === card.id
                  ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.3)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[22px] block">{card.emoji}</span>
              <p className="text-[12px] font-bold text-neutral-900 mt-1.5 leading-tight">{card.label}</p>
              <p className="text-[9px] text-neutral-400 mt-0.5 leading-snug">{card.sub[time.period]}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-6 mt-5"
      >
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Quick for now</p>
        <div className="flex gap-2 flex-wrap">
          {['☕ Coffee nearby', '🍰 Dessert', '🍺 Happy hour', '🎶 Live music'].map((tag, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-neutral-100 rounded-full text-[11px] font-medium text-neutral-500"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="px-6 mt-5 pb-8"
      >
        <button className="w-full flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="w-9 h-9 rounded-full bg-[#FFCC02]/15 flex items-center justify-center">
            <Users size={14} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-neutral-800">Planning with friends?</p>
            <p className="text-[10px] text-neutral-400">Start or join a group session</p>
          </div>
          <ChevronRight size={14} className="text-neutral-300" />
        </button>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-3 pt-1">
        <p className="text-center text-[9px] text-neutral-300 font-medium tracking-wider uppercase">Toast Hybrid · Concierge</p>
      </div>
    </div>
  );
}
