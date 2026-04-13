import React from 'react';
import { ChevronRight } from 'lucide-react';

export function ToastMoment() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative">
      {/* Safe Area */}
      <div className="h-[44px] w-full" />

      {/* Content Container */}
      <div className="flex flex-col h-full pb-8">
        {/* Participant row */}
        <div className="px-6 flex justify-center mt-2">
          <div className="flex -space-x-3">
            {[
              { id: 1, name: 'Alice', emoji: '🎉' },
              { id: 2, name: 'Bob', emoji: '✨' },
              { id: 3, name: 'Charlie', emoji: '🔥' },
              { id: 4, name: 'Diana', emoji: '🥂' }
            ].map((p, i) => (
              <div key={p.id} className="relative z-[1]">
                <img
                  src={`https://i.pravatar.cc/150?u=${p.name}`}
                  alt={p.name}
                  className="w-10 h-10 rounded-full border-2 border-[#FAFAF8] shadow-sm relative z-10"
                />
                <div className="absolute -top-2 -right-1 text-[10px] z-20 bg-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {p.emoji}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="px-6 mt-6 flex flex-col items-center">
          <div className="text-[32px] mb-2">🎉</div>
          <h1 className="text-[24px] font-extrabold text-neutral-900 text-center leading-tight">
            We found your<br />best fits
          </h1>
          <p className="text-[13px] text-neutral-500 text-center mt-3">
            Most of you wanted fun + chill vibes
          </p>
        </div>

        {/* Result cards */}
        <div className="px-6 mt-8 flex flex-col gap-4">
          
          {/* Card 1 - Best Match */}
          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border-2 border-[#FFCC02]/30 relative flex flex-col">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80" 
                alt="Tichuca Rooftop Bar"
                className="w-full h-[180px] object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#FFCC02] rounded-full px-3 py-1 text-[12px] font-bold text-neutral-900 shadow-sm flex items-center gap-1">
                <span>🏆</span> Best match
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-[18px] font-extrabold text-neutral-900">Tichuca Rooftop Bar</h2>
              <p className="text-[13px] text-neutral-500 mt-0.5">Nightlife · Thong Lo</p>
              
              <div className="mt-3 bg-[#FFCC02]/10 rounded-xl px-3 py-2.5 border border-[#FFCC02]/20">
                <p className="text-[12px] text-neutral-700 font-medium">
                  Closest match to your shared vibe — fun, chill, and close by
                </p>
              </div>
              
              <p className="text-[11px] font-semibold text-neutral-500 mt-3">
                🕐 2-3hrs · 📍 1.2km · 💰 ฿฿฿
              </p>
            </div>

            <div className="px-4 pb-4 flex gap-2">
              <button className="flex-1 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-3 py-2 text-[12px] font-bold text-neutral-700 flex justify-center items-center gap-1">
                ❤️ Love it
              </button>
              <button className="flex-1 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-3 py-2 text-[12px] font-bold text-neutral-700 flex justify-center items-center gap-1">
                👍 Okay
              </button>
              <button className="bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-3 py-2 text-[12px] font-bold text-neutral-700 flex justify-center items-center gap-1">
                ⏭️ Skip
              </button>
            </div>
          </div>

          {/* Card 2 - Close Alternative */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-3 flex gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] items-center cursor-pointer hover:bg-neutral-50 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=80" 
              alt="Jazz at Saxophone"
              className="w-[80px] h-[80px] rounded-xl object-cover shrink-0"
            />
            <div className="flex-grow min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-[14px] text-neutral-900 truncate">Jazz at Saxophone</h3>
              </div>
              <p className="text-[12px] text-neutral-500 truncate mb-1.5">Live Music · Victory Mon.</p>
              <div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full px-2 py-0.5">
                  Easy compromise
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300 shrink-0" />
          </div>

          {/* Card 3 - Wildcard */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-3 flex gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] items-center cursor-pointer hover:bg-neutral-50 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1543160408-db0e8790cb93?w=300&auto=format&fit=crop&q=80" 
              alt="Escape Hunt Bangkok"
              className="w-[80px] h-[80px] rounded-xl object-cover shrink-0"
            />
            <div className="flex-grow min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-[14px] text-neutral-900 truncate">Escape Hunt Bangkok</h3>
              </div>
              <p className="text-[12px] text-neutral-500 truncate mb-1.5">Escape Room · Siam</p>
              <div>
                <span className="bg-violet-50 text-violet-700 text-[10px] font-bold rounded-full px-2 py-0.5">
                  Fun wildcard
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300 shrink-0" />
          </div>

        </div>

        {/* CTA Container */}
        <div className="px-6 mt-8 mb-4">
          <button className="w-full bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] hover:bg-[#F5C400] transition-colors flex items-center justify-center text-[16px]">
            This works for us! 🎉
          </button>
        </div>
        
      </div>
    </div>
  );
}
