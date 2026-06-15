import React from "react";
import "./_group.css";

export function Reveal() {
  return (
    <div
      className="w-[390px] min-h-[844px] flex flex-col relative overflow-hidden toast-rps-bg mx-auto"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-[#FFCC02]/10 animate-pulse"></div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] flex items-center justify-center">
          {/* Opponent's Throw (Mint) */}
          <div className="absolute top-0 right-10 flex flex-col items-center animate-clash-right">
            <span className="text-[120px] filter drop-shadow-xl transform -rotate-12">✌️</span>
            <div className="mt-2 bg-white px-4 py-1.5 rounded-full shadow-sm font-bold text-sm text-slate-500">Mint</div>
          </div>

          {/* Your Throw */}
          <div className="absolute bottom-0 left-10 flex flex-col items-center animate-clash-left">
            <div className="mb-2 bg-[#FFCC02] px-4 py-1.5 rounded-full shadow-sm font-bold text-sm text-[#0F172A]">You</div>
            <span className="text-[140px] filter drop-shadow-[0_10px_40px_rgba(255,204,2,0.4)] transform rotate-12">✊</span>
          </div>

          {/* Clash Impact */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
             <div className="w-32 h-32 bg-white/40 rounded-full blur-2xl animate-scale-pop"></div>
          </div>
        </div>

        {/* Verdict */}
        <div className="absolute bottom-24 left-0 w-full text-center animate-slide-up animate-delay-300">
          <div className="inline-block bg-[#0F172A] text-white font-black text-4xl px-8 py-4 rounded-3xl shadow-2xl transform -rotate-2">
            YOU WIN!
          </div>
          <p className="mt-4 text-lg font-bold text-slate-600">Rock smashes Scissors</p>
        </div>

      </div>
    </div>
  );
}
