import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { useTasteProfile } from "@/hooks/use-taste-profile";
import { useSavedRestaurants } from "@/hooks/use-saved-restaurants";
import { SaveBucketPicker } from "@/components/SaveBucketPicker";
import { Sparkles, ChevronRight, RefreshCw, Heart, Star } from "lucide-react";
import type { RestaurantResponse } from "@shared/routes";
import mascotPath from "@assets/toast_mascot_nobg.png";
import { useLanguage } from "@/i18n/LanguageProvider";

const PROFILE_STORAGE_KEY = "toast_user_profile";

interface UserProfile {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  defaultBudget: number;
  defaultDistance: string;
}

function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { dietaryRestrictions: [], cuisinePreferences: [], defaultBudget: 2, defaultDistance: "5km" };
}

function getTimeContext(): { meal: string; greeting: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return { meal: "breakfast", greeting: "Good morning" };
  if (hour >= 11 && hour < 14) return { meal: "lunch", greeting: "Lunchtime" };
  if (hour >= 14 && hour < 17) return { meal: "afternoon snack", greeting: "Afternoon" };
  if (hour >= 17 && hour < 21) return { meal: "dinner", greeting: "Evening" };
  return { meal: "late night bite", greeting: "Late night" };
}

function scoreRestaurant(
  restaurant: RestaurantResponse,
  tasteProfile: ReturnType<typeof useTasteProfile>["profile"],
  userProfile: UserProfile,
  savedIds: number[]
): number {
  let score = 0;
  const category = restaurant.category.toLowerCase();

  for (const [cuisine, entry] of Object.entries(tasteProfile.likes)) {
    if (category.includes(cuisine.toLowerCase())) {
      score += entry.count * 3;
    }
  }
  for (const [cuisine, entry] of Object.entries(tasteProfile.superLikes)) {
    if (category.includes(cuisine.toLowerCase())) {
      score += entry.count * 5;
    }
  }
  for (const [cuisine, entry] of Object.entries(tasteProfile.dislikes)) {
    if (category.includes(cuisine.toLowerCase())) {
      score -= entry.count * 2;
    }
  }

  if (userProfile.cuisinePreferences.length > 0) {
    for (const pref of userProfile.cuisinePreferences) {
      if (category.includes(pref.toLowerCase())) {
        score += 4;
      }
    }
  }

  if (restaurant.priceLevel <= userProfile.defaultBudget) {
    score += 2;
  } else if (restaurant.priceLevel > userProfile.defaultBudget + 1) {
    score -= 3;
  }

  score += parseFloat(restaurant.rating) * 2;
  score += (restaurant.trendingScore || 50) / 20;
  if (restaurant.isNew) score += 1;
  if (savedIds.includes(restaurant.id)) score -= 5;

  const timeContext = getTimeContext();
  if (timeContext.meal === "breakfast" && (category.includes("brunch") || category.includes("cafe") || category.includes("coffee"))) {
    score += 4;
  }
  if (timeContext.meal === "lunch" && (category.includes("street food") || category.includes("noodles") || category.includes("curry"))) {
    score += 3;
  }
  if (timeContext.meal === "dinner" && (category.includes("fine dining") || category.includes("bbq") || category.includes("seafood"))) {
    score += 3;
  }
  if (timeContext.meal === "late night bite" && (category.includes("ramen") || category.includes("street food") || category.includes("noodles"))) {
    score += 3;
  }
  if (timeContext.meal === "afternoon snack" && (category.includes("dessert") || category.includes("cafe") || category.includes("tea"))) {
    score += 3;
  }

  score += (Math.random() - 0.5) * 2;

  return score;
}

function HeartButton({ restaurant, onPick, className }: { restaurant: RestaurantResponse; onPick: () => void; className?: string }) {
  const { isSaved, getBucket } = useSavedRestaurants();
  const saved = isSaved(restaurant.id);
  const bucket = getBucket(restaurant.id);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onPick(); }}
      className={`active:scale-110 transition-transform ${className || ""}`}
      data-testid={`button-save-pick-${restaurant.id}`}
      aria-pressed={saved}
      aria-label={`${saved ? "Unsave" : "Save"} ${restaurant.name}`}
    >
      <Heart className={`w-5 h-5 ${saved ? (bucket === "partner" ? "text-pink-400 fill-pink-400" : "text-red-500 fill-red-500") : "text-white/85"}`} />
    </button>
  );
}

