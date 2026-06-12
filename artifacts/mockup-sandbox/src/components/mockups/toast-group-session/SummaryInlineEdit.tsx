import { useState } from "react";
import { ArrowLeft, Share2, Calendar, MapPin, Sparkles, ChevronDown, ChevronUp, Users } from "lucide-react";

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

export default function SummaryInlineEdit() {
  const [expandedSection, setExpandedSection] = useState<"when" | "where" | "prefs" | null>(null);

  const [date, setDate] = useState<string>("Today");
  const [time, setTime] = useState<string>("Anytime");
  
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

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

  const toggleSection = (section: "when" | "where" | "prefs") => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] relative overflow-y-auto flex flex-col font-['Inter'] text-[#1A1A1A]">
      <header className="flex items-center justify-between px-6 pt-14 pb-4">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>
      </header>

      <main className="flex-1 px-4 pb-40">
        <div className="mb-6 mt-2 px-2">
          <h1 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Review your plan
          </h1>
          <p className="text-[15px] text-[#1A1A1A]/60 mt-2 leading-relaxed">
            Tap any section to quickly make changes before inviting others.
          </p>
        </div>

        <div className="space-y-3">
          {/* Section: When */}
          <div className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("when")}
              className="w-full flex items-center justify-between p-5 active:bg-black/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${expandedSection === "when" ? "bg-[#FFCC02]/20" : "bg-[#FAF6EF]"}`}>
                  <Calendar className={`w-5 h-5 ${expandedSection === "when" ? "text-[#FFCC02]" : "text-[#1A1A1A]/70"}`} />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold uppercase tracking-wider text-[#1A1A1A]/50 mb-0.5">When</p>
                  <p className="text-[16px] font-semibold text-[#1A1A1A]">{whenSummary}</p>
                </div>
              </div>
              {expandedSection === "when" ? <ChevronUp className="w-5 h-5 text-[#1A1A1A]/40" /> : <ChevronDown className="w-5 h-5 text-[#1A1A1A]/40" />}
            </button>
            
            {expandedSection === "when" && (
              <div className="px-5 pb-6 pt-2 space-y-6 border-t border-black/[0.04] bg-[#FAF6EF]/30">
                <div className="space-y-3">
                  <label className="text-[14px] font-medium text-[#1A1A1A]/60">Date</label>
                  <div className="flex flex-wrap gap-2">
                    {["Today", "Tomorrow", "Weekend"].map(d => (
                      <button 
                        key={d}
                        onClick={() => setDate(d)}
                        className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors border ${
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
                        className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors border ${
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
          </div>

          {/* Section: Where */}
          <div className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("where")}
              className="w-full flex items-center justify-between p-5 active:bg-black/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${expandedSection === "where" ? "bg-[#FFCC02]/20" : "bg-[#FAF6EF]"}`}>
                  <MapPin className={`w-5 h-5 ${expandedSection === "where" ? "text-[#FFCC02]" : "text-[#1A1A1A]/70"}`} />
                </div>
                <div className="text-left max-w-[220px]">
                  <p className="text-[13px] font-semibold uppercase tracking-wider text-[#1A1A1A]/50 mb-0.5">Where</p>
                  <p className="text-[16px] font-semibold text-[#1A1A1A] truncate">{whereSummary}</p>
                </div>
              </div>
              {expandedSection === "where" ? <ChevronUp className="w-5 h-5 text-[#1A1A1A]/40" /> : <ChevronDown className="w-5 h-5 text-[#1A1A1A]/40" />}
            </button>

            {expandedSection === "where" && (
              <div className="px-5 pb-6 pt-2 border-t border-black/[0.04] bg-[#FAF6EF]/30">
                <div className="flex flex-wrap gap-2 mt-4">
                  {LOCATIONS.map(l => {
                    const isActive = selectedLocations.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => toggleLocation(l.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors ${
                          isActive 
                            ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" 
                            : "bg-white border-black/[0.08] hover:bg-black/[0.02] text-[#1A1A1A]"
                        }`}
                      >
                        <span className="text-base">{l.icon}</span>
                        <span className="text-[14px] font-medium">{l.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section: Prefs */}
          <div className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("prefs")}
              className="w-full flex items-center justify-between p-5 active:bg-black/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${expandedSection === "prefs" ? "bg-[#FFCC02]/20" : "bg-[#FAF6EF]"}`}>
                  <Sparkles className={`w-5 h-5 ${expandedSection === "prefs" ? "text-[#FFCC02]" : "text-[#1A1A1A]/70"}`} />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold uppercase tracking-wider text-[#1A1A1A]/50 mb-0.5">Preferences</p>
                  <p className="text-[16px] font-semibold text-[#1A1A1A]">{prefsSummary}</p>
                </div>
              </div>
              {expandedSection === "prefs" ? <ChevronUp className="w-5 h-5 text-[#1A1A1A]/40" /> : <ChevronDown className="w-5 h-5 text-[#1A1A1A]/40" />}
            </button>

            {expandedSection === "prefs" && (
              <div className="px-5 pb-6 pt-4 space-y-6 border-t border-black/[0.04] bg-[#FAF6EF]/30">
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
          </div>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent pt-10 px-4 pb-6 z-10">
        <div className="bg-white p-4 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.04]">
          <div className="flex gap-2">
            <button className="flex-1 h-14 bg-[#1A1A1A] text-white rounded-2xl font-bold text-[16px] flex items-center justify-center active:scale-[0.98] transition-transform">
              Start session
            </button>
            <button className="w-14 h-14 bg-[#06C755] text-white rounded-2xl flex items-center justify-center active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(6,199,85,0.2)]">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[12px] text-[#1A1A1A]/50 mt-3 font-medium">Friends can vote & add their own preferences</p>
        </div>
      </div>
    </div>
  );
}
