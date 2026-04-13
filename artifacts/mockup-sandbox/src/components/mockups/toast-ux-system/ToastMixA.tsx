import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const MEMBERS = [
  { id: 'ploy', name: 'Ploy', avatar: 'https://i.pravatar.cc/150?u=ploy', vibes: ['Chill', 'Fun'], color: '#FFCC02' },
  { id: 'beam', name: 'Beam', avatar: 'https://i.pravatar.cc/150?u=beam', vibes: ['Social', 'Fun'], color: '#818cf8' },
  { id: 'fern', name: 'Fern', avatar: 'https://i.pravatar.cc/150?u=fern', vibes: ['Chill', 'Artsy'], color: '#34d399' },
  { id: 'ice', name: 'Ice', avatar: 'https://i.pravatar.cc/150?u=ice', vibes: ['Fun', 'Budget'], color: '#fb7185' },
];

export default function ToastMixA() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'gathering' | 'mixing' | 'converging' | 'done'>('gathering');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.8;
        if (next >= 100) { clearInterval(interval); setPhase('done'); return 100; }
        if (next > 70) setPhase('converging');
        else if (next > 25) setPhase('mixing');
        return next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const radius = Math.max(90 - progress * 0.85, 8);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#0a0a0a] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col">
      <div className="h-[44px]" />

      <div className="px-6 flex justify-center items-center gap-4 mt-4">
        {MEMBERS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <img src={m.avatar} alt={m.name} className="w-11 h-11 rounded-full border-2 object-cover" style={{ borderColor: m.color }} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
              <Check size={8} className="text-white" strokeWidth={3} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <motion.h1
          className="text-[24px] font-extrabold text-white"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {phase === 'gathering' && 'Gathering vibes...'}
          {phase === 'mixing' && 'Mixing together...'}
          {phase === 'converging' && 'Almost there...'}
          {phase === 'done' && '✨ Found your match'}
        </motion.h1>
      </div>

      <div className="flex-1 flex items-center justify-center -mt-8">
        <div className="relative w-[300px] h-[300px]">
          <motion.div
            className="absolute inset-0 rounded-full border border-white/5"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-white/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {MEMBERS.map((m, i) => {
            const angle = (i / MEMBERS.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius + 150;
            const y = Math.sin(angle) * radius + 150;
            const blobSize = 80 + (progress > 50 ? (progress - 50) * 1.2 : 0);

            return (
              <motion.div key={m.id} className="absolute" style={{ left: 0, top: 0 }}>
                <motion.div
                  animate={{
                    x: x - blobSize / 2,
                    y: y - blobSize / 2,
                    width: blobSize,
                    height: blobSize,
                  }}
                  transition={{ type: "spring", stiffness: 30, damping: 15 }}
                  className="rounded-full absolute"
                  style={{
                    background: `radial-gradient(circle, ${m.color}60, ${m.color}10)`,
                    filter: `blur(${12 + progress * 0.2}px)`,
                  }}
                />
                <motion.div
                  animate={{ x: x - 18, y: y - 18 }}
                  transition={{ type: "spring", stiffness: 40, damping: 15 }}
                  className="absolute"
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-black/50 shadow-lg"
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {progress > 40 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-20 h-20 rounded-full bg-[#FFCC02]/20 flex items-center justify-center" style={{ filter: 'blur(8px)' }} />
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,204,2,0.5)]"
            >
              <Sparkles size={24} className="text-neutral-900" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-8 mb-4">
        <div className="flex justify-between text-[11px] text-white/40 mb-2">
          <span>Gathering</span>
          <span>Mixing</span>
          <span>Match</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#FFCC02] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Vibe signals</p>
          {MEMBERS.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-1.5">
              <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-[12px] text-white/70 w-10">{m.name}</span>
              <div className="flex gap-1.5">
                {m.vibes.map((v, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60">{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-[11px] text-white/30 italic">Tap an avatar to see their influence</p>
      </div>
    </div>
  );
}
