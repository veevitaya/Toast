import { useState, useRef, useEffect } from "react";
import { Heart, Bookmark, Share2, MapPin, Star, TrendingUp, Layers, Search, User, ArrowLeft } from "lucide-react";
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
    description: "The legendary Pad Thai since 1966.",
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
    description: "25-course progressive Indian by the legendary Chef Gaggan.",
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
    description: "The goggle-wearing street food queen.",
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
    description: "Intimate 8-seat counter with fish flown daily from Tsukiji.",
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

function analyzeImageBrightness(
  url: string,
  region: "top" | "bottom",
  callback: (isDark: boolean) => void
) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const sy = region === "top" ? 0 : img.height * 0.6;
      const sh = region === "top" ? img.height * 0.15 : img.height * 0.4;
      ctx.drawImage(img, 0, sy, img.width, sh, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let totalLum = 0;
      let darkPixels = 0;
      const pixelCount = size * size;
      for (let i = 0; i < data.length; i += 4) {
        const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        totalLum += lum;
        if (lum < 128) darkPixels++;
      }
      const avgLum = totalLum / pixelCount;
      const darkRatio = darkPixels / pixelCount;
      const isDark = avgLum < 160 || darkRatio > 0.4;
      callback(isDark);
    } catch {}
  };
  img.src = url;
}

function useImageBrightness(url: string) {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => { analyzeImageBrightness(url, "bottom", setIsDark); }, [url]);
  return isDark;
}

