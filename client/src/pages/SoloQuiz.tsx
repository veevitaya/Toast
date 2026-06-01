import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Check, Flame } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { isOnboardingComplete } from "@/hooks/use-onboarding";
import { InlineOnboarding } from "@/pages/Onboarding";
import { useLanguage } from "@/i18n/LanguageProvider";

const spring = { type: "spring" as const, stiffness: 260, damping: 26 };
const gentle = { type: "spring" as const, stiffness: 200, damping: 28 };

const CUISINES = [
  { emoji: "🍜", label: "Thai" },
  { emoji: "🍣", label: "Japanese" },
  { emoji: "🥟", label: "Chinese" },
  { emoji: "🍲", label: "Korean" },
  { emoji: "🍝", label: "Italian" },
  { emoji: "🦐", label: "Seafood" },
  { emoji: "🍛", label: "Indian" },
  { emoji: "🌮", label: "Mexican" },
  { emoji: "🥩", label: "Western" },
];

const LOCATIONS = [
  { emoji: "🍢", label: "Street food", desc: "Local vibes" },
  { emoji: "🍽️", label: "Restaurants", desc: "Sit-down meal" },
  { emoji: "🚇", label: "Near BTS", desc: "Easy access" },
  { emoji: "🏬", label: "At the mall", desc: "Indoor vibes" },
  { emoji: "🌙", label: "Late night", desc: "After hours" },
  { emoji: "🌊", label: "By the river", desc: "Scenic views" },
  { emoji: "📈", label: "Trendy spots", desc: "What's hot" },
  { emoji: "🏙️", label: "Rooftops", desc: "Sky-high dining" },
];

const BUDGETS = [
  { id: "cheap", label: "฿", sub: "Under 150" },
  { id: "moderate", label: "฿฿", sub: "150–500" },
  { id: "fancy", label: "฿฿฿", sub: "500–1.5k" },
  { id: "splurge", label: "฿฿฿฿", sub: "1.5k+" },
];

const BUDGET_DISPLAY: Record<string, string> = {
  cheap: "Cheap",
  moderate: "Moderate",
  fancy: "Fancy",
  splurge: "Expensive",
};

