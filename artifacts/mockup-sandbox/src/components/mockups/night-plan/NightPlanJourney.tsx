import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, X, Star, Heart, MapPin, Clock,
  ChevronRight, ChevronDown, Sparkles, Users, Flame, Moon, Sun,
  Wine, Music, Gamepad2, Clapperboard, Coffee, Footprints, Share2,
  Bookmark, Navigation, Plus, ChevronUp, Wallet, Zap, Eye
} from 'lucide-react';

const spring = { type: "spring" as const, stiffness: 280, damping: 26 };
const bouncy = { type: "spring" as const, stiffness: 350, damping: 20 };
const gentle = { type: "spring" as const, stiffness: 200, damping: 28 };

type Screen = 'modeSelect' | 'context' | 'planFeed' | 'planDetail' | 'continueNight';

const MODES = [
  { id: 'date', emoji: '💕', label: 'Date Night', sub: 'Romantic & intimate', gradient: 'from-rose-400 to-pink-500', tone: 'A safe bet for a first date.' },
  { id: 'group', emoji: '👯', label: 'Group Hangout', sub: 'Fun & shareable', gradient: 'from-amber-400 to-[#FFCC02]', tone: 'Made for catching up.' },
  { id: 'tourist', emoji: '✈️', label: 'Friends in Town', sub: 'Show them Bangkok', gradient: 'from-sky-400 to-blue-500', tone: 'Show them a good time.' },
  { id: 'celebrate', emoji: '🎉', label: 'Celebration', sub: 'Make it special', gradient: 'from-purple-400 to-violet-500', tone: 'Something worth remembering.' },
  { id: 'chill', emoji: '🍃', label: 'Chill Night', sub: 'Low-effort vibes', gradient: 'from-green-400 to-emerald-500', tone: 'Good energy, low effort.' },
  { id: 'late', emoji: '🌙', label: 'Late Night', sub: 'After 9pm energy', gradient: 'from-indigo-400 to-purple-600', tone: 'The night is young.' },
  { id: 'budget', emoji: '💰', label: 'Budget Night', sub: 'Great time, less spend', gradient: 'from-orange-400 to-amber-500', tone: 'Cheap thrills, real joy.' },
  { id: 'surprise', emoji: '🎲', label: 'Surprise Me', sub: 'Let Toast decide', gradient: 'from-[#FFCC02] to-amber-500', tone: "Trust us on this one." },
];

const MOODS = [
  { emoji: '🕯️', label: 'Intimate' },
  { emoji: '⚡', label: 'High energy' },
  { emoji: '🍷', label: 'Classy' },
  { emoji: '🌃', label: 'Chill vibes' },
  { emoji: '🎉', label: 'Celebratory' },
  { emoji: '🤫', label: 'Hidden gem' },
];

const AREAS = [
  { emoji: '🎶', label: 'Thonglor' },
  { emoji: '🚇', label: 'Sukhumvit' },
  { emoji: '🏙️', label: 'Siam' },
  { emoji: '🌳', label: 'Ari' },
  { emoji: '🏢', label: 'Silom' },
  { emoji: '🌊', label: 'Riverside' },
];

