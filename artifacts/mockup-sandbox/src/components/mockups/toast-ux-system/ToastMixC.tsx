import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ChevronRight, Trophy } from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };

const MEMBERS = [
  { id: 'ploy', name: 'Ploy', avatar: 'https://i.pravatar.cc/150?u=ploy', vibes: ['Chill', 'Fun'], color: '#FFCC02' },
  { id: 'beam', name: 'Beam', avatar: 'https://i.pravatar.cc/150?u=beam', vibes: ['Social', 'Fun'], color: '#818cf8' },
  { id: 'fern', name: 'Fern', avatar: 'https://i.pravatar.cc/150?u=fern', vibes: ['Chill', 'Artsy'], color: '#34d399' },
  { id: 'ice', name: 'Ice', avatar: 'https://i.pravatar.cc/150?u=ice', vibes: ['Fun', 'Budget'], color: '#fb7185' },
];

const VIBE_LABELS = ['Chill', 'Fun', 'Social', 'Artsy', 'Budget'];

export default function ToastMixC() {
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowResult(true), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col">
      <div className="h-[44px]" />

      <div className="px-6 mt-2 flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-[#FFCC02] uppercase tracking-wider">Toast Mix</p>
          <h1 className="text-[22px] font-bold text-neutral-900 mt-0.5">Mixing 4 vibes</h1>
        </div>
        <div className="flex -space-x-2">
          {MEMBERS.map((m) => (
            <img key={m.id} src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FAFAF8]" />
          ))}
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 relative overflow-hidden">
          <div className="relative h-[240px] flex items-center justify-center">
            {MEMBERS.map((m, i) => {
              const startAngle = (i / MEMBERS.length) * Math.PI * 2;
              const startR = 80;
              const endR = 0;
              const r = startR - (startR - endR) * (progress / 100);
              const wobble = Math.sin(Date.now() / 800 + i * 1.5) * (1 - progress / 100) * 15;
              const cx = Math.cos(startAngle) * r + wobble;
              const cy = Math.sin(startAngle) * r + wobble;

              return (
                <motion.div
                  key={m.id}
                  className="absolute"
                  animate={{
                    x: cx,
                    y: cy,
                  }}
                  transition={{ type: "spring", stiffness: 20, damping: 8 }}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: 60 + progress * 0.4,
                      height: 60 + progress * 0.4,
                      background: `radial-gradient(circle, ${m.color}40, ${m.color}08)`,
                      filter: `blur(${8 + progress * 0.15}px)`,
                    }}
                  />
                  <motion.img
                    src={m.avatar}
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ring-2 ring-white shadow-md"
                    animate={{ scale: progress > 80 ? 0.6 : 1 }}
                  />
                </motion.div>
              );
            })}

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute z-20"
                >
                  <div className="w-20 h-20 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_0_40px_rgba(255,204,2,0.4)]">
                    <Trophy size={28} className="text-neutral-900" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 space-y-2.5">
            {VIBE_LABELS.map((vibe, i) => {
              const count = MEMBERS.filter(m => m.vibes.includes(vibe)).length;
              const pct = (count / MEMBERS.length) * 100;
              const memberColors = MEMBERS.filter(m => m.vibes.includes(vibe)).map(m => m.color);

              return (
                <div key={vibe}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-neutral-600">{vibe}</span>
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {MEMBERS.filter(m => m.vibes.includes(vibe)).map(m => (
                          <img key={m.id} src={m.avatar} className="w-4 h-4 rounded-full object-cover ring-1 ring-white" />
                        ))}
                      </div>
                      <span className="text-[10px] text-neutral-400 ml-1">{count}/{MEMBERS.length}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress * 1.5, pct)}%` }}
                      className="h-full rounded-full"
                      style={{
                        background: memberColors.length > 1
                          ? `linear-gradient(90deg, ${memberColors.join(', ')})`
                          : memberColors[0] || '#ddd',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 mt-5">
        <motion.div
          animate={{ opacity: progress > 30 ? 1 : 0.3 }}
          className="bg-neutral-900 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
            <Sparkles size={16} className="text-[#FFCC02]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white">
              {progress < 50 ? 'Analyzing preferences...' : progress < 100 ? 'Fun + Chill are leading' : '🎉 Match found!'}
            </p>
            <p className="text-[11px] text-white/50 mt-0.5">
              {progress < 100 ? `${Math.round(progress)}% complete` : '3 of 4 want fun + chill vibes'}
            </p>
          </div>
          {showResult && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <ChevronRight size={18} className="text-[#FFCC02]" />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="px-6 mt-4 pb-8">
        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#FFCC02] rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-neutral-400">
          <span>Signals in</span>
          <span>Analyzing</span>
          <span>Match</span>
        </div>
      </div>
    </div>
  );
}
