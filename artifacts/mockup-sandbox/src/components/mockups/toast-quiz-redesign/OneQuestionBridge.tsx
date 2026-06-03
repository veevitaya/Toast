import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Navigation, Wallet, Star, TrendingUp, Dice5, Plus, ArrowRight, Check } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const LENSES = [
  { id: 'closest', label: 'Closest first', sub: 'Shortest walk', Icon: Navigation },
  { id: 'cheapest', label: 'Best value', sub: 'Easy on the wallet', Icon: Wallet },
  { id: 'rated', label: 'Top rated', sub: 'Crowd favourites', Icon: Star },
  { id: 'popular', label: 'Trending now', sub: "What's hot tonight", Icon: TrendingUp },
  { id: 'surprise', label: 'Surprise me', sub: 'Toast goes wild', Icon: Dice5 },
];

export default function OneQuestionBridge() {
  const [picked, setPicked] = useState('closest');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-oneq">
      <div className="h-[44px]" />

      {/* header */}
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>

        {/* progress dots — feels like one quick step, not a full quiz */}
        <div className="flex items-center gap-1.5 mt-5">
          <span className="h-1.5 w-6 rounded-full bg-[#FFCC02]" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-200" />
          <span className="text-[11px] font-bold text-neutral-400 ml-1">Almost there</span>
        </div>

        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-3">Comforting & easy · kept</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-[1.12] mt-1.5">How should I line<br />them up?</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">One tap and I'll lay out the matchups.</p>
      </div>

      {/* single question — lens choice */}
      <div className="px-5 mt-5 space-y-2.5">
        {LENSES.map((l, i) => {
          const on = picked === l.id;
          return (
            <motion.button
              key={l.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ...spring }}
              onClick={() => setPicked(l.id)}
              whileTap={{ scale: 0.98 }}
              className={`w-full rounded-2xl p-3.5 flex items-center gap-3.5 border text-left transition-colors ${on ? 'bg-[#FFF6DA] border-[#FFCC02] shadow-[0_4px_18px_rgba(255,204,2,0.18)]' : 'bg-white border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}
              data-testid={`lens-${l.id}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${on ? 'bg-[#FFCC02]' : 'bg-neutral-100'}`}>
                <l.Icon size={19} className={on ? 'text-neutral-900' : 'text-neutral-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-extrabold text-neutral-900 leading-tight">{l.label}</p>
                <p className="text-[12px] text-neutral-500">{l.sub}</p>
              </div>
              <AnimatePresence>
                {on && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}
                    className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-neutral-900" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}

        {/* optional power-user expander — no wall of chips by default */}
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-center gap-1.5 py-2 text-[13px] font-bold text-neutral-400" data-testid="button-add-craving">
          <Plus size={14} /> Add a specific craving
        </button>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-2 pb-1">
            {['🍜 Thai', '🍣 Japanese', '🍕 Italian', '🦐 Seafood', '🌮 Mexican'].map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-full bg-white border border-black/[0.06] text-[12px] font-bold text-neutral-600">{c}</span>
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex-1" />

      {/* CTA */}
      <div className="px-5 pb-8 pt-3 bg-[#FCFCFC] border-t border-black/[0.04]">
        <button className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.5)' }} data-testid="button-compare">
          Line up the matchups
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
