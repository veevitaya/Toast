import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Check, Crown, ChevronDown, Shuffle, Sparkles, RotateCcw } from 'lucide-react';
import './_group.css';
import { MOODS, CUISINES, SCENES, BUDGETS, SPOTS, getTop2, type Prefs, type Mood, type ScoredSpot } from './_data';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };
const INITIAL: Prefs = { mood: 'comforting', cuisine: 'Thai', scene: 'Any', budget: 'Any' };

function Card({ data, side }: { data: ScoredSpot; side: 'l' | 'r' }) {
  return (
    <motion.div
      key={data.name}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className="flex-1 rounded-3xl overflow-hidden bg-white border border-black/[0.05]"
      style={{ boxShadow: data.crown ? '0 14px 34px -12px rgba(255,204,2,0.45)' : '0 6px 20px -10px rgba(0,0,0,0.12)' }}
      data-testid={`compare-${side}`}
    >
      <div className="relative h-[124px]" style={{ backgroundColor: '#FFF6DA' }}>
        <img
          src={data.img}
          alt={data.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = '0'; }}
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-extrabold text-neutral-900 flex items-center gap-1">
          <Star size={10} className="text-amber-500 fill-amber-500" />{data.rating}
        </div>
        {data.crown && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center shadow">
            <Crown size={12} className="text-neutral-900" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[15px] font-extrabold text-neutral-900 leading-tight truncate">{data.name}</p>
        <p className="text-[11px] text-neutral-500 truncate">{data.cuisine} · {data.scene}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-neutral-600">
          <span className="flex items-center gap-0.5"><MapPin size={10} className="text-neutral-400" />{data.dist}</span>
          <span>·</span><span>{data.price}</span>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div className="h-full rounded-full bg-[#FFCC02]" animate={{ width: `${data.match}%` }} transition={spring} />
        </div>
        <p className="text-[10px] font-bold text-[#9A7400] mt-1">{data.match}% your taste</p>
      </div>
    </motion.div>
  );
}

function Chip({ active, pillId, onClick, children }: { active: boolean; pillId: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="relative shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold"
    >
      <span className="absolute inset-0 rounded-full bg-neutral-100" />
      {active && (
        <motion.span
          layoutId={pillId}
          transition={spring}
          className="absolute inset-0 rounded-full bg-[#FFCC02]"
          style={{ boxShadow: '0 4px 12px -4px rgba(255,204,2,0.6)' }}
        />
      )}
      <span className={`relative z-[1] ${active ? 'text-neutral-900' : 'text-neutral-600'}`}>{children}</span>
    </motion.button>
  );
}

function FilterRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1 px-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="text-[10px] font-extrabold text-[#9A7400]">{value}</p>
      </div>
      <div className="relative">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar px-0.5 pb-0.5">{children}</div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0.5 w-7 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}

