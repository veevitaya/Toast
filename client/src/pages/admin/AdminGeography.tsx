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
  if (value < 30) return "#C4B5FD";
  if (value < 50) return "#A78BFA";
  if (value < 70) return "#8B5CF6";
  if (value < 85) return "#7C3AED";
  return "#6D28D9";
}

function intensityColorAlpha(value: number) {
  if (value < 30) return "rgba(196, 181, 253, 0.25)";
  if (value < 50) return "rgba(167, 139, 250, 0.3)";
  if (value < 70) return "rgba(139, 92, 246, 0.35)";
  if (value < 85) return "rgba(124, 58, 237, 0.4)";
  return "rgba(109, 40, 217, 0.45)";
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
  "Sukhumvit": { x: 370, y: 220 },
  "Silom / Sathorn": { x: 230, y: 310 },
  "Siam / CentralWorld": { x: 290, y: 200 },
  "Thonglor / Ekkamai": { x: 460, y: 190 },
  "Ari / Phahonyothin": { x: 250, y: 105 },
  "Ratchada": { x: 370, y: 120 },
  "Bangna": { x: 530, y: 340 },
  "Lat Phrao": { x: 340, y: 65 },
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
            <div className="relative w-full h-[480px] rounded-xl overflow-hidden" data-testid="district-map-view" style={{ backgroundColor: "#F0F4F8" }}>
              <svg viewBox="0 0 620 460" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#DCE3ED" strokeWidth="0.4" />
                  </pattern>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
                  </filter>
                </defs>

                <rect width="620" height="460" fill="url(#mapGrid)" />

                <path d="M 60 200 Q 80 100 180 55 Q 260 25 350 30 Q 450 35 520 85 Q 570 130 580 210 Q 585 300 550 370 Q 500 420 400 435 Q 300 445 200 420 Q 120 395 80 330 Q 55 280 60 200 Z" fill="#E2E8F0" stroke="#B0BEC5" strokeWidth="1.5" opacity="0.7" />

                <path d="M 140 370 Q 155 340 165 310 Q 175 280 180 250 Q 185 220 195 195 Q 210 170 230 155 Q 245 145 255 130 Q 260 115 258 95" fill="none" stroke="#93C5FD" strokeWidth="12" opacity="0.2" strokeLinecap="round" />
                <path d="M 140 370 Q 155 340 165 310 Q 175 280 180 250 Q 185 220 195 195 Q 210 170 230 155 Q 245 145 255 130 Q 260 115 258 95" fill="none" stroke="#60A5FA" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
                <path d="M 140 370 Q 155 340 165 310 Q 175 280 180 250 Q 185 220 195 195 Q 210 170 230 155 Q 245 145 255 130 Q 260 115 258 95" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
                <text x="148" y="285" fontSize="7" fill="#60A5FA" opacity="0.7" fontStyle="italic" transform="rotate(-75, 148, 285)">Chao Phraya River</text>

                <path d="M 130 400 Q 140 380 150 355 Q 158 330 162 300" fill="none" stroke="#93C5FD" strokeWidth="6" opacity="0.15" strokeLinecap="round" />
                <path d="M 130 400 Q 140 380 150 355 Q 158 330 162 300" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.3" strokeLinecap="round" />

                <line x1="250" y1="105" x2="290" y2="200" stroke="#4CAF50" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
                <line x1="290" y1="200" x2="290" y2="240" stroke="#4CAF50" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
                <line x1="290" y1="240" x2="230" y2="310" stroke="#4CAF50" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
                <text x="282" y="172" fontSize="6" fill="#4CAF50" opacity="0.55" fontWeight="600">BTS</text>

                <line x1="370" y1="65" x2="370" y2="120" stroke="#1565C0" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
                <line x1="370" y1="120" x2="340" y2="200" stroke="#1565C0" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
                <line x1="340" y1="200" x2="290" y2="200" stroke="#1565C0" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
                <text x="358" y="92" fontSize="6" fill="#1565C0" opacity="0.5" fontWeight="600">MRT</text>

                <line x1="290" y1="200" x2="460" y2="190" stroke="#9E9E9E" strokeWidth="1.2" opacity="0.25" strokeDasharray="6 3" />
                <line x1="460" y1="190" x2="530" y2="340" stroke="#9E9E9E" strokeWidth="1.2" opacity="0.25" strokeDasharray="6 3" />
                <text x="490" y="265" fontSize="6" fill="#9E9E9E" opacity="0.5" fontWeight="500" transform="rotate(68, 490, 265)">Sukhumvit Rd</text>

                <line x1="230" y1="310" x2="400" y2="340" stroke="#9E9E9E" strokeWidth="1" opacity="0.2" strokeDasharray="5 3" />
                <line x1="250" y1="105" x2="370" y2="120" stroke="#9E9E9E" strokeWidth="1" opacity="0.2" strokeDasharray="5 3" />
                <line x1="290" y1="200" x2="370" y2="220" stroke="#9E9E9E" strokeWidth="1" opacity="0.2" strokeDasharray="5 3" />

                <text x="310" y="22" textAnchor="middle" fontSize="13" fill="#78909C" fontWeight="700" letterSpacing="5">BANGKOK</text>
                <text x="310" y="36" textAnchor="middle" fontSize="8" fill="#90A4AE" letterSpacing="1">กรุงเทพมหานคร</text>

                {DISTRICT_DATA.map(d => {
                  const coords = BANGKOK_COORDS_MAP[d.name];
                  if (!coords) return null;
                  const radius = 16 + (d.clickouts / maxClickouts) * 22;
                  const pulseRadius = radius + 10;
                  return (
                    <g key={d.name}>
                      <circle cx={coords.x} cy={coords.y} r={pulseRadius} fill={intensityColorAlpha(d.demand)}>
                        <animate attributeName="r" values={`${pulseRadius};${pulseRadius + 6};${pulseRadius}`} dur="3.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.3;1" dur="3.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={coords.x} cy={coords.y} r={radius} fill={intensityColor(d.demand)} stroke="white" strokeWidth="2.5" filter="url(#shadow)" />
                      <text x={coords.x} y={coords.y + 1} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white" dominantBaseline="middle">
                        {d.demand}
                      </text>
                      <text x={coords.x} y={coords.y + radius + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#2D3748">
                        {d.name.split(" / ")[0]}
                      </text>
                      <text x={coords.x} y={coords.y + radius + 25} textAnchor="middle" fontSize="7.5" fontWeight="500" fill="#718096">
                        {d.clickouts.toLocaleString()} clicks
                      </text>
                    </g>
                  );
                })}

                <g transform="translate(15, 390)">
                  <rect x="0" y="0" width="95" height="55" rx="6" fill="white" opacity="0.85" stroke="#E2E8F0" strokeWidth="1" />
                  <rect x="8" y="8" width="10" height="10" rx="2" fill="#C4B5FD" />
                  <rect x="8" y="22" width="10" height="10" rx="2" fill="#8B5CF6" />
                  <rect x="8" y="36" width="10" height="10" rx="2" fill="#6D28D9" />
                  <text x="22" y="16" fontSize="7" fill="#4A5568" fontWeight="500">Low demand</text>
                  <text x="22" y="30" fontSize="7" fill="#4A5568" fontWeight="500">Medium</text>
                  <text x="22" y="44" fontSize="7" fill="#4A5568" fontWeight="500">High demand</text>
                </g>

                <g transform="translate(120, 425)">
                  <circle cx="5" cy="0" r="4" fill="#8B5CF6" opacity="0.7" />
                  <circle cx="16" cy="0" r="6" fill="#8B5CF6" opacity="0.7" />
                  <text x="28" y="3" fontSize="7.5" fill="#4A5568" fontWeight="500">Bubble size = clickout volume</text>
                </g>

                <g transform="translate(340, 425)">
                  <line x1="0" y1="0" x2="15" y2="0" stroke="#4CAF50" strokeWidth="2" opacity="0.5" />
                  <text x="20" y="3" fontSize="7.5" fill="#4A5568" fontWeight="500">BTS</text>
                  <line x1="50" y1="0" x2="65" y2="0" stroke="#1565C0" strokeWidth="2" opacity="0.5" />
                  <text x="70" y="3" fontSize="7.5" fill="#4A5568" fontWeight="500">MRT</text>
                  <line x1="100" y1="0" x2="115" y2="0" stroke="#60A5FA" strokeWidth="2.5" opacity="0.5" />
                  <text x="120" y="3" fontSize="7.5" fill="#4A5568" fontWeight="500">River</text>
                </g>

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
