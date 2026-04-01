import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star,
  Sparkles, ArrowRight, ArrowLeft, Check, X, Users, UserPlus,
  Share2, Copy, Crown, Trophy, MessageCircle, Clock, ChevronRight, Flame, Zap,
  Calendar, Wallet, ShieldCheck, Award, Medal, BarChart3, RotateCcw, Eye, ListOrdered, ArrowUp
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };
const gentle = { type: "spring" as const, stiffness: 200, damping: 28 };
const snappy = { type: "spring" as const, stiffness: 500, damping: 32 };

type Screen = 'home' | 'setup' | 'invite' | 'waiting' | 'swipe' | 'match' | 'topPicks' | 'summary';

const RESTAURANTS = [
  { id: 1, name: 'Jay Fai', category: 'Thai Street Food', tags: ['Michelin Star', 'Crab Omelet'], price: 3, rating: '4.9', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60', desc: 'Legendary street-side wok master with a Michelin star.' },
  { id: 2, name: 'Gaggan Anand', category: 'Progressive Indian', tags: ['Fine Dining', 'Tasting Menu'], price: 4, rating: '4.8', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60', desc: 'Progressive Indian cuisine pushing boundaries of flavor.' },
  { id: 3, name: 'Nusara', category: 'Modern Thai', tags: ["World's Best", 'Tasting Menu'], price: 4, rating: '4.9', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop&q=60', desc: "Modern Thai fine dining — #1 on Asia's 50 Best." },
  { id: 4, name: 'Sushi Masato', category: 'Japanese Omakase', tags: ['Premium', 'Intimate'], price: 4, rating: '4.9', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60', desc: 'Intimate omakase counter with seasonal fish from Tsukiji.' },
  { id: 5, name: 'Smash Lab', category: 'Western', tags: ['Burgers', 'Craft Beer'], price: 2, rating: '4.5', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60', desc: 'Double-smashed patties with secret sauce and fresh brioche.' },
  { id: 6, name: 'Thipsamai', category: 'Thai', tags: ['Pad Thai', 'Legendary'], price: 1, rating: '4.9', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60', desc: "Bangkok's original pad thai since 1966." },
];

const MEMBERS = [
  { id: 'host', name: 'You', avatar: '🍞', isHost: true },
  { id: 'm1', name: 'Nattaya', avatar: '👩', isHost: false },
  { id: 'm2', name: 'Krit', avatar: '👨', isHost: false },
];

const GROUP_TYPES = [
  { id: 'friends', emoji: '👯', label: 'Friends Night', desc: 'Casual hangout', accent: '#6C2BD9' },
  { id: 'partner', emoji: '💕', label: 'Date Night', desc: 'Romantic dinner', accent: '#E11D48' },
  { id: 'family', emoji: '👨‍👩‍👧', label: 'Family Feast', desc: 'Kid-friendly', accent: '#FFCC02' },
  { id: 'work', emoji: '💼', label: 'Team Lunch', desc: 'Office outing', accent: '#0EA5E9' },
];

const VIBES = [
  { emoji: '🍢', label: 'Street food' },
  { emoji: '🍽️', label: 'Restaurant' },
  { emoji: '🚇', label: 'Near BTS' },
  { emoji: '🌃', label: 'Late night' },
  { emoji: '🌊', label: 'Riverside' },
  { emoji: '🏙️', label: 'Rooftop' },
  { emoji: '🔥', label: 'Trending' },
  { emoji: '💰', label: 'Budget' },
  { emoji: '✨', label: 'Fine dining' },
];

const BUDGETS = [
  { id: 'cheap', label: '฿', sub: 'Under 150', emoji: '💰' },
  { id: 'moderate', label: '฿฿', sub: '150–500', emoji: '🍽️' },
  { id: 'fancy', label: '฿฿฿', sub: '500–1,500', emoji: '✨' },
  { id: 'splurge', label: '฿฿฿฿', sub: '1,500+', emoji: '👑' },
];

const BKK_AREAS = [
  { emoji: '🚇', label: 'Sukhumvit' },
  { emoji: '🏙️', label: 'Siam' },
  { emoji: '🎶', label: 'Thonglor' },
  { emoji: '🌳', label: 'Ari' },
  { emoji: '🏢', label: 'Silom' },
  { emoji: '🌆', label: 'Sathorn' },
  { emoji: '🎭', label: 'Asoke' },
  { emoji: '🏛️', label: 'Old Town' },
  { emoji: '🌊', label: 'Riverside' },
  { emoji: '🏮', label: 'Chinatown' },
  { emoji: '🎪', label: 'Ekkamai' },
  { emoji: '🛍️', label: 'Chidlom' },
];

const DIETARY = [
  { emoji: '☪️', label: 'Halal' },
  { emoji: '🌱', label: 'Vegan' },
  { emoji: '🥬', label: 'Vegetarian' },
  { emoji: '🌾', label: 'Gluten-Free' },
  { emoji: '🚫🐷', label: 'No Pork' },
  { emoji: '🥑', label: 'Keto' },
  { emoji: '🥛', label: 'Dairy-Free' },
  { emoji: '🥜', label: 'Nut-Free' },
];

const TIME_SLOTS = [
  { label: 'Now', sub: 'ASAP', icon: '⚡' },
  { label: '12:00', sub: 'Noon', icon: '☀️' },
  { label: '18:00', sub: 'Evening', icon: '🌅' },
  { label: '19:30', sub: 'Dinner', icon: '🍽️' },
  { label: '21:00', sub: 'Late', icon: '🌙' },
];

const MEMBER_STATS = [
  { member: MEMBERS[0], likes: 4, dislikes: 1, superLikes: 1, favCuisine: 'Thai', emoji: '🍜' },
  { member: MEMBERS[1], likes: 3, dislikes: 2, superLikes: 1, favCuisine: 'Japanese', emoji: '🍣' },
  { member: MEMBERS[2], likes: 5, dislikes: 1, superLikes: 0, favCuisine: 'Thai', emoji: '🍜' },
];

const TOP_PICKS_DATA = [
  { ...RESTAURANTS[2], votes: 3, voters: ['host', 'm1', 'm2'], fullMatch: true },
  { ...RESTAURANTS[0], votes: 2, voters: ['host', 'm2'], fullMatch: false },
  { ...RESTAURANTS[5], votes: 2, voters: ['host', 'm1'], fullMatch: false },
  { ...RESTAURANTS[3], votes: 1, voters: ['m1'], fullMatch: false },
];

function SwipeCard({ restaurant, active, behind, onSwipe }: {
  restaurant: typeof RESTAURANTS[0];
  active: boolean;
  behind: boolean;
  onSwipe: (dir: 'left' | 'right' | 'up') => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const bgLeft = useTransform(x, [-200, -60, 0], [1, 0.6, 0]);
  const bgRight = useTransform(x, [0, 60, 200], [0, 0.6, 1]);
  const bgUp = useTransform(y, [-200, -60, 0], [1, 0.6, 0]);
  const swiped = useRef(false);
  const [exiting, setExiting] = useState<{ x: number; y: number } | null>(null);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (swiped.current) return;
    if (info.offset.y < -90) {
      swiped.current = true;
      setExiting({ x: 0, y: -600 });
      setTimeout(() => onSwipe('up'), 280);
    } else if (info.offset.x > 90) {
      swiped.current = true;
      setExiting({ x: 500, y: 0 });
      setTimeout(() => onSwipe('right'), 280);
    } else if (info.offset.x < -90) {
      swiped.current = true;
      setExiting({ x: -500, y: 0 });
      setTimeout(() => onSwipe('left'), 280);
    }
  }, [onSwipe]);

  if (!active && !behind) return null;

  return (
    <motion.div
      style={{
        x: active ? x : 0,
        y: active ? y : 0,
        rotate: active ? rotate : 0,
        zIndex: active ? 10 : 5,
      }}
      animate={
        exiting
          ? { x: exiting.x, y: exiting.y, opacity: 0, rotate: exiting.x > 0 ? 18 : exiting.x < 0 ? -18 : 0 }
          : behind
            ? { scale: 0.94, y: 12, opacity: 0.5 }
            : { scale: 1, y: 0, opacity: 1 }
      }
      transition={exiting ? { duration: 0.3, ease: [0.32, 0.72, 0, 1] } : spring}
      drag={active && !exiting}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 bg-white rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        x: active ? x : 0,
        y: active ? y : 0,
        rotate: active ? rotate : 0,
        zIndex: active ? 10 : 5,
        boxShadow: active
          ? '0 24px 60px -12px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.03)'
          : '0 10px 30px -8px rgba(0,0,0,0.1)',
      }}
    >
      <div className="relative w-full h-[58%]">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {active && (
          <>
            <motion.div style={{ opacity: bgRight }} className="absolute top-7 left-5 z-20">
              <div className="bg-emerald-500 text-white text-lg font-black rounded-2xl px-5 py-2 -rotate-12 border-[3px] border-white/40 shadow-lg flex items-center gap-1.5">
                YUM <span className="text-xl">😋</span>
              </div>
            </motion.div>
            <motion.div style={{ opacity: bgLeft }} className="absolute top-7 right-5 z-20">
              <div className="bg-red-500 text-white text-lg font-black rounded-2xl px-5 py-2 rotate-12 border-[3px] border-white/40 shadow-lg flex items-center gap-1.5">
                NAH <span className="text-xl">👎</span>
              </div>
            </motion.div>
            <motion.div style={{ opacity: bgUp }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-[#FFCC02] text-gray-900 text-lg font-black rounded-2xl px-5 py-2 border-[3px] border-white/40 shadow-lg flex items-center gap-1.5">
                SUPERLIKE <span className="text-xl">⭐</span>
              </div>
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-white text-[22px] font-bold drop-shadow-lg">{restaurant.name}</h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, ...bouncy }}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5"
            >
              <span className="text-white text-[11px] font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-current" /> {restaurant.rating}
              </span>
            </motion.div>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-[13px]">
            <span>{restaurant.category}</span>
            <span className="text-white/30">·</span>
            <span>{'฿'.repeat(restaurant.price)}</span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-4 h-[42%] flex flex-col">
        <p className="text-gray-500 text-[13px] leading-relaxed mb-3 line-clamp-2">{restaurant.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {restaurant.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-gray-100 rounded-full px-2.5 py-1 font-semibold text-gray-500">{tag}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex -space-x-2">
            {MEMBERS.map(m => (
              <div key={m.id} className="w-7 h-7 rounded-full border-[2.5px] border-white bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-xs shadow-sm">
                {m.avatar}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
            <Users className="w-3 h-3" /> {MEMBERS.length} swiping
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="h-[3px] rounded-full flex-1"
          animate={{
            backgroundColor: i <= step ? '#6C2BD9' : '#E5E7EB',
            scaleX: i === step ? 1 : 0.92,
          }}
          transition={spring}
        />
      ))}
    </div>
  );
}

function SectionLabel({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <motion.p
      className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {children}
    </motion.p>
  );
}

export function GroupJourney() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedGroupType, setSelectedGroupType] = useState<string | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('Now');
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [currentCard, setCurrentCard] = useState(0);
  const [swipeResults, setSwipeResults] = useState<Record<number, 'left' | 'right' | 'up'>>({});
  const [membersJoined, setMembersJoined] = useState(1);
  const [copied, setCopied] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleVibe = useCallback((label: string) => {
    setSelectedVibes(prev => prev.includes(label) ? prev.filter(v => v !== label) : prev.length < 3 ? [...prev, label] : prev);
  }, []);

  const toggleArea = useCallback((label: string) => {
    setSelectedAreas(prev => prev.includes(label) ? prev.filter(a => a !== label) : prev.length < 3 ? [...prev, label] : prev);
  }, []);

  const toggleDietary = useCallback((label: string) => {
    setSelectedDietary(prev => prev.includes(label) ? prev.filter(d => d !== label) : [...prev, label]);
  }, []);

  const startWaiting = useCallback(() => {
    setScreen('waiting');
    setMembersJoined(1);
    let count = 1;
    intervalRef.current = setInterval(() => {
      count++;
      setMembersJoined(count);
      if (count >= 3) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 2000);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startSwiping = useCallback(() => {
    setScreen('swipe');
    setCurrentCard(0);
    setSwipeResults({});
    setSwipeCount(0);
  }, []);

  const handleSwipe = useCallback((dir: 'left' | 'right' | 'up') => {
    setSwipeResults(prev => ({ ...prev, [currentCard]: dir }));
    setSwipeCount(c => c + 1);

    if (currentCard >= 2 && (dir === 'right' || dir === 'up')) {
      setTimeout(() => setScreen('match'), 450);
      return;
    }

    setTimeout(() => {
      setCurrentCard(prev => Math.min(prev + 1, RESTAURANTS.length - 1));
    }, 350);
  }, [currentCard]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const resetFlow = useCallback(() => {
    setScreen('home');
    setSelectedGroupType(null);
    setSelectedVibes([]);
    setSelectedBudget(null);
    setSelectedAreas([]);
    setSelectedDietary([]);
    setSelectedTime('Now');
    setSelectedDate('Today');
    setCurrentCard(0);
    setSwipeResults({});
    setMembersJoined(1);
    setSwipeCount(0);
  }, []);

  const canProceedSetup = !!selectedGroupType;

  const settingsSummaryChips = [
    ...(selectedGroupType ? [GROUP_TYPES.find(g => g.id === selectedGroupType)?.label || ''] : []),
    ...(selectedBudget ? [BUDGETS.find(b => b.id === selectedBudget)?.label || ''] : []),
    ...selectedAreas.slice(0, 2),
    ...(selectedDietary.length > 0 ? [`${selectedDietary.length} dietary`] : []),
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap');
        .no-sb::-webkit-scrollbar{display:none} .no-sb{-ms-overflow-style:none;scrollbar-width:none}
        .glass{background:rgba(255,255,255,0.88);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%)}
        @keyframes confetti-fall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(500px) rotate(720deg);opacity:0}}
        .confetti{animation:confetti-fall 3s ease-in forwards}
        @keyframes gentle-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}} .gfloat{animation:gentle-float 3s ease-in-out infinite}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:0.5}100%{transform:scale(1.8);opacity:0}} .pulse-ring{animation:pulse-ring 2s ease-out infinite}
      `}} />

      <div className="relative w-[390px] h-[844px] bg-[#FAFAF8] rounded-[44px] border-[8px] border-gray-900 overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-[100] pointer-events-none">
          <div className="w-[126px] h-[32px] bg-black rounded-b-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-y-auto no-sb pb-24"
            >
              <div className="relative pt-12 px-5 pb-3">
                <motion.div
                  className="flex items-center gap-3 w-full glass p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60"
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, ...spring }}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">What are you craving?</div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center gap-0.5 text-red-500"><MapPin className="w-3 h-3" /> Sukhumvit</span>
                      <span className="text-gray-300">·</span><span>Any time</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center bg-white">
                    <SlidersHorizontal className="w-4 h-4 text-gray-900" />
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="px-6 mt-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...gentle }}
              >
                <div className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Fri · 7:30 PM · ☀️ 32°C</div>
                <h1 className="text-[30px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-2">Good evening,<br/>foodie.</h1>
                <motion.div
                  className="flex items-center gap-2 mb-5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, ...spring }}
                >
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">🍜 Thai food fan</span>
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                    <span className="text-[#FFCC02]">✨</span> 12-wk streak
                  </span>
                </motion.div>
              </motion.div>

              <div className="px-6 mb-6">
                <motion.h2
                  className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Who's eating with you?
                </motion.h2>

                <div className="flex gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30, rotate: -3 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.35, ...bouncy }}
                    className="flex-1 bg-white rounded-[22px] p-5 border-2 border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden cursor-pointer transition-colors hover:border-[#FFCC02]/50"
                  >
                    <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                      <img src="/__mockup/images/toast_char.png" alt="Solo" className="w-[65px] h-[65px] object-contain gfloat" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-[15px]">Solo</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">AI picks for you</div>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 30, rotate: 3 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.45, ...bouncy }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setScreen('setup')}
                    className="flex-1 bg-white rounded-[22px] p-5 border-2 border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden cursor-pointer transition-colors hover:border-violet-200"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-purple-50/30 opacity-0 hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative">
                      <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
                        <img src="/__mockup/images/toast_waffle.jpeg" alt="Group" className="w-[70px] h-[70px] object-contain" style={{ mixBlendMode: 'multiply' }} />
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center shadow-md"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, ...bouncy }}
                      >
                        <Users className="w-3 h-3 text-white" />
                      </motion.div>
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-gray-900 text-[15px]">Group</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Decide together</div>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-purple-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.button>
                </div>
              </div>

              <div className="px-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Trending nearby</h2>
                  <span className="text-[11px] font-semibold text-violet-500 flex items-center gap-0.5">See all <ChevronRight className="w-3 h-3" /></span>
                </div>
                <div className="flex gap-3 overflow-x-auto no-sb pb-2">
                  {RESTAURANTS.slice(0, 3).map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08, ...spring }}
                      className="flex-shrink-0 w-[160px] bg-white rounded-[18px] overflow-hidden border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                    >
                      <div className="w-full h-[100px] overflow-hidden relative">
                        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white bg-black/25 backdrop-blur-sm rounded-full px-2 py-0.5">
                          {r.category}
                        </div>
                      </div>
                      <div className="p-2.5">
                        <h3 className="font-bold text-[12px] text-gray-900 mb-0.5 truncate">{r.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" />
                          <span className="font-semibold text-gray-600">{r.rating}</span>
                          <span>·</span>
                          <span>{'฿'.repeat(r.price)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 overflow-y-auto no-sb pb-28"
            >
              <div className="pt-14 px-6 pb-2">
                <div className="flex items-center justify-between mb-5">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setScreen('home')}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-700" />
                  </motion.button>
                  <div className="flex items-center gap-1.5 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
                    <Users className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-[11px] font-bold text-violet-600">Group Mode</span>
                  </div>
                </div>

                <ProgressBar step={0} total={5} />

                <motion.div
                  className="mt-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, ...gentle }}
                >
                  <h1 className="text-[26px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-1">Plan your<br/>group feast</h1>
                  <p className="text-[13px] text-gray-400 font-medium">Everyone votes, Toast picks the winner</p>
                </motion.div>
              </div>

              <div className="px-6 mt-5 mb-5">
                <SectionLabel delay={0.15}>Who's joining?</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {GROUP_TYPES.map((g, i) => {
                    const on = selectedGroupType === g.id;
                    return (
                      <motion.button
                        key={g.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05, ...gentle }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedGroupType(on ? null : g.id)}
                        className={`rounded-[20px] p-4 flex items-center gap-3 border-2 transition-all duration-200 text-left will-change-transform ${
                          on ? 'border-violet-400 bg-violet-50/50 shadow-[0_4px_20px_rgba(108,43,217,0.1)]' : 'bg-white border-gray-100'
                        }`}
                      >
                        <motion.span
                          className="text-2xl will-change-transform"
                          animate={on ? { scale: [1, 1.15, 1.05] } : { scale: 1 }}
                          transition={spring}
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
                              transition={spring}
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
                <SectionLabel delay={0.35}>Set the vibe <span className="text-gray-300 normal-case font-medium">(pick up to 3)</span></SectionLabel>
                <div className="grid grid-cols-3 gap-2.5">
                  {VIBES.map((v, i) => {
                    const on = selectedVibes.includes(v.label);
                    const atMax = selectedVibes.length >= 3 && !on;
                    return (
                      <motion.button
                        key={v.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: atMax ? 0.4 : 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.03, ...gentle }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => toggleVibe(v.label)}
                        className={`rounded-2xl p-3 flex flex-col items-center gap-1.5 border-2 transition-all will-change-transform ${
                          on ? 'border-violet-400 bg-violet-50/30' : 'bg-white border-gray-100'
                        }`}
                      >
                        <motion.span
                          className="text-xl will-change-transform"
                          animate={on ? { scale: [1, 1.12, 1.04] } : { scale: 1 }}
                          transition={spring}
                        >
                          {v.emoji}
                        </motion.span>
                        <span className={`text-[10px] font-semibold ${on ? 'text-violet-600' : 'text-gray-500'}`}>{v.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 mb-5">
                <SectionLabel delay={0.45}>Budget</SectionLabel>
                <div className="flex gap-2">
                  {BUDGETS.map((b, i) => {
                    const on = selectedBudget === b.id;
                    return (
                      <motion.button
                        key={b.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.04, ...gentle }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setSelectedBudget(on ? null : b.id)}
                        className={`flex-1 rounded-2xl p-3 flex flex-col items-center gap-1 border-2 transition-all ${
                          on ? 'border-violet-400 bg-violet-50/40 shadow-[0_4px_16px_rgba(108,43,217,0.1)]' : 'bg-white border-gray-100'
                        }`}
                      >
                        <motion.span
                          className="text-lg"
                          animate={on ? { scale: [1, 1.2, 1.05] } : { scale: 1 }}
                          transition={spring}
                        >
                          {b.emoji}
                        </motion.span>
                        <span className={`text-[11px] font-bold ${on ? 'text-violet-700' : 'text-gray-600'}`}>{b.label}</span>
                        <span className="text-[9px] text-gray-400">{b.sub}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 mb-5">
                <SectionLabel delay={0.55}>Where in BKK? <span className="text-gray-300 normal-case font-medium">(up to 3)</span></SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {BKK_AREAS.map((a, i) => {
                    const on = selectedAreas.includes(a.label);
                    const atMax = selectedAreas.length >= 3 && !on;
                    return (
                      <motion.button
                        key={a.label}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: atMax ? 0.4 : 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.025, ...spring }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleArea(a.label)}
                        className={`rounded-full px-3.5 py-2 flex items-center gap-1.5 border-2 transition-all text-[11px] font-semibold ${
                          on ? 'border-violet-400 bg-violet-50/40 text-violet-700' : 'bg-white border-gray-100 text-gray-500'
                        }`}
                      >
                        <span className="text-sm">{a.emoji}</span>
                        {a.label}
                        <AnimatePresence>
                          {on && (
                            <motion.div initial={{ scale: 0, width: 0 }} animate={{ scale: 1, width: 14 }} exit={{ scale: 0, width: 0 }} transition={spring}>
                              <Check className="w-3.5 h-3.5 text-violet-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 mb-5">
                <SectionLabel delay={0.65}>Dietary needs</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {DIETARY.map((d, i) => {
                    const on = selectedDietary.includes(d.label);
                    return (
                      <motion.button
                        key={d.label}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.025, ...spring }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleDietary(d.label)}
                        className={`rounded-full px-3.5 py-2 flex items-center gap-1.5 border-2 transition-all text-[11px] font-semibold ${
                          on ? 'border-violet-400 bg-violet-50/40 text-violet-700' : 'bg-white border-gray-100 text-gray-500'
                        }`}
                      >
                        <span className="text-sm">{d.emoji}</span>
                        {d.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 mb-5">
                <SectionLabel delay={0.75}>When?</SectionLabel>
                <div className="flex gap-2 mb-3">
                  {['Today', 'Tomorrow', 'This weekend'].map((d, i) => {
                    const on = selectedDate === d;
                    return (
                      <motion.button
                        key={d}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.04, ...spring }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setSelectedDate(d)}
                        className={`flex-1 rounded-2xl py-2.5 px-2 text-center border-2 transition-all ${
                          on ? 'border-violet-400 bg-violet-50/40' : 'bg-white border-gray-100'
                        }`}
                      >
                        <div className={`text-[11px] font-bold ${on ? 'text-violet-700' : 'text-gray-600'}`}>{d}</div>
                      </motion.button>
                    );
                  })}
                </div>
                <div className="flex gap-2 overflow-x-auto no-sb pb-1">
                  {TIME_SLOTS.map((t, i) => {
                    const on = selectedTime === t.label;
                    return (
                      <motion.button
                        key={t.label}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.85 + i * 0.04, ...spring }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setSelectedTime(t.label)}
                        className={`flex-shrink-0 rounded-2xl p-3 flex flex-col items-center gap-1 border-2 min-w-[64px] transition-all ${
                          on ? 'border-violet-400 bg-violet-50/40' : 'bg-white border-gray-100'
                        }`}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <span className={`text-[11px] font-bold ${on ? 'text-violet-700' : 'text-gray-600'}`}>{t.label}</span>
                        <span className="text-[9px] text-gray-400">{t.sub}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 pb-4">
                <AnimatePresence>
                  {canProceedSetup && (
                    <motion.button
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setScreen('invite')}
                      className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center gap-2.5 font-bold text-[15px] text-white shadow-[0_8px_28px_rgba(108,43,217,0.35)]"
                    >
                      <UserPlus className="w-5 h-5" />
                      Invite Friends
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {settingsSummaryChips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-1.5 mt-3 justify-center"
                  >
                    {settingsSummaryChips.map(c => (
                      <span key={c} className="text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-2.5 py-1">
                        {c}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {screen === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 flex flex-col pt-14 px-6 pb-24"
            >
              <div className="flex items-center justify-between mb-5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setScreen('setup')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-700" />
                </motion.button>
                <div className="flex items-center gap-1.5 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
                  <Share2 className="w-3.5 h-3.5 text-violet-500" />
                  <span className="text-[11px] font-bold text-violet-600">Invite</span>
                </div>
              </div>

              <ProgressBar step={1} total={5} />

              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div
                  className="w-full"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, ...spring }}
                >
                  <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_16px_48px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="absolute rounded-full bg-white" style={{
                            width: 4 + Math.random() * 8,
                            height: 4 + Math.random() * 8,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                          }} />
                        ))}
                      </div>
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.25, ...bouncy }}
                        className="w-16 h-16 mx-auto mb-3 bg-white/15 rounded-[20px] flex items-center justify-center backdrop-blur-sm border border-white/20"
                      >
                        <Share2 className="w-7 h-7 text-white" />
                      </motion.div>
                      <h2 className="text-white text-[18px] font-bold">Share the invite</h2>
                      <p className="text-white/60 text-[12px] mt-1 font-medium">Friends join with this code</p>
                    </div>

                    <div className="p-5">
                      <div className="bg-[#FAFAF8] rounded-2xl p-4 flex items-center gap-3 mb-4 border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Session code</div>
                          <div className="text-[20px] font-mono font-black text-gray-900 tracking-[0.2em]">A3F7B2D9</div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={handleCopy}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${copied ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'} border`}
                        >
                          <AnimatePresence mode="wait">
                            {copied ? (
                              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
                                <Check className="w-4 h-4 text-emerald-600" />
                              </motion.div>
                            ) : (
                              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
                                <Copy className="w-4 h-4 text-gray-400" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>

                      {settingsSummaryChips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                          {settingsSummaryChips.map(c => (
                            <span key={c} className="text-[9px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5">{c}</span>
                          ))}
                        </div>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full h-[48px] rounded-2xl bg-[#00B900] flex items-center justify-center gap-2 font-bold text-white text-[14px] shadow-[0_6px_20px_rgba(0,185,0,0.25)] mb-3"
                      >
                        <MessageCircle className="w-4.5 h-4.5" />
                        Share via LINE
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={startWaiting}
                        className="w-full h-[48px] rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center gap-2 font-bold text-white text-[14px] shadow-[0_6px_20px_rgba(108,43,217,0.25)]"
                      >
                        Go to Waiting Room
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {screen === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 flex flex-col items-center pt-14 px-6 pb-24"
            >
              <div className="w-full flex items-center justify-between mb-5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setScreen('invite')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-700" />
                </motion.button>
                <span className="text-[11px] font-mono font-bold text-gray-400 bg-gray-100 rounded-full px-3 py-1.5">A3F7B2D9</span>
              </div>

              <ProgressBar step={2} total={5} />

              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <motion.div
                  className="relative mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, ...spring }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-[24px] bg-violet-400/20 pulse-ring" />
                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-[0_10px_36px_rgba(108,43,217,0.3)] relative z-10">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-lg text-sm font-black z-20 border-2 border-white"
                    key={membersJoined}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    {membersJoined}
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ...gentle }}
                  className="text-[22px] font-['Playfair_Display'] font-bold text-gray-900 mb-1"
                >
                  {membersJoined >= 3 ? "Everyone's here!" : 'Waiting for friends'}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[13px] text-gray-400 mb-8"
                >
                  {membersJoined >= 3 ? 'Ready to start swiping' : `${membersJoined}/3 joined`}
                </motion.p>

                <div className="w-full max-w-xs space-y-3 mb-8">
                  {MEMBERS.slice(0, membersJoined).map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: i === 0 ? 0 : 0.15 * i + 0.3, ...spring }}
                      className="flex items-center gap-3 bg-white rounded-[20px] p-3.5 border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                    >
                      <motion.div
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-xl border-2 border-white shadow-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i === 0 ? 0.1 : 0.15 * i + 0.4, ...bouncy }}
                      >
                        {m.avatar}
                      </motion.div>
                      <div className="flex-1">
                        <div className="text-[13px] font-bold text-gray-900">{m.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{m.isHost ? 'Host · Created session' : 'Just joined'}</div>
                      </div>
                      {m.isHost && (
                        <div className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-sm">
                          <Crown className="w-3 h-3 text-gray-900" />
                        </div>
                      )}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i === 0 ? 0.2 : 0.15 * i + 0.5, ...bouncy }}
                        className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                      </motion.div>
                    </motion.div>
                  ))}

                  {membersJoined < 3 && (
                    <motion.div
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="flex items-center gap-3 bg-gray-50/80 rounded-[20px] p-3.5 border border-dashed border-gray-200"
                    >
                      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
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
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startSwiping}
                      className="w-full max-w-xs h-[52px] rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center gap-2 font-bold text-[15px] text-white shadow-[0_8px_28px_rgba(108,43,217,0.35)]"
                    >
                      <Flame className="w-5 h-5" />
                      Start Swiping!
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {screen === 'swipe' && (
            <motion.div
              key="swipe"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col pt-12 pb-24"
            >
              <div className="px-5 mb-3">
                <ProgressBar step={3} total={5} />
                <div className="flex items-center justify-between mt-3">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setScreen('waiting')}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gray-700" />
                  </motion.button>

                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2">
                      {MEMBERS.map(m => (
                        <div key={m.id} className="w-7 h-7 rounded-full border-[2.5px] border-[#FAFAF8] bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-xs shadow-sm">
                          {m.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{MEMBERS.length} swiping</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
                    <Flame className="w-3 h-3 text-orange-400" />
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

              <div className="px-5 pt-3 flex items-center justify-center gap-5">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => handleSwipe('left')}
                  className="w-[52px] h-[52px] rounded-full bg-white border-2 border-red-200/60 flex items-center justify-center shadow-[0_6px_20px_rgba(239,68,68,0.1)]"
                >
                  <X className="w-5 h-5 text-red-400" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => handleSwipe('up')}
                  className="w-[44px] h-[44px] rounded-full bg-white border-2 border-[#FFCC02]/60 flex items-center justify-center shadow-[0_6px_20px_rgba(255,204,2,0.15)]"
                >
                  <Star className="w-5 h-5 text-[#FFCC02] fill-[#FFCC02]" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => handleSwipe('right')}
                  className="w-[52px] h-[52px] rounded-full bg-white border-2 border-emerald-200/60 flex items-center justify-center shadow-[0_6px_20px_rgba(16,185,129,0.1)]"
                >
                  <Heart className="w-5 h-5 text-emerald-500" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {screen === 'match' && (
            <motion.div
              key="match"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center pt-16 px-6 pb-24 relative overflow-hidden overflow-y-auto no-sb"
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="confetti absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: -12,
                      width: Math.random() > 0.5 ? 8 : 5,
                      height: Math.random() > 0.5 ? 8 : 14,
                      backgroundColor: ['#6C2BD9', '#FFD700', '#FF385C', '#00A699', '#FF6B6B', '#4ECDC4', '#7B61FF'][i % 7],
                      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2.5 + Math.random() * 1.5}s`,
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, ...bouncy }}
                className="mb-4"
              >
                <div className="w-[90px] h-[90px] rounded-[26px] bg-gradient-to-br from-[#FFCC02] to-amber-400 flex items-center justify-center shadow-[0_16px_48px_rgba(255,204,2,0.4)] relative">
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  >
                    <Trophy className="w-11 h-11 text-gray-900" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-5 h-5 text-[#FFCC02]" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ...gentle }}
                className="text-[26px] font-['Playfair_Display'] font-bold text-gray-900 mb-1 text-center"
              >
                It's a Match!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-[13px] text-gray-400 mb-5 font-medium"
              >
                Everyone voted for this one 🎉
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, ...spring }}
                className="w-full bg-white rounded-[24px] border border-gray-100 shadow-[0_16px_48px_rgba(0,0,0,0.08)] overflow-hidden mb-5"
              >
                <div className="relative h-[150px]">
                  <img src={RESTAURANTS[2].image} alt={RESTAURANTS[2].name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white text-[18px] font-bold drop-shadow-lg">{RESTAURANTS[2].name}</h3>
                    <p className="text-white/80 text-[12px] flex items-center gap-1.5 mt-0.5">
                      {RESTAURANTS[2].category}
                      <span className="text-white/40">·</span>
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-current" /> {RESTAURANTS[2].rating}</span>
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.7, ...bouncy }}
                    className="absolute top-3 right-3 bg-[#FFCC02] text-gray-900 text-[10px] font-black rounded-full px-3 py-1.5 shadow-[0_4px_12px_rgba(255,204,2,0.4)] flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 fill-current" /> Full Match
                  </motion.div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Voted by</p>
                    <div className="flex -space-x-2">
                      {MEMBERS.map((m, i) => (
                        <motion.div
                          key={m.id}
                          initial={{ scale: 0, x: -8 }}
                          animate={{ scale: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.08, ...bouncy }}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 border-[2.5px] border-white flex items-center justify-center text-sm shadow-sm"
                        >
                          {m.avatar}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="w-full flex gap-2.5"
              >
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-violet-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">View Restaurant</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setScreen('topPicks')}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-50 to-[#FFCC02]/15 flex items-center justify-center">
                    <ListOrdered className="w-4 h-4 text-[#FFCC02]" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">Top Picks</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={startSwiping}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">Keep Swiping</span>
                </motion.button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setScreen('summary')}
                className="w-full mt-4 h-[48px] rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center gap-2 font-bold text-[14px] text-white shadow-[0_6px_20px_rgba(108,43,217,0.25)]"
              >
                <BarChart3 className="w-4 h-4" />
                Wrap It Up
              </motion.button>
            </motion.div>
          )}

          {screen === 'topPicks' && (
            <motion.div
              key="topPicks"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 overflow-y-auto no-sb pt-14 px-6 pb-28"
            >
              <div className="flex items-center justify-between mb-5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setScreen('match')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-700" />
                </motion.button>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <Crown className="w-3.5 h-3.5 text-[#FFCC02]" />
                  <span className="text-[11px] font-bold text-amber-700">Top Picks</span>
                </div>
              </div>

              <ProgressBar step={4} total={5} />

              <motion.div
                className="mt-5 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ...gentle }}
              >
                <h1 className="text-[24px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-1">Group's top picks</h1>
                <p className="text-[13px] text-gray-400 font-medium">Ranked by group votes</p>
              </motion.div>

              <div className="space-y-3">
                {TOP_PICKS_DATA.map((pick, i) => {
                  const rankIcons = [Crown, Medal, Award];
                  const rankColors = ['text-[#FFCC02]', 'text-gray-400', 'text-amber-600'];
                  const rankBgs = ['bg-[#FFCC02]/10 border-[#FFCC02]/30', 'bg-gray-100 border-gray-200', 'bg-amber-50 border-amber-200'];
                  const RankIcon = rankIcons[i] || Star;

                  return (
                    <motion.div
                      key={pick.id}
                      initial={{ opacity: 0, x: -20, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.08, ...spring }}
                      className={`bg-white rounded-[22px] overflow-hidden border shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${
                        i === 0 ? 'border-[#FFCC02]/30 ring-1 ring-[#FFCC02]/20' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex gap-3 p-3.5">
                        <div className="relative flex-shrink-0">
                          <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden">
                            <img src={pick.image} alt={pick.name} className="w-full h-full object-cover" />
                          </div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.08, ...bouncy }}
                            className={`absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-md ${i < 3 ? rankBgs[i] : 'bg-gray-50 border-gray-200'}`}
                          >
                            {i < 3 ? (
                              <RankIcon className={`w-3.5 h-3.5 ${rankColors[i]}`} />
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400">#{i + 1}</span>
                            )}
                          </motion.div>
                          {pick.fullMatch && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 + i * 0.08, ...bouncy }}
                              className="absolute -bottom-1 -right-1 bg-[#FFCC02] rounded-full px-1.5 py-0.5 text-[7px] font-black text-gray-900 shadow-sm border border-white"
                            >
                              MATCH
                            </motion.div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h3 className="text-[14px] font-bold text-gray-900 truncate">{pick.name}</h3>
                          </div>
                          <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
                            {pick.category}
                            <span className="text-gray-300">·</span>
                            <Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" />
                            <span className="font-semibold text-gray-600">{pick.rating}</span>
                            <span className="text-gray-300">·</span>
                            {'฿'.repeat(pick.price)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-1.5">
                              {pick.voters.map(vId => {
                                const m = MEMBERS.find(mm => mm.id === vId);
                                return m ? (
                                  <div key={m.id} className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 border-[2px] border-white flex items-center justify-center text-[10px] shadow-sm">
                                    {m.avatar}
                                  </div>
                                ) : null;
                              })}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              pick.votes === 3 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-gray-500 bg-gray-50 border border-gray-100'
                            }`}>
                              {pick.votes}/{MEMBERS.length} votes
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setScreen('summary')}
                className="w-full mt-5 h-[52px] rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center gap-2 font-bold text-[15px] text-white shadow-[0_8px_28px_rgba(108,43,217,0.35)]"
              >
                <BarChart3 className="w-5 h-5" />
                Wrap It Up
              </motion.button>
            </motion.div>
          )}

          {screen === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex-1 overflow-y-auto no-sb pt-14 px-6 pb-28"
            >
              <div className="flex items-center justify-between mb-5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setScreen('topPicks')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-700" />
                </motion.button>
                <div className="flex items-center gap-1.5 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
                  <BarChart3 className="w-3.5 h-3.5 text-violet-500" />
                  <span className="text-[11px] font-bold text-violet-600">Summary</span>
                </div>
              </div>

              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ...gentle }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, ...bouncy }}
                  className="w-16 h-16 mx-auto mb-3 rounded-[20px] bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-[0_10px_32px_rgba(108,43,217,0.25)]"
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-[24px] font-['Playfair_Display'] font-bold text-gray-900 mb-0.5">Session Complete!</h1>
                <p className="text-[12px] text-gray-400 font-medium">Here's how your group did</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, ...gentle }}
                className="bg-white rounded-[22px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span className="text-[12px] font-bold text-gray-900">Group Stats</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Swipes', value: '18', icon: '👆', color: 'from-violet-50 to-purple-50' },
                    { label: 'Group Likes', value: '12', icon: '❤️', color: 'from-emerald-50 to-green-50' },
                    { label: 'Matches', value: '1', icon: '🎯', color: 'from-amber-50 to-yellow-50' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06, ...spring }}
                      className={`bg-gradient-to-br ${stat.color} rounded-2xl p-3 text-center`}
                    >
                      <span className="text-xl mb-1 block">{stat.icon}</span>
                      <div className="text-[18px] font-bold text-gray-900">{stat.value}</div>
                      <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Group Favourite</div>
                    <div className="text-[14px] font-bold text-gray-900">🍜 Thai Cuisine</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Session</div>
                    <div className="text-[14px] font-bold text-violet-600">#3 together</div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...gentle }}
                className="mb-5"
              >
                <div className="flex items-center gap-2 mb-3.5">
                  <Users className="w-4 h-4 text-violet-500" />
                  <span className="text-[12px] font-bold text-gray-900">Member Breakdown</span>
                </div>
                <div className="space-y-2.5">
                  {MEMBER_STATS.map((ms, i) => (
                    <motion.div
                      key={ms.member.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.08, ...spring }}
                      className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-lg border-2 border-white shadow-sm">
                          {ms.member.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5">
                            {ms.member.name}
                            {ms.member.isHost && (
                              <span className="text-[8px] font-bold text-[#FFCC02] bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-1.5 py-0.5">HOST</span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1">
                            Loves {ms.emoji} {ms.favCuisine}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-emerald-50 rounded-xl p-2 text-center">
                          <div className="text-[15px] font-bold text-emerald-600">{ms.likes}</div>
                          <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider">Likes</div>
                        </div>
                        <div className="flex-1 bg-red-50 rounded-xl p-2 text-center">
                          <div className="text-[15px] font-bold text-red-500">{ms.dislikes}</div>
                          <div className="text-[8px] font-bold text-red-400 uppercase tracking-wider">Nah</div>
                        </div>
                        <div className="flex-1 bg-amber-50 rounded-xl p-2 text-center">
                          <div className="text-[15px] font-bold text-amber-600">{ms.superLikes}</div>
                          <div className="text-[8px] font-bold text-amber-500 uppercase tracking-wider">Super</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, ...gentle }}
                className="bg-white rounded-[22px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-violet-500" />
                  <span className="text-[12px] font-bold text-gray-900">All-Time Stats</span>
                  <span className="ml-auto text-[10px] font-semibold text-violet-500 bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5">3 sessions</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Matches', value: '7', emoji: '🎯' },
                    { label: 'Total Swipes', value: '54', emoji: '👆' },
                    { label: 'Go-to Cuisine', value: 'Thai', emoji: '🍜' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.75 + i * 0.06, ...spring }}
                      className="text-center"
                    >
                      <span className="text-lg block mb-0.5">{stat.emoji}</span>
                      <div className="text-[15px] font-bold text-gray-900">{stat.value}</div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="space-y-2.5">
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-[50px] rounded-2xl bg-gradient-to-r from-[#FFCC02] to-amber-400 flex items-center justify-center gap-2 font-bold text-[15px] text-gray-900 shadow-[0_8px_24px_rgba(255,204,2,0.3)]"
                >
                  <Share2 className="w-4.5 h-4.5" />
                  Share Results
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetFlow}
                  className="w-full h-[48px] rounded-2xl bg-white border border-gray-200 flex items-center justify-center gap-2 font-bold text-[14px] text-gray-600 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start New Session
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 inset-x-0 h-[84px] glass border-t border-gray-100/40 flex justify-around items-start pt-3 px-6 z-[90] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {[
            { icon: Home, label: 'Home', active: screen === 'home' },
            { icon: MapIcon, label: 'Map', active: false },
            { icon: Heart, label: 'Saved', active: false },
            { icon: User, label: 'Profile', active: false },
          ].map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ...spring }}
              className={`flex flex-col items-center gap-0.5 ${n.active ? 'text-gray-900' : 'text-gray-400'}`}
              onClick={n.label === 'Home' ? resetFlow : undefined}
              style={{ cursor: n.label === 'Home' ? 'pointer' : 'default' }}
            >
              <n.icon className={`w-5 h-5 ${n.active ? 'text-gray-900' : ''}`} />
              <span className={`text-[10px] font-semibold ${n.active ? 'font-bold' : ''}`}>{n.label}</span>
              {n.active && (
                <motion.div
                  layoutId="nav-dot"
                  className="w-1 h-1 rounded-full bg-gray-900 mt-0.5"
                  transition={spring}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
