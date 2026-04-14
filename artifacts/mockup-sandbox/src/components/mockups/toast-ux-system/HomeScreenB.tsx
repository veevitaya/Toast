import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };

function getTimeContext() {
  const h = new Date().getHours();
  if (h < 11) return { label: 'This morning', emoji: '☀️', bg: 'from-amber-50 to-orange-50' };
  if (h < 14) return { label: 'Lunch time', emoji: '🌤️', bg: 'from-sky-50 to-blue-50' };
  if (h < 17) return { label: 'This afternoon', emoji: '🌅', bg: 'from-amber-50 to-rose-50' };
  if (h < 21) return { label: 'Tonight', emoji: '🌆', bg: 'from-indigo-50 to-violet-50' };
  return { label: 'Late night', emoji: '🌙', bg: 'from-slate-100 to-indigo-50' };
}

function getTimePeriod(): string {
  const h = new Date().getHours();
  if (h < 11) return 'morning';
  if (h < 14) return 'midday';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

const CARDS = [
  {
    id: 'hungry', emoji: '🍜', label: 'Hungry now',
    subs: { morning: 'Coffee or breakfast?', midday: 'Lunch time?', afternoon: 'Snack or early dinner?', evening: 'What sounds good?', night: 'Late-night cravings?' },
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: 'fun', emoji: '🎯', label: 'Something fun',
    subs: { morning: 'Markets & cafes', midday: 'Break from routine', afternoon: 'Adventure time', evening: 'Activities tonight', night: 'Still going?' },
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: 'goout', emoji: '🌃', label: 'Go out',
    subs: { morning: 'Explore the city', midday: 'Get out for lunch', afternoon: 'Find a spot', evening: 'Where to tonight?', night: 'One more stop?' },
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&auto=format&fit=crop&q=60',
  },
];

const BOTTOM_CARDS = [
  { id: 'date', emoji: '💕', label: 'Date vibe', sub: 'Romantic spot' },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', sub: '30 sec decision' },
];

export default function HomeScreenB() {
  const [tapped, setTapped] = useState<string | null>(null);
  const time = getTimeContext();
  const period = getTimePeriod();

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
      <div className="h-[44px]" />

      <div className="px-6 flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">{time.emoji}</span>
          <span className="text-[13px] font-semibold text-neutral-500">{time.label}</span>
          <span className="text-[11px] text-neutral-300">·</span>
          <span className="text-[11px] text-neutral-400 flex items-center gap-1"><MapPin size={10} /> Bangkok</span>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <User size={16} className="text-neutral-500" />
        </motion.div>
      </div>

      <div className="px-6 mt-5">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[28px] font-extrabold text-neutral-900 leading-tight"
        >
          What are we feeling?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[14px] text-neutral-400 mt-1"
        >
          We'll figure it out together
        </motion.p>
      </div>

      <div className="px-6 mt-6 flex flex-col gap-3">
        {CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTapped(card.id)}
            className="relative w-full h-[120px] rounded-3xl overflow-hidden"
          >
            <img src={card.image} alt={card.label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="relative h-full flex items-center px-5">
              <div className="flex-1 text-left">
                <p className="text-[20px] font-bold text-white">{card.label}</p>
                <p className="text-[13px] text-white/70 mt-0.5">{(card.subs as any)[period]}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ArrowRight size={18} className="text-white" />
              </div>
            </div>
            {tapped === card.id && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 20, opacity: 0.1 }}
                className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-white"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="px-6 mt-4 flex gap-3">
        {BOTTOM_CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.25 + i * 0.06 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 text-left"
          >
            <span className="text-[24px]">{card.emoji}</span>
            <p className="text-[14px] font-bold text-neutral-900 mt-2">{card.label}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">{card.sub}</p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6 mt-5"
      >
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 rounded-full bg-[#FFCC02]/15 flex items-center justify-center">
            <Users size={16} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-neutral-800">Planning with friends?</p>
            <p className="text-[11px] text-neutral-400">Start or join a group session</p>
          </div>
          <ChevronRight size={16} className="text-neutral-300" />
        </div>
      </motion.div>

      <div className="px-6 mt-4 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['☕ Coffee nearby', '🥗 Healthy lunch', '🍷 After work', '🎶 Live music'].map((tag, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-3.5 py-2 bg-neutral-100 rounded-full text-[11px] font-medium text-neutral-600"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
