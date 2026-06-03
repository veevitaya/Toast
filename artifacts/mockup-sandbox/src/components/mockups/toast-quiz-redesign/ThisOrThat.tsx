import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Flame } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const TOP = { name: 'Pad Kra Pao', type: 'Thai · Street', rating: '4.7', img: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&q=70' };
const BOT = { name: 'Khao Soi', type: 'Thai · Noodles', rating: '4.6', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=70' };

function Side({ d, side }: { d: typeof TOP; side: 'top' | 'bot' }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: side === 'top' ? -16 : 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}
      className="relative flex-1 w-full rounded-3xl overflow-hidden" data-testid={`tot-${side}`}>
      <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.6))' }} />
      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-extrabold flex items-center gap-1">
        <Star size={10} className="text-amber-500 fill-amber-500" />{d.rating}
      </span>
      <div className="absolute left-4 bottom-3.5 text-left">
        <p className="text-[20px] font-extrabold text-white leading-tight">{d.name}</p>
        <p className="text-[12px] text-white/80 font-medium">{d.type}</p>
      </div>
    </motion.button>
  );
}

export default function ThisOrThat() {
  const [, setRound] = useState(2);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-tot">
      <div className="h-[44px]" />
      <div className="px-5 pt-2 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF1E0] text-[11px] font-extrabold text-[#C2410C]">
          <Flame size={12} /> 2 streak
        </span>
      </div>

      <div className="px-5 mt-3">
        <div className="flex items-center gap-1.5 mb-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 rounded-full ${i < 1 ? 'w-5 bg-[#FFCC02]' : i === 1 ? 'w-5 bg-[#FFCC02]' : 'w-1.5 bg-neutral-200'}`} />
          ))}
          <span className="text-[11px] font-bold text-neutral-400 ml-1">Round 2 of 3</span>
        </div>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight">This or that?</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Tap the one you'd rather — go with your gut.</p>
      </div>

      {/* two big choices */}
      <div className="px-5 mt-4 flex-1 flex flex-col gap-3 pb-6 relative" onClick={() => setRound(3)}>
        <Side d={TOP} side="top" />
        <Side d={BOT} side="bot" />
        {/* OR badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-neutral-900 border-4 border-[#FCFCFC] flex items-center justify-center z-10">
          <span className="text-[13px] font-extrabold text-white">OR</span>
        </div>
      </div>
    </div>
  );
}
