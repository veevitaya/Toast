import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Unlock, Shuffle } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const REELS = [
  { key: 'cuisine', label: 'Cuisine', up: '🍕 Italian', mid: '🍜 Thai', down: '🍣 Japanese' },
  { key: 'style', label: 'Style', up: 'Grill', mid: 'Noodles', down: 'Soup' },
  { key: 'vibe', label: 'Vibe', up: 'Lively', mid: 'Cozy', down: 'Quick' },
];

function Reel({ reel, locked, onToggle, spinKey }: { reel: typeof REELS[number]; locked: boolean; onToggle: () => void; spinKey: number }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">{reel.label}</p>
      <div className={`relative w-full rounded-2xl overflow-hidden border-2 transition-colors ${locked ? 'border-[#FFCC02] bg-[#FFFCF2]' : 'border-black/[0.06] bg-white'}`}>
        <div className="py-1.5 px-1 flex flex-col items-center">
          <span className="text-[11px] font-semibold text-neutral-300 truncate w-full text-center">{reel.up}</span>
          <motion.span key={spinKey} initial={{ y: locked ? 0 : 18, opacity: locked ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} transition={spring}
            className="text-[15px] font-extrabold text-neutral-900 truncate w-full text-center py-1">{reel.mid}</motion.span>
          <span className="text-[11px] font-semibold text-neutral-300 truncate w-full text-center">{reel.down}</span>
        </div>
        {/* gold center frame */}
        <div className="pointer-events-none absolute left-1 right-1 top-1/2 -translate-y-1/2 h-9 rounded-lg border-2" style={{ borderColor: locked ? '#FFCC02' : 'rgba(255,204,2,0.35)' }} />
      </div>
      <button onClick={onToggle} className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10.5px] font-bold ${locked ? 'bg-[#FFCC02] text-neutral-900' : 'bg-neutral-100 text-neutral-400'}`} data-testid={`lock-${reel.key}`}>
        {locked ? <Lock size={10} /> : <Unlock size={10} />}{locked ? 'Locked' : 'Lock'}
      </button>
    </div>
  );
}

export default function OneQuestionBridge() {
  const [locked, setLocked] = useState<Record<string, boolean>>({ cuisine: true, style: false, vibe: false });
  const [spin, setSpin] = useState(0);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-oneq">
      <div className="h-[44px]" />

      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <div className="flex items-center gap-1.5 mt-5">
          <span className="h-1.5 w-6 rounded-full bg-[#FFCC02]" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-200" />
          <span className="text-[11px] font-bold text-neutral-400 ml-1">Almost there</span>
        </div>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-3">Comforting & easy · kept</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">Lock in your craving</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">I spun these from your mood. Lock what you love, reshuffle the rest.</p>
      </div>

      {/* slot reels */}
      <div className="px-5 mt-6 flex gap-2.5 items-start">
        {REELS.map((r) => (
          <Reel key={r.key} reel={r} locked={!!locked[r.key]} spinKey={spin} onToggle={() => setLocked((s) => ({ ...s, [r.key]: !s[r.key] }))} />
        ))}
      </div>

      {/* reshuffle */}
      <div className="px-5 mt-6 flex justify-center">
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setSpin((s) => s + 1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-black/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-[14px] font-extrabold text-neutral-800" data-testid="button-reshuffle">
          <Shuffle size={16} className="text-[#C79200]" /> Reshuffle the rest
        </motion.button>
      </div>

      {/* assembled sentence + match count */}
      <div className="px-5 mt-7">
        <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg,#FFF1E0,#FFF8E8)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A7400]">Your craving</p>
          <p className="text-[20px] font-extrabold text-neutral-900 leading-tight mt-1">Cozy Thai noodles</p>
          <span className="inline-block mt-2.5 px-3 py-1 rounded-full bg-white text-[11.5px] font-extrabold text-neutral-700">12 spots match</span>
        </div>
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
