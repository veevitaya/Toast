import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';

const MEMBERS = [
  { id: 'ploy', name: 'Ploy', avatar: 'https://i.pravatar.cc/150?u=ploy', vibes: ['Chill', 'Fun'], emoji: '🍃', color: '#FFCC02' },
  { id: 'beam', name: 'Beam', avatar: 'https://i.pravatar.cc/150?u=beam', vibes: ['Social', 'Fun'], emoji: '🎯', color: '#818cf8' },
  { id: 'fern', name: 'Fern', avatar: 'https://i.pravatar.cc/150?u=fern', vibes: ['Chill', 'Artsy'], emoji: '🎨', color: '#34d399' },
  { id: 'ice', name: 'Ice', avatar: 'https://i.pravatar.cc/150?u=ice', vibes: ['Fun', 'Budget'], emoji: '💰', color: '#fb7185' },
];

export default function ToastMixB() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 0.8;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const overlap = Math.min(progress / 100, 1);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col">
      <div className="h-[44px]" />

      <div className="px-6 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#FFCC02] animate-pulse" />
          <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Toast Mix · Live</p>
        </div>
        <h1 className="text-[26px] font-bold text-neutral-900 leading-tight">
          Finding your
        </h1>
        <h1 className="text-[26px] font-bold text-neutral-900 leading-tight">
          common ground
        </h1>
      </div>

      <div className="px-6 mt-6">
        <div className="flex items-center gap-3">
          {MEMBERS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-[10px]" style={{ backgroundColor: m.color + '30' }}>
                  {m.emoji}
                </div>
              </div>
              <p className="text-[10px] font-medium text-neutral-500 mt-1.5">{m.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 -mt-4">
        <div className="w-full">
          <div className="relative h-[280px] flex items-center justify-center">
            {MEMBERS.map((m, i) => {
              const cols = 2;
              const row = Math.floor(i / cols);
              const col = i % cols;
              const baseX = col * 160 + 45;
              const baseY = row * 140 + 30;
              const centerX = 155;
              const centerY = 100;
              const x = baseX + (centerX - baseX) * overlap;
              const y = baseY + (centerY - baseY) * overlap;
              const size = 100 + overlap * 40;

              return (
                <motion.div
                  key={m.id}
                  className="absolute rounded-[40%] mix-blend-multiply"
                  animate={{
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    borderRadius: `${40 + Math.sin(Date.now() / 1000 + i) * 10}%`,
                  }}
                  transition={{ type: "spring", stiffness: 20, damping: 10 }}
                  style={{
                    background: `radial-gradient(circle at 40% 40%, ${m.color}50, ${m.color}15)`,
                    filter: `blur(${6 + overlap * 12}px)`,
                  }}
                />
              );
            })}

            {progress > 50 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: overlap }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFCC02] to-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(255,204,2,0.4)]">
                  <span className="text-[24px]">🍞</span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-2">
            {MEMBERS.map((m, i) => {
              const barWidth = 30 + Math.random() * 40;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 py-2"
                >
                  <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-medium text-neutral-700">{m.name}</span>
                      <div className="flex gap-1">
                        {m.vibes.map((v, vi) => (
                          <span key={vi} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: m.color + '20', color: m.color }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress * 1.2, barWidth + 30)}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles size={16} className="text-[#FFCC02] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-amber-900">Common ground emerging</p>
            <p className="text-[12px] text-amber-700 mt-0.5">Everyone's leaning toward fun + chill vibes</p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#FFCC02] rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[12px] font-bold text-neutral-500">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
