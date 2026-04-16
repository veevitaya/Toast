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

const HERO: Record<Period, { title: string; why: string; sub: string; image: string; rating: string; dist: string; type: string }> = {
  morning: { title: 'Roots Coffee Roasters', why: 'Easy place to begin this morning', sub: 'Specialty pourover · pastries · Thonglor', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60', rating: '4.9', dist: '5 min', type: 'Cafe' },
  midday: { title: 'Supanniga Eating Room', why: 'A good option for lunch', sub: 'Thai comfort food · elevated flavors', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60', rating: '4.8', dist: '8 min', type: 'Thai' },
  afternoon: { title: 'After You Dessert Cafe', why: 'Perfect for this afternoon', sub: 'Shibuya Honey Toast · matcha', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60', rating: '4.7', dist: '10 min', type: 'Dessert' },
  evening: { title: 'Dinner + Drinks Plan', why: 'We paired a combo for tonight', sub: 'Izakaya → rooftop bar · Sukhumvit', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60', rating: '4.9', dist: 'Tonight', type: 'Plan' },
  night: { title: 'Iron Fairies Jazz Bar', why: 'Open now, worth the trip', sub: 'Craft cocktails · live jazz', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60', rating: '4.6', dist: 'Open now', type: 'Bar' },
};

const ALT: Record<Period, { text: string; emoji: string; image: string }> = {
  morning: { text: 'Or do something fun', emoji: '🎯', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=60' },
  midday: { text: 'Or something fun after', emoji: '🎯', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=60' },
  afternoon: { text: 'Or start with food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60' },
  evening: { text: 'Or keep it easy', emoji: '⚡', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&auto=format&fit=crop&q=60' },
  night: { text: 'Or grab late food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60' },
};

const MOODS: { id: string; emoji: string; label: string; micro: string; image: string }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', micro: 'Let\'s find food first', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=300&auto=format&fit=crop&q=60' },
  { id: 'fun', emoji: '🎯', label: 'Something fun', micro: 'Do something after or instead', image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=300&auto=format&fit=crop&q=60' },
  { id: 'goout', emoji: '🌃', label: 'Go out', micro: 'Worth stepping out for', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&auto=format&fit=crop&q=60' },
  { id: 'date', emoji: '💕', label: 'Date vibe', micro: 'Feels right together', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&auto=format&fit=crop&q=60' },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', micro: 'Low effort, good options', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&auto=format&fit=crop&q=60' },
];

export default function LayoutLayeredDiscovery() {
  const [tapped, setTapped] = useState<string | null>(null);
  const time = getTimeCtx();
  const hero = HERO[time.period];
  const alt = ALT[time.period];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">

      <div className="relative h-[340px]">
        <img src={hero.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-[#FAFAF8]" />

        <div className="absolute top-[44px] left-0 right-0 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px]">{time.emoji}</span>
              <span className="text-[12px] font-semibold text-white/80">{time.label}</span>
            </div>
            <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User size={13} className="text-white" />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-5 left-0 right-0 px-6">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={10} className="text-[#FFCC02]" />
            <span className="text-[9px] font-bold text-[#FFCC02] uppercase tracking-widest">Start here</span>
          </div>
          <p className="text-[12px] text-neutral-500">{hero.why}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...spring }}
        className="px-6 -mt-5 relative z-10"
      >
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-4 border border-neutral-100/30"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Star size={10} className="text-[#FFCC02] fill-[#FFCC02]" />
              <span className="text-[11px] font-bold text-neutral-700">{hero.rating}</span>
              <span className="text-neutral-200">·</span>
              <span className="text-[10px] text-neutral-400">{hero.type}</span>
            </div>
            <span className="text-[9px] text-neutral-400 flex items-center gap-1"><Clock size={8} />{hero.dist}</span>
          </div>
          <p className="text-[18px] font-bold text-neutral-900 leading-tight">{hero.title}</p>
          <p className="text-[12px] text-neutral-500 mt-0.5">{hero.sub}</p>

          <div className="flex gap-2.5 mt-3.5">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="flex-1 h-[48px] bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 font-bold text-[14px] text-neutral-900 shadow-[0_4px_18px_-2px_rgba(255,204,2,0.45)]"
            >
              Let's do this <ArrowRight size={14} strokeWidth={2.5} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="h-[48px] w-[48px] bg-neutral-100 rounded-2xl flex items-center justify-center"
            >
              <RefreshCw size={15} className="text-neutral-400" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.22, ...spring }}
        className="px-6 mt-3.5"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 p-2.5 bg-white rounded-xl border border-neutral-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <img src={alt.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 text-left">
            <p className="text-[12px] font-semibold text-neutral-700">{alt.text}</p>
            <p className="text-[9px] text-neutral-400">Try a different direction</p>
          </div>
          <ArrowRight size={13} className="text-neutral-300 flex-shrink-0" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 mt-5"
      >
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Or pick a vibe</p>
        <div className="grid grid-cols-2 gap-2.5">
          {MOODS.slice(0, 4).map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 + i * 0.04, ...spring }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTapped(m.id)}
              className="relative h-[72px] rounded-2xl overflow-hidden text-left"
            >
              <img src={m.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className={`absolute inset-0 ${tapped === m.id ? 'bg-[#FFCC02]/70' : 'bg-black/45'} transition-colors`} />
              <div className="relative h-full flex items-center gap-2.5 px-3.5">
                <span className="text-[20px]">{m.emoji}</span>
                <div>
                  <p className="text-[13px] font-bold text-white leading-tight">{m.label}</p>
                  <p className="text-[9px] text-white/70">{m.micro}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ...spring }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setTapped('quick')}
          className="relative w-full h-[56px] mt-2.5 rounded-2xl overflow-hidden text-left"
        >
          <img src={MOODS[4].image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 ${tapped === 'quick' ? 'bg-[#FFCC02]/70' : 'bg-black/50'} transition-colors`} />
          <div className="relative h-full flex items-center gap-3 px-4">
            <span className="text-[20px]">⚡</span>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-white">Quick & easy</p>
              <p className="text-[9px] text-white/70">{MOODS[4].micro}</p>
            </div>
            <ArrowRight size={14} className="text-white/60" />
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.56 }}
        className="px-6 mt-5"
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
        <div className="flex gap-1.5">
          {['☕ Coffee', '🍜 Street food', '🍷 Drinks', '🎶 Live'].map((t, i) => (
            <button key={i} className="flex-shrink-0 px-2.5 py-1 bg-neutral-100 rounded-full text-[9px] font-medium text-neutral-400">{t}</button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-2">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-widest uppercase">Variation 3 · Layered Discovery</p>
      </div>
    </div>
  );
}
