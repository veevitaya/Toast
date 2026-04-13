import React from 'react';
import { ArrowLeft, MapPin, SlidersHorizontal } from 'lucide-react';

export function SoloRecommendations() {
  const recommendations = [
    {
      id: 'tichuca',
      name: 'Tichuca Rooftop Bar',
      category: 'Nightlife',
      area: 'Thong Lo',
      whyFits: 'Perfect wind-down spot after dinner, close by',
      duration: '2-3hrs',
      price: '฿฿฿',
      badge: 'Best match',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'clay',
      name: 'Clay Ceramic Workshop',
      category: 'Workshop',
      area: 'Sathorn',
      whyFits: 'Creative and low-effort, great for tonight',
      duration: '2hrs',
      price: '฿1,200',
      badge: 'Great fit',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'saxophone',
      name: 'Jazz at Saxophone Pub',
      category: 'Live Music',
      area: 'Victory Mon.',
      whyFits: 'Chill vibes, easy after dinner',
      duration: 'Evening',
      price: '฿300',
      badge: 'Easy option',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'escape',
      name: 'Escape Hunt Bangkok',
      category: 'Escape Room',
      area: 'Siam',
      whyFits: 'Fun wildcard — unexpected but fits your group',
      duration: '60min',
      price: '฿800',
      badge: 'Fun wildcard',
      image: 'https://images.unsplash.com/photo-1543160408-db0e8790cb93?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto flex flex-col relative text-neutral-900">
      {/* Safe Area */}
      <div className="h-[44px] w-full shrink-0" />

      {/* Header */}
      <div className="px-6 flex items-center h-14 shrink-0">
        <button className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
          <ArrowLeft className="w-6 h-6 text-neutral-900" strokeWidth={2} />
        </button>
        <h1 className="text-[18px] font-bold text-neutral-900 ml-1">Best chill options tonight</h1>
      </div>

      {/* Explanation */}
      <div className="px-6 mt-1 shrink-0">
        <p className="text-[13px] text-neutral-500">Picked for your vibe and timing ✨</p>
      </div>

      {/* Content Scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Result Cards */}
        <div className="px-6 mt-5 flex flex-col gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* Image Area */}
              <div className="h-[160px] w-full relative">
                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                  <span className="text-[11px] font-bold text-neutral-800">{rec.badge}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-[16px] font-bold text-neutral-900">{rec.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[13px] text-neutral-500">{rec.category} · {rec.area}</span>
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.5} />
                </div>

                <div className="mt-2 bg-[#FFCC02]/10 rounded-xl px-3 py-2">
                  <p className="text-[12px] text-neutral-700 italic">"{rec.whyFits}"</p>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500">🕐 {rec.duration}</span>
                    <span className="text-[11px] text-neutral-500">💰 {rec.price}</span>
                  </div>
                  <button className="bg-[#FFCC02] hover:bg-[#F0C000] active:bg-[#E0B000] transition-colors rounded-full px-4 py-2 text-[12px] font-bold text-neutral-900">
                    Pick this
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="px-6 mt-6 pb-6">
          <div className="flex gap-2">
            <button className="flex-1 bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-2xl h-12 flex items-center justify-center gap-2 hover:bg-neutral-50 active:bg-neutral-100 transition-colors">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
              Refine
            </button>
            <button className="flex-1 bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-2xl h-12 flex items-center justify-center gap-2 hover:bg-neutral-50 active:bg-neutral-100 transition-colors">
              Decide for me ✨
            </button>
          </div>
          <button className="w-full mt-4 text-[13px] font-medium text-neutral-400 text-center hover:text-neutral-600 transition-colors">
            Browse more
          </button>
        </div>
      </div>
    </div>
  );
}
