import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, Lock, Star, Plus, X, TreePine, Coffee, Music, Cake, ChevronDown, Heart } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const TIMELINE = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', time: '7:30 PM', rating: 4.86, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&auto=format&fit=crop&q=80', locked: true },
  { id: 'drinks', label: 'Drinks', name: 'Vertigo · 60F', time: '9:15 PM', rating: 4.92, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&auto=format&fit=crop&q=80', locked: true },
  // INSERT POINT
  { id: 'dessert', label: 'Dessert', name: 'After You', time: '11:00 PM', rating: 4.78, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80', locked: false },
];

const TYPES = [
  { id: 'walk', label: 'Walk', icon: TreePine },
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'music', label: 'Live music', icon: Music },
  { id: 'sweet', label: 'Late bite', icon: Cake },
];

const SUGGESTIONS = [
  { id: 's1', name: 'Lumphini Park loop', area: 'Silom · 8 min', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=80', rating: 4.81, vibe: 'Calm walk · 30 min' },
  { id: 's2', name: 'Asok Skywalk', area: 'Sukhumvit · 4 min', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&auto=format&fit=crop&q=80', rating: 4.65, vibe: 'City lights · 20 min' },
  { id: 's3', name: 'Benchakitti Park', area: 'Klong Toei · 12 min', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=80', rating: 4.88, vibe: 'Lake view · 40 min' },
];

export default function HybridAdd() {
  const [activeType, setActiveType] = useState('walk');

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="hybrid-add">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <p className="text-[12px] font-bold text-neutral-900">Add a stop</p>
        <button aria-label="Close" data-testid="button-close" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <X size={14} className="text-neutral-900" strokeWidth={2.5} />
        </button>
      </div>

      {/* Header */}
      <div className="px-5 mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">Between Drinks & Dessert</p>
        <h1 className="text-[22px] font-bold text-neutral-900 leading-[1.15] mt-1 tracking-[-0.01em]">What's in the gap?</h1>
        <p className="text-[12px] text-neutral-500 mt-1">~1h 45m before dessert · easy to slip something in</p>
      </div>

      {/* Compact timeline showing insertion */}
      <div className="px-5 mt-4 relative">
        <div className="absolute left-[28px] top-[18px] bottom-[18px] w-px bg-gradient-to-b from-[#FFCC02] via-amber-300 to-amber-200/60" />

        <div className="space-y-1.5">
          {/* Above */}
          {TIMELINE.slice(0, 2).map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 0.55, y: 0 }} transition={{ ...spring, delay: i * 0.05 }} className="relative">
              <div className="absolute left-[20px] top-[16px] w-[18px] h-[18px] rounded-full bg-[#FFCC02] flex items-center justify-center z-10">
                <Lock size={9} className="text-neutral-900" strokeWidth={3} />
              </div>
              <div className="ml-12 flex items-center gap-2 p-2 rounded-xl bg-neutral-50">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label} · {s.time}</p>
                  <p className="text-[12px] font-bold text-neutral-700 truncate">{s.name}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Insertion zone — alive */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring}
            className="relative my-2"
          >
            <div className="absolute left-[20px] top-[14px] w-[18px] h-[18px] rounded-full bg-white border-2 border-[#FFCC02] flex items-center justify-center z-10 shadow-[0_0_0_4px_rgba(255,204,2,0.18)]">
              <Plus size={11} className="text-[#FFCC02]" strokeWidth={3} />
            </div>
            <div className="ml-12 p-3 rounded-2xl bg-amber-50/70 border border-dashed border-[#FFCC02]/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#B58900]">Inserting here</p>
              <p className="text-[14px] font-bold text-neutral-900 leading-tight mt-0.5">~10:00 PM · between drinks & dessert</p>
            </div>
          </motion.div>

          {/* Below */}
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 0.55, y: 0 }} transition={{ ...spring, delay: 0.15 }} className="relative">
            <div className="absolute left-[20px] top-[16px] w-[18px] h-[18px] rounded-full bg-white border-2 border-[#FFCC02] z-10" />
            <div className="ml-12 flex items-center gap-2 p-2 rounded-xl bg-neutral-50">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                <img src={TIMELINE[2].img} alt={TIMELINE[2].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{TIMELINE[2].label} · {TIMELINE[2].time}</p>
                <p className="text-[12px] font-bold text-neutral-700 truncate">{TIMELINE[2].name}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Type chips */}
      <div className="mt-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 px-5 pr-8">
          {TYPES.map((t, i) => {
            const Icon = t.icon;
            const active = activeType === t.id;
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: 0.2 + i * 0.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveType(t.id)}
                className={`shrink-0 h-10 px-3.5 rounded-full text-[12px] font-bold border flex items-center gap-1.5 ${active ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'}`}
                data-testid={`type-${t.id}`}
              >
                <Icon size={13} strokeWidth={2.3} />
                {t.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Suggestions carousel */}
      <div className="mt-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 px-5 pr-8">
          <AnimatePresence mode="popLayout">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ...spring, delay: 0.3 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                className="shrink-0 w-[200px] text-left bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                data-testid={`suggest-${s.id}`}
              >
                <div className="relative h-[140px] bg-neutral-100">
                  <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                  <button aria-label="Save" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
                    <Heart size={12} className="text-white" strokeWidth={2.5} />
                  </button>
                </div>
                <div className="p-2.5">
                  <p className="text-[12px] font-bold text-neutral-900 truncate leading-tight">{s.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={9} className="text-neutral-900 fill-neutral-900" />
                    <span className="text-[10px] font-bold text-neutral-900">{s.rating}</span>
                    <span className="text-[10px] text-neutral-500">· {s.area}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">{s.vibe}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-5 mt-3">
        <button className="w-full text-center text-[12px] font-bold text-neutral-700 underline underline-offset-2 py-2 flex items-center justify-center gap-1" data-testid="more-options">
          More options <ChevronDown size={12} strokeWidth={2.5} />
        </button>
      </div>

      <div className="h-[100px]" />

      <motion.div initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.4 }} className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-3 bg-gradient-to-t from-white via-white to-white/0">
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} className="px-5 h-[50px] rounded-2xl bg-white border border-neutral-200 text-neutral-900 font-bold text-[13px]" data-testid="skip-add">Skip</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-[50px] rounded-2xl bg-gradient-to-b from-[#FFCC02] to-[#F5B800] text-neutral-900 font-bold text-[14px] shadow-[0_8px_24px_-6px_rgba(255,204,2,0.6)] flex items-center justify-center gap-2" data-testid="confirm-add">
            <Plus size={14} strokeWidth={3} /> Add Lumphini walk
          </motion.button>
        </div>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Hybrid · Insert mid-timeline</p>
    </div>
  );
}
