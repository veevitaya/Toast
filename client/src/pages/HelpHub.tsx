import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, ChevronRight, Trash2 } from "lucide-react";
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay";
import {
  getAllCompletionState,
  resetAllTutorials,
  type TutorialFeatureId,
} from "@/lib/tutorialState";
import toastLogo from "@assets/toast_logo_v2_nobg.png";

interface CardDef {
  id: TutorialFeatureId;
  title: string;
  subtitle: string;
  emoji: string;
}

const CARDS: CardDef[] = [
  { id: "solo", title: "Solo Play", subtitle: "Pick a vibe, swipe food, get places.", emoji: "🍞" },
  { id: "group", title: "Group Play", subtitle: "Invite friends, swipe separately, match together.", emoji: "🍿" },
  { id: "trending", title: "Trending", subtitle: "See what's hot and jump into a decision.", emoji: "🔥" },
];

export default function HelpHub() {
  const [, navigate] = useLocation();
  const [active, setActive] = useState<TutorialFeatureId | null>(null);
  const [done, setDone] = useState(getAllCompletionState());
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "How Toast Works";
    }
  }, []);

  const handleReset = () => {
    if (!confirm("Reset all tutorial memory? You'll see them again next time.")) return;
    resetAllTutorials();
    setDone(getAllCompletionState());
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFF8E1] pb-24">
      <header className="sticky top-0 z-10 bg-[#FFF8E1]/90 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95"
            data-testid="button-help-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <img src={toastLogo} alt="Toast" className="h-6 ml-1" />
        </div>
      </header>

      <div className="px-5 pt-2">
        <h1 className="text-[26px] font-extrabold text-[#222222] leading-tight">How Toast Works</h1>
        <p className="text-[14px] text-[#222222]/60 mt-1">
          Replay any walkthrough whenever you want.
        </p>
      </div>

      <div className="px-4 pt-5 space-y-3">
        {CARDS.map((c, i) => (
          <motion.button
            key={c.id}
            onClick={() => setActive(c.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="w-full text-left bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.99] transition-transform"
            data-testid={`button-replay-${c.id}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFE889] flex items-center justify-center text-2xl shrink-0">
              {c.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-[#222222]">{c.title}</h3>
                {done[c.id] && (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#FF9F1C] bg-[#FFE889] px-1.5 py-0.5 rounded">
                    Done
                  </span>
                )}
              </div>
              <p className="text-[12.5px] text-[#222222]/60 mt-0.5 leading-snug">{c.subtitle}</p>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-bold text-[#222222]/70">
              <RotateCcw className="w-3.5 h-3.5" />
              Replay
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>

      {isDev && (
        <div className="px-4 pt-6">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-[#222222]/20 text-[12px] font-bold text-[#222222]/60"
            data-testid="button-reset-tutorials"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset tutorial memory (dev)
          </button>
        </div>
      )}

      {active && (
        <TutorialOverlay
          featureId={active}
          onClose={() => {
            setActive(null);
            setDone(getAllCompletionState());
          }}
        />
      )}
    </div>
  );
}
