import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, useAnimate } from "framer-motion";
import { useLocation } from "wouter";
import { addSession, updateSession } from "@/lib/sessionStore";
import { BottomNav } from "@/components/BottomNav";
import { trackEvent } from "@/lib/analytics";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  tags: string[];
  description: string;
  priceLevel: number;
  rating: string;
  address: string;
  imageUrl: string;
  matchChance: number;
  isNew?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 101, name: "Pad Thai", category: "Thai  •  Street food", tags: ["Noodles", "Spicy", "Shrimp", "Budget"], description: "Wok-fried rice noodles with tamarind sauce, crushed peanuts, and fresh lime", priceLevel: 1, rating: "4.8", address: "All over Bangkok", imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60", matchChance: 0, isNew: true },
  { id: 102, name: "Korean BBQ", category: "Korean  •  BBQ", tags: ["Grilled", "Meat", "Group", "Popular"], description: "Sizzling grilled meats at the table with banchan sides and ssamjang sauce", priceLevel: 3, rating: "4.4", address: "Sukhumvit, Siam", imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=60", matchChance: 0.7 },
  { id: 103, name: "Tonkotsu Ramen", category: "Japanese  •  Noodles", tags: ["Noodles", "Pork", "Rich broth", "Quick"], description: "Rich 18-hour pork bone broth with thin noodles, chashu, and seasoned egg", priceLevel: 2, rating: "4.6", address: "Thonglor, Silom", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=60", matchChance: 0 },
  { id: 104, name: "Margherita Pizza", category: "Italian  •  Pizza", tags: ["Cheesy", "Tomato", "Basil", "Classic"], description: "Wood-fired with San Marzano tomatoes, fresh mozzarella, and basil", priceLevel: 2, rating: "4.6", address: "Ekkamai, Sukhumvit", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60", matchChance: 0.5 },
  { id: 105, name: "Smash Burger", category: "American  •  Burgers", tags: ["Burger", "Cheesy", "Fries", "Trending"], description: "Double smash patties with aged cheddar, caramelized onions, and secret sauce", priceLevel: 2, rating: "4.2", address: "Ekkamai, Sukhumvit", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60", matchChance: 0, isNew: true },
  { id: 106, name: "Green Curry", category: "Thai  •  Curry", tags: ["Spicy", "Coconut", "Rice", "Herbal"], description: "Aromatic coconut milk curry with Thai basil, eggplant, and chicken", priceLevel: 1, rating: "4.5", address: "Old Town, Samsen", imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop&q=60", matchChance: 1.0 },
  { id: 107, name: "Sushi Omakase", category: "Japanese  •  Sushi", tags: ["Fresh", "Raw", "Premium", "Authentic"], description: "Chef's choice premium course — seasonal fish flown from Tsukiji market", priceLevel: 4, rating: "4.7", address: "Thonglor, Gaysorn", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60", matchChance: 0 },
  { id: 108, name: "Som Tum", category: "Thai  •  Salad", tags: ["Healthy", "Spicy", "Peanuts", "Cheap"], description: "Crunchy green papaya salad with dried shrimp and roasted peanuts", priceLevel: 1, rating: "4.3", address: "All over Bangkok", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60", matchChance: 0.3 },
  { id: 109, name: "Dim Sum", category: "Chinese  •  Dumplings", tags: ["Dumpling", "Tea time", "Brunch", "Family"], description: "Steamed dumplings, siu mai, and har gow served with jasmine tea", priceLevel: 2, rating: "4.5", address: "Chinatown, CentralWorld", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=60", matchChance: 0 },
  { id: 110, name: "Tacos al Pastor", category: "Mexican  •  Tacos", tags: ["Taco", "Spicy", "Fresh", "Fun"], description: "Spit-roasted pork with pineapple, cilantro, and house-made salsa", priceLevel: 2, rating: "4.1", address: "Sukhumvit 11", imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=60", matchChance: 0 },
  { id: 111, name: "Khao Soi", category: "Thai  •  Northern", tags: ["Curry", "Noodles", "Rich", "Northern"], description: "Rich coconut curry noodles topped with crispy egg noodles", priceLevel: 1, rating: "4.7", address: "Ekkamai, Ari", imageUrl: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60", matchChance: 0.8 },
  { id: 112, name: "Pasta Carbonara", category: "Italian  •  Pasta", tags: ["Pasta", "Bacon", "Creamy", "Classic"], description: "Classic Roman recipe with guanciale, pecorino, and egg yolk", priceLevel: 3, rating: "4.4", address: "Sathorn, Sukhumvit", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=60", matchChance: 0 },
  { id: 113, name: "Eggs Benedict", category: "Brunch  •  Western", tags: ["Eggs", "Bacon", "Brunch", "Coffee"], description: "Poached eggs with hollandaise on toasted brioche — the perfect weekend brunch", priceLevel: 2, rating: "4.7", address: "Thonglor, Phrom Phong", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=60", matchChance: 0.6, isNew: true },
  { id: 114, name: "Souffle Pancakes", category: "Japanese  •  Cafe", tags: ["Fluffy", "Sweet", "Insta", "Japanese"], description: "Jiggly souffle pancakes from Osaka with fresh cream and berries", priceLevel: 2, rating: "4.6", address: "Siam Paragon", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=60", matchChance: 0 },
  { id: 115, name: "Smoothie Bowl", category: "Healthy  •  Vegan", tags: ["Berry", "Bowl", "Healthy", "Pretty"], description: "Vibrant acai or pitaya base topped with granola, fresh fruit, and chia seeds", priceLevel: 2, rating: "4.5", address: "Sukhumvit, Thonglor", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=60", matchChance: 0.4 },
  { id: 116, name: "Bubble Tea", category: "Taiwanese  •  Drinks", tags: ["Boba", "Drink", "Chewy", "Sweet"], description: "Chewy tapioca pearls in creamy milk tea — customize your sweetness", priceLevel: 1, rating: "4.5", address: "Siam, CentralWorld", imageUrl: "https://images.unsplash.com/photo-1541696490-8744a5dc0228?w=600&auto=format&fit=crop&q=60", matchChance: 0.9 },
  { id: 117, name: "Croissant & Coffee", category: "French  •  Bakery", tags: ["Pastry", "Buttery", "Coffee", "French"], description: "Flaky, buttery croissant with perfectly pulled espresso", priceLevel: 2, rating: "4.7", address: "Sukhumvit, Ekkamai", imageUrl: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&auto=format&fit=crop&q=60", matchChance: 0 },
];

const MEMBERS = [
  { name: "You", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Nook", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Beam", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face" },
];

function ConfettiExplosion() {
  const colors = ["#FF385C", "#FFD700", "#00A699", "#FC642D", "#7B61FF", "#00D1C1", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A855F7"];
  const shapes = ["circle", "rect", "star", "strip"];
  const pieces = useMemo(() =>
    Array.from({ length: 120 }).map((_, i) => {
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = 200 + Math.random() * 500;
      return {
        id: i,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity * -1,
        tyEnd: 300 + Math.random() * 400,
        spin: (Math.random() - 0.5) * 1080,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: 4 + Math.random() * 8,
        delay: Math.random() * 0.15,
        duration: 1.8 + Math.random() * 1.2,
      };
    }), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            top: "40%",
            left: "50%",
            width: p.shape === "strip" ? p.size * 0.3 : p.size,
            height: p.shape === "circle" ? p.size : p.size * (p.shape === "strip" ? 2.5 : 0.6),
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "star" ? "2px" : "1px",
            backgroundColor: p.color,
            animation: `confetti-explode ${p.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${p.delay}s forwards`,
            ["--tx" as any]: `${p.tx}px`,
            ["--ty" as any]: `${p.ty}px`,
            ["--ty-end" as any]: `${p.tyEnd}px`,
            ["--spin" as any]: `${p.spin}deg`,
            clipPath: p.shape === "star" ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function useSwipeHintGroup(active: boolean, showHint: boolean) {
  const [scope, animate] = useAnimate();
  const [hintDone, setHintDone] = useState(false);

  useEffect(() => {
    if (active && showHint && !hintDone && scope.current) {
      const runHint = async () => {
        await new Promise(r => setTimeout(r, 500));
        try {
          await animate(scope.current, { x: 35, rotate: 3 }, { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] });
          await animate(scope.current, { x: -28, rotate: -2.5 }, { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] });
          await animate(scope.current, { x: 0, rotate: 0 }, { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] });
        } catch {}
        setHintDone(true);
      };
      runHint();
    }
  }, [active, showHint, hintDone]);

  return scope;
}

function SwipeCardGroup({ item, active, behind, onSwipe, onTap, showHint = false }: { item: MenuItem; active: boolean; behind: boolean; onSwipe: (id: number, dir: "left" | "right" | "super") => void; onTap: () => void; showHint?: boolean }) {
  const hintRef = useSwipeHintGroup(active, showHint);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const yumOpacity = useTransform(x, [0, 80], [0, 1]);
  const nahOpacity = useTransform(x, [0, -80], [0, 1]);
  const superOpacity = useTransform(y, [0, -80], [0, 1]);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<{ x: number; y: number } | null>(null);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const xThreshold = 120;
    const yThreshold = -100;

    if (info.offset.y < yThreshold && Math.abs(info.offset.x) < 80) {
      setExiting({ x: 0, y: -600 });
      onSwipe(item.id, "super");
    } else if (info.offset.x > xThreshold) {
      setExiting({ x: 500, y: info.offset.y });
      onSwipe(item.id, "right");
    } else if (info.offset.x < -xThreshold) {
      setExiting({ x: -500, y: info.offset.y });
      onSwipe(item.id, "left");
    }
    setTimeout(() => setDragging(false), 50);
  };

  if (!active && !behind) return null;

  return (
    <motion.div
      ref={active ? hintRef : undefined}
      style={{
        x: active ? x : 0,
        y: active ? y : 0,
        rotate: active ? rotate : 0,
        zIndex: active ? 10 : 5,
        boxShadow: active
          ? "0 20px 60px -12px rgba(0,0,0,0.2), 0 4px 20px -4px rgba(0,0,0,0.08)"
          : "0 10px 30px -8px rgba(0,0,0,0.12)",
      }}
      initial={behind ? { scale: 0.95, y: 8 } : { scale: 1, y: 0 }}
      animate={
        exiting
          ? { x: exiting.x, y: exiting.y, opacity: 0, rotate: exiting.x > 0 ? 20 : exiting.x < 0 ? -20 : 0 }
          : behind
          ? { scale: 0.96, y: 8, opacity: 0.7 }
          : { scale: 1, y: 0, opacity: 1 }
      }
      transition={exiting ? { duration: 0.35, ease: [0.4, 0, 0.2, 1] } : { type: "spring", damping: 28, stiffness: 280 }}
      drag={active && !exiting ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={() => { if (!dragging && active) onTap(); }}
      className="absolute inset-0 bg-white rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing select-none gpu-accelerated"
      data-testid={`swipe-card-${item.id}`}
    >
      <div className="relative w-full h-[58%]">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5" />

        {active && (
          <>
            <motion.div
              style={{ opacity: yumOpacity }}
              className="absolute top-8 left-6 z-20 gpu-accelerated"
            >
              <div className="bg-[hsl(160,60%,45%)] text-white text-xl font-black rounded-2xl px-5 py-2.5 -rotate-12 border-[3px] border-white/50 flex items-center gap-2"
                style={{ boxShadow: "0 4px 20px rgba(0,200,100,0.3)" }}
              >
                YUM
              </div>
            </motion.div>
            <motion.div
              style={{ opacity: nahOpacity }}
              className="absolute top-8 right-6 z-20 gpu-accelerated"
            >
              <div className="bg-[hsl(348,83%,47%)] text-white text-xl font-black rounded-2xl px-5 py-2.5 rotate-12 border-[3px] border-white/50 flex items-center gap-2"
                style={{ boxShadow: "0 4px 20px rgba(220,38,38,0.3)" }}
              >
                NAH
              </div>
            </motion.div>
            <motion.div
              style={{ opacity: superOpacity }}
              className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 gpu-accelerated"
            >
              <div className="bg-[hsl(45,95%,55%)] text-foreground text-xl font-black rounded-2xl px-5 py-2.5 border-[3px] border-white/50 flex items-center gap-2"
                style={{ boxShadow: "0 4px 20px rgba(234,179,8,0.3)" }}
              >
                SUPERLIKE
              </div>
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <h2 className="text-white text-[26px] font-semibold mb-1 drop-shadow-lg truncate">{item.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-white/90 text-sm font-medium truncate flex-1 min-w-0">{item.category}</span>
            <span className="text-white/50 flex-shrink-0">·</span>
            <span className="text-white/90 text-sm flex-shrink-0">{"฿".repeat(item.priceLevel)}</span>
            <span className="text-white/50 flex-shrink-0">·</span>
            <span className="text-white/90 text-sm flex items-center gap-0.5 flex-shrink-0">★ {item.rating}</span>
          </div>
        </div>

        <div className="absolute top-5 left-5 flex gap-2">
          {item.isNew && (
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              New
            </div>
          )}
        </div>

        <div className="absolute top-5 right-5">
          {item.matchChance >= 0.7 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(160,60%,45%)] flex items-center gap-1"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              {Math.round(item.matchChance * 100)}% match
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-3 flex flex-col h-[42%]">
        <div className="flex flex-wrap gap-1.5 mb-2 overflow-hidden max-h-[2.5rem]">
          {item.tags.map((tag) => (
            <span key={tag} className="text-[11px] bg-gray-100 rounded-full px-2.5 py-1 font-medium text-foreground/80">{tag}</span>
          ))}
        </div>

        <p className="text-foreground/60 text-sm leading-relaxed flex-1 min-h-0 line-clamp-2">{item.description}</p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {MEMBERS.map((m) => (
                <img key={m.name} src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full border-[1.5px] border-white object-cover" />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">{MEMBERS.length} swiping</span>
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[40%]">{item.address}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function GroupSwipe() {
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchNotification, setMatchNotification] = useState<string | null>(null);
  const [fullMatch, setFullMatch] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [matchedItem, setMatchedItem] = useState<MenuItem | null>(null);
  const [superLiked, setSuperLiked] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [matchCount, setMatchCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    addSession({
      id: "group-1",
      type: "group",
      label: "Group Session",
      route: "/group/swipe",
      memberCount: MEMBERS.length,
      matchCount: 0,
      startedAt: Date.now(),
    });
  }, []);

  const handleSwipe = useCallback((id: number, dir: "left" | "right" | "super") => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    if (!item) return;

    trackEvent(dir === "left" ? "swipe_left" : "swipe_right", { restaurantId: id });

    if (dir === "right" || dir === "super") {
      setLiked((prev) => new Set([...prev, id]));
      setLikedCount((c) => c + 1);
      if (dir === "super") setSuperLiked((prev) => new Set([...prev, id]));
    }

    setLastAction(dir === "right" ? "YUM!" : dir === "up" || dir === "super" ? "SUPERLIKE!" : "Nah");
    setTimeout(() => setLastAction(null), 800);

    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;

        if (dir === "right" || dir === "super") {
          if (item.matchChance > 0 && item.matchChance < 1) {
            setTimeout(() => {
              const partner = item.matchChance > 0.5 ? "Nook" : "Beam";
              setMatchNotification(`You and ${partner} both liked ${item.name}!`);
              setMatchCount(c => {
                const newCount = c + 1;
                updateSession("group-1", { matchCount: newCount });
                return newCount;
              });
              setTimeout(() => setMatchNotification(null), 3000);
            }, 300);
          }

          if (item.matchChance === 1.0) {
            setTimeout(() => {
              setMatchedItem(item);
              setConfetti(true);
              setFullMatch(true);
              setMatchCount(c => {
                const newCount = c + 1;
                updateSession("group-1", { matchCount: newCount });
                return newCount;
              });
            }, 300);
          }
        }

        return next;
      });
    }, 300);
  }, []);

  const handleButtonSwipe = (dir: "left" | "right" | "super") => {
    if (currentIndex < MENU_ITEMS.length) {
      handleSwipe(MENU_ITEMS[currentIndex].id, dir);
    }
  };

  const handleTap = (item: MenuItem) => {
    navigate(`/restaurants?category=${encodeURIComponent(item.name)}`);
  };

  if (fullMatch && matchedItem) {
    return (
      <div className="w-full h-[100dvh] bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden" data-testid="group-match-page">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[5%] w-48 h-48 bg-amber-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[15%] right-[10%] w-56 h-56 bg-amber-50/50 rounded-full blur-3xl" />
          <div className="absolute top-[40%] right-[20%] w-32 h-32 bg-green-50/40 rounded-full blur-3xl" />
        </div>

        {confetti && <ConfettiExplosion />}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="mb-3"
        >
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center"
            style={{ boxShadow: "0 12px 40px -8px rgba(255,204,2,0.25)" }}
          >
            <span className="text-5xl inline-block animate-icon-wiggle gpu-accelerated">🎉</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="text-[32px] font-semibold text-center mb-2"
        >
          It's a match!
        </motion.h1>
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="text-muted-foreground text-center mb-4 text-[15px]"
        >
          Everyone agreed on {matchedItem.name}!
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex gap-2.5 mb-7"
        >
          {MEMBERS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ scale: 0, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, type: "spring", damping: 18, stiffness: 250 }}
              className="flex items-center gap-2 bg-green-50/80 rounded-full px-4 py-2 border border-green-200/50"
              style={{ boxShadow: "0 2px 10px rgba(0,200,100,0.08)" }}
            >
              <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-[hsl(160,60%,40%)] text-[11px] font-bold">✓</span>
              <span className="text-xs font-bold">{m.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-72 rounded-[24px] overflow-hidden mb-7"
          style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.18)" }}
        >
          <div className="relative">
            <img src={matchedItem.imageUrl} alt={matchedItem.name} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
          <div className="p-5 bg-white">
            <h3 className="font-semibold text-lg">{matchedItem.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{matchedItem.category}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-medium">★ {matchedItem.rating}</span>
              <span className="text-xs text-muted-foreground">{"฿".repeat(matchedItem.priceLevel)}</span>
              <span className="text-xs text-muted-foreground">· {matchedItem.address}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {matchedItem.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] bg-gray-100 rounded-full px-2.5 py-1 font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => {
            window.location.href = `/restaurants?category=${encodeURIComponent(matchedItem.name)}`;
          }}
          data-testid="button-see-restaurants"
          className="w-full max-w-xs py-4 rounded-full bg-[#FFCC02] text-[#2d2000] font-bold text-[15px] active:scale-[0.96] transition-transform duration-200"
          style={{ boxShadow: "var(--shadow-glow-primary)" }}
        >
          See Restaurants →
        </motion.button>

        <motion.button
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => navigate("/")}
          data-testid="button-home-match"
          className="mt-4 text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors"
        >
          Back to home
        </motion.button>
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-[hsl(30,20%,97%)] flex flex-col overflow-hidden" style={{ touchAction: "none", overscrollBehavior: "none" }} data-testid="group-swipe-page">
      <div className="flex items-center justify-between px-6 pt-12 pb-3">
        <div className="text-left flex items-center gap-2">
          <div>
            <h1 className="font-bold text-[22px] tracking-tight" data-testid="text-group-title">Group Swipe</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Swipe together, eat together</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-1.5">
            {MEMBERS.map((m) => (
              <img key={m.name} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full border-[2px] border-white object-cover" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-muted-foreground"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <span>{Math.min(currentIndex + 1, MENU_ITEMS.length)}</span>
            <span className="text-gray-300">/</span>
            <span>{MENU_ITEMS.length}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 gpu-accelerated"
          >
            <div className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
              lastAction === "YUM!" ? "bg-[hsl(160,60%,45%)]" :
              lastAction === "SUPERLIKE!" ? "bg-[hsl(45,95%,55%)] !text-foreground" :
              "bg-gray-400"
            }`}
              style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
            >
              {lastAction}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative px-5 pb-4">
        {currentIndex >= MENU_ITEMS.length ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              className="relative mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              <span className="text-6xl block">🎉</span>
              <span className="absolute -top-2 -right-3 text-2xl inline-block animate-icon-wiggle gpu-accelerated">✨</span>
            </motion.div>
            <h2 className="text-2xl font-semibold mb-2" data-testid="text-all-done">All done!</h2>
            <p className="text-muted-foreground mb-2 text-sm">Your group liked {likedCount} out of {MENU_ITEMS.length} options</p>
            <p className="text-muted-foreground mb-8 text-xs">Tap below to explore or start over</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setCurrentIndex(0); setLikedCount(0); }}
                data-testid="button-restart"
                className="px-6 py-3.5 rounded-full bg-foreground text-white font-bold text-sm active:scale-[0.96] transition-transform duration-200"
                style={{ boxShadow: "0 8px 25px -5px rgba(0,0,0,0.25)" }}
              >
                Start Over
              </button>
              <button
                onClick={() => navigate("/")}
                data-testid="button-home-done"
                className="px-6 py-3.5 rounded-full bg-white border-2 border-gray-200 font-bold text-sm active:scale-[0.96] transition-transform duration-200"
              >
                Home
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full max-w-sm mx-auto">
            {MENU_ITEMS.map((item, idx) => {
              if (idx < currentIndex || idx > currentIndex + 1) return null;
              return (
                <SwipeCardGroup
                  key={item.id}
                  item={item}
                  active={idx === currentIndex}
                  behind={idx === currentIndex + 1}
                  onSwipe={handleSwipe}
                  onTap={() => handleTap(item)}
                  showHint={idx === 0 && currentIndex === 0}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="px-6 pb-20 flex flex-col gap-3">
        {currentIndex < MENU_ITEMS.length && (
          <div className="flex justify-center items-center gap-5">
            <button
              onClick={() => handleButtonSwipe("left")}
              data-testid="button-nah"
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-gray-100 active:scale-[0.8] active:-rotate-12 transition-transform duration-200 gpu-accelerated"
              style={{ boxShadow: "0 4px 20px -4px rgba(0,0,0,0.08)" }}
            >
              <span className="text-2xl">👎</span>
            </button>

            <button
              onClick={() => handleButtonSwipe("super")}
              data-testid="button-superlike"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-amber-200 active:scale-[0.8] active:-translate-y-2 transition-transform duration-200 gpu-accelerated"
              style={{ boxShadow: "0 4px 20px -4px rgba(234,179,8,0.15)" }}
            >
              <span className="text-lg">⭐</span>
            </button>

            <button
              onClick={() => handleButtonSwipe("right")}
              data-testid="button-yum"
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-green-100 active:scale-[0.8] active:rotate-12 transition-transform duration-200 gpu-accelerated"
              style={{ boxShadow: "0 4px 20px -4px rgba(0,200,100,0.1)" }}
            >
              <span className="text-2xl">😋</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {matchNotification && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-36 left-6 right-6 bg-white rounded-2xl px-5 py-4 flex items-center gap-3 z-50 border border-gray-100 gpu-accelerated"
            style={{ boxShadow: "0 12px 40px -8px rgba(0,0,0,0.12)" }}
            data-testid="match-notification"
          >
            <span className="text-2xl inline-block animate-icon-wiggle gpu-accelerated">
              🎯
            </span>
            <div>
              <p className="font-bold text-sm">{matchNotification}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Keep swiping for a full group match!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
