import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Check, Lock, Crown, Soup, Utensils, Flame, RotateCcw, Hand } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

// Coral fry-carton palette (matches the classic takeaway box look)
const BOX_HI = "#F4633C";
const BOX_MID = "#E8472C";
const BOX_LO = "#C5391F";
const BOX_BACK = "#B7331C";

// hex → rgb lerp for per-fry colour variety
function mix(a: string, b: string, t: number) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
// deterministic pseudo-random in [0,1) — keeps each fry's shape/texture stable across renders
function rnd(seed: number, n: number) {
  const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
// rectangular cut-potato stick — straight vertical sides, flat squared ends, only faint edge irregularity
function fryClip(seed: number) {
  const v = (n: number, base: number, amt: number) =>
    Math.max(0, Math.min(100, base + (rnd(seed, n) - 0.5) * amt)).toFixed(1);
  return (
    `polygon(${v(1, 6, 5)}% 0%, ${v(2, 94, 5)}% 0%, ` +
    `${v(3, 97, 3)}% 33%, ${v(4, 96, 3)}% 67%, ${v(5, 95, 4)}% 100%, ` +
    `${v(6, 5, 4)}% 100%, ${v(7, 4, 3)}% 67%, ${v(8, 3, 3)}% 33%)`
  );
}

// A single fry rendered as a glossy golden potato stick: bright yellow body, soft tip, sheen + mottled texture.
function FryBody({
  tone,
  seed,
  className = "",
  win = false,
}: {
  tone: number;
  seed: number;
  className?: string;
  win?: boolean;
}) {
  // Bright, vivid golden-yellow (matches a fresh-fried fry — not heavily browned)
  const top = win ? "#FFE9A0" : mix("#FCE583", "#F4CB35", tone);
  const mid = win ? "#FFCC02" : mix("#F8D03F", "#EFBC23", tone);
  const bot = win ? "#EAB100" : mix("#EEBE2E", "#D49E1A", tone);
  const tip = win ? "#C98A12" : mix("#D7A235", "#B27D1C", tone);
  const speckles = [0, 1, 2, 3, 4].map((k) => ({
    x: 14 + rnd(seed, 20 + k) * 68,
    y: 12 + rnd(seed, 33 + k) * 72,
    s: 1 + rnd(seed, 45 + k) * 2,
    light: rnd(seed, 60 + k) > 0.5,
  }));
  return (
    <span
      className={"absolute inset-0 block " + className}
      style={{
        clipPath: fryClip(seed),
        background:
          // soft warm golden edges (subtle — not heavily browned) over the bright body gradient
          `linear-gradient(90deg, rgba(196,146,42,0.30) 0%, rgba(196,146,42,0) 26%, rgba(196,146,42,0) 74%, rgba(196,146,42,0.30) 100%),` +
          `linear-gradient(180deg, ${top} 0%, ${mid} 45%, ${bot} 100%)`,
      }}
    >
      {/* soft browned tip (cut end) */}
      <span className="absolute inset-x-0 top-0" style={{ height: "10%", background: tip, opacity: 0.5 }} />
      {/* glossy oil sheen — soft band + bright hairline */}
      <span
        className="absolute"
        style={{
          left: "24%",
          top: "8%",
          bottom: "14%",
          width: "26%",
          borderRadius: 4,
          background: "linear-gradient(90deg, rgba(255,250,222,0) 0%, rgba(255,250,222,0.5) 50%, rgba(255,250,222,0) 100%)",
        }}
      />
      <span
        className="absolute"
        style={{ left: "32%", top: "10%", bottom: "16%", width: 1.5, borderRadius: 2, background: "rgba(255,255,245,0.7)" }}
      />
      {/* mottled texture: light highlights + subtle darker flecks */}
      {speckles.map((sp, k) => (
        <span
          key={k}
          className="absolute rounded-full"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            width: sp.s,
            height: sp.s,
            background: sp.light ? "rgba(255,247,205,0.55)" : "rgba(150,102,28,0.30)",
          }}
        />
      ))}
    </span>
  );
}

