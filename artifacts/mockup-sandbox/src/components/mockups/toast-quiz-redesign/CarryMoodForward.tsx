import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Pencil, Sparkles, Flame } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const PREFILL = [
  { id: 'craving', label: 'Craving', value: 'Thai · Noodles', emoji: '🍜' },
  { id: 'scene', label: 'Scene', value: 'Street food', emoji: '🍢' },
  { id: 'budget', label: 'Budget', value: '฿฿ · Moderate', emoji: '💸' },
];

export default function CarryMoodForward() {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-confirm">
      <div className="h-[44px]" />

      {/* header */}
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-5">Need more options?</p>
        <h1 className="text-[26px] font-extrabold text-neutral-900 leading-tight mt-1.5">Here's what I'll compare</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Built from your mood — tweak anything or just go.</p>
      </div>

      {/* locked mood — carried forward, not re-asked */}
      <div className="px-5 mt-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring}
          className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg,#FFF1E0,#FFF8E8)' }} data-testid="mood-locked">
          <div className="w-11 h-11 rounded-xl bg-white/80 flex items-center justify-center text-[24px] flex-shrink-0">🍜</div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A7400]">Your mood</p>
            <p className="text-[15px] font-extrabold text-neutral-900 leading-tight">Comforting & easy</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white">
            <Check size={12} className="text-[#E0A800]" strokeWidth={3} />
            <span className="text-[11px] font-bold text-neutral-600">Keeping</span>
          </div>
        </motion.div>
      </div>

      {/* pre-filled, editable summary — replaces the 21-chip wall */}
      <div className="px-5 mt-4 space-y-2.5">
        {PREFILL.map((p, i) => {
          const on = editing === p.id;
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.07, ...spring }}
              onClick={() => setEditing(on ? null : p.id)}
              whileTap={{ scale: 0.98 }}
              className={`w-full rounded-2xl p-3.5 flex items-center gap-3 border text-left transition-colors ${on ? 'bg-[#FFF6DA] border-[#FFCC02]' : 'bg-white border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}
              data-testid={`prefill-${p.id}`}
            >
              <span className="text-[22px]">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">{p.label}</p>
                <p className="text-[15px] font-bold text-neutral-900 leading-tight">{p.value}</p>
              </div>
              <span className="flex items-center gap-1 text-[12px] font-bold text-[#C79200]">
                <Pencil size={12} /> Edit
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* taste-dna note */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 text-[12px] text-neutral-400">
          <Sparkles size={13} className="text-[#E0A800]" />
          <span>Pulled from your Taste DNA + tonight's mood</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* CTA */}
      <div className="px-5 pb-8 pt-3 bg-[#FCFCFC] border-t border-black/[0.04]">
        <button className="w-full h-14 rounded-2xl flex items-center justify-center gap-2.5 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.5)' }} data-testid="button-compare">
          Compare these spots
          <Flame size={19} />
        </button>
        <button className="w-full text-center text-[13px] font-semibold text-neutral-400 mt-3" data-testid="button-startover">
          Start from scratch instead
        </button>
      </div>
    </div>
  );
}
