import { useState } from "react";
import { Sparkles, MapPin, ChevronDown, Check } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A17";
const MUTE = "#9A938A";

const CRAVINGS = [
  { id: "comfort", emoji: "🍜", title: "Comforting", colors: "from-[#FFD194] to-[#70E1F5]" },
  { id: "exciting", emoji: "🌍", title: "Exciting", colors: "from-[#FF4E50] to-[#F9D423]" },
  { id: "healthy", emoji: "🥗", title: "Healthy", colors: "from-[#1D976C] to-[#93F9B9]" },
  { id: "cheap", emoji: "💸", title: "Cheap Eats", colors: "from-[#FAD961] to-[#F76B1C]" },
  { id: "treat", emoji: "✨", title: "Treat", colors: "from-[#DA22FF] to-[#9733EE]" },
  { id: "surprise", emoji: "🎲", title: "Surprise Me", colors: "from-[#4CB8C4] to-[#3CD3AD]" },
];

const WHERE = ["Anywhere", "Near BTS", "Street Food", "Rooftop", "Riverside"];
const BUDGETS = ["Any budget", "Cheap", "Mid-range", "Fancy", "Splurge"];

export default function PhotoForward() {
  const [craving, setCraving] = useState<string | null>("comfort");
  const [where, setWhere] = useState("Anywhere");
  const [budget, setBudget] = useState("Any budget");

  return (
    <div
      className="min-h-screen w-full font-['Inter'] antialiased flex flex-col"
      style={{ backgroundColor: "#FFFFFF", color: INK }}
    >
      <div className="mx-auto w-full max-w-[430px] flex-1 flex flex-col pb-32">
        {/* Header */}
        <header className="px-5 pt-8 pb-4">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold leading-[1.1] tracking-[-0.02em]">
            What are you craving?
          </h1>
        </header>

        {/* Editorial Gradients Grid */}
        <div className="px-5 grid grid-cols-2 gap-3 flex-1 pb-6">
          {CRAVINGS.map((c) => {
            const active = craving === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCraving(c.id)}
                className={`relative flex flex-col overflow-hidden rounded-[24px] text-left transition-all duration-300 active:scale-[0.96] ${
                  active ? "ring-2 ring-offset-2 ring-[#FFCC02]" : ""
                }`}
                style={{
                  minHeight: active ? "180px" : "160px",
                  boxShadow: active ? "0 12px 32px -8px rgba(255,204,2,0.6)" : "0 4px 16px -8px rgba(0,0,0,0.1)",
                }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${c.colors} opacity-80`} />
                <div className="absolute inset-0 bg-black/10" />
                
                {active && (
                  <div className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                    <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                  </div>
                )}

                <div className="relative z-10 flex h-full flex-col justify-between p-4">
                  <span className="text-[42px] leading-none drop-shadow-md transition-transform duration-300 group-hover:scale-110">
                    {c.emoji}
                  </span>
                  <div>
                    <span className="block font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-white drop-shadow-md leading-tight">
                      {c.title}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Strip Refinements */}
        <div className="px-5 flex gap-2">
          <div className="flex-1 relative">
            <select
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full appearance-none rounded-xl bg-[#FAF6EF] px-4 py-3.5 pr-10 font-['Plus_Jakarta_Sans'] text-[14px] font-semibold outline-none"
            >
              {WHERE.map((w) => <option key={w}>{w}</option>)}
            </select>
            <MapPin className="absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
          <div className="flex-1 relative">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full appearance-none rounded-xl bg-[#FAF6EF] px-4 py-3.5 pr-10 font-['Plus_Jakarta_Sans'] text-[14px] font-semibold outline-none"
            >
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-5 pb-6 pt-4"
        style={{ background: `linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0))` }}
      >
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full py-4 font-['Plus_Jakarta_Sans'] text-[16px] font-bold transition-transform active:scale-[0.98]"
          style={{ backgroundColor: INK, color: "#fff", boxShadow: "0 10px 24px -8px rgba(0,0,0,0.4)" }}
        >
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.4} color={GOLD} />
          Find the perfect spot
        </button>
      </div>
    </div>
  );
}
