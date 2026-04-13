import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export function FoodBridge() {
  const [selectedPicks, setSelectedPicks] = useState<string[]>([]);

  const togglePick = (id: string) => {
    if (selectedPicks.includes(id)) {
      setSelectedPicks(selectedPicks.filter(pickId => pickId !== id));
    } else {
      setSelectedPicks([...selectedPicks, id]);
    }
  };

  const suggestions = [
    {
      id: 'thipsamai',
      name: 'Thipsamai',
      category: 'Thai',
      area: 'Phra Nakhon',
      why: 'Quick, close to your activity',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'somtum-der',
      name: 'Somtum Der',
      category: 'Isaan',
      area: 'Silom',
      why: 'Fast casual, perfect before drinks',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'after-you',
      name: 'After You',
      category: 'Dessert',
      area: 'Siam',
      why: 'Sweet stop on the way',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative pb-10">
      {/* Safe area */}
      <div className="h-[44px]"></div>

      {/* Header */}
      <div className="px-6 flex items-center gap-4">
        <button className="text-neutral-900 w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold text-neutral-900">Add to plan</h1>
      </div>

      {/* Activity context card */}
      <div className="px-6 mt-4">
        <div className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex gap-3 items-center">
          <img 
            src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=200&auto=format&fit=crop&q=80" 
            alt="Tichuca Rooftop Bar" 
            className="w-[56px] h-[56px] rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-[14px] text-neutral-900">Tichuca Rooftop Bar</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">Tonight · 9:30 PM</p>
          </div>
          <CheckCircle2 className="text-emerald-500 w-5 h-5" />
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 mt-6">
        <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          Grab dinner before?
        </h2>
        <p className="text-[14px] text-neutral-500 mt-2 font-medium">
          Here are 3 quick picks that fit
        </p>
      </div>

      {/* Food suggestions */}
      <div className="px-6 mt-5 flex flex-col gap-3">
        {suggestions.map((item) => {
          const isSelected = selectedPicks.includes(item.id);
          return (
            <div 
              key={item.id}
              className={`bg-white rounded-2xl p-3 border ${isSelected ? 'border-[#FFCC02]' : 'border-neutral-100'} shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex gap-3 items-center transition-all cursor-pointer`}
              onClick={() => togglePick(item.id)}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-[64px] h-[64px] rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[14px] text-neutral-900 truncate">{item.name}</h3>
                <p className="text-[12px] text-neutral-500 mt-0.5 truncate">{item.category} · {item.area}</p>
                <p className="text-[11px] text-neutral-400 italic mt-1 truncate">{item.why}</p>
              </div>
              <button 
                className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors ${
                  isSelected 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-[#FFCC02] text-neutral-900'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePick(item.id);
                }}
              >
                {isSelected ? 'Added' : 'Add'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Timing context */}
      <div className="px-6 mt-4">
        <div className="bg-neutral-50 rounded-xl p-3 flex items-center gap-2">
          <Clock className="text-neutral-400 w-4 h-4 flex-shrink-0" />
          <p className="text-[12px] text-neutral-500 leading-tight">
            Dinner at 7:00 PM gives you time before your 9:30 activity
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="px-6 mt-6">
        <button className="bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <Sparkles className="w-5 h-5" />
          Build plan now
        </button>
        <button className="text-[13px] text-neutral-400 text-center w-full mt-3 font-medium hover:text-neutral-600 transition-colors">
          Skip food
        </button>
      </div>
    </div>
  );
}
