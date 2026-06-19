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
  LocateFixed,
  Search,
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

const LOCATIONS = [
  { id: "sukhumvit", label: "Sukhumvit", kind: "Neighborhood", popular: true },
  { id: "silom", label: "Silom", kind: "Neighborhood", popular: true },
  { id: "siam", label: "Siam", kind: "Neighborhood", popular: true },
  { id: "ari", label: "Ari", kind: "Neighborhood", popular: true },
  { id: "thonglor", label: "Thonglor", kind: "Neighborhood", popular: true },
  { id: "chinatown", label: "Chinatown (Yaowarat)", kind: "Neighborhood", popular: true },
  { id: "ekkamai", label: "Ekkamai", kind: "Neighborhood", popular: false },
  { id: "sathorn", label: "Sathorn", kind: "Neighborhood", popular: false },
  { id: "asok", label: "Asok", kind: "BTS station", popular: false },
  { id: "phromphong", label: "Phrom Phong", kind: "BTS station", popular: false },
  { id: "iconsiam", label: "ICONSIAM", kind: "Mall", popular: false },
  { id: "emquartier", label: "EmQuartier", kind: "Mall", popular: false },
  { id: "centralworld", label: "CentralWorld", kind: "Mall", popular: false },
];

const BUDGETS = [
  { id: "cheap", glyph: "฿", label: "Cheap" },
  { id: "mid", glyph: "฿฿", label: "Mid" },
  { id: "fancy", glyph: "฿฿฿", label: "Fancy" },
  { id: "splurge", glyph: "฿฿฿฿", label: "Splurge" },
];

