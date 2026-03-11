import { FileText, Download, Calendar, Clock, TrendingUp, Users, ExternalLink, BarChart3 } from "lucide-react";
import { getTintVar } from "./adminUtils";

const AVAILABLE_REPORTS = [
  { name: "Weekly Performance Summary", description: "KPIs, top restaurants, session metrics, clickout breakdown", frequency: "Weekly", lastGenerated: "Mar 8, 2026", format: "PDF", icon: BarChart3, color: "var(--admin-blue)" },
  { name: "Monthly Investor Report", description: "Growth metrics, user acquisition, revenue indicators, market penetration", frequency: "Monthly", lastGenerated: "Mar 1, 2026", format: "PDF", icon: TrendingUp, color: "var(--admin-deep-purple)" },
  { name: "Partner Attribution Report", description: "Clickouts by partner, restaurant performance, conversion rates", frequency: "Monthly", lastGenerated: "Mar 1, 2026", format: "CSV", icon: ExternalLink, color: "var(--admin-cyan)" },
  { name: "User Cohort Analysis", description: "Retention curves, engagement segments, churn risk indicators", frequency: "Monthly", lastGenerated: "Mar 1, 2026", format: "PDF", icon: Users, color: "var(--admin-pink)" },
  { name: "Owner Activity Report", description: "Portal logins, menu updates, claim status, tier usage", frequency: "Weekly", lastGenerated: "Mar 8, 2026", format: "CSV", icon: FileText, color: "var(--admin-teal)" },
  { name: "Data Quality Report", description: "Missing images, invalid links, stale data, completeness scores", frequency: "Daily", lastGenerated: "Today", format: "CSV", icon: BarChart3, color: "var(--admin-pink)" },
];

const SCHEDULED_REPORTS = [
  { name: "Weekly Summary", nextRun: "Mar 15, 2026", recipients: "team@toastbkk.com", enabled: true },
  { name: "Monthly Investor Report", nextRun: "Apr 1, 2026", recipients: "investors@toastbkk.com", enabled: true },
  { name: "Daily Data Quality", nextRun: "Tomorrow 6:00 AM", recipients: "ops@toastbkk.com", enabled: true },
  { name: "Partner Attribution", nextRun: "Apr 1, 2026", recipients: "partnerships@toastbkk.com", enabled: false },
];

export default function AdminReports() {
  return (
    <div className="space-y-8" data-testid="admin-reports-page">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5" style={{ color: "var(--admin-teal)" }} />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
          <p className="text-xs text-muted-foreground">Generate, schedule, and download reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3" data-testid="card-available-reports">
          <div className="border-l-[3px] pl-3" style={{ borderColor: "var(--admin-teal)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800">Available Reports</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Download or regenerate</p>
          </div>
          {AVAILABLE_REPORTS.map(report => (
            <div key={report.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: getTintVar(report.color) }}>
                  <report.icon className="w-5 h-5" style={{ color: report.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-800">{report.name}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{report.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.frequency}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{report.lastGenerated}</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 font-medium">{report.format}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" data-testid={`btn-download-${report.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-scheduled-reports">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-blue)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Scheduled Reports</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Auto-generated & emailed</p>
            </div>
            <div className="space-y-2.5">
              {SCHEDULED_REPORTS.map(s => (
                <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.enabled ? "bg-emerald-400" : "bg-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800">{s.name}</span>
                    <div className="flex gap-2 mt-0.5 text-[10px] text-gray-400">
                      <span>Next: {s.nextRun}</span>
                      <span>To: {s.recipients}</span>
                    </div>
                  </div>
                  <button className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border ${s.enabled ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                    {s.enabled ? "Active" : "Paused"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-custom-report">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-deep-purple)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Custom Report Builder</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Build your own</p>
            </div>
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Drag-and-drop report builder</p>
              <p className="text-xs text-gray-400 mb-4">Select metrics, date ranges, and segments to build custom reports</p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-600 bg-purple-50 rounded-full px-3 py-1.5">
                <Clock className="w-3 h-3" />
                Phase 2 — Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
