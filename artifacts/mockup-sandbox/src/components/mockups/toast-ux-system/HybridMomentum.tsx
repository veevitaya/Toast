import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, MapPin, ArrowRight, Clock, Zap, Star, Heart, Coffee, Sun, Sunset, Moon } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 300, damping: 28 };

function getTimeCtx() {
  const h = new Date().getHours();
  if (h < 11) return { label: 'This morning', sub: 'Start your day right', period: 'morning' as const, emoji: '☀️' };
  if (h < 14) return { label: 'Lunch time', sub: 'What sounds good?', period: 'midday' as const, emoji: '🌤️' };
  if (h < 17) return { label: 'This afternoon', sub: 'Something to look forward to', period: 'afternoon' as const, emoji: '🌅' };
  if (h < 21) return { label: 'Tonight', sub: 'Make it a good one', period: 'evening' as const, emoji: '🌆' };
  return { label: 'Late night', sub: 'Still going?', period: 'night' as const, emoji: '🌙' };
}

type Period = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

const HERO_SUGGESTIONS: Record<Period, { title: string; sub: string; image: string; tag: string }> = {
  morning: { title: 'Coffee & Pastry Run', sub: 'Top-rated cafes near you open now', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60', tag: 'Popular this morning' },
  midday: { title: 'Quick Lunch Plan', sub: 'Highly rated spots within 10 min', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60', tag: 'Trending at lunch' },
  afternoon: { title: 'Chill Afternoon Idea', sub: 'Cafes, desserts, and easy activities', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60', tag: 'Perfect for now' },
  evening: { title: 'Dinner + Drinks Nearby', sub: 'Great combos picked for your vibe', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60', tag: 'Tonight\'s top pick' },
  night: { title: 'Late Night Bites & Bars', sub: 'Open now and worth the trip', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60', tag: 'Open late' },
};

const MOOD_CARDS: { id: string; emoji: string; label: string; sub: Record<Period, string>; color: string; bgColor: string }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', sub: { morning: 'Coffee or breakfast?', midday: 'Let\'s find lunch', afternoon: 'Snack or early dinner?', evening: 'Find food first', night: 'Late-night cravings' }, color: '#FFCC02', bgColor: 'bg-amber-50' },
  { id: 'fun', emoji: '🎯', label: 'Something fun', sub: { morning: 'Markets & cafes', midday: 'Break from routine', afternoon: 'Do something new', evening: 'Activities tonight', night: 'Keep the vibe going' }, color: '#8b5cf6', bgColor: 'bg-violet-50' },
  { id: 'goout', emoji: '🌃', label: 'Go out', sub: { morning: 'Explore the city', midday: 'Get out for lunch', afternoon: 'Worth stepping out for', evening: 'Where to tonight?', night: 'One more stop' }, color: '#6366f1', bgColor: 'bg-indigo-50' },
  { id: 'date', emoji: '💕', label: 'Date vibe', sub: { morning: 'Brunch date?', midday: 'Lunch à deux', afternoon: 'Something that fits together', evening: 'Romantic evening', night: 'Intimate spot' }, color: '#f43f5e', bgColor: 'bg-rose-50' },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', sub: { morning: 'Grab & go', midday: 'No fuss lunch', afternoon: 'Low effort, good options', evening: 'Decide in 30 seconds', night: 'Fastest option' }, color: '#f97316', bgColor: 'bg-orange-50' },
];

export default function HybridMomentum() {
  const [tapped, setTapped] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const time = getTimeCtx();
  const hero = HERO_SUGGESTIONS[time.period];

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
      <div className="h-[44px]" />

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-6 flex items-center justify-between mt-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px]">{time.emoji}</span>
          <span className="text-[13px] font-semibold text-neutral-500">{time.label}</span>
          <span className="text-neutral-300">·</span>
          <span className="text-[11px] text-neutral-400 flex items-center gap-1"><MapPin size={9} />Bangkok</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center relative">
            <User size={14} className="text-neutral-500" />
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 mt-5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="text-[13px] text-neutral-400 font-medium mb-1"
        >
          What are we feeling?
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-[30px] font-extrabold text-neutral-900 leading-[1.08]"
        >
          Tap your mood
        </motion.h1>
      </div>

      <div className="px-6 mt-5">
        <div className="grid grid-cols-2 gap-3">
          {MOOD_CARDS.slice(0, 4).map((card, i) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.05 }}
              whileTap={{ scale: 0.95, y: 2 }}
              onClick={() => setTapped(card.id)}
              className={`relative p-4 rounded-2xl text-left transition-colors duration-150 ${
                tapped === card.id
                  ? 'bg-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[28px] block">{card.emoji}</span>
              <p className={`text-[15px] font-bold mt-2 ${tapped === card.id ? 'text-neutral-900' : 'text-neutral-900'}`}>{card.label}</p>
              <p className={`text-[11px] mt-0.5 leading-snug ${tapped === card.id ? 'text-neutral-700' : 'text-neutral-400'}`}>{card.sub[time.period]}</p>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.32 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setTapped('quick')}
          className={`w-full mt-3 flex items-center gap-4 p-4 rounded-2xl transition-colors duration-150 ${
            tapped === 'quick'
              ? 'bg-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]'
              : 'bg-white border border-neutral-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
          }`}
        >
          <span className="text-[26px]">⚡</span>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-bold text-neutral-900">Quick & easy</p>
            <p className="text-[11px] text-neutral-400">{MOOD_CARDS[4].sub[time.period]}</p>
          </div>
          <ArrowRight size={16} className={tapped === 'quick' ? 'text-neutral-900' : 'text-neutral-300'} />
        </motion.button>
      </div>

      <AnimatePresence>
        {heroVisible && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
            className="px-6 mt-5"
          >
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#FFCC02]" />
              Smart pick for you
            </p>
            <button className="w-full bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden text-left">
              <div className="flex items-center gap-3 p-3.5">
                <img src={hero.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-bold text-[#FFCC02] bg-amber-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{hero.tag}</span>
                  </div>
                  <p className="text-[14px] font-bold text-neutral-900 truncate">{hero.title}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{hero.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#FFCC02] flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_-1px_rgba(255,204,2,0.4)]">
                  <ArrowRight size={14} className="text-neutral-900" />
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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
        transition={{ delay: 0.55 }}
        className="px-6 mt-4 pb-8"
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['☕ Coffee', '🥗 Healthy', '🍜 Street food', '🍷 Drinks', '🎶 Live music'].map((tag, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-3 py-1.5 bg-neutral-100 rounded-full text-[11px] font-medium text-neutral-500"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-3 pt-1">
        <p className="text-center text-[9px] text-neutral-300 font-medium tracking-wider uppercase">Toast Hybrid · Momentum</p>
      </div>
    </div>
  );
}
