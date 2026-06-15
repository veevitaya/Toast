import React from 'react';
import { Star, MapPin, ArrowRight, Sparkles, Navigation, Clock, Heart } from 'lucide-react';

export function RecapStory() {
  return (
    <div 
      className="relative w-[390px] min-h-[844px] bg-[#FAF6EF] overflow-hidden mx-auto"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        .rs-animate-in {
          animation: rs-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .rs-delay-1 { animation-delay: 0.1s; }
        .rs-delay-2 { animation-delay: 0.2s; }
        .rs-delay-3 { animation-delay: 0.3s; }
        .rs-delay-4 { animation-delay: 0.4s; }
        .rs-delay-5 { animation-delay: 0.5s; }
        
        @keyframes rs-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .rs-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      {/* Header */}
      <div className="pt-16 px-6 pb-6 rs-animate-in">
        <p className="text-[#6B7280] text-sm font-semibold tracking-widest uppercase mb-2">Tonight's Story</p>
        <h1 className="text-[#0F172A] text-4xl font-extrabold leading-[1.1] tracking-tight">
          It's unanimous. <br/>
          <span className="text-[#6B7280] font-bold">Northern Thai it is.</span>
        </h1>
      </div>

      {/* Main Winner Card */}
      <div className="px-4 rs-animate-in rs-delay-1">
        <div 
          className="bg-white rounded-[24px] overflow-hidden relative"
          style={{ 
            boxShadow: '0 10px 40px -10px rgba(16,24,40,.12), 0 1px 3px rgba(16,24,40,.05)',
            border: '1px solid rgba(16,24,40,.04)'
          }}
        >
          {/* Image Area */}
          <div className="relative h-[280px] w-full overflow-hidden">
            <img 
              src="/__mockup/images/recapstory-homduan.png" 
              alt="Hom Duan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCC02]" fill="#FFCC02" />
              <span className="text-[#0F172A] text-xs font-bold tracking-wide">MATCH</span>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold mb-1 shadow-black/20 text-shadow-sm">Hom Duan</h2>
              <p className="text-white/90 text-sm font-medium">Ekkamai • Northern Thai • ฿฿</p>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-[#FAF6EF] text-[#0F172A] px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold text-sm">
                  <Star className="w-3.5 h-3.5" fill="currentColor" />
                  4.8
                </div>
                <div className="text-[#6B7280] text-sm font-medium flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" />
                  1.2 km
                </div>
              </div>
              
              <div className="flex -space-x-2">
                {['bg-blue-100', 'bg-pink-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100'].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-lg shadow-sm ${color} z-[${5-i}]`}>
                    {['🤠', '👩🏻‍🦰', '👧🏻', '👱🏻‍♂️', '👩🏽‍🦱'][i]}
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[#6B7280] text-[15px] leading-relaxed">
              Renowned for authentic Khao Soi and rich, comforting northern curries. The perfect cozy spot for the whole crew.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Moments */}
      <div className="mt-8 px-6 space-y-8 rs-animate-in rs-delay-2">
        {/* Moment 1 */}
        <div className="relative">
          <div className="absolute left-[15px] top-8 bottom-[-40px] w-px bg-gradient-to-b from-[rgba(16,24,40,.1)] to-transparent" />
          <div className="flex gap-4 relative">
            <div className="w-8 h-8 rounded-full bg-[#FAF6EF] border-2 border-white shadow-sm flex items-center justify-center text-lg z-10 shrink-0">
              🍜
            </div>
            <div>
              <h3 className="text-[#0F172A] font-bold text-lg mb-1">The undeniable craving</h3>
              <p className="text-[#6B7280] text-[15px] leading-snug">
                All 5 of you swiped right on Khao Soi. It wasn't even a contest.
              </p>
            </div>
          </div>
        </div>

        {/* Moment 2 */}
        <div className="flex gap-4 relative">
          <div className="w-8 h-8 rounded-full bg-[#FAF6EF] border-2 border-white shadow-sm flex items-center justify-center text-lg z-10 shrink-0">
            ⚡
          </div>
          <div>
            <h3 className="text-[#0F172A] font-bold text-lg mb-1">Speed demon</h3>
            <p className="text-[#6B7280] text-[15px] leading-snug">
              <span className="font-semibold text-[#0F172A]">Mint</span> matched Hom Duan in just 1.2 seconds. She knew what she wanted.
            </p>
          </div>
        </div>
      </div>

      {/* Runner-ups */}
      <div className="mt-12 px-6 pb-40 rs-animate-in rs-delay-3">
        <h4 className="text-[#0F172A] font-bold text-sm tracking-wide uppercase mb-4">Also on the table</h4>
        <div className="space-y-3">
          {[
            { name: "Soul Food Mahanakhon", match: "4/5 matched", type: "Modern Thai", emoji: "🍛" },
            { name: "Err Urban Rustic Thai", match: "3/5 matched", type: "Street Food", emoji: "🍢" }
          ].map((place, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-[rgba(16,24,40,.04)]">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">
                {place.emoji}
              </div>
              <div className="flex-1">
                <div className="text-[#0F172A] font-bold text-[15px]">{place.name}</div>
                <div className="text-[#6B7280] text-sm">{place.type}</div>
              </div>
              <div className="text-[#6B7280] text-xs font-semibold bg-[#FAF6EF] px-2 py-1 rounded-md">
                {place.match}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent rs-animate-in rs-delay-4 z-50">
        <button 
          className="w-full h-14 bg-[#FFCC02] text-[#0F172A] rounded-full font-bold text-[17px] flex items-center justify-center gap-2"
          style={{
            boxShadow: '0 8px 25px -6px rgba(255,204,2,0.4), 0 4px 10px -4px rgba(255,204,2,0.2)'
          }}
        >
          View Hom Duan
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
