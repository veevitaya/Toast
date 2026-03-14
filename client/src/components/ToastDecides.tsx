import { useState, useCallback, useRef, useEffect, useMemo, memo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Sparkles, ArrowRight, X, ChevronRight, ChevronDown, RotateCcw, Zap,
  MapPin, Star, Check, TrendingUp, Clock, Heart, Brain,
  Footprints, Car, Globe,
} from "lucide-react";
import { useLineProfile } from "@/lib/useLineProfile";
import { trackDecisionEvent } from "@/lib/decisionEvents";
import { useBootstrapSession, type BootstrapPayload } from "@/hooks/useBootstrapSession";
import mascotPath from "@assets/toast_mascot_nobg.png";

interface RecScores {
  taste: number;
  daypart: number;
  popularity: number;
  value: number;
}

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
  insight?: string | null;
  scores?: RecScores;
  description?: string | null;
  vibes?: string[];
}

const FALLBACK_RECOMMENDATIONS: PersonalizedRec[] = [
  { id: 244, name: "Jay Fai", category: "Thai", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&auto=format&fit=crop&q=60", address: "Maha Chai Rd", priceLevel: 3, match: 88, reasonChips: ["Highly rated", "Perfect for dinner"], confidenceText: "Strong match based on your preferences and timing", scores: { taste: 85, daypart: 78, popularity: 92, value: 70 } },
  { id: 201, name: "Thipsamai", category: "Thai", rating: "4.9", imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=60", address: "Maha Chai Rd", priceLevel: 1, match: 82, reasonChips: ["Good value", "Trending nearby"], confidenceText: "Good match for this moment", scores: { taste: 75, daypart: 80, popularity: 88, value: 90 } },
  { id: 231, name: "Peppina", category: "Pizza", rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60", address: "Sukhumvit 33", priceLevel: 2, match: 75, reasonChips: ["Highly rated"], confidenceText: "Worth trying based on what's popular now", scores: { taste: 65, daypart: 60, popularity: 85, value: 75 } },
];

type UIState = "home" | "refine_open" | "results" | "decision_flow";
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

const DISTANCE_PILLS = [
  { key: "close", km: 0.5, label: "Walking", sub: "Under 1 km", Icon: Footprints },
  { key: "medium", km: 3, label: "Short ride", sub: "Under 3 km", Icon: Car },
  { key: "flexible", km: 10, label: "Anywhere", sub: "Any distance", Icon: Globe },
] as const;

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

function kmToCategory(km: number): string {
  if (km <= 1) return "close";
  if (km <= 3) return "medium";
  return "flexible";
}

function getMealPeriod(): string {
  const h = new Date().getHours();
  if (h < 11) return "breakfast";
  if (h < 14) return "lunch";
  if (h < 17) return "afternoon snack";
  if (h < 21) return "dinner";
  return "late night";
}

function optimizeImageUrl(url: string, width: number): string {
  if (!url || !url.includes("unsplash.com")) return url;
  return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, "q=55");
}

const ScoreBar = memo(function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] font-semibold text-foreground w-[28px] text-right">{value}%</span>
    </div>
  );
});

