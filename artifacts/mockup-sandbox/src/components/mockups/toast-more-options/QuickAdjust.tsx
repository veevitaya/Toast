import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, MapPin, Wallet, Navigation, Gem, Shuffle, Sparkles, Check } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 300, damping: 28 };

const CHIPS = [
  { id: 'cheaper', label: 'Cheaper', Icon: Wallet },
  { id: 'closer', label: 'Closer', Icon: Navigation },
  { id: 'fancier', label: 'Fancier', Icon: Gem },
  { id: 'vibe', label: 'Different vibe', Icon: Shuffle },
  { id: 'surprise', label: 'Surprise me', Icon: Sparkles },
];

export default function QuickAdjust() {
  const [active, setActive] = useState<string[]>(['closer']);

  const toggle = (id: string) =>
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="toast-more w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#1A1714' }} data-testid="flow-adjust">
      {/* dimmed result peeking behind sheet */}
      <div className="h-[44px]" />
      <div className="px-5 flex items-center justify-between opacity-40">
        <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <ChevronLeft size={17} className="text-white" />
        </button>
        <span className="text-[13px] font-bold text-white">Toast picks</span>
        <div className="w-9 h-9" />
      </div>
      <div className="px-6 mt-4 opacity-40">
        <div className="rounded-3xl overflow-hidden bg-white/10 h-[150px] relative">
          <img src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=60" alt="current" className="w-full h-full object-cover" />
        </div>
        <p className="text-white text-[18px] font-extrabold mt-3">Som Tam Nua</p>
      </div>

      <div className="flex-1" />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: 380 }}
        animate={{ y: 0 }}
        transition={spring}
        className="rounded-t-[32px] bg-white px-6 pt-3 pb-9 relative"
        style={{ boxShadow: '0 -20px 50px -12px rgba(0,0,0,0.45)' }}
        data-testid="adjust-sheet"
      >
        <div className="w-10 h-1.5 rounded-full bg-neutral-200 mx-auto mb-4" />

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0A800]">No quiz, just nudge it</p>
        <h1 className="text-[22px] font-extrabold text-neutral-900 leading-tight mt-1">Tweak this pick</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Tap what to change — Toast re-picks instantly.</p>

        {/* chips */}
        <div className="flex flex-wrap gap-2.5 mt-4">
          {CHIPS.map((c, i) => {
            const on = active.includes(c.id);
            return (
              <motion.button
                key={c.id}
                onClick={() => toggle(c.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, ...spring }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 pl-3 pr-3.5 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
                  on ? 'bg-[#FFCC02] text-neutral-900' : 'bg-neutral-100 text-neutral-600'
                }`}
                style={on ? { boxShadow: '0 6px 16px -6px rgba(255,204,2,0.6)' } : undefined}
                data-testid={`chip-${c.id}`}
              >
                <c.Icon size={15} className={on ? 'text-neutral-900' : 'text-neutral-400'} />
                {c.label}
              </motion.button>
            );
          })}
        </div>

        {/* live re-pick preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...spring }}
          className="mt-5 rounded-2xl bg-[#FDF8F0] ring-1 ring-[#FFE9A8] p-3 flex items-center gap-3"
          data-testid="repick-preview"
        >
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1552611052-33e04de081de?w=200&q=60" alt="new pick" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#9A7400] bg-[#FFE9A8] px-1.5 py-0.5 rounded">New pick</span>
            </div>
            <p className="text-[14px] font-extrabold text-neutral-900 truncate mt-0.5">Baan Phadthai</p>
            <div className="flex items-center gap-2.5 mt-0.5">
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-neutral-600"><Star size={10} className="text-amber-500 fill-amber-500" />4.6</span>
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-neutral-600"><MapPin size={10} className="text-neutral-400" />6 min</span>
              <span className="text-[11px] font-semibold text-neutral-600">฿฿</span>
            </div>
          </div>
        </motion.div>

        <button
          className="mt-4 w-full h-13 py-3.5 rounded-2xl bg-[#FFCC02] text-neutral-900 text-[15px] font-extrabold flex items-center justify-center gap-2"
          style={{ boxShadow: '0 8px 22px -6px rgba(255,204,2,0.55)' }}
          data-testid="button-apply"
        >
          <Check size={17} strokeWidth={3} /> Use this one
        </button>
      </motion.div>
    </div>
  );
}
