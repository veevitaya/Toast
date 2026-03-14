import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import mascotImg from "@assets/toast_mascot_nobg.png";
import { saveOnboardingProfile, isOnboardingComplete } from "@/hooks/use-onboarding";

const CUISINE_OPTIONS = [
  { id: "thai", emoji: "\u{1F1F9}\u{1F1ED}", label: "Thai" },
  { id: "japanese", emoji: "\u{1F363}", label: "Japanese" },
  { id: "korean", emoji: "\u{1F35C}", label: "Korean" },
  { id: "italian", emoji: "\u{1F355}", label: "Italian" },
  { id: "chinese", emoji: "\u{1F961}", label: "Chinese" },
  { id: "indian", emoji: "\u{1F35B}", label: "Indian" },
  { id: "mexican", emoji: "\u{1F32E}", label: "Mexican" },
  { id: "seafood", emoji: "\u{1F990}", label: "Seafood" },
  { id: "bbq", emoji: "\u{1F356}", label: "BBQ" },
  { id: "desserts", emoji: "\u{1F370}", label: "Desserts" },
  { id: "cafe", emoji: "\u{2615}", label: "Caf\u00e9" },
  { id: "street", emoji: "\u{1F362}", label: "Street Food" },
];

export function InlineOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  const toggleCuisine = (id: string) => {
    setSelectedCuisines(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    saveOnboardingProfile({
      displayName: name.trim(),
      cuisinePreferences: selectedCuisines,
    });

    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <motion.div
      className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col overflow-hidden absolute inset-0 z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      data-testid="onboarding-page"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-40 h-40 bg-[#FFCC02]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] right-[8%] w-48 h-48 bg-[#FFCC02]/6 rounded-full blur-3xl" />
        <div className="absolute top-[50%] right-[20%] w-32 h-32 bg-amber-50/40 rounded-full blur-3xl" />
      </div>

      <div className="flex-shrink-0 pt-14 px-6 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          {[0, 1].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-200/60">
              <motion.div
                className="h-full rounded-full bg-[#FFCC02]"
                initial={{ width: 0 }}
                animate={{ width: step >= i ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 16, stiffness: 200, delay: 0.1 }}
                className="mb-6"
              >
                <div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center"
                  style={{ boxShadow: "0 10px 40px -8px rgba(234,179,8,0.2)" }}
                >
                  <img src={mascotImg} alt="Toast" className="h-14 w-14 object-contain" draggable={false} />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-[28px] font-bold text-foreground text-center mb-2"
                data-testid="text-onboarding-title"
              >
                Hey there!
              </motion.h1>

              <motion.p
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-center text-[15px] mb-8 max-w-[260px]"
              >
                What should we call you?
              </motion.p>

              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="w-full max-w-xs"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) setStep(1); }}
                  placeholder="Your name"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-[16px] font-medium text-center focus:outline-none focus:border-[#FFCC02] focus:ring-2 focus:ring-[#FFCC02]/20 transition-all"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  data-testid="input-onboarding-name"
                  autoFocus
                  autoComplete="off"
                  maxLength={30}
                />
              </motion.div>

              <motion.button
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setStep(1)}
                disabled={!name.trim()}
                className={`mt-6 w-full max-w-xs py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.96] ${
                  name.trim()
                    ? "bg-[#FFCC02] text-[#2d2000]"
                    : "bg-gray-100 text-muted-foreground"
                }`}
                style={name.trim() ? { boxShadow: "0 8px 24px -6px rgba(255,204,2,0.4)" } : {}}
                data-testid="button-onboarding-next"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-cuisines"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 flex flex-col px-6"
            >
              <div className="flex-shrink-0 pt-6 pb-4 text-center">
                <motion.h1
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  className="text-[24px] font-bold text-foreground mb-1"
                  data-testid="text-cuisine-title"
                >
                  What do you love?
                </motion.h1>
                <motion.p
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground text-[14px]"
                >
                  Pick a few favorites — you can always change later
                </motion.p>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar pb-4">
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {CUISINE_OPTIONS.map((c, idx) => {
                    const active = selectedCuisines.includes(c.id);
                    return (
                      <motion.button
                        key={c.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.05 + idx * 0.03, type: "spring", damping: 20, stiffness: 300 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => toggleCuisine(c.id)}
                        data-testid={`chip-cuisine-${c.id}`}
                        className={`relative flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl transition-all duration-200 ${
                          active
                            ? "bg-[#FFCC02]/15 border-2 border-[#FFCC02]"
                            : "bg-white border border-gray-100/80"
                        }`}
                        style={{
                          boxShadow: active
                            ? "0 4px 16px rgba(255,204,2,0.15)"
                            : "0 2px 8px rgba(0,0,0,0.03)",
                        }}
                      >
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FFCC02] flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-[#2d2000]" />
                          </motion.div>
                        )}
                        <span className="text-[24px]">{c.emoji}</span>
                        <span className={`text-[12px] font-semibold ${
                          active ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {c.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-shrink-0 pb-10 pt-3">
                <motion.button
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={handleComplete}
                  className="w-full py-4 rounded-full font-bold text-[15px] bg-[#FFCC02] text-[#2d2000] flex items-center justify-center gap-2 active:scale-[0.96] transition-all"
                  style={{ boxShadow: "0 8px 24px -6px rgba(255,204,2,0.4)" }}
                  data-testid="button-onboarding-done"
                >
                  {selectedCuisines.length > 0
                    ? `Let's go! (${selectedCuisines.length} picked)`
                    : "Skip & start exploring"
                  }
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Onboarding() {
  const [, navigate] = useLocation();

  const rawReturnTo = new URLSearchParams(window.location.search).get("returnTo") || "/";
  const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/";

  if (isOnboardingComplete()) {
    navigate(returnTo, { replace: true });
    return null;
  }

  return (
    <InlineOnboarding onComplete={() => navigate(returnTo, { replace: true })} />
  );
}
