import React, { useEffect, useState } from 'react';
import { Check, Star, MapPin } from 'lucide-react';

export function FoodMatch() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const avatars = [
    { name: 'Ploy', id: 'ploy' },
    { name: 'Beam', id: 'beam' },
    { name: 'Fern', id: 'fern' },
    { name: 'Ice', id: 'ice' },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] shrink-0 w-full" />

      {/* Celebration header */}
      <div className="mt-8 flex flex-col items-center px-6 text-center">
        <div 
          className={`text-[40px] transition-all duration-700 ease-out ${
            mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-4'
          }`}
        >
          🎉🍽️🎉
        </div>
        <h1 
          className={`text-[32px] font-extrabold text-white tracking-[-0.03em] mt-3 leading-tight transition-all duration-700 delay-100 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          It's a match!
        </h1>
        <p 
          className={`text-[14px] text-white/60 mt-2 transition-all duration-700 delay-200 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Everyone agreed on this one
        </p>
      </div>

      {/* Match card */}
      <div 
        className={`mx-6 mt-8 bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(255,204,2,0.3)] transition-all duration-700 delay-300 ease-out ${
          mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <img 
          src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80" 
          alt="Pad Thai Goong" 
          className="h-[200px] w-full object-cover"
        />
        <div className="p-5">
          <h2 className="text-[22px] font-extrabold text-neutral-900">Pad Thai Goong</h2>
          <p className="text-[13px] text-neutral-500 mt-1">Thai Classic · Street Food</p>
          <div className="mt-3 inline-flex bg-[#FFCC02] rounded-full px-4 py-1.5 items-center gap-1.5">
            <span className="text-[13px] font-bold text-neutral-900">92% match</span>
          </div>
        </div>
      </div>

      {/* Group avatars */}
      <div className="mt-6 flex justify-center gap-4 px-6">
        {avatars.map((avatar, idx) => (
          <div 
            key={avatar.name} 
            className={`flex flex-col items-center transition-all duration-500 ease-out`}
            style={{ 
              opacity: mounted ? 1 : 0, 
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transitionDelay: `${400 + idx * 100}ms` 
            }}
          >
            <div className="relative">
              <img 
                src={`https://i.pravatar.cc/150?u=${avatar.id}`} 
                alt={avatar.name} 
                className="w-12 h-12 rounded-full ring-3 ring-neutral-800 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-neutral-800 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <span className="text-[11px] text-white/70 mt-1">{avatar.name}</span>
          </div>
        ))}
      </div>

      {/* Restaurant suggestion */}
      <div 
        className={`mx-6 mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-[800ms] ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2 font-semibold">Best spot nearby</p>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[18px] font-bold text-white leading-tight">Thipsamai</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-white/60" />
              <p className="text-[13px] text-white/60">Phra Nakhon · 2.4 km · ฿฿</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#FFCC02]/20 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 text-[#FFCC02] fill-[#FFCC02]" />
            <span className="text-[13px] text-[#FFCC02] font-semibold">4.7</span>
          </div>
        </div>
      </div>

      <div className="flex-grow" />

      {/* CTAs */}
      <div 
        className={`px-6 mt-8 pb-10 transition-all duration-700 delay-[900ms] ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button className="bg-[#FFCC02] h-14 rounded-2xl font-bold text-neutral-900 w-full text-[15px] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] flex items-center justify-center">
          Let's go here!
        </button>
        <button className="text-white/50 text-[13px] font-medium text-center w-full mt-4 hover:text-white transition-colors">
          See more restaurants
        </button>
      </div>
    </div>
  );
}