const DINING = [
  { id: "street", emoji: "🍢", label: "Street food" },
  { id: "rooftop", emoji: "🏙️", label: "Rooftop" },
  { id: "riverside", emoji: "🌊", label: "Riverside" },
  { id: "buffet", emoji: "🍽️", label: "Buffet" },
  { id: "dessert", emoji: "🍰", label: "Desserts" },
  { id: "cafe", emoji: "☕", label: "Cafe" },
  { id: "finedining", emoji: "🍷", label: "Fine dining" },
  { id: "latenight", emoji: "🌙", label: "Late night" },
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
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [locQuery, setLocQuery] = useState("");
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);
  const [budget, setBudget] = useState<string | null>(null);
  const [dining, setDining] = useState<string | null>(null);

  const toggleLoc = (id: string) => {
    setUseCurrentLoc(false);
    setLocQuery("");
    setSelectedLocs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const toggleCurrentLoc = () => {
    const next = !useCurrentLoc;
    setUseCurrentLoc(next);
    if (next) {
      setSelectedLocs([]);
      setLocQuery("");
    }
  };

  const greeting = greetingFor(new Date().getHours());

  const cravingObj = CRAVINGS.find((c) => c.id === craving);
  const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label;
  const diningLabel = DINING.find((d) => d.id === dining)?.label;

  const q = locQuery.trim().toLowerCase();
  const locResults = q ? LOCATIONS.filter((l) => l.label.toLowerCase().includes(q)) : [];
  const popularLocs = LOCATIONS.filter((l) => l.popular && !selectedLocs.includes(l.id));
  const selectedLocObjs = LOCATIONS.filter((l) => selectedLocs.includes(l.id));
  const selectedLocLabels = selectedLocObjs.map((l) => l.label);

  const locationLabels = useCurrentLoc ? ["Near me"] : selectedLocLabels;
  const locationCount = useCurrentLoc ? 1 : selectedLocs.length;
  const filterCount = locationCount + (budget ? 1 : 0) + (dining ? 1 : 0);

  const filterSummaryText = [
    ...locationLabels,
    ...(budgetLabel ? [budgetLabel] : []),
    ...(diningLabel ? [diningLabel] : []),
  ].join(" · ");
  const hasSummary = filterCount > 0 && !filtersOpen;

  const summary: string[] = [
    ...(cravingObj ? [cravingObj.title] : []),
    ...locationLabels,
    ...(budgetLabel ? [`${budgetLabel} budget`] : []),
    ...(diningLabel ? [diningLabel] : []),
  ];

  const ready = !!craving;

  const clearFilters = () => {
    setSelectedLocs([]);
    setUseCurrentLoc(false);
    setLocQuery("");
    setBudget(null);
    setDining(null);
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
                {hasSummary ? filterSummaryText : "Location, budget & style — optional"}
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
                {/* Location */}
                <div className="mb-2.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" color={MUTE} strokeWidth={2.2} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.07em]" style={{ color: MUTE }}>
                    Location
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 rounded-2xl px-3 transition-colors duration-150"
                  style={{
                    border: useCurrentLoc ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.10)",
                    backgroundColor: useCurrentLoc ? "#FFF8DC" : "#FFFFFF",
                  }}
                >
                  {useCurrentLoc ? (
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: GOLD }}
                    >
                      <LocateFixed className="h-4 w-4" color={INK} strokeWidth={2.4} />
                    </span>
                  ) : (
                    <Search className="h-4 w-4 shrink-0" color={MUTE} strokeWidth={2.2} />
                  )}

                  {useCurrentLoc ? (
                    <span
                      className="flex min-h-[44px] flex-1 items-center text-[14px] font-semibold"
                      style={{ color: INK }}
                      data-testid="text-current-location"
                    >
                      Current location
                    </span>
                  ) : (
                    <input
                      type="text"
                      inputMode="search"
                      aria-label="Search location"
                      value={locQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocQuery(v);
                        if (v.trim()) setUseCurrentLoc(false);
                      }}
                      data-testid="input-location-search"
                      placeholder="Search area, BTS, or mall…"
                      className="min-h-[44px] flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#9A9387]"
                      style={{ color: INK }}
                    />
                  )}

                  {locQuery ? (
                    <button
                      type="button"
                      onClick={() => setLocQuery("")}
                      data-testid="button-clear-location-search"
                      aria-label="Clear search"
                      className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center active:opacity-60"
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      >
                        <X className="h-3.5 w-3.5" color={MUTE} strokeWidth={2.4} />
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleCurrentLoc}
                      data-testid="button-current-location"
                      aria-pressed={useCurrentLoc}
                      aria-label={
                        useCurrentLoc ? "Clear current location" : "Use my current location"
                      }
                      className="-mr-1.5 flex h-11 min-w-[44px] shrink-0 items-center justify-center active:opacity-70"
                    >
                      {useCurrentLoc ? (
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full"
                          style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
                        >
                          <X className="h-3.5 w-3.5" color={INK} strokeWidth={2.5} />
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-2.5 pr-3"
                          style={{ backgroundColor: "rgba(255,90,95,0.10)" }}
                        >
                          <LocateFixed
                            className="h-[15px] w-[15px]"
                            color="#FF5A5F"
                            strokeWidth={2.3}
                          />
                          <span
                            className="text-[12.5px] font-semibold"
                            style={{ color: "#FF5A5F" }}
                          >
                            Near me
                          </span>
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {selectedLocObjs.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2" data-testid="list-selected-locations">
                    {selectedLocObjs.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => toggleLoc(l.id)}
                        data-testid={`chip-selected-loc-${l.id}`}
                        aria-label={`Remove ${l.label}`}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full py-1.5 pl-3.5 pr-2 text-[13px] font-medium transition-all duration-150 active:scale-[0.97]"
                        style={{ border: `1.5px solid ${GOLD}`, backgroundColor: "#FFF8DC" }}
                      >
                        {l.label}
                        <span
                          className="flex h-[18px] w-[18px] items-center justify-center rounded-full"
                          style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
                        >
                          <X className="h-3 w-3" color={INK} strokeWidth={2.6} />
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {q ? (
                  <div className="mt-2.5 flex flex-col gap-1" data-testid="list-location-results">
                    {locResults.length > 0 ? (
                      locResults.map((l) => {
                        const active = selectedLocs.includes(l.id);
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => toggleLoc(l.id)}
                            data-testid={`option-location-${l.id}`}
                            aria-pressed={active}
                            className="flex min-h-[44px] items-center gap-2.5 rounded-xl px-2.5 text-left transition-colors duration-150 active:bg-black/[0.03]"
                            style={{ backgroundColor: active ? "#FFF8DC" : "transparent" }}
                          >
                            <span
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                            >
                              <MapPin
                                className="h-4 w-4"
                                color={active ? "#8C6510" : MUTE}
                                strokeWidth={2.2}
                              />
                            </span>
                            <span className="flex-1">
                              <span className="block text-[13.5px] font-medium leading-tight">
                                {l.label}
                              </span>
                              <span className="block text-[11px] leading-snug" style={{ color: MUTE }}>
                                {l.kind}
                              </span>
                            </span>
                            {active && (
                              <Check className="h-4 w-4 shrink-0" strokeWidth={3} color={INK} />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p
                        className="px-1 py-2 text-[13px]"
                        style={{ color: MUTE }}
                        data-testid="text-no-location-results"
                      >
                        No matches for “{locQuery.trim()}”. Try a nearby area.
                      </p>
                    )}
                  </div>
                ) : (
                  popularLocs.length > 0 && (
                    <>
                      <p
                        className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.06em]"
                        style={{ color: MUTE }}
                      >
                        Popular areas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularLocs.map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => toggleLoc(l.id)}
                            data-testid={`chip-location-${l.id}`}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-all duration-150 active:scale-[0.97]"
                            style={{
                              border: "1px solid rgba(0,0,0,0.07)",
                              backgroundColor: "#FFFFFF",
                            }}
                          >
                            <span className="text-[14px] leading-none" style={{ color: MUTE }}>
                              +
                            </span>
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )
                )}

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

                {/* Dining style */}
                <div className="mb-2.5 mt-5 flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5" color={MUTE} strokeWidth={2.2} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.07em]" style={{ color: MUTE }}>
                    Dining style
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DINING.map((d) => {
                    const active = dining === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDining(active ? null : d.id)}
                        data-testid={`chip-dining-${d.id}`}
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
                        <span className="text-[18px] leading-none">{d.emoji}</span>
                        <span className="text-[11.5px] font-medium leading-tight">{d.label}</span>
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
