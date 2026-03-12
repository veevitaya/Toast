import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowLeft, Users, MapPin, Calendar as CalendarIcon,
  Clock, Utensils, Heart, Baby, Briefcase,
  ChevronDown, Sparkles, UserPlus, Check,
} from "lucide-react";
import { useLineProfile } from "@/lib/useLineProfile";

const LOCATIONS = [
  { id: "bts", icon: "🚇", label: "Near BTS", sub: "Easy access" },
  { id: "mall", icon: "🏬", label: "At the mall", sub: "Indoor vibes" },
  { id: "street", icon: "🍢", label: "Street food", sub: "Local flavor" },
  { id: "rooftop", icon: "🏙️", label: "Rooftop", sub: "Sky high" },
  { id: "riverside", icon: "🌊", label: "Riverside", sub: "Scenic views" },
  { id: "latenight", icon: "🌙", label: "Late night", sub: "After hours" },
];

const BUDGETS = [
  { id: "1", icon: "฿", label: "Cheap eats", color: "#00B14F" },
  { id: "2", icon: "฿฿", label: "Mid range", color: "#FFCC02" },
  { id: "3", icon: "฿฿฿", label: "Fancy", color: "#6C2BD9" },
  { id: "4", icon: "฿฿฿฿", label: "Splurge", color: "#E11D48" },
];

const GROUP_TYPES = [
  { id: "friends", icon: Users, label: "Friends", color: "#00B14F" },
  { id: "partner", icon: Heart, label: "Partner", color: "#E11D48" },
  { id: "family", icon: Baby, label: "Family", color: "#FFCC02" },
  { id: "coworkers", icon: Briefcase, label: "Coworkers", color: "#6C2BD9" },
];

const RESTRICTIONS = [
  { id: "halal", icon: "🕌", label: "Halal" },
  { id: "vegan", icon: "🥬", label: "Vegan" },
  { id: "vegetarian", icon: "🥗", label: "Vegetarian" },
  { id: "gluten-free", icon: "🌾", label: "Gluten-Free" },
  { id: "no-pork", icon: "🐷", label: "No Pork" },
  { id: "keto", icon: "🥓", label: "Keto" },
  { id: "dairy-free", icon: "🥛", label: "Dairy-Free" },
  { id: "nut-free", icon: "🥜", label: "Nut-Free" },
];

const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MINUTES = [0, 15, 30, 45];

function formatDisplayTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h}:${minute.toString().padStart(2, "0")} ${period}`;
}

function roundToNearest15(date: Date) {
  const m = date.getMinutes();
  const rounded = Math.ceil(m / 15) * 15;
  if (rounded === 60) return { hour: (date.getHours() + 1) % 24, minute: 0 };
  return { hour: date.getHours(), minute: rounded };
}

function getNext14Days() {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

function isSameDay(a: Date | null, b: Date) {
  if (!a) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function SectionCard({ title, icon: Icon, iconColor, summary, expanded, onToggle, children, testId }: {
  title: string;
  icon: any;
  iconColor: string;
  summary: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <motion.div
      layout
      className="bg-white rounded-[20px] overflow-hidden border border-gray-100/80"
      style={{ boxShadow: expanded ? "0 6px 24px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.03)" }}
      data-testid={testId}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50/50 transition-colors"
        data-testid={`${testId}-toggle`}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}15` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: iconColor }} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[14px] font-bold text-foreground">{title}</p>
          {!expanded && summary && (
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{summary}</p>
          )}
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GroupSetup() {
  const [, navigate] = useLocation();
  const { profile } = useLineProfile();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const now = new Date();
  const defaultTime = roundToNearest15(now);
  const [selectedHour, setSelectedHour] = useState<number>(defaultTime.hour);
  const [selectedMinute, setSelectedMinute] = useState<number>(defaultTime.minute);
  const [hourPickerOpen, setHourPickerOpen] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const hourPickerRef = useRef<HTMLDivElement>(null);
  const upcomingDays = getNext14Days();

  const [expandedSection, setExpandedSection] = useState<string>("when");

  const toggleSection = (key: string) => {
    setExpandedSection(prev => prev === key ? "" : key);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hourPickerRef.current && !hourPickerRef.current.contains(e.target as Node)) {
        setHourPickerOpen(false);
      }
    };
    if (hourPickerOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hourPickerOpen]);

  const toggleList = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (list.includes(item)) setter(list.filter((i) => i !== item));
    else setter([...list, item]);
  };

  const getOrCreateSessionId = async () => {
    if (pendingSessionId) return pendingSessionId;
    const sessionId = Math.random().toString(36).substring(2, 10);
    setPendingSessionId(sessionId);
    if (profile) {
      try {
        await fetch("/api/group/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionCode: sessionId,
            hostLineUserId: profile.userId,
            hostDisplayName: profile.displayName,
            hostPictureUrl: profile.pictureUrl || "",
          }),
        });
      } catch {}
    }
    return sessionId;
  };

  const handleInvite = async () => {
    setInviteStatus("sending");
    const sessionId = await getOrCreateSessionId();

    if (profile) {
      sessionStorage.setItem("toast_group_host_profile", JSON.stringify(profile));
      localStorage.setItem("toast_guest_profile", JSON.stringify(profile));
    }
    sessionStorage.setItem("toast_group_host_session", sessionId);
    sessionStorage.setItem("toast_group_pending_invite", sessionId);

    setInviteStatus("sent");
    navigate(`/group/waiting?session=${sessionId}`);
  };

  const whenSummary = selectedDate
    ? `${DAY_NAMES_SHORT[selectedDate.getDay()]}, ${MONTH_NAMES_SHORT[selectedDate.getMonth()]} ${selectedDate.getDate()} at ${formatDisplayTime(selectedHour, selectedMinute)}`
    : "Anytime";

  const whereSummary = selectedLocations.length > 0
    ? selectedLocations.map(id => LOCATIONS.find(l => l.id === id)?.label).filter(Boolean).join(", ")
    : "Anywhere";

  const prefsSummary = [
    selectedBudget ? BUDGETS.find(b => b.id === selectedBudget)?.label : null,
    selectedGroupType ? GROUP_TYPES.find(g => g.id === selectedGroupType)?.label : null,
    selectedRestrictions.length > 0 ? `${selectedRestrictions.length} dietary` : null,
  ].filter(Boolean).join(" · ") || "No preferences set";

  const groupSummary = selectedGroupType ? GROUP_TYPES.find(g => g.id === selectedGroupType)?.label || "Any group" : "Any group";

  const completedSteps = [
    selectedDate,
    selectedLocations.length > 0,
    selectedBudget,
    selectedGroupType,
  ].filter(Boolean).length;

  return (
    <div className="w-full h-[100dvh] bg-[#F8F8F7] flex flex-col overflow-hidden" data-testid="group-setup-page">
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-100/60 z-40">
        <div className="flex items-center gap-3 px-5 pt-12 pb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center active:scale-90 transition-all duration-200 flex-shrink-0"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-foreground" data-testid="text-page-title">New Session</h1>
            <p className="text-[11px] text-muted-foreground">Customize your group experience</p>
          </div>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i < completedSteps ? 16 : 6,
                  background: i < completedSteps ? "#FFCC02" : "#e5e5e5",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 hide-scrollbar">
        <div className="px-4 pt-4 space-y-3">

          <SectionCard
            title="When"
            icon={CalendarIcon}
            iconColor="#FFCC02"
            summary={whenSummary}
            expanded={expandedSection === "when"}
            onToggle={() => toggleSection("when")}
            testId="section-when"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Pick a date (optional)</span>
              {selectedDate && (
                <button
                  onClick={() => { setSelectedDate(null); const t = roundToNearest15(new Date()); setSelectedHour(t.hour); setSelectedMinute(t.minute); }}
                  className="text-[10px] text-muted-foreground font-semibold hover:text-foreground transition-colors"
                  data-testid="button-clear-datetime"
                >
                  Clear
                </button>
              )}
            </div>

            <div
              ref={dateScrollRef}
              className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1"
            >
              {upcomingDays.map((day, idx) => {
                const isSelected = isSameDay(selectedDate, day);
                const isToday = idx === 0;
                return (
                  <motion.button
                    key={day.toISOString()}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    data-testid={`calendar-day-${day.getDate()}`}
                    className={`flex flex-col items-center flex-shrink-0 w-[48px] py-2 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? "bg-foreground text-white"
                        : "bg-gray-50 border border-gray-100/60"
                    }`}
                    style={{
                      boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
                    }}
                  >
                    <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isSelected ? "text-white/60" : "text-muted-foreground"
                    }`}>
                      {isToday ? "Today" : DAY_NAMES_SHORT[day.getDay()]}
                    </span>
                    <span className={`text-[17px] font-bold leading-tight mt-0.5 ${
                      isSelected ? "text-white" : "text-foreground"
                    }`}>
                      {day.getDate()}
                    </span>
                    <span className={`text-[8px] font-medium ${
                      isSelected ? "text-white/50" : "text-muted-foreground/60"
                    }`}>
                      {MONTH_NAMES_SHORT[day.getMonth()]}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3 h-3 text-muted-foreground/40" />
                <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div ref={hourPickerRef} className="relative flex-1">
                  <button
                    onClick={() => setHourPickerOpen(prev => !prev)}
                    data-testid="button-hour-picker"
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100/60 cursor-pointer transition-all duration-200"
                    style={{ boxShadow: hourPickerOpen ? "0 2px 10px rgba(0,0,0,0.08)" : "none" }}
                  >
                    <span className="text-[13px] font-semibold text-foreground">
                      {(() => { const h = selectedHour === 0 ? 12 : selectedHour > 12 ? selectedHour - 12 : selectedHour; return `${h} ${selectedHour >= 12 ? "PM" : "AM"}`; })()}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/40 transition-transform duration-200 ${hourPickerOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {hourPickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ type: "spring", damping: 26, stiffness: 300 }}
                        className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl overflow-hidden border border-gray-100 z-[120]"
                        style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)" }}
                        data-testid="hour-picker-dropdown"
                      >
                        <div className="py-1.5 max-h-[200px] overflow-y-auto">
                          {Array.from({ length: 24 }, (_, i) => {
                            const label = i === 0 ? "12" : i > 12 ? String(i - 12) : String(i);
                            const period = i >= 12 ? "PM" : "AM";
                            const isActive = selectedHour === i;
                            return (
                              <button
                                key={i}
                                onClick={() => { setSelectedHour(i); setHourPickerOpen(false); }}
                                data-testid={`hour-option-${i}`}
                                className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors ${
                                  isActive ? "bg-gray-50" : "hover:bg-gray-50/50"
                                }`}
                              >
                                <span className={`text-[13px] font-semibold flex-1 ${isActive ? "text-foreground" : "text-foreground/70"}`}>
                                  {label} {period}
                                </span>
                                {isActive && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFCC02]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[18px] font-bold text-muted-foreground/30">:</span>
                <div className="flex gap-1.5">
                  {MINUTES.map((m) => {
                    const active = selectedMinute === m;
                    return (
                      <motion.button
                        key={m}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setSelectedMinute(m)}
                        data-testid={`minute-${m}`}
                        className={`w-[40px] py-2 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                          active
                            ? "bg-foreground text-white"
                            : "bg-gray-50 border border-gray-100/60 text-muted-foreground"
                        }`}
                        style={{
                          boxShadow: active ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                        }}
                      >
                        :{m.toString().padStart(2, "0")}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {selectedDate && (
              <div className="mt-3 flex items-center gap-2 bg-[#FFCC02]/8 rounded-xl px-3 py-2.5 border border-[#FFCC02]/15">
                <CalendarIcon className="w-3.5 h-3.5 text-[#FFCC02] flex-shrink-0" />
                <span className="text-[12px] font-semibold text-foreground" data-testid="text-datetime-summary">
                  {whenSummary}
                </span>
                <Check className="w-3.5 h-3.5 text-[#00B14F] ml-auto flex-shrink-0" />
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Where"
            icon={MapPin}
            iconColor="#E11D48"
            summary={whereSummary}
            expanded={expandedSection === "where"}
            onToggle={() => toggleSection("where")}
            testId="section-where"
          >
            <div className="grid grid-cols-3 gap-2">
              {LOCATIONS.map((l) => {
                const active = selectedLocations.includes(l.id);
                return (
                  <motion.button
                    key={l.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggleList(selectedLocations, l.id, setSelectedLocations)}
                    data-testid={`chip-group-location-${l.id}`}
                    className={`flex items-center gap-1.5 py-2.5 px-2.5 rounded-xl text-left transition-all duration-200 ${
                      active
                        ? "bg-foreground text-white"
                        : "bg-gray-50 border border-gray-100/60"
                    }`}
                    style={{
                      boxShadow: active ? "0 3px 12px rgba(0,0,0,0.12)" : "none",
                    }}
                  >
                    <span className="text-base flex-shrink-0">{l.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-[10px] font-semibold truncate ${active ? "text-white" : "text-foreground"}`}>{l.label}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Preferences"
            icon={Sparkles}
            iconColor="#6C2BD9"
            summary={prefsSummary}
            expanded={expandedSection === "prefs"}
            onToggle={() => toggleSection("prefs")}
            testId="section-prefs"
          >
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">Budget</p>
              <div className="grid grid-cols-4 gap-1.5">
                {BUDGETS.map((b) => {
                  const active = selectedBudget === b.id;
                  return (
                    <motion.button
                      key={b.id}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setSelectedBudget(active ? "" : b.id)}
                      data-testid={`chip-group-budget-${b.id}`}
                      className={`flex flex-col items-center gap-0.5 py-2.5 px-1.5 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-white border-2 border-foreground"
                          : "bg-gray-50 border border-gray-100/60"
                      }`}
                      style={{
                        boxShadow: active ? "0 3px 12px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: active ? b.color : "#999" }}
                      >
                        {b.icon}
                      </span>
                      <span className={`text-[9px] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{b.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">Dietary needs <span className="font-normal text-muted-foreground/60">(optional)</span></p>
              <div className="flex flex-wrap gap-1.5">
                {RESTRICTIONS.map((r) => {
                  const active = selectedRestrictions.includes(r.id);
                  return (
                    <motion.button
                      key={r.id}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => toggleList(selectedRestrictions, r.id, setSelectedRestrictions)}
                      data-testid={`chip-group-diet-${r.id}`}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 ${
                        active
                          ? "bg-foreground text-white"
                          : "bg-gray-50 border border-gray-100/60"
                      }`}
                      style={{
                        boxShadow: active ? "0 3px 10px rgba(0,0,0,0.1)" : "none",
                      }}
                    >
                      <span className="text-xs">{r.icon}</span>
                      <span>{r.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Your Group"
            icon={Users}
            iconColor="#00B14F"
            summary={groupSummary}
            expanded={expandedSection === "group"}
            onToggle={() => toggleSection("group")}
            testId="section-group"
          >
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">Who are you with?</p>
              <div className="grid grid-cols-4 gap-1.5">
                {GROUP_TYPES.map((g) => {
                  const Icon = g.icon;
                  const active = selectedGroupType === g.id;
                  return (
                    <motion.button
                      key={g.id}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setSelectedGroupType(active ? "" : g.id)}
                      data-testid={`chip-group-type-${g.id}`}
                      className={`flex flex-col items-center gap-1 py-2.5 px-1.5 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-white border-2 border-foreground"
                          : "bg-gray-50 border border-gray-100/60"
                      }`}
                      style={{
                        boxShadow: active ? "0 3px 12px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      <Icon className="w-4.5 h-4.5 transition-colors" style={{ color: active ? g.color : "#999" }} />
                      <span className={`text-[10px] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{g.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100/60">
              <button
                onClick={handleInvite}
                data-testid="button-invite-line"
                className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-gray-100 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#00C300" }}
                >
                  <UserPlus className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[13px] font-bold text-foreground">
                    {inviteStatus === "sending" ? "Opening LINE..." : inviteStatus === "sent" ? "Invite Sent!" : "Invite via LINE"}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {inviteStatus === "sending" ? "Select friends to invite" : "Send to friends or group chat"}
                  </p>
                </div>
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white/80 backdrop-blur-md border-t border-gray-100/60 px-5 py-3.5 pb-5 safe-bottom">
        <button
          onClick={async () => {
            const sessionId = await getOrCreateSessionId();
            if (profile) {
              sessionStorage.setItem("toast_group_host_profile", JSON.stringify(profile));
              localStorage.setItem("toast_guest_profile", JSON.stringify(profile));
            }
            sessionStorage.setItem("toast_group_host_session", sessionId);
            navigate(`/group/waiting?session=${sessionId}`);
          }}
          data-testid="button-start-session"
          className="w-full py-4 rounded-2xl bg-[#FFCC02] text-[#2d2000] font-bold text-[15px] active:scale-[0.97] transition-transform duration-200 flex items-center justify-center gap-2"
          style={{ boxShadow: "0 8px 25px -5px rgba(255,204,2,0.4)" }}
        >
          <Sparkles className="w-4 h-4" />
          Start Session
        </button>
      </div>
    </div>
  );
}
