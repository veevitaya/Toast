import React from 'react';
import { ChevronLeft, Share, Heart, MapPin, Clock, Navigation, Plus, Star } from 'lucide-react';

export function VenueDetails() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative pb-[100px]">
      {/* Hero Image */}
      <div className="relative w-full h-[320px]">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"
          alt="Restaurant interior"
          className="w-full h-full object-cover"
        />
        
        {/* Top Navigation */}
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
            <ChevronLeft className="w-5 h-5 text-neutral-900" />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
              <Share className="w-5 h-5 text-neutral-900" />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
              <Heart className="w-5 h-5 text-neutral-900" />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          Gaggan Anand
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 mt-1">
          Progressive Indian · Fine Dining
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-4 text-[13px] font-semibold text-neutral-700">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FFCC02] text-[#FFCC02]" />
            <span>4.8 <span className="text-neutral-400 font-medium">(420+)</span></span>
          </div>
          <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
          <span>฿฿฿฿</span>
          <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>Phrom Phong</span>
          </div>
        </div>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-2 mt-5">
          {['Date Night', 'Special Occasion', 'Adventurous', 'Premium'].map((tag) => (
            <span key={tag} className="bg-neutral-100 rounded-full px-3 py-1.5 text-[12px] font-medium text-neutral-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="w-full h-[1px] bg-neutral-100 mt-6 mb-6"></div>

        {/* About */}
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.02em] text-neutral-900 mb-3">About</h2>
          <p className="text-[14px] font-medium text-neutral-600 leading-relaxed">
            Asia's most celebrated progressive Indian restaurant. Chef Gaggan Anand creates a 25-course tasting menu that's equal parts science and soul.
          </p>
        </div>

        <div className="w-full h-[1px] bg-neutral-100 mt-6 mb-6"></div>

        {/* Hours */}
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.02em] text-neutral-900 mb-4">Hours</h2>
          <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAFAF8] flex items-center justify-center">
                <Clock className="w-5 h-5 text-neutral-700" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-neutral-900">Tue-Sun 6:00 PM - 11:00 PM</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#06C755]"></div>
                  <span className="text-[12px] font-medium text-[#06C755]">Open now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-neutral-100 mt-6 mb-6"></div>

        {/* Delivery */}
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.02em] text-neutral-900 mb-4">Order Delivery</h2>
          <div className="flex gap-2">
            <button className="flex-1 bg-[#00B14F] text-white rounded-xl h-12 text-[13px] font-bold">
              Grab
            </button>
            <button className="flex-1 bg-[#06C755] text-white rounded-xl h-12 text-[13px] font-bold">
              LINE MAN
            </button>
            <button className="flex-1 bg-[#6C3FAA] text-white rounded-xl h-12 text-[13px] font-bold">
              Robinhood
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 w-[390px] bg-white/95 backdrop-blur-xl px-6 py-4 border-t border-neutral-100 flex gap-3 z-10">
        <button className="flex-1 bg-white border border-neutral-200 text-neutral-800 font-bold rounded-2xl h-14 flex items-center justify-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Navigation className="w-5 h-5" />
          Get Directions
        </button>
        <button className="flex-1 bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 flex items-center justify-center gap-2 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)]">
          <Plus className="w-5 h-5" />
          Add to Plan
        </button>
      </div>
    </div>
  );
}
