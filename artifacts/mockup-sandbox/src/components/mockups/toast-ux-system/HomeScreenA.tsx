import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Utensils, Sparkles, MapPin, Heart, Zap, Users, ChevronRight, Clock, Coffee, Moon, Sun, Sunset } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };

function getTimeContext() {
  const h = new Date().getHours();
  if (h < 11) return { greeting: 'This morning', sub: 'Start your day right', icon: Coffee, tone: 'warm' };
  if (h < 14) return { greeting: 'Lunch time', sub: 'What sounds good?', icon: Sun, tone: 'bright' };
  if (h < 17) return { greeting: 'This afternoon', sub: 'Something to look forward to', icon: Sunset, tone: 'golden' };
  if (h < 21) return { greeting: 'Tonight', sub: 'Make it a good one', icon: Moon, tone: 'deep' };
  return { greeting: 'Late night', sub: 'Still going?', icon: Moon, tone: 'dark' };
}

const CARDS = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', subs: { morning: 'Coffee or breakfast?', midday: 'Lunch time?', afternoon: 'Snack or early dinner?', evening: 'What sounds good?', night: 'Late-night cravings?' }, gradient: 'from-amber-400 to-[#FFCC02]', shadow: 'rgba(255,204,2,0.3)' },
  { id: 'fun', emoji: '🎯', label: 'Something fun', subs: { morning: 'Markets & cafes', midday: 'Break from routine', afternoon: 'Adventure time', evening: 'Activities tonight', night: 'Still going?' }, gradient: 'from-violet-400 to-purple-500', shadow: 'rgba(139,92,246,0.3)' },
  { id: 'goout', emoji: '🌃', label: 'Go out', subs: { morning: 'Explore the city', midday: 'Get out for lunch', afternoon: 'Find a spot', evening: 'Where to tonight?', night: 'One more stop?' }, gradient: 'from-indigo-400 to-blue-500', shadow: 'rgba(99,102,241,0.3)' },
  { id: 'date', emoji: '💕', label: 'Date vibe', subs: { morning: 'Brunch date?', midday: 'Lunch together', afternoon: 'Sunset plans', evening: 'Romantic evening', night: 'Intimate spot' }, gradient: 'from-rose-400 to-pink-500', shadow: 'rgba(244,63,94,0.3)' },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', subs: { morning: 'Grab & go', midday: 'No fuss lunch', afternoon: 'Something fast', evening: 'Decide in 30 sec', night: 'Fastest option' }, gradient: 'from-orange-400 to-amber-500', shadow: 'rgba(251,146,60,0.3)' },
];

function getTimePeriod(): string {
  const h = new Date().getHours();
  if (h < 11) return 'morning';
  if (h < 14) return 'midday';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

export default function HomeScreenA() {
  const [tapped, setTapped] = useState<string | null>(null);
  const time = getTimeContext();
  const period = getTimePeriod();

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
      <div className="h-[44px]" />

      <div className="px-6 flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <time.icon size={14} className="text-neutral-400" />
          <span className="text-[13px] font-medium text-neutral-400">{time.greeting}</span>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <User size={16} className="text-neutral-500" />
        </motion.div>
      </div>

      <div className="px-6 mt-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[32px] font-extrabold text-neutral-900 leading-[1.1]"
        >
          What are we{'\n'}feeling?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-[15px] text-neutral-400 mt-2 font-medium"
        >
          We'll figure it out together
        </motion.p>
      </div>

      <div className="px-6 mt-7 flex flex-col gap-3">
        {CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTapped(card.id)}
            className={`relative w-full flex items-center gap-4 p-4 rounded-2xl bg-white border transition-all ${
              tapped === card.id ? 'border-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.2)]' : 'border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-[0_4px_12px_-2px_${card.shadow}]`}>
              <span className="text-[26px]">{card.emoji}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[16px] font-bold text-neutral-900">{card.label}</p>
              <p className="text-[12px] text-neutral-500 mt-0.5">{(card.subs as any)[period]}</p>
            </div>
            <ChevronRight size={18} className="text-neutral-300" />
          </motion.button>
        ))}
      </div>

      <div className="px-6 mt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-100"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFCC02]/20 flex items-center justify-center">
            <Users size={16} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-neutral-800">Planning with friends?</p>
            <p className="text-[11px] text-neutral-500">Start a group session</p>
          </div>
          <ChevronRight size={16} className="text-amber-400" />
        </motion.div>
      </div>

      <div className="px-6 mt-4 pb-8">
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Quick ideas</p>
        <div className="flex gap-2">
          {['☕ Coffee nearby', '🍜 Lunch spots', '🍷 Happy hour'].map((idea, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 bg-white rounded-xl border border-neutral-100 text-[11px] font-medium text-neutral-600 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {idea}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
