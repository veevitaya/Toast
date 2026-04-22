import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Crown, Lock, Star, Heart, MessageCircle, Plus, Check } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const PEOPLE = [
  { id: 'mai', name: 'Mai', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
  { id: 'pim', name: 'Pim', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80' },
  { id: 'noi', name: 'Noi', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
  { id: 'ton', name: 'Ton', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
];

const STOPS = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', time: '7:30 PM', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&auto=format&fit=crop&q=80', votes: 4, status: 'locked' as const, rating: 4.86 },
  { id: 'drinks', label: 'Drinks', name: 'Vertigo · 60F', time: '9:15 PM', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&auto=format&fit=crop&q=80', votes: 3, status: 'leading' as const, rating: 4.92, alt: 'Rabbit Hole' },
  { id: 'dessert', label: 'Dessert', name: 'Pick a spot', time: '10:45 PM', img: '', votes: 0, status: 'open' as const, rating: 0 },
];

export default function HybridGroup() {
  const [showSuggest, setShowSuggest] = useState(true);

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="hybrid-group">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <p className="text-[12px] font-bold text-neutral-900">Mai's Thursday</p>
        <button aria-label="Chat" data-testid="button-chat" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center relative">
          <MessageCircle size={15} className="text-neutral-900" strokeWidth={2.2} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF385C] text-white text-[9px] font-bold flex items-center justify-center">2</span>
        </button>
      </div>

      {/* Compact host bar */}
      <div className="px-5 mt-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="flex items-center gap-3">
          <div className="relative">
            <img src={PEOPLE[0].img} alt="Mai" className="w-11 h-11 rounded-full object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FFCC02] border-2 border-white flex items-center justify-center">
              <Crown size={8} className="text-neutral-900" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[14px] font-bold text-neutral-900">Mai is hosting</p>
              <Star size={10} className="text-neutral-900 fill-neutral-900" />
              <span className="text-[10px] font-bold text-neutral-700">Superhost</span>
            </div>
            <div className="flex -space-x-1.5 mt-0.5 items-center">
              {PEOPLE.map(p => <img key={p.id} src={p.img} alt={p.name} className="w-5 h-5 rounded-full object-cover border border-white" />)}
              <button className="ml-1.5 w-5 h-5 rounded-full border border-dashed border-neutral-300 flex items-center justify-center" aria-label="Invite" data-testid="invite-friend">
                <Plus size={9} className="text-neutral-500" strokeWidth={2.5} />
              </button>
              <span className="text-[10px] font-semibold text-neutral-500 ml-1.5">4 going</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-5 mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFCC02]">The plan, together</p>
        <h1 className="text-[20px] font-bold text-neutral-900 leading-[1.15] mt-1 tracking-[-0.01em]">Vote · suggest · lock</h1>
      </div>

      {/* Timeline with vote chips */}
      <div className="px-5 mt-4 relative">
        <div className="absolute left-[28px] top-[18px] bottom-[18px] w-px bg-gradient-to-b from-[#FFCC02] via-amber-300 to-amber-200/60" />

        <div className="space-y-2.5">
          {STOPS.map((s, i) => {
            const isOpen = s.status === 'open';
            const isLocked = s.status === 'locked';
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.1 + i * 0.05 }}
                className="relative"
              >
                <div className={`absolute left-[20px] top-[20px] w-[18px] h-[18px] rounded-full flex items-center justify-center z-10 ${isLocked ? 'bg-[#FFCC02]' : 'bg-white border-2 border-[#FFCC02]'}`}>
                  {isLocked && <Check size={10} className="text-neutral-900" strokeWidth={3} />}
                </div>

                <div className={`ml-12 rounded-2xl bg-white border overflow-hidden ${isLocked ? 'border-neutral-900' : 'border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}>
                  <div className="flex items-center gap-3 p-2.5">
                    <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 ${isOpen ? 'bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center' : 'bg-neutral-100'}`}>
                      {isOpen ? <Plus size={16} className="text-neutral-400" strokeWidth={2.5} /> : <img src={s.img} alt={s.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
                        <span className="text-[10px] font-bold text-neutral-700">{s.time}</span>
                      </div>
                      <p className={`text-[13px] font-bold truncate leading-tight mt-0.5 ${isOpen ? 'text-neutral-400' : 'text-neutral-900'}`}>{s.name}</p>
                      {!isOpen && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={9} className="text-neutral-900 fill-neutral-900" />
                          <span className="text-[10px] font-bold text-neutral-900">{s.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Voting strip */}
                  {!isOpen && (
                    <div className="px-2.5 pb-2.5 flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {PEOPLE.slice(0, s.votes).map(p => <img key={p.id} src={p.img} alt={p.name} className="w-5 h-5 rounded-full object-cover border border-white" />)}
                        {Array.from({ length: 4 - s.votes }).map((_, k) => <div key={k} className="w-5 h-5 rounded-full bg-neutral-100 border border-white" />)}
                      </div>
                      <span className={`text-[10px] font-bold ${isLocked ? 'text-emerald-600' : 'text-neutral-500'}`}>
                        {isLocked ? 'All in' : `${s.votes} of 4 voted`}
                      </span>
                      {!isLocked && (
                        <button className="ml-auto px-2.5 py-1 rounded-full bg-[#FFCC02]/15 text-neutral-900 text-[10px] font-bold" data-testid={`vote-${s.id}`}>Vote</button>
                      )}
                    </div>
                  )}
                  {isOpen && (
                    <div className="px-2.5 pb-2.5">
                      <button className="w-full h-9 rounded-xl bg-amber-50 text-neutral-900 text-[11px] font-bold border border-dashed border-[#FFCC02]/60" data-testid={`pick-${s.id}`}>
                        Pick a dessert spot
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Suggestion bubble — Airbnb host-message style */}
      <AnimatePresence>
        {showSuggest && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={spring}
            className="absolute left-5 right-5 bottom-6"
          >
            <div className="bg-neutral-900 text-white rounded-[20px] p-3 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)]">
              <div className="flex items-start gap-3">
                <img src={PEOPLE[1].img} alt="Pim" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[12px] font-bold">Pim</p>
                    <p className="text-[9px] opacity-60">just now</p>
                  </div>
                  <p className="text-[12px] mt-0.5 leading-snug">"Swap drinks for <span className="font-bold text-[#FFCC02]">Rabbit Hole</span>? Closer for everyone 🐇"</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2.5 pl-11">
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowSuggest(false)} className="flex-1 h-8 rounded-lg bg-white/10 text-white text-[11px] font-bold" data-testid="suggest-decline" aria-label="Keep current">Keep Vertigo</motion.button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowSuggest(false)} className="flex-1 h-8 rounded-lg bg-[#FFCC02] text-neutral-900 text-[11px] font-bold flex items-center justify-center gap-1 shadow-[0_4px_12px_-2px_rgba(255,204,2,0.5)]" data-testid="suggest-accept" aria-label="Swap suggestion">
                  <Heart size={10} strokeWidth={3} className="fill-neutral-900" /> Swap
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Hybrid · Group timeline</p>
    </div>
  );
}
