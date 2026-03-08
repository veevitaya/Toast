import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { useLocation } from "wouter";
import { Heart, Bookmark, Share2, MapPin, Star, TrendingUp, Layers } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { shareMessage, sendGroupInviteNoRedirect } from "@/lib/liff";
import { useLineProfile } from "@/lib/useLineProfile";
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
    tags: ["Iconic", "Pad Thai", "Must Visit"],
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
    tags: ["Asia's Best", "25 Courses", "Fine Dining"],
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
    tags: ["Michelin", "Crab Omelette", "Legend"],
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
    tags: ["Omakase", "Premium", "8 Seats"],
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
    tags: ["Neapolitan", "Wood-fired", "Authentic"],
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
    tags: ["Giant Prawns", "Spicy", "Viral"],
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
    tags: ["Asia's 50 Best", "Craft", "Upscale"],
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
    tags: ["Smash Burger", "Food Truck", "Juicy"],
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
    tags: ["Craft Gin", "Speakeasy", "Botanical"],
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
    tags: ["Royal Recipe", "Bib Gourmand", "Curry"],
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
    tags: ["Tonkotsu", "Rich", "Authentic"],
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
    tags: ["Tiki", "Tropical", "Late Night"],
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
    <span className="text-[13px]">
      <span className="text-gray-800">{"฿".repeat(level)}</span>
      <span className="text-gray-300">{"฿".repeat(4 - level)}</span>
    </span>
  );
}

