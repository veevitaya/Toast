import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, useAnimate } from "framer-motion";
import { useLocation } from "wouter";
import { addSession, updateSession, removeSession } from "@/lib/sessionStore";
import { BottomNav } from "@/components/BottomNav";
import { trackEvent } from "@/lib/analytics";
import { useLineProfile } from "@/lib/useLineProfile";
import { getAccessToken } from "@/lib/liff";
import { handleImageError } from "@/lib/imageUtils";
import { throttleTap } from "@/lib/requestLock";
import { fetchWithTimeout, apiRequest, queryClient } from "@/lib/queryClient";
import { isMenuFirstVibe } from "@shared/vibeConfig";
import { GroupTieBreakerGame } from "@/components/group-tiebreaker/GroupTieBreakerGame";
import { rankByGroupTaste, type MemberTaste } from "@/lib/groupTasteRanking";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Square, X, Trophy, ChevronRight, Crown, ArrowLeft, ExternalLink, MessageCircle, Users, Heart, Utensils, MapPin, UtensilsCrossed, Swords, PartyPopper, Flame, Calendar, Clock } from "lucide-react";

type SwipePhase = "menu" | "restaurant";

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
  isNew?: boolean;
}

interface DishItem {
  id: number;
  name: string;
  nameLocal?: string | null;
  imageUrl: string;
  category: string;
  tags: string[];
  description?: string | null;
  swipeRightCount?: number;
}

interface SessionMember {
  id: number;
  sessionCode: string;
  lineUserId: string;
  displayName: string;
  pictureUrl: string | null;
  joinedAt: string;
}

interface MatchInfo {
  menuItemId: number;
  voters: string[];
}

interface RankedResult {
  item: MenuItem;
  voters: SessionMember[];
  voteCount: number;
  isFullMatch: boolean;
  swipeType: string;
}