const InsightCard = memo(function InsightCard({ rec, rank }: { rec: PersonalizedRec; rank: number }) {
  const [, navigate] = useLocation();
  const scores = rec.scores || { taste: 60, daypart: 50, popularity: 70, value: 65 };
  const isTop = rank === 0;
  const imgWidth = isTop ? 400 : 300;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.12, type: "spring", stiffness: 260, damping: 24 }}
      className="rounded-2xl overflow-hidden bg-white border border-gray-100"
      style={{ boxShadow: isTop ? "0 8px 32px -8px rgba(0,0,0,0.10)" : "0 4px 16px -4px rgba(0,0,0,0.06)" }}
      data-testid={`card-result-${rec.id}`}
    >
      <button
        onClick={() => navigate(`/restaurant/${rec.id}`)}
        className="relative w-full block"
        data-testid={`button-result-image-${rec.id}`}
      >
        <div className={`relative w-full ${isTop ? "h-[200px]" : "h-[140px]"}`}>
          <img
            src={optimizeImageUrl(rec.imageUrl, imgWidth)}
            alt={rec.name}
            className="w-full h-full object-cover"
            loading={isTop ? "eager" : "lazy"}
            decoding={isTop ? "sync" : "async"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {isTop && (
            <div className="absolute top-3 left-3 bg-[#FFCC02] text-foreground text-[10px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Top Pick
            </div>
          )}

          <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {rec.match}% match
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className={`text-white font-bold leading-tight ${isTop ? "text-[20px]" : "text-[16px]"}`} data-testid={`text-result-name-${rec.id}`}>{rec.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/80 text-[11px] flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {rec.district || rec.address}
              </span>
              <span className="text-white/60 text-[11px]">|</span>
              <span className="text-white/80 text-[11px] flex items-center gap-0.5">
                <Star className="w-3 h-3 text-[#FFCC02]" /> {rec.rating}
              </span>
              <span className="text-white/60 text-[11px]">|</span>
              <span className="text-white/80 text-[11px]">
                {"$".repeat(rec.priceLevel || 1)}
              </span>
            </div>
          </div>
        </div>
      </button>

      <div className={`${isTop ? "p-4" : "p-3.5"}`}>
        {rec.insight && (
          <div className="flex items-start gap-2 mb-3 bg-amber-50/60 rounded-xl px-3 py-2 border border-amber-100/50">
            <Brain className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-800 leading-relaxed capitalize">{rec.insight}</p>
          </div>
        )}

        {rec.reasonChips && rec.reasonChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {rec.reasonChips.map((chip, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100"
                data-testid={`chip-result-reason-${rec.id}-${i}`}
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {isTop && (
          <div className="mb-3 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-2">Why this pick</p>
            <ScoreBar label="Taste match" value={scores.taste} color="#22c55e" />
            <ScoreBar label="Right timing" value={scores.daypart} color="#FFCC02" />
            <ScoreBar label="Popularity" value={scores.popularity} color="#3b82f6" />
            <ScoreBar label="Value" value={scores.value} color="#8b5cf6" />
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/restaurant/${rec.id}`)}
          className={`w-full h-11 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 ${
            isTop
              ? "bg-[#FFCC02] text-foreground"
              : "bg-gray-50 border border-gray-100 text-foreground"
          }`}
          data-testid={`button-result-choose-${rec.id}`}
        >
          {isTop ? "Looks great" : "View details"} <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
});

const TasteDNAPanel = memo(function TasteDNAPanel({ recs }: { recs: PersonalizedRec[] }) {
  const topRec = recs[0];
  if (!topRec) return null;

  const avgScores = useMemo(() => {
    const totals = { taste: 0, daypart: 0, popularity: 0, value: 0, count: 0 };
    for (const r of recs) {
      if (r.scores) {
        totals.taste += r.scores.taste;
        totals.daypart += r.scores.daypart;
        totals.popularity += r.scores.popularity;
        totals.value += r.scores.value;
        totals.count++;
      }
    }
    if (totals.count === 0) return null;
    return {
      taste: Math.round(totals.taste / totals.count),
      daypart: Math.round(totals.daypart / totals.count),
      popularity: Math.round(totals.popularity / totals.count),
      value: Math.round(totals.value / totals.count),
    };
  }, [recs]);

  if (!avgScores) return null;

  const dominant = Object.entries(avgScores).sort((a, b) => b[1] - a[1])[0];
  const dominantLabels: Record<string, string> = {
    taste: "Your taste profile strongly influenced today's picks",
    daypart: `These picks are optimized for ${getMealPeriod()}`,
    popularity: "Today's picks lean toward what's trending in Bangkok",
    value: "Great value spots dominate your recommendations today",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-4 mt-4"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      data-testid="taste-dna-panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
          <Brain className="w-4 h-4 text-violet-600" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-foreground">Your Taste DNA</p>
          <p className="text-[10px] text-muted-foreground">How we picked these for you</p>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
        {dominantLabels[dominant[0]] || "Balanced across all signals"}
      </p>

      <div className="grid grid-cols-4 gap-2">
        {([
          { key: "taste", label: "Taste", icon: Heart, color: "#22c55e" },
          { key: "daypart", label: "Timing", icon: Clock, color: "#FFCC02" },
          { key: "popularity", label: "Trending", icon: TrendingUp, color: "#3b82f6" },
          { key: "value", label: "Value", icon: Star, color: "#8b5cf6" },
        ] as const).map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-[13px] font-bold text-foreground">{avgScores[key]}%</p>
            <p className="text-[9px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

function bootstrapToRecs(payload: BootstrapPayload): PersonalizedRec[] {
  const picks: PersonalizedRec[] = [];
  if (payload.dailyPick) {
    const p = payload.dailyPick;
    picks.push({
      id: p.restaurantId,
      name: p.name,
      category: p.category,
      rating: p.rating,
      imageUrl: p.imageUrl,
      address: p.address,
      priceLevel: p.priceLevel,
      match: p.match,
      reasonChips: p.reasonChips,
      confidenceText: p.confidenceLabel,
      district: p.district,
    });
  }
  for (const a of payload.alternatives) {
    picks.push({
      id: a.restaurantId,
      name: a.name,
      category: a.category,
      rating: a.rating,
      imageUrl: a.imageUrl,
      address: a.address,
      priceLevel: a.priceLevel,
      match: a.match,
      reasonChips: a.reasonChips,
      confidenceText: a.confidenceLabel,
      district: a.district,
    });
  }
  return picks.length > 0 ? picks : FALLBACK_RECOMMENDATIONS;
}

const HeroSkeleton = memo(function HeroSkeleton() {
  return (
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
  );
});

export function ToastDecides({ onRefineToggle }: { onRefineToggle?: (open: boolean) => void }) {
  const [, navigate] = useLocation();
  const { profile: userProfile } = useLineProfile();
  const { payload: bootstrap, loading: bootstrapLoading } = useBootstrapSession();

  const [uiState, setUIState] = useState<UIState>("home");

  const bootstrapRecs = useMemo(() => {
    if (!bootstrap) return FALLBACK_RECOMMENDATIONS;
    return bootstrapToRecs(bootstrap);
  }, [bootstrap]);

  const [recs, setRecs] = useState<PersonalizedRec[]>(() => bootstrapRecs);
  const [loading, setLoading] = useState(false);
  const [apiRecsLoaded, setApiRecsLoaded] = useState(false);

  useEffect(() => {
    if (bootstrapRecs !== FALLBACK_RECOMMENDATIONS && !apiRecsLoaded) {
      setRecs(bootstrapRecs);
    }
  }, [bootstrapRecs, apiRecsLoaded]);

  const [selectedCraving, setSelectedCraving] = useState<string | null>(null);
  const [distancePill, setDistancePill] = useState<string>("flexible");
  const [avoidTags, setAvoidTags] = useState<string[]>([]);

  const [decisionStep, setDecisionStep] = useState<DecisionStep>("mood");
  const [decisionCraving, setDecisionCraving] = useState<string | null>(null);
  const [decisionDistance, setDecisionDistance] = useState("flexible");
  const [decisionAvoid, setDecisionAvoid] = useState<string[]>([]);
  const [decisionResults, setDecisionResults] = useState<PersonalizedRec[]>([]);
  const [decisionLoading, setDecisionLoading] = useState(false);

  const [resultsRecs, setResultsRecs] = useState<PersonalizedRec[]>([]);

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
          setApiRecsLoaded(true);
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
  }, [userProfile?.userId]);

  const enrichFetchRef = useRef(false);
  useEffect(() => {
    if (!bootstrapLoading && bootstrap && !enrichFetchRef.current && userProfile?.userId) {
      enrichFetchRef.current = true;
      let cancelled = false;
      const doEnrich = () => { if (!cancelled && mountedRef.current) fetchRecs(); };
      let handle: number;
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        handle = (window as any).requestIdleCallback(doEnrich);
      } else {
        handle = window.setTimeout(doEnrich, 2000) as unknown as number;
      }
      return () => {
        cancelled = true;
        if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
          (window as any).cancelIdleCallback(handle);
        }
        clearTimeout(handle);
      };
    }
  }, [bootstrapLoading, bootstrap, userProfile?.userId, fetchRecs]);

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
      trackDecisionEvent("alternative_requested", {
        userId: userProfile?.userId,
        restaurantId: first.id,
        metadata: { category: first.category },
      });
      return next;
    });
  }, [userProfile?.userId]);

  const refineActiveRef = useRef(false);

  const handleRefineUpdate = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    refineActiveRef.current = true;
    trackDecisionEvent("refine_applied", {
      userId: userProfile?.userId,
      metadata: { craving: selectedCraving, avoidTags, distancePill },
    });
    debounceRef.current = setTimeout(async () => {
      const pill = DISTANCE_PILLS.find(p => p.key === distancePill);
      const distCat = pill ? kmToCategory(pill.km) : "flexible";
      const results = await fetchRecs({
        craving: selectedCraving,
        avoidTags,
        distancePref: distCat,
      });
      if (!refineActiveRef.current) return;
      refineActiveRef.current = false;
      onRefineToggle?.(false);
      if (results !== FALLBACK_RECOMMENDATIONS && results.length > 0) {
        setResultsRecs(results.slice(0, 3));
      } else {
        setResultsRecs(FALLBACK_RECOMMENDATIONS);
      }
      setUIState("results");
    }, 100);
  }, [selectedCraving, avoidTags, distancePill, fetchRecs, userProfile?.userId, onRefineToggle]);

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
    trackDecisionEvent("primary_cta_clicked", { userId: userProfile?.userId });
  }, [userProfile?.userId]);

  const toggleAvoid = useCallback((tag: string) => {
    setAvoidTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  const toggleDecisionAvoid = useCallback((tag: string) => {
    setDecisionAvoid(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  const headline = useMemo(getTimeBasedHeadline, []);
  const subheadline = useMemo(getTimeBasedSub, []);

  const trackedImpressionRef = useRef(false);
  useEffect(() => {
    if (recs.length > 0 && recs !== FALLBACK_RECOMMENDATIONS && !trackedImpressionRef.current) {
      trackedImpressionRef.current = true;
      trackDecisionEvent("hero_impression", {
        userId: userProfile?.userId,
        restaurantId: recs[0]?.id,
        metadata: { count: recs.length },
      });
    }
  }, [recs, userProfile?.userId]);

  const showSkeleton = bootstrapLoading && recs === FALLBACK_RECOMMENDATIONS && !bootstrap;

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 22 }}
        className="rounded-[20px] overflow-hidden bg-white border border-gray-100 relative"
        style={{ boxShadow: "0 6px 24px -6px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)" }}
        data-testid="card-toast-decides"
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #FFCC02, hsl(45, 90%, 65%))" }} />

        {showSkeleton ? (
          <HeroSkeleton />
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
              onClick={() => { trackDecisionEvent("detail_viewed", { userId: userProfile?.userId, restaurantId: primaryRec.id, metadata: { category: primaryRec.category } }); navigate(`/restaurant/${primaryRec.id}`); }}
              className="relative w-full rounded-2xl overflow-hidden mb-3 group"
              whileTap={{ scale: 0.98 }}
              data-testid={`card-primary-rec-${primaryRec.id}`}
            >
              <div className="relative w-full h-[180px]">
                <img
                  src={optimizeImageUrl(primaryRec.imageUrl, 400)}
                  alt={primaryRec.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
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
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/restaurant/${primaryRec.id}`)}
                className="flex-1 h-11 rounded-xl bg-[#FFCC02] flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
                data-testid="button-choose-this"
              >
                Looks great <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
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
                    whileTap={{ scale: 0.96 }}
                    onClick={() => promoteSecondary(idx)}
                    className="flex-1 group"
                    data-testid={`card-secondary-rec-${rec.id}`}
                  >
                    <div className="relative w-full h-[80px] rounded-xl overflow-hidden mb-1.5 border border-gray-100">
                      <img src={optimizeImageUrl(rec.imageUrl, 200)} alt={rec.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${primaryRec.match >= 80 ? "#22c55e" : primaryRec.match >= 60 ? "#FFCC02" : "#f59e0b"}, ${primaryRec.match >= 80 ? "#16a34a" : primaryRec.match >= 60 ? "hsl(45, 90%, 55%)" : "#d97706"})` }}
                />
              </div>
              {primaryRec.confidenceText && (
                <p className="text-[10px] text-muted-foreground mt-1.5">{primaryRec.confidenceText}</p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { setUIState("refine_open"); onRefineToggle?.(true); trackDecisionEvent("refine_opened", { userId: userProfile?.userId }); }}
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
            distancePill={distancePill}
            onDistancePillChange={setDistancePill}
            avoidTags={avoidTags}
            onAvoidToggle={toggleAvoid}
            onUpdate={handleRefineUpdate}
            onClose={() => { refineActiveRef.current = false; onRefineToggle?.(false); setUIState("home"); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uiState === "results" && (
          <ResultsScreen
            recs={resultsRecs}
            onClose={() => setUIState("home")}
            onRefineAgain={() => { onRefineToggle?.(true); setUIState("refine_open"); }}
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
  distancePill: string;
  onDistancePillChange: (key: string) => void;
  avoidTags: string[];
  onAvoidToggle: (t: string) => void;
  onUpdate: () => void;
  onClose: () => void;
}

function RefineSheet({
  selectedCraving, onCravingSelect,
  distancePill, onDistancePillChange,
  avoidTags, onAvoidToggle, onUpdate, onClose,
}: RefineSheetProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200]"
      data-testid="refine-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="What's your mood?"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0, height: expanded ? "auto" : "auto" }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 240, mass: 1 }}
        className="absolute bottom-0 left-0 right-0 bg-[#F5F5F5] rounded-t-3xl flex flex-col"
        style={{ maxHeight: expanded ? "92dvh" : "auto" }}
        data-testid="refine-sheet"
      >
        <div className="flex-shrink-0">
          <div
            className="pt-3 pb-1 flex justify-center cursor-pointer"
            onClick={() => setExpanded(prev => !prev)}
            data-testid="refine-toggle"
          >
            <motion.div
              animate={{ rotate: expanded ? 0 : 180 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
          <div className="px-5 pb-3 flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              data-testid="button-back-refine"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <h2 className="text-[17px] font-bold text-foreground">What's your mood?</h2>
            <button
              onClick={onClose}
              className="text-[13px] font-medium text-muted-foreground"
              data-testid="button-skip-refine"
            >
              Skip
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 240, mass: 1 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4">
                <div className="mb-6">
                  <h3 className="text-[14px] font-semibold text-foreground mb-3">What's the vibe?</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
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
                            className={`w-[56px] h-[56px] rounded-2xl flex items-center justify-center text-xl transition-all ${
                              isSelected
                                ? "bg-[#FFCC02] shadow-md"
                                : "bg-white border border-gray-100"
                            }`}
                            style={isSelected ? { boxShadow: "0 4px 16px rgba(255,204,2,0.35)" } : { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                          >
                            {CRAVING_ICONS[opt.icon]}
                          </div>
                          <span className={`text-[10px] font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                            {opt.shortLabel}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-[14px] font-semibold text-foreground mb-3">How far?</h3>
                  <div className="flex gap-2.5" data-testid="distance-pills">
                    {DISTANCE_PILLS.map((pill) => {
                      const isSelected = distancePill === pill.key;
                      const PillIcon = pill.Icon;
                      return (
                        <motion.button
                          key={pill.key}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDistancePillChange(pill.key)}
                          className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all ${
                            isSelected
                              ? "bg-[#FFCC02]/10 border-[#FFCC02]"
                              : "bg-white border-gray-100"
                          }`}
                          style={isSelected ? { boxShadow: "0 4px 16px rgba(255,204,2,0.2)" } : { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                          data-testid={`distance-pill-${pill.key}`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-[#FFCC02]" : "bg-gray-50"
                          }`}>
                            <PillIcon className={`w-4 h-4 ${isSelected ? "text-foreground" : "text-muted-foreground"}`} />
                          </div>
                          <span className={`text-[11px] font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                            {pill.label}
                          </span>
                          <span className={`text-[10px] ${isSelected ? "text-foreground/60" : "text-muted-foreground/60"}`}>
                            {pill.sub}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FFCC02]" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="text-[14px] font-semibold text-foreground mb-3">Anything to avoid?</h3>
                  <div className="flex flex-wrap gap-2">
                    {AVOID_OPTIONS.map((tag) => {
                      const isAvoided = avoidTags.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => onAvoidToggle(tag)}
                          className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border-2 transition-all ${
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
              </div>

              <div className="flex-shrink-0 px-5 pt-3 pb-6 bg-[#F5F5F5] border-t border-gray-100">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onUpdate}
                  className="w-full h-[48px] rounded-2xl bg-[#FFCC02] font-bold text-[15px] text-foreground flex items-center justify-center gap-2"
                  style={{ boxShadow: "0 4px 16px rgba(255,204,2,0.35)" }}
                  data-testid="button-update-picks"
                >
                  Show my picks <Sparkles className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

interface ResultsScreenProps {
  recs: PersonalizedRec[];
  onClose: () => void;
  onRefineAgain: () => void;
}

function ResultsScreen({ recs, onClose, onRefineAgain }: ResultsScreenProps) {
  const displayRecs = recs.length > 0 ? recs : FALLBACK_RECOMMENDATIONS;
  const mealPeriod = useMemo(getMealPeriod, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#FAF9F6]"
      data-testid="results-screen"
    >
      <div className="h-full flex flex-col safe-top safe-bottom">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onClose}
              className="text-sm font-medium text-muted-foreground"
              data-testid="button-results-back"
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              <img src={mascotPath} alt="" className="w-6 h-6 object-contain" />
              <span className="text-[12px] font-bold text-foreground">Toast Decides</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              data-testid="button-close-results"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#FFCC02]" />
              <h1 className="text-[22px] font-bold text-foreground">Your picks are ready</h1>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Curated for your {mealPeriod} based on your taste profile
            </p>
          </motion.div>

          <div className="space-y-4">
            {displayRecs.map((rec, idx) => (
              <InsightCard key={rec.id} rec={rec} rank={idx} />
            ))}
          </div>

          <TasteDNAPanel recs={displayRecs} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 mb-4 text-center"
          >
            <p className="text-[11px] text-muted-foreground mb-3">
              Not quite right? Refine your preferences
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onRefineAgain}
              className="mx-auto px-5 h-10 rounded-xl border border-gray-200 bg-white text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"
              data-testid="button-refine-again"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refine again
            </motion.button>
          </motion.div>
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
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onCravingSelect(opt.key)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                        craving === opt.key
                          ? "bg-[#FFCC02]/10 border-[#FFCC02] shadow-sm"
                          : "bg-white border-gray-100"
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
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onDistanceChange(opt.value)}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        distance === opt.value
                          ? "bg-[#FFCC02]/10 border-[#FFCC02] shadow-sm"
                          : "bg-white border-gray-100"
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
                      whileTap={{ scale: 0.93 }}
                      onClick={() => onAvoidToggle(tag)}
                      className={`px-4 py-2.5 rounded-full text-[13px] font-medium border-2 transition-all ${
                        avoid.includes(tag)
                          ? "bg-red-50 border-red-300 text-red-600"
                          : "bg-white border-gray-100 text-muted-foreground"
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
                  <DecisionResultsDisplay results={results} onNavigate={onNavigate} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step !== "results" && (
          <div className="px-5 py-4 border-t border-gray-100">
            <motion.button
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

const DecisionResultsDisplay = memo(function DecisionResultsDisplay({ results }: { results: PersonalizedRec[]; onNavigate: (path: string) => void }) {
  const displayRecs = useMemo(() => {
    if (results.length > 0) return results.slice(0, 3);
    return FALLBACK_RECOMMENDATIONS;
  }, [results]);

  return (
    <div className="space-y-4">
      {displayRecs.map((rec, idx) => (
        <InsightCard key={rec.id} rec={rec} rank={idx} />
      ))}
      <TasteDNAPanel recs={displayRecs} />
    </div>
  );
});
