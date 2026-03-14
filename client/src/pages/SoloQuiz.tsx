import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Utensils, MapPin, Sparkles, ChevronDown } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { trackEvent } from "@/lib/analytics";

const CUISINES = [
  { emoji: "\u{1F35C}", label: "Thai" },
  { emoji: "\u{1F363}", label: "Japanese" },
  { emoji: "\u{1F95F}", label: "Chinese" },
  { emoji: "\u{1F372}", label: "Korean" },
  { emoji: "\u{1F35D}", label: "Italian" },
  { emoji: "\u{1F990}", label: "Seafood" },
  { emoji: "\u{1F35B}", label: "Indian" },
  { emoji: "\u{1F32E}", label: "Mexican" },
  { emoji: "\u{1F969}", label: "Western" },
];

const DIET_RESTRICTIONS = [
  { emoji: "\u{1F96C}", label: "Vegan" },
  { emoji: "\u{1F54C}", label: "Halal" },
  { emoji: "\u{1F33E}", label: "Gluten-Free" },
  { emoji: "\u{1F95B}", label: "Dairy-Free" },
  { emoji: "\u{1F953}", label: "Keto" },
  { emoji: "\u{1F437}", label: "No Pork" },
];

const LOCATIONS = [
  { emoji: "\u{1F362}", label: "Street food" },
  { emoji: "\u{1F37D}\u{FE0F}", label: "Restaurants" },
  { emoji: "\u{1F687}", label: "Near BTS" },
  { emoji: "\u{1F3EC}", label: "At the mall" },
  { emoji: "\u{1F319}", label: "Late night" },
  { emoji: "\u{1F30A}", label: "By the river" },
  { emoji: "\u{1F4C8}", label: "Trendy spots" },
  { emoji: "\u{1F3D9}\u{FE0F}", label: "Rooftops" },
];

const BUDGETS = [
  { id: "cheap", icon: "\u{0E3F}", label: "Cheap", sub: "Under 150" },
  { id: "moderate", icon: "\u{0E3F}\u{0E3F}", label: "Moderate", sub: "150-500" },
  { id: "fancy", icon: "\u{0E3F}\u{0E3F}\u{0E3F}", label: "Fancy", sub: "500-1500" },
  { id: "splurge", icon: "\u{0E3F}\u{0E3F}\u{0E3F}\u{0E3F}", label: "Splurge", sub: "1500+" },
];

const INTERESTS = [
  { emoji: "\u{2B50}", label: "Popular spots" },
  { emoji: "\u{1F4B0}", label: "Budget-friendly" },
  { emoji: "\u{2600}\u{FE0F}", label: "Outdoor dining" },
  { emoji: "\u{1F370}", label: "Dessert" },
  { emoji: "\u{2615}", label: "Coffee" },
  { emoji: "\u{1F957}", label: "Vegetarian" },
  { emoji: "\u{1F336}\u{FE0F}", label: "Hot & spicy" },
  { emoji: "\u{1F372}", label: "Comfort food" },
  { emoji: "\u{1F942}", label: "Fine dining" },
];

