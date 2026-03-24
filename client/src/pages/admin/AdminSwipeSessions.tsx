import { useState } from "react";
import {
  Repeat, TrendingUp, TrendingDown, Clock, Users, Target,
  ArrowRight, Filter, ChevronDown, Zap, MousePointer, Eye,
  ExternalLink, BarChart3
} from "lucide-react";
import { getTintVar } from "./adminUtils";

type DateRange = "7d" | "30d" | "all";

const SESSION_FUNNEL = [
  { label: "App Opens", value: 18400, pct: 100, bg: "rgba(139, 92, 246, 0.12)", textClass: "text-gray-700" },
  { label: "Browse / Search", value: 14200, pct: 77, bg: "rgba(139, 92, 246, 0.22)", textClass: "text-gray-800" },
  { label: "Swipe Session Started", value: 8200, pct: 45, bg: "rgba(139, 92, 246, 0.40)", textClass: "text-white" },
  { label: "Match Reached", value: 3100, pct: 17, bg: "rgba(139, 92, 246, 0.65)", textClass: "text-white" },
  { label: "Restaurant Detail Viewed", value: 1800, pct: 10, bg: "rgba(139, 92, 246, 0.82)", textClass: "text-white" },
  { label: "Outbound Click to Partner", value: 420, pct: 2.3, bg: "rgba(139, 92, 246, 1)", textClass: "text-white" },
];

const DAILY_SESSIONS = [
  { day: "Mon", sessions: 1120 }, { day: "Tue", sessions: 1340 },
  { day: "Wed", sessions: 1180 }, { day: "Thu", sessions: 1460 },
  { day: "Fri", sessions: 1890 }, { day: "Sat", sessions: 2210 },
  { day: "Sun", sessions: 1950 },
];

const ENTRY_SOURCES = [
  { source: "Home Feed", pct: 42, color: "var(--admin-deep-purple)" },
  { source: "Trending", pct: 24, color: "var(--admin-pink)" },
  { source: "Search", pct: 18, color: "var(--admin-blue)" },
  { source: "Group Invite", pct: 10, color: "var(--admin-cyan)" },
  { source: "Push Notification", pct: 6, color: "var(--admin-teal)" },
];

const RECENT_SESSIONS = [
  { id: "S-4821", user: "guest_fpqruecc", type: "Solo", swipes: 12, matched: true, duration: "2m 14s", clickout: true, time: "2h ago" },
  { id: "S-4820", user: "guest_xfa13485", type: "Solo", swipes: 8, matched: true, duration: "1m 48s", clickout: false, time: "3h ago" },
  { id: "S-4819", user: "guest_2v1b5ymf", type: "Group (3)", swipes: 18, matched: true, duration: "4m 32s", clickout: true, time: "4h ago" },
  { id: "S-4818", user: "guest_35skto4h", type: "Solo", swipes: 22, matched: false, duration: "3m 10s", clickout: false, time: "5h ago" },
  { id: "S-4817", user: "guest_9i94k2xf", type: "Solo", swipes: 6, matched: true, duration: "1m 05s", clickout: true, time: "6h ago" },
  { id: "S-4816", user: "guest_gi7fz5vs", type: "Group (2)", swipes: 14, matched: true, duration: "3m 45s", clickout: false, time: "7h ago" },
];

const KPIS = [
  { label: "Total Sessions", value: "11,150", trend: "+14%", up: true, icon: Repeat, color: "var(--admin-deep-purple)" },
  { label: "Completion Rate", value: "67.4%", trend: "+3.2%", up: true, icon: Target, color: "var(--admin-cyan)" },
  { label: "Avg Swipes to Match", value: "8.3", trend: "-0.5", up: true, icon: MousePointer, color: "var(--admin-pink)" },
  { label: "Avg Time to Match", value: "2m 12s", trend: "-8s", up: true, icon: Clock, color: "var(--admin-blue)" },
  { label: "Clickout After Match", value: "34.2%", trend: "+2.1%", up: true, icon: ExternalLink, color: "var(--admin-teal)" },
  { label: "Abandonment Rate", value: "32.6%", trend: "-3.2%", up: true, icon: TrendingDown, color: "var(--admin-pink)" },
];