function ImageCarousel({ items, onTap }: { items: TrendingPost["mediaItems"]; onTap: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const isDragging = useRef(false);
  const dragX = useMotionValue(0);

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

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-gray-100 cursor-pointer"
      style={{ aspectRatio: "4/5" }}
      data-testid="media-carousel"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={currentIdx}
          src={items[currentIdx].url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
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
          onTap={() => { if (!isDragging.current) onTap(); }}
          style={{ x: dragX, touchAction: "pan-y" }}
        />
      </AnimatePresence>

      {items.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-[5px] z-10 pointer-events-none">
          {items.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-300 ${
                idx === currentIdx
                  ? "w-[7px] h-[7px] bg-white shadow-sm"
                  : "w-[6px] h-[6px] bg-white/50"
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
  isSaved,
  isLiked,
  onSave,
  onLike,
  onShare,
  onNavigate,
  onInviteSwipe,
}: {
  post: TrendingPost;
  isSaved: boolean;
  isLiked: boolean;
  onSave: () => void;
  onLike: () => void;
  onShare: () => void;
  onNavigate: () => void;
  onInviteSwipe: () => void;
}) {
  return (
    <div className="pb-6" data-testid={`feed-card-${post.id}`}>
      <div className="relative">
        <ImageCarousel items={post.mediaItems} onTap={onNavigate} />

        <button
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          aria-label={isLiked ? "Unlike" : "Like"}
          data-testid={`button-like-${post.id}`}
        >
          <Heart className={`w-[18px] h-[18px] ${isLiked ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
        </button>

        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          {post.trendingRank && post.trendingRank <= 3 && (
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full shadow-sm" data-testid={`badge-trending-rank-${post.id}`}>
              <TrendingUp className="w-3 h-3" />
              <span className="text-[11px] font-semibold">#{post.trendingRank} Trending</span>
            </div>
          )}
          {post.isNew && (
            <div className="bg-gray-900 text-white px-2.5 py-1 rounded-full" data-testid={`badge-new-${post.id}`}>
              <span className="text-[11px] font-semibold">New</span>
            </div>
          )}
        </div>
      </div>

      <button onClick={onNavigate} className="block w-full text-left pt-3 px-1 cursor-pointer" data-testid={`link-restaurant-${post.id}`}>
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3 className="text-[16px] font-semibold text-gray-900 leading-tight flex-1 min-w-0" data-testid={`text-restaurant-name-${post.id}`}>
            {post.restaurantName}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 pt-0.5" data-testid={`text-rating-${post.id}`}>
            <Star className="w-3.5 h-3.5 text-gray-900 fill-gray-900" />
            <span className="text-[14px] font-medium text-gray-900">{post.rating}</span>
            <span className="text-gray-400 text-[13px]">({post.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <p className="text-gray-500 text-[14px] leading-snug" data-testid={`text-category-${post.id}`}>
          {post.category} · <PriceIndicator level={post.priceLevel} />
        </p>

        <div className="flex items-center gap-1 text-gray-400 text-[13px] mt-0.5" data-testid={`text-location-${post.id}`}>
          <MapPin className="w-3 h-3" />
          <span>{post.address}</span>
          <span>·</span>
          <span>{post.distance}</span>
        </div>

        <p className="text-gray-600 text-[14px] leading-relaxed mt-2 line-clamp-2" data-testid={`text-description-${post.id}`}>
          {post.description}
        </p>

        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap" data-testid={`tags-${post.id}`}>
          {post.tags.map((tag, idx) => (
            <span key={tag} className="text-[12px] text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full font-medium" data-testid={`tag-${post.id}-${idx}`}>
              {tag}
            </span>
          ))}
        </div>
      </button>

      <div className="flex items-center gap-2.5 mt-3 px-1">
        <button
          onClick={onSave}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold border transition-colors ${
            isSaved
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-800 border-gray-300"
          }`}
          aria-label={isSaved ? "Remove from saved" : "Save restaurant"}
          data-testid={`button-save-${post.id}`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-gray-800 text-[13px] font-semibold border border-gray-300"
          aria-label="Share restaurant"
          data-testid={`button-share-${post.id}`}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        <button
          onClick={onInviteSwipe}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-gray-800 text-[13px] font-semibold border border-gray-300"
          aria-label="Invite friends to swipe"
          data-testid={`button-invite-swipe-${post.id}`}
        >
          <Layers className="w-4 h-4" />
          Swipe
        </button>
      </div>
    </div>
  );
}

export default function TrendingFeed() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { profile } = useLineProfile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set(getSavedPosts()));
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [creatingSession, setCreatingSession] = useState(false);

  const deepLinkId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (deepLinkId && containerRef.current) {
      const targetEl = document.querySelector(`[data-testid="feed-card-${deepLinkId}"]`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [deepLinkId]);

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
    const message = `Trending on Toast!\n\n${post.restaurantName} — ${post.category}\n${post.rating} · ${post.address}\n\n"${post.description.slice(0, 100)}..."\n\nCheck it out:\n${shareUrl}`;
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
    if (creatingSession) return;
    setCreatingSession(true);

    try {
      const sessionCode = `t${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;

      const userId = profile?.userId || `guest_${Math.random().toString(36).substring(2, 8)}`;
      const displayName = profile?.displayName || "Guest";
      const pictureUrl = profile?.pictureUrl || "";

      let latitude: string | undefined;
      let longitude: string | undefined;
      if (navigator.geolocation) {
        try {
          const pos = await Promise.race([
            new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000, maximumAge: 60000 });
            }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 3500)),
          ]);
          latitude = pos.coords.latitude.toString();
          longitude = pos.coords.longitude.toString();
        } catch {}
      }

      const sourceData = JSON.stringify({
        source: "trending",
        restaurantId: post.restaurantId,
        restaurantName: post.restaurantName,
      });

      const createRes = await fetch("/api/group/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode,
          hostLineUserId: userId,
          hostDisplayName: displayName,
          hostPictureUrl: pictureUrl,
          sessionType: "trending",
          sourceData,
          latitude,
          longitude,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create session");
      }

      try {
        const shareResult = await sendGroupInviteNoRedirect(sessionCode);
        toast({
          title: "Session created!",
          description: shareResult.shared ? "Invite sent — heading to waiting room" : "Heading to waiting room",
        });
      } catch {
        toast({
          title: "Session created!",
          description: "Invite your friends from the waiting room",
        });
      }

      navigate(`/group/waiting?session=${sessionCode}`);
    } catch (err) {
      console.error("Failed to create trending session:", err);
      toast({ title: "Something went wrong", description: "Could not create swipe session" });
    } finally {
      setCreatingSession(false);
    }
  }, [toast, navigate, profile, creatingSession]);

  return (
    <div className="fixed inset-0 bg-[#FCFCFC]" data-testid="trending-feed-page">
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 leading-tight">Trending</h1>
            <p className="text-gray-400 text-[13px] mt-0.5" data-testid="text-trending-location">Bangkok · Near you</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-[12px] font-medium text-gray-600">This week</span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-full overflow-y-auto pt-[88px] pb-24 px-5 hide-scrollbar"
      >
        <div className="divide-y divide-gray-100">
          {TRENDING_POSTS.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              isSaved={savedPosts.has(post.id)}
              isLiked={likedPosts.has(post.id)}
              onSave={() => handleSave(post.id)}
              onLike={() => handleLike(post.id)}
              onShare={() => handleShare(post)}
              onNavigate={() => handleNavigate(post)}
              onInviteSwipe={() => handleInviteSwipe(post)}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30">
        <BottomNav showBack={false} />
      </div>
    </div>
  );
}
