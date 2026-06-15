import React from "react";
import "./_group.css";
import { ShieldAlert, Info } from "lucide-react";

export function SecretPick() {
  return (
    <div
      className="w-[390px] min-h-[844px] flex flex-col relative overflow-hidden toast-rps-bg mx-auto"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="pt-14 pb-4 px-6 flex justify-between items-center animate-slide-up">
        <div className="flex -space-x-3">
          <div className="toast-avatar z-10">😎</div>
          <div className="toast-avatar z-0">👩🏻</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-bold tracking-widest text-[#FFCC02] uppercase">Duel Time</span>
          <span className="toast-ink font-bold text-lg leading-tight">You vs Mint</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-24 flex-1 flex flex-col z-10 animate-slide-up animate-delay-100">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold toast-ink mb-3 leading-tight">
            It's a tie! <br />
            Pick your champion.
          </h1>
          <p className="toast-muted text-[15px] leading-relaxed">
            You and Mint both swiped right on these. Secretly pick the one you want most. Winner of RPS gets their choice!
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 flex-1">
          <div className="toast-card p-5 relative overflow-hidden flex items-center justify-between cursor-pointer border-2 border-[#FFCC02]">
            <div className="absolute top-0 right-0 bg-[#FFCC02] text-[#0F172A] text-[11px] font-bold px-3 py-1 rounded-bl-xl z-10">
              YOUR PICK
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-3xl">🍜</div>
              <div>
                <h3 className="toast-ink font-bold text-lg">Khao Soi</h3>
                <p className="toast-muted text-sm">Northern Curry Noodles</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-[#FFCC02] flex items-center justify-center bg-[#FFCC02]">
              <div className="w-2.5 h-2.5 bg-[#0F172A] rounded-full"></div>
            </div>
          </div>

          <div className="toast-card p-5 relative overflow-hidden flex items-center justify-between cursor-pointer opacity-70">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">🍛</div>
              <div>
                <h3 className="toast-ink font-bold text-lg">Green Curry</h3>
                <p className="toast-muted text-sm">Spicy & Sweet</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
          </div>
          
          <div className="toast-card p-5 relative overflow-hidden flex items-center justify-between cursor-pointer opacity-70">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-3xl">🥗</div>
              <div>
                <h3 className="toast-ink font-bold text-lg">Som Tam</h3>
                <p className="toast-muted text-sm">Papaya Salad</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 bg-white/60 px-4 py-2 rounded-full border border-[rgba(16,24,40,.04)]">
            <div className="w-2 h-2 rounded-full bg-[#FFCC02] animate-pulse"></div>
            <span className="text-sm font-medium toast-muted">Mint is picking...</span>
          </div>
          
          <button className="w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all animate-pulse-ring">
            Lock it in
          </button>
        </div>
      </div>
    </div>
  );
}
