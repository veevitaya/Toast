import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star,
  Sparkles, ArrowRight, ArrowLeft, ChevronRight, ChevronDown, RotateCcw, Zap,
  Brain, Clock, TrendingUp, Check, X, Utensils, Flame, Leaf, CookingPot,
  UtensilsCrossed, Coffee, Wine, Compass, Navigation, BadgeCheck, Crown,
  ThumbsUp, ExternalLink, ChefHat
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 320, damping: 24 };
const gentleSpring = { type: "spring" as const, stiffness: 260, damping: 28 };
const snappySpring = { type: "spring" as const, stiffness: 400, damping: 30 };

type Screen = 'home' | 'quiz' | 'thinking' | 'result' | 'detail';

const CUISINES = [
  { emoji: '🍜', label: 'Thai', color: '#FF6B35' },
  { emoji: '🍣', label: 'Japanese', color: '#E63946' },
  { emoji: '🥟', label: 'Chinese', color: '#D4A373' },
  { emoji: '🍕', label: 'Italian', color: '#2A9D8F' },
  { emoji: '🌮', label: 'Mexican', color: '#F4A261' },
  { emoji: '🍛', label: 'Indian', color: '#E9C46A' },
  { emoji: '🥩', label: 'Western', color: '#264653' },
  { emoji: '🍤', label: 'Seafood', color: '#457B9D' },
  { emoji: '🥗', label: 'Healthy', color: '#6A994E' },
];

const SETTINGS = [
  { emoji: '🍢', label: 'Street food', desc: 'Local vibes' },
  { emoji: '🍽️', label: 'Restaurant', desc: 'Sit-down' },
  { emoji: '🚇', label: 'Near BTS', desc: 'Easy access' },
  { emoji: '🌃', label: 'Late night', desc: 'After hours' },
  { emoji: '🌊', label: 'By the river', desc: 'Scenic' },
  { emoji: '🏙️', label: 'Rooftop', desc: 'Views' },
];

const BUDGETS = [
  { id: 'cheap', label: '฿', sub: 'Under 150', emoji: '💰' },
  { id: 'moderate', label: '฿฿', sub: '150-500', emoji: '🍽️' },
  { id: 'fancy', label: '฿฿฿', sub: '500-1500', emoji: '✨' },
  { id: 'splurge', label: '฿฿฿฿', sub: '1500+', emoji: '👑' },
];

const THINKING_STEPS = [
  { label: 'Reading your taste DNA...', icon: Brain, delay: 0 },
  { label: 'Checking what\'s nearby...', icon: MapPin, delay: 800 },
  { label: 'Matching your cravings...', icon: Flame, delay: 1600 },
  { label: 'Finding the perfect spot...', icon: Sparkles, delay: 2400 },
];

const RESULT_RESTAURANT = {
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
  insight: 'Your Taste DNA shows a strong love for Thai street food — Jay Fai\'s Michelin-starred crab omelet perfectly matches your craving for bold, authentic flavors.',
  chips: ['Michelin Star ⭐', 'Thai street food', 'Your #1 cuisine', 'Worth the wait'],
  whyScores: [
    { label: 'Taste DNA match', value: 97, color: '#22c55e' },
    { label: 'Perfect timing', value: 92, color: '#FFCC02' },
    { label: 'Trending now', value: 95, color: '#3b82f6' },
    { label: 'Value score', value: 78, color: '#8b5cf6' },
  ],
};

const ALT_RESTAURANTS = [
  { name: 'Thipsamai', cuisine: 'Thai', match: 94, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=60', chip: 'Pad Thai legend' },
  { name: 'Peppina', cuisine: 'Italian', match: 91, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60', chip: 'Wood-fired pizza' },
];

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            width: i === step ? 24 : 8,
            backgroundColor: i <= step ? '#FFCC02' : '#E5E7EB'
          }}
          transition={spring}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

function ScoreBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-gray-500 w-24 text-right">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-bold text-gray-700 w-8">{value}%</span>
    </div>
  );
}

