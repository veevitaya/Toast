import { useState, useCallback, useRef, useEffect, useMemo, memo, lazy, Suspense } from "react";
import { fetchWithTimeout } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Sparkles, ArrowRight, X, ChevronRight, ChevronDown, RotateCcw, Zap,
  MapPin, Star, Check, TrendingUp, Clock, Heart, Brain,
  Footprints, Car, Globe, Layers,
} from "lucide-react";
import { useLineProfile } from "@/lib/useLineProfile";
import { sendGroupInviteNoRedirect } from "@/lib/liff";
import { trackDecisionEvent } from "@/lib/decisionEvents";
import { useToast } from "@/hooks/use-toast";
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

type UIState = "home" | "refine_open" | "thinking" | "results" | "decision_flow" | "dna" | "confirmed";
type DecisionStep = "mood" | "distance" | "avoid" | "results";
type InlineDecideStep = "mood" | "distance" | "thinking" | "result";

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

const INLINE_MOODS = [
  { id: "comfort", label: "Comfort food", icon: "\uD83C\uDF5C" },
  { id: "adventurous", label: "Try something new", icon: "\uD83C\uDF0D" },
  { id: "healthy", label: "Healthy & light", icon: "\uD83E\uDD57" },
  { id: "indulgent", label: "Treat myself", icon: "\u2728" },
  { id: "quick", label: "Quick bite", icon: "\u26A1" },
  { id: "social", label: "Impress someone", icon: "\uD83D\uDCAB" },
];

const INLINE_DISTANCES = [
  { id: "close", label: "Walking distance", sub: "< 1 km" },
  { id: "medium", label: "Short ride", sub: "1-3 km" },
  { id: "flexible", label: "Anywhere good", sub: "Any distance" },
];

const DISTANCE_PILLS = [
  { key: "close", km: 0.5, label: "Walking", sub: "Under 1 km", Icon: Footprints },
  { key: "medium", km: 3, label: "Short ride", sub: "Under 3 km", Icon: Car },
  { key: "flexible", km: 10, label: "Anywhere", sub: "Any distance", Icon: Globe },
] as const;

function getTimeBasedHeadline(): string {
  return "Toast\u2019s picks for today";
}

