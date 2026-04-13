import React from "react";
import { ArrowLeft, Share2, Sparkles, Plus } from "lucide-react";

export function AutoPlan() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] shrink-0" />

      {/* Header */}
      <div className="px-6 pt-2 flex items-center justify-between shrink-0">
        <button className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft className="w-6 h-6 text-neutral-900" />
        </button>
        <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
          <Share2 className="w-5 h-5 text-neutral-900" />
        </button>
      </div>

      {/* Hero area */}
      <div className="px-6 mt-4 shrink-0">
        <div className="inline-flex items-center gap-1.5 bg-[#FFCC02]/10 rounded-full px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 text-[#CC9900]" />
          <span className="text-[12px] font-semibold text-[#CC9900]">Auto-generated</span>
        </div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 mt-3 leading-tight">
          Your plan is<br />coming together
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 mt-2">
          Friday, Nov 24 · 4 friends
        </p>
      </div>

      {/* Timeline */}
      <div className="px-6 mt-8 relative flex-1">
        {/* Vertical connecting line */}
        <div className="absolute left-[47px] top-6 bottom-16 w-[2px] bg-neutral-200" />

        {/* Step 1 - Dinner */}
        <div className="relative z-10">
          <div className="flex flex-row items-start">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-sm">
                <span className="text-[16px] font-black text-neutral-900">1</span>
              </div>
              <span className="text-[11px] font-semibold text-neutral-500 mt-2 tracking-[0.02em]">7:00 PM</span>
            </div>
            
            <div className="ml-4 flex-1 bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-row items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200&auto=format&fit=crop&q=80" 
                alt="Thipsamai" 
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] text-neutral-900 truncate">Thipsamai</h3>
                <p className="text-[12px] font-medium text-neutral-500 truncate mt-0.5">Pad Thai · Phra Nakhon</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[12px] font-semibold text-neutral-400">฿฿</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Hint */}
        <div className="ml-[64px] my-3">
          <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5 uppercase tracking-[0.08em]">
            <span className="text-[14px]">🚶</span> 15 min walk
          </span>
        </div>

        {/* Step 2 - Dessert */}
        <div className="relative z-10">
          <div className="flex flex-row items-start">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                <span className="text-[16px] font-black text-white">2</span>
              </div>
              <span className="text-[11px] font-semibold text-neutral-500 mt-2 tracking-[0.02em]">8:30 PM</span>
            </div>
            
            <div className="ml-4 flex-1 bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-row items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&auto=format&fit=crop&q=80" 
                alt="After You" 
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] text-neutral-900 truncate">After You</h3>
                <p className="text-[12px] font-medium text-neutral-500 truncate mt-0.5">Shibuya Honey Toast · Siam</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[12px] font-semibold text-neutral-400">฿฿</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Hint */}
        <div className="ml-[64px] my-3">
          <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5 uppercase tracking-[0.08em]">
            <span className="text-[14px]">🚕</span> 10 min drive
          </span>
        </div>

        {/* Step 3 - Drinks */}
        <div className="relative z-10">
          <div className="flex flex-row items-start">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center shadow-sm">
                <span className="text-[16px] font-black text-white">3</span>
              </div>
              <span className="text-[11px] font-semibold text-neutral-500 mt-2 tracking-[0.02em]">10:00 PM</span>
            </div>
            
            <div className="ml-4 flex-1 bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-row items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&auto=format&fit=crop&q=80" 
                alt="Vesper" 
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] text-neutral-900 truncate">Vesper</h3>
                <p className="text-[12px] font-medium text-neutral-500 truncate mt-0.5">Cocktail Bar · Silom</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[12px] font-semibold text-neutral-400">฿฿฿฿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-8 pt-4 mt-auto shrink-0 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent relative z-20">
        <button className="bg-[#06C755] h-14 rounded-2xl text-white font-bold text-[16px] w-full flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform">
          <Share2 className="w-5 h-5" />
          Share Plan
        </button>
        <div className="flex gap-3 mt-3">
          <button className="bg-white border border-neutral-200 h-12 flex-1 rounded-2xl text-[15px] font-bold text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform">
            Edit Plan
          </button>
          <button className="bg-white border border-neutral-200 h-12 flex-1 rounded-2xl text-[15px] font-bold text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add a Stop
          </button>
        </div>
      </div>
    </div>
  );
}