export default function SoloQuiz() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [onboarded, setOnboarded] = useState(() => isOnboardingComplete());
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const toggleCuisine = useCallback((label: string) => {
    setSelectedCuisines(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : prev.length < 3 ? [...prev, label] : prev
    );
  }, []);

  const toggleLocation = useCallback((label: string) => {
    setSelectedLocations(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : prev.length < 3 ? [...prev, label] : prev
    );
  }, []);

  const handleFinish = useCallback(() => {
    trackEvent("quiz_complete", {
      metadata: {
        cuisines: selectedCuisines.join(","),
        locations: selectedLocations.join(","),
        budget: selectedBudget,
      },
    });

    const params = new URLSearchParams();
    if (selectedCuisines.length) params.set("cuisines", selectedCuisines.join(","));
    if (selectedLocations.length) params.set("locations", selectedLocations.join(","));
    if (selectedBudget) params.set("budget", BUDGET_DISPLAY[selectedBudget] || selectedBudget);
    const qs = params.toString();
    navigate(`/solo/results${qs ? `?${qs}` : ""}`);
  }, [selectedCuisines, selectedLocations, selectedBudget, navigate]);

  if (!onboarded) {
    return <InlineOnboarding onComplete={() => setOnboarded(true)} />;
  }

  const totalSelected = selectedCuisines.length + selectedLocations.length + (selectedBudget ? 1 : 0);

  return (
    <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col items-center overflow-hidden" data-testid="solo-quiz-page">
      {/* Header */}
      <div className="w-full max-w-md flex-shrink-0 pt-12 px-5 pb-3 z-40">
        <div className="flex items-center mb-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/solo")}
            className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center"
            data-testid="button-back"
            aria-label={t("common.back")}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>

        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mb-2" data-testid="text-quiz-eyebrow">
          {t("soloJourney.compare")}
        </p>
        <h1 className="text-[27px] font-extrabold text-foreground leading-tight mb-1" data-testid="text-page-title">
          {t("quiz.compare_title")}
        </h1>
        <p className="text-[14px] text-muted-foreground font-medium">
          {t("quiz.compare_sub")}
        </p>
      </div>

      {/* All sections on one scrollable screen */}
      <div className="w-full max-w-md flex-1 overflow-y-auto hide-scrollbar px-5 pt-3 pb-6 space-y-7">
        {/* Cuisine */}
        <section data-testid="section-cuisine">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[16px] font-extrabold text-foreground">{t("quiz.section_cuisine")}</h2>
            <span className="text-[12px] text-muted-foreground font-medium">{t("quiz.pick_cuisines")}</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {CUISINES.map((c, i) => {
              const on = selectedCuisines.includes(c.label);
              const atMax = selectedCuisines.length >= 3 && !on;
              return (
                <motion.button
                  key={c.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: atMax ? 0.4 : 1, y: 0 }}
                  transition={{ delay: i * 0.02, ...gentle }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleCuisine(c.label)}
                  data-testid={`chip-cuisine-${c.label.toLowerCase()}`}
                  className={`relative rounded-2xl p-3 flex flex-col items-center gap-1.5 border transition-colors duration-200 will-change-transform ${
                    on
                      ? "bg-[#FFF6DA] border-[#FFCC02] shadow-[0_4px_18px_rgba(255,204,2,0.18)]"
                      : "bg-white border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  <AnimatePresence>
                    {on && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={spring}
                        className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-sm"
                      >
                        <Check className="w-3 h-3 text-black" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.span
                    className="text-[26px] leading-none will-change-transform"
                    animate={on ? { scale: [1, 1.15, 1.05] } : { scale: 1 }}
                    transition={spring}
                  >
                    {c.emoji}
                  </motion.span>
                  <span className={`text-[12px] font-bold ${on ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Scene */}
        <section data-testid="section-scene">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[16px] font-extrabold text-foreground">{t("quiz.section_scene")}</h2>
            <span className="text-[12px] text-muted-foreground font-medium">{t("quiz.where_sounds_good")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {LOCATIONS.map((s, i) => {
              const on = selectedLocations.includes(s.label);
              const atMax = selectedLocations.length >= 3 && !on;
              return (
                <motion.button
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: atMax ? 0.4 : 1, y: 0 }}
                  transition={{ delay: i * 0.02, ...gentle }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleLocation(s.label)}
                  data-testid={`chip-location-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`rounded-2xl p-3 flex items-center gap-2.5 border transition-colors duration-200 text-left will-change-transform ${
                    on
                      ? "bg-[#FFF6DA] border-[#FFCC02] shadow-[0_4px_18px_rgba(255,204,2,0.18)]"
                      : "bg-white border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  <motion.span
                    className="text-[22px] flex-shrink-0 will-change-transform"
                    animate={on ? { scale: [1, 1.12, 1.05] } : { scale: 1 }}
                    transition={spring}
                  >
                    {s.emoji}
                  </motion.span>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[13px] font-bold leading-tight ${on ? "text-foreground" : "text-foreground/80"}`}>{s.label}</div>
                    <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                  </div>
                  <AnimatePresence>
                    {on && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={spring}
                        className="w-5 h-5 bg-[#FFCC02] rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Check className="w-3 h-3 text-black" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Budget */}
        <section data-testid="section-budget">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[16px] font-extrabold text-foreground">{t("quiz.section_budget")}</h2>
            <span className="text-[12px] text-muted-foreground font-medium">{t("quiz.find_sweet_spot")}</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {BUDGETS.map((b, i) => {
              const on = selectedBudget === b.id;
              return (
                <motion.button
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, ...gentle }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBudget(on ? null : b.id)}
                  data-testid={`chip-budget-${b.id}`}
                  className={`rounded-2xl py-3 px-1 flex flex-col items-center gap-1 border transition-colors duration-200 will-change-transform ${
                    on
                      ? "bg-[#FFF6DA] border-[#FFCC02] shadow-[0_4px_18px_rgba(255,204,2,0.18)]"
                      : "bg-white border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  <span className={`text-[15px] font-extrabold ${on ? "text-foreground" : "text-foreground/80"}`}>{b.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight text-center">{b.sub}</span>
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer CTA — always available */}
      <div className="w-full max-w-md flex-shrink-0 px-5 pt-3 pb-5 safe-bottom bg-[#FCFCFC] border-t border-black/[0.04]">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleFinish}
          data-testid="button-quiz-next"
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2.5 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: "0 8px 24px -6px rgba(255,204,2,0.5)" }}
        >
          {totalSelected > 0 ? t("quiz.show_picks") : t("quiz.lets_pick")}
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Flame className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
