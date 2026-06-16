import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Lock, Zap, Soup, Utensils, Flame, RotateCcw, Crown } from "lucide-react";

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

  const maxVal = Math.max(progress.you || 0, progress.mint || 0, progress.boss || 0);
  const leaderId =
    phase === "racing" && maxVal > 5 ? PLAYERS.find((p) => (progress[p.id] || 0) === maxVal)?.id ?? null : null;

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter'] select-none overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <style>{`
        @keyframes tp-float {0%{opacity:0;transform:translateY(0) scale(.7)}25%{opacity:1}100%{opacity:0;transform:translateY(-52px) scale(1.15)}}
        @keyframes tp-ring {0%{opacity:.65;transform:scale(.3)}100%{opacity:0;transform:scale(1.7)}}
        @keyframes tp-spark {0%{opacity:0;transform:translateY(-16px) scale(.4)}30%{opacity:1}100%{opacity:0;transform:translateY(-48px) scale(1)}}
        @keyframes tp-bob {0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-3px)}}
        @keyframes tp-steam {0%{opacity:0;transform:translateY(0) scaleY(.6)}40%{opacity:.45}100%{opacity:0;transform:translateY(-20px) scaleY(1.2)}}
        @keyframes tp-coil {0%,100%{opacity:.55}50%{opacity:1}}
        @keyframes tp-pulse-ring {0%{opacity:.5;transform:scale(.85)}70%{opacity:0;transform:scale(1.25)}100%{opacity:0}}
      `}</style>
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
          <div className="relative mt-1">
            <div className="grid grid-cols-3 gap-3 items-end">
              {PLAYERS.map((p) => (
                <Toaster
                  key={p.id}
                  player={p}
                  value={progress[p.id] || 0}
                  isYou={p.id === "you"}
                  popped={winner === p.id}
                  tapKick={p.id === "you" ? tapKick : 0}
                  racing={phase === "racing"}
                  idle={phase === "ready"}
                  isLeader={leaderId === p.id}
                  onTap={p.id === "you" ? onTapYou : undefined}
                />
              ))}
            </div>

            {/* Countdown overlay */}
            {phase === "count" && (
              <div className="absolute inset-0 -m-2 flex items-center justify-center z-30">
                <div className="absolute inset-0 rounded-[28px]" style={{ background: "rgba(250,246,239,0.55)" }} />
                <div
                  key={count}
                  className="relative w-28 h-28 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-[46px] animate-in zoom-in fade-in duration-300"
                  style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 16px 36px -12px rgba(255,204,2,0.65)" }}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ border: `3px solid ${GOLD}`, animation: "tp-pulse-ring 0.75s ease-out infinite" }}
                  />
                  {count === 0 ? "GO" : count}
                </div>
              </div>
            )}
          </div>
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
  idle,
  isLeader,
  onTap,
}: {
  player: Player;
  value: number;
  isYou: boolean;
  popped: boolean;
  tapKick: number;
  racing: boolean;
  idle: boolean;
  isLeader: boolean;
  onTap?: () => void;
}) {
  const BODY_H = 138;
  // Toast tucks low in the slot, then rises and pops above the lip.
  const toastBottom = 28 + (value / 100) * 152;
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
        className={`relative w-full outline-none ${onTap ? "cursor-pointer touch-none active:scale-[0.99] transition-transform" : ""}`}
        style={{ height: BODY_H + 104 }}
      >
        {/* steam wisps at high heat */}
        {racing && heat > 0.5 && !popped && (
          <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ bottom: BODY_H - 4 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute bottom-0"
                style={{
                  left: (i - 1) * 9,
                  width: 4,
                  height: 18,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.7)",
                  filter: "blur(2px)",
                  animation: `tp-steam 1.1s ease-out ${i * 0.25}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* win sparkle burst */}
        {popped && (
          <div
            className="absolute left-1/2 -translate-x-1/2 z-30"
            style={{ bottom: 150, width: 70, height: 70 }}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{ border: `3px solid ${GOLD}`, animation: "tp-ring 0.6s ease-out forwards" }}
            />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="absolute top-1/2 left-1/2" style={{ transform: `rotate(${i * 60}deg)` }}>
                <span
                  className="block"
                  style={{ width: 6, height: 6, marginLeft: -3, borderRadius: 9, background: GOLD, animation: "tp-spark 0.6s ease-out forwards" }}
                />
              </span>
            ))}
          </div>
        )}

        {/* Toast slice */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{
            bottom: toastBottom,
            width: 52,
            height: 58,
            transition: popped ? "bottom 0.55s cubic-bezier(0.34,1.56,0.64,1)" : "bottom 0.12s ease-out",
            animation: idle ? "tp-bob 2.6s ease-in-out infinite" : undefined,
          }}
        >
          <div
            className="w-full h-full relative"
            style={{
              borderRadius: "26px 26px 8px 8px",
              background: "linear-gradient(180deg, #F2BE6A 0%, #E5A648 55%, #D08C2C 100%)",
              boxShadow: "inset 0 -6px 10px rgba(120,70,10,0.3), 0 8px 14px -6px rgba(120,70,10,0.45)",
            }}
          >
            <div
              className="absolute inset-[5px]"
              style={{
                borderRadius: "22px 22px 6px 6px",
                background: "linear-gradient(180deg, rgba(255,240,205,0.6), rgba(255,220,150,0.12))",
              }}
            />
            {/* browning deepens with heat */}
            <div
              className="absolute inset-0"
              style={{
                borderRadius: "26px 26px 8px 8px",
                background: "linear-gradient(180deg, rgba(110,55,10,0), rgba(85,42,8,0.5))",
                opacity: heat,
                transition: "opacity 0.15s ease-out",
              }}
            />
            {/* butter pat */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2"
              style={{
                width: 17,
                height: 13,
                borderRadius: 4,
                background: "rgba(255,250,228,0.9)",
                boxShadow: "0 1px 2px rgba(120,80,20,0.3)",
              }}
            />
          </div>
        </div>

        {/* Toaster body */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: BODY_H,
            transform: tapKick ? "translateY(3px) scaleY(0.985)" : "translateY(0)",
            transformOrigin: "bottom center",
            transition: "transform 0.09s ease-out",
          }}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              borderRadius: 20,
              background: isYou
                ? "linear-gradient(145deg, #FFFEFA 0%, #FBEFC6 40%, #F3DF9F 72%, #FFF7DB 100%)"
                : "linear-gradient(145deg, #FDFCFA 0%, #ECE6DB 40%, #D9D2C5 72%, #F3EFE7 100%)",
              border: isYou ? `2px solid ${GOLD}` : "1px solid rgba(0,0,0,0.07)",
              boxShadow: isYou
                ? "0 16px 28px -14px rgba(255,204,2,0.6), inset 0 2px 4px rgba(255,255,255,0.7)"
                : "0 12px 24px -14px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.7)",
            }}
          >
            {/* reflective highlight band */}
            <div
              className="absolute inset-y-0 -skew-x-12"
              style={{
                left: "20%",
                width: "16%",
                background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))",
              }}
            />
            {/* heat glow rising from base */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${heat * 100}%`,
                background: "linear-gradient(180deg, rgba(255,170,2,0), rgba(255,120,2,0.34))",
                transition: "height 0.12s ease-out",
              }}
            />
            {/* slot */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: 13,
                width: "60%",
                height: 10,
                borderRadius: 6,
                background: "linear-gradient(180deg, #000, #2a2a2a)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.7)",
              }}
            />
            {/* glowing coils under the slot */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: 16,
                width: "52%",
                height: 6,
                borderRadius: 6,
                background: "radial-gradient(ellipse at center, rgba(255,90,0,0.95), rgba(255,120,0,0))",
                filter: "blur(2px)",
                opacity: heat,
                animation: racing && heat > 0 ? "tp-coil 0.5s ease-in-out infinite" : undefined,
              }}
            />
            {/* lever */}
            <div
              className="absolute"
              style={{
                right: 7,
                top: 24,
                width: 9,
                height: 30,
                borderRadius: 6,
                background: "linear-gradient(180deg, #d3cec3, #a8a294)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6)",
                transform: tapKick ? "translateY(7px)" : "translateY(0)",
                transition: "transform 0.09s ease-out",
              }}
            >
              <span
                className="absolute -top-1 left-1/2 -translate-x-1/2"
                style={{ width: 13, height: 7, borderRadius: 4, background: isYou ? GOLD : "#bfb9ad" }}
              />
            </div>
            {/* progress label */}
            <div className="absolute bottom-2.5 left-0 right-0 text-center">
              <span
                className="font-['Plus_Jakarta_Sans'] text-[14px] font-extrabold"
                style={{ color: value > 0 ? "#C97A12" : MUTE, opacity: value > 0 ? 1 : 0.5 }}
              >
                {Math.floor(value)}%
              </span>
            </div>

            {isYou && racing && value < 100 && (
              <div className="absolute inset-x-0 top-[44%] flex justify-center pointer-events-none">
                <span
                  className="px-2.5 py-1 rounded-full font-['Plus_Jakarta_Sans'] text-[11px] font-extrabold animate-pulse"
                  style={{ backgroundColor: INK, color: "#fff" }}
                >
                  TAP!
                </span>
              </div>
            )}
          </div>

          {/* feet */}
          <div
            className="absolute -bottom-1 left-3"
            style={{ width: 12, height: 6, borderRadius: "0 0 6px 6px", background: "rgba(0,0,0,0.18)" }}
          />
          <div
            className="absolute -bottom-1 right-3"
            style={{ width: 12, height: 6, borderRadius: "0 0 6px 6px", background: "rgba(0,0,0,0.18)" }}
          />
        </div>

        {/* per-tap flame floater */}
        {isYou && tapKick > 0 && (
          <span
            key={tapKick}
            className="absolute left-1/2 z-40 flex items-center justify-center pointer-events-none"
            style={{ top: 6, width: 28, height: 28, marginLeft: -14, animation: "tp-float 0.6s ease-out forwards" }}
          >
            <Flame className="w-6 h-6" style={{ color: GOLD, fill: GOLD }} />
          </span>
        )}
      </div>

      {/* name + avatar + leader crown */}
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
        {isLeader && <Crown className="w-4 h-4" style={{ color: GOLD, fill: GOLD }} />}
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
