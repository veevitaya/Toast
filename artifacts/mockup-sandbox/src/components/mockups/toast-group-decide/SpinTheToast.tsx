import React, { useState } from "react";
import { ArrowLeft, Sparkles, Lock, RotateCcw, Utensils, Pizza, Soup, Flame, Check } from "lucide-react";

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

export default function SpinTheToast() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Dish | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setShowResult(false);
    setLocked(false);

    // Pick a random dish
    const winnerIdx = Math.floor(Math.random() * DISHES.length);

    // Each 90° segment i sits at i*90 clockwise from the top pointer. To bring the
    // winner under the pointer, the wheel's final angle (mod 360) must equal
    // (360 - winnerIdx*90). Compute the delta from the CURRENT angle so repeated
    // spins stay aligned, then add full spins for drama.
    const randomOffset = Math.floor(Math.random() * 60) - 30; // ±30° within the slice
    const currentMod = ((rotation % 360) + 360) % 360;
    const desiredTarget = ((360 - winnerIdx * 90) % 360) + randomOffset;
    const delta = (((desiredTarget - currentMod) % 360) + 360) % 360;
    const finalRotation = rotation + delta + 5 * 360;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(DISHES[winnerIdx]);
      setShowResult(true);
    }, 2500);
  };

  const lockItIn = () => {
    setLocked(true);
  };

  return (
    <div 
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter'] overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-2 z-10 relative">
        <button
          aria-label="Go back"
          data-testid="button-back"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
          Tie-breaker
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-6 pb-32 flex flex-col z-10 relative">
        <div className="text-center mb-8">
          <div className="flex justify-center -space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold border-2 border-white" style={{ backgroundColor: "#F3F1EC", color: INK }}>Y</div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold border-2 border-white" style={{ backgroundColor: "#F3F1EC", color: INK }}>M</div>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">
            You both liked all 4
          </h1>
          <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
            Let fate settle it. No wrong answer.
          </p>
        </div>

        {/* Wheel container */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[320px]">
          
          {/* Pointer/Needle */}
          <div className="absolute top-0 z-20 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-transparent border-t-red-500 drop-shadow-md" style={{ borderTopColor: GOLD, marginTop: "-10px" }}></div>
          
          {/* The Wheel */}
          <div 
            className="w-[300px] h-[300px] rounded-full relative overflow-hidden border-[6px] shadow-xl"
            style={{ 
              borderColor: "white",
              transform: `rotate(${rotation}deg)`,
              transition: "transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
            }}
            data-testid="wheel"
          >
            {DISHES.map((dish, i) => {
              // 4 segments -> 90 degrees each
              const angle = i * 90;
              return (
                <div 
                  key={dish.id}
                  className="absolute w-full h-[50%] top-0 left-0 origin-bottom"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  {/* Clip to pie slice */}
                  <div className="w-full h-full absolute overflow-hidden origin-bottom" style={{ transform: "skewY(-0deg)", backgroundColor: dish.tint }}>
                    <div className="absolute left-1/2 top-4 -translate-x-1/2 flex flex-col items-center gap-1">
                      <dish.Icon className="w-8 h-8" style={{ color: INK, opacity: 0.6 }} />
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-center leading-tight max-w-[80px]" style={{ color: INK }}>
                        {dish.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-inner border-2 border-black/[0.05] z-10"></div>
          </div>
        </div>

        {/* Result Card */}
        <div 
          className={`mt-8 rounded-[28px] bg-white p-5 transition-all duration-500 transform ${showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
          style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
          data-testid="result-card"
        >
          {winner && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3" style={{ backgroundColor: winner.tint }}>
                <Sparkles className="w-6 h-6" style={{ color: INK }} />
              </div>
              <p className="text-[13px] font-semibold tracking-wider uppercase mb-1" style={{ color: MUTE }}>Fate picked</p>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold leading-tight mb-4">{winner.name}</h2>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-black/[0.04]">{winner.cuisine}</span>
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-black/[0.04]">{winner.price}</span>
              </div>
              
              <button
                data-testid="button-lock"
                onClick={lockItIn}
                disabled={locked}
                className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: locked ? LINE : GOLD, color: locked ? "#fff" : INK, boxShadow: locked ? "0 8px 20px -8px rgba(6,199,85,0.55)" : "0 8px 20px -8px rgba(255,204,2,0.55)" }}
              >
                {locked ? (<><Check className="w-[18px] h-[18px]" /> Locked in — see you there</>) : (<><Lock className="w-[18px] h-[18px]" /> Lock it in</>)}
              </button>

              {!locked && (
                <button
                  data-testid="button-spin-again"
                  onClick={spin}
                  className="mt-3 text-[14px] font-semibold flex items-center justify-center gap-1.5 mx-auto active:scale-95 transition-transform"
                  style={{ color: MUTE }}
                >
                  <RotateCcw className="w-4 h-4" /> Spin again
                </button>
              )}
            </div>
          )}
        </div>

      </main>

      {/* Spin CTA (hidden when result is shown) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10 transition-opacity duration-300 ${showResult || isSpinning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        <button
          data-testid="button-spin"
          onClick={spin}
          disabled={isSpinning}
          className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
        >
          Spin the Toast
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Wheel segment hack to make real pie slices with borders */
        /* Since standard CSS borders for pie slices are tricky without clip-path, we'll use a simpler approach */
        .origin-bottom { transform-origin: center bottom; }
        
        /* A simple clip path for 90 deg slice from top center */
        [data-testid="wheel"] > div > div {
           clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}} />
    </div>
  );
}
