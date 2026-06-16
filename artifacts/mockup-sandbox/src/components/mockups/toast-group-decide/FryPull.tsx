import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Lock, Crown, Soup, Utensils, Flame, RotateCcw, Hand } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";
const FRY = "#F2B340";
const FRY_DEEP = "#D9942A";

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

type Phase = "ready" | "pulling" | "done";

// length 0..1 scaled; returns cm-ish label
function rollLengths(): Record<string, number> {
  const out: Record<string, number> = {};
  let vals: number[];
  do {
    vals = PLAYERS.map(() => 0.32 + Math.random() * 0.68);
  } while (hasTie(vals));
  PLAYERS.forEach((p, i) => (out[p.id] = vals[i]));
  return out;
}

function hasTie(vals: number[]) {
  const rounded = vals.map((v) => Math.round(v * 100) / 100);
  return new Set(rounded).size !== rounded.length;
}

export default function FryPull() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [lengths, setLengths] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const grab = () => {
    clearTimers();
    const rolled = rollLengths();
    setLengths(rolled);
    setRevealed({});
    setWinner(null);
    setLocked(false);
    setPhase("pulling");

    // You pull first, then opponents stagger in.
    const order = ["you", "mint", "boss"];
    order.forEach((id, i) => {
      const t = setTimeout(() => {
        setRevealed((prev) => ({ ...prev, [id]: true }));
      }, 380 + i * 620);
      timers.current.push(t);
    });

    // After all revealed, crown the longest fry.
    const decide = setTimeout(() => {
      let bestId = order[0];
      order.forEach((id) => {
        if (rolled[id] > rolled[bestId]) bestId = id;
      });
      setWinner(bestId);
      const finish = setTimeout(() => setPhase("done"), 900);
      timers.current.push(finish);
    }, 380 + order.length * 620 + 350);
    timers.current.push(decide);
  };

  const reset = () => {
    clearTimers();
    setPhase("ready");
    setLengths({});
    setRevealed({});
    setWinner(null);
    setLocked(false);
  };

  const winnerPlayer = winner ? PLAYERS.find((p) => p.id === winner)! : null;
  const cm = (v: number) => (5 + v * 8).toFixed(1);

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
        {phase !== "ready" ? (
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

      {phase === "done" && winnerPlayer ? (
        <WinnerView winnerPlayer={winnerPlayer} cm={cm(lengths[winnerPlayer.id] || 0)} />
      ) : (
        <main className="flex-1 px-6 pb-36 pt-2 flex flex-col">
          <div className="text-center mb-5">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "rgba(26,26,26,0.04)" }}
            >
              <Crown className="w-3.5 h-3.5" style={{ color: INK }} />
              <span className="text-[12px] font-bold uppercase tracking-wider">Longest Fry Wins</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold tracking-tight leading-tight">
              {phase === "ready" ? "One box, one fry each" : "Pulling fries…"}
            </h1>
            <p className="text-[14px] mt-2 leading-relaxed max-w-[300px] mx-auto" style={{ color: MUTE }}>
              {phase === "ready"
                ? "Everyone grabs a single fry from the same box. The longest fry decides the table's pick."
                : "Laying them side by side — longest one takes it."}
            </p>
          </div>

          {phase === "ready" ? (
            <FriesBox />
          ) : (
            <div className="space-y-3.5 mt-1">
              {PLAYERS.map((p) => (
                <FryRow
                  key={p.id}
                  player={p}
                  value={lengths[p.id] || 0}
                  shown={!!revealed[p.id]}
                  isWinner={winner === p.id}
                  cm={cm(lengths[p.id] || 0)}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Sticky footer CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        {phase === "ready" && (
          <button
            data-testid="button-grab"
            onClick={grab}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 pointer-events-auto active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            <Hand className="w-[18px] h-[18px]" /> Grab a fry
          </button>
        )}

        {phase === "pulling" && (
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

function FriesBox() {
  const heights = [86, 120, 70, 138, 96, 112, 78, 128, 92];
  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-6">
      <div className="relative" style={{ width: 220, height: 220 }}>
        {/* fries poking out */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-end gap-[5px]" style={{ bottom: 96 }}>
          {heights.map((h, i) => (
            <div
              key={i}
              style={{
                width: 13,
                height: h,
                borderRadius: 6,
                background: `linear-gradient(180deg, #F8C766 0%, ${FRY} 45%, ${FRY_DEEP} 100%)`,
                boxShadow: "inset -2px 0 3px rgba(150,90,15,0.25)",
              }}
            />
          ))}
        </div>

        {/* carton */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: 200, height: 120 }}>
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "26px solid transparent",
              borderRight: "26px solid transparent",
              borderTop: "120px solid #E23B2E",
              filter: "drop-shadow(0 14px 22px rgba(226,59,46,0.32))",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
          {/* white band */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: 30,
              width: 168,
              height: 26,
              background: "#fff",
              transform: "perspective(120px) rotateX(6deg)",
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 font-['Plus_Jakarta_Sans'] font-extrabold tracking-tight"
            style={{ bottom: 34, color: "#E23B2E", fontSize: 14 }}
          >
            TOAST
          </div>
        </div>
      </div>
      <p className="text-[13px] font-semibold mt-2" style={{ color: MUTE }}>
        You · Mint · Boss are all reaching in
      </p>
    </div>
  );
}

function FryRow({
  player,
  value,
  shown,
  isWinner,
  cm,
}: {
  player: Player;
  value: number;
  shown: boolean;
  isWinner: boolean;
  cm: string;
}) {
  const isYou = player.id === "you";
  return (
    <div
      data-testid={`fry-row-${player.id}`}
      className="rounded-[20px] bg-white p-3.5 transition-all duration-500"
      style={{
        border: isWinner ? `2px solid ${GOLD}` : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isWinner
          ? "0 14px 30px -14px rgba(255,204,2,0.5)"
          : "0 8px 22px -16px rgba(0,0,0,0.18)",
        transform: isWinner ? "scale(1.015)" : "scale(1)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold"
            style={{ backgroundColor: isYou || isWinner ? GOLD : "#F3F1EC", color: INK }}
          >
            {player.initial}
          </span>
          <span className="text-[13px] font-bold" style={{ color: INK }}>
            {player.name}
          </span>
          {isWinner && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold"
              style={{ backgroundColor: GOLD, color: INK }}
            >
              <Crown className="w-3 h-3" /> LONGEST
            </span>
          )}
        </div>
        <span
          className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold tabular-nums"
          style={{ color: shown ? "#C97A12" : MUTE, opacity: shown ? 1 : 0.4 }}
        >
          {shown ? `${cm} cm` : "—"}
        </span>
      </div>

      {/* the fry */}
      <div className="h-[18px] w-full rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
        <div
          className="h-full rounded-full relative"
          style={{
            width: shown ? `${value * 100}%` : "0%",
            background: `linear-gradient(180deg, #F8C766 0%, ${FRY} 50%, ${FRY_DEEP} 100%)`,
            boxShadow: "inset 0 -3px 4px rgba(150,90,15,0.3)",
            transition: "width 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* salt flecks */}
          {shown && (
            <div className="absolute inset-0 flex items-center justify-around px-2 opacity-70">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="w-[2px] h-[2px] rounded-full" style={{ background: "rgba(255,255,255,0.85)" }} />
              ))}
            </div>
          )}
        </div>
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
