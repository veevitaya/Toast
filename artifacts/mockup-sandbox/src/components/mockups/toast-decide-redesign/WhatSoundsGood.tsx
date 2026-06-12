import { useState } from "react";
import { MapPin, ChevronUp, ChevronDown, Check, Sparkles, Compass } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A17";
const MUTE = "#9A938A";

type Craving = {
  id: string;
  emoji: string;
  title: string;
  sub: string;
};

const CRAVINGS: Craving[] = [
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

const MEALS = [
  { id: "dessert", label: "Dessert" },
  { id: "meal", label: "Meal" },
  { id: "buffet", label: "Buffet" },
  { id: "coffee", label: "Coffee" },
];

export default function WhatSoundsGood() {
  const [craving, setCraving] = useState<string | null>(null);
  const [whereOpen, setWhereOpen] = useState(true);
  const [where, setWhere] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [meal, setMeal] = useState<string | null>(null);

  const toggleWhere = (id: string) =>
    setWhere((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const cravingLabel = CRAVINGS.find((c) => c.id === craving)?.title;
  const whereLabels = WHERE.filter((w) => where.includes(w.id)).map((w) => w.label);
  const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label;
  const mealLabel = MEALS.find((m) => m.id === meal)?.label;

  const summary: string[] = [
    ...(cravingLabel ? [cravingLabel] : []),
    ...whereLabels,
    ...(budgetLabel ? [budgetLabel] : []),
    ...(mealLabel ? [mealLabel] : []),
  ];

  return (
    <div
      className="min-h-screen w-full font-['Inter'] antialiased"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto w-full max-w-[430px] px-5 pb-40 pt-8">
        {/* Header */}
        <header className="mb-6">
          <h1
            className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold leading-[1.15] tracking-[-0.02em]"
            data-testid="text-title"
          >
            What sounds good?
          </h1>
          <p className="mt-1.5 text-[14.5px] leading-snug" style={{ color: MUTE }}>
            Pick one — Toast takes it from here.
          </p>
        </header>

        {/* Intent cards */}
        <div className="grid grid-cols-2 gap-3">
          {CRAVINGS.map((c) => {
            const active = craving === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCraving(active ? null : c.id)}
                data-testid={`card-craving-${c.id}`}
                className="relative flex min-h-[112px] flex-col items-start rounded-[20px] bg-white p-4 text-left transition-all duration-200 active:scale-[0.98]"
                style={{
                  border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: active
                    ? "0 10px 28px -10px rgba(255,204,2,0.45)"
                    : "0 6px 20px -10px rgba(0,0,0,0.10)",
                }}
              >
                {active && (
                  <span
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: GOLD }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} color={INK} />
                  </span>
                )}
                <span className="text-[26px] leading-none">{c.emoji}</span>
                <span className="mt-auto pt-3">
                  <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold leading-tight">
                    {c.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: MUTE }}>
                    {c.sub}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Where */}
        <section
          className="mt-4 overflow-hidden rounded-[20px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 6px 20px -10px rgba(0,0,0,0.08)" }}
        >
          <button
            type="button"
            onClick={() => setWhereOpen((o) => !o)}
            data-testid="button-where-toggle"
            className="flex w-full items-center gap-3 px-4 py-4"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,90,95,0.10)" }}
            >
              <MapPin className="h-[18px] w-[18px]" color="#FF5A5F" strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-left">
              <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">Where</span>
              <span className="block text-[12.5px]" style={{ color: MUTE }}>
                {whereLabels.length ? whereLabels.join(" · ") : "Anywhere in town"}
              </span>
            </span>
            {whereOpen ? (
              <ChevronUp className="h-5 w-5" color={MUTE} />
            ) : (
              <ChevronDown className="h-5 w-5" color={MUTE} />
            )}
          </button>

          {whereOpen && (
            <div className="grid grid-cols-3 gap-2 px-4 pb-4">
              {WHERE.map((w) => {
                const active = where.includes(w.id);
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => toggleWhere(w.id)}
                    data-testid={`chip-where-${w.id}`}
                    className="flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center transition-all duration-150 active:scale-[0.97]"
                    style={{
                      border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.07)",
                      backgroundColor: active ? "#FFF8DC" : "#FFFFFF",
                    }}
                  >
                    <span className="text-[18px] leading-none">{w.emoji}</span>
                    <span className="text-[11.5px] font-medium leading-tight">{w.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Budget */}
        <section
          className="mt-4 rounded-[20px] bg-white px-4 py-4"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 6px 20px -10px rgba(0,0,0,0.08)" }}
        >
          <span className="mb-3 block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">Budget</span>
          <div className="grid grid-cols-4 gap-2">
            {BUDGETS.map((b) => {
              const active = budget === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudget(active ? null : b.id)}
                  data-testid={`chip-budget-${b.id}`}
                  className="flex flex-col items-center gap-1 rounded-2xl px-1 py-3 transition-all duration-150 active:scale-[0.97]"
                  style={{
                    border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.07)",
                    backgroundColor: active ? "#FFF8DC" : "#FFFFFF",
                  }}
                >
                  <span
                    className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-none"
                    style={{ color: active ? INK : "#C9A227" }}
                  >
                    {b.glyph}
                  </span>
                  <span className="text-[10.5px] font-medium leading-tight" style={{ color: MUTE }}>
                    {b.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Meal type */}
        <section
          className="mt-4 rounded-[20px] bg-white px-4 py-4"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 6px 20px -10px rgba(0,0,0,0.08)" }}
        >
          <div className="mb-3 flex items-baseline justify-between">
            <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">Meal type</span>
            <span className="text-[11.5px]" style={{ color: MUTE }}>
              optional
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {MEALS.map((m) => {
              const active = meal === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMeal(active ? null : m.id)}
                  data-testid={`chip-meal-${m.id}`}
                  className="rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-150 active:scale-[0.97]"
                  style={{
                    border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.07)",
                    backgroundColor: active ? "#FFF8DC" : "#FFFFFF",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected options summary */}
        {summary.length > 0 && (
          <section className="mt-5" data-testid="section-summary">
            <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTE }}>
              Toast will look for
            </span>
            <div className="flex flex-wrap gap-2">
              {summary.map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  data-testid={`tag-selected-${i}`}
                  className="rounded-full px-3 py-1.5 text-[12.5px] font-medium"
                  style={{ backgroundColor: "#FFF1B8", color: "#7A5E00" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTAs */}
      <div
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-5 pb-6 pt-4"
        style={{
          background: `linear-gradient(to top, ${CREAM} 72%, rgba(250,246,239,0))`,
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            data-testid="button-toast-choice"
            className="flex items-center justify-center gap-1.5 rounded-full py-3.5 font-['Plus_Jakarta_Sans'] text-[14.5px] font-semibold transition-transform active:scale-[0.98]"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 10px 24px -8px rgba(255,204,2,0.55)" }}
          >
            <Sparkles className="h-[17px] w-[17px]" strokeWidth={2.4} />
            Toast choice
          </button>
          <button
            type="button"
            data-testid="button-explore"
            className="flex items-center justify-center gap-1.5 rounded-full bg-white py-3.5 font-['Plus_Jakarta_Sans'] text-[14.5px] font-semibold transition-transform active:scale-[0.98]"
            style={{ border: `1.5px solid ${GOLD}`, color: INK }}
          >
            <Compass className="h-[17px] w-[17px]" strokeWidth={2.2} />
            Explore it yourself
          </button>
        </div>
      </div>
    </div>
  );
}