function BudgetSegment({ value, onChange }: { value: Prefs['budget']; onChange: (b: Prefs['budget']) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1 px-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Budget</p>
        <p className="text-[10px] font-extrabold text-[#9A7400]">{value === 'Any' ? 'Any price' : value}</p>
      </div>
      <div className="flex gap-1 p-1 rounded-full bg-neutral-100">
        {BUDGETS.map((b) => {
          const active = value === b;
          return (
            <motion.button
              key={b}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(b)}
              className="relative flex-1 py-1.5 rounded-full text-[12px] font-bold"
              data-testid={`segment-budget-${b}`}
            >
              {active && (
                <motion.span
                  layoutId="ip-budget"
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-[#FFCC02]"
                  style={{ boxShadow: '0 4px 12px -4px rgba(255,204,2,0.6)' }}
                />
              )}
              <span className={`relative z-[1] ${active ? 'text-neutral-900' : 'text-neutral-500'}`}>{b}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function InlinePrefsCompare() {
  const [prefs, setPrefs] = useState<Prefs>(INITIAL);
  const [open, setOpen] = useState(true);

  const [left, right] = useMemo(() => getTop2(prefs), [prefs]);
  const moodInfo = MOODS.find((m) => m.key === prefs.mood)!;
  const pool = useMemo(
    () => (prefs.cuisine === 'Any' ? SPOTS.length : SPOTS.filter((s) => s.cuisine === prefs.cuisine).length),
    [prefs.cuisine],
  );
  const isInitial =
    prefs.mood === INITIAL.mood && prefs.cuisine === INITIAL.cuisine && prefs.scene === INITIAL.scene && prefs.budget === INITIAL.budget;

  const summary: string[] = [
    `${moodInfo.emoji} ${moodInfo.label}`,
    ...(prefs.cuisine !== 'Any' ? [prefs.cuisine] : []),
    ...(prefs.scene !== 'Any' ? [prefs.scene] : []),
    ...(prefs.budget !== 'Any' ? [prefs.budget] : []),
  ];

  const surprise = () => {
    const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setPrefs({ mood: pick(MOODS).key as Mood, cuisine: pick(CUISINES), scene: pick(SCENES), budget: pick(BUDGETS) });
  };

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="solo-inlineprefs">
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
      <div className="px-5 mt-2.5">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#C79200]">Top 2 for you</p>
        <h1 className="text-[24px] font-extrabold text-neutral-900 leading-tight mt-0.5">Pick a winner</h1>
      </div>

      {/* ===== Live tuner — always-visible inline editor ===== */}
      <div className="px-4 mt-3.5">
        <div className="rounded-2xl bg-white border border-black/[0.06] shadow-[0_6px_20px_-12px_rgba(0,0,0,0.16)] overflow-hidden">
          {/* top row */}
          <div className="px-3 py-2.5 flex items-center gap-2">
            {open ? (
              <>
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCC02] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCC02]" />
                </span>
                <p className="text-[13px] font-extrabold text-neutral-900 whitespace-nowrap">Tune your picks</p>
                <span className="text-[10px] font-bold text-neutral-400 whitespace-nowrap">Top 2 of {pool}</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={surprise}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFF6DA', color: '#9A7400' }}
                    data-testid="button-surprise"
                  >
                    <Sparkles size={14} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPrefs(INITIAL)}
                    disabled={isInitial}
                    className={`w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 ${isInitial ? 'opacity-30' : ''}`}
                    data-testid="button-reset"
                  >
                    <RotateCcw size={14} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600"
                    data-testid="button-toggle-prefs"
                  >
                    <ChevronDown size={16} className="rotate-180" />
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                  {summary.map((s) => (
                    <span key={s} className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#FFF6DA] border border-[#FFCC02]/50 text-[11px] font-bold text-[#9A7400] whitespace-nowrap">{s}</span>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen(true)}
                  className="flex-shrink-0 flex items-center gap-1 text-[12px] font-extrabold text-neutral-700"
                  data-testid="button-toggle-prefs"
                >
                  <Sparkles size={12} /> Edit <ChevronDown size={14} />
                </motion.button>
              </>
            )}
          </div>

          {/* expanding editor body — results update live in the cards below */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={spring}
                className="overflow-hidden"
                data-testid="panel-edit-prefs"
              >
                <div className="px-3 pb-3 pt-1.5 border-t border-neutral-100 space-y-2">
                  <FilterRow label="Mood" value={moodInfo.label}>
                    {MOODS.map((m) => (
                      <Chip key={m.key} pillId="ip-mood" active={prefs.mood === m.key} onClick={() => setPrefs((p) => ({ ...p, mood: m.key as Mood }))}>
                        {m.emoji} {m.label}
                      </Chip>
                    ))}
                  </FilterRow>
                  <FilterRow label="Cuisine" value={prefs.cuisine === 'Any' ? 'Any' : prefs.cuisine}>
                    {CUISINES.map((c) => (
                      <Chip key={c} pillId="ip-cuisine" active={prefs.cuisine === c} onClick={() => setPrefs((p) => ({ ...p, cuisine: c }))}>{c}</Chip>
                    ))}
                  </FilterRow>
                  <FilterRow label="Scene" value={prefs.scene === 'Any' ? 'Any' : prefs.scene}>
                    {SCENES.map((s) => (
                      <Chip key={s} pillId="ip-scene" active={prefs.scene === s} onClick={() => setPrefs((p) => ({ ...p, scene: s }))}>{s}</Chip>
                    ))}
                  </FilterRow>
                  <BudgetSegment value={prefs.budget} onChange={(b) => setPrefs((p) => ({ ...p, budget: b }))} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* compare-2-options, re-filters live as you tune above */}
      <div className="relative px-4 mt-4">
        <div className="flex gap-3 items-stretch">
          <Card data={left} side="l" />
          <Card data={right} side="r" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg ring-4 ring-[#FCFCFC]">
            <span className="text-[12px] font-extrabold text-white">VS</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* pick bar */}
      <div className="px-5 pb-7 pt-3 flex gap-3">
        <motion.button whileTap={{ scale: 0.95 }} onClick={surprise} className="w-13 px-4 h-13 py-3.5 rounded-2xl bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center" data-testid="button-shuffle">
          <Shuffle size={18} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-13 py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[14px] font-extrabold flex items-center justify-center gap-1.5" style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }} data-testid="button-pick-left">
          <Check size={16} strokeWidth={3} /> Pick {left.name}
        </motion.button>
      </div>
    </div>
  );
}
