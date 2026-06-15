import React from "react";
import { ChevronDown, Sparkles, Users } from "lucide-react";

export function LuckyWheel() {
  return (
    <div 
      className="relative mx-auto w-[390px] h-[844px] bg-[#FAF6EF] overflow-hidden flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[40px] border-[8px] border-[#0F172A]"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes wheel-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .lw-wheel-spin {
          animation: wheel-spin 60s linear infinite;
        }
        @keyframes pointer-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .lw-pointer-bob {
          animation: pointer-bob 1s ease-in-out infinite;
        }
        @keyframes float-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .lw-float-up {
          animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header */}
      <div className="pt-16 pb-6 px-6 text-center lw-float-up" style={{ animationDelay: "0.1s" }}>
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-[0_2px_8px_rgba(16,24,40,0.04)] mb-4">
          <Sparkles className="w-4 h-4 text-[#FFCC02]" />
          <span className="text-xs font-semibold text-[#0F172A] tracking-wide uppercase">Tiebreaker</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">Let fate decide</h1>
        <p className="text-[15px] text-[#6B7280] leading-relaxed px-4">
          You've got 4 tied places. Spin the wheel to pick the winner!
        </p>
      </div>

      {/* Avatars */}
      <div className="flex justify-center items-center -space-x-3 mb-10 lw-float-up" style={{ animationDelay: "0.2s" }}>
        <div className="w-10 h-10 rounded-full border-2 border-[#FAF6EF] bg-[#FFE4B5] flex items-center justify-center text-lg shadow-sm z-40 relative">
          😎
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#FAF6EF] rounded-full"></div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#FAF6EF] bg-[#FFD1DC] flex items-center justify-center text-lg shadow-sm z-30 relative">
          👩🏻
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#FAF6EF] rounded-full"></div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#FAF6EF] bg-[#E6E6FA] flex items-center justify-center text-lg shadow-sm z-20 relative">
          👱🏼‍♀️
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#FAF6EF] rounded-full"></div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#FAF6EF] bg-[#D4F0F0] flex items-center justify-center text-lg shadow-sm z-10 relative">
          👦🏽
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FFCC02] border-2 border-[#FAF6EF] rounded-full animate-pulse"></div>
        </div>
        <div className="pl-5 text-sm font-medium text-[#6B7280]">
          Waiting for Beam...
        </div>
      </div>

      {/* Wheel Section */}
      <div className="relative w-full flex-1 flex flex-col items-center lw-float-up" style={{ animationDelay: "0.3s" }}>
        
        {/* Pointer */}
        <div className="absolute top-[-10px] z-20 lw-pointer-bob">
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 40L0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16L16 40Z" fill="#0F172A"/>
            <path d="M16 36L4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16L16 36Z" fill="#FFCC02"/>
          </svg>
        </div>

        {/* Wheel Graphic */}
        <div className="relative w-[340px] h-[340px] rounded-full bg-white shadow-[0_12px_40px_rgba(16,24,40,0.08)] border-[6px] border-white overflow-hidden">
          
          <div className="absolute inset-0 rounded-full lw-wheel-spin" style={{
            background: 'conic-gradient(#FFCC02 0deg 90deg, #FFFFFF 90deg 180deg, #FEF3C7 180deg 270deg, #FFFFFF 270deg 360deg)'
          }}>
            {/* Divider lines */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-[340px] h-0.5 bg-black/5 rotate-0 absolute"></div>
              <div className="w-[340px] h-0.5 bg-black/5 rotate-90 absolute"></div>
            </div>

            {/* Segment Content */}
            <div className="absolute top-8 right-12 w-[100px] text-center rotate-[45deg] origin-bottom-left">
              <div className="text-3xl mb-1">🍜</div>
              <div className="font-bold text-[#0F172A] text-sm">Hom Duan</div>
            </div>
            
            <div className="absolute bottom-8 right-12 w-[100px] text-center rotate-[135deg] origin-top-left">
              <div className="text-3xl mb-1">🍤</div>
              <div className="font-bold text-[#0F172A] text-sm">Baan<br/>Phadthai</div>
            </div>

            <div className="absolute bottom-8 left-12 w-[100px] text-center rotate-[225deg] origin-top-right">
              <div className="text-3xl mb-1">🥗</div>
              <div className="font-bold text-[#0F172A] text-sm">Err</div>
            </div>

            <div className="absolute top-8 left-12 w-[100px] text-center rotate-[315deg] origin-bottom-right">
              <div className="text-3xl mb-1">🥞</div>
              <div className="font-bold text-[#0F172A] text-sm">Roast</div>
            </div>
          </div>

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-md border-4 border-[#0F172A] flex items-center justify-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#FFCC02] border-2 border-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#0F172A]" />
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent pt-12 lw-float-up" style={{ animationDelay: "0.4s" }}>
        <button className="w-full bg-[#0F172A] text-white rounded-2xl py-4 px-6 font-bold text-[17px] shadow-[0_8px_20px_rgba(15,23,42,0.2)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
          <span>Spin the Wheel</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinelinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
        <div className="text-center mt-4">
          <button className="text-[#6B7280] font-medium text-sm hover:text-[#0F172A] transition-colors">
            Cancel tiebreaker
          </button>
        </div>
      </div>
    </div>
  );
}
