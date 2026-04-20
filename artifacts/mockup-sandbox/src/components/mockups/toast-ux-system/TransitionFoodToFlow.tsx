import { motion } from 'framer-motion';
import { ChevronLeft, Wine, Cake, Mountain, Music, Sparkles, ArrowRight, Star, MapPin } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const GHOST_NODES = [
  { id: 'drinks',  Icon: Wine,     label: 'Drinks',  x: 145, delay: 1.0 },
  { id: 'dessert', Icon: Cake,     label: 'Dessert', x: 215, delay: 1.15 },
  { id: 'live',    Icon: Music,    label: 'Live music', x: 285, delay: 1.3 },
  { id: 'walk',    Icon: Mountain, label: 'Walk',    x: 355, delay: 1.45 },
];

export default function TransitionFoodToFlow() {
  return (
    <div className="w-[390px] min-h-[844px] overflow-hidden font-['Figtree',sans-serif] relative bg-gradient-to-b from-orange-200/40 via-amber-100/20 to-violet-200/30" style={{ backgroundColor: '#FAFAF8' }} data-testid="transition-food-to-flow">
      {/* Soft radial backdrop accent */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 32%, rgba(255,204,2,0.18), transparent 55%)' }} />

      <div className="h-[44px] relative" />

      <div className="px-5 flex items-center justify-between relative">
        <motion.button aria-label="Back" data-testid="button-back" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.3 }} className="w-9 h-9 rounded-full bg-white/60 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <ChevronLeft size={16} className="text-neutral-700" />
        </motion.button>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, ...spring }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <Sparkles size={11} className="text-[#FFCC02]" />
          <span className="text-[11px] font-bold text-neutral-800">Building your night</span>
        </motion.div>
        <div className="w-9 h-9" />
      </div>

      {/* Eyebrow + headline */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...spring }} className="px-7 mt-7 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">That's dinner ✓</p>
        <h1 className="text-[28px] font-extrabold text-neutral-900 leading-[1.1] mt-2">
          What happens<br />after?
        </h1>
        <p className="text-[13px] text-neutral-500 mt-2">Make it more than a meal</p>
      </motion.div>

      {/* The food card morphing into first node */}
      <div className="relative mt-8 mx-auto" style={{ width: 360, height: 320 }}>
        {/* The food card (focal) */}
        <motion.div
          initial={{ scale: 1.02, opacity: 0, y: 6 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ...spring }}
          className="absolute left-2 top-0 w-[170px] rounded-3xl overflow-hidden bg-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.22)] border border-white"
          data-testid="food-card-morphing"
        >
          <div className="relative h-[120px]">
            <img src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&auto=format&fit=crop&q=60" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#FFCC02] flex items-center gap-1">
              <Sparkles size={8} className="text-neutral-900" />
              <span className="text-[8px] font-bold text-neutral-900 uppercase tracking-wider">Locked</span>
            </div>
            <div className="absolute bottom-2 left-2.5 right-2.5">
              <p className="text-[13px] font-bold text-white leading-tight">Som Tam Nua</p>
              <p className="text-[9px] text-white/80">Crab papaya salad</p>
            </div>
          </div>
          <div className="p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star size={10} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-neutral-900">4.7</span>
              <span className="text-[9px] text-neutral-400">· ฿฿</span>
            </div>
            <span className="text-[9px] text-neutral-400 flex items-center gap-0.5"><MapPin size={9} />8 min</span>
          </div>
        </motion.div>

        {/* Glowing emergent line from card to right edge */}
        <svg className="absolute left-[170px] top-[80px]" width="200" height="60" viewBox="0 0 200 60">
          <defs>
            <linearGradient id="trans-grad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFCC02" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.3" />
            </linearGradient>
            <filter id="trans-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.85, duration: 1.0, ease: 'easeOut' }}
            d="M0 30 Q60 30 100 18 Q140 10 200 24"
            fill="none" stroke="url(#trans-grad)" strokeWidth="14" strokeLinecap="round" opacity="0.18" filter="url(#trans-glow)"
          />
          <motion.path
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.85, duration: 1.0, ease: 'easeOut' }}
            d="M0 30 Q60 30 100 18 Q140 10 200 24"
            fill="none" stroke="url(#trans-grad)" strokeWidth="2.5" strokeLinecap="round"
          />
        </svg>

        {/* Ghost activity nodes appearing ahead */}
        <div className="absolute top-[140px] left-0 right-0">
          {GHOST_NODES.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, scale: 0.4, y: 10 }}
              animate={{ opacity: 0.55, scale: 1, y: 0 }}
              transition={{ delay: g.delay, ...spring }}
              className="absolute"
              style={{ left: g.x - 22, top: i % 2 === 0 ? 0 : 20 }}
            >
              <div className="w-11 h-11 rounded-full bg-white/60 backdrop-blur border-2 border-dashed border-neutral-300 flex items-center justify-center">
                <g.Icon size={16} className="text-neutral-400" />
              </div>
              <p className="text-[9px] font-bold text-neutral-400 text-center mt-1">{g.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Caption */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-0 left-0 right-0 text-center">
          <p className="text-[11px] text-neutral-500 italic">your food is becoming the start of a flow</p>
        </motion.div>
      </div>

      {/* Path-builder choices */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, ...spring }} className="px-5 mt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: '🥂', label: 'Drinks', vibe: 'from-orange-200 to-amber-100' },
            { emoji: '🍰', label: 'Dessert', vibe: 'from-pink-200 to-rose-100' },
            { emoji: '🌃', label: 'Surprise', vibe: 'from-violet-200 to-indigo-100' },
          ].map((c, i) => (
            <motion.button
              key={c.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.85 + i * 0.06, ...spring }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${c.vibe} rounded-2xl p-3 text-left border border-white/80`}
              data-testid={`next-${c.label.toLowerCase()}`}
            >
              <span className="text-[22px] block">{c.emoji}</span>
              <p className="text-[12px] font-bold text-neutral-900 mt-1">{c.label}</p>
              <p className="text-[9px] text-neutral-600">next stop</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 pt-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/95 to-transparent">
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, ...spring }}
          whileTap={{ scale: 0.97 }}
          className="w-full h-14 bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-neutral-900 shadow-[0_8px_28px_-4px_rgba(255,204,2,0.5)]"
          data-testid="button-keep-going"
        >
          Keep the night going
          <ArrowRight size={16} />
        </motion.button>
        <p className="text-center text-[10px] text-neutral-400 mt-2.5">Or just lock dinner and head out</p>
      </div>

      <div className="absolute bottom-1 left-0 right-0 pointer-events-none">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-wider uppercase">Toast Transition · Food → Flow</p>
      </div>
    </div>
  );
}
