import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Flame, Soup, Pizza, Utensils, Info, Check, Share2, Lock } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

const DISHES = [
  { id: "padthai", name: "Pad Thai", cuisine: "Thai", price: "฿120", Icon: Utensils, tint: "#FFF3CC" },
  { id: "ramen", name: "Tonkotsu Ramen", cuisine: "Japanese", price: "฿260", Icon: Soup, tint: "#E8F1FB" },
  { id: "pizza", name: "Margherita Pizza", cuisine: "Italian", price: "฿320", Icon: Pizza, tint: "#FBEAE6" },
  { id: "kbbq", name: "Korean BBQ", cuisine: "Korean", price: "฿450", Icon: Flame, tint: "#FCEFD6" },
];

export default function CravingMeter() {
  const [cravings, setCravings] = useState<Record<string, number>>({
    padthai: 0,
    ramen: 0,
    pizza: 0,
    kbbq: 0,
  });
  
  const [holdingId, setHoldingId] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const requestRef = useRef<number>();
  
  const animate = () => {
    if (holdingId && !winner) {
      setCravings((prev) => {
        const nextVal = Math.min((prev[holdingId] || 0) + 1.2, 100);
        if (nextVal >= 100) {
          setWinner(holdingId);
        }
        return { ...prev, [holdingId]: nextVal };
      });
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (holdingId && !winner) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [holdingId, winner]);

  // Release the hold even if the pointer is lifted/cancelled outside a card.
  useEffect(() => {
    if (!holdingId) return;
    const stop = () => setHoldingId(null);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [holdingId]);

  const onPointerDown = (id: string) => {
    if (!winner) setHoldingId(id);
  };

  const onPointerUp = () => {
    setHoldingId(null);
  };

  const winnerDish = winner ? DISHES.find(d => d.id === winner) : null;

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter'] select-none"
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
          Craving Meter
        </span>
      </header>

      {winnerDish ? (
        <main className="flex-1 px-6 pt-6 pb-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl" style={{ backgroundColor: LINE, color: "#fff" }}>
            <Check className="w-10 h-10" strokeWidth={3} />
          </div>
          
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold tracking-tight leading-tight">
            It's a Match!
          </h1>
          <p className="text-[16px] mt-3 leading-relaxed mb-8 max-w-[280px]" style={{ color: "rgba(26,26,26,0.6)" }}>
            The craving has spoken. You and Mint are locking in {winnerDish.name}.
          </p>

          <div
            className="w-full rounded-[28px] bg-white overflow-hidden text-left"
            style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
            data-testid={`winner-dish-${winnerDish.id}`}
          >
            <div className="relative h-[170px] flex items-center justify-center" style={{ backgroundColor: winnerDish.tint }}>
              <winnerDish.Icon className="w-20 h-20" strokeWidth={1.25} style={{ color: INK, opacity: 0.55 }} />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/85 text-[12px] font-bold backdrop-blur">
                {winnerDish.cuisine}
              </span>
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[12px] font-bold" style={{ backgroundColor: INK, color: "#fff" }}>
                {winnerDish.price}
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight">{winnerDish.name}</h2>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold border-2 border-white bg-[#F3F1EC] text-[#1A1A1A]">Y</span>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold border-2 border-white bg-[#F3F1EC] text-[#1A1A1A]">M</span>
                </div>
                <span className="text-[14px] font-medium" style={{ color: MUTE }}>Both craved this</span>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 px-6 pb-32 pt-2">
          <div className="mb-6 text-center">
            <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold tracking-tight leading-tight">
              Pour in your craving
            </h1>
            <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
              Press &amp; hold what you really want right now. Mint is adding theirs too.
            </p>
          </div>

          <div className="flex justify-center items-center gap-3 mb-6 bg-white py-3 px-5 rounded-full shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)] border border-black/5 mx-auto w-max">
            <div className="flex -space-x-2">
              <span className="w-7 h-7 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold border-2 border-white bg-[#F3F1EC] text-[#1A1A1A]">Y</span>
              <span className="w-7 h-7 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold border-2 border-white bg-[#F3F1EC] text-[#1A1A1A]">M</span>
            </div>
            <span className="text-[13px] font-semibold" style={{ color: INK }}>Craving combines across the table</span>
          </div>

          <div className="space-y-4">
            {DISHES.map((dish) => {
              const val = cravings[dish.id] || 0;
              const isHolding = holdingId === dish.id;
              
              return (
                <div
                  key={dish.id}
                  data-testid={`dish-${dish.id}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Press and hold to crave ${dish.name}`}
                  onPointerDown={() => onPointerDown(dish.id)}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPointerDown(dish.id); } }}
                  onKeyUp={(e) => { if (e.key === "Enter" || e.key === " ") onPointerUp(); }}
                  className="relative rounded-[24px] overflow-hidden bg-white cursor-pointer active:scale-[0.98] transition-transform touch-none outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC02]"
                  style={{
                    boxShadow: isHolding ? "0 12px 24px -12px rgba(255,204,2,0.4)" : "0 8px 24px -12px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div 
                    className="absolute top-0 bottom-0 left-0 transition-all duration-75 ease-linear"
                    style={{ 
                      width: `${val}%`, 
                      backgroundColor: GOLD,
                      opacity: isHolding ? 0.3 : 0.15
                    }}
                  />
                  
                  <div className="relative p-4 flex items-center gap-4 z-10">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300"
                      style={{ 
                        backgroundColor: dish.tint,
                        transform: isHolding ? "scale(1.05)" : "scale(1)"
                      }}
                    >
                      <dish.Icon className="w-8 h-8" style={{ color: INK, opacity: 0.6 }} strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold tracking-tight truncate">{dish.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[13px] font-semibold" style={{ color: MUTE }}>{dish.cuisine}</span>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />
                        <span className="text-[13px] font-bold" style={{ color: INK }}>{dish.price}</span>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end pr-2">
                      <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold" style={{ color: val > 0 ? GOLD : MUTE, opacity: val > 0 ? 1 : 0.3 }}>
                        {Math.floor(val)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Sticky footer CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        <button
          data-testid="button-cta"
          disabled={!winner || locked}
          onClick={() => { if (winner) setLocked(true); }}
          className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 transition-all pointer-events-auto"
          style={{
            backgroundColor: locked ? LINE : winner ? GOLD : "#E3DED3",
            color: locked ? "#fff" : winner ? INK : MUTE,
            boxShadow: winner ? (locked ? "0 8px 20px -8px rgba(6,199,85,0.55)" : "0 8px 20px -8px rgba(255,204,2,0.55)") : "none",
            transform: winner ? "scale(1)" : "scale(0.98)",
          }}
        >
          {locked ? (
            <><Check className="w-[18px] h-[18px]" /> Locked in — see you there</>
          ) : winner ? (
            <><Lock className="w-[18px] h-[18px]" /> Lock it in</>
          ) : (
            "Keep holding to decide"
          )}
        </button>
      </div>
    </div>
  );
}
