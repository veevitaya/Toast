import React, { useState, useEffect } from "react";
import { Users, Play, History, Flame, Home, Search, Bookmark, User, Utensils, Ticket } from "lucide-react";

export function NewHome() {
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col mx-auto shadow-2xl">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#FFCC02]/5 to-transparent pointer-events-none" />

      {/* Status Bar Padding */}
      <div className="h-[44px] shrink-0" />

      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Header Section */}
        <header className="px-6 pt-2 pb-6 flex items-start justify-between relative z-10">
          <div>
            <p className="text-[14px] font-medium text-neutral-500 mb-1">{greeting},</p>
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
              What should<br />we do?
            </h1>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-neutral-200 ring-2 ring-white shadow-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Notification Dot */}
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
          </div>
        </header>

        {/* Hero Decision Cards */}
        <section className="px-6 flex flex-col gap-3 mb-8">
          {/* Food Card */}
          <button className="relative w-full h-[140px] rounded-3xl overflow-hidden group active:scale-[0.97] transition-transform text-left shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80" 
              alt="Food" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="w-5 h-5 text-white" strokeWidth={1.5} />
                <h2 className="text-white text-[20px] font-extrabold tracking-[-0.02em]">Food</h2>
              </div>
              <p className="text-white/90 text-[14px] font-medium">Find your next meal together</p>
            </div>
          </button>

          {/* Activities Card */}
          <button className="relative w-full h-[140px] rounded-3xl overflow-hidden group active:scale-[0.97] transition-transform text-left shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <img 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80" 
              alt="Activities" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <Ticket className="w-5 h-5 text-white" strokeWidth={1.5} />
                <h2 className="text-white text-[20px] font-extrabold tracking-[-0.02em]">Activities</h2>
              </div>
              <p className="text-white/90 text-[14px] font-medium">Explore experiences & events</p>
            </div>
          </button>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="flex gap-3 px-6 overflow-x-auto scrollbar-hide pb-2 snap-x">
            <button className="snap-start shrink-0 flex items-center gap-2 bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl px-4 py-3 active:scale-[0.97] transition-transform">
              <Users className="w-5 h-5 text-neutral-700" strokeWidth={1.5} />
              <span className="text-[14px] font-semibold text-neutral-800 pr-1">Join Session</span>
            </button>
            <button className="snap-start shrink-0 flex items-center gap-2 bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl px-4 py-3 active:scale-[0.97] transition-transform">
              <Play className="w-5 h-5 text-neutral-700" strokeWidth={1.5} />
              <span className="text-[14px] font-semibold text-neutral-800 pr-1">Continue Plan</span>
            </button>
            <button className="snap-start shrink-0 flex items-center gap-2 bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl px-4 py-3 active:scale-[0.97] transition-transform">
              <History className="w-5 h-5 text-neutral-700" strokeWidth={1.5} />
              <span className="text-[14px] font-semibold text-neutral-800 pr-1">Recent Plans</span>
            </button>
          </div>
        </section>

        {/* Trending Tonight */}
        <section className="px-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-rose-500" strokeWidth={1.5} />
            <h2 className="text-[18px] font-bold tracking-[-0.02em] text-neutral-900">Trending Tonight</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x">
            {/* Card 1 */}
            <div className="snap-start shrink-0 w-[140px] h-[180px] rounded-2xl overflow-hidden relative shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <img 
                src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&auto=format&fit=crop&q=80" 
                alt="Tichuca Rooftop Bar" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-[14px] font-bold leading-tight mb-1 truncate">Tichuca Rooftop</h3>
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.08em] truncate">Bar • Thong Lo</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="snap-start shrink-0 w-[140px] h-[180px] rounded-2xl overflow-hidden relative shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <img 
                src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&auto=format&fit=crop&q=80" 
                alt="Jay Fai" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-[14px] font-bold leading-tight mb-1 truncate">Jay Fai</h3>
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.08em] truncate">Food • Phra Nakhon</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="snap-start shrink-0 w-[140px] h-[180px] rounded-2xl overflow-hidden relative shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <img 
                src="https://images.unsplash.com/photo-1582226219383-e18e6922df6b?w=400&auto=format&fit=crop&q=80" 
                alt="JODD FAIRS" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-[14px] font-bold leading-tight mb-1 truncate">JODD FAIRS</h3>
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.08em] truncate">Market • Rama 9</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="snap-start shrink-0 w-[140px] h-[180px] rounded-2xl overflow-hidden relative shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <img 
                src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&auto=format&fit=crop&q=80" 
                alt="Wat Arun" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-[14px] font-bold leading-tight mb-1 truncate">Wat Arun</h3>
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.08em] truncate">Sight • Riverside</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-neutral-100 flex items-center justify-around px-2 pb-5 z-20">
        <button className="flex flex-col items-center gap-1 w-16 group active:scale-95 transition-transform">
          <div className="relative">
            <Home className="w-6 h-6 text-neutral-900" strokeWidth={2} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFCC02]" />
          </div>
        </button>
        <button className="flex flex-col items-center gap-1 w-16 group active:scale-95 transition-transform">
          <Search className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
        </button>
        <button className="flex flex-col items-center gap-1 w-16 group active:scale-95 transition-transform">
          <Bookmark className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
        </button>
        <button className="flex flex-col items-center gap-1 w-16 group active:scale-95 transition-transform">
          <User className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
        </button>
      </nav>
    </div>
  );
}
