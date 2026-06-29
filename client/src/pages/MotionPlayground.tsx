import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion, useSpring, MotionConfig } from "framer-motion";
import {
  ArrowLeft,
  Star,
  RotateCw,
  Sparkles,
  Heart,
  Home as HomeIcon,
  Flame,
  Bookmark,
  User,
  X,
} from "lucide-react";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  pressable,
  springBouncy,
  springSoft,
  springSnappy,
  EASE_OUT,
} from "@/lib/motion";

const GOLD = "#FFCC02";

const FOOD_IMG = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=60",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=60",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=60",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=60",
];

const DEMO = [
  { name: "Roots Coffee & Brunch", meta: "Cafe · Brunch · Ari", rating: "4.8", img: FOOD_IMG[0] },
  { name: "Soei Seafood", meta: "Thai · Seafood · Phra Khanong", rating: "4.7", img: FOOD_IMG[1] },
  { name: "Gaa", meta: "Fine Dining · Sukhumvit", rating: "4.9", img: FOOD_IMG[2] },
  { name: "Err Urban Rustic", meta: "Thai · Tha Tian", rating: "4.6", img: FOOD_IMG[3] },
];

type Ctx = { replay: number; reduce: boolean };
type Variant = { label: string; render: (ctx: Ctx) => React.ReactNode };

/* ───────────────────────── shared shell ───────────────────────── */

