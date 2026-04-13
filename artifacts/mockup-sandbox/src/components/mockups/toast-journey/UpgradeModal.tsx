import React from "react";
import { X, Sparkles, Bookmark, Calendar, Smartphone } from "lucide-react";

export function UpgradeModal() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col shadow-xl">
      {/* Background Decor */}
      <div className="absolute top-[-80px] left-[-40px] w-[250px] h-[250px] bg-[#FFCC02]/[0.06] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[100px] right-[-60px] w-[200px] h-[200px] bg-[#FFCC02]/[0.04] rounded-full blur-[60px] pointer-events-none" />

      {/* Header / Dismiss */}
      <div className="h-[44px] shrink-0 w-full" />
      <div className="px-6 flex justify-end">
        <button className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center transition-colors active:bg-neutral-200">
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Illustration */}
      <div className="mt-16 flex justify-center relative pointer-events-none">
        <div className="relative">
          <div className="w-[130px] h-[240px] bg-white rounded-[24px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] border-4 border-neutral-100 transform -rotate-3 overflow-hidden flex flex-col relative z-10">
            <div className="w-[40px] h-[12px] bg-neutral-100 rounded-full mx-auto mt-2 shrink-0" />
            <div className="w-3/4 h-[8px] bg-[#FFCC02]/40 rounded-full mx-3 mt-4 shrink-0" />
            <div className="flex gap-2 mx-3 mt-2 shrink-0">
              <div className="w-1/2 h-[50px] bg-neutral-50 rounded-xl border border-neutral-100" />
              <div className="w-1/2 h-[50px] bg-neutral-50 rounded-xl border border-neutral-100" />
            </div>
            <div className="w-8 h-[6px] bg-[#FFCC02]/30 rounded-full mx-3 mt-2 shrink-0" />
          </div>
          
          <div className="absolute -right-3 top-[40px] w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center rotate-12 z-20">
            <Sparkles className="w-4 h-4 text-[#FFCC02]" />
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="mt-10 px-8 relative z-10">
        <h1 className="text-[28px] font-extrabold text-neutral-900 text-center leading-tight tracking-[-0.03em]">
          Unlock the full<br />Toast experience
        </h1>
        <p className="text-[14px] text-neutral-500 text-center leading-relaxed mt-3 font-medium">
          Save your plans, get smarter suggestions, and keep the good times going.
        </p>
      </div>

      {/* Benefits */}
      <div className="px-6 mt-8 flex flex-col gap-4 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-5 h-5 text-[#FFCC02]" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-neutral-900">Save all your plans</h3>
            <p className="text-[12px] text-neutral-400 mt-0.5 font-medium">Access your history anytime</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#FFCC02]" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-neutral-900">Smarter suggestions</h3>
            <p className="text-[12px] text-neutral-400 mt-0.5 font-medium">AI learns what you love</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-[#FFCC02]" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-neutral-900">Instant booking</h3>
            <p className="text-[12px] text-neutral-400 mt-0.5 font-medium">Reserve directly from the app</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-[#FFCC02]" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-neutral-900">Continue anytime</h3>
            <p className="text-[12px] text-neutral-400 mt-0.5 font-medium">Pick up where you left off</p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="px-6 mt-auto pb-12 relative z-10 flex flex-col w-full">
        <button className="bg-[#FFCC02] h-14 rounded-2xl w-full font-bold text-neutral-900 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] transition-transform active:scale-[0.98] flex items-center justify-center text-[16px]">
          Get the full experience
        </button>
        <button className="text-[13px] text-neutral-400 font-medium text-center mt-3 py-2 transition-colors active:text-neutral-500 w-full">
          Maybe later
        </button>
      </div>
    </div>
  );
}
