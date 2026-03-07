import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { useLocation } from "wouter";
import { Heart, Bookmark, Share2, MapPin, Star, TrendingUp, Layers } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { shareMessage } from "@/lib/liff";
import { useToast } from "@/hooks/use-toast";

interface TrendingPost {
  id: number;
  restaurantId: number;
  restaurantName: string;
  category: string;
  description: string;
  rating: string;
  priceLevel: number;
  address: string;
  distance: string;
  mediaItems: { type: "image" | "video"; url: string; poster?: string }[];
  tags: string[];
  trendingRank?: number;
  reviewCount: number;
  isNew?: boolean;
}

const TRENDING_POSTS: TrendingPost[] = [
  {
    id: 1,
    restaurantId: 201,
    restaurantName: "Thipsamai",
    category: "Thai · Street Food",
    description: "The legendary Pad Thai since 1966. Their signature wrapped-in-egg version is unbeatable — crispy edges, perfectly balanced tamarind sauce, and the freshest river prawns.",
    rating: "4.9",
    priceLevel: 1,
    address: "313 Maha Chai Rd, Samran Rat",
    distance: "1.2 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🔥 Iconic", "🍜 Pad Thai", "📸 Must Visit"],
    trendingRank: 1,
    reviewCount: 12847,
    isNew: false,
  },
  {
    id: 2,
    restaurantId: 373,
    restaurantName: "Gaggan Anand",
    category: "Progressive Indian · Fine Dining",
    description: "25-course progressive Indian by the legendary Chef Gaggan. Asia's #1 restaurant — a mind-bending culinary journey you'll never forget.",
    rating: "4.9",
    priceLevel: 4,
    address: "68/1 Soi Langsuan",
    distance: "3.4 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["✨ Asia's Best", "🍽️ 25 Courses", "🌟 Fine Dining"],
    trendingRank: 2,
    reviewCount: 8234,
    isNew: false,
  },
  {
    id: 3,
    restaurantId: 244,
    restaurantName: "Jay Fai",
    category: "Thai · Michelin Street Food",
    description: "The goggle-wearing street food queen. Her legendary crab omelette and drunken noodles earned a Michelin star — the only street food vendor in Thailand.",
    rating: "4.9",
    priceLevel: 3,
    address: "327 Maha Chai Rd",
    distance: "1.5 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["⭐ Michelin", "🦀 Crab Omelette", "🔥 Legend"],
    trendingRank: 3,
    reviewCount: 15623,
    isNew: false,
  },
  {
    id: 4,
    restaurantId: 251,
    restaurantName: "Sushi Masato",
    category: "Japanese · Omakase",
    description: "Intimate 8-seat counter with fish flown daily from Tsukiji market. Chef Masato's precision and passion make this Bangkok's finest omakase.",
    rating: "4.9",
    priceLevel: 4,
    address: "Thonglor Soi 13",
    distance: "4.2 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🍣 Omakase", "✨ Premium", "🎌 8 Seats"],
    trendingRank: 4,
    reviewCount: 3421,
    isNew: false,
  },
  {
    id: 5,
    restaurantId: 231,
    restaurantName: "Peppina",
    category: "Italian · Neapolitan Pizza",
    description: "True Neapolitan pizza fired at 485°C for exactly 90 seconds. San Marzano tomatoes, Campania mozzarella — imported ingredients, authentic taste.",
    rating: "4.8",
    priceLevel: 3,
    address: "Sukhumvit Soi 33",
    distance: "2.8 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🍕 Neapolitan", "🔥 Wood-fired", "🇮🇹 Authentic"],
    trendingRank: 5,
    reviewCount: 6782,
    isNew: true,
  },
  {
    id: 6,
    restaurantId: 341,
    restaurantName: "P'Aor Tom Yum",
    category: "Thai · Soup",
    description: "The creamy tom yum goong that broke the internet. Massive river prawns swimming in a rich, spicy coconut broth — worth every minute of the queue.",
    rating: "4.9",
    priceLevel: 2,
    address: "68 Phetchaburi Soi 5",
    distance: "2.1 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🦐 Giant Prawns", "🌶️ Spicy", "🔥 Viral"],
    trendingRank: 6,
    reviewCount: 9456,
    isNew: false,
  },
  {
    id: 7,
    restaurantId: 604,
    restaurantName: "Vesper",
    category: "Cocktail Bar · Fine Drinks",
    description: "Consistently ranked in Asia's 50 Best Bars. Elegant cocktails infused with Thai ingredients — lemongrass martinis and kaffir lime gimlets.",
    rating: "4.9",
    priceLevel: 4,
    address: "10/15 Convent Rd, Silom",
    distance: "3.8 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🏆 Asia's 50 Best", "🍸 Craft", "🌃 Upscale"],
    trendingRank: 7,
    reviewCount: 4231,
    isNew: false,
  },
  {
    id: 8,
    restaurantId: 261,
    restaurantName: "Daniel Thaiger",
    category: "American · Burger",
    description: "Bangkok's OG food truck revolution. Dry-aged Aussie beef smash burgers with their legendary tiger sauce — started on the street, now an institution.",
    rating: "4.5",
    priceLevel: 2,
    address: "Sukhumvit Soi 36",
    distance: "3.1 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🍔 Smash Burger", "🚚 Food Truck", "🤤 Juicy"],
    trendingRank: 8,
    reviewCount: 7891,
    isNew: false,
  },
  {
    id: 9,
    restaurantId: 602,
    restaurantName: "Teens of Thailand",
    category: "Speakeasy · Gin Bar",
    description: "Asia's 50 Best Bars. A tiny Chinatown speakeasy that redefined Bangkok's cocktail scene with gin-forward craft cocktails in a shophouse setting.",
    rating: "4.8",
    priceLevel: 3,
    address: "76 Soi Nana, Chinatown",
    distance: "1.8 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🍸 Craft Gin", "🚪 Speakeasy", "🌿 Botanical"],
    trendingRank: 9,
    reviewCount: 5123,
    isNew: true,
  },
  {
    id: 10,
    restaurantId: 241,
    restaurantName: "Krua Apsorn",
    category: "Thai · Royal Cuisine",
    description: "Royal recipe green curry awarded Michelin Bib Gourmand. The crab meat yellow curry and stir-fried crab are legendary — fit for royalty.",
    rating: "4.8",
    priceLevel: 1,
    address: "503 Samsen Rd",
    distance: "2.3 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["👑 Royal Recipe", "⭐ Bib Gourmand", "🌶️ Curry"],
    trendingRank: 10,
    reviewCount: 11234,
    isNew: false,
  },
  {
    id: 11,
    restaurantId: 222,
    restaurantName: "Bankara Ramen",
    category: "Japanese · Ramen",
    description: "Rich 18-hour pork bone broth with their secret back-fat topping. Authentic Ikebukuro-style tonkotsu that stands up to the best in Tokyo.",
    rating: "4.7",
    priceLevel: 2,
    address: "Thonglor Soi 10",
    distance: "4.0 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🍜 Tonkotsu", "🍖 Rich", "🇯🇵 Authentic"],
    reviewCount: 6543,
    isNew: false,
  },
  {
    id: 12,
    restaurantId: 601,
    restaurantName: "Tropic City",
    category: "Tiki · Cocktail Bar",
    description: "Award-winning tiki bar serving tropical cocktails, rum flights, and Pacific Island vibes. Charoen Krung's coolest hidden gem.",
    rating: "4.7",
    priceLevel: 3,
    address: "672/65 Charoen Krung 28",
    distance: "1.6 km",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=80" },
    ],
    tags: ["🍹 Tiki", "🌴 Tropical", "🌙 Late Night"],
    reviewCount: 3876,
    isNew: true,
  },
];

