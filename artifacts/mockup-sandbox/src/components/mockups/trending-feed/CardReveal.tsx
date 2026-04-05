import React, { useState, useRef } from "react";
import { Heart, Bookmark, MapPin, Star, TrendingUp, Share2, Compass, Search, User } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  priceLevel: number;
  rating: number;
  reviewCount: number;
  distance: string;
  location: string;
  trendingRank: number;
  tags: string[];
  images: string[];
}

const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Thipsamai",
    category: "Thai · Street Food",
    priceLevel: 2,
    rating: 4.8,
    reviewCount: 12450,
    distance: "1.2 km",
    location: "Maha Chai Rd",
    trendingRank: 1,
    tags: ["Legendary", "Pad Thai", "Michelin Guide"],
    images: [
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&w=800&q=80",
    ]
  },
  {
    id: "2",
    name: "Jay Fai",
    category: "Thai · Seafood",
    priceLevel: 4,
    rating: 4.9,
    reviewCount: 8932,
    distance: "1.5 km",
    location: "Maha Chai Rd",
    trendingRank: 2,
    tags: ["Michelin Star", "Crab Omelette", "Iconic"],
    images: [
      "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80",
    ]
  },
  {
    id: "3",
    name: "Gaggan Anand",
    category: "Progressive Indian",
    priceLevel: 5,
    rating: 4.9,
    reviewCount: 4521,
    distance: "3.4 km",
    location: "Sukhumvit 31",
    trendingRank: 3,
    tags: ["Fine Dining", "Asia's 50 Best", "Experience"],
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    ]
  },
  {
    id: "4",
    name: "Sushi Masato",
    category: "Japanese · Omakase",
    priceLevel: 5,
    rating: 4.8,
    reviewCount: 2105,
    distance: "4.2 km",
    location: "Sukhumvit 31",
    trendingRank: 4,
    tags: ["Omakase", "Intimate", "Michelin Star"],
    images: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    ]
  }
];

function PriceIndicator({ level }: { level: number }) {
  return (
    <span className="text-[13px] font-medium tracking-widest">
      <span className="text-gray-900">{"฿".repeat(level)}</span>
      <span className="text-gray-300">{"฿".repeat(5 - level)}</span>
    </span>
  );
}

function Card({ restaurant }: { restaurant: Restaurant }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="relative w-full h-full snap-start snap-always flex flex-col bg-[#FAFAF8] overflow-hidden">
      {/* Top 60-65% Image Area */}
      <div className="relative w-full h-[65%] bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIdx}
            src={restaurant.images[currentImgIdx]}
            alt={restaurant.name}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setCurrentImgIdx((prev) => (prev + 1) % restaurant.images.length);
            }}
          />
        </AnimatePresence>

        {/* Gradient Overlay for Top Header */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

        {/* Trending Badge */}
        <div className="absolute top-24 left-4 z-10 flex items-center gap-1.5 bg-[#FFCC02] text-gray-900 px-3 py-1.5 rounded-full shadow-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-xs font-bold tracking-wide uppercase">#{restaurant.trendingRank} TRENDING</span>
        </div>

        {/* Carousel Dots */}
        {restaurant.images.length > 1 && (
          <div className="absolute top-24 right-4 z-10 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1.5 rounded-full">
            {restaurant.images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  idx === currentImgIdx ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Card Area (Pulls up over image) */}
      <div className="absolute bottom-[52px] left-0 right-0 h-[45%] bg-[#FAFAF8] rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col pt-8 pb-6 px-6 z-20">
        <div className="flex-1 flex flex-col">
          {/* Header Row: Name & Actions */}
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {restaurant.name}
            </h2>
            <div className="flex gap-2 shrink-0 ml-4">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 transition-transform active:scale-95"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 transition-transform active:scale-95"
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#FFCC02] text-[#FFCC02]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details Line */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-4 text-[14px] text-gray-600">
            <span className="font-medium text-gray-800">{restaurant.category}</span>
            <span className="text-gray-300">·</span>
            <PriceIndicator level={restaurant.priceLevel} />
            <span className="text-gray-300">·</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#FFCC02] text-[#FFCC02]" />
              <span className="font-semibold text-gray-900">{restaurant.rating}</span>
              <span className="text-gray-400">({restaurant.reviewCount.toLocaleString()})</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {restaurant.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-[#F0EEE6] text-[#6B685C] rounded-full text-[12px] font-medium tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          {/* Location & Distance */}
          <div className="flex items-center gap-2 text-gray-500 text-[14px] mb-auto">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{restaurant.location}</span>
            <span className="text-gray-300">•</span>
            <span>{restaurant.distance} away</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full py-4 mt-4 bg-[#FFCC02] hover:bg-[#E6B800] text-gray-900 rounded-2xl font-bold text-[15px] transition-colors shadow-sm">
          View Restaurant
        </button>
      </div>
    </div>
  );
}

export default function CardReveal() {
  return (
    <div className="w-[390px] h-[844px] mx-auto overflow-hidden rounded-[2.5rem] border border-gray-200 shadow-2xl relative bg-black font-sans">
      
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 h-24 pt-12 px-6 flex items-center justify-between z-30 pointer-events-none">
        <h1 className="text-2xl font-bold text-white drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>
          Trending
        </h1>
        <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto border border-white/10">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Snap Scrolling Feed */}
      <div className="w-full h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar">
        {RESTAURANTS.map((restaurant) => (
          <Card key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-[52px] bg-white border-t border-gray-100 flex items-center justify-around px-6 z-30">
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Compass className="w-5 h-5" />
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-900">
          <TrendingUp className="w-5 h-5" />
          <div className="w-1 h-1 bg-[#FFCC02] rounded-full" />
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <User className="w-5 h-5" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}