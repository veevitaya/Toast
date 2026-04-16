import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, MapPin, ArrowRight, Bell, Plus, Link2, RefreshCw, Star } from 'lucide-react';

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

const FRIENDS = [
  { name: 'Ploy', avatar: 'https://i.pravatar.cc/150?u=ploy' },
  { name: 'Beam', avatar: 'https://i.pravatar.cc/150?u=beam' },
  { name: 'Fern', avatar: 'https://i.pravatar.cc/150?u=fern' },
];

const HERO: Record<Period, { title: string; why: string; sub: string; image: string }> = {
  morning: { title: 'Coffee + Pastry Run', why: 'Easy place to begin', sub: 'Top-rated cafes near you', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60' },
  midday: { title: 'Quick Lunch Nearby', why: 'A good option for right now', sub: 'Highly rated · close to you', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60' },
  afternoon: { title: 'Chill Afternoon Spot', why: 'Perfect for right now', sub: 'Cafe & dessert combos', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60' },
  evening: { title: 'Dinner + Something After', why: 'We picked a combo for tonight', sub: 'Great dinner → drinks pairing', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60' },
  night: { title: 'Late Night Bites & Bars', why: 'Still open, worth the trip', sub: 'Best spots right now', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60' },
};

const ALT: Record<Period, { text: string; emoji: string }> = {
  morning: { text: 'Or something fun instead?', emoji: '🎯' },
  midday: { text: 'Or do something fun after?', emoji: '🎯' },
  afternoon: { text: 'Or start with food?', emoji: '🍜' },
  evening: { text: 'Or keep it easy?', emoji: '⚡' },
  night: { text: 'Or grab late bites?', emoji: '🍜' },
};

const MOODS: { id: string; emoji: string; label: string; sub: Record<Period, string> }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', sub: { morning: 'Let\'s find food first', midday: 'Let\'s find lunch', afternoon: 'Snack or dinner', evening: 'Find food first', night: 'Late bites' } },
  { id: 'fun', emoji: '🎯', label: 'Something fun', sub: { morning: 'Do something after or instead', midday: 'Break from routine', afternoon: 'Do something new', evening: 'Activities tonight', night: 'Keep going' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', sub: { morning: 'Worth stepping out for', midday: 'Get outside', afternoon: 'Find a spot', evening: 'Where tonight?', night: 'One more stop' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', sub: { morning: 'Something right together', midday: 'Lunch together', afternoon: 'Fits together', evening: 'Romantic evening', night: 'Intimate spot' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', sub: { morning: 'Low effort, good options fast', midday: 'No fuss', afternoon: 'Low effort', evening: '30 sec to decide', night: 'Fastest' } },
];

export default function HybridV2SocialPulse() {
  const [tapped, setTapped] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const time = getTimeCtx();
  const hero = HERO[time.period];
  const alt = ALT[time.period];

  useEffect(() => {
    const i = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative">
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
        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.9 }} className="relative w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <Bell size={14} className="text-neutral-500" />
            <motion.div
              animate={{ scale: pulse ? 1.2 : 1 }}
              className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FFCC02] rounded-full border-2 border-[#FAFAF8]"
            />
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <User size={14} className="text-neutral-500" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, ...spring }}
        className="px-6 mt-3"
      >
        <div className="bg-gradient-to-r from-[#FFCC02] to-amber-400 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute bottom-0 right-4 w-16 h-16 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1.5">
              <motion.div
                animate={{ scale: pulse ? 1.15 : 1 }}
                transition={{ duration: 0.4 }}
                className="w-2 h-2 rounded-full bg-green-600"
              />
              <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">Active session</span>
            </div>
            <p className="text-[16px] font-bold text-neutral-900">Ploy's group is deciding</p>
            <p className="text-[11px] text-neutral-700/70 mt-0.5">3 friends · picking dinner tonight</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex -space-x-2">
                {FRIENDS.map((f, i) => (
                  <img key={i} src={f.avatar} alt={f.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-400" />
                ))}
              </div>
              <div className="flex-1" />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="h-8 px-4 bg-neutral-900 rounded-xl flex items-center gap-1.5 text-[11px] font-bold text-white shadow-md"
              >
                Join now <ArrowRight size={11} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, ...spring }}
        className="px-6 mt-5"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles size={11} className="text-[#FFCC02]" />
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Start here</p>
        </div>
        <p className="text-[15px] font-bold text-neutral-900 mb-3">{hero.why}</p>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden text-left"
        >
          <div className="flex items-center gap-3.5 p-3.5">
            <img src={hero.image} alt="" className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-neutral-900">{hero.title}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{hero.sub}</p>
              <div className="flex items-center gap-2 mt-2">
                <motion.span
                  whileTap={{ scale: 0.96 }}
                  className="text-[11px] font-bold text-[#FFCC02] bg-amber-50 px-2.5 py-1 rounded-full"
                >
                  Let's do this →
                </motion.span>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <RefreshCw size={9} /> Change
                </span>
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.26, ...spring }}
        className="px-6 mt-3"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 py-2.5 px-3.5 bg-neutral-50 rounded-xl border border-neutral-100"
        >
          <span className="text-[16px]">{alt.emoji}</span>
          <p className="flex-1 text-[12px] font-semibold text-neutral-600 text-left">{alt.text}</p>
          <ArrowRight size={13} className="text-neutral-300" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.34 }}
        className="px-6 mt-5"
      >
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">Or pick a vibe</p>
        <div className="grid grid-cols-3 gap-2">
          {MOODS.slice(0, 3).map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 + i * 0.04, ...spring }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTapped(m.id)}
              className={`p-2.5 rounded-xl text-left transition-colors ${
                tapped === m.id ? 'bg-[#FFCC02] shadow-[0_3px_12px_-2px_rgba(255,204,2,0.3)]' : 'bg-white border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[18px] block">{m.emoji}</span>
              <p className="text-[10px] font-bold text-neutral-900 mt-1 leading-tight">{m.label}</p>
            </motion.button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {MOODS.slice(3).map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.04, ...spring }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTapped(m.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors ${
                tapped === m.id ? 'bg-[#FFCC02] shadow-[0_3px_12px_-2px_rgba(255,204,2,0.3)]' : 'bg-white border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[16px]">{m.emoji}</span>
              <p className="text-[10px] font-bold text-neutral-900">{m.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.56 }}
        className="px-6 mt-4"
      >
        <div className="flex gap-2.5">
          <button className="flex-1 flex items-center gap-2 p-3 bg-white rounded-xl border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="w-7 h-7 rounded-full bg-[#FFCC02]/15 flex items-center justify-center">
              <Plus size={12} className="text-[#FFCC02]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-neutral-800">New session</p>
              <p className="text-[8px] text-neutral-400">Invite friends</p>
            </div>
          </button>
          <button className="flex-1 flex items-center gap-2 p-3 bg-white rounded-xl border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center">
              <Link2 size={12} className="text-indigo-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-neutral-800">Join with code</p>
              <p className="text-[8px] text-neutral-400">From LINE chat</p>
            </div>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-6 mt-3.5 pb-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['☕ Coffee', '🍜 Street food', '🍷 Drinks', '🎶 Live'].map((tag, i) => (
            <button key={i} className="flex-shrink-0 px-3 py-1.5 bg-neutral-100 rounded-full text-[10px] font-medium text-neutral-500">
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 pb-2.5 pt-1">
        <p className="text-center text-[9px] text-neutral-300 font-medium tracking-wider uppercase">Toast Hybrid v2 · Social Pulse</p>
      </div>
    </div>
  );
}
