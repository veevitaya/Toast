import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Users, Sparkles, MapPin, ArrowRight, Star, MessageCircle, Link2, Bell, Zap, Plus } from 'lucide-react';

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

const HERO_SUGGESTIONS: Record<Period, { title: string; sub: string; image: string }> = {
  morning: { title: 'Morning coffee run?', sub: 'Popular cafes open near you', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60' },
  midday: { title: 'Quick lunch plan', sub: 'Great spots within walking distance', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60' },
  afternoon: { title: 'Chill afternoon pick', sub: 'Cafes & desserts near you', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60' },
  evening: { title: 'Dinner + drinks combo', sub: 'Great pairings nearby tonight', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60' },
  night: { title: 'Late night spots', sub: 'Open now and trending', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60' },
};

const FRIENDS = [
  { name: 'Ploy', avatar: 'https://i.pravatar.cc/150?u=ploy' },
  { name: 'Beam', avatar: 'https://i.pravatar.cc/150?u=beam' },
  { name: 'Fern', avatar: 'https://i.pravatar.cc/150?u=fern' },
];

const MOOD_CARDS: { id: string; emoji: string; label: string; sub: Record<Period, string> }[] = [
  { id: 'hungry', emoji: '🍜', label: 'Hungry now', sub: { morning: 'Coffee or breakfast?', midday: 'Let\'s find lunch', afternoon: 'Snack break', evening: 'Find food first', night: 'Late bites' } },
  { id: 'fun', emoji: '🎯', label: 'Something fun', sub: { morning: 'Markets & cafes', midday: 'Break time', afternoon: 'Do something new', evening: 'Tonight\'s plan', night: 'Keep going' } },
  { id: 'goout', emoji: '🌃', label: 'Go out', sub: { morning: 'Explore today', midday: 'Get out', afternoon: 'Worth stepping out', evening: 'Where tonight?', night: 'One more stop' } },
  { id: 'date', emoji: '💕', label: 'Date vibe', sub: { morning: 'Brunch date', midday: 'Lunch together', afternoon: 'Fits together', evening: 'Romantic night', night: 'Intimate spot' } },
  { id: 'quick', emoji: '⚡', label: 'Quick & easy', sub: { morning: 'Grab & go', midday: 'Fast lunch', afternoon: 'Low effort', evening: '30 seconds', night: 'Fastest' } },
];

export default function HybridSocialPulse() {
  const [tapped, setTapped] = useState<string | null>(null);
  const [sessionPulse, setSessionPulse] = useState(false);
  const time = getTimeCtx();
  const hero = HERO_SUGGESTIONS[time.period];

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
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
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FFCC02] rounded-full border-2 border-[#FAFAF8]" />
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <User size={14} className="text-neutral-500" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.08 }}
        className="px-6 mt-4"
      >
        <div className="bg-gradient-to-r from-[#FFCC02] to-amber-400 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ scale: sessionPulse ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
                className="w-2 h-2 rounded-full bg-green-600"
              />
              <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">Active Session</span>
            </div>
            <p className="text-[16px] font-bold text-neutral-900">Ploy's group is deciding</p>
            <p className="text-[12px] text-neutral-700/70 mt-0.5">3 friends · picking dinner tonight</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                {FRIENDS.map((f, i) => (
                  <img key={i} src={f.avatar} alt={f.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-[#FFCC02]" />
                ))}
              </div>
              <div className="flex-1" />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="h-9 px-4 bg-neutral-900 rounded-xl flex items-center gap-1.5 text-[12px] font-bold text-white shadow-md"
              >
                Join now <ArrowRight size={12} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.18 }}
        className="px-6 mt-5"
      >
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles size={10} className="text-[#FFCC02]" /> Suggested for you
        </p>
        <button className="w-full bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden text-left">
          <div className="flex items-center gap-3 p-3">
            <img src={hero.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-neutral-900">{hero.title}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{hero.sub}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FFCC02] flex items-center justify-center flex-shrink-0">
              <ArrowRight size={13} className="text-neutral-900" />
            </div>
          </div>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="px-6 mt-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[14px] font-bold text-neutral-900">What are we feeling?</p>
            <p className="text-[11px] text-neutral-400">We'll figure it out together</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {MOOD_CARDS.slice(0, 4).map((card, i) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.32 + i * 0.04 }}
              whileTap={{ scale: 0.95, y: 2 }}
              onClick={() => setTapped(card.id)}
              className={`p-3.5 rounded-2xl text-left transition-colors ${
                tapped === card.id
                  ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.3)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[24px] block">{card.emoji}</span>
              <p className="text-[14px] font-bold text-neutral-900 mt-1.5">{card.label}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{card.sub[time.period]}</p>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.48 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setTapped('quick')}
          className={`w-full mt-2.5 flex items-center gap-3 p-3.5 rounded-2xl transition-colors ${
            tapped === 'quick'
              ? 'bg-[#FFCC02] shadow-[0_4px_16px_-2px_rgba(255,204,2,0.3)]'
              : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          }`}
        >
          <span className="text-[22px]">⚡</span>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-bold text-neutral-900">Quick & easy</p>
            <p className="text-[10px] text-neutral-400">{MOOD_CARDS[4].sub[time.period]}</p>
          </div>
          <ArrowRight size={14} className="text-neutral-300" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="px-6 mt-5"
      >
        <div className="flex gap-2.5">
          <button className="flex-1 flex items-center gap-2 p-3 bg-white rounded-xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="w-8 h-8 rounded-full bg-[#FFCC02]/15 flex items-center justify-center">
              <Plus size={13} className="text-[#FFCC02]" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-neutral-800">New session</p>
              <p className="text-[9px] text-neutral-400">Invite friends</p>
            </div>
          </button>
          <button className="flex-1 flex items-center gap-2 p-3 bg-white rounded-xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <Link2 size={13} className="text-indigo-500" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-neutral-800">Join with code</p>
              <p className="text-[9px] text-neutral-400">From LINE chat</p>
            </div>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-6 mt-4 pb-8"
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['☕ Coffee', '🍜 Street food', '🍷 Drinks', '🎶 Live music', '🎲 Games'].map((tag, i) => (
            <button key={i} className="flex-shrink-0 px-3 py-1.5 bg-neutral-100 rounded-full text-[11px] font-medium text-neutral-500">
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-3 pt-1">
        <p className="text-center text-[9px] text-neutral-300 font-medium tracking-wider uppercase">Toast Hybrid · Social Pulse</p>
      </div>
    </div>
  );
}
