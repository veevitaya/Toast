import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { useSavedRestaurants } from "@/hooks/use-saved-restaurants";
import { useLineProfile } from "@/lib/useLineProfile";
import { apiRequest } from "@/lib/queryClient";
import { Heart, ChevronRight, Star, ArrowLeft, Trash2, Play, Share2, Search, TrendingUp } from "lucide-react";
import type { RestaurantResponse } from "@shared/routes";
import { handleImageError } from "@/lib/imageUtils";

function SavedCard({ restaurant, onNavigate, onRemove }: {
  restaurant: RestaurantResponse;
  onNavigate: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      layout
      onClick={onNavigate}
      className="flex items-center gap-3 bg-white rounded-2xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
      style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.06)" }}
      data-testid={`card-saved-${restaurant.id}`}
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm tracking-tight truncate" data-testid={`text-saved-name-${restaurant.id}`}>
          {restaurant.name}
        </h3>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{restaurant.category}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-medium">{restaurant.rating}</span>
          </div>
          <span className="text-muted-foreground/30 text-[10px]">·</span>
          <span className="text-[11px] text-muted-foreground">{"฿".repeat(restaurant.priceLevel)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 rounded-full hover:bg-red-50 active:scale-90 transition-all"
          data-testid={`button-remove-saved-${restaurant.id}`}
        >
          <Trash2 className="w-3.5 h-3.5 text-muted-foreground/40" />
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
      </div>
    </motion.div>
  );
}

function ListHeader({
  listName,
  emoji,
  count,
  isActive,
  onSwipe,
  onInvite,
}: {
  listName: string;
  emoji: string;
  count: number;
  isActive: boolean;
  onSwipe: () => void;
  onInvite: () => void;
}) {
  if (!isActive || count === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-lg">{emoji}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight truncate">{listName}</p>
          <p className="text-[10px] text-muted-foreground">{count} restaurant{count !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={onSwipe}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#FFCC02] rounded-full text-[11px] font-semibold active:scale-95 transition-transform"
          data-testid="button-swipe-from-list"
        >
          <Play className="w-3 h-3" />
          Swipe
        </button>
        <button
          onClick={onInvite}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-[11px] font-medium active:scale-95 transition-transform"
          data-testid="button-invite-from-list"
        >
          <Share2 className="w-3 h-3" />
          Invite
        </button>
      </div>
    </motion.div>
  );
}

export default function SavedLists() {
  const [, navigate] = useLocation();
  const { data: savedData, unsave, serverLists } = useSavedRestaurants();
  const { profile } = useLineProfile();
  const [activeTab, setActiveTab] = useState<"mine" | "partner">("mine");

  const { data: allRestaurants = [] } = useQuery<RestaurantResponse[]>({
    queryKey: ["/api/restaurants"],
  });

  const mineRestaurants = useMemo(() => {
    return savedData.mine
      .map(id => allRestaurants.find(r => r.id === id))
      .filter((r): r is RestaurantResponse => !!r);
  }, [savedData.mine, allRestaurants]);

  const partnerRestaurants = useMemo(() => {
    return savedData.partner
      .map(id => allRestaurants.find(r => r.id === id))
      .filter((r): r is RestaurantResponse => !!r);
  }, [savedData.partner, allRestaurants]);

  const displayedRestaurants = activeTab === "mine" ? mineRestaurants : partnerRestaurants;

  const activeList = useMemo(() => {
    const name = activeTab === "mine" ? "My Saves" : "With Partner";
    return serverLists.find(l => l.isDefault && l.name === name);
  }, [activeTab, serverLists]);

  const handleSwipeFromList = async () => {
    if (!activeList || !profile?.userId) return;
    try {
      const res = await apiRequest("POST", `/api/saved-lists/${activeList.id}/start-session`, {
        userId: profile.userId,
        displayName: profile.displayName,
      });
      const data = await res.json();
      if (data.sessionCode) {
        navigate(`/group/waiting?session=${data.sessionCode}`);
      }
    } catch (err) {
      console.error("Failed to start session from list:", err);
    }
  };

  const handleInviteFromList = async () => {
    if (!activeList || !profile?.userId) return;
    try {
      const res = await apiRequest("POST", `/api/saved-lists/${activeList.id}/invite`, {
        userId: profile.userId,
      });
      const data = await res.json();
      if (data.inviteUrl && navigator.share) {
        navigator.share({
          title: `Let's decide from ${data.listName}!`,
          text: `Help me pick from ${data.restaurantCount} saved restaurants on Toast!`,
          url: window.location.origin + data.inviteUrl,
        }).catch(() => {});
      } else if (data.inviteUrl) {
        navigator.clipboard?.writeText(window.location.origin + data.inviteUrl);
      }
    } catch (err) {
      console.error("Failed to create invite:", err);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#FCFCFC]" data-testid="saved-lists-page">
      <div className="px-5 pt-14 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
            data-testid="button-back-saved"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight" data-testid="text-saved-title">Saved Restaurants</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {savedData.mine.length + savedData.partner.length} saved
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("mine")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "mine"
                ? "bg-red-50 text-red-600"
                : "bg-gray-100 text-muted-foreground"
            }`}
            data-testid="tab-mine"
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === "mine" ? "fill-red-500 text-red-500" : ""}`} />
            My Saves ({mineRestaurants.length})
          </button>
          <button
            onClick={() => setActiveTab("partner")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "partner"
                ? "bg-pink-50 text-pink-600"
                : "bg-gray-100 text-muted-foreground"
            }`}
            data-testid="tab-partner"
          >
            <span className="text-sm">💕</span>
            With Partner ({partnerRestaurants.length})
          </button>
        </div>

        <ListHeader
          listName={activeTab === "mine" ? "My Saves" : "With Partner"}
          emoji={activeTab === "mine" ? "❤️" : "💕"}
          count={displayedRestaurants.length}
          isActive={true}
          onSwipe={handleSwipeFromList}
          onInvite={handleInviteFromList}
        />

        <AnimatePresence mode="popLayout">
          {displayedRestaurants.length > 0 ? (
            <div className="space-y-3">
              {displayedRestaurants.map((restaurant) => (
                <SavedCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onNavigate={() => navigate(`/restaurant/${restaurant.id}`)}
                  onRemove={() => unsave(restaurant.id)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {activeTab === "mine" ? "No saved restaurants yet" : "No partner picks yet"}
              </p>
              <p className="text-xs text-muted-foreground/60 mb-6">
                {activeTab === "mine"
                  ? "Tap the heart icon on any restaurant to save it"
                  : "Save restaurants to share date night ideas"
                }
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => navigate("/swipe")}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FFCC02] rounded-full text-sm font-semibold active:scale-95 transition-transform"
                  data-testid="button-start-swiping"
                >
                  <Play className="w-3.5 h-3.5" />
                  Browse & Swipe
                </button>
                <button
                  onClick={() => navigate("/trending")}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-100 rounded-full text-sm font-medium active:scale-95 transition-transform"
                  data-testid="button-go-trending"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Trending
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-100 rounded-full text-sm font-medium active:scale-95 transition-transform"
                  data-testid="button-go-search"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
