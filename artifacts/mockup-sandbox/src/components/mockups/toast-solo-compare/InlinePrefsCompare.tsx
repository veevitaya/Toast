import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Check, Crown, ChevronDown, Shuffle, Pencil } from 'lucide-react';
import './_group.css';
import { MOODS, CUISINES, SCENES, BUDGETS, getTop2, type Prefs, type Mood, type ScoredSpot } from './_data';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

function Card({ data, side }: { data: ScoredSpot; side: 'l' | 'r' }) {
  return (
    <motion.div
      key={data.name}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="flex-1 rounded-3xl overflow-hidden bg-white border border-black/[0.05]"
      style={{ boxShadow: data.crown ? '0 14px 34px -12px rgba(255,204,2,0.45)' : '0 6px 20px -10px rgba(0,0,0,0.12)' }}
      data-testid={`compare-${side}`}
    >
      <div className="relative h-[128px]" style={{ backgroundColor: '#FFF6DA' }}>
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

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[12px] font-bold transition-colors ${
        active ? 'bg-[#FFCC02] text-neutral-900 shadow-[0_4px_12px_-4px_rgba(255,204,2,0.6)]' : 'bg-neutral-100 text-neutral-600'
      }`}
    >
      {children}
    </button>
  );
}

export default function InlinePrefsCompare() {
  const [prefs, setPrefs] = useState<Prefs>({ mood: 'comforting', cuisine: 'Thai', scene: 'Any', budget: 'Any' });
  const [open, setOpen] = useState(true);

  const [left, right] = useMemo(() => getTop2(prefs), [prefs]);
  const moodInfo = MOODS.find((m) => m.key === prefs.mood)!;

  const summary: string[] = [
    `${moodInfo.emoji} ${moodInfo.label}`,
    prefs.cuisine !== 'Any' ? prefs.cuisine : 'Any cuisine',
    prefs.scene !== 'Any' ? prefs.scene : 'Any scene',
    prefs.budget !== 'Any' ? prefs.budget : 'Any ฿',
  ];

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
      <div className="px-5 mt-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#C79200]">Top 2 for you</p>
        <h1 className="text-[24px] font-extrabold text-neutral-900 leading-tight mt-0.5">Pick a winner</h1>
      </div>

      {/* always-visible, inline-editable preferences bar */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-white border border-black/[0.06] shadow-[0_4px_16px_-10px_rgba(0,0,0,0.12)] overflow-hidden">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full px-3.5 py-2.5 flex items-center gap-2"
            data-testid="button-toggle-prefs"
          >
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
              {summary.map((s) => (
                <span key={s} className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#FFF6DA] border border-[#FFCC02]/50 text-[11px] font-bold text-[#9A7400] whitespace-nowrap">{s}</span>
              ))}
            </div>
            <span className="flex-shrink-0 flex items-center gap-1 text-[12px] font-bold text-neutral-700">
              <Pencil size={12} /> Edit
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring} className="inline-flex">
                <ChevronDown size={14} />
              </motion.span>
            </span>
          </button>

          {/* inline expanding editor — no modal, results update right below */}
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
                <div className="px-3.5 pb-3.5 pt-1 border-t border-neutral-100">
                  <Group label="Mood">
                    {MOODS.map((m) => (
                      <Chip key={m.key} active={prefs.mood === m.key} onClick={() => setPrefs((p) => ({ ...p, mood: m.key as Mood }))}>
                        {m.emoji} {m.label}
                      </Chip>
                    ))}
                  </Group>
                  <Group label="Cuisine">
                    {CUISINES.map((c) => (
                      <Chip key={c} active={prefs.cuisine === c} onClick={() => setPrefs((p) => ({ ...p, cuisine: c }))}>{c}</Chip>
                    ))}
                  </Group>
                  <Group label="Scene">
                    {SCENES.map((s) => (
                      <Chip key={s} active={prefs.scene === s} onClick={() => setPrefs((p) => ({ ...p, scene: s }))}>{s}</Chip>
                    ))}
                  </Group>
                  <Group label="Budget">
                    {BUDGETS.map((b) => (
                      <Chip key={b} active={prefs.budget === b} onClick={() => setPrefs((p) => ({ ...p, budget: b }))}>{b}</Chip>
                    ))}
                  </Group>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* compare-2-options, re-filters live as you edit above */}
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
      <div className="px-5 pb-8 pt-3 flex gap-3">
        <button className="w-13 px-4 h-13 py-3.5 rounded-2xl bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center" data-testid="button-shuffle">
          <Shuffle size={18} />
        </button>
        <button className="flex-1 h-13 py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[14px] font-extrabold flex items-center justify-center gap-1.5" style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }} data-testid="button-pick-left">
          <Check size={16} strokeWidth={3} /> Pick {left.name}
        </button>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