function cardKeyHandler(onNavigate: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onNavigate();
    }
  };
}

function HeroPick({ restaurant, onNavigate }: { restaurant: RestaurantResponse; onNavigate: () => void }) {
  const { t } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={cardKeyHandler(onNavigate)}
        aria-label={t("toast_picks.see_details") + ": " + restaurant.name}
        className="relative overflow-hidden rounded-[26px] bg-white cursor-pointer active:scale-[0.99] transition-transform duration-200 gpu-accelerated focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC02]"
        style={{ boxShadow: "0 12px 36px -8px rgba(0,0,0,0.16)" }}
        data-testid={`card-pick-${restaurant.id}`}
      >
        <div className="relative h-60 overflow-hidden">
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#FFCC02] rounded-full px-3 py-1.5"
            style={{ boxShadow: "0 4px 14px rgba(255,204,2,0.45)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2d2000]" />
            <span className="text-[11px] font-bold text-[#2d2000] uppercase tracking-wide">{t("toast_picks.top_pick")}</span>
          </motion.div>
          <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center">
            <HeartButton restaurant={restaurant} onPick={() => setShowPicker(true)} />
          </div>
          <div className="absolute bottom-4 left-5 right-5">
            <h3 className="text-white font-bold text-[24px] leading-tight tracking-tight drop-shadow-sm truncate" data-testid={`text-pick-name-${restaurant.id}`}>{restaurant.name}</h3>
            <p className="text-white/85 text-[13px] mt-0.5 truncate" data-testid={`text-pick-category-${restaurant.id}`}>{restaurant.category}</p>
          </div>
        </div>
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1 text-[13px]">
            <span className="flex items-center gap-1 flex-shrink-0 font-bold text-foreground">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{restaurant.rating}
            </span>
            <span className="text-muted-foreground/30 flex-shrink-0">·</span>
            <span className="text-muted-foreground flex-shrink-0 font-medium text-[#C79200]">{"฿".repeat(restaurant.priceLevel)}</span>
            <span className="text-muted-foreground/30 flex-shrink-0">·</span>
            <span className="text-muted-foreground truncate">{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-1 bg-[#FFCC02] rounded-full pl-3.5 pr-2.5 py-2 flex-shrink-0" style={{ boxShadow: "0 4px 14px -4px rgba(255,204,2,0.6)" }}>
            <span className="text-[13px] font-bold text-[#2d2000]">{t("toast_picks.see_details")}</span>
            <ChevronRight className="w-4 h-4 text-[#2d2000]" />
          </div>
        </div>
      </motion.div>
      <SaveBucketPicker
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        open={showPicker}
        onClose={() => setShowPicker(false)}
      />
    </>
  );
}

function MiniPick({ restaurant, index, onNavigate }: { restaurant: RestaurantResponse; index: number; onNavigate: () => void }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 + index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={cardKeyHandler(onNavigate)}
        aria-label={restaurant.name}
        className="relative flex items-center gap-3 bg-white rounded-[20px] p-2.5 pr-3.5 cursor-pointer active:scale-[0.98] transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC02]"
        style={{ boxShadow: "0 4px 18px -6px rgba(0,0,0,0.1)" }}
        data-testid={`card-pick-${restaurant.id}`}
      >
        <div className="relative w-[76px] h-[76px] rounded-2xl overflow-hidden flex-shrink-0">
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute top-1.5 right-1.5">
            <HeartButton restaurant={restaurant} onPick={() => setShowPicker(true)} className="drop-shadow" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[15px] text-foreground leading-tight truncate" data-testid={`text-pick-name-${restaurant.id}`}>{restaurant.name}</h3>
          <p className="text-[12px] text-muted-foreground truncate mt-0.5" data-testid={`text-pick-category-${restaurant.id}`}>{restaurant.category}</p>
          <div className="flex items-center gap-1.5 text-[12px] mt-1.5">
            <span className="flex items-center gap-1 font-bold text-foreground">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />{restaurant.rating}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="font-medium text-[#C79200]">{"฿".repeat(restaurant.priceLevel)}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
      </motion.div>
      <SaveBucketPicker
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        open={showPicker}
        onClose={() => setShowPicker(false)}
      />
    </>
  );
}

export default function ToastPicks() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { profile: tasteProfile } = useTasteProfile();
  const { data: savedData } = useSavedRestaurants();
  const [phase, setPhase] = useState<"thinking" | "reveal">("thinking");
  const [refreshKey, setRefreshKey] = useState(0);
  const userProfile = useMemo(() => getUserProfile(), []);
  const timeContext = useMemo(() => getTimeContext(), []);

  const { data: allRestaurants = [] } = useQuery<RestaurantResponse[]>({
    queryKey: ["/api/restaurants"],
  });

  const picks = useMemo(() => {
    if (allRestaurants.length === 0) return [];
    const allSavedIds = [...savedData.mine, ...savedData.partner];
    const scored = allRestaurants.map(r => ({
      restaurant: r,
      score: scoreRestaurant(r, tasteProfile, userProfile, allSavedIds),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(s => s.restaurant);
  }, [allRestaurants, tasteProfile, userProfile, savedData, refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("reveal"), 1900);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  const handleRefresh = () => {
    setPhase("thinking");
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[hsl(30,20%,97%)]" data-testid="toast-picks-page">
      <div
        className="relative overflow-hidden"
        style={{ background: phase === "thinking" ? "#ffffff" : "linear-gradient(180deg, hsl(45,40%,94%) 0%, hsl(30,20%,97%) 100%)", minHeight: phase === "thinking" ? "100dvh" : "auto", paddingBottom: 40 }}
      >
        {phase !== "thinking" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #FFCC02 0%, transparent 70%)" }} />
            <div className="absolute top-60 -left-10 w-40 h-40 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #FFCC02 0%, transparent 70%)" }} />
          </div>
        )}

        <div className="relative z-10 px-6 pt-14">
          <AnimatePresence mode="wait">
            {phase === "thinking" ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center"
                style={{ minHeight: "70dvh" }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 8, -8, 4, 0],
                    scale: [1, 1.05, 1, 1.03, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="mb-8"
                >
                  <img src={mascotPath} alt="Toast mascot" className="h-24 mx-auto" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[20px] font-semibold text-foreground tracking-tight leading-snug"
                  data-testid="text-toast-thinking"
                >
                  {t("toast_picks.finding")}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-7 flex gap-1.5"
                >
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#FFCC02]"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-6"
                >
                  <p className="text-[12px] font-semibold text-[#FFCC02] mb-1">{timeContext.greeting}</p>
                  <h1 className="text-[30px] font-bold text-foreground tracking-tight leading-none">
                    {t("toast_picks.todays_picks")}
                  </h1>
                </motion.div>

                {picks.length > 0 ? (
                  <div className="pb-32">
                    <HeroPick
                      key={`${picks[0].id}-${refreshKey}`}
                      restaurant={picks[0]}
                      onNavigate={() => navigate(`/restaurant/${picks[0].id}`)}
                    />

                    {picks.length > 1 && (
                      <div className="mt-6">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.45 }}
                          className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-3 px-0.5"
                        >
                          {t("toast_picks.other_options")}
                        </motion.p>
                        <div className="space-y-2.5">
                          {picks.slice(1).map((restaurant, idx) => (
                            <MiniPick
                              key={`${restaurant.id}-${refreshKey}`}
                              restaurant={restaurant}
                              index={idx}
                              onNavigate={() => navigate(`/restaurant/${restaurant.id}`)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      onClick={handleRefresh}
                      className="mt-6 w-full py-3.5 rounded-full bg-white flex items-center justify-center gap-2 text-[15px] font-bold text-foreground active:scale-[0.98] transition-transform"
                      style={{ boxShadow: "0 4px 18px -6px rgba(0,0,0,0.12)" }}
                      data-testid="button-refresh-picks"
                    >
                      <RefreshCw className="w-4 h-4 text-[#C79200]" />
                      {t("toast_picks.show_others")}
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 pb-32"
                  >
                    <img src={mascotPath} alt="Toast mascot" className="h-12 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-6">{t("toast_picks.still_learning")}</p>
                    <button
                      onClick={handleRefresh}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[15px] font-bold text-foreground active:scale-[0.98] transition-transform"
                      style={{ boxShadow: "0 4px 18px -6px rgba(0,0,0,0.12)" }}
                      data-testid="button-refresh-picks"
                    >
                      <RefreshCw className="w-4 h-4 text-[#C79200]" />
                      {t("toast_picks.show_others")}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
