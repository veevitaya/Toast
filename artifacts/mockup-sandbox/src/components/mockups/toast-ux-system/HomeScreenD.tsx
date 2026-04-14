import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, ChevronRight, Sparkles, MapPin, ArrowRight, Link2, Copy, X } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };

function getTimeContext() {
  const h = new Date().getHours();
  if (h < 11) return { label: 'Right now', sub: 'morning', gradient: 'from-amber-100 via-orange-50 to-[#FAFAF8]' };
  if (h < 14) return { label: 'Right now', sub: 'lunchtime', gradient: 'from-sky-50 via-blue-50 to-[#FAFAF8]' };
  if (h < 17) return { label: 'Right now', sub: 'afternoon', gradient: 'from-amber-50 via-rose-50 to-[#FAFAF8]' };
  if (h < 21) return { label: 'Right now', sub: 'evening', gradient: 'from-violet-50 via-indigo-50 to-[#FAFAF8]' };
  return { label: 'Right now', sub: 'late night', gradient: 'from-slate-100 via-indigo-50 to-[#FAFAF8]' };
}

function getTimePeriod(): string {
  const h = new Date().getHours();
  if (h < 11) return 'morning';
  if (h < 14) return 'midday';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

const HERO_CARD = {
  id: 'hungry',
  emoji: '🍜',
  label: 'Hungry now',
  subs: { morning: 'Coffee, breakfast, brunch — we got you', midday: 'Lunch is calling — let\'s find your spot', afternoon: 'Snack time or early dinner?', evening: 'Dinner plans sorted in seconds', night: 'Late-night cravings? We know the spots' },
  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60',
};

const GRID_CARDS = [
  { id: 'fun', emoji: '🎯', label: 'Something fun', subs: { morning: 'Markets & cafes', midday: 'Break time', afternoon: 'Adventure', evening: 'Tonight\'s plan', night: 'Keep going' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', subs: { morning: 'Get outside', midday: 'Lunch spot', afternoon: 'Hit the town', evening: 'Where tonight?', night: 'One more?' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', subs: { morning: 'Brunch date', midday: 'Lunch à deux', afternoon: 'Sunset', evening: 'Romantic', night: 'Intimate' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', subs: { morning: 'Grab & go', midday: 'Fast lunch', afternoon: 'Quick pick', evening: '30 sec', night: 'Fastest' } },
];

export default function HomeScreenD() {
  const [tapped, setTapped] = useState<string | null>(null);
  const [showGroup, setShowGroup] = useState(false);
  const time = getTimeContext();
  const period = getTimePeriod();

  return (
    <div className={`w-[390px] min-h-[844px] bg-gradient-to-b ${time.gradient} overflow-hidden font-['Figtree',sans-serif] relative`}>
      <div className="h-[44px]" />

      <div className="px-6 flex items-center justify-between mt-2">
        <div>
          <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">{time.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGroup(true)}
            className="h-8 px-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200/50 flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600"
          >
            <Users size={12} />
            Group
          </motion.button>
          <motion.div whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-neutral-200/50">
            <User size={16} className="text-neutral-500" />
          </motion.div>
        </div>
      </div>

      <div className="px-6 mt-5">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[34px] font-extrabold text-neutral-900 leading-[1.05]"
        >
          What are we{'\n'}feeling?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="text-[14px] text-neutral-400 mt-2"
        >
          Tap your mood — we'll handle the rest
        </motion.p>
      </div>

      <div className="px-6 mt-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setTapped('hungry')}
          className="w-full rounded-3xl overflow-hidden relative h-[180px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)]"
        >
          <img src={HERO_CARD.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[24px]">{HERO_CARD.emoji}</span>
                  <span className="text-[11px] font-bold text-[#FFCC02] uppercase tracking-wider">Most popular now</span>
                </div>
                <p className="text-[22px] font-bold text-white">{HERO_CARD.label}</p>
                <p className="text-[13px] text-white/70 mt-0.5">{(HERO_CARD.subs as any)[period]}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(255,204,2,0.5)]">
                <ArrowRight size={20} className="text-neutral-900" />
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="px-6 mt-4 grid grid-cols-2 gap-3">
        {GRID_CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.15 + i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTapped(card.id)}
            className={`p-4 rounded-2xl text-left transition-all ${
              tapped === card.id
                ? 'bg-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.3)]'
                : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            }`}
          >
            <span className="text-[26px]">{card.emoji}</span>
            <p className="text-[14px] font-bold text-neutral-900 mt-2">{card.label}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">{(card.subs as any)[period]}</p>
          </motion.button>
        ))}
      </div>

      <div className="px-6 mt-5 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} className="text-[#FFCC02]" />
          <p className="text-[12px] font-semibold text-neutral-500">Quick for {time.sub}</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['☕ Coffee', '🥗 Healthy', '🍜 Street food', '🍷 Drinks', '🎶 Live music'].map((tag, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-3.5 py-2 bg-white rounded-full border border-neutral-100 text-[11px] font-semibold text-neutral-600 shadow-sm"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowGroup(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={spring}
              className="w-full bg-white rounded-t-3xl p-6 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold text-neutral-900">Planning with friends</h3>
                <button onClick={() => setShowGroup(false)}><X size={20} className="text-neutral-400" /></button>
              </div>
              <div className="flex flex-col gap-3">
                <motion.button whileTap={{ scale: 0.97 }} className="w-full h-14 bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]">
                  <Users size={16} /> Start a session
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} className="w-full h-14 bg-neutral-100 rounded-2xl flex items-center justify-center gap-2 font-semibold text-[15px] text-neutral-600">
                  <Link2 size={16} /> Join with code
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
