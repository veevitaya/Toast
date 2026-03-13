import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Sparkles, ArrowRight, X, ChevronRight, RotateCcw, Zap,
  MapPin, Star, Check, ChevronLeft,
} from "lucide-react";
import { useTasteProfile } from "@/hooks/use-taste-profile";
import { useLineProfile } from "@/lib/useLineProfile";
import mascotPath from "@assets/toast_mascot_nobg.png";

interface PersonalizedRec {
  id: number;
  name: string;
  category: string;
  rating: string;
  imageUrl: string;
  address: string;
  priceLevel: number;
  match: number;
  reasonChips?: string[];
  confidenceText?: string;
  district?: string;
}

const FALLBACK_RECOMMENDATIONS: PersonalizedRec[] = [
  { id: 244, name: "Jay Fai", category: "Thai", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60", address: "Maha Chai Rd", priceLevel: 3, match: 88, reasonChips: ["Highly rated", "Perfect for dinner"], confidenceText: "Strong match based on your preferences and timing" },
  { id: 201, name: "Thipsamai", category: "Thai", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60", address: "Maha Chai Rd", priceLevel: 1, match: 82, reasonChips: ["Good value", "Trending nearby"], confidenceText: "Good match for this moment" },
  { id: 231, name: "Peppina", category: "Pizza", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60", address: "Sukhumvit 33", priceLevel: 2, match: 75, reasonChips: ["Highly rated"], confidenceText: "Worth trying based on what's popular now" },
];

type UIState = "home" | "refine_open" | "decision_flow";
type DecisionStep = "mood" | "distance" | "avoid" | "results";

const CRAVING_OPTIONS = [
  { key: "warm", label: "Warm & comforting", shortLabel: "Comfort", icon: "bowl" },
  { key: "spicy", label: "Bold & spicy", shortLabel: "Spicy", icon: "fire" },
  { key: "fresh", label: "Light & fresh", shortLabel: "Fresh", icon: "leaf" },
  { key: "balanced", label: "Balanced", shortLabel: "Balanced", icon: "scale" },
  { key: "indulgent", label: "Indulgent", shortLabel: "Indulgent", icon: "cake" },
  { key: "quick", label: "Quick & healthy", shortLabel: "Simple", icon: "clock" },
  { key: "familiar", label: "Familiar favorite", shortLabel: "Fun", icon: "heart" },
  { key: "surprise", label: "Surprise me", shortLabel: "Surprise", icon: "sparkle" },
];

const DISTANCE_OPTIONS = [
  { value: "close", label: "Under 10 min" },
  { value: "medium", label: "Within 2 km" },
  { value: "flexible", label: "Flexible" },
];

const AVOID_OPTIONS = [
  "Seafood", "Spicy", "Pork", "Fried", "Long wait", "Dairy", "Gluten",
];

function getTimeBasedHeadline(): string {
  const h = new Date().getHours();
  if (h < 11) return "Your best breakfast pick right now";
  if (h < 14) return "Your best lunch option right now";
  if (h < 17) return "Best pick for this afternoon";
  if (h < 21) return "Best match for dinner tonight";
  return "Your late night craving, solved";
}

function getTimeBasedSub(): string {
  const h = new Date().getHours();
  if (h < 11) return "Based on your morning habits and what's trending";
  if (h < 14) return "Built from your recent choices and what's popular now";
  if (h < 17) return "Curated from your taste and nearby favourites";
  if (h < 21) return "Picked from your dinner patterns and top spots";
  return "Matched to your late-night preferences";
}

const CRAVING_ICONS: Record<string, string> = {
  bowl: "\u{1F35C}", fire: "\u{1F525}", leaf: "\u{1F33F}", scale: "\u2696\uFE0F",
  cake: "\u{1F370}", clock: "\u23F1\uFE0F", heart: "\u2764\uFE0F", sparkle: "\u2728",
};

const DISTANCE_SLIDER_OPTIONS = [
  { value: "close", label: "Nearby", desc: "Under 1 km", icon: "pin" },
  { value: "medium", label: "A short ride", desc: "Within 2.5 km", icon: "bike" },
  { value: "flexible", label: "Anywhere", desc: "Distance no limit", icon: "globe" },
];

export function ToastDecides() {
  const [, navigate] = useLocation();
  const { profile: tasteProfile } = useTasteProfile();
  const { profile: userProfile } = useLineProfile();

  const [uiState, setUIState] = useState<UIState>("home");
  const [recs, setRecs] = useState<PersonalizedRec[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCraving, setSelectedCraving] = useState<string | null>(null);
  const [distancePref, setDistancePref] = useState("flexible");
  const [avoidTags, setAvoidTags] = useState<string[]>([]);

  const [decisionStep, setDecisionStep] = useState<DecisionStep>("mood");
  const [decisionCraving, setDecisionCraving] = useState<string | null>(null);
  const [decisionDistance, setDecisionDistance] = useState("flexible");
  const [decisionAvoid, setDecisionAvoid] = useState<string[]>([]);
  const [decisionResults, setDecisionResults] = useState<PersonalizedRec[]>([]);
  const [decisionLoading, setDecisionLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchRecs = useCallback(async (opts?: {
    craving?: string | null;
    preferences?: string[];
    avoidTags?: string[];
    pricePref?: string;
    distancePref?: string;
  }) => {
    const thisId = ++fetchIdRef.current;
    setLoading(true);
    try {
      const now = new Date();
      const res = await fetch("/api/restaurants/personalized", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile?.userId || null,
          tasteProfile,
          hour: now.getHours(),
          dayOfWeek: now.getDay(),
          craving: opts?.craving || null,
          preferences: opts?.preferences || [],
          avoidTags: opts?.avoidTags || [],
          pricePref: opts?.pricePref || "any",
          distancePref: opts?.distancePref || "flexible",
        }),
      });
      if (!mountedRef.current || thisId !== fetchIdRef.current) return FALLBACK_RECOMMENDATIONS;
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setRecs(data);
          return data;
        }
      }
      setRecs(FALLBACK_RECOMMENDATIONS);
      return FALLBACK_RECOMMENDATIONS;
    } catch {
      if (!mountedRef.current) return FALLBACK_RECOMMENDATIONS;
      setRecs(FALLBACK_RECOMMENDATIONS);
      return FALLBACK_RECOMMENDATIONS;
    } finally {
      if (mountedRef.current && thisId === fetchIdRef.current) setLoading(false);
    }
  }, [userProfile?.userId, tasteProfile]);

  useEffect(() => {
    fetchRecs();
  }, [fetchRecs]);

  const primaryRec = recs[0] || FALLBACK_RECOMMENDATIONS[0];
  const secondaryRecs = recs.slice(1, 3);

  const promoteSecondary = useCallback((idx: number) => {
    setRecs(prev => {
      const next = [...prev];
      const realIdx = idx + 1;
      if (realIdx >= next.length) return prev;
      const promoted = next[realIdx];
      next.splice(realIdx, 1);
      next.unshift(promoted);
      return next;
    });
  }, []);

  const tryAnother = useCallback(() => {
    setRecs(prev => {
      if (prev.length <= 1) return prev;
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
  }, []);

  const handleRefineUpdate = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRecs({
        craving: selectedCraving,
        avoidTags,
        distancePref,
      });
      setUIState("home");
    }, 100);
  }, [selectedCraving, avoidTags, distancePref, fetchRecs]);

  const handleDecisionSubmit = useCallback(async () => {
    setDecisionLoading(true);
    try {
      const results = await fetchRecs({
        craving: decisionCraving,
        avoidTags: decisionAvoid,
        distancePref: decisionDistance,
      });
      setDecisionResults(results.slice(0, 3));
    } finally {
      setDecisionLoading(false);
      setDecisionStep("results");
    }
  }, [decisionCraving, decisionAvoid, decisionDistance, fetchRecs]);

  const openDecisionFlow = useCallback(() => {
    setDecisionStep("mood");
    setDecisionCraving(null);
    setDecisionDistance("flexible");
    setDecisionAvoid([]);
    setDecisionResults([]);
    setUIState("decision_flow");
  }, []);

  const toggleAvoid = (tag: string) => {
    setAvoidTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleDecisionAvoid = (tag: string) => {
    setDecisionAvoid(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const headline = useMemo(getTimeBasedHeadline, []);
  const subheadline = useMemo(getTimeBasedSub, []);

  return (
    <div className="px-6 pt-4 pb-2" data-testid="toast-decides-section">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFCC02]" />
          <h2 className="text-[11px] font-bold text-foreground uppercase tracking-[0.12em]" data-testid="text-toast-decides">
            Toast Decides
          </h2>
        </div>
        <button
          onClick={() => navigate("/toast-picks")}
          className="text-xs font-medium text-muted-foreground"
          data-testid="link-why-this"
        >
          Why this? <span className="text-muted-foreground/40">&#8250;</span>
        </button>
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 22 }}
        className="rounded-[20px] overflow-hidden bg-white border border-gray-100 relative"
        style={{ boxShadow: "0 6px 24px -6px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)" }}
        data-testid="card-toast-decides"
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #FFCC02, hsl(45, 90%, 65%))" }} />

        {loading ? (
          <div className="p-5">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-[180px] bg-gray-100 rounded-2xl" />
              <div className="flex gap-2">
                <div className="h-[80px] bg-gray-50 rounded-xl flex-1" />
                <div className="h-[80px] bg-gray-50 rounded-xl flex-1" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Just for you
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={openDecisionFlow}
                  className="text-[10px] font-semibold text-muted-foreground bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1.5 flex items-center gap-1"
                  data-testid="button-help-decide"
                >
                  <Zap className="w-3 h-3" /> Help me decide
                </motion.button>
              </div>
            </div>

            <p className="text-[17px] font-bold text-foreground leading-snug mb-0.5" data-testid="text-hero-headline">
              {headline}
            </p>
            <p className="text-[11px] text-muted-foreground mb-4">{subheadline}</p>

            <motion.button
              onClick={() => navigate(`/restaurant/${primaryRec.id}`)}
              className="relative w-full rounded-2xl overflow-hidden mb-3 group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`card-primary-rec-${primaryRec.id}`}
            >
              <div className="relative w-full h-[180px]">
                <img
                  src={primaryRec.imageUrl}
                  alt={primaryRec.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {primaryRec.match}% match
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-[18px] font-bold leading-tight" data-testid="text-primary-rec-name">{primaryRec.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/80 text-[11px] flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {primaryRec.address}
                    </span>
                    <span className="text-white/60 text-[11px]">|</span>
                    <span className="text-white/80 text-[11px] flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-[#FFCC02]" /> {primaryRec.rating}
                    </span>
                    <span className="text-white/60 text-[11px]">|</span>
                    <span className="text-white/80 text-[11px]">
                      {"$".repeat(primaryRec.priceLevel || 1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>

            {primaryRec.reasonChips && primaryRec.reasonChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {primaryRec.reasonChips.map((chip, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100"
                    data-testid={`chip-reason-${i}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 mb-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/restaurant/${primaryRec.id}`)}
                className="flex-1 h-11 rounded-xl bg-[#FFCC02] flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
                data-testid="button-choose-this"
              >
                Looks great <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={tryAnother}
                className="h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground"
                data-testid="button-try-another"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try another
              </motion.button>
            </div>

            {secondaryRecs.length > 0 && (
              <div className="flex gap-2.5">
                {secondaryRecs.map((rec, idx) => (
                  <motion.button
                    key={rec.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => promoteSecondary(idx)}
                    className="flex-1 group"
                    data-testid={`card-secondary-rec-${rec.id}`}
                  >
                    <div className="relative w-full h-[80px] rounded-xl overflow-hidden mb-1.5 border border-gray-100">
                      <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
                        {rec.match}%
                      </div>
                      <div className="absolute bottom-1.5 left-1.5">
                        <p className="text-white text-[11px] font-semibold leading-tight drop-shadow">{rec.name}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{rec.address} | {rec.rating}</p>
                  </motion.button>
                ))}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Match Confidence</span>
                <span className="text-sm font-bold text-foreground">{primaryRec.match}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${primaryRec.match}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${primaryRec.match >= 80 ? "#22c55e" : primaryRec.match >= 60 ? "#FFCC02" : "#f59e0b"}, ${primaryRec.match >= 80 ? "#16a34a" : primaryRec.match >= 60 ? "hsl(45, 90%, 55%)" : "#d97706"})` }}
                />
              </div>
              {primaryRec.confidenceText && (
                <p className="text-[10px] text-muted-foreground mt-1.5">{primaryRec.confidenceText}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUIState("refine_open")}
              className="mt-3 w-full h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground"
              data-testid="button-refine"
            >
              Refine my picks <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {uiState === "refine_open" && (
          <RefineSheet
            selectedCraving={selectedCraving}
            onCravingSelect={setSelectedCraving}
            distancePref={distancePref}
            onDistanceChange={setDistancePref}
            avoidTags={avoidTags}
            onAvoidToggle={toggleAvoid}
            onUpdate={handleRefineUpdate}
            onClose={() => setUIState("home")}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uiState === "decision_flow" && (
          <DecisionFlow
            step={decisionStep}
            onStepChange={setDecisionStep}
            craving={decisionCraving}
            onCravingSelect={setDecisionCraving}
            distance={decisionDistance}
            onDistanceChange={setDecisionDistance}
            avoid={decisionAvoid}
            onAvoidToggle={toggleDecisionAvoid}
            results={decisionResults}
            loading={decisionLoading}
            onSubmit={handleDecisionSubmit}
            onClose={() => setUIState("home")}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface RefineSheetProps {
  selectedCraving: string | null;
  onCravingSelect: (c: string) => void;
  distancePref: string;
  onDistanceChange: (d: string) => void;
  avoidTags: string[];
  onAvoidToggle: (t: string) => void;
  onUpdate: () => void;
  onClose: () => void;
}

function RefineSheet({
  selectedCraving, onCravingSelect,
  distancePref, onDistanceChange,
  avoidTags, onAvoidToggle, onUpdate, onClose,
}: RefineSheetProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-[#FAF9F6]"
      data-testid="refine-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Refine your picks"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="h-full flex flex-col safe-top" data-testid="refine-sheet">
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              data-testid="button-close-refine"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-16 h-1.5 rounded-full bg-[#FFCC02]" />
            <button
              onClick={onClose}
              className="text-[13px] font-medium text-muted-foreground"
              data-testid="button-skip-refine"
            >
              Skip
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="mb-8">
            <h2 className="text-[26px] font-extrabold text-foreground leading-tight">
              What are you in
              <br />
              <span className="relative inline-block">
                the mood for?
                <span
                  className="absolute bottom-1 left-0 right-0 h-2.5 bg-[#FFCC02]/30 rounded-full -z-10"
                  style={{ transform: "skewX(-2deg)" }}
                />
              </span>
            </h2>
            <p className="text-[14px] text-muted-foreground mt-2">
              Tell us the vibe you're feeling
            </p>
          </div>

          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {CRAVING_OPTIONS.map((opt) => {
                const isSelected = selectedCraving === opt.key;
                return (
                  <motion.button
                    key={opt.key}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onCravingSelect(opt.key)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0"
                    data-testid={`craving-${opt.key}`}
                  >
                    <div
                      className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-2xl transition-all ${
                        isSelected
                          ? "bg-[#FFCC02] shadow-md"
                          : "bg-white border border-gray-100"
                      }`}
                      style={isSelected ? { boxShadow: "0 4px 16px rgba(255,204,2,0.35)" } : { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    >
                      {CRAVING_ICONS[opt.icon]}
                    </div>
                    <span className={`text-[11px] font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {opt.shortLabel}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[16px] font-bold text-foreground mb-4">Set your distance</h3>
            <div className="space-y-2.5">
              {DISTANCE_SLIDER_OPTIONS.map((opt) => {
                const isSelected = distancePref === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onDistanceChange(opt.value)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "bg-[#FFCC02]/10 border-[#FFCC02]"
                        : "bg-white border-gray-100"
                    }`}
                    style={isSelected
                      ? { boxShadow: "0 2px 12px rgba(255,204,2,0.18)" }
                      : { boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }
                    }
                    data-testid={`distance-${opt.value}`}
                    aria-label={`${opt.label} - ${opt.desc}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-[#FFCC02]" : "bg-gray-50"
                    }`}>
                      {opt.icon === "pin" && <MapPin className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />}
                      {opt.icon === "bike" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`}>
                          <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/>
                          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
                        </svg>
                      )}
                      {opt.icon === "globe" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`}>
                          <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-semibold ${isSelected ? "text-foreground" : "text-foreground"}`}>{opt.label}</p>
                      <p className="text-[12px] text-muted-foreground">{opt.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[16px] font-bold text-foreground mb-4">Anything you want to avoid?</h3>
            <div className="flex flex-wrap gap-2.5">
              {AVOID_OPTIONS.map((tag) => {
                const isAvoided = avoidTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onAvoidToggle(tag)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium border-2 transition-all ${
                      isAvoided
                        ? "bg-[#FFCC02]/10 border-[#FFCC02] text-foreground"
                        : "bg-white border-gray-200 text-muted-foreground"
                    }`}
                    style={isAvoided ? {} : { boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                    data-testid={`avoid-${tag.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {tag}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-2xl bg-[#FFCC02]/8 border border-[#FFCC02]/20 p-4 flex items-start gap-3"
            data-testid="refine-preview-card"
          >
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground leading-snug">
                You'll get 3 curated picks with reasons, confidence & quick actions.
              </p>
            </div>
            <img src={mascotPath} alt="" className="w-14 h-14 object-contain flex-shrink-0" />
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 px-6 pt-3 bg-[#FAF9F6] z-10"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 16px), 80px)" }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onUpdate}
            className="w-full h-[52px] rounded-2xl bg-[#FFCC02] font-bold text-[15px] text-foreground flex items-center justify-center gap-2"
            style={{ boxShadow: "0 4px 16px rgba(255,204,2,0.35)" }}
            data-testid="button-update-picks"
          >
            Show my picks <Sparkles className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

interface DecisionFlowProps {
  step: DecisionStep;
  onStepChange: (s: DecisionStep) => void;
  craving: string | null;
  onCravingSelect: (c: string) => void;
  distance: string;
  onDistanceChange: (d: string) => void;
  avoid: string[];
  onAvoidToggle: (t: string) => void;
  results: PersonalizedRec[];
  loading: boolean;
  onSubmit: () => void;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

function DecisionFlow({
  step, onStepChange, craving, onCravingSelect,
  distance, onDistanceChange, avoid, onAvoidToggle,
  results, loading, onSubmit, onClose, onNavigate,
}: DecisionFlowProps) {
  const steps: DecisionStep[] = ["mood", "distance", "avoid", "results"];
  const currentIdx = steps.indexOf(step);
  const progress = step === "results" ? 100 : ((currentIdx + 1) / 3) * 100;

  const goNext = () => {
    if (step === "mood") onStepChange("distance");
    else if (step === "distance") onStepChange("avoid");
    else if (step === "avoid") onSubmit();
  };

  const goBack = () => {
    if (step === "distance") onStepChange("mood");
    else if (step === "avoid") onStepChange("distance");
    else if (step === "results") onStepChange("avoid");
    else onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white"
      data-testid="decision-flow"
    >
      <div className="h-full flex flex-col safe-top safe-bottom">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={goBack} className="text-sm font-medium text-muted-foreground" data-testid="button-decision-back">
              {step === "mood" ? "Cancel" : "Back"}
            </button>
            <div className="flex items-center gap-2">
              <img src={mascotPath} alt="" className="w-6 h-6 object-contain" />
              <span className="text-[12px] font-bold text-foreground">Toast Decides</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" data-testid="button-close-decision">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full rounded-full bg-[#FFCC02]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <AnimatePresence mode="wait">
            {step === "mood" && (
              <motion.div
                key="mood"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="py-4"
              >
                <h2 className="text-[22px] font-bold text-foreground mb-1">What are you craving?</h2>
                <p className="text-[13px] text-muted-foreground mb-6">Pick one that matches your mood right now.</p>
                <div className="grid grid-cols-2 gap-3">
                  {CRAVING_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.key}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onCravingSelect(opt.key)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                        craving === opt.key
                          ? "bg-[#FFCC02]/10 border-[#FFCC02] shadow-sm"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                      data-testid={`decision-craving-${opt.key}`}
                    >
                      <span className="text-xl">{CRAVING_ICONS[opt.icon]}</span>
                      <span className="text-[13px] font-medium text-foreground">{opt.label}</span>
                      {craving === opt.key && <Check className="w-4 h-4 text-[#FFCC02] ml-auto" />}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "distance" && (
              <motion.div
                key="distance"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="py-4"
              >
                <h2 className="text-[22px] font-bold text-foreground mb-1">How far are you willing to go?</h2>
                <p className="text-[13px] text-muted-foreground mb-6">Pick your distance preference.</p>
                <div className="space-y-3">
                  {DISTANCE_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onDistanceChange(opt.value)}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        distance === opt.value
                          ? "bg-[#FFCC02]/10 border-[#FFCC02] shadow-sm"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                      data-testid={`decision-distance-${opt.value}`}
                    >
                      <span className="text-[14px] font-medium text-foreground">{opt.label}</span>
                      {distance === opt.value && <Check className="w-5 h-5 text-[#FFCC02]" />}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "avoid" && (
              <motion.div
                key="avoid"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="py-4"
              >
                <h2 className="text-[22px] font-bold text-foreground mb-1">Anything to avoid?</h2>
                <p className="text-[13px] text-muted-foreground mb-6">Optional - skip if everything's fine.</p>
                <div className="flex flex-wrap gap-3">
                  {AVOID_OPTIONS.map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => onAvoidToggle(tag)}
                      className={`px-4 py-2.5 rounded-full text-[13px] font-medium border-2 transition-all ${
                        avoid.includes(tag)
                          ? "bg-red-50 border-red-300 text-red-600"
                          : "bg-white border-gray-100 text-muted-foreground hover:border-gray-200"
                      }`}
                      data-testid={`decision-avoid-${tag.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {avoid.includes(tag) ? "\u2715 " : ""}{tag}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="py-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <img src={mascotPath} alt="" className="w-8 h-8 object-contain" />
                  <h2 className="text-[22px] font-bold text-foreground">Here's what I'd pick</h2>
                </div>
                <p className="text-[13px] text-muted-foreground mb-6">Curated just for this moment.</p>

                {loading ? (
                  <div className="space-y-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="animate-pulse rounded-2xl bg-gray-50 h-[200px]" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {decisionResultsToShow(results).map((rec, idx) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="rounded-2xl overflow-hidden border border-gray-100 bg-white"
                        style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06)" }}
                        data-testid={`card-decision-result-${rec.id}`}
                      >
                        <div className="relative h-[160px]">
                          <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full px-2.5 py-1" data-testid={`text-decision-match-${rec.id}`}>
                            {rec.match}% match
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <p className="text-white text-[16px] font-bold" data-testid={`text-decision-name-${rec.id}`}>{rec.name}</p>
                            <p className="text-white/80 text-[11px]" data-testid={`text-decision-info-${rec.id}`}>{rec.address} | {rec.rating} | {"$".repeat(rec.priceLevel || 1)}</p>
                          </div>
                        </div>
                        <div className="p-3.5">
                          {rec.confidenceText && (
                            <p className="text-[11px] text-muted-foreground mb-2" data-testid={`text-decision-confidence-${rec.id}`}>{rec.confidenceText}</p>
                          )}
                          {rec.reasonChips && rec.reasonChips.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {rec.reasonChips.map((chip, i) => (
                                <span key={i} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 border border-emerald-100">
                                  {chip}
                                </span>
                              ))}
                            </div>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onNavigate(`/restaurant/${rec.id}`)}
                            className={`w-full h-10 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 ${
                              idx === 0
                                ? "bg-[#FFCC02] text-foreground"
                                : "bg-gray-50 border border-gray-100 text-foreground"
                            }`}
                            data-testid={`button-decision-choose-${rec.id}`}
                          >
                            {idx === 0 ? "Choose this" : "View details"} <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step !== "results" && (
          <div className="px-5 py-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={goNext}
              disabled={step === "mood" && !craving}
              className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity ${
                step === "mood" && !craving
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#FFCC02] text-foreground"
              }`}
              data-testid="button-decision-next"
            >
              {step === "avoid" ? "Show my picks" : "Next"} <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function decisionResultsToShow(results: PersonalizedRec[]): PersonalizedRec[] {
  if (results.length > 0) return results.slice(0, 3);
  return FALLBACK_RECOMMENDATIONS;
}
