import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Check } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const SEEDS = [
  { id: 1, name: 'Pad Kra Pao', type: 'Thai · Street', rating: '4.7', img: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&q=70' },
  { id: 2, name: 'Khao Soi', type: 'Thai · Noodles', rating: '4.6', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=70' },
  { id: 3, name: 'Tonkotsu Ramen', type: 'Japanese', rating: '4.5', img: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&q=70' },
  { id: 4, name: 'Som Tum', type: 'Thai · Spicy', rating: '4.6', img: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&q=70' },
];

function Seed({ s, won }: { s: typeof SEEDS[0]; won: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }}
      className={`flex-1 rounded-2xl overflow-hidden bg-white border text-left transition-colors ${won ? 'border-[#FFCC02] shadow-[0_6px_20px_-8px_rgba(255,204,2,0.5)]' : 'border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.05)]'}`}
      data-testid={`seed-${s.id}`}>
      <div className="relative h-[78px]">
        <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-white/90 text-[10px] font-extrabold flex items-center gap-0.5">
          <Star size={9} className="text-amber-500 fill-amber-500" />{s.rating}
        </span>
        {won && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FFCC02] flex items-center justify-center">
            <Check size={11} className="text-neutral-900" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-[12px] font-extrabold text-neutral-900 leading-tight truncate">{s.name}</p>
        <p className="text-[10px] text-neutral-500 truncate">{s.type}</p>
      </div>
    </motion.button>
  );
}

function Matchup({ a, b, winner }: { a: typeof SEEDS[0]; b: typeof SEEDS[0]; winner?: number }) {
  return (
    <div className="flex items-stretch gap-2 relative">
      <Seed s={a} won={winner === a.id} />
      <div className="flex items-center">
        <span className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-extrabold text-white">VS</span>
      </div>
      <Seed s={b} won={winner === b.id} />
    </div>
  );
}

export default function ToastShowdown() {
  const [, setStep] = useState(0);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-showdown">
      <div className="h-[44px]" />
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <div className="flex items-center gap-1.5 mt-5">
          <span className="h-1.5 w-6 rounded-full bg-[#FFCC02]" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-200" />
          <span className="text-[11px] font-bold text-neutral-400 ml-1">Round 1 of 2</span>
        </div>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-3">Comforting & easy · kept</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">Toast Showdown</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">Tap your winner each round — last spot wins.</p>
      </div>

      <div className="px-5 mt-6 space-y-4" onClick={() => setStep(1)}>
        <Matchup a={SEEDS[0]} b={SEEDS[1]} winner={SEEDS[0].id} />
        <Matchup a={SEEDS[2]} b={SEEDS[3]} />
      </div>

      {/* final slot */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl border-2 border-dashed border-[#FFCC02]/50 bg-[#FFFBED] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFCC02] flex items-center justify-center flex-shrink-0">
            <Trophy size={18} className="text-neutral-900" />
          </div>
          <div>
            <p className="text-[13px] font-extrabold text-neutral-900 leading-tight">The Final compare</p>
            <p className="text-[12px] text-neutral-500">Two winners go head-to-head with full details.</p>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <div className="px-5 pb-8 pt-3 text-center">
        <p className="text-[12px] font-semibold text-neutral-400">Pick a winner from each matchup to continue</p>
      </div>
    </div>
  );
}
