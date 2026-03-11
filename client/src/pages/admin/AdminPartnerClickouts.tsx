import { useState } from "react";
import {
  ExternalLink, TrendingUp, MapPin, Phone, MessageCircle,
  Navigation, Calendar, Clock, ArrowRight
} from "lucide-react";
import { getTintVar } from "./adminUtils";

type DateRange = "7d" | "30d" | "all";

const CLICKOUT_KPIS = [
  { label: "Total Clickouts", value: "3,847", trend: "+18%", up: true, icon: ExternalLink, color: "var(--admin-teal)" },
  { label: "Clickout Rate", value: "34.2%", trend: "+2.1%", up: true, icon: TrendingUp, color: "var(--admin-cyan)" },
  { label: "Unique Restaurants", value: "186", trend: "+12", up: true, icon: MapPin, color: "var(--admin-blue)" },
  { label: "Avg per Session", value: "1.4", trend: "+0.2", up: true, icon: Navigation, color: "var(--admin-deep-purple)" },
];

const PARTNER_BREAKDOWN = [
  { name: "Grab", clicks: 1540, pct: 40, color: "#00B14F", avgOrder: "฿285" },
  { name: "LINE MAN", clicks: 1230, pct: 32, color: "#06C755", avgOrder: "฿245" },
  { name: "Robinhood", clicks: 620, pct: 16, color: "#6C2BD9", avgOrder: "฿310" },
  { name: "Map Click", clicks: 280, pct: 7, color: "var(--admin-blue)", avgOrder: "—" },
  { name: "Call Click", clicks: 120, pct: 3, color: "var(--admin-deep-purple)", avgOrder: "—" },
  { name: "LINE Contact", clicks: 57, pct: 2, color: "var(--admin-cyan)", avgOrder: "—" },
];

const TOP_RESTAURANTS_CLICKOUTS = [
  { name: "Som Tam Nua", total: 890, grab: 380, lineman: 310, robinhood: 120, other: 80 },
  { name: "Gaggan Anand", total: 740, grab: 290, lineman: 260, robinhood: 110, other: 80 },
  { name: "Jay Fai", total: 680, grab: 240, lineman: 220, robinhood: 85, other: 135 },
  { name: "Sorn", total: 540, grab: 220, lineman: 180, robinhood: 75, other: 65 },
  { name: "Bo.Lan", total: 410, grab: 170, lineman: 140, robinhood: 60, other: 40 },
];

const AREA_CLICKOUTS = [
  { area: "Sukhumvit", clicks: 1240, pct: 32 },
  { area: "Silom / Sathorn", clicks: 890, pct: 23 },
  { area: "Siam", clicks: 720, pct: 19 },
  { area: "Thonglor / Ekkamai", clicks: 580, pct: 15 },
  { area: "Ari", clicks: 417, pct: 11 },
];

const DAYPART_CLICKOUTS = [
  { daypart: "Breakfast", pct: 8 },
  { daypart: "Brunch", pct: 14 },
  { daypart: "Lunch", pct: 34 },
  { daypart: "Dinner", pct: 32 },
  { daypart: "Late Night", pct: 12 },
];

export default function AdminPartnerClickouts() {
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  return (
    <div className="space-y-8" data-testid="admin-partner-clickouts-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ExternalLink className="w-5 h-5" style={{ color: "var(--admin-teal)" }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Partner Clickouts</h2>
            <p className="text-xs text-muted-foreground">Outbound intent actions to delivery partners and contact channels</p>
          </div>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["7d", "30d", "all"] as const).map(k => (
            <button key={k} onClick={() => setDateRange(k)} className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${dateRange === k ? "bg-white text-gray-800 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {k === "7d" ? "7 days" : k === "30d" ? "30 days" : "All time"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CLICKOUT_KPIS.map(kpi => (
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
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] font-medium text-emerald-600">{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-partner-breakdown">
          <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-teal)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800">Partner Breakdown</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Clickouts by channel type</p>
          </div>
          <div className="space-y-3">
            {PARTNER_BREAKDOWN.map(p => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="w-24 text-xs text-gray-700 font-medium">{p.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.pct * 2.5}%`, backgroundColor: p.color }} />
                </div>
                <span className="w-14 text-right text-xs font-semibold text-gray-700">{p.clicks.toLocaleString()}</span>
                <span className="w-10 text-right text-[10px] text-gray-400">{p.pct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 p-3 rounded-lg bg-amber-50/50 border-amber-100/50">
            <div className="flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-700">
                <strong>Future-ready:</strong> Confirmed partner attribution (actual orders completed) will be tracked here once delivery partner APIs are integrated.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-area-clickouts">
          <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-cyan)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800">Clickouts by Area</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Geographic distribution</p>
          </div>
          <div className="space-y-3">
            {AREA_CLICKOUTS.map(a => (
              <div key={a.area} className="flex items-center gap-3">
                <span className="w-32 text-xs text-gray-600 font-medium">{a.area}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${a.pct * 3}%`, backgroundColor: "var(--admin-cyan)" }} />
                </div>
                <span className="w-14 text-right text-xs font-semibold text-gray-700">{a.clicks.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-l-[3px] pl-3" style={{ borderColor: "var(--admin-pink)" }}>
            <h3 className="text-[15px] font-semibold text-gray-800 mb-3">By Daypart</h3>
          </div>
          <div className="flex items-end gap-2 h-28">
            {DAYPART_CLICKOUTS.map(d => (
              <div key={d.daypart} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-gray-600">{d.pct}%</span>
                <div className="w-full rounded-t-md" style={{ height: `${d.pct * 2.5}%`, backgroundColor: "var(--admin-pink)", opacity: d.pct > 25 ? 1 : 0.45 }} />
                <span className="text-[9px] text-muted-foreground font-medium text-center leading-tight">{d.daypart}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-top-restaurants-clickouts">
        <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-blue)" }}>
          <h3 className="text-[15px] font-semibold text-gray-800">Top Restaurants by Clickouts</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Partner attribution by restaurant</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {["Restaurant", "Total", "Grab", "LINE MAN", "Robinhood", "Other"].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_RESTAURANTS_CLICKOUTS.map(r => (
                <tr key={r.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-gray-800">{r.name}</td>
                  <td className="py-2.5 px-3 font-semibold text-gray-800">{r.total}</td>
                  <td className="py-2.5 px-3"><span className="text-[#00B14F] font-medium">{r.grab}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[#06C755] font-medium">{r.lineman}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[#6C2BD9] font-medium">{r.robinhood}</span></td>
                  <td className="py-2.5 px-3 text-gray-500">{r.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
