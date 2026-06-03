import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, MapPin, Check, Heart, Sparkles } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 300, damping: 28 };

const PICKS = [
  {
    id: 'p1',
    name: 'Som Tam Nua',
    cuisine: 'Thai · Isaan',
    img: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=70',
    price: '฿฿',
    dist: '8 min',
    rating: '4.7',
    why: 'Spicy + quick',
    toast: true,
  },
  {
    id: 'p2',
    name: 'Baan Phadthai',
    cuisine: 'Thai · Noodles',
    img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=70',
    price: '฿฿',
    dist: '12 min',
    rating: '4.6',
    why: 'Cozy classic',
    toast: false,
  },
  {
    id: 'p3',
    name: 'Err Urban Rustic',
    cuisine: 'Thai · Modern',
    img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=70',
    price: '฿฿฿',
    dist: '15 min',
    rating: '4.8',
    why: 'A bit fancier',
    toast: false,
  },
];

export default function CompareTray() {
  const [picked, setPicked] = useState('p1');

  return (
    <div className="toast-more w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FDF8F0' }} data-testid="flow-compare">
      <div className="h-[44px]" />

      {/* Top bar */}
      <div className="px-5 flex items-center justify-between">
        <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <ChevronLeft size={17} className="text-neutral-700" />
        </button>
        <span className="text-[13px] font-bold text-neutral-800">Compare top spots</span>
        <div className="w-9 h-9" />
      </div>

      {/* Header */}
      <div className="px-6 mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0A800]">Still on the same screen</p>
        <h1 className="text-[22px] font-extrabold text-neutral-900 leading-tight mt-1">Three that fit your mood</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Slide across, weigh them up, tap to lock one in.</p>
      </div>

      {/* Compare cards row */}
      <div className="mt-5 px-5 flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {PICKS.map((p, i) => {
          const active = picked === p.id;
          return (
            <motion.button
              key={p.id}
              onClick={() => setPicked(p.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, ...spring }}
              whileTap={{ scale: 0.97 }}
              className={`flex-shrink-0 w-[154px] rounded-3xl overflow-hidden text-left bg-white transition-all ${active ? 'ring-2 ring-[#FFCC02]' : 'ring-1 ring-neutral-200/70'}`}
              style={{ boxShadow: active ? '0 14px 34px -10px rgba(255,204,2,0.5)' : '0 6px 20px -10px rgba(0,0,0,0.12)' }}
              data-testid={`compare-card-${p.id}`}
            >
              <div className="relative h-[104px]">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                {p.toast && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFCC02] shadow">
                    <Sparkles size={9} className="text-neutral-900" />
                    <span className="text-[9px] font-extrabold text-neutral-900 uppercase tracking-wide">Toast pick</span>
                  </div>
                )}
                {active && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center shadow">
                    <Check size={13} className="text-neutral-900" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-[14px] font-extrabold text-neutral-900 leading-tight truncate">{p.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{p.cuisine}</p>

                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">Rating</span>
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-neutral-800"><Star size={10} className="text-amber-500 fill-amber-500" />{p.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">Walk</span>
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-neutral-800"><MapPin size={10} className="text-neutral-400" />{p.dist}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">Price</span>
                    <span className="text-[11px] font-bold text-neutral-800">{p.price}</span>
                  </div>
                </div>

                <div className="mt-2.5 inline-flex px-2 py-1 rounded-lg bg-[#FFF6D6]">
                  <span className="text-[10px] font-bold text-[#9A7400]">{p.why}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Sticky decision bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...spring }}
        className="px-5 pb-8 pt-4 bg-gradient-to-t from-[#FDF8F0] via-[#FDF8F0] to-transparent"
      >
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-2xl bg-white ring-1 ring-neutral-200 flex items-center justify-center" data-testid="button-save">
            <Heart size={18} className="text-neutral-400" />
          </button>
          <button
            className="flex-1 h-12 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[15px] font-extrabold flex items-center justify-center gap-2"
            style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }}
            data-testid="button-lock-in"
          >
            <Check size={17} strokeWidth={3} /> Lock in {PICKS.find((p) => p.id === picked)?.name.split(' ')[0]}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
