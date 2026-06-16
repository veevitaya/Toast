import React, { useEffect, useRef, useState } from "react";
import "./_group.css";
import { Star, MapPin, Navigation, RotateCcw } from "lucide-react";

type Stage = "pick" | "throw" | "reveal" | "winner";
type Move = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "tie";

const DISHES = [
  {
    name: "Khao Soi",
    sub: "Northern Curry Noodles",
    emoji: "🍜",
    bg: "bg-orange-100",
    restaurant: {
      name: "Hom Duan",
      cuisine: "Authentic Northern Thai cuisine.",
      rating: "4.8",
      area: "Ekkamai",
      dist: "1.2 km",
      price: "฿฿",
      img: "/__mockup/images/Winner-khaosoi.png",
    },
  },
  {
    name: "Green Curry",
    sub: "Spicy & Sweet",
    emoji: "🍛",
    bg: "bg-red-100",
    restaurant: {
      name: "Krua Apsorn",
      cuisine: "Beloved home-style Thai kitchen.",
      rating: "4.7",
      area: "Phra Nakhon",
      dist: "2.4 km",
      price: "฿฿",
      img: "/__mockup/images/Winner-greencurry.png",
    },
  },
  {
    name: "Som Tam",
    sub: "Papaya Salad",
    emoji: "🥗",
    bg: "bg-green-100",
    restaurant: {
      name: "Som Tam Nua",
      cuisine: "Fiery, fresh Isaan favourites.",
      rating: "4.6",
      area: "Siam",
      dist: "0.8 km",
      price: "฿",
      img: "/__mockup/images/Winner-somtam.png",
    },
  },
];

const MINT_DISH = 1; // Mint's secret champion = Green Curry

