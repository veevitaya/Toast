import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Utensils, Wine, Cake, Mountain, Lock, RotateCcw, Sparkles, Plus, Hand, MoreHorizontal } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 280, damping: 26 };

type Period = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
function getTimeCtx() {
  const h = new Date().getHours();
  if (h < 11) return { period: 'morning' as Period, label: 'This morning', emoji: '☀️', tint: 'from-amber-100/40 via-transparent to-rose-50/30' };
  if (h < 14) return { period: 'midday' as Period, label: 'Midday flow', emoji: '🌤️', tint: 'from-yellow-100/40 via-transparent to-sky-50/30' };
  if (h < 17) return { period: 'afternoon' as Period, label: 'This afternoon', emoji: '🌅', tint: 'from-orange-100/40 via-transparent to-pink-50/30' };
  if (h < 21) return { period: 'evening' as Period, label: 'Tonight', emoji: '🌆', tint: 'from-orange-200/40 via-transparent to-violet-100/30' };
  return { period: 'night' as Period, label: 'Late night', emoji: '🌙', tint: 'from-violet-200/40 via-transparent to-indigo-100/30' };
}

const NODES = [
  { id: 'food',    label: 'Dinner',  sub: 'Som Tam Nua',   Icon: Utensils, x: 30,  y: 150, state: 'locked', vibe: '#FFCC02' },
  { id: 'drinks',  label: 'Drinks',  sub: 'Rooftop bar',   Icon: Wine,     x: 130, y: 90,  state: 'active', vibe: '#F59E0B' },
  { id: 'dessert', label: 'Dessert', sub: 'After You',     Icon: Cake,     x: 230, y: 160, state: 'active', vibe: '#EC4899' },
  { id: 'walk',    label: 'Walk',    sub: 'Lumphini park', Icon: Mountain, x: 330, y: 80,  state: 'ghost',  vibe: '#A78BFA' },
] as const;