function getTimeBasedSub(): string {
  return "I think you\u2019ll love this!";
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

function optimizeImageUrl(url: string, width: number, quality = 50): string {
  if (!url || !url.includes("unsplash.com")) return url;
  return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`);
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
    <div
      className="rounded-2xl overflow-hidden bg-white border border-gray-100 animate-page-in"
      style={{
        boxShadow: isTop ? "0 8px 32px -8px rgba(0,0,0,0.10)" : "0 4px 16px -4px rgba(0,0,0,0.06)",
        animationDelay: `${rank * 80}ms`,
      }}
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
    </div>
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
    <div
      className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-4 mt-4 animate-page-in"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: "200ms" }}
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
    </div>
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
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToCard = useCallback(() => {
    requestAnimationFrame(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

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

  const [inlineDecideStep, setInlineDecideStep] = useState<InlineDecideStep>("mood");
  const [inlineMood, setInlineMood] = useState<string | null>(null);
  const [inlineDistance, setInlineDistance] = useState<string | null>(null);
  const [inlineResult, setInlineResult] = useState<PersonalizedRec | null>(null);

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
      const res = await fetchWithTimeout("/api/restaurants/personalized", {
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
    onRefineToggle?.(false);
    setUIState("thinking");
    const thinkingStart = Date.now();
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
      if (results !== FALLBACK_RECOMMENDATIONS && results.length > 0) {
        setResultsRecs(results.slice(0, 3));
      } else {
        setResultsRecs(FALLBACK_RECOMMENDATIONS);
      }
      const elapsed = Date.now() - thinkingStart;
      const remaining = Math.max(0, 2800 - elapsed);
      setTimeout(() => setUIState("results"), remaining);
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

  const { toast } = useToast();
  const [swipeLoading, setSwipeLoading] = useState(false);

  const handleSwipeInvite = useCallback(async () => {
    const userId = userProfile?.userId;
    const displayName = userProfile?.displayName || "Toast Lover";
    const pictureUrl = userProfile?.pictureUrl || "";

    if (!userId || userId.startsWith("guest_")) {
      toast({ title: "Log in with LINE", description: "Connect with LINE to start a group swipe session" });
      return;
    }

    setSwipeLoading(true);
    try {
      let latitude: string | undefined;
      let longitude: string | undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
        );
        latitude = pos.coords.latitude.toString();
        longitude = pos.coords.longitude.toString();
      } catch {}

      const sourceData = JSON.stringify({
        source: "toast_decides",
        craving: decisionCraving,
        distance: decisionDistance,
        avoid: decisionAvoid,
        results: decisionResults.length > 0
          ? decisionResults.map(r => ({ id: r.id, name: r.name, category: r.category, rating: r.rating, imageUrl: r.imageUrl, address: r.address, priceLevel: r.priceLevel }))
          : recs.slice(0, 5).map(r => ({ id: r.id, name: r.name, category: r.category, rating: r.rating, imageUrl: r.imageUrl, address: r.address, priceLevel: r.priceLevel })),
      });

      const createRes = await fetchWithTimeout("/api/group/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostLineUserId: userId,
          hostDisplayName: displayName,
          hostPictureUrl: pictureUrl,
          sessionType: "toast_decides",
          sourceData,
          latitude,
          longitude,
        }),
      });

      if (!createRes.ok) throw new Error("Failed to create session");
      const createdSession = await createRes.json();
      const sessionCode = createdSession.sessionCode;

      try {
        const shareResult = await sendGroupInviteNoRedirect(sessionCode);
        toast({
          title: "Group swipe session created!",
          description: shareResult.shared ? "Invite sent — heading to waiting room" : "Heading to waiting room",
        });
      } catch {
        toast({
          title: "Group swipe session created!",
          description: "Heading to waiting room",
        });
      }

      sessionStorage.setItem("toast_group_host_session", sessionCode);
      navigate(`/group/waiting?session=${sessionCode}`);
    } catch {
      toast({
        title: "Couldn't create session",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSwipeLoading(false);
    }
  }, [userProfile, decisionCraving, decisionDistance, decisionAvoid, decisionResults, recs, navigate, toast]);


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

  const isRefineOpen = uiState === "refine_open";

  const expandSpring = { type: "spring" as const, stiffness: 280, damping: 26 };

  const handleLooksGreat = useCallback(() => {
    trackDecisionEvent("detail_viewed", { userId: userProfile?.userId, restaurantId: primaryRec.id, metadata: { category: primaryRec.category } });
    setUIState("confirmed");
    scrollToCard();
    setTimeout(() => {
      navigate(`/restaurant/${primaryRec.id}`);
    }, 2200);
  }, [userProfile?.userId, primaryRec, navigate, scrollToCard]);

  const handleInlineMoodSelect = useCallback((mood: string) => {
    setInlineMood(mood);
    setTimeout(() => setInlineDecideStep("distance"), 300);
  }, []);

  const handleInlineDistanceSelect = useCallback(async (dist: string) => {
    setInlineDistance(dist);
    setInlineDecideStep("thinking");
    try {
      const results = await fetchRecs({
        craving: inlineMood,
        distancePref: dist === "close" ? "close" : dist === "medium" ? "medium" : "flexible",
      });
      const pick = results.length > 0 ? results[0] : recs.length > 1 ? recs[1] : recs[0];
      setTimeout(() => {
        setInlineResult(pick);
        setInlineDecideStep("result");
      }, 2000);
    } catch {
      setTimeout(() => {
        setInlineResult(recs.length > 1 ? recs[1] : recs[0]);
        setInlineDecideStep("result");
      }, 2000);
    }
  }, [inlineMood, fetchRecs, recs]);

  const openInlineDecide = useCallback(() => {
    setInlineDecideStep("mood");
    setInlineMood(null);
    setInlineDistance(null);
    setInlineResult(null);
    setUIState("decision_flow");
    scrollToCard();
    trackDecisionEvent("primary_cta_clicked", { userId: userProfile?.userId });
  }, [userProfile?.userId, scrollToCard]);

  return (
    <div ref={containerRef} className={isRefineOpen ? "flex flex-col flex-1 min-h-0" : "px-6 pt-4 pb-2"} data-testid="toast-decides-section">
      {!isRefineOpen && uiState === "home" && (
        <>
        <h2 className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest mb-3" data-testid="text-toast-decides-label">Toast Decides</h2>
        <motion.div
          layout
          transition={expandSpring}
          className="rounded-[20px] overflow-hidden bg-white border border-gray-100 relative"
          style={{ boxShadow: isExpanded ? "0 8px 32px -8px rgba(0,0,0,0.10)" : "0 4px 20px rgba(0,0,0,0.03)" }}
          data-testid="card-toast-decides"
        >
          <motion.div layout="position" className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #FFCC02, hsl(45, 90%, 65%))" }} />

          {showSkeleton ? (
            <HeroSkeleton />
          ) : (
            <>
              <motion.div
                layout="position"
                className="p-4 w-full text-left cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => setIsExpanded(!isExpanded)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsExpanded(!isExpanded); } }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Collapse recommendation" : "Expand recommendation"}
                data-testid="button-expand-area"
              >
                <motion.div layout="position" className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFCC02]" />
                    <span className="text-[12px] font-bold text-foreground" data-testid="text-toast-decides">{headline}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={expandSpring}
                    className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center"
                    data-testid="button-expand-toggle"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </motion.div>

                <motion.p layout="position" className="text-[11px] text-muted-foreground mb-2.5">{subheadline}</motion.p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={primaryRec.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    layout="position"
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-[48px] h-[48px] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={optimizeImageUrl(primaryRec.imageUrl, 200)} alt={primaryRec.name} className="w-full h-full object-cover" loading="eager" decoding="sync" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-foreground truncate" data-testid="text-primary-rec-name">{primaryRec.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {primaryRec.category} · {primaryRec.district || primaryRec.address} · <Star className="w-3 h-3 inline text-[#FFCC02] fill-[#FFCC02] -mt-0.5" /> {primaryRec.rating}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[15px] font-bold text-emerald-600">{primaryRec.match}%</span>
                      <p className="text-[9px] text-muted-foreground font-medium">match</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <motion.div layout="position" className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      key={primaryRec.id}
                      initial={{ width: 0 }}
                      animate={{ width: `${primaryRec.match}%` }}
                      transition={{ delay: 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full rounded-full"
                      style={{ background: primaryRec.match >= 80 ? "linear-gradient(90deg, #22c55e, #16a34a)" : "linear-gradient(90deg, #FFCC02, #eab308)" }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium flex-shrink-0">confidence</span>
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={expandSpring}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="border-t border-gray-100 pt-3">
                        <motion.button
                          onClick={handleLooksGreat}
                          className="relative w-full rounded-2xl overflow-hidden mb-3 group"
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05, ...expandSpring }}
                          data-testid={`card-primary-rec-${primaryRec.id}`}
                        >
                          <div className="relative w-full h-[140px]">
                            <img
                              src={optimizeImageUrl(primaryRec.imageUrl, 400)}
                              alt={primaryRec.name}
                              className="w-full h-full object-cover"
                              loading="eager"
                              decoding="sync"
                              fetchPriority="high"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <div className="absolute top-2.5 left-2.5 bg-[#FFCC02] text-foreground text-[10px] font-bold rounded-full px-2 py-0.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Top Pick
                            </div>
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                              <span className="text-white/90 text-[11px] font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {primaryRec.district || primaryRec.address} · {"$".repeat(primaryRec.priceLevel || 1)}
                              </span>
                            </div>
                          </div>
                        </motion.button>

                        {primaryRec.insight && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...expandSpring }} className="flex items-start gap-2 mb-3 bg-amber-50/60 rounded-xl px-3 py-2 border border-amber-100/50">
                            <Brain className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-amber-800 leading-relaxed capitalize">{primaryRec.insight}</p>
                          </motion.div>
                        )}

                        {primaryRec.reasonChips && primaryRec.reasonChips.length > 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-1.5 mb-3">
                            {primaryRec.reasonChips.map((chip, i) => (
                              <span key={i} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100" data-testid={`chip-reason-${i}`}>{chip}</span>
                            ))}
                          </motion.div>
                        )}

                        {primaryRec.scores && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...expandSpring }} className="mb-3 space-y-1.5">
                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-2">Why this pick</p>
                            <ScoreBar label="Taste match" value={primaryRec.scores.taste} color="#22c55e" />
                            <ScoreBar label="Right timing" value={primaryRec.scores.daypart} color="#FFCC02" />
                            <ScoreBar label="Popularity" value={primaryRec.scores.popularity} color="#3b82f6" />
                            <ScoreBar label="Value" value={primaryRec.scores.value} color="#8b5cf6" />
                          </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ...expandSpring }} className="flex gap-2 mb-3">
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={handleLooksGreat}
                            className="flex-1 h-11 rounded-xl bg-[#FFCC02] flex items-center justify-center gap-2 font-semibold text-sm text-foreground"
                            data-testid="button-choose-this"
                          >
                            Looks great <ArrowRight className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={tryAnother}
                            className="h-11 w-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-muted-foreground"
                            data-testid="button-try-another"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </motion.button>
                        </motion.div>

                        {secondaryRecs.length > 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-2.5 mb-3">
                            {secondaryRecs.map((rec, idx) => (
                              <div key={rec.id} className="flex-1 cursor-pointer" onClick={() => promoteSecondary(idx)} data-testid={`card-secondary-rec-${rec.id}`}>
                                <div className="relative w-full h-[56px] rounded-xl overflow-hidden border border-gray-100">
                                  <img src={optimizeImageUrl(rec.imageUrl, 200, 40)} alt={rec.name} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={(e) => { const img = e.currentTarget; img.style.display = "none"; }} />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                  <div className="absolute top-1.5 right-1.5 bg-emerald-500/90 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{rec.match}%</div>
                                  <p className="absolute bottom-1.5 left-1.5 text-white text-[10px] font-semibold drop-shadow">{rec.name}</p>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-2">
                          <button
                            onClick={openInlineDecide}
                            className="w-full h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground"
                            data-testid="button-help-decide"
                          >
                            <Zap className="w-3.5 h-3.5" /> Help me decide
                          </button>
                        </motion.div>

                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setUIState("refine_open"); onRefineToggle?.(true); trackDecisionEvent("refine_opened", { userId: userProfile?.userId }); }}
                          className="w-full h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2 text-[11px] font-medium text-muted-foreground"
                          data-testid="button-refine"
                        >
                          Refine my picks <ChevronRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
        </>
      )}

      <AnimatePresence mode="wait">
        {uiState === "confirmed" && (
          <ConfirmedView pick={primaryRec} />
        )}
      </AnimatePresence>

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
            onSwipeInvite={handleSwipeInvite}
            swipeLoading={swipeLoading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uiState === "thinking" && (
          <ThinkingScreenFullscreen onComplete={() => {}} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {uiState === "decision_flow" && (
          <InlineDecideFlow
            step={inlineDecideStep}
            selectedMood={inlineMood}
            selectedDistance={inlineDistance}
            onMoodSelect={handleInlineMoodSelect}
            onDistanceSelect={handleInlineDistanceSelect}
            onClose={() => setUIState("home")}
            result={inlineResult}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmedView({ pick }: { pick: PersonalizedRec }) {
  const expandSpring = { type: "spring" as const, stiffness: 280, damping: 26 };
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={expandSpring}
      className="rounded-[20px] border border-emerald-200 overflow-hidden bg-white"
      style={{ boxShadow: "0 8px 32px -8px rgba(34,197,94,0.2)" }}
      data-testid="confirmed-view"
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
        <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[16px] font-bold text-foreground mb-1">
          Great choice!
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[12px] text-muted-foreground mb-4">
          Opening {pick.name} for you...
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img src={pick.imageUrl} alt={pick.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[12px] font-bold text-foreground truncate">{pick.name}</p>
            <p className="text-[10px] text-muted-foreground">{pick.address} · {"฿".repeat(pick.priceLevel)}</p>
          </div>
          <span className="text-[12px] font-bold text-emerald-600">{pick.match}%</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function InlineDecideFlow({ step, selectedMood, selectedDistance, onMoodSelect, onDistanceSelect, onClose, result, onNavigate }: {
  step: InlineDecideStep;
  selectedMood: string | null;
  selectedDistance: string | null;
  onMoodSelect: (m: string) => void;
  onDistanceSelect: (d: string) => void;
  onClose: () => void;
  result: PersonalizedRec | null;
  onNavigate: (path: string) => void;
}) {
  const expandSpring = { type: "spring" as const, stiffness: 280, damping: 26 };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={expandSpring}
      className="rounded-[20px] bg-white border border-gray-100 overflow-hidden relative"
      style={{ boxShadow: "0 8px 32px -8px rgba(0,0,0,0.10)" }}
      data-testid="inline-decide-flow"
    >
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px]" style={{ background: "linear-gradient(90deg, #FFCC02, hsl(45, 90%, 65%))" }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFCC02]" />
            <span className="text-[13px] font-bold text-foreground">Help me decide</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center" data-testid="button-close-decide">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          {["mood", "distance", "result"].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                (step === "mood" && i === 0) || (step === "distance" && i <= 1) || (step === "thinking" && i <= 1) || (step === "result" && i <= 2) ? "bg-[#FFCC02]" : "bg-gray-200"
              }`} />
              {i < 2 && <div className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${
                (step === "distance" && i === 0) || (step === "thinking" && i <= 1) || (step === "result") ? "bg-[#FFCC02]" : "bg-gray-200"
              }`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "mood" && (
            <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p className="text-[12px] text-muted-foreground mb-3">What's your mood right now?</p>
              <div className="grid grid-cols-2 gap-2">
                {INLINE_MOODS.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onMoodSelect(mood.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                      selectedMood === mood.id ? "border-[#FFCC02] bg-[#FFCC02]/10" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                    data-testid={`inline-mood-${mood.id}`}
                  >
                    <span className="text-lg">{mood.icon}</span>
                    <span className="text-[11px] font-semibold text-foreground">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "distance" && (
            <motion.div key="distance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p className="text-[12px] text-muted-foreground mb-3">How far are you willing to go?</p>
              <div className="space-y-2">
                {INLINE_DISTANCES.map((dist) => (
                  <motion.button
                    key={dist.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDistanceSelect(dist.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                      selectedDistance === dist.id ? "border-[#FFCC02] bg-[#FFCC02]/10" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                    data-testid={`inline-distance-${dist.id}`}
                  >
                    <span className="text-[12px] font-semibold text-foreground">{dist.label}</span>
                    <span className="text-[10px] text-muted-foreground">{dist.sub}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "thinking" && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-3"
              >
                <img src={mascotPath} alt="Thinking" className="w-full h-full object-contain" />
              </motion.div>
              <p className="text-[13px] font-bold text-foreground mb-2">Toast is thinking...</p>
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
                {["Analyzing your taste profile", "Checking what's popular nearby", "Finding something you'll love..."].map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.5 }}
                    className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.5 }}
                      className="text-emerald-500"
                    >{"\u2713"}</motion.span>
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={expandSpring}>
              <p className="text-[12px] text-muted-foreground mb-3">Based on your mood, here's what I found:</p>
              <div className="relative w-full h-[130px] rounded-2xl overflow-hidden mb-3">
                <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 bg-emerald-500/90 text-white text-[11px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {result.match}%
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <p className="text-white text-[16px] font-bold">{result.name}</p>
                  <p className="text-white/80 text-[11px]">{result.category} · {result.address} · {"฿".repeat(result.priceLevel)}</p>
                </div>
              </div>
              {result.reasonChips && result.reasonChips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {result.reasonChips.map((chip, i) => (
                    <span key={i} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100">{chip}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate(`/restaurant/${result.id}`)}
                  className="flex-1 h-10 rounded-xl bg-[#FFCC02] flex items-center justify-center gap-2 font-semibold text-[13px] text-foreground"
                  data-testid="button-decide-letsgo"
                >
                  Let's go <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-1.5 text-[12px] font-medium text-muted-foreground"
                  data-testid="button-decide-again"
                >
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

const THINKING_STEPS = [
  { text: "Analyzing your taste profile", delay: 0 },
  { text: "Checking what\u2019s popular nearby", delay: 0.6 },
  { text: "Finding something you\u2019ll love\u2026", delay: 1.2 },
];

function ThinkingScreenFullscreen({ onComplete: _ }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#F5F5F5]"
      data-testid="thinking-screen"
    >
      <div className="h-full flex flex-col items-center justify-center px-8 text-center safe-top safe-bottom">
        <div className="px-5 pt-14 pb-3 absolute top-0 left-0 right-0">
          <div className="flex items-center justify-center gap-2">
            <img src={mascotPath} alt="" className="w-6 h-6 object-contain" />
            <span className="text-[12px] font-bold text-foreground">Toast Decides</span>
          </div>
          <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "70%" }}
              animate={{ width: "95%" }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="h-full rounded-full bg-[#FFCC02]"
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[22px] font-bold text-foreground mb-5"
          data-testid="text-thinking-title"
        >
          Toast is thinking...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-6"
        >
          <img
            src={mascotPath}
            alt="Toast mascot thinking"
            className="w-[140px] h-[140px] object-contain"
            data-testid="img-thinking-mascot"
          />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Sparkles className="w-6 h-6 text-[#FFCC02]" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-2"
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.3 }}
          >
            <Star className="w-5 h-5 text-[#FFCC02]/60" />
          </motion.div>
        </motion.div>

        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#FFCC02]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
            />
          ))}
        </div>

        <div className="w-full max-w-[280px] space-y-4">
          {THINKING_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#FFCC02] flex-shrink-0"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: step.delay }}
              />
              <span className="text-[15px] text-foreground/80 text-left">{step.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", damping: 26, stiffness: 240, mass: 1 }}
      className="flex flex-col h-full"
      data-testid="refine-sheet"
      role="dialog"
      aria-label="What's your mood?"
    >
      <div className="flex-shrink-0">
        <div className="px-5 pb-3 pt-1 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/60 flex items-center justify-center"
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

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
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

      <div className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-gray-100">
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
  );
}

interface ResultsScreenProps {
  recs: PersonalizedRec[];
  onClose: () => void;
  onRefineAgain: () => void;
  onSwipeInvite: () => void;
  swipeLoading: boolean;
}

function ResultsScreen({ recs, onClose, onRefineAgain, onSwipeInvite, swipeLoading }: ResultsScreenProps) {
  const displayRecs = recs.length > 0 ? recs : FALLBACK_RECOMMENDATIONS;
  const mealPeriod = useMemo(getMealPeriod, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#F5F5F5]"
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
            transition={{ delay: 0.5 }}
            className="mt-5 mb-2"
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onSwipeInvite}
              disabled={swipeLoading}
              className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity ${
                swipeLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#06C755] text-white"
              }`}
              data-testid="button-results-swipe-invite"
            >
              <Layers className="w-4 h-4" />
              {swipeLoading ? "Creating session..." : "Swipe Together via LINE"}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-4 text-center"
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

