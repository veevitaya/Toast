import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, Star, MapPin, Check, Crown } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const FILTERS = ['🍜 Thai', '🍢 Street food', '฿฿', '🌶️ Spicy'];

const LEFT = {
  name: 'Pad Kra Pao', type: 'Thai · Street food', img: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=500&q=70',
  rating: '4.7', dist: '6 min', price: '฿฿', match: 94, crown: true,
};
const RIGHT = {
  name: 'Khao Soi', type: 'Thai · Noodles', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=70',
  rating: '4.6', dist: '11 min', price: '฿', match: 89, crown: false,
};

function Card({ data, side }: { data: typeof LEFT; side: 'l' | 'r' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'l' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={spring}
      className="flex-1 rounded-3xl overflow-hidden bg-white border border-black/[0.05]"
      style={{ boxShadow: data.crown ? '0 14px 34px -12px rgba(255,204,2,0.45)' : '0 6px 20px -10px rgba(0,0,0,0.12)' }}
      data-testid={`compare-${side}`}
    >
      <div className="relative h-[120px]">
        <img src={data.img} alt={data.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-extrabold text-neutral-900 flex items-center gap-1">
          <Star size={10} className="text-amber-500 fill-amber-500" />{data.rating}
        </div>
        {data.crown && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center shadow">
            <Crown size={12} className="text-neutral-900" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[15px] font-extrabold text-neutral-900 leading-tight truncate">{data.name}</p>
        <p className="text-[11px] text-neutral-500 truncate">{data.type}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-neutral-600">
          <span className="flex items-center gap-0.5"><MapPin size={10} className="text-neutral-400" />{data.dist}</span>
          <span>·</span><span>{data.price}</span>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div className="h-full rounded-full bg-[#FFCC02]" style={{ width: `${data.match}%` }} />
        </div>
        <p className="text-[10px] font-bold text-[#9A7400] mt-1">{data.match}% your taste</p>
      </div>
    </motion.div>
  );
}

export default function FiltersOnCompare() {
  const [open, setOpen] = useState(false);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-inline">
      <div className="h-[44px]" />

      {/* header */}
      <div className="px-5 pt-2 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <span className="text-[13px] font-extrabold text-neutral-800">This or that?</span>
        <div className="w-10 h-10" />
      </div>

      {/* sticky inline filter bar — the "quiz" lives here now */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button onClick={() => setOpen(!open)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full bg-neutral-900 text-white text-[12px] font-bold" data-testid="button-filters">
            <SlidersHorizontal size={13} /> Filters
          </button>
          {FILTERS.map((f) => (
            <span key={f} className="flex-shrink-0 px-3 py-2 rounded-full bg-[#FFF6DA] border border-[#FFCC02]/60 text-[12px] font-bold text-[#9A7400]">{f}</span>
          ))}
        </div>
      </div>

      {/* expandable quick-filter sheet (optional) */}
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 mt-2">
          <div className="rounded-2xl bg-white border border-black/[0.06] p-3 shadow-[0_6px_20px_-10px_rgba(0,0,0,0.12)]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Narrow it down</p>
            <div className="flex flex-wrap gap-2">
              {['Cheaper', 'Closer', 'Less spicy', 'Sit-down', 'Top rated'].map((c, i) => (
                <span key={c} className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${i === 1 ? 'bg-[#FFCC02] text-neutral-900' : 'bg-neutral-100 text-neutral-600'}`}>{c}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* heading */}
      <div className="px-5 mt-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#C79200]">Top 2 for your mood</p>
        <h1 className="text-[22px] font-extrabold text-neutral-900 leading-tight mt-0.5">Pick a winner</h1>
      </div>

      {/* the compare-2-options function, reached instantly */}
      <div className="px-4 mt-4 flex gap-3 items-stretch">
        <Card data={LEFT} side="l" />
        <Card data={RIGHT} side="r" />
      </div>

      {/* center VS */}
      <div className="relative -mt-[210px] flex justify-center pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg">
          <span className="text-[12px] font-extrabold text-white">VS</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* pick bar */}
      <div className="px-5 pb-8 pt-3 flex gap-3">
        <button className="flex-1 h-13 py-3.5 rounded-2xl bg-white border border-neutral-200 text-[14px] font-extrabold text-neutral-700" data-testid="button-shuffle">Shuffle 2 more</button>
        <button className="flex-1 h-13 py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[14px] font-extrabold flex items-center justify-center gap-1.5" style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }} data-testid="button-pick-left">
          <Check size={16} strokeWidth={3} /> Pick Pad Kra Pao
        </button>
      </div>
    </div>
  );
}
