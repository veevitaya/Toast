import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Wallet, Star, ChevronRight, Sparkles, RotateCcw,
  Check, ArrowRight, X, ThumbsDown, Shuffle
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };

const ACTIVITIES = [
  {
    id: 1,
    title: 'Teens of Thailand',
    type: 'Cocktail Bar',
    vibe: 'Chill',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=60',
    location: 'Khao San area',
    distance: '1.2 km',
    time: 'Open now · until 1am',
    price: '฿฿',
    rating: '4.7',
    why: 'Matches your chill vibe + great for the time of night',
  },
  {
    id: 2,
    title: 'Escape Room BKK',
    type: 'Activity',
    vibe: 'Fun',
    image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600&auto=format&fit=crop&q=60',
    location: 'Siam Square',
    distance: '2.4 km',
    time: 'Last session 9pm',
    price: '฿฿',
    rating: '4.5',
    why: 'Trending tonight — 3 groups booked in last hour',
  },
  {
    id: 3,
    title: 'Rooftop at Sathorn',
    type: 'Sky Bar',
    vibe: 'Views',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60',
    location: 'Sathorn',
    distance: '3.1 km',
    time: 'Best at sunset',
    price: '฿฿฿',
    rating: '4.8',
    why: 'Perfect sunset timing — golden hour in 40 min',
  },
  {
    id: 4,
    title: 'Night Market Walk',
    type: 'Market',
    vibe: 'Explore',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60',
    location: 'Ratchada',
    distance: '4.0 km',
    time: 'Open until midnight',
    price: '฿',
    rating: '4.3',
    why: 'Budget-friendly + foodie heaven — fits your style',
  },
];

const REFINE_CHIPS = [
  { id: 'far', label: 'Too far', icon: MapPin },
  { id: 'pricey', label: 'Too pricey', icon: Wallet },
  { id: 'vibe', label: 'Not my vibe', icon: ThumbsDown },
  { id: 'fun', label: 'More fun', icon: Sparkles },
  { id: 'chill', label: 'More chill', icon: Star },
  { id: 'indoor', label: 'Indoor', icon: Check },
];

export default function SoloDecision() {
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [activeRefine, setActiveRefine] = useState<Set<string>>(new Set());
  const [showRefine, setShowRefine] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const visibleActivities = ACTIVITIES.filter(a => !dismissed.has(a.id));

  const handlePick = useCallback((id: number) => {
    setPickedId(id);
  }, []);

  const handleDismiss = useCallback((id: number) => {
    setDismissed(prev => new Set([...prev, id]));
  }, []);

  const toggleRefine = useCallback((id: string) => {
    setActiveRefine(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] font-['Figtree',sans-serif] relative overflow-hidden">
      <div className="px-6 pt-14 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#FFCC02]" />
          <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Something fun · Solo</p>
        </div>
        <h1 className="text-[26px] font-bold text-neutral-900 leading-tight">
          Best fits for tonight
        </h1>
        <p className="text-[14px] text-neutral-500 mt-1">
          Curated for your vibe · {visibleActivities.length} picks
        </p>
      </div>

      <div className="px-6 mt-4 flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {visibleActivities.map((act, i) => (
            <motion.div
              key={act.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ ...spring, delay: i * 0.05 }}
              className={`relative bg-white rounded-2xl border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                pickedId === act.id
                  ? 'border-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.2)]'
                  : 'border-neutral-100'
              }`}
            >
              <div className="flex">
                <div className="w-[100px] h-[120px] relative flex-shrink-0">
                  <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded-full">
                    <p className="text-[10px] font-semibold text-white">{act.vibe}</p>
                  </div>
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-bold text-neutral-900">{act.title}</p>
                      <div className="flex items-center gap-0.5">
                        <Star size={11} className="text-[#FFCC02] fill-[#FFCC02]" />
                        <p className="text-[12px] font-semibold text-neutral-600">{act.rating}</p>
                      </div>
                    </div>
                    <p className="text-[12px] text-neutral-500 mt-0.5">{act.type}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <MapPin size={10} /> {act.distance}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <Clock size={10} /> {act.time}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-500">{act.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 bg-amber-50 rounded-lg px-2 py-1">
                    <Sparkles size={10} className="text-[#FFCC02]" />
                    <p className="text-[11px] text-amber-700 font-medium">{act.why}</p>
                  </div>
                </div>
              </div>

              <div className="flex border-t border-neutral-50">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePick(act.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold transition-colors ${
                    pickedId === act.id ? 'text-[#FFCC02]' : 'text-neutral-600'
                  }`}
                >
                  {pickedId === act.id ? <Check size={14} /> : <ArrowRight size={14} />}
                  {pickedId === act.id ? 'Picked!' : 'Pick this'}
                </motion.button>
                <div className="w-px bg-neutral-100" />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDismiss(act.id)}
                  className="flex items-center justify-center gap-1 px-4 py-2.5 text-[12px] text-neutral-400"
                >
                  <X size={12} />
                  Skip
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-6 mt-5 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowRefine(!showRefine)}
          className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border text-[13px] font-semibold transition-all ${
            showRefine ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
          }`}
        >
          <RotateCcw size={14} />
          Refine
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white border border-neutral-200 text-[13px] font-semibold text-neutral-600"
        >
          <Shuffle size={14} />
          Decide for me
        </motion.button>
      </div>

      <AnimatePresence>
        {showRefine && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mt-3 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {REFINE_CHIPS.map((chip) => (
                <motion.button
                  key={chip.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => toggleRefine(chip.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium border transition-all ${
                    activeRefine.has(chip.id)
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-600 border-neutral-200'
                  }`}
                >
                  <chip.icon size={12} />
                  {chip.label}
                </motion.button>
              ))}
            </div>
            {activeRefine.size > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.97 }}
                className="mt-3 w-full h-10 bg-[#FFCC02] rounded-xl text-[13px] font-bold text-neutral-900"
              >
                Refresh picks
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {pickedId && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={bouncy}
          className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
          >
            <span className="text-[16px] font-bold text-neutral-900">Continue with this</span>
            <ChevronRight size={18} className="text-neutral-900" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
