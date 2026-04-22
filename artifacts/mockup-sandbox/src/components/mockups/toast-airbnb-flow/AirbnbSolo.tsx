import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Heart, Lock, Plus, ChevronRight, Star, GripHorizontal } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const HERO = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&auto=format&fit=crop&q=80';
const STOPS = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', area: 'Sukhumvit 38', time: '7:30 PM', rating: 4.86, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', locked: true },
  { id: 'drinks', label: 'Drinks', name: 'Vertigo · 60F', area: 'Banyan Tree', time: '9:15 PM', rating: 4.92, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&auto=format&fit=crop&q=80', locked: false },
  { id: 'dessert', label: 'Dessert', name: 'After You', area: 'Thonglor 13', time: '10:45 PM', rating: 4.78, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80', locked: false },
];

export default function AirbnbSolo() {
  const [active, setActive] = useState<string | null>('drinks');

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="airbnb-flow-solo">
      <div className="h-[44px]" />

      {/* Search pill */}
      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="flex items-center gap-3 bg-white rounded-full pl-5 pr-2 py-2 shadow-[0_4px_18px_rgba(0,0,0,0.07)] border border-neutral-100"
          data-testid="search-pill"
        >
          <Search size={16} className="text-neutral-900" strokeWidth={2.5} />
          <div className="flex-1">
            <p className="text-[13px] font-bold text-neutral-900 leading-tight">Tonight in Bangkok</p>
            <p className="text-[11px] text-neutral-500 leading-tight">Solo · 3 stops · ~4 hrs</p>
          </div>
          <button aria-label="Profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 to-orange-300" data-testid="button-profile" />
        </motion.div>
      </div>

      {/* Hero photo */}
      <div className="px-5 mt-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.05 }}
          className="relative h-[220px] rounded-[20px] overflow-hidden bg-neutral-100"
        >
          <motion.img
            src={HERO}
            alt="Bangkok skyline at night"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <button aria-label="Save to wishlist" className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center" data-testid="button-wishlist">
            <Heart size={16} className="text-white" strokeWidth={2.5} />
          </button>
          <div className="absolute left-4 bottom-4 right-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-80">Your night</p>
            <p className="text-[22px] font-bold leading-[1.15] mt-1">A warm Thursday<br/>across Sukhumvit</p>
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
            <Star size={10} className="text-neutral-900 fill-neutral-900" />
            <span className="text-[11px] font-bold text-neutral-900">4.86</span>
            <span className="text-[11px] text-neutral-500">· 1.2k</span>
          </div>
        </motion.div>
      </div>

      {/* Stops list — Airbnb listing-card style */}
      <div className="px-5 mt-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">Your stops</p>
            <p className="text-[18px] font-bold text-neutral-900 leading-tight mt-0.5">3 spots, perfectly paced</p>
          </div>
          <button className="text-[12px] font-semibold text-neutral-900 underline underline-offset-2" data-testid="button-edit-route">Edit</button>
        </div>

        <div className="space-y-2.5">
          {STOPS.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.05 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setActive(s.id)}
              className={`w-full text-left flex items-center gap-3 p-2.5 rounded-2xl bg-white border transition-colors ${active === s.id ? 'border-neutral-900' : 'border-neutral-100'}`}
              data-testid={`stop-${s.id}`}
            >
              <div className="relative w-[58px] h-[58px] rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                {s.locked && (
                  <div className="absolute inset-0 bg-neutral-900/30 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center">
                      <Lock size={11} className="text-neutral-900" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
                  <span className="text-[10px] font-semibold text-neutral-500">{s.time}</span>
                </div>
                <p className="text-[14px] font-bold text-neutral-900 truncate leading-tight mt-0.5">{s.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={9} className="text-neutral-900 fill-neutral-900" />
                  <span className="text-[11px] font-semibold text-neutral-900">{s.rating}</span>
                  <span className="text-[11px] text-neutral-500">· {s.area}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-neutral-400 shrink-0" />
            </motion.button>
          ))}

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.28 }}
            whileTap={{ scale: 0.985 }}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-neutral-300 text-left"
            data-testid="button-add-stop"
          >
            <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
              <Plus size={16} className="text-neutral-700" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-neutral-900 leading-tight">Add another stop</p>
              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">Walk · late bite · live music…</p>
            </div>
          </motion.button>
        </div>
      </div>

      <div className="h-[100px]" />

      {/* Floating CTA */}
      <AnimatePresence>
        <motion.div
          key="cta"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={spring}
          className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-3 bg-gradient-to-t from-white via-white to-white/0"
        >
          <div className="flex items-center justify-center mb-2">
            <GripHorizontal size={18} className="text-neutral-300" />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full h-[52px] rounded-2xl bg-gradient-to-b from-[#FFCC02] to-[#F5B800] text-neutral-900 font-bold text-[15px] shadow-[0_8px_24px_-6px_rgba(255,204,2,0.65)] flex items-center justify-center gap-2"
            data-testid="button-lock-flow"
          >
            <Lock size={15} strokeWidth={2.5} />
            Lock in your night
            <span className="ml-1.5 text-[11px] font-semibold opacity-70">· Hold to confirm</span>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Airbnb DNA · Solo</p>
    </div>
  );
}
