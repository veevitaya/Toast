import { useState } from "react";
import { Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A17";
const MUTE = "#9A938A";

const CRAVINGS = [
  { id: "comfort", emoji: "🍜", title: "Comforting & easy", sub: "Cozy, familiar flavors" },
  { id: "exciting", emoji: "🌍", title: "Something exciting", sub: "Bold and new" },
  { id: "healthy", emoji: "🥗", title: "Healthy-ish", sub: "Fresh and light" },
  { id: "cheap", emoji: "💸", title: "Cheap but good", sub: "Big taste, small spend" },
  { id: "treat", emoji: "✨", title: "Worth going out for", sub: "A proper treat" },
  { id: "surprise", emoji: "🎲", title: "Surprise me", sub: "Let Toast choose" },
];

const WHERE = [
  { id: "bts", emoji: "🚇", label: "Near BTS" },
  { id: "mall", emoji: "🏬", label: "At the mall" },
  { id: "street", emoji: "🍢", label: "Street food" },
  { id: "rooftop", emoji: "🏙️", label: "Rooftop" },
  { id: "river", emoji: "🌊", label: "Riverside" },
  { id: "late", emoji: "🌙", label: "Late night" },
];

const BUDGETS = [
  { id: "cheap", glyph: "฿", label: "Cheap eats" },
  { id: "mid", glyph: "฿฿", label: "Mid range" },
  { id: "fancy", glyph: "฿฿฿", label: "Fancy" },
  { id: "splurge", glyph: "฿฿฿฿", label: "Splurge" },
];

export default function GuidedMood() {
  const [step, setStep] = useState(1);
  const [craving, setCraving] = useState<string | null>(null);
  const [where, setWhere] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);

  const toggleWhere = (id: string) =>
    setWhere((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // Advance only when the user actively picks a craving (not when navigating back to step 1)
  const pickCraving = (id: string) => {
    setCraving(id);
    setTimeout(() => setStep((s) => (s === 1 ? 2 : s)), 400);
  };

  return (
    <div
      className="min-h-screen w-full font-['Inter'] antialiased relative overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto w-full max-w-[430px] px-5 pb-40 pt-8 flex flex-col min-h-screen">
        
        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          {step > 1 ? (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform active:scale-95"
              style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
            >
              <ArrowLeft className="h-5 w-5" color={INK} />
            </button>
          ) : (
            <div className="h-10 w-10" /> 
          )}
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: step === i ? "24px" : "8px",
                  backgroundColor: step >= i ? INK : "rgba(0,0,0,0.1)"
                }}
              />
            ))}
          </div>
          <button 
            onClick={() => setStep(s => Math.min(3, s + 1))}
            className="flex h-10 px-3 items-center justify-center rounded-full bg-transparent text-[13px] font-medium transition-opacity"
            style={{ color: MUTE, opacity: step < 3 ? 1 : 0, pointerEvents: step < 3 ? "auto" : "none" }}
          >
            Skip
          </button>
        </div>

        {/* Step Content */}
        <div className="flex-1 relative">
          
          {/* STEP 1: MOOD */}
          <div 
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{ 
              transform: `translateX(${(1 - step) * 100}%)`,
              opacity: step === 1 ? 1 : 0,
              pointerEvents: step === 1 ? "auto" : "none"
            }}
          >
            <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold leading-[1.1] tracking-[-0.02em] mb-2">
              What sounds good?
            </h1>
            <p className="text-[15px] mb-8" style={{ color: MUTE }}>
              Tell us your vibe, we'll find the spot.
            </p>

            <div className="flex flex-col gap-3">
              {CRAVINGS.map((c) => {
                const active = craving === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => pickCraving(c.id)}
                    className="flex w-full items-center gap-4 rounded-[20px] bg-white p-4 text-left transition-all duration-200 active:scale-[0.98]"
                    style={{
                      border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: active
                        ? "0 10px 28px -10px rgba(255,204,2,0.45)"
                        : "0 6px 20px -10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-[24px]" style={{ backgroundColor: CREAM }}>
                      {c.emoji}
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-semibold">{c.title}</span>
                      <span className="text-[13px]" style={{ color: MUTE }}>{c.sub}</span>
                    </div>
                    {active && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: GOLD }}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} color={INK} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: WHERE */}
          <div 
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{ 
              transform: `translateX(${(2 - step) * 100}%)`,
              opacity: step === 2 ? 1 : 0,
              pointerEvents: step === 2 ? "auto" : "none"
            }}
          >
            <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold leading-[1.1] tracking-[-0.02em] mb-2">
              Any specific area?
            </h1>
            <p className="text-[15px] mb-8" style={{ color: MUTE }}>
              We'll limit our search to these vibes.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {WHERE.map((w) => {
                const active = where.includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWhere(w.id)}
                    className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-white p-6 text-center transition-all duration-200 active:scale-[0.96]"
                    style={{
                      border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: active
                        ? "0 10px 28px -10px rgba(255,204,2,0.45)"
                        : "0 6px 20px -10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span className="text-[32px] leading-none mb-1">{w.emoji}</span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-semibold">{w.label}</span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setStep(3)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 font-['Plus_Jakarta_Sans'] text-[15px] font-semibold transition-transform active:scale-[0.98]"
              style={{ backgroundColor: INK, color: "#fff" }}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* STEP 3: BUDGET */}
          <div 
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{ 
              transform: `translateX(${(3 - step) * 100}%)`,
              opacity: step === 3 ? 1 : 0,
              pointerEvents: step === 3 ? "auto" : "none"
            }}
          >
            <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold leading-[1.1] tracking-[-0.02em] mb-2">
              What's the budget?
            </h1>
            <p className="text-[15px] mb-8" style={{ color: MUTE }}>
              Help us narrow down the perfect spot.
            </p>

            <div className="flex flex-col gap-3">
              {BUDGETS.map((b) => {
                const active = budget === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className="flex w-full items-center justify-between rounded-[20px] bg-white p-5 text-left transition-all duration-200 active:scale-[0.98]"
                    style={{
                      border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: active
                        ? "0 10px 28px -10px rgba(255,204,2,0.45)"
                        : "0 6px 20px -10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-semibold">{b.label}</span>
                    </div>
                    <span 
                      className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold tracking-widest"
                      style={{ color: active ? GOLD : MUTE }}
                    >
                      {b.glyph}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Sticky CTAs */}
      {step === 3 && (
        <div
          className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-5 pb-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ background: `linear-gradient(to top, ${CREAM} 72%, rgba(250,246,239,0))` }}
        >
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-full py-4 font-['Plus_Jakarta_Sans'] text-[15.5px] font-semibold transition-transform active:scale-[0.98]"
              style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 10px 24px -8px rgba(255,204,2,0.55)" }}
            >
              <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.4} />
              Toast, decide for me
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center py-2 text-[14px] font-medium transition-opacity active:opacity-70"
              style={{ color: MUTE }}
            >
              Let me browse instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
