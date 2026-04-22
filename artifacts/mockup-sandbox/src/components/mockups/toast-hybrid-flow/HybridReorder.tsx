import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Star, GripVertical, ArrowDown, Clock, Check } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const TIMELINE = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', oldTime: '7:30 PM', newTime: '7:30 PM', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&auto=format&fit=crop&q=80', locked: true, state: 'static' as const },
  { id: 'dessert', label: 'Dessert', name: 'After You', oldTime: '10:45 PM', newTime: '9:15 PM', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80', locked: false, state: 'shifted' as const },
  { id: 'drinks-drag', label: 'Drinks', name: 'Vertigo · 60F', oldTime: '9:15 PM', newTime: '10:30 PM', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&auto=format&fit=crop&q=80', locked: false, state: 'dragging' as const },
];

export default function HybridReorder() {
  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="hybrid-reorder">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <p className="text-[12px] font-bold text-neutral-900">Reorder</p>
        <button className="text-[12px] font-bold text-emerald-600 flex items-center gap-1" data-testid="button-done">
          <Check size={12} strokeWidth={3} /> Done
        </button>
      </div>

      <div className="px-5 mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">Hold & drag</p>
        <h1 className="text-[22px] font-bold text-neutral-900 leading-[1.15] mt-1 tracking-[-0.01em]">Move Drinks after Dessert?</h1>
        <p className="text-[12px] text-neutral-500 mt-1">We'll re-time everything for you</p>
      </div>

      {/* Timeline with reorder */}
      <div className="px-5 mt-6 relative">
        <div className="absolute left-[28px] top-[18px] bottom-[40px] w-px bg-gradient-to-b from-[#FFCC02] via-amber-300 to-amber-200/60" />

        <div className="space-y-2.5">
          {/* Dinner — static */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="relative">
            <div className="absolute left-[20px] top-[20px] w-[18px] h-[18px] rounded-full bg-[#FFCC02] flex items-center justify-center z-10">
              <Lock size={9} className="text-neutral-900" strokeWidth={3} />
            </div>
            <div className="ml-12 flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-neutral-100">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <img src={TIMELINE[0].img} alt={TIMELINE[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{TIMELINE[0].label} · {TIMELINE[0].newTime}</p>
                <p className="text-[13px] font-bold text-neutral-900 truncate">{TIMELINE[0].name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={9} className="text-neutral-900 fill-neutral-900" />
                  <span className="text-[10px] font-bold text-neutral-900">4.86</span>
                </div>
              </div>
              <GripVertical size={14} className="text-neutral-300" />
            </div>
          </motion.div>

          {/* Dessert — shifted up with time-change indicator */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...spring, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute left-[20px] top-[20px] w-[18px] h-[18px] rounded-full bg-white border-2 border-[#FFCC02] z-10" />
            <div className="ml-12 flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-neutral-100">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <img src={TIMELINE[1].img} alt={TIMELINE[1].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{TIMELINE[1].label}</span>
                  <span className="text-[10px] text-neutral-400 line-through">{TIMELINE[1].oldTime}</span>
                  <ArrowDown size={9} className="text-emerald-500 -rotate-90" strokeWidth={3} />
                  <span className="text-[10px] font-bold text-emerald-600">{TIMELINE[1].newTime}</span>
                </div>
                <p className="text-[13px] font-bold text-neutral-900 truncate mt-0.5">{TIMELINE[1].name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={9} className="text-neutral-900 fill-neutral-900" />
                  <span className="text-[10px] font-bold text-neutral-900">4.78</span>
                </div>
              </div>
              <GripVertical size={14} className="text-neutral-300" />
            </div>
          </motion.div>

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ ...spring, delay: 0.15 }}
            className="relative h-[14px] flex items-center"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="ml-12 flex-1 h-[3px] rounded-full bg-[#FFCC02]"
              style={{ width: 'calc(100% - 48px)' }}
            />
          </motion.div>

          {/* Dragging card — Drinks lifted */}
          <motion.div
            initial={{ scale: 1, y: 0 }}
            animate={{ scale: 1.04, y: 0 }}
            transition={spring}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="absolute left-[20px] top-[20px] w-[18px] h-[18px] rounded-full bg-[#FFCC02] z-10 ring-4 ring-[#FFCC02]/20"
            />
            <div className="ml-12 flex items-center gap-3 p-2.5 rounded-2xl bg-white border-2 border-[#FFCC02] shadow-[0_18px_38px_-10px_rgba(0,0,0,0.25)]">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <img src={TIMELINE[2].img} alt={TIMELINE[2].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{TIMELINE[2].label}</span>
                  <span className="text-[10px] text-neutral-400 line-through">{TIMELINE[2].oldTime}</span>
                  <ArrowDown size={9} className="text-amber-500" strokeWidth={3} />
                  <span className="text-[10px] font-bold text-amber-600">{TIMELINE[2].newTime}</span>
                </div>
                <p className="text-[13px] font-bold text-neutral-900 truncate mt-0.5">{TIMELINE[2].name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={9} className="text-neutral-900 fill-neutral-900" />
                  <span className="text-[10px] font-bold text-neutral-900">4.92</span>
                </div>
              </div>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <GripVertical size={16} className="text-[#FFCC02]" strokeWidth={2.5} />
              </motion.div>
            </div>

            {/* Floating "drop here" hint */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-7 left-14 px-2.5 py-1 rounded-full bg-neutral-900 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.35)] flex items-center gap-1.5"
            >
              <span className="text-[10px] font-bold text-white">Drop to swap order</span>
              <span className="w-1 h-1 rounded-full bg-[#FFCC02]" />
              <span className="text-[10px] font-bold text-[#FFCC02]">+1h 15m</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Live time impact summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.3 }}
        className="mx-5 mt-7 p-3 rounded-2xl bg-amber-50/70 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-full bg-[#FFCC02] flex items-center justify-center shrink-0">
          <Clock size={15} className="text-neutral-900" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-neutral-900 leading-tight">Night ends ~12:30 AM</p>
          <p className="text-[10px] text-neutral-600 leading-tight mt-0.5">+45 min later than original · still ahead of last train</p>
        </div>
      </motion.div>

      <div className="h-[100px]" />

      <motion.div initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.4 }} className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-3 bg-gradient-to-t from-white via-white to-white/0">
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} className="px-5 h-[50px] rounded-2xl bg-white border border-neutral-200 text-neutral-900 font-bold text-[13px]" data-testid="cancel-reorder">Cancel</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-[50px] rounded-2xl bg-neutral-900 text-white font-bold text-[14px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] flex items-center justify-center gap-2" data-testid="confirm-reorder">
            <Check size={14} strokeWidth={3} className="text-[#FFCC02]" /> Save new order
          </motion.button>
        </div>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Hybrid · Drag to reorder</p>
    </div>
  );
}
