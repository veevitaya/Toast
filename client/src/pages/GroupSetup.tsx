import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useLineProfile } from "@/lib/useLineProfile";

const BUDGETS = [
  { value: 200, label: "฿200" },
  { value: 500, label: "฿500" },
  { value: 1000, label: "฿1,000" },
  { value: 2000, label: "฿2,000" },
  { value: 5000, label: "฿5,000" },
];

const GROUP_TYPES = [
  { id: "friends", label: "FRIENDS" },
  { id: "partner", label: "DATE NIGHT" },
  { id: "family", label: "FAMILY" },
  { id: "coworkers", label: "WORK" },
  { id: "solo", label: "SOLO" },
];

const LOCATIONS = [
  { id: "bts", label: "NEAR BTS" },
  { id: "siam", label: "SIAM" },
  { id: "sukhumvit", label: "SUKHUMVIT" },
  { id: "silom", label: "SILOM" },
  { id: "thonglor", label: "THONGLOR" },
  { id: "chinatown", label: "CHINATOWN" },
  { id: "riverside", label: "RIVERSIDE" },
  { id: "anywhere", label: "ANYWHERE" },
];

const MOODS = [
  { id: "thai", label: "THAI", images: [
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=300&auto=format&fit=crop&q=60",
  ]},
  { id: "japanese", label: "JAPANESE", images: [
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&auto=format&fit=crop&q=60",
  ]},
  { id: "korean", label: "KOREAN", images: [
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1583224964978-2257b960c3d2?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1567533708067-5b77db60cd21?w=300&auto=format&fit=crop&q=60",
  ]},
  { id: "italian", label: "ITALIAN", images: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&auto=format&fit=crop&q=60",
  ]},
  { id: "street", label: "STREET FOOD", images: [
    "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&auto=format&fit=crop&q=60",
  ]},
  { id: "anything", label: "SURPRISE ME", images: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&auto=format&fit=crop&q=60",
  ]},
];

const STEP_GRADIENTS = [
  "linear-gradient(160deg, #00D4FF 0%, #7B61FF 50%, #9B59FF 100%)",
  "linear-gradient(160deg, #9B59FF 0%, #E040FB 50%, #FF4081 100%)",
  "linear-gradient(160deg, #FF4081 0%, #FF6E40 50%, #FFB74D 100%)",
  "linear-gradient(160deg, #00E676 0%, #00C853 50%, #69F0AE 100%)",
];

const STEP_LABELS = ["WHO", "WHERE", "MOOD", "START"];

