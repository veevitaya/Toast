import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const LANES = {
  cozy: {
    key: 'cozy', emoji: '🛋️', title: 'Cozy & familiar', sub: 'Your usual comfort', count: 3,
    bg: 'linear-gradient(135deg,#FFF1E0,#FFF8E8)', ring: '#FFCC02',
    pair: [
      { name: 'Khao Soi', type: 'Thai · Noodles', rating: '4.7', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&q=70' },
      { name: 'Tonkotsu Ramen', type: 'Japanese · Rich', rating: '4.5', img: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=200&q=70' },
    ],
  },
  new: {
    key: 'new', emoji: '✨', title: 'Switch it up', sub: 'Something a little new', count: 4,
    bg: 'linear-gradient(135deg,#EAF3EC,#E9F0FF)', ring: '#34D399',
    pair: [
      { name: 'Som Tum Nua', type: 'Thai · Spicy salad', rating: '4.6', img: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=200&q=70' },
      { name: 'Birria Tacos', type: 'Mexican · Bold', rating: '4.8', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=70' },
    ],
  },
} as const;

type LaneKey = keyof typeof LANES;

function LaneCard({ lane, on, onTap }: { lane: typeof LANES[LaneKey]; on: boolean; onTap: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onTap}
      className="flex-1 rounded-3xl p-4 text-left border-2 transition-colors relative overflow-hidden"
      style={{ background: lane.bg, borderColor: on ? lane.ring : 'transparent' }}
      data-testid={`lane-${lane.key}`}>
      <div className="text-[30px] leading-none">{lane.emoji}</div>
      <p className="text-[16px] font-extrabold text-neutral-900 leading-tight mt-3">{lane.title}</p>
      <p className="text-[12px] text-neutral-500 mt-0.5">{lane.sub}</p>
      <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-white/80 text-[10.5px] font-extrabold text-neutral-600">{lane.count} spots ready</span>
      <AnimatePresence>
        {on && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: lane.ring }}>
            <Sparkles size={13} className="text-neutral-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function CarryMoodForward() {
  const [lane, setLane] = useState<LaneKey>('cozy');
  const active = LANES[lane];

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-confirm">
      <div className="h-[44px]" />

      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-5">Comforting & easy · kept</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">Which way are you leaning?</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">Pick a feeling — I'll line up two spots for it.</p>
      </div>

      {/* feeling fork */}
      <div className="px-5 mt-5 flex items-stretch gap-2.5 relative">
        <LaneCard lane={LANES.cozy} on={lane === 'cozy'} onTap={() => setLane('cozy')} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-900 border-4 border-[#FCFCFC] flex items-center justify-center z-10">
          <span className="text-[11px] font-extrabold text-white">or</span>
        </div>
        <LaneCard lane={LANES.new} on={lane === 'new'} onTap={() => setLane('new')} />
      </div>

      {/* live matchup preview */}
      <div className="px-5 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">Tonight's matchup</p>
        <AnimatePresence mode="wait">
          <motion.div key={lane} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring}
            className="flex items-center gap-2.5">
            {active.pair.map((d, idx) => (
              <div key={d.name} className="contents">
                <div className="flex-1 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-2.5">
                  <div className="w-full h-20 rounded-xl overflow-hidden mb-2">
                    <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[13px] font-extrabold text-neutral-900 leading-tight truncate">{d.name}</p>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-semibold mt-0.5">
                    <Star size={9} className="text-amber-500 fill-amber-500" />{d.rating}
                    <span className="text-neutral-300">·</span><span className="truncate">{d.type}</span>
                  </div>
                </div>
                {idx === 0 && (
                  <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-extrabold text-white">VS</span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-1" />

      <div className="px-5 pb-8 pt-3 bg-[#FCFCFC] border-t border-black/[0.04]">
        <button className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.5)' }} data-testid="button-compare">
          Compare these two
          <ArrowRight size={19} />
        </button>
        <button className="w-full text-center text-[13px] font-semibold text-neutral-400 mt-3 flex items-center justify-center gap-1.5" data-testid="button-decide">
          <Wand2 size={13} /> Can't decide? You pick for me
        </button>
      </div>
    </div>
  );
}
