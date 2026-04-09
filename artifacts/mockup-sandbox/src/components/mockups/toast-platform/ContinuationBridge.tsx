import React from "react";
import { Check, IceCream, Wine, Compass, Ticket } from "lucide-react";

export function ContinuationBridge() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden relative font-['Figtree',sans-serif] mx-auto flex flex-col shadow-2xl">
      {/* Background ambient gradient */}
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-[#FFCC02]/10 via-[#FFCC02]/5 to-transparent pointer-events-none" />

      {/* Safe Area Padding */}
      <div className="pt-[44px] px-6 flex flex-col flex-1 relative z-10 pb-6">
        
        {/* Matched Restaurant Context */}
        <div className="mt-2 bg-white rounded-2xl p-2 pr-4 flex items-center gap-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop&q=80" 
              alt="Gaggan Anand"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-neutral-900 truncate">Gaggan Anand</h3>
            <p className="text-[13px] font-medium text-neutral-500 truncate">Progressive Indian • Sukhumvit</p>
          </div>
          <div className="shrink-0 flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100/50">
            <span className="text-[12px] font-bold tracking-tight">Matched</span>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Headline Area */}
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-[1.1] mb-2">
            Your night doesn't<br />end here
          </h1>
          <p className="text-[14px] font-medium text-neutral-500">
            Add something amazing to your plan
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-auto">
          {/* Dessert */}
          <div className="group relative h-[170px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-all bg-white">
            <img 
              src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80" 
              alt="Dessert"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#B91C1C]/90 via-[#BE123C]/40 to-transparent mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white">
                <IceCream className="w-[18px] h-[18px] stroke-[2]" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-0.5 tracking-tight">Dessert</h3>
              <p className="text-[12px] font-medium text-white/80">Something sweet</p>
            </div>
          </div>

          {/* Drinks */}
          <div className="group relative h-[170px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-all bg-white">
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80" 
              alt="Drinks"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#312E81]/90 via-[#4338CA]/40 to-transparent mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white">
                <Wine className="w-[18px] h-[18px] stroke-[2]" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-0.5 tracking-tight">Drinks</h3>
              <p className="text-[12px] font-medium text-white/80">Keep the vibe going</p>
            </div>
          </div>

          {/* Activities */}
          <div className="group relative h-[170px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-all bg-white">
            <img 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80" 
              alt="Activities"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/90 via-[#047857]/40 to-transparent mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white">
                <Compass className="w-[18px] h-[18px] stroke-[2]" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-0.5 tracking-tight">Activities</h3>
              <p className="text-[12px] font-medium text-white/80">Fun times ahead</p>
            </div>
          </div>

          {/* Events */}
          <div className="group relative h-[170px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-all bg-white">
            <img 
              src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80" 
              alt="Events"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7C2D12]/90 via-[#B45309]/40 to-transparent mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white">
                <Ticket className="w-[18px] h-[18px] stroke-[2]" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-0.5 tracking-tight">Events</h3>
              <p className="text-[12px] font-medium text-white/80">Live & local</p>
            </div>
          </div>
        </div>

        {/* Skip Link */}
        <div className="mt-6 flex justify-center mb-2">
          <button className="text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors py-2 px-4">
            I'm done for tonight
          </button>
        </div>

      </div>

      {/* Bottom Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full opacity-20" />
    </div>
  );
}
