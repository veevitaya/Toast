import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, Star, MapPin, Check, Crown, X, Shuffle, Sparkles } from 'lucide-react';
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

function Chip({
  active, pillId, onClick, big, children,
}: { active: boolean; pillId: string; onClick: () => void; big?: boolean; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`relative rounded-full font-bold ${big ? 'px-4 py-2.5 text-[13px]' : 'px-3.5 py-2 text-[12px]'}`}
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

function MiniPick({ data }: { data: ScoredSpot }) {
  return (
    <div className="flex-1 min-w-0 min-h-[44px] flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={data.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2.5"
        >
          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#FFF6DA' }}>
            <img
              src={data.img}
              alt={data.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.opacity = '0'; }}
            />
            {data.crown && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFCC02] flex items-center justify-center ring-2 ring-white">
                <Crown size={8} className="text-neutral-900" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-neutral-900 truncate leading-tight">{data.name}</p>
            <div className="mt-1 h-1 w-16 rounded-full bg-neutral-100 overflow-hidden">
              <motion.div className="h-full rounded-full bg-[#FFCC02]" animate={{ width: `${data.match}%` }} transition={spring} />
            </div>
            <p className="text-[9.5px] font-bold text-[#9A7400] mt-0.5">{data.match}% match</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function EditSheetCompare() {
  const [prefs, setPrefs] = useState<Prefs>({ mood: 'comforting', cuisine: 'Any', scene: 'Any', budget: 'Any' });
  const [open, setOpen] = useState(false);
  const dragControls = useDragControls();

  const [left, right] = useMemo(() => getTop2(prefs), [prefs]);
  const moodInfo = MOODS.find((m) => m.key === prefs.mood)!;

  const summary: string[] = [
    `${moodInfo.emoji} ${moodInfo.label}`,
    ...(prefs.cuisine !== 'Any' ? [prefs.cuisine] : []),
    ...(prefs.scene !== 'Any' ? [prefs.scene] : []),
    ...(prefs.budget !== 'Any' ? [prefs.budget] : []),
  ];

  const surprise = () => {
    const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setPrefs({
      mood: pick(MOODS).key as Mood,
      cuisine: pick(CUISINES),
      scene: pick(SCENES),
      budget: pick(BUDGETS),
    });
  };

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="solo-editsheet">
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

      {/* preferences summary -> tap Edit to open sheet */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-white border border-black/[0.06] p-2.5 pl-3.5 flex items-center gap-2 shadow-[0_4px_16px_-10px_rgba(0,0,0,0.12)]">
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            {summary.map((s) => (
              <span key={s} className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#FFF6DA] border border-[#FFCC02]/40 text-[11px] font-bold text-[#9A7400] whitespace-nowrap">{s}</span>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[12px] font-extrabold"
            style={{ color: '#9A7400', border: '1.5px solid #FFCC02', boxShadow: '0 4px 12px -6px rgba(255,204,2,0.55)' }}
            data-testid="button-edit-prefs"
          >
            <SlidersHorizontal size={13} /> Edit
          </motion.button>
        </div>
      </div>

      {/* compare-2-options, reached instantly (no quiz step) */}
      <div className="relative px-4 mt-5">
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
        <motion.button whileTap={{ scale: 0.95 }} className="w-13 px-4 h-13 py-3.5 rounded-2xl bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center" data-testid="button-shuffle">
          <Shuffle size={18} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-13 py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[14px] font-extrabold flex items-center justify-center gap-1.5" style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }} data-testid="button-pick-left">
          <Check size={16} strokeWidth={3} /> Pick {left.name}
        </motion.button>
      </div>

      {/* ===== Edit preferences bottom sheet ===== */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info: PanInfo) => { if (info.offset.y > 120 || info.velocity.y > 600) setOpen(false); }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}
              className="absolute left-0 right-0 bottom-0 top-[120px] z-20 rounded-t-3xl bg-white flex flex-col"
              style={{ boxShadow: '0 -10px 40px -12px rgba(0,0,0,0.25)' }}
              data-testid="sheet-edit-prefs"
            >
              {/* drag handle */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="pt-3.5 pb-3 flex justify-center cursor-grab active:cursor-grabbing touch-none"
              >
                <div className="w-10 h-1.5 rounded-full bg-neutral-200" />
              </div>

              {/* header row */}
              <div className="px-5 pt-1 pb-3 flex items-center justify-between">
                <h2 className="text-[18px] font-extrabold text-neutral-900">Edit preferences</h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={surprise}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: '#FFF6DA', color: '#9A7400' }}
                    data-testid="button-surprise"
                  >
                    <Sparkles size={12} /> Surprise me
                  </motion.button>
                  <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center" data-testid="button-close-sheet">
                    <X size={16} className="text-neutral-600" />
                  </button>
                </div>
              </div>

              {/* live preview — the two picks update as you edit */}
              <div className="px-5">
                <div className="rounded-2xl bg-white border border-black/[0.06] p-3" style={{ boxShadow: '0 6px 20px -12px rgba(0,0,0,0.14)' }}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCC02] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FFCC02]" />
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C79200]">Updating live</p>
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-400">your 2 picks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MiniPick data={left} />
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center">
                      <span className="text-[9px] font-extrabold text-white">VS</span>
                    </div>
                    <MiniPick data={right} />
                  </div>
                </div>
              </div>

              {/* editable sections */}
              <div className="px-5 pt-4 pb-2 flex-1 min-h-0 overflow-y-auto hide-scrollbar">
                <Section label="Mood">
                  {MOODS.map((m) => (
                    <Chip key={m.key} big pillId="pill-mood" active={prefs.mood === m.key} onClick={() => setPrefs((p) => ({ ...p, mood: m.key as Mood }))}>
                      {m.emoji} {m.label}
                    </Chip>
                  ))}
                </Section>
                <Section label="Cuisine">
                  {CUISINES.map((c) => (
                    <Chip key={c} pillId="pill-cuisine" active={prefs.cuisine === c} onClick={() => setPrefs((p) => ({ ...p, cuisine: c }))}>{c}</Chip>
                  ))}
                </Section>
                <Section label="Scene">
                  {SCENES.map((s) => (
                    <Chip key={s} pillId="pill-scene" active={prefs.scene === s} onClick={() => setPrefs((p) => ({ ...p, scene: s }))}>{s}</Chip>
                  ))}
                </Section>
                <Section label="Budget">
                  {BUDGETS.map((b) => (
                    <Chip key={b} pillId="pill-budget" active={prefs.budget === b} onClick={() => setPrefs((p) => ({ ...p, budget: b }))}>{b}</Chip>
                  ))}
                </Section>
              </div>

              {/* footer */}
              <div className="px-5 pt-2 pb-7 border-t border-neutral-100">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOpen(false)}
                  className="w-full h-13 py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[15px] font-extrabold flex items-center justify-center gap-1.5"
                  style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }}
                  data-testid="button-apply-prefs"
                >
                  <Check size={16} strokeWidth={3} /> See my updated picks
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