export function SoloJourney() {
  const [screen, setScreen] = useState<Screen>('home');
  const [quizStep, setQuizStep] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [showResultCard, setShowResultCard] = useState(false);
  const [expandedResult, setExpandedResult] = useState(false);
  const [heroParallax, setHeroParallax] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleCuisine = useCallback((label: string) => {
    setSelectedCuisines(prev => prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]);
  }, []);

  const toggleSetting = useCallback((label: string) => {
    setSelectedSettings(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]);
  }, []);

  const startThinking = useCallback(() => {
    setScreen('thinking');
    setThinkingStep(0);
    setShowResultCard(false);
    setExpandedResult(false);
    
    const timers = THINKING_STEPS.map((step, i) => 
      setTimeout(() => setThinkingStep(i + 1), step.delay + 800)
    );
    
    const resultTimer = setTimeout(() => {
      setScreen('result');
      setTimeout(() => setShowResultCard(true), 300);
    }, 3800);
    
    return () => { timers.forEach(clearTimeout); clearTimeout(resultTimer); };
  }, []);

  const goToQuiz = useCallback(() => {
    setScreen('quiz');
    setQuizStep(0);
    setSelectedCuisines([]);
    setSelectedSettings([]);
    setSelectedBudget(null);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollY = e.currentTarget.scrollTop;
    setHeroParallax(Math.min(scrollY * 0.4, 80));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, transparent 25%, rgba(255,204,2,0.12) 50%, transparent 75%); background-size: 200% 100%; animation: shimmer 2s infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        .float { animation: float 3s ease-in-out infinite; }
        @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 0.3; } 100% { transform: scale(0.95); opacity: 0.7; } }
        .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .glass { background: rgba(255,255,255,0.85); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
      `}} />
      
      <div className="relative w-[390px] h-[844px] bg-[#FAFAF8] rounded-[44px] border-[8px] border-gray-900 overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-[100] pointer-events-none">
          <div className="w-[126px] h-[32px] bg-black rounded-b-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <HomeScreen key="home" onSoloClick={goToQuiz} />
          )}
          {screen === 'quiz' && (
            <QuizScreen
              key="quiz"
              step={quizStep}
              selectedCuisines={selectedCuisines}
              selectedSettings={selectedSettings}
              selectedBudget={selectedBudget}
              onToggleCuisine={toggleCuisine}
              onToggleSetting={toggleSetting}
              onSelectBudget={setSelectedBudget}
              onNextStep={() => setQuizStep(s => s + 1)}
              onPrevStep={() => quizStep > 0 ? setQuizStep(s => s - 1) : setScreen('home')}
              onSubmit={startThinking}
            />
          )}
          {screen === 'thinking' && (
            <ThinkingScreen key="thinking" step={thinkingStep} />
          )}
          {screen === 'result' && (
            <ResultScreen
              key="result"
              showCard={showResultCard}
              expanded={expandedResult}
              onExpand={() => setExpandedResult(true)}
              onBack={() => setScreen('home')}
              onTryAgain={startThinking}
              heroParallax={heroParallax}
              onScroll={handleScroll}
              scrollRef={scrollRef}
            />
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 inset-x-0 h-[84px] glass border-t border-gray-100/50 flex justify-around items-start pt-3 px-6 z-[90] pb-safe">
          <NavItem icon={<Home className="w-5 h-5" />} label="Home" active={screen === 'home'} />
          <NavItem icon={<MapIcon className="w-5 h-5" />} label="Map" />
          <NavItem icon={<Heart className="w-5 h-5" />} label="Saved" />
          <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ onSoloClick }: { onSoloClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto scrollbar-hide pb-24"
    >
      <div className="relative pt-12 px-5 pb-4">
        <motion.div 
          className="flex items-center gap-3 w-full glass p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50"
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-gray-900" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">What are you craving?</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-0.5 text-red-500"><MapPin className="w-3 h-3" /> Sukhumvit</span>
              <span className="text-gray-300">•</span><span>Any time</span>
            </div>
          </div>
          <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center bg-white">
            <SlidersHorizontal className="w-4 h-4 text-gray-900" />
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-2">
        <div className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Wed · 7:30 PM · ☀️ 32°C</div>
        <h1 className="text-3xl font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-2">Good evening,<br/>foodie.</h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">🍜 Thai food fan</span>
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
            <span className="text-[#FFCC02]">✨</span> 12-wk streak
          </span>
        </div>
      </div>

      <div className="px-6 mb-8">
        <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3">Who's eating with you?</h2>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(255,204,2,0.15)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onSoloClick}
            className="flex-1 bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#FFCC02]/5 to-transparent opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <div className="relative">
              <div className="text-5xl float">🧑‍🍳</div>
              <motion.div 
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, ...snappySpring }}
              >
                <Sparkles className="w-3 h-3 text-gray-900" />
              </motion.div>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-[15px]">Solo</div>
              <div className="text-[11px] text-gray-500 mt-0.5">AI-powered picks</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="text-5xl">🤝</div>
            <div>
              <div className="font-bold text-gray-900 text-[15px]">Group</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Vote together</div>
            </div>
          </motion.button>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-white rounded-[20px] border border-gray-100 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCC02]" />
            <span className="text-[12px] font-bold text-gray-900">Toast's pick for you</span>
            <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">97% match</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=200&auto=format&fit=crop&q=60" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-bold text-gray-900">Jay Fai</span>
              <p className="text-[11px] text-gray-500">Thai · Old Town · <Star className="w-3 h-3 inline text-[#FFCC02] fill-[#FFCC02] -mt-0.5" /> 4.9</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-[#FFCC02] flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4 text-gray-900" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuizScreen({ step, selectedCuisines, selectedSettings, selectedBudget, onToggleCuisine, onToggleSetting, onSelectBudget, onNextStep, onPrevStep, onSubmit }: {
  step: number;
  selectedCuisines: string[];
  selectedSettings: string[];
  selectedBudget: string | null;
  onToggleCuisine: (label: string) => void;
  onToggleSetting: (label: string) => void;
  onSelectBudget: (id: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
}) {
  const canProceed = step === 0 ? selectedCuisines.length > 0 : step === 1 ? selectedSettings.length > 0 : selectedBudget !== null;

  const titles = [
    { main: 'What are you craving?', sub: 'Pick as many as you like' },
    { main: 'Where sounds good?', sub: 'Set the scene for tonight' },
    { main: 'What\'s your budget?', sub: 'We\'ll find the sweet spot' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={gentleSpring}
      className="flex-1 flex flex-col pb-24"
    >
      <div className="pt-14 px-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onPrevStep}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </motion.button>
          <ProgressDots step={step} total={3} />
          <div className="w-10" />
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ...gentleSpring }}
        >
          <h1 className="text-[28px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-1">{titles[step].main}</h1>
          <p className="text-[13px] text-gray-500 font-medium">{titles[step].sub}</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="cuisines"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={gentleSpring}
              className="grid grid-cols-3 gap-3"
            >
              {CUISINES.map((c, i) => {
                const selected = selectedCuisines.includes(c.label);
                return (
                  <motion.button
                    key={c.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, ...snappySpring }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onToggleCuisine(c.label)}
                    className={`relative rounded-[18px] p-4 flex flex-col items-center gap-2.5 border-2 transition-colors duration-200 ${
                      selected 
                        ? 'bg-white border-[#FFCC02] shadow-[0_4px_16px_rgba(255,204,2,0.2)]' 
                        : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={snappySpring}
                        className="absolute top-2 right-2 w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-gray-900" />
                      </motion.div>
                    )}
                    <span className="text-3xl">{c.emoji}</span>
                    <span className={`text-[12px] font-semibold ${selected ? 'text-gray-900' : 'text-gray-600'}`}>{c.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={gentleSpring}
              className="grid grid-cols-2 gap-3"
            >
              {SETTINGS.map((s, i) => {
                const selected = selectedSettings.includes(s.label);
                return (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, ...snappySpring }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToggleSetting(s.label)}
                    className={`rounded-[18px] p-4 flex items-center gap-3 border-2 transition-colors duration-200 text-left ${
                      selected 
                        ? 'bg-white border-[#FFCC02] shadow-[0_4px_16px_rgba(255,204,2,0.2)]' 
                        : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                    <div className="min-w-0">
                      <div className={`text-[13px] font-semibold ${selected ? 'text-gray-900' : 'text-gray-700'}`}>{s.label}</div>
                      <div className="text-[10px] text-gray-400">{s.desc}</div>
                    </div>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={snappySpring}
                        className="ml-auto w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Check className="w-3 h-3 text-gray-900" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={gentleSpring}
              className="space-y-3"
            >
              {BUDGETS.map((b, i) => {
                const selected = selectedBudget === b.id;
                return (
                  <motion.button
                    key={b.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, ...snappySpring }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectBudget(b.id)}
                    className={`w-full rounded-[18px] p-4 flex items-center gap-4 border-2 transition-all duration-200 ${
                      selected 
                        ? 'bg-white border-[#FFCC02] shadow-[0_4px_16px_rgba(255,204,2,0.2)]' 
                        : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                      selected ? 'bg-[#FFCC02]/10' : 'bg-gray-50'
                    }`}>
                      {b.emoji}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-[15px] font-bold ${selected ? 'text-gray-900' : 'text-gray-700'}`}>{b.label}</div>
                      <div className="text-[12px] text-gray-400">{b.sub} THB</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selected ? 'border-[#FFCC02] bg-[#FFCC02]' : 'border-gray-200'
                    }`}>
                      {selected && <Check className="w-3.5 h-3.5 text-gray-900" />}
                    </div>
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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={snappySpring}
              whileTap={{ scale: 0.97 }}
              onClick={step < 2 ? onNextStep : onSubmit}
              className="w-full h-[52px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2.5 font-bold text-[15px] text-gray-900 shadow-[0_4px_20px_rgba(255,204,2,0.35)]"
            >
              {step < 2 ? (
                <>Continue <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>Find my perfect spot <Sparkles className="w-5 h-5" /></>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {selectedCuisines.length > 0 && step === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-1.5 mt-3 justify-center"
          >
            {selectedCuisines.map(c => {
              const cuisine = CUISINES.find(cu => cu.label === c);
              return (
                <motion.span
                  key={c}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={snappySpring}
                  className="text-[10px] font-semibold text-gray-700 bg-[#FFCC02]/10 border border-[#FFCC02]/20 rounded-full px-2.5 py-1"
                >
                  {cuisine?.emoji} {c}
                </motion.span>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ThinkingScreen({ step }: { step: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center px-8 pb-24"
    >
      <motion.div
        className="relative mb-10"
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#FFCC02] to-[#FFB800] flex items-center justify-center shadow-[0_8px_32px_rgba(255,204,2,0.4)]">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-5xl"
          >
            🍞
          </motion.div>
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles className="w-4 h-4 text-[#FFCC02]" />
        </motion.div>
        <div className="absolute inset-0 rounded-[28px] bg-[#FFCC02]/20 pulse-ring" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...gentleSpring }}
        className="text-[22px] font-['Playfair_Display'] font-bold text-gray-900 mb-2 text-center"
      >
        Toast is thinking...
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[13px] text-gray-400 mb-10 text-center"
      >
        Crunching your taste DNA
      </motion.p>

      <div className="w-full max-w-[260px] space-y-4">
        {THINKING_STEPS.map((s, i) => {
          const done = step > i;
          const active = step === i + 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: done || active ? 1 : 0.3, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15, ...gentleSpring }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{
                  backgroundColor: done ? '#FFCC02' : active ? '#FEF3C7' : '#F3F4F6',
                  scale: active ? [1, 1.1, 1] : 1,
                }}
                transition={active ? { repeat: Infinity, duration: 1 } : spring}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              >
                {done ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={snappySpring}>
                    <Check className="w-4 h-4 text-gray-900" />
                  </motion.div>
                ) : (
                  <s.icon className={`w-4 h-4 ${active ? 'text-amber-600' : 'text-gray-400'}`} />
                )}
              </motion.div>
              <span className={`text-[13px] font-medium ${done ? 'text-gray-900' : active ? 'text-gray-700' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 w-full max-w-[260px]"
      >
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(100, step * 25)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[#FFCC02] to-[#FFB800]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ResultScreen({ showCard, expanded, onExpand, onBack, onTryAgain, heroParallax, onScroll, scrollRef }: {
  showCard: boolean;
  expanded: boolean;
  onExpand: () => void;
  onBack: () => void;
  onTryAgain: () => void;
  heroParallax: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  const r = RESULT_RESTAURANT;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto scrollbar-hide pb-24"
    >
      <div className="relative h-[280px] overflow-hidden">
        <motion.img
          src={r.image}
          alt={r.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1, y: heroParallax }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-12 left-5 right-5 flex items-center justify-between z-10">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full glass flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-gray-900" />
          </motion.button>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, ...snappySpring }}
            className="flex items-center gap-2"
          >
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
              <Heart className="w-4 h-4 text-gray-700" />
            </div>
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-4 left-5 right-5 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...gentleSpring }}
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, ...snappySpring }}
                className="bg-[#FFCC02] text-gray-900 text-[10px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Picked for you
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, ...snappySpring }}
                className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full px-2.5 py-1"
              >
                ⭐ Michelin Star
              </motion.span>
            </div>
            <h1 className="text-[28px] font-['Playfair_Display'] font-bold text-white leading-tight">{r.name}</h1>
            <p className="text-white/80 text-[13px] font-medium mt-0.5 flex items-center gap-2">
              {r.cuisine} · <Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" /> {r.rating} ({r.reviews}) · {r.price}
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...gentleSpring }}
            className="px-5 -mt-6 relative z-20"
          >
            <div className="bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100/50 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[15px] font-bold text-emerald-600">{r.match}% Match</span>
                      <p className="text-[10px] text-gray-400">Based on your Taste DNA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <MapPin className="w-3.5 h-3.5" /> {r.distance}
                    <span className="text-gray-300">·</span>
                    <Clock className="w-3.5 h-3.5" /> {r.waitTime}
                  </div>
                </div>

                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.match}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  />
                </div>

                <div className="flex items-start gap-2 mb-3 bg-amber-50/60 rounded-xl px-3 py-2.5 border border-amber-100/50">
                  <Brain className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-amber-800 leading-relaxed">{r.insight}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.chips.map((chip, i) => (
                    <motion.span
                      key={chip}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.08, ...snappySpring }}
                      className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100"
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>

                {!expanded ? (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onExpand}
                    className="w-full text-[11px] font-medium text-gray-500 flex items-center justify-center gap-1 py-1"
                  >
                    See why Toast picked this <ChevronDown className="w-3.5 h-3.5" />
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={gentleSpring}
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Why this pick</p>
                    <div className="space-y-2 mb-3">
                      {r.whyScores.map((s, i) => (
                        <ScoreBar key={s.label} label={s.label} value={s.value} color={s.color} delay={0.1 + i * 0.1} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="border-t border-gray-100 p-4 flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 h-[48px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[14px] text-gray-900 shadow-[0_4px_16px_rgba(255,204,2,0.3)]"
                >
                  Let's go <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onTryAgain}
                  className="h-[48px] w-[48px] rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-gray-500"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ...gentleSpring }}
          className="px-5 mt-5 mb-4"
        >
          <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3">Also great for you</p>
          <div className="flex gap-3">
            {ALT_RESTAURANTS.map((alt, i) => (
              <motion.div
                key={alt.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, ...gentleSpring }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-white rounded-[16px] border border-gray-100 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.04)] cursor-pointer"
              >
                <div className="relative h-[80px] overflow-hidden">
                  <img src={alt.image} alt={alt.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{alt.match}%</div>
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
          transition={{ delay: 0.9 }}
          className="px-5 mt-2 mb-6"
        >
          <button className="w-full h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-500">
            <Zap className="w-3.5 h-3.5" /> Not feeling these? Let's find your cravings
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 ${active ? 'text-[#FFCC02]' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-[#FFCC02]" />}
    </div>
  );
}