const SAVE_KEY = "toast_saved_posts";

function getSavedPosts(): number[] {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
  } catch { return []; }
}

function toggleSavedPost(id: number): boolean {
  const saved = getSavedPosts();
  const idx = saved.indexOf(id);
  if (idx >= 0) {
    saved.splice(idx, 1);
    localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
    return false;
  } else {
    saved.push(id);
    localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
    return true;
  }
}

function PriceIndicator({ level }: { level: number }) {
  return (
    <span className="text-white/90 text-[13px]">
      {"฿".repeat(level)}
      <span className="text-white/30">{"฿".repeat(4 - level)}</span>
    </span>
  );
}

function MediaCarousel({ items, isActive, onTap }: { items: TrendingPost["mediaItems"]; isActive: boolean; onTap: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const isDragging = useRef(false);
  const dragX = useMotionValue(0);

  useEffect(() => {
    if (isActive) setCurrentIdx(0);
  }, [isActive]);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentIdx < items.length - 1) {
      setDirection(1);
      setCurrentIdx(currentIdx + 1);
    } else if (info.offset.x > threshold && currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(currentIdx - 1);
    }
    setTimeout(() => { isDragging.current = false; }, 50);
  };

  const handleTap = (e: React.MouseEvent) => {
    if (isDragging.current) return;
    if (items.length <= 1) {
      onTap();
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;
    if (x < third && currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(currentIdx - 1);
    } else if (x > third * 2 && currentIdx < items.length - 1) {
      setDirection(1);
      setCurrentIdx(currentIdx + 1);
    } else {
      onTap();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="absolute inset-0 bg-black overflow-hidden" onClick={handleTap} data-testid="media-carousel">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={currentIdx}
          src={items[currentIdx].url}
          alt=""
          className="w-full h-full object-cover"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          drag={items.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, touchAction: "pan-y" }}
        />
      </AnimatePresence>

      {items.length > 1 && (
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {items.map((_, idx) => (
            <div
              key={idx}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                idx === currentIdx ? "w-6 bg-white" : "w-3 bg-white/40"
              }`}
              data-testid={`media-dot-${idx}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedCard({
  post,
  isActive,
  isSaved,
  isLiked,
  onSave,
  onLike,
  onShare,
  onNavigate,
  onInviteSwipe,
}: {
  post: TrendingPost;
  isActive: boolean;
  isSaved: boolean;
  isLiked: boolean;
  onSave: () => void;
  onLike: () => void;
  onShare: () => void;
  onNavigate: () => void;
  onInviteSwipe: () => void;
}) {
  return (
    <div className="relative w-full h-full snap-start snap-always" data-testid={`feed-card-${post.id}`}>
      <MediaCarousel items={post.mediaItems} isActive={isActive} onTap={onNavigate} />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      <div className="absolute right-3 bottom-[160px] flex flex-col items-center gap-5 z-10">
        <button
          onClick={onLike}
          className="flex flex-col items-center gap-1"
          data-testid={`button-like-${post.id}`}
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md ${isLiked ? "bg-red-500/90" : "bg-white/15"}`}>
            <Heart className={`w-5 h-5 ${isLiked ? "text-white fill-white" : "text-white"}`} />
          </div>
          <span className="text-white text-[11px] font-medium">{isLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={onSave}
          className="flex flex-col items-center gap-1"
          data-testid={`button-save-${post.id}`}
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md ${isSaved ? "bg-[#FFCC02]/90" : "bg-white/15"}`}>
            <Bookmark className={`w-5 h-5 ${isSaved ? "text-black fill-black" : "text-white"}`} />
          </div>
          <span className="text-white text-[11px] font-medium">{isSaved ? "Saved" : "Save"}</span>
        </button>

        <button
          onClick={onShare}
          className="flex flex-col items-center gap-1"
          data-testid={`button-share-${post.id}`}
        >
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-md">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[11px] font-medium">Share</span>
        </button>

        <button
          onClick={onInviteSwipe}
          className="flex flex-col items-center gap-1"
          data-testid={`button-invite-swipe-${post.id}`}
        >
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-md">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[11px] font-medium">Swipe</span>
        </button>
      </div>

      <div className="absolute bottom-[70px] left-0 right-16 px-4 z-10">
        <div className="flex items-center gap-2 mb-2">
          {post.trendingRank && (
            <div className="flex items-center gap-1 bg-[#FFCC02] text-black px-2 py-0.5 rounded-full" data-testid={`badge-trending-rank-${post.id}`}>
              <TrendingUp className="w-3 h-3" />
              <span className="text-[11px] font-bold">#{post.trendingRank}</span>
            </div>
          )}
          {post.isNew && (
            <div className="bg-[#00B14F] text-white px-2 py-0.5 rounded-full" data-testid={`badge-new-${post.id}`}>
              <span className="text-[11px] font-bold">NEW</span>
            </div>
          )}
          <div className="flex items-center gap-1" data-testid={`text-rating-${post.id}`}>
            <Star className="w-3.5 h-3.5 text-[#FFCC02] fill-[#FFCC02]" />
            <span className="text-white text-[13px] font-semibold">{post.rating}</span>
            <span className="text-white/50 text-[11px]">({post.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <h2 className="text-[22px] font-bold text-white leading-tight mb-0.5" data-testid={`text-restaurant-name-${post.id}`}>
          {post.restaurantName}
        </h2>
        <p className="text-white/70 text-[13px] mb-1.5" data-testid={`text-category-${post.id}`}>{post.category} · <PriceIndicator level={post.priceLevel} /></p>

        <p className="text-white/85 text-[13px] leading-[1.4] mb-2 line-clamp-2" data-testid={`text-description-${post.id}`}>
          {post.description}
        </p>

        <div className="flex items-center gap-1.5 mb-2 flex-wrap" data-testid={`tags-${post.id}`}>
          {post.tags.map((tag, idx) => (
            <span key={tag} className="text-[11px] bg-white/15 text-white/90 px-2 py-0.5 rounded-full backdrop-blur-sm" data-testid={`tag-${post.id}-${idx}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-white/60 text-[12px]" data-testid={`text-location-${post.id}`}>
          <MapPin className="w-3.5 h-3.5" />
          <span>{post.address}</span>
          <span className="mx-1">·</span>
          <span>{post.distance}</span>
        </div>
      </div>

      <div className="absolute bottom-[70px] left-0 right-0 px-4 z-[5] pointer-events-none">
        <div className="h-px bg-white/10 mt-3" />
      </div>
    </div>
  );
}

export default function TrendingFeed() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set(getSavedPosts()));
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const deepLinkId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (deepLinkId && containerRef.current) {
      const targetIdx = TRENDING_POSTS.findIndex((p) => p.id === parseInt(deepLinkId));
      if (targetIdx >= 0) {
        const cardHeight = window.innerHeight;
        containerRef.current.scrollTo({ top: targetIdx * cardHeight, behavior: "instant" });
        setActiveIndex(targetIdx);
      }
    }
  }, [deepLinkId]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const cardHeight = window.innerHeight;
    const idx = Math.round(scrollTop / cardHeight);
    setActiveIndex(idx);
  }, []);

  const handleSave = useCallback((postId: number) => {
    const nowSaved = toggleSavedPost(postId);
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(postId);
      else next.delete(postId);
      return next;
    });
    toast({
      title: nowSaved ? "Saved for later!" : "Removed from saved",
      description: nowSaved ? "You can find this in your saved items" : "",
    });
  }, [toast]);

  const handleLike = useCallback((postId: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }, []);

  const handleShare = useCallback(async (post: TrendingPost) => {
    const appUrl = window.location.origin;
    const shareUrl = `${appUrl}/trending?id=${post.id}`;
    const message = `🔥 Trending on Toast!\n\n${post.restaurantName} — ${post.category}\n⭐ ${post.rating} · ${post.address}\n\n"${post.description.slice(0, 100)}..."\n\nCheck it out:\n${shareUrl}`;
    try {
      await shareMessage(message);
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied!", description: "Share this link with your friends" });
      } catch {
        toast({ title: "Share link", description: shareUrl });
      }
    }
  }, [toast]);

  const handleNavigate = useCallback((post: TrendingPost) => {
    navigate(`/restaurant/${post.restaurantId}`);
  }, [navigate]);

  const handleInviteSwipe = useCallback(async (post: TrendingPost) => {
    const appUrl = window.location.origin;
    const swipeUrl = `${appUrl}/group/swipe?source=trending&restaurantId=${post.restaurantId}`;
    const message = `Let's decide where to eat!\n\n${post.restaurantName} is trending — swipe together?\n\nJoin here:\n${swipeUrl}`;
    try {
      await shareMessage(message);
    } catch {
      try {
        await navigator.clipboard.writeText(swipeUrl);
        toast({ title: "Invite link copied!", description: "Share with friends to swipe together" });
      } catch {
        toast({ title: "Invite to Swipe", description: swipeUrl });
      }
    }
  }, [toast]);

  return (
    <div className="fixed inset-0 bg-black" data-testid="trending-feed-page">
      <div className="absolute top-0 left-0 right-0 z-20 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FFCC02]" />
            <h1 className="text-white text-[18px] font-bold">Trending</h1>
          </div>
          <div className="text-white/50 text-[12px]" data-testid="text-trending-location">
            Bangkok · Near you
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        onScroll={handleScroll}
        style={{ scrollSnapType: "y mandatory" }}
      >
        {TRENDING_POSTS.map((post, idx) => (
          <div
            key={post.id}
            className="w-full"
            style={{ height: "100vh", scrollSnapAlign: "start" }}
          >
            <FeedCard
              post={post}
              isActive={idx === activeIndex}
              isSaved={savedPosts.has(post.id)}
              isLiked={likedPosts.has(post.id)}
              onSave={() => handleSave(post.id)}
              onLike={() => handleLike(post.id)}
              onShare={() => handleShare(post)}
              onNavigate={() => handleNavigate(post)}
              onInviteSwipe={() => handleInviteSwipe(post)}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30">
        <BottomNav showBack={false} />
      </div>
    </div>
  );
}
