import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion, MotionConfig } from "framer-motion";
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

const DEMO_ROWS = [
  { name: "Roots Coffee & Brunch", meta: "Cafe · Brunch · Ari", rating: "4.8" },
  { name: "Soei Seafood", meta: "Thai · Seafood · Phra Khanong", rating: "4.7" },
  { name: "Gaa", meta: "Fine Dining · Indian · Sukhumvit", rating: "4.9" },
  { name: "Err Urban Rustic", meta: "Thai · Street Food · Tha Tian", rating: "4.6" },
];

function Section({
  title,
  hint,
  where,
  children,
}: {
  title: string;
  hint: string;
  where?: string;
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
        {where && (
          <span
            className="inline-block mt-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: `${GOLD}22`, color: "#8a6d00" }}
          >
            In the app: {where}
          </span>
        )}
      </div>
      {children}
    </motion.section>
  );
}

function ReplayButton({ onClick, label = "Replay", testid }: { onClick: () => void; label?: string; testid: string }) {
  return (
    <button
      onClick={onClick}
      className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover-elevate rounded-md px-2 py-1"
      data-testid={testid}
    >
      <RotateCw className="w-4 h-4" /> {label}
    </button>
  );
}

/* ── Demo: a restaurant card that comes alive on hover/press ── */
function AliveCard({ img, name, meta, rating }: { img: string; name: string; meta: string; rating: string }) {
  const [burstKey, setBurstKey] = useState(0);
  const [liked, setLiked] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      whileTap={{ scale: 0.97 }}
      variants={{ rest: { y: 0 }, hover: { y: -6 } }}
      transition={springSoft}
      className="relative w-40 shrink-0 cursor-pointer"
      data-testid="card-alive"
    >
      <motion.div
        variants={{
          rest: { boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
          hover: { boxShadow: "0 16px 30px -10px rgba(0,0,0,0.28)" },
        }}
        className="w-full h-32 rounded-2xl overflow-hidden relative"
      >
        <motion.img
          src={img}
          alt={name}
          variants={{ rest: { scale: 1 }, hover: { scale: 1.1 } }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
            setBurstKey((k) => k + 1);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
          data-testid="button-alive-like"
          aria-label="Save"
        >
          <motion.span key={`${liked}-${burstKey}`} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={springBouncy}>
            <Heart className="w-4 h-4" fill={liked ? GOLD : "none"} color={liked ? GOLD : "#666"} />
          </motion.span>
          {!reduce &&
            liked &&
            [...Array(6)].map((_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return (
                <motion.span
                  key={`${burstKey}-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: GOLD }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: Math.cos(a) * 22, y: Math.sin(a) * 22, scale: 0 }}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                />
              );
            })}
        </button>
      </motion.div>
      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm truncate flex-1">{name}</h4>
          <div className="flex items-center gap-0.5 ml-2 text-xs font-medium">
            <Star className="w-3 h-3" fill={GOLD} color={GOLD} /> {rating}
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{meta}</p>
      </div>
    </motion.div>
  );
}

/* ── Demo: skeleton shimmer → content crossfade ── */
function SkeletonCard() {
  return (
    <div className="w-40 shrink-0">
      <div className="w-full h-32 rounded-2xl skeleton-base" />
      <div className="mt-2 h-3.5 w-3/4 rounded-full skeleton-base" />
      <div className="mt-1.5 h-3 w-1/2 rounded-full skeleton-base" />
    </div>
  );
}

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

function CountUp({ to, trigger }: { to: number; trigger: number }) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, trigger, reduce]);
  return <>{n}</>;
}

export default function MotionPlayground() {
  const [, navigate] = useLocation();
  const [staggerKey, setStaggerKey] = useState(0);
  const [revealKey, setRevealKey] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("spicy");
  const [activeTab, setActiveTab] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statKey, setStatKey] = useState(0);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (loadTimer.current) clearTimeout(loadTimer.current); }, []);

  const triggerLoad = () => {
    if (loadTimer.current) clearTimeout(loadTimer.current);
    setLoading(true);
    loadTimer.current = setTimeout(() => setLoading(false), 1600);
  };

  const tabs = [
    { icon: HomeIcon, label: "Discover" },
    { icon: Flame, label: "Trending" },
    { icon: Bookmark, label: "Saved" },
    { icon: User, label: "Profile" },
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
            <p className="text-xs text-muted-foreground">Tap & hover around — replay any demo</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="max-w-md mx-auto px-4 py-5 space-y-4"
      >
        {/* Intro */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl p-4 text-black"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #ffd84d)` }}
        >
          <div className="text-sm font-semibold">A menu of motion ideas</div>
          <p className="text-xs text-black/70 mt-1 leading-relaxed">
            Each card below is a live example you can poke at, tied to a real screen in Toast. The
            goal: friendly + premium, never childish. Everything honors your OS "reduce motion"
            setting.
          </p>
        </motion.div>

        {/* 1. Restaurant card, alive */}
        <Section
          title="Cards that breathe"
          hint="Image ken-burns zoom, lift + shadow on hover, a heart that pops with a spark burst."
          where="restaurant rows on Discover"
        >
          <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1">
            {FOOD_IMG.slice(0, 3).map((img, i) => (
              <AliveCard
                key={img}
                img={img}
                name={DEMO_ROWS[i].name}
                meta={DEMO_ROWS[i].meta}
                rating={DEMO_ROWS[i].rating}
              />
            ))}
          </div>
        </Section>

        {/* 2. Skeleton shimmer → content */}
        <Section
          title="Loading that feels instant"
          hint="A shimmering skeleton holds the layout, then crossfades into real cards — no jarring spinner-to-content jump."
          where="while restaurant rows fetch"
        >
          <ReplayButton onClick={triggerLoad} label="Show loading" testid="button-replay-loading" />
          <div className="min-h-[164px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-3.5 overflow-hidden"
                  data-testid="state-loading"
                >
                  {[0, 1, 2].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  variants={staggerContainer(0.08)}
                  initial="hidden"
                  animate="show"
                  className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1"
                  data-testid="state-content"
                >
                  {FOOD_IMG.slice(0, 3).map((img, i) => (
                    <motion.div key={img} variants={staggerItem} className="w-40 shrink-0">
                      <div className="w-full h-32 rounded-2xl overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                      </div>
                      <div className="mt-2 font-semibold text-sm truncate">{DEMO_ROWS[i].name}</div>
                      <div className="text-xs text-muted-foreground truncate">{DEMO_ROWS[i].meta}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* 3. Filter morph + sliding pill */}
        <Section
          title="Filters that slide & morph"
          hint="The active pill glides between chips, and the results swap with an exit/enter instead of a hard cut."
          where="emoji category filters on Discover"
        >
          <div className="flex gap-2 mb-3 flex-wrap">
            {FILTERS.map((f) => {
              const on = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className="relative rounded-full px-3.5 py-1.5 text-sm font-medium"
                  data-testid={`chip-filter-${f.key}`}
                >
                  {on && (
                    <motion.span
                      layoutId="filterPill"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: GOLD }}
                      transition={springSnappy}
                    />
                  )}
                  <span className={`relative z-10 ${on ? "text-black" : "text-muted-foreground"}`}>
                    {f.emoji} {f.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="min-h-[132px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="space-y-2"
                data-testid={`list-filter-${activeFilter}`}
              >
                {FILTER_ITEMS[activeFilter].map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      {FILTERS.find((f) => f.key === activeFilter)?.emoji}
                    </div>
                    <div className="font-medium text-sm">{name}</div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Section>

        {/* 4. Bottom nav sliding indicator */}
        <Section
          title="A nav bar with a glide"
          hint="The active indicator slides between tabs and the icon gives a little pop — instead of an instant on/off."
          where="bottom navigation"
        >
          <div className="flex items-center justify-around rounded-2xl border border-card-border bg-card p-2">
            {tabs.map((t, i) => {
              const on = activeTab === i;
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  onClick={() => setActiveTab(i)}
                  className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl"
                  data-testid={`tab-${t.label.toLowerCase()}`}
                >
                  {on && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: `${GOLD}26` }}
                      transition={springSnappy}
                    />
                  )}
                  <motion.span animate={{ scale: on ? 1.15 : 1, y: on ? -1 : 0 }} transition={springBouncy} className="relative z-10">
                    <Icon className="w-5 h-5" color={on ? "#8a6d00" : "currentColor"} />
                  </motion.span>
                  <span className={`relative z-10 text-[10px] font-medium ${on ? "text-foreground" : "text-muted-foreground"}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* 5. Shared-element expand */}
        <Section
          title="Tap to expand (shared element)"
          hint="The thumbnail morphs into the hero — the same image flies into place instead of a hard page cut."
          where="card → restaurant detail"
        >
          <div className="grid grid-cols-3 gap-2.5">
            {FOOD_IMG.slice(0, 3).map((img, i) => (
              <motion.button
                key={img}
                {...pressable}
                onClick={() => setExpandedId(i)}
                className="rounded-xl overflow-hidden aspect-square"
                data-testid={`thumb-shared-${i}`}
              >
                {expandedId !== i && (
                  <motion.img layoutId={`shared-${i}`} src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                )}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {expandedId !== null && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedId(null)}
                data-testid="overlay-shared"
              >
                <motion.div
                  className="w-full max-w-sm rounded-3xl overflow-hidden bg-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    layoutId={`shared-${expandedId}`}
                    src={FOOD_IMG[expandedId]}
                    alt=""
                    className="w-full h-56 object-cover"
                    draggable={false}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.3, ease: EASE_OUT }}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{DEMO_ROWS[expandedId].name}</h3>
                      <button
                        onClick={() => setExpandedId(null)}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                        data-testid="button-close-shared"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{DEMO_ROWS[expandedId].meta}</p>
                    <p className="text-sm mt-3 leading-relaxed text-muted-foreground">
                      The hero image is the <em>same element</em> as the thumbnail — Framer's{" "}
                      <code className="text-xs">layoutId</code> tweens it into place.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* 6. Count-up stat hero */}
        <Section
          title="Numbers that count up"
          hint="Stats animate from zero with a soft ease — a tiny beat that makes data feel earned."
          where="Taste DNA & daily craving header"
        >
          <ReplayButton onClick={() => setStatKey((k) => k + 1)} testid="button-replay-stats" />
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: 142, label: "swipes" },
              { v: 27, label: "matches" },
              { v: 89, label: "% you" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-card-border bg-card p-3 text-center">
                <div className="text-2xl font-bold tracking-tight" style={{ color: "#8a6d00" }}>
                  <CountUp to={s.v} trigger={statKey} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 7. Scroll reveal */}
        <Section
          title="Reveal on scroll"
          hint="Sections rise gently into view as you scroll — content arrives with intent instead of all at once."
          where="long pages (Profile, detail)"
        >
          <div className="space-y-2">
            {["Your week in food", "Top cuisines", "Saved for later"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-3"
                data-testid={`reveal-row-${i}`}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${GOLD}22` }}>
                  ✨
                </div>
                <div className="font-medium text-sm">{t}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Existing core micro-interactions ── */}

        {/* 8. Press micro-interactions */}
        <Section title="Press feedback" hint="The tactile tap on cards & buttons." where="every tappable card/button">
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
            <motion.span key={String(liked)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={springBouncy}>
              <Heart className="w-5 h-5" fill={liked ? GOLD : "none"} color={liked ? GOLD : "currentColor"} />
            </motion.span>
            {liked ? "Saved!" : "Tap to save"}
          </motion.button>
        </Section>

        {/* 9. Staggered list entrance */}
        <Section title="List entrance" hint="Cards cascade in instead of popping all at once." where="restaurant rows & lists">
          <ReplayButton onClick={() => setStaggerKey((k) => k + 1)} testid="button-replay-stagger" />
          <motion.div key={staggerKey} variants={staggerContainer(0.07)} initial="hidden" animate="show" className="space-y-2">
            {DEMO_ROWS.map((r) => (
              <motion.div
                key={r.name}
                variants={staggerItem}
                className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-3"
                data-testid={`row-demo-${r.name}`}
              >
                <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">🍽️</div>
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

        {/* 10. Section reveal */}
        <Section title="Hero / section reveal" hint="Content rises in on load." where="Discover hero header">
          <ReplayButton onClick={() => setRevealKey((k) => k + 1)} testid="button-replay-reveal" />
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
              <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${GOLD}22`, color: "#8a6d00" }}>
                12-wk streak
              </span>
            </motion.div>
          </motion.div>
        </Section>

        {/* 11. Celebration moment */}
        <Section title="Celebration moment" hint="The 'fun' beat — kept premium, not confetti-everywhere." where="match / save moments">
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
                  <motion.div initial={{ rotate: -12, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={springBouncy}>
                    <Sparkles className="w-12 h-12" color={GOLD} fill={GOLD} />
                  </motion.div>
                  <div className="font-semibold text-lg mt-2">It's a match!</div>
                  <div className="text-sm text-muted-foreground">Roots Coffee &amp; Brunch</div>
                  {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    return (
                      <motion.span
                        key={i}
                        className="absolute top-6 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: GOLD }}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{ opacity: 0, x: Math.cos(angle) * 70, y: Math.sin(angle) * 70, scale: 0 }}
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
          Every demo respects "reduce motion" in your OS settings.
        </p>
      </motion.div>
    </div>
    </MotionConfig>
  );
}
