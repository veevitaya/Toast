import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowLeft, Share2, Users, MapPin, Calendar,
  Clock, Utensils, Heart, Baby, Briefcase,
  ChevronRight, Sparkles, UserPlus,
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

const TIME_SLOTS = [
  { id: "now", label: "Right now", sub: "Let's go!" },
  { id: "lunch", label: "Lunch", sub: "11:30 - 14:00" },
  { id: "dinner", label: "Dinner", sub: "17:30 - 21:00" },
  { id: "latenight", label: "Late night", sub: "After 21:00" },
];

export default function GroupSetup() {
  const [, navigate] = useLocation();
  const { profile } = useLineProfile();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [inviteSent, setInviteSent] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

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

  const completedSteps = [
    selectedGroupType,
    selectedTime,
    selectedLocations.length > 0,
    selectedBudget,
  ].filter(Boolean).length;

  return (
    <div className="w-full h-[100dvh] bg-[#FAF7F2] flex flex-col overflow-hidden" data-testid="group-setup-page">
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
              <Users className="w-4 h-4 text-[#00B14F]" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground">Who's coming?</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
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
          </motion.div>
        </div>

        <div className="px-5 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#FFCC02]" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground">When?</h2>
              <span className="text-[10px] text-muted-foreground ml-auto">Optional</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((t) => {
                const active = selectedTime === t.id;
                return (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSelectedTime(active ? "" : t.id)}
                    data-testid={`chip-time-${t.id}`}
                    className={`flex flex-col items-center gap-0.5 py-3 px-2 rounded-2xl text-center transition-all duration-200 ${
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
                    <span className={`text-[12px] font-bold ${active ? "text-white" : "text-foreground"}`}>{t.label}</span>
                    <span className={`text-[9px] ${active ? "text-white/70" : "text-muted-foreground"}`}>{t.sub}</span>
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
            transition={{ delay: 0.2 }}
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
            transition={{ delay: 0.25 }}
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
            transition={{ delay: 0.3 }}
          >
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
