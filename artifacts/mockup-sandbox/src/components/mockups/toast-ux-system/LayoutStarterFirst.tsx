import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, MapPin, ArrowRight, Star, RefreshCw, Clock } from 'lucide-react';

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

const HERO: Record<Period, { title: string; why: string; sub: string; image: string; rating: string; dist: string }> = {
  morning: { title: 'Roots Coffee Roasters', why: 'Easy place to begin this morning', sub: 'Specialty pourover · pastries · Thonglor', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60', rating: '4.9', dist: '5 min walk' },
  midday: { title: 'Supanniga Eating Room', why: 'A good option for lunch right now', sub: 'Thai comfort food · elevated flavors', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60', rating: '4.8', dist: '8 min' },
  afternoon: { title: 'After You Dessert Cafe', why: 'Perfect pick for this afternoon', sub: 'Shibuya Honey Toast · matcha soufflé', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60', rating: '4.7', dist: '10 min' },
  evening: { title: 'Dinner + Drinks Plan', why: 'We paired a combo for tonight', sub: 'Izakaya → rooftop bar · Sukhumvit', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60', rating: '4.9', dist: 'Tonight' },
  night: { title: 'Iron Fairies Jazz Bar', why: 'Open now and worth the trip', sub: 'Craft cocktails · live jazz · Thonglor', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60', rating: '4.6', dist: 'Open now' },
};

const ALT: Record<Period, { text: string; emoji: string }> = {
  morning: { text: 'Or do something fun instead?', emoji: '🎯' },
  midday: { text: 'Or something fun after lunch?', emoji: '🎯' },
  afternoon: { text: 'Or start with food first?', emoji: '🍜' },
  evening: { text: 'Or keep it easy tonight?', emoji: '⚡' },
  night: { text: 'Or grab late-night food?', emoji: '🍜' },
};

const MOODS: { id: string; emoji: string; label: string; micro: string }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', micro: 'Let\'s find food first' },
  { id: 'fun', emoji: '🎯', label: 'Something fun', micro: 'Do something after or instead' },
  { id: 'goout', emoji: '🌃', label: 'Go out', micro: 'Worth stepping out for' },
  { id: 'date', emoji: '💕', label: 'Date vibe', micro: 'Feels right together' },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', micro: 'Low effort, good options' },
];

export default function LayoutStarterFirst() {
  const [tapped, setTapped] = useState<string | null>(null);
  const time = getTimeCtx();
  const hero = HERO[time.period];
  const alt = ALT[time.period];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col">
      <div className="h-[44px]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="px-6 flex items-center justify-between mt-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px]">{time.emoji}</span>
          <span className="text-[12px] font-semibold text-neutral-400">{time.label}</span>
          <span className="text-neutral-200">·</span>
          <span className="text-[10px] text-neutral-400 flex items-center gap-0.5"><MapPin size={8} />Bangkok</span>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <User size={13} className="text-neutral-400" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, ...spring }}
        className="px-6 mt-4"
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <Sparkles size={11} className="text-[#FFCC02]" />
          <span className="text-[10px] font-bold text-[#FFCC02] uppercase tracking-widest">Start here</span>
        </div>
        <p className="text-[14px] font-semibold text-neutral-500 leading-snug">{hero.why}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, ...spring }}
        className="px-6 mt-3"
      >
        <motion.div
          whileTap={{ scale: 0.985 }}
          className="bg-white rounded-[28px] shadow-[0_6px_32px_rgba(0,0,0,0.08)] overflow-hidden border border-neutral-100/60"
        >
          <div className="relative h-[200px]">
            <img src={hero.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute top-3.5 left-4 flex items-center gap-1.5">
              <div className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-sm">
                <Star size={9} className="text-[#FFCC02] fill-[#FFCC02]" />
                <span className="text-[10px] font-bold text-neutral-800">{hero.rating}</span>
              </div>
            </div>
            <div className="absolute top-3.5 right-4">
              <div className="px-2 py-0.5 bg-black/30 backdrop-blur-md rounded-full flex items-center gap-1">
                <Clock size={8} className="text-white/80" />
                <span className="text-[9px] font-semibold text-white/90">{hero.dist}</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-[22px] font-extrabold text-white leading-tight tracking-tight">{hero.title}</p>
              <p className="text-[12px] text-white/75 mt-1">{hero.sub}</p>
            </div>
          </div>

          <div className="px-5 py-4 flex gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="flex-1 h-[52px] bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.45)]"
            >
              Let's do this
              <ArrowRight size={16} strokeWidth={2.5} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="h-[52px] w-[52px] bg-neutral-100 rounded-2xl flex items-center justify-center"
            >
              <RefreshCw size={16} className="text-neutral-400" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.26, ...spring }}
        className="px-6 mt-3.5"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 py-3 px-4 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <span className="text-[18px]">{alt.emoji}</span>
          </div>
          <p className="flex-1 text-[13px] font-semibold text-neutral-600 text-left">{alt.text}</p>
          <ArrowRight size={14} className="text-neutral-300 flex-shrink-0" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.34 }}
        className="px-6 mt-5"
      >
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">Or pick a vibe</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {MOODS.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 + i * 0.035, ...spring }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTapped(m.id)}
              className={`flex-shrink-0 w-[88px] p-2.5 rounded-2xl text-left transition-colors ${
                tapped === m.id
                  ? 'bg-[#FFCC02] shadow-[0_4px_14px_-2px_rgba(255,204,2,0.35)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[20px] block">{m.emoji}</span>
              <p className="text-[10px] font-bold text-neutral-900 mt-1.5 leading-tight">{m.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="flex-1" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.52 }}
        className="px-6 mt-4"
      >
        <button className="w-full flex items-center gap-3 p-3 bg-neutral-900 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
            <Users size={13} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[12px] font-semibold text-white">Planning with friends?</p>
            <p className="text-[9px] text-white/40">Start or join a group session</p>
          </div>
          <ChevronRight size={13} className="text-white/30" />
        </button>
      </motion.div>

      <div className="px-6 mt-3 pb-5">
        <div className="flex gap-1.5 overflow-x-auto">
          {['☕ Coffee', '🍜 Street food', '🍷 Drinks', '🎶 Live'].map((t, i) => (
            <button key={i} className="flex-shrink-0 px-2.5 py-1 bg-neutral-100 rounded-full text-[9px] font-medium text-neutral-400">{t}</button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-2">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-widest uppercase">Variation 1 · Starter First</p>
      </div>
    </div>
  );
}
