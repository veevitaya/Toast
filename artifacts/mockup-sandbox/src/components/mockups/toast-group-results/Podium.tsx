import React from "react";
import { ChevronLeft, Star, MapPin, Trophy, Navigation, Share, ChevronDown } from "lucide-react";

export function Podium() {
  return (
    <div 
      className="relative w-[390px] h-[844px] overflow-hidden flex flex-col items-center"
      style={{
        fontFamily: "'Figtree', system-ui, sans-serif",
        backgroundColor: "#FAF6EF",
        color: "#0F172A"
      }}
    >
      <style>{`
        .podium-card-shadow {
          box-shadow: 0 10px 30px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.05);
        }
        .podium-runner-shadow {
          box-shadow: 0 4px 15px rgba(16,24,40,0.04), 0 1px 2px rgba(16,24,40,0.02);
        }
        .podium-glass {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        @keyframes float-podium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float-podium 4s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 pt-14 pb-4 relative z-10">
        <button className="w-10 h-10 rounded-full bg-white podium-card-shadow flex items-center justify-center text-[#0F172A] active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-semibold tracking-wide text-[#6B7280] uppercase">RESULTS</span>
          <span className="text-lg font-bold">Group Match</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-white podium-card-shadow flex items-center justify-center text-[#0F172A] active:scale-95 transition-transform">
          <Share className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 w-full overflow-y-auto pb-32 hide-scrollbar relative z-10 px-5 pt-2">
        
        {/* Celebration text */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-[28px] leading-[1.1] font-bold text-[#0F172A] mb-2 tracking-tight">
            We have a winner! 🎉
          </h1>
          <p className="text-[#6B7280] text-[15px]">
            You and 4 others agreed on this spot.
          </p>
          
          <div className="flex justify-center -space-x-2 mt-4">
            {['👩', '👨', '🧑', '👧', '👱‍♂️'].map((emoji, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-[#FFCC02] border-2 border-[#FAF6EF] flex items-center justify-center text-sm shadow-sm relative z-[5-i]">
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Podium Layout */}
        <div className="relative w-full mb-8 mt-12 animate-fade-in-up delay-100">
          
          {/* Winner - Center Elevated */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-[240px] z-20 animate-float">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FFCC02] rounded-full flex items-center justify-center shadow-lg border-4 border-white z-30 transform -rotate-12">
              <span className="text-xl">🏆</span>
            </div>
            
            <div className="bg-white rounded-[24px] overflow-hidden podium-card-shadow border border-[#0F172A]/5 relative">
              <div className="h-[140px] w-full overflow-hidden relative bg-gray-100">
                <img 
                  src="/__mockup/images/podium-hom-duan.png" 
                  alt="Hom Duan" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#FFCC02] fill-[#FFCC02]" />
                  <span className="text-xs font-bold text-[#0F172A]">4.8</span>
                </div>
              </div>
              
              <div className="p-4 pt-3 text-center">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md text-[11px] font-medium text-[#6B7280] mb-2">
                  <span>🍜 Northern Thai</span>
                  <span>•</span>
                  <span>฿฿</span>
                </div>
                <h2 className="text-[22px] font-bold text-[#0F172A] leading-tight mb-1">Hom Duan</h2>
                <div className="flex items-center justify-center gap-1 text-[#6B7280] text-[13px]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>1.2 km away • Ekkamai</span>
                </div>
                
                {/* 5/5 matches indicator */}
                <div className="mt-3 flex items-center justify-center gap-1.5 bg-[#FFCC02]/15 text-[#0F172A] py-1.5 px-3 rounded-full text-xs font-bold">
                  <span className="text-[14px]">🔥</span> 5 out of 5 matched!
                </div>
              </div>
            </div>
          </div>
          
          {/* Base structure to create podium shape behind the cards */}
          <div className="pt-[160px] pb-6 flex justify-between gap-3 relative z-10 px-1">
            
            {/* 2nd Place */}
            <div className="bg-white rounded-[20px] p-3 pt-4 pb-4 w-[48%] podium-runner-shadow relative border border-[#0F172A]/5 flex flex-col items-center text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 border-2 border-white shadow-sm">
                #2
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-xl mb-2">
                🍤
              </div>
              <h3 className="font-bold text-[15px] text-[#0F172A] mb-1 line-clamp-1">Err Urban</h3>
              <div className="text-[12px] text-[#6B7280] flex items-center gap-1">
                <Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" />
                <span>4.6</span>
                <span>•</span>
                <span>0.8km</span>
              </div>
              <div className="mt-2 text-[11px] font-semibold text-[#0F172A]/60 bg-gray-50 px-2 py-0.5 rounded">
                4/5 matched
              </div>
            </div>
            
            {/* 3rd Place */}
            <div className="bg-white rounded-[20px] p-3 pt-4 pb-4 w-[48%] podium-runner-shadow relative border border-[#0F172A]/5 flex flex-col items-center text-center mt-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 border-2 border-white shadow-sm">
                #3
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-xl mb-2">
                🍛
              </div>
              <h3 className="font-bold text-[15px] text-[#0F172A] mb-1 line-clamp-1">Jay Fai</h3>
              <div className="text-[12px] text-[#6B7280] flex items-center gap-1">
                <Star className="w-3 h-3 text-[#FFCC02] fill-[#FFCC02]" />
                <span>4.9</span>
                <span>•</span>
                <span>2.1km</span>
              </div>
              <div className="mt-2 text-[11px] font-semibold text-[#0F172A]/60 bg-gray-50 px-2 py-0.5 rounded">
                3/5 matched
              </div>
            </div>
            
          </div>
        </div>

        {/* View all runner ups */}
        <div className="flex justify-center mt-2 mb-6 animate-fade-in-up delay-200">
          <button className="flex items-center gap-1 text-[13px] font-semibold text-[#6B7280] hover:text-[#0F172A] transition-colors bg-white/50 px-4 py-2 rounded-full border border-gray-200">
            View all 12 runner-ups <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Action Area */}
      <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF]/90 to-transparent z-30">
        <button className="w-full bg-[#FFCC02] text-[#0F172A] font-bold text-[17px] py-4 rounded-[18px] flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] active:scale-[0.98] transition-transform">
          <Navigation className="w-5 h-5" />
          Let's go to Hom Duan
        </button>
        <button className="w-full mt-3 py-3 font-semibold text-[#6B7280] text-[15px] active:opacity-70 transition-opacity">
          Suggest another match
        </button>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-full h-[300px] overflow-hidden pointer-events-none">
        <div className="absolute -left-10 -top-10 w-[200px] h-[200px] rounded-full bg-[#FFCC02]/5 blur-3xl"></div>
        <div className="absolute -right-20 top-20 w-[250px] h-[250px] rounded-full bg-orange-200/10 blur-3xl"></div>
      </div>
    </div>
  );
}
