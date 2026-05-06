import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Download, Archive, ArchiveRestore, FileText, ExternalLink, X, MessageSquare,
  Inbox, AlertTriangle, Sparkles, TrendingUp, Heart, Building2, CalendarDays, Handshake,
  ChevronRight, Filter, Mail, Phone, Paperclip, Clock, Flame, CheckCircle2,
} from "lucide-react";
import type { ContactSubmission, ContactSubmissionFile, ContactSubmissionActivity } from "@shared/schema";

const TYPE_LABELS: Record<string, string> = {
  user_feedback: "User Feedback",
  restaurant_partner: "Restaurant / Food",
  event_activity_partner: "Events / Activities",
  general_partner: "Partnership",
};
const STATUSES = ["new","reviewing","contacted","qualified","not_a_fit","converted","archived"];
const PRIORITIES = ["low","medium","high","urgent"];
const LEAD_QUALITIES = ["unknown","low","medium","high","strategic"];

const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  contacted: "bg-violet-100 text-violet-700",
  qualified: "bg-emerald-100 text-emerald-700",
  not_a_fit: "bg-gray-100 text-gray-600",
  converted: "bg-[#00B14F]/15 text-[#00B14F]",
  archived: "bg-gray-100 text-gray-500",
};
const PRIORITY_COLOR: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};
const LEAD_COLOR: Record<string, string> = {
  unknown: "bg-gray-100 text-gray-500",
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-emerald-100 text-emerald-700",
  strategic: "bg-[#FFCC02]/30 text-amber-700",
};

