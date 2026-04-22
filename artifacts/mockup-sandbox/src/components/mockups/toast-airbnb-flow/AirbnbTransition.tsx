import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, MapPin, Sparkles, Wine, Cake, TreePine } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 280, damping: 30 };

const FOOD_HERO = 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&auto=format&fit=crop&q=80';

const NEXT = [
  { id: 'd', label: 'Drinks', sub: '9:15 PM', icon: Wine, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&auto=format&fit=crop&q=80' },
  { id: 's', label: 'Dessert', sub: '10:45 PM', icon: Cake, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80' },
  { id: 'w', label: 'Walk', sub: '11:30 PM', icon: TreePine, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&auto=format&fit=crop&q=80' },
];

export default function AirbnbTransition() {
  const [phase, setPhase] = useState(0); // 0: food hero, 1: morphing, 2: route revealed

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="airbnb-flow-transition">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <motion.button aria-label="Back" data-testid="button-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </motion.button>
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900">
          <Sparkles size={10} className="text-[#FFCC02]" />
          <span className="text-[11px] font-bold text-white">Building your night</span>
        </motion.div>
        <div className="w-9 h-9" />
      </div>

      {/* Hero - morphs from large card to compact card */}
      <motion.div
        className="px-5 mt-5"
        animate={{ scale: phase >= 1 ? 0.92 : 1, y: phase >= 1 ? -10 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <motion.div
          layout
          className="relative rounded-[22px] overflow-hidden bg-neutral-100"
          animate={{ height: phase >= 2 ? 220 : 360 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <motion.img
            src={FOOD_HERO}
            alt="Som Tam Nua"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 6, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, ...spring }}
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFCC02] shadow-[0_4px_14px_-2px_rgba(255,204,2,0.55)]"
          >
            <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-wider">Locked · Tonight</span>
          </motion.div>

          <div className="absolute left-5 bottom-5 right-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-80">Dinner · 7:30 PM</p>
            <p className="text-[22px] font-bold leading-[1.12] mt-1">Som Tam Nua</p>
            <div className="flex items-center gap-1.5 mt-1 text-[12px] opacity-90">
              <Star size={11} className="text-white fill-white" /> 4.86
              <span className="opacity-60">·</span>
              <MapPin size={11} /> Sukhumvit 38
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Morphing copy block */}
      <div className="px-5 mt-6 min-h-[72px]">
        <AnimatePresence mode="wait">
          {phase < 2 ? (
            <motion.div key="building" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring}>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">Dinner is in</p>
              <p className="text-[22px] font-bold text-neutral-900 leading-tight mt-1 tracking-[-0.01em]">Now let's build the rest…</p>
            </motion.div>
          ) : (
            <motion.div key="reveal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">Your night unfolds</p>
              <p className="text-[22px] font-bold text-neutral-900 leading-tight mt-1 tracking-[-0.01em]">Three more stops, paced just right</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ghost route reveal */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-5 mt-5"
          >
            {/* Dotted timeline */}
            <div className="relative pl-3.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute left-1.5 top-3 bottom-3 w-px border-l-2 border-dashed border-neutral-300"
              />
              <div className="space-y-2.5">
                {NEXT.map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...spring, delay: 0.3 + i * 0.18 }}
                      className="relative"
                    >
                      <div className="absolute -left-3 top-5 w-2.5 h-2.5 rounded-full bg-white border-2 border-neutral-300" />
                      <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                          <img src={n.img} alt={n.label} className="w-full h-full object-cover opacity-60" />
                          <div className="absolute inset-0 bg-white/40" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon size={16} className="text-neutral-700" strokeWidth={2.2} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{n.label} · {n.sub}</p>
                          <p className="text-[13px] font-semibold text-neutral-500 leading-tight mt-0.5">Tap to choose a spot</p>
                        </div>
                        <div className="px-2 py-1 rounded-full bg-neutral-100">
                          <span className="text-[10px] font-bold text-neutral-600">Pick</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 1.0 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 w-full h-[50px] rounded-2xl bg-gradient-to-b from-[#FFCC02] to-[#F5B800] text-neutral-900 font-bold text-[14px] shadow-[0_8px_24px_-6px_rgba(255,204,2,0.6)] flex items-center justify-center gap-2"
              data-testid="button-start-flow"
            >
              <Sparkles size={14} strokeWidth={2.5} /> Start with drinks
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Airbnb DNA · Transition</p>
    </div>
  );
}
