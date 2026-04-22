import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, MapPin, Star, Check } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const HERO = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80';

export default function AirbnbLocking() {
  const [progress, setProgress] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 4;
      if (p >= 100) { setProgress(100); setLocked(true); clearInterval(id); }
      else setProgress(p);
    }, 80);
    return () => clearInterval(id);
  }, []);

  const C = 2 * Math.PI * 32;

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="airbnb-flow-locking">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white/95 backdrop-blur border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <p className="text-[12px] font-bold text-neutral-900">Saving to your night</p>
        <div className="w-9 h-9" />
      </div>

      {/* Hero with overlay heart-lock */}
      <div className="px-5 mt-5">
        <div className="relative h-[420px] rounded-[24px] overflow-hidden bg-neutral-100">
          <motion.img
            src={HERO}
            alt="Vertigo Bar"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.12 }}
            animate={{ scale: locked ? 1.0 : 1.04 }}
            transition={{ duration: 4, ease: 'easeOut' }}
          />
          <motion.div className="absolute inset-0" animate={{ background: locked ? 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1) 50%, transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)' }} />

          {/* Center heart with progress ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <svg width="92" height="92" className="-rotate-90">
                <circle cx="46" cy="46" r="32" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                <motion.circle
                  cx="46" cy="46" r="32" fill="none" stroke="#FFCC02" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={C}
                  animate={{ strokeDashoffset: C - (C * progress) / 100 }}
                  transition={{ duration: 0.08 }}
                />
              </svg>
              <motion.div
                animate={{ scale: locked ? [1, 1.25, 1] : 1 + progress / 400 }}
                transition={locked ? { duration: 0.5 } : { duration: 0.08 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${locked ? 'bg-[#FF385C]' : 'bg-white/20'}`}>
                  <Heart size={26} className={locked ? 'text-white fill-white' : 'text-white'} strokeWidth={2.5} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Caption */}
          <div className="absolute left-5 bottom-5 right-5 text-white">
            <AnimatePresence mode="wait">
              {locked ? (
                <motion.div key="locked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFCC02]">Saved · 9:15 PM</p>
                  <p className="text-[22px] font-bold leading-[1.12] mt-1">Vertigo · 60F</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[12px] opacity-90">
                    <Star size={11} className="text-white fill-white" /> 4.92
                    <span className="opacity-60">·</span>
                    <MapPin size={11} /> Banyan Tree
                  </div>
                </motion.div>
              ) : (
                <motion.div key="holding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">Press and hold</p>
                  <p className="text-[20px] font-bold leading-[1.15] mt-1">Lock Vertigo into<br/>your Thursday night</p>
                  <p className="text-[11px] opacity-80 mt-1.5">{progress}% · keep holding</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Saved chip pop */}
          <AnimatePresence>
            {locked && (
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={spring}
                className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.25)]"
              >
                <Check size={12} className="text-emerald-500" strokeWidth={3} />
                <span className="text-[11px] font-bold text-neutral-900">Saved to your night</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Already saved list */}
      <div className="px-5 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-2.5">Already in your night</p>
        <div className="space-y-2">
          {[
            { label: 'Dinner', name: 'Som Tam Nua', time: '7:30 PM', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&auto=format&fit=crop&q=80' },
            { label: 'Drinks', name: 'Vertigo · 60F', time: '9:15 PM', img: HERO, just: locked },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.05 * i + (s.just ? 0.4 : 0) }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-neutral-50"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-200">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label} · {s.time}</p>
                <p className="text-[13px] font-bold text-neutral-900 truncate">{s.name}</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            </motion.div>
          ))}
        </div>

        {locked && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.6 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full h-[50px] rounded-2xl bg-gradient-to-b from-[#FFCC02] to-[#F5B800] text-neutral-900 font-bold text-[14px] shadow-[0_8px_24px_-6px_rgba(255,204,2,0.6)]"
            data-testid="button-next-stop"
          >
            Pick your next stop →
          </motion.button>
        )}
      </div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Airbnb DNA · Locking</p>
    </div>
  );
}