const PLANS = [
  {
    id: 1,
    title: 'Thonglor After Dark',
    vibe: 'Chill → Lively',
    budget: '฿฿฿',
    duration: '4–5 hrs',
    confidence: 94,
    summary: 'Start with intimate omakase, wind through a speakeasy, end at a rooftop with skyline views.',
    why: 'This one feels easy. Great flow, zero dead time.',
    heroImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60',
    tags: ['Editor\'s Pick', 'Date Night'],
    stops: [
      { seq: 1, role: 'Dinner', name: 'Sushi Masato', category: 'Japanese Omakase', time: '7:00 PM', duration: '90 min', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60', icon: '🍣', transition: '5 min walk', rating: '4.9', price: 4 },
      { seq: 2, role: 'Cocktails', name: 'Rabbit Hole', category: 'Speakeasy Bar', time: '8:45 PM', duration: '60 min', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&auto=format&fit=crop&q=60', icon: '🍸', transition: '8 min walk', rating: '4.7', price: 3 },
      { seq: 3, role: 'Nightcap', name: 'Octave Rooftop', category: 'Rooftop Bar', time: '10:00 PM', duration: 'Until close', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60', icon: '🌃', transition: null, rating: '4.6', price: 3 },
    ],
    backup: { name: 'Iron Fairies', note: 'If Rabbit Hole is packed, try this magical bar next door.' },
  },
  {
    id: 2,
    title: 'Old Town Soul',
    vibe: 'Cultural → Electric',
    budget: '฿฿',
    duration: '3–4 hrs',
    confidence: 89,
    summary: 'Street food legends in Chinatown, craft cocktails by the river, and jazz to close.',
    why: 'Made for catching up. Local confidence with a side of adventure.',
    heroImage: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800&auto=format&fit=crop&q=60',
    tags: ['Best Value', 'Friends'],
    stops: [
      { seq: 1, role: 'Dinner', name: 'Jay Fai', category: 'Thai Street Food', time: '6:30 PM', duration: '75 min', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60', icon: '🍳', transition: '10 min taxi', rating: '4.9', price: 3 },
      { seq: 2, role: 'Drinks', name: 'Tropic City', category: 'Tiki Cocktail Bar', time: '8:00 PM', duration: '60 min', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=60', icon: '🍹', transition: '5 min walk', rating: '4.5', price: 2 },
      { seq: 3, role: 'Live Music', name: 'Saxophone Pub', category: 'Jazz & Blues', time: '9:15 PM', duration: 'Until close', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=60', icon: '🎷', transition: null, rating: '4.4', price: 2 },
    ],
    backup: { name: 'Teens of Thailand', note: 'A gin-focused micro-bar steps away from Tropic City.' },
  },
  {
    id: 3,
    title: 'Sukhumvit Indulgence',
    vibe: 'Luxe → Smooth',
    budget: '฿฿฿฿',
    duration: '4 hrs',
    confidence: 92,
    summary: 'Progressive Indian tasting menu, wine at a hidden bar, and a dessert omakase finale.',
    why: 'Something worth remembering. Every stop is a conversation starter.',
    heroImage: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60',
    tags: ['Premium', 'Celebration'],
    stops: [
      { seq: 1, role: 'Dinner', name: 'Gaggan Anand', category: 'Progressive Indian', time: '7:00 PM', duration: '2 hrs', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60', icon: '✨', transition: '5 min walk', rating: '4.8', price: 4 },
      { seq: 2, role: 'Wine Bar', name: 'Quince', category: 'Natural Wine Bar', time: '9:15 PM', duration: '45 min', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=60', icon: '🍷', transition: '3 min walk', rating: '4.6', price: 3 },
      { seq: 3, role: 'Dessert', name: 'Shugaa', category: 'Dessert Omakase', time: '10:15 PM', duration: '45 min', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=60', icon: '🍰', transition: null, rating: '4.7', price: 3 },
    ],
    backup: { name: 'Smalls', note: 'Intimate jazz bar if you want one more stop.' },
  },
];

const CONTINUE_OPTIONS = [
  { emoji: '🍰', label: 'Dessert spot', sub: 'Something sweet nearby', category: 'dessert' },
  { emoji: '🍸', label: 'One more drink', sub: 'Bar within walking distance', category: 'drinks' },
  { emoji: '🎤', label: 'Karaoke', sub: 'Sing the night away', category: 'activity' },
  { emoji: '🎮', label: 'Board game café', sub: 'Wind down with games', category: 'activity' },
  { emoji: '🌃', label: 'Rooftop views', sub: 'End on a high note', category: 'drinks' },
  { emoji: '🛒', label: 'Night market', sub: 'Late-night street food stroll', category: 'explore' },
];

const CONTINUE_SUGGESTIONS = [
  { name: 'After You', category: 'Dessert Café', distance: '4 min walk', rating: '4.6', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=60', emoji: '🍰', why: 'Famous kakigori shaved ice — perfect to wind down.' },
  { name: 'Lucky Strike', category: 'Karaoke Lounge', distance: '6 min walk', rating: '4.3', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=60', emoji: '🎤', why: 'Private rooms, drinks menu, open until 2 AM.' },
  { name: 'Tichuca Rooftop', category: 'Rooftop Bar', distance: '10 min taxi', rating: '4.7', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60', emoji: '🌃', why: 'Dramatic treehouse vibes with skyline panorama.' },
];

function StopDot({ active, completed }: { active: boolean; completed: boolean }) {
  return (
    <div className={`w-3 h-3 rounded-full border-2 transition-all ${completed ? 'bg-[#FFCC02] border-[#FFCC02]' : active ? 'bg-white border-[#FFCC02] ring-2 ring-[#FFCC02]/20' : 'bg-gray-200 border-gray-200'}`} />
  );
}

export function NightPlanJourney() {
  const [screen, setScreen] = useState<Screen>('modeSelect');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [savedPlans, setSavedPlans] = useState<Set<number>>(new Set());
  const [likedPlans, setLikedPlans] = useState<Set<number>>(new Set());
  const [showContinue, setShowContinue] = useState(false);
  const [selectedContinue, setSelectedContinue] = useState<string | null>(null);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const toggleMood = useCallback((label: string) => {
    setSelectedMoods(prev => prev.includes(label) ? prev.filter(m => m !== label) : prev.length < 2 ? [...prev, label] : prev);
  }, []);

  const toggleSave = useCallback((id: number) => {
    setSavedPlans(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const toggleLike = useCallback((id: number) => {
    setLikedPlans(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const resetFlow = useCallback(() => {
    setScreen('modeSelect'); setSelectedMode(null); setSelectedMoods([]); setSelectedArea(null);
    setSelectedBudget(null); setSelectedPlan(null); setSavedPlans(new Set()); setLikedPlans(new Set());
    setShowContinue(false); setSelectedContinue(null); setActiveStopIndex(0);
  }, []);

  const canProceedContext = !!selectedArea || selectedMoods.length > 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap');
        .no-sb::-webkit-scrollbar { display: none; }
        .no-sb { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="relative w-[390px] h-[844px] bg-[#FAFAF8] rounded-[44px] overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.4)] border border-gray-200/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-black rounded-b-[18px] z-[100]" />

        <div className="h-full flex flex-col relative">
          <AnimatePresence mode="wait">

            {/* ══════════════════════════════════════════════════ */}
            {/* SCREEN 1: MODE SELECTION                          */}
            {/* ══════════════════════════════════════════════════ */}
            {screen === 'modeSelect' && (
              <motion.div key="modeSelect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto no-sb pb-8">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFCC02]/10 via-amber-50/40 to-[#FAFAF8]" />
                    <div className="relative pt-16 px-6 pb-5">
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...gentle }} className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_2px_8px_rgba(255,204,2,0.3)]"><span className="text-sm font-black">🍞</span></div>
                        <span className="text-[13px] font-bold text-gray-900">Toast</span>
                      </motion.div>
                      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ...gentle }} className="text-[30px] font-['Playfair_Display'] font-bold text-gray-900 leading-[1.1] mb-1">What kind of night<br/>are we building?</motion.h1>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-[13px] text-gray-400 font-medium">Pick a moment, we'll plan the rest</motion.p>
                    </div>
                  </div>

                  <div className="px-5 space-y-2.5">
                    {MODES.map((mode, i) => {
                      const on = selectedMode === mode.id;
                      return (
                        <motion.button key={mode.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04, ...spring }} whileTap={{ scale: 0.97 }}
                          onClick={() => { setSelectedMode(on ? null : mode.id); }}
                          className={`w-full rounded-2xl p-4 flex items-center gap-4 border-2 transition-all text-left relative overflow-hidden
                            ${on ? 'border-[#FFCC02] bg-white shadow-[0_8px_24px_rgba(255,204,2,0.12)]' : 'border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'}`}
                        >
                          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${mode.gradient} opacity-[0.06] -translate-y-6 translate-x-6`} />
                          <motion.div animate={on ? { scale: [1, 1.2, 1.1] } : { scale: 1 }} transition={bouncy} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-2xl flex-shrink-0">{mode.emoji}</motion.div>
                          <div className="flex-1 relative z-10">
                            <div className={`text-[14px] font-bold ${on ? 'text-gray-900' : 'text-gray-700'}`}>{mode.label}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{on ? mode.tone : mode.sub}</div>
                          </div>
                          <AnimatePresence>
                            {on && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={bouncy} className="w-6 h-6 bg-[#FFCC02] rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5 text-gray-900" /></motion.div>}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence>
                  {selectedMode && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="absolute bottom-8 left-0 right-0 px-5">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setScreen('context')} className="w-full h-[54px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2.5 font-bold text-[15px] text-gray-900 shadow-[0_8px_28px_rgba(255,204,2,0.35)]">
                        Set the mood <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* SCREEN 2: QUICK CONTEXT BUILDER                   */}
            {/* ══════════════════════════════════════════════════ */}
            {screen === 'context' && (
              <motion.div key="context" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto no-sb pb-28">
                  <div className="pt-14 px-6 pb-4">
                    <div className="flex items-center justify-between mb-5">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('modeSelect')} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></motion.button>
                      <div className="flex items-center gap-1.5 bg-[#FFCC02]/10 px-3 py-1.5 rounded-full border border-[#FFCC02]/20">
                        <span className="text-sm">{MODES.find(m => m.id === selectedMode)?.emoji}</span>
                        <span className="text-[11px] font-bold text-amber-700">{MODES.find(m => m.id === selectedMode)?.label}</span>
                      </div>
                    </div>
                    <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...gentle }} className="text-[26px] font-['Playfair_Display'] font-bold text-gray-900 leading-[1.15]">A few more details</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[12px] text-gray-400 mt-1 font-medium">Help us find the perfect plan</motion.p>
                  </div>

                  <motion.div className="px-5 mb-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ...spring }}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-[#FFCC02]" /> Mood</p>
                    <div className="grid grid-cols-3 gap-2">
                      {MOODS.map((m, i) => {
                        const on = selectedMoods.includes(m.label);
                        return (
                          <motion.button key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.03, ...bouncy }} whileTap={{ scale: 0.92 }}
                            onClick={() => toggleMood(m.label)}
                            className={`rounded-2xl py-3 flex flex-col items-center gap-1 border-2 transition-all
                              ${on ? 'border-[#FFCC02] bg-[#FFCC02]/8 shadow-[0_4px_12px_rgba(255,204,2,0.12)]' : 'border-gray-100 bg-white'}`}
                          >
                            <span className="text-lg">{m.emoji}</span>
                            <span className={`text-[10px] font-bold ${on ? 'text-gray-800' : 'text-gray-500'}`}>{m.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div className="px-5 mb-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ...spring }}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#FFCC02]" /> Area</p>
                    <div className="flex flex-wrap gap-1.5">
                      {AREAS.map((a, i) => {
                        const on = selectedArea === a.label;
                        return (
                          <motion.button key={a.label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.28 + i * 0.02, ...spring }} whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedArea(on ? null : a.label)}
                            className={`rounded-full px-3 py-1.5 flex items-center gap-1.5 border-2 transition-all text-[11px] font-semibold
                              ${on ? 'border-[#FFCC02] bg-[#FFCC02]/8 text-gray-800' : 'bg-white border-gray-100 text-gray-500'}`}
                          >
                            <span className="text-xs">{a.emoji}</span>{a.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div className="px-5 mb-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...spring }}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><Wallet className="w-3 h-3 text-[#FFCC02]" /> Budget feel</p>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-1.5 flex gap-1">
                      {[
                        { id: 'low', label: '฿', sub: 'Keep it chill' },
                        { id: 'mid', label: '฿฿', sub: 'Sweet spot' },
                        { id: 'high', label: '฿฿฿', sub: 'Treat yourself' },
                        { id: 'splurge', label: '฿฿฿฿', sub: 'Go all out' },
                      ].map((b) => {
                        const on = selectedBudget === b.id;
                        return (
                          <motion.button key={b.id} whileTap={{ scale: 0.95 }} onClick={() => setSelectedBudget(on ? null : b.id)}
                            className={`flex-1 rounded-xl py-2.5 flex flex-col items-center gap-0.5 transition-all ${on ? 'bg-[#FFCC02] shadow-[0_4px_14px_rgba(255,204,2,0.25)]' : 'hover:bg-gray-50'}`}
                          >
                            <span className={`text-[12px] font-black ${on ? 'text-gray-900' : 'text-gray-600'}`}>{b.label}</span>
                            <span className={`text-[7px] font-medium ${on ? 'text-gray-900/60' : 'text-gray-400'}`}>{b.sub}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div className="px-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, ...spring }}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3.5 h-3.5 text-[#FFCC02]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Group size</span>
                      </div>
                      <div className="flex gap-1.5">
                        {['Just me', '2 people', '3–4', '5+'].map((s, i) => (
                          <button key={s} className={`flex-1 rounded-xl py-2 text-[10px] font-bold transition-all ${i === 1 ? 'bg-[#FFCC02]/10 text-gray-800 border-2 border-[#FFCC02]/30' : 'bg-[#FAFAF8] text-gray-500 border-2 border-gray-100'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 px-5">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setScreen('planFeed')} className={`w-full h-[54px] rounded-2xl flex items-center justify-center gap-2.5 font-bold text-[15px] shadow-[0_8px_28px_rgba(255,204,2,0.35)] transition-all ${canProceedContext ? 'bg-[#FFCC02] text-gray-900' : 'bg-gray-200 text-gray-400'}`}>
                    <Sparkles className="w-4 h-4" /> Build my night <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* SCREEN 3: PLAN FEED                               */}
            {/* ══════════════════════════════════════════════════ */}
            {screen === 'planFeed' && (
              <motion.div key="planFeed" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto no-sb pb-8">
                  <div className="pt-14 px-6 pb-3">
                    <div className="flex items-center justify-between mb-4">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('context')} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></motion.button>
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, ...bouncy }} className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-200/50">
                        <Zap className="w-3 h-3 text-green-600" />
                        <span className="text-[10px] font-bold text-green-700">{PLANS.length} plans curated</span>
                      </motion.div>
                    </div>
                    <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...gentle }} className="text-[26px] font-['Playfair_Display'] font-bold text-gray-900 leading-[1.15]">Your night plans</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[12px] text-gray-400 mt-1 font-medium">Curated for {MODES.find(m => m.id === selectedMode)?.label?.toLowerCase() || 'your vibe'}</motion.p>
                  </div>

                  <div className="px-5 space-y-4">
                    {PLANS.map((plan, i) => (
                      <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08, ...spring }}>
                        <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setSelectedPlan(plan); setActiveStopIndex(0); setScreen('planDetail'); }}
                          className="w-full bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden text-left"
                        >
                          <div className="relative h-[140px]">
                            <img src={plan.heroImage} alt={plan.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              {plan.tags.map(t => (
                                <span key={t} className="text-[9px] font-bold text-white bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">{t}</span>
                              ))}
                            </div>
                            <div className="absolute top-3 right-3 flex gap-1.5">
                              <motion.div whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); toggleLike(plan.id); }}
                                className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center ${likedPlans.has(plan.id) ? 'bg-red-500' : 'bg-black/30'}`}>
                                <Heart className={`w-3.5 h-3.5 ${likedPlans.has(plan.id) ? 'text-white fill-white' : 'text-white'}`} />
                              </motion.div>
                              <motion.div whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); toggleSave(plan.id); }}
                                className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center ${savedPlans.has(plan.id) ? 'bg-[#FFCC02]' : 'bg-black/30'}`}>
                                <Bookmark className={`w-3.5 h-3.5 ${savedPlans.has(plan.id) ? 'text-gray-900 fill-gray-900' : 'text-white'}`} />
                              </motion.div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="text-[18px] font-['Playfair_Display'] font-bold text-white leading-tight">{plan.title}</h3>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">{plan.summary}</p>
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{plan.duration}</span>
                              <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1"><Wallet className="w-3 h-3" />{plan.budget}</span>
                              <span className="text-[10px] font-semibold text-gray-400">{plan.vibe}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {plan.stops.map((stop, si) => (
                                <div key={si} className="flex items-center gap-2">
                                  <div className="flex items-center gap-1.5 bg-[#FAFAF8] rounded-xl px-2.5 py-1.5 border border-gray-100">
                                    <span className="text-sm">{stop.icon}</span>
                                    <span className="text-[9px] font-bold text-gray-600">{stop.role}</span>
                                  </div>
                                  {si < plan.stops.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center"><Sparkles className="w-3 h-3 text-green-600" /></div>
                                <span className="text-[10px] font-semibold text-green-700">{plan.confidence}% match</span>
                              </div>
                              <span className="text-[10px] font-medium text-gray-400 italic">"{plan.why.split('.')[0]}."</span>
                            </div>
                          </div>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* SCREEN 4: PLAN DETAIL                             */}
            {/* ══════════════════════════════════════════════════ */}
            {screen === 'planDetail' && selectedPlan && (
              <motion.div key="planDetail" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto no-sb pb-28">
                  <div className="relative h-[200px]">
                    <img src={selectedPlan.heroImage} alt={selectedPlan.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-black/20 to-transparent" />
                    <div className="absolute top-14 left-5">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('planFeed')} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></motion.button>
                    </div>
                    <div className="absolute top-14 right-5 flex gap-2">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleLike(selectedPlan.id)} className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center ${likedPlans.has(selectedPlan.id) ? 'bg-red-500' : 'bg-black/30'}`}>
                        <Heart className={`w-4 h-4 ${likedPlans.has(selectedPlan.id) ? 'text-white fill-white' : 'text-white'}`} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.85 }} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="flex gap-1.5 mb-2">
                        {selectedPlan.tags.map(t => (
                          <span key={t} className="text-[9px] font-bold text-white bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">{t}</span>
                        ))}
                      </div>
                      <h1 className="text-[24px] font-['Playfair_Display'] font-bold text-gray-900 leading-tight">{selectedPlan.title}</h1>
                    </div>
                  </div>

                  <div className="px-5 pt-3">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#FFCC02]" />{selectedPlan.duration}</span>
                      <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-[#FFCC02]" />{selectedPlan.budget}</span>
                      <span className="text-[11px] font-semibold text-gray-500">{selectedPlan.vibe}</span>
                      <div className="ml-auto flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 text-green-600" />
                        <span className="text-[10px] font-bold text-green-700">{selectedPlan.confidence}%</span>
                      </div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...spring }} className="bg-amber-50/60 rounded-2xl p-3.5 mb-5 border border-amber-100/40">
                      <p className="text-[12px] text-gray-700 leading-relaxed italic">"{selectedPlan.why}"</p>
                    </motion.div>

                    <div className="mb-5">
                      <p className="text-[11px] font-bold text-gray-900 mb-3 flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5 text-[#FFCC02]" /> Your night, stop by stop</p>
                      <div className="relative">
                        <div className="absolute left-[18px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#FFCC02] via-[#FFCC02]/40 to-gray-200" />
                        <div className="space-y-0">
                          {selectedPlan.stops.map((stop, si) => (
                            <motion.div key={si} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + si * 0.1, ...spring }}>
                              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setActiveStopIndex(si)}
                                className={`w-full flex gap-3 p-2.5 rounded-2xl text-left transition-all ${activeStopIndex === si ? 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100' : ''}`}
                              >
                                <div className="flex flex-col items-center pt-1 flex-shrink-0 w-[38px]">
                                  <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center text-lg transition-all ${activeStopIndex === si ? 'bg-[#FFCC02] shadow-[0_4px_12px_rgba(255,204,2,0.25)]' : 'bg-gray-100'}`}>{stop.icon}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[9px] font-bold text-[#FFCC02] uppercase tracking-wider">{stop.role}</span>
                                    <span className="text-[9px] text-gray-400">·</span>
                                    <span className="text-[9px] text-gray-400 font-medium">{stop.time}</span>
                                  </div>
                                  <h4 className="text-[14px] font-bold text-gray-900">{stop.name}</h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-400">{stop.category}</span>
                                    <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{stop.rating}</span>
                                    <span className="text-[10px] text-gray-400">{'฿'.repeat(stop.price)}</span>
                                  </div>
                                  <AnimatePresence>
                                    {activeStopIndex === si && (
                                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <div className="mt-2 rounded-xl overflow-hidden h-[80px]">
                                          <img src={stop.image} alt={stop.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-[9px] text-gray-400 mt-1 inline-block">{stop.duration}</span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.button>
                              {stop.transition && (
                                <div className="flex items-center gap-2 pl-[50px] py-1">
                                  <Footprints className="w-3 h-3 text-gray-300" />
                                  <span className="text-[9px] text-gray-300 font-medium">{stop.transition}</span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedPlan.backup && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ...spring }} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-3.5 mb-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Eye className="w-3 h-3" /> Backup option</p>
                        <p className="text-[11px] text-gray-600"><span className="font-bold text-gray-800">{selectedPlan.backup.name}</span> — {selectedPlan.backup.note}</p>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 px-5 flex gap-2.5">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setShowContinue(true); setScreen('continueNight'); }}
                    className="flex-1 h-[50px] rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center gap-2 font-bold text-[13px] text-gray-700">
                    <Plus className="w-4 h-4" /> Keep it going
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }}
                    className="flex-[1.4] h-[50px] rounded-2xl bg-[#FFCC02] flex items-center justify-center gap-2 font-bold text-[14px] text-gray-900 shadow-[0_8px_28px_rgba(255,204,2,0.35)]">
                    <Check className="w-4 h-4" /> Lock this plan
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* SCREEN 5: CONTINUE THE NIGHT                      */}
            {/* ══════════════════════════════════════════════════ */}
            {screen === 'continueNight' && selectedPlan && (
              <motion.div key="continueNight" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto no-sb pb-8">
                  <div className="pt-14 px-6 pb-4">
                    <div className="flex items-center justify-between mb-5">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setScreen('planDetail')} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></motion.button>
                      <div className="flex items-center gap-1.5 bg-[#FFCC02]/10 px-3 py-1.5 rounded-full border border-[#FFCC02]/20">
                        <Moon className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[11px] font-bold text-amber-700">Extend the night</span>
                      </div>
                    </div>
                    <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...gentle }} className="text-[26px] font-['Playfair_Display'] font-bold text-gray-900 leading-[1.15]">Keep it going?</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[12px] text-gray-400 mt-1 font-medium">Great if you want one more stop</motion.p>
                  </div>

                  <motion.div className="px-5 mb-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ...spring }}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">What sounds good?</p>
                    <div className="grid grid-cols-3 gap-2">
                      {CONTINUE_OPTIONS.map((opt, i) => {
                        const on = selectedContinue === opt.label;
                        return (
                          <motion.button key={opt.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.03, ...bouncy }} whileTap={{ scale: 0.92 }}
                            onClick={() => setSelectedContinue(on ? null : opt.label)}
                            className={`rounded-2xl py-3 flex flex-col items-center gap-1 border-2 transition-all
                              ${on ? 'border-[#FFCC02] bg-[#FFCC02]/8 shadow-[0_4px_12px_rgba(255,204,2,0.12)]' : 'border-gray-100 bg-white'}`}
                          >
                            <span className="text-lg">{opt.emoji}</span>
                            <span className={`text-[9px] font-bold ${on ? 'text-gray-800' : 'text-gray-500'}`}>{opt.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {selectedContinue && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-[#FFCC02]" /> Toast suggests</p>
                        <div className="space-y-2.5">
                          {CONTINUE_SUGGESTIONS.map((s, i) => (
                            <motion.div key={s.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ...spring }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden"
                            >
                              <div className="flex gap-3 p-3">
                                <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0">
                                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-sm">{s.emoji}</span>
                                    <h4 className="text-[13px] font-bold text-gray-900">{s.name}</h4>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mb-1">{s.category} · {s.distance}</p>
                                  <p className="text-[10px] text-gray-500 leading-relaxed">{s.why}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{s.rating}</span>
                                    <span className="text-[9px] text-gray-400">{s.distance}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="px-3 pb-3 flex gap-2">
                                <motion.button whileTap={{ scale: 0.95 }} className="flex-1 h-[36px] rounded-xl bg-[#FFCC02] flex items-center justify-center gap-1.5 font-bold text-[11px] text-gray-900 shadow-[0_4px_12px_rgba(255,204,2,0.2)]">
                                  <Plus className="w-3 h-3" /> Add to night
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} className="h-[36px] px-4 rounded-xl bg-[#FAFAF8] border border-gray-100 flex items-center justify-center font-bold text-[11px] text-gray-500">
                                  Details
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!selectedContinue && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="px-5 mt-4">
                      <div className="bg-[#FAFAF8] rounded-2xl border border-gray-100 p-4 text-center">
                        <Moon className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-[12px] text-gray-400 font-medium">Pick a category above to see<br/>nearby suggestions</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* ── NAV BAR ── */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-6 py-2 pb-6 flex justify-around items-center z-50">
            {[
              { icon: Flame, label: 'Discover', active: true },
              { icon: MapPin, label: 'Explore', active: false },
              { icon: Bookmark, label: 'Saved', active: false },
              { icon: Users, label: 'Sessions', active: false },
            ].map(n => (
              <button key={n.label} className="flex flex-col items-center gap-0.5 py-1" onClick={n.label === 'Discover' ? resetFlow : undefined}>
                <n.icon className={`w-5 h-5 ${n.active ? 'text-[#FFCC02]' : 'text-gray-400'}`} fill={n.active ? '#FFCC02' : 'none'} />
                <span className={`text-[9px] font-semibold ${n.active ? 'text-gray-900' : 'text-gray-400'}`}>{n.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
