import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import toastMascot from "@assets/toast_mascot_nobg.png";
import waffleMascot from "@assets/waffle_character_nobg.png";
import {
  TUTORIAL_FLOWS,
  type TutorialStep,
} from "./tutorialSteps";
import {
  markTutorialCompleted,
  type TutorialFeatureId,
} from "@/lib/tutorialState";

interface Props {
  featureId: TutorialFeatureId;
  /** Replay mode does not mark completion automatically (still marks on finish). */
  onClose: (reason: "complete" | "skip") => void;
}

const MASCOTS: Record<string, string> = {
  toast: toastMascot,
  popcorn: waffleMascot,
  waffle: waffleMascot,
};

export function TutorialOverlay({ featureId, onClose }: Props) {
  const flow = TUTORIAL_FLOWS[featureId];
  const [stepIndex, setStepIndex] = useState(0);
  const [, navigate] = useLocation();
  const step = flow.steps[stepIndex];
  const isLast = stepIndex === flow.steps.length - 1;

  // Navigate the underlying app to the screen this step describes.
  useEffect(() => {
    if (step.navigateTo && typeof window !== "undefined") {
      const current = window.location.pathname + window.location.search;
      if (!current.startsWith(step.navigateTo.split("?")[0])) {
        navigate(step.navigateTo, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const handleNext = () => {
    if (isLast) {
      markTutorialCompleted(featureId);
      onClose("complete");
      navigate(flow.finishPath, { replace: true });
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    markTutorialCompleted(featureId);
    onClose("skip");
    navigate(flow.finishPath, { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" data-testid={`tutorial-overlay-${featureId}`}>
      {/* Soft top-to-bottom dim so the live screen still peeks through */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70 pointer-events-auto" />

      {/* Top: progress dots + skip */}
      <div className="absolute top-0 inset-x-0 pt-[env(safe-area-inset-top)] pointer-events-auto">
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex gap-1.5" data-testid="tutorial-progress">
            {flow.steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIndex ? "w-6 bg-[#FFCC02]" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-[13px] font-medium text-white/80 active:text-white px-2 py-1"
            data-testid="button-tutorial-skip"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Bottom coach card */}
      <div className="absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)] pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="mx-3 mb-3 rounded-[28px] bg-[#FFF8E1] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] overflow-hidden"
          >
            <StepIllustration kind={step.illustration} />

            <div className="px-5 pt-4 pb-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF9F1C] mb-1.5">
                Step {stepIndex + 1} · {flow.title}
              </p>
              <h2 className="text-[22px] leading-tight font-extrabold text-[#222222]" data-testid="tutorial-title">
                {step.title}
              </h2>
              <p className="text-[13.5px] text-[#222222]/65 mt-1.5 leading-snug">{step.subtitle}</p>

              {step.bubble && (
                <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-white p-3 border border-black/[0.04]">
                  <div className="w-9 h-9 rounded-full bg-[#FFE889] shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={MASCOTS[step.mascot || "toast"] || toastMascot}
                      alt="Toast mascot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[13px] leading-snug text-[#222222]/80 pt-1">{step.bubble}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="mt-4 w-full h-12 rounded-full bg-[#222222] text-white text-[15px] font-bold shadow-md active:scale-[0.98] transition-transform"
                data-testid="button-tutorial-cta"
              >
                {step.cta}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepIllustration({ kind }: { kind?: TutorialStep["illustration"] }) {
  if (!kind) return null;
  if (kind === "tasteDna") {
    const tags = ["spicy", "cozy", "noodle mood", "budget-friendly"];
    return (
      <div className="relative h-32 bg-gradient-to-br from-[#FFE889] to-[#FFCC02] flex items-center justify-center">
        <div className="absolute w-20 h-20 rounded-full bg-white/90 shadow-inner flex items-center justify-center text-2xl">🧬</div>
        {tags.map((t, i) => (
          <motion.span
            key={t}
            className="absolute text-[10px] font-bold bg-white px-2.5 py-1 rounded-full shadow-sm"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: Math.cos((i / tags.length) * Math.PI * 2) * 80,
              y: Math.sin((i / tags.length) * Math.PI * 2) * 38,
            }}
            transition={{ delay: i * 0.12, type: "spring" }}
          >
            {t}
          </motion.span>
        ))}
      </div>
    );
  }
  if (kind === "confetti") {
    return (
      <div className="relative h-28 bg-gradient-to-br from-[#FFE889] to-[#FFCC02] overflow-hidden flex items-center justify-center">
        <div className="text-3xl font-extrabold text-[#222222]">🎉 Korean BBQ</div>
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-3 rounded-sm"
            style={{
              backgroundColor: ["#FF9F1C", "#222222", "#FFFFFF", "#FFCC02"][i % 4],
              left: `${(i * 7) % 100}%`,
              top: -10,
            }}
            initial={{ y: -10, rotate: 0 }}
            animate={{ y: 130, rotate: 360 }}
            transition={{ duration: 1.6, delay: i * 0.05, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
      </div>
    );
  }
  if (kind === "phones") {
    return (
      <div className="h-28 bg-gradient-to-br from-[#FFE889] to-[#FFCC02] flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-12 h-20 rounded-xl bg-white shadow-md flex items-end justify-center pb-1.5 text-[10px] font-bold"
            animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
          >
            👤
          </motion.div>
        ))}
      </div>
    );
  }
  if (kind === "reroll") {
    return (
      <div className="h-28 bg-gradient-to-br from-[#FFE889] to-[#FFCC02] flex items-center justify-center">
        <motion.div
          className="text-4xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        >
          🔄
        </motion.div>
      </div>
    );
  }
  if (kind === "trendChips") {
    const chips = ["Mala Hotpot 🔥", "Matcha Latte 🍵", "Korean BBQ 🥩", "Boat Noodles 🍜"];
    return (
      <div className="h-28 bg-gradient-to-br from-[#FFE889] to-[#FFCC02] flex items-center justify-center px-3">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {chips.map((c, i) => (
            <motion.span
              key={c}
              className="text-[11px] font-bold bg-white px-3 py-1.5 rounded-full shadow-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