const MOVES: Move[] = ["rock", "paper", "scissors"];
const HAND: Record<Move, string> = { rock: "✊", paper: "✋", scissors: "✌️" };
const BEATS: Record<Move, Move> = { rock: "scissors", paper: "rock", scissors: "paper" };
const VERB: Record<Move, string> = { rock: "smashes", paper: "covers", scissors: "cuts" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function decide(me: Move, mint: Move): Result {
  if (me === mint) return "tie";
  return BEATS[me] === mint ? "win" : "lose";
}

export function PlayDuel() {
  const [stage, setStage] = useState<Stage>("pick");
  const [myDish, setMyDish] = useState<number | null>(0);
  const [count, setCount] = useState(3); // 3,2,1 then 0 => SHOOT
  const [canThrow, setCanThrow] = useState(false);
  const [myThrow, setMyThrow] = useState<Move | null>(null);
  const [mintThrow, setMintThrow] = useState<Move | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending reveal timeout on unmount
  useEffect(() => () => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
  }, []);

  // Countdown whenever we (re)enter the throw stage
  useEffect(() => {
    if (stage !== "throw") return;
    setCount(3);
    setCanThrow(false);
    setMyThrow(null);
    setMintThrow(null);
    setResult(null);
    const timers = [
      setTimeout(() => setCount(2), 650),
      setTimeout(() => setCount(1), 1300),
      setTimeout(() => {
        setCount(0);
        setCanThrow(true);
      }, 1950),
    ];
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  const handleThrow = (move: Move) => {
    if (!canThrow || myThrow) return;
    setMyThrow(move);
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => {
      const mint = MOVES[Math.floor(Math.random() * 3)];
      const r = decide(move, mint);
      setMintThrow(mint);
      setResult(r);
      setStage("reveal");
    }, 1000);
  };

  const reset = () => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    setStage("pick");
    setMyThrow(null);
    setMintThrow(null);
    setResult(null);
  };

  const winningDishIndex = result === "lose" ? MINT_DISH : (myDish ?? 0);
  const dish = DISHES[winningDishIndex];

  return (
    <div
      className="w-[390px] min-h-[844px] flex flex-col relative overflow-hidden toast-rps-bg mx-auto"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
      data-testid="rps-duel-root"
    >
      {/* ============ STAGE: SECRET PICK ============ */}
      {stage === "pick" && (
        <>
          <div className="pt-14 pb-4 px-6 flex justify-between items-center animate-slide-up">
            <div className="flex -space-x-3">
              <div className="toast-avatar z-10">😎</div>
              <div className="toast-avatar z-0">👩🏻</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-bold tracking-widest text-[#FFCC02] uppercase">Duel Time</span>
              <span className="toast-ink font-bold text-lg leading-tight">You vs Mint</span>
            </div>
          </div>

          <div className="px-6 pt-6 pb-10 flex-1 flex flex-col z-10 animate-slide-up animate-delay-100">
            <div className="mb-7">
              <h1 className="text-3xl font-extrabold toast-ink mb-3 leading-tight">
                It's a tie! <br />
                Pick your champion.
              </h1>
              <p className="toast-muted text-[15px] leading-relaxed">
                You and Mint both swiped right on these. Secretly pick the one you want most. Winner of RPS gets their choice!
              </p>
            </div>

            <div className="space-y-4 flex-1">
              {DISHES.map((d, i) => {
                const selected = myDish === i;
                return (
                  <button
                    key={d.name}
                    onClick={() => setMyDish(i)}
                    data-testid={`button-dish-${i}`}
                    className={`w-full text-left toast-card p-5 relative overflow-hidden flex items-center justify-between transition-all active:scale-[0.98] ${
                      selected ? "border-2 border-[#FFCC02]" : "border-2 border-transparent opacity-70"
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-0 right-0 bg-[#FFCC02] text-[#0F172A] text-[11px] font-bold px-3 py-1 rounded-bl-xl z-10">
                        YOUR PICK
                      </div>
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-14 h-14 rounded-full ${d.bg} flex items-center justify-center text-3xl`}>{d.emoji}</div>
                      <div>
                        <h3 className="toast-ink font-bold text-lg">{d.name}</h3>
                        <p className="toast-muted text-sm">{d.sub}</p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selected ? "border-[#FFCC02] bg-[#FFCC02]" : "border-gray-200"
                      }`}
                    >
                      {selected && <div className="w-2.5 h-2.5 bg-[#0F172A] rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-5 bg-white/60 px-4 py-2 rounded-full border border-[rgba(16,24,40,.04)]">
                <div className="w-2 h-2 rounded-full bg-[#FFCC02] animate-pulse" />
                <span className="text-sm font-medium toast-muted">Mint is picking...</span>
              </div>
              <button
                onClick={() => myDish !== null && setStage("throw")}
                disabled={myDish === null}
                data-testid="button-lock-in"
                className="w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100"
              >
                Lock it in
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============ STAGE: THROW ============ */}
      {stage === "throw" && (
        <>
          <div className="pt-14 pb-4 px-6 flex justify-between items-center z-10">
            <div className="flex -space-x-3">
              <div className="toast-avatar z-10 border-2 border-[#FFCC02]">😎</div>
              <div className="toast-avatar z-0 border-2 border-white">👩🏻</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-bold tracking-widest text-red-500 uppercase animate-pulse">Live</span>
              <span className="toast-ink font-bold text-lg leading-tight">Duel in progress</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
            {/* Opponent */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm mb-4 border border-[rgba(16,24,40,.06)] animate-float">
                👩🏻
              </div>
              <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-[rgba(16,24,40,.06)] shadow-sm flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${myThrow ? "bg-[#FFCC02]" : "bg-green-500"} animate-pulse`} />
                <span className="toast-ink font-bold text-sm">{myThrow ? "Mint is choosing..." : "Mint is ready"}</span>
              </div>
            </div>

            {/* Countdown / status */}
            <div className="my-6 text-center h-[88px] flex flex-col items-center justify-center">
              {!myThrow ? (
                <>
                  <div className="text-[13px] font-bold text-[#FFCC02] tracking-[0.3em] uppercase mb-1">Shoot on 3</div>
                  <div key={count} className="text-6xl font-black toast-ink animate-scale-pop">
                    {count > 0 ? count : "SHOOT!"}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[13px] font-bold text-[#FFCC02] tracking-[0.3em] uppercase mb-1">You threw</div>
                  <div key={myThrow} className="text-6xl animate-scale-pop">{HAND[myThrow]}</div>
                </>
              )}
            </div>

            {/* Move buttons */}
            <div className="w-full mt-6">
              <div className="grid grid-cols-3 gap-3">
                {MOVES.map((m) => {
                  const chosen = myThrow === m;
                  const dim = (myThrow && !chosen) || (!canThrow && !myThrow);
                  return (
                    <button
                      key={m}
                      onClick={() => handleThrow(m)}
                      disabled={!canThrow || !!myThrow}
                      data-testid={`button-move-${m}`}
                      className={`toast-card aspect-square flex flex-col items-center justify-center gap-2 transition-all ${
                        chosen
                          ? "border-2 border-[#FFCC02] bg-[#FFCC02]/10 shadow-[0_8px_30px_-6px_rgba(255,204,2,0.4)] scale-105"
                          : "active:scale-95"
                      } ${dim ? "opacity-50" : ""}`}
                    >
                      <span className="text-4xl">{HAND[m]}</span>
                      <span className={`font-bold text-[13px] ${chosen ? "toast-ink" : "text-slate-400"}`}>{m.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-7 text-center text-sm font-medium toast-muted h-5">
                {myThrow ? `You locked in ${cap(myThrow)}. Waiting...` : canThrow ? "Tap your move!" : "Get ready..."}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============ STAGE: REVEAL ============ */}
      {stage === "reveal" && myThrow && mintThrow && result && (
        <>
          <div className="absolute inset-0 bg-[#FFCC02]/10 animate-pulse" />
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] flex items-center justify-center">
              {/* Mint */}
              <div className="absolute top-0 right-10 flex flex-col items-center animate-clash-right">
                <span className={`text-[120px] filter drop-shadow-xl transform -rotate-12 ${result === "win" ? "opacity-50 grayscale" : ""}`}>
                  {HAND[mintThrow]}
                </span>
                <div className="mt-2 bg-white px-4 py-1.5 rounded-full shadow-sm font-bold text-sm text-slate-500">Mint</div>
              </div>
              {/* You */}
              <div className="absolute bottom-0 left-10 flex flex-col items-center animate-clash-left">
                <div className="mb-2 bg-[#FFCC02] px-4 py-1.5 rounded-full shadow-sm font-bold text-sm text-[#0F172A]">You</div>
                <span className={`text-[140px] filter drop-shadow-[0_10px_40px_rgba(255,204,2,0.4)] transform rotate-12 ${result === "lose" ? "opacity-50 grayscale" : ""}`}>
                  {HAND[myThrow]}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-32 h-32 bg-white/40 rounded-full blur-2xl animate-scale-pop" />
              </div>
            </div>

            <div className="absolute bottom-16 left-0 w-full text-center px-6 animate-slide-up animate-delay-300">
              <div
                className={`inline-block font-black text-4xl px-8 py-4 rounded-3xl shadow-2xl transform -rotate-2 ${
                  result === "win" ? "bg-[#0F172A] text-white" : result === "lose" ? "bg-white toast-ink" : "bg-[#FFCC02] text-[#0F172A]"
                }`}
              >
                {result === "win" ? "YOU WIN!" : result === "lose" ? "MINT WINS!" : "TIE!"}
              </div>
              <p className="mt-4 text-lg font-bold text-slate-600">
                {result === "tie"
                  ? "Same move — throw again!"
                  : `${cap(result === "win" ? myThrow : mintThrow)} ${VERB[result === "win" ? myThrow : mintThrow]} ${cap(
                      result === "win" ? mintThrow : myThrow
                    )}`}
              </p>

              <button
                onClick={() => setStage(result === "tie" ? "throw" : "winner")}
                data-testid="button-reveal-continue"
                className="mt-7 w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all"
              >
                {result === "tie" ? "Throw again" : "See what's for dinner →"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============ STAGE: WINNER ============ */}
      {stage === "winner" && (
        <>
          <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#FFCC02]/30 to-transparent pointer-events-none" />
          <div className="pt-14 pb-4 px-6 flex justify-between items-center z-10 relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl">{result === "lose" ? "👩🏻" : "😎"}</span>
            </div>
            <span className="text-[13px] font-bold tracking-widest text-[#FFCC02] uppercase">Winner's Choice</span>
            <div className="w-10 h-10" />
          </div>

          <div className="px-6 flex-1 flex flex-col z-10 relative pb-10 mt-4 animate-slide-up">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-extrabold toast-ink mb-2">{dish.name}!</h1>
              <p className="text-slate-500 font-medium text-[16px]">
                {result === "lose" ? "Mint's champion takes the crown." : "Your champion takes the crown."}
              </p>
            </div>

            <div className="toast-card overflow-hidden flex-1 max-h-[440px] flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
              <div className="relative h-[220px] w-full bg-slate-100">
                <img src={dish.restaurant.img} alt={`${dish.name} at ${dish.restaurant.name}`} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="text-base">{dish.emoji}</span>
                  <span className="font-bold text-xs toast-ink tracking-wide">DINNER SORTED</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold toast-ink">{dish.restaurant.name}</h2>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-sm">{dish.restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-4">{dish.restaurant.cuisine}</p>
                <div className="flex gap-4 mt-auto">
                  <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {dish.restaurant.area} ({dish.restaurant.dist})
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                    <span className="text-slate-400 font-bold">{dish.restaurant.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                data-testid="button-lets-go"
                className="w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Let's Go
              </button>
              <button
                onClick={reset}
                data-testid="button-rematch"
                className="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-2xl font-bold text-[17px] shadow-sm transform active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5 text-slate-400" />
                Rematch
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
