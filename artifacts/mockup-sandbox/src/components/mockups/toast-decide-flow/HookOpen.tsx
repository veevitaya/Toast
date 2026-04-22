import { motion } from 'framer-motion';
import { Zap, ChevronRight, Sparkles } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function HookOpen() {
  return (
    <div className="w-[390px] h-[844px] bg-neutral-950 font-['Figtree',sans-serif] relative overflow-hidden text-white" data-testid="hook-open">
      {/* Full-bleed Bangkok night photo with Ken Burns */}
      <motion.img
        src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&auto=format&fit=crop&q=80"
        alt="Bangkok tonight"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.18 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 14, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/85" />

      {/* Top status row */}
      <div className="absolute top-0 inset-x-0 pt-12 px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center">
            <span className="text-[11px] font-black text-neutral-900">T</span>
          </div>
          <span className="text-[12px] font-bold tracking-tight">Toast</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold">Thursday · 7:14 PM · Bangkok</span>
        </div>
      </div>

      {/* Center hero copy */}
      <div className="absolute inset-x-0 top-[26%] px-7 z-10">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFCC02]"
        >
          Don't think. Just toast.
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
          className="text-[80px] font-black leading-[0.92] tracking-[-0.04em] mt-3"
        >
          Tonight?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="text-[15px] text-white/75 mt-4 leading-snug"
        >
          Stop scrolling. Start eating.<br/>One tap. We'll pick.
        </motion.p>
      </div>

      {/* Floating mini-card teaser (preview of what's about to happen) */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ ...spring, delay: 0.6 }}
        className="absolute right-4 top-[48%] z-10"
      >
        <div className="w-[140px] rounded-2xl overflow-hidden bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]">
          <div className="relative h-[100px] bg-neutral-200">
            <img src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#FFCC02] flex items-center gap-1">
              <Sparkles size={8} className="text-neutral-900" />
              <span className="text-[8px] font-black text-neutral-900">94% match</span>
            </div>
          </div>
          <div className="p-2">
            <p className="text-[10px] font-black text-neutral-900 leading-tight">Som Tam Nua</p>
            <p className="text-[8px] text-neutral-500 mt-0.5">8 min away · ฿฿</p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute -top-2 -left-3 px-2 py-1 rounded-full bg-neutral-900 border border-[#FFCC02]/40 text-[9px] font-bold text-[#FFCC02]"
        >
          Tonight's pick
        </motion.div>
      </motion.div>

      {/* CTAs */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-10 z-10">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          className="relative w-full h-[60px] rounded-2xl bg-[#FFCC02] text-neutral-900 font-black text-[16px] flex items-center justify-center gap-2.5 shadow-[0_16px_36px_-8px_rgba(255,204,2,0.55)] overflow-hidden"
          data-testid="cta-decide"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
          />
          <Zap size={18} className="fill-neutral-900" strokeWidth={2.5} />
          Decide for me — 10 sec
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          className="w-full h-[44px] mt-2 text-white/70 font-bold text-[13px] flex items-center justify-center gap-1"
          data-testid="cta-plan"
        >
          I'll plan it myself <ChevronRight size={14} />
        </motion.button>

        {/* Live social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex items-center justify-center gap-2 mt-4"
        >
          <div className="flex -space-x-1.5">
            {['1494790108377-be9c29b29330', '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e'].map((id, i) => (
              <img key={i} src={`https://images.unsplash.com/photo-${id}?w=80&auto=format&fit=crop&q=80`} alt="" className="w-5 h-5 rounded-full object-cover border border-neutral-900" />
            ))}
          </div>
          <span className="text-[10px] text-white/55 font-semibold">12,438 toasted in Bangkok tonight</span>
        </motion.div>
      </div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[8px] uppercase tracking-[0.18em] text-white/20 z-10 pointer-events-none">Toast · Decide · Cold open</p>
    </div>
  );
}
