import { useState, useEffect } from "react";
import { Users, ChevronRight, Search, Bell, Flame, Sparkles, ArrowRight, MapPin, Clock } from "lucide-react";

const FRIEND_ACTIVITY = [
  { name: "Ploy", action: "is planning tonight", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { name: "Beam", action: "found a spot in Thonglor", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },
];

const TRENDING_BADGE = { count: 12, label: "groups planning right now" };

export function MoodEntry() {
  const [timeContext, setTimeContext] = useState({ greeting: "Good evening", period: "tonight", dayName: "Friday" });
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[now.getDay()];
    if (hour < 11) setTimeContext({ greeting: "Good morning", period: "today", dayName });
    else if (hour < 15) setTimeContext({ greeting: "Good afternoon", period: "this afternoon", dayName });
    else if (hour < 18) setTimeContext({ greeting: "Good evening", period: "tonight", dayName });
    else setTimeContext({ greeting: "Good evening", period: "tonight", dayName });
  }, []);

  const heroCards = [
    {
      id: "hungry",
      emoji: "🍜",
      title: "Hungry",
      subtext: "Find food together",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80",
      gradient: "from-orange-950/80 via-orange-900/40 to-transparent",
      accent: "bg-orange-500/20 text-orange-200",
      hot: true,
    },
    {
      id: "nightout",
      emoji: "🌙",
      title: "Night out",
      subtext: "Drinks & nightlife",
      image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&auto=format&fit=crop&q=80",
      gradient: "from-indigo-950/80 via-indigo-900/40 to-transparent",
      accent: "bg-indigo-500/20 text-indigo-200",
      hot: false,
    },
  ];

  const quickMoods = [
    { emoji: "🎯", label: "Fun stuff", sub: "Games & activities", image: "https://images.unsplash.com/photo-1543160408-db0e8790cb93?w=400&auto=format&fit=crop&q=80" },
    { emoji: "💫", label: "Date night", sub: "Romantic & special", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80" },
    { emoji: "⚡", label: "Quick bite", sub: "Nearby & fast", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80" },
    { emoji: "🎶", label: "Events", sub: "Live & local", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=80" },
  ];

  const hero = heroCards[activeHero];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">

      <div className="h-[44px] flex-shrink-0" />

      <header className="px-5 pt-1 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[12px] bg-[#FFCC02] flex items-center justify-center shadow-[0_2px_8px_rgba(255,204,2,0.3)]">
            <span className="text-[16px] font-black text-neutral-900 leading-none" style={{ fontFamily: "'Figtree',sans-serif" }}>T</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 tracking-[0.02em] leading-none">{timeContext.dayName} evening</p>
            <p className="text-[15px] font-bold text-neutral-900 tracking-[-0.01em] leading-tight mt-0.5">Bangkok</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
            <Bell className="w-[18px] h-[18px] text-neutral-600" strokeWidth={1.8} />
            <div className="absolute -top-0.5 -right-0.5 w-[10px] h-[10px] bg-rose-500 rounded-full border-[2px] border-[#FAFAF8]" />
          </div>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="You"
            className="w-9 h-9 rounded-full object-cover ring-[2px] ring-white shadow-sm"
          />
        </div>
      </header>

      <div className="px-5 mt-5">
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-[1.1]">
          What should we<br />do {timeContext.period}?
        </h1>
      </div>

      <div className="px-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {FRIEND_ACTIVITY.map((f, i) => (
              <img key={i} src={f.avatar} className="w-5 h-5 rounded-full object-cover ring-[1.5px] ring-[#FAFAF8]" alt={f.name} />
            ))}
          </div>
          <p className="text-[12px] text-neutral-500">
            <span className="font-semibold text-neutral-700">{FRIEND_ACTIVITY[0].name}</span> {FRIEND_ACTIVITY[0].action}
          </p>
        </div>
      </div>

      <div className="px-5 mt-5 relative">
        <div
          className="w-full h-[200px] rounded-[20px] overflow-hidden relative cursor-pointer group"
          style={{ boxShadow: "0 8px 40px -8px rgba(0,0,0,0.2)" }}
        >
          <img
            src={hero.image}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-[0.98]"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${hero.gradient}`} />

          {hero.hot && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full pl-1.5 pr-3 py-1 border border-white/20">
              <Flame className="w-3.5 h-3.5 text-[#FFCC02]" strokeWidth={2} fill="#FFCC02" />
              <span className="text-[11px] font-bold text-white/90 tracking-[0.01em]">{TRENDING_BADGE.count} groups active</span>
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-1">
            {heroCards.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveHero(i); }}
                className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${i === activeHero ? "bg-white w-[18px]" : "bg-white/40"}`}
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[28px] leading-none drop-shadow-lg">{hero.emoji}</span>
                <h2 className="text-[24px] font-extrabold text-white tracking-[-0.02em] drop-shadow-lg">{hero.title}</h2>
              </div>
              <p className="text-[13px] font-medium text-white/70">{hero.subtext}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-lg group-hover:bg-white/30 transition-colors">
              <ArrowRight className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-4 gap-2.5">
        {quickMoods.map((mood, i) => (
          <div
            key={i}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-full aspect-square rounded-[16px] overflow-hidden relative mb-2" style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}>
              <img
                src={mood.image}
                alt={mood.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-2 flex flex-col items-center">
                <span className="text-[18px] leading-none drop-shadow-md">{mood.emoji}</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 text-center leading-tight tracking-[-0.01em]">{mood.label}</span>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5">
        <div className="bg-white rounded-[16px] p-3 border border-neutral-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#FFCC02]/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-[18px] h-[18px] text-[#CC9900]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-neutral-900">Start a group session</span>
                <div className="flex items-center gap-1 bg-emerald-50 rounded-full px-2 py-0.5">
                  <div className="w-[5px] h-[5px] rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.05em]">Live</span>
                </div>
              </div>
              <p className="text-[12px] text-neutral-500 mt-0.5">Invite friends and decide together</p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#FFCC02]" strokeWidth={2} />
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.06em]">Trending in Bangkok</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {[
            { name: "Gaggan Anand", type: "Fine Dining", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&auto=format&fit=crop&q=80" },
            { name: "Tichuca Rooftop", type: "Rooftop Bar", img: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=300&auto=format&fit=crop&q=80" },
            { name: "Escape Hunt", type: "Activity", img: "https://images.unsplash.com/photo-1543160408-db0e8790cb93?w=300&auto=format&fit=crop&q=80" },
          ].map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[120px] cursor-pointer group">
              <div className="w-full h-[80px] rounded-[12px] overflow-hidden relative mb-1.5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <p className="text-[11px] font-semibold text-neutral-800 leading-tight truncate">{item.name}</p>
              <p className="text-[10px] text-neutral-400 leading-tight">{item.type}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-6 flex-shrink-0" />
    </div>
  );
}
