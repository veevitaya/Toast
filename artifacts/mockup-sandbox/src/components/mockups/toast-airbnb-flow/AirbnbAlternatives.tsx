import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Star, MapPin, Sparkles } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const ALTS = [
  { id: 'vertigo', name: 'Vertigo · 60F', area: 'Banyan Tree · Sathorn', rating: 4.92, reviews: 2814, vibe: 'Skyline · Date night', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80', price: '฿฿฿', minutes: 12 },
  { id: 'tep', name: 'Tep Bar', area: 'Chinatown', rating: 4.78, reviews: 1402, vibe: 'Live Thai music', img: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop&q=80', price: '฿฿', minutes: 22 },
  { id: 'rabbit', name: 'Rabbit Hole', area: 'Thonglor 13', rating: 4.85, reviews: 1980, vibe: 'Speakeasy · Cocktails', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80', price: '฿฿฿', minutes: 8 },
  { id: 'tichuca', name: 'Tichuca', area: 'T-One Sukhumvit 40', rating: 4.71, reviews: 3250, vibe: 'Rooftop · Tropical', img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&auto=format&fit=crop&q=80', price: '฿฿฿', minutes: 6 },
];

const FILTERS = ['Cocktails', 'Wine', 'Live music', 'Rooftop', 'Skip drinks'];

export default function AirbnbAlternatives() {
  const [picked, setPicked] = useState('vertigo');
  const [hearts, setHearts] = useState<Record<string, boolean>>({ vertigo: true });

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="airbnb-flow-alternatives">
      <div className="h-[44px]" />

      {/* Top bar */}
      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">Stop 2 of 3</p>
          <p className="text-[13px] font-bold text-neutral-900 -mt-0.5">Drinks</p>
        </div>
        <button className="text-[12px] font-bold text-neutral-900 underline underline-offset-2" data-testid="button-skip">Skip</button>
      </div>

      {/* Hero header */}
      <div className="px-5 mt-5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">Picked for tonight</p>
          <h1 className="text-[26px] font-bold text-neutral-900 leading-[1.12] mt-1.5 tracking-[-0.01em]">Where do you<br/>want to wind down?</h1>
          <p className="text-[13px] text-neutral-500 mt-2">4 spots near your dinner · all open till late</p>
        </motion.div>
      </div>

      {/* Filter pills */}
      <div className="mt-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 px-5 pr-8">
          {FILTERS.map((f, i) => (
            <motion.button
              key={f}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 h-9 px-4 rounded-full text-[12px] font-bold border ${i === 0 ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'}`}
              data-testid={`filter-${f.toLowerCase().replace(' ', '-')}`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Listing cards — Airbnb style */}
      <div className="mt-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 px-5 pr-8">
          {ALTS.map((a, i) => {
            const active = picked === a.id;
            return (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.15 + i * 0.06 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setPicked(a.id)}
                className="shrink-0 w-[268px] text-left"
                data-testid={`card-${a.id}`}
              >
                <div className={`relative h-[300px] rounded-[20px] overflow-hidden bg-neutral-100 transition-shadow ${active ? 'ring-2 ring-neutral-900 shadow-[0_12px_28px_-10px_rgba(0,0,0,0.18)]' : 'shadow-[0_4px_14px_rgba(0,0,0,0.06)]'}`}>
                  <motion.img
                    src={a.img}
                    alt={a.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{ scale: active ? 1.05 : 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  <button
                    aria-label="Add to wishlist"
                    onClick={(e) => { e.stopPropagation(); setHearts(h => ({ ...h, [a.id]: !h[a.id] })); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center"
                    data-testid={`heart-${a.id}`}
                  >
                    <motion.span animate={{ scale: hearts[a.id] ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.4 }}>
                      <Heart size={14} className={hearts[a.id] ? 'text-[#FF385C] fill-[#FF385C]' : 'text-white'} strokeWidth={2.5} />
                    </motion.span>
                  </button>

                  <div className="absolute left-2.5 top-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur flex items-center gap-1">
                    <Sparkles size={9} className="text-[#FFCC02]" />
                    <span className="text-[10px] font-bold text-neutral-900">Match {95 - i * 4}%</span>
                  </div>

                  {active && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute right-2.5 bottom-2.5 px-2.5 py-1 rounded-full bg-[#FFCC02] text-neutral-900 text-[11px] font-bold shadow-[0_4px_14px_-2px_rgba(255,204,2,0.6)]">
                      Selected
                    </motion.div>
                  )}
                </div>

                <div className="px-1 mt-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-bold text-neutral-900 leading-tight">{a.name}</p>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star size={11} className="text-neutral-900 fill-neutral-900" />
                      <span className="text-[12px] font-bold text-neutral-900">{a.rating}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} />{a.area}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-neutral-700 font-semibold">{a.vibe}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{a.price} · {a.minutes} min from dinner · {a.reviews} reviews</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="h-[110px]" />

      {/* Sticky bottom CTA */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-4 bg-gradient-to-t from-white via-white to-white/0"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-[11px] text-neutral-500 font-semibold">Continue with</p>
            <p className="text-[14px] font-bold text-neutral-900 leading-tight">{ALTS.find(a => a.id === picked)?.name}</p>
          </div>
          <p className="text-[11px] text-neutral-500 font-semibold">Stop 2 of 3</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} className="w-full h-[52px] rounded-2xl bg-neutral-900 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)]" data-testid="button-continue">
          Continue
          <span className="text-[#FFCC02]">→</span>
        </motion.button>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Airbnb DNA · Alternatives</p>
    </div>
  );
}
