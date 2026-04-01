import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star,
  Sparkles, ArrowRight, ArrowLeft, Check, X, Users, UserPlus,
  Share2, Copy, Crown, Trophy, MessageCircle, Clock, ChevronRight, Flame, Zap,
  Wallet, Award, Medal, BarChart3, RotateCcw, Eye, ListOrdered,
  ChevronDown, MapPinned, Leaf, Timer, TrendingUp
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };
const gentle = { type: "spring" as const, stiffness: 200, damping: 28 };

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
  { id: 'friends', emoji: '👯', label: 'Friends', sub: 'Casual hangout', gradient: 'from-amber-300 to-[#FFCC02]', shadow: 'rgba(255,204,2,0.20)' },
  { id: 'partner', emoji: '💕', label: 'Date', sub: 'Romantic dinner', gradient: 'from-rose-300 to-pink-400', shadow: 'rgba(225,29,72,0.20)' },
  { id: 'family', emoji: '👨‍👩‍👧', label: 'Family', sub: 'Kid-friendly', gradient: 'from-orange-300 to-amber-400', shadow: 'rgba(245,158,11,0.20)' },
  { id: 'work', emoji: '💼', label: 'Team', sub: 'Office outing', gradient: 'from-sky-300 to-blue-400', shadow: 'rgba(14,165,233,0.20)' },
];

const FOOD_CATEGORIES = [
  { title: 'Style', items: [
    { emoji: '🍢', label: 'Street food' },
    { emoji: '🍽️', label: 'Restaurant' },
    { emoji: '✨', label: 'Fine dining' },
  ]},
  { title: 'Setting', items: [
    { emoji: '🚇', label: 'Near BTS' },
    { emoji: '🌊', label: 'Riverside' },
    { emoji: '🏙️', label: 'Rooftop' },
  ]},
  { title: 'Mood', items: [
    { emoji: '🌃', label: 'Late night' },
    { emoji: '🔥', label: 'Trending' },
    { emoji: '💰', label: 'Budget' },
  ]},
];

const BUDGETS = [
  { id: 'cheap', label: '฿', sub: '<150' },
  { id: 'moderate', label: '฿฿', sub: '150–500' },
  { id: 'fancy', label: '฿฿฿', sub: '500–1.5k' },
  { id: 'splurge', label: '฿฿฿฿', sub: '1.5k+' },
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

const TIME_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TIME_MINUTES = ['00', '15', '30', '45'];

function getCalendarData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const monthName = now.toLocaleString('en', { month: 'long' });
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return { year, monthName, todayDate, cells, daysInMonth };
}
const CAL = getCalendarData();
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MEMBER_STATS = [
  { member: MEMBERS[0], likes: 4, dislikes: 1, superLikes: 1, favCuisine: 'Thai', emoji: '🍜', agreePct: 89 },
  { member: MEMBERS[1], likes: 3, dislikes: 2, superLikes: 1, favCuisine: 'Japanese', emoji: '🍣', agreePct: 72 },
  { member: MEMBERS[2], likes: 5, dislikes: 1, superLikes: 0, favCuisine: 'Thai', emoji: '🍜', agreePct: 94 },
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
    if (info.offset.y < -90) { swiped.current = true; setExiting({ x: 0, y: -600 }); setTimeout(() => onSwipe('up'), 280); }
    else if (info.offset.x > 90) { swiped.current = true; setExiting({ x: 500, y: 0 }); setTimeout(() => onSwipe('right'), 280); }
    else if (info.offset.x < -90) { swiped.current = true; setExiting({ x: -500, y: 0 }); setTimeout(() => onSwipe('left'), 280); }
  }, [onSwipe]);

  if (!active && !behind) return null;

  return (
    <motion.div
      style={{
        x: active ? x : 0, y: active ? y : 0, rotate: active ? rotate : 0,
        zIndex: active ? 10 : 5,
        boxShadow: active ? '0 24px 60px -12px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.03)' : '0 10px 30px -8px rgba(0,0,0,0.1)',
      }}
      animate={exiting ? { x: exiting.x, y: exiting.y, opacity: 0, rotate: exiting.x > 0 ? 18 : exiting.x < 0 ? -18 : 0 } : behind ? { scale: 0.94, y: 12, opacity: 0.5 } : { scale: 1, y: 0, opacity: 1 }}
      transition={exiting ? { duration: 0.3, ease: [0.32, 0.72, 0, 1] } : spring}
      drag={active && !exiting} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.85} onDragEnd={handleDragEnd}
      className="absolute inset-0 bg-white rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full h-[58%]">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {active && (
          <>
            <motion.div style={{ opacity: bgRight }} className="absolute top-7 left-5 z-20"><div className="bg-emerald-500 text-white text-lg font-black rounded-2xl px-5 py-2 -rotate-12 border-[3px] border-white/40 shadow-lg flex items-center gap-1.5">YUM <span className="text-xl">😋</span></div></motion.div>
            <motion.div style={{ opacity: bgLeft }} className="absolute top-7 right-5 z-20"><div className="bg-red-500 text-white text-lg font-black rounded-2xl px-5 py-2 rotate-12 border-[3px] border-white/40 shadow-lg flex items-center gap-1.5">NAH <span className="text-xl">👎</span></div></motion.div>
            <motion.div style={{ opacity: bgUp }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"><div className="bg-[#FFCC02] text-gray-900 text-lg font-black rounded-2xl px-5 py-2 border-[3px] border-white/40 shadow-lg flex items-center gap-1.5">SUPERLIKE <span className="text-xl">⭐</span></div></motion.div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-white text-[22px] font-bold drop-shadow-lg">{restaurant.name}</h2>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, ...bouncy }} className="bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
              <span className="text-white text-[11px] font-bold flex items-center gap-0.5"><Star className="w-3 h-3 fill-current" /> {restaurant.rating}</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-[13px]"><span>{restaurant.category}</span><span className="text-white/30">·</span><span>{'฿'.repeat(restaurant.price)}</span></div>
        </div>
      </div>
      <div className="p-5 pt-4 h-[42%] flex flex-col">
        <p className="text-gray-500 text-[13px] leading-relaxed mb-3 line-clamp-2">{restaurant.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">{restaurant.tags.map(tag => (<span key={tag} className="text-[10px] bg-gray-100 rounded-full px-2.5 py-1 font-semibold text-gray-500">{tag}</span>))}</div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex -space-x-2">{MEMBERS.map(m => (<div key={m.id} className="w-7 h-7 rounded-full border-[2.5px] border-white bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-xs shadow-sm">{m.avatar}</div>))}</div>
          <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1"><Users className="w-3 h-3" /> {MEMBERS.length} swiping</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i} className="h-[3px] rounded-full flex-1" animate={{ backgroundColor: i <= step ? '#FFCC02' : '#E5E7EB', scaleX: i === step ? 1 : 0.92 }} transition={spring} />
      ))}
    </div>
  );
}

