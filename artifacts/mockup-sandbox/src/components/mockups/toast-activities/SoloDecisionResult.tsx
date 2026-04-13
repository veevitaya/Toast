import React from "react";
import { ArrowLeft, Sparkles, UtensilsCrossed, IceCreamCone, Wine, ChevronRight } from "lucide-react";

export function SoloDecisionResult() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] w-full shrink-0" />

      {/* Header */}
      <div className="px-6 flex items-center gap-3">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <ArrowLeft className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
        </button>
        <h1 className="text-[18px] font-bold text-neutral-900">Looks good ✨</h1>
      </div>

      {/* Hero Card */}
      <div className="mx-6 mt-4 bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
        <div className="relative h-[220px] w-full">
          <img
            src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80"
            alt="Tichuca Rooftop Bar"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-emerald-500 text-white rounded-full px-3 py-1 text-[12px] font-bold shadow-sm">
            ✅ Selected
          </div>
        </div>
        
        <div className="p-5">
          <h2 className="text-[22px] font-extrabold text-neutral-900 tracking-[-0.03em]">Tichuca Rooftop Bar</h2>
          <p className="text-[13px] text-neutral-500 mt-1">Nightlife · Thong Lo</p>
          
          <div className="mt-3 bg-[#FFCC02]/8 rounded-xl px-4 py-2.5">
            <p className="text-[13px] text-neutral-700 leading-snug">Perfect wind-down spot after dinner, close by</p>
          </div>
          
          <div className="mt-3 flex gap-4">
            <span className="text-[12px] text-neutral-500 font-medium flex items-center gap-1">
              <span>🕐</span> 2-3 hrs
            </span>
            <span className="text-[12px] text-neutral-500 font-medium flex items-center gap-1">
              <span>📍</span> 1.2 km
            </span>
            <span className="text-[12px] text-neutral-500 font-medium flex items-center gap-1">
              <span>💰</span> ฿฿฿
            </span>
          </div>
        </div>
      </div>

      {/* Bridge Section */}
      <div className="px-6 mt-6">
        <h3 className="text-[18px] font-bold text-neutral-900 mb-3">Build your evening</h3>
        <div className="flex flex-col gap-2.5">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3 cursor-pointer hover:border-neutral-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[14px] text-neutral-900">Add food before</p>
              <p className="text-[12px] text-neutral-500 mt-0.5">Grab dinner first</p>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3 cursor-pointer hover:border-neutral-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
              <IceCreamCone className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[14px] text-neutral-900">Add dessert after</p>
              <p className="text-[12px] text-neutral-500 mt-0.5">Something sweet to finish</p>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3 cursor-pointer hover:border-neutral-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
              <Wine className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[14px] text-neutral-900">Add drinks after</p>
              <p className="text-[12px] text-neutral-500 mt-0.5">Keep the night going</p>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Spacer to push CTAs to bottom if needed, or just let them sit naturally */}
      <div className="flex-1" />

      {/* CTAs */}
      <div className="px-6 mt-6 pb-8">
        <button className="bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 w-full flex items-center justify-center gap-2 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] hover:bg-[#F2C100] transition-colors">
          <Sparkles className="w-5 h-5" strokeWidth={1.5} />
          Build quick plan
        </button>
        <button className="w-full text-[13px] text-neutral-400 font-medium text-center mt-3 hover:text-neutral-600 transition-colors">
          Swap option
        </button>
      </div>
    </div>
  );
}
