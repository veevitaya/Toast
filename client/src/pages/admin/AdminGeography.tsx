import { useState } from "react";
import { MapPin, TrendingUp, Users, Clock, AlertCircle, Zap, BarChart3, Map } from "lucide-react";

const DISTRICT_DATA = [
  { name: "Sukhumvit", demand: 92, restaurants: 124, clickouts: 1240, growth: "+18%", status: "strong" as const },
  { name: "Silom / Sathorn", demand: 78, restaurants: 86, clickouts: 890, growth: "+12%", status: "strong" as const },
  { name: "Siam / CentralWorld", demand: 85, restaurants: 64, clickouts: 720, growth: "+8%", status: "growing" as const },
  { name: "Thonglor / Ekkamai", demand: 88, restaurants: 72, clickouts: 680, growth: "+22%", status: "strong" as const },
  { name: "Ari / Phahonyothin", demand: 65, restaurants: 38, clickouts: 410, growth: "+31%", status: "growing" as const },
  { name: "Ratchada", demand: 52, restaurants: 45, clickouts: 280, growth: "+5%", status: "stable" as const },
  { name: "Bangna", demand: 44, restaurants: 22, clickouts: 160, growth: "+42%", status: "underserved" as const },
  { name: "Lat Phrao", demand: 38, restaurants: 18, clickouts: 120, growth: "+28%", status: "underserved" as const },
];

const DAYPART_GEO = [
  { area: "Sukhumvit", breakfast: 12, lunch: 35, dinner: 38, lateNight: 15 },
  { area: "Silom", breakfast: 18, lunch: 42, dinner: 30, lateNight: 10 },
  { area: "Thonglor", breakfast: 8, lunch: 22, dinner: 45, lateNight: 25 },
  { area: "Ari", breakfast: 22, lunch: 38, dinner: 28, lateNight: 12 },
  { area: "Siam", breakfast: 10, lunch: 40, dinner: 35, lateNight: 15 },
];

function intensityColor(value: number) {
  if (value < 30) return "rgba(139, 92, 246, 0.15)";
  if (value < 50) return "rgba(139, 92, 246, 0.30)";
  if (value < 70) return "rgba(139, 92, 246, 0.50)";
  if (value < 85) return "rgba(139, 92, 246, 0.70)";
  return "rgba(139, 92, 246, 0.90)";
}

const BANGKOK_COORDS: Record<string, { x: number; y: number }> = {
  "Sukhumvit": { x: 62, y: 45 },
  "Silom / Sathorn": { x: 48, y: 55 },
  "Siam / CentralWorld": { x: 50, y: 40 },
  "Thonglor / Ekkamai": { x: 72, y: 42 },
  "Ari / Phahonyothin": { x: 45, y: 25 },
  "Ratchada": { x: 58, y: 30 },
  "Bangna": { x: 80, y: 65 },
  "Lat Phrao": { x: 55, y: 18 },
};

const BANGKOK_COORDS_MAP: Record<string, { x: number; y: number }> = {
  "Sukhumvit": { x: 310, y: 180 },
  "Silom / Sathorn": { x: 220, y: 230 },
  "Siam / CentralWorld": { x: 250, y: 155 },
  "Thonglor / Ekkamai": { x: 370, y: 165 },
  "Ari / Phahonyothin": { x: 215, y: 100 },
  "Ratchada": { x: 300, y: 110 },
  "Bangna": { x: 400, y: 270 },
  "Lat Phrao": { x: 270, y: 75 },
};

