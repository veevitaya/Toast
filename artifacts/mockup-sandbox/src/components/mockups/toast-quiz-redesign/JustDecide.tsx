import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Sparkles, RotateCcw, Check } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const WINNER = {
  name: 'Khao Soi Mae Sai', type: 'Thai · Northern noodles', rating: '4.8', walk: '7 min', price: '฿', match: 95,
  img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=70',
  why: 'Your top comfort + spice match tonight',
};
const RUNNER = { name: 'Tom Yum Goong', img: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=200&q=70', match: 91 };

const CONFETTI = [
  { x: '12%', y: '8%', c: '#FFCC02', s: 8 }, { x: '82%', y: '12%', c: '#FF8A3D', s: 7 },
  { x: '24%', y: '20%', c: '#4ADE80', s: 6 }, { x: '70%', y: '6%', c: '#60A5FA', s: 7 },
  { x: '90%', y: '26%', c: '#FFCC02', s: 6 }, { x: '6%', y: '28%', c: '#F472B6', s: 7 },
];

export default function JustDecide() {
  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-decide">
      <div className="h-[44px]" />
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
      </div>

      {/* confetti + heading */}
      <div className="relative px-5 mt-3 text-center">
        {CONFETTI.map((c, i) => (
          <motion.span key={i} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05, ...spring }}
            className="absolute rounded-sm" style={{ left: c.x, top: c.y, width: c.s, height: c.s, background: c.c, transform: `rotate(${i * 40}deg)` }} />
        ))}
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200]">Decided 🎉</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">Toast picked for you</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">No more scrolling. Here's tonight's winner.</p>
      </div>

      {/* winner card */}
      <div className="px-5 mt-5">
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring}
          className="rounded-3xl overflow-hidden bg-white border border-black/[0.05] shadow-[0_12px_30px_-12px_rgba(255,204,2,0.5)]">
          <div className="relative h-[190px]">
            <img src={WINNER.img} alt={WINNER.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.5))' }} />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FFCC02] text-[12px] font-extrabold text-neutral-900">{WINNER.match}% match</span>
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-extrabold flex items-center gap-1">
              <Star size={10} className="text-amber-500 fill-amber-500" />{WINNER.rating}
            </span>
            <div className="absolute left-4 bottom-3 text-left">
              <p className="text-[22px] font-extrabold text-white leading-tight">{WINNER.name}</p>
              <p className="text-[13px] text-white/85">{WINNER.type}</p>
            </div>
          </div>
          <div className="p-3.5 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[13px] font-bold text-neutral-700"><MapPin size={14} className="text-neutral-400" />{WINNER.walk}</span>
            <span className="text-neutral-300">·</span>
            <span className="text-[13px] font-bold text-neutral-700">{WINNER.price}</span>
            <span className="ml-auto inline-flex items-center gap-1 text-[12px] text-[#9A7400] font-semibold"><Sparkles size={13} />Best match</span>
          </div>
        </motion.div>
        <p className="text-[12.5px] text-neutral-400 text-center mt-2.5">✨ {WINNER.why}</p>
      </div>

      <div className="flex-1" />

      {/* primary + undo-to-compare */}
      <div className="px-5 pb-8 pt-3 space-y-3">
        <button className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.5)' }} data-testid="button-lockin">
          <Check size={19} strokeWidth={3} /> Lock it in
        </button>
        <button className="w-full rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] px-4 py-3 flex items-center gap-3" data-testid="button-compare">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
            <img src={RUNNER.img} alt={RUNNER.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[13px] font-extrabold text-neutral-900 leading-tight">Not it? Compare with runner-up</p>
            <p className="text-[11px] text-neutral-500 truncate">{RUNNER.name} · {RUNNER.match}% match</p>
          </div>
          <RotateCcw size={16} className="text-neutral-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
