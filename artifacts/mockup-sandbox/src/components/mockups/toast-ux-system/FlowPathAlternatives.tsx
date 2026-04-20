import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Utensils, Wine, Cake, Mountain, Lock, MoreHorizontal, ArrowRight, Star, MapPin, Sparkles } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 280, damping: 26 };

const NODES = [
  { id: 'food',    label: 'Dinner',  sub: 'Som Tam Nua', Icon: Utensils, x: 30,  y: 150, state: 'locked' },
  { id: 'drinks',  label: 'Drinks',  sub: 'Rooftop bar', Icon: Wine,     x: 130, y: 90,  state: 'tapped' },
  { id: 'dessert', label: 'Dessert', sub: 'After You',   Icon: Cake,     x: 230, y: 160, state: 'dimmed' },
  { id: 'walk',    label: 'Walk',    sub: 'Lumphini',    Icon: Mountain, x: 330, y: 80,  state: 'ghost'  },
] as const;

const ALTS = [
  { id: 'a1', emoji: '🥂', title: 'Rooftop cocktails', sub: 'Vertigo · 60th floor', meta: '4.7 ★ · 12 min', vibe: 'from-orange-200 to-amber-100', selected: true },
  { id: 'a2', emoji: '🍷', title: 'Wine bar',          sub: 'Wine Connection',     meta: '4.5 ★ · 8 min',  vibe: 'from-rose-200 to-pink-100' },
  { id: 'a3', emoji: '🛋️', title: 'Chill lounge',     sub: 'Iron Fairies',        meta: '4.6 ★ · 15 min', vibe: 'from-violet-200 to-indigo-100' },
  { id: 'a4', emoji: '🥃', title: 'Speakeasy',         sub: 'Q&A Bar',             meta: '4.8 ★ · 10 min', vibe: 'from-amber-200 to-yellow-100' },
  { id: 'a5', emoji: '🍰', title: 'Dessert cafe',      sub: 'instead of drinks',   meta: 'Switch direction', vibe: 'from-pink-200 to-rose-100' },
];