export default function AdminGeography() {
  const [mapView, setMapView] = useState<"list" | "map">("list");
  const maxClickouts = Math.max(...DISTRICT_DATA.map(d => d.clickouts));

  return (
    <div className="space-y-8" data-testid="admin-geography-page">
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5" style={{ color: "var(--admin-cyan)" }} />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Geography</h2>
          <p className="text-xs text-muted-foreground">Demand heatmaps, district analysis, and coverage gaps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-district-demand">
          <div className="flex items-center justify-between mb-5">
            <div className="border-l-[3px] pl-3" style={{ borderColor: "var(--admin-cyan)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">District Demand Map</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Demand score vs restaurant supply</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setMapView("list")}
                className={`p-1.5 rounded-md transition-all ${mapView === "list" ? "bg-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                data-testid="button-view-list"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMapView("map")}
                className={`p-1.5 rounded-md transition-all ${mapView === "map" ? "bg-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                data-testid="button-view-map"
              >
                <Map className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {mapView === "list" ? (
            <div className="space-y-2">
              {DISTRICT_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0" data-testid={`district-${d.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: intensityColor(d.demand) }}>
                    {d.demand}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800">{d.name}</span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-gray-400">{d.restaurants} restaurants</span>
                      <span className="text-[10px] text-gray-400">{d.clickouts.toLocaleString()} clickouts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600">{d.growth}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    d.status === "strong" ? "bg-emerald-50 text-emerald-700" :
                    d.status === "growing" ? "bg-blue-50 text-blue-700" :
                    d.status === "stable" ? "bg-gray-100 text-gray-600" :
                    "bg-amber-50 text-amber-700"
                  }`}>{d.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full h-[420px] rounded-xl overflow-hidden" data-testid="district-map-view" style={{ backgroundColor: "#EEF2F7" }}>
              <svg viewBox="0 0 500 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#D5DCE6" strokeWidth="0.5" opacity="0.5" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                <rect width="500" height="400" fill="url(#grid)" />

                <path d="M 80 180 Q 90 120 160 90 Q 200 75 250 70 Q 320 65 380 100 Q 430 130 440 200 Q 445 260 410 310 Q 370 360 300 370 Q 240 375 170 350 Q 110 320 85 270 Q 70 230 80 180 Z" fill="#D8E2F0" stroke="#B8C6DA" strokeWidth="1.5" opacity="0.6" />

                <line x1="80" y1="230" x2="440" y2="230" stroke="#C5D0DE" strokeWidth="0.7" strokeDasharray="4 3" opacity="0.4" />
                <line x1="250" y1="70" x2="250" y2="370" stroke="#C5D0DE" strokeWidth="0.7" strokeDasharray="4 3" opacity="0.4" />
                <line x1="160" y1="90" x2="410" y2="310" stroke="#C5D0DE" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.25" />
                <line x1="380" y1="100" x2="170" y2="350" stroke="#C5D0DE" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.25" />

                <path d="M 120 260 Q 180 280 260 290 Q 340 295 400 270" fill="none" stroke="#A8C4E0" strokeWidth="2.5" opacity="0.35" />
                <text x="260" y="305" textAnchor="middle" fontSize="7" fill="#8EA4BE" opacity="0.5" fontStyle="italic">Chao Phraya</text>

                <text x="250" y="28" textAnchor="middle" fontSize="10" fill="#A0AEC0" fontWeight="600" letterSpacing="3">BANGKOK</text>
                <text x="250" y="40" textAnchor="middle" fontSize="7" fill="#B8C6DA">กรุงเทพมหานคร</text>

                {DISTRICT_DATA.map(d => {
                  const coords = BANGKOK_COORDS_MAP[d.name];
                  if (!coords) return null;
                  const radius = 12 + (d.clickouts / maxClickouts) * 22;
                  const pulseRadius = radius + 6;
                  return (
                    <g key={d.name} filter="url(#glow)">
                      <circle cx={coords.x} cy={coords.y} r={pulseRadius} fill={intensityColor(d.demand)} opacity={0.12}>
                        <animate attributeName="r" values={`${pulseRadius};${pulseRadius + 4};${pulseRadius}`} dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={coords.x} cy={coords.y} r={radius} fill={intensityColor(d.demand)} opacity={0.85} stroke="white" strokeWidth="1.5" />
                      <text x={coords.x} y={coords.y + 1} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" dominantBaseline="middle">
                        {d.demand}
                      </text>
                      <text x={coords.x} y={coords.y + radius + 12} textAnchor="middle" fontSize="9" fontWeight="600" fill="#4A5568">
                        {d.name.split(" / ")[0]}
                      </text>
                      <text x={coords.x} y={coords.y + radius + 22} textAnchor="middle" fontSize="7" fill="#8899A8">
                        {d.clickouts.toLocaleString()} clicks
                      </text>
                    </g>
                  );
                })}

                <g transform="translate(15, 340)">
                  <rect x="0" y="0" width="12" height="12" rx="2" fill="#8B5CF6" opacity="0.15" />
                  <rect x="0" y="16" width="12" height="12" rx="2" fill="#8B5CF6" opacity="0.5" />
                  <rect x="0" y="32" width="12" height="12" rx="2" fill="#8B5CF6" opacity="0.9" />
                  <text x="17" y="10" fontSize="7" fill="#718096">Low demand</text>
                  <text x="17" y="26" fontSize="7" fill="#718096">Medium</text>
                  <text x="17" y="42" fontSize="7" fill="#718096">High demand</text>
                </g>

                <circle cx="15" cy="320" r="4" fill="#8B5CF6" opacity="0.5" />
                <text x="23" y="323" fontSize="7" fill="#718096">= clickout volume</text>

              </svg>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-underserved">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-teal)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Underserved Areas</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">High demand, low supply</p>
            </div>
            <div className="space-y-2.5">
              {DISTRICT_DATA.filter(d => d.status === "underserved").map(d => (
                <div key={d.name} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-800">{d.name}</span>
                    <span className="text-xs font-medium text-amber-600">{d.growth} growth</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span>Demand: {d.demand}/100</span>
                    <span>•</span>
                    <span>Only {d.restaurants} restaurants</span>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/50 mt-3">
                <Zap className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-blue-700">These areas show strong demand growth with limited restaurant coverage — prime expansion targets.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-clickout-hotspots">
            <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-pink)" }}>
              <h3 className="text-[15px] font-semibold text-gray-800">Clickout Hotspots</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Top 3 conversion areas</p>
            </div>
            <div className="space-y-2.5">
              {DISTRICT_DATA.sort((a, b) => b.clickouts - a.clickouts).slice(0, 3).map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{
                    backgroundColor: i === 0 ? "var(--admin-pink)" : "rgba(244, 63, 94, 0.2)",
                    color: i === 0 ? "white" : "var(--admin-pink)",
                  }}>{i + 1}</span>
                  <span className="flex-1 text-xs font-medium text-gray-800">{d.name}</span>
                  <span className="text-xs font-semibold text-gray-700">{d.clickouts.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-daypart-geo">
        <div className="border-l-[3px] pl-3 mb-5" style={{ borderColor: "var(--admin-deep-purple)" }}>
          <h3 className="text-[15px] font-semibold text-gray-800">Area × Daypart Demand</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">When each area is busiest</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area</th>
                {["Breakfast", "Lunch", "Dinner", "Late Night"].map(h => (
                  <th key={h} className="text-center py-2.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYPART_GEO.map(row => (
                <tr key={row.area} className="border-b border-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">{row.area}</td>
                  {[row.breakfast, row.lunch, row.dinner, row.lateNight].map((val, i) => (
                    <td key={i} className="py-2.5 px-3 text-center">
                      <span className="inline-block px-3 py-1 rounded-md text-xs font-medium" style={{
                        backgroundColor: intensityColor(val * 2.2),
                        color: val > 30 ? "white" : "var(--admin-deep-purple)",
                      }}>{val}%</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
