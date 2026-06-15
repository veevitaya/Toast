import { useState, useEffect } from "react";
import { ArrowLeft, Hand, Scissors, Grab, Check, Crown, Lock, RotateCcw, Soup, Pizza, Flame, Utensils, EyeOff, Eye } from "lucide-react";

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

const DISHES: Dish[] = [
  { id: "padthai", name: "Pad Thai", cuisine: "Thai", price: "฿120", Icon: Utensils, tint: "#FFF3CC" },
  { id: "ramen", name: "Tonkotsu Ramen", cuisine: "Japanese", price: "฿260", Icon: Soup, tint: "#E8F1FB" },
  { id: "pizza", name: "Margherita Pizza", cuisine: "Italian", price: "฿320", Icon: Pizza, tint: "#FBEAE6" },
  { id: "kbbq", name: "Korean BBQ", cuisine: "Korean", price: "฿450", Icon: Flame, tint: "#FCEFD6" },
];

type Throw = "rock" | "paper" | "scissors";

const THROWS: Record<Throw, { label: string; Icon: React.ElementType }> = {
  rock: { label: "Rock", Icon: Grab },
  paper: { label: "Paper", Icon: Hand },
  scissors: { label: "Scissors", Icon: Scissors },
};
const THROW_KEYS: Throw[] = ["rock", "paper", "scissors"];
const COUNT_WORDS = ["Rock", "Paper", "Scissors", "Shoot!"];
const WIN_TARGET = 2; // best of three

// pick → both secretly choose a spot · choose/countdown/round → settle with RPS · result → reveal
type Phase = "intro" | "pick" | "choose" | "countdown" | "round" | "result";
type Outcome = "you" | "mint" | "tie";

function judge(mine: Throw, opp: Throw): Outcome {
  if (mine === opp) return "tie";
  const beats: Record<Throw, Throw> = { rock: "scissors", paper: "rock", scissors: "paper" };
  return beats[mine] === opp ? "you" : "mint";
}