export default function FlowPathAlternatives() {
  const [pickedId, setPickedId] = useState('a1');

  return (
    <div className="w-[390px] min-h-[844px] overflow-hidden font-['Figtree',sans-serif] relative bg-gradient-to-br from-orange-100/30 via-transparent to-violet-100/20" style={{ backgroundColor: '#FAFAF8' }} data-testid="flow-path-alts">
      <div className="h-[44px]" />

      {/* Top bar */}
      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <ChevronLeft size={16} className="text-neutral-700" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-neutral-700">Tap to swap</span>
        </div>
        <button aria-label="More options" data-testid="button-more" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <MoreHorizontal size={16} className="text-neutral-700" />
        </button>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...spring }} className="px-6 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Tap a stop</p>
        <h1 className="text-[24px] font-extrabold text-neutral-900 leading-[1.15] mt-1.5">
          Try a better fit for<br />
          <span className="text-neutral-500">Drinks</span>
        </h1>
      </motion.div>

      {/* PATH (dimmed except drinks) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative mt-5 mx-2 h-[210px]">
        <svg width="370" height="200" viewBox="0 0 370 200" className="block opacity-60">
          <defs>
            <linearGradient id="alt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCC02" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d="M30 130 Q80 70 130 70 Q180 70 230 140 Q280 180 330 60" fill="none" stroke="url(#alt-grad)" strokeWidth="14" strokeLinecap="round" opacity="0.14" />
          <path d="M30 130 Q80 70 130 70 Q180 70 230 140 Q280 180 330 60" fill="none" stroke="url(#alt-grad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {NODES.map((n, i) => {
          const isLocked = n.state === 'locked';
          const isGhost = n.state === 'ghost';
          const isDimmed = n.state === 'dimmed';
          const isTapped = n.state === 'tapped';
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: isDimmed || isGhost ? 0.35 : 1, scale: isTapped ? 1.08 : 1 }}
              transition={{ delay: 0.4 + i * 0.1, ...spring }}
              className="absolute"
              style={{ left: n.x - 28, top: n.y - 28 }}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center relative ${
                  isLocked ? 'bg-[#FFCC02]' :
                  isTapped ? 'bg-white ring-4 ring-[#FFCC02]/40' :
                  isGhost ? 'bg-white/40 border-2 border-dashed border-neutral-300' :
                  'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]'
                }`}
                style={isTapped ? { boxShadow: '0 0 36px -4px rgba(255,204,2,0.55), 0 6px 24px -4px rgba(0,0,0,0.12)' } : isLocked ? { boxShadow: '0 0 22px -2px rgba(255,204,2,0.45), 0 4px 16px -2px rgba(0,0,0,0.08)' } : undefined}
              >
                <n.Icon size={20} className={isLocked ? 'text-neutral-900' : isGhost || isDimmed ? 'text-neutral-400' : 'text-neutral-700'} />
                {isLocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Lock size={9} className="text-[#FFCC02]" />
                  </div>
                )}
              </div>
              <div className="text-center mt-1.5 w-20 -ml-3">
                <p className={`text-[11px] font-bold ${isDimmed || isGhost ? 'text-neutral-400' : 'text-neutral-900'}`}>{n.label}</p>
                <p className={`text-[9px] ${isDimmed || isGhost ? 'text-neutral-300' : 'text-neutral-500'} truncate`}>{n.sub}</p>
              </div>
            </motion.div>
          );
        })}

        {/* Connector line from tapped node down to panel */}
        <svg className="absolute left-1/2 -translate-x-1/2 top-[88px]" width="2" height="68">
          <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.4 }} x1="1" y1="0" x2="1" y2="68" stroke="#FFCC02" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      </motion.div>

      {/* ALTERNATIVES PANEL — attached to node */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.55, ...spring }}
          className="mx-5 -mt-1 bg-white rounded-3xl shadow-[0_18px_50px_-12px_rgba(0,0,0,0.18)] border border-neutral-100 overflow-hidden relative"
          data-testid="alternatives-panel"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-l border-t border-neutral-100" />
          <div className="px-5 pt-4 pb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">5 alternatives</p>
              <p className="text-[14px] font-bold text-neutral-900 mt-0.5">For your Drinks moment</p>
            </div>
            <button className="text-[10px] font-bold text-[#FFCC02] uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> Remix
            </button>
          </div>

          <div className="px-3 pb-3 space-y-1.5">
            {ALTS.slice(0, 4).map((a, i) => (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05, ...spring }}
                whileTap={{ scale: 0.98 }}
                onTap={() => setPickedId(a.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-colors ${pickedId === a.id ? 'bg-[#FFCC02]/12 ring-1 ring-[#FFCC02]/40' : 'hover:bg-neutral-50'}`}
                data-testid={`alt-${a.id}`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.vibe} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[20px]">{a.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-neutral-900 truncate">{a.title}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{a.sub}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star size={9} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-neutral-700">{a.meta.split(' · ')[0].replace(' ★', '')}</span>
                  </div>
                  <p className="text-[9px] text-neutral-400 flex items-center gap-0.5 justify-end mt-0.5">
                    <MapPin size={8} />{a.meta.split(' · ')[1]}
                  </p>
                </div>
              </motion.button>
            ))}

            {/* Switch direction option */}
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
              className="w-full flex items-center gap-3 p-2.5 rounded-2xl border border-dashed border-neutral-200"
              data-testid="alt-switch-direction"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-200 to-rose-100 flex items-center justify-center">
                <span className="text-[20px]">🍰</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[13px] font-bold text-neutral-900">Dessert cafe instead</p>
                <p className="text-[10px] text-neutral-500">Switch direction</p>
              </div>
              <ArrowRight size={14} className="text-neutral-400" />
            </motion.button>
          </div>

          <div className="px-3 pb-3 pt-1 flex gap-2">
            <button className="flex-1 h-11 bg-neutral-100 rounded-xl text-[12px] font-semibold text-neutral-500" data-testid="button-cancel">Cancel</button>
            <motion.button whileTap={{ scale: 0.97 }} className="flex-[1.6] h-11 bg-[#FFCC02] rounded-xl text-[12px] font-bold text-neutral-900 shadow-[0_4px_16px_-2px_rgba(255,204,2,0.4)] flex items-center justify-center gap-1.5" data-testid="button-swap">
              Swap into path
              <ArrowRight size={13} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-1 left-0 right-0 pointer-events-none">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-wider uppercase">Toast Flow Path · Tap to Swap</p>
      </div>
    </div>
  );
}
