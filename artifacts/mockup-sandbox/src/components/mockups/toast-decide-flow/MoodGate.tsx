import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Coffee, Sparkles, Users, MapPin, Zap, ArrowRight } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const MOODS = [
  {
    id: 'quick',
    title: 'Quick & casual',
    sub: 'Now · near me · ≤฿฿',
    img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    overlay: 'linear-gradient(135deg, rgba(251,191,36,0.78), rgba(249,115,22,0.85))',
    Icon: Coffee,
  },
  {
    id: 'special',
    title: 'Special & worth it',
    sub: 'Plan it · ฿฿฿ · date-night vibes',
    img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
    overlay: 'linear-gradient(135deg, rgba(217,70,239,0.72), rgba(244,63,94,0.85))',
    Icon: Sparkles,
  },
];

const COMPANIONS = [
  { id: 'solo', label: 'Solo', emoji: '🥢' },
  { id: 'date', label: 'Date', emoji: '💛' },
  { id: 'crew', label: 'With crew', emoji: '🍻' },
];

export default function MoodGate() {
  const [mood, setMood] = useState<string>('quick');
  const [companion, setCompanion] = useState<string>('solo');

  return (
    <div className="w-[390px] h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="mood-gate">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100">
          <span className="text-[10px] font-bold text-neutral-700">Step 1 of 1</span>
          <span className="w-1 h-1 rounded-full bg-neutral-300" />
          <span className="text-[10px] font-bold text-neutral-500">~6 sec</span>
        </div>
        <button className="text-[12px] font-bold text-neutral-500 underline underline-offset-2" data-testid="skip-mood">Skip</button>
      </div>

      <div className="px-5 mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFCC02]">Two taps</p>
        <h1 className="text-[28px] font-black text-neutral-900 leading-[1.05] mt-1.5 tracking-[-0.02em]">What's the vibe<br/>tonight?</h1>
        <p className="text-[12px] text-neutral-500 mt-2">No quizzes. We'll pick somewhere in 10 sec.</p>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {MOODS.map((m, i) => {
          const active = mood === m.id;
          const Icon = m.Icon;
          return (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMood(m.id)}
              className="relative w-full h-[150px] rounded-3xl overflow-hidden text-left block"
              style={{
                boxShadow: active ? '0 0 0 3px #FFCC02, 0 0 0 6px #fff, 0 12px 28px -10px rgba(0,0,0,0.25)' : '0 6px 18px -8px rgba(0,0,0,0.18)',
              }}
              data-testid={`mood-${m.id}`}
            >
              <img src={m.img} alt={m.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: m.overlay }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="relative h-full p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Icon size={16} strokeWidth={2.4} />
                  </div>
                  {active && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring} className="px-2.5 py-1 rounded-full bg-[#FFCC02] flex items-center gap-1">
                      <span className="text-[10px] font-black text-neutral-900">Picked</span>
                    </motion.div>
                  )}
                </div>
                <div>
                  <p className="text-[22px] font-black leading-tight tracking-[-0.015em]">{m.title}</p>
                  <p className="text-[12px] font-semibold text-white/85 mt-1">{m.sub}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }} className="px-5 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 flex items-center gap-1.5">
          <Users size={11} /> Who's with you?
        </p>
        <div className="flex gap-2 mt-2.5">
          {COMPANIONS.map(c => {
            const active = companion === c.id;
            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCompanion(c.id)}
                className={`flex-1 h-12 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-1.5 border-2 transition-all ${active ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'}`}
                data-testid={`companion-${c.id}`}
              >
                <span>{c.emoji}</span> {c.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="px-5 mt-4 flex items-center justify-between text-[11px] text-neutral-500">
        <div className="flex items-center gap-1.5"><MapPin size={11} className="text-[#FFCC02]" /> <span className="font-semibold">Sukhumvit · within 1.5 km</span></div>
        <button className="font-bold text-neutral-700 underline underline-offset-2" data-testid="change-radius">change</button>
      </motion.div>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.4 }}
        className="absolute left-0 right-0 bottom-0 px-5 pb-7 pt-3 bg-gradient-to-t from-white via-white to-white/0"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full h-[58px] rounded-2xl bg-neutral-900 text-white font-black text-[15px] flex items-center justify-center gap-2 shadow-[0_14px_32px_-8px_rgba(0,0,0,0.4)]"
          data-testid="cta-decide-now"
        >
          <Zap size={16} className="text-[#FFCC02] fill-[#FFCC02]" strokeWidth={2.5} />
          Toast it for me
          <ArrowRight size={16} strokeWidth={2.5} />
        </motion.button>
      </motion.div>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[8px] uppercase tracking-[0.18em] text-neutral-300 z-10 pointer-events-none">Toast · Decide · Mood gate</p>
    </div>
  );
}