export type Dish = {
  id: string;
  name: string;
  cuisine: string;
  price: string;
  Icon: React.ElementType;
  tint: string;
};

export type Player = {
  id: string;
  name: string;
  initial: string;
  auto: boolean;
  dish: Dish;
};

const PLAYERS: Player[] = [
  {
    id: "you",
    name: "You",
    initial: "Y",
    auto: false,
    dish: { id: "padthai", name: "Pad Thai", cuisine: "Thai", price: "฿120", Icon: Utensils, tint: "#FFF3CC" },
  },
  {
    id: "mint",
    name: "Mint",
    initial: "M",
    auto: true,
    dish: { id: "ramen", name: "Tonkotsu Ramen", cuisine: "Japanese", price: "฿260", Icon: Soup, tint: "#E8F1FB" },
  },
  {
    id: "boss",
    name: "Boss",
    initial: "B",
    auto: true,
    dish: { id: "kbbq", name: "Korean BBQ", cuisine: "Korean", price: "฿450", Icon: Flame, tint: "#FCEFD6" },
  },
];

const FRY_COUNT = 22;

type Fry = {
  id: string;
  poke: number; // 0..1 — how far it sticks out of the box (cosmetic only)
  trueLen: number; // 0..1 — actual hidden length, revealed when pulled
  lean: number; // deg tilt for a natural fanned look
  w: number; // px width — varied for realism
  tone: number; // 0..1 browning — varied golden colour
  seed: number; // stable per-fry seed for shape + texture
};

// cm shown to the user for a given true length (single source of truth).
const lenToCm = (v: number) => 7 + v * 9;

// Build fries whose visible height is independent of true length, with
// all DISPLAYED cm labels distinct so any pick produces a clear, unambiguous winner.
function makeFries(): Fry[] {
  let trueLens: number[];
  do {
    trueLens = Array.from({ length: FRY_COUNT }, () => 0.28 + Math.random() * 0.72);
  } while (new Set(trueLens.map((v) => Math.round(lenToCm(v) * 10))).size !== FRY_COUNT);

  const center = (FRY_COUNT - 1) / 2;
  return Array.from({ length: FRY_COUNT }, (_, i) => ({
    id: `f${i}`,
    poke: 0.18 + Math.random() * 0.82,
    trueLen: trueLens[i],
    // outer fries splay outward (bouquet fan), with a touch of jitter
    lean: Math.round(((i - center) / center) * 15 + (Math.random() - 0.5) * 7),
    w: 11 + Math.round(Math.random() * 3), // 11..14px — chunky rectangular sticks
    tone: Math.random(), // pale → deep golden
    seed: Math.floor(Math.random() * 100000),
  }));
}

type Phase = "choosing" | "revealing" | "done";

export type FryPullProps = {
  players?: Player[];
  mode?: "dish" | "restaurant";
  onBack?: () => void;
};

