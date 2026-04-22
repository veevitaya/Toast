import { motion } from 'framer-motion';
import { Lock, Star, Check, Share2, MessageCircle, Calendar, Sparkles, MapPin } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const STOPS = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', area: 'Sukhumvit 38', time: '7:30 PM', rating: 4.86, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80' },
  { id: 'drinks', label: 'Drinks', name: 'Vertigo · 60F', area: 'Banyan Tree', time: '9:15 PM', rating: 4.92, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&auto=format&fit=crop&q=80' },
  { id: 'dessert', label: 'Dessert', name: 'After You', area: 'Thonglor 13', time: '10:45 PM', rating: 4.78, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80' },
  { id: 'walk', label: 'Walk', name: 'Lumphini Park', area: 'Silom', time: '11:30 PM', rating: 4.81, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=80' },
];

export default function HybridLocked() {
  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="hybrid-locked">
      <div className="h-[44px]" />

      {/* Header */}
      <div className="px-5">
        <motion.div initial={{ opacity: 0, y: -4, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 shadow-[0_6px_18px_-4px_rgba(255,204,2,0.4)]">
          <Lock size={11} className="text-[#FFCC02]" strokeWidth={2.5} />
          <span className="text-[11px] font-bold text-white">Locked · Tonight</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.05 }} className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">Your night</p>
          <h1 className="text-[26px] font-bold text-neutral-900 leading-[1.1] tracking-[-0.015em] mt-1">It's locked in.<br/><span className="bg-gradient-to-r from-[#FFCC02] to-orange-400 bg-clip-text text-transparent">Have a good one.</span></h1>
        </motion.div>
      </div>

      {/* 4-up collage hero */}
      <div className="px-5 mt-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }} className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden h-[140px]">
          {STOPS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.15 + i * 0.04 }}
              className="relative bg-neutral-100 overflow-hidden"
            >
              <motion.img
                src={s.img}
                alt={s.name}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: 6, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <p className="absolute left-1.5 bottom-1 text-white text-[8px] font-bold uppercase tracking-wider">{s.label} · {s.time}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Locked timeline (collapsed mode, all green-checked) */}
      <div className="px-5 mt-5 relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-2.5">Your night, stop by stop</p>
        <div className="absolute left-[28px] top-[44px] bottom-[18px] w-px bg-gradient-to-b from-[#FFCC02] via-amber-300 to-amber-200/60" />

        <div className="space-y-1.5">
          {STOPS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.2 + i * 0.05 }}
              className="relative"
            >
              <div className="absolute left-[20px] top-[18px] w-[18px] h-[18px] rounded-full bg-[#FFCC02] flex items-center justify-center z-10">
                <Check size={10} className="text-neutral-900" strokeWidth={3} />
              </div>
              <div className="ml-12 flex items-center gap-3 p-2.5 rounded-xl bg-white border border-neutral-100">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label} · {s.time}</p>
                  <p className="text-[12px] font-bold text-neutral-900 truncate leading-tight">{s.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={9} className="text-neutral-900 fill-neutral-900" />
                    <span className="text-[10px] font-bold text-neutral-900">{s.rating}</span>
                    <span className="text-[10px] text-neutral-500">· <MapPin size={8} className="inline -mt-px" /> {s.area}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vibe summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50/70"
        >
          <Sparkles size={13} className="text-[#FFCC02] shrink-0" />
          <p className="text-[11px] text-neutral-700 leading-tight">
            <span className="font-bold text-neutral-900">Warm · social · ~4 hrs</span> · Light walk between dessert and the park
          </p>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.55 }}
          className="grid grid-cols-2 gap-2 mt-2.5"
        >
          <button className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-neutral-100 text-neutral-900 text-[11px] font-bold" data-testid="add-calendar">
            <Calendar size={12} strokeWidth={2.5} /> Add to calendar
          </button>
          <button className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-neutral-100 text-neutral-900 text-[11px] font-bold" data-testid="get-directions">
            <MapPin size={12} strokeWidth={2.5} /> Open in maps
          </button>
        </motion.div>
      </div>

      <div className="h-[110px]" />

      {/* Sticky CTA */}
      <motion.div initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.4 }} className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-3 bg-gradient-to-t from-white via-white to-white/0">
        <p className="text-[10px] text-neutral-500 text-center mb-2 font-semibold">Reminder set · We'll ping you 30 min before each stop</p>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-[50px] rounded-2xl bg-white border border-neutral-200 text-neutral-900 font-bold text-[13px] flex items-center justify-center gap-2" data-testid="button-share">
            <Share2 size={13} strokeWidth={2.5} /> Share
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} className="flex-[1.6] h-[50px] rounded-2xl bg-neutral-900 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)]" data-testid="button-line">
            <MessageCircle size={14} strokeWidth={2.5} className="text-[#FFCC02]" /> Send to LINE
          </motion.button>
        </div>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Hybrid · Locked</p>
    </div>
  );
}
