import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star, Sparkles, ArrowRight, ChevronRight, ChevronDown, RotateCcw, Zap, Brain, Clock, TrendingUp } from 'lucide-react';

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

const springConfig = { type: "spring" as const, stiffness: 320, damping: 22 };
const expandSpring = { type: "spring" as const, stiffness: 280, damping: 26 };

export function AirbnbStyle() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [toastExpanded, setToastExpanded] = useState(false);

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
                    whileHover={{ scale: 1.05 }}
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
          <div 
            className="w-full pt-3 pb-2 flex justify-center cursor-pointer touch-none"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
            
            <div className="px-6 py-2 flex items-center justify-between">
              <img src="/__mockup/images/toast_logo.png" alt="Toast" className="h-12 object-contain" />
              <button 
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                {drawerOpen ? 'See map' : 'See more'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 mt-4 relative">
              <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Wed · 7:30 PM · ☀️ 32°C
              </div>
              <h1 className="text-3xl font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-3 pr-16">
                Good evening,<br/>foodie.
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                  🍜 Thai food fan
                </span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                  <span className="text-[#FFCC02]">✨</span> 12-wk streak
                </span>
              </div>
            </div>

            <div className="px-6 mt-2 mb-8">
              <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3">Who's eating with you?</h2>
              <div className="flex gap-4">
                <motion.div 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col items-center justify-center text-center gap-2"
                >
                  <div className="h-[80px] w-[80px] flex items-center justify-center">
                    <img src="/__mockup/images/toast_char.png" alt="Solo" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Solo</div>
                    <div className="text-xs text-gray-500 mt-0.5">Just for you</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col items-center justify-center text-center gap-2"
                >
                  <div className="h-[80px] w-[80px] flex items-center justify-center relative">
                    <img src="/__mockup/images/toast_waffle.jpeg" alt="Group" className="max-h-[90px] max-w-[90px] object-contain" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Group</div>
                    <div className="text-xs text-gray-500 mt-0.5">With friends</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Toast Decides — Collapsible AI Card */}
            <div className="px-6 mb-10">
              <motion.div
                layout
                transition={expandSpring}
                className="bg-white rounded-[20px] border border-gray-100 relative overflow-hidden cursor-pointer"
                style={{ boxShadow: toastExpanded 
                  ? '0 8px 32px -8px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)' 
                  : '0 4px_20px rgba(0,0,0,0.03)' 
                }}
                onClick={() => !toastExpanded && setToastExpanded(true)}
              >
                <motion.div layout="position" className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #FFCC02, hsl(45, 90%, 65%))' }} />

                <motion.div layout="position" className="p-4">
                  {/* Collapsed: Compact teaser row */}
                  <motion.div layout="position" className="flex items-center gap-3">
                    <div className="relative w-[52px] h-[52px] rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=200&auto=format&fit=crop&q=60"
                        alt="Jay Fai"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFCC02] flex-shrink-0" />
                        <span className="text-[13px] font-bold text-gray-900 truncate">Jay Fai</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5 border border-emerald-100 flex-shrink-0">88%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">Michelin-starred Thai · Perfect for tonight</p>
                    </div>

                    <motion.div
                      animate={{ rotate: toastExpanded ? 180 : 0 }}
                      transition={expandSpring}
                      className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0"
                      onClick={(e) => { e.stopPropagation(); setToastExpanded(!toastExpanded); }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </motion.div>

                  {/* Mini match bar — always visible */}
                  <motion.div layout="position" className="mt-3">
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '88%' }}
                        transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a)' }}
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Expanded content */}
                <AnimatePresence>
                  {toastExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={expandSpring}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="border-t border-gray-100 pt-4">
                          {/* Hero image */}
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05, ...expandSpring }}
                            className="relative w-full h-[150px] rounded-2xl overflow-hidden mb-3 group"
                          >
                            <img
                              src="https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60"
                              alt="Jay Fai"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <div className="absolute top-3 left-3 bg-[#FFCC02] text-gray-900 text-[10px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Top Pick
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="flex items-center gap-2">
                                <span className="text-white/80 text-[11px] flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3" /> Old Town
                                </span>
                                <span className="text-white/50 text-[11px]">|</span>
                                <span className="text-white/80 text-[11px] flex items-center gap-0.5">
                                  <Star className="w-3 h-3 text-[#FFCC02]" /> 4.9
                                </span>
                                <span className="text-white/50 text-[11px]">|</span>
                                <span className="text-white/80 text-[11px]">฿฿฿</span>
                              </div>
                            </div>
                          </motion.div>

                          {/* AI insight */}
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, ...expandSpring }}
                            className="flex items-start gap-2 mb-3 bg-amber-50/60 rounded-xl px-3 py-2 border border-amber-100/50"
                          >
                            <Brain className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-amber-800 leading-relaxed">You loved Thai street food last 3 visits — this Michelin-starred gem matches your profile</p>
                          </motion.div>

                          {/* Reason chips */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-wrap gap-1.5 mb-3"
                          >
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100">Highly rated</span>
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100">Perfect for dinner</span>
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100">Thai street food</span>
                          </motion.div>

                          {/* Taste DNA scores */}
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, ...expandSpring }}
                            className="mb-3 space-y-1.5"
                          >
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Why this pick</p>
                            <ScoreBar label="Taste match" value={85} color="#22c55e" />
                            <ScoreBar label="Right timing" value={78} color="#FFCC02" />
                            <ScoreBar label="Popularity" value={92} color="#3b82f6" />
                            <ScoreBar label="Value" value={70} color="#8b5cf6" />
                          </motion.div>

                          {/* Action buttons */}
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, ...expandSpring }}
                            className="flex gap-2 mb-3"
                          >
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              className="flex-1 h-11 rounded-xl bg-[#FFCC02] flex items-center justify-center gap-2 font-semibold text-sm text-gray-900"
                            >
                              Looks great <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              className="h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </motion.button>
                          </motion.div>

                          {/* Alternatives */}
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, ...expandSpring }}
                            className="flex gap-2.5 mb-3"
                          >
                            <div className="flex-1 cursor-pointer">
                              <div className="relative w-full h-[60px] rounded-xl overflow-hidden mb-1 border border-gray-100">
                                <img src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&auto=format&fit=crop&q=40" alt="Thipsamai" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute top-1.5 right-1.5 bg-emerald-500/90 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">82%</div>
                                <p className="absolute bottom-1.5 left-1.5 text-white text-[10px] font-semibold drop-shadow">Thipsamai</p>
                              </div>
                            </div>
                            <div className="flex-1 cursor-pointer">
                              <div className="relative w-full h-[60px] rounded-xl overflow-hidden mb-1 border border-gray-100">
                                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=40" alt="Peppina" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute top-1.5 right-1.5 bg-emerald-500/90 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">79%</div>
                                <p className="absolute bottom-1.5 left-1.5 text-white text-[10px] font-semibold drop-shadow">Peppina</p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Bottom row: DNA + Refine */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="flex gap-2"
                          >
                            <button className="flex-1 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-violet-700">
                              <Brain className="w-3.5 h-3.5" /> Taste DNA
                            </button>
                            <button className="flex-1 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-500">
                              <Zap className="w-3.5 h-3.5" /> Help me decide
                            </button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Pick a Vibe Grid */}
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

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-gray-500 w-[68px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
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
              <div className="text-[13px] text-gray-500 font-medium">
                {restaurant.cuisine} · {restaurant.price}
              </div>
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