function VariantTabs({ labels, active, onChange }: { labels: string[]; active: number; onChange: (i: number) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {labels.map((l, i) => {
        const on = i === active;
        return (
          <button
            key={l}
            onClick={() => onChange(i)}
            className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
            style={on ? { backgroundColor: GOLD, color: "#000" } : { backgroundColor: "hsl(var(--muted))" }}
            data-testid={`variant-${l.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

function DemoSection({
  title,
  hint,
  where,
  variants,
}: {
  title: string;
  hint: string;
  where: string;
  variants: Variant[];
}) {
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const v = variants[active];

  return (
    <motion.section variants={fadeUp} className="rounded-2xl bg-card border border-card-border shadow-sm p-4">
      <div className="mb-3">
        <h2 className="text-base font-semibold tracking-tight" data-testid={`text-section-${title}`}>
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        <span
          className="inline-block mt-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `${GOLD}22`, color: "#8a6d00" }}
        >
          In the app: {where}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <VariantTabs labels={variants.map((x) => x.label)} active={active} onChange={(i) => { setActive(i); setReplay((k) => k + 1); }} />
        <button
          onClick={() => setReplay((k) => k + 1)}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover-elevate rounded-md px-2 py-1"
          data-testid={`button-replay-${title.replace(/\s+/g, "-").toLowerCase()}`}
          aria-label="Replay"
        >
          <RotateCw className="w-3.5 h-3.5" /> Replay
        </button>
      </div>

      <div key={`${active}-${replay}`} className="min-h-[150px]">
        {v.render({ replay, reduce })}
      </div>
    </motion.section>
  );
}

/* ───────────────────────── cards ───────────────────────── */

function CardMeta({ d }: { d: (typeof DEMO)[number] }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm truncate flex-1">{d.name}</h4>
        <div className="flex items-center gap-0.5 ml-2 text-xs font-medium">
          <Star className="w-3 h-3" fill={GOLD} color={GOLD} /> {d.rating}
        </div>
      </div>
      <p className="text-xs text-muted-foreground truncate mt-0.5">{d.meta}</p>
    </div>
  );
}

function TiltCard({ d, reduce }: { d: (typeof DEMO)[number]; reduce: boolean }) {
  const rx = useSpring(0, { stiffness: 300, damping: 20 });
  const ry = useSpring(0, { stiffness: 300, damping: 20 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 700 }}
      className="w-40 shrink-0 cursor-pointer"
    >
      <div className="w-full h-32 rounded-2xl overflow-hidden relative shadow-lg">
        <img src={d.img} alt={d.name} draggable={false} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
      <CardMeta d={d} />
    </motion.div>
  );
}

function FancyCard({ d, variant, reduce }: { d: (typeof DEMO)[number]; variant: string; reduce: boolean }) {
  if (variant === "tilt") return <TiltCard d={d} reduce={reduce} />;
  const imgVariants =
    variant === "kenburns"
      ? { rest: { scale: 1 }, hover: { scale: 1.1 } }
      : variant === "reveal"
      ? { rest: { scale: 1 }, hover: { scale: 1.06 } }
      : { rest: { scale: 1 }, hover: { scale: 1.04 } };
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      whileTap={{ scale: 0.97 }}
      variants={{ rest: { y: 0 }, hover: { y: -6 } }}
      transition={springSoft}
      className="w-40 shrink-0 cursor-pointer"
    >
      <motion.div
        variants={{ rest: { boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }, hover: { boxShadow: "0 16px 30px -10px rgba(0,0,0,0.28)" } }}
        className="w-full h-32 rounded-2xl overflow-hidden relative"
      >
        <motion.img
          src={d.img}
          alt={d.name}
          draggable={false}
          variants={imgVariants}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        {variant === "reveal" && (
          <>
            <motion.div variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }} className="absolute inset-0 bg-black/25" />
            <motion.div
              variants={{ rest: { y: "100%" }, hover: { y: 0 } }}
              transition={springSoft}
              className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur px-2.5 py-2"
            >
              <div className="text-xs font-semibold text-foreground truncate">{d.name}</div>
              <div className="text-[10px] text-muted-foreground">View menu →</div>
            </motion.div>
          </>
        )}
        {variant === "shine" && (
          <motion.div
            variants={{ rest: { x: "-160%" }, hover: { x: "160%" } }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="absolute top-0 bottom-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />
        )}
      </motion.div>
      <CardMeta d={d} />
    </motion.div>
  );
}

function CardRow({ variant, reduce }: { variant: string; reduce: boolean }) {
  return (
    <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1">
      {DEMO.slice(0, 3).map((d) => (
        <FancyCard key={d.name} d={d} variant={variant} reduce={reduce} />
      ))}
    </div>
  );
}

/* ───────────────────────── loading ───────────────────────── */

function SkeletonCard({ variant, reduce }: { variant: string; reduce: boolean }) {
  const block = variant === "shimmer" ? "skeleton-base" : variant === "pulse" ? (reduce ? "bg-muted" : "bg-muted animate-pulse") : "bg-muted";
  return (
    <div className="w-40 shrink-0">
      <div className={`w-full h-32 rounded-2xl ${block}`} />
      <div className={`mt-2 h-3.5 w-3/4 rounded-full ${block}`} />
      <div className={`mt-1.5 h-3 w-1/2 rounded-full ${block}`} />
    </div>
  );
}

function LoadingDemo({ variant, reduce }: { variant: string; reduce: boolean }) {
  const [loading, setLoading] = useState(true);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setLoading(true);
    t.current = setTimeout(() => setLoading(false), 1500);
    return () => { if (t.current) clearTimeout(t.current); };
  }, []);

  return (
    <div className="min-h-[164px]">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="l" exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex gap-3.5 overflow-hidden" data-testid="state-loading">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} variant={variant} reduce={reduce} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="c"
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="show"
            className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1"
            data-testid="state-content"
          >
            {DEMO.slice(0, 3).map((d) => (
              <motion.div key={d.name} variants={staggerItem} className="w-40 shrink-0">
                <div className="w-full h-32 rounded-2xl overflow-hidden">
                  {variant === "blurup" && !reduce ? (
                    <motion.img
                      src={d.img}
                      alt={d.name}
                      draggable={false}
                      initial={{ filter: "blur(14px)", scale: 1.06, opacity: 0.5 }}
                      animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={d.img} alt={d.name} draggable={false} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="mt-2 font-semibold text-sm truncate">{d.name}</div>
                <div className="text-xs text-muted-foreground truncate">{d.meta}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────── filters ───────────────────────── */

const FILTERS = [
  { key: "spicy", label: "Spicy", emoji: "🌶️" },
  { key: "cheap", label: "Budget", emoji: "💸" },
  { key: "healthy", label: "Healthy", emoji: "🥗" },
  { key: "trending", label: "Trending", emoji: "🔥" },
];
const FILTER_ITEMS: Record<string, string[]> = {
  spicy: ["Som Tam Jay So", "Jae Fai", "Raan Jay Fai"],
  cheap: ["Pratunam Boat Noodles", "Sabx2", "Lung Lek"],
  healthy: ["Broccoli Revolution", "Veganerie", "Rasayana"],
  trending: ["Potong", "Samrub Samrub", "Baan Tepa"],
};

function FilterDemo({ variant }: { variant: string }) {
  const [active, setActive] = useState("spicy");
  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {FILTERS.map((f) => {
          const on = active === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className="relative rounded-full px-3.5 py-1.5 text-sm font-medium"
              data-testid={`chip-filter-${f.key}`}
            >
              {variant === "pill" && on && (
                <motion.span layoutId="filterPill" className="absolute inset-0 rounded-full" style={{ backgroundColor: GOLD }} transition={springSnappy} />
              )}
              <span className={`relative z-10 inline-flex items-center gap-1 ${on && variant === "pill" ? "text-black" : on ? "text-foreground" : "text-muted-foreground"}`}>
                <motion.span animate={variant === "emoji" && on ? { scale: [1, 1.4, 1], rotate: [0, -10, 0] } : { scale: 1 }} transition={springBouncy}>
                  {f.emoji}
                </motion.span>
                {f.label}
              </span>
              {variant === "underline" && on && (
                <motion.span layoutId="filterUnderline" className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full" style={{ backgroundColor: GOLD }} transition={springSnappy} />
              )}
            </button>
          );
        })}
      </div>
      <div className="min-h-[132px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={variant === "emoji" ? { opacity: 0, scale: 0.96 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={variant === "emoji" ? { opacity: 0, scale: 0.98 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="space-y-2"
            data-testid={`list-filter-${active}`}
          >
            {FILTER_ITEMS[active].map((name) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">{FILTERS.find((f) => f.key === active)?.emoji}</div>
                <div className="font-medium text-sm">{name}</div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────────────────── nav ───────────────────────── */

const TABS = [
  { icon: HomeIcon, label: "Discover" },
  { icon: Flame, label: "Trending" },
  { icon: Bookmark, label: "Saved" },
  { icon: User, label: "Profile" },
];

function NavDemo({ variant }: { variant: string }) {
  const [active, setActive] = useState(0);

  if (variant === "expand") {
    return (
      <div className="flex items-center justify-around gap-1 rounded-2xl border border-card-border bg-card p-2">
        {TABS.map((t, i) => {
          const on = i === active;
          const Icon = t.icon;
          return (
            <motion.button
              key={t.label}
              layout
              onClick={() => setActive(i)}
              transition={springSnappy}
              className="flex items-center gap-1.5 rounded-full px-3 py-2"
              style={on ? { backgroundColor: `${GOLD}26` } : undefined}
              data-testid={`tab-${t.label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5" color={on ? "#8a6d00" : "currentColor"} />
              <AnimatePresence>
                {on && (
                  <motion.span layout initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-xs font-semibold text-foreground overflow-hidden whitespace-nowrap">
                    {t.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (variant === "dot") {
    return (
      <div className="flex items-center justify-around rounded-2xl border border-card-border bg-card p-2">
        {TABS.map((t, i) => {
          const on = i === active;
          const Icon = t.icon;
          return (
            <button key={t.label} onClick={() => setActive(i)} className="flex flex-col items-center gap-1 px-3 py-1.5" data-testid={`tab-${t.label.toLowerCase()}`}>
              <Icon className="w-5 h-5" color={on ? "#8a6d00" : "currentColor"} />
              <span className={`text-[10px] font-medium ${on ? "text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
              <div className="h-1.5 w-6 flex justify-center">
                {on && <motion.span layoutId="navDot" className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }} transition={springSnappy} />}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-around rounded-2xl border border-card-border bg-card p-2">
      {TABS.map((t, i) => {
        const on = i === active;
        const Icon = t.icon;
        return (
          <button key={t.label} onClick={() => setActive(i)} className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl" data-testid={`tab-${t.label.toLowerCase()}`}>
            {on && <motion.span layoutId="navPill" className="absolute inset-0 rounded-xl" style={{ backgroundColor: `${GOLD}26` }} transition={springSnappy} />}
            <motion.span animate={{ scale: on ? 1.15 : 1, y: on ? -1 : 0 }} transition={springBouncy} className="relative z-10">
              <Icon className="w-5 h-5" color={on ? "#8a6d00" : "currentColor"} />
            </motion.span>
            <span className={`relative z-10 text-[10px] font-medium ${on ? "text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── expand ───────────────────────── */

function ExpandDemo({ variant }: { variant: string }) {
  const [sel, setSel] = useState<number | null>(null);
  const shared = variant === "shared";

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5">
        {DEMO.slice(0, 3).map((d, i) => (
          <motion.button key={d.name} {...pressable} onClick={() => setSel(i)} className="rounded-xl overflow-hidden aspect-square" data-testid={`thumb-shared-${i}`}>
            {shared ? (
              sel !== i && <motion.img layoutId={`exp-${i}`} src={d.img} alt={d.name} draggable={false} className="w-full h-full object-cover" />
            ) : (
              <img src={d.img} alt={d.name} draggable={false} className="w-full h-full object-cover" />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {sel !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: variant === "scaleblur" ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.5)", backdropFilter: variant === "scaleblur" ? "blur(6px)" : undefined }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
            data-testid="overlay-shared"
          >
            {variant === "sheet" ? (
              <motion.div className="w-full max-w-sm rounded-3xl overflow-hidden bg-card" onClick={(e) => e.stopPropagation()}>
                <img src={DEMO[sel].img} alt="" className="w-full h-48 object-cover" draggable={false} />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={springSoft} className="p-4 bg-card">
                  <ExpandBody sel={sel} onClose={() => setSel(null)} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="w-full max-w-sm rounded-3xl overflow-hidden bg-card"
                onClick={(e) => e.stopPropagation()}
                initial={variant === "scaleblur" ? { scale: 0.9, opacity: 0 } : undefined}
                animate={variant === "scaleblur" ? { scale: 1, opacity: 1 } : undefined}
                exit={variant === "scaleblur" ? { scale: 0.95, opacity: 0 } : undefined}
                transition={springSoft}
              >
                {shared ? (
                  <motion.img layoutId={`exp-${sel}`} src={DEMO[sel].img} alt="" className="w-full h-56 object-cover" draggable={false} />
                ) : (
                  <img src={DEMO[sel].img} alt="" className="w-full h-56 object-cover" draggable={false} />
                )}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.3, ease: EASE_OUT }} className="p-4">
                  <ExpandBody sel={sel} onClose={() => setSel(null)} />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandBody({ sel, onClose }: { sel: number; onClose: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{DEMO[sel].name}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center" data-testid="button-close-shared" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{DEMO[sel].meta}</p>
      <p className="text-sm mt-3 leading-relaxed text-muted-foreground">Tap the dimmed area to close. Try each style above to feel the difference.</p>
    </>
  );
}

/* ───────────────────────── numbers ───────────────────────── */

function CountUp({ to, reduce }: { to: number; reduce: boolean }) {
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) { setN(to); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, reduce]);
  return <>{n}</>;
}

function SlotNumber({ value, reduce }: { value: number; reduce: boolean }) {
  return (
    <span className="inline-block overflow-hidden" style={{ height: "1.2em", lineHeight: "1.2em" }}>
      <motion.span className="inline-block" initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
        {value}
      </motion.span>
    </span>
  );
}

function StatRing({ frac, value, label, reduce }: { frac: number; value: number; label: string; reduce: boolean }) {
  const R = 24, C = 2 * Math.PI * R, size = 60, cx = size / 2;
  return (
    <div className="rounded-xl border border-card-border bg-card p-3 flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={cx} cy={cx} r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth={6} />
          <motion.circle
            cx={cx}
            cy={cx}
            r={R}
            fill="none"
            stroke={GOLD}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: reduce ? C * (1 - frac) : C }}
            animate={{ strokeDashoffset: C * (1 - frac) }}
            transition={{ duration: 1, ease: EASE_OUT }}
            transform={`rotate(-90 ${cx} ${cx})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: "#8a6d00" }}>{value}</div>
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

const STATS = [
  { v: 142, label: "swipes", frac: 0.78 },
  { v: 27, label: "matches", frac: 0.45 },
  { v: 89, label: "% match", frac: 0.89 },
];

function CountDemo({ variant, reduce }: { variant: string; reduce: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {STATS.map((s) =>
        variant === "ring" ? (
          <StatRing key={s.label} frac={s.frac} value={s.v} label={s.label} reduce={reduce} />
        ) : (
          <div key={s.label} className="rounded-xl border border-card-border bg-card p-3 text-center">
            <div className="text-2xl font-bold tracking-tight" style={{ color: "#8a6d00" }}>
              {variant === "roll" ? <SlotNumber value={s.v} reduce={reduce} /> : <CountUp to={s.v} reduce={reduce} />}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        )
      )}
    </div>
  );
}

/* ───────────────────────── scroll reveal ───────────────────────── */

function RevealDemo({ variant }: { variant: string }) {
  const rows = ["Your week in food", "Top cuisines", "Saved for later", "Nearby gems"];
  return (
    <div className="space-y-2">
      {rows.map((t, i) => {
        const initial =
          variant === "alternate"
            ? { opacity: 0, x: i % 2 ? 40 : -40 }
            : variant === "scalefade"
            ? { opacity: 0, scale: 0.9 }
            : variant === "blur"
            ? { opacity: 0, filter: "blur(8px)" }
            : { opacity: 0, y: 24 };
        return (
          <motion.div
            key={t}
            initial={initial}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-3"
            data-testid={`reveal-row-${i}`}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${GOLD}22` }}>✨</div>
            <div className="font-medium text-sm">{t}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────────────────────── press ───────────────────────── */

function RippleButton({ reduce }: { reduce: boolean }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  const onClick = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    timers.current.push(setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 600));
  };
  return (
    <button onClick={onClick} className="relative overflow-hidden w-full rounded-xl py-4 font-semibold text-black" style={{ backgroundColor: GOLD }} data-testid="button-ripple">
      Tap me (ripple)
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-black/15"
          style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        />
      ))}
    </button>
  );
}

function HeartPop({ reduce }: { reduce: boolean }) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  return (
    <button
      onClick={() => { setLiked((v) => !v); setBurst((k) => k + 1); }}
      className="relative w-full rounded-xl border border-card-border bg-card py-4 flex items-center justify-center gap-2 font-medium"
      data-testid="button-heartpop"
    >
      <span className="relative">
        <motion.span key={`${liked}-${burst}`} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={springBouncy} className="inline-block">
          <Heart className="w-6 h-6" fill={liked ? GOLD : "none"} color={liked ? GOLD : "currentColor"} />
        </motion.span>
        {liked && !reduce &&
          [...Array(7)].map((_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return (
              <motion.span
                key={`${burst}-${i}`}
                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: GOLD }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: Math.cos(a) * 26, y: Math.sin(a) * 26, scale: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />
            );
          })}
      </span>
      {liked ? "Saved!" : "Tap to save"}
    </button>
  );
}

function PressDemo({ variant, reduce }: { variant: string; reduce: boolean }) {
  if (variant === "ripple") return <RippleButton reduce={reduce} />;
  if (variant === "heart") return <HeartPop reduce={reduce} />;
  const tap = variant === "squish" ? { scaleX: 1.05, scaleY: 0.9 } : { scale: 0.96 };
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.button whileTap={tap} transition={springSnappy} className="rounded-xl border border-card-border bg-card p-5 text-left" data-testid="button-press-a">
        <div className="text-2xl">🍞</div>
        <div className="font-semibold mt-1">Solo</div>
        <div className="text-xs text-muted-foreground">Just for you</div>
      </motion.button>
      <motion.button whileTap={tap} transition={springSnappy} className="rounded-xl p-5 text-left text-black" style={{ backgroundColor: GOLD }} data-testid="button-press-b">
        <div className="text-2xl">🧇</div>
        <div className="font-semibold mt-1">Group</div>
        <div className="text-xs text-black/70">With friends</div>
      </motion.button>
    </div>
  );
}

/* ───────────────────────── list entrance ───────────────────────── */

function ListDemo({ variant }: { variant: string }) {
  const item =
    variant === "slide"
      ? { hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { duration: 0.34, ease: EASE_OUT } } }
      : variant === "pop"
      ? { hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: springBouncy } }
      : staggerItem;
  return (
    <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="show" className="space-y-2">
      {DEMO.map((d) => (
        <motion.div key={d.name} variants={item} className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-3" data-testid={`row-demo-${d.name}`}>
          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0">
            <img src={d.img} alt="" className="w-full h-full object-cover" draggable={false} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{d.name}</div>
            <div className="text-xs text-muted-foreground truncate">{d.meta}</div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium shrink-0">
            <Star className="w-3.5 h-3.5" fill={GOLD} color={GOLD} /> {d.rating}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ───────────────────────── hero reveal ───────────────────────── */

function HeroReveal({ variant }: { variant: string }) {
  const lines = (
    <>
      <span className="block text-xs text-muted-foreground">Wed · 10:16 AM · 33°C</span>
      <span className="block text-2xl font-semibold tracking-tight mt-1">Thunder &amp; hunger</span>
      <span className="block text-sm text-muted-foreground mt-1">Stay in, order something amazing</span>
    </>
  );
  if (variant === "mask") {
    return (
      <div className="rounded-xl border border-card-border bg-card p-4 space-y-1">
        {["Wed · 10:16 AM · 33°C", "Thunder & hunger", "Stay in, order something amazing"].map((t, i) => (
          <div key={t} className="overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE_OUT }}
              className={i === 1 ? "text-2xl font-semibold tracking-tight" : "text-sm text-muted-foreground"}
            >
              {t}
            </motion.div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "scale") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={springSoft} className="rounded-xl border border-card-border bg-card p-4">
        {lines}
      </motion.div>
    );
  }
  return (
    <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="show" className="rounded-xl border border-card-border bg-card p-4">
      <motion.p variants={staggerItem} className="text-xs text-muted-foreground">Wed · 10:16 AM · 33°C</motion.p>
      <motion.h3 variants={staggerItem} className="text-2xl font-semibold tracking-tight mt-1">Thunder &amp; hunger</motion.h3>
      <motion.p variants={staggerItem} className="text-sm text-muted-foreground mt-1">Stay in, order something amazing</motion.p>
    </motion.div>
  );
}

/* ───────────────────────── celebration ───────────────────────── */

function CelebrationDemo({ variant, reduce }: { variant: string; reduce: boolean }) {
  const [go, setGo] = useState(false);
  const rafRef = useRef<number | null>(null);
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);
  const fire = () => { setGo(false); rafRef.current = requestAnimationFrame(() => setGo(true)); };
  const emojis = ["🍕", "🎉", "🍜", "🥢", "✨", "🧇"];

  return (
    <div>
      <div className="relative rounded-xl border border-card-border bg-card p-5 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
        <AnimatePresence>
          {go && (
            <motion.div key="cel" initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={springBouncy} className="flex flex-col items-center text-center">
              {variant === "ring" ? (
                <div className="relative flex items-center justify-center w-20 h-20">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute rounded-full border-2"
                      style={{ borderColor: GOLD }}
                      initial={{ width: 24, height: 24, opacity: 0.7 }}
                      animate={{ width: 90, height: 90, opacity: 0 }}
                      transition={{ duration: 1, ease: EASE_OUT, delay: i * 0.18, repeat: reduce ? 0 : Infinity }}
                    />
                  ))}
                  <motion.div initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={springBouncy}>
                    <Sparkles className="w-10 h-10" color={GOLD} fill={GOLD} />
                  </motion.div>
                </div>
              ) : (
                <motion.div initial={{ rotate: -12, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={springBouncy}>
                  <Sparkles className="w-12 h-12" color={GOLD} fill={GOLD} />
                </motion.div>
              )}
              <div className="font-semibold text-lg mt-2">It's a match!</div>
              <div className="text-sm text-muted-foreground">Roots Coffee &amp; Brunch</div>

              {variant === "sparkle" && !reduce &&
                [...Array(8)].map((_, i) => {
                  const a = (i / 8) * Math.PI * 2;
                  return (
                    <motion.span key={i} className="absolute top-6 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }} initial={{ opacity: 1, x: 0, y: 0, scale: 1 }} animate={{ opacity: 0, x: Math.cos(a) * 70, y: Math.sin(a) * 70, scale: 0 }} transition={{ duration: 0.7, ease: EASE_OUT }} />
                  );
                })}

              {variant === "emoji" && !reduce &&
                emojis.map((em, i) => {
                  const a = (i / emojis.length) * Math.PI * 2;
                  return (
                    <motion.span key={i} className="absolute top-6 text-xl" initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }} animate={{ opacity: 0, x: Math.cos(a) * 80, y: Math.sin(a) * 80 - 20, scale: 1.1 }} transition={{ duration: 0.9, ease: EASE_OUT }}>
                      {em}
                    </motion.span>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
        {!go && (
          <motion.div variants={scaleIn} initial="hidden" animate="show" className="text-sm text-muted-foreground">
            Tap below to celebrate
          </motion.div>
        )}
      </div>
      <motion.button {...pressable} onClick={fire} className="mt-3 w-full rounded-xl py-3 font-semibold text-black" style={{ backgroundColor: GOLD }} data-testid="button-celebrate">
        Trigger celebration
      </motion.button>
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function MotionPlayground() {
  const [, navigate] = useLocation();

  const SECTIONS: { title: string; hint: string; where: string; variants: Variant[] }[] = [
    {
      title: "Cards that breathe",
      hint: "How a restaurant card reacts to touch & hover. 4 styles to compare.",
      where: "restaurant rows on Discover",
      variants: [
        { label: "Ken Burns", render: ({ reduce }) => <CardRow variant="kenburns" reduce={reduce} /> },
        { label: "3D Tilt", render: ({ reduce }) => <CardRow variant="tilt" reduce={reduce} /> },
        { label: "Reveal panel", render: ({ reduce }) => <CardRow variant="reveal" reduce={reduce} /> },
        { label: "Shine", render: ({ reduce }) => <CardRow variant="shine" reduce={reduce} /> },
      ],
    },
    {
      title: "Loading that feels instant",
      hint: "What fills the gap while rows fetch — pick a placeholder style.",
      where: "while restaurant rows fetch",
      variants: [
        { label: "Shimmer", render: ({ reduce }) => <LoadingDemo variant="shimmer" reduce={reduce} /> },
        { label: "Pulse", render: ({ reduce }) => <LoadingDemo variant="pulse" reduce={reduce} /> },
        { label: "Blur-up", render: ({ reduce }) => <LoadingDemo variant="blurup" reduce={reduce} /> },
      ],
    },
    {
      title: "Filters that come alive",
      hint: "How the active category reads, and how results swap in.",
      where: "emoji category filters on Discover",
      variants: [
        { label: "Slide pill", render: () => <FilterDemo variant="pill" /> },
        { label: "Underline", render: () => <FilterDemo variant="underline" /> },
        { label: "Emoji pop", render: () => <FilterDemo variant="emoji" /> },
      ],
    },
    {
      title: "Bottom nav",
      hint: "How the active tab is signalled as you move around.",
      where: "bottom navigation",
      variants: [
        { label: "Slide pill", render: () => <NavDemo variant="pill" /> },
        { label: "Expanding label", render: () => <NavDemo variant="expand" /> },
        { label: "Sliding dot", render: () => <NavDemo variant="dot" /> },
      ],
    },
    {
      title: "Tap to expand",
      hint: "How a thumbnail opens into detail. Tap one to preview.",
      where: "card → restaurant detail",
      variants: [
        { label: "Shared element", render: () => <ExpandDemo variant="shared" /> },
        { label: "Bottom sheet", render: () => <ExpandDemo variant="sheet" /> },
        { label: "Scale + blur", render: () => <ExpandDemo variant="scaleblur" /> },
      ],
    },
    {
      title: "Numbers with life",
      hint: "Make stats feel earned instead of just appearing.",
      where: "Taste DNA & daily craving",
      variants: [
        { label: "Count up", render: ({ reduce }) => <CountDemo variant="count" reduce={reduce} /> },
        { label: "Slot roll", render: ({ reduce }) => <CountDemo variant="roll" reduce={reduce} /> },
        { label: "Progress ring", render: ({ reduce }) => <CountDemo variant="ring" reduce={reduce} /> },
      ],
    },
    {
      title: "Reveal on scroll",
      hint: "How sections arrive as you scroll down a page.",
      where: "long pages (Profile, detail)",
      variants: [
        { label: "Rise", render: () => <RevealDemo variant="rise" /> },
        { label: "Alternate slide", render: () => <RevealDemo variant="alternate" /> },
        { label: "Scale fade", render: () => <RevealDemo variant="scalefade" /> },
        { label: "Blur in", render: () => <RevealDemo variant="blur" /> },
      ],
    },
    {
      title: "Press feedback",
      hint: "The tactile beat when you tap. Try each.",
      where: "every tappable card/button",
      variants: [
        { label: "Scale", render: ({ reduce }) => <PressDemo variant="scale" reduce={reduce} /> },
        { label: "Squish", render: ({ reduce }) => <PressDemo variant="squish" reduce={reduce} /> },
        { label: "Ripple", render: ({ reduce }) => <PressDemo variant="ripple" reduce={reduce} /> },
        { label: "Heart pop", render: ({ reduce }) => <PressDemo variant="heart" reduce={reduce} /> },
      ],
    },
    {
      title: "List entrance",
      hint: "How a stack of items first appears.",
      where: "restaurant rows & lists",
      variants: [
        { label: "Cascade up", render: () => <ListDemo variant="cascade" /> },
        { label: "Slide in", render: () => <ListDemo variant="slide" /> },
        { label: "Pop scale", render: () => <ListDemo variant="pop" /> },
      ],
    },
    {
      title: "Hero / header reveal",
      hint: "How the top of a screen introduces itself on load.",
      where: "Discover hero header",
      variants: [
        { label: "Stagger", render: () => <HeroReveal variant="stagger" /> },
        { label: "Text mask", render: () => <HeroReveal variant="mask" /> },
        { label: "Scale in", render: () => <HeroReveal variant="scale" /> },
      ],
    },
    {
      title: "Celebration moment",
      hint: "The 'fun' beat for a match — kept premium, not chaos.",
      where: "match / save moments",
      variants: [
        { label: "Spark burst", render: ({ reduce }) => <CelebrationDemo variant="sparkle" reduce={reduce} /> },
        { label: "Emoji pop", render: ({ reduce }) => <CelebrationDemo variant="emoji" reduce={reduce} /> },
        { label: "Ring pulse", render: ({ reduce }) => <CelebrationDemo variant="ring" reduce={reduce} /> },
      ],
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
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
                Motion Lab
              </h1>
              <p className="text-xs text-muted-foreground">Tap the style chips to compare options</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="max-w-md mx-auto px-4 py-5 space-y-4">
          <motion.div variants={fadeUp} className="rounded-2xl p-4 text-black" style={{ background: `linear-gradient(135deg, ${GOLD}, #ffd84d)` }}>
            <div className="text-sm font-semibold">A menu of motion ideas</div>
            <p className="text-xs text-black/70 mt-1 leading-relaxed">
              Each card is a live example tied to a real screen in Toast. Tap the little style chips to compare options,
              and hit Replay to watch again. Goal: friendly + premium, never childish. Everything honors your OS "reduce
              motion" setting.
            </p>
          </motion.div>

          {SECTIONS.map((s) => (
            <DemoSection key={s.title} title={s.title} hint={s.hint} where={s.where} variants={s.variants} />
          ))}

          <p className="text-center text-xs text-muted-foreground pt-1 pb-6">
            Tell me which styles you like and I'll wire just those into the real app.
          </p>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
