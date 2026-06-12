import { useState } from "react";
import {
  ArrowLeft, Share2, Calendar, MapPin, Sparkles,
  ChevronRight, Users, X
} from "lucide-react";

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

const GROUP_TYPES = [
  { id: "friends", icon: Users, label: "Friends" },
  { id: "partner", icon: Users, label: "Partner" },
  { id: "family", icon: Users, label: "Family" },
  { id: "coworkers", icon: Users, label: "Coworkers" },
];

const RESTRICTIONS = [
  { id: "halal", icon: "🕌", label: "Halal" },
  { id: "vegan", icon: "🥬", label: "Vegan" },
  { id: "vegetarian", icon: "🥗", label: "Vegetarian" },
  { id: "no-pork", icon: "🐷", label: "No Pork" },
];

export default function SummaryCard() {
  const [activeEditor, setActiveEditor] = useState<"when" | "where" | "prefs" | null>(null);

  // State
  const [date, setDate] = useState<string>("Today");
  const [time, setTime] = useState<string>("Anytime");
  
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  // Summaries
  const whenSummary = date === "Today" && time === "Anytime" 
    ? "Today, anytime" 
    : `${date}, ${time}`;
    
  const whereSummary = selectedLocations.length > 0 
    ? selectedLocations.map(l => LOCATIONS.find(loc => loc.id === l)?.label).join(", ")
    : "Anywhere";

  const prefsSummaryArr: string[] = [];
  if (selectedGroup) prefsSummaryArr.push(GROUP_TYPES.find(g => g.id === selectedGroup)?.label ?? "");
  if (selectedBudget) prefsSummaryArr.push(BUDGETS.find(b => b.id === selectedBudget)?.label ?? "");
  if (selectedRestrictions.length > 0) prefsSummaryArr.push(`${selectedRestrictions.length} diet`);
  
  const prefsSummary = prefsSummaryArr.length > 0 ? prefsSummaryArr.join(" · ") : "Any";

  const toggleLocation = (id: string) => {
    setSelectedLocations(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleRestriction = (id: string) => {
    setSelectedRestrictions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] relative overflow-hidden flex flex-col font-['Inter'] text-[#1A1A1A]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-4">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-32">
        <div className="mb-8 mt-4">
          <h1 className="font-['Plus_Jakarta_Sans'] text-3xl font-semibold tracking-tight text-[#1A1A1A] leading-tight">
            Review your<br/>session
          </h1>
          <p className="text-[15px] text-[#1A1A1A]/60 mt-3 leading-relaxed">
            Invite friends to vote on where to eat. We'll find the perfect match.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          
          {/* Row: When */}
          <button 
            onClick={() => setActiveEditor("when")}
            className="w-full flex items-center justify-between p-5 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF6EF] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#1A1A1A]/70" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium text-[#1A1A1A]/50 mb-0.5">When</p>
                <p className="text-[16px] font-medium text-[#1A1A1A]">{whenSummary}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
          </button>

          <div className="h-[1px] bg-black/[0.04] mx-5" />

          {/* Row: Where */}
          <button 
            onClick={() => setActiveEditor("where")}
            className="w-full flex items-center justify-between p-5 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF6EF] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#1A1A1A]/70" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium text-[#1A1A1A]/50 mb-0.5">Where</p>
                <p className="text-[16px] font-medium text-[#1A1A1A] line-clamp-1 text-ellipsis max-w-[200px]">{whereSummary}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
          </button>

          <div className="h-[1px] bg-black/[0.04] mx-5" />

          {/* Row: Preferences */}
          <button 
            onClick={() => setActiveEditor("prefs")}
            className="w-full flex items-center justify-between p-5 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF6EF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#1A1A1A]/70" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium text-[#1A1A1A]/50 mb-0.5">Preferences</p>
                <p className="text-[16px] font-medium text-[#1A1A1A]">{prefsSummary}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
          </button>

        </div>

        {/* Info Note */}
        <div className="mt-6 flex items-start gap-3 bg-[#1A1A1A]/[0.03] p-4 rounded-2xl border border-black/[0.04]">
          <span className="text-[16px]">👋</span>
          <p className="text-[14px] text-[#1A1A1A]/70 leading-snug">
            Your friends can still vote and suggest their own preferences once they join!
          </p>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/80 backdrop-blur-xl border-t border-black/[0.06] p-6 pb-10">
        <div className="flex flex-col gap-3">
          <button className="w-full h-14 bg-[#06C755] text-white rounded-full font-medium text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(6,199,85,0.2)]">
            <Share2 className="w-5 h-5" />
            Invite via LINE
          </button>
          <button className="w-full h-14 bg-[#FFCC02] text-[#1A1A1A] rounded-full font-medium text-[16px] flex items-center justify-center active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(255,204,2,0.2)]">
            Start session
          </button>
        </div>
      </div>

      {/* Inline Editor Overlay (BottomSheet style) */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${activeEditor ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActiveEditor(null)}
      />

      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 transition-transform duration-300 ease-out ${activeEditor ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-6 pb-12 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold">
              {activeEditor === 'when' && "When?"}
              {activeEditor === 'where' && "Where to?"}
              {activeEditor === 'prefs' && "Preferences"}
            </h3>
            <button 
              onClick={() => setActiveEditor(null)}
              className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center active:scale-95"
            >
              <X className="w-5 h-5 text-[#1A1A1A]" />
            </button>
          </div>

          {activeEditor === 'when' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[14px] font-medium text-[#1A1A1A]/60">Date</label>
                <div className="flex flex-wrap gap-2">
                  {["Today", "Tomorrow", "Weekend"].map(d => (
                    <button 
                      key={d}
                      onClick={() => setDate(d)}
                      className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors border ${
                        date === d 
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                          : "bg-white text-[#1A1A1A] border-black/[0.08] hover:bg-black/[0.02]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[14px] font-medium text-[#1A1A1A]/60">Time</label>
                <div className="flex flex-wrap gap-2">
                  {["Anytime", "Lunch (12pm)", "Dinner (7pm)", "Late night"].map(t => (
                    <button 
                      key={t}
                      onClick={() => setTime(t)}
                      className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors border ${
                        time === t 
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                          : "bg-white text-[#1A1A1A] border-black/[0.08] hover:bg-black/[0.02]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeEditor === 'where' && (
            <div className="grid grid-cols-2 gap-3">
              {LOCATIONS.map(l => {
                const isActive = selectedLocations.includes(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => toggleLocation(l.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      isActive 
                        ? "bg-[#FFCC02]/10 border-[#FFCC02] shadow-[0_0_0_1px_#FFCC02]" 
                        : "bg-white border-black/[0.08] hover:bg-black/[0.02]"
                    }`}
                  >
                    <span className="text-xl">{l.icon}</span>
                    <span className={`text-[14px] font-medium ${isActive ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/80'}`}>
                      {l.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {activeEditor === 'prefs' && (
            <div className="space-y-8">
              {/* Group */}
              <div className="space-y-3">
                <label className="text-[14px] font-medium text-[#1A1A1A]/60">Who's coming?</label>
                <div className="grid grid-cols-2 gap-2">
                  {GROUP_TYPES.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGroup(g.id === selectedGroup ? "" : g.id)}
                      className={`py-3 px-4 rounded-2xl border text-left transition-colors flex items-center gap-3 ${
                        selectedGroup === g.id
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-[#1A1A1A] border-black/[0.08] hover:bg-black/[0.02]"
                      }`}
                    >
                      <g.icon className="w-4 h-4 opacity-70" />
                      <span className="text-[14px] font-medium">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-3">
                <label className="text-[14px] font-medium text-[#1A1A1A]/60">Budget</label>
                <div className="flex border border-black/[0.08] rounded-2xl overflow-hidden p-1 bg-black/[0.02]">
                  {BUDGETS.map(b => {
                    const isActive = selectedBudget === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBudget(isActive ? "" : b.id)}
                        className={`flex-1 py-2.5 text-[14px] font-medium rounded-xl transition-all ${
                          isActive
                            ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[#1A1A1A]"
                            : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                        }`}
                      >
                        {b.icon}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Dietary */}
              <div className="space-y-3">
                <label className="text-[14px] font-medium text-[#1A1A1A]/60">Dietary needs</label>
                <div className="flex flex-wrap gap-2">
                  {RESTRICTIONS.map(r => {
                    const isActive = selectedRestrictions.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleRestriction(r.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors ${
                          isActive
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-white text-[#1A1A1A] border-black/[0.08] hover:bg-black/[0.02]"
                        }`}
                      >
                        <span className="text-base">{r.icon}</span>
                        <span className="text-[14px] font-medium">{r.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          )}

          <button 
            onClick={() => setActiveEditor(null)}
            className="w-full h-14 bg-[#1A1A1A] text-white rounded-full font-medium text-[16px] mt-8 active:scale-[0.98] transition-transform"
          >
            Save
          </button>
        </div>
      </div>

    </div>
  );
}
