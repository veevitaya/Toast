import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Crown, Check, Clock, Star, MapPin, Sparkles,
  ChevronRight, Trophy, Heart, Zap, ArrowRight, Copy
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };

const MEMBERS = [
  { id: 'you', name: 'You', avatar: '🍞', isHost: true, submitted: true, vibes: ['Chill', 'Views'] },
  { id: 'natt', name: 'Natt', avatar: '👩', isHost: false, submitted: false, vibes: [] },
  { id: 'krit', name: 'Krit', avatar: '👨', isHost: false, submitted: false, vibes: [] },
  { id: 'pim', name: 'Pim', avatar: '👧', isHost: false, submitted: true, vibes: ['Fun'] },
];

const VIBES = [
  { id: 'chill', label: 'Chill', emoji: '🍃', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'fun', label: 'Fun', emoji: '🎯', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { id: 'views', label: 'Views', emoji: '🌃', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { id: 'drinks', label: 'Drinks', emoji: '🍷', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: 'explore', label: 'Explore', emoji: '🗺️', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'energy', label: 'Energy', emoji: '⚡', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

const RESULT = {
  title: 'Octave Rooftop Lounge',
  type: 'Sky Bar · Cocktails',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60',
  rating: '4.8',
  location: 'Thonglor',
  price: '฿฿฿',
  why: 'Everyone wanted chill vibes + views — this nails both',
  matchScore: 92,
};

type Phase = 'vibeInput' | 'mixing' | 'result';

export default function GroupEvolving() {
  const [phase, setPhase] = useState<Phase>('vibeInput');
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(new Set(['chill']));
  const [strongVibe, setStrongVibe] = useState<string | null>(null);
  const [members, setMembers] = useState(MEMBERS);
  const [mixProgress, setMixProgress] = useState(0);
  const [blobPhase, setBlobPhase] = useState(0);

  const submitted = members.filter(m => m.submitted).length;
  const total = members.length;

  const toggleVibe = useCallback((id: string) => {
    setSelectedVibes(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); if (strongVibe === id) setStrongVibe(null); }
      else if (next.size < 2) next.add(id);
      return next;
    });
  }, [strongVibe]);

  const handleLongPress = useCallback((id: string) => {
    if (selectedVibes.has(id)) setStrongVibe(id);
  }, [selectedVibes]);

  const handleSubmit = useCallback(() => {
    setMembers(prev => prev.map(m => m.id === 'you' ? { ...m, submitted: true, vibes: [...selectedVibes] } : m));
    setTimeout(() => {
      setMembers(prev => prev.map(m => m.id === 'natt' ? { ...m, submitted: true, vibes: ['Drinks', 'Chill'] } : m));
    }, 800);
    setTimeout(() => {
      setMembers(prev => prev.map(m => m.id === 'krit' ? { ...m, submitted: true, vibes: ['Views'] } : m));
    }, 1500);
    setTimeout(() => setPhase('mixing'), 2200);
  }, [selectedVibes]);

  useEffect(() => {
    if (phase !== 'mixing') return;
    const interval = setInterval(() => {
      setMixProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBlobPhase(4);
          setTimeout(() => setPhase('result'), 800);
          return 100;
        }
        setBlobPhase(Math.floor(prev / 25));
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [phase]);

  const blobScale = phase === 'mixing' ? 1 + (mixProgress / 200) : 1;
  const blobOpacity = phase === 'mixing' ? 0.6 + (mixProgress / 400) : 0.4;

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] font-['Figtree',sans-serif] relative overflow-hidden">
      <div className="px-6 pt-14 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Group session</p>
            <h1 className="text-[24px] font-bold text-neutral-900 mt-0.5">
              {phase === 'vibeInput' && 'Pick your vibe'}
              {phase === 'mixing' && 'Toast Mix'}
              {phase === 'result' && 'Your match'}
            </h1>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full border border-neutral-100 shadow-sm">
            <Users size={13} className="text-neutral-500" />
            <span className="text-[12px] font-semibold text-neutral-600">{submitted}/{total}</span>
          </div>
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="flex items-center gap-3">
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...bouncy, delay: i * 0.06 }}
              className="relative flex flex-col items-center"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[20px] ring-2 transition-all ${
                m.submitted ? 'ring-[#FFCC02] bg-amber-50' : 'ring-neutral-200 bg-neutral-100'
              }`}>
                {m.avatar}
              </div>
              {m.isHost && (
                <Crown size={10} className="absolute -top-1 -right-1 text-[#FFCC02]" />
              )}
              {m.submitted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#FFCC02] rounded-full flex items-center justify-center"
                >
                  <Check size={8} className="text-neutral-900" />
                </motion.div>
              )}
              <p className="text-[10px] text-neutral-500 mt-1.5 font-medium">{m.name}</p>
              {m.submitted && m.vibes.length > 0 && phase !== 'mixing' && (
                <div className="flex gap-0.5 mt-0.5">
                  {m.vibes.map((v, vi) => (
                    <span key={vi} className="text-[8px] px-1 py-0.5 bg-neutral-100 rounded text-neutral-500">{v}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'vibeInput' && (
          <motion.div
            key="vibeInput"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6"
          >
            <p className="text-[13px] text-neutral-500 mb-3">Select 1–2 vibes · long press for strong preference</p>
            <div className="grid grid-cols-3 gap-2">
              {VIBES.map((vibe) => (
                <motion.button
                  key={vibe.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => toggleVibe(vibe.id)}
                  onContextMenu={(e) => { e.preventDefault(); handleLongPress(vibe.id); }}
                  className={`relative flex flex-col items-center gap-1 py-4 rounded-2xl border-2 transition-all ${
                    selectedVibes.has(vibe.id)
                      ? strongVibe === vibe.id
                        ? 'bg-[#FFCC02]/10 border-[#FFCC02] shadow-[0_0_0_2px_rgba(255,204,2,0.3)]'
                        : 'bg-white border-[#FFCC02]'
                      : 'bg-white border-neutral-100'
                  }`}
                >
                  <span className="text-[24px]">{vibe.emoji}</span>
                  <span className="text-[12px] font-semibold text-neutral-700">{vibe.label}</span>
                  {strongVibe === vibe.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center"
                    >
                      <Zap size={10} className="text-neutral-900" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={selectedVibes.size === 0}
              className={`w-full h-13 mt-5 rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] transition-all ${
                selectedVibes.size > 0
                  ? 'bg-[#FFCC02] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]'
                  : 'bg-neutral-200 text-neutral-400'
              }`}
              style={{ height: 52 }}
            >
              <Check size={16} />
              Submit my vibe
            </motion.button>
          </motion.div>
        )}

        {phase === 'mixing' && (
          <motion.div
            key="mixing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 flex flex-col items-center"
          >
            <div className="relative w-[260px] h-[260px] mt-4">
              {members.map((m, i) => {
                const angle = (i / members.length) * Math.PI * 2;
                const radius = 80 - (mixProgress * 0.7);
                const x = Math.cos(angle) * Math.max(radius, 0) + 130;
                const y = Math.sin(angle) * Math.max(radius, 0) + 130;
                const colors = ['#FFCC02', '#a78bfa', '#34d399', '#fb7185'];
                return (
                  <motion.div
                    key={m.id}
                    animate={{ left: x - 30, top: y - 30, scale: blobScale, opacity: blobOpacity }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="absolute w-[60px] h-[60px] rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${colors[i]}80, ${colors[i]}20)`,
                      filter: `blur(${8 + mixProgress * 0.15}px)`,
                    }}
                  />
                );
              })}

              {mixProgress > 60 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FFCC02]/30 flex items-center justify-center" style={{ filter: 'blur(4px)' }}>
                    <div className="w-10 h-10 rounded-full bg-[#FFCC02]/60" />
                  </div>
                </motion.div>
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  {members.map((m, i) => (
                    <motion.span
                      key={m.id}
                      className="text-[16px]"
                      animate={{
                        x: Math.cos((i / members.length) * Math.PI * 2) * Math.max(40 - mixProgress * 0.4, 0),
                        y: Math.sin((i / members.length) * Math.PI * 2) * Math.max(40 - mixProgress * 0.4, 0),
                      }}
                      transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    >
                      {m.avatar}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <motion.p
              className="text-[14px] font-medium text-neutral-500 mt-4 text-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {mixProgress < 30 && 'Gathering vibes...'}
              {mixProgress >= 30 && mixProgress < 70 && 'Finding common ground...'}
              {mixProgress >= 70 && mixProgress < 100 && 'Almost there...'}
              {mixProgress >= 100 && '✨ Match found!'}
            </motion.p>

            <div className="w-[200px] h-1.5 bg-neutral-200 rounded-full mt-3 overflow-hidden">
              <motion.div
                className="h-full bg-[#FFCC02] rounded-full"
                animate={{ width: `${mixProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={bouncy}
            className="px-6"
          >
            <div className="relative bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="relative h-[200px]">
                <img src={RESULT.image} alt={RESULT.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCC02] rounded-full">
                  <Trophy size={12} className="text-neutral-900" />
                  <span className="text-[12px] font-bold text-neutral-900">Best match</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 rounded-full backdrop-blur-sm">
                  <span className="text-[13px] font-bold text-neutral-900">{RESULT.matchScore}%</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[22px] font-bold text-white">{RESULT.title}</p>
                  <p className="text-[13px] text-white/80">{RESULT.type}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-4 text-[12px] text-neutral-500">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {RESULT.location}</span>
                  <span className="flex items-center gap-1"><Star size={11} className="text-[#FFCC02] fill-[#FFCC02]" /> {RESULT.rating}</span>
                  <span className="font-semibold">{RESULT.price}</span>
                </div>

                <div className="flex items-start gap-2 mt-3 bg-amber-50 rounded-xl px-3 py-2.5">
                  <Sparkles size={14} className="text-[#FFCC02] mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-amber-800 font-medium leading-snug">{RESULT.why}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 h-12 bg-[#FFCC02] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] text-neutral-900"
                  >
                    <Heart size={15} />
                    Love it
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 h-12 bg-neutral-100 rounded-xl flex items-center justify-center gap-2 font-semibold text-[14px] text-neutral-600"
                  >
                    Show more
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 px-1">
              <div className="flex -space-x-2">
                {members.map((m) => (
                  <div key={m.id} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[14px] ring-2 ring-white">{m.avatar}</div>
                ))}
              </div>
              <p className="text-[12px] text-neutral-500 ml-1">3 of 4 are into it</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
