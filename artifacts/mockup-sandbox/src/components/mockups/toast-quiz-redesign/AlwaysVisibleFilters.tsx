import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Shuffle } from 'lucide-react';
import { VersusRow, BUDGETS, CUISINES, MOODS, SCENES, matchCount, topTwo, type Prefs } from './_compare';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

// tap a selector to advance to the next option for that dimension — re-filters instantly
function next<T>(arr: T[], current: T): T {
  const i = arr.indexOf(current);
  return arr[(i + 1) % arr.length];
}

export default function AlwaysVisibleFilters() {
  const [prefs, setPrefs] = useState<Prefs>({ mood: 'spicy', cuisine: null, scene: null, budget: null });

  const pair = useMemo(() => topTwo(prefs), [prefs]);
  const count = matchCount(prefs);
  const [left, right] = pair;
  const winner = left.match >= right.match ? left : right;

  const moodVals = MOODS.map((m) => m.value);
  const sceneVals = SCENES.map((s) => s.value);
  const budgetVals = BUDGETS.map((b) => b.value);

  const moodLabel = MOODS.find((m) => m.value === prefs.mood);
  const sceneLabel = SCENES.find((s) => s.value === prefs.scene);

  const selectors = [
    {
      key: 'mood',
      text: prefs.mood ? `${moodLabel?.emoji} ${moodLabel?.label}` : 'Any mood',
      on: !!prefs.mood,
      tap: () => setPrefs((p) => ({ ...p, mood: next(moodVals, p.mood) })),
    },
    {
      key: 'cuisine',
      text: prefs.cuisine ?? 'Any cuisine',
      on: !!prefs.cuisine,
      tap: () => setPrefs((p) => { const v = next(CUISINES, p.cuisine ?? 'Any'); return { ...p, cuisine: v === 'Any' ? null : v }; }),
    },
    {
      key: 'scene',
      text: prefs.scene ? `${sceneLabel?.emoji} ${sceneLabel?.label}` : 'Any scene',
      on: !!prefs.scene,
      tap: () => setPrefs((p) => ({ ...p, scene: next(sceneVals, p.scene) })),
    },
    {
      key: 'budget',
      text: prefs.budget ?? 'Any ฿',
      on: !!prefs.budget,
      tap: () => setPrefs((p) => ({ ...p, budget: next(budgetVals, p.budget) })),
    },
  ];

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="always-visible-filters">
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

      {/* always-visible filter bar — no hidden panel, tap a chip to adjust */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {selectors.map((s) => (
            <motion.button
              key={s.key}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={s.tap}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-[12px] font-bold border transition-colors ${
                s.on
                  ? 'bg-[#FFF6DA] border-[#FFCC02] text-[#9A7400]'
                  : 'bg-white border-neutral-200 text-neutral-500'
              }`}
              data-testid={`filter-${s.key}`}
            >
              {s.text}
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] font-semibold text-neutral-400 mt-1 px-1">Tap a filter to adjust — results update live</p>
      </div>

      {/* live match count */}
      <div className="px-5 mt-2.5 flex items-center gap-1.5">
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
    </div>
  );
}
