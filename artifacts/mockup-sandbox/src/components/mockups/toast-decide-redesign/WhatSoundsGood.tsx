import { useState } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Sparkles,
  ArrowRight,
  MapPin,
  Wallet,
  UtensilsCrossed,
  X,
} from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A17";
const MUTE = "#6B6359";

type Craving = {
  id: string;
  emoji: string;
  title: string;
  sub: string;
  tint: string;
};

const CRAVINGS: Craving[] = [
  { id: "comfort", emoji: "🍜", title: "Comforting & easy", sub: "Cozy, familiar flavors", tint: "#FFF1E0" },
  { id: "exciting", emoji: "🌍", title: "Something exciting", sub: "Bold and new", tint: "#E8F4FF" },
  { id: "healthy", emoji: "🥗", title: "Healthy-ish", sub: "Fresh and light", tint: "#E9F8EC" },
  { id: "cheap", emoji: "💸", title: "Cheap but good", sub: "Big taste, small spend", tint: "#FFF6DA" },
  { id: "treat", emoji: "✨", title: "Worth going out for", sub: "A proper treat", tint: "#F3ECFF" },
  { id: "surprise", emoji: "🎲", title: "Surprise me", sub: "Let Toast choose", tint: "#FFE9EC" },
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
  { id: "cheap", glyph: "฿", label: "Cheap" },
  { id: "mid", glyph: "฿฿", label: "Mid" },
  { id: "fancy", glyph: "฿฿฿", label: "Fancy" },
  { id: "splurge", glyph: "฿฿฿฿", label: "Splurge" },
];

const MEALS = [
  { id: "meal", label: "Meal" },
  { id: "dessert", label: "Dessert" },
  { id: "buffet", label: "Buffet" },
  { id: "coffee", label: "Coffee" },
];

function greetingFor(hour: number): { label: string; emoji: string } {
  if (hour < 11) return { label: "Breakfast o'clock", emoji: "☀️" };
  if (hour < 15) return { label: "Lunchtime in Bangkok", emoji: "🌤️" };
  if (hour < 18) return { label: "Afternoon bite", emoji: "🍵" };
  if (hour < 22) return { label: "Dinner time", emoji: "🌆" };
  return { label: "Late-night cravings", emoji: "🌙" };
}

