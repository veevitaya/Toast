import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Flame } from "lucide-react";
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
  { id: "cheap", label: "฿", sub: "Under 150", emoji: "💰" },
  { id: "moderate", label: "฿฿", sub: "150–500", emoji: "🍽️" },
  { id: "fancy", label: "฿฿฿", sub: "500–1,500", emoji: "✨" },
  { id: "splurge", label: "฿฿฿฿", sub: "1,500+", emoji: "👑" },
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
  const [step, setStep] = useState(0);
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

  const canProceed = step === 0
    ? selectedCuisines.length > 0
    : step === 1
      ? selectedLocations.length > 0
      : selectedBudget !== null;

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

  const handleSkip = useCallback(() => {
    navigate("/solo/results");
  }, [navigate]);

  if (!onboarded) {
    return <InlineOnboarding onComplete={() => setOnboarded(true)} />;
  }

  const hint = step === 0
    ? t("quiz.hint_cuisine")
    : step === 1
      ? t("quiz.hint_location")
      : t("quiz.hint_budget");

  return (
    <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col items-center overflow-hidden" data-testid="solo-quiz-page">
      {/* Header */}
      <div className="w-full max-w-md flex-shrink-0 pt-12 px-5 pb-3 z-40">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/")}
            className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center"
            data-testid="button-back"
            aria-label={t("common.back")}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{
                  width: i === step ? 28 : 8,
                  backgroundColor: i <= step ? "#FFCC02" : "#E9E2D0",
                  borderRadius: 4,
                }}
                transition={spring}
                className="h-2"
                data-testid={`progress-dot-${i}`}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-full"
            data-testid="button-quiz-skip"
          >
            {t("quiz.skip")}
          </button>
        </div>

        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mb-2" data-testid="text-quiz-eyebrow">
          {t("soloJourney.compare")}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-[27px] font-extrabold text-foreground leading-tight mb-1" data-testid="text-page-title">
              {step === 0 ? t("quiz.craving") : step === 1 ? t("quiz.set_scene") : t("quiz.whats_budget")}
            </h1>
            <p className="text-[14px] text-muted-foreground font-medium">
              {step === 0 ? t("quiz.pick_cuisines") : step === 1 ? t("quiz.where_sounds_good") : t("quiz.find_sweet_spot")}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Options */}
      <div className="w-full max-w-md flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="cuisines"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-3 gap-3"
            >
              {CUISINES.map((c, i) => {
                const on = selectedCuisines.includes(c.label);
                const atMax = selectedCuisines.length >= 3 && !on;
                return (
                  <motion.button
                    key={c.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: atMax ? 0.4 : 1, y: 0 }}
                    transition={{ delay: i * 0.03, ...gentle }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleCuisine(c.label)}
                    data-testid={`chip-cuisine-${c.label.toLowerCase()}`}
                    className={`relative rounded-3xl p-4 flex flex-col items-center gap-2 border transition-colors duration-200 will-change-transform ${
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
                      className="text-3xl will-change-transform"
                      animate={on ? { scale: [1, 1.15, 1.05] } : { scale: 1 }}
                      transition={spring}
                    >
                      {c.emoji}
                    </motion.span>
                    <span className={`text-[12.5px] font-bold ${on ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="locations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-2 gap-3"
            >
              {LOCATIONS.map((s, i) => {
                const on = selectedLocations.includes(s.label);
                const atMax = selectedLocations.length >= 3 && !on;
                return (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: atMax ? 0.4 : 1, y: 0 }}
                    transition={{ delay: i * 0.04, ...gentle }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleLocation(s.label)}
                    data-testid={`chip-location-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`rounded-3xl p-4 flex items-center gap-3 border transition-colors duration-200 text-left will-change-transform ${
                      on
                        ? "bg-[#FFF6DA] border-[#FFCC02] shadow-[0_4px_18px_rgba(255,204,2,0.18)]"
                        : "bg-white border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    <motion.span
                      className="text-2xl flex-shrink-0 will-change-transform"
                      animate={on ? { scale: [1, 1.12, 1.05] } : { scale: 1 }}
                      transition={spring}
                    >
                      {s.emoji}
                    </motion.span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[13px] font-bold ${on ? "text-foreground" : "text-foreground/80"}`}>{s.label}</div>
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
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-3"
            >
              {BUDGETS.map((b, i) => {
                const on = selectedBudget === b.id;
                return (
                  <motion.button
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, ...gentle }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedBudget(on ? null : b.id)}
                    data-testid={`chip-budget-${b.id}`}
                    className={`w-full rounded-3xl p-4 flex items-center gap-4 border transition-colors duration-200 will-change-transform ${
                      on
                        ? "bg-[#FFF6DA] border-[#FFCC02] shadow-[0_4px_18px_rgba(255,204,2,0.18)]"
                        : "bg-white border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl will-change-transform ${on ? "bg-[#FFCC02]/20" : "bg-gray-50"}`}
                      animate={on ? { scale: [1, 1.08, 1.02] } : { scale: 1 }}
                      transition={spring}
                    >
                      {b.emoji}
                    </motion.div>
                    <div className="flex-1 text-left">
                      <div className={`text-[16px] font-extrabold ${on ? "text-foreground" : "text-foreground/80"}`}>{b.label}</div>
                      <div className="text-[11.5px] text-muted-foreground">{b.sub} THB</div>
                    </div>
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${on ? "border-[#FFCC02] bg-[#FFCC02]" : "border-black/15"}`}
                      animate={on ? { scale: [0.9, 1.1, 1] } : { scale: 1 }}
                      transition={spring}
                    >
                      {on && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}>
                          <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA — always visible, disabled until a choice is made */}
      <div className="w-full max-w-md flex-shrink-0 px-5 pt-3 pb-5 safe-bottom bg-[#FCFCFC] border-t border-black/[0.04]">
        {selectedCuisines.length > 0 && step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex flex-wrap gap-1.5 mb-3 justify-center">
            {selectedCuisines.map(c => (
              <motion.span
                key={c}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={spring}
                className="text-[11px] font-semibold text-[#8A6A00] bg-[#FFF6DA] border border-[#FFCC02]/30 rounded-full px-2.5 py-1"
              >
                {CUISINES.find(cu => cu.label === c)?.emoji} {c}
              </motion.span>
            ))}
          </motion.div>
        )}

        <motion.button
          whileTap={canProceed ? { scale: 0.97 } : undefined}
          disabled={!canProceed}
          onClick={step < 2 ? () => setStep(s => s + 1) : handleFinish}
          data-testid="button-quiz-next"
          animate={{
            backgroundColor: canProceed ? "#FFCC02" : "#F0EAD9",
            color: canProceed ? "#2d2000" : "#8A7A4F",
          }}
          transition={{ duration: 0.2 }}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2.5 font-extrabold text-[16px]"
          style={{ boxShadow: canProceed ? "0 8px 24px -6px rgba(255,204,2,0.5)" : "none" }}
        >
          {step < 2 ? (
            <>
              {canProceed ? t("quiz.continue") : hint}
              {canProceed && (
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              )}
            </>
          ) : (
            <>
              {canProceed ? t("quiz.lets_pick") : hint}
              {canProceed && (
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Flame className="w-5 h-5" />
                </motion.div>
              )}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
