import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lock, Star, MapPin, ChevronDown, Plus, GripVertical, Heart, Sparkles } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const STOPS = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', area: 'Sukhumvit 38', time: '7:30 PM', rating: 4.86, vibe: 'Casual · Spicy', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', locked: true },
  { id: 'drinks', label: 'Drinks', name: 'Vertigo · 60F', area: 'Banyan Tree', time: '9:15 PM', rating: 4.92, vibe: 'Skyline · Date night', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&auto=format&fit=crop&q=80', locked: false },
  { id: 'dessert', label: 'Dessert', name: 'After You', area: 'Thonglor 13', time: '10:45 PM', rating: 4.78, vibe: 'Sweet · Cozy', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80', locked: false },
];

export default function HybridSolo() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="hybrid-solo">
      <div className="h-[44px]" />

      {/* Search pill */}
      <div className="px-5">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="flex items-center gap-3 bg-white rounded-full pl-5 pr-2 py-2 shadow-[0_4px_18px_rgba(0,0,0,0.07)] border border-neutral-100">
          <Search size={16} className="text-neutral-900" strokeWidth={2.5} />
          <div className="flex-1">
            <p className="text-[13px] font-bold text-neutral-900 leading-tight">Tonight in Bangkok</p>
            <p className="text-[11px] text-neutral-500 leading-tight">Solo · 3 stops · ~4 hrs</p>
          </div>
          <button aria-label="Profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 to-orange-300" />
        </motion.div>
      </div>

      {/* Header */}
      <div className="px-5 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">Your night</p>
        <h1 className="text-[26px] font-bold text-neutral-900 leading-[1.12] mt-1.5 tracking-[-0.01em]">Top to bottom,<br/>perfectly paced</h1>
        <p className="text-[12px] text-neutral-500 mt-2">Tap any stop to expand · drag to reorder · tap + to add</p>
      </div>

      {/* Vertical timeline — Airbnb cards on a Toast-yellow path */}
      <div className="px-5 mt-5 relative">
        {/* Continuous timeline line */}
        <div className="absolute left-[36px] top-[18px] bottom-[18px] w-px bg-gradient-to-b from-[#FFCC02] via-amber-300 to-amber-200/60" />

        <div className="space-y-2">
          {STOPS.map((s, i) => {
            const isExpanded = expanded === s.id;
            return (
              <div key={s.id} className="relative">
                {/* Timeline dot */}
                <motion.div
                  layout
                  className={`absolute left-[28px] top-[26px] w-[18px] h-[18px] rounded-full flex items-center justify-center z-10 transition-colors ${s.locked ? 'bg-[#FFCC02]' : 'bg-white border-2 border-[#FFCC02]'}`}
                >
                  {s.locked && <Lock size={9} className="text-neutral-900" strokeWidth={3} />}
                </motion.div>

                <motion.button
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.1 + i * 0.06 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setExpanded(isExpanded ? null : s.id)}
                  className={`w-full ml-14 text-left bg-white rounded-2xl border overflow-hidden transition-shadow ${isExpanded ? 'border-neutral-900 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.18)]' : 'border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}
                  style={{ width: 'calc(100% - 56px)' }}
                  data-testid={`timeline-${s.id}`}
                >
                  {/* Collapsed row */}
                  <div className="flex items-center gap-3 p-2.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                      <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
                        <span className="text-[10px] font-bold text-neutral-700">{s.time}</span>
                      </div>
                      <p className="text-[13px] font-bold text-neutral-900 truncate leading-tight mt-0.5">{s.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} className="text-neutral-900 fill-neutral-900" />
                        <span className="text-[10px] font-bold text-neutral-900">{s.rating}</span>
                        <span className="text-[10px] text-neutral-500">· {s.area}</span>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} className="text-neutral-400" />
                    </motion.div>
                  </div>

                  {/* Expanded body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-2.5 pb-3">
                          <div className="relative h-[140px] rounded-xl overflow-hidden bg-neutral-100">
                            <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                            <button aria-label="Save to wishlist" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center" data-testid={`heart-${s.id}`}>
                              <Heart size={13} className="text-white" strokeWidth={2.5} />
                            </button>
                            <p className="absolute left-2.5 bottom-2 text-white text-[10px] font-bold">{s.vibe}</p>
                          </div>
                          <div className="flex gap-1.5 mt-2.5">
                            <button className="flex-1 h-9 rounded-xl bg-neutral-100 text-neutral-900 text-[11px] font-bold" data-testid={`alts-${s.id}`}>See 4 alternatives</button>
                            <button className="px-3 h-9 rounded-xl bg-[#FFCC02] text-neutral-900 text-[11px] font-bold flex items-center gap-1 shadow-[0_4px_12px_-2px_rgba(255,204,2,0.5)]" data-testid={`lock-${s.id}`}>
                              <Lock size={11} strokeWidth={2.5} /> Lock
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Drag handle on hover/active state */}
                {isExpanded && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="absolute right-3 top-3.5 pointer-events-none">
                    <GripVertical size={12} className="text-neutral-500" />
                  </motion.div>
                )}

                {/* Insert "+" between cards */}
                {i < STOPS.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-full ml-14 my-1.5 flex items-center gap-2 group"
                    style={{ width: 'calc(100% - 56px)' }}
                    data-testid={`insert-after-${s.id}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white border border-dashed border-neutral-300 flex items-center justify-center shrink-0 -ml-[36px]">
                      <Plus size={10} className="text-neutral-400" strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-400 ml-2">Add a stop here</span>
                    <div className="flex-1 h-px border-t border-dashed border-neutral-200 ml-1" />
                  </motion.button>
                )}
              </div>
            );
          })}

          {/* End cap "+ add another stop" */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
            whileTap={{ scale: 0.985 }}
            className="relative w-full ml-14 mt-2 flex items-center gap-3 p-3 rounded-2xl border border-dashed border-neutral-300 text-left"
            style={{ width: 'calc(100% - 56px)' }}
            data-testid="add-end-stop"
          >
            <div className="absolute left-[28px] top-1/2 -translate-y-1/2 -ml-14 w-[18px] h-[18px] rounded-full bg-white border-2 border-dashed border-neutral-300 flex items-center justify-center">
              <Plus size={10} className="text-neutral-400" strokeWidth={2.5} />
            </div>
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Sparkles size={14} className="text-neutral-500" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-neutral-900 leading-tight">Add another stop</p>
              <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Walk · live music · late bite…</p>
            </div>
          </motion.button>
        </div>
      </div>

      <div className="h-[110px]" />

      {/* Sticky CTA */}
      <motion.div initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={spring} className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-4 bg-gradient-to-t from-white via-white to-white/0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] text-neutral-500 font-semibold">3 stops · ~4 hrs · Sukhumvit → Silom</p>
          <p className="text-[11px] text-neutral-500 font-semibold">1 of 3 locked</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} className="w-full h-[52px] rounded-2xl bg-gradient-to-b from-[#FFCC02] to-[#F5B800] text-neutral-900 font-bold text-[15px] shadow-[0_8px_24px_-6px_rgba(255,204,2,0.6)] flex items-center justify-center gap-2" data-testid="lock-all">
          <Lock size={15} strokeWidth={2.5} /> Lock in your night
        </motion.button>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Hybrid · Solo timeline</p>
    </div>
  );
}
