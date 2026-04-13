import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export function FoodFlowEntry() {
  const [selectedVibe, setSelectedVibe] = useState("🔥 Trending");

  const vibes = [
    "🔥 Trending", "🥢 Street Food", "✨ Date Night", "🌶️ Spicy", "🥗 Healthy", "🍰 Sweet", "🏠 Comfort"
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] shrink-0" />

      {/* Back Arrow */}
      <div className="px-6">
        <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
        </button>
      </div>

      {/* Context Badge */}
      <div className="px-6 mt-4">
        <div className="inline-flex bg-[#FFCC02]/10 rounded-full px-4 py-1.5 text-[12px] font-semibold text-[#CC9900]">
          🍜 Hungry now
        </div>
      </div>

      {/* Hero Text */}
      <div className="px-6 mt-4">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          Let's find<br />something good.
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 mt-3 leading-relaxed">
          Swipe through dishes. We'll find the perfect spot.
        </p>
      </div>

      {/* Vibe Selector */}
      <div className="mt-6">
        <div className="px-6 mb-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-neutral-400">
          Pick a vibe
        </div>
        <div className="flex overflow-x-auto px-6 pb-2 hide-scrollbar space-x-2">
          {vibes.map((vibe) => (
            <button
              key={vibe}
              onClick={() => setSelectedVibe(vibe)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                selectedVibe === vibe
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700'
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      {/* Group Session Card */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar 1" className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm object-cover" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" alt="Avatar 2" className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm object-cover" />
              <div className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600">+2</div>
            </div>
            <div>
              <div className="font-bold text-[14px] text-neutral-900 tracking-[-0.02em]">Bestie Squad</div>
              <div className="text-[12px] font-medium text-neutral-500">4 members · Group session</div>
            </div>
          </div>
          <div className="relative flex items-center justify-center w-4 h-4">
            <div className="absolute w-full h-full bg-emerald-400 rounded-full opacity-20 animate-ping"></div>
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 mt-8 relative z-10">
        <button className="w-full bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 text-[15px] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] transition-transform active:scale-[0.98]">
          Start Swiping
        </button>
      </div>

      {/* Preview Stack */}
      <div className="flex-1 mt-4 relative flex items-center justify-center overflow-hidden pb-12">
        {/* Card 3 (Bottom) */}
        <div className="absolute w-[200px] h-[280px] bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transform rotate-[3deg] translate-y-4 opacity-60 transition-transform"></div>
        
        {/* Card 2 (Middle) */}
        <div className="absolute w-[200px] h-[280px] bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transform -rotate-[3deg] translate-y-2 opacity-80 transition-transform"></div>
        
        {/* Card 1 (Top) */}
        <div className="relative w-[200px] h-[280px] bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] z-10 transition-transform">
          <div className="m-2 h-[160px] rounded-2xl overflow-hidden relative bg-neutral-100">
            <img src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=80" alt="Food preview" className="w-full h-full object-cover" />
          </div>
          <div className="px-4 pt-3 space-y-2">
             <div className="w-16 h-3 bg-neutral-100 rounded-full"></div>
             <div className="w-24 h-3 bg-neutral-100 rounded-full"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
