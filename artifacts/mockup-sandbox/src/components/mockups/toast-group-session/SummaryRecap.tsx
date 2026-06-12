import { useState } from "react";
import { ArrowLeft, Share2, CheckCircle2, ChevronRight, MessageSquare, Play, Edit3, Check } from "lucide-react";

const LOCATIONS = [
  { id: "bts", icon: "🚆", label: "Near BTS" },
  { id: "mall", icon: "🏬", label: "At the mall" },
  { id: "street", icon: "🍢", label: "Street food" },
  { id: "rooftop", icon: "🌇", label: "Rooftop" },
  { id: "riverside", icon: "🌊", label: "Riverside" },
  { id: "latenight", icon: "🌙", label: "Late night" },
];

const BUDGETS = [
  { id: "1", icon: "฿", label: "Cheap eats" },
  { id: "2", icon: "฿฿", label: "Mid range" },
  { id: "3", icon: "฿฿฿", label: "Fancy" },
  { id: "4", icon: "฿฿฿฿", label: "Splurge" },
];

const RESTRICTIONS = [
  { id: "halal", icon: "🕌", label: "Halal" },
  { id: "vegan", icon: "🥬", label: "Vegan" },
  { id: "vegetarian", icon: "🥗", label: "Vegetarian" },
  { id: "no-pork", icon: "🐷", label: "No Pork" },
];

