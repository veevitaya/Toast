import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Search, MapPin, Home, Map as MapIcon, Heart, User, Star,
  Sparkles, ArrowRight, ArrowLeft, Check, X, Users, UserPlus,
  Share2, Copy, Crown, Trophy, MessageCircle, Clock
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 300, damping: 22 };
const bouncy = { type: "spring" as const, stiffness: 400, damping: 18 };
const gentle = { type: "spring" as const, stiffness: 220, damping: 26 };

type Screen = 'setup' | 'invite' | 'waiting' | 'swipe' | 'match';

const RESTAURANTS = [
  { id: 1, name: 'Jay Fai', category: 'Thai Street Food', tags: ['Michelin Star', 'Crab Omelet'], price: 3, rating: '4.9', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60', desc: 'Legendary street-side wok master with a Michelin star.' },
  { id: 2, name: 'Gaggan Anand', category: 'Progressive Indian', tags: ['Fine Dining', 'Tasting Menu'], price: 4, rating: '4.8', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60', desc: 'Progressive Indian cuisine pushing boundaries of flavor.' },
  { id: 3, name: 'Raan Jay Fai', category: 'Thai', tags: ['Noodles', 'Pad Thai'], price: 1, rating: '4.6', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60', desc: 'Authentic pad thai in the heart of old Bangkok.' },
  { id: 4, name: 'Sushi Masato', category: 'Japanese Omakase', tags: ['Premium', 'Intimate'], price: 4, rating: '4.9', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60', desc: 'Intimate omakase counter with seasonal fish from Tsukiji.' },
  { id: 5, name: 'Smash Lab', category: 'Western', tags: ['Burgers', 'Craft Beer'], price: 2, rating: '4.5', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60', desc: 'Double-smashed patties with secret sauce and fresh brioche.' },
  { id: 6, name: 'Nusara', category: 'Thai Fine Dining', tags: ['Michelin', 'Modern Thai'], price: 4, rating: '4.9', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop&q=60', desc: 'Modern Thai fine dining celebrating regional recipes.' },
];

const MEMBERS = [
  { id: 'host', name: 'You', avatar: '🍞', isHost: true },
  { id: 'm1', name: 'Nattaya', avatar: '👩', isHost: false },
  { id: 'm2', name: 'Krit', avatar: '👨', isHost: false },
];

const GROUP_TYPES = [
  { id: 'friends', emoji: '👯', label: 'Friends', desc: 'Casual hangout', color: '#00B14F' },
  { id: 'partner', emoji: '💕', label: 'Date Night', desc: 'Romantic dinner', color: '#E11D48' },
  { id: 'family', emoji: '👨‍👩‍👧', label: 'Family', desc: 'Kid-friendly', color: '#FFCC02' },
  { id: 'work', emoji: '💼', label: 'Coworkers', desc: 'Team lunch', color: '#6C2BD9' },
];

const VIBES = [
  { emoji: '🍢', label: 'Street food' },
  { emoji: '🍽️', label: 'Restaurant' },
  { emoji: '🚇', label: 'Near BTS' },
  { emoji: '🌃', label: 'Late night' },
  { emoji: '🌊', label: 'Riverside' },
  { emoji: '🏙️', label: 'Rooftop' },
];

function SwipeCard({ restaurant, active, behind, onSwipe }: {
  restaurant: typeof RESTAURANTS[0];
  active: boolean;
  behind: boolean;
  onSwipe: (dir: 'left' | 'right') => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const yumOpacity = useTransform(x, [0, 80], [0, 1]);
  const nahOpacity = useTransform(x, [0, -80], [0, 1]);
  const swiped = useRef(false);
  const [exiting, setExiting] = useState<{ x: number } | null>(null);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (swiped.current) return;
    if (info.offset.x > 100) {
      swiped.current = true;
      setExiting({ x: 500 });
      setTimeout(() => onSwipe('right'), 300);
    } else if (info.offset.x < -100) {
      swiped.current = true;
      setExiting({ x: -500 });
      setTimeout(() => onSwipe('left'), 300);
    }
  }, [onSwipe]);

  if (!active && !behind) return null;

  return (
    <motion.div
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        zIndex: active ? 10 : 5,
        boxShadow: active
          ? '0 20px 60px -12px rgba(0,0,0,0.2)'
          : '0 10px 30px -8px rgba(0,0,0,0.1)',
      }}
      animate={
        exiting
          ? { x: exiting.x, opacity: 0, rotate: exiting.x > 0 ? 20 : -20 }
          : behind
            ? { scale: 0.95, y: 10, opacity: 0.6 }
            : { scale: 1, y: 0, opacity: 1 }
      }
      transition={exiting ? { duration: 0.35 } : bouncy}
      drag={active && !exiting}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 bg-white rounded-[24px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full h-[55%]">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5" />

        {active && (
          <>
            <motion.div style={{ opacity: yumOpacity }} className="absolute top-8 left-5 z-20">
              <div className="bg-emerald-500 text-white text-xl font-black rounded-2xl px-5 py-2.5 -rotate-12 border-[3px] border-white/50 shadow-lg">
                YUM 😋
              </div>
            </motion.div>
            <motion.div style={{ opacity: nahOpacity }} className="absolute top-8 right-5 z-20">
              <div className="bg-red-500 text-white text-xl font-black rounded-2xl px-5 py-2.5 rotate-12 border-[3px] border-white/50 shadow-lg">
                NAH 👎
              </div>
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <h2 className="text-white text-[24px] font-bold mb-1 drop-shadow-lg">{restaurant.name}</h2>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <span>{restaurant.category}</span>
            <span className="text-white/40">·</span>
            <span>{'฿'.repeat(restaurant.price)}</span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-0.5">★ {restaurant.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-3 h-[45%] flex flex-col">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {restaurant.tags.map(tag => (
            <span key={tag} className="text-[11px] bg-gray-100 rounded-full px-2.5 py-1 font-medium text-gray-600">{tag}</span>
          ))}
        </div>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">{restaurant.desc}</p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {MEMBERS.map(m => (
              <div key={m.id} className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xs">
                {m.avatar}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">{MEMBERS.length} swiping</span>
        </div>
      </div>
    </motion.div>
  );
}

export function GroupJourney() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [selectedGroupType, setSelectedGroupType] = useState<string | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [swipeResults, setSwipeResults] = useState<Record<number, 'left' | 'right'>>({});
  const [showMatch, setShowMatch] = useState(false);
  const [waitingDots, setWaitingDots] = useState(0);
  const [membersJoined, setMembersJoined] = useState(1);
  const [copied, setCopied] = useState(false);

  const toggleVibe = useCallback((label: string) => {
    setSelectedVibes(prev => prev.includes(label) ? prev.filter(v => v !== label) : [...prev, label]);
  }, []);

  const startWaiting = useCallback(() => {
    setScreen('waiting');
    setMembersJoined(1);
    let count = 1;
    const interval = setInterval(() => {
      count++;
      setMembersJoined(count);
      if (count >= 3) {
        clearInterval(interval);
      }
    }, 1800);
  }, []);

  const startSwiping = useCallback(() => {
    setScreen('swipe');
    setCurrentCard(0);
    setSwipeResults({});
    setShowMatch(false);
  }, []);

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    setSwipeResults(prev => ({ ...prev, [currentCard]: dir }));

    if (currentCard === 2 && dir === 'right') {
      setTimeout(() => {
        setShowMatch(true);
        setScreen('match');
      }, 500);
      return;
    }

    setTimeout(() => {
      setCurrentCard(prev => Math.min(prev + 1, RESTAURANTS.length - 1));
    }, 400);
  }, [currentCard]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap');
        .no-sb::-webkit-scrollbar{display:none} .no-sb{-ms-overflow-style:none;scrollbar-width:none}
        .glass{background:rgba(255,255,255,0.88);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%)}
        @keyframes confetti-fall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(400px) rotate(720deg);opacity:0}}
        .confetti-piece{animation:confetti-fall 2.5s ease-in forwards}
      `}} />

      <div className="relative w-[390px] h-[844px] bg-[#FAFAF8] rounded-[44px] border-[8px] border-gray-900 overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-[100] pointer-events-none">
          <div className="w-[126px] h-[32px] bg-black rounded-b-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {screen === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35 }}
              className="flex-1 overflow-y-auto no-sb pb-24"
            >
              <div className="pt-14 px-6 pb-4">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, ...spring }}
                >
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-700" />
                  </motion.button>
                  <div className="flex-1" />
                  <div className="flex items-center gap-1.5 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
                    <Users className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-[11px] font-bold text-violet-600">Group Mode</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, ...gentle }}
                >
                  <h1 className="text-[28px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-1">Plan your<br/>group feast</h1>
                  <p className="text-[13px] text-gray-400 font-medium">Everyone votes, Toast picks the winner</p>
                </motion.div>
              </div>

              <div className="px-6 mb-5">
                <motion.p
                  className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Who's joining?
                </motion.p>
                <div className="grid grid-cols-2 gap-3">
                  {GROUP_TYPES.map((g, i) => {
                    const on = selectedGroupType === g.id;
                    return (
                      <motion.button
                        key={g.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.06, ...bouncy }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setSelectedGroupType(on ? null : g.id)}
                        className={`rounded-[20px] p-4 flex items-center gap-3 border-2 transition-all duration-200 text-left ${
                          on ? 'border-violet-400 bg-violet-50/50 shadow-[0_4px_20px_rgba(108,43,217,0.1)]' : 'bg-white border-gray-100'
                        }`}
                      >
                        <motion.span
                          className="text-2xl"
                          animate={on ? { scale: [1, 1.25, 1.1] } : { scale: 1 }}
                          transition={bouncy}
                        >
                          {g.emoji}
                        </motion.span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[12px] font-semibold ${on ? 'text-violet-700' : 'text-gray-600'}`}>{g.label}</div>
                          <div className="text-[10px] text-gray-400">{g.desc}</div>
                        </div>
                        <AnimatePresence>
                          {on && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={bouncy}
                              className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 mb-5">
                <motion.p
                  className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Set the vibe
                </motion.p>
                <div className="grid grid-cols-3 gap-2.5">
                  {VIBES.map((v, i) => {
                    const on = selectedVibes.includes(v.label);
                    return (
                      <motion.button
                        key={v.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45 + i * 0.04, ...bouncy }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleVibe(v.label)}
                        className={`rounded-2xl p-3 flex flex-col items-center gap-1.5 border-2 transition-all ${
                          on ? 'border-violet-400 bg-violet-50/30' : 'bg-white border-gray-100'
                        }`}
                      >
                        <motion.span
                          className="text-xl"
                          animate={on ? { scale: [1, 1.2, 1.05] } : { scale: 1 }}
                          transition={bouncy}
                        >
                          {v.emoji}
                        </motion.span>
                        <span className={`text-[10px] font-semibold ${on ? 'text-violet-600' : 'text-gray-500'}`}>{v.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 pb-4">
                <AnimatePresence>
                  {selectedGroupType && (
                    <motion.button
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={bouncy}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ y: -2 }}
                      onClick={() => setScreen('invite')}
                      className="w-full h-[52px] rounded-2xl bg-violet-500 flex items-center justify-center gap-2.5 font-bold text-[15px] text-white shadow-[0_6px_24px_rgba(108,43,217,0.35)]"
                    >
                      <UserPlus className="w-5 h-5" />
                      Invite Friends
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {screen === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col items-center justify-center px-8 pb-24"
            >
              <motion.div
                className="w-full max-w-xs"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1, ...bouncy }}
              >
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, ...bouncy }}
                      className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    >
                      <Share2 className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-white text-lg font-bold">Share the invite</h2>
                    <p className="text-white/70 text-xs mt-1">Send to friends via LINE</p>
                  </div>

                  <div className="p-5">
                    <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-gray-400 font-medium mb-0.5">Session code</div>
                        <div className="text-[16px] font-mono font-bold text-gray-900 tracking-wider">A3F7B2D9</div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopy}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${copied ? 'bg-emerald-100' : 'bg-white border border-gray-200'}`}
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </motion.button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ y: -2 }}
                      className="w-full h-12 rounded-2xl bg-[#00B900] flex items-center justify-center gap-2 font-bold text-white text-sm shadow-[0_4px_16px_rgba(0,185,0,0.3)] mb-3"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Share via LINE
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={startWaiting}
                      className="w-full h-12 rounded-2xl bg-violet-500 flex items-center justify-center gap-2 font-bold text-white text-sm shadow-[0_4px_16px_rgba(108,43,217,0.3)]"
                    >
                      Go to Waiting Room
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {screen === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col items-center justify-center px-8 pb-24"
            >
              <motion.div
                className="relative mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-[0_8px_32px_rgba(108,43,217,0.3)]">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-7 h-7 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-md text-xs font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {membersJoined}
                </motion.div>
              </motion.div>

              <h2 className="text-[22px] font-['Playfair_Display'] font-bold text-gray-900 mb-1">Waiting for friends</h2>
              <p className="text-[13px] text-gray-400 mb-8">Session: <span className="font-mono font-bold">A3F7B2D9</span></p>

              <div className="w-full max-w-xs space-y-3 mb-8">
                {MEMBERS.slice(0, membersJoined).map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: i * 0.15, ...bouncy }}
                    className="flex items-center gap-3 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xl">
                      {m.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-gray-900">{m.name}</div>
                      <div className="text-[10px] text-gray-400">{m.isHost ? 'Host' : 'Joined'}</div>
                    </div>
                    {m.isHost && (
                      <div className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center">
                        <Crown className="w-3 h-3 text-gray-900" />
                      </div>
                    )}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, ...bouncy }}
                      className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                    </motion.div>
                  </motion.div>
                ))}

                {membersJoined < 3 && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3.5 border border-dashed border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-gray-300">Waiting for someone...</div>
                    </div>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {membersJoined >= 3 && (
                  <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={bouncy}
                    whileTap={{ scale: 0.96 }}
                    onClick={startSwiping}
                    className="w-full max-w-xs h-[52px] rounded-2xl bg-violet-500 flex items-center justify-center gap-2 font-bold text-[15px] text-white shadow-[0_6px_24px_rgba(108,43,217,0.35)]"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Swiping!
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {screen === 'swipe' && (
            <motion.div
              key="swipe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col pt-12 pb-24"
            >
              <div className="px-5 mb-3">
                <div className="flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setScreen('waiting')}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gray-700" />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {MEMBERS.map(m => (
                        <div key={m.id} className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xs shadow-sm">
                          {m.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{MEMBERS.length} swiping</span>
                  </div>

                  <div className="text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
                    {currentCard + 1}/{RESTAURANTS.length}
                  </div>
                </div>
              </div>

              <div className="flex-1 px-5 relative">
                <AnimatePresence>
                  {RESTAURANTS.slice(currentCard, currentCard + 2).reverse().map((r, idx) => {
                    const isActive = idx === (Math.min(1, RESTAURANTS.length - currentCard - 1));
                    return (
                      <SwipeCard
                        key={r.id}
                        restaurant={r}
                        active={isActive}
                        behind={!isActive}
                        onSwipe={handleSwipe}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="px-5 pt-3 flex items-center justify-center gap-6">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleSwipe('left')}
                  className="w-14 h-14 rounded-full bg-white border-2 border-red-200 flex items-center justify-center shadow-md"
                >
                  <X className="w-6 h-6 text-red-400" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleSwipe('right')}
                  className="w-14 h-14 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center shadow-md"
                >
                  <Heart className="w-6 h-6 text-emerald-500" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {screen === 'match' && (
            <motion.div
              key="match"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: -10,
                      width: Math.random() > 0.5 ? 8 : 4,
                      height: Math.random() > 0.5 ? 8 : 12,
                      backgroundColor: ['#FF385C', '#FFD700', '#00A699', '#7B61FF', '#FF6B6B', '#4ECDC4'][i % 6],
                      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                      animationDelay: `${Math.random() * 1.5}s`,
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, ...bouncy }}
                className="mb-6"
              >
                <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#FFCC02] to-amber-400 flex items-center justify-center shadow-[0_12px_40px_rgba(255,204,2,0.4)]">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Trophy className="w-12 h-12 text-gray-900" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...gentle }}
                className="text-[28px] font-['Playfair_Display'] font-bold text-gray-900 mb-1 text-center"
              >
                It's a Match! 🎉
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[13px] text-gray-400 mb-6"
              >
                Everyone voted for this one
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, ...bouncy }}
                className="w-full bg-white rounded-[24px] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden"
              >
                <div className="relative h-[160px]">
                  <img src={RESTAURANTS[2].image} alt={RESTAURANTS[2].name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white text-lg font-bold">{RESTAURANTS[2].name}</h3>
                    <p className="text-white/80 text-xs">{RESTAURANTS[2].category} · ★ {RESTAURANTS[2].rating}</p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, ...bouncy }}
                    className="absolute top-3 right-3 bg-[#FFCC02] text-gray-900 text-[10px] font-bold rounded-full px-2.5 py-1 shadow-md flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 fill-current" /> Full Match
                  </motion.div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Voted by</p>
                    <div className="flex -space-x-1.5 ml-auto">
                      {MEMBERS.map((m, i) => (
                        <motion.div
                          key={m.id}
                          initial={{ scale: 0, x: -10 }}
                          animate={{ scale: 1, x: 0 }}
                          transition={{ delay: 0.9 + i * 0.1, ...bouncy }}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-white flex items-center justify-center text-sm shadow-sm"
                        >
                          {m.avatar}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full h-12 rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[14px] text-gray-900 shadow-[0_4px_16px_rgba(255,204,2,0.3)]"
                  >
                    Let's go eat! <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 inset-x-0 h-[84px] glass border-t border-gray-100/40 flex justify-around items-start pt-3 px-6 z-[90] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {[
            { icon: Home, label: 'Home' },
            { icon: MapIcon, label: 'Map' },
            { icon: Heart, label: 'Saved' },
            { icon: User, label: 'Profile' },
          ].map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ...spring }}
              className="flex flex-col items-center gap-0.5 text-gray-400"
            >
              <n.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{n.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
