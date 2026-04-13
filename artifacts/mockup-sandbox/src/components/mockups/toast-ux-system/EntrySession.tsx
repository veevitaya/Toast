import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils, Sparkles, Moon, Heart, Zap, Users, User, Link2,
  ChevronRight, X, Copy, Check, ArrowRight
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };

const INTENTS = [
  { id: 'hungry', emoji: '🍜', icon: Utensils, label: 'Hungry now', sub: 'Find food fast', color: 'from-amber-400 to-[#FFCC02]', shadow: 'rgba(255,204,2,0.25)' },
  { id: 'fun', emoji: '🎯', icon: Sparkles, label: 'Something fun', sub: 'Activities & spots', color: 'from-violet-400 to-purple-500', shadow: 'rgba(139,92,246,0.25)' },
  { id: 'night', emoji: '🌙', icon: Moon, label: 'Night out', sub: 'Full evening plan', color: 'from-indigo-400 to-blue-500', shadow: 'rgba(99,102,241,0.25)' },
  { id: 'date', emoji: '💕', icon: Heart, label: 'Date vibe', sub: 'Romantic & intimate', color: 'from-rose-400 to-pink-500', shadow: 'rgba(244,63,94,0.25)' },
  { id: 'quick', emoji: '⚡', icon: Zap, label: 'Quick & easy', sub: 'Decide in 30 sec', color: 'from-orange-400 to-amber-500', shadow: 'rgba(251,146,60,0.25)' },
];

const FRIENDS = [
  { id: '1', name: 'Natt', avatar: '👩' },
  { id: '2', name: 'Krit', avatar: '👨' },
  { id: '3', name: 'Pim', avatar: '👧' },
];

export default function EntrySession() {
  const [mode, setMode] = useState<'solo' | 'friends'>('solo');
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [showJoinOverlay, setShowJoinOverlay] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [tappedIntent, setTappedIntent] = useState<string | null>(null);

  const handleIntentTap = useCallback((id: string) => {
    setTappedIntent(id);
    setSelectedIntent(id);
    setTimeout(() => setTappedIntent(null), 300);
  }, []);

  const handleCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Late night?';
  };

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] font-['Figtree',sans-serif] relative overflow-hidden">
      <div className="px-6 pt-14 pb-4">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[13px] font-medium text-neutral-400 tracking-wide uppercase"
        >
          {getTimeGreeting()}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-[28px] font-bold text-neutral-900 mt-1 leading-tight"
        >
          What are we feeling?
        </motion.h1>
      </div>

      <div className="px-6 mt-2">
        <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
          {[
            { key: 'solo' as const, icon: User, label: 'Solo' },
            { key: 'friends' as const, icon: Users, label: 'With friends' },
          ].map((m) => (
            <motion.button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-semibold transition-colors ${
                mode === m.key ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <m.icon size={16} />
              {m.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'friends' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mt-4 overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-semibold text-neutral-600">Session</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJoinOverlay(true)}
                  className="flex items-center gap-1 text-[12px] font-medium text-[#FFCC02]"
                >
                  <Link2 size={12} />
                  Join existing
                </motion.button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {FRIENDS.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...bouncy, delay: i * 0.08 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[18px] ring-2 ring-white">
                      {f.avatar}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1">{f.name}</p>
                  </motion.div>
                ))}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full border-2 border-dashed border-neutral-200 flex items-center justify-center"
                >
                  <Users size={14} className="text-neutral-400" />
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-50 rounded-xl text-[13px] font-medium text-neutral-600"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? 'Link copied!' : 'Share invite via LINE'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 mt-6 flex flex-col gap-3">
        {INTENTS.map((intent, i) => (
          <motion.button
            key={intent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleIntentTap(intent.id)}
            className={`relative w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              selectedIntent === intent.id
                ? 'bg-white border-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.2)]'
                : 'bg-white border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${intent.color} flex items-center justify-center shadow-[0_4px_12px_-2px_${intent.shadow}]`}>
              <span className="text-[22px]">{intent.emoji}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] font-semibold text-neutral-900">{intent.label}</p>
              <p className="text-[12px] text-neutral-500 mt-0.5">{intent.sub}</p>
            </div>
            <motion.div
              animate={{ x: tappedIntent === intent.id ? 4 : 0 }}
              transition={bouncy}
            >
              <ChevronRight size={18} className="text-neutral-300" />
            </motion.div>

            {selectedIntent === intent.id && (
              <motion.div
                layoutId="intent-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFCC02] rounded-r-full"
                transition={spring}
              />
            )}
          </motion.button>
        ))}
      </div>

      {selectedIntent && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={bouncy}
          className="px-6 mt-6 pb-10"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
          >
            <span className="text-[16px] font-bold text-neutral-900">Let's go</span>
            <ArrowRight size={18} className="text-neutral-900" />
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {showJoinOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowJoinOverlay(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={spring}
              className="w-full bg-white rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-neutral-900">Join session</h3>
                <button onClick={() => setShowJoinOverlay(false)}>
                  <X size={20} className="text-neutral-400" />
                </button>
              </div>
              <p className="text-[14px] text-neutral-500 mb-4">Enter the session code from your friend</p>
              <div className="flex gap-2">
                <input
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  placeholder="TOAST-XXXX"
                  className="flex-1 h-12 bg-neutral-50 rounded-xl px-4 text-[16px] font-mono font-semibold text-neutral-900 border border-neutral-200 outline-none focus:border-[#FFCC02] transition-colors"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="h-12 px-5 bg-[#FFCC02] rounded-xl font-bold text-neutral-900"
                >
                  Join
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
