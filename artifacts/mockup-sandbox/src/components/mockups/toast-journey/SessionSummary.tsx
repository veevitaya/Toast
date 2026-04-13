import React from "react";
import { Bookmark, Pencil, Plus } from "lucide-react";

export function SessionSummary() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto pb-8 relative">
      {/* Safe Area */}
      <div className="h-[44px] bg-neutral-900" />

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-b-[32px] px-6 py-8 pb-10 shadow-lg">
        <div className="text-[14px] font-medium text-white/60">Friday Night</div>
        <div className="text-[28px] font-extrabold text-white tracking-[-0.03em] mt-1 leading-tight">
          Your Complete Plan
        </div>
        <div className="text-[14px] text-white/40 mt-2">Nov 24 · 4 friends</div>
        
        <div className="mt-5 flex items-center gap-3">
          <div className="flex -space-x-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
              alt="Ploy"
              className="w-9 h-9 rounded-full ring-2 ring-neutral-800 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
              alt="Beam"
              className="w-9 h-9 rounded-full ring-2 ring-neutral-800 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Fern"
              className="w-9 h-9 rounded-full ring-2 ring-neutral-800 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              alt="Ice"
              className="w-9 h-9 rounded-full ring-2 ring-neutral-800 object-cover"
            />
          </div>
          <div className="text-[12px] text-white/50">Ploy, Beam, Fern, Ice</div>
        </div>
      </div>

      {/* Timeline Cards */}
      <div className="px-6 mt-8 relative">
        {/* Connecting Line */}
        <div className="absolute left-[47px] top-6 bottom-8 w-[2px] bg-neutral-200 z-0" />

        {/* Step 1 */}
        <div className="flex gap-4 relative z-10 items-start">
          <div className="w-12 h-12 rounded-full bg-[#FFCC02] flex items-center justify-center text-xl shrink-0 shadow-sm border-[4px] border-[#FAFAF8]">
            🍜
          </div>
          <div className="flex-1 mt-1 mb-2">
            <div className="text-[12px] font-bold text-neutral-400 mb-1">7:00 PM</div>
            <div className="bg-white rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-100 flex gap-3 items-center">
              <img
                src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200&auto=format&fit=crop&q=80"
                alt="Thipsamai"
                className="w-[52px] h-[52px] rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-bold text-neutral-900 truncate">Thipsamai</div>
                <div className="text-[13px] text-neutral-500 truncate">Pad Thai · Phra Nakhon</div>
                <div className="text-[12px] font-semibold text-neutral-400 mt-0.5">★ 4.7 · ฿฿</div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Hint */}
        <div className="ml-[64px] my-1 text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5 relative z-10">
          <span>🚕</span> 12 min
        </div>

        {/* Step 2 */}
        <div className="flex gap-4 relative z-10 items-start">
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl shrink-0 shadow-sm border-[4px] border-[#FAFAF8]">
            🍰
          </div>
          <div className="flex-1 mt-1 mb-2">
            <div className="text-[12px] font-bold text-neutral-400 mb-1">8:30 PM</div>
            <div className="bg-white rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-100 flex gap-3 items-center">
              <img
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&auto=format&fit=crop&q=80"
                alt="After You"
                className="w-[52px] h-[52px] rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-bold text-neutral-900 truncate">After You</div>
                <div className="text-[13px] text-neutral-500 truncate">Shibuya Toast · Siam</div>
                <div className="text-[12px] font-semibold text-neutral-400 mt-0.5">★ 4.6 · ฿฿</div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Hint */}
        <div className="ml-[64px] my-1 text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5 relative z-10">
          <span>🚕</span> 8 min
        </div>

        {/* Step 3 */}
        <div className="flex gap-4 relative z-10 items-start">
          <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-xl shrink-0 shadow-sm border-[4px] border-[#FAFAF8]">
            🍸
          </div>
          <div className="flex-1 mt-1 mb-2">
            <div className="text-[12px] font-bold text-neutral-400 mb-1">10:00 PM</div>
            <div className="bg-white rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-100 flex gap-3 items-center">
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&auto=format&fit=crop&q=80"
                alt="Vesper"
                className="w-[52px] h-[52px] rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-bold text-neutral-900 truncate">Vesper</div>
                <div className="text-[13px] text-neutral-500 truncate">Cocktail Bar · Silom</div>
                <div className="text-[12px] font-semibold text-neutral-400 mt-0.5">★ 4.8 · ฿฿฿</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 mt-8 mb-6">
        <button className="w-full h-14 bg-[#06C755] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(6,199,85,0.3)] hover:scale-[0.98] transition-transform">
          Share to LINE
        </button>
        <div className="flex gap-3 mt-3">
          <button className="flex-1 h-12 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-neutral-50 transition-colors">
            <Bookmark className="w-4 h-4" />
            Save
          </button>
          <button className="flex-1 h-12 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-neutral-50 transition-colors">
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button className="flex-1 h-12 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-neutral-50 transition-colors">
            <Plus className="w-4 h-4" />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
