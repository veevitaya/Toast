import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star,
  Sparkles, ArrowRight, ArrowLeft, ChevronDown, RotateCcw, Zap,
  Check, X, Flame, UtensilsCrossed, Trophy, Crown, Eye, ListOrdered,
  BarChart3, Share2, Medal, Award, Calendar, Clock
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };
const gentle = { type: "spring" as const, stiffness: 200, damping: 28 };
const snappy = { type: "spring" as const, stiffness: 500, damping: 32 };

type Screen = 'choose' | 'quiz' | 'battle' | 'topPicks' | 'summary';
type BattleSide = 'left' | 'right' | null;

interface MenuItem {
  id: number;
  name: string;
  type: string;
  tags: string[];
  restaurantCount: number;
  imageUrl: string;
}

const ALL_MENUS: MenuItem[] = [
  { id: 1, name: 'Pad Thai', type: 'Thai', tags: ['Noodles', 'Spicy', 'Shrimp'], restaurantCount: 9, imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Korean BBQ', type: 'Korean', tags: ['Grilled', 'Meat', 'Group'], restaurantCount: 10, imageUrl: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=600&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Tonkotsu Ramen', type: 'Japanese', tags: ['Noodles', 'Pork', 'Rich'], restaurantCount: 7, imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Green Curry', type: 'Thai', tags: ['Spicy', 'Coconut', 'Rice'], restaurantCount: 12, imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Sushi Omakase', type: 'Japanese', tags: ['Fresh', 'Raw', 'Premium'], restaurantCount: 5, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Smash Burger', type: 'Western', tags: ['Burger', 'Cheesy', 'Fries'], restaurantCount: 11, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60' },
  { id: 8, name: 'Som Tum', type: 'Thai', tags: ['Salad', 'Spicy', 'Peanuts'], restaurantCount: 15, imageUrl: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&auto=format&fit=crop&q=60' },
  { id: 9, name: 'Dim Sum', type: 'Chinese', tags: ['Dumpling', 'Tea', 'Brunch'], restaurantCount: 6, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=60' },
  { id: 12, name: 'Tom Yum Goong', type: 'Thai', tags: ['Soup', 'Spicy', 'Shrimp'], restaurantCount: 14, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&auto=format&fit=crop&q=60' },
  { id: 13, name: 'Khao Soi', type: 'Thai', tags: ['Noodles', 'Coconut', 'Spicy'], restaurantCount: 6, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=60' },
  { id: 18, name: 'Pad Kra Pao', type: 'Thai', tags: ['Spicy', 'Fried egg', 'Basil'], restaurantCount: 20, imageUrl: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60' },
  { id: 30, name: 'Wagyu Steak', type: 'Japanese', tags: ['Steak', 'Premium', 'Grilled'], restaurantCount: 4, imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=60' },
];

const CUISINES = [
  { emoji: '🍜', label: 'Thai' },
  { emoji: '🍣', label: 'Japanese' },
  { emoji: '🥟', label: 'Chinese' },
  { emoji: '🍕', label: 'Italian' },
  { emoji: '🌮', label: 'Mexican' },
  { emoji: '🍛', label: 'Indian' },
  { emoji: '🥩', label: 'Western' },
  { emoji: '🍤', label: 'Seafood' },
  { emoji: '🥗', label: 'Healthy' },
];

const SETTINGS = [
  { emoji: '🍢', label: 'Street food', desc: 'Local vibes' },
  { emoji: '🍽️', label: 'Restaurant', desc: 'Sit-down meal' },
  { emoji: '🚇', label: 'Near BTS', desc: 'Easy access' },
  { emoji: '🌃', label: 'Late night', desc: 'After hours' },
  { emoji: '🌊', label: 'By the river', desc: 'Scenic views' },
  { emoji: '🏙️', label: 'Rooftop', desc: 'Sky-high dining' },
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

const TOP_PICKS = [
  { ...ALL_MENUS[0], score: 97, rounds: 5, wins: 5 },
  { ...ALL_MENUS[4], score: 84, rounds: 4, wins: 3 },
  { ...ALL_MENUS[10], score: 72, rounds: 3, wins: 2 },
  { ...ALL_MENUS[2], score: 60, rounds: 4, wins: 2 },
];

function ToastMascot({ pointDirection }: { pointDirection: 'left' | 'right' | 'center' }) {
  const xShift = pointDirection === 'left' ? -20 : pointDirection === 'right' ? 20 : 0;
  const rot = pointDirection === 'left' ? -12 : pointDirection === 'right' ? 12 : 0;

  return (
    <motion.div
      className="flex flex-col items-center mb-1 relative"
      animate={{ x: xShift }}
      transition={{ type: 'spring', damping: 14, stiffness: 140 }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.img
          src="/images/toast_mascot.png"
          alt="Toast mascot"
          className="h-20 w-auto object-contain drop-shadow-lg"
          animate={{ rotate: rot }}
          transition={pointDirection === 'center'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', damping: 12, stiffness: 120 }
          }
        />
        <motion.div
          className="absolute -top-1.5 -right-2.5"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-[#FFCC02]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BattleCard({ item, side, isSelected, isDismissed, isReplacing, isCurrent, onSelect, round }: {
  item: MenuItem;
  side: 'left' | 'right';
  isSelected: boolean;
  isDismissed: boolean;
  isReplacing: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  round: number;
}) {
  return (
    <div className="flex-1 min-w-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${item.id}-${round}`}
          initial={isReplacing ? { y: 50, opacity: 0, scale: 0.85, rotateY: side === 'left' ? -15 : 15 } : false}
          animate={{
            y: 0,
            opacity: isDismissed && !isReplacing ? 0.35 : 1,
            scale: isSelected ? 1.03 : isDismissed && !isReplacing ? 0.94 : 1,
            rotateY: 0,
          }}
          exit={{ y: -30, opacity: 0, scale: 0.85, rotateY: side === 'left' ? 15 : -15 }}
          transition={bouncy}
          onClick={onSelect}
          className="cursor-pointer relative group"
          style={{ perspective: 600 }}
        >
          <div
            className={`bg-white rounded-[22px] overflow-hidden transition-all duration-300 relative ${
              isSelected || isCurrent ? 'ring-[2.5px] ring-[#FFCC02]' : 'ring-1 ring-gray-100'
            }`}
            style={{
              boxShadow: isSelected || isCurrent
                ? '0 16px 40px -8px rgba(255,204,2,0.3), 0 4px 12px rgba(0,0,0,0.04)'
                : '0 6px 24px -4px rgba(0,0,0,0.06)',
            }}
          >
            <div className="w-full aspect-[4/3] overflow-hidden relative">
              <motion.img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#FFCC02]/25 flex items-center justify-center backdrop-blur-[1px]"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: [0, 1.4, 1], rotate: [0, 15, 0] }}
                      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-14 h-14 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_8px_24px_rgba(255,204,2,0.5)]"
                    >
                      <Check className="w-6 h-6 text-gray-900" strokeWidth={3} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isDismissed && !isReplacing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-900/40 flex items-center justify-center backdrop-blur-[2px]"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={bouncy}
                    >
                      <X className="w-8 h-8 text-white drop-shadow-md" strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isCurrent && !isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={bouncy}
                  className="absolute top-2.5 right-2.5 z-10"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_4px_12px_rgba(255,204,2,0.4)]">
                    <Crown className="w-3.5 h-3.5 text-gray-900" />
                  </div>
                </motion.div>
              )}

              <motion.div
                className="absolute bottom-2 left-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ...spring }}
              >
                <span className="text-[9px] font-bold text-white bg-black/30 backdrop-blur-md rounded-full px-2 py-0.5">
                  {item.type}
                </span>
              </motion.div>
            </div>

            <div className="p-3.5">
              <h3 className="font-bold text-[14px] text-gray-900 mb-0.5 truncate leading-tight">{item.name}</h3>
              <div className="flex flex-wrap gap-1 mb-2 overflow-hidden max-h-[1.4rem]">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[9px] bg-gray-100 rounded-full px-2 py-0.5 font-medium text-gray-500">{tag}</span>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {item.restaurantCount} places
              </p>
            </div>
          </div>

          <motion.div
            className="absolute -bottom-1 left-2 right-2 h-[3px] rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isSelected || isCurrent ? 1 : 0, backgroundColor: isSelected || isCurrent ? '#FFCC02' : '#E5E7EB' }}
            transition={spring}
            style={{ transformOrigin: side === 'left' ? 'left' : 'right' }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SoloJourney() {
  const [screen, setScreen] = useState<Screen>('choose');
  const [quizStep, setQuizStep] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('Now');
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [soloHover, setSoloHover] = useState(false);
  const [groupHover, setGroupHover] = useState(false);

  const [leftOption, setLeftOption] = useState<MenuItem>(ALL_MENUS[0]);
  const [rightOption, setRightOption] = useState<MenuItem>(ALL_MENUS[1]);
  const [selectedSide, setSelectedSide] = useState<BattleSide>(null);
  const [replacingSide, setReplacingSide] = useState<BattleSide>(null);
  const [currentChoice, setCurrentChoice] = useState<MenuItem | null>(null);
  const [animating, setAnimating] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [round, setRound] = useState(0);
  const [battleRound, setBattleRound] = useState(0);

  const TOTAL_QUIZ_STEPS = 5;

  const toggleCuisine = useCallback((l: string) => {
    setSelectedCuisines(p => p.includes(l) ? p.filter(c => c !== l) : [...p, l]);
  }, []);

  const toggleSetting = useCallback((l: string) => {
    setSelectedSettings(p => p.includes(l) ? p.filter(s => s !== l) : [...p, l]);
  }, []);

  const toggleArea = useCallback((l: string) => {
    setSelectedAreas(p => p.includes(l) ? p.filter(a => a !== l) : p.length < 3 ? [...p, l] : p);
  }, []);

  const toggleDietary = useCallback((l: string) => {
    setSelectedDietary(p => p.includes(l) ? p.filter(d => d !== l) : [...p, l]);
  }, []);

  const startBattle = useCallback(() => {
    const shuffled = [...ALL_MENUS].sort(() => Math.random() - 0.5);
    setLeftOption(shuffled[0]);
    setRightOption(shuffled[1]);
    setUsedIds(new Set([shuffled[0].id, shuffled[1].id]));
    setCurrentChoice(null);
    setSelectedSide(null);
    setReplacingSide(null);
    setAnimating(false);
    setRound(0);
    setBattleRound(0);
    setScreen('battle');
  }, []);

  const goQuiz = useCallback(() => {
    setScreen('quiz');
    setQuizStep(0);
    setSelectedCuisines([]);
    setSelectedSettings([]);
    setSelectedBudget(null);
    setSelectedAreas([]);
    setSelectedDietary([]);
    setSelectedTime('Now');
    setSelectedDate('Today');
  }, []);

  const reset = useCallback(() => {
    setScreen('choose');
  }, []);

  const getNextMenu = useCallback(() => {
    const currentIds = new Set([leftOption.id, rightOption.id]);
    const remaining = ALL_MENUS.filter(m => !usedIds.has(m.id) && !currentIds.has(m.id));
    if (remaining.length === 0) {
      const allOther = ALL_MENUS.filter(m => !currentIds.has(m.id));
      return allOther[Math.floor(Math.random() * allOther.length)] || ALL_MENUS[0];
    }
    return remaining[Math.floor(Math.random() * remaining.length)];
  }, [leftOption, rightOption, usedIds]);

  const handleSelect = useCallback((side: 'left' | 'right') => {
    if (animating) return;
    setAnimating(true);
    setSelectedSide(side);

    const chosen = side === 'left' ? leftOption : rightOption;
    setCurrentChoice(chosen);
    setBattleRound(r => r + 1);

    const otherSide = side === 'left' ? 'right' : 'left';

    setTimeout(() => {
      setReplacingSide(otherSide);
    }, 500);

    setTimeout(() => {
      const nextMenu = getNextMenu();
      setUsedIds(prev => new Set([...prev, nextMenu.id]));

      if (otherSide === 'left') {
        setLeftOption(nextMenu);
      } else {
        setRightOption(nextMenu);
      }

      setTimeout(() => {
        setSelectedSide(null);
        setReplacingSide(null);
        setAnimating(false);
        setRound(r => r + 1);
      }, 400);
    }, 800);
  }, [animating, leftOption, rightOption, getNextMenu]);

  const getMascotDirection = (): 'left' | 'right' | 'center' => {
    if (!selectedSide) return 'center';
    return selectedSide;
  };

  const quizHeadings = [
    { title: "What are you\ncraving?", sub: 'Pick as many as you like' },
    { title: "Set the\nscene", sub: "Where sounds good tonight?" },
    { title: "What's your\nbudget?", sub: "We'll find the sweet spot" },
    { title: "Where in\nBangkok?", sub: "Pick up to 3 areas" },
    { title: "Almost ready!", sub: "Any dietary needs & when?" },
  ];

  const canProceed =
    quizStep === 0 ? selectedCuisines.length > 0 :
    quizStep === 1 ? selectedSettings.length > 0 :
    quizStep === 2 ? selectedBudget !== null :
    quizStep === 3 ? true :
    true;

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap');
        .no-sb::-webkit-scrollbar{display:none} .no-sb{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-6px) rotate(-2deg)}75%{transform:translateY(-3px) rotate(2deg)}} .float{animation:float 4s ease-in-out infinite}
        .glass{background:rgba(255,255,255,0.88);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%)}
        @keyframes crown-bounce{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-3px) rotate(5deg)}} .crown-bounce{animation:crown-bounce 1.5s ease-in-out infinite}
      `}} />

      <div className="relative w-[390px] h-[844px] bg-[#FAFAF8] rounded-[44px] border-[8px] border-gray-900 overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-[100] pointer-events-none">
          <div className="w-[126px] h-[32px] bg-black rounded-b-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {screen === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
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
                <div className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Wed · 7:30 PM · ☀️ 32°C</div>
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
                  <motion.button
                    initial={{ opacity: 0, y: 30, rotate: -3 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.35, ...bouncy }}
                    whileHover={{ y: -6, rotate: -1, boxShadow: '0 16px 40px rgba(255,204,2,0.18)' }}
                    whileTap={{ scale: 0.94, rotate: 0 }}
                    onHoverStart={() => setSoloHover(true)}
                    onHoverEnd={() => setSoloHover(false)}
                    onClick={goQuiz}
                    className="flex-1 bg-white rounded-[22px] p-5 border-2 border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden cursor-pointer transition-colors hover:border-[#FFCC02]/50"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#FFCC02]/8 via-transparent to-[#FFB800]/5"
                      animate={{ opacity: soloHover ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative">
                      <motion.div
                        className="w-[90px] h-[90px] rounded-[24px] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden"
                        animate={soloHover ? { scale: [1, 1.08, 1.04], rotate: [0, 3, 0] } : { scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img src="/images/toast_char.png" alt="Solo" className="w-[75px] h-[75px] object-contain float" />
                      </motion.div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-md"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7, ...bouncy }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gray-900" />
                      </motion.div>
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-gray-900 text-[16px]">Solo</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">AI picks just for you</div>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFCC02] to-[#FFB800]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: soloHover ? 1 : 0 }}
                      transition={spring}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 30, rotate: 3 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.45, ...bouncy }}
                    whileHover={{ y: -6, rotate: 1 }}
                    whileTap={{ scale: 0.94, rotate: 0 }}
                    onHoverStart={() => setGroupHover(true)}
                    onHoverEnd={() => setGroupHover(false)}
                    className="flex-1 bg-white rounded-[22px] p-5 border-2 border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden cursor-pointer transition-colors hover:border-violet-200"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-pink-50/30"
                      animate={{ opacity: groupHover ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative">
                      <motion.div
                        className="w-[90px] h-[90px] rounded-[24px] bg-gradient-to-br from-violet-50 to-pink-50 flex items-center justify-center overflow-hidden"
                        animate={groupHover ? { scale: [1, 1.08, 1.04] } : { scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img src="/images/toast_waffle.jpeg" alt="Group" className="w-[80px] h-[80px] object-contain" style={{ mixBlendMode: 'multiply' }} />
                      </motion.div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center shadow-md"
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8, ...bouncy }}
                      >
                        <Heart className="w-3 h-3 text-white fill-white" />
                      </motion.div>
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-gray-900 text-[16px]">Group</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Vote with friends</div>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-pink-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: groupHover ? 1 : 0 }}
                      transition={spring}
                      style={{ transformOrigin: 'right' }}
                    />
                  </motion.button>
                </div>
              </div>

              <motion.div
                className="px-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, ...gentle }}
              >
                <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <div className="h-1 bg-gradient-to-r from-[#FFCC02] to-amber-300" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFCC02]" />
                      <span className="text-[12px] font-bold text-gray-900">Toast's pick for you</span>
                      <motion.span
                        className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, ...bouncy }}
                      >
                        97% match
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0"
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        transition={bouncy}
                      >
                        <img src="https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=200&auto=format&fit=crop&q=60" alt="" className="w-full h-full object-cover" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-bold text-gray-900">Jay Fai</span>
                        <p className="text-[11px] text-gray-500">Thai · Old Town · <Star className="w-3 h-3 inline text-[#FFCC02] fill-[#FFCC02] -mt-0.5" /> 4.9</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9, rotate: -5 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-9 h-9 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_4px_12px_rgba(255,204,2,0.3)]"
                      >
                        <ArrowRight className="w-4 h-4 text-gray-900" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="px-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, ...gentle }}
              >
                <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3">Pick a vibe</h2>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { label: 'Popular', icon: '🔥' },
                    { label: 'Spicy', icon: '🌶️' },
                    { label: 'Healthy', icon: '🥗' },
                    { label: 'Budget', icon: '💰' },
                    { label: 'Date Night', icon: '💕' },
                    { label: 'Outdoor', icon: '⛱️' },
                    { label: 'Drinks', icon: '🍸' },
                    { label: 'More', icon: '✨' },
                  ].map((v, i) => (
                    <motion.div
                      key={v.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.04, ...spring }}
                      whileHover={{ y: -4, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
                      whileTap={{ scale: 0.92 }}
                      className="bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 cursor-pointer"
                    >
                      <span className="text-xl">{v.icon}</span>
                      <span className="text-[10px] font-semibold text-gray-600">{v.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {screen === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={gentle}
              className="flex-1 flex flex-col pb-24"
            >
              <div className="pt-14 px-6 pb-2">
                <div className="flex items-center justify-between mb-5">
                  <motion.button
                    whileTap={{ scale: 0.85, rotate: -10 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => quizStep > 0 ? setQuizStep(s => s - 1) : reset()}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-700" />
                  </motion.button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: TOTAL_QUIZ_STEPS }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: i === quizStep ? 28 : 8,
                          backgroundColor: i <= quizStep ? '#FFCC02' : '#E5E7EB',
                          borderRadius: 4,
                        }}
                        transition={spring}
                        className="h-2"
                      />
                    ))}
                  </div>

                  <motion.div
                    className="text-[11px] font-bold text-gray-400"
                    key={quizStep}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {quizStep + 1}/{TOTAL_QUIZ_STEPS}
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={quizStep}
                    initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="text-[26px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-1">
                      {quizHeadings[quizStep].title}
                    </h1>
                    <p className="text-[13px] text-gray-400 font-medium">
                      {quizHeadings[quizStep].sub}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex-1 overflow-y-auto no-sb px-6 pt-4">
                <AnimatePresence mode="wait">
                  {quizStep === 0 && (
                    <motion.div
                      key="c"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -40 }}
                      className="grid grid-cols-3 gap-3"
                    >
                      {CUISINES.map((c, i) => {
                        const on = selectedCuisines.includes(c.label);
                        return (
                          <motion.button
                            key={c.label}
                            initial={{ opacity: 0, scale: 0.7, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.045, ...bouncy }}
                            whileTap={{ scale: 0.88, rotate: on ? -3 : 3 }}
                            onClick={() => toggleCuisine(c.label)}
                            className={`relative rounded-[20px] p-4 flex flex-col items-center gap-2 border-2 transition-all duration-200 ${
                              on ? 'bg-[#FFCC02]/5 border-[#FFCC02] shadow-[0_4px_20px_rgba(255,204,2,0.15)]' : 'bg-white border-gray-100'
                            }`}
                          >
                            <AnimatePresence>
                              {on && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 90 }}
                                  transition={bouncy}
                                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-sm"
                                >
                                  <Check className="w-3 h-3 text-gray-900" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <motion.span
                              className="text-3xl"
                              animate={on ? { scale: [1, 1.3, 1.1], rotate: [0, 10, 0] } : { scale: 1 }}
                              transition={bouncy}
                            >
                              {c.emoji}
                            </motion.span>
                            <span className={`text-[12px] font-semibold ${on ? 'text-gray-900' : 'text-gray-500'}`}>{c.label}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}

                  {quizStep === 1 && (
                    <motion.div
                      key="s"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -40 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {SETTINGS.map((s, i) => {
                        const on = selectedSettings.includes(s.label);
                        return (
                          <motion.button
                            key={s.label}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, y: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: i * 0.07, ...bouncy }}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => toggleSetting(s.label)}
                            className={`rounded-[20px] p-4 flex items-center gap-3 border-2 transition-all duration-200 text-left ${
                              on ? 'bg-[#FFCC02]/5 border-[#FFCC02] shadow-[0_4px_20px_rgba(255,204,2,0.15)]' : 'bg-white border-gray-100'
                            }`}
                          >
                            <motion.span
                              className="text-2xl flex-shrink-0"
                              animate={on ? { scale: [1, 1.25, 1.1] } : { scale: 1 }}
                              transition={bouncy}
                            >
                              {s.emoji}
                            </motion.span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[12px] font-semibold ${on ? 'text-gray-900' : 'text-gray-600'}`}>{s.label}</div>
                              <div className="text-[10px] text-gray-400">{s.desc}</div>
                            </div>
                            <AnimatePresence>
                              {on && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={bouncy}
                                  className="w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center flex-shrink-0"
                                >
                                  <Check className="w-3 h-3 text-gray-900" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}

                  {quizStep === 2 && (
                    <motion.div
                      key="b"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -40 }}
                      className="space-y-3"
                    >
                      {BUDGETS.map((b, i) => {
                        const on = selectedBudget === b.id;
                        return (
                          <motion.button
                            key={b.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.09, ...bouncy }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedBudget(b.id)}
                            className={`w-full rounded-[20px] p-4 flex items-center gap-4 border-2 transition-all duration-200 ${
                              on ? 'bg-[#FFCC02]/5 border-[#FFCC02] shadow-[0_4px_20px_rgba(255,204,2,0.15)]' : 'bg-white border-gray-100'
                            }`}
                          >
                            <motion.div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${on ? 'bg-[#FFCC02]/15' : 'bg-gray-50'}`}
                              animate={on ? { scale: [1, 1.15, 1.05], rotate: [0, 5, 0] } : { scale: 1 }}
                              transition={bouncy}
                            >
                              {b.emoji}
                            </motion.div>
                            <div className="flex-1 text-left">
                              <div className={`text-[15px] font-bold ${on ? 'text-gray-900' : 'text-gray-600'}`}>{b.label}</div>
                              <div className="text-[11px] text-gray-400">{b.sub} THB</div>
                            </div>
                            <motion.div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${on ? 'border-[#FFCC02] bg-[#FFCC02]' : 'border-gray-200'}`}
                              animate={on ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
                              transition={bouncy}
                            >
                              {on && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={bouncy}>
                                  <Check className="w-3.5 h-3.5 text-gray-900" />
                                </motion.div>
                              )}
                            </motion.div>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}

                  {quizStep === 3 && (
                    <motion.div
                      key="l"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -40 }}
                    >
                      <div className="flex flex-wrap gap-2.5">
                        {BKK_AREAS.map((a, i) => {
                          const on = selectedAreas.includes(a.label);
                          const atMax = selectedAreas.length >= 3 && !on;
                          return (
                            <motion.button
                              key={a.label}
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: atMax ? 0.4 : 1, scale: 1 }}
                              transition={{ delay: i * 0.03, ...spring }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleArea(a.label)}
                              className={`rounded-full px-4 py-2.5 flex items-center gap-2 border-2 transition-all text-[12px] font-semibold ${
                                on ? 'border-[#FFCC02] bg-[#FFCC02]/8 text-gray-900 shadow-[0_4px_16px_rgba(255,204,2,0.15)]' : 'bg-white border-gray-100 text-gray-500'
                              }`}
                            >
                              <span className="text-base">{a.emoji}</span>
                              {a.label}
                              <AnimatePresence>
                                {on && (
                                  <motion.div initial={{ scale: 0, width: 0 }} animate={{ scale: 1, width: 16 }} exit={{ scale: 0, width: 0 }} transition={spring}>
                                    <Check className="w-4 h-4 text-[#FFCC02]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          );
                        })}
                      </div>

                      {selectedAreas.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 flex flex-wrap gap-1.5 justify-center"
                        >
                          {selectedAreas.map(a => (
                            <span key={a} className="text-[10px] font-semibold text-gray-700 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2.5 py-1">
                              {BKK_AREAS.find(ar => ar.label === a)?.emoji} {a}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {quizStep === 4 && (
                    <motion.div
                      key="dt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -40 }}
                      className="space-y-6"
                    >
                      <div>
                        <motion.p
                          className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Dietary needs
                        </motion.p>
                        <div className="flex flex-wrap gap-2">
                          {DIETARY.map((d, i) => {
                            const on = selectedDietary.includes(d.label);
                            return (
                              <motion.button
                                key={d.label}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03, ...spring }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleDietary(d.label)}
                                className={`rounded-full px-3.5 py-2 flex items-center gap-1.5 border-2 transition-all text-[11px] font-semibold ${
                                  on ? 'border-[#FFCC02] bg-[#FFCC02]/8 text-gray-900' : 'bg-white border-gray-100 text-gray-500'
                                }`}
                              >
                                <span className="text-sm">{d.emoji}</span>
                                {d.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <motion.p
                          className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          When?
                        </motion.p>
                        <div className="flex gap-2 mb-3">
                          {['Today', 'Tomorrow', 'This weekend'].map((d, i) => {
                            const on = selectedDate === d;
                            return (
                              <motion.button
                                key={d}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 + i * 0.04, ...spring }}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setSelectedDate(d)}
                                className={`flex-1 rounded-2xl py-2.5 px-2 text-center border-2 transition-all ${
                                  on ? 'border-[#FFCC02] bg-[#FFCC02]/8' : 'bg-white border-gray-100'
                                }`}
                              >
                                <div className={`text-[11px] font-bold ${on ? 'text-gray-900' : 'text-gray-600'}`}>{d}</div>
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
                                transition={{ delay: 0.3 + i * 0.04, ...spring }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => setSelectedTime(t.label)}
                                className={`flex-shrink-0 rounded-2xl p-3 flex flex-col items-center gap-1 border-2 min-w-[64px] transition-all ${
                                  on ? 'border-[#FFCC02] bg-[#FFCC02]/8' : 'bg-white border-gray-100'
                                }`}
                              >
                                <span className="text-lg">{t.icon}</span>
                                <span className={`text-[11px] font-bold ${on ? 'text-gray-900' : 'text-gray-600'}`}>{t.label}</span>
                                <span className="text-[9px] text-gray-400">{t.sub}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-6 pt-3 pb-2">
                <AnimatePresence>
                  {canProceed && (
                    <motion.button
                      initial={{ opacity: 0, y: 24, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 24, scale: 0.9 }}
                      transition={bouncy}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(255,204,2,0.4)' }}
                      onClick={quizStep < TOTAL_QUIZ_STEPS - 1 ? () => setQuizStep(s => s + 1) : startBattle}
                      className="w-full h-[52px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2.5 font-bold text-[15px] text-gray-900 shadow-[0_6px_24px_rgba(255,204,2,0.35)]"
                    >
                      {quizStep < TOTAL_QUIZ_STEPS - 1 ? (
                        <>Continue <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}><ArrowRight className="w-5 h-5" /></motion.div></>
                      ) : (
                        <>Let's pick! <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Flame className="w-5 h-5" /></motion.div></>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>

                {selectedCuisines.length > 0 && quizStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5 mt-3 justify-center">
                    {selectedCuisines.map(c => (
                      <motion.span
                        key={c}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={bouncy}
                        className="text-[10px] font-semibold text-gray-700 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2.5 py-1"
                      >
                        {CUISINES.find(cu => cu.label === c)?.emoji} {c}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {screen === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center pt-10 px-5 pb-24 overflow-y-auto no-sb"
            >
              <motion.div
                className="w-full mb-2"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ...gentle }}
              >
                <div className="flex items-center justify-between mb-2">
                  <motion.button
                    whileTap={{ scale: 0.85, rotate: -10 }}
                    onClick={goQuiz}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gray-700" />
                  </motion.button>

                  <div className="flex items-center gap-1.5">
                    {selectedCuisines.slice(0, 3).map(c => (
                      <span key={c} className="text-[9px] font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                        {CUISINES.find(cu => cu.label === c)?.emoji} {c}
                      </span>
                    ))}
                    {selectedCuisines.length > 3 && (
                      <span className="text-[9px] font-medium text-gray-400">+{selectedCuisines.length - 3}</span>
                    )}
                  </div>

                  <motion.div
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2.5 py-1"
                    key={battleRound}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={bouncy}
                  >
                    <Flame className="w-3 h-3 text-orange-400" />
                    Round {battleRound + 1}
                  </motion.div>
                </div>
              </motion.div>

              <ToastMascot pointDirection={getMascotDirection()} />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...spring }}
                className="text-center mb-1"
              >
                <h2 className="text-[20px] font-['Playfair_Display'] font-bold text-gray-900">
                  Which one sounds better?
                </h2>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Tap to pick — the other gets replaced
                </p>
              </motion.div>

              <AnimatePresence>
                {currentChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={bouncy}
                    className="flex items-center gap-2 my-2.5 bg-amber-50/80 border border-amber-100/60 rounded-full px-4 py-2 shadow-sm"
                  >
                    <motion.div
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-3.5 h-3.5 text-[#FFCC02]" />
                    </motion.div>
                    <span className="text-[11px] font-semibold text-gray-700">Current pick: {currentChoice.name}</span>
                    <motion.div
                      className="w-5 h-5 rounded-full bg-[#FFCC02] flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={bouncy}
                    >
                      <Trophy className="w-3 h-3 text-gray-900" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="flex gap-3.5 w-full mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...gentle }}
              >
                <BattleCard
                  item={leftOption}
                  side="left"
                  isSelected={selectedSide === 'left'}
                  isDismissed={selectedSide !== null && selectedSide !== 'left'}
                  isReplacing={replacingSide === 'left'}
                  isCurrent={currentChoice?.id === leftOption.id && selectedSide === null}
                  onSelect={() => handleSelect('left')}
                  round={round}
                />

                <motion.div
                  className="flex items-center justify-center self-center z-10"
                  animate={{
                    scale: animating ? [1, 1.3, 1] : 1,
                    rotate: animating ? [0, 180, 360] : 0,
                  }}
                  transition={bouncy}
                >
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-lg -mx-3">
                    <motion.span
                      className="text-[13px] font-black text-gray-300"
                      animate={animating ? { color: '#FFCC02' } : { color: '#D1D5DB' }}
                    >
                      VS
                    </motion.span>
                  </div>
                </motion.div>

                <BattleCard
                  item={rightOption}
                  side="right"
                  isSelected={selectedSide === 'right'}
                  isDismissed={selectedSide !== null && selectedSide !== 'right'}
                  isReplacing={replacingSide === 'right'}
                  isCurrent={currentChoice?.id === rightOption.id && selectedSide === null}
                  onSelect={() => handleSelect('right')}
                  round={round}
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ...gentle }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2, boxShadow: '0 10px 32px rgba(255,204,2,0.4)' }}
                onClick={() => setScreen('summary')}
                className="w-full py-3.5 rounded-2xl bg-[#FFCC02] text-gray-900 font-bold text-[14px] shadow-[0_6px_24px_rgba(255,204,2,0.3)] flex items-center justify-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Lock it in!{currentChoice ? ` — ${currentChoice.name}` : ''}
              </motion.button>

              <div className="flex items-center gap-2.5 w-full mt-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, ...gentle }}
                  whileTap={{ scale: 0.94 }}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-50 to-[#FFCC02]/15 flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-[#FFCC02]" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">View Restaurant</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, ...gentle }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setScreen('topPicks')}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-50 to-[#FFCC02]/15 flex items-center justify-center">
                    <ListOrdered className="w-3.5 h-3.5 text-[#FFCC02]" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">Top Picks</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, ...gentle }}
                  whileTap={{ scale: 0.94 }}
                  onClick={startBattle}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
                    <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">Shuffle</span>
                </motion.button>
              </div>
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
                  onClick={() => setScreen('battle')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-700" />
                </motion.button>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <Crown className="w-3.5 h-3.5 text-[#FFCC02]" />
                  <span className="text-[11px] font-bold text-amber-700">Top Picks</span>
                </div>
              </div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ...gentle }}
              >
                <h1 className="text-[24px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-1">Your top picks</h1>
                <p className="text-[13px] text-gray-400 font-medium">Ranked by your battle results</p>
              </motion.div>

              <div className="space-y-3">
                {TOP_PICKS.map((pick, i) => {
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
                            <img src={pick.imageUrl} alt={pick.name} className="w-full h-full object-cover" />
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
                        </div>

                        <div className="flex-1 min-w-0 py-0.5">
                          <h3 className="text-[14px] font-bold text-gray-900 truncate mb-0.5">{pick.name}</h3>
                          <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
                            {pick.type}
                            <span className="text-gray-300">·</span>
                            <MapPin className="w-3 h-3" />
                            {pick.restaurantCount} places
                          </p>
                          <div className="flex items-center justify-between">
                            <motion.span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                i === 0 ? 'text-amber-700 bg-amber-50 border border-amber-100' : 'text-gray-500 bg-gray-50 border border-gray-100'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 + i * 0.08, ...bouncy }}
                            >
                              {pick.score}% match
                            </motion.span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              Won {pick.wins}/{pick.rounds} rounds
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
                className="w-full mt-5 h-[52px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[15px] text-gray-900 shadow-[0_8px_28px_rgba(255,204,2,0.35)]"
              >
                <BarChart3 className="w-5 h-5" />
                Wrap It Up
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setScreen('battle')}
                className="w-full mt-2.5 h-[44px] rounded-2xl bg-white border border-gray-200 flex items-center justify-center gap-2 font-bold text-[13px] text-gray-600 shadow-sm"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                Keep Battling
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
                  onClick={() => setScreen('battle')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-700" />
                </motion.button>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <BarChart3 className="w-3.5 h-3.5 text-[#FFCC02]" />
                  <span className="text-[11px] font-bold text-amber-700">Summary</span>
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
                  className="w-16 h-16 mx-auto mb-3 rounded-[20px] bg-gradient-to-br from-[#FFCC02] to-amber-400 flex items-center justify-center shadow-[0_10px_32px_rgba(255,204,2,0.3)]"
                >
                  <Trophy className="w-8 h-8 text-gray-900" />
                </motion.div>
                <h1 className="text-[24px] font-['Playfair_Display'] font-bold text-gray-900 mb-0.5">Decision Made!</h1>
                <p className="text-[12px] text-gray-400 font-medium">Here's your session recap</p>
              </motion.div>

              {currentChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, ...spring }}
                  className="bg-white rounded-[22px] border-2 border-[#FFCC02]/30 shadow-[0_8px_32px_rgba(255,204,2,0.12)] overflow-hidden mb-5"
                >
                  <div className="relative h-[120px]">
                    <img src={currentChoice.imageUrl} alt={currentChoice.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-white text-[18px] font-bold drop-shadow-lg">{currentChoice.name}</h3>
                      <p className="text-white/80 text-[12px] flex items-center gap-1.5 mt-0.5">
                        {currentChoice.type}
                        <span className="text-white/40">·</span>
                        <MapPin className="w-3 h-3" /> {currentChoice.restaurantCount} places
                      </p>
                    </div>
                    <motion.div
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, ...bouncy }}
                      className="absolute top-3 right-3 bg-[#FFCC02] text-gray-900 text-[10px] font-black rounded-full px-3 py-1.5 shadow-[0_4px_12px_rgba(255,204,2,0.4)] flex items-center gap-1"
                    >
                      <Crown className="w-3 h-3" /> Winner
                    </motion.div>
                  </div>
                  <div className="p-4 flex flex-wrap gap-1.5">
                    {currentChoice.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 rounded-full px-2.5 py-1 font-semibold text-gray-500">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ...gentle }}
                className="bg-white rounded-[22px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-[#FFCC02]" />
                  <span className="text-[12px] font-bold text-gray-900">Session Stats</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Rounds', value: String(battleRound + 1), icon: '⚔️', color: 'from-amber-50 to-yellow-50' },
                    { label: 'Options Seen', value: String(usedIds.size + 2), icon: '👀', color: 'from-blue-50 to-indigo-50' },
                    { label: 'Win Rate', value: `${Math.round((battleRound > 0 ? 1 : 0) / Math.max(1, battleRound) * 100)}%`, icon: '🏆', color: 'from-emerald-50 to-green-50' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, ...spring }}
                      className={`bg-gradient-to-br ${stat.color} rounded-2xl p-3 text-center`}
                    >
                      <span className="text-xl mb-1 block">{stat.icon}</span>
                      <div className="text-[18px] font-bold text-gray-900">{stat.value}</div>
                      <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ...gentle }}
                className="bg-white rounded-[22px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#FFCC02] fill-[#FFCC02]" />
                  <span className="text-[12px] font-bold text-gray-900">Your Taste Profile</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Favourite Cuisine', value: selectedCuisines[0] || 'Thai', emoji: CUISINES.find(c => c.label === (selectedCuisines[0] || 'Thai'))?.emoji || '🍜' },
                    { label: 'Preferred Vibe', value: selectedSettings[0] || 'Restaurant', emoji: SETTINGS.find(s => s.label === (selectedSettings[0] || 'Restaurant'))?.emoji || '🍽️' },
                    { label: 'Budget Range', value: BUDGETS.find(b => b.id === selectedBudget)?.label || '฿฿', emoji: BUDGETS.find(b => b.id === selectedBudget)?.emoji || '🍽️' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.06, ...spring }}
                      className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</div>
                        <div className="text-[13px] font-bold text-gray-900">{item.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, ...gentle }}
                className="bg-white rounded-[22px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-[#FFCC02]" />
                  <span className="text-[12px] font-bold text-gray-900">All-Time Stats</span>
                  <span className="ml-auto text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">14 sessions</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Decisions', value: '14', emoji: '🍽️' },
                    { label: 'Rounds Played', value: '87', emoji: '⚔️' },
                    { label: 'Go-to Pick', value: 'Pad Thai', emoji: '🍜' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.06, ...spring }}
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
                  transition={{ delay: 0.8 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-[50px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[15px] text-gray-900 shadow-[0_8px_24px_rgba(255,204,2,0.3)]"
                >
                  <Share2 className="w-4.5 h-4.5" />
                  Share Results
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={reset}
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
            { icon: Home, label: 'Home', active: screen === 'choose' },
            { icon: MapIcon, label: 'Map' },
            { icon: Heart, label: 'Saved' },
            { icon: User, label: 'Profile' },
          ].map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ...spring }}
              className={`flex flex-col items-center gap-0.5 ${n.active ? 'text-[#FFCC02]' : 'text-gray-400'}`}
              onClick={n.label === 'Home' ? reset : undefined}
              style={{ cursor: n.label === 'Home' ? 'pointer' : 'default' }}
            >
              <n.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{n.label}</span>
              {n.active && <motion.div layoutId="nav" className="w-1 h-1 rounded-full bg-[#FFCC02]" />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
