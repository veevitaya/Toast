import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, MapPin, Star, Check, RotateCcw,
  Navigation, Heart, Share2, Bike, ChevronRight,
} from "lucide-react";
import { useLineProfile } from "@/lib/useLineProfile";
import { useSavedRestaurants } from "@/hooks/use-saved-restaurants";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fetchWithTimeout } from "@/lib/queryClient";
import { trackDecisionEvent } from "@/lib/decisionEvents";
import mascotPath from "@assets/toast_mascot_nobg.png";
import waffleThinkingPath from "@assets/waffle-thinking-cropped.png";
import duoFoodPath from "@assets/duo-food-cropped.png";
import toastWaitingPath from "@assets/toast-waiting-cropped.png";

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

  const userId = profile?.userId;
  const excludeRef = useRef<number[]>([]);

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

  const handleMood = (m: string) => {
    setMood(m);
    setRefined(false);
    excludeRef.current = [];
    setExcludeIds([]);
    runDecision(m, []);
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
    trackDecisionEvent("refine_applied", { userId, restaurantId: pick?.id, metadata: { source: "solo_journey", refine: chipId } });
    runDecision(chipMood, excludeRef.current);
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
  };

  const priceStr = (n: number | null) => "\u0E3F".repeat(Math.max(1, n || 1));

  return (
    <div className="min-h-screen bg-background flex flex-col items-center" data-testid="page-solo-journey">
      <div className="w-full max-w-md flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-3">
        <button
          onClick={() => (step === "intent" ? navigate("/") : restart())}
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center active:scale-95 transition-transform"
          data-testid="button-back"
          aria-label={t("common.back")}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-5 pb-8">
        <AnimatePresence mode="wait">
          {/* ---------- INTENT ---------- */}
          {step === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="flex-1 flex flex-col justify-start pt-2 pb-6"
            >
              {/* Header */}
              <div className="pt-2 pb-6">
                <h1 className="text-[27px] font-bold text-foreground leading-[1.1] tracking-tight" data-testid="text-intent-title">
                  {t("soloJourney.intent_title")}
                </h1>
                <p className="text-[15px] text-muted-foreground mt-2 leading-snug" data-testid="text-intent-sub">
                  {t("soloJourney.intent_sub")}
                </p>
              </div>

              {/* Mood grid — uniform, refined cards */}
              <div className="grid grid-cols-2 gap-3">
                {MOODS.map((m, i) => {
                  return (
                    <motion.button
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleMood(m.id)}
                      className="relative h-[120px] rounded-[20px] bg-white p-4 flex flex-col justify-between text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all border border-black/[0.06]"
                      data-testid={`button-mood-${m.id}`}
                    >
                      <span className="text-[30px] leading-none">
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

              {/* Bottom mascot scene */}
              <img
                src={duoFoodPath}
                alt=""
                aria-hidden="true"
                className="mt-auto w-full max-w-[150px] mx-auto object-contain pt-3 select-none pointer-events-none"
                data-testid="img-intent-duo"
              />

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
                src={toastWaitingPath} alt="Toast"
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