function SectionCard({ title, icon: Icon, iconColor, expanded, onToggle, children, testId, badge }: {
  title: string;
  icon: any;
  iconColor: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  testId: string;
  badge?: number;
}) {
  return (
    <motion.div
      layout
      className="bg-white rounded-[20px] overflow-hidden border border-gray-100/80"
      style={{ boxShadow: expanded ? "0 6px 24px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.03)" }}
      data-testid={testId}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50/50 transition-colors"
        data-testid={`${testId}-toggle`}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}15` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: iconColor }} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[14px] font-bold text-foreground">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          {badge !== undefined && badge > 0 && (
            <span className="text-[11px] font-bold text-white bg-foreground rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>
          )}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChipGrid({ items, selected, onToggle, testIdPrefix, maxSelect }: {
  items: { emoji: string; label: string }[];
  selected: string[];
  onToggle: (label: string) => void;
  testIdPrefix: string;
  maxSelect?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isSelected = selected.includes(item.label);
        const atMax = maxSelect !== undefined && selected.length >= maxSelect && !isSelected;
        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.93 }}
            onClick={() => !atMax && onToggle(item.label)}
            data-testid={`${testIdPrefix}-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200 border ${
              isSelected
                ? "bg-foreground text-white border-foreground"
                : atMax
                  ? "bg-gray-50/50 border-gray-100/40 text-muted-foreground/40"
                  : "bg-white border-gray-200/80 text-foreground"
            }`}
            style={isSelected ? { boxShadow: "0 4px 14px -3px rgba(0,0,0,0.15)" } : {}}
          >
            <span className="text-base">{item.emoji}</span>
            <span>{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function SoloQuiz() {
  const [, navigate] = useLocation();
  const [expandedSection, setExpandedSection] = useState<string>("cravings");

  useEffect(() => {
    trackEvent("quiz_start");
  }, []);

  const [selections, setSelections] = useState<{ cuisines: string[]; diet: string[]; locations: string[]; budget: string; interests: string[] }>({
    cuisines: [],
    diet: [],
    locations: [],
    budget: "",
    interests: [],
  });

  const toggleSelection = (category: keyof typeof selections, item: string) => {
    setSelections((prev) => {
      const val = prev[category];
      if (Array.isArray(val)) {
        if (val.includes(item)) {
          return { ...prev, [category]: val.filter((i) => i !== item) };
        }
        if (val.length >= 3) return prev;
        return { ...prev, [category]: [...val, item] };
      }
      return { ...prev, [category]: prev[category] === item ? "" : item };
    });
  };

  const toggleSection = (key: string) => {
    setExpandedSection(prev => prev === key ? "" : key);
  };

  const totalSelected = selections.cuisines.length + selections.diet.length + selections.locations.length + (selections.budget ? 1 : 0) + selections.interests.length;

  const budgetDisplayMap: Record<string, string> = { cheap: "Cheap", moderate: "Moderate", fancy: "Fancy", splurge: "Expensive" };

  const handleStart = () => {
    const params = new URLSearchParams();
    if (selections.cuisines.length) params.set("cuisines", selections.cuisines.join(","));
    if (selections.diet.length) params.set("diet", selections.diet.join(","));
    if (selections.locations.length) params.set("locations", selections.locations.join(","));
    if (selections.budget) params.set("budget", budgetDisplayMap[selections.budget] || selections.budget);
    if (selections.interests.length) params.set("interests", selections.interests.join(","));
    const qs = params.toString();
    navigate(`/solo/results${qs ? `?${qs}` : ""}`);
  };

  const cravingsBadge = selections.cuisines.length + selections.diet.length;
  const settingBadge = selections.locations.length + (selections.budget ? 1 : 0);
  const interestsBadge = selections.interests.length;

  return (
    <div className="w-full h-[100dvh] bg-[#F8F8F7] flex flex-col overflow-hidden" data-testid="solo-quiz-page">
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-100/60 z-40">
        <div className="flex items-center gap-3 px-5 pt-12 pb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center active:scale-90 transition-all duration-200 flex-shrink-0"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-foreground" data-testid="text-page-title">Solo Session</h1>
            <p className="text-[11px] text-muted-foreground">Personalize your food discovery</p>
          </div>
          <button
            onClick={handleStart}
            className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full active:scale-95"
            data-testid="button-quiz-skip"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 hide-scrollbar">
        <div className="px-4 pt-4 space-y-3">

          <SectionCard
            title="Cravings"
            icon={Utensils}
            iconColor="#FFCC02"
            expanded={expandedSection === "cravings"}
            onToggle={() => toggleSection("cravings")}
            testId="section-cravings"
            badge={cravingsBadge}
          >
            <p className="text-[11px] font-semibold text-muted-foreground mb-2.5">Cuisine <span className="font-normal text-muted-foreground/60">(up to 3)</span></p>
            <ChipGrid
              items={CUISINES}
              selected={selections.cuisines}
              onToggle={(label) => toggleSelection("cuisines", label)}
              testIdPrefix="chip-cuisine"
              maxSelect={3}
            />

            <p className="text-[11px] font-semibold text-muted-foreground mb-2.5 mt-5">Dietary <span className="font-normal text-muted-foreground/60">(optional)</span></p>
            <ChipGrid
              items={DIET_RESTRICTIONS}
              selected={selections.diet}
              onToggle={(label) => toggleSelection("diet", label)}
              testIdPrefix="chip-diet"
              maxSelect={3}
            />
          </SectionCard>

          <SectionCard
            title="Setting & Budget"
            icon={MapPin}
            iconColor="#E11D48"
            expanded={expandedSection === "setting"}
            onToggle={() => toggleSection("setting")}
            testId="section-setting"
            badge={settingBadge}
          >
            <p className="text-[11px] font-semibold text-muted-foreground mb-2.5">Where sounds good?</p>
            <ChipGrid
              items={LOCATIONS}
              selected={selections.locations}
              onToggle={(label) => toggleSelection("locations", label)}
              testIdPrefix="chip-location"
              maxSelect={3}
            />

            <p className="text-[11px] font-semibold text-muted-foreground mb-2.5 mt-5">Budget range</p>
            <div className="grid grid-cols-4 gap-1.5">
              {BUDGETS.map((b) => {
                const active = selections.budget === b.id;
                return (
                  <motion.button
                    key={b.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSelections(prev => ({ ...prev, budget: active ? "" : b.id }))}
                    data-testid={`chip-budget-${b.id}`}
                    className={`flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-white border-2 border-foreground"
                        : "bg-gray-50 border border-gray-100/60"
                    }`}
                    style={{
                      boxShadow: active ? "0 3px 12px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    <span className={`text-[13px] font-bold ${active ? "text-foreground" : "text-muted-foreground/60"}`}>
                      {b.icon}
                    </span>
                    <span className={`text-[9px] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{b.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Interests"
            icon={Sparkles}
            iconColor="#6C2BD9"
            expanded={expandedSection === "interests"}
            onToggle={() => toggleSection("interests")}
            testId="section-interests"
            badge={interestsBadge}
          >
            <p className="text-[11px] font-semibold text-muted-foreground mb-2.5">What sounds good? <span className="font-normal text-muted-foreground/60">(up to 3)</span></p>
            <ChipGrid
              items={INTERESTS}
              selected={selections.interests}
              onToggle={(label) => toggleSelection("interests", label)}
              testIdPrefix="chip-interest"
              maxSelect={3}
            />
          </SectionCard>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-t border-gray-100/60 px-5 py-3 pb-5 safe-bottom">
        <button
          onClick={handleStart}
          data-testid="button-quiz-next"
          className="w-full py-4 rounded-2xl bg-[#FFCC02] text-[#2d2000] font-bold text-[15px] active:scale-[0.97] transition-transform duration-200 flex items-center justify-center gap-2"
          style={{ boxShadow: "0 8px 25px -5px rgba(255,204,2,0.4)" }}
        >
          <Sparkles className="w-4 h-4" />
          {totalSelected > 0 ? `Let's Go! (${totalSelected} selected)` : "Let's Go!"}
        </button>
      </div>
    </div>
  );
}
