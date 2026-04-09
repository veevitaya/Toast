import React from 'react';
import { ArrowLeft, Share, MapPin, Star, ChevronRight } from 'lucide-react';

export function MatchReveal() {
  const restaurants = [
    {
      name: 'Thipsamai',
      tags: 'Thai · Classic',
      area: 'Phra Nakhon',
      rating: '4.7',
      price: '฿฿',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pad Thai Fai Ta Lu',
      tags: 'Street Food',
      area: 'Dinso Road',
      rating: '4.5',
      price: '฿',
      image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Baan Pad Thai',
      tags: 'Thai · Modern',
      area: 'Sukhumvit 33',
      rating: '4.3',
      price: '฿฿฿',
      image: 'https://images.unsplash.com/photo-1626804475297-41609ea084eb?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const avatars = [
    'https://i.pravatar.cc/150?u=ploy',
    'https://i.pravatar.cc/150?u=beam',
    'https://i.pravatar.cc/150?u=fern',
    'https://i.pravatar.cc/150?u=ice',
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative pb-[120px]">
      {/* Hero Image Section */}
      <div className="relative h-[340px] w-full">
        <img
          src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80"
          alt="Pad Thai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Floating Actions */}
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-95">
            <Share className="w-5 h-5" />
          </button>
        </div>

        {/* Match Badge */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-[#FFCC02] rounded-full px-5 py-2 shadow-[0_4px_20px_rgba(255,204,2,0.4)] flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[14px] font-bold text-neutral-900">🎉 Perfect Match · 92%</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pt-10">
        <div className="text-center">
          <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900">Pad Thai</h1>
          <p className="text-[14px] font-medium text-neutral-500 mt-1">Thai Classic · Street Food</p>
        </div>

        {/* Group Consensus */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex flex-row items-center -space-x-3">
            {avatars.map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt={`Friend ${i + 1}`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm ring-2 ring-white z-10 relative"
                style={{ zIndex: 10 - i }}
              />
            ))}
          </div>
          <p className="mt-2 text-[13px] font-semibold text-emerald-600">Everyone agreed! 🔥</p>
        </div>

        {/* Restaurant Recommendations */}
        <div className="mt-8">
          <h2 className="text-[18px] font-bold tracking-[-0.02em] text-neutral-900 mb-4">
            Best spots for Pad Thai
          </h2>
          
          <div className="space-y-3">
            {restaurants.map((restaurant, idx) => (
              <button
                key={idx}
                className="w-full bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center text-left transition-transform active:scale-[0.98]"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-[72px] h-[72px] rounded-xl object-cover shrink-0"
                />
                
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-neutral-900 truncate">{restaurant.name}</h3>
                  <p className="text-[13px] font-medium text-neutral-500 mt-0.5 truncate">{restaurant.tags}</p>
                  
                  <div className="flex items-center gap-1.5 mt-1.5 text-[12px] font-medium text-neutral-500">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#FFCC02] text-[#FFCC02]" />
                      <span className="text-neutral-700 font-bold">{restaurant.rating}</span>
                    </div>
                    <span>·</span>
                    <span>{restaurant.price}</span>
                    <span>·</span>
                    <div className="flex items-center gap-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{restaurant.area}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-neutral-300 ml-2 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 w-[390px] bg-white/90 backdrop-blur-xl px-6 py-4 border-t border-neutral-100 z-20">
        <button className="w-full bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] text-[16px] transition-transform active:scale-[0.98] flex items-center justify-center">
          Let's go here! 🍽️
        </button>
        <button className="w-full mt-3 text-[13px] font-semibold text-neutral-400 hover:text-neutral-600 transition-colors text-center pb-2">
          See other options
        </button>
      </div>
    </div>
  );
}
