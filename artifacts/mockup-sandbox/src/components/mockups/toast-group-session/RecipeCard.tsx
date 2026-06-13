import { useState } from "react";
import { ArrowLeft, Share2, ChefHat, Minus, Plus, Check, Clock, MapPin, Wallet, Leaf, Pencil, ChevronDown } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

type Ingredient = { id: string; icon: typeof Clock; label: string; value: string; options: string[] };

const INITIAL: Ingredient[] = [
  { id: "when", icon: Clock, label: "Timing", value: "Today, 7:00 PM", options: ["Today, 7:00 PM", "Tonight, 8:30 PM", "Tomorrow noon", "This weekend"] },
  { id: "where", icon: MapPin, label: "Neighborhood", value: "Near BTS Asok", options: ["Near BTS Asok", "Thonglor", "Ari", "Silom", "Old Town"] },
  { id: "budget", icon: Wallet, label: "Budget", value: "฿฿ Mid range", options: ["฿ Easy", "฿฿ Mid range", "฿฿฿ Premium"] },
  { id: "diet", icon: Leaf, label: "Dietary", value: "Vegetarian-friendly", options: ["No restrictions", "Vegetarian-friendly", "Halal", "Gluten-free"] },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function RecipeCard() {
  const [servings, setServings] = useState(4);
  const [checked, setChecked] = useState<string[]>(["when", "where"]);
  const [title, setTitle] = useState("Dinner with friends");
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const choose = (id: string, value: string) => {
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, value } : i)));
    setChecked((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setOpenId(null);
  };

  const ready = checked.length;

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-2">
        <button
          aria-label="Go back"
          data-testid="button-back"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
          From the kitchen
        </span>
      </header>

      <main className="flex-1 px-6 pb-44 pt-3">
        <div className="mb-5">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight flex items-center gap-2">
            <ChefHat className="w-7 h-7" style={{ color: GOLD }} /> Tonight's recipe
          </h1>
          <p className="text-[15px] mt-2 leading-relaxed flex items-center gap-1.5" style={{ color: "rgba(26,26,26,0.6)" }}>
            <Pencil className="w-3.5 h-3.5" style={{ color: GOLD }} /> Name it, then tap each line to pick.
          </p>
        </div>

        {/* Recipe card */}
        <div
          className="relative rounded-[24px] bg-white p-6 pt-7 overflow-hidden"
          style={{
            boxShadow: "0 18px 40px -18px rgba(0,0,0,0.18)",
            border: "1px solid rgba(0,0,0,0.05)",
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 37px, rgba(26,26,26,0.05) 38px)",
          }}
        >
          {/* tape */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-24 rotate-[-2deg]"
            style={{ backgroundColor: "rgba(255,204,2,0.45)", border: "1px solid rgba(255,204,2,0.6)" }}
          />
          {/* red margin line */}
          <div className="absolute top-0 bottom-0 left-12" style={{ width: 1.5, backgroundColor: "rgba(255,99,71,0.35)" }} />

          {/* Title block */}
          <div className="relative pl-8 mb-5">
            <div className="flex items-center gap-1.5">
              <input
                data-testid="input-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Recipe title"
                placeholder="Name this plan"
                className="flex-1 min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-snug outline-none rounded-[6px] px-1.5 -ml-1.5 py-0.5 focus:bg-[rgba(255,204,2,0.14)] transition-colors"
                style={{ borderBottom: "1px dashed rgba(26,26,26,0.18)" }}
              />
              <Pencil className="w-3.5 h-3.5 shrink-0 opacity-30" />
            </div>
            <p className="text-[13px] mt-1 px-1.5" style={{ color: MUTE }}>Recipe #842 · Serves a hungry crew</p>
          </div>

          {/* Servings stepper */}
          <div className="relative pl-8 mb-6 flex items-center justify-between">
            <span className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: MUTE }}>
              Servings
            </span>
            <div className="flex items-center gap-3">
              <button
                aria-label="Fewer servings"
                data-testid="button-servings-minus"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="w-9 h-9 rounded-full bg-[#F3F1EC] flex items-center justify-center active:scale-90 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span data-testid="text-servings" className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold w-7 text-center tabular-nums">
                {servings}
              </span>
              <button
                aria-label="More servings"
                data-testid="button-servings-plus"
                onClick={() => setServings((s) => Math.min(12, s + 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                style={{ backgroundColor: GOLD }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ingredients */}
          <p className="relative pl-8 text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: MUTE }}>
            Ingredients
          </p>
          <div className="relative pl-8 space-y-1">
            {ingredients.map((ing) => {
              const on = checked.includes(ing.id);
              const isOpen = openId === ing.id;
              const Icon = ing.icon;
              return (
                <div key={ing.id} className="py-1">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label={on ? `Mark ${ing.label} not ready` : `Mark ${ing.label} ready`}
                      data-testid={`ingredient-${ing.id}`}
                      onClick={() => toggle(ing.id)}
                      className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-colors active:scale-90"
                      style={{
                        backgroundColor: on ? GOLD : "transparent",
                        border: on ? "none" : "1.5px solid rgba(26,26,26,0.2)",
                      }}
                    >
                      {on && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </button>
                    <Icon className="w-4 h-4 shrink-0" style={{ color: MUTE }} />
                    <button
                      data-testid={`button-choose-${ing.id}`}
                      onClick={() => setOpenId((cur) => (cur === ing.id ? null : ing.id))}
                      aria-expanded={isOpen}
                      aria-label={`Choose ${ing.label}`}
                      className="flex-1 min-w-0 flex items-center gap-2 text-left py-1.5 rounded-[8px] px-2 -ml-2 active:bg-black/[0.03] transition-colors"
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold leading-tight truncate">
                          {ing.value}
                        </span>
                        <span className="block text-[12px]" style={{ color: MUTE }}>{ing.label}</span>
                      </span>
                      <ChevronDown
                        className="w-4 h-4 shrink-0 transition-transform"
                        style={{ color: MUTE, transform: isOpen ? "rotate(180deg)" : "none" }}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="pl-9 pr-1 mt-1.5 mb-1 flex flex-wrap gap-2" data-testid={`options-${ing.id}`}>
                      {ing.options.map((opt) => {
                        const selected = opt === ing.value;
                        return (
                          <button
                            key={opt}
                            data-testid={`chip-${ing.id}-${slug(opt)}`}
                            onClick={() => choose(ing.id, opt)}
                            aria-pressed={selected}
                            className="px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 active:scale-95 transition-all"
                            style={
                              selected
                                ? { backgroundColor: GOLD, color: INK }
                                : { backgroundColor: "#F3F1EC", color: "rgba(26,26,26,0.7)" }
                            }
                          >
                            {selected && <Check className="w-3 h-3" strokeWidth={3} />}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* prep note */}
        <p className="text-center text-[13px] mt-5" style={{ color: MUTE }}>
          {ready} of {ingredients.length} ingredients prepped · ~2 min to decide
        </p>
      </main>

      {/* Sticky actions */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10"
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        <div className="flex flex-col gap-3">
          <button
            data-testid="button-invite"
            className="w-full h-14 text-white rounded-full font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: LINE, boxShadow: "0 8px 20px -8px rgba(6,199,85,0.5)" }}
          >
            <Share2 className="w-5 h-5" /> Invite via LINE
          </button>
          <button
            data-testid="button-start"
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            <ChefHat className="w-5 h-5" /> Start cooking
          </button>
        </div>
      </div>
    </div>
  );
}
