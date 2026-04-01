import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star, Sparkles, ArrowRight, ChevronRight, ChevronDown, ChevronLeft, RotateCcw, Zap, Brain, Clock, TrendingUp, Check, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'thai', label: 'Thai 🇹🇭' },
  { id: 'sushi', label: 'Sushi 🍣' },
  { id: 'burgers', label: 'Burgers 🍔' },
  { id: 'pizza', label: 'Pizza 🍕' },
  { id: 'bars', label: 'Bars 🍸' },
  { id: 'cafe', label: 'Cafe ☕' },
  { id: 'desserts', label: 'Desserts 🍰' },
];

const VIBES = [
  { id: 'popular', label: 'Popular', icon: '🔥' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'drinks', label: 'Drinks', icon: '🍸' },
  { id: 'budget', label: 'Budget', icon: '💰' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'outdoor', label: 'Outdoor', icon: '⛱️' },
  { id: 'date', label: 'Date Night', icon: '💕' },
  { id: 'more', label: 'More', icon: '✨' },
];

const PICKS = [
  { id: 1, name: 'Jay Fai', cuisine: 'Thai', district: 'Old Town', rating: 4.9, price: '฿฿฿', match: 88, image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60', insight: 'You loved Thai street food last 3 visits — this Michelin-starred gem matches your profile', chips: ['Highly rated', 'Perfect for dinner', 'Thai street food'], scores: { taste: 85, timing: 78, popularity: 92, value: 70 } },
  { id: 2, name: 'Thipsamai', cuisine: 'Thai', district: 'Phra Nakhon', rating: 4.9, price: '฿', match: 82, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60', insight: 'Your top-rated cuisine is Thai noodles — Thipsamai is the original pad thai legend', chips: ['Budget-friendly', 'Your favorite cuisine', 'Legendary spot'], scores: { taste: 82, timing: 74, popularity: 88, value: 91 } },
  { id: 3, name: 'Peppina', cuisine: 'Pizza', district: 'Thonglor', rating: 4.8, price: '฿฿', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60', match: 79, insight: 'You explored Italian last week — Peppina\'s Neapolitan style fits your adventurous side', chips: ['Wood-fired', 'Cozy atmosphere', 'Near you'], scores: { taste: 76, timing: 82, popularity: 85, value: 74 } },
  { id: 4, name: 'Sushi Masato', cuisine: 'Japanese', district: 'Sukhumvit', rating: 4.9, price: '฿฿฿', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60', match: 75, insight: 'Your taste DNA leans toward refined dining — this intimate omakase is a perfect match', chips: ['Omakase', 'Premium quality', 'Intimate setting'], scores: { taste: 90, timing: 65, popularity: 78, value: 55 } },
];

const USUALS = [
  { id: 1, name: 'Thipsamai', cuisine: 'Thai', rating: 4.9, price: '฿', desc: 'Famous pad thai since 1966', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Sushi Masato', cuisine: 'Sushi', rating: 4.9, price: '฿฿฿', desc: 'Intimate 8-seat omakase', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Jay Fai', cuisine: 'Thai', rating: 4.9, price: '฿฿฿', desc: 'Michelin-starred street food', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60' },
];

const NEW_NEAR = [
  { id: 1, name: 'Peppina', cuisine: 'Pizza', rating: 4.8, price: '฿฿', desc: 'Neapolitan pizza, wood-fired', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Roast', cuisine: 'Breakfast', rating: 4.7, price: '฿฿', desc: "Bangkok's premier brunch", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=60' },
  { id: 3, name: 'After You', cuisine: 'Desserts', rating: 4.5, price: '฿฿', desc: 'Kakigori & honey toast', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60' },
];

const MAP_PINS = [
  { top: '20%', left: '30%', icon: '🍜' },
  { top: '35%', left: '70%', icon: '🍣' },
  { top: '45%', left: '20%', icon: '🔥' },
  { top: '60%', left: '80%', icon: '🍕' },
  { top: '75%', left: '40%', icon: '☕' },
  { top: '85%', left: '60%', icon: '🍰' },
];

const MOODS = [
  { id: 'comfort', label: 'Comfort food', icon: '🍜' },
  { id: 'adventurous', label: 'Try something new', icon: '🌍' },
  { id: 'healthy', label: 'Healthy & light', icon: '🥗' },
  { id: 'indulgent', label: 'Treat myself', icon: '✨' },
  { id: 'quick', label: 'Quick bite', icon: '⚡' },
  { id: 'social', label: 'Impress someone', icon: '💫' },
];

const DISTANCES = [
  { id: 'nearby', label: 'Walking distance', sub: '< 1 km' },
  { id: 'short', label: 'Short ride', sub: '1-3 km' },
  { id: 'flexible', label: 'Anywhere good', sub: 'Any distance' },
];

const springConfig = { type: "spring" as const, stiffness: 320, damping: 22 };
const expandSpring = { type: "spring" as const, stiffness: 280, damping: 26 };

type ToastView = 'collapsed' | 'expanded' | 'confirmed' | 'dna' | 'deciding';
type DecideStep = 'mood' | 'distance' | 'thinking' | 'result';

export function AirbnbStyle() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [toastView, setToastView] = useState<ToastView>('collapsed');
  const [pickIndex, setPickIndex] = useState(0);
  const [decideStep, setDecideStep] = useState<DecideStep>('mood');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);

  const pick = PICKS[pickIndex];
  const alts = PICKS.filter((_, i) => i !== pickIndex).slice(0, 2);

  const handleTryAnother = useCallback(() => {
    setPickIndex(prev => (prev + 1) % PICKS.length);
  }, []);

  const handleLooksGreat = useCallback(() => {
    setToastView('confirmed');
    setTimeout(() => setToastView('collapsed'), 2200);
  }, []);

  const handleHelpDecide = useCallback(() => {
    setDecideStep('mood');
    setSelectedMood(null);
    setSelectedDistance(null);
    setToastView('deciding');
  }, []);

  const handleMoodSelect = useCallback((mood: string) => {
    setSelectedMood(mood);
    setTimeout(() => setDecideStep('distance'), 300);
  }, []);

  const handleDistanceSelect = useCallback((dist: string) => {
    setSelectedDistance(dist);
    setDecideStep('thinking');
    setTimeout(() => {
      setPickIndex(prev => (prev + 2) % PICKS.length);
      setDecideStep('result');
    }, 2000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-8 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .map-bg {
          background-color: #F0EDE8;
          background-image: 
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, transparent 25%, rgba(255,204,2,0.15) 50%, transparent 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
      `}} />
      
      <div className="relative w-[390px] h-[844px] bg-white rounded-[40px] border-[8px] border-gray-900 overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-[30px] bg-black rounded-b-3xl"></div>
        </div>

        <div className="absolute inset-0 map-bg z-0" onClick={() => setDrawerOpen(false)}>
          {MAP_PINS.map((pin, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + (i * 0.1), ...springConfig }}
              className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-sm z-10 cursor-pointer hover:scale-110"
              style={{ top: pin.top, left: pin.left }}
            >
              {pin.icon}
            </motion.div>
          ))}
        </div>

        <div className="relative z-20 pt-12 px-4 pb-4 pointer-events-none">
          <motion.div 
            className="flex items-center gap-3 w-full bg-white/90 backdrop-blur-md p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white pointer-events-auto"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="text-sm font-bold text-gray-900 leading-tight">What are you craving?</div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-0.5 text-red-500"><MapPin className="w-3 h-3" /> Sukhumvit</span>
                <span className="text-gray-300">•</span>
                <span>Any time</span>
                <span className="text-gray-300">•</span>
                <span>2 guests</span>
              </div>
            </div>
            <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
              <SlidersHorizontal className="w-4 h-4 text-gray-900" />
            </div>
          </motion.div>

          <AnimatePresence>
            {!drawerOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pointer-events-auto"
              >
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-100 ${i === 0 ? 'bg-gray-900 text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'}`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-[#F5F5F5] rounded-t-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 flex flex-col"
          animate={{ height: drawerOpen ? '82%' : '45%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-full pt-3 pb-2 flex justify-center cursor-pointer touch-none" onClick={() => setDrawerOpen(!drawerOpen)}>
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
            <div className="px-6 py-2 flex items-center justify-between">
              <img src="/__mockup/images/toast_logo.png" alt="Toast" className="h-12 object-contain" />
              <button onClick={() => setDrawerOpen(!drawerOpen)} className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                {drawerOpen ? 'See map' : 'See more'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 mt-4 relative">
              <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Wed · 7:30 PM · ☀️ 32°C</div>
              <h1 className="text-3xl font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-3 pr-16">Good evening,<br/>foodie.</h1>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">🍜 Thai food fan</span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                  <span className="text-[#FFCC02]">✨</span> 12-wk streak
                </span>
              </div>
            </div>

            <div className="px-6 mt-2 mb-8">
              <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3">Who's eating with you?</h2>
              <div className="flex gap-4">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col items-center justify-center text-center gap-2">
                  <div className="h-[80px] w-[80px] flex items-center justify-center">
                    <img src="/__mockup/images/toast_char.png" alt="Solo" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div><div className="font-bold text-gray-900">Solo</div><div className="text-xs text-gray-500 mt-0.5">Just for you</div></div>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col items-center justify-center text-center gap-2">
                  <div className="h-[80px] w-[80px] flex items-center justify-center relative">
                    <img src="/__mockup/images/toast_waffle.jpeg" alt="Group" className="max-h-[90px] max-w-[90px] object-contain" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div><div className="font-bold text-gray-900">Group</div><div className="text-xs text-gray-500 mt-0.5">With friends</div></div>
                </motion.div>
              </div>
            </div>

            {/* Toast Decides — Interactive Collapsible Card */}
            <div className="px-6 mb-10">
              <AnimatePresence mode="wait">
                {toastView === 'confirmed' ? (
                  <ConfirmedView key="confirmed" pick={pick} />
                ) : toastView === 'dna' ? (
                  <DNAView key="dna" pick={pick} onBack={() => setToastView('expanded')} />
                ) : toastView === 'deciding' ? (
                  <DecideFlow
                    key="deciding"
                    step={decideStep}
                    selectedMood={selectedMood}
                    selectedDistance={selectedDistance}
                    onMoodSelect={handleMoodSelect}
                    onDistanceSelect={handleDistanceSelect}
                    onClose={() => setToastView('expanded')}
                    pick={PICKS[(pickIndex + 2) % PICKS.length]}
                  />
                ) : (
                  <motion.div
                    key="card"
                    layout
                    transition={expandSpring}
                    className="bg-white rounded-[20px] border border-gray-100 relative overflow-hidden"
                    style={{ boxShadow: toastView === 'expanded' ? '0 8px 32px -8px rgba(0,0,0,0.10)' : '0 4px 20px rgba(0,0,0,0.03)' }}
                  >
                    <motion.div layout="position" className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #FFCC02, hsl(45, 90%, 65%))' }} />

                    <motion.div layout="position" className="p-4" onClick={() => toastView === 'collapsed' && setToastView('expanded')}>
                      {/* Header row */}
                      <motion.div layout="position" className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFCC02]" />
                          <span className="text-[12px] font-bold text-gray-900">Toast's pick for you</span>
                        </div>
                        <motion.div
                          animate={{ rotate: toastView === 'expanded' ? 180 : 0 }}
                          transition={expandSpring}
                          className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); setToastView(toastView === 'expanded' ? 'collapsed' : 'expanded'); }}
                        >
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      </motion.div>

                      {/* Restaurant row */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={pick.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          layout="position"
                          className="flex items-center gap-3"
                        >
                          <div className="relative w-[48px] h-[48px] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={pick.image.replace('w=600', 'w=200')} alt={pick.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-bold text-gray-900 truncate">{pick.name}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 truncate">{pick.cuisine} · {pick.district} · <Star className="w-3 h-3 inline text-[#FFCC02] fill-[#FFCC02] -mt-0.5" /> {pick.rating}</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <span className="text-[15px] font-bold text-emerald-600">{pick.match}%</span>
                            <p className="text-[9px] text-gray-400 font-medium">match</p>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Confidence bar */}
                      <motion.div layout="position" className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            key={pick.id}
                            initial={{ width: 0 }}
                            animate={{ width: `${pick.match}%` }}
                            transition={{ delay: 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full rounded-full"
                            style={{ background: pick.match >= 80 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #FFCC02, #eab308)' }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">confidence</span>
                      </motion.div>
                    </motion.div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {toastView === 'expanded' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={expandSpring}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <div className="border-t border-gray-100 pt-3">
                              {/* Hero image */}
                              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, ...expandSpring }} className="relative w-full h-[140px] rounded-2xl overflow-hidden mb-3">
                                <img src={pick.image} alt={pick.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute top-2.5 left-2.5 bg-[#FFCC02] text-gray-900 text-[10px] font-bold rounded-full px-2 py-0.5 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Top Pick
                                </div>
                                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                                  <span className="text-white/90 text-[11px] font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> {pick.district} · {pick.price}</span>
                                </div>
                              </motion.div>

                              {/* AI insight */}
                              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...expandSpring }} className="flex items-start gap-2 mb-3 bg-amber-50/60 rounded-xl px-3 py-2 border border-amber-100/50">
                                <Brain className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-amber-800 leading-relaxed">{pick.insight}</p>
                              </motion.div>

                              {/* Reason chips */}
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-1.5 mb-3">
                                {pick.chips.map((chip, i) => (
                                  <span key={i} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100">{chip}</span>
                                ))}
                              </motion.div>

                              {/* Score bars */}
                              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...expandSpring }} className="mb-3 space-y-1.5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Why this pick</p>
                                <ScoreBar label="Taste match" value={pick.scores.taste} color="#22c55e" />
                                <ScoreBar label="Right timing" value={pick.scores.timing} color="#FFCC02" />
                                <ScoreBar label="Popularity" value={pick.scores.popularity} color="#3b82f6" />
                                <ScoreBar label="Value" value={pick.scores.value} color="#8b5cf6" />
                              </motion.div>

                              {/* Action buttons */}
                              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ...expandSpring }} className="flex gap-2 mb-3">
                                <motion.button whileTap={{ scale: 0.96 }} onClick={handleLooksGreat} className="flex-1 h-11 rounded-xl bg-[#FFCC02] flex items-center justify-center gap-2 font-semibold text-sm text-gray-900">
                                  Looks great <ArrowRight className="w-4 h-4" />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.96 }} onClick={handleTryAnother} className="h-11 w-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500">
                                  <RotateCcw className="w-4 h-4" />
                                </motion.button>
                              </motion.div>

                              {/* Alternatives */}
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-2.5 mb-3">
                                {alts.map((alt) => (
                                  <div key={alt.id} className="flex-1 cursor-pointer" onClick={() => setPickIndex(PICKS.findIndex(p => p.id === alt.id))}>
                                    <div className="relative w-full h-[56px] rounded-xl overflow-hidden border border-gray-100">
                                      <img src={alt.image.replace('w=600', 'w=300').replace('q=60', 'q=40')} alt={alt.name} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                      <div className="absolute top-1.5 right-1.5 bg-emerald-500/90 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{alt.match}%</div>
                                      <p className="absolute bottom-1.5 left-1.5 text-white text-[10px] font-semibold drop-shadow">{alt.name}</p>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>

                              {/* Bottom actions */}
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex gap-2">
                                <button onClick={() => setToastView('dna')} className="flex-1 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-violet-700">
                                  <Brain className="w-3.5 h-3.5" /> Taste DNA
                                </button>
                                <button onClick={handleHelpDecide} className="flex-1 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-600">
                                  <Zap className="w-3.5 h-3.5" /> Help me decide
                                </button>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-6 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">PICK A VIBE</h2>
                <span className="text-xs font-semibold text-gray-500 flex items-center">Opens a world <ChevronRight className="w-3 h-3 ml-0.5" /></span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {VIBES.map((vibe, idx) => (
                  <motion.div
                    key={vibe.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.05), ...springConfig }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 cursor-pointer"
                  >
                    <div className="text-2xl">{vibe.icon}</div>
                    <div className="text-[11px] font-semibold text-gray-700">{vibe.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <RestaurantRow title="Your Usuals" subtitle="Places you love" restaurants={USUALS} />
            <RestaurantRow title="New near you" subtitle="Fresh spots to try" restaurants={NEW_NEAR} />
            <div className="h-10" />
          </div>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-[84px] bg-white border-t border-gray-100 flex justify-around items-start pt-3 px-6 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <NavItem icon={<Home className="w-6 h-6" />} label="Home" active />
          <NavItem icon={<MapIcon className="w-6 h-6" />} label="Map" />
          <NavItem icon={<Heart className="w-6 h-6" />} label="Saved" />
          <NavItem icon={<User className="w-6 h-6" />} label="Profile" />
        </div>
      </div>
    </div>
  );
}

function ConfirmedView({ pick }: { pick: typeof PICKS[0] }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={expandSpring}
      className="bg-white rounded-[20px] border border-emerald-200 overflow-hidden"
      style={{ boxShadow: '0 8px 32px -8px rgba(34,197,94,0.2)' }}
    >
      <div className="p-5 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
          className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-3"
        >
          <Check className="w-7 h-7 text-emerald-600" />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[16px] font-bold text-gray-900 mb-1">
          Great choice!
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[12px] text-gray-500 mb-4">
          Opening {pick.name} for you...
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img src={pick.image.replace('w=600', 'w=100')} alt={pick.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[12px] font-bold text-gray-900 truncate">{pick.name}</p>
            <p className="text-[10px] text-gray-500">{pick.district} · {pick.price}</p>
          </div>
          <span className="text-[12px] font-bold text-emerald-600">{pick.match}%</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DNAView({ pick, onBack }: { pick: typeof PICKS[0]; onBack: () => void }) {
  const dna = [
    { key: 'taste', label: 'Taste', icon: Heart, color: '#22c55e', value: pick.scores.taste },
    { key: 'timing', label: 'Timing', icon: Clock, color: '#FFCC02', value: pick.scores.timing },
    { key: 'trending', label: 'Trending', icon: TrendingUp, color: '#3b82f6', value: pick.scores.popularity },
    { key: 'value', label: 'Value', icon: Star, color: '#8b5cf6', value: pick.scores.value },
  ];
  const dominant = dna.reduce((a, b) => a.value > b.value ? a : b);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={expandSpring}
      className="bg-white rounded-[20px] border border-gray-100 overflow-hidden"
      style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.10)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px]" style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #22c55e, #FFCC02)' }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
              <Brain className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">Your Taste DNA</p>
              <p className="text-[10px] text-gray-400">How we picked these for you</p>
            </div>
          </div>
          <button onClick={onBack} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[11px] text-gray-500 mb-4 leading-relaxed bg-violet-50/50 rounded-xl px-3 py-2 border border-violet-100/50">
          <span className="font-semibold text-violet-700">{dominant.label}</span> is your strongest signal today — {dominant.key === 'taste' ? 'your flavor preferences drive these picks' : dominant.key === 'timing' ? "we're optimizing for this time of day" : dominant.key === 'trending' ? "you're aligned with what's popular nearby" : 'great value spots match your style'}
        </motion.p>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {dna.map(({ key, label, icon: Icon, color, value }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, ...expandSpring }}
              className="text-center"
            >
              <div className="w-10 h-10 rounded-xl mx-auto mb-1.5 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-[14px] font-bold text-gray-900">{value}%</p>
              <p className="text-[9px] text-gray-400 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="space-y-2 mb-4">
          {dna.map(({ key, label, color, value }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 w-[60px] flex-shrink-0">{label}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: 0.4, duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 w-[26px] text-right">{value}%</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onBack}
          whileTap={{ scale: 0.98 }}
          className="w-full h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center gap-2 text-[12px] font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Back to recommendation
        </motion.button>
      </div>
    </motion.div>
  );
}

function DecideFlow({ step, selectedMood, selectedDistance, onMoodSelect, onDistanceSelect, onClose, pick }: {
  step: DecideStep;
  selectedMood: string | null;
  selectedDistance: string | null;
  onMoodSelect: (m: string) => void;
  onDistanceSelect: (d: string) => void;
  onClose: () => void;
  pick: typeof PICKS[0];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={expandSpring}
      className="bg-white rounded-[20px] border border-gray-100 overflow-hidden"
      style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.10)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px]" style={{ background: 'linear-gradient(90deg, #FFCC02, hsl(45, 90%, 65%))' }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFCC02]" />
            <span className="text-[13px] font-bold text-gray-900">Help me decide</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {['mood', 'distance', 'result'].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                (step === 'mood' && i === 0) || (step === 'distance' && i <= 1) || (step === 'thinking' && i <= 1) || (step === 'result' && i <= 2) ? 'bg-[#FFCC02]' : 'bg-gray-200'
              }`} />
              {i < 2 && <div className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${
                (step === 'distance' && i === 0) || (step === 'thinking' && i <= 1) || (step === 'result') ? 'bg-[#FFCC02]' : 'bg-gray-200'
              }`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'mood' && (
            <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p className="text-[12px] text-gray-500 mb-3">What's your mood tonight?</p>
              <div className="grid grid-cols-2 gap-2">
                {MOODS.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onMoodSelect(mood.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                      selectedMood === mood.id ? 'border-[#FFCC02] bg-[#FFCC02]/10' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-lg">{mood.icon}</span>
                    <span className="text-[11px] font-semibold text-gray-800">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'distance' && (
            <motion.div key="distance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p className="text-[12px] text-gray-500 mb-3">How far are you willing to go?</p>
              <div className="space-y-2">
                {DISTANCES.map((dist) => (
                  <motion.button
                    key={dist.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDistanceSelect(dist.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                      selectedDistance === dist.id ? 'border-[#FFCC02] bg-[#FFCC02]/10' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-[12px] font-semibold text-gray-800">{dist.label}</span>
                    <span className="text-[10px] text-gray-400">{dist.sub}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'thinking' && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-3"
              >
                <img src="/__mockup/images/toast_mascot.png" alt="Thinking" className="w-full h-full object-contain" />
              </motion.div>
              <p className="text-[13px] font-bold text-gray-900 mb-2">Toast is thinking...</p>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#FFCC02]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                {['Analyzing your taste profile', 'Checking what\'s popular nearby', 'Finding something you\'ll love...'].map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.5 }}
                    className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.5 }}
                      className="text-emerald-500"
                    >✓</motion.span>
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={expandSpring}>
              <p className="text-[12px] text-gray-500 mb-3">Based on your mood, here's what I found:</p>
              <div className="relative w-full h-[130px] rounded-2xl overflow-hidden mb-3">
                <img src={pick.image} alt={pick.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 bg-emerald-500/90 text-white text-[11px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {pick.match}%
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <p className="text-white text-[16px] font-bold font-['Playfair_Display']">{pick.name}</p>
                  <p className="text-white/80 text-[11px]">{pick.cuisine} · {pick.district} · {pick.price}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {pick.chips.map((chip, i) => (
                  <span key={i} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100">{chip}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.96 }} onClick={onClose} className="flex-1 h-10 rounded-xl bg-[#FFCC02] flex items-center justify-center gap-2 font-semibold text-[13px] text-gray-900">
                  Let's go <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={onClose} className="h-10 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-1.5 text-[12px] font-medium text-gray-500">
                  <RotateCcw className="w-3.5 h-3.5" /> Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-gray-500 w-[68px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }} className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-semibold text-gray-900 w-[28px] text-right">{value}%</span>
    </div>
  );
}

function RestaurantRow({ title, subtitle, restaurants }: { title: string, subtitle?: string, restaurants: typeof USUALS }) {
  return (
    <div className="mb-10 overflow-hidden">
      <div className="px-6 mb-4">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-4 pt-1 snap-x snap-mandatory">
        {restaurants.map((restaurant, idx) => (
          <motion.div 
            key={restaurant.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + (idx * 0.04), ...springConfig }}
            whileHover={{ y: -3 }}
            className="min-w-[260px] snap-center cursor-pointer group"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-3 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-gray-900" />
              </div>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-['Playfair_Display'] font-bold text-gray-900 text-lg truncate pr-2">{restaurant.name}</h3>
                <div className="flex items-center gap-1 text-sm font-semibold flex-shrink-0 pt-0.5 text-gray-800">
                  <Star className="w-3.5 h-3.5 fill-[#FFCC02] text-[#FFCC02]" />
                  {restaurant.rating}
                </div>
              </div>
              <div className="text-[13px] text-gray-500 mb-0.5 truncate">{restaurant.desc}</div>
              <div className="text-[13px] text-gray-500 font-medium">{restaurant.cuisine} · {restaurant.price}</div>
            </div>
          </motion.div>
        ))}
        <div className="min-w-[4px] snap-center"></div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-[#FFCC02]' : 'text-gray-400 hover:text-gray-600'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}

export default AirbnbStyle;
