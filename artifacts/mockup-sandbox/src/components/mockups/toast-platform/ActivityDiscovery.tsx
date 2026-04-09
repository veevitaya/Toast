import React, { useState } from 'react';
import {
  MapPin, Clock, ArrowRight, UtensilsCrossed, Flame, Compass, Palette,
  Users, GlassWater, Wallet, Star, Zap, Gem
} from 'lucide-react';

const VIBES = [
  { id: 'chill', label: 'Chill', icon: GlassWater },
  { id: 'fun', label: 'Fun', icon: Flame },
  { id: 'date-night', label: 'Date Night', icon: Star },
  { id: 'adventurous', label: 'Adventurous', icon: Compass },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'artsy', label: 'Artsy', icon: Palette },
  { id: 'active', label: 'Active', icon: Zap },
  { id: 'budget', label: 'Budget-friendly', icon: Wallet },
  { id: 'premium', label: 'Premium', icon: Gem },
];

const CONTEXTS = [
  { id: 'before-food', label: 'Before food' },
  { id: 'after-food', label: 'After food' },
  { id: 'browsing', label: 'Just browsing' },
];

const ACTIVITIES = [
  {
    id: 1,
    title: 'The Last Bank Heist',
    cover: 'https://images.unsplash.com/photo-1543160408-db0e8790cb93?auto=format&fit=crop&q=80',
    category: 'Escape Room',
    vibes: ['adventurous', 'fun'],
    area: 'Siam Square',
    time: '60 min',
    price: '฿500-800',
  },
  {
    id: 2,
    title: 'Tichuca Rooftop Bar',
    cover: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80',
    category: 'Nightlife',
    vibes: ['chill', 'date night', 'premium'],
    area: 'Thong Lo',
    time: '2-3 hrs',
    price: '฿฿฿',
  },
  {
    id: 3,
    title: 'A Clay Ceramic Workshop',
    cover: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80',
    category: 'Workshop',
    vibes: ['artsy', 'chill'],
    area: 'Sathorn',
    time: '120 min',
    price: '฿1,200',
  },
  {
    id: 4,
    title: 'Jodd Fairs Night Market',
    cover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80',
    category: 'Market',
    vibes: ['fun', 'budget', 'social'],
    area: 'Rama 9',
    time: '2-4 hrs',
    price: '฿-฿฿',
  },
  {
    id: 5,
    title: 'Bang Krachao Cycling',
    cover: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80',
    category: 'Outdoor',
    vibes: ['active', 'budget', 'chill'],
    area: 'Phra Pradaeng',
    time: '3-4 hrs',
    price: '฿100',
  },
  {
    id: 6,
    title: 'MOCA Bangkok',
    cover: 'https://images.unsplash.com/photo-1518998053401-a4149019865a?auto=format&fit=crop&q=80',
    category: 'Exhibition',
    vibes: ['artsy', 'chill'],
    area: 'Chatuchak',
    time: '2-3 hrs',
    price: '฿280',
  }
];

export function ActivityDiscovery() {
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['chill']);
  const [selectedContext, setSelectedContext] = useState('before-food');

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeId)
        ? prev.filter((id) => id !== vibeId)
        : [...prev, vibeId]
    );
  };

  return (
    <div className="w-[390px] h-[844px] bg-[#FAFAF8] flex flex-col relative overflow-hidden font-['Figtree',sans-serif]">
      {/* Header */}
      <div className="pt-14 pb-4 px-5 bg-white shadow-sm z-10 relative shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-1">
          What's the vibe?
        </h1>
        <p className="text-sm text-neutral-500 mb-4">
          Pick your mood to find the perfect activity.
        </p>

        {/* Vibe Chips (Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {VIBES.map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.id);
            const Icon = vibe.icon;
            return (
              <button
                key={vibe.id}
                onClick={() => toggleVibe(vibe.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FFCC02] text-black font-semibold shadow-sm transform scale-105'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 font-medium'
                }`}
              >
                <Icon size={16} className={isSelected ? 'text-black' : 'text-neutral-500'} />
                <span className="text-sm">{vibe.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context Selector */}
      <div className="flex p-1 bg-neutral-200/50 mx-5 mt-4 rounded-xl shrink-0">
        {CONTEXTS.map((context) => (
          <button
            key={context.id}
            onClick={() => setSelectedContext(context.id)}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
              selectedContext === context.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {context.label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 scrollbar-hide">
        <div className="space-y-5">
          {ACTIVITIES.map((activity) => (
            <div key={activity.id} className="group relative rounded-[32px] overflow-hidden shadow-sm bg-neutral-900 aspect-[3/4]">
              {/* Background Image */}
              <img
                src={activity.cover}
                alt={activity.title}
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/90" />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-bold text-neutral-900 uppercase tracking-wider shadow-sm">
                  {activity.category}
                </span>
                <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-[11px] font-bold text-white shadow-sm">
                  {activity.price}
                </span>
              </div>

              {/* Content Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 pt-20">
                <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                  {activity.title}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.vibes.map((v, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-semibold text-white capitalize">
                      {v}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-white/90 text-[13px] font-medium mb-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-[#FFCC02]" />
                    <span>{activity.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-[#FFCC02]" />
                    <span>{activity.time}</span>
                  </div>
                </div>

                <button className="w-full h-12 bg-[#FFCC02] hover:bg-[#F0C000] text-black font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
                  View Details
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bridge to Food */}
      <div className="absolute bottom-6 left-5 right-5 z-20">
        <div className="bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFCC02]/20 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-[#FFCC02]" />
            </div>
            <div>
              <p className="text-white font-bold text-[14px] leading-tight mb-0.5">
                {selectedContext === 'before-food' ? 'Find dinner after?' : 'Grab food before?'}
              </p>
              <p className="text-white/60 text-[12px] font-medium leading-tight">Discover spots nearby</p>
            </div>
          </div>
          <button className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-black text-[13px] font-bold rounded-lg transition-colors">
            Browse
          </button>
        </div>
      </div>
    </div>
  );
}
