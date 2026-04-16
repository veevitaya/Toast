import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, MapPin, ArrowRight, Star, Clock, RefreshCw, Zap } from 'lucide-react';

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

const HERO: Record<Period, { title: string; why: string; sub: string; image: string; type: string }> = {
  morning: { title: 'Coffee + Pastry Run', why: 'Easy place to begin this morning', sub: 'Top-rated cafes open near you · 5 min walk', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60', type: 'Cafe' },
  midday: { title: 'Easy Lunch Nearby', why: 'A good option for right now', sub: 'Highly rated spots within 10 min walk', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60', type: 'Food' },
  afternoon: { title: 'Dessert & Chill Spot', why: 'Perfect for this afternoon', sub: 'Sweet spots and cozy cafes near you', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60', type: 'Cafe' },
  evening: { title: 'Dinner + Something After', why: 'We picked a combo for tonight', sub: 'Great dinner → drinks combo · Sukhumvit', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60', type: 'Plan' },
  night: { title: 'Late Night Bites & Bars', why: 'Still open and worth the trip', sub: 'Best spots open right now nearby', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60', type: 'Night' },
};

const ALT: Record<Period, { text: string; emoji: string }> = {
  morning: { text: 'Or something fun instead?', emoji: '🎯' },
  midday: { text: 'Or do something fun after?', emoji: '🎯' },
  afternoon: { text: 'Or start with food?', emoji: '🍜' },
  evening: { text: 'Or keep it easy tonight?', emoji: '⚡' },
  night: { text: 'Or something fun nearby?', emoji: '🎯' },
};

const MOODS: { id: string; emoji: string; label: string; sub: Record<Period, string> }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', sub: { morning: 'Coffee or breakfast?', midday: 'Let\'s find lunch', afternoon: 'Snack or early dinner?', evening: 'Find food first', night: 'Late-night bites' } },
  { id: 'fun', emoji: '🎯', label: 'Something fun', sub: { morning: 'Start exploring', midday: 'Break from routine', afternoon: 'Do something new', evening: 'Activities tonight', night: 'Keep going' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', sub: { morning: 'Worth stepping out', midday: 'Get out for lunch', afternoon: 'Find a spot', evening: 'Where tonight?', night: 'One more stop' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', sub: { morning: 'Brunch date', midday: 'Lunch together', afternoon: 'Fits together', evening: 'Romantic evening', night: 'Intimate spot' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', sub: { morning: 'Grab & go', midday: 'No fuss lunch', afternoon: 'Low effort, good options', evening: 'Decide in 30 sec', night: 'Fastest option' } },
];

export default function HybridV2Momentum() {
  const [tapped, setTapped] = useState<string | null>(null);
  const [heroTapped, setHeroTapped] = useState(false);
  const time = getTimeCtx();
  const hero = HERO[time.period];
  const alt = ALT[time.period];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
      <div className="h-[44px]" />

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, ...spring }}
        className="px-6 mt-5"
      >
        <p className="text-[13px] text-neutral-400 font-medium">Start here</p>
        <h1 className="text-[28px] font-extrabold text-neutral-900 leading-tight mt-0.5">
          {hero.why}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...spring }}
        className="px-6 mt-5"
      >
        <motion.div
          whileTap={{ scale: 0.98 }}
          onTapStart={() => setHeroTapped(true)}
          onTap={() => setTimeout(() => setHeroTapped(false), 300)}
          className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <div className="relative h-[180px]">
            <img src={hero.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            <div className="absolute top-3 left-3">
              <div className="px-2.5 py-1 bg-[#FFCC02] rounded-full flex items-center gap-1">
                <Sparkles size={9} className="text-neutral-900" />
                <span className="text-[9px] font-bold text-neutral-900 uppercase tracking-wider">Picked for you</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[22px] font-bold text-white leading-tight">{hero.title}</p>
              <p className="text-[13px] text-white/70 mt-1">{hero.sub}</p>
            </div>
          </div>

          <div className="p-4 flex gap-2.5">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="flex-1 h-[52px] bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
            >
              Let's do this
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="h-[52px] px-4 bg-neutral-100 rounded-2xl flex items-center justify-center gap-1.5 font-semibold text-[13px] text-neutral-500"
            >
              <RefreshCw size={13} />
              Change
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.28, ...spring }}
        className="px-6 mt-4"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <span className="text-[20px]">{alt.emoji}</span>
          </div>
          <p className="flex-1 text-[14px] font-semibold text-neutral-700 text-left">{alt.text}</p>
          <ArrowRight size={15} className="text-neutral-300" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="px-6 mt-6"
      >
        <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Or pick a vibe</p>
        <div className="grid grid-cols-3 gap-2.5">
          {MOODS.slice(0, 3).map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 + i * 0.04, ...spring }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTapped(m.id)}
              className={`p-3 rounded-2xl text-left transition-colors ${
                tapped === m.id ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.3)]' : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[22px] block">{m.emoji}</span>
              <p className="text-[12px] font-bold text-neutral-900 mt-1.5 leading-tight">{m.label}</p>
              <p className="text-[9px] text-neutral-400 mt-0.5">{m.sub[time.period]}</p>
            </motion.button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2.5 mt-2.5">
          {MOODS.slice(3).map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.04, ...spring }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTapped(m.id)}
              className={`flex items-center gap-2.5 p-3 rounded-2xl text-left transition-colors ${
                tapped === m.id ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.3)]' : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[20px]">{m.emoji}</span>
              <div>
                <p className="text-[12px] font-bold text-neutral-900">{m.label}</p>
                <p className="text-[9px] text-neutral-400">{m.sub[time.period]}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.58 }}
        className="px-6 mt-5"
      >
        <button className="w-full flex items-center gap-3 p-3.5 bg-neutral-900 rounded-2xl">
          <div className="w-9 h-9 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
            <Users size={14} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-white">Planning with friends?</p>
            <p className="text-[10px] text-white/50">Start or join a group session</p>
          </div>
          <ChevronRight size={14} className="text-white/40" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.62 }}
        className="px-6 mt-3.5 pb-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['☕ Coffee nearby', '🍜 Street food', '🍷 Happy hour', '🎶 Live music'].map((tag, i) => (
            <button key={i} className="flex-shrink-0 px-3 py-1.5 bg-neutral-100 rounded-full text-[11px] font-medium text-neutral-500">
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 pb-2.5 pt-1">
        <p className="text-center text-[9px] text-neutral-300 font-medium tracking-wider uppercase">Toast Hybrid v2 · Momentum</p>
      </div>
    </div>
  );
}
