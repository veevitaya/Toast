import { useState, useRef, useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Calendar, Clock, MapPin, ArrowRight, Zap,
  ChevronDown, ChevronLeft, ChevronRight, Search, LocateFixed, Check,
  type LucideIcon,
} from "lucide-react";
import { useLineProfile } from "@/lib/useLineProfile";
import { fetchWithTimeout } from "@/lib/queryClient";
import { isOnboardingComplete } from "@/hooks/use-onboarding";
import { InlineOnboarding } from "@/pages/Onboarding";

const GOLD = "#FFCC02";
const BG = "hsl(30, 20%, 97%)";
const BG_FADE = "hsla(30, 20%, 97%, 0)";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

const STAGES = ["Plan", "Taste", "Swipe", "Match", "Eat"];

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const NOW = new Date();
const TODAY_DAY = NOW.getDate();
const CUR_MONTH = NOW.getMonth();
const CUR_YEAR = NOW.getFullYear();
const MONTH_LABEL = `${MONTH_NAMES[CUR_MONTH]} ${CUR_YEAR}`;
const DAYS_IN_MONTH = new Date(CUR_YEAR, CUR_MONTH + 1, 0).getDate();
const FIRST_WEEKDAY = new Date(CUR_YEAR, CUR_MONTH, 1).getDay();
const dateLabelFor = (d: number) => {
  const dt = new Date(CUR_YEAR, CUR_MONTH, d);
  return `${WEEKDAY_SHORT[dt.getDay()]}, ${MONTH_SHORT[CUR_MONTH]} ${d}`;
};

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h24 = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const period = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${minute} ${period}`;
});
const AREAS = ["Thonglor", "Ekkamai", "Asok", "Sukhumvit", "Ari", "Siam", "Sathorn", "Riverside"];
const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  Thonglor: { lat: 13.7329, lng: 100.5795 },
  Ekkamai: { lat: 13.7197, lng: 100.5853 },
  Asok: { lat: 13.7373, lng: 100.5602 },
  Sukhumvit: { lat: 13.7308, lng: 100.5700 },
  Ari: { lat: 13.7730, lng: 100.5445 },
  Siam: { lat: 13.7454, lng: 100.5341 },
  Sathorn: { lat: 13.7220, lng: 100.5290 },
  Riverside: { lat: 13.7265, lng: 100.5100 },
};
const nearestArea = (lat: number, lng: number): string => {
  let best = AREAS[0];
  let bestDist = Infinity;
  for (const a of AREAS) {
    const c = AREA_COORDS[a];
    if (!c) continue;
    const d = (c.lat - lat) ** 2 + (c.lng - lng) ** 2;
    if (d < bestDist) { bestDist = d; best = a; }
  }
  return best;
};

const toMinutes = (s: string): number => {
  const [hm, ap] = s.split(" ");
  const [hRaw, m] = hm.split(":").map(Number);
  let h = hRaw;
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
};
const TIME_MINUTES = TIMES.map(toMinutes);
const nearestTimeIdx = (d: Date = new Date()): number => {
  const mins = d.getHours() * 60 + d.getMinutes();
  let best = 0;
  let bestDiff = Infinity;
  TIME_MINUTES.forEach((m, i) => {
    const diff = Math.abs(m - mins);
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  });
  return best;
};

export default function GroupSetup() {
  const [, navigate] = useLocation();
  const { profile, refreshProfile, loading: profileLoading } = useLineProfile();
  const [onboarded, setOnboarded] = useState(() => isOnboardingComplete());

  const [openPicker, setOpenPicker] = useState<"date" | "time" | "area" | null>(null);
  const [selDay, setSelDay] = useState(TODAY_DAY);
  const [timeIdx, setTimeIdx] = useState(() => nearestTimeIdx());
  const [area, setArea] = useState("Thonglor");
  const [areaQuery, setAreaQuery] = useState("");
  const [usedLocation, setUsedLocation] = useState(false);
  const [locating, setLocating] = useState(false);

  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [listInviteData, setListInviteData] = useState<{ listId: number; restaurantIds: number[] } | null>(null);
  const [cardMode, setCardMode] = useState<"menu" | "restaurant">("menu");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get("listInvite");
    if (inviteToken) {
      fetch(`/api/saved-lists/invite/${encodeURIComponent(inviteToken)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.restaurantIds) {
            setListInviteData({ listId: data.listId, restaurantIds: data.restaurantIds });
          }
        })
        .catch(() => {});
    }
  }, []);

  const togglePicker = (p: "date" | "time" | "area") =>
    setOpenPicker((cur) => (cur === p ? null : p));
  const pickDay = (d: number) => { setSelDay(d); setOpenPicker(null); };
  const pickTime = (i: number) => { setTimeIdx(i); setOpenPicker(null); };
  const pickArea = (a: string) => { setArea(a); setUsedLocation(false); setOpenPicker(null); };
  const detectLocation = () => {
    if (!("geolocation" in navigator)) { setUsedLocation(false); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setArea(nearestArea(pos.coords.latitude, pos.coords.longitude));
        setUsedLocation(true);
        setAreaQuery("");
        setLocating(false);
      },
      () => { setLocating(false); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };
  const useMyLocation = () => { detectLocation(); };
  const setNow = () => {
    const now = new Date();
    setSelDay(now.getDate());
    setTimeIdx(nearestTimeIdx(now));
    detectLocation();
    setOpenPicker(null);
  };
  const dateLabel = dateLabelFor(selDay);

  const getOrCreateSessionId = async () => {
    if (pendingSessionId) return pendingSessionId;
    if (profile) {
      try {
        const resp = await fetchWithTimeout("/api/group/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hostLineUserId: profile.userId,
            hostDisplayName: profile.displayName,
            hostPictureUrl: profile.pictureUrl || "",
            planData: { date: dateLabel, time: TIMES[timeIdx], area },
            ...(listInviteData ? {
              sessionType: "saved_list",
              sourceData: JSON.stringify({ listId: listInviteData.listId, restaurantIds: listInviteData.restaurantIds }),
            } : {
              cardPreference: cardMode,
            }),
          }),
        });
        if (resp.ok) {
          const session = await resp.json();
          setPendingSessionId(session.sessionCode);
          return session.sessionCode;
        }
      } catch {}
    }
    const fallbackId = Array.from(crypto.getRandomValues(new Uint8Array(4)))
      .map((b) => b.toString(16).padStart(2, "0")).join("");
    setPendingSessionId(fallbackId);
    return fallbackId;
  };

  const handleSend = async () => {
    if (inviteStatus === "sending") return;
    if (profileLoading || !profile) return;
    setInviteStatus("sending");
    const sessionId = await getOrCreateSessionId();

    if (profile) {
      sessionStorage.setItem("toast_group_host_profile", JSON.stringify(profile));
      localStorage.setItem("toast_guest_profile", JSON.stringify(profile));
    }
    sessionStorage.setItem("toast_group_host_session", sessionId);
    try {
      sessionStorage.setItem("toast_group_plan", JSON.stringify({ date: dateLabel, time: TIMES[timeIdx], area }));
    } catch {}

    setInviteStatus("sent");
    navigate(`/group/taste?session=${sessionId}`);
  };

  const hostInitial = (profile?.displayName || "You").charAt(0).toUpperCase();

  if (!onboarded) {
    return <InlineOnboarding skipCuisines onComplete={() => { setOnboarded(true); refreshProfile(); }} />;
  }

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col bg-background"
      style={{ color: INK }}
      data-testid="group-setup-page"
    >
      <header className="px-6 pt-14 pb-2">
        <div className="flex items-center justify-between">
          <button
            aria-label="Go back"
            data-testid="button-back"
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
            Group session
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-4" data-testid="stepper">
          {STAGES.map((label, i) => {
            const active = i === 0;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: active ? GOLD : "rgba(26,26,26,0.1)" }} />
                <span className="text-[10px] font-semibold tracking-wide" style={{ color: active ? INK : MUTE, opacity: active ? 1 : 0.7 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      <main className="flex-1 px-6 pb-44 pt-4">
        <h1 className="text-[27px] font-bold tracking-tight leading-tight">
          Set the plan
        </h1>
        <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
          You lock the when &amp; where. Everyone picks their own taste next — Toast finds what works for all.
        </p>

        {listInviteData && (
          <div className="mt-5 rounded-2xl px-4 py-3" style={{ backgroundColor: "rgba(255,204,2,0.12)", border: "1px solid rgba(255,204,2,0.3)" }} data-testid="text-list-invite-banner">
            <p className="text-[13px] font-bold" style={{ color: INK }}>Swiping from a saved list</p>
            <p className="text-[12px] mt-0.5" style={{ color: MUTE }}>{listInviteData.restaurantIds.length} restaurants preloaded</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: MUTE }}>
            When &amp; where
          </span>
          <button
            data-testid="button-now"
            onClick={setNow}
            className="inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-1.5 text-[12.5px] font-bold bg-white active:scale-95 transition-transform"
            style={{ color: INK, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: GOLD }} />
            Set to now
          </button>
        </div>

        <div className="mt-3 rounded-[24px] bg-white p-2.5" style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <PlanRow id="date" Icon={Calendar} label="Date" value={dateLabel} open={openPicker === "date"} onToggle={() => togglePicker("date")} />
          {openPicker === "date" && <CalendarPicker selDay={selDay} onSelect={pickDay} />}

          <Divider />
          <PlanRow id="time" Icon={Clock} label="Time" value={TIMES[timeIdx]} open={openPicker === "time"} onToggle={() => togglePicker("time")} />
          {openPicker === "time" && <TimeScroller idx={timeIdx} onSelect={pickTime} />}

          <Divider />
          <PlanRow id="area" Icon={MapPin} label="Area" value={area} open={openPicker === "area"} onToggle={() => togglePicker("area")} />
          {openPicker === "area" && (
            <AreaPicker value={area} query={areaQuery} setQuery={setAreaQuery} usedLocation={usedLocation} locating={locating} onSelect={pickArea} onUseLocation={useMyLocation} />
          )}
        </div>

        {!listInviteData && (
          <>
            <div className="mt-7 flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: MUTE }}>
                How you&apos;ll swipe
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SwipeModeCard
                emoji="🍜"
                title="Dishes first"
                subtitle="Swipe food, then spots that serve it"
                selected={cardMode === "menu"}
                onClick={() => setCardMode("menu")}
                testId="button-cardmode-menu"
              />
              <SwipeModeCard
                emoji="🍽️"
                title="Restaurants only"
                subtitle="Swipe places, pick where to eat"
                selected={cardMode === "restaurant"}
                onClick={() => setCardMode("restaurant")}
                testId="button-cardmode-restaurant"
              />
            </div>
          </>
        )}

        <div className="mt-5 flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 border-white overflow-hidden shrink-0"
            style={{ backgroundColor: "#F3F1EC", color: INK }}
          >
            {profile?.pictureUrl ? (
              <img src={profile.pictureUrl} alt="" className="w-full h-full object-cover" />
            ) : hostInitial}
          </span>
          <span className="text-[13px]" style={{ color: MUTE }}>
            You&apos;re hosting — set your taste, then invite your crew
          </span>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10" style={{ background: `linear-gradient(to top, ${BG} 78%, ${BG_FADE})` }}>
        <button
          data-testid="button-set-taste"
          onClick={handleSend}
          disabled={inviteStatus === "sending" || profileLoading || !profile || locating}
          className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
          style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
        >
          {inviteStatus === "sending" ? "Creating session…" : profileLoading ? "Getting ready…" : locating ? "Locating…" : "Set your taste first"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px mx-3.5 my-0.5" style={{ backgroundColor: "rgba(26,26,26,0.06)" }} />;
}

function SwipeModeCard({ emoji, title, subtitle, selected, onClick, testId }: {
  emoji: string; title: string; subtitle: string; selected: boolean; onClick: () => void; testId: string;
}) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      aria-pressed={selected}
      className="relative rounded-[20px] p-4 text-left active:scale-[0.98] transition-transform"
      style={{
        backgroundColor: "#fff",
        border: selected ? `2px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
        boxShadow: selected ? "0 12px 26px -14px rgba(255,204,2,0.6)" : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
          <Check className="w-3.5 h-3.5" style={{ color: INK }} strokeWidth={3} />
        </span>
      )}
      <span className="text-[24px] leading-none">{emoji}</span>
      <span className="block text-[15px] font-bold mt-2.5">{title}</span>
      <span className="block text-[12px] mt-0.5 leading-snug" style={{ color: MUTE }}>{subtitle}</span>
    </button>
  );
}

function PlanRow({ id, Icon, label, value, open, onToggle }: {
  id: string; Icon: LucideIcon; label: string; value: string; open: boolean; onToggle: () => void;
}) {
  return (
    <button
      data-testid={`button-${id}`}
      onClick={onToggle}
      aria-expanded={open}
      className="w-full flex items-center gap-3.5 px-3.5 py-3.5 text-left active:scale-[0.99] transition-transform"
    >
      <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CREAM }}>
        <Icon className="w-5 h-5" style={{ color: INK }} />
      </span>
      <span className="flex-1">
        <span className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>{label}</span>
        <span className="block text-[16px] font-bold">{value}</span>
      </span>
      <ChevronDown className="w-5 h-5 shrink-0 transition-transform" style={{ color: MUTE, transform: open ? "rotate(180deg)" : "none" }} />
    </button>
  );
}

function CalendarPicker({ selDay, onSelect }: { selDay: number; onSelect: (d: number) => void }) {
  const cells: (number | null)[] = [];
  for (let i = 0; i < FIRST_WEEKDAY; i++) cells.push(null);
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push(d);
  return (
    <div className="px-3.5 pb-3 pt-1" data-testid="picker-date">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[14px] font-bold">{MONTH_LABEL}</span>
        <div className="flex gap-1.5" style={{ opacity: 0.3 }} aria-hidden="true">
          <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: CREAM }}><ChevronLeft className="w-4 h-4" /></span>
          <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: CREAM }}><ChevronRight className="w-4 h-4" /></span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((w, i) => (
          <span key={i} className="text-center text-[11px] font-semibold" style={{ color: MUTE }}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <span key={`pad-${i}`} />;
          const past = d < TODAY_DAY;
          const sel = d === selDay;
          return (
            <button
              key={d}
              data-testid={`day-${d}`}
              disabled={past}
              onClick={() => onSelect(d)}
              className="h-9 rounded-full text-[13px] font-semibold flex items-center justify-center transition-all active:scale-90 disabled:opacity-25"
              style={sel ? { backgroundColor: GOLD, color: INK } : { color: INK }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeScroller({ idx, onSelect }: { idx: number; onSelect: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = idx * 44;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="px-3.5 pb-3 pt-1" data-testid="picker-time">
      <div className="relative">
        <div className="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 h-11 rounded-xl" style={{ backgroundColor: CREAM }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 z-10" style={{ background: "linear-gradient(#fff, rgba(255,255,255,0))" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 z-10" style={{ background: "linear-gradient(rgba(255,255,255,0), #fff)" }} />
        <div ref={ref} className="relative h-[176px] overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ paddingTop: 66, paddingBottom: 66 }}>
          {TIMES.map((tm, i) => (
            <button
              key={tm}
              data-testid={`time-${i}`}
              onClick={() => onSelect(i)}
              className="snap-center w-full h-11 flex items-center justify-center transition-all"
              style={i === idx ? { color: INK, fontWeight: 700, fontSize: 16 } : { color: MUTE, fontWeight: 500, fontSize: 15 }}
            >
              {tm}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AreaPicker({ value, query, setQuery, usedLocation, locating, onSelect, onUseLocation }: {
  value: string; query: string; setQuery: (v: string) => void; usedLocation: boolean; locating: boolean; onSelect: (a: string) => void; onUseLocation: () => void;
}) {
  const filtered = AREAS.filter((a) => a.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="px-3.5 pb-3 pt-1" data-testid="picker-area">
      <button
        data-testid="button-use-location"
        onClick={onUseLocation}
        className="w-full flex items-center gap-3 rounded-2xl px-3 py-3 mb-3 active:scale-[0.99] transition-transform"
        style={{ backgroundColor: usedLocation ? "rgba(6,199,85,0.10)" : CREAM }}
      >
        <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <LocateFixed className="w-[18px] h-[18px]" style={{ color: usedLocation ? LINE : INK }} />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-[14px] font-bold">Use my current location</span>
          <span className="block text-[12px]" style={{ color: MUTE }}>{locating ? "Locating…" : usedLocation ? `Detected · ${value}` : "We'll center on where you are"}</span>
        </span>
        {usedLocation && <Check className="w-5 h-5 shrink-0" style={{ color: LINE }} />}
      </button>

      <div className="flex items-center gap-2 rounded-2xl px-3.5 h-12 mb-1.5" style={{ backgroundColor: "#fff", border: "1px solid rgba(26,26,26,0.12)" }}>
        <Search className="w-4 h-4 shrink-0" style={{ color: MUTE }} />
        <input
          data-testid="input-area"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or type an area"
          className="flex-1 bg-transparent outline-none text-[14px] font-medium"
          style={{ color: INK }}
        />
      </div>

      <div className="max-h-44 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {filtered.length === 0 ? (
          <p className="text-[13px] py-4 text-center" style={{ color: MUTE }}>No areas match that search</p>
        ) : (
          filtered.map((a) => {
            const sel = a === value;
            return (
              <button key={a} data-testid={`area-${a}`} onClick={() => onSelect(a)} className="w-full flex items-center gap-3 py-2.5 px-1.5 text-left rounded-xl active:opacity-70">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: sel ? GOLD : MUTE }} />
                <span className="flex-1 text-[14px] font-medium">{a}</span>
                {sel && <Check className="w-4 h-4 shrink-0" style={{ color: INK }} />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
