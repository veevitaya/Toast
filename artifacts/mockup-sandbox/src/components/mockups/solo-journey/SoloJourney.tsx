import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star,
  Sparkles, ArrowRight, ArrowLeft, ChevronDown, RotateCcw, Zap,
  Brain, Clock, Check, X, Flame, BadgeCheck, ExternalLink
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 300, damping: 22 };
const bouncy = { type: "spring" as const, stiffness: 400, damping: 18 };
const gentle = { type: "spring" as const, stiffness: 220, damping: 26 };
const snappy = { type: "spring" as const, stiffness: 500, damping: 32 };

type Screen = 'choose' | 'quiz' | 'thinking' | 'result';

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

const THINKING_STEPS = [
  { label: 'Reading your taste DNA', icon: Brain, delay: 0 },
  { label: 'Scanning nearby gems', icon: MapPin, delay: 900 },
  { label: 'Matching your cravings', icon: Flame, delay: 1800 },
  { label: 'Picking the best spot', icon: Sparkles, delay: 2700 },
];

const RESULT = {
  name: 'Jay Fai',
  cuisine: 'Thai Street Food',
  district: 'Old Town',
  rating: 4.9,
  reviews: 2847,
  price: '฿฿฿',
  match: 97,
  distance: '1.2 km',
  waitTime: '~15 min',
  image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800&auto=format&fit=crop&q=80',
  insight: 'Your Taste DNA shows a deep love for Thai street food — Jay Fai\'s Michelin-starred crab omelet is your perfect match tonight.',
  chips: ['Michelin Star ⭐', 'Thai street food', 'Your #1 cuisine', 'Worth the wait'],
  scores: [
    { label: 'Taste DNA', value: 97, color: '#22c55e' },
    { label: 'Perfect timing', value: 92, color: '#FFCC02' },
    { label: 'Trending now', value: 95, color: '#3b82f6' },
    { label: 'Value score', value: 78, color: '#8b5cf6' },
  ],
};