export default function WhatSoundsGood() {
  const [craving, setCraving] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [where, setWhere] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [meal, setMeal] = useState<string | null>(null);

  const toggleWhere = (id: string) =>
    setWhere((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const greeting = greetingFor(new Date().getHours());

  const cravingObj = CRAVINGS.find((c) => c.id === craving);
  const whereLabels = WHERE.filter((w) => where.includes(w.id)).map((w) => w.label);
  const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label;
  const mealLabel = MEALS.find((m) => m.id === meal)?.label;

  const filterCount = where.length + (budget ? 1 : 0) + (meal ? 1 : 0);

  const filterSummaryText = [
    ...whereLabels,
    ...(budgetLabel ? [budgetLabel] : []),
    ...(mealLabel ? [mealLabel] : []),
  ].join(" · ");
  const hasSummary = filterCount > 0 && !filtersOpen;

  const summary: string[] = [
    ...(cravingObj ? [cravingObj.title] : []),
    ...whereLabels,
    ...(budgetLabel ? [`${budgetLabel} budget`] : []),
    ...(mealLabel ? [mealLabel] : []),
  ];

  const ready = !!craving;

  const clearFilters = () => {
    setWhere([]);
    setBudget(null);
    setMeal(null);
  };

  return (
    <div
      className="min-h-screen w-full font-['Inter'] antialiased"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto w-full max-w-[430px] px-5 pb-44 pt-5">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            data-testid="button-back"
            aria-label="Back"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white transition-transform active:scale-95"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
          >
            <ArrowLeft className="h-5 w-5" color={INK} />
          </button>
          <span
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium"
            style={{ border: "1px solid rgba(0,0,0,0.06)", color: INK }}
            data-testid="chip-greeting"
          >
            <span>{greeting.emoji}</span>
            {greeting.label}
          </span>
        </div>

        {/* Header with mascot */}
        <header className="mb-6 flex items-end justify-between gap-3">
          <div className="flex-1">
            <h1
              className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[1.1] tracking-[-0.02em]"
              data-testid="text-title"
            >
              What sounds good?
            </h1>
            <p className="mt-2 text-[15px] leading-snug" style={{ color: MUTE }}>
              Tap a vibe — I'll find the perfect spot for you.
            </p>
          </div>
          <img
            src="/__mockup/images/toast_mascot.png"
            alt=""
            aria-hidden="true"
            className="h-[68px] w-[68px] shrink-0 object-contain select-none"
            data-testid="img-mascot"
          />
        </header>

        {/* Mood grid — the one required choice */}
        <div className="grid grid-cols-2 gap-3">
          {CRAVINGS.map((c) => {
            const active = craving === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCraving(active ? null : c.id)}
                data-testid={`card-craving-${c.id}`}
                aria-pressed={active}
                className="relative flex min-h-[118px] flex-col items-start rounded-[22px] bg-white p-4 text-left transition-all duration-200 active:scale-[0.97]"
                style={{
                  border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: active
                    ? "0 12px 30px -10px rgba(255,204,2,0.5)"
                    : "0 6px 20px -12px rgba(0,0,0,0.12)",
                  transform: active ? "translateY(-2px)" : "none",
                }}
              >
                {active && (
                  <span
                    className="absolute right-3 top-3 flex h-[22px] w-[22px] items-center justify-center rounded-full"
                    style={{ backgroundColor: GOLD, boxShadow: "0 2px 8px rgba(255,204,2,0.5)" }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} color={INK} />
                  </span>
                )}
                <span
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-full text-[24px] leading-none"
                  style={{ backgroundColor: c.tint }}
                >
                  {c.emoji}
                </span>
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

        {/* Optional fine-tune drawer — collapsed by default to keep the choice simple */}
        <section
          className="mt-4 overflow-hidden rounded-[20px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 6px 20px -14px rgba(0,0,0,0.10)" }}
        >
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            data-testid="button-filters-toggle"
            aria-expanded={filtersOpen}
            aria-controls="finetune-panel"
            className="flex w-full items-center gap-3 px-4 py-4"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,90,95,0.10)" }}
            >
              <SlidersHorizontal className="h-[18px] w-[18px]" color="#FF5A5F" strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-left">
              <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">
                Fine-tune your search
              </span>
              <span
                className="block text-[12.5px] leading-snug line-clamp-1"
                style={{ color: hasSummary ? INK : MUTE, fontWeight: hasSummary ? 500 : 400 }}
              >
                {hasSummary ? filterSummaryText : "Area, budget & meal — optional"}
              </span>
            </span>
            {filterCount > 0 && (
              <span
                className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-bold"
                style={{ backgroundColor: GOLD, color: INK }}
                data-testid="badge-filter-count"
              >
                {filterCount}
              </span>
            )}
            <ChevronDown
              className="h-5 w-5 transition-transform duration-200"
              color={MUTE}
              style={{ transform: filtersOpen ? "rotate(180deg)" : "none" }}
            />
          </button>

          <div
            id="finetune-panel"
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: filtersOpen ? "1fr" : "0fr" }}
          >
            <div
              className="overflow-hidden"
              aria-hidden={!filtersOpen}
              {...(filtersOpen ? {} : ({ inert: true } as any))}
            >
              <div
                className="mx-4 border-t pb-5 pt-4"
                style={{
                  borderColor: "rgba(0,0,0,0.06)",
                  opacity: filtersOpen ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              >
                {/* Area */}
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" color={MUTE} strokeWidth={2.2} />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.07em]" style={{ color: MUTE }}>
                      Area
                    </span>
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: MUTE }}>
                    Pick a few
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {WHERE.map((w) => {
                    const active = where.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => toggleWhere(w.id)}
                        data-testid={`chip-where-${w.id}`}
                        aria-pressed={active}
                        className="relative flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center transition-all duration-150 active:scale-[0.97]"
                        style={{
                          border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.07)",
                          backgroundColor: active ? "#FFF8DC" : "#FFFFFF",
                          boxShadow: active ? "0 6px 16px -10px rgba(255,204,2,0.55)" : "none",
                        }}
                      >
                        {active && (
                          <span
                            className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full"
                            style={{ backgroundColor: GOLD }}
                          >
                            <Check className="h-2.5 w-2.5" strokeWidth={3.5} color={INK} />
                          </span>
                        )}
                        <span className="text-[18px] leading-none">{w.emoji}</span>
                        <span className="text-[11.5px] font-medium leading-tight">{w.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Budget */}
                <div className="mb-2.5 mt-5 flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5" color={MUTE} strokeWidth={2.2} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.07em]" style={{ color: MUTE }}>
                    Budget
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {BUDGETS.map((b) => {
                    const active = budget === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudget(active ? null : b.id)}
                        data-testid={`chip-budget-${b.id}`}
                        aria-pressed={active}
                        className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-all duration-150 active:scale-[0.97]"
                        style={{
                          border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.07)",
                          backgroundColor: active ? "#FFF8DC" : "#FFFFFF",
                          boxShadow: active ? "0 6px 16px -10px rgba(255,204,2,0.55)" : "none",
                        }}
                      >
                        <span
                          className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-none"
                          style={{ color: active ? INK : "#8C6510" }}
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

                {/* Meal type */}
                <div className="mb-2.5 mt-5 flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5" color={MUTE} strokeWidth={2.2} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.07em]" style={{ color: MUTE }}>
                    Meal type
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
                        aria-pressed={active}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-all duration-150 active:scale-[0.97]"
                        style={{
                          border: active ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.07)",
                          backgroundColor: active ? "#FFF8DC" : "#FFFFFF",
                        }}
                      >
                        {active && <Check className="h-3.5 w-3.5" strokeWidth={3} color={INK} />}
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                {filterCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-opacity active:opacity-60"
                      style={{ color: "#E0484D" }}
                    >
                      <X className="h-4 w-4" strokeWidth={2.4} />
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reassurance summary */}
        {summary.length > 0 && (
          <section className="mt-5" data-testid="section-summary">
            <span
              className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: MUTE }}
            >
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

      {/* Sticky CTA — one clear primary action */}
      <div
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-5 pb-6 pt-5"
        style={{ background: `linear-gradient(to top, ${CREAM} 70%, rgba(250,246,239,0))` }}
      >
        {!ready && (
          <p className="mb-2.5 text-center text-[13px] font-medium" style={{ color: MUTE }} data-testid="text-cta-hint">
            Pick a vibe to get started
          </p>
        )}
        <button
          type="button"
          disabled={!ready}
          data-testid="button-toast-decide"
          className="flex w-full items-center justify-center gap-2 rounded-full py-4 font-['Plus_Jakarta_Sans'] text-[15.5px] font-bold transition-all duration-200 active:scale-[0.98]"
          style={
            ready
              ? { backgroundColor: GOLD, color: INK, boxShadow: "0 12px 26px -8px rgba(255,204,2,0.6)" }
              : { backgroundColor: "#ECE6DB", color: "#8A8170", boxShadow: "none" }
          }
        >
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.4} />
          Toast, decide for me
          {ready && <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.4} />}
        </button>
        <button
          type="button"
          data-testid="button-browse"
          className="mt-2 flex min-h-[44px] w-full items-center justify-center text-[14px] font-semibold transition-opacity active:opacity-60"
          style={{ color: MUTE }}
        >
          Browse all spots instead
        </button>
      </div>
    </div>
  );
}