function ConfettiExplosion() {
  const colors = ["#FF385C", "#FFD700", "#00A699", "#FC642D", "#7B61FF", "#00D1C1", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A855F7"];
  const shapes = ["circle", "rect", "star", "strip"];
  const pieces = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => {
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

function SwipeCardGroup({ item, active, behind, onSwipe, onTap, showHint = false, members }: { item: MenuItem; active: boolean; behind: boolean; onSwipe: (id: number, dir: "left" | "right" | "super") => void; onTap: () => void; showHint?: boolean; members: SessionMember[] }) {
  const { t } = useLanguage();
  const hintRef = useSwipeHintGroup(active, showHint);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const yumOpacity = useTransform(x, [0, 80], [0, 1]);
  const nahOpacity = useTransform(x, [0, -80], [0, 1]);
  const superOpacity = useTransform(y, [0, -80], [0, 1]);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (swiped.current) return;
    const xThreshold = 120;
    const yThreshold = -100;

    if (info.offset.y < yThreshold && Math.abs(info.offset.x) < 80) {
      swiped.current = true;
      setExiting({ x: 0, y: -600 });
      onSwipe(item.id, "super");
    } else if (info.offset.x > xThreshold) {
      swiped.current = true;
      setExiting({ x: 500, y: info.offset.y });
      onSwipe(item.id, "right");
    } else if (info.offset.x < -xThreshold) {
      swiped.current = true;
      setExiting({ x: -500, y: info.offset.y });
      onSwipe(item.id, "left");
    }
    setTimeout(() => setDragging(false), 50);
  }, [item.id, onSwipe]);

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
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" draggable={false} onError={handleImageError} loading={active ? "eager" : "lazy"} decoding="async" />
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
              {members.map((m) => (
                m.pictureUrl ? (
                  <img key={m.lineUserId} src={m.pictureUrl} alt={m.displayName} className="w-5 h-5 rounded-full border-[1.5px] border-white object-cover" />
                ) : (
                  <div key={m.lineUserId} className="w-5 h-5 rounded-full border-[1.5px] border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-amber-600">{m.displayName.charAt(0)}</span>
                  </div>
                )
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">{members.length} {t("waiting.swiping")}</span>
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[40%]">{item.address}</span>
        </div>
      </div>
    </motion.div>
  );
}


function DishSwipeCard({ dish, active, behind, onSwipe, showHint = false, members }: { dish: DishItem; active: boolean; behind: boolean; onSwipe: (id: number, dir: "left" | "right" | "super") => void; showHint?: boolean; members: SessionMember[] }) {
  const { t } = useLanguage();
  const hintRef = useSwipeHintGroup(active, showHint);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const yumOpacity = useTransform(x, [0, 80], [0, 1]);
  const nahOpacity = useTransform(x, [0, -80], [0, 1]);
  const superOpacity = useTransform(y, [0, -80], [0, 1]);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (swiped.current) return;
    const xThreshold = 120;
    const yThreshold = -100;
    if (info.offset.y < yThreshold && Math.abs(info.offset.x) < 80) {
      swiped.current = true;
      setExiting({ x: 0, y: -600 });
      onSwipe(dish.id, "super");
    } else if (info.offset.x > xThreshold) {
      swiped.current = true;
      setExiting({ x: 500, y: info.offset.y });
      onSwipe(dish.id, "right");
    } else if (info.offset.x < -xThreshold) {
      swiped.current = true;
      setExiting({ x: -500, y: info.offset.y });
      onSwipe(dish.id, "left");
    }
    setTimeout(() => setDragging(false), 50);
  }, [dish.id, onSwipe]);

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
      className="absolute inset-0 bg-white rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing select-none gpu-accelerated"
      data-testid={`dish-card-${dish.id}`}
    >
      <div className="relative w-full h-[65%]">
        <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" draggable={false} onError={handleImageError} loading={active ? "eager" : "lazy"} decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5" />

        {active && (
          <>
            <motion.div style={{ opacity: yumOpacity }} className="absolute top-8 left-6 z-20 gpu-accelerated">
              <div className="bg-[hsl(160,60%,45%)] text-white text-xl font-black rounded-2xl px-5 py-2.5 -rotate-12 border-[3px] border-white/50" style={{ boxShadow: "0 4px 20px rgba(0,200,100,0.3)" }}>YUM</div>
            </motion.div>
            <motion.div style={{ opacity: nahOpacity }} className="absolute top-8 right-6 z-20 gpu-accelerated">
              <div className="bg-[hsl(348,83%,47%)] text-white text-xl font-black rounded-2xl px-5 py-2.5 rotate-12 border-[3px] border-white/50" style={{ boxShadow: "0 4px 20px rgba(220,38,38,0.3)" }}>NAH</div>
            </motion.div>
            <motion.div style={{ opacity: superOpacity }} className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 gpu-accelerated">
              <div className="bg-[hsl(45,95%,55%)] text-foreground text-xl font-black rounded-2xl px-5 py-2.5 border-[3px] border-white/50" style={{ boxShadow: "0 4px 20px rgba(234,179,8,0.3)" }}>SUPERLIKE</div>
            </motion.div>
          </>
        )}

        <div className="absolute top-5 left-5">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-foreground flex items-center gap-1.5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <UtensilsCrossed className="w-3 h-3" />
            {dish.category}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <h2 className="text-white text-[28px] font-bold mb-1 drop-shadow-lg">{dish.name}</h2>
          {dish.nameLocal && <p className="text-white/80 text-sm font-medium drop-shadow">{dish.nameLocal}</p>}
        </div>
      </div>

      <div className="p-5 pt-4 flex flex-col h-[35%]">
        <div className="flex flex-wrap gap-1.5 mb-3 overflow-hidden max-h-[2.5rem]">
          {(dish.tags || []).map((tag) => (
            <span key={tag} className="text-[11px] bg-amber-50 text-amber-700 rounded-full px-2.5 py-1 font-medium border border-amber-100">{tag}</span>
          ))}
        </div>

        {dish.description && (
          <p className="text-foreground/60 text-sm leading-relaxed flex-1 min-h-0 line-clamp-2">{dish.description}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {members.map((m) => (
                m.pictureUrl ? (
                  <img key={m.lineUserId} src={m.pictureUrl} alt={m.displayName} className="w-5 h-5 rounded-full border-[1.5px] border-white object-cover" />
                ) : (
                  <div key={m.lineUserId} className="w-5 h-5 rounded-full border-[1.5px] border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-amber-600">{m.displayName.charAt(0)}</span>
                  </div>
                )
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">{members.length} {t("waiting.swiping")}</span>
          </div>
          {(dish.swipeRightCount || 0) > 0 && (
            <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5">
              <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
              {dish.swipeRightCount} likes
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function buildTagsFromCategory(category: string): string[] {
  const tags: string[] = [];
  const parts = category.split("•").map(p => p.trim()).filter(Boolean);
  for (const part of parts) {
    tags.push(part);
  }
  return tags;
}

export default function GroupSwipe() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { profile: lineProfile, loading: lineLoading } = useLineProfile();
  const sessionCode = new URLSearchParams(window.location.search).get("session") || "";
  const profile = useMemo(() => {
    if (sessionCode) {
      const sessionGuest = localStorage.getItem(`toast_guest_${sessionCode}`);
      if (sessionGuest) {
        try { return JSON.parse(sessionGuest); } catch {}
      }
    }
    return lineProfile;
  }, [sessionCode, lineProfile]);
  const [members, setMembers] = useState<SessionMember[]>([]);
  const memberTastesRef = useRef<MemberTaste[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishItems, setDishItems] = useState<DishItem[]>([]);
  const [swipePhase, setSwipePhase] = useState<SwipePhase>("menu");
  const [matchedDish, setMatchedDish] = useState<DishItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollError, setPollError] = useState(false);
  const pollFailCount = useRef(0);
  const [sessionLocationLabel, setSessionLocationLabel] = useState<string | null>(null);
  const sessionLocationLabelRef = useRef<string | null>(null);
  const [groupPlan, setGroupPlan] = useState<{ date?: string; time?: string; area?: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchNotification, setMatchNotification] = useState<string | null>(null);
  const [fullMatch, setFullMatch] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [matchedItem, setMatchedItem] = useState<MenuItem | null>(null);
  const [superLiked, setSuperLiked] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [matchCount, setMatchCount] = useState(0);
  const [allMatches, setAllMatches] = useState<MenuItem[]>([]);
  const [phaseMatchCount, setPhaseMatchCount] = useState(0);
  const prevMatchCountRef = useRef(0);
  const [likedCount, setLikedCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [matchIsDish, setMatchIsDish] = useState(false);
  const [dishRestaurants, setDishRestaurants] = useState<MenuItem[]>([]);
  const [showDishRestaurants, setShowDishRestaurants] = useState(false);
  const [loadingDishRestaurants, setLoadingDishRestaurants] = useState(false);
  const [notifiedPartials, setNotifiedPartials] = useState<Set<number>>(new Set());
  const [isHost, setIsHost] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionUnavailable, setSessionUnavailable] = useState(false);
  const [rankedResults, setRankedResults] = useState<RankedResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [tieBreakerActive, setTieBreakerActive] = useState(false);
  const [finalPick, setFinalPick] = useState<{ id: number; swipeType: string } | null>(null);
  const [comboStats, setComboStats] = useState<{
    fingerprint: string;
    comboStats: { totalSessions: number; totalMatches: number; totalSwipes: number; topCategoriesJson: string | null; lastSessionAt: string | null } | null;
    memberStats: { lineUserId: string; displayName: string; pictureUrl: string | null; stats: { totalSessions: number; totalLikes: number; totalDislikes: number; totalSuperLikes: number; topCategoriesJson: string | null } | null }[];
    previousSessionCount: number;
  } | null>(null);

  useEffect(() => {
    if (lineLoading) return;
    let cancelled = false;
    const controller = new AbortController();
    const loadCards = async () => {
      try {
        let restaurantData: any[] = [];
        let useMenuFirst = true;
        let vibeForSession: string | null = null;

        if (sessionCode) {
          try {
            const callerId = profile?.userId || "";
            const lineToken = getAccessToken();
            const tasteRes = await fetchWithTimeout(
              `/api/group/sessions/${sessionCode}/taste${callerId ? `?lineUserId=${encodeURIComponent(callerId)}` : ""}`,
              {
                signal: controller.signal,
                headers: lineToken ? { "X-Line-Access-Token": lineToken } : {},
              },
            );
            if (!cancelled && tasteRes.ok) {
              const tasteData = await tasteRes.json();
              memberTastesRef.current = Array.isArray(tasteData.tastes) ? tasteData.tastes : [];
            }
          } catch {}
          const sessionRes = await fetchWithTimeout(`/api/group/sessions/${sessionCode}`, { signal: controller.signal });
          if (cancelled) return;
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            const sessionLocation = sessionData.session?.locationName;
            if (sessionLocation) {
              setSessionLocationLabel(sessionLocation);
              sessionLocationLabelRef.current = sessionLocation;
            }

            if (sessionData.session?.sessionType === "vibe_swipe" && sessionData.session?.sourceData) {
              try {
                const source = typeof sessionData.session.sourceData === "string"
                  ? JSON.parse(sessionData.session.sourceData)
                  : sessionData.session.sourceData;
                if (source.source === "vibe_swipe" && source.vibe) {
                  vibeForSession = source.vibe;
                }
              } catch {}
            }

            if (sessionData.session?.sessionType === "saved_list" || sessionData.session?.sessionType === "toast_decides") {
              useMenuFirst = false;
            }

            // The host's plan-screen choice ("Dishes first" vs "Restaurants only") drives the
            // journey for regular sessions, overriding the menu-first default. Scoped to
            // sessionType "regular" so saved_list / toast_decides / trending stay restaurant-only.
            if (sessionData.session?.sessionType === "regular" && sessionData.session?.cardPreference) {
              useMenuFirst = sessionData.session.cardPreference === "menu";
            }

            // Capture the shared group plan (date/time/area) so every member can see the
            // session summary on the dish-restaurants screen. Validate each field and reset
            // when absent so a stale plan can't carry over to a session without one.
            const pd = sessionData.session?.planData as
              | { date?: string; time?: string; area?: string }
              | null
              | undefined;
            if (pd && typeof pd === "object") {
              setGroupPlan({
                date: typeof pd.date === "string" ? pd.date : undefined,
                time: typeof pd.time === "string" ? pd.time : undefined,
                area: typeof pd.area === "string" ? pd.area : undefined,
              });
            } else {
              setGroupPlan(null);
            }

            if (!useMenuFirst) {
              if (sessionData.session?.sessionType === "trending") {
                const trendingRes = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/trending-restaurants`, { signal: controller.signal });
                if (cancelled) return;
                if (trendingRes.ok) {
                  const trendingData = await trendingRes.json();
                  restaurantData = trendingData.restaurants || [];
                }
              } else if (sessionData.session?.sessionType === "saved_list" && sessionData.session?.sourceData) {
                try {
                  const source = typeof sessionData.session.sourceData === "string"
                    ? JSON.parse(sessionData.session.sourceData)
                    : sessionData.session.sourceData;
                  if (source.restaurantIds?.length > 0) {
                    const allRes = await fetchWithTimeout("/api/restaurants", { signal: controller.signal });
                    if (cancelled) return;
                    if (allRes.ok) {
                      const allData = await allRes.json();
                      const idSet = new Set(source.restaurantIds);
                      restaurantData = allData.filter((r: any) => idSet.has(r.id));
                    }
                  }
                } catch {}
              } else if (vibeForSession === "hot_restaurants") {
                const hotRes = await fetchWithTimeout("/api/restaurants/hot?limit=30", { signal: controller.signal });
                if (cancelled) return;
                if (hotRes.ok) {
                  restaurantData = await hotRes.json();
                }
              } else if (vibeForSession) {
                const vibeRes = await fetchWithTimeout("/api/restaurants/by-vibe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ vibe: vibeForSession }),
                  signal: controller.signal,
                });
                if (cancelled) return;
                if (vibeRes.ok) {
                  restaurantData = await vibeRes.json();
                }
              } else if ((sessionData.session?.sessionType === "toast_decides") && sessionData.session?.sourceData) {
                try {
                  const source = typeof sessionData.session.sourceData === "string"
                    ? JSON.parse(sessionData.session.sourceData)
                    : sessionData.session.sourceData;
                  if (source.results?.length > 0) {
                    const resultIds = new Set(source.results.map((r: any) => r.id));
                    const allRes = await fetchWithTimeout("/api/restaurants", { signal: controller.signal });
                    if (cancelled) return;
                    if (allRes.ok) {
                      const allData = await allRes.json();
                      restaurantData = allData.filter((r: any) => resultIds.has(r.id));
                      if (restaurantData.length === 0) restaurantData = source.results;
                    }
                  }
                } catch {}
              }

              if (restaurantData.length === 0) {
                const locationParam = sessionLocationLabelRef.current ? `?location=${encodeURIComponent(sessionLocationLabelRef.current)}` : "";
                const res = await fetchWithTimeout(`/api/restaurants${locationParam}`, { signal: controller.signal });
                if (cancelled) return;
                if (res.ok) {
                  restaurantData = await res.json();
                }
              }
            }
          }
        }

        if (cancelled) return;

        if (useMenuFirst) {
          const dishEndpoint = vibeForSession === "trending_dishes" ? "/api/menu-items/trending" : "/api/menu-items";
          const categoryParam = vibeForSession && vibeForSession !== "trending_dishes" ? `?category=${encodeURIComponent(vibeForSession)}` : "";
          const dishRes = await fetchWithTimeout(`${dishEndpoint}${categoryParam}`, { signal: controller.signal });
          if (cancelled) return;
          if (dishRes.ok) {
            const dishes: DishItem[] = await dishRes.json();
            if (vibeForSession !== "trending_dishes") {
              dishes.sort(() => Math.random() - 0.5);
              setDishItems(rankByGroupTaste(dishes, memberTastesRef.current));
            } else {
              setDishItems(dishes);
            }
            setSwipePhase("menu");
          }
        } else {
          setSwipePhase("restaurant");
          const items: MenuItem[] = restaurantData.map((r: any) => ({
            id: r.id,
            name: r.name,
            category: r.category || "Restaurant",
            tags: buildTagsFromCategory(r.category || ""),
            description: r.description || "",
            priceLevel: r.priceLevel || r.price_level || 2,
            rating: r.rating || "4.0",
            address: r.address || "Bangkok",
            imageUrl: r.imageUrl || r.image_url || "",
            isNew: r.isNew || r.is_new || false,
          }));
          items.sort(() => Math.random() - 0.5);
          setMenuItems(rankByGroupTaste(items, memberTastesRef.current));
        }
      } catch (err) {
        console.error("Failed to load cards:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadCards();
    return () => { cancelled = true; controller.abort(); };
  }, [sessionCode, lineLoading, profile?.userId]);

  const menuItemsRef = useRef<MenuItem[]>([]);
  menuItemsRef.current = menuItems;
  const sessionEndedRef = useRef(false);
  sessionEndedRef.current = sessionEnded;
  const fullMatchRef = useRef(false);
  fullMatchRef.current = fullMatch;
  const showDishRestaurantsRef = useRef(false);
  showDishRestaurantsRef.current = showDishRestaurants;
  // Dish ids whose menu-match overlay has already been shown this session. Without
  // this, the 2s poll re-detects the still-matched dish after "Keep Swiping"
  // clears fullMatch and re-opens the same match overlay over and over.
  const seenMenuMatchesRef = useRef<Set<number>>(new Set());
  const tieBreakerActiveRef = useRef(false);
  tieBreakerActiveRef.current = tieBreakerActive;
  const loadRestaurantsForDishRef = useRef<((dish: DishItem) => void) | null>(null);
  // Auto-launch the tie-breaker once the group piles up this many full matches in the
  // current swipe phase, instead of waiting for the opt-in "Can't decide?" button.
  const TIEBREAKER_MATCH_LIMIT = 3;
  const phaseMatchCountRef = useRef(0);
  const autoTbStartedRef = useRef(false);

  useEffect(() => {
    if (!sessionCode) return;
    let cancelled = false;

    const pollController = new AbortController();

    // Real-time match + tie-breaker detection. Runs every tick against the
    // UNLIMITED /matches and /tiebreaker endpoints, and reads its member count
    // from the matches payload — so it never depends on (and is never starved
    // by) the rate-limited session lookup. This is what surfaces a match to a
    // user who is waiting on the results screen.
    const fetchMatches = async () => {
      if (cancelled || tieBreakerActiveRef.current) return;
      try {
        const matchRes = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/matches?swipeType=${swipePhase === 'menu' ? 'menu' : 'restaurant'}`, { signal: pollController.signal });
        if (!cancelled && matchRes.ok) {
          const matchData = await matchRes.json();
          const memberCount = matchData.members?.length ?? 0;
          if (matchData.matches && memberCount > 0) {
            // Full matches (everyone in) for the current phase — drives the 3-match auto-launch.
            const fullCount = matchData.matches.filter(
              (m: any) => m.voters.length >= memberCount && (swipePhase === "menu" ? m.menuItem : m.restaurant),
            ).length;
            if (fullCount !== phaseMatchCountRef.current) {
              phaseMatchCountRef.current = fullCount;
              setPhaseMatchCount(fullCount);
            }
            if (swipePhase === "menu") {
              if (!fullMatchRef.current && !showDishRestaurantsRef.current) {
                for (const m of matchData.matches) {
                  if (m.voters.length >= memberCount && m.menuItem) {
                    const dish = m.menuItem;
                    if (seenMenuMatchesRef.current.has(dish.id)) continue;
                    setConfetti(true);
                    setMatchIsDish(true);
                    setMatchedDish({
                      id: dish.id,
                      name: dish.name,
                      nameLocal: dish.nameLocal || "",
                      category: dish.category || "",
                      tags: dish.tags || [],
                      description: dish.description || "",
                      imageUrl: dish.imageUrl || "",
                      swipeRightCount: dish.swipeRightCount || 0,
                    });
                    setMatchedItem({
                      id: dish.id,
                      name: dish.name || dish.nameLocal || "",
                      category: dish.category || "",
                      tags: dish.tags || [],
                      description: dish.description || "",
                      priceLevel: 0,
                      rating: "",
                      address: "",
                      imageUrl: dish.imageUrl || "",
                      isNew: false,
                    });
                    seenMenuMatchesRef.current.add(dish.id);
                    setFullMatch(true);
                    break;
                  }
                }
              }
            } else {
              const fullMatches = matchData.matches
                .filter((m: any) => m.voters.length >= memberCount && m.restaurant)
                .map((m: any) => {
                  const r = m.restaurant;
                  return {
                    id: r.id,
                    name: r.name,
                    category: r.category || "",
                    tags: buildTagsFromCategory(r.category || ""),
                    description: r.description || "",
                    priceLevel: r.priceLevel || 2,
                    rating: r.rating || "4.0",
                    address: r.address || "Bangkok",
                    imageUrl: r.imageUrl || "",
                    isNew: r.isNew || false,
                  } as MenuItem;
                });

              setAllMatches(prev => {
                const existing = new Set(prev.map(p => p.id));
                const newItems = fullMatches.filter((i: MenuItem) => !existing.has(i.id));
                if (newItems.length > 0) return [...prev, ...newItems];
                return prev;
              });
            }
          }
        }
      } catch {}

      // Detect an active tie-breaker game (host may have started one instead of ending).
      if (!cancelled && !sessionEndedRef.current) {
        try {
          const tbRes = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/tiebreaker`, { signal: pollController.signal });
          if (!cancelled && tbRes.ok) {
            const tbData = await tbRes.json();
            if (tbData?.tieBreaker && tbData.tieBreaker.status !== "finished") {
              queryClient.setQueryData(["/api/group/sessions", sessionCode, "tiebreaker"], tbData);
              setFullMatch(false);
              setConfetti(false);
              setMatchedItem(null);
              setShowResults(false);
              setTieBreakerActive(true);
            }
          }
        } catch {}
      }
    };

    // Session metadata: availability, membership, host, completion. Hits the
    // RATE-LIMITED session lookup (20/min/IP), so it runs on a slower cadence to
    // stay comfortably under the limit. A 429 here is harmless — match polling
    // above keeps running independently.
    const fetchSessionMeta = async () => {
      if (cancelled || tieBreakerActiveRef.current) return;
      try {
        const res = await fetchWithTimeout(`/api/group/sessions/${sessionCode}`, { signal: pollController.signal });
        if (cancelled) return;
        if (res.status === 410 || res.status === 404 || res.status === 403) {
          setSessionUnavailable(true);
          return;
        }
        if (res.status === 429) return;
        if (!res.ok) {
          pollFailCount.current += 1;
          if (pollFailCount.current >= 5) setPollError(true);
          return;
        }
        const data = await res.json();
        if (data.session?.status === "deleted") {
          setSessionUnavailable(true);
          return;
        }
        if (profile && data.members && !data.members.some((m: { lineUserId: string }) => m.lineUserId === profile.userId)) {
          setSessionUnavailable(true);
          return;
        }
        setMembers(data.members);
        if (profile && data.session?.hostLineUserId === profile.userId) {
          setIsHost(true);
        }
        if (!cancelled && data.session?.status === "completed" && !sessionEndedRef.current) {
          setSessionEnded(true);
        }
        pollFailCount.current = 0;
        setPollError(false);
      } catch {
        pollFailCount.current += 1;
        if (pollFailCount.current >= 5 && !cancelled) {
          setPollError(true);
        }
      }
    };

    let tick = 0;
    const poll = () => {
      if (cancelled) return;
      // Session meta every 3rd tick (~6s, ~10/min — safely under the 20/min
      // limit); match detection every tick (~2s) for real-time matches.
      if (tick % 3 === 0) fetchSessionMeta();
      tick++;
      fetchMatches();
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => { cancelled = true; clearInterval(interval); pollController.abort(); };
  }, [sessionCode, profile, swipePhase]);

  useEffect(() => {
    if (allMatches.length > prevMatchCountRef.current) {
      const latestMatch = allMatches[allMatches.length - 1];
      if (latestMatch) {
        setMatchedItem(latestMatch);
        setConfetti(true);
        setFullMatch(true);
        setMatchCount(allMatches.length);
        if (sessionCode) updateSession(sessionCode, { matchCount: allMatches.length });
      }
    }
    prevMatchCountRef.current = allMatches.length;
  }, [allMatches, sessionCode]);

  useEffect(() => {
    seenMenuMatchesRef.current = new Set();
  }, [sessionCode]);

  const sessionInitRef = useRef<string | null>(null);
  useEffect(() => {
    if (!sessionCode) return;
    if (sessionInitRef.current === sessionCode) return;
    sessionInitRef.current = sessionCode;
    addSession({
      id: sessionCode,
      type: "group",
      label: "Group Session",
      route: `/group/swipe?session=${sessionCode}`,
      memberCount: members.length,
      matchCount: 0,
      members: members.map(m => ({ displayName: m.displayName, pictureUrl: m.pictureUrl || undefined })),
      startedAt: Date.now(),
    });
  }, [sessionCode]);

  useEffect(() => {
    if (sessionCode && members.length > 0) {
      updateSession(sessionCode, {
        memberCount: members.length,
        members: members.map(m => ({ displayName: m.displayName, pictureUrl: m.pictureUrl || undefined })),
      });
    }
  }, [sessionCode, members]);

  const recordSwipe = useCallback(async (menuItemId: number, direction: "left" | "right" | "super", swipeType: SwipePhase = "restaurant") => {
    if (!sessionCode || !profile) return null;
    try {
      const res = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: profile.userId,
          menuItemId,
          direction,
          swipeType,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("Failed to record swipe:", err);
    }
    return null;
  }, [sessionCode, profile]);

  const loadRestaurantsForDish = useCallback(async (dish: DishItem) => {
    try {
      setLoading(true);
      setMatchedDish(dish);
      const res = await fetchWithTimeout(`/api/menu-items/${dish.id}/restaurants`);
      if (res.ok) {
        const data = await res.json();
        const items: MenuItem[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          category: r.category || "Restaurant",
          tags: buildTagsFromCategory(r.category || ""),
          description: r.description || "",
          priceLevel: r.priceLevel || r.price_level || 2,
          rating: r.rating || "4.0",
          address: r.address || "Bangkok",
          imageUrl: r.imageUrl || r.image_url || "",
          isNew: r.isNew || r.is_new || false,
        }));
        items.sort(() => Math.random() - 0.5);
        setMenuItems(rankByGroupTaste(items, memberTastesRef.current));
        setCurrentIndex(0);
        setSwipePhase("restaurant");
        setLiked(new Set());
        setSuperLiked(new Set());
        setLikedCount(0);
      }
    } catch (err) {
      console.error("Failed to load restaurants for dish:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  loadRestaurantsForDishRef.current = loadRestaurantsForDish;

  const dishSwipeLockRef = useRef(false);
  const handleDishSwipe = useCallback((id: number, dir: "left" | "right" | "super") => {
    if (dishSwipeLockRef.current) return;
    dishSwipeLockRef.current = true;
    setTimeout(() => { dishSwipeLockRef.current = false; }, 400);

    const dish = dishItems.find((d) => d.id === id);
    if (!dish) return;

    trackEvent(dir === "left" ? "swipe_left" : "swipe_right", {
      restaurantId: id,
      metadata: { category: dish.category || "", type: "menu" },
    });

    if (dir === "right" || dir === "super") {
      setLiked((prev) => new Set([...prev, id]));
      setLikedCount((c) => c + 1);
      if (dir === "super") setSuperLiked((prev) => new Set([...prev, id]));
    }

    setLastAction(dir === "right" ? "YUM!" : dir === "super" ? "SUPERLIKE!" : "Nah");
    setTimeout(() => setLastAction(null), 800);

    recordSwipe(id, dir, "menu").then((result) => {
      if (!result) return;
      const { matches, memberCount } = result;

      if (matches && matches.length > 0) {
        for (const match of matches) {
          const matched = dishItems.find(d => d.id === match.menuItemId);
          if (matched && match.voters.length >= memberCount) {
            if (seenMenuMatchesRef.current.has(matched.id)) continue;
            setConfetti(true);
            setMatchIsDish(true);
            setMatchedDish(matched);
            setMatchedItem({
              id: matched.id,
              name: matched.name,
              category: matched.category || "",
              tags: matched.tags || [],
              description: matched.description || "",
              priceLevel: 0,
              rating: "",
              address: "",
              imageUrl: matched.imageUrl || "",
              isNew: false,
            });
            seenMenuMatchesRef.current.add(matched.id);
            setFullMatch(true);
            return;
          }
        }
      }
    });

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  }, [recordSwipe, dishItems, loadRestaurantsForDish]);

  const swipeLockRef = useRef(false);
  const handleSwipe = useCallback((id: number, dir: "left" | "right" | "super") => {
    if (swipeLockRef.current) return;
    swipeLockRef.current = true;
    setTimeout(() => { swipeLockRef.current = false; }, 400);

    const item = menuItems.find((m) => m.id === id);
    if (!item) return;

    trackEvent(dir === "left" ? "swipe_left" : "swipe_right", {
      restaurantId: id,
      metadata: { category: item.category || "" },
    });

    if (dir === "right" || dir === "super") {
      setLiked((prev) => new Set([...prev, id]));
      setLikedCount((c) => c + 1);
      if (dir === "super") setSuperLiked((prev) => new Set([...prev, id]));
    }

    setLastAction(dir === "right" ? "YUM!" : dir === "super" ? "SUPERLIKE!" : "Nah");
    setTimeout(() => setLastAction(null), 800);

    recordSwipe(id, dir, "restaurant").then((result) => {
      if (!result) return;

      const { matches, memberCount } = result;

      if (matches && matches.length > 0) {
        const newMatches: MenuItem[] = [];
        for (const match of matches) {
          const matchedMenuItem = menuItems.find(m => m.id === match.menuItemId);
          if (matchedMenuItem && match.voters.length >= memberCount) {
            newMatches.push(matchedMenuItem);
          }
        }
        if (newMatches.length > 0) {
          setAllMatches(prev => {
            const existing = new Set(prev.map(p => p.id));
            const unique = newMatches.filter(i => !existing.has(i.id));
            return unique.length > 0 ? [...prev, ...unique] : prev;
          });
          return;
        }
      }

      if (dir === "right" || dir === "super") {
        checkPartialMatches(id);
      }
    });

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  }, [recordSwipe, sessionCode, members, menuItems, allMatches]);

  const checkPartialMatches = useCallback(async (menuItemId: number) => {
    if (!sessionCode || notifiedPartials.has(menuItemId)) return;
    try {
      const res = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/swipes`);
      if (!res.ok) return;
      const data = await res.json();

      const positiveSwipes = data.swipes.filter((s: any) => s.direction === "right" || s.direction === "super");
      const votersForItem = new Set<string>();
      for (const s of positiveSwipes) {
        if (s.menuItemId === menuItemId) {
          votersForItem.add(s.lineUserId);
        }
      }

      if (votersForItem.size > 1 && votersForItem.size < data.members.length) {
        const voterNames = data.members
          .filter((m: SessionMember) => votersForItem.has(m.lineUserId) && m.lineUserId !== profile?.userId)
          .map((m: SessionMember) => m.displayName);

        if (voterNames.length > 0) {
          setNotifiedPartials(prev => new Set(prev).add(menuItemId));
          const item = menuItems.find(m => m.id === menuItemId);
          if (item) {
            const nameStr = voterNames.join(" and ");
            setMatchNotification(`You and ${nameStr} both liked ${item.name}!`);
            setTimeout(() => setMatchNotification(null), 3000);
          }
        }
      }
    } catch {}
  }, [sessionCode, profile, notifiedPartials, menuItems]);

  const fetchRankedResultsRef = useRef(false);
  const fetchRankedResults = useCallback(async () => {
    if (!sessionCode || fetchRankedResultsRef.current) return;
    fetchRankedResultsRef.current = true;
    setLoadingResults(true);
    try {
      const res = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/swipes`);
      if (!res.ok) return;
      const data = await res.json();
      const { swipes, members: memberList, restaurants: serverRestaurants, menuItems: serverMenuItems } = data;

      const restaurantMap = new Map<number, any>();
      if (serverRestaurants) {
        for (const r of serverRestaurants) {
          restaurantMap.set(r.id, r);
        }
      }
      const menuItemMap = new Map<number, any>();
      if (serverMenuItems) {
        for (const mi of serverMenuItems) {
          menuItemMap.set(mi.id, mi);
        }
      }

      // Key by composite `${swipeType}:${id}` — menu_items and restaurants are separate tables
      // with overlapping serial ids, so a dish and a restaurant sharing an id must NOT merge votes.
      const voteMap = new Map<string, { id: number; voters: Set<string>; swipeType: string }>();
      for (const s of swipes) {
        if (s.direction === "right" || s.direction === "super") {
          const st = s.swipeType || "restaurant";
          const key = `${st}:${s.menuItemId}`;
          if (!voteMap.has(key)) voteMap.set(key, { id: s.menuItemId, voters: new Set(), swipeType: st });
          voteMap.get(key)!.voters.add(s.lineUserId);
        }
      }

      const ranked: RankedResult[] = [];
      for (const [, { id: menuItemId, voters: voterIds, swipeType }] of voteMap) {
        if (voterIds.size < 2) continue;
        const itemData = swipeType === "menu" ? menuItemMap.get(menuItemId) : restaurantMap.get(menuItemId);
        if (!itemData) continue;
        const item: MenuItem = {
          id: itemData.id,
          name: itemData.name || itemData.nameLocal || "",
          category: itemData.category || "",
          tags: buildTagsFromCategory(itemData.category || ""),
          description: itemData.description || "",
          priceLevel: itemData.priceLevel || 2,
          rating: itemData.rating || "4.0",
          address: itemData.address || "",
          imageUrl: itemData.imageUrl || "",
          isNew: itemData.isNew || false,
        };
        const voters = memberList.filter((m: SessionMember) => voterIds.has(m.lineUserId));
        ranked.push({
          item,
          voters,
          voteCount: voterIds.size,
          isFullMatch: voterIds.size >= memberList.length,
          swipeType,
        });
      }

      ranked.sort((a, b) => b.voteCount - a.voteCount);
      setRankedResults(ranked);

      try {
        await fetchWithTimeout(`/api/group/sessions/${sessionCode}/finalize-stats`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lineUserId: profile?.userId }) });
        const statsRes = await fetchWithTimeout(`/api/group/combo-stats/${sessionCode}`);
        if (statsRes.ok) {
          setComboStats(await statsRes.json());
        }
      } catch {}
    } catch {} finally {
      fetchRankedResultsRef.current = false;
      setLoadingResults(false);
    }
  }, [sessionCode]);

  useEffect(() => {
    if (swipePhase === "restaurant" && currentIndex >= menuItems.length && menuItems.length > 0 && !showResults && !fullMatch && !loadingResults) {
      fetchRankedResults().then(() => setShowResults(true));
    }
  }, [currentIndex, menuItems.length, showResults, fullMatch, loadingResults, swipePhase]);

  useEffect(() => {
    if (sessionEnded && !showResults && !loadingResults) {
      fetchRankedResults().then(() => setShowResults(true));
    }
  }, [sessionEnded, showResults, loadingResults]);

  const handleButtonSwipe = (dir: "left" | "right" | "super") => {
    if (swipePhase === "menu") {
      if (currentIndex < dishItems.length) {
        handleDishSwipe(dishItems[currentIndex].id, dir);
      }
    } else {
      if (currentIndex < menuItems.length) {
        handleSwipe(menuItems[currentIndex].id, dir);
      }
    }
  };

  const handleTap = (item: MenuItem) => {
    navigate(`/restaurant/${item.id}`);
  };

  // Open the "restaurants serving this dish" list for a given dish. Shared by the
  // menu-match overlay and the tie-breaker completion flow so both land on the
  // same screen.
  const showRestaurantsForDish = useCallback(async (dish: DishItem) => {
    setMatchedDish(dish);
    setDishRestaurants([]);
    setLoadingDishRestaurants(true);
    setFullMatch(false);
    setShowDishRestaurants(true);
    try {
      const res = await fetchWithTimeout(`/api/menu-items/${dish.id}/restaurants`);
      if (res.ok) {
        const data = await res.json();
        const items: MenuItem[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          category: r.category || "Restaurant",
          tags: buildTagsFromCategory(r.category || ""),
          description: r.description || "",
          priceLevel: r.priceLevel || r.price_level || 2,
          rating: r.rating || "4.0",
          address: r.address || "Bangkok",
          imageUrl: r.imageUrl || r.image_url || "",
          isNew: r.isNew || r.is_new || false,
        }));
        setDishRestaurants(items);
      }
    } catch (err) {
      console.error("Failed to load restaurants:", err);
    } finally {
      setLoadingDishRestaurants(false);
    }
  }, []);

  const handleEndSession = async () => {
    if (!sessionCode || !profile) return;
    try {
      // Ending simply wraps the session up and shows the results / top-picks page.
      // The tie-breaker mini-game is no longer auto-launched here — it is opt-in via
      // the "Can't decide?" button on the results page (handleStartTieBreaker).
      await fetchWithTimeout(`/api/group/sessions/${sessionCode}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", lineUserId: profile.userId }),
      });
      setSessionEnded(true);
      setShowEndConfirm(false);
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  // Launch the tie-breaker mini-game from the "Can't decide?" button on the results
  // page. Any session member can start it; everyone else auto-joins via the poll.
  // The server gates on match count (>1) and member count, so the button is only
  // surfaced when 2+ full matches exist.
  const handleStartTieBreaker = async (): Promise<boolean> => {
    if (!sessionCode || !profile) return false;
    try {
      const swipeType = swipePhase === "menu" ? "menu" : "restaurant";
      const tbRes = await apiRequest("POST", `/api/group/sessions/${sessionCode}/tiebreaker/start`, {
        lineUserId: profile.userId,
        swipeType,
      });
      const tbData = await tbRes.json();
      if (tbData?.tieBreaker) {
        queryClient.setQueryData(["/api/group/sessions", sessionCode, "tiebreaker"], tbData);
        // Drop any in-flight match overlay/confetti so the game takes over cleanly.
        setFullMatch(false);
        setConfetti(false);
        setMatchedItem(null);
        setShowResults(false);
        setTieBreakerActive(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to start tie-breaker:", err);
      return false;
    }
  };

  // Host-only: when the group hits the match limit in the current phase, auto-launch the
  // tie-breaker. Everyone else is pulled in by the poll above (which flips tieBreakerActive).
  // The server is idempotent (returns the existing game); a per-session sessionStorage lock
  // keeps a host with two tabs from double-starting.
  useEffect(() => {
    if (!isHost || !profile) return;
    if (tieBreakerActive || finalPick != null || sessionEnded) return;
    if (phaseMatchCount < TIEBREAKER_MATCH_LIMIT) return;
    if (autoTbStartedRef.current) return;
    const lockKey = `toast_tb_autostart_${sessionCode}`;
    if (sessionStorage.getItem(lockKey)) { autoTbStartedRef.current = true; return; }
    // Re-entry guard while the request is in flight; only persist the per-session lock
    // once the server confirms a game, so a transient failure (or null profile) can retry.
    autoTbStartedRef.current = true;
    (async () => {
      const ok = await handleStartTieBreaker();
      if (ok) sessionStorage.setItem(lockKey, "1");
      else autoTbStartedRef.current = false;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseMatchCount, isHost, profile, tieBreakerActive, finalPick, sessionEnded, sessionCode]);

  // Reset the per-phase match count when the phase or session changes, so a stale count
  // from a prior phase can't launch a game before the new phase's matches are polled.
  useEffect(() => {
    phaseMatchCountRef.current = 0;
    setPhaseMatchCount(0);
  }, [swipePhase, sessionCode]);

  // A brand-new session is allowed a fresh auto-launch.
  useEffect(() => {
    autoTbStartedRef.current = false;
  }, [sessionCode]);

  const handleTieBreakerComplete = useCallback((finalItemId: number, swipeType: string) => {
    setFinalPick({ id: finalItemId, swipeType });
    setTieBreakerActive(false);
    if (isHost && sessionCode && profile) {
      fetchWithTimeout(`/api/group/sessions/${sessionCode}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", lineUserId: profile.userId }),
      }).catch(() => {});
    }

    // After the mini-game settles, take everyone straight to the spot:
    // restaurant mode → that restaurant's detail screen;
    // menu mode → the list of restaurants serving the winning dish.
    if (swipeType === "restaurant") {
      if (sessionCode) sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`);
      navigate(`/restaurant/${finalItemId}`);
      return;
    }

    const winningDish = dishItems.find((d) => d.id === finalItemId);
    if (winningDish) {
      showRestaurantsForDish(winningDish);
      return;
    }

    // dishItems may not be loaded yet (deep-link / refresh straight into a
    // finished tie-breaker). Fetch the winning dish by id, then show its
    // restaurants; only fall back to the results banner if that fails too.
    (async () => {
      try {
        const res = await fetchWithTimeout(`/api/menu-items/${finalItemId}`);
        if (res.ok) {
          const d = await res.json();
          showRestaurantsForDish({
            id: d.id,
            name: d.name,
            nameLocal: d.nameLocal || "",
            category: d.category || "",
            tags: d.tags || [],
            description: d.description || "",
            imageUrl: d.imageUrl || "",
            swipeRightCount: d.swipeRightCount || 0,
          });
          return;
        }
      } catch (err) {
        console.error("Failed to load winning dish:", err);
      }
      setSessionEnded(true);
    })();
  }, [isHost, sessionCode, profile, navigate, dishItems, showRestaurantsForDish]);

  const handleContinueSwiping = () => {
    setFullMatch(false);
    setConfetti(false);
    setMatchedItem(null);
    const totalCards = swipePhase === "menu" ? dishItems.length : menuItems.length;
    if (currentIndex >= totalCards) {
      fetchRankedResults().then(() => setShowResults(true));
    }
  };

  // Non-hosts don't drive the group decision. When a full match surfaces they see the
  // celebration briefly, then auto-return to swiping — only the host gets the Keep
  // Swiping / Top Picks / End controls. Cleanup clears the timer if a tie-breaker starts,
  // the session ends, or results / dish-restaurants take over, preventing re-fire loops.
  useEffect(() => {
    if (isHost) return;
    if (!fullMatch || !matchedItem) return;
    if (sessionEnded || tieBreakerActive || showResults || showDishRestaurants) return;
    const tid = setTimeout(() => {
      setFullMatch(false);
      setConfetti(false);
      setMatchIsDish(false);
      setMatchedDish(null);
      setDishRestaurants([]);
      setShowDishRestaurants(false);
      setMatchedItem(null);
      handleContinueSwiping();
    }, 2800);
    return () => clearTimeout(tid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, fullMatch, matchedItem, sessionEnded, tieBreakerActive, showResults, showDishRestaurants, swipePhase]);

  if (!sessionCode) {
    return (
      <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-[hsl(30,20%,97%)] gap-4 px-6 text-center">
        <span className="text-4xl">😕</span>
        <p className="font-semibold">No session found</p>
        <p className="text-sm text-muted-foreground">You need a valid session link to join a group swipe.</p>
        <button
          onClick={() => navigate("/group")}
          data-testid="button-go-group"
          className="px-6 py-3 rounded-full bg-[#FFCC02] text-[#2d2000] font-bold text-sm"
        >
          Start a Group
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-[100dvh] bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (sessionUnavailable) {
    return (
      <div className="w-full h-[100dvh] bg-background flex flex-col items-center justify-center px-6" data-testid="session-unavailable-page">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <X className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-[22px] font-bold mb-2 text-center">Session Unavailable</h1>
        <p className="text-muted-foreground text-center text-sm mb-6 max-w-[280px]" data-testid="text-unavailable-message">
          This session has expired, been removed, or is no longer available. Start a new group session to swipe together!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/group/setup")}
            className="px-6 py-3 rounded-full bg-[#FFCC02] text-[#2d2000] font-bold text-sm active:scale-[0.96] transition-transform"
            data-testid="button-new-session"
          >
            New Session
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full bg-gray-100 text-foreground font-bold text-sm active:scale-[0.96] transition-transform"
            data-testid="button-go-home"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  if (tieBreakerActive && profile) {
    return (
      <GroupTieBreakerGame
        sessionCode={sessionCode}
        meId={profile.userId}
        isHost={isHost}
        onComplete={handleTieBreakerComplete}
      />
    );
  }

  const showMatchOverlay = fullMatch && !!matchedItem && !sessionEnded;
  const showDishList = showDishRestaurants && !!matchedDish;
  if ((showResults || sessionEnded) && !showMatchOverlay && !showDishList) {
    const top3 = rankedResults.slice(0, 3);
    const rest = rankedResults.slice(3);
    const hero = top3[0] || null;
    const runnersUp = top3.slice(1);
    const tbSwipeType = swipePhase === "menu" ? "menu" : "restaurant";
    const tieBreakerMatchCount = rankedResults.filter((r) => r.isFullMatch && r.swipeType === tbSwipeType).length;
    const canPlayTieBreaker = tieBreakerMatchCount >= 2 && finalPick == null && !tieBreakerActive && !sessionEnded;
    const fullMatchCount = rankedResults.filter((r) => r.isFullMatch).length;
    const voterNames = (result: any) => result.voters.map((v: any) => v.lineUserId === profile?.userId ? "You" : v.displayName);
    const friendlyVoters = (names: string[]) => names.length === 0 ? "" : names.length === 1 ? names[0] : names.length === 2 ? `${names[0]} & ${names[1]}` : `${names[0]}, ${names[1]} +${names.length - 2}`;

    return (
      <div className="w-full h-[100dvh] bg-background flex flex-col overflow-hidden" data-testid="group-summary-page">
        <div className="flex-shrink-0 px-6 pt-12 pb-4">
          {!sessionEnded && ((swipePhase === "menu" && currentIndex < dishItems.length) || (swipePhase === "restaurant" && currentIndex < menuItems.length)) && (
            <button
              onClick={() => setShowResults(false)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground mb-3 active:opacity-70"
              data-testid="button-back-to-swiping"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to swiping
            </button>
          )}
          {sessionEnded && (
            <div className="flex items-center gap-2 mb-3 bg-green-50 rounded-xl px-3 py-2 border border-green-100/60" data-testid="session-complete-banner">
              <span className="text-base">✅</span>
              <p className="text-[12px] font-semibold text-green-700">Session complete — time to eat!</p>
            </div>
          )}
          <h1 className="text-[26px] font-bold tracking-tight" data-testid="text-summary-title">
            {sessionEnded ? "Group Results" : "Your Top Picks"}
          </h1>
          <p className="text-[13.5px] text-muted-foreground mt-1">
            {fullMatchCount > 0
              ? `You all agreed on ${fullMatchCount} spot${fullMatchCount !== 1 ? "s" : ""} 🎉`
              : "Here's what your group liked most"}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {members.map((m) => (
              <div key={m.lineUserId} className="flex items-center gap-1.5 bg-white rounded-full pl-1 pr-3 py-1 border border-black/[0.06]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {m.pictureUrl ? (
                  <img src={m.pictureUrl} alt={m.displayName} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-amber-600">{m.displayName.charAt(0)}</span>
                  </div>
                )}
                <span className="text-[11px] font-semibold">{m.lineUserId === profile?.userId ? "You" : m.displayName}</span>
              </div>
            ))}
          </div>
          {finalPick != null && (() => {
            const pick = rankedResults.find(r => r.item.id === finalPick.id && r.swipeType === finalPick.swipeType)?.item;
            if (!pick) return null;
            return (
              <div className="flex items-center gap-3 mt-3 rounded-2xl p-3 bg-[#FFCC02]/15 border border-[#FFCC02]/40" data-testid="final-pick-banner">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                  {pick.imageUrl ? (
                    <img src={pick.imageUrl} alt={pick.name} className="w-full h-full object-cover" onError={handleImageError} />
                  ) : (
                    <Crown className="w-6 h-6 text-[#FFCC02]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#a37a00] flex items-center gap-1">
                    <Crown className="w-3 h-3" /> The group decided
                  </p>
                  <p className="text-[16px] font-bold truncate" data-testid="text-final-pick">{pick.name}</p>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 hide-scrollbar">
          {loadingResults ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-7 h-7 rounded-full border-2 border-gray-200 border-t-[#FFCC02] animate-spin" />
            </div>
          ) : top3.length > 0 ? (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl px-4 py-3 bg-[#FFCC02]/12 border border-[#FFCC02]/25 flex items-start gap-3"
                data-testid="verdict-callout"
              >
                {fullMatchCount > 0
                  ? <PartyPopper className="w-6 h-6 text-[#FFCC02] flex-shrink-0 mt-0.5" />
                  : <Utensils className="w-6 h-6 text-[#FFCC02] flex-shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-foreground">
                    {fullMatchCount > 0 ? "It's (almost) decided!" : "Your group's favorites"}
                  </p>
                  <p className="text-[12px] text-foreground/70 leading-snug mt-0.5">
                    {fullMatchCount > 0
                      ? `Everyone liked ${fullMatchCount} of these — tap a spot for details & directions.`
                      : "Tap a spot for details, or play a quick game to settle it."}
                  </p>
                  {comboStats?.comboStats && comboStats.previousSessionCount > 1 && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#a37a00] bg-white/70 rounded-full px-2 py-0.5" data-testid="combo-pill">
                      <Flame className="w-3 h-3" /> Meal #{comboStats.comboStats.totalSessions} together
                    </span>
                  )}
                </div>
              </motion.div>

              {hero && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => { sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`); navigate(`/restaurant/${hero.item.id}`); }}
                  className="rounded-[22px] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform bg-white border border-black/[0.06]"
                  style={{ boxShadow: "0 10px 34px -8px rgba(255,204,2,0.30), 0 4px 16px rgba(0,0,0,0.06)" }}
                  data-testid={`result-card-${hero.item.id}`}
                >
                  <div className="relative">
                    <img src={hero.item.imageUrl} alt={hero.item.name} className="w-full aspect-[16/10] object-cover" onError={handleImageError} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#FFCC02] rounded-full pl-2 pr-2.5 py-1" style={{ boxShadow: "0 4px 14px rgba(255,204,2,0.45)" }}>
                      <Crown className="w-3.5 h-3.5 text-[#2d2000]" />
                      <span className="text-[11px] font-bold text-[#2d2000]">Group favorite</span>
                    </div>
                    {hero.isFullMatch && (
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-bold text-[hsl(160,60%,32%)] flex items-center gap-1" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(160,60%,40%)]" /> Everyone liked it
                      </div>
                    )}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-white text-xl font-bold drop-shadow-lg truncate">{hero.item.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-white/90 text-[12px]">{hero.item.category}</span>
                        <span className="text-white/50 text-[12px]">·</span>
                        <span className="text-white/90 text-[12px]">{"฿".repeat(hero.item.priceLevel)}</span>
                        <span className="text-white/50 text-[12px]">·</span>
                        <span className="text-white/90 text-[12px]">★ {hero.item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex -space-x-2 flex-shrink-0">
                        {hero.voters.map((v) => (
                          v.pictureUrl ? (
                            <img key={v.lineUserId} src={v.pictureUrl} alt={v.displayName} className="w-7 h-7 rounded-full border-2 border-white object-cover" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }} />
                          ) : (
                            <div key={v.lineUserId} className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                              <span className="text-[9px] font-bold text-amber-600">{v.displayName.charAt(0)}</span>
                            </div>
                          )
                        ))}
                      </div>
                      <p className="text-[12px] font-semibold text-foreground/80 truncate">
                        {friendlyVoters(voterNames(hero))} love this
                      </p>
                    </div>
                    <span className="flex items-center gap-0.5 text-[12px] font-semibold text-[#a37a00] flex-shrink-0">
                      View <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              )}

              {runnersUp.length > 0 && (
                <div className="space-y-2.5">
                  {runnersUp.map((result, i) => (
                    <motion.div
                      key={result.item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i + 1) * 0.08 }}
                      onClick={() => { sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`); navigate(`/restaurant/${result.item.id}`); }}
                      className="flex items-center gap-3 bg-white rounded-2xl p-2.5 pr-3 border border-black/[0.06] cursor-pointer active:scale-[0.98] transition-transform"
                      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
                      data-testid={`result-card-${result.item.id}`}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={result.item.imageUrl} alt={result.item.name} className="w-[68px] h-[68px] rounded-xl object-cover" onError={handleImageError} />
                        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center border border-black/[0.06]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                          <span className="text-[11px] font-bold text-muted-foreground">#{i + 2}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[14px] truncate">{result.item.name}</h4>
                          {result.isFullMatch && <span className="w-1.5 h-1.5 rounded-full bg-[hsl(160,60%,40%)] flex-shrink-0" title="Everyone liked it" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{result.item.category} · {"฿".repeat(result.item.priceLevel)} · ★ {result.item.rating}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex -space-x-1.5">
                            {result.voters.slice(0, 4).map((v) => (
                              v.pictureUrl ? (
                                <img key={v.lineUserId} src={v.pictureUrl} alt={v.displayName} className="w-5 h-5 rounded-full border border-white object-cover" />
                              ) : (
                                <div key={v.lineUserId} className="w-5 h-5 rounded-full border border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                  <span className="text-[7px] font-bold text-amber-600">{v.displayName.charAt(0)}</span>
                                </div>
                              )
                            ))}
                          </div>
                          <span className="text-[10.5px] text-muted-foreground truncate">{friendlyVoters(voterNames(result))} liked it</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/55 mb-2.5 px-1">Also liked</p>
                  <div className="space-y-2">
                    {rest.map((result, idx) => (
                      <motion.div
                        key={result.item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.06 }}
                        onClick={() => { sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`); navigate(`/restaurant/${result.item.id}`); }}
                        className="flex items-center gap-3 bg-white rounded-2xl p-2.5 pr-3 border border-black/[0.06] cursor-pointer active:scale-[0.98] transition-transform"
                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                        data-testid={`result-card-${result.item.id}`}
                      >
                        <img src={result.item.imageUrl} alt={result.item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[13px] truncate">{result.item.name}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="flex -space-x-1.5">
                              {result.voters.slice(0, 3).map((v) => (
                                v.pictureUrl ? (
                                  <img key={v.lineUserId} src={v.pictureUrl} alt={v.displayName} className="w-4 h-4 rounded-full border border-white object-cover" />
                                ) : (
                                  <div key={v.lineUserId} className="w-4 h-4 rounded-full border border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                    <span className="text-[6px] font-bold text-amber-600">{v.displayName.charAt(0)}</span>
                                  </div>
                                )
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground ml-1">{result.voteCount}/{members.length}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center px-4"
            >
              <div className="w-20 h-20 rounded-full bg-[#FFCC02]/12 flex items-center justify-center mb-5">
                <UtensilsCrossed className="w-9 h-9 text-[#FFCC02]" />
              </div>
              <h2 className="text-lg font-bold mb-2">No shared picks yet</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Nobody landed on the same spot this time. Swipe a few more or try a different vibe together!</p>
            </motion.div>
          )}
        </div>

        <div className="flex-shrink-0 px-5 py-4 pb-6 border-t border-black/[0.04] safe-bottom bg-background/80 backdrop-blur-sm">
          {canPlayTieBreaker && (
            <button
              onClick={handleStartTieBreaker}
              data-testid="button-cant-decide"
              className="w-full mb-2.5 py-3 rounded-2xl bg-[#0F172A] text-white active:scale-[0.97] transition-transform flex flex-col items-center justify-center"
              style={{ boxShadow: "0 8px 24px -6px rgba(15,23,42,0.45)" }}
            >
              <span className="flex items-center gap-2 font-bold text-[14px]">
                <Swords className="w-4 h-4 text-[#FFCC02]" />
                {t("group_swipe.cant_decide")}
              </span>
              <span className="text-[11px] font-medium text-white/55 mt-0.5">{t("group_swipe.cant_decide_sub")}</span>
            </button>
          )}
          {!sessionEnded && isHost ? (
            <div className="flex gap-3">
              <button
                onClick={() => { handleEndSession(); }}
                data-testid="button-end-done"
                className="flex-1 py-3.5 rounded-2xl bg-[#FFCC02] text-[#2d2000] font-bold text-[14px] active:scale-[0.97] transition-transform"
                style={{ boxShadow: "0 6px 20px -4px rgba(255,204,2,0.4)" }}
              >
                Wrap it up
              </button>
            </div>
          ) : sessionEnded ? (
            <div className="space-y-2.5">
              <button
                onClick={() => { if (sessionCode) removeSession(sessionCode); navigate("/"); }}
                data-testid="button-complete-session"
                className="w-full py-3.5 rounded-2xl bg-[#FFCC02] text-[#2d2000] font-bold text-[14px] active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
                style={{ boxShadow: "0 6px 20px -4px rgba(255,204,2,0.4)" }}
              >
                Complete Session
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/")}
              data-testid="button-home-summary"
              className="w-full py-4 rounded-2xl bg-foreground text-white font-bold text-[15px] active:scale-[0.97] transition-transform"
              style={{ boxShadow: "0 8px 25px -5px rgba(0,0,0,0.25)" }}
            >
              {t("group_swipe.back_to_home")}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showDishRestaurants && matchedDish) {
    return (
      <div className="w-full h-[100dvh] bg-background flex flex-col" data-testid="dish-restaurants-page">
        <div className="flex-shrink-0 pt-[max(env(safe-area-inset-top),1rem)] px-5 pb-3 border-b border-gray-100 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowDishRestaurants(false); setFullMatch(true); }} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform" data-testid="button-back-to-match">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-bold truncate">{t("group_swipe.restaurants_with", { name: matchedDish.name })}</h1>
              <p className="text-[12px] text-muted-foreground">{t("group_swipe.places_found", { count: dishRestaurants.length })}</p>
            </div>
          </div>
          {(groupPlan?.date || groupPlan?.time || groupPlan?.area || sessionLocationLabel) && (
            <div className="mt-3 rounded-2xl px-3.5 py-2.5 bg-[#FAF6EF] border border-black/[0.05]" data-testid="banner-group-plan">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#9A938A] mb-1.5">Group plan</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-[#1A1A1A]">
                {groupPlan?.date && (
                  <span className="inline-flex items-center gap-1" data-testid="text-plan-date"><Calendar className="w-3.5 h-3.5 text-[#9A938A]" />{groupPlan.date}</span>
                )}
                {groupPlan?.time && (
                  <span className="inline-flex items-center gap-1" data-testid="text-plan-time"><Clock className="w-3.5 h-3.5 text-[#9A938A]" />{groupPlan.time}</span>
                )}
                {(sessionLocationLabel || groupPlan?.area) && (
                  <span className="inline-flex items-center gap-1" data-testid="text-plan-area"><MapPin className="w-3.5 h-3.5 text-[#9A938A]" />{sessionLocationLabel || groupPlan?.area}</span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loadingDishRestaurants ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#FFCC02] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">{t("group_swipe.finding_restaurants")}</p>
            </div>
          ) : dishRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-sm text-muted-foreground">{t("group_swipe.no_restaurants_found")}</p>
            </div>
          ) : (
            dishRestaurants.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => { sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`); navigate(`/restaurant/${r.id}`); }}
                className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
                data-testid={`restaurant-card-${r.id}`}
              >
                <img src={r.imageUrl} alt={r.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" onError={handleImageError} />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-bold text-[14px] truncate">{r.name}</h3>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{r.category}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[11px] font-medium flex items-center gap-0.5">★ {r.rating}</span>
                    <span className="text-[11px] text-muted-foreground">{"฿".repeat(r.priceLevel)}</span>
                    {r.address && <span className="text-[11px] text-muted-foreground truncate">· {r.address}</span>}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 self-center" />
              </motion.div>
            ))
          )}
        </div>
        <div className="flex-shrink-0 px-5 py-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] border-t border-gray-50 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => navigate("/")}
            data-testid="button-home-restaurants"
            className="w-full py-3.5 rounded-full bg-foreground text-white font-bold text-[14px] active:scale-[0.96] transition-transform"
          >
            {t("group_swipe.back_to_home")}
          </button>
        </div>
      </div>
    );
  }

  if (fullMatch && matchedItem) {
    const handleViewRestaurants = async () => {
      if (!matchedDish) return;
      await showRestaurantsForDish(matchedDish);
    };

    return (
      <div className="w-full h-[100dvh] bg-background flex flex-col relative overflow-hidden" data-testid="group-match-page">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[5%] w-48 h-48 bg-amber-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[15%] right-[10%] w-56 h-56 bg-amber-50/50 rounded-full blur-3xl" />
          <div className="absolute top-[40%] right-[20%] w-32 h-32 bg-green-50/40 rounded-full blur-3xl" />
        </div>

        {confetti && <ConfettiExplosion />}

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start pt-[max(env(safe-area-inset-top),2.5rem)] px-5 pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="mb-2"
          >
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center"
              style={{ boxShadow: "0 12px 40px -8px rgba(255,204,2,0.25)" }}
            >
              <span className="text-3xl sm:text-4xl inline-block animate-icon-wiggle gpu-accelerated">🎉</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="text-[26px] sm:text-[32px] font-semibold text-center mb-1"
          >
            {t("group_swipe.its_a_match")}
          </motion.h1>
          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="text-muted-foreground text-center mb-3 text-[14px] sm:text-[15px] leading-snug max-w-[260px]"
          >
            {t("group_swipe.everyone_agreed", { name: matchedItem.name })}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-4"
          >
            {members.map((m, i) => (
              <motion.div
                key={m.lineUserId}
                initial={{ scale: 0, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, type: "spring", damping: 18, stiffness: 250 }}
                className="flex items-center gap-1.5 bg-green-50/80 rounded-full px-3 py-1.5 border border-green-200/50"
                style={{ boxShadow: "0 2px 10px rgba(0,200,100,0.08)" }}
              >
                {m.pictureUrl ? (
                  <img src={m.pictureUrl} alt={m.displayName} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-amber-600">{m.displayName.charAt(0)}</span>
                  </div>
                )}
                <span className="text-[hsl(160,60%,40%)] text-[10px] font-bold">✓</span>
                <span className="text-[11px] font-bold">{m.lineUserId === profile?.userId ? "You" : m.displayName}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-[280px] rounded-[20px] overflow-hidden"
            style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.18)" }}
            data-testid={`match-card-${matchedItem.id}`}
          >
            <div className="relative">
              <img src={matchedItem.imageUrl} alt={matchedItem.name} className="w-full aspect-[16/10] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-base leading-tight truncate">{matchedItem.name}</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{matchedItem.category}</p>
              {!matchIsDish && (
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[11px] font-medium">{"\u2605"} {matchedItem.rating}</span>
                  <span className="text-[11px] text-muted-foreground">{"\u0E3F".repeat(matchedItem.priceLevel)}</span>
                  <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">{"\u00B7"} {matchedItem.address}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {matchedItem.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-100 rounded-full px-2 py-0.5 font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-shrink-0 px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-3 bg-white/80 backdrop-blur-sm border-t border-gray-50 relative z-10">
          {isHost ? (
          <div className="flex flex-col gap-2.5 w-full max-w-xs mx-auto">
            <motion.button
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={matchIsDish ? handleViewRestaurants : () => navigate(`/restaurant/${matchedItem.id}`)}
              data-testid="button-view-restaurant"
              className="w-full py-3.5 rounded-full bg-[#FFCC02] text-[#2d2000] font-bold text-[14px] active:scale-[0.96] transition-transform duration-200 flex items-center justify-center gap-2"
              style={{ boxShadow: "var(--shadow-glow-primary)" }}
            >
              <Utensils className="w-4 h-4" />
              {matchIsDish ? t("group_swipe.view_restaurants") : t("group_swipe.view_restaurant")}
            </motion.button>

            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex gap-2 w-full"
            >
              <button
                onClick={() => { setFullMatch(false); setMatchIsDish(false); setMatchedDish(null); setDishRestaurants([]); setShowDishRestaurants(false); fetchRankedResults().then(() => setShowResults(true)); }}
                data-testid="button-view-summary"
                className="flex-1 py-3 rounded-full bg-white border border-gray-200 text-foreground font-bold text-[13px] active:scale-[0.96] transition-transform flex items-center justify-center gap-1.5"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <Trophy className="w-3.5 h-3.5" />
                {t("group_swipe.top_picks")}
              </button>

              <button
                onClick={() => { setFullMatch(false); setMatchIsDish(false); setMatchedDish(null); setDishRestaurants([]); setShowDishRestaurants(false); handleContinueSwiping(); }}
                data-testid="button-keep-swiping"
                className="flex-1 py-3 rounded-full bg-white border border-gray-200 text-foreground font-bold text-[13px] active:scale-[0.96] transition-transform"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                {t("group_swipe.keep_swiping")}
              </button>

              <button
                onClick={handleEndSession}
                data-testid="button-end-session-match"
                className="py-3 px-4 rounded-full bg-red-50 border border-red-200/60 text-red-600 font-bold text-[13px] active:scale-[0.96] transition-transform"
                style={{ boxShadow: "0 2px 8px rgba(239,68,68,0.08)" }}
              >
                End
              </button>
            </motion.div>
          </div>
          ) : (
            <div className="w-full max-w-xs mx-auto text-center py-2" data-testid="text-host-deciding">
              <p className="text-[13px] font-semibold text-muted-foreground">Your host is picking what&apos;s next…</p>
              <p className="text-[11px] text-muted-foreground/70 mt-1">Taking you back to swiping in a moment</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-[hsl(30,20%,97%)] flex flex-col overflow-hidden" style={{ touchAction: "none", overscrollBehavior: "none" }} data-testid="group-swipe-page">
      {pollError && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center justify-between" data-testid="poll-error-banner">
          <span className="text-xs text-red-600 font-medium">Connection lost. Trying to reconnect...</span>
          <button onClick={() => { pollFailCount.current = 0; setPollError(false); }} className="text-xs text-red-500 underline">Dismiss</button>
        </div>
      )}
      <div className="flex items-center justify-between px-6 pt-12 pb-3">
        <div className="text-left flex items-center gap-2">
          <div>
            <h1 className="font-bold text-[22px] tracking-tight" data-testid="text-group-title">Group Swipe</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              {sessionLocationLabel && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground" data-testid="text-session-location-header">
                  <MapPin className="w-3 h-3" />{sessionLocationLabel}
                  <span className="mx-0.5">·</span>
                </span>
              )}
              <p className="text-[11px] text-muted-foreground">
                {members.map(m => m.lineUserId === profile?.userId ? "You" : m.displayName).join(", ")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-1.5">
            {members.map((m) => (
              m.pictureUrl ? (
                <img key={m.lineUserId} src={m.pictureUrl} alt={m.displayName} className="w-7 h-7 rounded-full border-[2px] border-white object-cover" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
              ) : (
                <div key={m.lineUserId} className="w-7 h-7 rounded-full border-[2px] border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <span className="text-[10px] font-bold text-amber-600">{m.displayName.charAt(0)}</span>
                </div>
              )
            ))}
          </div>
          {matchCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFCC02]/15 text-[#2d2000]">
              {matchCount} match{matchCount !== 1 ? "es" : ""}
            </div>
          )}
          {isHost && (
            <button
              onClick={() => setShowEndConfirm(true)}
              data-testid="button-end-session"
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 active:scale-90 transition-transform"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <Square className="w-3.5 h-3.5 text-red-500" fill="currentColor" />
            </button>
          )}
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

      {swipePhase === "restaurant" && matchedDish && (
        <div className="px-5 pb-2">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5 flex items-center gap-2" data-testid="matched-dish-banner">
            <UtensilsCrossed className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-800 font-medium">
              Matched: <span className="font-bold">{matchedDish.name}</span> — now pick a restaurant!
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 relative px-5 pb-4">
        {swipePhase === "menu" ? (
          dishItems.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-base font-semibold mb-2">No dishes found</p>
              <p className="text-sm text-muted-foreground mb-4">We could not load any dishes for this session.</p>
              <button onClick={() => window.location.reload()} data-testid="button-retry-load" className="px-6 py-2.5 rounded-full bg-[#FFCC02] text-[#2d2000] font-semibold text-sm">Try Again</button>
            </div>
          ) : currentIndex >= dishItems.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#FFCC02] animate-spin" />
              <p className="text-sm text-muted-foreground mt-4">Waiting for everyone to finish swiping...</p>
            </div>
          ) : (
            <div className="relative w-full h-full max-w-sm mx-auto">
              {dishItems.map((dish, idx) => {
                if (idx < currentIndex || idx > currentIndex + 1) return null;
                return (
                  <DishSwipeCard
                    key={dish.id}
                    dish={dish}
                    active={idx === currentIndex}
                    behind={idx === currentIndex + 1}
                    onSwipe={handleDishSwipe}
                    showHint={idx === 0 && currentIndex === 0}
                    members={members}
                  />
                );
              })}
            </div>
          )
        ) : (
          menuItems.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-base font-semibold mb-2">No restaurants found</p>
              <p className="text-sm text-muted-foreground mb-4">We could not load any restaurants for this session.</p>
              <button onClick={() => window.location.reload()} data-testid="button-retry-load" className="px-6 py-2.5 rounded-full bg-[#FFCC02] text-[#2d2000] font-semibold text-sm">Try Again</button>
            </div>
          ) : currentIndex >= menuItems.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#FFCC02] animate-spin" />
              <p className="text-sm text-muted-foreground mt-4">Tallying results...</p>
            </div>
          ) : (
            <div className="relative w-full h-full max-w-sm mx-auto">
              {menuItems.map((item, idx) => {
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
                    members={members}
                  />
                );
              })}
            </div>
          )
        )}
      </div>

      <div className="px-6 pb-20 flex flex-col gap-3">
        {((swipePhase === "menu" && currentIndex < dishItems.length) || (swipePhase === "restaurant" && currentIndex < menuItems.length)) && (
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

      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100] flex items-end justify-center"
            onClick={() => setShowEndConfirm(false)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full max-w-md px-6 py-6 pb-8 safe-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
              <h3 className="text-lg font-bold mb-2">End Session?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This will end the swiping for everyone and show the results.
                {allMatches.length > 0
                  ? ` You have ${allMatches.length} match${allMatches.length !== 1 ? "es" : ""} so far.`
                  : " No matches yet."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 font-bold text-sm active:scale-[0.97] transition-transform"
                  data-testid="button-cancel-end"
                >
                  Keep Swiping
                </button>
                <button
                  onClick={handleEndSession}
                  className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm active:scale-[0.97] transition-transform"
                  style={{ boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}
                  data-testid="button-confirm-end"
                >
                  End Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
