import React from "react";
import { Share2, Link as LinkIcon, ChevronRight } from "lucide-react";

export function SharePlan() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Top Section - Sharing State */}
      <div className="h-[44px] shrink-0" />
      
      <div className="px-6 pb-2">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          Share your plan
        </h1>
      </div>

      {/* Plan Card Preview */}
      <div className="mx-6 mt-4 bg-white rounded-3xl p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[16px] font-bold text-neutral-900">Friday Night Plan 🌙</h2>
            <p className="text-[12px] text-neutral-500 font-medium mt-0.5">4 friends</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FFCC02]" />
            <span className="text-[13px] font-medium text-neutral-700">7:00 PM · Thipsamai · Dinner</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#06C755]" />
            <span className="text-[13px] font-medium text-neutral-700">8:30 PM · After You · Dessert</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#9b51e0]" />
            <span className="text-[13px] font-medium text-neutral-700">10:00 PM · Vesper · Drinks</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="Avatar 1" className="w-6 h-6 rounded-full border border-white object-cover" />
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces" alt="Avatar 2" className="w-6 h-6 rounded-full border border-white object-cover" />
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" alt="Avatar 3" className="w-6 h-6 rounded-full border border-white object-cover" />
            <div className="w-6 h-6 rounded-full border border-white bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-neutral-600">+1</div>
          </div>
          <span className="text-[12px] text-neutral-500 font-medium">Bestie Squad</span>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="px-6 mt-6">
        <button className="w-full bg-[#06C755] text-white rounded-2xl h-14 font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <Share2 className="w-5 h-5" />
          Share to LINE
        </button>
        <button className="w-full bg-white border border-neutral-200 text-neutral-800 rounded-2xl h-12 font-bold text-[15px] flex items-center justify-center gap-2 mt-3 active:scale-[0.98] transition-transform shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <LinkIcon className="w-4 h-4" />
          Copy link
        </button>
      </div>

      {/* Divider */}
      <div className="mx-6 mt-10 mb-6 flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-neutral-200" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">What friends see</span>
        <div className="h-[1px] flex-1 bg-neutral-200" />
      </div>

      {/* Received Invitation Mockup */}
      <div className="mx-6 bg-neutral-900 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <h3 className="text-[18px] font-bold text-white tracking-tight">You've been invited! 🎉</h3>
          <p className="text-[14px] text-white/60 mt-1 font-medium">Ploy's Friday Night Plan</p>
          
          <div className="mt-5 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-[13px] text-white/80 font-medium">7:00 PM · Thipsamai</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-[13px] text-white/80 font-medium">8:30 PM · After You</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-[13px] text-white/80 font-medium">10:00 PM · Vesper</span>
            </div>
          </div>

          <button className="w-full bg-[#FFCC02] text-neutral-900 rounded-xl h-12 font-bold text-[14px] mt-6 flex items-center justify-center gap-1 active:scale-[0.98] transition-transform">
            Join Plan
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="h-10 shrink-0" />
    </div>
  );
}
