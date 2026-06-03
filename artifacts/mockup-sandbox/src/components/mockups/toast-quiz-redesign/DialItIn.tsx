import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, ArrowRight } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

function Dial({ label, left, right, pct, count }: { label: string; left: string; right: string; pct: number; count?: boolean }) {
  return (
    <div data-testid={`dial-${label.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-extrabold text-neutral-900">{label}</span>
        <span className="text-[11px] font-bold text-[#9A7400] bg-[#FFF6DA] px-2 py-0.5 rounded-full">{count ? 'Surprise me' : `${pct}%`}</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-neutral-100">
        <div className="absolute left-0 top-0 h-full rounded-full bg-[#FFCC02]" style={{ width: `${pct}%` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-[3px] border-[#FFCC02] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          style={{ left: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[11px] text-neutral-400 font-medium">{left}</span>
        <span className="text-[11px] text-neutral-400 font-medium">{right}</span>
      </div>
    </div>
  );
}

export default function DialItIn() {
  const [count] = useState(4);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-dial">
      <div className="h-[44px]" />
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-5">Need more options?</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">Dial it in</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">Slide to taste — I'll narrow it live.</p>
      </div>

      {/* mood kept */}
      <div className="px-5 mt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg,#FFF1E0,#FFF8E8)' }}>
          <span className="text-[15px]">🍜</span>
          <span className="text-[12px] font-bold text-[#9A7400]">Comforting & easy</span>
          <Check size={12} className="text-[#E0A800]" strokeWidth={3} />
        </div>
      </div>

      {/* dials */}
      <div className="px-5 mt-7 space-y-7">
        <Dial label="Distance" left="Right here" right="Worth a trip" pct={28} />
        <Dial label="Budget" left="Cheap eats" right="Treat myself" pct={45} />
        <Dial label="Adventure" left="My usual" right="Surprise me" pct={70} count />
      </div>

      {/* live count */}
      <div className="px-5 mt-8">
        <motion.div key={count} initial={{ scale: 0.96, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={spring}
          className="rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-4 flex items-center gap-3" data-testid="live-count">
          <div className="w-11 h-11 rounded-xl bg-[#FFF6DA] flex items-center justify-center flex-shrink-0">
            <Sparkles size={19} className="text-[#E0A800]" />
          </div>
          <div>
            <p className="text-[18px] font-extrabold text-neutral-900 leading-tight">{count} great matchups</p>
            <p className="text-[12px] text-neutral-500">narrowed from 35 dishes, live</p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1" />
      <div className="px-5 pb-8 pt-3 bg-[#FCFCFC] border-t border-black/[0.04]">
        <button className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.5)' }} data-testid="button-compare">
          Compare top 2
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
