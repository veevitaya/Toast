import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowLeft, Users, MapPin, Calendar as CalendarIcon,
  Clock, Utensils, Heart, Baby, Briefcase,
  ChevronRight, ChevronLeft, Sparkles, UserPlus,
} from "lucide-react";
import { sendGroupInvite, isLiffAvailable } from "@/lib/liff";
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

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getMiniCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function isSameDay(a: Date | null, b: Date) {
  if (!a) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function GroupSetup() {
  const [, navigate] = useLocation();
  const { profile } = useLineProfile();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [inviteSent, setInviteSent] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (showTimePicker && hourScrollRef.current && selectedHour !== null) {
      const el = hourScrollRef.current.querySelector(`[data-hour="${selectedHour}"]`);
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [showTimePicker, selectedHour]);

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
    const sessionId = await getOrCreateSessionId();
    const appUrl = window.location.origin;

    if (isLiffAvailable()) {
      const shared = await sendGroupInvite(sessionId);
      if (shared) {
        setInviteSent(true);
        setTimeout(() => navigate(`/group/waiting?session=${sessionId}`), 800);
      }
    } else {
      const message = `Join my Toast session! Let's decide what to eat together.\n\n${appUrl}/group/waiting?session=${sessionId}`;
      const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
      window.location.href = lineShareUrl;
      setInviteSent(true);
      setTimeout(() => navigate(`/group/waiting?session=${sessionId}`), 2000);
    }
  };

  const calendarDays = getMiniCalendarDays(calendarYear, calendarMonth);

  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
    else setCalendarMonth(calendarMonth - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
    else setCalendarMonth(calendarMonth + 1);
  };

  const canGoPrev = calendarYear > today.getFullYear() || (calendarYear === today.getFullYear() && calendarMonth > today.getMonth());

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const completedSteps = [
    selectedDate || selectedHour !== null,
    selectedLocations.length > 0,
    selectedBudget,
    selectedGroupType,
  ].filter(Boolean).length;

  return (
    <div className="w-full h-[100dvh] bg-[#F7F7F7] flex flex-col overflow-hidden" data-testid="group-setup-page">
      <div className="flex-shrink-0 bg-white border-b border-gray-100/60 z-40">
        <div className="flex items-center gap-3 px-5 pt-12 pb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center active:scale-90 transition-all duration-200 flex-shrink-0"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-foreground" data-testid="text-page-title">Set up your session</h1>
            <p className="text-[11px] text-muted-foreground">Customize before you start swiping</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{ background: i < completedSteps ? "#FFCC02" : "#e5e5e5" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 hide-scrollbar">

        <div className="px-5 pt-4 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-4 h-4 text-[#FFCC02]" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground">When?</h2>
              <span className="text-[10px] text-muted-foreground ml-auto">Optional</span>
            </div>

            <div
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <button
                  onClick={prevMonth}
                  disabled={!canGoPrev}
                  className="w-7 h-7 rounded-full hover:bg-gray-50 flex items-center justify-center disabled:opacity-30 transition-colors"
                  data-testid="calendar-prev-month"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <span className="text-[13px] font-bold text-foreground">
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-7 h-7 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors"
                  data-testid="calendar-next-month"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </div>

              <div className="px-3 pt-2 pb-1">
                <div className="grid grid-cols-7 gap-0">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
                  ))}
                  {calendarDays.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} />;
                    const date = new Date(calendarYear, calendarMonth, day);
                    const isPast = date < today;
                    const isSelected = isSameDay(selectedDate, date);
                    const isToday = isSameDay(today, date);
                    return (
                      <button
                        key={`day-${day}`}
                        disabled={isPast}
                        onClick={() => {
                          if (isSelected) setSelectedDate(null);
                          else setSelectedDate(date);
                        }}
                        data-testid={`calendar-day-${day}`}
                        className={`relative w-full aspect-square flex items-center justify-center text-[12px] font-medium rounded-xl transition-all duration-150 ${
                          isPast
                            ? "text-gray-200 cursor-not-allowed"
                            : isSelected
                              ? "bg-foreground text-white font-bold"
                              : isToday
                                ? "text-foreground font-bold"
                                : "text-foreground hover:bg-gray-50 active:scale-90"
                        }`}
                      >
                        {day}
                        {isToday && !isSelected && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFCC02]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 pb-3 pt-1 border-t border-gray-50">
                <button
                  onClick={() => setShowTimePicker(!showTimePicker)}
                  data-testid="button-toggle-time"
                  className="w-full flex items-center gap-2.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors px-1"
                >
                  <Clock className="w-4 h-4 text-[#FFCC02]" />
                  <span className="text-[13px] font-semibold text-foreground flex-1 text-left">
                    {selectedHour !== null ? formatTime(selectedHour, selectedMinute) : "Add a time"}
                  </span>
                  {selectedHour !== null && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedHour(null); setSelectedMinute(0); setShowTimePicker(false); }}
                      className="text-[10px] text-muted-foreground bg-gray-100 rounded-full px-2 py-0.5 hover:bg-gray-200 transition-colors"
                      data-testid="button-clear-time"
                    >
                      Clear
                    </button>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground/40 transition-transform duration-200 ${showTimePicker ? "rotate-90" : ""}`} />
                </button>

                <AnimatePresence>
                  {showTimePicker && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-3 pt-2">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Hour</p>
                          <div ref={hourScrollRef} className="h-[140px] overflow-y-auto hide-scrollbar rounded-xl bg-gray-50 py-1">
                            {HOURS.map((h) => {
                              const active = selectedHour === h;
                              const period = h >= 12 ? "PM" : "AM";
                              const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
                              return (
                                <button
                                  key={h}
                                  data-hour={h}
                                  onClick={() => setSelectedHour(h)}
                                  data-testid={`time-hour-${h}`}
                                  className={`w-full text-center py-2 text-[13px] font-medium transition-colors rounded-lg mx-auto ${
                                    active
                                      ? "bg-foreground text-white font-bold"
                                      : "text-foreground hover:bg-gray-100"
                                  }`}
                                >
                                  {displayH} {period}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="w-[90px]">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Minute</p>
                          <div className="flex flex-col gap-1">
                            {MINUTES.map((m) => {
                              const active = selectedMinute === m;
                              return (
                                <button
                                  key={m}
                                  onClick={() => setSelectedMinute(m)}
                                  data-testid={`time-minute-${m}`}
                                  className={`w-full text-center py-2.5 text-[13px] font-medium transition-colors rounded-xl ${
                                    active
                                      ? "bg-foreground text-white font-bold"
                                      : "bg-gray-50 text-foreground hover:bg-gray-100"
                                  }`}
                                >
                                  :{m.toString().padStart(2, "0")}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {(selectedDate || selectedHour !== null) && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 px-1"
              >
                <span className="text-[11px] text-muted-foreground">
                  {selectedDate ? `${DAY_NAMES[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}` : ""}
                  {selectedDate && selectedHour !== null ? " at " : ""}
                  {selectedHour !== null ? formatTime(selectedHour, selectedMinute) : ""}
                </span>
                <button
                  onClick={() => { setSelectedDate(null); setSelectedHour(null); setSelectedMinute(0); setShowTimePicker(false); }}
                  className="text-[10px] text-[#E11D48] font-semibold ml-auto"
                  data-testid="button-clear-datetime"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="px-5 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#E11D48]" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground">Where?</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LOCATIONS.map((l) => {
                const active = selectedLocations.includes(l.id);
                return (
                  <motion.button
                    key={l.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggleList(selectedLocations, l.id, setSelectedLocations)}
                    data-testid={`chip-group-location-${l.id}`}
                    className={`flex items-center gap-2 py-3 px-3 rounded-2xl text-left transition-all duration-200 ${
                      active
                        ? "bg-foreground text-white"
                        : "bg-white border border-gray-100"
                    }`}
                    style={{
                      boxShadow: active
                        ? "0 4px 16px rgba(0,0,0,0.15)"
                        : "0 1px 4px rgba(0,0,0,0.03)",
                    }}
                  >
                    <span className="text-lg flex-shrink-0">{l.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-[11px] font-semibold truncate ${active ? "text-white" : "text-foreground"}`}>{l.label}</p>
                      <p className={`text-[9px] truncate ${active ? "text-white/60" : "text-muted-foreground"}`}>{l.sub}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="px-5 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#FFCC02]" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground">Budget</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {BUDGETS.map((b) => {
                const active = selectedBudget === b.id;
                return (
                  <motion.button
                    key={b.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSelectedBudget(active ? "" : b.id)}
                    data-testid={`chip-group-budget-${b.id}`}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all duration-200 ${
                      active
                        ? "bg-white border-2 border-foreground"
                        : "bg-white border border-gray-100"
                    }`}
                    style={{
                      boxShadow: active
                        ? "0 4px 16px rgba(0,0,0,0.1)"
                        : "0 1px 4px rgba(0,0,0,0.03)",
                    }}
                  >
                    <span
                      className="text-[14px] font-bold"
                      style={{ color: active ? b.color : "#999" }}
                    >
                      {b.icon}
                    </span>
                    <span className={`text-[10px] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{b.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="px-5 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-[#6C2BD9]" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground">Dietary needs</h2>
              <span className="text-[10px] text-muted-foreground ml-auto">Optional</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {RESTRICTIONS.map((r) => {
                const active = selectedRestrictions.includes(r.id);
                return (
                  <motion.button
                    key={r.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggleList(selectedRestrictions, r.id, setSelectedRestrictions)}
                    data-testid={`chip-group-diet-${r.id}`}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium transition-all duration-200 ${
                      active
                        ? "bg-foreground text-white"
                        : "bg-white border border-gray-100"
                    }`}
                    style={{
                      boxShadow: active
                        ? "0 4px 12px rgba(0,0,0,0.12)"
                        : "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    <span className="text-sm">{r.icon}</span>
                    <span>{r.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="px-5 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#00B14F]" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground">Who's coming?</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {GROUP_TYPES.map((g) => {
                const Icon = g.icon;
                const active = selectedGroupType === g.id;
                return (
                  <motion.button
                    key={g.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSelectedGroupType(active ? "" : g.id)}
                    data-testid={`chip-group-type-${g.id}`}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all duration-200 ${
                      active
                        ? "bg-white border-2 border-foreground"
                        : "bg-white border border-gray-100"
                    }`}
                    style={{
                      boxShadow: active
                        ? "0 4px 16px rgba(0,0,0,0.1)"
                        : "0 1px 4px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background: active ? `${g.color}15` : "#f5f5f5" }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: active ? g.color : "#999" }} />
                    </div>
                    <span className={`text-[11px] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{g.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <button
                onClick={handleInvite}
                data-testid="button-invite-line"
                className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#00C300" }}
                >
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[14px] font-bold text-foreground">
                    {inviteSent ? "Invite Sent!" : "Invite via LINE"}
                  </span>
                  <p className="text-[11px] text-muted-foreground">Send to friends or group chat</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-100/60 px-5 py-4 pb-5 safe-bottom">
        <button
          onClick={async () => {
            const sessionId = await getOrCreateSessionId();
            navigate(`/group/waiting?session=${sessionId}`);
          }}
          data-testid="button-start-session"
          className="w-full py-4 rounded-2xl bg-foreground text-white font-bold text-[15px] active:scale-[0.97] transition-transform duration-200 flex items-center justify-center gap-2"
          style={{ boxShadow: "0 8px 25px -5px rgba(0,0,0,0.25)" }}
        >
          <Sparkles className="w-4 h-4" />
          Start Session
        </button>
      </div>
    </div>
  );
}