function Chip({ value, palette, testid }: { value: string; palette: Record<string, string>; testid?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${palette[value] || "bg-gray-100 text-gray-600"}`} data-testid={testid}>
      {value.replace(/_/g, " ")}
    </span>
  );
}

const TABS: Array<{ key: string; label: string; submissionType?: string; archived?: boolean }> = [
  { key: "all", label: "All Submissions", archived: false },
  { key: "user_feedback", label: "User Feedback", submissionType: "user_feedback", archived: false },
  { key: "restaurant_partner", label: "Restaurant Partners", submissionType: "restaurant_partner", archived: false },
  { key: "event_activity_partner", label: "Events & Activities", submissionType: "event_activity_partner", archived: false },
  { key: "general_partner", label: "Other Partnerships", submissionType: "general_partner", archived: false },
  { key: "archived", label: "Archived", archived: true },
];

const TYPE_CARDS: Array<{
  key: string;
  label: string;
  sub: string;
  icon: any;
  accent: string;
  tint: string;
}> = [
  { key: "user_feedback", label: "User Feedback", sub: "Voices from Toasters", icon: Heart, accent: "var(--admin-pink)", tint: "var(--admin-pink-10)" },
  { key: "restaurant_partner", label: "Restaurant / Food", sub: "Wants to be on Toast", icon: Building2, accent: "var(--admin-teal)", tint: "var(--admin-teal-10)" },
  { key: "event_activity_partner", label: "Events & Activities", sub: "Pop-ups, festivals, fun", icon: CalendarDays, accent: "var(--admin-deep-purple)", tint: "var(--admin-deep-purple-10)" },
  { key: "general_partner", label: "Other Partnerships", sub: "Brands, sponsors, ideas", icon: Handshake, accent: "var(--admin-blue)", tint: "var(--admin-blue-10)" },
];

const PIPELINE_STAGES: Array<{ key: string; label: string; color: string }> = [
  { key: "new", label: "New", color: "#3B82F6" },
  { key: "reviewing", label: "Reviewing", color: "#F59E0B" },
  { key: "contacted", label: "Contacted", color: "#8B5CF6" },
  { key: "qualified", label: "Qualified", color: "#10B981" },
  { key: "converted", label: "Converted", color: "#00B14F" },
];

interface Filters {
  status?: string;
  priority?: string;
  leadQuality?: string;
  hasFiles?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildQuery(tab: typeof TABS[number], f: Filters): string {
  const params = new URLSearchParams();
  if (tab.submissionType) params.set("submissionType", tab.submissionType);
  if (typeof tab.archived === "boolean") params.set("archived", String(tab.archived));
  if (f.status) params.set("status", f.status);
  if (f.priority) params.set("priority", f.priority);
  if (f.leadQuality) params.set("leadQuality", f.leadQuality);
  if (f.hasFiles) params.set("hasFiles", f.hasFiles);
  if (f.search) params.set("search", f.search);
  if (f.dateFrom) params.set("dateFrom", f.dateFrom);
  if (f.dateTo) params.set("dateTo", f.dateTo);
  return `/api/admin/contact-submissions?${params.toString()}`;
}

function relTime(iso: string | Date): string {
  const t = typeof iso === "string" ? new Date(iso).getTime() : iso.getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(t).toLocaleDateString();
}

function initials(name?: string | null): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "??";
}

export default function AdminContactSubmissions() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>(TABS[0]);
  const [filters, setFilters] = useState<Filters>({});
  const [searchInput, setSearchInput] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchInput || undefined })), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const url = buildQuery(activeTab, filters);
  const { data: rows = [], isLoading } = useQuery<ContactSubmission[]>({ queryKey: [url] });

  // Stats query — fetch all non-archived for hero KPIs and type cards
  const { data: allRows = [] } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions?archived=false"],
  });

  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const newCount = allRows.filter(r => (r.status || "new") === "new").length;
    const urgentCount = allRows.filter(r => r.priority === "urgent" || r.priority === "high").length;
    const thisWeek = allRows.filter(r => new Date(r.createdAt).getTime() >= weekAgo).length;
    const today = allRows.filter(r => new Date(r.createdAt).getTime() >= todayStart.getTime()).length;
    const converted = allRows.filter(r => r.status === "converted" || r.status === "qualified").length;
    const conversionPct = allRows.length ? Math.round((converted / allRows.length) * 100) : 0;
    const byType: Record<string, { total: number; new: number; lastIso: string | null }> = {};
    for (const c of TYPE_CARDS) byType[c.key] = { total: 0, new: 0, lastIso: null };
    for (const r of allRows) {
      const b = byType[r.submissionType];
      if (!b) continue;
      b.total++;
      if ((r.status || "new") === "new") b.new++;
      const iso = typeof r.createdAt === "string" ? r.createdAt : new Date(r.createdAt as any).toISOString();
      if (!b.lastIso || iso > b.lastIso) b.lastIso = iso;
    }
    const pipeline: Record<string, number> = {};
    for (const s of PIPELINE_STAGES) pipeline[s.key] = 0;
    for (const r of allRows) {
      const s = (r.status || "new");
      if (pipeline[s] !== undefined) pipeline[s]++;
    }
    return { newCount, urgentCount, thisWeek, today, conversionPct, byType, pipeline, total: allRows.length };
  }, [allRows]);

  const exportCsv = () => {
    const exportUrl = url.replace("/api/admin/contact-submissions?", "/api/admin/contact-submissions/export.csv?");
    const adminToken = (() => {
      try {
        const raw = localStorage.getItem("toast_admin_session");
        if (!raw) return "";
        const s = JSON.parse(raw);
        return btoa(`${s.username}:${s._k || ""}`);
      } catch { return ""; }
    })();
    fetch(exportUrl, { headers: { "x-admin-token": adminToken } })
      .then(r => r.blob())
      .then(b => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `contact-submissions-${Date.now()}.csv`;
        a.click();
      });
  };

  const activeFilterCount = [filters.status, filters.priority, filters.leadQuality, filters.hasFiles, filters.dateFrom, filters.dateTo].filter(Boolean).length;

  const todayStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-5" data-testid="admin-contact-submissions">
      {/* === Light, warm hero === */}
      <div className="relative overflow-hidden rounded-3xl border border-[#FFCC02]/30" data-testid="hero-command-center"
        style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FFF7D6 55%, #FFF0B8 100%)" }}>
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle, #FFCC02 0%, transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-25 pointer-events-none" style={{ background: "radial-gradient(circle, #FFA500 0%, transparent 70%)" }} />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-white text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live inbox · {todayStr}
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Contact & Partnerships</h2>
              <p className="mt-1 text-sm text-gray-600 max-w-xl">Every voice, every lead, every knock on Toast's door — in one calm, focused workspace.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={exportCsv} className="gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white shadow-sm" data-testid="button-export-csv">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </div>

          {/* Soft KPI tiles inside hero */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SoftKpi icon={<Inbox className="w-4 h-4" />} label="New & Unread" value={stats.newCount} sub={`${stats.today} today`} accent="#2563EB" testid="kpi-new" />
            <SoftKpi icon={<AlertTriangle className="w-4 h-4" />} label="Needs Attention" value={stats.urgentCount} sub="High + urgent" accent="#DC2626" testid="kpi-urgent" />
            <SoftKpi icon={<Sparkles className="w-4 h-4" />} label="This Week" value={stats.thisWeek} sub={`${stats.total} all-time`} accent="#7C3AED" testid="kpi-week" />
            <SoftKpi icon={<TrendingUp className="w-4 h-4" />} label="Lead Conversion" value={`${stats.conversionPct}%`} sub="Qualified or better" accent="#059669" testid="kpi-conversion" />
          </div>
        </div>
      </div>

      {/* === Channel cards (redesigned, no stripe) === */}
      <div>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Inbound channels</p>
            <p className="text-sm font-semibold text-gray-800">Where today's submissions came from</p>
          </div>
          <span className="text-[11px] text-gray-400">{stats.total} total · click to filter</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {TYPE_CARDS.map(c => {
            const s = stats.byType[c.key];
            const isActive = activeTab.key === c.key;
            const Icon = c.icon;
            const sharePct = stats.total > 0 ? Math.round(((s?.total ?? 0) / stats.total) * 100) : 0;
            return (
              <button
                key={c.key}
                onClick={() => setActiveTab(TABS.find(t => t.key === c.key)!)}
                className={`group relative text-left bg-white rounded-2xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none ${
                  isActive ? "border-gray-900 shadow-md" : "border-gray-100 hover:border-gray-200"
                }`}
                data-testid={`type-card-${c.key}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ backgroundColor: c.tint, color: c.accent }}>
                    <Icon className="w-5 h-5" strokeWidth={2.25} />
                  </div>
                  {s?.new > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: c.tint, color: c.accent }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: c.accent }} />
                      {s.new} new
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-gray-300">All caught up</span>
                  )}
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{c.sub}</p>
                <p className="text-base font-semibold text-gray-900 mt-0.5">{c.label}</p>

                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 leading-none tabular-nums">{s?.total ?? 0}</span>
                  <span className="text-[11px] text-gray-400">submissions</span>
                </div>

                {/* share bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{sharePct}% of inbox</span>
                    <span>{s?.lastIso ? relTime(s.lastIso) : "—"}</span>
                  </div>
                  <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sharePct}%`, backgroundColor: c.accent }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === Lead funnel (true proportional funnel) === */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" data-testid="pipeline-strip">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Lead funnel</p>
            <p className="text-sm font-semibold text-gray-800">From new submission to converted partner</p>
          </div>
          <button onClick={() => { setFilters({}); setSearchInput(""); setActiveTab(TABS[0]); }} className="text-[11px] font-medium text-gray-400 hover:text-gray-700" data-testid="button-reset-pipeline">
            Show all →
          </button>
        </div>

        {/* Proportional funnel bar */}
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-50 mb-4">
          {PIPELINE_STAGES.map((s, i) => {
            const count = stats.pipeline[s.key] || 0;
            const total = PIPELINE_STAGES.reduce((acc, p) => acc + (stats.pipeline[p.key] || 0), 0) || 1;
            const flex = Math.max(count / total, count > 0 ? 0.04 : 0);
            return (
              <div key={s.key}
                className={`transition-all ${i === 0 ? "" : "ml-0.5"}`}
                style={{ flex: `${flex} 1 0`, backgroundColor: count > 0 ? s.color : "#e5e7eb", opacity: count > 0 ? 1 : 0.4 }}
                title={`${s.label}: ${count}`} />
            );
          })}
        </div>

        {/* Stage cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PIPELINE_STAGES.map((s, i) => {
            const count = stats.pipeline[s.key] || 0;
            const isActive = filters.status === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setFilters(f => ({ ...f, status: f.status === s.key ? undefined : s.key }))}
                className={`group rounded-xl px-3 py-2.5 text-left transition-all border ${
                  isActive ? "border-transparent" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/60"
                }`}
                style={isActive ? { backgroundColor: `${s.color}10`, borderColor: `${s.color}40` } : undefined}
                data-testid={`pipeline-stage-${s.key}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stage {i + 1}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-sm font-semibold text-gray-800">{s.label}</span>
                  <span className="text-lg font-bold tabular-nums" style={{ color: count > 0 ? s.color : "#d1d5db" }}>{count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1" data-testid="tabs">
          {TABS.map(tab => {
            const isAll = tab.key === "all";
            const isArchived = tab.key === "archived";
            const count = isAll ? stats.total : isArchived ? undefined : stats.byType[tab.key]?.total ?? 0;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab.key === tab.key ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
                }`}
                data-testid={`tab-${tab.key}`}>
                {tab.label}
                {count !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab.key === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowFilters(s => !s)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition ${
            showFilters || activeFilterCount > 0 ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
          }`}
          data-testid="button-toggle-filters"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FFCC02] text-gray-900">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Search + Filters (collapsible) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="Search name, email, phone, company, location, message…" className="pl-9 rounded-xl"
            data-testid="input-search" />
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <Select value={filters.status || "any"} onValueChange={v => setFilters(f => ({ ...f, status: v === "any" ? undefined : v }))}>
              <SelectTrigger className="rounded-xl bg-white border-gray-200" data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any status</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.priority || "any"} onValueChange={v => setFilters(f => ({ ...f, priority: v === "any" ? undefined : v }))}>
              <SelectTrigger className="rounded-xl bg-white border-gray-200" data-testid="filter-priority"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any priority</SelectItem>
                {PRIORITIES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.leadQuality || "any"} onValueChange={v => setFilters(f => ({ ...f, leadQuality: v === "any" ? undefined : v }))}>
              <SelectTrigger className="rounded-xl bg-white border-gray-200" data-testid="filter-lead-quality"><SelectValue placeholder="Lead quality" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any quality</SelectItem>
                {LEAD_QUALITIES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.hasFiles || "any"} onValueChange={v => setFilters(f => ({ ...f, hasFiles: v === "any" ? undefined : v }))}>
              <SelectTrigger className="rounded-xl bg-white border-gray-200" data-testid="filter-has-files"><SelectValue placeholder="Files" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="true">Has files</SelectItem>
                <SelectItem value="false">No files</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => { setFilters({}); setSearchInput(""); }} data-testid="button-clear-filters">Clear</Button>
          </div>
        )}
      </div>

      {/* Submission list */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden" data-testid="submissions-list">
        {/* List header — gives the eye an anchor */}
        {!isLoading && rows.length > 0 && (
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{activeTab.label}</span>
              <span className="text-xs text-gray-400">· {rows.length} {rows.length === 1 ? "submission" : "submissions"}</span>
            </div>
            <span className="text-[11px] text-gray-400 hidden sm:block">Newest first · click any row to open</span>
          </div>
        )}

        {isLoading && (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-2/3" /></div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && rows.length === 0 && (
          <div className="px-4 py-16 text-center" data-testid="empty-state">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-600">Nothing here yet</p>
            <p className="text-xs text-gray-400 mt-1">No submissions match these filters.</p>
          </div>
        )}
        {!isLoading && rows.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {rows.map((r, idx) => {
              const card = TYPE_CARDS.find(c => c.key === r.submissionType);
              const isNew = (r.status || "new") === "new";
              const hasFiles = !!(r as any).hasFiles;
              const status = r.status || "new";
              const priority = r.priority || "medium";

              // Inline date marker — only when day changes
              const t = new Date(r.createdAt as any);
              const prevT = idx > 0 ? new Date(rows[idx - 1].createdAt as any) : null;
              const sameDay = prevT && prevT.toDateString() === t.toDateString();
              const dayLabel = (() => {
                const today = new Date(); today.setHours(0,0,0,0);
                const yesterday = new Date(today.getTime() - 86400000);
                const d = new Date(t); d.setHours(0,0,0,0);
                if (d.getTime() === today.getTime()) return "Today";
                if (d.getTime() === yesterday.getTime()) return "Yesterday";
                return t.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
              })();

              // Headline: what this person actually wants — message > company > fallback
              const messagePreview = (r.message || "").trim();
              const subjectLine = messagePreview
                || (r.companyName ? `Inquiry from ${r.companyName}` : `New ${card?.label.toLowerCase() || "submission"}`);

              return (
                <li key={r.id}>
                  {!sameDay && (
                    <div className="px-5 pt-4 pb-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{dayLabel}</span>
                      <span className="flex-1 h-px bg-gray-100" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenId(r.id)}
                    className="group w-full text-left px-5 py-4 hover:bg-amber-50/30 transition-colors flex items-start gap-4 focus:outline-none focus:bg-amber-50/40"
                    data-testid={`row-submission-${r.id}`}
                  >
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: card?.tint || "#f3f4f6", color: card?.accent || "#6b7280" }}>
                      {initials(r.name)}
                      {isNew && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white" aria-label="new" />}
                    </div>

                    {/* Content — clear two-line hierarchy */}
                    <div className="flex-1 min-w-0">
                      {/* Line 1: Name + type */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-semibold text-gray-900 truncate">{r.name || "Anonymous"}</span>
                        {card && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                            style={{ backgroundColor: card.tint, color: card.accent }}>
                            {card.label}
                          </span>
                        )}
                        {priority === "urgent" && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                            <Flame className="w-3 h-3" /> URGENT
                          </span>
                        )}
                        <span className="ml-auto text-[11px] text-gray-400 inline-flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3" /> {relTime(r.createdAt as any)}
                        </span>
                      </div>

                      {/* Line 2: What they want (the most important info) */}
                      <p className="mt-1 text-sm text-gray-700 line-clamp-1" title={messagePreview || subjectLine}>
                        {subjectLine}
                      </p>

                      {/* Line 3: Contact + meta */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                        {r.companyName && messagePreview && (
                          <span className="inline-flex items-center gap-1 text-gray-500"><Building2 className="w-3 h-3" />{r.companyName}</span>
                        )}
                        {r.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</span>}
                        {!r.email && r.lineId && <span className="inline-flex items-center gap-1">@{r.lineId}</span>}
                        {!r.email && !r.lineId && r.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>}
                        {hasFiles && <span className="inline-flex items-center gap-1 text-gray-400"><Paperclip className="w-3 h-3" />Attached</span>}
                        {/* Status + priority chips inline on mobile */}
                        <span className="ml-auto flex items-center gap-1.5">
                          <Chip value={status} palette={STATUS_COLOR} />
                          {priority !== "medium" && priority !== "urgent" && <Chip value={priority} palette={PRIORITY_COLOR} />}
                          {r.leadQuality && r.leadQuality !== "unknown" && <Chip value={r.leadQuality} palette={LEAD_COLOR} />}
                        </span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition flex-shrink-0 mt-1" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Sheet open={openId !== null} onOpenChange={o => !o && setOpenId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          {openId !== null && <SubmissionDetail id={openId} onClose={() => setOpenId(null)} listUrl={url} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SoftKpi({ icon, label, value, accent, sub, testid }: {
  icon: React.ReactNode; label: string; value: string | number; accent: string; sub?: string; testid?: string;
}) {
  return (
    <div className="relative rounded-2xl bg-white/85 backdrop-blur-sm border border-white p-4 transition-all hover:bg-white hover:shadow-md shadow-sm" data-testid={testid}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}15`, color: accent }}>
          {icon}
        </div>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

interface DetailResponse { submission: ContactSubmission; files: ContactSubmissionFile[]; activity: ContactSubmissionActivity[] }

function SubmissionDetail({ id, onClose, listUrl }: { id: number; onClose: () => void; listUrl: string }) {
  const { data, isLoading } = useQuery<DetailResponse>({ queryKey: [`/api/admin/contact-submissions/${id}`] });
  const sub = data?.submission;

  const [status, setStatus] = useState<string | undefined>();
  const [priority, setPriority] = useState<string | undefined>();
  const [leadQuality, setLeadQuality] = useState<string | undefined>();
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (sub) {
      setStatus(sub.status || "new");
      setPriority(sub.priority || "medium");
      setLeadQuality(sub.leadQuality || "unknown");
      setInternalNotes(sub.internalNotes || "");
      setTagsInput((sub.tags || []).join(", "));
      setDirty(false);
    }
  }, [sub?.id]);

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => apiRequest("PATCH", `/api/admin/contact-submissions/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/contact-submissions/${id}`] });
      queryClient.invalidateQueries({ queryKey: [listUrl] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions/badge"] });
      setDirty(false);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => apiRequest("POST", `/api/admin/contact-submissions/${id}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/contact-submissions/${id}`] });
      queryClient.invalidateQueries({ queryKey: [listUrl] });
      onClose();
    },
  });
  const unarchiveMutation = useMutation({
    mutationFn: async () => apiRequest("POST", `/api/admin/contact-submissions/${id}/unarchive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/contact-submissions/${id}`] });
      queryClient.invalidateQueries({ queryKey: [listUrl] });
    },
  });

  const save = () => {
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    updateMutation.mutate({ status, priority, leadQuality, internalNotes: internalNotes || null, tags });
  };

  if (isLoading || !sub) {
    return <div className="p-8 space-y-3"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-32 w-full" /></div>;
  }

  const meta = (sub.metadata || {}) as Record<string, any>;
  const isFeedback = sub.submissionType === "user_feedback";
  const isArchived = !!sub.archivedAt;

  return (
    <div className="flex flex-col h-full" data-testid="submission-detail">
      <SheetHeader className="px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <div>
            <SheetTitle className="text-lg" data-testid="text-detail-title">{sub.name || "Anonymous"}</SheetTitle>
            <div className="flex items-center gap-2 mt-1.5">
              <Chip value={sub.submissionType} palette={{}} testid="chip-type" />
              <Chip value={sub.status || "new"} palette={STATUS_COLOR} testid="chip-status" />
              <Chip value={sub.priority || "medium"} palette={PRIORITY_COLOR} testid="chip-priority" />
              <Chip value={sub.leadQuality || "unknown"} palette={LEAD_COLOR} testid="chip-lead" />
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" data-testid="button-close-detail"><X className="w-5 h-5" /></button>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
        {/* Section 1: Contact Info */}
        <Section title="Contact Info">
          <Row label="Name" value={sub.name} />
          <Row label="Email" value={sub.email} />
          <Row label="Phone" value={sub.phone} />
          <Row label="LINE / WhatsApp" value={sub.lineId} />
          <Row label="Preferred contact method" value={sub.preferredContactMethod} />
        </Section>

        {/* Section 2: Submission Info */}
        <Section title="Submission Info">
          <Row label="Type" value={TYPE_LABELS[sub.submissionType]} />
          <Row label="Business / event / company" value={sub.companyName} />
          <Row label="Role / title" value={sub.roleTitle} />
          <Row label="Business type" value={sub.businessType} />
          <Row label="Location" value={sub.location} />
          <Row label="Website" value={sub.websiteUrl} link />
          <Row label="Instagram" value={sub.instagramUrl} link />
          <Row label="Google Maps" value={sub.googleMapsUrl} link />
          <Row label="Interest" value={(sub.interestType || []).join(", ")} />
          <Row label="Message" value={sub.message} multiline />
          <Row label="Submitted" value={new Date(sub.createdAt).toLocaleString()} />
        </Section>

        {/* Special: User Insight Summary */}
        {isFeedback && (
          <Section title="User Insight Summary">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Overall satisfaction" value={meta.overall_satisfaction_score} suffix="/10" />
              <Stat label="Ease of use" value={meta.ease_of_use_score} suffix="/10" />
              <Stat label="Would use again" value={meta.would_use_again} />
              <Stat label="Would recommend" value={meta.would_recommend_to_friends} />
              <Stat label="Recommendation relevance" value={meta.recommendation_relevance} />
              <Stat label="Helped make decision" value={meta.helped_make_decision} />
              <Stat label="Helped find new restaurants" value={meta.helped_find_new_restaurants} />
              <Stat label="Decision time" value={meta.decision_time} />
            </div>
            <Row label="Top 2 liked" value={meta.top_two_liked} multiline />
            <Row label="Top 2 to improve" value={meta.top_two_to_improve} multiline />
            <Row label="Favorite part" value={meta.favorite_part} multiline />
            <Row label="Visual feedback" value={meta.visual_feedback} multiline />
            <Row label="Suggestions" value={meta.suggestions} multiline />
            <Row label="Quote permission" value={meta.quote_permission} />
            {meta.quote_1 && <Row label="Quote 1" value={meta.quote_1} multiline />}
            {meta.quote_2 && <Row label="Quote 2" value={meta.quote_2} multiline />}
            {meta.quote_3 && <Row label="Quote 3" value={meta.quote_3} multiline />}
          </Section>
        )}
        {!isFeedback && Object.keys(meta).length > 0 && (
          <Section title="Lead details">
            {Object.entries(meta).map(([k, v]) => <Row key={k} label={k.replace(/_/g, " ")} value={v} />)}
          </Section>
        )}

        {/* Files */}
        {data && data.files.length > 0 && (
          <Section title={`Files (${data.files.length})`}>
            <ul className="space-y-1.5">
              {data.files.map(f => (
                <li key={f.id}>
                  <a href={f.fileUrl} download={f.fileName} target="_blank" rel="noreferrer"
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                    data-testid={`file-${f.id}`}>
                    <span className="flex items-center gap-2 text-sm text-gray-700 truncate">
                      <FileText className="w-4 h-4 text-gray-400" /> {f.fileName}
                    </span>
                    <span className="text-xs text-gray-400">{f.fileSize ? `${Math.round(f.fileSize/1024)} KB` : ""}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Section 3: Internal Controls */}
        <Section title="Internal Controls">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ControlSelect label="Status" value={status || ""} onChange={v => { setStatus(v); setDirty(true); }} options={STATUSES} testid="control-status" />
            <ControlSelect label="Priority" value={priority || ""} onChange={v => { setPriority(v); setDirty(true); }} options={PRIORITIES} testid="control-priority" />
            <ControlSelect label="Lead quality" value={leadQuality || ""} onChange={v => { setLeadQuality(v); setDirty(true); }} options={LEAD_QUALITIES} testid="control-lead-quality" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-gray-400">Tags (comma separated)</Label>
            <Input value={tagsInput} onChange={e => { setTagsInput(e.target.value); setDirty(true); }} className="mt-1.5 rounded-xl bg-white border-gray-200" data-testid="input-tags" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-gray-400">Internal notes</Label>
            <Textarea value={internalNotes} onChange={e => { setInternalNotes(e.target.value); setDirty(true); }} rows={4} className="mt-1.5 rounded-xl bg-white border-gray-200" data-testid="textarea-internal-notes" />
          </div>
        </Section>

        {/* Section 4: Activity */}
        <Section title="Activity Log">
          {data && data.activity.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
          <ul className="space-y-2">
            {data?.activity.map(a => (
              <li key={a.id} className="flex items-start gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                <div>
                  <div className="text-gray-700 font-medium">{a.actionType.replace(/_/g, " ")}</div>
                  {(a.oldValue || a.newValue) && (
                    <div className="text-gray-400">{a.oldValue || "—"} → <span className="text-gray-700">{a.newValue || "—"}</span></div>
                  )}
                  {a.note && <div className="text-gray-500">{a.note}</div>}
                  <div className="text-gray-400 text-[11px]">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="sticky bottom-0 px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-2">
        {isArchived ? (
          <Button variant="outline" onClick={() => unarchiveMutation.mutate()} className="gap-2" data-testid="button-unarchive">
            <ArchiveRestore className="w-4 h-4" /> Unarchive
          </Button>
        ) : (
          <Button variant="outline" onClick={() => archiveMutation.mutate()} className="gap-2" data-testid="button-archive">
            <Archive className="w-4 h-4" /> Archive
          </Button>
        )}
        <Button onClick={save} disabled={!dirty || updateMutation.isPending}
          className="bg-[#FFCC02] hover:bg-[#FFD633] text-gray-900 font-semibold" data-testid="button-save">
          {updateMutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5" data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400">{title}</h3>
      <div className="space-y-2.5 bg-gray-50 rounded-2xl p-4">{children}</div>
    </section>
  );
}

function Row({ label, value, link, multiline }: { label: string; value: any; link?: boolean; multiline?: boolean }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm">
      <span className="w-44 shrink-0 text-gray-500 capitalize">{label}</span>
      {link ? (
        <a href={String(value)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate flex items-center gap-1">
          {String(value)} <ExternalLink className="w-3 h-3" />
        </a>
      ) : multiline ? (
        <span className="text-gray-800 whitespace-pre-wrap flex-1">{String(value)}</span>
      ) : (
        <span className="text-gray-800 flex-1 break-words">{String(value)}</span>
      )}
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: any; suffix?: string }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="bg-white rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</div>
      <div className="text-base font-semibold text-gray-900 mt-0.5 capitalize">{String(value)}{suffix}</div>
    </div>
  );
}

function ControlSelect({ label, value, onChange, options, testid }: { label: string; value: string; onChange: (v: string) => void; options: string[]; testid: string }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-gray-400">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5 rounded-xl bg-white border-gray-200 capitalize" data-testid={testid}><SelectValue /></SelectTrigger>
        <SelectContent className="bg-white">
          {options.map(o => <SelectItem key={o} value={o} className="capitalize">{o.replace(/_/g, " ")}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
