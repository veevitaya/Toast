import { useState } from "react";
import { ArrowLeft, Share2, Ticket, Check, X, Calendar, MapPin, Sparkles, Users } from "lucide-react";

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

export default function SummaryTicket() {
  const [activeEditor, setActiveEditor] = useState<"when" | "where" | "prefs" | null>(null);

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

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] relative overflow-hidden flex flex-col font-['Inter'] text-[#1A1A1A]">
      <header className="flex items-center justify-between px-6 pt-14 pb-4">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-40">
        <div className="mb-6 mt-2">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight text-[#1A1A1A] leading-tight flex items-center gap-2">
            <Ticket className="w-7 h-7 text-[#FFCC02]" /> Session Ticket
          </h1>
          <p className="text-[15px] text-[#1A1A1A]/60 mt-2 leading-relaxed">
            Your dining boarding pass is ready. Share it to start voting.
          </p>
        </div>

        {/* Ticket Container */}
        <div className="relative w-full filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          {/* Top Stub */}
          <div className="bg-[#FFCC02] rounded-t-3xl p-6 pb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Ticket className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[#1A1A1A]/70 text-[13px] font-semibold uppercase tracking-wider mb-1">Session Code</p>
                <p className="text-[#1A1A1A] text-2xl font-['Plus_Jakarta_Sans'] font-bold tracking-widest">BKK-842</p>
              </div>
              <div className="bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
                <p className="text-[#1A1A1A] text-[12px] font-medium">Valid for 24h</p>
              </div>
            </div>
          </div>

          {/* Perforation */}
          <div className="relative h-6 -my-3 z-20 flex items-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-[#FAF6EF] -ml-3 shadow-inner"></div>
              <div className="flex-1 border-t-2 border-dashed border-black/10 mx-2"></div>
              <div className="w-6 h-6 rounded-full bg-[#FAF6EF] -mr-3 shadow-inner"></div>
            </div>
          </div>

          {/* Main Body */}
          <div className="bg-white rounded-b-3xl p-6 pt-8 space-y-6">
            {/* Field: When */}
            <button 
              onClick={() => setActiveEditor("when")}
              className="w-full text-left group active:scale-[0.98] transition-transform"
            >
              <p className="text-[#1A1A1A]/50 text-[12px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Date & Time
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[#1A1A1A] text-[18px] font-semibold font-['Plus_Jakarta_Sans']">{whenSummary}</p>
                <div className="text-[12px] font-medium text-[#FFCC02] bg-[#FFCC02]/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit</div>
              </div>
            </button>

            <div className="h-[1px] w-full bg-black/[0.04]"></div>

            {/* Field: Where */}
            <button 
              onClick={() => setActiveEditor("where")}
              className="w-full text-left group active:scale-[0.98] transition-transform"
            >
              <p className="text-[#1A1A1A]/50 text-[12px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Destination
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[#1A1A1A] text-[18px] font-semibold font-['Plus_Jakarta_Sans'] line-clamp-1">{whereSummary}</p>
                <div className="text-[12px] font-medium text-[#FFCC02] bg-[#FFCC02]/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit</div>
              </div>
            </button>

            <div className="h-[1px] w-full bg-black/[0.04]"></div>

            {/* Field: Prefs */}
            <button 
              onClick={() => setActiveEditor("prefs")}
              className="w-full text-left group active:scale-[0.98] transition-transform"
            >
              <p className="text-[#1A1A1A]/50 text-[12px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Passenger Prefs
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[#1A1A1A] text-[18px] font-semibold font-['Plus_Jakarta_Sans']">{prefsSummary}</p>
                <div className="text-[12px] font-medium text-[#FFCC02] bg-[#FFCC02]/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit</div>
              </div>
            </button>
            
            {/* Barcode decorative */}
            <div className="pt-4 flex justify-center opacity-30">
              <div className="w-full h-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAwdjQwaDRWMHptOCAwdjQwaDJWMHptNiAwdjQwaDRWMHptOCAwdjQwaDZWMEgweiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat-x bg-contain"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/90 backdrop-blur-xl border-t border-black/[0.06] p-6 pb-10">
        <div className="flex flex-col gap-3">
          <button className="w-full h-14 bg-[#06C755] text-white rounded-full font-medium text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(6,199,85,0.2)]">
            <Share2 className="w-5 h-5" />
            Invite via LINE
          </button>
          <button className="w-full h-14 bg-[#1A1A1A] text-white rounded-full font-medium text-[16px] flex items-center justify-center active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(26,26,26,0.2)]">
            Start session
          </button>
        </div>
      </div>

      {/* Sheet */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${activeEditor ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActiveEditor(null)}
      />

      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 transition-transform duration-300 ease-out ${activeEditor ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-6 pb-12 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#1A1A1A]">
              {activeEditor === 'when' && "Edit Time"}
              {activeEditor === 'where' && "Edit Location"}
              {activeEditor === 'prefs' && "Edit Preferences"}
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
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" 
                        : "bg-white border-black/[0.08] hover:bg-black/[0.02] text-[#1A1A1A]"
                    }`}
                  >
                    <span className="text-xl">{l.icon}</span>
                    <span className={`text-[14px] font-medium ${isActive ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      {l.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {activeEditor === 'prefs' && (
            <div className="space-y-8">
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

          <button 
            onClick={() => setActiveEditor(null)}
            className="w-full h-14 bg-[#FFCC02] text-[#1A1A1A] rounded-full font-bold text-[16px] mt-8 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