export function GroupJourney() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedGroupType, setSelectedGroupType] = useState<string | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedCalDate, setSelectedCalDate] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<number>(7);
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [selectedAmPm, setSelectedAmPm] = useState<string>('PM');
  const [currentCard, setCurrentCard] = useState(0);
  const [swipeResults, setSwipeResults] = useState<Record<number, 'left' | 'right' | 'up'>>({});
  const [membersJoined, setMembersJoined] = useState(1);
  const [copied, setCopied] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

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
    intervalRef.current = setInterval(() => { count++; setMembersJoined(count); if (count >= 3 && intervalRef.current) clearInterval(intervalRef.current); }, 2000);
  }, []);

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  const startSwiping = useCallback(() => { setScreen('swipe'); setCurrentCard(0); setSwipeResults({}); setSwipeCount(0); }, []);

  const handleSwipe = useCallback((dir: 'left' | 'right' | 'up') => {
    setSwipeResults(prev => ({ ...prev, [currentCard]: dir }));
    setSwipeCount(c => c + 1);
    if (currentCard >= 2 && (dir === 'right' || dir === 'up')) { setTimeout(() => setScreen('match'), 450); return; }
    setTimeout(() => { setCurrentCard(prev => Math.min(prev + 1, RESTAURANTS.length - 1)); }, 350);
  }, [currentCard]);

  const handleCopy = useCallback(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }, []);

  const resetFlow = useCallback(() => {
    setScreen('home'); setSelectedGroupType(null); setSelectedVibes([]); setSelectedBudget(null);
    setSelectedAreas([]); setSelectedDietary([]); setSelectedCalDate(null); setSelectedHour(7);
    setSelectedMinute('00'); setSelectedAmPm('PM');
    setCurrentCard(0); setSwipeResults({}); setMembersJoined(1); setSwipeCount(0); setShowMoreOptions(false);
  }, []);

  const canInvite = !!selectedGroupType;
  const dateLabel = selectedCalDate ? `${CAL.monthName.slice(0, 3)} ${selectedCalDate}` : '';
  const timeLabel = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;
  const selCount = (selectedVibes.length > 0 ? 1 : 0) + (selectedBudget ? 1 : 0) + (selectedAreas.length > 0 ? 1 : 0) + (selectedCalDate ? 1 : 0);

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
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .shimmer-gold{background:linear-gradient(90deg,transparent 0%,rgba(255,204,2,0.08) 50%,transparent 100%);background-size:200% 100%;animation:shimmer 3s ease-in-out infinite}
        @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-1%,-1%)}20%{transform:translate(1%,0)}30%{transform:translate(-1%,1%)}40%{transform:translate(1%,-1%)}50%{transform:translate(-1%,0)}60%{transform:translate(1%,1%)}70%{transform:translate(0,-1%)}80%{transform:translate(-1%,1%)}90%{transform:translate(1%,0%)}}
      `}} />

      <div className="relative w-[390px] h-[844px] bg-[#FAFAF8] rounded-[44px] border-[8px] border-gray-900 overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-[100] pointer-events-none">
          <div className="w-[126px] h-[32px] bg-black rounded-b-3xl" />
        </div>

        <AnimatePresence mode="wait">

          {screen === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto no-sb pb-24">
              <div className="relative pt-12 px-5 pb-3">
                <motion.div className="flex items-center gap-3 w-full glass p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60" whileTap={{ scale: 0.98 }} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, ...spring }}>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0"><Search className="w-5 h-5 text-gray-900" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">What are you craving?</div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium"><span className="flex items-center gap-0.5 text-red-500"><MapPin className="w-3 h-3" /> Sukhumvit</span><span className="text-gray-300">·</span><span>Any time</span></div>
                  </div>
                  <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center bg-white"><SlidersHorizontal className="w-4 h-4 text-gray-900" /></div>
                </motion.div>
              </div>

              <motion.div className="px-6 mt-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...gentle }}>
                <div className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Fri · 7:30 PM · ☀️ 32°C</div>
                <h1 className="text-[30px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-2">Good evening,<br/>foodie.</h1>
                <motion.div className="flex items-center gap-2 mb-5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, ...spring }}>
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">🍜 Thai food fan</span>
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1"><span className="text-[#FFCC02]">✨</span> 12-wk streak</span>
                </motion.div>
              </motion.div>

              <div className="px-6 mb-6">
                <motion.h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Who's eating with you?</motion.h2>
                <div className="flex gap-4">
                  <motion.div initial={{ opacity: 0, y: 30, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.35, ...bouncy }} className="flex-1 bg-white rounded-[22px] p-5 border-2 border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden cursor-pointer transition-colors hover:border-[#FFCC02]/50">
                    <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center"><img src="/__mockup/images/toast_char.png" alt="Solo" className="w-[65px] h-[65px] object-contain gfloat" /></div>
                    <div><div className="font-bold text-gray-900 text-[15px]">Solo</div><div className="text-[11px] text-gray-500 mt-0.5">AI picks for you</div></div>
                  </motion.div>
                  <motion.button initial={{ opacity: 0, y: 30, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.45, ...bouncy }} whileTap={{ scale: 0.96 }} onClick={() => setScreen('setup')} className="flex-1 bg-white rounded-[22px] p-5 border-2 border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden cursor-pointer transition-colors hover:border-[#FFCC02]/50">
                    <div className="relative">
                      <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-amber-50 to-[#FFCC02]/15 flex items-center justify-center"><img src="/__mockup/images/toast_waffle.jpeg" alt="Group" className="w-[70px] h-[70px] object-contain" style={{ mixBlendMode: 'multiply' }} /></div>
                      <motion.div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-md" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, ...bouncy }}><Users className="w-3 h-3 text-gray-900" /></motion.div>
                    </div>
                    <div className="relative z-10"><div className="font-bold text-gray-900 text-[15px]">Group</div><div className="text-[11px] text-gray-500 mt-0.5">Decide together</div></div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFCC02] to-amber-400" initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: 'left' }} />
                  </motion.button>
                </div>
              </div>

              <div className="px-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Trending nearby</h2>
                  <span className="text-[11px] font-semibold text-[#FFCC02] flex items-center gap-0.5">See all <ChevronRight className="w-3 h-3" /></span>
                </div>
                <div className="flex gap-3 overflow-x-auto no-sb pb-2">
                  {RESTAURANTS.slice(0, 3).map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08, ...spring }} className="flex-shrink-0 w-[160px] bg-white rounded-[18px] overflow-hidden border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                      <div className="w-full h-[100px] overflow-hidden relative">
                        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white bg-black/25 backdrop-blur-sm rounded-full px-2 py-0.5">{r.category}</div>
                      </div>
                      <div className="p-2.5">
                        <h3 className="font-bold text-[12px] text-gray-900 mb-0.5 truncate">{r.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400"><Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" /><span className="font-semibold text-gray-600">{r.rating}</span><span>·</span><span>{'฿'.repeat(r.price)}</span></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto no-sb pb-36">

                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFCC02]/8 via-amber-50/30 to-[#FAFAF8]" />
                  <div className="relative pt-14 px-6 pb-3">
                    <div className="flex items-center justify-between mb-4">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('home')} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></motion.button>
                      <div className="flex items-center gap-1.5 bg-[#FFCC02]/10 px-3 py-1.5 rounded-full border border-[#FFCC02]/20"><Users className="w-3.5 h-3.5 text-amber-600" /><span className="text-[11px] font-bold text-amber-700">Group Mode</span></div>
                    </div>
                    <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...gentle }} className="text-[28px] font-['Playfair_Display'] font-bold text-gray-900 leading-[1.15]">Plan together</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[12px] text-gray-400 mt-1 font-medium">When, where & what — we'll handle the rest</motion.p>
                  </div>
                </div>

                {/* ── STEP 1: WHO ── */}
                <motion.div className="px-5 mb-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, ...spring }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#FFCC02] flex items-center justify-center"><span className="text-[10px] font-black text-gray-900">1</span></div>
                    <p className="text-[11px] font-bold text-gray-700">Who's coming?</p>
                  </div>
                  <div className="flex gap-2">
                    {GROUP_TYPES.map((g, i) => {
                      const on = selectedGroupType === g.id;
                      return (
                        <motion.button key={g.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.04, ...bouncy }} whileTap={{ scale: 0.92 }} onClick={() => setSelectedGroupType(on ? null : g.id)}
                          className={`flex-1 rounded-2xl py-2.5 flex flex-col items-center gap-1 border-2 transition-all relative overflow-hidden ${on ? 'border-[#FFCC02] bg-white shadow-[0_6px_20px_rgba(255,204,2,0.15)]' : 'border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}
                        >
                          <div className={`absolute top-0 right-0 w-14 h-14 rounded-full bg-gradient-to-br ${g.gradient} opacity-[0.06] -translate-y-3 translate-x-3`} />
                          <motion.span className="text-lg" animate={on ? { scale: [1, 1.25, 1.1] } : { scale: 1 }} transition={bouncy}>{g.emoji}</motion.span>
                          <span className={`text-[11px] font-bold ${on ? 'text-gray-900' : 'text-gray-600'}`}>{g.label}</span>
                          {on && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={bouncy} className="absolute top-1 right-1 w-4 h-4 bg-[#FFCC02] rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-gray-900" /></motion.div>}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* ── STEP 2: WHEN ── */}
                <motion.div className="px-5 mb-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, ...spring }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedGroupType ? 'bg-[#FFCC02]' : 'bg-gray-200'}`}><span className={`text-[10px] font-black ${selectedGroupType ? 'text-gray-900' : 'text-gray-400'}`}>2</span></div>
                    <p className={`text-[11px] font-bold ${selectedGroupType ? 'text-gray-700' : 'text-gray-400'}`}>When are you free?</p>
                    {selectedCalDate && <span className="ml-auto text-[9px] font-semibold text-amber-700 bg-[#FFCC02]/10 rounded-full px-2 py-0.5 border border-[#FFCC02]/20">{dateLabel} · {timeLabel}</span>}
                  </div>
                  <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="p-3 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-700">{CAL.monthName} {CAL.year}</span>
                      </div>
                      <div className="grid grid-cols-7 gap-px">
                        {DAY_HEADERS.map(d => (
                          <div key={d} className="text-center text-[8px] font-bold text-gray-400 py-1">{d}</div>
                        ))}
                        {CAL.cells.map((day, i) => {
                          if (!day) return <div key={`e-${i}`} />;
                          const isPast = day < CAL.todayDate;
                          const isToday = day === CAL.todayDate;
                          const isSelected = day === selectedCalDate;
                          return (
                            <motion.button key={day} disabled={isPast} whileTap={!isPast ? { scale: 0.85 } : undefined}
                              onClick={() => !isPast && setSelectedCalDate(isSelected ? null : day)}
                              className={`aspect-square rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                                ${isSelected ? 'bg-[#FFCC02] text-gray-900 shadow-[0_2px_8px_rgba(255,204,2,0.3)]' : ''}
                                ${isToday && !isSelected ? 'bg-[#FFCC02]/12 text-gray-900 ring-1 ring-[#FFCC02]/30' : ''}
                                ${isPast ? 'text-gray-200' : !isSelected && !isToday ? 'text-gray-600 hover:bg-gray-50' : ''}
                              `}
                            >
                              {day}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 px-3 py-2.5">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-[#FFCC02]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 relative h-[88px] bg-[#FAFAF8] rounded-2xl overflow-hidden border border-gray-100">
                          <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#FAFAF8] to-transparent z-10 pointer-events-none" />
                          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#FAFAF8] to-transparent z-10 pointer-events-none" />
                          <div className="absolute inset-x-1 top-[28px] h-[32px] bg-white rounded-xl border border-[#FFCC02]/20 shadow-[0_2px_6px_rgba(255,204,2,0.08)] z-0" />
                          <div className="h-full flex items-center justify-center gap-0">
                            <div className="flex flex-col items-center" style={{ transform: `translateY(${(6 - TIME_HOURS.indexOf(selectedHour)) * 32}px)`, transition: 'transform 0.25s cubic-bezier(0.32,0.72,0,1)' }}>
                              {TIME_HOURS.map(h => {
                                const dist = Math.abs(TIME_HOURS.indexOf(h) - TIME_HOURS.indexOf(selectedHour));
                                return (
                                  <button key={h} onClick={() => setSelectedHour(h)}
                                    className={`h-[32px] w-10 flex items-center justify-center text-[15px] font-black transition-all duration-200
                                      ${h === selectedHour ? 'text-gray-900' : dist === 1 ? 'text-gray-400 scale-[0.88]' : 'text-gray-200 scale-[0.78]'}`}
                                  >{h}</button>
                                );
                              })}
                            </div>
                            <span className="text-gray-300 text-[14px] font-bold mx-0.5">:</span>
                            <div className="flex flex-col items-center" style={{ transform: `translateY(${(1 - TIME_MINUTES.indexOf(selectedMinute)) * 32}px)`, transition: 'transform 0.25s cubic-bezier(0.32,0.72,0,1)' }}>
                              {TIME_MINUTES.map(m => {
                                const dist = Math.abs(TIME_MINUTES.indexOf(m) - TIME_MINUTES.indexOf(selectedMinute));
                                return (
                                  <button key={m} onClick={() => setSelectedMinute(m)}
                                    className={`h-[32px] w-10 flex items-center justify-center text-[15px] font-black transition-all duration-200
                                      ${m === selectedMinute ? 'text-gray-900' : dist === 1 ? 'text-gray-400 scale-[0.88]' : 'text-gray-200 scale-[0.78]'}`}
                                  >{m}</button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {['AM', 'PM'].map(p => (
                            <motion.button key={p} whileTap={{ scale: 0.9 }} onClick={() => setSelectedAmPm(p)}
                              className={`w-11 py-2.5 rounded-xl text-[11px] font-black transition-all ${selectedAmPm === p ? 'bg-[#FFCC02] text-gray-900 shadow-[0_3px_10px_rgba(255,204,2,0.2)]' : 'bg-[#FAFAF8] text-gray-400 border border-gray-100'}`}
                            >{p}</motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── STEP 3: WHERE ── */}
                <motion.div className="px-5 mb-4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, ...spring }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedGroupType ? 'bg-[#FFCC02]' : 'bg-gray-200'}`}><span className={`text-[10px] font-black ${selectedGroupType ? 'text-gray-900' : 'text-gray-400'}`}>3</span></div>
                    <p className={`text-[11px] font-bold ${selectedGroupType ? 'text-gray-700' : 'text-gray-400'}`}>Where to meet?</p>
                    <span className="text-[9px] text-gray-300 font-medium ml-auto">{selectedAreas.length}/3</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BKK_AREAS.map((a, i) => {
                      const on = selectedAreas.includes(a.label);
                      const atMax = selectedAreas.length >= 3 && !on;
                      return (
                        <motion.button key={a.label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: atMax ? 0.35 : 1, scale: 1 }} transition={{ delay: 0.34 + i * 0.015, ...spring }} whileTap={{ scale: 0.9 }} onClick={() => toggleArea(a.label)}
                          className={`rounded-full px-2.5 py-1.5 flex items-center gap-1 border-2 transition-all text-[10px] font-semibold ${on ? 'border-[#FFCC02] bg-[#FFCC02]/8 text-gray-800 shadow-[0_2px_8px_rgba(255,204,2,0.12)]' : 'bg-white border-gray-100 text-gray-500'}`}
                        >
                          <span className="text-xs">{a.emoji}</span>{a.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* ── REFINE: WHAT ── */}
                <motion.div className="px-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, ...spring }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 rounded-full bg-[#FFCC02]/30" />
                    <p className="text-[11px] font-bold text-gray-400">Refine your taste</p>
                    <span className="text-[9px] text-gray-300 font-medium ml-auto">{selectedVibes.length}/3</span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {FOOD_CATEGORIES.map((cat, ci) => (
                      <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-2.5">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{cat.title}</p>
                        <div className="flex gap-1.5">
                          {cat.items.map((v, i) => {
                            const on = selectedVibes.includes(v.label);
                            const atMax = selectedVibes.length >= 3 && !on;
                            return (
                              <motion.button key={v.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: atMax ? 0.35 : 1, scale: 1 }} transition={{ delay: 0.44 + ci * 0.04 + i * 0.02, ...spring }} whileTap={{ scale: 0.9 }}
                                onClick={() => toggleVibe(v.label)}
                                className={`flex-1 rounded-xl py-2 flex flex-col items-center gap-0.5 border-2 transition-all
                                  ${on ? 'border-[#FFCC02] bg-[#FFCC02]/8 shadow-[0_2px_8px_rgba(255,204,2,0.12)]' : 'border-gray-100 bg-[#FAFAF8]'}`}
                              >
                                <span className="text-sm">{v.emoji}</span>
                                <span className={`text-[9px] font-bold ${on ? 'text-gray-800' : 'text-gray-500'}`}>{v.label}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-2.5 mb-3">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Budget</p>
                    <div className="flex gap-1">
                      {BUDGETS.map((b) => {
                        const on = selectedBudget === b.id;
                        return (
                          <motion.button key={b.id} whileTap={{ scale: 0.95 }} onClick={() => setSelectedBudget(on ? null : b.id)}
                            className={`flex-1 rounded-xl py-2 flex flex-col items-center gap-0.5 transition-all ${on ? 'bg-[#FFCC02] shadow-[0_3px_10px_rgba(255,204,2,0.2)]' : 'bg-[#FAFAF8] border border-gray-100 hover:bg-gray-50'}`}
                          >
                            <span className={`text-[11px] font-black ${on ? 'text-gray-900' : 'text-gray-600'}`}>{b.label}</span>
                            <span className={`text-[7px] font-medium leading-none ${on ? 'text-gray-900/60' : 'text-gray-400'}`}>{b.sub}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <motion.button onClick={() => setShowMoreOptions(!showMoreOptions)} className="w-full flex items-center justify-between py-2" whileTap={{ scale: 0.99 }}>
                    <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3 h-3" />
                      {showMoreOptions ? 'Less' : 'Dietary needs'}
                      {selectedDietary.length > 0 && !showMoreOptions && (
                        <span className="text-[8px] bg-[#FFCC02]/10 text-amber-700 rounded-full px-1.5 py-0.5 font-bold border border-[#FFCC02]/20">{selectedDietary.length}</span>
                      )}
                    </span>
                    <motion.div animate={{ rotate: showMoreOptions ? 180 : 0 }} transition={spring}><ChevronDown className="w-3 h-3 text-gray-300" /></motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {showMoreOptions && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }} className="overflow-hidden">
                        <div className="flex flex-wrap gap-1.5 py-2">
                          {DIETARY.map((d, i) => {
                            const on = selectedDietary.includes(d.label);
                            return (
                              <motion.button key={d.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02, ...spring }} whileTap={{ scale: 0.9 }} onClick={() => toggleDietary(d.label)}
                                className={`rounded-full px-2.5 py-1.5 flex items-center gap-1 border-2 transition-all text-[10px] font-semibold ${on ? 'border-[#FFCC02] bg-[#FFCC02]/8 text-gray-800' : 'bg-[#FAFAF8] border-gray-100 text-gray-500'}`}
                              >
                                <span className="text-xs">{d.emoji}</span>{d.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="absolute bottom-[84px] left-0 right-0 px-5 pb-4 pt-3 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/95 to-transparent z-50">
                <AnimatePresence>
                  {canInvite && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}>
                      {selCount > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-1.5 mb-2 overflow-x-auto no-sb">
                          {selectedCalDate && <span className="flex-shrink-0 text-[9px] font-semibold text-amber-800 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2 py-0.5">📅 {dateLabel} · {timeLabel}</span>}
                          {selectedAreas.slice(0, 2).map(a => <span key={a} className="flex-shrink-0 text-[9px] font-semibold text-amber-800 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2 py-0.5">📍 {a}</span>)}
                          {selectedVibes.slice(0, 2).map(v => <span key={v} className="flex-shrink-0 text-[9px] font-semibold text-amber-800 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2 py-0.5">{v}</span>)}
                          {selectedBudget && <span className="flex-shrink-0 text-[9px] font-semibold text-amber-800 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2 py-0.5">{BUDGETS.find(b => b.id === selectedBudget)?.label}</span>}
                        </motion.div>
                      )}
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setScreen('invite')} className="w-full h-[54px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2.5 font-bold text-[15px] text-gray-900 shadow-[0_8px_28px_rgba(255,204,2,0.35)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                        <UserPlus className="w-5 h-5" />Invite Friends<ArrowRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {screen === 'invite' && (
            <motion.div key="invite" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }} className="flex-1 flex flex-col pt-14 px-6 pb-24">
              <div className="flex items-center justify-between mb-5">
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('setup')} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></motion.button>
                <div className="flex items-center gap-1.5 bg-[#FFCC02]/10 px-3 py-1.5 rounded-full border border-[#FFCC02]/20"><Share2 className="w-3.5 h-3.5 text-amber-600" /><span className="text-[11px] font-bold text-amber-700">Invite</span></div>
              </div>
              <ProgressBar step={1} total={5} />
              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div className="w-full" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, ...spring }}>
                  <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_16px_48px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="bg-gradient-to-br from-[#FFCC02] via-amber-400 to-[#E6B800] p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.08]">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="absolute rounded-full bg-white" style={{ width: 4 + Math.random() * 8, height: 4 + Math.random() * 8, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />))}</div>
                      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25, ...bouncy }} className="w-16 h-16 mx-auto mb-3 bg-gray-900/10 rounded-[20px] flex items-center justify-center backdrop-blur-sm border border-gray-900/10"><Share2 className="w-7 h-7 text-gray-900" /></motion.div>
                      <h2 className="text-gray-900 text-[18px] font-bold">Share the invite</h2>
                      <p className="text-gray-900/50 text-[12px] mt-1 font-medium">Friends join with this code</p>
                    </div>
                    <div className="p-5">
                      <div className="bg-[#FAFAF8] rounded-2xl p-4 flex items-center gap-3 mb-4 border border-gray-100">
                        <div className="flex-1 min-w-0"><div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Session code</div><div className="text-[20px] font-mono font-black text-gray-900 tracking-[0.2em]">A3F7B2D9</div></div>
                        <motion.button whileTap={{ scale: 0.88 }} onClick={handleCopy} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${copied ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'} border`}>
                          <AnimatePresence mode="wait">
                            {copied ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}><Check className="w-4 h-4 text-emerald-600" /></motion.div> : <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}><Copy className="w-4 h-4 text-gray-400" /></motion.div>}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                      <motion.button whileTap={{ scale: 0.97 }} className="w-full h-[48px] rounded-2xl bg-[#00B900] flex items-center justify-center gap-2 font-bold text-white text-[14px] shadow-[0_6px_20px_rgba(0,185,0,0.25)] mb-3"><MessageCircle className="w-4.5 h-4.5" />Share via LINE</motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={startWaiting} className="w-full h-[48px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-gray-900 text-[14px] shadow-[0_6px_20px_rgba(255,204,2,0.25)]">Go to Waiting Room<ArrowRight className="w-4 h-4" /></motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {screen === 'waiting' && (
            <motion.div key="waiting" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }} className="flex-1 flex flex-col items-center pt-14 px-6 pb-24">
              <div className="w-full flex items-center justify-between mb-5">
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('invite')} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></motion.button>
                <span className="text-[11px] font-mono font-bold text-gray-400 bg-gray-100 rounded-full px-3 py-1.5">A3F7B2D9</span>
              </div>
              <ProgressBar step={2} total={5} />
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <motion.div className="relative mb-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, ...spring }}>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-[24px] bg-[#FFCC02]/20 pulse-ring" />
                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#FFCC02] to-amber-500 flex items-center justify-center shadow-[0_10px_36px_rgba(255,204,2,0.3)] relative z-10"><Users className="w-10 h-10 text-gray-900" /></div>
                  </div>
                  <motion.div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center shadow-lg text-sm font-black text-white z-20 border-2 border-white" key={membersJoined} initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}>{membersJoined}</motion.div>
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...gentle }} className="text-[22px] font-['Playfair_Display'] font-bold text-gray-900 mb-1">{membersJoined >= 3 ? "Everyone's here!" : 'Waiting for friends'}</motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[13px] text-gray-400 mb-8">{membersJoined >= 3 ? 'Ready to start swiping' : `${membersJoined}/3 joined`}</motion.p>
                <div className="w-full max-w-xs space-y-3 mb-8">
                  {MEMBERS.slice(0, membersJoined).map((m, i) => (
                    <motion.div key={m.id} initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: i === 0 ? 0 : 0.15 * i + 0.3, ...spring }} className="flex items-center gap-3 bg-white rounded-[20px] p-3.5 border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                      <motion.div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-xl border-2 border-white shadow-sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i === 0 ? 0.1 : 0.15 * i + 0.4, ...bouncy }}>{m.avatar}</motion.div>
                      <div className="flex-1"><div className="text-[13px] font-bold text-gray-900">{m.name}</div><div className="text-[10px] text-gray-400 font-medium">{m.isHost ? 'Host · Created session' : 'Just joined'}</div></div>
                      {m.isHost && <div className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-sm"><Crown className="w-3 h-3 text-gray-900" /></div>}
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i === 0 ? 0.2 : 0.15 * i + 0.5, ...bouncy }} className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-emerald-600" /></motion.div>
                    </motion.div>
                  ))}
                  {membersJoined < 3 && (
                    <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} className="flex items-center gap-3 bg-gray-50/80 rounded-[20px] p-3.5 border border-dashed border-gray-200">
                      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center"><Clock className="w-4 h-4 text-gray-300" /></div>
                      <div className="flex-1"><div className="text-[13px] font-medium text-gray-300">Waiting for someone...</div></div>
                    </motion.div>
                  )}
                </div>
                <AnimatePresence>
                  {membersJoined >= 3 && (
                    <motion.button initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }} whileTap={{ scale: 0.97 }} onClick={startSwiping} className="w-full max-w-xs h-[52px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[15px] text-gray-900 shadow-[0_8px_28px_rgba(255,204,2,0.35)]"><Flame className="w-5 h-5" />Start Swiping!</motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {screen === 'swipe' && (
            <motion.div key="swipe" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col pt-12 pb-24">
              <div className="px-5 mb-3">
                <ProgressBar step={3} total={5} />
                <div className="flex items-center justify-between mt-3">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('waiting')} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"><ArrowLeft className="w-3.5 h-3.5 text-gray-700" /></motion.button>
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2">{MEMBERS.map(m => (<div key={m.id} className="w-7 h-7 rounded-full border-[2.5px] border-[#FAFAF8] bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-xs shadow-sm">{m.avatar}</div>))}</div>
                    <span className="text-[10px] font-bold text-gray-400">{MEMBERS.length} swiping</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2.5 py-1"><Flame className="w-3 h-3 text-orange-400" />{currentCard + 1}/{RESTAURANTS.length}</div>
                </div>
              </div>
              <div className="flex-1 px-5 relative">
                <AnimatePresence>
                  {RESTAURANTS.slice(currentCard, currentCard + 2).reverse().map((r, idx) => {
                    const isActive = idx === (Math.min(1, RESTAURANTS.length - currentCard - 1));
                    return <SwipeCard key={r.id} restaurant={r} active={isActive} behind={!isActive} onSwipe={handleSwipe} />;
                  })}
                </AnimatePresence>
              </div>
              <div className="px-5 pt-3 flex items-center justify-center gap-5">
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleSwipe('left')} className="w-[52px] h-[52px] rounded-full bg-white border-2 border-red-200/60 flex items-center justify-center shadow-[0_6px_20px_rgba(239,68,68,0.1)]"><X className="w-5 h-5 text-red-400" /></motion.button>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleSwipe('up')} className="w-[44px] h-[44px] rounded-full bg-white border-2 border-[#FFCC02]/60 flex items-center justify-center shadow-[0_6px_20px_rgba(255,204,2,0.15)]"><Star className="w-5 h-5 text-[#FFCC02] fill-[#FFCC02]" /></motion.button>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleSwipe('right')} className="w-[52px] h-[52px] rounded-full bg-white border-2 border-emerald-200/60 flex items-center justify-center shadow-[0_6px_20px_rgba(16,185,129,0.1)]"><Heart className="w-5 h-5 text-emerald-500" /></motion.button>
              </div>
            </motion.div>
          )}

          {screen === 'match' && (
            <motion.div key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center pt-16 px-6 pb-24 relative overflow-hidden overflow-y-auto no-sb">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">{Array.from({ length: 40 }).map((_, i) => (<div key={i} className="confetti absolute" style={{ left: `${Math.random() * 100}%`, top: -12, width: Math.random() > 0.5 ? 8 : 5, height: Math.random() > 0.5 ? 8 : 14, backgroundColor: ['#FFCC02', '#FFD700', '#FF385C', '#00A699', '#FF6B6B', '#4ECDC4', '#E6B800'][i % 7], borderRadius: Math.random() > 0.5 ? '50%' : '2px', animationDelay: `${Math.random() * 2}s`, animationDuration: `${2.5 + Math.random() * 1.5}s` }} />))}</div>
              <motion.div initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, ...bouncy }} className="mb-4">
                <div className="w-[90px] h-[90px] rounded-[26px] bg-gradient-to-br from-[#FFCC02] to-amber-400 flex items-center justify-center shadow-[0_16px_48px_rgba(255,204,2,0.4)] relative">
                  <motion.div animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}><Trophy className="w-11 h-11 text-gray-900" /></motion.div>
                  <motion.div className="absolute -top-2 -right-2" animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Sparkles className="w-5 h-5 text-[#FFCC02]" /></motion.div>
                </div>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...gentle }} className="text-[26px] font-['Playfair_Display'] font-bold text-gray-900 mb-1 text-center">It's a Match!</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-[13px] text-gray-400 mb-5 font-medium">Everyone voted for this one 🎉</motion.p>
              <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, ...spring }} className="w-full bg-white rounded-[24px] border border-gray-100 shadow-[0_16px_48px_rgba(0,0,0,0.08)] overflow-hidden mb-5">
                <div className="relative h-[150px]">
                  <img src={RESTAURANTS[2].image} alt={RESTAURANTS[2].name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4"><h3 className="text-white text-[18px] font-bold drop-shadow-lg">{RESTAURANTS[2].name}</h3><p className="text-white/80 text-[12px] flex items-center gap-1.5 mt-0.5">{RESTAURANTS[2].category}<span className="text-white/40">·</span><span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-current" /> {RESTAURANTS[2].rating}</span></p></div>
                  <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.7, ...bouncy }} className="absolute top-3 right-3 bg-[#FFCC02] text-gray-900 text-[10px] font-black rounded-full px-3 py-1.5 shadow-[0_4px_12px_rgba(255,204,2,0.4)] flex items-center gap-1"><Heart className="w-3 h-3 fill-current" /> Full Match</motion.div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Voted by</p>
                    <div className="flex -space-x-2">{MEMBERS.map((m, i) => (<motion.div key={m.id} initial={{ scale: 0, x: -8 }} animate={{ scale: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.08, ...bouncy }} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 border-[2.5px] border-white flex items-center justify-center text-sm shadow-sm">{m.avatar}</motion.div>))}</div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="w-full flex gap-2.5">
                <motion.button whileTap={{ scale: 0.94 }} className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"><div className="w-8 h-8 rounded-full bg-[#FFCC02]/10 flex items-center justify-center"><Eye className="w-4 h-4 text-amber-600" /></div><span className="text-[10px] font-semibold text-gray-600">View Restaurant</span></motion.button>
                <motion.button whileTap={{ scale: 0.94 }} onClick={() => setScreen('topPicks')} className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"><div className="w-8 h-8 rounded-full bg-[#FFCC02]/10 flex items-center justify-center"><ListOrdered className="w-4 h-4 text-[#FFCC02]" /></div><span className="text-[10px] font-semibold text-gray-600">Top Picks</span></motion.button>
                <motion.button whileTap={{ scale: 0.94 }} onClick={startSwiping} className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"><div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><Flame className="w-4 h-4 text-orange-400" /></div><span className="text-[10px] font-semibold text-gray-600">Keep Swiping</span></motion.button>
              </motion.div>
              <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} whileTap={{ scale: 0.97 }} onClick={() => setScreen('summary')} className="w-full mt-4 h-[48px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[14px] text-gray-900 shadow-[0_6px_20px_rgba(255,204,2,0.25)]"><BarChart3 className="w-4 h-4" />Wrap It Up</motion.button>
            </motion.div>
          )}

          {screen === 'topPicks' && (
            <motion.div key="topPicks" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }} className="flex-1 overflow-y-auto no-sb pt-14 px-6 pb-28">
              <div className="flex items-center justify-between mb-5">
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('match')} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></motion.button>
                <div className="flex items-center gap-1.5 bg-[#FFCC02]/10 px-3 py-1.5 rounded-full border border-[#FFCC02]/20"><Crown className="w-3.5 h-3.5 text-[#FFCC02]" /><span className="text-[11px] font-bold text-amber-700">Top Picks</span></div>
              </div>
              <ProgressBar step={4} total={5} />
              <motion.div className="mt-5 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...gentle }}><h1 className="text-[24px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-1">Group's top picks</h1><p className="text-[13px] text-gray-400 font-medium">Ranked by group votes</p></motion.div>
              <div className="space-y-3">
                {TOP_PICKS_DATA.map((pick, i) => {
                  const rankIcons = [Crown, Medal, Award];
                  const rankColors = ['text-[#FFCC02]', 'text-gray-400', 'text-amber-600'];
                  const rankBgs = ['bg-[#FFCC02]/10 border-[#FFCC02]/30', 'bg-gray-100 border-gray-200', 'bg-amber-50 border-amber-200'];
                  const RankIcon = rankIcons[i] || Star;
                  return (
                    <motion.div key={pick.id} initial={{ opacity: 0, x: -20, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: 0.15 + i * 0.08, ...spring }} className={`bg-white rounded-[22px] overflow-hidden border shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${i === 0 ? 'border-[#FFCC02]/30 ring-1 ring-[#FFCC02]/20' : 'border-gray-100'}`}>
                      <div className="flex gap-3 p-3.5">
                        <div className="relative flex-shrink-0">
                          <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden"><img src={pick.image} alt={pick.name} className="w-full h-full object-cover" /></div>
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.08, ...bouncy }} className={`absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-md ${i < 3 ? rankBgs[i] : 'bg-gray-50 border-gray-200'}`}>{i < 3 ? <RankIcon className={`w-3.5 h-3.5 ${rankColors[i]}`} /> : <span className="text-[10px] font-bold text-gray-400">#{i + 1}</span>}</motion.div>
                          {pick.fullMatch && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.08, ...bouncy }} className="absolute -bottom-1 -right-1 bg-[#FFCC02] rounded-full px-1.5 py-0.5 text-[7px] font-black text-gray-900 shadow-sm border border-white">MATCH</motion.div>}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <h3 className="text-[14px] font-bold text-gray-900 truncate mb-0.5">{pick.name}</h3>
                          <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">{pick.category}<span className="text-gray-300">·</span><Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" /><span className="font-semibold text-gray-600">{pick.rating}</span><span className="text-gray-300">·</span>{'฿'.repeat(pick.price)}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-1.5">{pick.voters.map(vId => { const m = MEMBERS.find(mm => mm.id === vId); return m ? <div key={m.id} className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 border-[2px] border-white flex items-center justify-center text-[10px] shadow-sm">{m.avatar}</div> : null; })}</div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pick.votes === 3 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-gray-500 bg-gray-50 border border-gray-100'}`}>{pick.votes}/{MEMBERS.length} votes</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileTap={{ scale: 0.97 }} onClick={() => setScreen('summary')} className="w-full mt-5 h-[52px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[15px] text-gray-900 shadow-[0_8px_28px_rgba(255,204,2,0.35)]"><BarChart3 className="w-5 h-5" />Wrap It Up</motion.button>
            </motion.div>
          )}

          {screen === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex-1 overflow-y-auto no-sb pb-28">

              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFCC02] via-[#E6B800] to-[#FFCC02]" />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.06) 0%, transparent 40%)' }} />
                <div className="absolute inset-0 opacity-[0.04]">{Array.from({ length: 30 }).map((_, i) => (<div key={i} className="absolute rounded-full bg-gray-900" style={{ width: 2 + Math.random() * 6, height: 2 + Math.random() * 6, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />))}</div>

                <div className="relative pt-16 pb-6 px-6">
                  <div className="flex items-center justify-between mb-5">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('topPicks')} className="w-10 h-10 rounded-full bg-gray-900/10 backdrop-blur-sm border border-gray-900/10 flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-gray-900" /></motion.button>
                    <span className="text-[11px] font-bold text-gray-900/50 bg-gray-900/8 rounded-full px-3 py-1.5 backdrop-blur-sm border border-gray-900/8">Session #3</span>
                  </div>

                  <div className="text-center mb-5">
                    <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, ...bouncy }} className="w-[68px] h-[68px] mx-auto mb-3 rounded-[20px] bg-gray-900/10 backdrop-blur-sm flex items-center justify-center border border-gray-900/10">
                      <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}><Trophy className="w-8 h-8 text-gray-900" /></motion.div>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, ...gentle }} className="text-[28px] font-['Playfair_Display'] font-bold text-gray-900 mb-0.5">Feast wrapped!</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-[12px] text-gray-900/50 font-medium">Your group's taste story</motion.p>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, ...spring }} className="bg-gray-900/8 backdrop-blur-md rounded-[20px] border border-gray-900/8 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-[16px] overflow-hidden border-2 border-gray-900/15 shadow-lg flex-shrink-0"><img src={RESTAURANTS[2].image} alt="" className="w-full h-full object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[8px] font-bold text-gray-900/40 uppercase tracking-widest mb-0.5">Winner</div>
                        <h3 className="text-[16px] font-bold text-gray-900 truncate">{RESTAURANTS[2].name}</h3>
                        <p className="text-[11px] text-gray-900/50 flex items-center gap-1">{RESTAURANTS[2].category} · <Star className="w-3 h-3 fill-current text-gray-900" /> {RESTAURANTS[2].rating}</p>
                      </div>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)]"><Heart className="w-5 h-5 text-[#FFCC02] fill-current" /></div>
                        <span className="text-[8px] text-gray-900/40 font-bold mt-1">3/3</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="px-5 -mt-1 relative z-10">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, ...spring }} className="bg-white rounded-[22px] border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-5 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer-gold pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-[#FFCC02]/12 flex items-center justify-center"><Zap className="w-4.5 h-4.5 text-[#FFCC02]" /></div>
                      <div className="flex-1"><span className="text-[13px] font-bold text-gray-900">Group Chemistry</span><div className="text-[9px] text-gray-400 font-medium">How aligned your tastes are</div></div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.75, ...bouncy }}>
                        <div className="w-[52px] h-[52px] rounded-full border-[3px] border-[#FFCC02] flex items-center justify-center bg-[#FFCC02]/8 relative">
                          <span className="text-[17px] font-black text-gray-900">85</span>
                          <span className="text-[7px] font-bold text-[#FFCC02] absolute -bottom-0.5">%</span>
                        </div>
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ label: 'Swipes', value: '18', icon: '👆' }, { label: 'Likes', value: '12', icon: '❤️' }, { label: 'Matches', value: '1', icon: '🎯' }].map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.05, ...spring }} className="bg-[#FAFAF8] rounded-2xl p-2.5 text-center border border-gray-100/80">
                          <span className="text-sm block mb-0.5">{stat.icon}</span>
                          <div className="text-[16px] font-bold text-gray-900">{stat.value}</div>
                          <div className="text-[7px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, ...gentle }} className="mb-4">
                  <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-[#FFCC02]" /><span className="text-[12px] font-bold text-gray-900">Member Vibes</span></div>
                  <div className="flex gap-2.5 overflow-x-auto no-sb pb-1">
                    {MEMBER_STATS.map((ms, i) => (
                      <motion.div key={ms.member.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.75 + i * 0.06, ...spring }} className="flex-shrink-0 w-[130px] bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-3.5 text-center">
                        <div className="w-11 h-11 mx-auto rounded-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-lg border-2 border-white shadow-sm mb-2">{ms.member.avatar}</div>
                        <div className="text-[12px] font-bold text-gray-900 mb-0.5 flex items-center justify-center gap-1">{ms.member.name}{ms.member.isHost && <Crown className="w-3 h-3 text-[#FFCC02]" />}</div>
                        <div className="text-[9px] text-gray-400 mb-2.5">Loves {ms.emoji} {ms.favCuisine}</div>
                        <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5"><motion.div initial={{ width: 0 }} animate={{ width: `${ms.agreePct}%` }} transition={{ delay: 0.9 + i * 0.08, duration: 0.8, ease: [0.32, 0.72, 0, 1] }} className="h-full bg-gradient-to-r from-[#FFCC02] to-amber-400 rounded-full" /></div>
                        <div className="text-[9px] font-bold text-amber-600">{ms.agreePct}% aligned</div>
                        <div className="flex justify-center gap-2 mt-2.5">
                          <div className="text-center"><div className="text-[13px] font-bold text-emerald-500">{ms.likes}</div><div className="text-[7px] font-bold text-gray-400 uppercase">YUM</div></div>
                          <div className="w-px bg-gray-100" />
                          <div className="text-center"><div className="text-[13px] font-bold text-red-400">{ms.dislikes}</div><div className="text-[7px] font-bold text-gray-400 uppercase">NAH</div></div>
                          <div className="w-px bg-gray-100" />
                          <div className="text-center"><div className="text-[13px] font-bold text-amber-500">{ms.superLikes}</div><div className="text-[7px] font-bold text-gray-400 uppercase">⭐</div></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, ...gentle }} className="bg-white rounded-[22px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2.5"><TrendingUp className="w-3.5 h-3.5 text-[#FFCC02]" /><span className="text-[11px] font-bold text-gray-900">All-Time Together</span><span className="ml-auto text-[9px] font-semibold text-amber-700 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2 py-0.5">3 sessions</span></div>
                  <div className="flex gap-4">
                    {[{ label: 'Matches', value: '7', emoji: '🎯' }, { label: 'Swipes', value: '54', emoji: '👆' }, { label: 'Go-to', value: 'Thai 🍜', emoji: '' }].map(stat => (
                      <div key={stat.label} className="text-center">{stat.emoji && <span className="text-sm">{stat.emoji}</span>}<div className="text-[14px] font-bold text-gray-900">{stat.value}</div><div className="text-[7px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div></div>
                    ))}
                  </div>
                </motion.div>

                <div className="space-y-2.5 pb-2">
                  <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }} whileTap={{ scale: 0.97 }} className="w-full h-[50px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[15px] text-gray-900 shadow-[0_8px_24px_rgba(255,204,2,0.3)]"><Share2 className="w-4.5 h-4.5" />Share Results</motion.button>
                  <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} whileTap={{ scale: 0.97 }} onClick={resetFlow} className="w-full h-[48px] rounded-2xl bg-white border border-gray-200 flex items-center justify-center gap-2 font-bold text-[14px] text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" />New Session</motion.button>
                </div>
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
            <motion.div key={n.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05, ...spring }} className={`flex flex-col items-center gap-0.5 ${n.active ? 'text-gray-900' : 'text-gray-400'}`} onClick={n.label === 'Home' ? resetFlow : undefined} style={{ cursor: n.label === 'Home' ? 'pointer' : 'default' }}>
              <n.icon className={`w-5 h-5 ${n.active ? 'text-gray-900' : ''}`} />
              <span className={`text-[10px] font-semibold ${n.active ? 'font-bold' : ''}`}>{n.label}</span>
              {n.active && <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-gray-900 mt-0.5" transition={spring} />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
