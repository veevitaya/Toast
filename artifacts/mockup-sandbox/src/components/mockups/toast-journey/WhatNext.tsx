import React from 'react';
import { CheckCircle2, IceCream, Wine, Compass, Ticket } from 'lucide-react';

export function WhatNext() {
  const options = [
    {
      id: 'dessert',
      title: 'Dessert',
      subtext: 'Something sweet',
      icon: IceCream,
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'drinks',
      title: 'Drinks',
      subtext: 'Keep the vibe going',
      icon: Wine,
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'activities',
      title: 'Activities',
      subtext: 'Fun times ahead',
      icon: Compass,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'events',
      title: 'Events',
      subtext: 'Live & local',
      icon: Ticket,
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative">
      {/* Safe Area */}
      <div className="h-[44px] w-full" />

      {/* Matched Context */}
      <div className="px-6 pt-4">
        <div className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-row items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200&auto=format&fit=crop&q=80" 
            alt="Pad Thai" 
            className="w-[52px] h-[52px] rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-semibold text-[14px] text-neutral-900 leading-tight">Pad Thai at Thipsamai</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5 font-medium">Phra Nakhon · 7:00 PM</p>
          </div>
          <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0 mr-1" />
        </div>
      </div>

      {/* Hero Text */}
      <div className="px-6 mt-6">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-[1.1]">
          Your night doesn't<br />have to end here.
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 mt-2">
          What sounds good next?
        </p>
      </div>

      {/* Continuation Cards */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div 
            key={option.id}
            className="rounded-2xl overflow-hidden relative h-[180px] cursor-pointer group hover:scale-[0.98] transition-transform duration-200"
          >
            <img 
              src={option.image} 
              alt={option.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <option.icon className="text-white/80 w-5 h-5 mb-1.5" />
              <h4 className="text-[16px] font-bold text-white leading-tight">{option.title}</h4>
              <p className="text-[12px] font-medium text-white/60 mt-0.5">{option.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Skip Option */}
      <div className="mt-8 text-center pb-28">
        <button className="text-[13px] text-neutral-400 font-medium hover:text-neutral-600 transition-colors">
          I'm good for tonight
        </button>
      </div>

      {/* Floating Plan Preview */}
      <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#FFCC02]"></div>
        <span className="text-[13px] font-semibold text-neutral-700">1 stop planned</span>
        <button className="text-[13px] font-bold text-[#FFCC02] ml-auto hover:opacity-80 transition-opacity">
          View plan
        </button>
      </div>
    </div>
  );
}
