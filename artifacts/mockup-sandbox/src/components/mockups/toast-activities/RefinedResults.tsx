import React from 'react';
import { ArrowLeft, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export function RefinedResults() {
  const cards = [
    {
      name: "Blu-O Bowling",
      category: "Bowling",
      area: "Sukhumvit",
      whyItFits: "Fun, easy, and budget-friendly — better fit after refinement",
      price: "฿300",
      image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Board Game Garden",
      category: "Café",
      area: "Ari",
      whyItFits: "Social, low-cost, chill — exactly what you asked for",
      price: "฿200",
      image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Jodd Fairs Night Market",
      category: "Night Market",
      area: "Rama IX",
      whyItFits: "Free entry, fun vibes, easy after dinner",
      price: "Free",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative pb-8">
      {/* Safe Area */}
      <div className="h-[44px] w-full" />

      {/* Header */}
      <div className="px-6 flex items-center gap-3">
        <button className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-neutral-900" strokeWidth={2} />
        </button>
        <h1 className="text-[18px] font-bold text-neutral-900">Better fits</h1>
      </div>

      {/* Refinement context */}
      <div className="px-6 mt-3">
        <div className="bg-emerald-50 rounded-xl p-3 flex items-start gap-2 border border-emerald-100/50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-[2px] shrink-0" strokeWidth={2.5} />
          <p className="text-[13px] font-semibold text-emerald-700 leading-snug">
            Adjusted: More fun + Less expensive
          </p>
        </div>
      </div>

      {/* Header text */}
      <div className="px-6 mt-4">
        <p className="text-[14px] text-neutral-500 font-medium">Updated picks based on your input</p>
      </div>

      {/* Result cards */}
      <div className="px-6 mt-4 flex flex-col gap-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="relative h-[140px] w-full">
              <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full px-3 py-1 text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                <span>Stronger fit</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-[16px] text-neutral-900 leading-tight">{card.name}</h3>
              </div>
              
              <div className="flex items-center text-[13px] text-neutral-500 mb-3 font-medium">
                <span>{card.category}</span>
                <span className="mx-1.5 opacity-50">•</span>
                <span>{card.area}</span>
              </div>
              
              <div className="bg-[#FFCC02]/10 rounded-xl px-3 py-2.5 mb-3">
                <p className="text-[12px] font-medium text-neutral-700 leading-relaxed">
                  {card.whyItFits}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-[12px] text-neutral-500 font-medium">
                  <span className="text-neutral-700 font-semibold">{card.price}</span>
                </div>
                <button className="bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors px-4 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                  Pick this
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="px-6 mt-6 flex gap-3">
        <button className="flex-1 bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-2xl h-12 shadow-sm active:scale-[0.98] transition-all">
          Refine again
        </button>
        <button className="flex-1 bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-2xl h-12 shadow-sm active:scale-[0.98] transition-all">
          Browse more
        </button>
      </div>
    </div>
  );
}
