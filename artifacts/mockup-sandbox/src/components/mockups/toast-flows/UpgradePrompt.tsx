import React from 'react';
import { X, Bookmark, Sparkles, Calendar, Smartphone } from 'lucide-react';

export function UpgradePrompt() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] relative overflow-hidden font-['Figtree',sans-serif] flex flex-col mx-auto shadow-2xl">
      {/* Decorative Background Circles */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFCC02] opacity-[0.06] blur-[80px] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-1/4 left-0 w-[250px] h-[250px] bg-[#FFCC02] opacity-[0.06] blur-[80px] rounded-full pointer-events-none -translate-x-1/2" />

      {/* Dismiss Header */}
      <div className="pt-11 px-6 flex justify-end relative z-10">
        <button className="w-9 h-9 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full flex items-center justify-center">
          <X className="w-5 h-5 text-neutral-500" strokeWidth={2.5} />
        </button>
      </div>

      {/* Illustration Area */}
      <div className="mt-16 flex justify-center relative z-10">
        <div className="w-[140px] h-[260px] bg-white rounded-[28px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] rotate-[2deg] p-4 flex flex-col gap-3 relative border border-neutral-50">
          {/* Abstract App UI */}
          <div className="w-full h-8 bg-neutral-100 rounded-[10px]" />
          <div className="w-2/3 h-3 bg-neutral-100 rounded-md" />
          <div className="w-full h-[88px] bg-neutral-50 rounded-xl border border-neutral-100 mt-2 flex flex-col justify-between p-2">
            <div className="w-8 h-8 bg-neutral-200 rounded-lg" />
            <div className="flex justify-between items-end">
              <div className="w-12 h-2 bg-neutral-200 rounded-sm" />
              <div className="w-6 h-2 bg-neutral-200 rounded-sm" />
            </div>
          </div>
          <div className="w-full h-10 bg-[#FFCC02]/20 rounded-xl mt-auto" />

          {/* Floating Badge */}
          <div className="absolute -top-4 -right-4 w-11 h-11 bg-[#FFCC02] rounded-xl shadow-[0_8px_24px_-4px_rgba(255,204,2,0.5)] flex items-center justify-center rotate-[-8deg] border-2 border-white">
            <Sparkles className="w-5 h-5 text-neutral-900" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="mt-10 px-6 relative z-10">
        <h1 className="text-[28px] font-extrabold text-center text-neutral-900 leading-[1.15] tracking-[-0.03em]">
          Your plans deserve<br />a home
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 text-center leading-relaxed mt-3 max-w-[280px] mx-auto">
          Save your plans, get smarter suggestions, and keep the good times going.
        </p>
      </div>

      {/* Benefits List */}
      <div className="mt-10 px-8 flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5 text-[#FFCC02]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 text-[14px] tracking-tight">Save all your plans</span>
            <span className="text-[12px] font-medium text-neutral-400 mt-0.5">Access your history anytime</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#FFCC02]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 text-[14px] tracking-tight">Smarter suggestions</span>
            <span className="text-[12px] font-medium text-neutral-400 mt-0.5">AI learns what you love</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-[#FFCC02]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 text-[14px] tracking-tight">Instant booking</span>
            <span className="text-[12px] font-medium text-neutral-400 mt-0.5">Reserve directly from the app</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FFCC02]/10 rounded-xl flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-[#FFCC02]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 text-[14px] tracking-tight">Continue anytime</span>
            <span className="text-[12px] font-medium text-neutral-400 mt-0.5">Pick up where you left off</span>
          </div>
        </div>
      </div>

      {/* CTA Area */}
      <div className="mt-auto pb-12 px-6 pt-6 relative z-10">
        <button className="w-full bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] flex items-center justify-center text-[16px] active:scale-[0.98] transition-transform">
          Get the full experience
        </button>
        <button className="w-full text-[13px] text-neutral-400 font-medium text-center mt-3 active:text-neutral-600 transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  );
}
