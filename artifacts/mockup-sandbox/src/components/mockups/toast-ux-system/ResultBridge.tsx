import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, MapPin, Star, Clock, Navigation, ChevronRight, Sparkles,
  IceCream, Wine, Music, Calendar, Utensils, ArrowRight,
  ChevronDown, X, Bookmark
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };

const RESULT = {
  title: 'Gaggan Anand',
  type: 'Progressive Indian · Fine Dining',
  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60',
  rating: '4.8',
  location: 'Sukhumvit 31',
  distance: '1.8 km',
  time: 'Open until 10:30pm',
  price: '฿฿฿฿',
  matchScore: 95,
};

const NEXT_STEPS = [
  { id: 'dessert', emoji: '🍰', icon: IceCream, label: 'Dessert', sub: 'Something sweet after', color: 'from-pink-100 to-rose-100' },
  { id: 'drinks', emoji: '🍷', icon: Wine, label: 'Drinks', sub: 'Cocktails or wine bar', color: 'from-purple-100 to-violet-100' },
  { id: 'fun', emoji: '🎯', icon: Sparkles, label: 'Something fun', sub: 'Activities nearby', color: 'from-amber-100 to-yellow-100' },
  { id: 'events', emoji: '🎶', icon: Music, label: 'Events nearby', sub: 'Live music, markets', color: 'from-sky-100 to-blue-100' },
  { id: 'food-before', emoji: '🥟', icon: Utensils, label: 'Add food before', sub: 'Quick bite first', color: 'from-emerald-100 to-green-100' },
];

const DESSERT_PICKS = [
  {
    id: 1,
    title: 'After You',
    type: 'Dessert Cafe',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60',
    rating: '4.6',
    distance: '0.4 km',
    why: '5 min walk from dinner — perfect timing',
  },
  {
    id: 2,
    title: 'Gram Pancakes',
    type: 'Japanese Souffle',
    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600&auto=format&fit=crop&q=60',
    rating: '4.4',
    distance: '0.8 km',
    why: 'Light & fluffy — good contrast after rich meal',
  },
  {
    id: 3,
    title: 'Chadatip Ice Cream',
    type: 'Thai Artisan',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=60',
    rating: '4.7',
    distance: '0.3 km',
    why: 'Closest option — seasonal Thai flavors',
  },
];

export default function ResultBridge() {
  const [saved, setSaved] = useState(false);
  const [selectedNext, setSelectedNext] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleNextStep = useCallback((id: string) => {
    setSelectedNext(id);
    setShowRecommendations(true);
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] font-['Figtree',sans-serif] relative overflow-hidden pb-6">
      <div className="relative">
        <div className="h-[280px] relative">
          <img src={RESULT.image} alt={RESULT.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-black/20 to-transparent" />

          <div className="absolute top-12 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500 rounded-full">
              <Check size={12} className="text-white" />
              <span className="text-[12px] font-bold text-white">Decided!</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSaved(!saved)}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Bookmark size={16} className={saved ? 'text-[#FFCC02] fill-[#FFCC02]' : 'text-neutral-600'} />
            </motion.button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] font-bold text-[#FFCC02] bg-neutral-900/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {RESULT.matchScore}% match
              </span>
            </div>
            <h1 className="text-[26px] font-bold text-white leading-tight">{RESULT.title}</h1>
            <p className="text-[14px] text-white/80 mt-0.5">{RESULT.type}</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-4">
        <div className="flex items-center gap-4 text-[12px] text-neutral-500">
          <span className="flex items-center gap-1"><MapPin size={11} /> {RESULT.distance}</span>
          <span className="flex items-center gap-1"><Star size={11} className="text-[#FFCC02] fill-[#FFCC02]" /> {RESULT.rating}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {RESULT.time}</span>
          <span className="font-semibold">{RESULT.price}</span>
        </div>

        <div className="flex gap-2 mt-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="flex-1 h-12 bg-[#FFCC02] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
          >
            <Navigation size={14} />
            Navigate
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="h-12 px-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-center gap-2 font-semibold text-[13px] text-neutral-600"
          >
            <Calendar size={14} />
            Reserve
          </motion.button>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#FFCC02]" />
          <h2 className="text-[18px] font-bold text-neutral-900">What next?</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {NEXT_STEPS.map((step, i) => (
            <motion.button
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleNextStep(step.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all ${
                selectedNext === step.id
                  ? 'bg-[#FFCC02]/10 border-[#FFCC02]'
                  : 'bg-white border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
            >
              <span className="text-[20px]">{step.emoji}</span>
              <div className="text-left">
                <p className="text-[13px] font-semibold text-neutral-900">{step.label}</p>
                <p className="text-[11px] text-neutral-500">{step.sub}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showRecommendations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowRecommendations(false)}
          >
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={spring}
              className="w-full bg-[#FAFAF8] rounded-t-3xl max-h-[70vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 pt-5 pb-2 flex items-center justify-between sticky top-0 bg-[#FAFAF8] z-10">
                <div>
                  <p className="text-[12px] font-semibold text-[#FFCC02] uppercase tracking-wider">After dinner</p>
                  <h3 className="text-[20px] font-bold text-neutral-900 mt-0.5">Dessert picks</h3>
                </div>
                <button onClick={() => setShowRecommendations(false)}>
                  <X size={20} className="text-neutral-400" />
                </button>
              </div>

              <div className="px-6 pb-8 mt-2 flex flex-col gap-3">
                {DESSERT_PICKS.map((pick, i) => (
                  <motion.div
                    key={pick.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
                  >
                    <div className="flex">
                      <div className="w-[90px] h-[100px] flex-shrink-0">
                        <img src={pick.image} alt={pick.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[15px] font-bold text-neutral-900">{pick.title}</p>
                          <div className="flex items-center gap-0.5">
                            <Star size={10} className="text-[#FFCC02] fill-[#FFCC02]" />
                            <span className="text-[11px] font-semibold text-neutral-600">{pick.rating}</span>
                          </div>
                        </div>
                        <p className="text-[12px] text-neutral-500">{pick.type} · {pick.distance}</p>
                        <div className="flex items-center gap-1 mt-2 bg-amber-50 rounded-lg px-2 py-1">
                          <Sparkles size={9} className="text-[#FFCC02]" />
                          <p className="text-[10px] text-amber-700 font-medium">{pick.why}</p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-neutral-50 text-[13px] font-semibold text-[#FFCC02]"
                    >
                      <Check size={13} />
                      Add to plan
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