export default function AdminSwipeSessions() {
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const maxSessions = Math.max(...DAILY_SESSIONS.map(d => d.sessions));

  return (
    <div className="space-y-8" data-testid="admin-swipe-sessions-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Repeat className="w-5 h-5" style={{ color: "var(--admin-deep-purple)" }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800" data-testid="text-sessions-title">Swipe Sessions</h2>
            <p className="text-xs text-muted-foreground">Session volume, completion, and user journey analysis</p>
          </div>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["7d", "30d", "all"] as const).map(k => (
            <button key={k} onClick={() => setDateRange(k)} data-testid={`tab-date-${k}`}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${dateRange === k ? "bg-white text-gray-800 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {k === "7d" ? "7 days" : k === "30d" ? "30 days" : "All time"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {KPIS.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`kpi-${kpi.label.toLowerCase().replace(/\s/g, "-")}`}>
            <div className="h-[3px]" style={{ backgroundColor: kpi.color }} />
            <div className="p-4 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: getTintVar(kpi.color) }}>
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.up ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                <span className={`text-[11px] font-medium ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>{kpi.trend}</span>
                <span className="text-[10px] text-gray-400">vs prev</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-session-funnel">
          <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-deep-purple)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800">Product Funnel</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">App open → Partner clickout</p>
          </div>
          <div className="space-y-2">
            {SESSION_FUNNEL.map((step, idx) => {
              const dropoff = idx > 0 ? Math.round((1 - step.value / SESSION_FUNNEL[idx - 1].value) * 100) : 0;
              return (
                <div key={step.label} className="flex items-center gap-3" data-testid={`funnel-step-${idx}`}>
                  <span className="w-44 text-xs text-foreground font-medium">{step.label}</span>
                  <div className="flex-1 h-8 rounded-lg bg-gray-50 overflow-hidden relative">
                    <div className="h-full rounded-lg flex items-center px-2 transition-all" style={{ width: `${Math.max(step.pct, 6)}%`, backgroundColor: step.bg }}>
                      {step.pct > 15 && <span className={`text-[10px] font-semibold whitespace-nowrap ${step.textClass}`}>{step.value.toLocaleString()}</span>}
                    </div>
                    {step.pct <= 15 && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-500">{step.value.toLocaleString()}</span>}
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-xs font-medium text-muted-foreground">{step.pct}%</span>
                    {idx > 0 && <p className="text-[9px] text-red-400 font-medium">-{dropoff}%</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-daily-volume">
          <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-blue)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800">Daily Volume</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Sessions by day of week</p>
          </div>
          <div className="flex items-end gap-2" style={{ height: "160px" }}>
            {DAILY_SESSIONS.map(d => {
              const barHeight = Math.max(8, (d.sessions / maxSessions) * 130);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end" style={{ height: "100%" }}>
                  <span className="text-[10px] font-semibold text-gray-600 mb-1">{d.sessions.toLocaleString()}</span>
                  <div className="w-full rounded-t-md" style={{
                    height: `${barHeight}px`,
                    backgroundColor: "var(--admin-blue)",
                    opacity: d.day === "Sat" || d.day === "Fri" ? 1 : 0.4,
                  }} />
                  <span className="text-[10px] text-muted-foreground font-medium mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-entry-sources">
          <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-cyan)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800">Entry Sources</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">How users start sessions</p>
          </div>
          <div className="space-y-3">
            {ENTRY_SOURCES.map(s => (
              <div key={s.source} className="flex items-center gap-3">
                <span className="w-28 text-xs text-gray-600 font-medium">{s.source}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-gray-700">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-segment-comparison">
          <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-pink)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800">Segment Comparison</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Solo vs Group butterfly chart</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center mb-3">
              <div className="w-[100px]" />
              <div className="flex-1 flex items-center">
                <div className="flex-1 flex justify-end pr-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#B8C4F0" }} />
                    <span className="text-[11px] font-semibold text-gray-500">Solo (72%)</span>
                  </div>
                </div>
                <div className="flex-1 flex justify-start pl-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#E8C8E8" }} />
                    <span className="text-[11px] font-semibold text-gray-500">Group (28%)</span>
                  </div>
                </div>
              </div>
            </div>
            {[
              { metric: "Avg. Swipe", solo: 15.3, group: 8.1, max: 20, unit: "", format: (v: number) => v.toFixed(1) },
              { metric: "Match Rate", solo: 27, group: 62, max: 100, unit: "%", format: (v: number) => `${v}%` },
              { metric: "Avg. Time", solo: 180, group: 220, max: 300, unit: "", format: (v: number) => v >= 60 ? `${Math.floor(v / 60)}m ${v % 60 > 0 ? `${(v % 60)}s` : ""}`.trim() : `${v}s` },
              { metric: "Checkout Rate", solo: 21, group: 30, max: 50, unit: "%", format: (v: number) => `${v}%` },
            ].map(row => {
              const soloPct = Math.max(8, (row.solo / row.max) * 100);
              const groupPct = Math.max(8, (row.group / row.max) * 100);
              return (
                <div key={row.metric} className="flex items-center h-11" data-testid={`segment-row-${row.metric.toLowerCase().replace(/[\s.]+/g, "-")}`}>
                  <div className="w-[100px] shrink-0 pr-3">
                    <span className="text-xs font-medium text-gray-500">{row.metric}</span>
                  </div>
                  <div className="flex-1 flex items-center relative">
                    <div className="flex-1 flex justify-end">
                      <div
                        className="h-8 rounded-l-md flex items-center justify-end px-2.5 transition-all"
                        style={{ width: `${soloPct}%`, backgroundColor: "#B8C4F0" }}
                      >
                        <span className="text-[11px] font-semibold text-[#4A5078] whitespace-nowrap">{row.format(row.solo)}</span>
                      </div>
                    </div>
                    <div className="w-[2px] h-10 bg-gray-200 shrink-0 z-10" />
                    <div className="flex-1 flex justify-start">
                      <div
                        className="h-8 rounded-r-md flex items-center px-2.5 transition-all"
                        style={{ width: `${groupPct}%`, backgroundColor: "#E8C8E8" }}
                      >
                        <span className="text-[11px] font-semibold text-[#785078] whitespace-nowrap">{row.format(row.group)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-recent-sessions">
        <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-deep-purple)" }}>
          <h3 className="text-[15px] font-semibold text-gray-800">Recent Sessions</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Latest swipe session drilldown</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-testid="table-recent-sessions">
            <thead>
              <tr className="border-b border-gray-100">
                {["Session ID", "User", "Type", "Swipes", "Matched", "Duration", "Clickout", "Time"].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_SESSIONS.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-gray-700">{s.id}</td>
                  <td className="py-2.5 px-3 text-gray-600">{s.user}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.type.startsWith("Group") ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-600"}`}>{s.type}</span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-700">{s.swipes}</td>
                  <td className="py-2.5 px-3">
                    <span className={`w-2 h-2 rounded-full inline-block ${s.matched ? "bg-emerald-400" : "bg-gray-300"}`} />
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{s.duration}</td>
                  <td className="py-2.5 px-3">
                    {s.clickout ? <ExternalLink className="w-3.5 h-3.5 text-blue-500" /> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-2.5 px-3 text-gray-400">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
