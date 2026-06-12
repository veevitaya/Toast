import { useState } from "react";
import { Sparkles, Check } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A17";
const MUTE = "#9A938A";

const CRAVINGS = [
  { id: "comfort", emoji: "🍜", label: "Comfort" },
  { id: "exciting", emoji: "🌍", label: "Exciting" },
  { id: "healthy", emoji: "🥗", label: "Healthy" },
  { id: "cheap", emoji: "💸", label: "Cheap" },
  { id: "treat", emoji: "✨", label: "Treat" },
  { id: "surprise", emoji: "🎲", label: "Surprise" },
];

const WHERE = [
  { id: "bts", emoji: "🚇", label: "BTS" },
  { id: "mall", emoji: "🏬", label: "Mall" },
  { id: "street", emoji: "🍢", label: "Street" },
  { id: "rooftop", emoji: "🏙️", label: "Rooftop" },
];

const BUDGETS = [
  { id: "cheap", glyph: "฿", label: "Cheap" },
  { id: "mid", glyph: "฿฿", label: "Mid" },
  { id: "fancy", glyph: "฿฿฿", label: "Fancy" },
];

export default function QuickPicker() {
  const [craving, setCraving] = useState<string>("comfort");
  const [where, setWhere] = useState<string[]>(["bts"]);
  const [budget, setBudget] = useState<string>("mid");
  const [meal, setMeal] = useState<string | null>("meal");

  const toggleWhere = (id: string) => {
    setWhere(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getCravingLabel = () => CRAVINGS.find(c => c.id === craving)?.label || "food";
  const getBudgetLabel = () => BUDGETS.find(b => b.id === budget)?.label || "any budget";
  const getWhereLabel = () => where.length ? "in specific areas" : "anywhere";

  return (
    <div
      className="min-h-screen w-full font-['Inter'] antialiased pb-32"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto w-full max-w-[430px] px-4 pt-8">
        
        {/* Dynamic Header */}
        <header className="mb-6">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold leading-tight tracking-[-0.02em]">
            Looking for <span style={{ color: "#D4A800" }}>{getCravingLabel().toLowerCase()}</span> options, 
            <br />
            {getWhereLabel()} <br/>
            with a <span style={{ color: "#D4A800" }}>{getBudgetLabel().toLowerCase()}</span> budget.
          </h1>
        </header>

        {/* Section: Mood */}
        <div className="mb-5 rounded-[20px] bg-white p-4" style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <h2 className="mb-3 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-gray-400 uppercase tracking-wider">Mood</h2>
          <div className="grid grid-cols-3 gap-2">
            {CRAVINGS.map(c => {
              const active = craving === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCraving(c.id)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-transform active:scale-95"
                  style={{ 
                    backgroundColor: active ? INK : "#F3F4F6", 
                    color: active ? "#FFF" : INK 
                  }}
                >
                  <span className="text-[16px]">{c.emoji}</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-semibold">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Where */}
        <div className="mb-5 rounded-[20px] bg-white p-4" style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <h2 className="mb-3 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-gray-400 uppercase tracking-wider">Location</h2>
          <div className="flex flex-wrap gap-2">
            {WHERE.map(w => {
              const active = where.includes(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => toggleWhere(w.id)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 transition-transform active:scale-95"
                  style={{ 
                    backgroundColor: active ? "#FFF8DC" : "#F3F4F6", 
                    border: `1.5px solid ${active ? GOLD : "transparent"}`
                  }}
                >
                  <span className="text-[14px]">{w.emoji}</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-medium">{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Budget (Segmented Control) */}
        <div className="mb-5 rounded-[20px] bg-white p-4" style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-gray-400 uppercase tracking-wider">Budget</h2>
          </div>
          <div className="flex rounded-xl bg-[#F3F4F6] p-1">
            {BUDGETS.map(b => {
              const active = budget === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  className="flex-1 rounded-lg py-2 transition-all"
                  style={{ 
                    backgroundColor: active ? "#FFF" : "transparent",
                    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-none mb-1" style={{ color: active ? GOLD : MUTE }}>{b.glyph}</span>
                  <span className="block text-[11px] font-medium text-gray-500">{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Floating Big CTA */}
      <div
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-4 pb-6 pt-4"
        style={{ background: `linear-gradient(to top, ${CREAM} 80%, rgba(250,246,239,0))` }}
      >
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-['Plus_Jakarta_Sans'] text-[17px] font-bold transition-transform active:scale-[0.98]"
          style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 24px -6px rgba(255,204,2,0.6)" }}
        >
          <Sparkles className="h-[20px] w-[20px]" strokeWidth={2.4} />
          Find exactly this
        </button>
      </div>
    </div>
  );
}
