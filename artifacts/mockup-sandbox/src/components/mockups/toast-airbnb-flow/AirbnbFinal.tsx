import { motion } from 'framer-motion';
import { Check, Star, MapPin, Share2, Calendar, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const STOPS = [
  { id: 'd1', label: 'Dinner', name: 'Som Tam Nua', area: 'Sukhumvit 38', time: '7:30 PM', rating: 4.86, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80' },
  { id: 'd2', label: 'Drinks', name: 'Vertigo · 60F', area: 'Banyan Tree', time: '9:15 PM', rating: 4.92, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&auto=format&fit=crop&q=80' },
  { id: 'd3', label: 'Dessert', name: 'After You', area: 'Thonglor 13', time: '10:45 PM', rating: 4.78, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80' },
  { id: 'd4', label: 'Walk', name: 'Lumphini Park', area: 'Silom', time: '11:30 PM', rating: 4.81, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=80' },
];

export default function AirbnbFinal() {
  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="airbnb-flow-final">
      <div className="h-[44px]" />

      {/* Confirmation header */}
      <div className="px-5">
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="w-12 h-12 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(255,204,2,0.55)]">
          <Check size={22} className="text-neutral-900" strokeWidth={3} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }} className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">Tonight · 7:30 PM</p>
          <h1 className="text-[28px] font-bold text-neutral-900 leading-[1.1] tracking-[-0.015em] mt-1.5">You're set,<br/>Khun Alex.</h1>
          <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">Four stops, perfectly paced from Sukhumvit to Silom. We'll remind you 30 min before each.</p>
        </motion.div>
      </div>

      {/* Photo collage hero — 4-up grid */}
      <div className="px-5 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.15 }}
          className="grid grid-cols-2 gap-1.5 rounded-[20px] overflow-hidden h-[180px]"
        >
          {STOPS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.2 + i * 0.05 }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute left-2 bottom-1.5 right-2 text-white">
                <p className="text-[8px] font-bold uppercase tracking-wider opacity-90">{s.label} · {s.time}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Itinerary list - Airbnb reservation card style */}
      <div className="px-5 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-2.5">Your night, stop by stop</p>
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          {STOPS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.3 + i * 0.05 }}
              className={`relative flex items-center gap-3 p-3 ${i < STOPS.length - 1 ? 'border-b border-neutral-100' : ''}`}
            >
              {/* Timeline dot */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-[#FFCC02] ring-4 ring-[#FFCC02]/15" />
                {i < STOPS.length - 1 && <div className="absolute top-3 w-px h-[58px] border-l border-dashed border-neutral-300" />}
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label} · {s.time}</p>
                <p className="text-[13px] font-bold text-neutral-900 truncate leading-tight mt-0.5">{s.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={9} className="text-neutral-900 fill-neutral-900" />
                  <span className="text-[10px] font-bold text-neutral-900">{s.rating}</span>
                  <span className="text-[10px] text-neutral-500">· <MapPin size={8} className="inline -mt-px" /> {s.area}</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-neutral-400 shrink-0" />
            </motion.div>
          ))}
        </div>

        {/* Vibe summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.55 }}
          className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50/70"
        >
          <Sparkles size={14} className="text-[#FFCC02] shrink-0" />
          <p className="text-[12px] text-neutral-700 leading-tight">
            <span className="font-bold text-neutral-900">Warm · social · ~4 hrs.</span> Light walk between dessert and the park.
          </p>
        </motion.div>

        {/* Quick actions row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.65 }}
          className="mt-3 grid grid-cols-2 gap-2"
        >
          <button className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-neutral-100 text-neutral-900 text-[12px] font-bold" data-testid="button-calendar">
            <Calendar size={13} strokeWidth={2.5} /> Add to calendar
          </button>
          <button className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-neutral-100 text-neutral-900 text-[12px] font-bold" data-testid="button-share-night">
            <Share2 size={13} strokeWidth={2.5} /> Share night
          </button>
        </motion.div>
      </div>

      <div className="h-[110px]" />

      {/* Sticky bottom CTA */}
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.4 }}
        className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-4 bg-gradient-to-t from-white via-white to-white/0"
      >
        <p className="text-[11px] text-neutral-500 text-center mb-2.5 font-semibold">Reminder set · We'll ping you at 7:00 PM</p>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-[52px] rounded-2xl bg-white border border-neutral-200 text-neutral-900 font-bold text-[14px] flex items-center justify-center gap-2"
            data-testid="button-share"
          >
            <Share2 size={14} strokeWidth={2.5} /> Share
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-[1.6] h-[52px] rounded-2xl bg-neutral-900 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)]"
            data-testid="button-line"
          >
            <MessageCircle size={14} strokeWidth={2.5} className="text-[#FFCC02]" /> Send to LINE
          </motion.button>
        </div>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Airbnb DNA · Final</p>
    </div>
  );
}
