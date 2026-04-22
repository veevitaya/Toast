import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Heart, MapPin, Star, Clock, Users, ArrowLeft, ArrowRight, Lock, X } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 30 };

export default function DecideCard() {
  const [progress, setProgress] = useState(0.32);
  // visual-only countdown simulation
  useEffect(() => {
    const i = setInterval(() => setProgress(p => (p >= 1 ? 0.32 : p + 0.001)), 50);
    return () => clearInterval(i);
  }, []);

  const radius = 18;
  const circ = 2 * Math.PI * radius;

  return (
    <div className="w-[390px] h-[844px] bg-neutral-950 font-['Figtree',sans-serif] relative overflow-hidden text-white" data-testid="decide-card">
      {/* Hero photo */}
      <motion.img
        src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&auto=format&fit=crop&q=80"
        alt="Som Tam Nua"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.18 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 10, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/95" />

      {/* Top row: countdown + close */}
      <div className="absolute top-0 inset-x-0 pt-12 px-5 flex items-center justify-between z-10">
        <button aria-label="Close" data-testid="button-close" className="w-9 h-9 rounded-full bg-white/12 backdrop-blur-md flex items-center justify-center">
          <X size={16} strokeWidth={2.5} />
        </button>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/12 backdrop-blur-md"
        >
          <svg width={28} height={28} className="-rotate-90">
            <circle cx={14} cy={14} r={radius} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
            <circle
              cx={14} cy={14} r={radius} fill="none" stroke="#FFCC02" strokeWidth={3} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
            />
          </svg>
          <span className="text-[11px] font-bold">Auto-locks in 7s</span>
          <button aria-label="Pause" data-testid="button-pause" className="ml-1"><Pause size={12} className="fill-white" /></button>
        </motion.div>
        <button aria-label="Wishlist" data-testid="button-heart" className="w-9 h-9 rounded-full bg-white/12 backdrop-blur-md flex items-center justify-center">
          <Heart size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Center copy */}
      <div className="absolute inset-x-0 top-[19%] px-6 z-10">
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }} className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFCC02]">Tonight, you're eating here</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.18 }} className="text-[44px] font-black leading-[0.96] tracking-[-0.025em] mt-2">Som Tam Nua</motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[12px] font-semibold">
          <span className="flex items-center gap-1"><Star size={11} className="fill-white" /> 4.86 · 2.4k</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> 8 min walk</span>
          <span className="flex items-center gap-1"><Clock size={11} /> Open · seats now</span>
          <span>฿฿</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.4 }} className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFCC02] text-neutral-900">
          <span className="text-[12px] font-black">94% match for tonight</span>
        </motion.div>
      </div>

      {/* Why we picked it */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.5 }}
        className="absolute inset-x-5 bottom-[230px] z-10 p-3.5 rounded-2xl bg-white/12 backdrop-blur-md border border-white/12"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFCC02]">Why we picked it</p>
        <p className="text-[13px] leading-snug mt-1.5">You like punchy, herby food. <span className="font-bold">3 friends</span> rated this 5★ this month. <span className="font-bold">Quiet table</span> available right now.</p>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex -space-x-1.5">
            {['1494790108377-be9c29b29330', '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e'].map((id, i) => (
              <img key={i} src={`https://images.unsplash.com/photo-${id}?w=80&auto=format&fit=crop&q=80`} alt="" className="w-5 h-5 rounded-full object-cover border border-neutral-900" />
            ))}
          </div>
          <span className="text-[10px] text-white/70 font-semibold">Mai, Pim & Noi loved it</span>
        </div>
      </motion.div>

      {/* Action bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-7 px-5">
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.4 }} className="flex items-center gap-2.5">
          <motion.button whileTap={{ scale: 0.94 }} className="w-14 h-14 rounded-full bg-white/12 backdrop-blur-md flex items-center justify-center" data-testid="action-prev" aria-label="Previous">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="relative flex-1 h-14 rounded-2xl bg-[#FFCC02] text-neutral-900 font-black text-[15px] flex items-center justify-center gap-2 shadow-[0_16px_36px_-8px_rgba(255,204,2,0.6)] overflow-hidden"
            data-testid="action-lock"
          >
            <Lock size={15} strokeWidth={3} className="fill-neutral-900" />
            Lock it in
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} className="w-14 h-14 rounded-full bg-white/12 backdrop-blur-md flex items-center justify-center" data-testid="action-next" aria-label="Try another">
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-3 mt-3 text-[10px] text-white/65 font-semibold">
          <span className="flex items-center gap-1">← Try another</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <span>Tap to lock</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <span>Long-hold to see more</span>
        </motion.div>
      </div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[8px] uppercase tracking-[0.18em] text-white/20 z-10 pointer-events-none">Toast · Decide · The decision moment</p>
    </div>
  );
}
