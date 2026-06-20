import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, MapPin, Star, Check, RotateCcw,
  Navigation, Heart, Share2, Bike, ChevronRight,
  SlidersHorizontal, ChevronDown, Wallet, UtensilsCrossed, LocateFixed, Search, X,
} from "lucide-react";
import { useLineProfile } from "@/lib/useLineProfile";
import { useSavedRestaurants } from "@/hooks/use-saved-restaurants";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fetchWithTimeout } from "@/lib/queryClient";
import { trackDecisionEvent } from "@/lib/decisionEvents";
import mascotPath from "@assets/toast_mascot_nobg.png";
import waffleThinkingPath from "@assets/waffle-thinking-cropped.png";
import toastThinkingPath from "@assets/toast-thinking-cropped.png";

interface SoloPick {
  id: number;
  name: string;
  category: string | null;
  rating: string | null;
  imageUrl: string | null;
  address: string | null;
  priceLevel: number | null;
  district: string | null;
  lat: string | null;
  lng: string | null;
  reasonChips: string[];
  confidenceText: string | null;
  description: string | null;
  vibes: string[];
}

interface SoloDecideResponse {
  pick: SoloPick | null;
  alternatives: SoloPick[];
  learning: boolean;
}

type Step = "intent" | "loading" | "result" | "locked";

const MOODS = [
  { id: "comforting", emoji: "\uD83C\uDF5C", key: "mood_comfort", subKey: "mood_comfort_sub", tint: "#FFF1E0" },
  { id: "exciting", emoji: "\uD83C\uDF0D", key: "mood_exciting", subKey: "mood_exciting_sub", tint: "#E8F4FF" },
  { id: "healthy", emoji: "\uD83E\uDD57", key: "mood_healthy", subKey: "mood_healthy_sub", tint: "#E9F8EC" },
  { id: "cheap", emoji: "\uD83D\uDCB8", key: "mood_cheap", subKey: "mood_cheap_sub", tint: "#FFF6DA" },
  { id: "worth", emoji: "\u2728", key: "mood_worth", subKey: "mood_worth_sub", tint: "#F3ECFF" },
  { id: "surprise", emoji: "\uD83C\uDFB2", key: "mood_surprise", subKey: "mood_surprise_sub", tint: "#FFE9EC" },
];

// Fine-tune options. `districts` holds canonical DB district names sent to the
// backend; the user-facing label comes from i18n (`loc_<id>`), so display text
// and the matching key stay decoupled.
const LOCATIONS: { id: string; kind: "neighborhood" | "bts" | "mall"; popular: boolean; districts: string[] }[] = [
  { id: "sukhumvit", kind: "neighborhood", popular: true, districts: ["Sukhumvit"] },
  { id: "silom", kind: "neighborhood", popular: true, districts: ["Silom"] },
  { id: "siam", kind: "neighborhood", popular: true, districts: ["Siam"] },
  { id: "ari", kind: "neighborhood", popular: true, districts: ["Ari"] },
  { id: "thonglor", kind: "neighborhood", popular: true, districts: ["Thonglor"] },
  { id: "chinatown", kind: "neighborhood", popular: true, districts: ["Chinatown"] },
  { id: "ekkamai", kind: "neighborhood", popular: false, districts: ["Ekkamai"] },
  { id: "sathorn", kind: "neighborhood", popular: false, districts: ["Sathorn", "Silom"] },
  { id: "asok", kind: "bts", popular: false, districts: ["Sukhumvit"] },
  { id: "phromphong", kind: "bts", popular: false, districts: ["Phrom Phong", "Sukhumvit"] },
  { id: "iconsiam", kind: "mall", popular: false, districts: ["Charoen Krung"] },
  { id: "emquartier", kind: "mall", popular: false, districts: ["Phrom Phong", "Sukhumvit"] },
  { id: "centralworld", kind: "mall", popular: false, districts: ["Ratchathewi", "Siam", "Langsuan"] },
];

const BUDGETS = [
  { id: "cheap", glyph: "\u0E3F" },
  { id: "mid", glyph: "\u0E3F\u0E3F" },
  { id: "fancy", glyph: "\u0E3F\u0E3F\u0E3F" },
  { id: "splurge", glyph: "\u0E3F\u0E3F\u0E3F\u0E3F" },
];

const DINING = [
  { id: "street", emoji: "\uD83C\uDF62" },
  { id: "rooftop", emoji: "\uD83C\uDFD9\uFE0F" },
  { id: "riverside", emoji: "\uD83C\uDF0A" },
  { id: "buffet", emoji: "\uD83C\uDF7D\uFE0F" },
  { id: "dessert", emoji: "\uD83C\uDF70" },
  { id: "cafe", emoji: "\u2615" },
  { id: "finedining", emoji: "\uD83C\uDF77" },
  { id: "latenight", emoji: "\uD83C\uDF19" },
];

function greetingFor(hour: number): { key: string; emoji: string } {
  if (hour < 11) return { key: "greet_breakfast", emoji: "\u2600\uFE0F" };
  if (hour < 15) return { key: "greet_lunch", emoji: "\uD83C\uDF24\uFE0F" };
  if (hour < 18) return { key: "greet_afternoon", emoji: "\uD83C\uDF75" };
  if (hour < 22) return { key: "greet_dinner", emoji: "\uD83C\uDF06" };
  return { key: "greet_late", emoji: "\uD83C\uDF19" };
}

