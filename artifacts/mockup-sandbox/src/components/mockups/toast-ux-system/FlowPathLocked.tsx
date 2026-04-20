import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Utensils, Wine, Cake, Mountain, Lock, MoreHorizontal, Check } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 280, damping: 26 };

const NODES = [
  { id: 'food',    label: 'Dinner',  sub: 'Som Tam Nua',     Icon: Utensils, x: 30,  y: 150, state: 'locked' },
  { id: 'drinks',  label: 'Drinks',  sub: 'Rooftop · 60th',  Icon: Wine,     x: 130, y: 90,  state: 'locking' },
  { id: 'dessert', label: 'Dessert', sub: 'After You',       Icon: Cake,     x: 230, y: 160, state: 'locked' },
  { id: 'walk',    label: 'Walk',    sub: 'Lumphini',        Icon: Mountain, x: 330, y: 80,  state: 'active' },
] as const;

export default function FlowPathLocked() {
  const [progress, setProgress] = useState(0);

  // Animated long-hold progress ring
  useEffect(() => {
    const t = setTimeout(() => setProgress(72), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] overflow-hidden font-['Figtree',sans-serif] relative bg-gradient-to-br from-amber-100/40 via-transparent to-violet-100/30" style={{ backgroundColor: '#FAFAF8' }} data-testid="flow-path-locked">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <ChevronLeft size={16} className="text-neutral-700" />
        </button>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 shadow-[0_4px_16px_-2px_rgba(255,204,2,0.3)]">
          <Lock size={11} className="text-[#FFCC02]" />
          <span className="text-[11px] font-bold text-white">Locking…</span>
        </motion.div>
        <button aria-label="More options" data-testid="button-more" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <MoreHorizontal size={16} className="text-neutral-700" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...spring }} className="px-6 mt-7">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Hold to lock</p>
        <h1 className="text-[26px] font-extrabold text-neutral-900 leading-[1.15] mt-1.5">
          Lock this moment<br />into your night
        </h1>
        <p className="text-[13px] text-neutral-500 mt-2">Hold a stop until the ring fills · 2 already locked</p>
      </motion.div>

      {/* PATH with locking node */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative mt-7 mx-2 h-[240px]">
        <svg width="370" height="240" viewBox="0 0 370 240" className="block">
          <defs>
            <linearGradient id="lock-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCC02" />
              <stop offset="100%" stopColor="#FB923C" stopOpacity="0.85" />
            </linearGradient>
            <filter id="lock-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <path d="M30 150 Q80 90 130 90 Q180 90 230 160 Q280 200 330 80" fill="none" stroke="url(#lock-grad)" strokeWidth="16" strokeLinecap="round" opacity="0.22" filter="url(#lock-glow)" />
          <path d="M30 150 Q80 90 130 90 Q180 90 230 160 Q280 200 330 80" fill="none" stroke="url(#lock-grad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {NODES.map((n, i) => {
          const isLocked = n.state === 'locked';
          const isLocking = n.state === 'locking';
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, ...spring }}
              className="absolute"
              style={{ left: n.x - 32, top: n.y - 32 }}
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Progress ring for locking state */}
                {isLocking && (
                  <>
                    {/* Pulsing aura */}
                    <motion.div
                      animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0.2, 0.6] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-[#FFCC02]"
                    />
                    <svg className="absolute inset-0 -rotate-90" width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="29" fill="none" stroke="rgba(255,204,2,0.18)" strokeWidth="3" />
                      <motion.circle
                        cx="32" cy="32" r="29" fill="none"
                        stroke="#FFCC02" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 29}
                        initial={{ strokeDashoffset: 2 * Math.PI * 29 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 29 * (1 - progress / 100) }}
                        transition={{ duration: 1.6, ease: 'easeInOut' }}
                      />
                    </svg>
                  </>
                )}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center relative ${
                    isLocked ? 'bg-[#FFCC02]' :
                    isLocking ? 'bg-white' :
                    'bg-white shadow-[0_4px_18px_-2px_rgba(0,0,0,0.12)]'
                  }`}
                  style={isLocked ? { boxShadow: '0 0 26px -2px rgba(255,204,2,0.6), 0 4px 18px -2px rgba(0,0,0,0.1)' } : isLocking ? { boxShadow: '0 0 30px -4px rgba(255,204,2,0.7)' } : undefined}
                >
                  <n.Icon size={20} className={isLocked ? 'text-neutral-900' : isLocking ? 'text-[#FB923C]' : 'text-neutral-700'} />
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                      <Check size={10} className="text-[#FFCC02]" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center mt-1.5 w-20 -ml-2">
                <p className="text-[11px] font-bold text-neutral-900">{n.label}</p>
                <p className="text-[9px] text-neutral-500 truncate">{n.sub}</p>
                {isLocking && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[8px] font-bold text-[#FB923C] uppercase tracking-wider mt-0.5">
                    {progress}%
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Toast / status bubble */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, ...spring }} className="px-5 mt-2">
        <div className="bg-white rounded-2xl border border-amber-100 shadow-[0_4px_20px_-4px_rgba(255,204,2,0.25)] p-3.5 flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="w-9 h-9 rounded-full bg-[#FFCC02]/15 flex items-center justify-center">
            <Lock size={14} className="text-[#FB923C]" />
          </motion.div>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-neutral-900">Locking Drinks · Rooftop bar</p>
            <p className="text-[10px] text-neutral-500">Hold steady — release to cancel</p>
          </div>
        </div>
      </motion.div>

      {/* Already-locked summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="px-6 mt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Already locked</p>
        <div className="space-y-1.5">
          {NODES.filter(n => n.state === 'locked').map((n) => (
            <div key={n.id} className="bg-white/70 backdrop-blur rounded-xl border border-white/80 p-2.5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFCC02]/15 flex items-center justify-center">
                <n.Icon size={12} className="text-neutral-700" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-neutral-900">{n.label}</p>
                <p className="text-[10px] text-neutral-500">{n.sub}</p>
              </div>
              <Check size={14} className="text-emerald-500" strokeWidth={3} />
            </div>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 pt-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/95 to-transparent">
        <motion.button whileTap={{ scale: 0.97 }} disabled className="w-full h-14 bg-neutral-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-neutral-400" data-testid="button-lock-night">
          Lock the night · 1 more to go
        </motion.button>
        <p className="text-center text-[10px] text-neutral-400 mt-2.5">Lock all stops to finalize</p>
      </div>

      <div className="absolute bottom-1 left-0 right-0 pointer-events-none">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-wider uppercase">Toast Flow Path · Long Hold Lock</p>
      </div>
    </div>
  );
}