export default function FryPull({
  players = PLAYERS,
  mode = "dish",
  onBack,
}: FryPullProps = {}) {
  const noun = mode === "dish" ? "dish" : "spot";
  const [phase, setPhase] = useState<Phase>("choosing");
  const [fries, setFries] = useState<Fry[]>(() => makeFries());
  const [assign, setAssign] = useState<Record<string, string>>({}); // playerId -> fryId
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const fryById = (id: string) => fries.find((f) => f.id === id);
  const cm = (v: number) => lenToCm(v).toFixed(1);

  const pickFry = (fryId: string) => {
    if (phase !== "choosing") return;
    clearTimers();

    // You take the tapped fry; the rest grab from what's left.
    const human = players.find((p) => !p.auto) ?? players[0];
    const others = players.filter((p) => p.id !== human.id);
    const remaining = fries.filter((f) => f.id !== fryId).map((f) => f.id);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    const nextAssign: Record<string, string> = { [human.id]: fryId };
    others.forEach((p, idx) => {
      nextAssign[p.id] = remaining[idx];
    });
    setAssign(nextAssign);
    setRevealed({});
    setWinner(null);
    setLocked(false);
    setPhase("revealing");

    // Staggered "pull" of each fry to its true length.
    const order = [human.id, ...others.map((p) => p.id)];
    order.forEach((pid, i) => {
      timers.current.push(
        setTimeout(() => setRevealed((prev) => ({ ...prev, [pid]: true })), 280 + i * 700),
      );
    });

    // Crown the longest, hold the beat, then show the pick.
    const afterReveal = 280 + order.length * 700;
    timers.current.push(
      setTimeout(() => {
        let best = order[0];
        order.forEach((pid) => {
          if ((fryById(nextAssign[pid])?.trueLen ?? 0) > (fryById(nextAssign[best])?.trueLen ?? 0)) best = pid;
        });
        setWinner(best);
      }, afterReveal),
    );
    timers.current.push(setTimeout(() => setPhase("done"), afterReveal + 1050));
  };

  const reset = () => {
    clearTimers();
    setFries(makeFries());
    setAssign({});
    setRevealed({});
    setWinner(null);
    setLocked(false);
    setPhase("choosing");
  };

  const winnerPlayer = winner ? players.find((p) => p.id === winner)! : null;
  const winnerFry = winner ? fryById(assign[winner]) : undefined;

  const humanPlayer = players.find((p) => !p.auto) ?? players[0];
  const otherNames = players.filter((p) => p.id !== humanPlayer.id).map((p) => p.name);
  const othersText =
    otherNames.length <= 1
      ? otherNames[0] ?? ""
      : `${otherNames.slice(0, -1).join(", ")} & ${otherNames[otherNames.length - 1]}`;
  const cartonCaption = `${fries.length} fries in the box · ${humanPlayer.name} pick${
    humanPlayer.name === "You" ? "" : "s"
  } one${othersText ? `, ${othersText} grab${otherNames.length === 1 ? "s" : ""} the rest` : ""}`;

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter'] select-none overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <header className="flex items-center justify-between px-6 pt-14 pb-2 z-10">
        <button
          data-testid="button-back"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
          Longest Fry
        </span>
        {phase !== "choosing" ? (
          <button
            data-testid="button-reset"
            onClick={reset}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
          >
            <RotateCcw className="w-[18px] h-[18px]" style={{ color: MUTE }} />
          </button>
        ) : (
          <span className="w-10 h-10" />
        )}
      </header>

      {phase === "done" && winnerPlayer && winnerFry ? (
        <WinnerView winnerPlayer={winnerPlayer} cm={cm(winnerFry.trueLen)} noun={noun} />
      ) : (
        <main className="flex-1 px-6 pb-36 pt-2 flex flex-col">
          <div className="text-center mb-4">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "rgba(26,26,26,0.04)" }}
            >
              <Crown className="w-3.5 h-3.5" style={{ color: INK }} />
              <span className="text-[12px] font-bold uppercase tracking-wider">Longest Fry Wins</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold tracking-tight leading-tight">
              {phase === "choosing" ? "Pick your fry" : "Pulling fries…"}
            </h1>
            <p className="text-[14px] mt-2 leading-relaxed max-w-[300px] mx-auto" style={{ color: MUTE }}>
              {phase === "choosing"
                ? "Tap any fry to pull it. The one poking out highest isn't always the longest — it's a gamble."
                : "Held at the top, longest one hangs lowest and takes it."}
            </p>
          </div>

          {phase === "choosing" ? (
            <FriesCarton fries={fries} onPick={pickFry} caption={cartonCaption} />
          ) : (
            <RevealLane
              fries={fries}
              assign={assign}
              revealed={revealed}
              winner={winner}
              cm={cm}
              players={players}
            />
          )}
        </main>
      )}

      {/* Sticky footer */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        {phase === "choosing" && (
          <div
            className="w-full h-14 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 pointer-events-none"
            style={{ backgroundColor: "#fff", color: INK, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 20px -12px rgba(0,0,0,0.2)" }}
          >
            <Hand className="w-[18px] h-[18px]" /> Tap a fry to pull it
          </div>
        )}

        {phase === "revealing" && (
          <div
            className="w-full h-14 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 pointer-events-none"
            style={{ backgroundColor: "#E3DED3", color: MUTE }}
          >
            Measuring fries…
          </div>
        )}

        {phase === "done" && (
          <button
            data-testid="button-cta"
            disabled={locked}
            onClick={() => setLocked(true)}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 pointer-events-auto active:scale-[0.98] transition-transform"
            style={{
              backgroundColor: locked ? LINE : GOLD,
              color: locked ? "#fff" : INK,
              boxShadow: locked ? "0 8px 20px -8px rgba(6,199,85,0.55)" : "0 8px 20px -8px rgba(255,204,2,0.55)",
            }}
          >
            {locked ? (
              <>
                <Check className="w-[18px] h-[18px]" /> Locked in — see you there
              </>
            ) : (
              <>
                <Lock className="w-[18px] h-[18px]" /> Lock it in
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function FriesCarton({ fries, onPick, caption }: { fries: Fry[]; onPick: (id: string) => void; caption: string }) {
  const BOX_W = 236;
  const RIM = 156; // px from container bottom where the carton mouth sits
  const INSIDE = 46; // how far fry bottoms sit below the rim (masked by carton)

  // Decorative back layer — purely cosmetic, fills gaps so the box reads as a packed pile.
  const filler = useMemo(() => {
    const N = 18;
    const c = (N - 1) / 2;
    return Array.from({ length: N }, (_, i) => ({
      id: `bf${i}`,
      poke: 0.08 + Math.random() * 0.62,
      lean: Math.round(((i - c) / c) * 17 + (Math.random() - 0.5) * 9),
      w: 11 + Math.round(Math.random() * 3),
      tone: 0.25 + Math.random() * 0.55,
      seed: Math.floor(Math.random() * 100000),
    }));
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-4">
      <div className="relative" style={{ width: 304, height: 336 }}>
        {/* dark interior cavity visible behind the fries — sells the "inside the box" depth */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-0"
          style={{
            bottom: 126,
            width: BOX_W - 26,
            height: 74,
            borderRadius: "46% 46% 0 0 / 42px 42px 0 0",
            background: `linear-gradient(180deg, #5E1E11 0%, #87291A 58%, ${BOX_LO} 100%)`,
          }}
        />

        {/* Decorative back fries (non-interactive) — adds density behind the pickable ones */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-end justify-center z-[5] pointer-events-none"
          style={{ bottom: RIM - INSIDE, width: BOX_W - 6, filter: "brightness(0.84) saturate(0.95)" }}
        >
          {filler.map((f, i) => {
            const total = INSIDE + 22 + f.poke * 110;
            return (
              <div
                key={f.id}
                className="relative"
                style={{
                  width: f.w,
                  height: total,
                  marginLeft: i === 0 ? 0 : -3,
                  transformOrigin: "bottom center",
                  transform: `rotate(${f.lean}deg)`,
                }}
              >
                <FryBody tone={f.tone} seed={f.seed} />
              </div>
            );
          })}
        </div>

        {/* Fries (clickable) fanning out of the carton */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-end justify-center z-10"
          style={{ bottom: RIM - INSIDE, width: BOX_W - 18 }}
        >
          {fries.map((f, i) => {
            const total = INSIDE + 30 + f.poke * 120; // bottom (hidden) + visible poke
            return (
              <button
                key={f.id}
                data-testid={`fry-choice-${f.id}`}
                onClick={() => onPick(f.id)}
                aria-label="Pull this fry"
                className="group relative outline-none"
                style={{
                  width: f.w,
                  height: total,
                  marginLeft: i === 0 ? 0 : -4,
                  transformOrigin: "bottom center",
                  transform: `rotate(${f.lean}deg)`,
                  zIndex: i % 2 === 0 ? 11 : 10,
                }}
              >
                <FryBody
                  tone={f.tone}
                  seed={f.seed}
                  className="transition-transform duration-200 group-hover:-translate-y-2.5 group-active:-translate-y-1"
                />
              </button>
            );
          })}
        </div>

        {/* Shadow where the fries dip down into the opening (above fries, below carton front) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[15] pointer-events-none"
          style={{
            bottom: 128,
            width: BOX_W - 30,
            height: 58,
            background:
              "linear-gradient(to top, rgba(74,20,11,0.55) 0%, rgba(74,20,11,0.30) 32%, rgba(74,20,11,0) 74%)",
            borderRadius: "0 0 16px 16px",
          }}
        />

        {/* Coral fry carton (drawn above fry bottoms to mask them) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{ bottom: 0, width: BOX_W, height: 174 }}
        >
          <svg
            viewBox="0 0 236 174"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 16px 24px rgba(160,40,20,0.40))", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="fpBoxBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BOX_HI} />
                <stop offset="52%" stopColor={BOX_MID} />
                <stop offset="100%" stopColor={BOX_LO} />
              </linearGradient>
              <clipPath id="fpBoxClip">
                <path d="M40 172 L16 22 Q16 14 26 14 C74 44 162 44 210 14 Q220 14 220 22 L196 172 Q118 180 40 172 Z" />
              </clipPath>
            </defs>
            {/* front face */}
            <path
              d="M40 172 L16 22 Q16 14 26 14 C74 44 162 44 210 14 Q220 14 220 22 L196 172 Q118 180 40 172 Z"
              fill="url(#fpBoxBody)"
            />
            {/* top lip edge highlight — gives the opening a raised 3D rim instead of a flat cutout */}
            <path
              d="M16 22 Q16 14 26 14 C74 44 162 44 210 14 Q220 14 220 22"
              fill="none"
              stroke="rgba(255,206,180,0.6)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <g clipPath="url(#fpBoxClip)">
              {/* left highlight */}
              <rect x="0" y="0" width="62" height="174" fill="rgba(255,255,255,0.10)" />
              {/* right shadow for roundness */}
              <rect x="176" y="0" width="60" height="174" fill="rgba(0,0,0,0.16)" />
              {/* soft center fold sheen */}
              <rect x="112" y="0" width="12" height="174" fill="rgba(255,255,255,0.05)" />
              {/* inner shadow where fries meet the box */}
              <path
                d="M16 16 C74 46 162 46 220 16 L220 42 C162 72 74 72 16 42 Z"
                fill="rgba(120,30,15,0.30)"
              />
            </g>
          </svg>
        </div>
      </div>
      <p className="text-[13px] font-semibold mt-3 text-center" style={{ color: MUTE }}>
        {caption}
      </p>
    </div>
  );
}

function RevealLane({
  fries,
  assign,
  revealed,
  winner,
  cm,
  players,
}: {
  fries: Fry[];
  assign: Record<string, string>;
  revealed: Record<string, boolean>;
  winner: string | null;
  cm: (v: number) => string;
  players: Player[];
}) {
  const fryById = (id: string) => fries.find((f) => f.id === id);
  return (
    <div className="flex-1 flex flex-col">
      {/* the "grip" — fries held pinched at the top */}
      <div className="relative mx-1 mb-1">
        <div
          className="h-2.5 rounded-full"
          style={{ background: "linear-gradient(180deg, #2A2A2A, #111)", boxShadow: "0 3px 8px rgba(0,0,0,0.25)" }}
        />
      </div>

      <div
        className="grid gap-2 items-start"
        style={{ gridTemplateColumns: `repeat(${players.length}, minmax(0,1fr))` }}
      >
        {players.map((p) => {
          const fry = fryById(assign[p.id]);
          const isShown = !!revealed[p.id];
          const isWin = winner === p.id;
          const hang = fry ? 96 + fry.trueLen * 188 : 0;
          return (
            <div key={p.id} data-testid={`fry-reveal-${p.id}`} className="flex flex-col items-center">
              {/* owner */}
              <div className="flex flex-col items-center gap-1 mb-2 h-[52px] justify-start">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold relative"
                  style={{ backgroundColor: isWin ? GOLD : !p.auto ? GOLD : "#F0EDE6", color: INK }}
                >
                  {p.initial}
                  {isWin && (
                    <Crown
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4"
                      style={{ color: GOLD, fill: GOLD }}
                    />
                  )}
                </span>
                <span className="text-[12px] font-bold" style={{ color: INK }}>
                  {p.name}
                </span>
              </div>

              {/* hanging fry */}
              <div className="relative flex justify-center" style={{ height: 300 }}>
                <div
                  className="relative"
                  style={{
                    width: 22,
                    height: isShown ? hang : 0,
                    transformOrigin: "top center",
                    transition: "height 0.7s cubic-bezier(0.22,1,0.36,1)",
                    filter: isWin
                      ? "drop-shadow(0 10px 18px rgba(255,204,2,0.55))"
                      : "drop-shadow(0 6px 12px rgba(120,70,10,0.28))",
                  }}
                >
                  {fry && <FryBody tone={fry.tone} seed={fry.seed} win={isWin} />}
                  {/* salt flecks (sit above the fry body) */}
                  {isShown &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute w-[2px] h-[2px] rounded-full z-10"
                        style={{
                          background: "rgba(255,255,255,0.85)",
                          left: i % 2 ? "8px" : "12px",
                          top: `${22 + i * 22}%`,
                        }}
                      />
                    ))}
                </div>
              </div>

              {/* length */}
              <span
                className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold tabular-nums mt-1 transition-opacity duration-300"
                style={{ color: isWin ? "#C97A12" : isShown ? INK : MUTE, opacity: isShown ? 1 : 0.35 }}
              >
                {isShown && fry ? `${cm(fry.trueLen)} cm` : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WinnerView({ winnerPlayer, cm, noun }: { winnerPlayer: Player; cm: string; noun: string }) {
  const dish = winnerPlayer.dish;
  const isYou = winnerPlayer.id === "you";
  return (
    <main className="flex-1 px-6 pt-4 pb-36 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
        style={{ backgroundColor: GOLD, color: INK }}
      >
        <Crown className="w-10 h-10" strokeWidth={2.25} />
      </div>

      <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold tracking-tight leading-tight">
        {isYou ? "You" : winnerPlayer.name} got the longest
      </h1>
      <p className="text-[15px] mt-3 leading-relaxed mb-8 max-w-[300px]" style={{ color: "rgba(26,26,26,0.6)" }}>
        A {cm} cm monster fry. {isYou ? "Your" : `${winnerPlayer.name}'s`} {noun} locks in for the group.
      </p>

      <div
        className="w-full rounded-[28px] bg-white overflow-hidden text-left"
        style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
        data-testid={`winner-dish-${dish.id}`}
      >
        <div className="relative h-[170px] flex items-center justify-center" style={{ backgroundColor: dish.tint }}>
          <dish.Icon className="w-20 h-20" strokeWidth={1.25} style={{ color: INK, opacity: 0.55 }} />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/85 text-[12px] font-bold backdrop-blur">
            {dish.cuisine}
          </span>
          <span
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-[12px] font-bold"
            style={{ backgroundColor: INK, color: "#fff" }}
          >
            {dish.price}
          </span>
        </div>
        <div className="p-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight">{dish.name}</h2>
          <div className="flex items-center gap-2.5 mt-4">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold"
              style={{ backgroundColor: GOLD, color: INK }}
            >
              {winnerPlayer.initial}
            </span>
            <span className="text-[14px] font-medium" style={{ color: MUTE }}>
              {winnerPlayer.name}'s pick wins
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