const ALTS = [
  { name: 'Thipsamai', match: 94, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=60', chip: 'Pad Thai legend' },
  { name: 'Peppina', match: 91, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60', chip: 'Wood-fired pizza' },
];

export function SoloJourney() {
  const [screen, setScreen] = useState<Screen>('choose');
  const [quizStep, setQuizStep] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [expandScores, setExpandScores] = useState(false);
  const [soloHover, setSoloHover] = useState(false);
  const [groupHover, setGroupHover] = useState(false);
  const [heroOffset, setHeroOffset] = useState(0);

  const toggleCuisine = useCallback((l: string) => {
    setSelectedCuisines(p => p.includes(l) ? p.filter(c => c !== l) : [...p, l]);
  }, []);

  const toggleSetting = useCallback((l: string) => {
    setSelectedSettings(p => p.includes(l) ? p.filter(s => s !== l) : [...p, l]);
  }, []);

  const startThinking = useCallback(() => {
    setScreen('thinking');
    setThinkingStep(0);
    setShowCard(false);
    setExpandScores(false);
    THINKING_STEPS.forEach((_, i) =>
      setTimeout(() => setThinkingStep(i + 1), _.delay + 800)
    );
    setTimeout(() => {
      setScreen('result');
      setTimeout(() => setShowCard(true), 400);
    }, 4200);
  }, []);

  const goQuiz = useCallback(() => {
    setScreen('quiz');
    setQuizStep(0);
    setSelectedCuisines([]);
    setSelectedSettings([]);
    setSelectedBudget(null);
  }, []);

  const reset = useCallback(() => {
    setScreen('choose');
  }, []);

  const canProceed = quizStep === 0 ? selectedCuisines.length > 0 : quizStep === 1 ? selectedSettings.length > 0 : selectedBudget !== null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap');
        .no-sb::-webkit-scrollbar{display:none} .no-sb{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-6px) rotate(-2deg)}75%{transform:translateY(-3px) rotate(2deg)}} .float{animation:float 4s ease-in-out infinite}
        @keyframes wiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}} .wiggle{animation:wiggle 2s ease-in-out infinite}
        @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(255,204,2,0.3)}50%{box-shadow:0 0 0 12px rgba(255,204,2,0)}} .pulse-glow{animation:pulse-glow 2s ease-in-out infinite}
        @keyframes confetti-pop{0%{transform:scale(0) rotate(0deg);opacity:1}60%{transform:scale(1.3) rotate(180deg);opacity:0.8}100%{transform:scale(1) rotate(360deg);opacity:0}} .confetti{animation:confetti-pop 0.6s ease-out forwards}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}} .shimmer{background:linear-gradient(90deg,transparent 25%,rgba(255,204,2,0.1) 50%,transparent 75%);background-size:200% 100%;animation:shimmer 2s infinite}
        .glass{background:rgba(255,255,255,0.88);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%)}
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
                        <img src="/__mockup/images/toast_char.png" alt="Solo" className="w-[75px] h-[75px] object-contain float" />
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
                        <img src="/__mockup/images/toast_waffle.jpeg" alt="Group" className="w-[80px] h-[80px] object-contain" style={{ mixBlendMode: 'multiply' }} />
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
                    {[0, 1, 2].map(i => (
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
                    {quizStep + 1}/3
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
                      {quizStep === 0 ? 'What are you\ncraving?' : quizStep === 1 ? 'Set the\nscene' : 'What\'s your\nbudget?'}
                    </h1>
                    <p className="text-[13px] text-gray-400 font-medium">
                      {quizStep === 0 ? 'Pick as many as you like' : quizStep === 1 ? 'Where sounds good tonight?' : 'We\'ll find the sweet spot'}
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
                      onClick={quizStep < 2 ? () => setQuizStep(s => s + 1) : startThinking}
                      className="w-full h-[52px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2.5 font-bold text-[15px] text-gray-900 shadow-[0_6px_24px_rgba(255,204,2,0.35)]"
                    >
                      {quizStep < 2 ? (
                        <>Continue <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}><ArrowRight className="w-5 h-5" /></motion.div></>
                      ) : (
                        <>Find my perfect spot <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Sparkles className="w-5 h-5" /></motion.div></>
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

          {screen === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center px-8 pb-24"
            >
              <motion.div
                className="relative mb-10"
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <motion.div
                  className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-[#FFCC02] to-[#FFB800] flex items-center justify-center shadow-[0_12px_40px_rgba(255,204,2,0.4)]"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <motion.span
                    className="text-6xl"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    🍞
                  </motion.span>
                </motion.div>

                <motion.div
                  className="absolute -top-2 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                >
                  <Sparkles className="w-4 h-4 text-[#FFCC02]" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-1 -left-2 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center"
                  animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                >
                  <span className="text-xs">✨</span>
                </motion.div>

                <motion.div
                  className="absolute inset-[-8px] rounded-[38px] border-2 border-[#FFCC02]/20"
                  animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...gentle }}
                className="text-[24px] font-['Playfair_Display'] font-bold text-gray-900 mb-1.5 text-center"
              >
                Toast is thinking...
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[13px] text-gray-400 mb-10"
              >
                Crunching your taste DNA
              </motion.p>

              <div className="w-full max-w-[240px] space-y-5">
                {THINKING_STEPS.map((s, i) => {
                  const done = thinkingStep > i;
                  const active = thinkingStep === i + 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: done || active ? 1 : 0.25, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.12, ...gentle }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        animate={{
                          backgroundColor: done ? '#FFCC02' : active ? '#FEF3C7' : '#F3F4F6',
                          scale: active ? [1, 1.15, 1] : done ? [1, 1.2, 1] : 1,
                          rotate: done ? [0, 10, 0] : 0,
                        }}
                        transition={active ? { scale: { repeat: Infinity, duration: 1 } } : bouncy}
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        {done ? (
                          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
                            <Check className="w-4 h-4 text-gray-900" />
                          </motion.div>
                        ) : (
                          <s.icon className={`w-4 h-4 ${active ? 'text-amber-600' : 'text-gray-400'}`} />
                        )}
                      </motion.div>
                      <span className={`text-[13px] font-medium ${done ? 'text-gray-900' : active ? 'text-gray-700' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                      {done && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={bouncy} className="ml-auto text-[10px]">
                          ✅
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-10 w-full max-w-[240px]">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(100, thinkingStep * 25)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#FFCC02] to-[#FFB800]"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto no-sb pb-24"
              onScroll={e => setHeroOffset(Math.min((e.currentTarget as HTMLDivElement).scrollTop * 0.35, 60))}
            >
              <div className="relative h-[280px] overflow-hidden">
                <motion.img
                  src={RESULT.image}
                  alt={RESULT.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.15, filter: 'blur(4px)' }}
                  animate={{ scale: 1, filter: 'blur(0px)', y: heroOffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute top-12 left-5 right-5 flex items-center justify-between z-10">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, ...bouncy }}
                    whileTap={{ scale: 0.85 }}
                    onClick={reset}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center shadow-lg"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-900" />
                  </motion.button>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, ...spring }}
                    className="flex items-center gap-2"
                  >
                    <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1 }} className="glass rounded-full px-3 py-1.5 shadow-lg cursor-pointer">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1 }} className="glass rounded-full px-3 py-1.5 shadow-lg cursor-pointer">
                      <ExternalLink className="w-4 h-4 text-gray-700" />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="absolute bottom-4 left-5 right-5 z-10">
                  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ...gentle }}>
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7, ...bouncy }}
                        className="bg-[#FFCC02] text-gray-900 text-[10px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md"
                      >
                        <Sparkles className="w-3 h-3" /> Picked for you
                      </motion.span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, ...bouncy }}
                        className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full px-2.5 py-1"
                      >
                        ⭐ Michelin Star
                      </motion.span>
                    </div>
                    <motion.h1
                      className="text-[30px] font-['Playfair_Display'] font-bold text-white leading-tight"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, ...gentle }}
                    >
                      {RESULT.name}
                    </motion.h1>
                    <p className="text-white/80 text-[13px] font-medium mt-0.5 flex items-center gap-2">
                      {RESULT.cuisine} · <Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" /> {RESULT.rating} ({RESULT.reviews}) · {RESULT.price}
                    </p>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {showCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...bouncy }}
                    className="px-5 -mt-6 relative z-20"
                  >
                    <div className="bg-white rounded-[22px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100/50 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <motion.div
                              className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center"
                              initial={{ scale: 0, rotate: -30 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.3, ...bouncy }}
                            >
                              <BadgeCheck className="w-5 h-5 text-emerald-600" />
                            </motion.div>
                            <div>
                              <motion.span
                                className="text-[16px] font-bold text-emerald-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                {RESULT.match}% Match
                              </motion.span>
                              <p className="text-[10px] text-gray-400">Based on your Taste DNA</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <MapPin className="w-3.5 h-3.5" /> {RESULT.distance}
                            <span className="text-gray-200">·</span>
                            <Clock className="w-3.5 h-3.5" /> {RESULT.waitTime}
                          </div>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${RESULT.match}%` }}
                            transition={{ delay: 0.5, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                          />
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, ...gentle }}
                          className="flex items-start gap-2 mb-3 bg-amber-50/60 rounded-xl px-3 py-2.5 border border-amber-100/50"
                        >
                          <Brain className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] text-amber-800 leading-relaxed">{RESULT.insight}</p>
                        </motion.div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {RESULT.chips.map((chip, i) => (
                            <motion.span
                              key={chip}
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + i * 0.08, ...bouncy }}
                              className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100"
                            >
                              {chip}
                            </motion.span>
                          ))}
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setExpandScores(!expandScores)}
                          className="w-full text-[11px] font-medium text-gray-400 flex items-center justify-center gap-1 py-1 mb-1"
                        >
                          {expandScores ? 'Hide details' : 'See why Toast picked this'}
                          <motion.div animate={{ rotate: expandScores ? 180 : 0 }} transition={spring}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.div>
                        </motion.button>

                        <AnimatePresence>
                          {expandScores && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={gentle}
                              className="overflow-hidden"
                            >
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Why this pick</p>
                              <div className="space-y-2.5 mb-2">
                                {RESULT.scores.map((s, i) => (
                                  <div key={s.label} className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-gray-400 w-[88px] text-right">{s.label}</span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.value}%` }}
                                        transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: s.color }}
                                      />
                                    </div>
                                    <motion.span
                                      className="text-[10px] font-bold text-gray-700 w-8"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.3 + i * 0.12 }}
                                    >
                                      {s.value}%
                                    </motion.span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border-t border-gray-100 p-4 flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(255,204,2,0.35)' }}
                          className="flex-1 h-[50px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[14px] text-gray-900 shadow-[0_4px_16px_rgba(255,204,2,0.3)]"
                        >
                          Let's go <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}><ArrowRight className="w-4 h-4" /></motion.div>
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.85, rotate: -90 }}
                          whileHover={{ scale: 1.08 }}
                          onClick={startThinking}
                          className="h-[50px] w-[50px] rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-gray-400"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {showCard && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, ...gentle }}
                  className="px-5 mt-5 mb-4"
                >
                  <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3">Also great for you</p>
                  <div className="flex gap-3">
                    {ALTS.map((alt, i) => (
                      <motion.div
                        key={alt.name}
                        initial={{ opacity: 0, y: 20, rotate: i === 0 ? -2 : 2 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.8 + i * 0.12, ...bouncy }}
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ y: -4 }}
                        className="flex-1 bg-white rounded-[18px] border border-gray-100 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.04)] cursor-pointer"
                      >
                        <div className="relative h-[80px] overflow-hidden">
                          <img src={alt.image} alt={alt.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + i * 0.1, ...bouncy }}
                            className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5"
                          >
                            {alt.match}%
                          </motion.div>
                          <p className="absolute bottom-2 left-2 text-white text-[11px] font-semibold drop-shadow">{alt.name}</p>
                        </div>
                        <div className="p-2.5">
                          <span className="text-[9px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 border border-emerald-100">{alt.chip}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {showCard && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="px-5 mt-2 mb-6"
                >
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ backgroundColor: '#F9FAFB' }}
                    className="w-full h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-500"
                  >
                    <Zap className="w-3.5 h-3.5" /> Not feeling these? Let's find your cravings
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 inset-x-0 h-[84px] glass border-t border-gray-100/40 flex justify-around items-start pt-3 px-6 z-[90] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {[
            { icon: Home, label: 'Home', active: true },
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
