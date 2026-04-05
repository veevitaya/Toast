import React, { useState, useRef, useEffect } from "react";
import { Heart, Bookmark, Share2, MapPin, Star, TrendingUp, Layers } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";

interface TrendingPost {
  id: number;
  restaurantName: string;
  category: string;
  description: string;
  rating: string;
  priceLevel: number;
  address: string;
  distance: string;
  mediaItems: string[];
  tags: string[];
  trendingRank?: number;
  reviewCount: number;
  isNew?: boolean;
}

const POSTS: TrendingPost[] = [
  {
    id: 1,
    restaurantName: "Thipsamai",
    category: "Thai · Street Food",
    description: "The legendary Pad Thai since 1966. Their signature wrapped-in-egg version is unbeatable — crispy edges, perfectly balanced tamarind sauce, and the freshest river prawns.",
    rating: "4.9",
    priceLevel: 1,
    address: "313 Maha Chai Rd, Samran Rat",
    distance: "1.2 km",
    mediaItems: [
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Iconic", "Pad Thai", "Must Visit"],
    trendingRank: 1,
    reviewCount: 12847,
    isNew: false,
  },
  {
    id: 2,
    restaurantName: "Gaggan Anand",
    category: "Progressive Indian · Fine Dining",
    description: "25-course progressive Indian by the legendary Chef Gaggan. Asia's #1 restaurant — a mind-bending culinary journey you'll never forget.",
    rating: "4.9",
    priceLevel: 4,
    address: "68/1 Soi Langsuan",
    distance: "3.4 km",
    mediaItems: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Asia's Best", "25 Courses", "Fine Dining"],
    trendingRank: 2,
    reviewCount: 8234,
    isNew: false,
  },
  {
    id: 3,
    restaurantName: "Jay Fai",
    category: "Thai · Michelin Street Food",
    description: "The goggle-wearing street food queen. Her legendary crab omelette and drunken noodles earned a Michelin star — the only street food vendor in Thailand.",
    rating: "4.9",
    priceLevel: 3,
    address: "327 Maha Chai Rd",
    distance: "1.5 km",
    mediaItems: [
      "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Michelin", "Crab Omelette", "Legend"],
    trendingRank: 3,
    reviewCount: 15623,
    isNew: false,
  },
  {
    id: 4,
    restaurantName: "Sushi Masato",
    category: "Japanese · Omakase",
    description: "Intimate 8-seat counter with fish flown daily from Tsukiji market. Chef Masato's precision and passion make this Bangkok's finest omakase.",
    rating: "4.9",
    priceLevel: 4,
    address: "Thonglor Soi 13",
    distance: "4.2 km",
    mediaItems: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Omakase", "Premium", "8 Seats"],
    trendingRank: 4,
    reviewCount: 3421,
    isNew: false,
  },
];

function PriceIndicator({ level }: { level: number }) {
  return (
    <span className="text-[13px] tracking-widest font-medium">
      <span className="text-white">{"฿".repeat(level)}</span>
      <span className="text-white/40">{"฿".repeat(4 - level)}</span>
    </span>
  );
}

function ImmersiveCard({ post }: { post: TrendingPost }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isDragging = useRef(false);
  const dragX = useMotionValue(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentIdx < post.mediaItems.length - 1) {
      setDirection(1);
      setCurrentIdx(currentIdx + 1);
    } else if (info.offset.x > threshold && currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(currentIdx - 1);
    }
    setTimeout(() => { isDragging.current = false; }, 50);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative w-full h-full flex-shrink-0 snap-start snap-always overflow-hidden bg-black font-sans">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={currentIdx}
            src={post.mediaItems[currentIdx]}
            alt={post.restaurantName}
            className="absolute inset-0 w-full h-full object-cover"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            drag={post.mediaItems.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => (isDragging.current = true)}
            onDragEnd={handleDragEnd}
            style={{ x: dragX, touchAction: "pan-y" }}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      </div>

      {post.mediaItems.length > 1 && (
        <div className="absolute top-[80px] left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
          {post.mediaItems.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-300 w-6 h-[3px] shadow-sm ${idx === currentIdx ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-[80px] left-4 z-20 flex items-center gap-2">
        {post.trendingRank && (
          <div className="flex items-center gap-1.5 bg-[#FFCC02]/90 text-amber-950 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-[12px] font-bold tracking-wide uppercase">#{post.trendingRank} Trending</span>
          </div>
        )}
      </div>

      <div className="absolute right-4 bottom-[120px] z-20 flex flex-col items-center gap-5">
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-95">
            <Heart className={`w-6 h-6 transition-colors ${isLiked ? "text-[#FFCC02] fill-[#FFCC02]" : "text-white"}`} />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md">12.4K</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-95">
            <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? "text-[#FFCC02] fill-[#FFCC02]" : "text-white"}`} />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md">Save</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 group">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-95">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md">Share</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 group">
          <div className="w-12 h-12 rounded-full bg-[#FFCC02] flex items-center justify-center shadow-[0_0_15px_rgba(255,204,2,0.4)] transition-transform active:scale-95">
            <Layers className="w-6 h-6 text-amber-950" />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md">Invite</span>
        </button>
      </div>

      <div className="absolute left-0 right-16 bottom-[70px] z-20 text-left px-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-white bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full font-medium tracking-wide shadow-sm">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-[32px] font-bold text-white leading-none mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
          {post.restaurantName}
        </h3>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-white shadow-sm">
            <Star className="w-3.5 h-3.5 text-[#FFCC02] fill-[#FFCC02]" />
            <span className="text-[13px] font-bold">{post.rating}</span>
            <span className="text-white/60 text-[12px] font-medium ml-0.5">({post.reviewCount.toLocaleString()})</span>
          </div>
          <span className="text-white/60">•</span>
          <span className="text-white/90 text-[13px] font-medium">{post.category}</span>
          <span className="text-white/60">•</span>
          <PriceIndicator level={post.priceLevel} />
        </div>

        <div className="flex items-center gap-1.5 text-white/80 text-[13px] font-medium bg-black/20 backdrop-blur-sm w-fit px-2.5 py-1 rounded-md">
          <MapPin className="w-3.5 h-3.5" />
          <span>{post.address}</span>
          <span className="text-white/40">•</span>
          <span className="text-[#FFCC02]">{post.distance}</span>
        </div>
      </div>
    </div>
  );
}

export default function ImmersiveStory() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
        }
      `}} />
      <div className="w-[390px] h-[844px] mx-auto overflow-hidden rounded-[2.5rem] border-[8px] border-black shadow-2xl relative bg-black">
        <div className="absolute top-0 left-0 right-0 h-[80px] z-30 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-center pointer-events-none pt-[30px]">
          <h1 className="text-white font-bold text-[17px] tracking-wide drop-shadow-md">Trending</h1>
        </div>

        <div className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {POSTS.map((post) => (
            <ImmersiveCard key={post.id} post={post} />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[52px] bg-[#FAFAF8] z-30 flex items-center justify-around px-6 border-t border-gray-200 pb-safe">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <div className="w-12 h-12 rounded-full bg-[#FFCC02] -mt-6 border-4 border-[#FAFAF8] flex items-center justify-center shadow-lg">
            <span className="text-amber-950 font-bold text-xl leading-none">+</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </>
  );
}
