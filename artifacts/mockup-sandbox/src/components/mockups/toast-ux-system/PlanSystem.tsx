import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, ChevronUp, ChevronDown, X, GripVertical, Clock, MapPin,
  Navigation, Share2, ArrowRight, Check, Sparkles, Trash2,
  RefreshCw, Users, ExternalLink
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };

interface PlanStep {
  id: string;
  title: string;
  type: string;
  emoji: string;
  time: string;
  location: string;
  distance: string;
  confirmed: boolean;
}

const INITIAL_STEPS: PlanStep[] = [
  { id: '1', title: 'Gaggan Anand', type: 'Dinner', emoji: '🍽️', time: '7:00 PM', location: 'Sukhumvit 31', distance: '', confirmed: true },
  { id: '2', title: 'After You', type: 'Dessert', emoji: '🍰', time: '9:15 PM', location: 'Thonglor', distance: '0.4 km', confirmed: true },
  { id: '3', title: 'Octave Rooftop', type: 'Drinks', emoji: '🍷', time: '10:00 PM', location: 'Thonglor', distance: '0.6 km', confirmed: false },
];

export default function PlanSystem() {
  const [expanded, setExpanded] = useState(false);
  const [steps, setSteps] = useState<PlanStep[]>(INITIAL_STEPS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const removeStep = useCallback((id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id));
  }, []);

  const moveStep = useCallback((id: string, dir: 'up' | 'down') => {
    setSteps(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (dir === 'up' && idx > 0) {
        const next = [...prev];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      }
      if (dir === 'down' && idx < prev.length - 1) {
        const next = [...prev];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        return next;
      }
      return prev;
    });
  }, []);

  const confirmedCount = steps.filter(s => s.confirmed).length;

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] font-['Figtree',sans-serif] relative overflow-hidden">
      <div className="px-6 pt-14 pb-4">
        <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Tonight</p>
        <h1 className="text-[26px] font-bold text-neutral-900 mt-1 leading-tight">Your plan</h1>
        <p className="text-[13px] text-neutral-500 mt-1">{steps.length} stops · {confirmedCount} confirmed</p>
      </div>

      <div className="px-6">
        <div className="relative">
          <div className="absolute left-[19px] top-6 bottom-6 w-px bg-neutral-200 z-0" />

          <div className="flex flex-col gap-0 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ ...spring, delay: i * 0.06 }}
                className="flex gap-3 pb-4"
              >
                <div className="flex flex-col items-center pt-4 flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] ring-2 ${
                    step.confirmed ? 'ring-[#FFCC02] bg-amber-50' : 'ring-neutral-200 bg-neutral-50'
                  }`}>
                    {step.emoji}
                  </div>
                  {i < steps.length - 1 && step.confirmed && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="w-px h-full bg-[#FFCC02] origin-top mt-1"
                    />
                  )}
                </div>

                <div className={`flex-1 bg-white rounded-2xl border overflow-hidden transition-all ${
                  dragId === step.id ? 'shadow-lg border-[#FFCC02]' : 'border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                }`}>
                  <div className="p-3.5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] font-bold text-neutral-900">{step.title}</p>
                          {step.confirmed && (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <Check size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-[12px] text-neutral-500 mt-0.5">{step.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => moveStep(step.id, 'up')}
                          className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center"
                        >
                          <ChevronUp size={12} className="text-neutral-400" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => moveStep(step.id, 'down')}
                          className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center"
                        >
                          <ChevronDown size={12} className="text-neutral-400" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2.5 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1"><Clock size={10} /> {step.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {step.location}</span>
                      {step.distance && (
                        <span className="flex items-center gap-1"><Navigation size={10} /> {step.distance}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex border-t border-neutral-50">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-neutral-500"
                    >
                      <RefreshCw size={10} />
                      Swap
                    </motion.button>
                    <div className="w-px bg-neutral-50" />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeStep(step.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-red-400"
                    >
                      <Trash2 size={10} />
                      Remove
                    </motion.button>
                    <div className="w-px bg-neutral-50" />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-neutral-500"
                    >
                      <Clock size={10} />
                      Time
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowAddSheet(true)}
            className="ml-[52px] w-[calc(100%-52px)] h-12 border-2 border-dashed border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-[13px] font-semibold text-neutral-400"
          >
            <Plus size={16} />
            Add next step
          </motion.button>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-neutral-600">Route overview</p>
            <span className="text-[12px] text-neutral-400">~3 hrs total</span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[14px]">{step.emoji}</span>
                  <span className="text-[9px] text-neutral-400 mt-0.5">{step.time.replace(' PM', 'pm')}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-px bg-neutral-200" />
                    <span className="text-[9px] text-neutral-300">{steps[i + 1].distance || '–'}</span>
                    <div className="w-6 h-px bg-neutral-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 mt-4 flex gap-2 pb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowShareSheet(true)}
          className="flex-1 h-14 bg-[#FFCC02] rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
        >
          <Share2 size={16} className="text-neutral-900" />
          <span className="text-[15px] font-bold text-neutral-900">Send to LINE</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="h-14 px-5 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center"
        >
          <Users size={16} className="text-neutral-600" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showShareSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowShareSheet(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={spring}
              className="w-full bg-white rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold text-neutral-900">Share plan</h3>
                <button onClick={() => setShowShareSheet(false)}>
                  <X size={20} className="text-neutral-400" />
                </button>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 mb-4">
                <p className="text-[14px] font-bold text-neutral-900 mb-2">Tonight's plan</p>
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2 py-1.5">
                    <span className="text-[14px]">{step.emoji}</span>
                    <span className="text-[13px] font-medium text-neutral-700">{step.title}</span>
                    <span className="text-[11px] text-neutral-400 ml-auto">{step.time}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full h-13 bg-[#06C755] rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-white"
                style={{ height: 52 }}
              >
                <ExternalLink size={16} />
                Send via LINE
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {showAddSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowAddSheet(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={spring}
              className="w-full bg-white rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-neutral-900">Add to plan</h3>
                <button onClick={() => setShowAddSheet(false)}>
                  <X size={20} className="text-neutral-400" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { emoji: '🍰', label: 'Dessert' },
                  { emoji: '🍷', label: 'Drinks' },
                  { emoji: '🎯', label: 'Activity' },
                  { emoji: '🎶', label: 'Events' },
                  { emoji: '☕', label: 'Coffee' },
                  { emoji: '🍜', label: 'Late-night food' },
                ].map((opt) => (
                  <motion.button
                    key={opt.label}
                    whileTap={{ scale: 0.94 }}
                    className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-100"
                  >
                    <span className="text-[18px]">{opt.emoji}</span>
                    <span className="text-[13px] font-semibold text-neutral-700">{opt.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 bg-amber-50 rounded-xl p-3 flex items-start gap-2">
                <Sparkles size={14} className="text-[#FFCC02] mt-0.5 flex-shrink-0" />
                <p className="text-[12px] text-amber-700 font-medium">Toast will find options that fit your timeline and location</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