const REFINE_CHIPS = [
  { id: "expensive", key: "refine_expensive", mood: "cheap" },
  { id: "lighter", key: "refine_lighter", mood: "healthy" },
  { id: "vibe", key: "refine_vibe", mood: "exciting" },
  { id: "surprise", key: "refine_surprise", mood: "surprise" },
];

const FEEDBACK = [
  { id: "loved", emoji: "\uD83D\uDE0D", key: "fb_loved" },
  { id: "good", emoji: "\uD83D\uDE0A", key: "fb_good" },
  { id: "okay", emoji: "\uD83D\uDE10", key: "fb_okay" },
  { id: "no", emoji: "\uD83D\uDE45", key: "fb_no" },
];

const DELIVERY = [
  { id: "grab", name: "Grab", emoji: "\uD83D\uDFE2", color: "#00B14F", deepLink: (n: string) => `grab://food/search?q=${encodeURIComponent(n)}`, fallback: (n: string) => `https://food.grab.com/th/en/restaurants?search=${encodeURIComponent(n)}` },
  { id: "lineman", name: "LINE MAN", emoji: "\uD83D\uDFE9", color: "#00C300", deepLink: (n: string) => `lineman://food/search?q=${encodeURIComponent(n)}`, fallback: (n: string) => `https://lineman.line.me/restaurant/search?q=${encodeURIComponent(n)}` },
  { id: "robinhood", name: "Robinhood", emoji: "\uD83D\uDFE3", color: "#6C2BD9", deepLink: (n: string) => `robinhood://food/search?q=${encodeURIComponent(n)}`, fallback: (n: string) => `https://robfrnd.app/food?search=${encodeURIComponent(n)}` },
];

const LOADING_LINES = ["loading_1", "loading_2", "loading_3"];

function moodToComparePath(mood: string | null): string {
  const seed: Record<string, [string, string]> = {
    comforting: ["interests", "Comfort food"],
    exciting: ["locations", "Trendy spots"],
    healthy: ["interests", "Healthy"],
    cheap: ["budget", "Cheap"],
    worth: ["budget", "Expensive,Fancy"],
  };
  const params = new URLSearchParams();
  const s = mood ? seed[mood] : undefined;
  if (s) params.set(s[0], s[1]);
  params.set("edit", "1");
  return `/solo/results?${params.toString()}`;
}

