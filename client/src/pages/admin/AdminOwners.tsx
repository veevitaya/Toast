import { useState } from "react";
import {
  Store, ShieldCheck, Clock, AlertCircle, Search, ChevronRight,
  TrendingUp, Users, CheckCircle, XCircle, Eye, FileText, X, Pencil, Mail, Link2, Loader2
} from "lucide-react";
import { getTintVar } from "./adminUtils";
import { useToast } from "@/hooks/use-toast";

const OWNER_KPIS = [
  { label: "Total Owners", value: "48", trend: "+6", up: true, icon: Store, color: "var(--admin-deep-purple)" },
  { label: "Verified", value: "32", trend: "+4", up: true, icon: ShieldCheck, color: "var(--admin-cyan)" },
  { label: "Pending Claims", value: "8", trend: "—", up: true, icon: Clock, color: "var(--admin-teal)" },
  { label: "Active This Week", value: "28", trend: "+3", up: true, icon: TrendingUp, color: "var(--admin-blue)" },
];

const MOCK_OWNERS_INIT = [
  { id: 1, name: "Jay Fai", email: "owner@toastbkk.com", restaurant: "Jay Fai", status: "verified" as const, tier: "Premium", lastActive: "2h ago", restaurants: 1, phone: "+66 81 xxx xxxx", lineId: "jayfai_bkk", joinedDate: "Jan 15, 2026" },
  { id: 2, name: "Somchai K.", email: "somchai@email.com", restaurant: "Som Tam Nua", status: "verified" as const, tier: "Basic", lastActive: "1d ago", restaurants: 1, phone: "+66 82 xxx xxxx", lineId: "somchai_k", joinedDate: "Feb 1, 2026" },
  { id: 3, name: "Nattaya P.", email: "nattaya@email.com", restaurant: "Bo.Lan", status: "pending" as const, tier: "Free", lastActive: "3d ago", restaurants: 1, phone: "+66 83 xxx xxxx", lineId: "", joinedDate: "Mar 1, 2026" },
  { id: 4, name: "Marcus W.", email: "marcus@email.com", restaurant: "Paste Bangkok", status: "verified" as const, tier: "Premium", lastActive: "5h ago", restaurants: 2, phone: "+66 84 xxx xxxx", lineId: "marcus_w", joinedDate: "Dec 10, 2025" },
  { id: 5, name: "Arunee S.", email: "arunee@email.com", restaurant: "Sorn", status: "pending" as const, tier: "Free", lastActive: "1w ago", restaurants: 1, phone: "+66 85 xxx xxxx", lineId: "", joinedDate: "Mar 5, 2026" },
  { id: 6, name: "Chen W.", email: "chen@email.com", restaurant: "Gaggan Anand", status: "verified" as const, tier: "Enterprise", lastActive: "1h ago", restaurants: 3, phone: "+66 86 xxx xxxx", lineId: "chen_gaggan", joinedDate: "Nov 20, 2025" },
  { id: 7, name: "Pim T.", email: "pim@email.com", restaurant: "Raan Jay Fai", status: "rejected" as const, tier: "Free", lastActive: "2w ago", restaurants: 0, phone: "+66 87 xxx xxxx", lineId: "pim_t", joinedDate: "Feb 20, 2026" },
];

const SUBSCRIPTION_BREAKDOWN = [
  { tier: "Free", count: 18, color: "var(--admin-deep-purple)", pct: 37 },
  { tier: "Basic", count: 14, color: "var(--admin-blue)", pct: 29 },
  { tier: "Premium", count: 12, color: "var(--admin-teal)", pct: 25 },
  { tier: "Enterprise", count: 4, color: "var(--admin-cyan)", pct: 9 },
];

type OwnerStatus = "verified" | "pending" | "rejected";

