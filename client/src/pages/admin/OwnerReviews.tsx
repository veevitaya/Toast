import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminSession } from "./AdminLayout";
import {
  MessageSquare,
  Star,
  ThumbsUp,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface Review {
  id: number;
  userName: string;
  avatarUrl: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
  source: string;
}

export default function OwnerReviews() {
  const session = getAdminSession();
  const [filter, setFilter] = useState<"all" | "5star" | "low">("all");

  const { data: reviewsData, isLoading } = useQuery<{ reviews: Review[]; stats: { avgRating: string; totalReviews: number; fiveStarCount: number; totalHelpful: number } }>({
    queryKey: ["/api/owner/reviews"],
    queryFn: async () => {
      const token = localStorage.getItem("ownerToken");
      const res = await fetch("/api/owner/reviews", {
        headers: { "x-owner-token": token || "" },
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    staleTime: 30000,
  });

  const allReviews = reviewsData?.reviews || [];
  const stats = reviewsData?.stats || { avgRating: "0", totalReviews: 0, fiveStarCount: 0, totalHelpful: 0 };

  const reviews = allReviews.filter((r) => {
    if (filter === "5star") return r.rating === 5;
    if (filter === "low") return r.rating <= 3;
    return true;
  });

  if (!session || session.sessionType !== "owner") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400" data-testid="text-access-denied">This page is only accessible to restaurant owners.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="owner-reviews-page">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-[#FFCC02]" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800" data-testid="text-reviews-title">Reviews</h2>
          <p className="text-xs text-gray-400">View customer feedback for your restaurant</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-testid="stat-avg-rating">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFCC02]/15 flex items-center justify-center">
                  <Star className="w-4 h-4 text-[#FFCC02]" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgRating}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.totalReviews} total reviews</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-testid="stat-five-star">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#00B14F]/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#00B14F]" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">5-Star</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.fiveStarCount}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.totalReviews > 0 ? `${Math.round((stats.fiveStarCount / stats.totalReviews) * 100)}% of reviews` : "No reviews yet"}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-testid="stat-total-helpful">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Helpful Votes</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalHelpful}</p>
              <p className="text-xs text-gray-400 mt-1">Total across all reviews</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm" data-testid="section-reviews-list">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-[15px] font-semibold text-gray-800">Customer Reviews</h3>
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                {(["all", "5star", "low"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                      filter === f
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    data-testid={`filter-${f}`}
                  >
                    {f === "all" ? "All" : f === "5star" ? "5 Star" : "Low Rating"}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {reviews.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm" data-testid="text-no-reviews">
                  {allReviews.length === 0 ? "No reviews yet for your restaurant." : "No reviews match this filter."}
                </div>
              ) : reviews.map((review) => (
                <div key={review.id} className="p-5" data-testid={`review-${review.id}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
                      {review.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800">{review.userName}</span>
                          <span className="text-[10px] text-gray-300 bg-gray-50 rounded px-1.5 py-0.5">{review.source}</span>
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>

                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-100 text-gray-100"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.text}</p>

                      <div className="flex items-center gap-4 mt-3">
                        <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors" data-testid={`button-helpful-${review.id}`}>
                          <ThumbsUp className="w-3 h-3" /> {review.helpful} helpful
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
