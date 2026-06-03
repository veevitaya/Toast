import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUp, Sparkles } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const CHIPS = [
  { emoji: '💸', label: 'Something cheap' },
  { emoji: '📍', label: 'Close by' },
  { emoji: '🌶️', label: 'Spicy & comforting' },
  { emoji: '⭐', label: 'Top rated only' },
  { emoji: '🎲', label: 'Surprise me' },
];

export default function AskButters() {
  const [text, setText] = useState('');

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-butters">
      <div className="h-[44px]" />
      <div className="px-5 pt-2 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <span className="text-[13px] font-extrabold text-neutral-800">Ask Butters</span>
        <div className="w-10 h-10" />
      </div>

      {/* mood memory */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-1.5 text-[12px] text-neutral-400 font-medium">
          <Sparkles size={13} className="text-[#E0A800]" />
          Remembering: <span className="font-bold text-neutral-600">Comforting & easy</span>
        </div>
      </div>

      {/* butters bubble */}
      <div className="px-5 mt-5 flex items-start gap-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-[22px] flex-shrink-0 shadow-[0_4px_12px_-4px_rgba(255,204,2,0.6)]" style={{ background: 'linear-gradient(135deg,#FFD94A,#FFB800)' }}>
          🧈
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring}
          className="bg-white rounded-2xl rounded-tl-md border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-3.5 max-w-[260px]">
          <p className="text-[14px] text-neutral-800 leading-snug font-medium">
            Want me to line up a couple of spots to compare? Tell me what matters most tonight 👇
          </p>
        </motion.div>
      </div>

      {/* quick replies */}
      <div className="px-5 mt-5 space-y-2.5">
        {CHIPS.map((c, i) => (
          <motion.button key={c.label}
            initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06, ...spring }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] px-4 py-3 flex items-center gap-3 text-left hover:border-[#FFCC02] transition-colors"
            data-testid={`reply-${i}`}>
            <span className="text-[18px]">{c.emoji}</span>
            <span className="text-[14px] font-bold text-neutral-800 flex-1">{c.label}</span>
            <span className="text-[12px] font-bold text-[#C79200]">Compare →</span>
          </motion.button>
        ))}
      </div>

      <div className="flex-1" />

      {/* text input */}
      <div className="px-5 pb-8 pt-3 bg-[#FCFCFC] border-t border-black/[0.04]">
        <div className="flex items-center gap-2 rounded-full bg-white border border-black/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] pl-4 pr-1.5 py-1.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type it your way…"
            className="flex-1 bg-transparent outline-none text-[14px] text-neutral-800 placeholder:text-neutral-400"
            data-testid="input-butters"
          />
          <button className="w-9 h-9 rounded-full bg-[#FFCC02] flex items-center justify-center flex-shrink-0" data-testid="button-send">
            <ArrowUp size={18} className="text-neutral-900" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
