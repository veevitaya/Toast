import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { useSavedRestaurants } from "@/hooks/use-saved-restaurants";
import { useLineProfile } from "@/lib/useLineProfile";
import { apiRequest } from "@/lib/queryClient";
import { Heart, ChevronRight, Star, ArrowLeft, Trash2, Play, Share2, Search, TrendingUp, Eye, List } from "lucide-react";
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

function ListCard({
  name,
  emoji,
  count,
  lastUpdated,
  onView,
  onSwipe,
  onInvite,
}: {
  name: string;
  emoji: string;
  count: number;
  lastUpdated: string | null;
  onView: () => void;
  onSwipe: () => void;
  onInvite: () => void;
}) {
  const timeAgo = lastUpdated ? formatTimeAgo(lastUpdated) : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4"
      style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.06)" }}
      data-testid={`card-list-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-tight">{name}</p>
          <p className="text-[10px] text-muted-foreground">
            {count} restaurant{count !== 1 ? "s" : ""}
            {timeAgo ? ` · updated ${timeAgo}` : ""}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-[11px] font-medium active:scale-95 transition-transform flex-1 justify-center"
          data-testid={`button-view-${name.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <Eye className="w-3 h-3" />
          View
        </button>
        <button
          onClick={onSwipe}
          className="flex items-center gap-1 px-3 py-2 bg-[#FFCC02] rounded-xl text-[11px] font-semibold active:scale-95 transition-transform flex-1 justify-center"
          data-testid={`button-swipe-${name.toLowerCase().replace(/\s+/g, "-")}`}
          disabled={count === 0}
        >
          <Play className="w-3 h-3" />
          Swipe
        </button>
        <button
          onClick={onInvite}
          className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-[11px] font-medium active:scale-95 transition-transform flex-1 justify-center"
          data-testid={`button-invite-${name.toLowerCase().replace(/\s+/g, "-")}`}
          disabled={count === 0}
        >
          <Share2 className="w-3 h-3" />
          Invite
        </button>
      </div>
    </motion.div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SavedLists() {
  const [, navigate] = useLocation();
  const { data: savedData, unsave, serverLists } = useSavedRestaurants();
  const { profile } = useLineProfile();
  const [selectedList, setSelectedList] = useState<"mine" | "partner" | null>(null);

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

  const mineList = useMemo(() => serverLists.find(l => l.isDefault && l.name === "My Saves"), [serverLists]);
  const partnerList = useMemo(() => serverLists.find(l => l.isDefault && l.name === "With Partner"), [serverLists]);

  const mineLastUpdated = useMemo(() => {
    const items = mineList?.items || [];
    if (items.length === 0) return null;
    return items.reduce((latest, item) => item.addedAt > latest ? item.addedAt : latest, items[0].addedAt);
  }, [mineList]);

  const partnerLastUpdated = useMemo(() => {
    const items = partnerList?.items || [];
    if (items.length === 0) return null;
    return items.reduce((latest, item) => item.addedAt > latest ? item.addedAt : latest, items[0].addedAt);
  }, [partnerList]);

  const handleSwipeFromList = async (listType: "mine" | "partner") => {
    const list = listType === "mine" ? mineList : partnerList;
    if (!list || !profile?.userId) return;
    try {
      const res = await apiRequest("POST", `/api/saved-lists/${list.id}/start-session`, {
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

  const handleInviteFromList = async (listType: "mine" | "partner") => {
    const list = listType === "mine" ? mineList : partnerList;
    if (!list || !profile?.userId) return;
    try {
      const res = await apiRequest("POST", `/api/saved-lists/${list.id}/invite`, {
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

  const displayedRestaurants = selectedList === "mine" ? mineRestaurants : selectedList === "partner" ? partnerRestaurants : [];
  const totalSaved = savedData.mine.length + savedData.partner.length;

  if (selectedList) {
    return (
      <div className="w-full min-h-[100dvh] bg-[#FCFCFC]" data-testid="saved-lists-page">
        <div className="px-5 pt-14 pb-32">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelectedList(null)}
              className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
              data-testid="button-back-to-lists"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight" data-testid="text-list-title">
                {selectedList === "mine" ? "❤️ My Saves" : "💕 With Partner"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {displayedRestaurants.length} restaurant{displayedRestaurants.length !== 1 ? "s" : ""}
              </p>
            </div>
            {displayedRestaurants.length > 0 && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleSwipeFromList(selectedList)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#FFCC02] rounded-full text-[11px] font-semibold active:scale-95 transition-transform"
                  data-testid="button-swipe-from-list"
                >
                  <Play className="w-3 h-3" />
                  Swipe
                </button>
                <button
                  onClick={() => handleInviteFromList(selectedList)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-[11px] font-medium active:scale-95 transition-transform"
                  data-testid="button-invite-from-list"
                >
                  <Share2 className="w-3 h-3" />
                  Invite
                </button>
              </div>
            )}
          </div>

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
                  {selectedList === "mine" ? "No saved restaurants yet" : "No partner picks yet"}
                </p>
                <p className="text-xs text-muted-foreground/60 mb-6">
                  {selectedList === "mine"
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
              {totalSaved} saved across {serverLists.length} list{serverLists.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <ListCard
            name="My Saves"
            emoji="❤️"
            count={mineRestaurants.length}
            lastUpdated={mineLastUpdated}
            onView={() => setSelectedList("mine")}
            onSwipe={() => handleSwipeFromList("mine")}
            onInvite={() => handleInviteFromList("mine")}
          />
          <ListCard
            name="With Partner"
            emoji="💕"
            count={partnerRestaurants.length}
            lastUpdated={partnerLastUpdated}
            onView={() => setSelectedList("partner")}
            onSwipe={() => handleSwipeFromList("partner")}
            onInvite={() => handleInviteFromList("partner")}
          />
        </div>

        {totalSaved === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <List className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">No saved restaurants yet</p>
            <p className="text-xs text-muted-foreground/60 mb-6">Start swiping to build your lists</p>
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
      </div>
      <BottomNav />
    </div>
  );
}
