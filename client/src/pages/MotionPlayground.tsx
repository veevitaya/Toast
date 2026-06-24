import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, RotateCw, Sparkles, Heart } from "lucide-react";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  pressable,
  springBouncy,
  EASE_OUT,
} from "@/lib/motion";

const GOLD = "#FFCC02";

const DEMO_ROWS = [
  { name: "Roots Coffee & Brunch", meta: "Cafe · Brunch · Ari", rating: "4.8" },
  { name: "Soei Seafood", meta: "Thai · Seafood · Phra Khanong", rating: "4.7" },
  { name: "Gaa", meta: "Fine Dining · Indian · Sukhumvit", rating: "4.9" },
  { name: "Err Urban Rustic", meta: "Thai · Street Food · Tha Tian", rating: "4.6" },
];

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={fadeUp}
      className="rounded-2xl bg-card border border-card-border shadow-sm p-4"
    >
      <div className="mb-3">
        <h2 className="text-base font-semibold tracking-tight" data-testid={`text-section-${title}`}>
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
      </div>
      {children}
    </motion.section>
  );
}

export default function MotionPlayground() {
  const [, navigate] = useLocation();
  const [staggerKey, setStaggerKey] = useState(0);
  const [revealKey, setRevealKey] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-back"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight" data-testid="text-playground-title">
              Motion Playground
            </h1>
            <p className="text-xs text-muted-foreground">Tap around — replay any demo</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="show"
        className="max-w-md mx-auto px-4 py-5 space-y-4"
      >
        {/* 1. Press micro-interactions */}
        <Section title="Press feedback" hint="The tactile tap on cards & buttons (#3)">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              {...pressable}
              onClick={() => navigate("/")}
              className="rounded-xl border border-card-border bg-card p-4 text-left"
              data-testid="button-press-solo"
            >
              <div className="text-2xl">🍞</div>
              <div className="font-semibold mt-1">Solo</div>
              <div className="text-xs text-muted-foreground">Just for you</div>
            </motion.button>
            <motion.button
              {...pressable}
              onClick={() => navigate("/")}
              className="rounded-xl p-4 text-left text-black"
              style={{ backgroundColor: GOLD }}
              data-testid="button-press-group"
            >
              <div className="text-2xl">🧇</div>
              <div className="font-semibold mt-1">Group</div>
              <div className="text-xs text-black/70">With friends</div>
            </motion.button>
          </div>
          <motion.button
            {...pressable}
            onClick={() => setLiked((v) => !v)}
            className="mt-3 w-full rounded-xl border border-card-border bg-card py-3 flex items-center justify-center gap-2 font-medium"
            data-testid="button-press-like"
          >
            <motion.span
              key={String(liked)}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={springBouncy}
            >
              <Heart
                className="w-5 h-5"
                fill={liked ? GOLD : "none"}
                color={liked ? GOLD : "currentColor"}
              />
            </motion.span>
            {liked ? "Saved!" : "Tap to save"}
          </motion.button>
        </Section>

        {/* 2. Staggered list entrance */}
        <Section title="List entrance" hint="Cards cascade in instead of popping (#2)">
          <button
            onClick={() => setStaggerKey((k) => k + 1)}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover-elevate rounded-md px-2 py-1"
            data-testid="button-replay-stagger"
          >
            <RotateCw className="w-4 h-4" /> Replay
          </button>
          <motion.div
            key={staggerKey}
            variants={staggerContainer(0.07)}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {DEMO_ROWS.map((r) => (
              <motion.div
                key={r.name}
                variants={staggerItem}
                className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-3"
                data-testid={`row-demo-${r.name}`}
              >
                <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                  🍽️
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.meta}</div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium shrink-0">
                  <Star className="w-3.5 h-3.5" fill={GOLD} color={GOLD} />
                  {r.rating}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* 3. Section reveal */}
        <Section title="Hero / section reveal" hint="Content rises in on load (#4)">
          <button
            onClick={() => setRevealKey((k) => k + 1)}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover-elevate rounded-md px-2 py-1"
            data-testid="button-replay-reveal"
          >
            <RotateCw className="w-4 h-4" /> Replay
          </button>
          <motion.div
            key={revealKey}
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-card-border bg-card p-4"
          >
            <motion.p variants={staggerItem} className="text-xs text-muted-foreground">
              Wed · 10:16 AM · 33°C
            </motion.p>
            <motion.h3 variants={staggerItem} className="text-2xl font-semibold tracking-tight mt-1">
              Thunder &amp; hunger
            </motion.h3>
            <motion.p variants={staggerItem} className="text-sm text-muted-foreground mt-1">
              Stay in, order something amazing
            </motion.p>
            <motion.div variants={staggerItem} className="mt-3">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${GOLD}22`, color: "#8a6d00" }}
              >
                12-wk streak
              </span>
            </motion.div>
          </motion.div>
        </Section>

        {/* 4. Celebration moment */}
        <Section title="Celebration moment" hint="The 'fun' beat — kept premium (#5)">
          <div className="relative rounded-xl border border-card-border bg-card p-5 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
            <AnimatePresence>
              {celebrate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={springBouncy}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ rotate: -12, scale: 0.6 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={springBouncy}
                  >
                    <Sparkles className="w-12 h-12" color={GOLD} fill={GOLD} />
                  </motion.div>
                  <div className="font-semibold text-lg mt-2">It's a match!</div>
                  <div className="text-sm text-muted-foreground">Roots Coffee &amp; Brunch</div>
                  {/* sparkle burst */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    return (
                      <motion.span
                        key={i}
                        className="absolute top-6 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: GOLD }}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{
                          opacity: 0,
                          x: Math.cos(angle) * 70,
                          y: Math.sin(angle) * 70,
                          scale: 0,
                        }}
                        transition={{ duration: 0.7, ease: EASE_OUT }}
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            {!celebrate && (
              <motion.div variants={scaleIn} className="text-sm text-muted-foreground">
                Tap below to celebrate
              </motion.div>
            )}
          </div>
          <motion.button
            {...pressable}
            onClick={() => {
              setCelebrate(false);
              requestAnimationFrame(() => setCelebrate(true));
            }}
            className="mt-3 w-full rounded-xl py-3 font-semibold text-black"
            style={{ backgroundColor: GOLD }}
            data-testid="button-celebrate"
          >
            Trigger celebration
          </motion.button>
        </Section>

        <p className="text-center text-xs text-muted-foreground pt-1 pb-6">
          Every demo respects “reduce motion” in your OS settings.
        </p>
      </motion.div>
    </div>
  );
}
