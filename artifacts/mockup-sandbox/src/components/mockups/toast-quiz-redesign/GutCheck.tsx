import { motion } from 'framer-motion';
import { ArrowLeft, X, Check, Star } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const PICK = { name: 'Tom Yum Goong', type: 'Thai · Hot & sour', rating: '4.6', match: 92, img: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=70' };
const RUNNER = { name: 'Green Curry', img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&q=70' };

export default function GutCheck() {
  const R = 78;
  const C = 2 * Math.PI * R;
  const elapsed = 0.55; // ~ time left

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-gut">
      <div className="h-[44px]" />
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
      </div>

      <div className="px-5 mt-3 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200]">Trust your gut</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">Quick — yes or no?</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">Don't overthink it. Decide before time's up.</p>
      </div>

      {/* countdown ring with thumbnail */}
      <div className="mt-7 flex justify-center">
        <div className="relative w-[188px] h-[188px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 188 188">
            <circle cx="94" cy="94" r={R} fill="none" stroke="#F0EDE4" strokeWidth="9" />
            <motion.circle cx="94" cy="94" r={R} fill="none" stroke="#FFCC02" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - elapsed)} />
          </svg>
          <div className="absolute inset-[18px] rounded-full overflow-hidden shadow-inner">
            <img src={PICK.img} alt={PICK.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center">
            <span className="text-[15px] font-extrabold text-white">2</span>
          </div>
        </div>
      </div>

      {/* pick name */}
      <div className="px-5 mt-5 text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-[#FFF6DA] text-[11px] font-extrabold text-[#9A7400]">{PICK.match}% match</span>
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-neutral-500"><Star size={11} className="text-amber-500 fill-amber-500" />{PICK.rating}</span>
        </div>
        <h2 className="text-[22px] font-extrabold text-neutral-900 leading-tight">{PICK.name}</h2>
        <p className="text-[13px] text-neutral-500">{PICK.type}</p>
      </div>

      <div className="flex-1" />

      {/* yes / no */}
      <div className="px-5 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.95 }} className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)]" data-testid="button-no">
          <X size={26} className="text-neutral-400" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-16 rounded-full bg-[#FFCC02] text-neutral-900 text-[16px] font-extrabold flex items-center justify-center gap-2" style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.55)' }} data-testid="button-yes">
          <Check size={20} strokeWidth={3} /> Yes, let's go
        </motion.button>
      </div>

      {/* hesitation hint */}
      <div className="px-5 pt-3 pb-8 flex items-center justify-center gap-2 text-[12px] text-neutral-400">
        <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-200">
          <img src={RUNNER.img} alt="runner" className="w-full h-full object-cover" />
        </div>
        <span>Hesitating? I'll compare <span className="font-bold text-neutral-600">{RUNNER.name}</span> next.</span>
      </div>
    </div>
  );
}
