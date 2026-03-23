import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getAdminSession } from "./AdminLayout";
import type { RestaurantPromotion } from "@shared/schema";
import {
  Megaphone,
  Plus,
  Calendar,
  Target,
  TrendingUp,
  Eye,
  MousePointer,
  Percent,
  Gift,
  Zap,
  Clock,
  X,
  Loader2,
  Trash2,
  Pause,
  Play,
} from "lucide-react";

function getOwnerHeaders() {
  const session = getAdminSession();
  if (!session || session.sessionType !== "owner") return {};
  return { "x-owner-token": btoa(`${session.email}:${session._k || ""}`) };
}

const typeIcons: Record<string, typeof Percent> = {
  discount: Percent,
  bundle: Gift,
  freeItem: Gift,
  happyHour: Clock,
};

const typeColors: Record<string, string> = {
  discount: "bg-[var(--admin-blue-10)] text-[var(--admin-blue)]",
  bundle: "bg-[#FFCC02]/15 text-gray-700",
  freeItem: "bg-[#00B14F]/10 text-[#00B14F]",
  happyHour: "bg-blue-50 text-blue-600",
};

const statusColors: Record<string, string> = {
  active: "bg-[#00B14F]/10 text-[#00B14F]",
  draft: "bg-gray-100 text-gray-500",
  ended: "bg-gray-100 text-gray-400",
  scheduled: "bg-[#FFCC02]/15 text-gray-700",
};