export default function SoloJourney() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { profile } = useLineProfile();
  const { toast } = useToast();
  const { saveToMine, isSaved } = useSavedRestaurants();

  const [step, setStep] = useState<Step>("intent");
  const [mood, setMood] = useState<string | null>(null);
  const [pick, setPick] = useState<SoloPick | null>(null);
  const [alternatives, setAlternatives] = useState<SoloPick[]>([]);
  const [learning, setLearning] = useState(false);
  const [excludeIds, setExcludeIds] = useState<number[]>([]);
  const [refineOpen, setRefineOpen] = useState(false);
  const [refined, setRefined] = useState(false);
  const [loadingLine, setLoadingLine] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [error, setError] = useState(false);

  // Fine-tune filters (intent step only)
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [locQuery, setLocQuery] = useState("");
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);
  const [nearMeCoords, setNearMeCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [dining, setDining] = useState<string | null>(null);

  const userId = profile?.userId;
  const excludeRef = useRef<number[]>([]);
  // Active filters captured when a decision starts, so "Another option" and
  // refine chips reuse the same fine-tune selections without re-reading state.
  const filtersRef = useRef<Record<string, unknown>>({});

  const decide = useCallback(async (selectedMood: string, exclude: number[]) => {
    setError(false);
    const now = new Date();
    try {
      const res = await fetchWithTimeout("/api/solo/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || undefined,
          mood: selectedMood,
          hour: now.getHours(),
          dayOfWeek: now.getDay(),
          excludeIds: exclude,
          ...filtersRef.current,
        }),
      }, 9000);
      if (!res.ok) throw new Error("decide failed");
      const data: SoloDecideResponse = await res.json();
      if (!data.pick) throw new Error("no pick");
      setPick(data.pick);
      setAlternatives((data.alternatives || []).slice(0, 2));
      setLearning(data.learning);
      return data.pick;
    } catch (e) {
      setError(true);
      return null;
    }
  }, [userId]);

  const runDecision = useCallback(async (selectedMood: string, exclude: number[]) => {
    setStep("loading");
    setLoadingLine(0);
    const started = Date.now();
    const result = await decide(selectedMood, exclude);
    const elapsed = Date.now() - started;
    const minDelay = 1400;
    if (elapsed < minDelay) {
      await new Promise((r) => setTimeout(r, minDelay - elapsed));
    }
    if (result) {
      excludeRef.current = [...exclude, result.id];
      setExcludeIds(excludeRef.current);
      setStep("result");
      trackDecisionEvent("hero_impression", { userId, restaurantId: result.id, metadata: { source: "solo_journey", mood: selectedMood } });
    } else {
      setStep("result");
    }
  }, [decide, userId]);

  useEffect(() => {
    if (step !== "loading") return;
    const timer = setInterval(() => {
      setLoadingLine((p) => Math.min(p + 1, LOADING_LINES.length - 1));
    }, 600);
    return () => clearInterval(timer);
  }, [step]);

  // Tapping a mood only highlights it now — the decision runs from the CTA so
  // users can fine-tune first.
  const handleMood = (m: string) => {
    setMood((prev) => (prev === m ? null : m));
  };

  const buildFilters = (): Record<string, unknown> => {
    // Only treat "Near me" as active once real coordinates have arrived —
    // otherwise the backend would silently ignore nearMe with no coords.
    const useNear = useCurrentLoc && !!nearMeCoords;
    const districts = useNear
      ? []
      : Array.from(
          new Set(
            LOCATIONS.filter((l) => selectedLocs.includes(l.id)).flatMap((l) => l.districts),
          ),
        );
    return {
      districts,
      nearMe: useNear,
      userLat: useNear ? nearMeCoords!.lat : undefined,
      userLng: useNear ? nearMeCoords!.lng : undefined,
      budget: budget || undefined,
      dining: dining || undefined,
    };
  };

  const handleDecide = () => {
    if (!mood) return;
    filtersRef.current = buildFilters();
    setRefined(false);
    excludeRef.current = [];
    setExcludeIds([]);
    runDecision(mood, []);
  };

  const handleAnother = () => {
    if (!mood) return;
    setRefined(true);
    trackDecisionEvent("alternative_requested", { userId, restaurantId: pick?.id, metadata: { source: "solo_journey" } });
    runDecision(mood, excludeRef.current);
  };

  const handleRefine = (chipMood: string, chipId: string) => {
    setRefineOpen(false);
    setRefined(true);
    setMood(chipMood);
    // "Too expensive" should drop any budget cap so a cheaper pick can surface.
    if (chipId === "expensive") {
      filtersRef.current = { ...filtersRef.current, budget: undefined };
      setBudget(null);
    }
    trackDecisionEvent("refine_applied", { userId, restaurantId: pick?.id, metadata: { source: "solo_journey", refine: chipId } });
    runDecision(chipMood, excludeRef.current);
  };

  const toggleLoc = (id: string) => {
    setUseCurrentLoc(false);
    setNearMeCoords(null);
    setLocQuery("");
    setSelectedLocs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const toggleCurrentLoc = () => {
    if (useCurrentLoc) {
      setUseCurrentLoc(false);
      setNearMeCoords(null);
      return;
    }
    setSelectedLocs([]);
    setLocQuery("");
    if (!("geolocation" in navigator)) {
      toast({ title: t("soloJourney.location_unavailable") });
      return;
    }
    setUseCurrentLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => setNearMeCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setUseCurrentLoc(false);
        setNearMeCoords(null);
        toast({ title: t("soloJourney.location_denied") });
      },
      { timeout: 8000, maximumAge: 60000 },
    );
  };

  const clearFilters = () => {
    setSelectedLocs([]);
    setUseCurrentLoc(false);
    setNearMeCoords(null);
    setLocQuery("");
    setBudget(null);
    setDining(null);
  };

  const handlePickAlternative = (alt: SoloPick) => {
    if (!pick || alt.id === pick.id) return;
    const prev = pick;
    setPick(alt);
    setAlternatives((alts) => alts.map((a) => (a.id === alt.id ? prev : a)));
    setRefined(true);
    trackDecisionEvent("alternative_requested", { userId, restaurantId: alt.id, metadata: { source: "solo_journey_swap" } });
  };

  const handleAccept = () => {
    if (!pick) return;
    setStep("locked");
    trackDecisionEvent("recommendation_accepted", { userId, restaurantId: pick.id, metadata: { source: "solo_journey", mood } });
  };

  const handleDirections = () => {
    if (!pick?.lat || !pick?.lng) {
      toast({ title: t("soloJourney.no_location") });
      return;
    }
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${pick.lat},${pick.lng}`, "_blank");
  };

  const handleSave = () => {
    if (!pick) return;
    saveToMine(pick.id);
    trackDecisionEvent("saved", { userId, restaurantId: pick.id, metadata: { source: "solo_journey" } });
    toast({ title: t("soloJourney.saved_done") });
  };

  const handleShare = async () => {
    if (!pick) return;
    const url = `${window.location.origin}/restaurant/${pick.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: pick.name, url }); } catch { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(url); toast({ title: t("soloJourney.link_copied") }); } catch { /* noop */ }
    }
  };

  const handleDelivery = (svc: typeof DELIVERY[number]) => {
    if (!pick) return;
    const newWindow = window.open("", "_blank");
    const fallbackUrl = svc.fallback(pick.name);
    if (newWindow) {
      newWindow.location.href = svc.deepLink(pick.name);
      setTimeout(() => {
        try { if (newWindow && !newWindow.closed) newWindow.location.href = fallbackUrl; } catch { /* noop */ }
      }, 1200);
    } else {
      window.open(fallbackUrl, "_blank");
    }
  };

  const handleFeedback = (id: string) => {
    setFeedbackGiven(id);
    trackDecisionEvent(id === "no" ? "recommendation_rejected" : "recommendation_accepted", { userId, restaurantId: pick?.id, metadata: { source: "solo_journey_feedback", rating: id } });
  };

  const restart = () => {
    setStep("intent");
    setMood(null);
    setPick(null);
    setAlternatives([]);
    setRefined(false);
    setRefineOpen(false);
    setFeedbackGiven(null);
    setDeliveryOpen(false);
    excludeRef.current = [];
    setExcludeIds([]);
    setFiltersOpen(false);
    clearFilters();
    filtersRef.current = {};
  };

  const priceStr = (n: number | null) => "\u0E3F".repeat(Math.max(1, n || 1));

  // ---- Derived values for the intent (fine-tune) UI ----
  const greeting = greetingFor(new Date().getHours());
  // "Near me" is chosen but coordinates haven't resolved yet.
  const locating = useCurrentLoc && !nearMeCoords;
  const locLabel = (id: string) => t(`soloJourney.loc_${id}`);
  const q = locQuery.trim().toLowerCase();
  const locResults = q ? LOCATIONS.filter((l) => locLabel(l.id).toLowerCase().includes(q)) : [];
  const popularLocs = LOCATIONS.filter((l) => l.popular && !selectedLocs.includes(l.id));
  const selectedLocObjs = LOCATIONS.filter((l) => selectedLocs.includes(l.id));

  const moodLabel = mood ? t(`soloJourney.${MOODS.find((m) => m.id === mood)?.key}`) : null;
  const budgetLabel = budget ? t(`soloJourney.budget_${budget}`) : null;
  const diningLabel = dining ? t(`soloJourney.dining_${dining}`) : null;
  const locationLabels = useCurrentLoc ? [t("soloJourney.near_me")] : selectedLocObjs.map((l) => locLabel(l.id));
  const locationCount = useCurrentLoc ? 1 : selectedLocs.length;
  const filterCount = locationCount + (budget ? 1 : 0) + (dining ? 1 : 0);

  const filterSummaryText = [
    ...locationLabels,
    ...(budgetLabel ? [budgetLabel] : []),
    ...(diningLabel ? [diningLabel] : []),
  ].join(" \u00B7 ");
  const hasFilterSummary = filterCount > 0 && !filtersOpen;

  const summaryChips: string[] = [
    ...(moodLabel ? [moodLabel] : []),
    ...locationLabels,
    ...(budgetLabel ? [t("soloJourney.summary_budget", { label: budgetLabel })] : []),
    ...(diningLabel ? [diningLabel] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center" data-testid="page-solo-journey">
      <div className="w-full max-w-md flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button
          onClick={() => (step === "intent" ? navigate("/") : restart())}
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center active:scale-95 transition-transform"
          data-testid="button-back"
          aria-label={t("common.back")}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        {step === "intent" && (
          <span
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-foreground border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            data-testid="chip-greeting"
          >
            <span>{greeting.emoji}</span>
            {t(`soloJourney.${greeting.key}`)}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col px-5 pb-8">
        <AnimatePresence mode="wait">
          {/* ---------- INTENT ---------- */}
          {step === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 pb-4">
                {/* Title + mascot */}
                <header className="flex items-end justify-between gap-3 pt-1 pb-6">
                  <div className="flex-1">
                    <h1 className="text-[27px] font-bold text-foreground leading-[1.1] tracking-tight" data-testid="text-intent-title">
                      {t("soloJourney.intent_title")}
                    </h1>
                    <p className="text-[15px] text-muted-foreground mt-2 leading-snug" data-testid="text-intent-sub">
                      {t("soloJourney.intent_sub")}
                    </p>
                  </div>
                  <img
                    src={mascotPath}
                    alt=""
                    aria-hidden="true"
                    className="h-[64px] w-[64px] shrink-0 object-contain select-none"
                    data-testid="img-mascot"
                  />
                </header>

                {/* Mood grid — deferred select (highlight only) */}
                <div className="grid grid-cols-2 gap-3">
                  {MOODS.map((m, i) => {
                    const active = mood === m.id;
                    return (
                      <motion.button
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleMood(m.id)}
                        aria-pressed={active}
                        className={`relative h-[120px] rounded-[20px] bg-white p-4 flex flex-col justify-between text-left active:scale-[0.98] transition-all ${active ? "border-[1.5px] border-[#FFCC02] shadow-[0_12px_30px_-10px_rgba(255,204,2,0.5)] -translate-y-0.5" : "border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"}`}
                        data-testid={`button-mood-${m.id}`}
                      >
                        {active && (
                          <span className="absolute right-3 top-3 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#FFCC02] shadow-[0_2px_8px_rgba(255,204,2,0.5)]">
                            <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                          </span>
                        )}
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-full text-[24px] leading-none"
                          style={{ backgroundColor: m.tint }}
                        >
                          {m.emoji}
                        </span>
                        <div>
                          <span className="block text-[15px] font-semibold text-foreground leading-tight">
                            {t(`soloJourney.${m.key}`)}
                          </span>
                          <span className="block text-[12px] text-muted-foreground leading-snug mt-0.5 line-clamp-1">
                            {t(`soloJourney.${m.subKey}`)}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Fine-tune drawer — collapsed by default */}
                <section className="mt-4 overflow-hidden rounded-[20px] bg-white border border-black/[0.06] shadow-[0_6px_20px_-14px_rgba(0,0,0,0.10)]">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((o) => !o)}
                    data-testid="button-filters-toggle"
                    aria-expanded={filtersOpen}
                    aria-controls="finetune-panel"
                    className="flex w-full items-center gap-3 px-4 py-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5A5F]/10">
                      <SlidersHorizontal className="h-[18px] w-[18px] text-[#FF5A5F]" strokeWidth={2.2} />
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-[15px] font-semibold text-foreground">
                        {t("soloJourney.finetune_title")}
                      </span>
                      <span className={`block text-[12.5px] leading-snug line-clamp-1 ${hasFilterSummary ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {hasFilterSummary ? filterSummaryText : t("soloJourney.finetune_hint")}
                      </span>
                    </span>
                    {filterCount > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-bold bg-[#FFCC02] text-black" data-testid="badge-filter-count">
                        {filterCount}
                      </span>
                    )}
                    <ChevronDown
                      className="h-5 w-5 text-muted-foreground transition-transform duration-200"
                      style={{ transform: filtersOpen ? "rotate(180deg)" : "none" }}
                    />
                  </button>

                  <div
                    id="finetune-panel"
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: filtersOpen ? "1fr" : "0fr" }}
                  >
                    <div
                      className="overflow-hidden"
                      aria-hidden={!filtersOpen}
                      {...(filtersOpen ? {} : ({ inert: "" } as any))}
                    >
                      <div
                        className="mx-4 border-t border-black/[0.06] pb-5 pt-4"
                        style={{ opacity: filtersOpen ? 1 : 0, transition: "opacity 200ms ease" }}
                      >
                        {/* Location */}
                        <div className="mb-2.5 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.2} />
                          <span className="text-[12px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
                            {t("soloJourney.location_label")}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 rounded-2xl px-3 transition-colors duration-150 ${useCurrentLoc ? "border-[1.5px] border-[#FFCC02] bg-[#FFF8DC]" : "border border-black/10 bg-white"}`}>
                          {useCurrentLoc ? (
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFCC02]">
                              <LocateFixed className="h-4 w-4 text-black" strokeWidth={2.4} />
                            </span>
                          ) : (
                            <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2.2} />
                          )}

                          {useCurrentLoc ? (
                            <span className="flex min-h-[44px] flex-1 items-center text-[14px] font-semibold text-foreground" data-testid="text-current-location">
                              {locating ? t("soloJourney.locating") : t("soloJourney.current_location")}
                            </span>
                          ) : (
                            <input
                              type="text"
                              inputMode="search"
                              aria-label={t("soloJourney.location_label")}
                              value={locQuery}
                              onChange={(e) => {
                                const v = e.target.value;
                                setLocQuery(v);
                                if (v.trim()) { setUseCurrentLoc(false); setNearMeCoords(null); }
                              }}
                              data-testid="input-location-search"
                              placeholder={t("soloJourney.location_search_ph")}
                              className="min-h-[44px] flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70"
                            />
                          )}

                          {locQuery ? (
                            <button
                              type="button"
                              onClick={() => setLocQuery("")}
                              data-testid="button-clear-location-search"
                              aria-label={t("common.clear")}
                              className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center active:opacity-60"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5">
                                <X className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.4} />
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={toggleCurrentLoc}
                              data-testid="button-current-location"
                              aria-pressed={useCurrentLoc}
                              aria-label={useCurrentLoc ? t("soloJourney.current_location") : t("soloJourney.near_me")}
                              className="-mr-1.5 flex h-11 min-w-[44px] shrink-0 items-center justify-center active:opacity-70"
                            >
                              {useCurrentLoc ? (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.08]">
                                  <X className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-2.5 pr-3 bg-[#FF5A5F]/10">
                                  <LocateFixed className="h-[15px] w-[15px] text-[#FF5A5F]" strokeWidth={2.3} />
                                  <span className="text-[12.5px] font-semibold text-[#FF5A5F]">{t("soloJourney.near_me")}</span>
                                </span>
                              )}
                            </button>
                          )}
                        </div>

                        {selectedLocObjs.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-2" data-testid="list-selected-locations">
                            {selectedLocObjs.map((l) => (
                              <button
                                key={l.id}
                                type="button"
                                onClick={() => toggleLoc(l.id)}
                                data-testid={`chip-selected-loc-${l.id}`}
                                aria-label={`${t("common.remove")} ${locLabel(l.id)}`}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full py-1.5 pl-3.5 pr-2 text-[13px] font-medium border-[1.5px] border-[#FFCC02] bg-[#FFF8DC] transition-all duration-150 active:scale-[0.97]"
                              >
                                {locLabel(l.id)}
                                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/[0.08]">
                                  <X className="h-3 w-3 text-black" strokeWidth={2.6} />
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {q ? (
                          <div className="mt-2.5 flex flex-col gap-1" data-testid="list-location-results">
                            {locResults.length > 0 ? (
                              locResults.map((l) => {
                                const active = selectedLocs.includes(l.id);
                                return (
                                  <button
                                    key={l.id}
                                    type="button"
                                    onClick={() => toggleLoc(l.id)}
                                    data-testid={`option-location-${l.id}`}
                                    aria-pressed={active}
                                    className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-2.5 text-left transition-colors duration-150 ${active ? "bg-[#FFF8DC]" : "active:bg-black/[0.03]"}`}
                                  >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04]">
                                      <MapPin className={`h-4 w-4 ${active ? "text-[#8C6510]" : "text-muted-foreground"}`} strokeWidth={2.2} />
                                    </span>
                                    <span className="flex-1">
                                      <span className="block text-[13.5px] font-medium leading-tight text-foreground">{locLabel(l.id)}</span>
                                      <span className="block text-[11px] leading-snug text-muted-foreground">{t(`soloJourney.loc_kind_${l.kind}`)}</span>
                                    </span>
                                    {active && <Check className="h-4 w-4 shrink-0 text-black" strokeWidth={3} />}
                                  </button>
                                );
                              })
                            ) : (
                              <p className="px-1 py-2 text-[13px] text-muted-foreground" data-testid="text-no-location-results">
                                {t("soloJourney.no_loc_results", { q: locQuery.trim() })}
                              </p>
                            )}
                          </div>
                        ) : (
                          popularLocs.length > 0 && (
                            <>
                              <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                                {t("soloJourney.popular_areas")}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {popularLocs.map((l) => (
                                  <button
                                    key={l.id}
                                    type="button"
                                    onClick={() => toggleLoc(l.id)}
                                    data-testid={`chip-location-${l.id}`}
                                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-[13px] font-medium border border-black/[0.07] bg-white transition-all duration-150 active:scale-[0.97]"
                                  >
                                    <span className="text-[14px] leading-none text-muted-foreground">+</span>
                                    {locLabel(l.id)}
                                  </button>
                                ))}
                              </div>
                            </>
                          )
                        )}

                        {/* Budget */}
                        <div className="mb-2.5 mt-5 flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.2} />
                          <span className="text-[12px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
                            {t("soloJourney.budget_label")}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {BUDGETS.map((b) => {
                            const active = budget === b.id;
                            return (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => setBudget(active ? null : b.id)}
                                data-testid={`chip-budget-${b.id}`}
                                aria-pressed={active}
                                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-all duration-150 active:scale-[0.97] ${active ? "border-[1.5px] border-[#FFCC02] bg-[#FFF8DC] shadow-[0_6px_16px_-10px_rgba(255,204,2,0.55)]" : "border border-black/[0.07] bg-white"}`}
                              >
                                <span className={`text-[15px] font-bold leading-none ${active ? "text-foreground" : "text-[#8C6510]"}`}>{b.glyph}</span>
                                <span className="text-[10.5px] font-medium leading-tight text-muted-foreground">{t(`soloJourney.budget_${b.id}`)}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Dining style */}
                        <div className="mb-2.5 mt-5 flex items-center gap-1.5">
                          <UtensilsCrossed className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.2} />
                          <span className="text-[12px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
                            {t("soloJourney.dining_label")}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {DINING.map((d) => {
                            const active = dining === d.id;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => setDining(active ? null : d.id)}
                                data-testid={`chip-dining-${d.id}`}
                                aria-pressed={active}
                                className={`relative flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center transition-all duration-150 active:scale-[0.97] ${active ? "border-[1.5px] border-[#FFCC02] bg-[#FFF8DC] shadow-[0_6px_16px_-10px_rgba(255,204,2,0.55)]" : "border border-black/[0.07] bg-white"}`}
                              >
                                {active && (
                                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFCC02]">
                                    <Check className="h-2.5 w-2.5 text-black" strokeWidth={3.5} />
                                  </span>
                                )}
                                <span className="text-[18px] leading-none">{d.emoji}</span>
                                <span className="text-[11.5px] font-medium leading-tight text-foreground">{t(`soloJourney.dining_${d.id}`)}</span>
                              </button>
                            );
                          })}
                        </div>

                        {filterCount > 0 && (
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={clearFilters}
                              data-testid="button-clear-filters"
                              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[#E0484D] transition-opacity active:opacity-60"
                            >
                              <X className="h-4 w-4" strokeWidth={2.4} />
                              {t("soloJourney.clear_all")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Reassurance summary */}
                {summaryChips.length > 0 && (
                  <section className="mt-5" data-testid="section-summary">
                    <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {t("soloJourney.summary_label")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {summaryChips.map((s, i) => (
                        <span
                          key={`${s}-${i}`}
                          data-testid={`tag-selected-${i}`}
                          className="rounded-full px-3 py-1.5 text-[12.5px] font-medium bg-[#FFF1B8] text-[#7A5E00]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sticky decision CTA — solid bar with a short fade strip above
                  so scrolling content reads cleanly behind it. */}
              <div className="sticky bottom-0 -mx-5">
                <div className="h-6 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
                <div className="bg-background px-5 pb-4">
                  {(!mood || locating) && (
                    <p className="mb-2 text-center text-[12.5px] text-muted-foreground" data-testid="text-cta-hint">
                      {locating ? t("soloJourney.locating") : t("soloJourney.cta_hint")}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleDecide}
                    disabled={!mood || locating}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC02] px-6 py-4 text-[16px] font-bold text-black shadow-[0_10px_30px_-8px_rgba(255,204,2,0.6)] transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
                    data-testid="button-decide"
                  >
                    <Sparkles className="h-5 w-5" />
                    {t("soloJourney.cta_decide")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- LOADING ---------- */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.img
                src={toastThinkingPath} alt="Toast"
                className="w-28 h-28 object-contain mb-5"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-[#FFB800]" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingLine}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="text-[17px] font-bold"
                    data-testid="text-loading"
                  >
                    {t(`soloJourney.${LOADING_LINES[loadingLine]}`)}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ---------- RESULT ---------- */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
              className="flex-1 flex flex-col"
            >
              {error || !pick ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                  <img src={mascotPath} alt="Toast" className="w-20 h-20 object-contain opacity-80" />
                  <p className="text-[16px] font-semibold text-foreground">{t("soloJourney.error_title")}</p>
                  <button
                    onClick={() => mood && runDecision(mood, excludeRef.current)}
                    className="rounded-full bg-[#FFCC02] px-6 py-3 text-[15px] font-bold text-black active:scale-95 transition-transform"
                    data-testid="button-retry"
                  >
                    {t("common.retry")}
                  </button>
                </div>
              ) : (
                <>
                  {/* Hero pick card — unified, editorial */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 24 }}
                    className="rounded-[28px] bg-white border border-black/[0.06] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] overflow-hidden"
                    data-testid="card-pick"
                  >
                    {/* Image */}
                    <div className="relative h-72 w-full bg-gray-100">
                      {pick.imageUrl && (
                        <img
                          src={pick.imageUrl} alt={pick.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC02] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-black shadow-[0_3px_10px_rgba(0,0,0,0.18)]" data-testid="text-eyebrow">
                          <Sparkles className="w-3.5 h-3.5" /> {refined ? t("soloJourney.refined_eyebrow") : t("soloJourney.result_eyebrow")}
                        </span>
                      </div>
                      {pick.rating && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                          <Star className="w-3.5 h-3.5 text-[#FFCC02] fill-[#FFCC02]" />
                          <span className="text-[13px] font-bold text-foreground">{pick.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h2 className="text-[24px] font-bold text-foreground leading-[1.12] tracking-tight line-clamp-2" data-testid="text-pick-name">
                        {pick.name}
                      </h2>
                      {(() => {
                        const loc = pick.district || pick.address || pick.category;
                        const price = priceStr(pick.priceLevel);
                        return (loc || price) ? (
                          <div className="flex items-center gap-2 text-[13px] text-muted-foreground mt-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-foreground/40" />
                            {loc && <span className="truncate">{loc}</span>}
                            {loc && price && <span className="text-black/15">{"\u00B7"}</span>}
                            {price && <span className="font-semibold text-foreground/70">{price}</span>}
                          </div>
                        ) : null;
                      })()}

                      {pick.vibes && pick.vibes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {pick.vibes.slice(0, 3).map((v) => (
                            <span key={v} className="rounded-full bg-[#F6F3EC] px-2.5 py-1 text-[11.5px] font-medium text-foreground/70 capitalize">
                              {v.replace(/[_-]+/g, " ")}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Verdict */}
                      {pick.confidenceText && (
                        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#FFFBF0] border border-[#FFCC02]/25 p-3.5" data-testid="text-confidence">
                          <span className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-black" />
                          </span>
                          <p className="text-[14px] font-semibold text-foreground leading-snug">{pick.confidenceText}</p>
                        </div>
                      )}

                      {/* Why this one */}
                      {pick.reasonChips.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-black/[0.06]">
                          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
                            {t("soloJourney.why_title")}
                          </p>
                          <div className="space-y-2.5">
                            {pick.reasonChips.map((chip, i) => (
                              <div key={i} className="flex items-start gap-2.5" data-testid={`chip-reason-${i}`}>
                                <span className="w-5 h-5 rounded-full bg-[#FFF6DA] flex items-center justify-center flex-shrink-0 mt-px">
                                  <Check className="w-3 h-3 text-[#C79200]" strokeWidth={3} />
                                </span>
                                <span className="text-[13.5px] text-foreground/80 leading-snug">{chip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {alternatives.length > 0 && (
                    <div className="mt-5 space-y-2.5" data-testid="section-alternatives">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-1 px-0.5" data-testid="text-more-options">
                        {t("soloJourney.more_options")}
                      </p>
                      {alternatives.slice(0, 2).map((alt) => (
                        <button
                          key={alt.id}
                          onClick={() => handlePickAlternative(alt)}
                          className="w-full flex items-center gap-3 rounded-[18px] bg-white p-2.5 border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all text-left"
                          data-testid={`card-alt-${alt.id}`}
                        >
                          <div className="relative w-[68px] h-[68px] rounded-[14px] overflow-hidden bg-gray-100 flex-shrink-0">
                            {alt.imageUrl && (
                              <img
                                src={alt.imageUrl} alt={alt.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[15px] font-semibold text-foreground leading-tight truncate" data-testid={`text-alt-name-${alt.id}`}>
                              {alt.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-1">
                              <span className="truncate">{alt.district || alt.category}</span>
                              <span className="text-foreground/60 font-medium flex-shrink-0">{priceStr(alt.priceLevel)}</span>
                              {alt.rating && (
                                <span className="flex items-center gap-0.5 flex-shrink-0">
                                  <Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" />
                                  <span className="font-medium">{alt.rating}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Compare options — refined secondary */}
                  <button
                    onClick={() => navigate(moodToComparePath(mood))}
                    className="mt-4 w-full rounded-[20px] bg-white border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex items-center gap-3.5 active:scale-[0.98] transition-all text-left"
                    data-testid="button-compare-options"
                  >
                    <img
                      src={waffleThinkingPath}
                      alt=""
                      aria-hidden="true"
                      className="h-[92px] w-auto object-contain flex-shrink-0 -my-4 -ml-1"
                      data-testid="img-compare-mascot"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-foreground leading-tight">{t("soloJourney.compare")}</p>
                      <p className="text-[12.5px] text-muted-foreground leading-snug mt-0.5">{t("soloJourney.compare_desc")}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
                  </button>

                  {learning && (
                    <p className="text-[12.5px] text-muted-foreground text-center mt-3 px-3 leading-snug flex items-center justify-center gap-1.5" data-testid="text-learning">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFB800] flex-shrink-0" />
                      {t("soloJourney.learning_note")}
                    </p>
                  )}

                  {/* Refine panel */}
                  <AnimatePresence>
                    {refineOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 rounded-3xl bg-white border border-black/[0.04] p-4 shadow-sm">
                          <p className="text-[14px] font-bold text-foreground mb-1">{t("soloJourney.refine_title")}</p>
                          <p className="text-[12.5px] text-muted-foreground mb-3">{t("soloJourney.refine_optional")}</p>
                          <div className="flex flex-wrap gap-2">
                            {REFINE_CHIPS.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => handleRefine(c.mood, c.id)}
                                className="rounded-full border border-black/10 px-4 py-2 text-[13px] font-semibold text-foreground active:scale-95 transition-transform"
                                data-testid={`chip-refine-${c.id}`}
                              >
                                {t(`soloJourney.${c.key}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-auto pt-5 space-y-2.5">
                    <button
                      onClick={handleAccept}
                      className="w-full rounded-2xl bg-[#FFCC02] h-14 text-[16px] font-bold text-black flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_14px_rgba(255,204,2,0.25)]"
                      data-testid="button-accept"
                    >
                      {t("soloJourney.looks_good")} <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={handleAnother}
                        className="rounded-2xl bg-white h-12 text-[14px] font-semibold text-foreground border border-black/[0.06] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                        data-testid="button-another"
                      >
                        <RotateCcw className="w-4 h-4" /> {t("soloJourney.another")}
                      </button>
                      <button
                        onClick={() => setRefineOpen((p) => !p)}
                        className="rounded-2xl bg-white h-12 text-[14px] font-semibold text-foreground border border-black/[0.06] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                        data-testid="button-refine-toggle"
                      >
                        {t("soloJourney.refine_cta")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ---------- LOCKED ---------- */}
          {step === "locked" && pick && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex flex-col items-center text-center pt-6 pb-5">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="w-16 h-16 rounded-full bg-[#FFCC02] flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(255,204,2,0.45)]"
                >
                  <Check className="w-9 h-9 text-black" strokeWidth={3} />
                </motion.div>
                <h1 className="text-[24px] font-extrabold text-foreground" data-testid="text-locked-title">{t("soloJourney.locked_title")}</h1>
                <p className="text-[15px] text-muted-foreground mt-1">{t("soloJourney.locked_sub")}</p>
              </div>

              <div className="rounded-[24px] bg-white overflow-hidden border border-black/[0.04] shadow-[0_6px_24px_rgba(0,0,0,0.07)]">
                <div className="flex items-center gap-3 p-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {pick.imageUrl && <img src={pick.imageUrl} alt={pick.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[18px] font-extrabold text-foreground truncate">{pick.name}</h2>
                    <p className="text-[13px] text-muted-foreground truncate">{pick.category}</p>
                    <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground mt-0.5">
                      {pick.rating && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" />{pick.rating}</span>}
                      <span className="text-[#C79200] font-semibold">{priceStr(pick.priceLevel)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <button onClick={handleDirections} className="rounded-2xl bg-[#FFCC02] h-14 text-[15px] font-bold text-black flex items-center justify-center gap-2 active:scale-95 transition-transform" data-testid="button-directions">
                  <Navigation className="w-5 h-5" /> {t("soloJourney.directions")}
                </button>
                <button onClick={() => navigate(`/restaurant/${pick.id}`)} className="rounded-2xl bg-white h-14 text-[15px] font-bold text-foreground border border-black/[0.06] flex items-center justify-center gap-2 active:scale-95 transition-transform" data-testid="button-view">
                  <ArrowRight className="w-5 h-5" /> {t("soloJourney.view_restaurant")}
                </button>
                <button onClick={handleSave} className="rounded-2xl bg-white h-14 text-[15px] font-bold text-foreground border border-black/[0.06] flex items-center justify-center gap-2 active:scale-95 transition-transform" data-testid="button-save">
                  <Heart className={`w-5 h-5 ${isSaved(pick.id) ? "fill-[#FF4D4D] text-[#FF4D4D]" : ""}`} /> {isSaved(pick.id) ? t("soloJourney.saved_done") : t("soloJourney.save_later")}
                </button>
                <button onClick={handleShare} className="rounded-2xl bg-white h-14 text-[15px] font-bold text-foreground border border-black/[0.06] flex items-center justify-center gap-2 active:scale-95 transition-transform" data-testid="button-share">
                  <Share2 className="w-5 h-5" /> {t("common.share")}
                </button>
              </div>

              <button
                onClick={() => setDeliveryOpen((p) => !p)}
                className="mt-2.5 w-full rounded-2xl bg-white h-14 text-[15px] font-bold text-foreground border border-black/[0.06] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                data-testid="button-delivery-toggle"
              >
                <Bike className="w-5 h-5" /> {t("soloJourney.order_delivery")}
              </button>
              <AnimatePresence>
                {deliveryOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2.5 mt-2.5">
                      {DELIVERY.map((svc) => (
                        <button
                          key={svc.id}
                          onClick={() => handleDelivery(svc)}
                          className="rounded-2xl bg-white h-16 border border-black/[0.06] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                          data-testid={`button-delivery-${svc.id}`}
                        >
                          <span className="text-[20px]">{svc.emoji}</span>
                          <span className="text-[11px] font-semibold text-foreground">{svc.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Light feedback */}
              <div className="mt-6 rounded-3xl bg-white border border-black/[0.04] p-4 shadow-sm">
                {feedbackGiven ? (
                  <p className="text-[14px] font-semibold text-foreground text-center py-1" data-testid="text-feedback-thanks">
                    {t("soloJourney.fb_thanks")}
                  </p>
                ) : (
                  <>
                    <p className="text-[14px] font-bold text-foreground text-center mb-3">{t("soloJourney.feedback_q")}</p>
                    <div className="flex items-center justify-between gap-2">
                      {FEEDBACK.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => handleFeedback(f.id)}
                          className="flex-1 flex flex-col items-center gap-1 rounded-2xl py-2 active:scale-95 transition-transform hover:bg-gray-50"
                          data-testid={`button-feedback-${f.id}`}
                        >
                          <span className="text-[26px]">{f.emoji}</span>
                          <span className="text-[11px] font-medium text-muted-foreground">{t(`soloJourney.${f.key}`)}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={restart}
                className="mt-5 mx-auto text-[14px] font-semibold text-muted-foreground flex items-center gap-1.5 active:scale-95 transition-transform"
                data-testid="button-start-over"
              >
                <RotateCcw className="w-4 h-4" /> {t("soloJourney.start_over")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
