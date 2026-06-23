import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Utensils } from "lucide-react";
import { LoadingMascot } from "@/components/LoadingMascot";
import type { MenuItem, Restaurant } from "@shared/schema";

export default function MenuItemRestaurants() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/menu-item/:id");
  const id = params?.id;

  const { data: dish, isLoading: dishLoading } = useQuery<MenuItem>({
    queryKey: ["/api/menu-items", id],
    enabled: !!id,
  });

  const { data: restaurants, isLoading: restaurantsLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/menu-items", id, "restaurants"],
    enabled: !!id,
  });

  const loading = dishLoading || restaurantsLoading;
  const list = restaurants ?? [];

  return (
    <div className="min-h-[100dvh] bg-background" data-testid="page-menu-item-restaurants">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-3 flex items-center gap-3 border-b border-black/5">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shadow-sm"
          data-testid="button-back"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Your group picked</p>
          <h1 className="text-[19px] font-bold tracking-tight truncate" data-testid="text-dish-name">
            {dish?.name ?? "Loading..."}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingMascot size="md" />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-8 py-24 gap-3">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Utensils className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold">No restaurants found yet</p>
          <p className="text-sm text-muted-foreground">
            We couldn't find spots serving {dish?.name ?? "this dish"} right now.
          </p>
        </div>
      ) : (
        <div className="px-6 py-5 pb-24 space-y-4">
          <p className="text-xs text-muted-foreground font-medium" data-testid="text-result-count">
            {list.length} place{list.length !== 1 ? "s" : ""} serving this
          </p>
          {list.map((r) => (
            <div
              key={r.id}
              className="flex gap-4 bg-white rounded-2xl cursor-pointer active:scale-[0.98] transition-transform p-1"
              style={{ boxShadow: "0 2px 12px -3px rgba(0,0,0,0.06)" }}
              onClick={() => navigate(`/restaurant/${r.id}`)}
              data-testid={`card-restaurant-${r.id}`}
            >
              <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 py-2 pr-2">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-bold text-base truncate">{r.name}</h3>
                  <div className="flex items-center gap-0.5 ml-2">
                    <span className="text-[10px]">★</span>
                    <span className="text-sm font-semibold">{r.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.category}</p>
                <div className="flex items-center gap-2 mt-2.5 text-xs text-muted-foreground">
                  <span className="font-medium">{"฿".repeat(r.priceLevel || 1)}</span>
                  <span>·</span>
                  <span className="truncate">📍 {r.address}</span>
                </div>
                {r.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">{r.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
