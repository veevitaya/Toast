import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Star, MapPin, ChevronUp, Heart, Sparkles, RotateCcw, Clock } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const STOPS = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', area: 'Sukhumvit 38', time: '7:30 PM', rating: 4.86, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', locked: true, expanded: false },
  { id: 'drinks', label: 'Drinks', name: 'Vertigo · 60F', area: 'Banyan Tree, Sathorn', time: '9:15 PM', rating: 4.92, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80', locked: false, expanded: true, vibe: 'Skyline · Date night', why: 'Open-air rooftop with the city lit up below — slow walk from your dinner.', alts: 4, distance: '12 min away', price: '฿฿฿', reviews: 2814 },
  { id: 'dessert', label: 'Dessert', name: 'After You', area: 'Thonglor 13', time: '10:45 PM', rating: 4.78, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80', locked: false, expanded: false },
];

export default function HybridExpand() {
  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="hybrid-expand">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <p className="text-[12px] font-bold text-neutral-900">Your night</p>
        <button className="text-[12px] font-bold text-neutral-900 underline underline-offset-2" data-testid="button-edit">Edit</button>
      </div>

      <div className="px-5 mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">Stop 2 — drinks</p>
        <h1 className="text-[24px] font-bold text-neutral-900 leading-[1.12] mt-1 tracking-[-0.01em]">Why we picked this spot</h1>
      </div>

      {/* Timeline with expand */}
      <div className="px-5 mt-5 relative">
        <div className="absolute left-[28px] top-[18px] bottom-[18px] w-px bg-gradient-to-b from-[#FFCC02] via-amber-300 to-amber-200/60" />

        <div className="space-y-2">
          {STOPS.map((s, i) => {
            return (
              <div key={s.id} className="relative">
                <motion.div
                  layout
                  initial={false}
                  className={`absolute left-[20px] top-[20px] w-[18px] h-[18px] rounded-full flex items-center justify-center z-10 ${s.locked ? 'bg-[#FFCC02]' : s.expanded ? 'bg-neutral-900' : 'bg-white border-2 border-[#FFCC02]'}`}
                >
                  {s.locked && <Lock size={9} className="text-neutral-900" strokeWidth={3} />}
                  {s.expanded && <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC02]" />}
                </motion.div>

                <motion.div
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.05 + i * 0.05 }}
                  className={`ml-12 bg-white rounded-2xl border overflow-hidden ${s.expanded ? 'border-neutral-900 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.2)]' : 'border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}
                >
                  {/* Header row */}
                  <div className={`flex items-center gap-3 p-2.5 ${s.expanded ? 'pb-1.5' : ''}`}>
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
                    {s.expanded ? (
                      <ChevronUp size={14} className="text-neutral-700" />
                    ) : (
                      <span className="text-[10px] font-bold text-neutral-400 px-2 py-1">Tap to open</span>
                    )}
                  </div>

                  {/* Expanded body */}
                  {s.expanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="px-2.5 pb-3"
                    >
                      <div className="relative h-[180px] rounded-2xl overflow-hidden bg-neutral-100">
                        <motion.img
                          src={s.img}
                          alt={s.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1.0 }}
                          transition={{ duration: 6, ease: 'easeOut' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                        <button aria-label="Save to wishlist" className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center" data-testid={`heart-${s.id}`}>
                          <Heart size={14} className="text-white" strokeWidth={2.5} />
                        </button>
                        <div className="absolute left-3 top-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur flex items-center gap-1">
                          <Sparkles size={9} className="text-[#FFCC02]" />
                          <span className="text-[10px] font-bold text-neutral-900">95% match</span>
                        </div>
                        <div className="absolute left-3 bottom-3 right-3 text-white">
                          <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{s.vibe}</p>
                          <p className="text-[12px] mt-0.5 leading-tight">{s.price} · {s.distance} · {s.reviews} reviews</p>
                        </div>
                      </div>

                      <p className="text-[12px] text-neutral-600 leading-snug mt-3 px-1">"{s.why}"</p>

                      <div className="flex flex-wrap gap-1.5 mt-3 px-1">
                        {['Skyline view', 'Cocktails', 'Live DJ', '21+'].map(t => (
                          <span key={t} className="px-2 py-1 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-700">{t}</span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 px-1 text-[10px] text-neutral-500">
                        <Clock size={11} /> Walking time from dinner: 12 min
                      </div>

                      <div className="flex gap-1.5 mt-3">
                        <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-10 rounded-xl bg-white border border-neutral-200 text-neutral-900 text-[12px] font-bold flex items-center justify-center gap-1.5" data-testid="see-alts">
                          <RotateCcw size={11} strokeWidth={2.5} /> See {s.alts} alternatives
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-10 rounded-xl bg-[#FFCC02] text-neutral-900 text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_12px_-2px_rgba(255,204,2,0.5)]" data-testid="lock-stop">
                          <Lock size={11} strokeWidth={2.5} /> Lock this stop
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-[80px]" />

      {/* Mini progress bottom */}
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.3 }} className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-3 bg-gradient-to-t from-white via-white to-white/0">
        <div className="flex items-center gap-2 mb-2 justify-center">
          {STOPS.map((s, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${s.locked ? 'w-8 bg-[#FFCC02]' : s.expanded ? 'w-12 bg-neutral-900' : 'w-6 bg-neutral-200'}`} />
          ))}
        </div>
        <p className="text-center text-[11px] text-neutral-500 font-semibold">Stop 2 of 3 · expanded</p>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Hybrid · Expand</p>
    </div>
  );
}
