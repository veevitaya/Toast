import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, ChevronRight, Sparkles, ArrowRight, Clock, TrendingUp } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };

function getTimeContext() {
  const h = new Date().getHours();
  if (h < 11) return { label: 'Good morning', period: 'morning' };
  if (h < 14) return { label: 'Lunch time', period: 'midday' };
  if (h < 17) return { label: 'Good afternoon', period: 'afternoon' };
  if (h < 21) return { label: 'Good evening', period: 'evening' };
  return { label: 'Late night', period: 'night' };
}

const INTENTS = [
  {
    id: 'hungry', emoji: '🍜', label: 'Hungry now',
    subs: { morning: 'Breakfast & coffee', midday: 'Find lunch', afternoon: 'Snack or dinner', evening: 'Dinner tonight', night: 'Late bites' },
    color: '#FFCC02', bg: 'bg-amber-50',
  },
  {
    id: 'fun', emoji: '🎯', label: 'Something fun',
    subs: { morning: 'Morning plans', midday: 'Break from routine', afternoon: 'Things to do', evening: 'Fun tonight', night: 'Keep going' },
    color: '#8b5cf6', bg: 'bg-violet-50',
  },
  {
    id: 'goout', emoji: '🌃', label: 'Go out',
    subs: { morning: 'Explore today', midday: 'Get out', afternoon: 'Find a spot', evening: 'Where tonight?', night: 'One more spot' },
    color: '#6366f1', bg: 'bg-indigo-50',
  },
  {
    id: 'date', emoji: '💕', label: 'Date vibe',
    subs: { morning: 'Brunch date', midday: 'Lunch for two', afternoon: 'Romantic spot', evening: 'Date night', night: 'Intimate' },
    color: '#f43f5e', bg: 'bg-rose-50',
  },
  {
    id: 'quick', emoji: '⚡', label: 'Quick & easy',
    subs: { morning: 'Grab & go', midday: 'Fast lunch', afternoon: 'Quick pick', evening: '30 seconds', night: 'Fastest' },
    color: '#f97316', bg: 'bg-orange-50',
  },
];

const TRENDING = [
  { title: 'Jay Fai', type: 'Thai · Street Food', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=200&auto=format&fit=crop&q=60', tag: 'Trending' },
  { title: 'Octave Rooftop', type: 'Sky Bar', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=60', tag: 'Popular' },
  { title: 'Escape BKK', type: 'Activity', image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=200&auto=format&fit=crop&q=60', tag: 'New' },
];

export default function HomeScreenE() {
  const [selected, setSelected] = useState<string | null>(null);
  const time = getTimeContext();
  const period = time.period;

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
      <div className="h-[44px]" />

      <div className="px-6 flex items-center justify-between mt-2">
        <div>
          <p className="text-[13px] text-neutral-400 font-medium">{time.label}</p>
          <h1 className="text-[28px] font-extrabold text-neutral-900 leading-tight mt-0.5">
            What are we feeling?
          </h1>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
          <User size={16} className="text-neutral-500" />
        </motion.div>
      </div>

      <div className="px-6 mt-1 mb-5">
        <p className="text-[14px] text-neutral-400">Tap your mood · we'll handle the rest</p>
      </div>

      <div className="px-6">
        <div className="flex flex-col gap-0">
          {INTENTS.map((intent, i) => (
            <motion.button
              key={intent.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(intent.id)}
              className={`w-full flex items-center gap-4 py-4 border-b border-neutral-100 last:border-b-0 transition-all ${
                selected === intent.id ? 'bg-amber-50 -mx-4 px-4 rounded-2xl border-transparent' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl ${intent.bg} flex items-center justify-center`}>
                <span className="text-[24px]">{intent.emoji}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[16px] font-bold text-neutral-900">{intent.label}</p>
                <p className="text-[12px] text-neutral-500">{(intent.subs as any)[period]}</p>
              </div>
              <motion.div animate={{ x: selected === intent.id ? 4 : 0 }}>
                <ArrowRight size={16} className={selected === intent.id ? 'text-[#FFCC02]' : 'text-neutral-300'} />
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-5">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 p-4 bg-[#FFCC02]/10 rounded-2xl border border-[#FFCC02]/20"
        >
          <div className="w-10 h-10 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
            <Users size={16} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-bold text-neutral-900">With friends?</p>
            <p className="text-[11px] text-neutral-500">Start a group session</p>
          </div>
          <ChevronRight size={16} className="text-[#FFCC02]" />
        </motion.button>
      </div>

      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-neutral-400" />
            <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Trending now</p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {TRENDING.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 w-[140px] bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <div className="relative h-[80px]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded-full">
                  <span className="text-[9px] font-bold text-white">{item.tag}</span>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[12px] font-bold text-neutral-900">{item.title}</p>
                <p className="text-[10px] text-neutral-500">{item.type}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
