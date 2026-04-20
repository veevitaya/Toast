import { motion } from 'framer-motion';
import { ChevronLeft, Utensils, Wine, Cake, Mountain, Lock, Crown, Heart, ThumbsUp, Sparkles, MoreHorizontal, MessageCircle } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 280, damping: 26 };

const NODES = [
  { id: 'food',    label: 'Dinner',  sub: 'Som Tam Nua',  Icon: Utensils, x: 30,  y: 150, state: 'locked', votes: ['M','P','J','A'], reaction: '🔥' },
  { id: 'drinks',  label: 'Drinks',  sub: 'Rooftop bar',  Icon: Wine,     x: 130, y: 90,  state: 'host',   votes: ['M','P'],         reaction: '👍' },
  { id: 'dessert', label: 'Dessert', sub: 'After You',    Icon: Cake,     x: 230, y: 160, state: 'low',    votes: ['M'],             reaction: null },
  { id: 'walk',    label: 'Walk',    sub: 'Lumphini',     Icon: Mountain, x: 330, y: 80,  state: 'active', votes: ['P','J','A'],     reaction: '❤️' },
] as const;

const PEOPLE = [
  { id: 'M', name: 'Mai',   color: '#FFCC02', host: true,  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=60' },
  { id: 'P', name: 'Pim',   color: '#EC4899', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=60' },
  { id: 'J', name: 'Jay',   color: '#10B981', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=60' },
  { id: 'A', name: 'Aom',   color: '#A78BFA', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=60' },
];

export default function FlowPathHostGroup() {
  return (
    <div className="w-[390px] min-h-[844px] overflow-hidden font-['Figtree',sans-serif] relative bg-gradient-to-br from-orange-100/40 via-transparent to-pink-100/30" style={{ backgroundColor: '#FAFAF8' }} data-testid="flow-path-host">
      <div className="h-[44px]" />

      <div className="px-5 flex items-center justify-between">
        <button aria-label="Back" data-testid="button-back" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <ChevronLeft size={16} className="text-neutral-700" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Crown size={11} className="text-[#FFCC02]" />
          <span className="text-[11px] font-bold text-neutral-800">Mai is hosting</span>
          <span className="w-1 h-1 rounded-full bg-neutral-300" />
          <span className="text-[11px] font-semibold text-neutral-500">4 people</span>
        </div>
        <button aria-label="More options" data-testid="button-more" className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <MoreHorizontal size={16} className="text-neutral-700" />
        </button>
      </div>

      {/* People row */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...spring }} className="px-6 mt-5 flex items-center gap-2">
        {PEOPLE.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05, ...spring }}
            className="flex items-center gap-1.5"
          >
            <div className="relative">
              <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" />
              {p.host && (
                <div className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-[#FFCC02] flex items-center justify-center">
                  <Crown size={8} className="text-neutral-900" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-semibold text-neutral-600">{p.name}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...spring }} className="px-6 mt-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Tonight together</p>
        <h1 className="text-[24px] font-extrabold text-neutral-900 leading-[1.15] mt-1.5">
          You lead.<br />They influence.
        </h1>
      </motion.div>

      {/* PATH */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="relative mt-5 mx-2 h-[235px]">
        <svg width="370" height="220" viewBox="0 0 370 220" className="block">
          <defs>
            <linearGradient id="host-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCC02" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.5" />
            </linearGradient>
            <filter id="host-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <path d="M30 150 Q80 90 130 90 Q180 90 230 160 Q280 200 330 80" fill="none" stroke="url(#host-grad)" strokeWidth="14" strokeLinecap="round" opacity="0.2" filter="url(#host-glow)" />
          <path d="M30 150 Q80 90 130 90 Q180 90 230 160 Q280 200 330 80" fill="none" stroke="url(#host-grad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {NODES.map((n, i) => {
          const isLocked = n.state === 'locked';
          const isHost = n.state === 'host';
          const isLow = n.state === 'low';
          const voteCount = n.votes.length;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, ...spring }}
              className="absolute"
              style={{ left: n.x - 28, top: n.y - 28 }}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center relative ${
                  isLocked ? 'bg-[#FFCC02]' :
                  isHost ? 'bg-white ring-2 ring-[#FFCC02]/60' :
                  isLow ? 'bg-white/70 border border-neutral-200' :
                  'bg-white shadow-[0_4px_18px_-2px_rgba(0,0,0,0.1)]'
                }`}
                style={
                  isLocked ? { boxShadow: '0 0 26px -2px rgba(255,204,2,0.55), 0 4px 18px -2px rgba(0,0,0,0.1)' } :
                  isHost ? { boxShadow: '0 0 22px -2px rgba(255,204,2,0.4)' } :
                  voteCount >= 3 ? { boxShadow: '0 0 18px -2px rgba(236,72,153,0.35), 0 4px 14px -2px rgba(0,0,0,0.08)' } :
                  undefined
                }
              >
                <n.Icon size={20} className={isLocked ? 'text-neutral-900' : isLow ? 'text-neutral-400' : 'text-neutral-700'} />
                {isLocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Lock size={9} className="text-[#FFCC02]" />
                  </div>
                )}
                {isHost && (
                  <div className="absolute -top-1.5 -right-1 w-5 h-5 rounded-full bg-[#FFCC02] flex items-center justify-center">
                    <Crown size={10} className="text-neutral-900" />
                  </div>
                )}
              </div>

              {/* Reaction bubble */}
              {n.reaction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.85 + i * 0.1, ...spring }}
                  className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center text-[11px]"
                >
                  {n.reaction}
                </motion.div>
              )}

              {/* Vote avatars */}
              <div className="flex justify-center -space-x-1.5 mt-1">
                {n.votes.slice(0, 3).map((vid) => {
                  const p = PEOPLE.find(x => x.id === vid)!;
                  return (
                    <img key={vid} src={p.avatar} alt={p.name} className="w-4 h-4 rounded-full object-cover border-2 border-white" />
                  );
                })}
                {n.votes.length > 3 && (
                  <div className="w-4 h-4 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[7px] font-bold text-neutral-700">+{n.votes.length - 3}</div>
                )}
              </div>

              <div className="text-center mt-1 w-20 -ml-3">
                <p className={`text-[11px] font-bold ${isLow ? 'text-neutral-500' : 'text-neutral-900'}`}>{n.label}</p>
                <p className="text-[9px] text-neutral-400 truncate">{n.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Suggestion bubble (group influence) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, ...spring }} className="px-5 mt-1">
        <div className="bg-white rounded-2xl border border-pink-100 shadow-[0_4px_20px_-4px_rgba(236,72,153,0.18)] p-3.5 flex items-center gap-3">
          <img src={PEOPLE[1].avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-neutral-500"><span className="text-neutral-900 font-bold">Pim</span> suggests</p>
            <p className="text-[13px] font-bold text-neutral-900 leading-tight">Wine bar instead of rooftop?</p>
          </div>
          <div className="flex gap-1.5">
            <motion.button aria-label="Decline suggestion" whileTap={{ scale: 0.92 }} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center" data-testid="suggest-decline">
              <span className="text-[14px]">✕</span>
            </motion.button>
            <motion.button aria-label="Accept suggestion" whileTap={{ scale: 0.92 }} className="w-9 h-9 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_2px_10px_-1px_rgba(255,204,2,0.5)]" data-testid="suggest-accept">
              <span className="text-[14px] font-bold text-neutral-900">✓</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Group reactions row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="px-6 mt-3">
        <div className="bg-white/70 backdrop-blur rounded-2xl border border-white/80 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-neutral-600">
            <ThumbsUp size={12} className="text-emerald-500" />
            <span><span className="font-bold text-neutral-900">3</span> agree</span>
            <span className="text-neutral-300">·</span>
            <Heart size={12} className="text-pink-500" />
            <span><span className="font-bold text-neutral-900">2</span> love it</span>
            <span className="text-neutral-300">·</span>
            <MessageCircle size={12} className="text-neutral-500" />
            <span className="font-bold text-neutral-900">1</span>
          </div>
          <button className="text-[10px] font-bold text-[#FFCC02] uppercase tracking-wider" data-testid="button-balance">
            <Sparkles size={10} className="inline mr-0.5" />Balance
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 pt-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/95 to-transparent">
        <motion.button whileTap={{ scale: 0.97 }} className="w-full h-14 bg-neutral-900 rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]" data-testid="button-lock-night">
          <Lock size={15} />
          Lock the night for everyone
        </motion.button>
        <p className="text-center text-[10px] text-neutral-400 mt-2.5">As host, you can lock when ready</p>
      </div>

      <div className="absolute bottom-1 left-0 right-0 pointer-events-none">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-wider uppercase">Toast Flow Path · Host + Group</p>
      </div>
    </div>
  );
}
