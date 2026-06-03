import { motion } from 'framer-motion';
import { X, Heart, Star, MapPin, Check } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const CURRENT = {
  name: 'Som Tum Nua', type: 'Thai · Spicy salad', rating: '4.6', walk: '6 min', price: '฿', match: 90,
  img: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=70',
  why: 'Matches your comforting & spicy streak',
};
const KEPT = { name: 'Khao Soi', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&q=70' };

export default function ToastStories() {
  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col bg-neutral-900" data-testid="quiz-stories">
      {/* full-bleed image */}
      <img src={CURRENT.img} alt={CURRENT.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 45%,rgba(0,0,0,0.85) 100%)' }} />

      {/* segmented progress */}
      <div className="relative px-4 pt-[52px] flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div className="h-full bg-white" style={{ width: i < 1 ? '100%' : i === 1 ? '55%' : '0%' }} />
          </div>
        ))}
      </div>

      {/* top row */}
      <div className="relative px-4 mt-3 flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#FFE38A]">Comforting & easy</span>
        <span className="text-[12px] font-semibold text-white/70">2 of 5</span>
      </div>

      {/* compare tray */}
      <div className="relative px-4 mt-4">
        <div className="inline-flex items-center gap-2 px-2 py-1.5 rounded-full bg-black/35 backdrop-blur-sm border border-white/15" data-testid="compare-tray">
          <span className="text-[11px] font-bold text-white/80 pl-1">Compare tray</span>
          <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#FFCC02]">
            <img src={KEPT.img} alt="kept" className="w-full h-full object-cover" />
          </div>
          <div className="w-7 h-7 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center">
            <Heart size={12} className="text-white/50" />
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* contender info */}
      <div className="relative px-5 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-[#FFCC02] text-[11px] font-extrabold text-neutral-900">{CURRENT.match}% match</span>
          <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold text-white flex items-center gap-1">
            <Star size={10} className="text-[#FFE38A] fill-[#FFE38A]" />{CURRENT.rating}
          </span>
        </div>
        <h1 className="text-[28px] font-extrabold text-white leading-tight">{CURRENT.name}</h1>
        <p className="text-[14px] text-white/80 font-medium mt-0.5">{CURRENT.type}</p>
        <div className="flex items-center gap-3 mt-2 text-[13px] font-semibold text-white/85">
          <span className="flex items-center gap-1"><MapPin size={13} />{CURRENT.walk}</span>
          <span>·</span><span>{CURRENT.price}</span>
        </div>
        <p className="text-[12.5px] text-white/65 mt-2">✨ {CURRENT.why}</p>
      </div>

      {/* actions */}
      <div className="relative px-8 pb-9 flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.9 }} className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center" data-testid="button-skip">
          <X size={24} className="text-white" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="flex-1 mx-4 h-13 py-3.5 rounded-full bg-[#FFCC02] text-neutral-900 text-[14px] font-extrabold flex items-center justify-center gap-1.5" data-testid="button-compare">
          <Check size={16} strokeWidth={3} /> Keep to compare
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="w-14 h-14 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_6px_18px_-4px_rgba(255,204,2,0.7)]" data-testid="button-keep">
          <Heart size={22} className="text-neutral-900 fill-neutral-900" />
        </motion.button>
      </div>
    </div>
  );
}
