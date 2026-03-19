import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import type { RestaurantPromotion } from "@shared/schema";

interface CampaignBannerData {
  id: string | number;
  restaurantId: number;
  restaurantName: string;
  restaurantImage: string;
  title: string;
  dealType: string;
  dealValue: string;
  description: string;
  endDate: string;
  accentColor?: string;
}

const FALLBACK_HOME_CAMPAIGNS: CampaignBannerData[] = [
  {
    id: "camp_1",
    restaurantId: 231,
    restaurantName: "Peppina",
    restaurantImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
    title: "Pizza Night Special",
    dealType: "percentage",
    dealValue: "25",
    description: "All wood-fired pizzas, every Thursday to Sunday",
    endDate: "2026-03-31",
    accentColor: "#E85D04",
  },
  {
    id: "camp_2",
    restaurantId: 241,
    restaurantName: "Krua Apsorn",
    restaurantImage: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60",
    title: "Lunch Set Menu",
    dealType: "fixedAmount",
    dealValue: "100",
    description: "฿100 off any set menu, weekday lunch only",
    endDate: "2026-04-15",
    accentColor: "#1E293B",
  },
  {
    id: "camp_3",
    restaurantId: 251,
    restaurantName: "Sushi Masato",
    restaurantImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
    title: "Omakase for Two",
    dealType: "bogo",
    dealValue: "",
    description: "Bring a friend — second omakase seat complimentary",
    endDate: "2026-03-15",
    accentColor: "#1A1A2E",
  },
  {
    id: "camp_4",
    restaurantId: 222,
    restaurantName: "Bankara Ramen",
    restaurantImage: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&auto=format&fit=crop&q=60",
    title: "Free Gyoza Set",
    dealType: "freeItem",
    dealValue: "Gyoza (6pc)",
    description: "Free gyoza with any ramen order",
    endDate: "2026-03-20",
    accentColor: "#8B4513",
  },
  {
    id: "camp_5",
    restaurantId: 301,
    restaurantName: "Tep Bar",
    restaurantImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=60",
    title: "Happy Hour",
    dealType: "bogo",
    dealValue: "",
    description: "Buy 1 get 1 on all heritage cocktails, 5–7PM",
    endDate: "2026-05-01",
    accentColor: "#6B21A8",
  },
  {
    id: "camp_6",
    restaurantId: 244,
    restaurantName: "Jay Fai",
    restaurantImage: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800&auto=format&fit=crop&q=60",
    title: "Weekday Special",
    dealType: "fixedAmount",
    dealValue: "200",
    description: "฿200 off crab omelette, Mon–Thu only",
    endDate: "2026-04-01",
    accentColor: "#B91C1C",
  },
];

export const MOCK_HOME_CAMPAIGNS = FALLBACK_HOME_CAMPAIGNS;
export const MOCK_RESTAURANT_CAMPAIGNS: Record<number, CampaignBannerData[]> = {};

function promotionToBannerData(p: RestaurantPromotion & { restaurantName?: string; restaurantImage?: string }): CampaignBannerData {
  return {
    id: p.id,
    restaurantId: p.restaurantId,
    restaurantName: p.restaurantName || "Restaurant",
    restaurantImage: p.restaurantImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
    title: p.title,
    dealType: p.dealType === "discount" ? "percentage" : p.dealType === "bundle" ? "bogo" : p.dealType,
    dealValue: p.dealValue || "",
    description: p.description || "",
    endDate: p.endDate || "2026-12-31",
  };
}

export function getDealLabel(dealType: string, dealValue: string) {
  switch (dealType) {
    case "percentage": return `${dealValue}% off`;
    case "discount": return `${dealValue}% off`;
    case "bogo": return "Buy 1 Get 1";
    case "bundle": return "Bundle Deal";
    case "freeItem": return `Free ${dealValue}`;
    case "fixedAmount": return `฿${dealValue} off`;
    case "happyHour": return "Happy Hour";
    default: return dealValue || "Special Deal";
  }
}

