import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, useAnimate } from "framer-motion";
import { useLocation } from "wouter";
import { addSession, updateSession, removeSession } from "@/lib/sessionStore";
import { BottomNav } from "@/components/BottomNav";
import { trackEvent } from "@/lib/analytics";
import { useLineProfile } from "@/lib/useLineProfile";
import { handleImageError } from "@/lib/imageUtils";
import { throttleTap } from "@/lib/requestLock";
import { fetchWithTimeout } from "@/lib/queryClient";
import { Square, X, Trophy, ChevronRight, Crown, Medal, Award, ArrowLeft, ExternalLink, MessageCircle, Users, Heart, Utensils, MapPin } from "lucide-react";

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
            <span className="text-[10px] text-muted-foreground">{members.length} swiping</span>
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[40%]">{item.address}</span>
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
  const { profile: lineProfile } = useLineProfile();
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pollError, setPollError] = useState(false);
  const pollFailCount = useRef(0);
  const [sessionLocationLabel, setSessionLocationLabel] = useState<string | null>(null);
  const sessionLocationLabelRef = useRef<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchNotification, setMatchNotification] = useState<string | null>(null);
  const [fullMatch, setFullMatch] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [matchedItem, setMatchedItem] = useState<MenuItem | null>(null);
  const [superLiked, setSuperLiked] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [matchCount, setMatchCount] = useState(0);
  const [allMatches, setAllMatches] = useState<MenuItem[]>([]);
  const prevMatchCountRef = useRef(0);
  const [likedCount, setLikedCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [notifiedPartials, setNotifiedPartials] = useState<Set<number>>(new Set());
  const [isHost, setIsHost] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionUnavailable, setSessionUnavailable] = useState(false);
  const [rankedResults, setRankedResults] = useState<RankedResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [groupAggregateStats, setGroupAggregateStats] = useState<{
    totalSwipes: number; totalLikes: number; totalDislikes: number; totalSuperLikes: number;
  }>({ totalSwipes: 0, totalLikes: 0, totalDislikes: 0, totalSuperLikes: 0 });
  const [comboStats, setComboStats] = useState<{
    fingerprint: string;
    comboStats: { totalSessions: number; totalMatches: number; totalSwipes: number; topCategoriesJson: string | null; lastSessionAt: string | null } | null;
    memberStats: { lineUserId: string; displayName: string; pictureUrl: string | null; stats: { totalSessions: number; totalLikes: number; totalDislikes: number; totalSuperLikes: number; topCategoriesJson: string | null } | null }[];
    previousSessionCount: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const loadRestaurants = async () => {
      try {
        let data: any[] = [];

        if (sessionCode) {
          const sessionRes = await fetchWithTimeout(`/api/group/sessions/${sessionCode}`, { signal: controller.signal });
          if (cancelled) return;
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            const sessionLocation = sessionData.session?.locationName;
            if (sessionLocation) {
              setSessionLocationLabel(sessionLocation);
              sessionLocationLabelRef.current = sessionLocation;
            }
            if (sessionData.session?.sessionType === "trending") {
              const trendingRes = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/trending-restaurants`, { signal: controller.signal });
              if (cancelled) return;
              if (trendingRes.ok) {
                const trendingData = await trendingRes.json();
                data = trendingData.restaurants || [];
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
                    data = allData.filter((r: any) => idSet.has(r.id));
                  }
                }
              } catch {}
            }
          }
        }

        if (data.length === 0) {
          const locationParam = sessionLocationLabelRef.current ? `?location=${encodeURIComponent(sessionLocationLabelRef.current)}` : "";
          const res = await fetchWithTimeout(`/api/restaurants${locationParam}`, { signal: controller.signal });
          if (cancelled) return;
          if (res.ok) {
            data = await res.json();
          }
        }

        if (cancelled) return;
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
        setMenuItems(items);
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadRestaurants();
    return () => { cancelled = true; controller.abort(); };
  }, [sessionCode]);

  const menuItemsRef = useRef<MenuItem[]>([]);
  menuItemsRef.current = menuItems;
  const sessionEndedRef = useRef(false);
  sessionEndedRef.current = sessionEnded;

  useEffect(() => {
    if (!sessionCode) return;
    let cancelled = false;

    const pollController = new AbortController();
    const fetchSession = async () => {
      if (cancelled) return;
      try {
        const res = await fetchWithTimeout(`/api/group/sessions/${sessionCode}`, { signal: pollController.signal });
        if (cancelled) return;
        if (res.status === 410 || res.status === 404) {
          setSessionUnavailable(true);
          return;
        }
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
        setMembers(data.members);
        if (profile && data.session?.hostLineUserId === profile.userId) {
          setIsHost(true);
        }

        if (!cancelled) {
          try {
            const matchRes = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/matches`, { signal: pollController.signal });
            if (!cancelled && matchRes.ok) {
              const matchData = await matchRes.json();
              if (matchData.matches) {
                const fullMatches = matchData.matches
                  .filter((m: any) => m.voters.length >= data.members.length && m.restaurant)
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
          } catch {}
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
    fetchSession();
    const interval = setInterval(fetchSession, 5000);
    return () => { cancelled = true; clearInterval(interval); pollController.abort(); };
  }, [sessionCode, profile]);

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

  const recordSwipe = useCallback(async (menuItemId: number, direction: "left" | "right" | "super") => {
    if (!sessionCode || !profile) return null;
    try {
      const res = await fetchWithTimeout(`/api/group/sessions/${sessionCode}/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: profile.userId,
          menuItemId,
          direction,
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

    recordSwipe(id, dir).then((result) => {
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
      const { swipes, members: memberList, restaurants: serverRestaurants } = data;

      const restaurantMap = new Map<number, any>();
      if (serverRestaurants) {
        for (const r of serverRestaurants) {
          restaurantMap.set(r.id, r);
        }
      }

      const voteMap = new Map<number, Set<string>>();
      for (const s of swipes) {
        if (s.direction === "right" || s.direction === "super") {
          if (!voteMap.has(s.menuItemId)) voteMap.set(s.menuItemId, new Set());
          voteMap.get(s.menuItemId)!.add(s.lineUserId);
        }
      }

      const ranked: RankedResult[] = [];
      for (const [menuItemId, voterIds] of voteMap) {
        if (voterIds.size < 2) continue;
        const r = restaurantMap.get(menuItemId);
        if (!r) continue;
        const item: MenuItem = {
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
        };
        const voters = memberList.filter((m: SessionMember) => voterIds.has(m.lineUserId));
        ranked.push({
          item,
          voters,
          voteCount: voterIds.size,
          isFullMatch: voterIds.size >= memberList.length,
        });
      }

      ranked.sort((a, b) => b.voteCount - a.voteCount);
      setRankedResults(ranked);

      let gLikes = 0, gDislikes = 0, gSuper = 0;
      for (const s of swipes) {
        if (s.direction === "right") gLikes++;
        else if (s.direction === "super") { gLikes++; gSuper++; }
        else if (s.direction === "left") gDislikes++;
      }
      setGroupAggregateStats({ totalSwipes: swipes.length, totalLikes: gLikes, totalDislikes: gDislikes, totalSuperLikes: gSuper });

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
    if (currentIndex >= menuItems.length && menuItems.length > 0 && !showResults && !fullMatch && !loadingResults) {
      fetchRankedResults().then(() => setShowResults(true));
    }
  }, [currentIndex, menuItems.length, showResults, fullMatch, loadingResults]);

  useEffect(() => {
    if (sessionEnded && !showResults && !loadingResults) {
      fetchRankedResults().then(() => setShowResults(true));
    }
  }, [sessionEnded, showResults, loadingResults]);

  const handleButtonSwipe = (dir: "left" | "right" | "super") => {
    if (currentIndex < menuItems.length) {
      handleSwipe(menuItems[currentIndex].id, dir);
    }
  };

  const handleTap = (item: MenuItem) => {
    navigate(`/restaurant/${item.id}`);
  };

  const handleEndSession = async () => {
    if (!sessionCode || !profile) return;
    try {
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

  const handleContinueSwiping = () => {
    setFullMatch(false);
    setConfetti(false);
    setMatchedItem(null);
    if (currentIndex >= menuItems.length) {
      fetchRankedResults().then(() => setShowResults(true));
    }
  };

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
      <div className="w-full h-[100dvh] bg-[#FCFCFC] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (sessionUnavailable) {
    return (
      <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col items-center justify-center px-6" data-testid="session-unavailable-page">
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

  if (showResults || sessionEnded) {
    const RANK_ICONS = [Crown, Medal, Award];
    const RANK_COLORS = ["#FFCC02", "#94A3B8", "#CD7F32"];
    const RANK_BG = ["linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)", "linear-gradient(135deg, #FDF4E7 0%, #FDECD0 100%)"];
    const top3 = rankedResults.slice(0, 3);
    const rest = rankedResults.slice(3);

    return (
      <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col overflow-hidden" data-testid="group-summary-page">
        <div className="flex-shrink-0 px-6 pt-12 pb-5">
          {!sessionEnded && currentIndex < menuItems.length && (
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
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFCC02]/15 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#FFCC02]" />
            </div>
            <div className="flex-1">
              <h1 className="text-[22px] font-bold" data-testid="text-summary-title">
                {sessionEnded ? "Group Results" : "Your Top Picks"}
              </h1>
              <p className="text-[12px] text-muted-foreground">
                {members.length} people · {rankedResults.filter(r => r.isFullMatch).length} full match{rankedResults.filter(r => r.isFullMatch).length !== 1 ? "es" : ""} · {groupAggregateStats.totalSwipes} swipes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {members.map((m) => (
              <div key={m.lineUserId} className="flex items-center gap-1.5 bg-white rounded-full pl-1 pr-3 py-1 border border-gray-100" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 hide-scrollbar">
          {loadingResults ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-7 h-7 rounded-full border-2 border-gray-200 border-t-[#FFCC02] animate-spin" />
            </div>
          ) : top3.length > 0 ? (
            <div className="space-y-3">
              <div className="flex gap-2 mb-1" data-testid="group-stats-bar">
                <div className="flex-1 bg-white rounded-2xl px-3 py-2.5 border border-gray-100 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                  <p className="text-[17px] font-bold text-foreground">{groupAggregateStats.totalSwipes}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Total Swipes</p>
                </div>
                <div className="flex-1 bg-white rounded-2xl px-3 py-2.5 border border-gray-100 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                  <p className="text-[17px] font-bold text-[hsl(160,60%,40%)]">{groupAggregateStats.totalLikes}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Group Likes</p>
                </div>
                <div className="flex-1 bg-white rounded-2xl px-3 py-2.5 border border-gray-100 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                  <p className="text-[17px] font-bold text-[#FFCC02]">{rankedResults.filter(r => r.isFullMatch).length}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Full Matches</p>
                </div>
              </div>

              {comboStats && comboStats.comboStats && comboStats.previousSessionCount > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl px-3.5 py-2.5 border border-violet-100/40 mb-1"
                  data-testid="group-combo-history"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13px]">{"\uD83D\uDD04"}</span>
                    <p className="text-[12px] font-bold text-foreground">
                      Session #{comboStats.comboStats.totalSessions} together
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center">
                      <p className="text-[14px] font-bold text-violet-600">{comboStats.comboStats.totalMatches}</p>
                      <p className="text-[9px] text-muted-foreground">All-time Matches</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[14px] font-bold text-blue-600">{comboStats.comboStats.totalSwipes}</p>
                      <p className="text-[9px] text-muted-foreground">Total Swipes</p>
                    </div>
                    {(() => {
                      const cats = comboStats.comboStats!.topCategoriesJson ? JSON.parse(comboStats.comboStats!.topCategoriesJson) as [string, number][] : [];
                      return cats.length > 0 ? (
                        <div className="text-center flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-foreground truncate">{cats[0][0]}</p>
                          <p className="text-[9px] text-muted-foreground">Go-to Cuisine</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </motion.div>
              )}

              {comboStats && comboStats.memberStats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl px-3.5 py-2.5 border border-gray-100 mb-1"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
                  data-testid="member-stats-panel"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Member Trends</p>
                  <div className="space-y-2">
                    {comboStats.memberStats.map((ms) => {
                      const topCats = ms.stats?.topCategoriesJson ? JSON.parse(ms.stats.topCategoriesJson) as [string, number][] : [];
                      const isYou = ms.lineUserId === profile?.userId;
                      return (
                        <div key={ms.lineUserId} className="flex items-center gap-2.5">
                          {ms.pictureUrl ? (
                            <img src={ms.pictureUrl} alt={ms.displayName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-amber-600">{ms.displayName.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold truncate">{isYou ? "You" : ms.displayName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {ms.stats ? (
                                <>
                                  <span className="text-[10px] text-[hsl(160,60%,40%)]">{"\u2764"} {ms.stats.totalLikes}</span>
                                  <span className="text-[10px] text-muted-foreground">{"\u00D7"} {ms.stats.totalDislikes}</span>
                                  {ms.stats.totalSuperLikes > 0 && (
                                    <span className="text-[10px] text-[#FFCC02]">{"\u2B50"} {ms.stats.totalSuperLikes}</span>
                                  )}
                                  {topCats.length > 0 && (
                                    <span className="text-[10px] text-muted-foreground/80 truncate">{"\u00B7"} Loves {topCats[0][0]}</span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">First session</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {(() => {
                const topCategory = rankedResults.length > 0
                  ? Object.entries(
                      rankedResults.reduce<Record<string, number>>((acc, r) => {
                        const cat = r.item.category || "Other";
                        acc[cat] = (acc[cat] || 0) + r.voteCount;
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1])[0]?.[0] || null
                  : null;
                return topCategory ? (
                  <div className="bg-[#FFCC02]/8 rounded-2xl px-3.5 py-2 flex items-center gap-2 mb-1 border border-[#FFCC02]/15" data-testid="group-top-category">
                    <span className="text-[13px]">{"\uD83C\uDF1F"}</span>
                    <p className="text-[12px] text-foreground/80 font-medium">
                      Group favorite: <span className="font-bold text-foreground">{topCategory}</span>
                    </p>
                  </div>
                ) : null;
              })()}
              {top3.map((result, idx) => {
                const RankIcon = RANK_ICONS[idx] || Award;
                return (
                  <motion.div
                    key={result.item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.12, ease: [0.4, 0, 0.2, 1] }}
                    onClick={() => { sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`); navigate(`/restaurant/${result.item.id}`); }}
                    className="rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                    style={{ boxShadow: idx === 0 ? "0 8px 32px -6px rgba(255,204,2,0.25), 0 4px 16px rgba(0,0,0,0.06)" : "0 4px 20px rgba(0,0,0,0.06)", background: RANK_BG[idx] }}
                    data-testid={`result-card-${result.item.id}`}
                  >
                    <div className="relative">
                      <img src={result.item.imageUrl} alt={result.item.name} className="w-full aspect-[16/9] object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        <RankIcon className="w-3.5 h-3.5" style={{ color: RANK_COLORS[idx] }} />
                        <span className="text-[11px] font-bold">#{idx + 1}</span>
                      </div>
                      {result.isFullMatch && (
                        <div className="absolute top-2.5 right-2.5 bg-[#FFCC02] rounded-full px-2 py-0.5 text-[10px] font-bold text-[#2d2000]" style={{ boxShadow: "0 2px 8px rgba(255,204,2,0.4)" }}>
                          Full Match
                        </div>
                      )}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h3 className="text-white text-base sm:text-lg font-bold drop-shadow-lg truncate">{result.item.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-white/90 text-[11px]">{result.item.category}</span>
                          <span className="text-white/50 text-[11px]">·</span>
                          <span className="text-white/90 text-[11px]">{"฿".repeat(result.item.priceLevel)}</span>
                          <span className="text-white/50 text-[11px]">·</span>
                          <span className="text-white/90 text-[11px] flex items-center gap-0.5">★ {result.item.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex -space-x-2 flex-shrink-0">
                          {result.voters.map((v) => (
                            v.pictureUrl ? (
                              <img key={v.lineUserId} src={v.pictureUrl} alt={v.displayName} className="w-6 h-6 rounded-full border-2 border-white object-cover" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }} />
                            ) : (
                              <div key={v.lineUserId} className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                                <span className="text-[8px] font-bold text-amber-600">{v.displayName.charAt(0)}</span>
                              </div>
                            )
                          ))}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-foreground/80 truncate">
                            {result.voters.map(v => v.lineUserId === profile?.userId ? "You" : v.displayName).join(", ")}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {result.voteCount}/{members.length} liked this
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}

              {rest.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2.5 px-1">Also Popular</p>
                  <div className="space-y-2">
                    {rest.map((result, idx) => (
                      <motion.div
                        key={result.item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.06 }}
                        onClick={() => { sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`); navigate(`/restaurant/${result.item.id}`); }}
                        className="flex items-center gap-3 bg-white rounded-2xl p-2.5 pr-3 border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
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
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-5">
                <span className="text-4xl">🤷</span>
              </div>
              <h2 className="text-lg font-bold mb-2">No shared picks yet</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Nobody in your group agreed on the same spot. Try again with different preferences!</p>
            </motion.div>
          )}
        </div>

        <div className="flex-shrink-0 px-5 py-4 pb-6 border-t border-gray-50 safe-bottom bg-white/80 backdrop-blur-sm">
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
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  if (fullMatch && matchedItem) {
    return (
      <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col relative overflow-hidden" data-testid="group-match-page">
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
            It's a match!
          </motion.h1>
          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="text-muted-foreground text-center mb-3 text-[14px] sm:text-[15px] leading-snug max-w-[260px]"
          >
            Everyone agreed on {matchedItem.name}!
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
            onClick={() => { sessionStorage.setItem("group_results_return", `/group/swipe?session=${sessionCode}`); navigate(`/restaurant/${matchedItem.id}`); }}
            className="w-full max-w-[280px] rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.97] transition-transform"
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
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[11px] font-medium">{"\u2605"} {matchedItem.rating}</span>
                <span className="text-[11px] text-muted-foreground">{"\u0E3F".repeat(matchedItem.priceLevel)}</span>
                <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">{"\u00B7"} {matchedItem.address}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {matchedItem.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-100 rounded-full px-2 py-0.5 font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-shrink-0 px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-3 bg-white/80 backdrop-blur-sm border-t border-gray-50 relative z-10">
          <div className="flex flex-col gap-2.5 w-full max-w-xs mx-auto">
            <motion.button
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => navigate(`/restaurant/${matchedItem.id}`)}
              data-testid="button-view-restaurant"
              className="w-full py-3.5 rounded-full bg-[#FFCC02] text-[#2d2000] font-bold text-[14px] active:scale-[0.96] transition-transform duration-200"
              style={{ boxShadow: "var(--shadow-glow-primary)" }}
            >
              View Restaurant
            </motion.button>

            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex gap-2 w-full"
            >
              <button
                onClick={() => { setFullMatch(false); fetchRankedResults().then(() => setShowResults(true)); }}
                data-testid="button-view-summary"
                className="flex-1 py-3 rounded-full bg-white border border-gray-200 text-foreground font-bold text-[13px] active:scale-[0.96] transition-transform flex items-center justify-center gap-1.5"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <Trophy className="w-3.5 h-3.5" />
                Top Picks
              </button>

              <button
                onClick={handleContinueSwiping}
                data-testid="button-keep-swiping"
                className="flex-1 py-3 rounded-full bg-white border border-gray-200 text-foreground font-bold text-[13px] active:scale-[0.96] transition-transform"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                {currentIndex >= menuItems.length ? "Results" : "Keep Swiping"}
              </button>

              {isHost && (
                <button
                  onClick={handleEndSession}
                  data-testid="button-end-session-match"
                  className="py-3 px-4 rounded-full bg-red-50 border border-red-200/60 text-red-600 font-bold text-[13px] active:scale-[0.96] transition-transform"
                  style={{ boxShadow: "0 2px 8px rgba(239,68,68,0.08)" }}
                >
                  End
                </button>
              )}
            </motion.div>
          </div>
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

      <div className="flex-1 relative px-5 pb-4">
        {menuItems.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <p className="text-base font-semibold mb-2">No restaurants found</p>
            <p className="text-sm text-muted-foreground mb-4">We could not load any restaurants for this session.</p>
            <button
              onClick={() => window.location.reload()}
              data-testid="button-retry-load"
              className="px-6 py-2.5 rounded-full bg-[#FFCC02] text-[#2d2000] font-semibold text-sm"
            >
              Try Again
            </button>
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
        )}
      </div>

      <div className="px-6 pb-20 flex flex-col gap-3">
        {currentIndex < menuItems.length && (
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