export default function FlowPathSolo() {
  const time = getTimeCtx();
  const [tappedHint, setTappedHint] = useState<string | null>(null);

  return (
    <div className={`w-[390px] min-h-[844px] overflow-hidden font-['Figtree',sans-serif] relative bg-gradient-to-br ${time.tint}`} style={{ backgroundColor: '#FAFAF8' }} data-testid="flow-path-solo">
      <div className="h-[44px]" />

      {/* Top bar */}
      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]" data-testid="button-back">
          <ChevronLeft size={16} className="text-neutral-700" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-neutral-700">Solo flow</span>
        </div>
        <button aria-label="More options" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]" data-testid="button-more">
          <MoreHorizontal size={16} className="text-neutral-700" />
        </button>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...spring }} className="px-6 mt-7">
        <div className="flex items-center gap-2">
          <span className="text-[13px]">{time.emoji}</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{time.label}</span>
        </div>
        <h1 className="text-[26px] font-extrabold text-neutral-900 leading-[1.15] mt-2">
          Your night is<br />taking shape
        </h1>
        <p className="text-[13px] text-neutral-500 mt-2">Drag forward to extend · Hold a stop to lock</p>
      </motion.div>

      {/* THE PATH */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative mt-7 mx-2 h-[240px]">
        <svg width="370" height="240" viewBox="0 0 370 240" className="block">
          <defs>
            <linearGradient id="solo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCC02" stopOpacity="1" />
              <stop offset="55%" stopColor="#FB923C" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.45" />
            </linearGradient>
            <filter id="solo-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <motion.path
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 1.1, ease: 'easeOut' }}
            d="M30 150 Q80 90 130 90 Q180 90 230 160 Q280 200 330 80"
            fill="none" stroke="url(#solo-grad)" strokeWidth="14" strokeLinecap="round" opacity="0.16" filter="url(#solo-glow)"
          />
          <motion.path
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 1.1, ease: 'easeOut' }}
            d="M30 150 Q80 90 130 90 Q180 90 230 160 Q280 200 330 80"
            fill="none" stroke="url(#solo-grad)" strokeWidth="2.5" strokeLinecap="round"
          />
          <motion.path
            initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.4, duration: 0.6 }}
            d="M330 80 Q345 60 365 50"
            fill="none" stroke="#A78BFA" strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round"
          />
        </svg>

        {NODES.map((n, i) => {
          const isLocked = n.state === 'locked';
          const isGhost = n.state === 'ghost';
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: isGhost ? 0.55 : 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.13, ...spring }}
              whileTap={{ scale: 0.94 }}
              className="absolute"
              style={{ left: n.x - 28, top: n.y - 28 }}
              data-testid={`node-${n.id}`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center relative ${
                  isLocked ? 'bg-[#FFCC02]' :
                  isGhost ? 'bg-white/40 border-2 border-dashed border-neutral-300' :
                  'bg-white shadow-[0_4px_18px_-2px_rgba(0,0,0,0.12)]'
                }`}
                style={isLocked ? { boxShadow: '0 0 26px -2px rgba(255,204,2,0.55), 0 4px 18px -2px rgba(0,0,0,0.1)' } : undefined}
              >
                <n.Icon size={20} className={isLocked ? 'text-neutral-900' : isGhost ? 'text-neutral-400' : 'text-neutral-700'} />
                {isLocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Lock size={9} className="text-[#FFCC02]" />
                  </div>
                )}
                {!isLocked && !isGhost && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.vibe, boxShadow: '0 0 0 2px white' }} />
                )}
              </div>
              <div className="text-center mt-1.5 w-20 -ml-3">
                <p className={`text-[11px] font-bold ${isGhost ? 'text-neutral-400' : 'text-neutral-900'}`}>{n.label}</p>
                <p className={`text-[9px] ${isGhost ? 'text-neutral-300' : 'text-neutral-500'} truncate`}>{n.sub}</p>
              </div>
            </motion.div>
          );
        })}

        {/* Drag affordance */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute right-0 top-10 flex flex-col items-center gap-1">
          <motion.div
            animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            <Plus size={13} className="text-neutral-500" />
          </motion.div>
          <p className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wider">drag</p>
        </motion.div>
      </motion.div>

      {/* Vibe chip */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, ...spring }} className="px-6 mt-1">
        <div className="bg-white/75 backdrop-blur rounded-2xl border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFCC02, #FB923C)' }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-neutral-900">Warm · social · mid-energy</p>
            <p className="text-[10px] text-neutral-500">3 stops · Sukhumvit · ~4 hrs</p>
          </div>
          <button className="text-[10px] font-bold text-[#FFCC02] uppercase tracking-wider" data-testid="button-remix">Remix</button>
        </div>
      </motion.div>

      {/* Hint cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="px-6 mt-3 grid grid-cols-3 gap-2">
        {[
          { id: 'extend', Icon: Plus, label: 'Extend', sub: 'add a stop' },
          { id: 'simplify', Icon: Hand, label: 'Simplify', sub: 'pinch in' },
          { id: 'swap', Icon: RotateCcw, label: 'Swap', sub: 'tap a node' },
        ].map((a) => (
          <motion.button
            key={a.id}
            whileTap={{ scale: 0.95 }}
            onTap={() => setTappedHint(a.id)}
            className={`bg-white rounded-2xl border p-3 text-left transition-colors ${tappedHint === a.id ? 'border-[#FFCC02]' : 'border-neutral-100'} shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}
            data-testid={`hint-${a.id}`}
          >
            <a.Icon size={14} className="text-neutral-500" />
            <p className="text-[11px] font-bold text-neutral-900 mt-1.5">{a.label}</p>
            <p className="text-[9px] text-neutral-400">{a.sub}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom CTAs */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 pt-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/95 to-transparent">
        <motion.button whileTap={{ scale: 0.97 }} className="w-full h-14 bg-neutral-900 rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]" data-testid="button-lock-night">
          <Lock size={15} />
          Lock the night
        </motion.button>
        <p className="text-center text-[10px] text-neutral-400 mt-2.5">You can still tweak it after locking</p>
      </div>

      <div className="absolute bottom-1 left-0 right-0 pointer-events-none">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-wider uppercase">Toast Flow Path · Solo</p>
      </div>
    </div>
  );
}
