import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ArrowRight } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const REACTIONS = [
  { emoji: '😋', label: 'Love it' },
  { emoji: '🥱', label: 'Too safe' },
  { emoji: '💸', label: 'Cheaper' },
  { emoji: '🔥', label: 'Spicier' },
  { emoji: '🚶', label: 'Closer' },
];

const PICK = { name: 'Tonkotsu Ramen', type: 'Japanese · Rich', rating: '4.5', match: 88, img: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=500&q=70' };
const CHALLENGER = { name: 'Khao Soi', type: 'Thai · Spicy', rating: '4.6', match: 91, img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=70' };

export default function ReactToTune() {
  const [reacted, setReacted] = useState<number | null>(3);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-react">
      <div className="h-[44px]" />
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-5">Your pick so far</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">How's this one?</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">React and I'll find a rival to compare.</p>
      </div>

      {/* current pick */}
      <div className="px-5 mt-5">
        <div className="rounded-3xl overflow-hidden bg-white border border-black/[0.05] shadow-[0_6px_22px_-10px_rgba(0,0,0,0.18)]">
          <div className="relative h-[130px]">
            <img src={PICK.img} alt={PICK.name} className="w-full h-full object-cover" />
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-extrabold flex items-center gap-1">
              <Star size={10} className="text-amber-500 fill-amber-500" />{PICK.rating}
            </span>
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#FFCC02] text-[11px] font-extrabold text-neutral-900">{PICK.match}% match</span>
          </div>
          <div className="p-3">
            <p className="text-[16px] font-extrabold text-neutral-900 leading-tight">{PICK.name}</p>
            <p className="text-[12px] text-neutral-500">{PICK.type}</p>
          </div>
        </div>
      </div>

      {/* reactions */}
      <div className="px-5 mt-4 flex gap-2 justify-between">
        {REACTIONS.map((r, i) => {
          const on = reacted === i;
          return (
            <motion.button key={r.label} whileTap={{ scale: 0.88 }} onClick={() => setReacted(i)}
              className={`flex-1 rounded-2xl py-2.5 flex flex-col items-center gap-1 border transition-colors ${on ? 'bg-[#FFF6DA] border-[#FFCC02]' : 'bg-white border-black/[0.06]'}`}
              data-testid={`react-${i}`}>
              <span className="text-[20px]">{r.emoji}</span>
              <span className={`text-[9.5px] font-bold ${on ? 'text-neutral-900' : 'text-neutral-400'}`}>{r.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* challenger appears */}
      <AnimatePresence>
        {reacted !== null && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="px-5 mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">New rival for "{REACTIONS[reacted].label.toLowerCase()}"</p>
            <div className="rounded-2xl bg-white border border-[#FFCC02] shadow-[0_4px_18px_-8px_rgba(255,204,2,0.5)] p-2.5 flex gap-3 items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img src={CHALLENGER.img} alt={CHALLENGER.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-extrabold text-neutral-900 leading-tight truncate">{CHALLENGER.name}</p>
                <p className="text-[12px] text-neutral-500">{CHALLENGER.type}</p>
              </div>
              <span className="px-2 py-1 rounded-full bg-[#FFF6DA] text-[11px] font-extrabold text-[#9A7400]">{CHALLENGER.match}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1" />
      <div className="px-5 pb-8 pt-3 bg-[#FCFCFC] border-t border-black/[0.04]">
        <button className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.5)' }} data-testid="button-compare">
          Compare these two
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
