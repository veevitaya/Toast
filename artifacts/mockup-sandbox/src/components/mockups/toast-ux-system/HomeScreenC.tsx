import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, ChevronRight, Sparkles, MapPin, ArrowRight, Clock } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };

function getTimeContext() {
  const h = new Date().getHours();
  if (h < 11) return { label: 'This morning', hero: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60' };
  if (h < 14) return { label: 'Lunch time', hero: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60' };
  if (h < 17) return { label: 'This afternoon', hero: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60' };
  if (h < 21) return { label: 'Tonight', hero: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60' };
  return { label: 'Late night', hero: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60' };
}

function getTimePeriod(): string {
  const h = new Date().getHours();
  if (h < 11) return 'morning';
  if (h < 14) return 'midday';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

const INTENTS = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', subs: { morning: 'Coffee or breakfast?', midday: 'Lunch time?', afternoon: 'Snack break', evening: 'Dinner plans?', night: 'Late bites' } },
  { id: 'fun', emoji: '🎯', label: 'Something fun', subs: { morning: 'Start exploring', midday: 'Break time', afternoon: 'Adventure', evening: 'Go do things', night: 'Keep going' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', subs: { morning: 'Get outside', midday: 'Grab lunch out', afternoon: 'Hit the town', evening: 'Where tonight?', night: 'One more?' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', subs: { morning: 'Brunch date', midday: 'Lunch à deux', afternoon: 'Sunset spot', evening: 'Romantic night', night: 'Intimate bar' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', subs: { morning: 'Grab & go', midday: 'Fast lunch', afternoon: 'Quick pick', evening: '30 sec decide', night: 'Fastest option' } },
];

export default function HomeScreenC() {
  const [selected, setSelected] = useState<string | null>(null);
  const time = getTimeContext();
  const period = getTimePeriod();

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
      <div className="relative h-[320px]">
        <img src={time.hero} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#FAFAF8]" />

        <div className="absolute top-[44px] left-0 right-0 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-white/80">{time.label}</span>
              <span className="text-white/30">·</span>
              <span className="text-[12px] text-white/60 flex items-center gap-1"><MapPin size={10} /> Bangkok</span>
            </div>
            <motion.div whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User size={16} className="text-white" />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[34px] font-extrabold text-neutral-900 leading-[1.05]"
          >
            What are we{'\n'}feeling?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-neutral-500 mt-1.5"
          >
            We'll figure it out together
          </motion.p>
        </div>
      </div>

      <div className="px-6 -mt-1">
        <div className="grid grid-cols-2 gap-3">
          {INTENTS.slice(0, 4).map((intent, i) => (
            <motion.button
              key={intent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(intent.id)}
              className={`relative p-4 rounded-2xl text-left transition-all ${
                selected === intent.id
                  ? 'bg-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[28px]">{intent.emoji}</span>
              <p className={`text-[15px] font-bold mt-2 ${selected === intent.id ? 'text-neutral-900' : 'text-neutral-900'}`}>
                {intent.label}
              </p>
              <p className={`text-[11px] mt-0.5 ${selected === intent.id ? 'text-neutral-700' : 'text-neutral-500'}`}>
                {(intent.subs as any)[period]}
              </p>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.28 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelected('quick')}
          className={`w-full mt-3 flex items-center gap-4 p-4 rounded-2xl transition-all ${
            selected === 'quick'
              ? 'bg-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]'
              : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          }`}
        >
          <span className="text-[28px]">⚡</span>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-bold text-neutral-900">Quick & easy</p>
            <p className="text-[11px] text-neutral-500">{INTENTS[4].subs[period as keyof typeof INTENTS[4]['subs']]}</p>
          </div>
          <ArrowRight size={18} className="text-neutral-300" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="px-6 mt-5"
      >
        <div className="bg-neutral-900 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
            <Users size={16} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white">With friends?</p>
            <p className="text-[11px] text-white/50">Start or join a session</p>
          </div>
          <ChevronRight size={16} className="text-white/40" />
        </div>
      </motion.div>

      <div className="px-6 mt-4 pb-8">
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">Quick for now</p>
        <div className="flex gap-2 flex-wrap">
          {['☕ Coffee', '🥡 Takeout', '🍰 Dessert', '🍺 Drinks'].map((tag, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 + i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              className="px-3.5 py-2 bg-white rounded-xl border border-neutral-100 text-[12px] font-medium text-neutral-600"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
