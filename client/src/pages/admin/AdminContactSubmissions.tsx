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
import { Search, Download, Archive, ArchiveRestore, FileText, ExternalLink, X, MessageSquare } from "lucide-react";
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

export default function AdminContactSubmissions() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>(TABS[0]);
  const [filters, setFilters] = useState<Filters>({});
  const [searchInput, setSearchInput] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchInput || undefined })), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const url = buildQuery(activeTab, filters);
  const { data: rows = [], isLoading } = useQuery<ContactSubmission[]>({ queryKey: [url] });

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

  return (
    <div className="space-y-5" data-testid="admin-contact-submissions">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact & Partnerships</h2>
          <p className="text-sm text-gray-500">Inbound feedback, partnership leads, and partner submissions.</p>
        </div>
        <Button onClick={exportCsv} variant="outline" className="gap-2" data-testid="button-export-csv">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" data-testid="tabs">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              activeTab.key === tab.key ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
            }`}
            data-testid={`tab-${tab.key}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="Search name, email, phone, company, location, message…" className="pl-9 rounded-xl"
            data-testid="input-search" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <Select value={filters.status || "any"} onValueChange={v => setFilters(f => ({ ...f, status: v === "any" ? undefined : v }))}>
            <SelectTrigger className="rounded-xl" data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any status</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.priority || "any"} onValueChange={v => setFilters(f => ({ ...f, priority: v === "any" ? undefined : v }))}>
            <SelectTrigger className="rounded-xl" data-testid="filter-priority"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any priority</SelectItem>
              {PRIORITIES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.leadQuality || "any"} onValueChange={v => setFilters(f => ({ ...f, leadQuality: v === "any" ? undefined : v }))}>
            <SelectTrigger className="rounded-xl" data-testid="filter-lead-quality"><SelectValue placeholder="Lead quality" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any quality</SelectItem>
              {LEAD_QUALITIES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.hasFiles || "any"} onValueChange={v => setFilters(f => ({ ...f, hasFiles: v === "any" ? undefined : v }))}>
            <SelectTrigger className="rounded-xl" data-testid="filter-has-files"><SelectValue placeholder="Files" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="true">Has files</SelectItem>
              <SelectItem value="false">No files</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={() => { setFilters({}); setSearchInput(""); }} data-testid="button-clear-filters">Clear</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="submissions-table">
            <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Company</th>
                <th className="text-left px-4 py-3 font-semibold">Contact</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Priority</th>
                <th className="text-left px-4 py-3 font-semibold">Lead</th>
                <th className="text-right px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-50">
                  {Array.from({ length: 9 }).map((_, j) => <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>)}
                </tr>
              ))}
              {!isLoading && rows.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-sm" data-testid="empty-state">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No submissions match these filters.
                </td></tr>
              )}
              {!isLoading && rows.map(r => (
                <tr key={r.id} onClick={() => setOpenId(r.id)}
                  className="border-t border-gray-50 hover:bg-gray-50/80 cursor-pointer transition"
                  data-testid={`row-submission-${r.id}`}>
                  <td className="px-4 py-3 text-gray-500 text-[12px] whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-[12px]">{TYPE_LABELS[r.submissionType] || r.submissionType}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.companyName || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 text-[12px]">{r.email || r.lineId || r.phone || "—"}</td>
                  <td className="px-4 py-3"><Chip value={r.status || "new"} palette={STATUS_COLOR} /></td>
                  <td className="px-4 py-3"><Chip value={r.priority || "medium"} palette={PRIORITY_COLOR} /></td>
                  <td className="px-4 py-3"><Chip value={r.leadQuality || "unknown"} palette={LEAD_COLOR} /></td>
                  <td className="px-4 py-3 text-right"><span className="text-xs text-gray-400 hover:text-gray-700">View →</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={openId !== null} onOpenChange={o => !o && setOpenId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          {openId !== null && <SubmissionDetail id={openId} onClose={() => setOpenId(null)} listUrl={url} />}
        </SheetContent>
      </Sheet>
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
            <Input value={tagsInput} onChange={e => { setTagsInput(e.target.value); setDirty(true); }} className="mt-1.5 rounded-xl" data-testid="input-tags" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-gray-400">Internal notes</Label>
            <Textarea value={internalNotes} onChange={e => { setInternalNotes(e.target.value); setDirty(true); }} rows={4} className="mt-1.5 rounded-xl" data-testid="textarea-internal-notes" />
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
        <SelectTrigger className="mt-1.5 rounded-xl" data-testid={testid}><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o} value={o} className="capitalize">{o.replace(/_/g, " ")}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
