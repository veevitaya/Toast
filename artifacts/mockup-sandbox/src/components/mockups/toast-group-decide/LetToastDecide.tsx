import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Soup, Pizza, Flame, Utensils, Check, Lock, RotateCcw, Bot } from "lucide-react";

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
  Icon: any;
  tint: string;
};

const DISHES: Dish[] = [
  { id: "padthai", name: "Pad Thai", cuisine: "Thai", price: "฿120", Icon: Utensils, tint: "#FFF3CC" },
  { id: "ramen", name: "Tonkotsu Ramen", cuisine: "Japanese", price: "฿260", Icon: Soup, tint: "#E8F1FB" },
  { id: "pizza", name: "Margherita Pizza", cuisine: "Italian", price: "฿320", Icon: Pizza, tint: "#FBEAE6" },
  { id: "kbbq", name: "Korean BBQ", cuisine: "Korean", price: "฿450", Icon: Flame, tint: "#FCEFD6" },
];

const SIGNALS = [
  "You both rated this highest",
  "4 min away",
  "Rainy Tuesday night",
  "Best value"
];

export default function LetToastDecide() {
  const [state, setState] = useState<"idle" | "thinking" | "result">("idle");
  const [signalIdx, setSignalIdx] = useState(-1);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (state !== "thinking") return;
    setSignalIdx(-1);
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setSignalIdx(i);
      i++;
      if (i > SIGNALS.length) {
        clearInterval(interval);
        timeout = setTimeout(() => setState("result"), 500);
      }
    }, 800);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state]);

  const winner = DISHES[1]; // Tonkotsu Ramen

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <header className="flex items-center justify-between px-6 pt-14 pb-2 z-10 relative">
        <button
          aria-label="Go back"
          data-testid="button-back"
          onClick={() => { setLocked(false); setState("idle"); }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
          Mutual Matches
        </span>
      </header>

      <main className="flex-1 px-6 pb-40 pt-4 flex flex-col relative z-0">
        {state === "idle" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="text-center mb-8">
              <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">
                You're stuck!
              </h1>
              <p className="text-[15px] mt-2 leading-relaxed px-4" style={{ color: "rgba(26,26,26,0.6)" }}>
                You and Mint both liked 4 places. Let Toast's assistant pick the perfect one for right now.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {DISHES.map((d) => (
                <div key={d.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)] border border-black/[0.04]">
                  <div className="h-[90px] flex items-center justify-center relative" style={{ backgroundColor: d.tint }}>
                    <d.Icon className="w-10 h-10" strokeWidth={1.5} style={{ color: INK, opacity: 0.5 }} />
                    <div className="absolute -bottom-3 flex -space-x-1.5">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[10px] font-bold border-2 border-white shadow-sm" style={{ backgroundColor: "#F3F1EC", color: INK }}>Y</span>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[10px] font-bold border-2 border-white shadow-sm" style={{ backgroundColor: "#F3F1EC", color: INK }}>M</span>
                    </div>
                  </div>
                  <div className="p-3 pt-4 text-center">
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold truncate">{d.name}</h3>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: MUTE }}>{d.cuisine} · {d.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-auto" />
          </div>
        )}

        {state === "thinking" && (
          <div className="flex-1 flex flex-col items-center justify-center pb-20 animate-in fade-in duration-500">
            <div className="relative mb-10">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: GOLD }} />
              <div className="absolute -inset-4 rounded-full animate-pulse opacity-10" style={{ backgroundColor: GOLD, animationDuration: '2s' }} />
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative z-10 shadow-[0_12px_30px_-10px_rgba(255,204,2,0.6)]" style={{ backgroundColor: GOLD }}>
                <Bot className="w-10 h-10" style={{ color: INK }} />
              </div>
            </div>
            
            <h2 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-center mb-6">
              Butters is deciding...
            </h2>
            
            <div className="flex flex-col gap-3 min-h-[140px] items-center w-full max-w-[280px]">
              {SIGNALS.map((sig, i) => (
                <div 
                  key={i}
                  className={`px-4 py-2.5 rounded-full bg-white shadow-sm border border-black/[0.05] text-[13px] font-medium transition-all duration-500 w-full flex items-center gap-3 ${i <= signalIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <Check className="w-4 h-4 shrink-0" style={{ color: LINE }} />
                  {sig}
                </div>
              ))}
            </div>
          </div>
        )}

        {state === "result" && (
          <div className="animate-in zoom-in-95 fade-in duration-700 flex-1 flex flex-col pt-2">
            <div className="flex items-center gap-2 justify-center mb-6">
              <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
              <span className="text-[13px] font-bold tracking-[0.15em] uppercase" style={{ color: INK }}>
                The Verdict
              </span>
            </div>

            <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_18px_40px_-18px_rgba(0,0,0,0.16)] border border-black/[0.05]">
              <div className="relative h-[200px] flex items-center justify-center" style={{ backgroundColor: winner.tint }}>
                <winner.Icon className="w-24 h-24" strokeWidth={1.25} style={{ color: INK, opacity: 0.55 }} />
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/90 text-[13px] font-bold backdrop-blur">
                  {winner.cuisine}
                </span>
                <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-[13px] font-bold shadow-sm" style={{ backgroundColor: INK, color: "#fff" }}>
                  {winner.price}
                </span>
              </div>
              
              <div className="p-6">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold tracking-tight leading-tight">{winner.name}</h2>
                <div className="flex -space-x-2 mt-3 mb-5">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold border-2 border-white shadow-sm" style={{ backgroundColor: "#F3F1EC", color: INK }}>Y</span>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold border-2 border-white shadow-sm" style={{ backgroundColor: "#F3F1EC", color: INK }}>M</span>
                  <span className="ml-4 text-[13px] font-semibold flex items-center" style={{ color: LINE }}>
                    <Check className="w-3.5 h-3.5 mr-1" strokeWidth={3} /> Mutual match
                  </span>
                </div>
                
                <div className="bg-[#FAF6EF] rounded-[16px] p-4 border border-black/[0.03]">
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GOLD }} />
                    <p className="text-[14px] leading-relaxed" style={{ color: INK }}>
                      Perfect for a rainy Tuesday night. It's only 4 mins away and you both rated this highly in the past.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-2 items-center">
               <span className="text-[12px] font-medium" style={{ color: MUTE }}>Chosen from your 4 mutual likes</span>
               <div className="flex gap-1.5">
                 {DISHES.filter(d => d.id !== winner.id).map(d => (
                   <div key={d.id} className="w-10 h-10 rounded-full flex items-center justify-center border border-black/[0.05]" style={{ backgroundColor: d.tint }}>
                     <d.Icon className="w-5 h-5" style={{ color: INK, opacity: 0.5 }} />
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Action Area */}
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10 transition-transform duration-700 ${state === 'thinking' ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))`, zIndex: 20 }}
      >
        {state === "idle" && (
          <button
            data-testid="button-delegate"
            onClick={() => { setLocked(false); setState("thinking"); }}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_8px_20px_-8px_rgba(255,204,2,0.55)]"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            <Sparkles className="w-5 h-5" /> Let Toast Decide
          </button>
        )}
        
        {state === "result" && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-300 fill-mode-both">
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
                data-testid="button-retry"
                onClick={() => { setLocked(false); setState("idle"); }}
                className="w-full h-12 rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform bg-transparent"
                style={{ color: MUTE }}
              >
                <RotateCcw className="w-4 h-4" /> Let us choose instead
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
