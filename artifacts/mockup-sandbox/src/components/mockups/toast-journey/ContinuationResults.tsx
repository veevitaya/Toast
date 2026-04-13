import React, { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

const DESSERT_DATA = [
  {
    id: 1,
    name: "After You",
    category: "Café & Desserts",
    area: "Siam",
    tags: ["🍯 Sweet", "✨ Instagrammable"],
    price: "฿฿",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Creamery Boutique",
    category: "Ice Cream",
    area: "Ari",
    tags: ["🍨 Artisan", "🧊 Refreshing"],
    price: "฿฿",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Patisserie Rosie",
    category: "French Pastry",
    area: "Silom",
    tags: ["🥐 Elegant", "💫 Premium"],
    price: "฿฿฿",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Mango Tango",
    category: "Thai Dessert",
    area: "Siam Square",
    tags: ["🥭 Tropical", "🌴 Classic"],
    price: "฿",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80"
  }
];

const TABS = ["Dessert", "Drinks", "Activities", "Events"];

export function ContinuationResults() {
  const [activeTab, setActiveTab] = useState("Dessert");

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] shrink-0" />

      {/* Header */}
      <div className="px-6 pt-4 flex items-center justify-between shrink-0">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-neutral-100">
          <ArrowLeft className="w-5 h-5 text-neutral-900" />
        </button>
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900">
          After Dinner
        </h1>
      </div>

      {/* Category Tabs */}
      <div className="px-6 mt-4 shrink-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-colors ${
                activeTab === tab
                  ? "bg-neutral-900 text-white font-semibold"
                  : "bg-white border border-neutral-200 text-neutral-600 font-medium"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Results Feed */}
      <div className="px-6 mt-6 pb-8 flex-1 overflow-y-auto flex flex-col gap-4">
        {DESSERT_DATA.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative">
            {/* Image Area */}
            <div className="h-[140px] w-full relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              {/* Add to plan button */}
              <button className="absolute top-3 right-3 bg-[#FFCC02] rounded-full px-3 py-1.5 text-[12px] font-bold text-neutral-900 shadow-sm z-10 transition-transform active:scale-95">
                Add to plan
              </button>
            </div>
            
            {/* Info Section */}
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-neutral-900">{item.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[13px] text-neutral-500">{item.category}</span>
                  <span className="text-[13px] text-neutral-400">•</span>
                  <span className="text-[13px] text-neutral-500 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {item.area}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="bg-neutral-100 rounded-full px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[14px] font-bold text-neutral-900">{item.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