export default function OwnerPromotions() {
  const session = getAdminSession();
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dealType: "discount" as "discount" | "bundle" | "freeItem" | "happyHour",
    dealValue: "",
    startDate: "",
    endDate: "",
    targetGroups: [] as string[],
    budget: "",
  });
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: promotions = [], isLoading } = useQuery<RestaurantPromotion[]>({
    queryKey: ["/api/owner/promotions"],
    queryFn: async () => {
      const res = await fetch("/api/owner/promotions", {
        headers: getOwnerHeaders() as Record<string, string>,
      });
      if (!res.ok) throw new Error("Failed to load promotions");
      return res.json();
    },
    enabled: session?.sessionType === "owner",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/owner/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getOwnerHeaders() as Record<string, string>,
        },
        body: JSON.stringify({
          title: data.title,
          dealType: data.dealType,
          dealValue: data.dealValue,
          startDate: data.startDate,
          endDate: data.endDate,
          targetGroups: data.targetGroups,
          budget: parseInt(data.budget) || 0,
          status: "draft",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to create promotion" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/owner/promotions"] });
      setShowCreate(false);
      setFormData({
        title: "",
        dealType: "discount",
        dealValue: "",
        startDate: "",
        endDate: "",
        targetGroups: [],
        budget: "",
      });
      toast({ title: "Promotion created", description: "Your new promotion has been saved as a draft." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/owner/promotions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getOwnerHeaders() as Record<string, string>,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/owner/promotions"] });
      toast({ title: "Status updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message || "Failed to update status", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/owner/promotions/${id}`, {
        method: "DELETE",
        headers: getOwnerHeaders() as Record<string, string>,
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/owner/promotions"] });
      toast({ title: "Promotion deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message || "Failed to delete promotion", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dealType) return;
    createMutation.mutate(formData);
  };

  const toggleTargetGroup = (group: string) => {
    setFormData((prev) => ({
      ...prev,
      targetGroups: prev.targetGroups.includes(group)
        ? prev.targetGroups.filter((g) => g !== group)
        : [...prev.targetGroups, group],
    }));
  };

  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "ended" | "scheduled">("all");

  const activePromos = promotions.filter((p) => p.status === "active");
  const totalImpressions = promotions.reduce((s, p) => s + (p.impressions || 0), 0);
  const totalRedemptions = promotions.reduce((s, p) => s + (p.redemptions || 0), 0);
  const totalClicks = promotions.reduce((s, p) => s + (p.clicks || 0), 0);

  const sortedPromos = [...promotions].sort((a, b) => {
    const order: Record<string, number> = { active: 0, scheduled: 1, draft: 2, ended: 3 };
    return (order[a.status || "draft"] ?? 4) - (order[b.status || "draft"] ?? 4);
  });
  const filteredPromos = statusFilter === "all" ? sortedPromos : sortedPromos.filter(p => p.status === statusFilter);

  const DISH_IMAGES: Record<string, string> = {
    discount: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop",
    bundle: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop",
    freeItem: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop",
    happyHour: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop",
  };

  if (!session || session.sessionType !== "owner") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400" data-testid="text-access-denied">This page is only accessible to restaurant owners.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="owner-promotions-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="w-5 h-5 text-[#FFCC02]" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800" data-testid="text-promotions-title">Promotions</h2>
            <p className="text-xs text-gray-400">Create deals to attract more diners</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#FFCC02] text-gray-900 text-sm font-medium rounded-xl px-4 py-2.5 hover:bg-[#FFCC02]/90 transition-colors flex items-center gap-1.5 shadow-sm"
          data-testid="button-create-promotion"
        >
          <Plus className="w-4 h-4" /> New Promotion
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="section-campaign-analytics">
        {[
          { label: "Total Impressions", value: totalImpressions.toLocaleString(), trend: promotions.length > 0 ? "+24%" : "—", icon: Eye },
          { label: "Active Promotions", value: activePromos.length.toString(), trend: `of ${promotions.length}`, icon: Megaphone },
          { label: "Total Redemptions", value: totalRedemptions.toLocaleString(), trend: promotions.length > 0 ? "+18%" : "—", icon: Target },
          { label: "Avg. CTR", value: totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(1)}%` : "0.0%", trend: promotions.length > 0 ? "+2.3%" : "—", icon: MousePointer },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`campaign-stat-${i}`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-[#00B14F]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-[11px] text-[#00B14F] font-medium mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-testid="section-campaign-insights">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-[3px] h-4 bg-[#00B14F] rounded-full" />
          <h3 className="text-[15px] font-semibold text-gray-800">Promotion Insights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-700">Promotion performance</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {promotions.length === 0
                ? "Create your first promotion to start attracting diners and tracking performance."
                : `You have ${activePromos.length} active promotion${activePromos.length !== 1 ? "s" : ""} running. Keep an eye on redemption rates.`}
            </p>
            <p className="text-[10px] text-[#00B14F] font-medium mt-1">
              {promotions.length === 0 ? "Tip: Discount deals perform best on weekdays" : "Recommended: Extend high-performing campaigns"}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-700">Best time for promotions: 6-8 PM</p>
            <p className="text-[11px] text-gray-500 mt-0.5">72% of promotion clicks happen during dinner hours. Consider scheduling happy hour deals.</p>
            <p className="text-[10px] text-[#00B14F] font-medium mt-1">Opportunity: Schedule promotions for peak dining hours</p>
          </div>
        </div>
      </div>

      {showCreate && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
          data-testid="form-create-promotion"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Create New Promotion</h3>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-close-create-form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. 20% Off All Mains"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F]"
                required
                data-testid="input-promo-title"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Deal Type</label>
              <select
                value={formData.dealType}
                onChange={(e) => setFormData((p) => ({ ...p, dealType: e.target.value as typeof formData.dealType }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F] bg-white"
                data-testid="select-deal-type"
              >
                <option value="discount">Discount</option>
                <option value="bundle">Bundle</option>
                <option value="freeItem">Free Item</option>
                <option value="happyHour">Happy Hour</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Deal Value</label>
              <input
                type="text"
                value={formData.dealValue}
                onChange={(e) => setFormData((p) => ({ ...p, dealValue: e.target.value }))}
                placeholder="e.g. 20% or ฿100 off"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F]"
                data-testid="input-deal-value"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F]"
                data-testid="input-start-date"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F]"
                data-testid="input-end-date"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Budget (฿)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData((p) => ({ ...p, budget: e.target.value }))}
                placeholder="e.g. 5000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00B14F]/30 focus:border-[#00B14F]"
                data-testid="input-budget"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Target Groups</label>
              <div className="flex flex-wrap gap-2">
                {["couples", "families", "students", "office_workers", "tourists", "foodies"].map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => toggleTargetGroup(group)}
                    className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                      formData.targetGroups.includes(group)
                        ? "bg-[#00B14F]/10 text-[#00B14F] border-[#00B14F]/30"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`button-target-${group}`}
                  >
                    {group.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-4 py-2"
              data-testid="button-cancel-promotion"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-[#00B14F] text-white text-sm font-medium rounded-xl px-5 py-2.5 hover:bg-[#00B14F]/90 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              data-testid="button-submit-promotion"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Create Promotion
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-testid="stat-active-promos">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#00B14F]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#00B14F]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{activePromos.length}</p>
          <p className="text-xs text-gray-400 mt-1">Running promotions</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-testid="stat-total-impressions">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--admin-blue-10)] flex items-center justify-center">
              <Eye className="w-4 h-4 text-[var(--admin-blue)]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Impressions</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalImpressions.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Total reach</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-testid="stat-total-redemptions">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFCC02]/15 flex items-center justify-center">
              <Target className="w-4 h-4 text-[#FFCC02]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Redemptions</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalRedemptions}</p>
          <p className="text-xs text-gray-400 mt-1">Deals redeemed</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap" data-testid="section-status-filter">
        {(["all", "active", "draft", "scheduled", "ended"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
              statusFilter === s
                ? (s === "active" ? "bg-[#00B14F]/10 text-[#00B14F] border-[#00B14F]/30"
                  : s === "draft" ? "bg-gray-100 text-gray-700 border-gray-200"
                  : s === "scheduled" ? "bg-[#FFCC02]/15 text-gray-700 border-[#FFCC02]/30"
                  : s === "ended" ? "bg-gray-100 text-gray-400 border-gray-200"
                  : "bg-[var(--admin-blue-10)] text-[var(--admin-blue)] border-[var(--admin-blue)]/20")
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
            data-testid={`filter-status-${s}`}
          >
            {s === "all" ? `All (${promotions.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${promotions.filter(p => p.status === s).length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-32 animate-pulse" />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center" data-testid="section-no-promotions">
          <Megaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">No promotions yet</p>
          <p className="text-xs text-gray-400 mt-1">Create your first promotion to start attracting more diners.</p>
        </div>
      ) : (
        <div className="space-y-4" data-testid="section-promotions-list">
          {filteredPromos.map((promo) => {
            const TypeIcon = typeIcons[promo.dealType] || Megaphone;
            const budgetPct = (promo.budget || 0) > 0 ? Math.round(((promo.spent || 0) / (promo.budget || 1)) * 100) : 0;
            const ctr = (promo.impressions || 0) > 0 ? (((promo.clicks || 0) / (promo.impressions || 1)) * 100).toFixed(1) : "0.0";
            const dishImg = DISH_IMAGES[promo.dealType] || DISH_IMAGES.discount;

            return (
              <div
                key={promo.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                data-testid={`promo-card-${promo.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <img src={dishImg} alt={promo.dealType} className="w-12 h-12 rounded-xl object-cover" data-testid={`img-dish-${promo.id}`} />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center ${typeColors[promo.dealType] || "bg-gray-100 text-gray-500"}`}>
                        <TypeIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-gray-800">{promo.title}</h4>
                        <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${statusColors[promo.status || "draft"] || "bg-gray-100 text-gray-500"}`}>
                          {promo.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{promo.startDate || "No start"} – {promo.endDate || "No end"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {promo.status === "draft" && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: promo.id, status: "active" })}
                        className="p-1.5 rounded-lg border border-gray-100 hover:bg-[#00B14F]/10 transition-colors"
                        title="Activate"
                        data-testid={`button-activate-${promo.id}`}
                      >
                        <Play className="w-3.5 h-3.5 text-[#00B14F]" />
                      </button>
                    )}
                    {promo.status === "active" && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: promo.id, status: "draft" })}
                        className="p-1.5 rounded-lg border border-gray-100 hover:bg-amber-50 transition-colors"
                        title="Pause"
                        data-testid={`button-pause-${promo.id}`}
                      >
                        <Pause className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(promo.id)}
                      className="p-1.5 rounded-lg border border-gray-100 hover:bg-red-50 transition-colors"
                      title="Delete"
                      data-testid={`button-delete-${promo.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Impressions</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{(promo.impressions || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Clicks</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{(promo.clicks || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">CTR</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{ctr}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Redeemed</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{promo.redemptions || 0}</p>
                  </div>
                </div>

                {(promo.budget || 0) > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Budget: ฿{(promo.spent || 0).toLocaleString()} / ฿{(promo.budget || 0).toLocaleString()}</span>
                      <span className="text-gray-500 font-medium">{budgetPct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all bg-[#FFCC02]"
                        style={{ width: `${Math.min(budgetPct, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