export default function ToastShowdown() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [myThrow, setMyThrow] = useState<Throw | null>(null);
  const [oppThrow, setOppThrow] = useState<Throw | null>(null);
  const [roundWinner, setRoundWinner] = useState<Outcome | null>(null);
  const [matchWinner, setMatchWinner] = useState<"you" | "mint" | null>(null);
  // Secret picks — locked in before the showdown, hidden from the other player until the end
  const [myPick, setMyPick] = useState<Dish | null>(null);
  const [oppPick, setOppPick] = useState<Dish | null>(null);
  const [locked, setLocked] = useState(false);
  const [countIdx, setCountIdx] = useState(0);

  const roundNo = myScore + oppScore + 1;
  const winnerPick = matchWinner === "you" ? myPick : oppPick;
  const loserPick = matchWinner === "you" ? oppPick : myPick;

  // Countdown animation -> reveal the round
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountIdx(0);
    let i = 0;
    let reveal: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      i++;
      setCountIdx(i);
      if (i >= COUNT_WORDS.length - 1) {
        clearInterval(interval);
        reveal = setTimeout(() => setPhase("round"), 450);
      }
    }, 460);
    return () => {
      clearInterval(interval);
      clearTimeout(reveal);
    };
  }, [phase]);

  // Lock in your secret pick → Mint secretly locks a different spot → on to the showdown
  const lockPicks = () => {
    if (!myPick) return;
    const others = DISHES.filter((d) => d.id !== myPick.id);
    const mintPick = others[Math.floor(Math.random() * others.length)];
    setOppPick(mintPick);
    setPhase("choose");
  };

  const handleThrow = (choice: Throw) => {
    const opp = THROW_KEYS[Math.floor(Math.random() * 3)];
    const result = judge(choice, opp);
    const nextMy = myScore + (result === "you" ? 1 : 0);
    const nextOpp = oppScore + (result === "mint" ? 1 : 0);
    setMyThrow(choice);
    setOppThrow(opp);
    setRoundWinner(result);
    setMyScore(nextMy);
    setOppScore(nextOpp);
    if (nextMy >= WIN_TARGET) setMatchWinner("you");
    else if (nextOpp >= WIN_TARGET) setMatchWinner("mint");
    setPhase("countdown");
  };

  const nextThrow = () => {
    setMyThrow(null);
    setOppThrow(null);
    setRoundWinner(null);
    setPhase("choose");
  };

  const resetAll = () => {
    setPhase("intro");
    setMyScore(0);
    setOppScore(0);
    setMyThrow(null);
    setOppThrow(null);
    setRoundWinner(null);
    setMatchWinner(null);
    setMyPick(null);
    setOppPick(null);
    setLocked(false);
  };

  const showScoreboard = phase === "choose" || phase === "round" || phase === "result";

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <header className="px-6 pt-14 pb-2 z-10 relative">
        <div className="flex items-center justify-between">
          <button
            aria-label="Go back"
            data-testid="button-back"
            onClick={resetAll}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
            Tie-Breaker
          </span>
        </div>
      </header>

      {/* Scoreboard — only once picks are locked and the match is on */}
      {showScoreboard && (
        <div className="px-6 pt-3">
          <div className="bg-white rounded-[18px] border border-black/[0.05] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.12)] px-5 py-3 flex items-center justify-between">
            <Player initial="Y" name="You" score={myScore} highlight={roundWinner === "you"} />
            <div className="flex flex-col items-center px-2">
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
                {matchWinner ? "Final" : `Round ${roundNo}`}
              </span>
              <span className="text-[11px] font-semibold mt-0.5" style={{ color: MUTE }}>
                Best of 3
              </span>
            </div>
            <Player initial="M" name="Mint" score={oppScore} highlight={roundWinner === "mint"} alignRight />
          </div>

          {/* Secrecy reminder — picks stay hidden until the showdown is done */}
          {(phase === "choose" || phase === "round") && (
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <EyeOff className="w-3.5 h-3.5" style={{ color: MUTE }} />
              <span className="text-[11px] font-semibold" style={{ color: MUTE }}>
                Both picks locked & hidden until the winner's crowned
              </span>
            </div>
          )}
        </div>
      )}

      <main className="flex-1 px-6 pb-36 pt-4 flex flex-col">
        {/* INTRO */}
        {phase === "intro" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "rgba(26,26,26,0.04)" }}>
                <EyeOff className="w-3.5 h-3.5" style={{ color: INK }} />
                <span className="text-[12px] font-bold uppercase tracking-wider">Pick in secret</span>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">
                Lock a pick, then settle it
              </h1>
              <p className="text-[15px] mt-2 leading-relaxed px-2" style={{ color: "rgba(26,26,26,0.6)" }}>
                You and Mint each secretly pick a spot. Neither sees the other's choice — then rock, paper, scissors, best of 3. The winner's secret pick wins.
              </p>
            </div>

            {/* The three throws preview */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {THROW_KEYS.map((k) => {
                const T = THROWS[k];
                return (
                  <div key={k} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-black/[0.05] shadow-[0_8px_18px_-12px_rgba(0,0,0,0.18)]">
                      <T.Icon className="w-7 h-7" strokeWidth={1.6} style={{ color: INK }} />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: MUTE }}>{T.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-[20px] border border-black/[0.04] shadow-[0_8px_20px_-14px_rgba(0,0,0,0.12)] p-4">
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: MUTE }}>Tonight's menu</span>
              <div className="flex items-center justify-between gap-2 mt-3">
                {DISHES.map((d) => (
                  <div key={d.id} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: d.tint }}>
                      <d.Icon className="w-6 h-6" strokeWidth={1.5} style={{ color: INK, opacity: 0.55 }} />
                    </div>
                    <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: MUTE }}>{d.cuisine}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto" />
          </div>
        )}

        {/* PICK — choose your spot in secret */}
        {phase === "pick" && (
          <div className="animate-in fade-in duration-400 flex-1 flex flex-col">
            <div className="text-center mb-6 mt-1">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight leading-tight">
                Pick your spot
              </h2>
              <p className="text-[14px] mt-2 px-3" style={{ color: MUTE }}>
                Mint won't see this until the showdown's done. Choose the one you're rooting for.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DISHES.map((d) => {
                const selected = myPick?.id === d.id;
                return (
                  <button
                    key={d.id}
                    data-testid={`button-pick-${d.id}`}
                    onClick={() => setMyPick(d)}
                    className="bg-white rounded-[20px] overflow-hidden text-left active:scale-[0.97] transition-all"
                    style={{
                      border: selected ? "none" : "1px solid rgba(0,0,0,0.05)",
                      boxShadow: selected
                        ? "0 0 0 2.5px #FFCC02, 0 14px 28px -16px rgba(255,204,2,0.5)"
                        : "0 10px 24px -16px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div className="relative h-[96px] flex items-center justify-center" style={{ backgroundColor: d.tint }}>
                      <d.Icon className="w-11 h-11" strokeWidth={1.4} style={{ color: INK, opacity: 0.55 }} />
                      {selected && (
                        <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center animate-in zoom-in duration-200" style={{ backgroundColor: GOLD }}>
                          <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: INK }} />
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold truncate">{d.name}</h3>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: MUTE }}>{d.cuisine} · {d.price}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <Lock className="w-3.5 h-3.5" style={{ color: MUTE }} />
              <span className="text-[11.5px] font-semibold" style={{ color: MUTE }}>Your pick stays hidden from Mint</span>
            </div>

            <div className="mt-auto" />
          </div>
        )}

        {/* CHOOSE — make your throw */}
        {phase === "choose" && (
          <div className="animate-in fade-in duration-400 flex-1 flex flex-col">
            <div className="text-center mb-8 mt-2">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight leading-tight">
                Make your throw
              </h2>
              <p className="text-[14px] mt-2" style={{ color: MUTE }}>
                Pick one — Mint throws at the same time.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-2">
              {THROW_KEYS.map((k) => {
                const T = THROWS[k];
                return (
                  <button
                    key={k}
                    data-testid={`button-throw-${k}`}
                    onClick={() => handleThrow(k)}
                    className="rounded-[22px] bg-white border border-black/[0.05] shadow-[0_12px_26px_-16px_rgba(0,0,0,0.22)] py-6 flex flex-col items-center gap-3 active:scale-[0.96] transition-transform hover:shadow-[0_14px_30px_-14px_rgba(255,204,2,0.45)]"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,204,2,0.16)" }}>
                      <T.Icon className="w-7 h-7" strokeWidth={1.7} style={{ color: INK }} />
                    </div>
                    <span className="text-[13px] font-bold">{T.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto" />
          </div>
        )}

        {/* COUNTDOWN */}
        {phase === "countdown" && (
          <div className="flex-1 flex flex-col items-center justify-center pb-16">
            <div className="flex items-center gap-5 mb-10">
              <CountHand initial="Y" />
              <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold" style={{ color: MUTE }}>vs</span>
              <CountHand initial="M" />
            </div>
            <div key={countIdx} className="animate-in zoom-in-75 fade-in duration-200">
              <span
                className="font-['Plus_Jakarta_Sans'] font-extrabold tracking-tight"
                style={{
                  fontSize: countIdx === COUNT_WORDS.length - 1 ? 44 : 34,
                  color: countIdx === COUNT_WORDS.length - 1 ? INK : "rgba(26,26,26,0.45)",
                }}
              >
                {COUNT_WORDS[countIdx]}
              </span>
            </div>
          </div>
        )}

        {/* ROUND RESULT */}
        {phase === "round" && myThrow && oppThrow && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-400">
            <div className="flex items-stretch gap-3 mt-4">
              <RevealCard initial="You" badge="Y" thrown={myThrow} win={roundWinner === "you"} />
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-[14px]" style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                  VS
                </div>
              </div>
              <RevealCard initial="Mint" badge="M" thrown={oppThrow} win={roundWinner === "mint"} />
            </div>

            <div className="text-center mt-8">
              {roundWinner === "tie" ? (
                <>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight">Tie!</h2>
                  <p className="text-[14px] mt-2" style={{ color: MUTE }}>Same throw — go again.</p>
                </>
              ) : (
                <>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight">
                    {roundWinner === "you" ? "You take the round" : "Mint takes the round"}
                  </h2>
                  <p className="text-[14px] mt-2" style={{ color: MUTE }}>
                    {THROWS[roundWinner === "you" ? myThrow : oppThrow].label} beats {THROWS[roundWinner === "you" ? oppThrow : myThrow].label}
                  </p>
                </>
              )}
            </div>

            <div className="mt-auto" />
          </div>
        )}

        {/* RESULT — the reveal: secret picks come out, winner's pick wins */}
        {phase === "result" && winnerPick && (
          <div className="animate-in zoom-in-95 fade-in duration-600 flex-1 flex flex-col pt-2">
            <div className="flex items-center gap-2 justify-center mb-5">
              <Crown className="w-5 h-5" style={{ color: GOLD }} />
              <span className="text-[13px] font-bold tracking-[0.15em] uppercase">
                {matchWinner === "you" ? "Your pick wins" : "Mint's pick wins"}
              </span>
            </div>

            <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_18px_40px_-18px_rgba(0,0,0,0.16)] border border-black/[0.05]">
              <div className="relative h-[200px] flex items-center justify-center" style={{ backgroundColor: winnerPick.tint }}>
                <winnerPick.Icon className="w-24 h-24" strokeWidth={1.25} style={{ color: INK, opacity: 0.55 }} />
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/90 text-[13px] font-bold backdrop-blur">
                  {winnerPick.cuisine}
                </span>
                <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-[13px] font-bold shadow-sm" style={{ backgroundColor: INK, color: "#fff" }}>
                  {winnerPick.price}
                </span>
              </div>
              <div className="p-6">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold tracking-tight leading-tight">{winnerPick.name}</h2>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold" style={{ backgroundColor: "rgba(255,204,2,0.2)", color: INK }}>
                    {matchWinner === "you" ? "Y" : "M"}
                  </span>
                  <p className="text-[14px] font-semibold" style={{ color: INK }}>
                    {matchWinner === "you" ? "You" : "Mint"} won {Math.max(myScore, oppScore)}–{Math.min(myScore, oppScore)} — secret pick revealed
                  </p>
                </div>
              </div>
            </div>

            {/* The other player's pick — hidden the whole match, revealed now */}
            {loserPick && (
              <div className="mt-5 bg-white rounded-[20px] border border-black/[0.05] shadow-[0_8px_20px_-16px_rgba(0,0,0,0.14)] p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: loserPick.tint }}>
                  <loserPick.Icon className="w-6 h-6" strokeWidth={1.5} style={{ color: INK, opacity: 0.55 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" style={{ color: MUTE }} />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: MUTE }}>
                      {matchWinner === "you" ? "Mint" : "Your"} secret pick was
                    </span>
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold truncate mt-0.5">{loserPick.name}</h3>
                </div>
                <span className="text-[12px] font-semibold shrink-0" style={{ color: MUTE }}>{loserPick.price}</span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ACTION AREA */}
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10 transition-all duration-500 ${phase === "countdown" ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))`, zIndex: 20 }}
      >
        {phase === "intro" && (
          <button
            data-testid="button-start"
            onClick={() => setPhase("pick")}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_8px_20px_-8px_rgba(255,204,2,0.55)]"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            <EyeOff className="w-5 h-5" /> Pick your spot
          </button>
        )}

        {phase === "pick" && (
          <button
            data-testid="button-lock-pick"
            onClick={lockPicks}
            disabled={!myPick}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 shadow-[0_8px_20px_-8px_rgba(255,204,2,0.55)]"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            <Lock className="w-[18px] h-[18px]" /> {myPick ? "Lock it in secretly" : "Choose a spot first"}
          </button>
        )}

        {phase === "round" && (
          <button
            data-testid="button-continue"
            onClick={() => {
              if (roundWinner === "tie") nextThrow();
              else if (matchWinner) setPhase("result");
              else nextThrow();
            }}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_8px_20px_-8px_rgba(255,204,2,0.55)]"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            {roundWinner === "tie" ? "Throw again" : matchWinner ? "Reveal the picks" : "Next round"}
          </button>
        )}

        {phase === "result" && (
          <div className="flex flex-col gap-3">
            <button
              data-testid="button-lock"
              onClick={() => setLocked(true)}
              disabled={locked}
              className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ backgroundColor: locked ? LINE : GOLD, color: locked ? "#fff" : INK, boxShadow: locked ? "0 8px 20px -8px rgba(6,199,85,0.55)" : "0 8px 20px -8px rgba(255,204,2,0.55)" }}
            >
              {locked ? (<><Check className="w-[18px] h-[18px]" /> Locked in — see you there</>) : (<><Lock className="w-[18px] h-[18px]" /> Lock it in</>)}
            </button>
            {!locked && (
              <button
                data-testid="button-rematch"
                onClick={resetAll}
                className="w-full h-12 rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform bg-transparent"
                style={{ color: MUTE }}
              >
                <RotateCcw className="w-4 h-4" /> Rematch
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Player({ initial, name, score, highlight, alignRight }: { initial: string; name: string; score: number; highlight?: boolean; alignRight?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${alignRight ? "flex-row-reverse" : ""}`}>
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all"
        style={{ backgroundColor: highlight ? GOLD : "#F3F1EC", color: INK }}
      >
        {initial}
      </span>
      <div className={`flex flex-col ${alignRight ? "items-end" : "items-start"}`}>
        <span className="text-[12px] font-semibold leading-none" style={{ color: MUTE }}>{name}</span>
        <div className={`flex gap-1 mt-1.5 ${alignRight ? "flex-row-reverse" : ""}`}>
          {[0, 1].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-colors"
              style={{ backgroundColor: i < score ? GOLD : "rgba(26,26,26,0.1)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CountHand({ initial }: { initial: string }) {
  return (
    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-black/[0.05] shadow-[0_8px_18px_-12px_rgba(0,0,0,0.18)] animate-bounce" style={{ animationDuration: "0.46s" }}>
      <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold" style={{ color: INK }}>{initial}</span>
    </div>
  );
}

function RevealCard({ initial, badge, thrown, win }: { initial: string; badge: string; thrown: Throw; win?: boolean }) {
  const T = THROWS[thrown];
  return (
    <div
      className="flex-1 rounded-[24px] bg-white p-4 flex flex-col items-center gap-3 transition-all"
      style={{
        border: win ? "none" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: win ? "0 0 0 3px #FFCC02, 0 18px 36px -18px rgba(255,204,2,0.5)" : "0 14px 30px -20px rgba(0,0,0,0.18)",
      }}
    >
      <span className="w-9 h-9 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[13px] font-bold" style={{ backgroundColor: win ? GOLD : "#F3F1EC", color: INK }}>
        {badge}
      </span>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,204,2,0.16)" }}>
        <T.Icon className="w-8 h-8" strokeWidth={1.7} style={{ color: INK }} />
      </div>
      <span className="text-[12px] font-bold" style={{ color: INK }}>{initial}</span>
      <span className="text-[11px] font-semibold" style={{ color: MUTE }}>{T.label}</span>
    </div>
  );
}
