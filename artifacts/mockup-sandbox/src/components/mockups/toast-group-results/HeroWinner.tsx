import React, { useState, useEffect } from "react";
import { MapPin, Star, Clock, Navigation, Check, ChevronRight, X } from "lucide-react";

export function HeroWinner() {
  const [mounted, setMounted] = useState(false);
  const [showRunnersUp, setShowRunnersUp] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const friends = [
    { name: "You", color: "bg-[#FFCC02]", text: "You" },
    { name: "Mint", color: "bg-[#E2E8F0]", text: "M" },
    { name: "Ploy", color: "bg-[#E2E8F0]", text: "P" },
    { name: "Beam", color: "bg-[#E2E8F0]", text: "B" },
    { name: "Nan", color: "bg-[#E2E8F0]", text: "N" },
  ];

  const runnerUps = [
    { name: "Err Urban Rustic Thai", match: "90%", price: "฿฿", distance: "1.2 km", dish: "🍛" },
    { name: "Baan Phadthai", match: "85%", price: "฿฿", distance: "0.8 km", dish: "🍤" }
  ];

  return (
    <div 
      className="relative mx-auto bg-[#0F172A] overflow-hidden"
      style={{ 
        width: "390px", 
        height: "844px", 
        fontFamily: "'Figtree', system-ui, sans-serif" 
      }}
    >
      {/* Full-bleed Cinematic Background */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
      >
        <img 
          src="/__mockup/images/HeroWinner-hom-duan.png" 
          alt="Khao Soi" 
          className="w-full h-[65%] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/40 via-transparent to-[#0F172A] h-[65%]"></div>
        <div className="absolute top-[64%] bottom-0 left-0 right-0 bg-[#0F172A]"></div>
      </div>

      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between p-6 pt-14 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
          <span className="text-white text-xs font-semibold tracking-wide uppercase">Toast Match</span>
          <span className="text-white/80 text-[10px]">#42</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">
          <X size={20} />
        </button>
      </div>

      {/* Main Content Area - Bottom anchored */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end z-10 pb-10">
        
        {/* Confetti / Tag */}
        <div className={`transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 bg-[#FFCC02] px-3 py-1.5 rounded-full mb-4 shadow-[0_4px_14px_rgba(255,204,2,0.3)]">
            <span className="text-xl">🏆</span>
            <span className="text-[#0F172A] font-bold text-sm tracking-wide">IT'S A MATCH</span>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className={`mb-6 transition-all duration-700 delay-600 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="text-white text-5xl font-extrabold mb-2 tracking-tight leading-none drop-shadow-lg">
            Hom Duan
          </h1>
          <div className="flex items-center gap-3 text-white/90 text-sm font-medium">
            <span className="flex items-center gap-1"><Star size={14} className="text-[#FFCC02] fill-[#FFCC02]" /> 4.8</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>Northern Thai</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>฿฿</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span className="flex items-center gap-1"><MapPin size={12} /> 1.5 km</span>
          </div>
        </div>

        {/* Match Group */}
        <div className={`mb-8 transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">All 5 agreed</span>
          </div>
          <div className="flex items-center">
            {friends.map((friend, i) => (
              <div 
                key={friend.name}
                className={`w-10 h-10 rounded-full border-2 border-[#0F172A] ${friend.color} flex items-center justify-center shadow-md relative`}
                style={{ marginLeft: i === 0 ? "0" : "-12px", zIndex: 10 - i }}
              >
                <span className={`font-bold text-sm ${friend.name === "You" ? "text-[#0F172A]" : "text-[#0F172A]"}`}>{friend.text}</span>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FFCC02] rounded-full border border-[#0F172A] flex items-center justify-center">
                  <Check size={10} className="text-[#0F172A]" strokeWidth={4} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Runner ups toggle */}
        <div className={`mb-6 transition-all duration-700 delay-800 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <button 
            onClick={() => setShowRunnersUp(!showRunnersUp)}
            className="flex items-center justify-between w-full py-3 border-t border-white/10 text-white/70"
          >
            <span className="text-sm font-medium">View 2 runner-ups</span>
            <ChevronRight size={16} className={`transition-transform ${showRunnersUp ? "rotate-90" : ""}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showRunnersUp ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            <div className="space-y-3 pb-2">
              {runnerUps.map((runner, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                      {runner.dish}
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">{runner.name}</div>
                      <div className="text-white/50 text-xs flex gap-2">
                        <span>{runner.match} match</span>
                        <span>•</span>
                        <span>{runner.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className={`transition-all duration-700 delay-900 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <button className="w-full bg-[#FFCC02] text-[#0F172A] h-14 rounded-full font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_8px_30px_-6px_rgba(255,204,2,0.35)] hover:scale-[0.98] transition-transform">
            <Navigation size={20} className="fill-[#0F172A]" />
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
}
