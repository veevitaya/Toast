import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, RotateCcw, Check, Shuffle, X } from 'lucide-react';
import { EditControls, VersusRow, activeChips, matchCount, topTwo, type Prefs } from './_compare';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

export default function CompareEditSheet() {
  const [prefs, setPrefs] = useState<Prefs>({ mood: 'comfort', cuisine: null, scene: null, budget: null });
  const [open, setOpen] = useState(false);

  const pair = useMemo(() => topTwo(prefs), [prefs]);
  const chips = activeChips(prefs);
  const count = matchCount(prefs);
  const [left, right] = pair;
  const winner = left.match >= right.match ? left : right;

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="compare-edit-sheet">
      <div className="h-[44px]" />

      {/* header */}
      <div className="px-5 pt-2 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <span className="text-[13px] font-extrabold text-neutral-800">This or that?</span>
        <div className="w-10 h-10" />
      </div>

      {/* heading */}
      <div className="px-5 mt-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#C79200]">Straight from your mood</p>
        <h1 className="text-[23px] font-extrabold text-neutral-900 leading-tight mt-0.5">Which one wins?</h1>
      </div>

      {/* picks summary + Edit preferences (opens sheet) */}
      <div className="px-4 mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Your picks</span>
          {chips.map((c) => (
            <span key={c} className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#FFF6DA] border border-[#FFCC02]/60 text-[11px] font-bold text-[#9A7400] whitespace-nowrap">{c}</span>
          ))}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FFCC02] text-[#2d2000] text-[12px] font-extrabold"
          style={{ boxShadow: '0 6px 16px -6px rgba(255,204,2,0.65)' }}
          data-testid="button-edit-preferences"
        >
          <SlidersHorizontal size={13} /> Edit preferences
        </button>
      </div>

      {/* live match count */}
      <div className="px-5 mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC02]" />
        <p className="text-[11px] font-bold text-neutral-500">
          <span className="text-neutral-900 font-extrabold">{count}</span> spots match — here are the top 2
        </p>
      </div>

      {/* compare screen */}
      <div className="px-4 mt-3">
        <VersusRow left={left} right={right} />
      </div>

      <div className="flex-1" />

      {/* pick bar */}
      <div className="px-5 pb-8 pt-3 flex gap-3">
        <button className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-white border border-neutral-200 text-[14px] font-extrabold text-neutral-700" data-testid="button-shuffle">
          <Shuffle size={15} /> Shuffle
        </button>
        <button className="flex-1 py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[14px] font-extrabold flex items-center justify-center gap-1.5" style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }} data-testid="button-pick">
          <Check size={16} strokeWidth={3} /> Pick {winner.name}
        </button>
      </div>

      {/* ===== bottom sheet ===== */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40 z-20"
              data-testid="sheet-backdrop"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}
              className="absolute left-0 right-0 bottom-0 z-30 rounded-t-3xl bg-white px-4 pt-2.5 pb-7"
              style={{ boxShadow: '0 -16px 40px -12px rgba(0,0,0,0.25)' }}
              data-testid="edit-sheet"
            >
              <div className="mx-auto w-10 h-1.5 rounded-full bg-neutral-200 mb-3" />
              <div className="flex items-center justify-between mb-3 px-0.5">
                <p className="text-[16px] font-extrabold text-neutral-900">Edit preferences</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPrefs({ mood: null, cuisine: null, scene: null, budget: null })}
                    className="flex items-center gap-1 text-[11px] font-bold text-neutral-400"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                  <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
                    <X size={15} className="text-neutral-600" />
                  </button>
                </div>
              </div>

              <EditControls prefs={prefs} onChange={setPrefs} />

              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[14px] font-extrabold flex items-center justify-center gap-1.5"
                style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }}
                data-testid="button-apply"
              >
                Show {count} matches
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