export default function AdminOwners() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [owners, setOwners] = useState(MOCK_OWNERS_INIT);
  const [reviewOwner, setReviewOwner] = useState<typeof MOCK_OWNERS_INIT[0] | null>(null);
  const [detailOwner, setDetailOwner] = useState<typeof MOCK_OWNERS_INIT[0] | null>(null);
  const [editingOwner, setEditingOwner] = useState<typeof MOCK_OWNERS_INIT[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", tier: "", phone: "" });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const filtered = owners.filter(o => {
    const matchSearch = !searchQuery || o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleReviewAction = (action: "approve" | "reject") => {
    if (!reviewOwner) return;
    setProcessing(true);
    setTimeout(() => {
      setOwners(prev => prev.map(o =>
        o.id === reviewOwner.id ? { ...o, status: (action === "approve" ? "verified" : "rejected") as OwnerStatus } : o
      ));
      toast({
        title: action === "approve" ? "Owner Verified" : "Claim Rejected",
        description: `${reviewOwner.name}'s claim for ${reviewOwner.restaurant} has been ${action === "approve" ? "approved" : "rejected"}`
      });
      setReviewOwner(null);
      setProcessing(false);
    }, 1000);
  };

  const openEdit = (owner: typeof MOCK_OWNERS_INIT[0]) => {
    setEditingOwner(owner);
    setEditForm({ name: owner.name, email: owner.email, tier: owner.tier, phone: owner.phone });
  };

  const handleSaveEdit = () => {
    if (!editingOwner) return;
    setOwners(prev => prev.map(o =>
      o.id === editingOwner.id ? { ...o, name: editForm.name, email: editForm.email, tier: editForm.tier, phone: editForm.phone } : o
    ));
    toast({ title: "Owner Updated", description: `${editForm.name}'s profile has been updated` });
    setEditingOwner(null);
  };

  return (
    <div className="space-y-8" data-testid="admin-owners-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5" style={{ color: "var(--admin-deep-purple)" }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Owners</h2>
            <p className="text-xs text-muted-foreground">Restaurant owner accounts, claims, and verification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {OWNER_KPIS.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-[3px]" style={{ backgroundColor: kpi.color }} />
            <div className="p-4 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: getTintVar(kpi.color) }}>
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
              <span className="text-[11px] font-medium text-emerald-600">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-owner-list">
          <div className="flex items-center justify-between mb-5">
            <div className="border-l-[3px] pl-3" style={{ borderColor: "var(--admin-deep-purple)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Owner Accounts</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Manage & verify</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-48 focus:outline-none focus:ring-2 focus:ring-purple-100" data-testid="input-search-owners" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none" data-testid="select-status-filter">
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map(o => (
              <div key={o.id}
                onClick={() => setDetailOwner(o)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
                data-testid={`owner-row-${o.id}`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold" style={{
                  backgroundColor: o.status === "verified" ? "rgba(16, 185, 129, 0.1)" : o.status === "pending" ? "rgba(245, 158, 11, 0.1)" : "rgba(244, 63, 94, 0.1)",
                  color: o.status === "verified" ? "#10B981" : o.status === "pending" ? "#F59E0B" : "#F43F5E",
                }}>
                  {o.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{o.name}</span>
                    {o.status === "verified" && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <span className="text-[11px] text-gray-400">{o.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-600">{o.restaurant}</span>
                  {o.restaurants > 1 && <span className="text-[10px] text-gray-400 ml-1">+{o.restaurants - 1}</span>}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  o.status === "verified" ? "bg-emerald-50 text-emerald-700" : o.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
                }`}>{o.status}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  o.tier === "Enterprise" ? "bg-purple-50 text-purple-700" : o.tier === "Premium" ? "bg-blue-50 text-blue-700" : o.tier === "Basic" ? "bg-gray-100 text-gray-600" : "bg-gray-50 text-gray-400"
                }`}>{o.tier}</span>
                <span className="text-[10px] text-gray-400 w-14 text-right">{o.lastActive}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-subscription-breakdown">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-teal)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Subscriptions</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Plan distribution</p>
            </div>
            <div className="space-y-3">
              {SUBSCRIPTION_BREAKDOWN.map(s => (
                <div key={s.tier} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-gray-600 font-medium">{s.tier}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-gray-700">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-verification-queue">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-pink)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Verification Queue</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Awaiting review</p>
            </div>
            <div className="space-y-2">
              {owners.filter(o => o.status === "pending").map(o => (
                <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100/50">
                  <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-gray-800">{o.name}</span>
                    <p className="text-[10px] text-gray-400 truncate">{o.restaurant}</p>
                  </div>
                  <button
                    onClick={() => setReviewOwner(o)}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    data-testid={`btn-review-${o.id}`}
                  >
                    Review
                  </button>
                </div>
              ))}
              {owners.filter(o => o.status === "pending").length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">All claims reviewed</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {reviewOwner && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6" data-testid="review-dialog">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">Review Ownership Claim</h3>
              </div>
              <button onClick={() => setReviewOwner(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200" data-testid="btn-close-review">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">{reviewOwner.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{reviewOwner.name}</p>
                  <p className="text-xs text-gray-400">{reviewOwner.email}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Claiming Restaurant</p>
                <p className="text-sm font-medium text-gray-800">{reviewOwner.restaurant}</p>
                <p className="text-xs text-gray-400 mt-1">Submitted: {reviewOwner.joinedDate}</p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Info</p>
                <p className="text-xs text-gray-600">{reviewOwner.phone}</p>
                {reviewOwner.lineId && <p className="text-xs text-gray-600 mt-1">LINE: @{reviewOwner.lineId}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setReviewOwner(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 rounded-lg" data-testid="btn-cancel-review">Cancel</button>
              <button
                onClick={() => handleReviewAction("reject")}
                disabled={processing}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                data-testid="btn-reject-claim"
              >
                {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                Reject
              </button>
              <button
                onClick={() => handleReviewAction("approve")}
                disabled={processing}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                data-testid="btn-approve-claim"
              >
                {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {detailOwner && !reviewOwner && !editingOwner && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6" data-testid="owner-detail-modal">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold" style={{
                  backgroundColor: detailOwner.status === "verified" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                  color: detailOwner.status === "verified" ? "#10B981" : "#F59E0B",
                }}>{detailOwner.name.charAt(0)}</div>
                <h3 className="text-sm font-semibold text-gray-800">{detailOwner.name}</h3>
              </div>
              <button onClick={() => setDetailOwner(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200" data-testid="btn-close-detail">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p><p className="text-xs text-gray-700">{detailOwner.email}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p><p className="text-xs text-gray-700">{detailOwner.phone}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p><span className={`text-xs font-medium ${detailOwner.status === "verified" ? "text-emerald-600" : detailOwner.status === "pending" ? "text-amber-600" : "text-red-500"}`}>{detailOwner.status}</span></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tier</p><p className="text-xs text-gray-700">{detailOwner.tier}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Restaurant</p><p className="text-xs text-gray-700">{detailOwner.restaurant}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">LINE ID</p><p className="text-xs text-gray-700">{detailOwner.lineId || "Not linked"}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Joined</p><p className="text-xs text-gray-700">{detailOwner.joinedDate}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Active</p><p className="text-xs text-gray-700">{detailOwner.lastActive}</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => { setDetailOwner(null); openEdit(detailOwner); }} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg bg-white border border-gray-200" data-testid="btn-edit-owner">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => setDetailOwner(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 rounded-lg" data-testid="btn-close-detail-bottom">Close</button>
            </div>
          </div>
        </div>
      )}

      {editingOwner && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6" data-testid="edit-owner-dialog">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Edit Owner Profile</h3>
              <button onClick={() => setEditingOwner(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200" data-testid="btn-close-edit">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className="text-xs font-medium text-gray-500 block mb-1">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100" data-testid="input-edit-name" /></div>
              <div><label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100" data-testid="input-edit-email" /></div>
              <div><label className="text-xs font-medium text-gray-500 block mb-1">Phone</label>
                <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100" data-testid="input-edit-phone" /></div>
              <div><label className="text-xs font-medium text-gray-500 block mb-1">Tier</label>
                <select value={editForm.tier} onChange={e => setEditForm({ ...editForm, tier: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" data-testid="select-edit-tier">
                  <option value="Free">Free</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select></div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setEditingOwner(null)} className="px-4 py-2 text-sm text-gray-500 rounded-lg" data-testid="btn-cancel-edit">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-semibold bg-[var(--admin-deep-purple)] text-white rounded-lg hover:opacity-90" data-testid="btn-save-edit">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
