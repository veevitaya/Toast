import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Lock, Crown, Soup, Utensils, Flame, RotateCcw, Hand } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";
const FRY = "#F2B340";
const FRY_DEEP = "#D9942A";
const MC_RED = "#DA291C";
const MC_YELLOW = "#FFC72C";

type Dish = {
  id: string;
  name: string;
  cuisine: string;
  price: string;
  Icon: React.ElementType;
  tint: string;
};

type Player = {
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
  lean: number; // px tilt for a natural look
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

  return Array.from({ length: FRY_COUNT }, (_, i) => ({
    id: `f${i}`,
    poke: 0.3 + Math.random() * 0.7,
    trueLen: trueLens[i],
    lean: Math.round((Math.random() - 0.5) * 10),
  }));
}

type Phase = "choosing" | "revealing" | "done";

export default function FryPull() {
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

    // You take the tapped fry; opponents grab from what's left.
    const remaining = fries.filter((f) => f.id !== fryId).map((f) => f.id);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    const nextAssign: Record<string, string> = {
      you: fryId,
      mint: remaining[0],
      boss: remaining[1],
    };
    setAssign(nextAssign);
    setRevealed({});
    setWinner(null);
    setLocked(false);
    setPhase("revealing");

    // Staggered "pull" of each fry to its true length.
    const order = ["you", "mint", "boss"];
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

  const winnerPlayer = winner ? PLAYERS.find((p) => p.id === winner)! : null;
  const winnerFry = winner ? fryById(assign[winner]) : undefined;

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter'] select-none overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <header className="flex items-center justify-between px-6 pt-14 pb-2 z-10">
        <button
          data-testid="button-back"
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
        <WinnerView winnerPlayer={winnerPlayer} cm={cm(winnerFry.trueLen)} />
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
            <FriesCarton fries={fries} onPick={pickFry} />
          ) : (
            <RevealLane
              fries={fries}
              assign={assign}
              revealed={revealed}
              winner={winner}
              cm={cm}
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

function FriesCarton({ fries, onPick }: { fries: Fry[]; onPick: (id: string) => void }) {
  const BOX_W = 236;
  const BOX_H = 156;
  const RIM = 156; // px from container bottom where the carton mouth sits
  const INSIDE = 46; // how far fry bottoms sit below the rim (masked by carton)

  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-4">
      <div className="relative" style={{ width: 304, height: 336 }}>
        {/* Fries (clickable) poking out of the carton */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-end justify-center gap-[1px] z-10"
          style={{ bottom: RIM - INSIDE, width: BOX_W - 26 }}
        >
          {fries.map((f) => {
            const total = INSIDE + 36 + f.poke * 104; // bottom (hidden) + visible poke
            return (
              <button
                key={f.id}
                data-testid={`fry-choice-${f.id}`}
                onClick={() => onPick(f.id)}
                aria-label="Pull this fry"
                className="group relative outline-none"
                style={{ width: 8, height: total, transformOrigin: "bottom center", transform: `rotate(${f.lean}deg)` }}
              >
                <span
                  className="absolute inset-0 block transition-transform duration-200 group-hover:-translate-y-2 group-active:-translate-y-1"
                  style={{
                    borderRadius: 9,
                    background: `linear-gradient(180deg, #FAD27A 0%, ${FRY} 42%, ${FRY_DEEP} 100%)`,
                    boxShadow: "inset -2px 0 3px rgba(150,90,15,0.28), inset 2px 0 4px rgba(255,240,200,0.5)",
                  }}
                >
                  {/* highlight + crisp top */}
                  <span
                    className="absolute left-[3px] top-2 bottom-3 w-[3px] rounded-full"
                    style={{ background: "rgba(255,247,224,0.6)" }}
                  />
                  <span
                    className="absolute inset-x-0 top-0 h-[6px]"
                    style={{ borderRadius: "9px 9px 3px 3px", background: "#FBDD96" }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* McDonald's carton (drawn above fry bottoms to mask them) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20" style={{ width: BOX_W, height: BOX_H }}>
          {/* back lip of the carton mouth */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: -9,
              width: BOX_W - 6,
              height: 18,
              borderRadius: 4,
              background: "#B81910",
              clipPath: "polygon(2% 0, 98% 0, 94% 100%, 6% 100%)",
            }}
          />
          {/* body */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
              background: `linear-gradient(180deg, #E2231A 0%, ${MC_RED} 55%, #B81910 100%)`,
              boxShadow: "0 18px 30px -14px rgba(176,25,15,0.55)",
            }}
          >
            {/* soft side shading */}
            <div
              className="absolute inset-y-0 right-0 w-1/3"
              style={{ background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.16))" }}
            />
            <div
              className="absolute inset-y-0 left-0 w-1/4"
              style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0))" }}
            />
            {/* Toast "T" mark */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "33%", width: 78 }}>
              <ToastMark />
            </div>
          </div>
        </div>
      </div>
      <p className="text-[13px] font-semibold mt-3 text-center" style={{ color: MUTE }}>
        {fries.length} fries in the box · You pick one, Mint &amp; Boss grab the rest
      </p>
    </div>
  );
}

function ToastMark() {
  return (
    <svg viewBox="0 0 100 96" className="w-full h-auto" style={{ filter: "drop-shadow(0 2px 1px rgba(120,10,5,0.35))" }}>
      <g fill={MC_YELLOW}>
        <rect x="8" y="8" width="84" height="25" rx="10" />
        <rect x="37.5" y="27" width="25" height="61" rx="10" />
      </g>
    </svg>
  );
}

function RevealLane({
  fries,
  assign,
  revealed,
  winner,
  cm,
}: {
  fries: Fry[];
  assign: Record<string, string>;
  revealed: Record<string, boolean>;
  winner: string | null;
  cm: (v: number) => string;
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

      <div className="grid grid-cols-3 gap-2 items-start">
        {PLAYERS.map((p) => {
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
                  style={{ backgroundColor: isWin ? GOLD : p.id === "you" ? GOLD : "#F0EDE6", color: INK }}
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
                  style={{
                    width: 20,
                    height: isShown ? hang : 0,
                    transformOrigin: "top center",
                    transition: "height 0.7s cubic-bezier(0.22,1,0.36,1)",
                    borderRadius: 10,
                    background: isWin
                      ? `linear-gradient(180deg, #FFE08A 0%, ${GOLD} 45%, #E0A800 100%)`
                      : `linear-gradient(180deg, #FAD27A 0%, ${FRY} 45%, ${FRY_DEEP} 100%)`,
                    boxShadow: isWin
                      ? "0 10px 22px -8px rgba(255,204,2,0.6), inset -2px 0 3px rgba(150,90,15,0.25)"
                      : "inset -2px 0 3px rgba(150,90,15,0.28), inset 2px 0 4px rgba(255,240,200,0.5)",
                  }}
                  className="relative"
                >
                  <span className="absolute left-[4px] top-2 bottom-3 w-[3px] rounded-full" style={{ background: "rgba(255,247,224,0.55)" }} />
                  {/* salt flecks */}
                  {isShown &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute w-[2px] h-[2px] rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.85)",
                          left: i % 2 ? "7px" : "11px",
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

function WinnerView({ winnerPlayer, cm }: { winnerPlayer: Player; cm: string }) {
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
        A {cm} cm monster fry. {isYou ? "Your" : `${winnerPlayer.name}'s`} craving locks in the group pick.
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
              {winnerPlayer.name}'s craving wins
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
