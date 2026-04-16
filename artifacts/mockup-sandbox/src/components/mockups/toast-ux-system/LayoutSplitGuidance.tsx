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

const HERO: Record<Period, { title: string; why: string; sub: string; image: string; rating: string }> = {
  morning: { title: 'Roots Coffee', why: 'Easy place to begin', sub: 'Specialty pourover · 5 min walk', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60', rating: '4.9' },
  midday: { title: 'Supanniga', why: 'Great for lunch right now', sub: 'Thai comfort food · 8 min walk', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60', rating: '4.8' },
  afternoon: { title: 'After You Cafe', why: 'Perfect afternoon pick', sub: 'Desserts & drinks · Siam', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60', rating: '4.7' },
  evening: { title: 'Dinner + Drinks', why: 'A combo for tonight', sub: 'Izakaya → rooftop · Sukhumvit', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60', rating: '4.9' },
  night: { title: 'Iron Fairies', why: 'Open now, worth the trip', sub: 'Jazz bar · Thonglor', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60', rating: '4.6' },
};

const ALT: Record<Period, { text: string; emoji: string }> = {
  morning: { text: 'Or something fun?', emoji: '🎯' },
  midday: { text: 'Or fun after lunch?', emoji: '🎯' },
  afternoon: { text: 'Or food first?', emoji: '🍜' },
  evening: { text: 'Or keep it easy?', emoji: '⚡' },
  night: { text: 'Or late-night food?', emoji: '🍜' },
};

const MOODS: { id: string; emoji: string; label: string; micro: Record<Period, string> }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', micro: { morning: 'Coffee or breakfast', midday: 'Let\'s find lunch', afternoon: 'Snack break', evening: 'Find food first', night: 'Late bites' } },
  { id: 'fun', emoji: '🎯', label: 'Something fun', micro: { morning: 'Markets & cafes', midday: 'Break from routine', afternoon: 'Do something new', evening: 'Activities tonight', night: 'Keep going' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', micro: { morning: 'Worth stepping out', midday: 'Get outside', afternoon: 'Find a spot', evening: 'Where tonight?', night: 'One more stop' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', micro: { morning: 'Brunch date', midday: 'Lunch à deux', afternoon: 'Fits together', evening: 'Romantic evening', night: 'Intimate spot' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', micro: { morning: 'Grab & go', midday: 'No fuss', afternoon: 'Low effort', evening: '30 seconds', night: 'Fastest' } },
];

export default function LayoutSplitGuidance() {
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
        className="px-6 flex items-center justify-between mt-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px]">{time.emoji}</span>
          <span className="text-[12px] font-semibold text-neutral-400">{time.label}</span>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <User size={13} className="text-neutral-400" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, ...spring }}
        className="px-6 mt-4"
      >
        <h1 className="text-[26px] font-extrabold text-neutral-900 leading-[1.1]">Start here</h1>
        <p className="text-[13px] text-neutral-400 mt-0.5">{hero.why}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, ...spring }}
        className="px-6 mt-4"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden border border-neutral-100/50 text-left"
        >
          <div className="flex items-stretch">
            <img src={hero.image} alt="" className="w-[120px] object-cover" />
            <div className="flex-1 p-4 flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-1">
                <Star size={9} className="text-[#FFCC02] fill-[#FFCC02]" />
                <span className="text-[10px] font-bold text-neutral-600">{hero.rating}</span>
              </div>
              <p className="text-[17px] font-bold text-neutral-900 leading-tight">{hero.title}</p>
              <p className="text-[11px] text-neutral-500 mt-1">{hero.sub}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[12px] font-bold text-[#FFCC02] bg-amber-50 px-3 py-1.5 rounded-xl">Let's go →</span>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1"><RefreshCw size={9} /> Other</span>
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.22, ...spring }}
        className="px-6 mt-3"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-2.5 py-2.5 px-3.5 bg-violet-50/70 rounded-xl border border-violet-100/40"
        >
          <span className="text-[16px]">{alt.emoji}</span>
          <p className="flex-1 text-[12px] font-semibold text-violet-600 text-left">{alt.text}</p>
          <ArrowRight size={13} className="text-violet-300" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="px-6 mt-5"
      >
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Or pick a vibe</p>
        <div className="grid grid-cols-2 gap-2.5">
          {MOODS.slice(0, 4).map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.04, ...spring }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTapped(m.id)}
              className={`p-3.5 rounded-2xl text-left transition-colors ${
                tapped === m.id
                  ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.35)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[22px]">{m.emoji}</span>
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">{m.label}</p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">{m.micro[time.period]}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, ...spring }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setTapped('quick')}
          className={`w-full mt-2.5 flex items-center gap-3 p-3.5 rounded-2xl transition-colors ${
            tapped === 'quick'
              ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.35)]'
              : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          }`}
        >
          <span className="text-[22px]">⚡</span>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-bold text-neutral-900">Quick & easy</p>
            <p className="text-[9px] text-neutral-400">{MOODS[4].micro[time.period]}</p>
          </div>
          <ArrowRight size={14} className={tapped === 'quick' ? 'text-neutral-800' : 'text-neutral-300'} />
        </motion.button>
      </motion.div>

      <div className="flex-1" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="px-6 mt-4"
      >
        <button className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="w-8 h-8 rounded-full bg-[#FFCC02]/15 flex items-center justify-center">
            <Users size={13} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[12px] font-semibold text-neutral-800">Planning with friends?</p>
            <p className="text-[9px] text-neutral-400">Start or join a session</p>
          </div>
          <ChevronRight size={13} className="text-neutral-300" />
        </button>
      </motion.div>

      <div className="px-6 mt-3 pb-5">
        <div className="flex gap-1.5">
          {['☕ Coffee', '🍜 Street food', '🍷 Drinks', '🎶 Live'].map((t, i) => (
            <button key={i} className="flex-shrink-0 px-2.5 py-1 bg-neutral-100 rounded-full text-[9px] font-medium text-neutral-400">{t}</button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-2">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-widest uppercase">Variation 2 · Split Guidance</p>
      </div>
    </div>
  );
}
