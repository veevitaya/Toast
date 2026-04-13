import React from 'react';
import { ChevronLeft, X, Bookmark, Heart } from 'lucide-react';

export function FoodSwipe() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative">
      {/* 1. Safe area */}
      <div className="h-[44px] w-full" />

      {/* 2. Top bar */}
      <div className="px-6 flex justify-between items-center">
        {/* Left: Back arrow */}
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center cursor-pointer">
          <ChevronLeft className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
        </div>

        {/* Center: progress indicator */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[13px] font-semibold text-neutral-500">3 of 12</span>
          <div className="h-1 bg-neutral-200 rounded-full w-[120px] overflow-hidden">
            <div className="h-full w-1/4 bg-[#FFCC02] rounded-full" />
          </div>
        </div>

        {/* Right: session badge */}
        <div className="flex -space-x-2">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&auto=format&q=80" alt="Avatar 1" className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm object-cover z-[4]" />
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&auto=format&q=80" alt="Avatar 2" className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm object-cover z-[3]" />
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format&q=80" alt="Avatar 3" className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm object-cover z-[2]" />
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format&q=80" alt="Avatar 4" className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm object-cover z-[1]" />
        </div>
      </div>

      {/* Main content area */}
      <div className="mt-4 relative">
        {/* 4. Card behind */}
        <div className="w-[calc(100%-48px)] mx-auto h-[20px] bg-white rounded-t-3xl shadow-sm absolute left-0 right-0 top-[408px] opacity-60 z-0" />
        
        {/* 3. Swipe card */}
        <div className="mx-6 w-[calc(100%-48px)] h-[420px] bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] overflow-hidden relative z-10">
          {/* Top: food image */}
          <div className="h-[280px] w-full bg-neutral-200">
            <img 
              src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80" 
              alt="Pad Thai Goong" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Bottom section */}
          <div className="p-5">
            <h2 className="text-[22px] font-extrabold text-neutral-900 tracking-[-0.03em] leading-tight">Pad Thai Goong</h2>
            <p className="text-[13px] text-neutral-500 mt-1 font-medium">Thai Classic · Street Food</p>
            
            {/* Tags row */}
            <div className="mt-3 flex gap-2">
              <span className="bg-neutral-100 text-neutral-600 text-[12px] font-medium rounded-full px-3 py-1.5">🔥 Trending</span>
              <span className="bg-neutral-100 text-neutral-600 text-[12px] font-medium rounded-full px-3 py-1.5">🥢 Wok-fried</span>
              <span className="bg-neutral-100 text-neutral-600 text-[12px] font-medium rounded-full px-3 py-1.5">🍤 Prawns</span>
            </div>
            
            {/* Bottom row */}
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[14px] font-bold text-neutral-900">฿฿</span>
              <span className="text-[14px] font-bold text-neutral-900">4.7 <span className="text-yellow-400">⭐</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Swipe buttons */}
      <div className="flex justify-center items-center mt-6 gap-6">
        {/* Skip */}
        <button className="w-16 h-16 rounded-full border-2 border-rose-200 flex items-center justify-center bg-white shadow-sm transition-transform active:scale-95">
          <X className="text-rose-400 w-7 h-7" strokeWidth={2} />
        </button>
        
        {/* Maybe */}
        <button className="w-12 h-12 rounded-full border-2 border-neutral-200 flex items-center justify-center bg-white shadow-sm transition-transform active:scale-95">
          <Bookmark className="text-neutral-400 w-5 h-5" strokeWidth={2} />
        </button>
        
        {/* Like */}
        <button className="w-16 h-16 rounded-full bg-[#FFCC02] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] flex items-center justify-center transition-transform active:scale-95">
          <Heart className="text-neutral-900 w-7 h-7" strokeWidth={2} fill="currentColor" />
        </button>
      </div>

      {/* 6. Swipe hint */}
      <div className="text-center mt-3">
        <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.08em]">← Swipe to decide →</p>
      </div>
    </div>
  );
}
