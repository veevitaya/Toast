import { motion } from 'framer-motion';
import { Utensils, Wine, Cake, Mountain, Lock, Check, Share2, Clock, MapPin, Sparkles, MessageCircle } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const NODES = [
  { id: 'food',    label: 'Dinner',  sub: 'Som Tam Nua',  Icon: Utensils, x: 30,  y: 145, time: '7:30 PM', area: 'Sukhumvit 38' },
  { id: 'drinks',  label: 'Drinks',  sub: 'Vertigo · 60F',Icon: Wine,     x: 130, y: 90,  time: '9:15 PM', area: 'Banyan Tree' },
  { id: 'dessert', label: 'Dessert', sub: 'After You',    Icon: Cake,     x: 230, y: 155, time: '10:45 PM',area: 'Thonglor 13' },
  { id: 'walk',    label: 'Walk',    sub: 'Lumphini park',Icon: Mountain, x: 330, y: 80,  time: '11:30 PM',area: 'Silom' },
] as const;

export default function FlowPathFinalLocked() {
  return (
    <div className="w-[390px] min-h-[844px] overflow-hidden font-['Figtree',sans-serif] relative bg-gradient-to-b from-amber-100/30 via-orange-50/20 to-violet-100/30" style={{ backgroundColor: '#FAFAF8' }} data-testid="flow-path-final">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 28%, rgba(255,204,2,0.16), transparent 60%)' }} />

      <div className="h-[44px] relative" />

      {/* Top status badge */}
      <div className="px-5 flex items-center justify-center relative">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring }} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 shadow-[0_4px_18px_-2px_rgba(0,0,0,0.25)]">
          <Lock size={11} className="text-[#FFCC02]" />
          <span className="text-[11px] font-bold text-white">Locked · Tonight</span>
        </motion.div>
      </div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ...spring }} className="px-7 mt-7 text-center relative">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Your night</p>
        <h1 className="text-[30px] font-extrabold text-neutral-900 leading-[1.05] mt-2">
          It's locked in.<br />
          <span className="bg-gradient-to-r from-[#FFCC02] to-[#FB923C] bg-clip-text text-transparent">Have a good one.</span>
        </h1>
      </motion.div>

      {/* THE FINAL PATH — settled with traveling glow */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative mt-6 mx-2 h-[210px]">
        <svg width="370" height="200" viewBox="0 0 370 200" className="block">
          <defs>
            <linearGradient id="final-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCC02" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
            <filter id="final-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {/* Wide glow */}
          <motion.path
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
            d="M30 145 Q80 85 130 85 Q180 85 230 155 Q280 195 330 75"
            fill="none" stroke="url(#final-grad)" strokeWidth="18" strokeLinecap="round" opacity="0.3" filter="url(#final-glow)"
          />
          <path d="M30 145 Q80 85 130 85 Q180 85 230 155 Q280 195 330 75" fill="none" stroke="url(#final-grad)" strokeWidth="3" strokeLinecap="round" />
          {/* Traveling glow dot */}
          <motion.circle
            r="5" fill="#fff"
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            transition={{ delay: 0.6, duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ offsetPath: 'path("M30 145 Q80 85 130 85 Q180 85 230 155 Q280 195 330 75")', filter: 'drop-shadow(0 0 6px rgba(255,204,2,0.9))' }}
          />
        </svg>

        {NODES.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, ...spring }}
            className="absolute"
            style={{ left: n.x - 26, top: n.y - 26 }}
          >
            <div className="w-13 h-13 rounded-full bg-[#FFCC02] flex items-center justify-center relative" style={{ width: 52, height: 52, boxShadow: '0 0 24px -2px rgba(255,204,2,0.55), 0 4px 18px -2px rgba(0,0,0,0.1)' }}>
              <n.Icon size={19} className="text-neutral-900" />
              <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-neutral-900 flex items-center justify-center" style={{ width: 18, height: 18 }}>
                <Check size={9} className="text-[#FFCC02]" strokeWidth={3} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-neutral-900 text-center mt-1 w-16 -ml-2">{n.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Itinerary list */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="px-5 mt-1">
        <div className="bg-white/85 backdrop-blur rounded-3xl border border-white/80 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
          {NODES.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + i * 0.06, ...spring }}
              className={`flex items-center gap-3 p-3 ${i < NODES.length - 1 ? 'border-b border-neutral-100' : ''}`}
            >
              <div className="flex flex-col items-center w-10">
                <span className="text-[10px] font-bold text-[#FB923C]">{n.time.split(' ')[0]}</span>
                <span className="text-[8px] text-neutral-400 -mt-0.5">{n.time.split(' ')[1]}</span>
              </div>
              <div className="w-px h-9 bg-neutral-200" />
              <div className="w-9 h-9 rounded-xl bg-[#FFCC02]/15 flex items-center justify-center flex-shrink-0">
                <n.Icon size={14} className="text-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-neutral-900">{n.label} · {n.sub}</p>
                <p className="text-[10px] text-neutral-500 flex items-center gap-1"><MapPin size={9} />{n.area}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Vibe chip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="px-6 mt-3 flex items-center justify-center gap-2">
        <Sparkles size={11} className="text-[#FFCC02]" />
        <span className="text-[11px] font-semibold text-neutral-500">Warm · social · 4 stops · ~4 hrs</span>
      </motion.div>

      {/* CTAs */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-7 pt-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/95 to-transparent">
        <div className="flex gap-2.5">
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, ...spring }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-14 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-[14px] text-neutral-700 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
            data-testid="button-tweak"
          >
            <Share2 size={14} />
            Share
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.55, ...spring }}
            whileTap={{ scale: 0.97 }}
            className="flex-[1.6] h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-white shadow-[0_8px_24px_-4px_rgba(6,199,85,0.5)]"
            style={{ background: 'linear-gradient(135deg, #06C755, #04A847)' }}
            data-testid="button-share-line"
          >
            <MessageCircle size={16} className="fill-white" />
            Send to LINE
          </motion.button>
        </div>
        <p className="text-center text-[10px] text-neutral-400 mt-2.5 flex items-center justify-center gap-1">
          <Clock size={10} />Starts in 2 hrs · You'll get a reminder
        </p>
      </div>

      <div className="absolute bottom-1 left-0 right-0 pointer-events-none">
        <p className="text-center text-[8px] text-neutral-300 font-medium tracking-wider uppercase">Toast Flow Path · Final Locked</p>
      </div>
    </div>
  );
}