function HorizontalPicker<T extends { label: string }>({
  items,
  activeIndex,
  onChange,
  testIdPrefix,
}: {
  items: T[];
  activeIndex: number;
  onChange: (index: number) => void;
  testIdPrefix: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = () => {
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && activeIndex < items.length - 1) onChange(activeIndex + 1);
      else if (diff < 0 && activeIndex > 0) onChange(activeIndex - 1);
    }
  };

  const handleClick = (index: number) => {
    onChange(index);
  };

  return (
    <div
      ref={containerRef}
      className="flex items-baseline gap-3 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: "grab" }}
    >
      {items.map((item, idx) => {
        const distance = Math.abs(idx - activeIndex);
        const isActive = idx === activeIndex;
        const isAdjacent = distance === 1;
        const isFar = distance >= 2;

        return (
          <motion.button
            key={idx}
            onClick={() => handleClick(idx)}
            data-testid={`${testIdPrefix}-${idx}`}
            animate={{
              opacity: isActive ? 1 : isAdjacent ? 0.35 : isFar ? 0.15 : 0.1,
              scale: isActive ? 1 : isAdjacent ? 0.7 : 0.5,
              x: 0,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="flex-shrink-0 whitespace-nowrap"
            style={{
              fontSize: isActive ? "clamp(48px, 12vw, 72px)" : isAdjacent ? "clamp(36px, 8vw, 52px)" : "clamp(28px, 6vw, 40px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textShadow: isActive ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {item.label}
          </motion.button>
        );
      })}
    </div>
  );
}

export default function GroupSetup() {
  const [, navigate] = useLocation();
  const { profile } = useLineProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [budgetIndex, setBudgetIndex] = useState(1);
  const [groupIndex, setGroupIndex] = useState(0);
  const [locationIndex, setLocationIndex] = useState(0);
  const [moodIndex, setMoodIndex] = useState(0);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);

  const totalSteps = 4;

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= totalSteps || isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentStep(step);
    setTimeout(() => { isTransitioning.current = false; }, 500);
  }, [totalSteps]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;
    let isDragging = false;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      isDragging = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 60) {
        if (diff > 0) goToStep(currentStep + 1);
        else goToStep(currentStep - 1);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) goToStep(currentStep + 1);
        else goToStep(currentStep - 1);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [currentStep, goToStep]);

  const getOrCreateSessionId = async () => {
    if (pendingSessionId) return pendingSessionId;
    const sessionId = Math.random().toString(36).substring(2, 10);
    setPendingSessionId(sessionId);
    if (profile) {
      try {
        await fetch("/api/group/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionCode: sessionId,
            hostLineUserId: profile.userId,
            hostDisplayName: profile.displayName,
            hostPictureUrl: profile.pictureUrl || "",
            preferences: {
              budget: BUDGETS[budgetIndex].value,
              groupType: GROUP_TYPES[groupIndex].id,
              location: LOCATIONS[locationIndex].id,
              mood: MOODS[moodIndex].id,
            },
          }),
        });
      } catch {}
    }
    return sessionId;
  };

  const handleStart = async () => {
    setIsCreating(true);
    try {
      const sessionId = await getOrCreateSessionId();
      navigate(`/group/waiting?session=${sessionId}`);
    } catch {
      setIsCreating(false);
    }
  };

  const currentMood = MOODS[moodIndex];

  return (
    <div
      ref={containerRef}
      className="w-full h-[100dvh] overflow-hidden relative select-none"
      style={{ touchAction: "none", overscrollBehavior: "none" }}
      data-testid="group-setup-page"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
          style={{ background: STEP_GRADIENTS[currentStep] }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-15%] w-[70%] h-[70%] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
        />
      </div>

      <button
        onClick={() => navigate("/")}
        data-testid="button-back"
        className="absolute right-6 top-14 z-50 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
        aria-label="Back to home"
      >
        <ArrowLeft className="w-4 h-4 text-white" />
      </button>

      <div className="absolute left-6 top-16 z-50 flex flex-col items-center gap-2" role="tablist" aria-label="Setup steps">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            data-testid={`step-dot-${i}`}
            className="transition-all duration-300"
            role="tab"
            aria-selected={i === currentStep}
            aria-label={`Step ${i + 1}`}
            style={{
              width: i === currentStep ? 10 : 6,
              height: i === currentStep ? 10 : 6,
              borderRadius: "50%",
              background: i === currentStep ? "white" : "rgba(255,255,255,0.35)",
              boxShadow: i === currentStep ? "0 0 12px rgba(255,255,255,0.5)" : "none",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col justify-center z-10">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="px-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="text-white/70 text-[15px] font-bold uppercase tracking-[0.15em] mb-2"
              >
                HOW MUCH
              </motion.h2>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-white text-[28px] font-extrabold leading-tight mb-10"
                style={{ letterSpacing: "-0.01em" }}
              >
                DO YOU WANT<br />TO SPEND?
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
              >
                <HorizontalPicker
                  items={BUDGETS}
                  activeIndex={budgetIndex}
                  onChange={setBudgetIndex}
                  testIdPrefix="budget-pick"
                />
                <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] mt-3">
                  PER PERSON
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="group"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="px-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="text-white/70 text-[15px] font-bold uppercase tracking-[0.15em] mb-2"
              >
                WHO
              </motion.h2>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-white text-[28px] font-extrabold leading-tight mb-10"
                style={{ letterSpacing: "-0.01em" }}
              >
                ARE YOU<br />EATING WITH?
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
              >
                <HorizontalPicker
                  items={GROUP_TYPES}
                  activeIndex={groupIndex}
                  onChange={setGroupIndex}
                  testIdPrefix="group-pick"
                />
              </motion.div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="px-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="text-white/70 text-[15px] font-bold uppercase tracking-[0.15em] mb-2"
              >
                WHERE
              </motion.h2>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-white text-[28px] font-extrabold leading-tight mb-10"
                style={{ letterSpacing: "-0.01em" }}
              >
                DO YOU WANT<br />TO EAT?
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
              >
                <HorizontalPicker
                  items={LOCATIONS}
                  activeIndex={locationIndex}
                  onChange={setLocationIndex}
                  testIdPrefix="location-pick"
                />
                <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] mt-3">
                  BANGKOK
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="px-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="text-white/70 text-[15px] font-bold uppercase tracking-[0.15em] mb-2"
              >
                WHAT
              </motion.h2>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-white text-[28px] font-extrabold leading-tight mb-8"
                style={{ letterSpacing: "-0.01em" }}
              >
                ARE YOU IN<br />THE MOOD FOR?
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
              >
                <HorizontalPicker
                  items={MOODS}
                  activeIndex={moodIndex}
                  onChange={setMoodIndex}
                  testIdPrefix="mood-pick"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex gap-2 mt-6 overflow-hidden rounded-2xl"
                style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}
              >
                {currentMood.images.map((img, i) => (
                  <motion.div
                    key={`${currentMood.id}-${i}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                    className="flex-1 h-24 overflow-hidden"
                    style={{ borderRadius: i === 0 ? "16px 0 0 16px" : i === currentMood.images.length - 1 ? "0 16px 16px 0" : "0" }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 pb-10 safe-bottom">
        {currentStep < totalSteps - 1 ? (
          <div className="flex flex-col items-center gap-1">
            {currentStep > 0 && (
              <button
                onClick={() => goToStep(currentStep - 1)}
                data-testid="button-prev-step"
                className="p-2 active:scale-90 transition-transform"
              >
                <ChevronUp className="w-5 h-5 text-white/40" />
              </button>
            )}
            <button
              onClick={() => goToStep(currentStep + 1)}
              data-testid="button-next-step"
              className="flex items-center gap-2 px-5 py-2.5 active:scale-95 transition-transform"
            >
              <ChevronDown className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-[12px] font-bold uppercase tracking-[0.2em]">
                {STEP_LABELS[currentStep]}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-8">
            {currentStep > 0 && (
              <button
                onClick={() => goToStep(currentStep - 1)}
                data-testid="button-prev-step-last"
                className="p-2 active:scale-90 transition-transform"
              >
                <ChevronUp className="w-5 h-5 text-white/40" />
              </button>
            )}
            <button
              onClick={handleStart}
              disabled={isCreating}
              data-testid="button-start-session"
              className="w-full max-w-xs py-4 rounded-full font-extrabold text-[15px] uppercase tracking-[0.1em] active:scale-[0.96] transition-all duration-200 disabled:opacity-60"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#1a1a2e",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset",
              }}
            >
              {isCreating ? "Creating..." : "Start Swiping"}
            </button>
            <button
              onClick={() => goToStep(currentStep + 1 >= totalSteps ? 0 : currentStep + 1)}
              data-testid="button-invite-line"
              className="flex items-center gap-2 px-5 py-2 active:scale-95 transition-transform"
            >
              <ChevronDown className="w-4 h-4 text-white/50" />
              <span className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em]">
                or change preferences
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
