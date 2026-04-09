import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, ChevronRight } from 'lucide-react';

const CONTEXTS = ["Before food", "After food", "Just browsing"];
const VIBES = [
  { icon: "🍃", label: "Chill" },
  { icon: "🎉", label: "Fun" },
  { icon: "💫", label: "Date Night" },
  { icon: "🧗", label: "Adventurous" },
  { icon: "👯", label: "Social" },
  { icon: "🎨", label: "Artsy" },
  { icon: "⚡", label: "Active" },
  { icon: "💰", label: "Budget" },
  { icon: "👑", label: "Premium" }
];

const ACTIVITIES = [
  {
    id: 1,
    title: "The Last Bank Heist",
    category: "Escape Room",
    location: "Siam Square",
    time: "60 min",
    price: "฿500-800",
    image: "https://images.unsplash.com/photo-1543160408-db0e8790cb93?w=800&auto=format&fit=crop&q=80",
    tags: ["Thrilling", "Group"]
  },
  {
    id: 2,
    title: "Tichuca Rooftop Bar",
    category: "Nightlife",
    location: "Thong Lo",
    time: "2-3 hrs",
    price: "฿฿฿",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80",
    tags: ["Views", "Cocktails"]
  },
  {
    id: 3,
    title: "Clay Ceramic Workshop",
    category: "Workshop",
    location: "Sathorn",
    time: "120 min",
    price: "฿1,200",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
    tags: ["Creative", "Hands-on"]
  },
  {
    id: 4,
    title: "Jodd Fairs Night Market",
    category: "Market",
    location: "Rama IX",
    time: "Evening",
    price: "Free entry",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    tags: ["Street Food", "Shopping"]
  },
  {
    id: 5,
    title: "Jazz at Saxophone Pub",
    category: "Live Music",
    location: "Victory Monument",
    time: "8PM-1AM",
    price: "฿300",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80",
    tags: ["Cozy", "Local"]
  }
];

export function ActivityDiscovery() {
  const [selectedContext, setSelectedContext] = useState("After food");
  const [selectedVibe, setSelectedVibe] = useState("Fun");

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col mx-auto shadow-2xl">
      {/* Background Gradient */}
      <div className="absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-[#FFCC02]/5 to-transparent pointer-events-none" />

      {/* Header Area */}
      <div className="pt-14 px-6 pb-4 relative z-10 flex-none">
        <button className="w-10 h-10 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center mb-6">
          <ArrowLeft className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
        </button>
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          What's the vibe?
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide relative z-10">
        
        {/* Context Selector */}
        <div className="px-6 mb-6 flex gap-2">
          {CONTEXTS.map(ctx => (
            <button
              key={ctx}
              onClick={() => setSelectedContext(ctx)}
              className={`px-4 py-2.5 rounded-full text-[14px] font-semibold transition-all ${
                selectedContext === ctx
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {ctx}
            </button>
          ))}
        </div>

        {/* Vibe Chips (Horizontal Scroll) */}
        <div className="px-6 mb-8 -mx-6 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-3 px-6 w-max">
            {VIBES.map(vibe => (
              <button
                key={vibe.label}
                onClick={() => setSelectedVibe(vibe.label)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[14px] transition-all whitespace-nowrap ${
                  selectedVibe === vibe.label
                    ? "bg-[#FFCC02] text-neutral-900 font-bold shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]"
                    : "bg-white border border-neutral-100 text-neutral-600 font-medium shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-neutral-50"
                }`}
              >
                <span className="text-lg leading-none">{vibe.icon}</span>
                {vibe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="px-6 space-y-3">
          {ACTIVITIES.map((activity) => (
            <div 
              key={activity.id}
              className="relative h-[220px] rounded-2xl overflow-hidden group cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <img 
                src={activity.image} 
                alt={activity.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {activity.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-[18px] font-bold text-white leading-tight mb-2">
                  {activity.title}
                </h3>
                
                <div className="flex items-center gap-4 text-[12px] text-white/70 font-medium mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{activity.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activity.tags.map(tag => (
                      <span key={tag} className="bg-white/15 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[12px] font-semibold text-white/90">
                    {activity.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Floating Bridge CTA */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <button className="w-full bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] rounded-2xl p-4 flex items-center justify-between active:scale-[0.97] transition-all">
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-bold text-neutral-900">
              🍽️ Grab food after?
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

    </div>
  );
}
