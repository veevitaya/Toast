import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, MapPin, ArrowRight, Star, Wand2, RefreshCw, Clock } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 300, damping: 28 };
type Period = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

function getTimeCtx() {
  const h = new Date().getHours();
  if (h < 11) return { label: 'This morning', period: 'morning' as Period, emoji: '☀️', bg: 'from-amber-50/80 to-[#FAFAF8]' };
  if (h < 14) return { label: 'Lunch time', period: 'midday' as Period, emoji: '🌤️', bg: 'from-sky-50/60 to-[#FAFAF8]' };
  if (h < 17) return { label: 'This afternoon', period: 'afternoon' as Period, emoji: '🌅', bg: 'from-orange-50/50 to-[#FAFAF8]' };
  if (h < 21) return { label: 'Tonight', period: 'evening' as Period, emoji: '🌆', bg: 'from-violet-50/50 to-[#FAFAF8]' };
  return { label: 'Late night', period: 'night' as Period, emoji: '🌙', bg: 'from-slate-50/80 to-[#FAFAF8]' };
}

const HERO: Record<Period, { title: string; sub: string; why: string; image: string; rating: string; type: string; time: string }> = {
  morning: { title: 'Roots Coffee Roasters', sub: 'Specialty coffee · award-winning pourover', why: 'Top-rated cafe open near you now', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60', rating: '4.9', type: 'Cafe', time: '5 min walk' },
  midday: { title: 'Supanniga Eating Room', sub: 'Thai comfort food · elevated street flavors', why: 'Perfect quick lunch — highly rated, close by', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60', rating: '4.8', type: 'Restaurant', time: '8 min walk' },
  afternoon: { title: 'After You Dessert Cafe', sub: 'Shibuya Honey Toast · matcha soufflé', why: 'Great afternoon pick — open and nearby', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60', rating: '4.7', type: 'Dessert', time: '10 min' },
  evening: { title: 'Dinner + Drinks Plan', sub: 'Izakaya → rooftop bar · Sukhumvit area', why: 'We paired a dinner and drinks combo for tonight', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60', rating: '4.9', type: '2-stop plan', time: 'Tonight' },
  night: { title: 'Iron Fairies Jazz Bar', sub: 'Craft cocktails · live jazz · Thonglor', why: 'Open now and worth the trip', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60', rating: '4.6', type: 'Bar', time: 'Open now' },
};

const ALT: Record<Period, { text: string; emoji: string }> = {
  morning: { text: 'Or do something fun instead?', emoji: '🎯' },
  midday: { text: 'Or something fun after lunch?', emoji: '🎯' },
  afternoon: { text: 'Or start with food first?', emoji: '🍜' },
  evening: { text: 'Or keep it easy tonight?', emoji: '⚡' },
  night: { text: 'Or grab late-night food?', emoji: '🍜' },
};

const MOODS: { id: string; emoji: string; label: string; sub: Record<Period, string> }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', sub: { morning: 'Let\'s find food first', midday: 'Let\'s find lunch', afternoon: 'Snack or early dinner', evening: 'Find food first', night: 'Late-night bites' } },
  { id: 'fun', emoji: '🎯', label: 'Something fun', sub: { morning: 'Do something after or instead', midday: 'Break from routine', afternoon: 'Do something new', evening: 'Activities tonight', night: 'Keep going' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', sub: { morning: 'Find something worth stepping out for', midday: 'Get out for lunch', afternoon: 'Worth stepping out', evening: 'Where to tonight?', night: 'One more stop' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', sub: { morning: 'Something that feels right together', midday: 'Lunch together', afternoon: 'Fits together', evening: 'Romantic evening', night: 'Intimate spot' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', sub: { morning: 'Low effort, good options fast', midday: 'No fuss lunch', afternoon: 'Low effort, good options', evening: '30 seconds to decide', night: 'Fastest option' } },
];

export default function HybridV2Concierge() {
  const [tapped, setTapped] = useState<string | null>(null);
  const time = getTimeCtx();
  const hero = HERO[time.period];
  const alt = ALT[time.period];

  return (
    <div className={`w-[390px] min-h-[844px] bg-gradient-to-b ${time.bg} overflow-hidden font-['Figtree',sans-serif] relative`}>
      <div className="h-[44px]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 flex items-center justify-between mt-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px]">{time.emoji}</span>
          <span className="text-[13px] font-semibold text-neutral-500">{time.label}</span>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-neutral-200/50">
          <User size={14} className="text-neutral-500" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="px-6 mt-4"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Wand2 size={12} className="text-[#FFCC02]" />
          <p className="text-[12px] font-semibold text-[#FFCC02] uppercase tracking-wider">Start here</p>
        </div>
        <h1 className="text-[24px] font-extrabold text-neutral-900 leading-tight">{hero.why}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, ...spring }}
        className="px-6 mt-4"
      >
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden border border-neutral-100/80"
        >
          <div className="relative h-[160px]">
            <img src={hero.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <div className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                <Star size={9} className="text-[#FFCC02] fill-[#FFCC02]" />
                <span className="text-[10px] font-bold text-neutral-800">{hero.rating}</span>
              </div>
              <div className="px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-full">
                <span className="text-[9px] font-semibold text-white">{hero.type}</span>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-[20px] font-bold text-white leading-tight">{hero.title}</p>
              <p className="text-[12px] text-white/75 mt-0.5">{hero.sub}</p>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Clock size={11} className="text-neutral-400" />
              <span className="text-[11px] text-neutral-500">{hero.time}</span>
            </div>
            <div className="flex gap-2.5">
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="flex-1 h-[50px] bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
              >
                Let's do this
                <ArrowRight size={15} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="h-[50px] w-[50px] bg-neutral-100 rounded-2xl flex items-center justify-center"
              >
                <RefreshCw size={16} className="text-neutral-400" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.28, ...spring }}
        className="px-6 mt-3.5"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 py-3 px-4 bg-violet-50/80 rounded-2xl border border-violet-100/60"
        >
          <span className="text-[18px]">{alt.emoji}</span>
          <p className="flex-1 text-[13px] font-semibold text-violet-700 text-left">{alt.text}</p>
          <ArrowRight size={14} className="text-violet-400" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.36 }}
        className="px-6 mt-6"
      >
        <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Or pick a vibe</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MOODS.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.04, ...spring }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTapped(m.id)}
              className={`flex-shrink-0 w-[96px] p-3 rounded-2xl text-left transition-colors ${
                tapped === m.id
                  ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.3)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[20px] block">{m.emoji}</span>
              <p className="text-[11px] font-bold text-neutral-900 mt-1.5 leading-tight">{m.label}</p>
              <p className="text-[9px] text-neutral-400 mt-0.5 leading-snug">{m.sub[time.period]}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="px-6 mt-5 pb-6"
      >
        <button className="w-full flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="w-9 h-9 rounded-full bg-[#FFCC02]/15 flex items-center justify-center">
            <Users size={14} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[12px] font-semibold text-neutral-800">Planning with friends?</p>
            <p className="text-[10px] text-neutral-400">Start or join a group session</p>
          </div>
          <ChevronRight size={14} className="text-neutral-300" />
        </button>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 pb-2.5 pt-1">
        <p className="text-center text-[9px] text-neutral-300 font-medium tracking-wider uppercase">Toast Hybrid v2 · Concierge</p>
      </div>
    </div>
  );
}
