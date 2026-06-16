import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Lock, Zap, Soup, Utensils, Flame, RotateCcw } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

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

type Phase = "ready" | "count" | "racing" | "done";

export default function ToasterPop() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(3);
  const [progress, setProgress] = useState<Record<string, number>>({ you: 0, mint: 0, boss: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [tapKick, setTapKick] = useState(0);

  const wonRef = useRef(false);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDoneTimer = () => {
    if (doneTimerRef.current) {
      clearTimeout(doneTimerRef.current);
      doneTimerRef.current = null;
    }
  };

  // Pure updater — only advance progress here.
  const applyBump = (id: string, amt: number) => {
    if (wonRef.current) return;
    setProgress((prev) => {
      if (wonRef.current) return prev;
      const next = Math.min((prev[id] || 0) + amt, 100);
      return { ...prev, [id]: next };
    });
  };

  // Win detection lives outside the updater so it stays pure and the
  // winner-delay timer is tracked (and cleared on reset/unmount).
  useEffect(() => {
    if (phase !== "racing" || wonRef.current) return;
    const popped = PLAYERS.find((p) => (progress[p.id] || 0) >= 100);
    if (popped) {
      wonRef.current = true;
      setWinner(popped.id);
      doneTimerRef.current = setTimeout(() => setPhase("done"), 650);
    }
  }, [progress, phase]);

  useEffect(() => () => clearDoneTimer(), []);

  // Countdown 3 → 2 → 1 → GO
  useEffect(() => {
    if (phase !== "count") return;
    if (count <= 0) {
      setPhase("racing");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 750);
    return () => clearTimeout(t);
  }, [phase, count]);

  // Opponents auto-tap during the race
  useEffect(() => {
    if (phase !== "racing") return;
    const iv = setInterval(() => {
      PLAYERS.filter((p) => p.auto).forEach((p) => {
        applyBump(p.id, 2 + Math.random() * 3.4);
      });
    }, 150);
    return () => clearInterval(iv);
  }, [phase]);

  const startRace = () => {
    clearDoneTimer();
    wonRef.current = false;
    setProgress({ you: 0, mint: 0, boss: 0 });
    setWinner(null);
    setLocked(false);
    setCount(3);
    setPhase("count");
  };

  const reset = () => {
    clearDoneTimer();
    wonRef.current = false;
    setProgress({ you: 0, mint: 0, boss: 0 });
    setWinner(null);
    setLocked(false);
    setCount(3);
    setPhase("ready");
  };

  const onTapYou = () => {
    if (phase !== "racing" || wonRef.current) return;
    setTapKick((k) => k + 1);
    applyBump("you", 6.5 + Math.random() * 2.5);
  };

  const winnerPlayer = winner ? PLAYERS.find((p) => p.id === winner)! : null;

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
          Toaster Pop
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
        <WinnerView winnerPlayer={winnerPlayer} />
      ) : (
        <main className="flex-1 px-6 pb-36 pt-2 flex flex-col">
          <div className="text-center mb-5">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "rgba(26,26,26,0.04)" }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: INK }} />
              <span className="text-[12px] font-bold uppercase tracking-wider">Fastest Taps Win</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold tracking-tight leading-tight">
              {phase === "ready" ? "Pop your toast first" : phase === "count" ? "Get ready…" : "TAP, TAP, TAP!"}
            </h1>
            <p className="text-[14px] mt-2 leading-relaxed max-w-[300px] mx-auto" style={{ color: MUTE }}>
              {phase === "ready"
                ? "Everyone gets a toaster. Hammer yours — first slice to pop wins the table's pick."
                : phase === "count"
                ? "Hands on your toaster…"
                : "Smash your toaster as fast as you can!"}
            </p>
          </div>

          {/* Toaster race row */}
          <div className="grid grid-cols-3 gap-3 items-end mt-1">
            {PLAYERS.map((p) => (
              <Toaster
                key={p.id}
                player={p}
                value={progress[p.id] || 0}
                isYou={p.id === "you"}
                popped={winner === p.id}
                tapKick={p.id === "you" ? tapKick : 0}
                racing={phase === "racing"}
                onTap={p.id === "you" ? onTapYou : undefined}
              />
            ))}
          </div>

          {/* Countdown overlay number */}
          {phase === "count" && (
            <div className="mt-8 flex items-center justify-center">
              <div
                key={count}
                className="w-24 h-24 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-[44px] animate-in zoom-in fade-in duration-300"
                style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 12px 28px -10px rgba(255,204,2,0.6)" }}
              >
                {count === 0 ? "GO" : count}
              </div>
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
            data-testid="button-start"
            onClick={startRace}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 pointer-events-auto active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            <Zap className="w-[18px] h-[18px]" /> Start the toast-off
          </button>
        )}

        {(phase === "count" || phase === "racing") && (
          <div
            className="w-full h-14 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 pointer-events-none"
            style={{ backgroundColor: "#E3DED3", color: MUTE }}
          >
            {phase === "count" ? "Wait for GO…" : "Keep tapping your toaster!"}
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

function Toaster({
  player,
  value,
  isYou,
  popped,
  tapKick,
  racing,
  onTap,
}: {
  player: Player;
  value: number;
  isYou: boolean;
  popped: boolean;
  tapKick: number;
  racing: boolean;
  onTap?: () => void;
}) {
  const BODY_H = 132;
  // Toast rises from low in the slot to popping above the toaster lip.
  const toastBottom = 40 + (value / 100) * (BODY_H + 8);
  const heat = Math.min(value / 100, 1);

  return (
    <div className="flex flex-col items-center">
      <div
        data-testid={`toaster-${player.id}`}
        role={onTap ? "button" : undefined}
        tabIndex={onTap ? 0 : undefined}
        aria-label={onTap ? "Tap to pop your toast" : `${player.name}'s toaster`}
        onPointerDown={onTap}
        onKeyDown={(e) => {
          if (onTap && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onTap();
          }
        }}
        className={`relative w-full outline-none ${onTap ? "cursor-pointer touch-none" : ""}`}
        style={{ height: BODY_H + 96 }}
      >
        {/* Toast slice */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{
            bottom: toastBottom,
            width: 50,
            height: 56,
            transition: popped
              ? "bottom 0.5s cubic-bezier(0.34,1.56,0.64,1)"
              : "bottom 0.12s ease-out",
          }}
        >
          <div
            className="w-full h-full relative"
            style={{
              borderRadius: "25px 25px 7px 7px",
              background: "linear-gradient(180deg, #F0B65C 0%, #E39B3A 55%, #CE8126 100%)",
              boxShadow: "inset 0 -6px 10px rgba(120,70,10,0.28), 0 6px 12px -6px rgba(120,70,10,0.4)",
            }}
          >
            <div
              className="absolute inset-[5px]"
              style={{
                borderRadius: "20px 20px 5px 5px",
                background: "linear-gradient(180deg, rgba(255,240,205,0.55), rgba(255,220,150,0.12))",
              }}
            />
            {/* little butter pat */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2"
              style={{ width: 16, height: 12, borderRadius: 4, background: "rgba(255,250,225,0.85)" }}
            />
          </div>
        </div>

        {/* Toaster body */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: BODY_H,
            transform: tapKick ? "translateY(2px)" : "translateY(0)",
            transition: "transform 0.08s ease-out",
          }}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              borderRadius: 18,
              background: isYou
                ? "linear-gradient(180deg, #FFFFFF 0%, #F4EFE6 100%)"
                : "linear-gradient(180deg, #FBF8F2 0%, #EFEAE0 100%)",
              border: isYou ? `2px solid ${GOLD}` : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isYou
                ? "0 14px 26px -14px rgba(255,204,2,0.55)"
                : "0 10px 22px -14px rgba(0,0,0,0.18)",
            }}
          >
            {/* heat glow rising from base */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${heat * 100}%`,
                background: "linear-gradient(180deg, rgba(255,204,2,0.0), rgba(255,150,2,0.32))",
                transition: "height 0.12s ease-out",
              }}
            />
            {/* slot */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: 12,
                width: "62%",
                height: 9,
                borderRadius: 6,
                background: "rgba(26,26,26,0.82)",
                boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5)",
              }}
            />
            {/* lever knob */}
            <div
              className="absolute"
              style={{
                right: 8,
                top: 26,
                width: 8,
                height: 22,
                borderRadius: 5,
                background: "rgba(0,0,0,0.12)",
              }}
            />
            {/* progress label */}
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span
                className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold"
                style={{ color: value > 0 ? "#C97A12" : MUTE, opacity: value > 0 ? 1 : 0.5 }}
              >
                {Math.floor(value)}%
              </span>
            </div>

            {isYou && racing && value < 100 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
                <span
                  className="px-2.5 py-1 rounded-full font-['Plus_Jakarta_Sans'] text-[11px] font-extrabold animate-pulse"
                  style={{ backgroundColor: INK, color: "#fff" }}
                >
                  TAP!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* name + avatar */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold"
          style={{ backgroundColor: isYou ? GOLD : "#F3F1EC", color: INK }}
        >
          {player.initial}
        </span>
        <span className="text-[13px] font-bold" style={{ color: INK }}>
          {player.name}
        </span>
      </div>
    </div>
  );
}

function WinnerView({ winnerPlayer }: { winnerPlayer: Player }) {
  const dish = winnerPlayer.dish;
  const isYou = winnerPlayer.id === "you";
  return (
    <main className="flex-1 px-6 pt-4 pb-36 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
        style={{ backgroundColor: GOLD, color: INK }}
      >
        <Zap className="w-10 h-10" strokeWidth={2.5} />
      </div>

      <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold tracking-tight leading-tight">
        Pop! {isYou ? "You" : winnerPlayer.name} win
      </h1>
      <p className="text-[15px] mt-3 leading-relaxed mb-8 max-w-[300px]" style={{ color: "rgba(26,26,26,0.6)" }}>
        Fastest toaster at the table. {isYou ? "Your" : `${winnerPlayer.name}'s`} craving locks in the group pick.
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