function PriceIndicator({ level, isDark }: { level: number; isDark: boolean }) {
  return (
    <span className="text-[13px]">
      <span className={isDark ? "text-white" : "text-gray-900"}>{"฿".repeat(level)}</span>
      <span className={isDark ? "text-white/40" : "text-gray-400"}>{"฿".repeat(4 - level)}</span>
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
  const isDark = useImageBrightness(post.mediaItems[currentIdx]);

  const txt = isDark ? "text-white" : "text-gray-900";
  const txtSub = isDark ? "text-white/90" : "text-gray-700";
  const txtMuted = isDark ? "text-white/60" : "text-gray-500";
  const txtFaint = isDark ? "text-white/50" : "text-gray-400";
  const txtDot = isDark ? "text-white/40" : "text-gray-300";
  const btnBg = isDark ? "bg-black/30 backdrop-blur-md" : "bg-white/50 backdrop-blur-md";
  const btnIcon = isDark ? "text-white" : "text-gray-900";
  const btnLabel = isDark ? "text-white" : "text-gray-700";
  const tagStyle = isDark
    ? "text-white/90 bg-white/15 backdrop-blur-sm"
    : "text-gray-800 bg-black/10 backdrop-blur-sm";
  const dotActive = isDark ? "bg-white" : "bg-gray-900";
  const dotInactive = isDark ? "bg-white/35" : "bg-gray-900/30";
  const badgeBg = isDark
    ? "bg-black/30 backdrop-blur-md border border-white/15"
    : "bg-white/70 backdrop-blur-md border border-black/10";
  const badgeTxt = isDark ? "text-white" : "text-gray-900";
  const gradient = isDark
    ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0) 100%)"
    : "linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0) 100%)";

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
    <div
      className="relative w-full flex-shrink-0 snap-start snap-always overflow-hidden"
      style={{ height: "calc(100% - 52px)", touchAction: "pan-y" }}
    >
      <div className="absolute inset-0 bg-gray-900">
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
      </div>

      {post.mediaItems.length > 1 && (
        <div className="absolute left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none" style={{ top: 56 }}>
          {post.mediaItems.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-300 w-6 h-[3px] ${idx === currentIdx ? dotActive : dotInactive}`}
            />
          ))}
        </div>
      )}

      <div className="absolute left-4 z-20 flex items-center gap-1.5" style={{ top: 56 }}>
        {post.trendingRank && post.trendingRank <= 5 && (
          <div className={`flex items-center gap-1 ${badgeBg} ${badgeTxt} px-2.5 py-1 rounded-full`}>
            <TrendingUp className="w-3 h-3" />
            <span className="text-[11px] font-semibold">#{post.trendingRank}</span>
          </div>
        )}
        {post.isNew && (
          <div className="bg-[#FFCC02] text-gray-900 px-2.5 py-1 rounded-full">
            <span className="text-[11px] font-bold">New</span>
          </div>
        )}
      </div>

      <div className="absolute right-3 z-20 flex flex-col items-center gap-4" style={{ bottom: 210 }}>
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="flex flex-col items-center gap-0.5"
        >
          <div className={`w-11 h-11 rounded-full ${btnBg} flex items-center justify-center`}>
            <Heart className={`w-[22px] h-[22px] ${isLiked ? "text-red-500 fill-red-500" : btnIcon}`} />
          </div>
          <span className={`${btnLabel} text-[10px] font-medium drop-shadow-md`}>{isLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
          className="flex flex-col items-center gap-0.5"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${btnBg}`}>
            <Bookmark className={`w-[22px] h-[22px] ${isSaved ? "text-[#FFCC02] fill-[#FFCC02]" : btnIcon}`} />
          </div>
          <span className={`${btnLabel} text-[10px] font-medium drop-shadow-md`}>{isSaved ? "Saved" : "Save"}</span>
        </button>

        <button className="flex flex-col items-center gap-0.5">
          <div className={`w-11 h-11 rounded-full ${btnBg} flex items-center justify-center`}>
            <Share2 className={`w-[22px] h-[22px] ${btnIcon}`} />
          </div>
          <span className={`${btnLabel} text-[10px] font-medium drop-shadow-md`}>Share</span>
        </button>

        <button className="flex flex-col items-center gap-0.5">
          <div className={`w-11 h-11 rounded-full ${btnBg} flex items-center justify-center`}>
            <Layers className={`w-[22px] h-[22px] ${btnIcon}`} />
          </div>
          <span className={`${btnLabel} text-[10px] font-medium drop-shadow-md`}>Swipe</span>
        </button>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none" style={{ height: "50%" }}>
        <div className="w-full h-full" style={{ background: gradient }} />
      </div>

      <div className="absolute left-0 right-16 z-20 text-left px-5" style={{ bottom: 56 }}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className={`text-[11px] ${tagStyle} px-2.5 py-0.5 rounded-full font-medium`}>
              {tag}
            </span>
          ))}
        </div>

        <h3 className={`text-[24px] font-bold ${txt} leading-tight tracking-tight mb-1`} style={{ fontFamily: "'Figtree', sans-serif" }}>
          {post.restaurantName}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <span className={`${txtSub} text-[13px] font-medium`}>{post.category}</span>
          <span className={txtDot}>·</span>
          <PriceIndicator level={post.priceLevel} isDark={isDark} />
          <span className={txtDot}>·</span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-[#FFCC02] fill-[#FFCC02]" />
            <span className={`${txt} text-[13px] font-semibold`}>{post.rating}</span>
            <span className={`${txtFaint} text-[12px]`}>({post.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <div className={`flex items-center gap-1 ${txtMuted} text-[12px]`}>
          <MapPin className="w-3 h-3" />
          <span>{post.address}</span>
          <span>·</span>
          <span>{post.distance}</span>
        </div>
      </div>
    </div>
  );
}

const BRAND = "#FFCC02";

export default function ImmersiveStory() {
  const activeTab = "trending";

  return (
    <div className="w-[390px] h-[844px] mx-auto overflow-hidden rounded-[2.5rem] border border-gray-200 relative bg-black" style={{ fontFamily: "'Figtree', sans-serif", boxShadow: "0 12px 40px -10px rgba(0,0,0,0.1), 0 4px 16px -4px rgba(0,0,0,0.04)" }}>
      <div className="w-full h-full overflow-y-auto snap-y snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .feed-scroll::-webkit-scrollbar { display: none; }
        `}} />
        {POSTS.map((post) => (
          <ImmersiveCard key={post.id} post={post} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200/60">
        <div className="flex items-center justify-around px-2 pt-2 pb-0.5">
          <button className="flex flex-col items-center justify-center gap-0.5 px-3 py-1" style={{ color: "#9ca3af" }}>
            <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-tight">Back</span>
          </button>

          {[
            { key: "explore", icon: Search, label: "Explore" },
            { key: "trending", icon: TrendingUp, label: "Trending" },
            { key: "profile", icon: User, label: "Profile" },
          ].map((tab) => {
            const isActive = tab.key === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                className="relative flex flex-col items-center justify-center gap-1 px-3 py-1"
              >
                <Icon
                  style={{
                    width: 22,
                    height: 22,
                    color: isActive ? BRAND : "#9ca3af",
                  }}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
                <span
                  className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}
                  style={{ color: isActive ? BRAND : "#9ca3af" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
