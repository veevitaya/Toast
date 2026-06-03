import { motion } from 'framer-motion';
import { ChevronLeft, X, Heart, Star, MapPin, RotateCcw, Sparkles } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 300, damping: 28 };

export default function KeepSwiping() {
  return (
    <div className="toast-more w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FDF8F0' }} data-testid="flow-swipe">
      <div className="h-[44px]" />

      {/* Top bar */}
      <div className="px-5 flex items-center justify-between">
        <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <ChevronLeft size={17} className="text-neutral-700" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC02]" />
          <span className="text-[11px] font-bold text-neutral-700">1 of 6 great matches</span>
        </div>
        <div className="w-9 h-9" />
      </div>

      {/* Header */}
      <div className="px-6 mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0A800]">Same mood, more to see</p>
        <h1 className="text-[22px] font-extrabold text-neutral-900 leading-tight mt-1">Not quite it? Keep swiping</h1>
      </div>

      {/* Card stack */}
      <div className="relative mt-5 mx-auto" style={{ width: 318, height: 430 }}>
        {/* back card 2 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-5 w-[286px] h-[400px] rounded-[28px] bg-white" style={{ transform: 'translateX(-50%) scale(0.9)', boxShadow: '0 8px 24px -12px rgba(0,0,0,0.12)' }} />
        {/* back card 1 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute left-1/2 top-2.5 w-[302px] h-[414px] rounded-[28px] bg-white" style={{ transform: 'translateX(-50%) scale(0.95)', boxShadow: '0 10px 28px -12px rgba(0,0,0,0.14)' }} />

        {/* top card */}
        <motion.div
          initial={{ opacity: 0, y: 18, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={spring}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[318px] h-[430px] rounded-[28px] overflow-hidden bg-white"
          style={{ boxShadow: '0 22px 50px -16px rgba(0,0,0,0.3)' }}
          data-testid="swipe-card"
        >
          <div className="relative h-[270px]">
            <img src="https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&q=75" alt="dish" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur">
              <Star size={11} className="text-amber-500 fill-amber-500" />
              <span className="text-[12px] font-extrabold text-neutral-900">4.6</span>
            </div>
            {/* swipe-right hint */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-lg border-[3px] border-[#34C759] rotate-12">
              <span className="text-[16px] font-extrabold text-[#34C759] tracking-wide">YES</span>
            </div>
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-white text-[20px] font-extrabold leading-tight drop-shadow">Baan Phadthai</p>
              <p className="text-white/85 text-[12px] font-medium">Thai · Noodles · ฿฿</p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-[#FFF6D6] text-[11px] font-bold text-[#9A7400]">Comfort food</span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-600 flex items-center gap-1"><MapPin size={10} />12 min</span>
            </div>
            <p className="text-[12px] text-neutral-500 mt-2.5 leading-snug">Famous for silky pad thai wrapped in egg — cozy, fast, and right in your craving lane.</p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1" />

      {/* Action row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...spring }} className="pb-9 px-8">
        <div className="flex items-center justify-center gap-5">
          <button className="w-12 h-12 rounded-full bg-white ring-1 ring-neutral-200 flex items-center justify-center" data-testid="button-undo">
            <RotateCcw size={18} className="text-neutral-400" />
          </button>
          <button className="w-16 h-16 rounded-full bg-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.18)] flex items-center justify-center" data-testid="button-pass">
            <X size={26} className="text-neutral-400" strokeWidth={2.5} />
          </button>
          <button className="w-16 h-16 rounded-full bg-[#FFCC02] flex items-center justify-center" style={{ boxShadow: '0 10px 24px -6px rgba(255,204,2,0.6)' }} data-testid="button-like">
            <Heart size={26} className="text-neutral-900 fill-neutral-900" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white ring-1 ring-neutral-200 flex items-center justify-center" data-testid="button-superlike">
            <Sparkles size={18} className="text-[#E0A800]" />
          </button>
        </div>
        <p className="text-center text-[11px] text-neutral-400 mt-3 font-medium">Swipe right to lock it in · left to see the next</p>
      </motion.div>
    </div>
  );
}
