import { useState, useEffect } from "react";
import { ArrowLeft, Soup, Pizza, Flame, Utensils, Trophy, Check, Sword } from "lucide-react";

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
  {
    id: "padthai",
    name: "Pad Thai",
    cuisine: "Thai",
    price: "฿120",
    Icon: Utensils,
    tint: "#FFF3CC",
  },
  {
    id: "ramen",
    name: "Tonkotsu Ramen",
    cuisine: "Japanese",
    price: "฿260",
    Icon: Soup,
    tint: "#E8F1FB",
  },
  {
    id: "pizza",
    name: "Margherita Pizza",
    cuisine: "Italian",
    price: "฿320",
    Icon: Pizza,
    tint: "#FBEAE6",
  },
  {
    id: "kbbq",
    name: "Korean BBQ",
    cuisine: "Korean",
    price: "฿450",
    Icon: Flame,
    tint: "#FCEFD6",
  },
];

type Matchup = {
  dish1: Dish;
  dish2: Dish;
};

export default function ToastDuel() {
  const [round, setRound] = useState<number>(1);
  const [matchups, setMatchups] = useState<Matchup[]>([
    { dish1: DISHES[0], dish2: DISHES[1] },
    { dish1: DISHES[2], dish2: DISHES[3] },
  ]);
  const [currentMatchupIdx, setCurrentMatchupIdx] = useState(0);
  const [winners, setWinners] = useState<Dish[]>([]);
  const [champion, setChampion] = useState<Dish | null>(null);
  const [locked, setLocked] = useState(false);

  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [fadingId, setFadingId] = useState<string | null>(null);

  const currentMatchup = matchups[currentMatchupIdx];

  const handlePick = (winner: Dish, loser: Dish) => {
    if (animatingId) return;

    setAnimatingId(winner.id);
    setFadingId(loser.id);

    setTimeout(() => {
      const newWinners = [...winners, winner];
      
      if (currentMatchupIdx + 1 < matchups.length) {
        // Next matchup in current round
        setWinners(newWinners);
        setCurrentMatchupIdx(currentMatchupIdx + 1);
      } else {
        // Round over
        if (newWinners.length === 1) {
          // Champion found
          setChampion(newWinners[0]);
        } else {
          // Setup next round
          const nextMatchups: Matchup[] = [];
          for (let i = 0; i < newWinners.length; i += 2) {
            if (newWinners[i + 1]) {
              nextMatchups.push({ dish1: newWinners[i], dish2: newWinners[i + 1] });
            }
          }
          setMatchups(nextMatchups);
          setCurrentMatchupIdx(0);
          setWinners([]);
          setRound(round + 1);
        }
      }
      setAnimatingId(null);
      setFadingId(null);
    }, 600);
  };

  const getRoundLabel = () => {
    if (champion) return "Champion";
    if (matchups.length === 1) return "Final";
    return `Round ${round}`;
  };

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <header className="px-6 pt-14 pb-2">
        <div className="flex items-center justify-between">
          <button
            aria-label="Go back"
            data-testid="button-back"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
            Tie-Breaker
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 pb-32 pt-4 flex flex-col">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "rgba(26,26,26,0.04)" }}>
            <Sword className="w-3.5 h-3.5" style={{ color: INK }} />
            <span className="text-[12px] font-bold uppercase tracking-wider">{getRoundLabel()}</span>
          </div>
          {!champion && (
            <>
              <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">
                Pick your favorite
              </h1>
              <p className="text-[14px] mt-2 leading-relaxed" style={{ color: MUTE }}>
                You and Mint both liked these. Only one can win.
              </p>
            </>
          )}
        </div>

        {!champion ? (
          <div className="flex-1 flex flex-col relative justify-center gap-4 pb-8">
            <DishCard
              dish={currentMatchup.dish1}
              isAnimating={animatingId === currentMatchup.dish1.id}
              isFading={fadingId === currentMatchup.dish1.id}
              onClick={() => handlePick(currentMatchup.dish1, currentMatchup.dish2)}
              position="top"
            />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-[18px]" style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              VS
            </div>

            <DishCard
              dish={currentMatchup.dish2}
              isAnimating={animatingId === currentMatchup.dish2.id}
              isFading={fadingId === currentMatchup.dish2.id}
              onClick={() => handlePick(currentMatchup.dish2, currentMatchup.dish1)}
              position="bottom"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 pb-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(255,204,2,0.2)", color: GOLD }}>
              <Trophy className="w-10 h-10" />
            </div>
            
            <div
              className="w-full rounded-[28px] bg-white overflow-hidden p-1"
              style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div className="relative h-[220px] rounded-[24px] flex items-center justify-center" style={{ backgroundColor: champion.tint }}>
                <champion.Icon className="w-24 h-24" strokeWidth={1.25} style={{ color: INK, opacity: 0.55 }} />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/85 text-[12px] font-bold backdrop-blur">
                  {champion.cuisine}
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-bold" style={{ backgroundColor: INK, color: "#fff" }}>
                  {champion.price}
                </span>
              </div>
              <div className="p-6 text-center">
                <div className="inline-flex justify-center -space-x-2 mb-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold border-2 border-white" style={{ backgroundColor: "#F3F1EC", color: INK }}>Y</span>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold border-2 border-white" style={{ backgroundColor: "#F3F1EC", color: INK }}>M</span>
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight leading-tight">{champion.name}</h2>
                <p className="text-[14px] mt-2 font-medium" style={{ color: LINE }}>
                  Mutual Match Winner
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {champion && (
        <div
          className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10"
          style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
        >
          <button
            data-testid="button-lock"
            onClick={() => setLocked(true)}
            disabled={locked}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: locked ? LINE : GOLD, color: locked ? "#fff" : INK, boxShadow: locked ? "0 8px 20px -8px rgba(6,199,85,0.55)" : "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            {locked ? (<><Check className="w-[18px] h-[18px]" /> Locked in — see you there</>) : "Lock it in"}
          </button>
        </div>
      )}
    </div>
  );
}

function DishCard({ dish, isAnimating, isFading, onClick, position }: { dish: Dish; isAnimating: boolean; isFading: boolean; onClick: () => void; position: "top"|"bottom" }) {
  return (
    <button
      onClick={onClick}
      data-testid={`card-${dish.id}`}
      className="relative w-full rounded-[28px] bg-white overflow-hidden text-left flex-1 flex flex-col active:scale-[0.98] transition-all duration-500 origin-center"
      style={{
        boxShadow: isAnimating ? "0 0 0 4px #FFCC02, 0 20px 40px -10px rgba(255,204,2,0.3)" : "0 18px 40px -18px rgba(0,0,0,0.16)",
        border: isAnimating ? "none" : "1px solid rgba(0,0,0,0.05)",
        transform: isAnimating ? "scale(1.05)" : isFading ? "scale(0.95)" : "scale(1)",
        opacity: isFading ? 0 : 1,
        zIndex: isAnimating ? 20 : 1,
      }}
    >
      <div className="relative flex-1 flex items-center justify-center" style={{ backgroundColor: dish.tint }}>
        <dish.Icon className="w-16 h-16" strokeWidth={1.25} style={{ color: INK, opacity: 0.55 }} />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/85 text-[12px] font-bold backdrop-blur">
          {dish.cuisine}
        </span>
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-bold" style={{ backgroundColor: INK, color: "#fff" }}>
          {dish.price}
        </span>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold tracking-tight leading-tight">{dish.name}</h2>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex -space-x-1.5">
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[9px] font-bold border-2 border-white" style={{ backgroundColor: "#F3F1EC", color: INK }}>Y</span>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[9px] font-bold border-2 border-white" style={{ backgroundColor: "#F3F1EC", color: INK }}>M</span>
            </div>
            <span className="text-[11px] font-semibold" style={{ color: MUTE }}>Both liked</span>
          </div>
        </div>
      </div>
    </button>
  );
}