function getDaysLeft(endDate: string) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Ends today";
  if (diff === 1) return "1 day left";
  if (diff <= 7) return `${diff} days left`;
  return `${Math.ceil(diff / 7)} weeks left`;
}

export function HomeCampaignBanner() {
  const [, navigate] = useLocation();

  const { data: apiPromotions } = useQuery<(RestaurantPromotion & { restaurantName?: string; restaurantImage?: string })[]>({
    queryKey: ["/api/promotions/active"],
    staleTime: 60000,
  });

  const campaigns: CampaignBannerData[] = apiPromotions && apiPromotions.length > 0
    ? apiPromotions.map(promotionToBannerData)
    : FALLBACK_HOME_CAMPAIGNS;

  return (
    <div className="mb-2" data-testid="home-campaign-banner">
      <div className="px-6 mb-2.5 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-foreground">
          {apiPromotions && apiPromotions.length > 0 ? "Promotions near you" : "Deals near you"}
        </h3>
        <button
          onClick={() => navigate("/swipe?mode=campaigns")}
          className="text-[12px] font-semibold text-muted-foreground/70 active:opacity-60"
          data-testid="link-see-all-campaigns"
        >
          See all
        </button>
      </div>

      <div
        className="flex gap-3 overflow-x-auto hide-scrollbar pl-6 pr-4 pb-1"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {campaigns.map((campaign, idx) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform duration-200"
            style={{ width: 240, height: 105 }}
            onClick={() => navigate(`/campaign/${campaign.id}`)}
            data-testid={`campaign-card-${campaign.id}`}
          >
            <img
              src={campaign.restaurantImage}
              alt={campaign.restaurantName}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

            <div className="relative z-10 h-full flex flex-col justify-end p-3.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 mb-0.5 line-clamp-1">
                {campaign.restaurantName}
              </span>
              <h4 className="text-[13px] font-bold text-white leading-tight mb-1.5 line-clamp-1">
                {campaign.title}
              </h4>
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: campaign.accentColor || "#1E293B" }}
                  data-testid={`campaign-deal-${campaign.id}`}
                >
                  {getDealLabel(campaign.dealType, campaign.dealValue)}
                </span>
                <span className="text-[9px] text-white/50 font-medium">
                  {getDaysLeft(campaign.endDate)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface RestaurantCampaignBannerProps {
  restaurantId: number;
}

export function RestaurantCampaignBanner({ restaurantId }: RestaurantCampaignBannerProps) {
  const [, navigate] = useLocation();

  const { data: promotions } = useQuery<RestaurantPromotion[]>({
    queryKey: ["/api/promotions/restaurant", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/promotions/restaurant/${restaurantId}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  if (!promotions || promotions.length === 0) return null;

  const campaign = promotionToBannerData(promotions[0] as RestaurantPromotion & { restaurantName?: string });

  return (
    <div className="mb-6" data-testid="restaurant-campaign-banner">
      <h2 className="font-bold text-[15px] mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        Special Offer
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-2xl overflow-hidden border border-gray-100/80 cursor-pointer active:scale-[0.98] transition-transform duration-200"
        style={{ boxShadow: "0 2px 12px -4px rgba(0,0,0,0.08)" }}
        onClick={() => navigate(`/campaign/${campaign.id}`)}
        data-testid={`restaurant-campaign-${campaign.id}`}
      >
        <div className="relative h-28 overflow-hidden">
          <img
            src={campaign.restaurantImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.85)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between">
            <h3 className="text-[15px] font-bold text-white leading-tight">
              {campaign.title}
            </h3>
            <span className="text-[10px] text-white/70 font-medium flex-shrink-0 ml-2">View deal →</span>
          </div>
        </div>

        <div className="bg-white px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-[13px] text-foreground/70 leading-snug line-clamp-2">
                {campaign.description}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold text-white bg-foreground"
                data-testid={`restaurant-deal-${campaign.id}`}
              >
                {getDealLabel(campaign.dealType, campaign.dealValue)}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {getDaysLeft(campaign.endDate)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
