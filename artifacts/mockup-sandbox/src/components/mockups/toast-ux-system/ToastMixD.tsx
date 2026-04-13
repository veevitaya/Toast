import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Heart, MapPin, Star } from 'lucide-react';

const MEMBERS = [
  { id: 'ploy', name: 'Ploy', avatar: 'https://i.pravatar.cc/150?u=ploy', vibes: ['Chill', 'Fun'], color: '#FFCC02' },
  { id: 'beam', name: 'Beam', avatar: 'https://i.pravatar.cc/150?u=beam', vibes: ['Social', 'Fun'], color: '#818cf8' },
  { id: 'fern', name: 'Fern', avatar: 'https://i.pravatar.cc/150?u=fern', vibes: ['Chill', 'Artsy'], color: '#34d399' },
  { id: 'ice', name: 'Ice', avatar: 'https://i.pravatar.cc/150?u=ice', vibes: ['Fun', 'Budget'], color: '#fb7185' },
];

const RESULT = {
  title: 'Octave Rooftop Lounge',
  type: 'Sky Bar · Cocktails',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60',
  rating: '4.8',
  match: 92,
};

export default function ToastMixD() {
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowResult(true), 600);
          return 100;
        }
        return prev + 0.6;
      });
    }, 50);
    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWavePhase(prev => prev + 0.05);
    }, 30);
    return () => clearInterval(waveInterval);
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-gradient-to-b from-amber-50 via-[#FAFAF8] to-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col">
      <div className="h-[44px]" />

      <div className="px-6 mt-4 text-center">
        <p className="text-[12px] font-bold text-[#FFCC02] uppercase tracking-widest">Toast Mix</p>
        <h1 className="text-[28px] font-extrabold text-neutral-900 mt-2 leading-tight">
          {!showResult ? 'Mixing your vibes' : 'Your match is ready'}
        </h1>
      </div>

      <div className="flex justify-center mt-6 gap-5">
        {MEMBERS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-full"
                animate={{
                  boxShadow: [
                    `0 0 0 2px ${m.color}40`,
                    `0 0 0 6px ${m.color}20`,
                    `0 0 0 2px ${m.color}40`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <img src={m.avatar} alt={m.name} className="w-14 h-14 rounded-full object-cover ring-3 ring-white shadow-md relative z-10" />
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <div className="px-2 py-0.5 bg-white rounded-full shadow-sm border border-neutral-100">
                  <span className="text-[9px] font-bold" style={{ color: m.color }}>{m.vibes[0]}</span>
                </div>
              </motion.div>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 mt-3">{m.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="mixing"
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-[240px] h-[240px]"
            >
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border"
                  style={{
                    inset: ring * 30,
                    borderColor: `rgba(255,204,2,${0.15 - ring * 0.04})`,
                  }}
                  animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 8 + ring * 4, repeat: Infinity, ease: "linear" }}
                />
              ))}

              {MEMBERS.map((m, i) => {
                const angle = wavePhase + (i / MEMBERS.length) * Math.PI * 2;
                const r = 50 - progress * 0.45;
                const x = Math.cos(angle) * Math.max(r, 5);
                const y = Math.sin(angle) * Math.max(r, 5);

                return (
                  <motion.div
                    key={m.id}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{ x, y }}
                    transition={{ type: "spring", stiffness: 40, damping: 15 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${m.color}50, transparent)`,
                        filter: `blur(${6 + progress * 0.1}px)`,
                        transform: `scale(${1 + progress * 0.01})`,
                      }}
                    />
                  </motion.div>
                );
              })}

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFCC02]/60 to-amber-300/40 flex items-center justify-center" style={{ filter: 'blur(2px)' }}>
                  <span className="text-[28px]" style={{ filter: 'blur(0)' }}>🍞</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full"
            >
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="relative h-[180px]">
                  <img src={RESULT.image} alt={RESULT.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#FFCC02] rounded-full">
                    <span className="text-[12px] font-bold text-neutral-900">{RESULT.match}% match</span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[20px] font-bold text-white">{RESULT.title}</p>
                    <p className="text-[13px] text-white/80">{RESULT.type}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={12} className="text-[#FFCC02] fill-[#FFCC02]" />
                    <span className="text-[12px] font-semibold text-neutral-600">{RESULT.rating}</span>
                    <span className="text-[11px] text-neutral-400 ml-2">Everyone's top match</span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="flex-1 h-12 bg-[#FFCC02] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
                    >
                      <Heart size={15} />
                      Love it
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="flex-1 h-12 bg-neutral-100 rounded-xl flex items-center justify-center font-semibold text-[14px] text-neutral-600"
                    >
                      Show more
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={14} className="text-[#FFCC02]" />
          <span className="text-[12px] font-medium text-neutral-500">
            {!showResult ? 'Finding common ground...' : 'Fun + Chill vibes won'}
          </span>
        </div>
        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#FFCC02] rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="flex items-center justify-center gap-2">
          {MEMBERS.map((m) => (
            <div key={m.id} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-full">
              <img src={m.avatar} className="w-4 h-4 rounded-full object-cover" />
              <span className="text-[10px] font-medium text-neutral-500">{m.vibes[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
