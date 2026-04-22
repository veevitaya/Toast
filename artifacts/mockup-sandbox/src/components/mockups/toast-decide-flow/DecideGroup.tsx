import { motion } from 'framer-motion';
import { Crown, Lock, Star, MapPin, Clock, Sparkles, RotateCcw, MessageCircle, X } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 30 };

const PEOPLE = [
  { id: 'mai', name: 'Mai', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', host: true, status: 'You' },
  { id: 'pim', name: 'Pim', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80', status: 'looking now' },
  { id: 'noi', name: 'Noi', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', status: 'in' },
  { id: 'ton', name: 'Ton', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', status: 'in' },
];

const COMMON = ['Spicy', 'Casual', 'Walking distance', 'Open late'];

export default function DecideGroup() {
  return (
    <div className="w-[390px] h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="decide-group">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Close" data-testid="button-close" className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <X size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">Group decide</p>
          <p className="text-[12px] font-black text-neutral-900">4 of 4 in</p>
        </div>
        <button aria-label="Chat" data-testid="button-chat" className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center relative">
          <MessageCircle size={15} className="text-neutral-900" strokeWidth={2.3} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF385C] text-white text-[9px] font-bold flex items-center justify-center">2</span>
        </button>
      </div>

      {/* Live presence row */}
      <div className="px-5 mt-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="flex items-center justify-center gap-3">
          {PEOPLE.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.05 + i * 0.05 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <img src={p.img} alt={p.name} className="w-11 h-11 rounded-full object-cover" />
                {p.host && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FFCC02] border-2 border-white flex items-center justify-center">
                    <Crown size={8} className="text-neutral-900" strokeWidth={2.5} />
                  </div>
                )}
                {!p.host && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>
              <p className="text-[10px] font-bold text-neutral-900 mt-1">{p.name}</p>
              <p className={`text-[8px] font-semibold ${p.host ? 'text-[#B58900]' : p.status === 'looking now' ? 'text-emerald-600' : 'text-neutral-400'}`}>{p.status}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Headline */}
      <div className="px-5 mt-5 text-center">
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }} className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFCC02]">Toast picked for the group</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.25 }} className="text-[24px] font-black text-neutral-900 leading-[1.1] mt-1 tracking-[-0.015em]">Best fit for all 4 of you</motion.h1>
      </div>

      {/* The pick — single hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.3 }}
        className="mx-5 mt-4 rounded-3xl overflow-hidden bg-white border border-neutral-100 shadow-[0_18px_42px_-12px_rgba(0,0,0,0.15)]"
      >
        <div className="relative h-[200px] bg-neutral-200">
          <motion.img
            src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&auto=format&fit=crop&q=80"
            alt="Som Tam Nua"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[#FFCC02] flex items-center gap-1">
            <Sparkles size={10} className="text-neutral-900" />
            <span className="text-[10px] font-black text-neutral-900">All 4 match · 91%</span>
          </div>
          <div className="absolute left-3 bottom-3 right-3 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Dinner · 7:30 PM</p>
            <p className="text-[22px] font-black tracking-[-0.015em] leading-tight mt-0.5">Som Tam Nua</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold">
              <span className="flex items-center gap-1"><Star size={10} className="fill-white" /> 4.86</span>
              <span className="flex items-center gap-1"><MapPin size={10} /> 8 min midpoint</span>
              <span className="flex items-center gap-1"><Clock size={10} /> seats now</span>
            </div>
          </div>
        </div>
        <div className="p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">Common ground</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {COMMON.map(t => (
              <span key={t} className="px-2 py-1 rounded-full bg-amber-50 text-[10px] font-bold text-[#B58900]">{t}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Decision-maker callout */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.45 }} className="mx-5 mt-3 px-3 py-2.5 rounded-2xl bg-neutral-900 text-white flex items-center gap-2.5">
        <img src={PEOPLE[0].img} alt="Mai" className="w-7 h-7 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-[12px] font-black leading-tight">Mai, you have final say</p>
          <p className="text-[10px] text-white/65 leading-tight mt-0.5">Lock for everyone · or swap once · group can't override</p>
        </div>
        <Crown size={14} className="text-[#FFCC02]" />
      </motion.div>

      <div className="h-[100px]" />

      {/* Sticky CTAs */}
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.5 }} className="absolute left-0 right-0 bottom-0 px-5 pb-7 pt-3 bg-gradient-to-t from-white via-white to-white/0">
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.95 }} className="w-[58px] h-[56px] rounded-2xl bg-white border border-neutral-200 flex items-center justify-center" data-testid="group-swap" aria-label="Swap pick">
            <RotateCcw size={17} className="text-neutral-900" strokeWidth={2.5} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-[56px] rounded-2xl bg-[#FFCC02] text-neutral-900 font-black text-[15px] flex items-center justify-center gap-2 shadow-[0_14px_32px_-8px_rgba(255,204,2,0.55)]" data-testid="group-lock">
            <Lock size={15} strokeWidth={3} className="fill-neutral-900" /> Lock for everyone
          </motion.button>
        </div>
        <p className="text-center text-[10px] text-neutral-500 font-semibold mt-2">3 of 3 said "let Mai pick"</p>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[8px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Decide · Group consensus</p>
    </div>
  );
}
