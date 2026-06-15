import React from "react";
import "./_group.css";
import { Star, MapPin, Navigation, RotateCcw } from "lucide-react";

export function Winner() {
  return (
    <div
      className="w-[390px] min-h-[844px] flex flex-col relative overflow-hidden toast-rps-bg mx-auto"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#FFCC02]/30 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="pt-14 pb-4 px-6 flex justify-between items-center z-10 relative">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xl">😎</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-bold tracking-widest text-[#FFCC02] uppercase">Winner's Choice</span>
        </div>
        <div className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center">
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col z-10 relative pb-12 mt-6 animate-slide-up">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold toast-ink mb-2">Khao Soi!</h1>
          <p className="text-slate-500 font-medium text-[16px]">Your champion takes the crown.</p>
        </div>

        {/* Winner Card */}
        <div className="toast-card overflow-hidden flex-1 max-h-[460px] flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="relative h-[220px] w-full bg-slate-100">
            <img 
              src="/__mockup/images/Winner-khaosoi.png" 
              alt="Khao Soi at Hom Duan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="text-base">🍜</span>
              <span className="font-bold text-xs toast-ink tracking-wide">DINNER SORTED</span>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold toast-ink">Hom Duan</h2>
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-sm">4.8</span>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm mb-4">Authentic Northern Thai cuisine.</p>
            
            <div className="flex gap-4 mt-auto">
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                <MapPin className="w-4 h-4 text-slate-400" />
                Ekkamai (1.2 km)
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                <span className="text-slate-400 font-bold">฿฿</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <button className="w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            Let's Go
          </button>
          
          <button className="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-2xl font-bold text-[17px] shadow-sm transform active:scale-95 transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5 text-slate-400" />
            Rematch
          </button>
        </div>

      </div>
    </div>
  );
}
