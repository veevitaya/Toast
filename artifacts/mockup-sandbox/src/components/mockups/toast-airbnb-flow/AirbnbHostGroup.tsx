import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Crown, Star, Heart, MessageCircle, Plus, Check } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 32 };

const PEOPLE = [
  { id: 'mai', name: 'Mai', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', host: true },
  { id: 'pim', name: 'Pim', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80' },
  { id: 'noi', name: 'Noi', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
  { id: 'ton', name: 'Ton', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
];

const STOPS = [
  { id: 'dinner', label: 'Dinner', name: 'Som Tam Nua', time: '7:30 PM', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&auto=format&fit=crop&q=80', votes: 4, status: 'locked' as const },
  { id: 'drinks', label: 'Drinks', name: 'Vertigo · 60F', time: '9:15 PM', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&auto=format&fit=crop&q=80', votes: 3, status: 'voting' as const },
  { id: 'dessert', label: 'Dessert', name: 'After You', time: '10:45 PM', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80', votes: 2, status: 'voting' as const },
];

export default function AirbnbHostGroup() {
  const [showSuggest, setShowSuggest] = useState(true);

  return (
    <div className="w-[390px] min-h-[844px] bg-white font-['Figtree',sans-serif] relative overflow-hidden" data-testid="airbnb-flow-host">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <ChevronLeft size={16} className="text-neutral-900" strokeWidth={2.5} />
        </button>
        <p className="text-[12px] font-bold text-neutral-900">Group night</p>
        <button aria-label="Chat" data-testid="button-chat" className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center relative">
          <MessageCircle size={15} className="text-neutral-900" strokeWidth={2.2} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF385C] text-white text-[9px] font-bold flex items-center justify-center">2</span>
        </button>
      </div>

      {/* Host header — Superhost style */}
      <div className="px-5 mt-5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">Hosted by</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="relative">
              <img src={PEOPLE[0].img} alt="Mai" className="w-14 h-14 rounded-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#FFCC02] border-2 border-white flex items-center justify-center">
                <Crown size={10} className="text-neutral-900" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[18px] font-bold text-neutral-900 leading-tight tracking-[-0.01em]">Mai's Thursday</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={11} className="text-neutral-900 fill-neutral-900" />
                <span className="text-[12px] font-bold text-neutral-900">Superhost</span>
                <span className="text-[12px] text-neutral-500">· 12 nights hosted</span>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-neutral-600 leading-snug mt-3">"A chill warm-up dinner, then up to Vertigo for the skyline. Dessert is open — vote below 🍰"</p>
        </motion.div>

        {/* People row */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex -space-x-2">
            {PEOPLE.map((p, i) => (
              <motion.img
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: 0.1 + i * 0.04 }}
                src={p.img}
                alt={p.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            ))}
          </div>
          <button className="ml-1 w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center" data-testid="button-invite" aria-label="Invite friend">
            <Plus size={14} className="text-neutral-500" strokeWidth={2.5} />
          </button>
          <span className="text-[12px] font-semibold text-neutral-500 ml-1">4 going · invite more</span>
        </div>
      </div>

      {/* Itinerary cards */}
      <div className="px-5 mt-6">
        <div className="flex items-end justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">The plan</p>
          <p className="text-[11px] font-semibold text-neutral-500">3 stops · ~4 hrs</p>
        </div>
        <div className="space-y-2.5">
          {STOPS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.05 }}
              className={`relative flex items-center gap-3 p-2.5 rounded-2xl bg-white border ${s.status === 'locked' ? 'border-neutral-900' : 'border-neutral-100'}`}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                {s.status === 'locked' && (
                  <div className="absolute inset-0 bg-neutral-900/25 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center">
                      <Check size={12} className="text-neutral-900" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{s.label} · {s.time}</p>
                <p className="text-[14px] font-bold text-neutral-900 truncate leading-tight mt-0.5">{s.name}</p>
                {/* Vote avatars */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex -space-x-1.5">
                    {PEOPLE.slice(0, s.votes).map(p => (
                      <img key={p.id} src={p.img} alt={p.name} className="w-4 h-4 rounded-full object-cover border border-white" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500">{s.status === 'locked' ? 'All in' : `${s.votes}/4 voted`}</span>
                </div>
              </div>
              {s.status === 'voting' && (
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-[#FFCC02]/15 text-neutral-900 text-[11px] font-bold" data-testid={`vote-${s.id}`}>
                  Vote
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggestion bubble - Airbnb message style */}
      <AnimatePresence>
        {showSuggest && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={spring}
            className="absolute left-5 right-5 bottom-6"
          >
            <div className="bg-neutral-900 text-white rounded-[20px] p-3.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)]">
              <div className="flex items-start gap-3">
                <img src={PEOPLE[1].img} alt="Pim" className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[13px] font-bold">Pim</p>
                    <p className="text-[10px] opacity-60">just now</p>
                  </div>
                  <p className="text-[13px] mt-0.5 leading-snug">"What about <span className="font-bold text-[#FFCC02]">Rabbit Hole</span> instead? Closer for everyone 🐇"</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pl-12">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowSuggest(false)}
                  className="flex-1 h-9 rounded-xl bg-white/10 text-white text-[12px] font-bold flex items-center justify-center gap-1"
                  data-testid="suggest-decline"
                  aria-label="Decline suggestion"
                >
                  Keep Vertigo
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowSuggest(false)}
                  className="flex-1 h-9 rounded-xl bg-[#FFCC02] text-neutral-900 text-[12px] font-bold flex items-center justify-center gap-1 shadow-[0_4px_14px_-2px_rgba(255,204,2,0.5)]"
                  data-testid="suggest-accept"
                  aria-label="Accept suggestion"
                >
                  <Heart size={11} strokeWidth={3} className="fill-neutral-900" /> Swap it
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute left-0 right-0 bottom-1 text-center text-[9px] uppercase tracking-[0.18em] text-neutral-300 pointer-events-none">Toast · Airbnb DNA · Host + Group</p>
    </div>
  );
}
