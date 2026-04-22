import { motion } from 'framer-motion';
import { Check, Zap, Clock, MessageCircle, Calendar, MapPin, Plus, Wine, Cake, X } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 300, damping: 28 };

export default function DecideLocked() {
  return (
    <div className="w-[390px] h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="decide-locked">
      {/* Hero header with locked photo */}
      <div className="relative h-[360px] overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&auto=format&fit=crop&q=80"
          alt="Som Tam Nua"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-white" />

        {/* Confetti dots */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -10, opacity: 0, scale: 0 }}
            animate={{ y: [0, 200, 360], opacity: [0, 1, 0], scale: [0.5, 1, 0.4], rotate: 360 }}
            transition={{ duration: 2.4, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
            className="absolute"
            style={{
              left: `${10 + (i * 6) % 80}%`,
              top: 40,
              width: 6, height: 6,
              background: i % 3 === 0 ? '#FFCC02' : i % 3 === 1 ? '#FF6B6B' : '#22c55e',
              borderRadius: i % 2 ? 0 : 3,
            }}
          />
        ))}

        {/* Top row */}
        <div className="absolute top-0 inset-x-0 pt-12 px-5 flex items-center justify-between z-10">
          <button aria-label="Close" data-testid="button-close" className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <X size={16} className="text-white" strokeWidth={2.5} />
          </button>
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.2 }} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-900">
            <Zap size={11} className="text-[#FFCC02] fill-[#FFCC02]" />
            <span className="text-[11px] font-black text-white">Decided in 12s</span>
          </motion.div>
          <div className="w-9" />
        </div>

        {/* Big check */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.15 }}
          className="absolute left-1/2 -translate-x-1/2 top-[140px] w-[88px] h-[88px] rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_18px_42px_-8px_rgba(255,204,2,0.7)]"
        >
          <Check size={42} className="text-neutral-900" strokeWidth={3.5} />
        </motion.div>
      </div>

      {/* Title block */}
      <div className="px-5 -mt-10 relative z-10">
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.35 }} className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFCC02] text-center">Locked in</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.42 }} className="text-[28px] font-black text-neutral-900 text-center leading-[1.05] mt-1.5 tracking-[-0.02em]">Som Tam Nua · 7:30 PM</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[12px] text-neutral-500 text-center mt-1">Sukhumvit 38 · 8 min walk · table reserved</motion.p>
      </div>

      {/* Velocity stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.55 }} className="mx-5 mt-5 flex items-center gap-2">
        <div className="flex-1 p-3 rounded-2xl bg-amber-50/80 flex items-center gap-2.5">
          <Clock size={14} className="text-[#B58900]" strokeWidth={2.5} />
          <div>
            <p className="text-[14px] font-black text-neutral-900 leading-none">~25 min</p>
            <p className="text-[10px] text-neutral-600 font-semibold mt-0.5">scrolling saved</p>
          </div>
        </div>
        <div className="flex-1 p-3 rounded-2xl bg-neutral-100 flex items-center gap-2.5">
          <Zap size={14} className="text-neutral-700 fill-neutral-700" />
          <div>
            <p className="text-[14px] font-black text-neutral-900 leading-none">streak 4</p>
            <p className="text-[10px] text-neutral-600 font-semibold mt-0.5">weeks deciding</p>
          </div>
        </div>
      </motion.div>

      {/* Cross-sell to plan the rest of the night — the bridge to set 1/2/3 */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.7 }}
        className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-5 bg-white rounded-t-[28px] shadow-[0_-18px_44px_-12px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">Optional</p>
            <p className="text-[16px] font-black text-neutral-900 leading-tight tracking-[-0.01em]">Want me to plan the rest?</p>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} className="text-[12px] font-bold text-neutral-500 underline underline-offset-2 px-2" data-testid="just-dinner">Just dinner</motion.button>
        </div>

        <div className="flex gap-2 mb-3">
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-[64px] rounded-2xl bg-neutral-100 text-left px-3 flex items-center gap-2.5" data-testid="add-drinks">
            <div className="w-9 h-9 rounded-xl bg-[#FFCC02]/20 flex items-center justify-center"><Wine size={15} className="text-neutral-900" strokeWidth={2.4} /></div>
            <div>
              <p className="text-[12px] font-black text-neutral-900 leading-tight">+ Drinks after</p>
              <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Toast picks · 9 PM</p>
            </div>
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-[64px] rounded-2xl bg-neutral-100 text-left px-3 flex items-center gap-2.5" data-testid="add-dessert">
            <div className="w-9 h-9 rounded-xl bg-[#FFCC02]/20 flex items-center justify-center"><Cake size={15} className="text-neutral-900" strokeWidth={2.4} /></div>
            <div>
              <p className="text-[12px] font-black text-neutral-900 leading-tight">+ Dessert</p>
              <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Toast picks · 10:30</p>
            </div>
          </motion.button>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} className="w-full h-[52px] rounded-2xl bg-neutral-900 text-white font-black text-[14px] flex items-center justify-center gap-2 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.4)]" data-testid="plan-full-night">
          <Plus size={14} strokeWidth={3} className="text-[#FFCC02]" /> Plan the whole night
        </motion.button>

        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-neutral-500 font-semibold">
          <button className="flex items-center gap-1" data-testid="action-line"><MessageCircle size={11} /> LINE</button>
          <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
          <button className="flex items-center gap-1" data-testid="action-cal"><Calendar size={11} /> Calendar</button>
          <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
          <button className="flex items-center gap-1" data-testid="action-map"><MapPin size={11} /> Maps</button>
        </div>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[8px] uppercase tracking-[0.18em] text-neutral-300 z-20 pointer-events-none">Toast · Decide · Locked + bridge</p>
    </div>
  );
}
