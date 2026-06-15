import React from "react";
import "./_group.css";

export function Throw() {
  return (
    <div
      className="w-[390px] min-h-[844px] flex flex-col relative overflow-hidden toast-rps-bg mx-auto"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="pt-14 pb-4 px-6 flex justify-between items-center z-10">
        <div className="flex -space-x-3">
          <div className="toast-avatar z-10 border-2 border-[#FFCC02]">😎</div>
          <div className="toast-avatar z-0 border-2 border-white">👩🏻</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-bold tracking-widest text-red-500 uppercase animate-pulse">Live</span>
          <span className="toast-ink font-bold text-lg leading-tight">Duel in progress</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 animate-scale-pop">
        
        {/* Opponent Area */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm mb-4 border border-[rgba(16,24,40,.06)] animate-float">
            👩🏻
          </div>
          <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-[rgba(16,24,40,.06)] shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="toast-ink font-bold text-sm">Mint is ready</span>
          </div>
        </div>

        {/* VS / Countdown */}
        <div className="my-8 text-center">
          <div className="text-[13px] font-bold text-[#FFCC02] tracking-[0.3em] uppercase mb-1">Shoot on 3</div>
          <div className="text-6xl font-black toast-ink">ROCK</div>
        </div>

        {/* Player Area */}
        <div className="w-full mt-12">
          <div className="grid grid-cols-3 gap-3">
            <button className="toast-card aspect-square flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform opacity-60">
              <span className="text-4xl">✋</span>
              <span className="font-bold text-[13px] text-slate-400">PAPER</span>
            </button>
            <button className="toast-card aspect-square flex flex-col items-center justify-center gap-2 border-2 border-[#FFCC02] bg-[#FFCC02]/10 shadow-[0_8px_30px_-6px_rgba(255,204,2,0.4)] transform scale-105 transition-all">
              <span className="text-5xl animate-bounce-hand">✊</span>
              <span className="font-bold text-[13px] toast-ink">ROCK</span>
            </button>
            <button className="toast-card aspect-square flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform opacity-60">
              <span className="text-4xl">✌️</span>
              <span className="font-bold text-[13px] text-slate-400">SCISSORS</span>
            </button>
          </div>
          <div className="mt-8 text-center text-sm font-medium toast-muted">
            You locked in Rock. Waiting...
          </div>
        </div>
      </div>
    </div>
  );
}