export default function SummaryRecap() {
  const [editingStep, setEditingStep] = useState<number | null>(null);

  const [date, setDate] = useState<string>("Today");
  const [time, setTime] = useState<string>("Dinner (7pm)");
  
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["bts"]);
  const [selectedBudget, setSelectedBudget] = useState<string>("2");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  const whenSummary = `${date}, ${time}`;
    
  const whereSummary = selectedLocations.length > 0 
    ? selectedLocations.map(l => LOCATIONS.find(loc => loc.id === l)?.label).join(", ")
    : "Anywhere";

  const prefsSummaryArr: string[] = [];
  if (selectedBudget) prefsSummaryArr.push(BUDGETS.find(b => b.id === selectedBudget)?.label ?? "");
  if (selectedRestrictions.length > 0) prefsSummaryArr.push(`${selectedRestrictions.length} dietary needs`);
  const prefsSummary = prefsSummaryArr.length > 0 ? prefsSummaryArr.join(" & ") : "No special preferences";

  const toggleLocation = (id: string) => {
    setSelectedLocations(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleRestriction = (id: string) => {
    setSelectedRestrictions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleEdit = (step: number) => {
    if (editingStep === step) {
      setEditingStep(null);
    } else {
      setEditingStep(step);
    }
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] relative overflow-hidden flex flex-col font-['Inter'] text-[#1A1A1A]">
      <header className="flex items-center justify-between px-6 pt-14 pb-4">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-40 overflow-y-auto">
        <div className="mb-10 mt-2 text-center">
          <div className="w-16 h-16 bg-[#FFCC02]/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-[#FFCC02]" />
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Here's the plan
          </h1>
          <p className="text-[15px] text-[#1A1A1A]/60 mt-2 max-w-[280px] mx-auto leading-relaxed">
            Looks good? Invite friends to vote or tweak it before sharing.
          </p>
        </div>

        {/* Timeline Recap */}
        <div className="relative pl-6 pr-2 py-2">
          {/* Vertical connecting line */}
          <div className="absolute left-[38px] top-6 bottom-6 w-[2px] bg-[#1A1A1A]/10 rounded-full"></div>

          {/* Step 1: When */}
          <div className="relative flex items-start gap-5 mb-10 group">
            <div className="relative z-10 w-6 h-6 rounded-full bg-[#06C755] border-[3px] border-[#FAF6EF] mt-1 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-black/[0.06] shadow-sm relative">
              {editingStep === 1 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">When are we eating?</span>
                    <button onClick={() => setEditingStep(null)} className="w-6 h-6 bg-black/5 rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5"/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Today", "Tomorrow", "Weekend"].map(d => (
                      <button key={d} onClick={() => setDate(d)} className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border ${date === d ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-transparent text-[#1A1A1A] border-black/10"}`}>{d}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Lunch (12pm)", "Dinner (7pm)", "Late night"].map(t => (
                      <button key={t} onClick={() => setTime(t)} className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border ${time === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-transparent text-[#1A1A1A] border-black/10"}`}>{t}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div onClick={() => handleEdit(1)} className="cursor-pointer">
                  <p className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 mb-1">When</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] font-medium text-[#1A1A1A]">{whenSummary}</p>
                    <Edit3 className="w-4 h-4 text-[#1A1A1A]/20" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Where */}
          <div className="relative flex items-start gap-5 mb-10 group">
            <div className="relative z-10 w-6 h-6 rounded-full bg-[#06C755] border-[3px] border-[#FAF6EF] mt-1 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-black/[0.06] shadow-sm relative">
              {editingStep === 2 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">Where to?</span>
                    <button onClick={() => setEditingStep(null)} className="w-6 h-6 bg-black/5 rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5"/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LOCATIONS.map(l => (
                      <button key={l.id} onClick={() => toggleLocation(l.id)} className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border flex items-center gap-1.5 ${selectedLocations.includes(l.id) ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-transparent text-[#1A1A1A] border-black/10"}`}>
                        <span>{l.icon}</span> {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div onClick={() => handleEdit(2)} className="cursor-pointer">
                  <p className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 mb-1">Where</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] font-medium text-[#1A1A1A] line-clamp-1">{whereSummary}</p>
                    <Edit3 className="w-4 h-4 text-[#1A1A1A]/20" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Who & Preferences */}
          <div className="relative flex items-start gap-5 group">
            <div className="relative z-10 w-6 h-6 rounded-full bg-[#06C755] border-[3px] border-[#FAF6EF] mt-1 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-black/[0.06] shadow-sm relative">
              {editingStep === 3 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">Budget & Diet</span>
                    <button onClick={() => setEditingStep(null)} className="w-6 h-6 bg-black/5 rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5"/></button>
                  </div>
                  <div className="flex border border-black/10 rounded-lg overflow-hidden p-0.5 bg-black/5">
                    {BUDGETS.map(b => (
                      <button key={b.id} onClick={() => setSelectedBudget(b.id === selectedBudget ? "" : b.id)} className={`flex-1 py-1.5 text-[13px] font-medium rounded-md ${selectedBudget === b.id ? "bg-white shadow-sm text-[#1A1A1A]" : "text-[#1A1A1A]/60"}`}>
                        {b.icon}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RESTRICTIONS.map(r => (
                      <button key={r.id} onClick={() => toggleRestriction(r.id)} className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border flex items-center gap-1.5 ${selectedRestrictions.includes(r.id) ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-transparent text-[#1A1A1A] border-black/10"}`}>
                        <span>{r.icon}</span> {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div onClick={() => handleEdit(3)} className="cursor-pointer">
                  <p className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 mb-1">Preferences</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] font-medium text-[#1A1A1A]">{prefsSummary}</p>
                    <Edit3 className="w-4 h-4 text-[#1A1A1A]/20" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent pt-12 pb-8 px-6 z-20 pointer-events-none">
        <div className="pointer-events-auto flex gap-3">
          <button className="flex-1 h-14 bg-[#1A1A1A] text-white rounded-full font-medium text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_20px_rgba(26,26,26,0.3)]">
            <Play className="w-4 h-4 fill-current" /> Start Session
          </button>
          <button className="flex-1 h-14 bg-[#06C755] text-white rounded-full font-medium text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_20px_rgba(6,199,85,0.3)]">
            <Share2 className="w-5 h-5" /> Invite via LINE
          </button>
        </div>
      </div>
    </div>
  );
}
