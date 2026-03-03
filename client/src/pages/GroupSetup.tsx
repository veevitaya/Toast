import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronRight, ArrowLeft, Share2 } from "lucide-react";
import { sendGroupInvite, isLiffAvailable } from "@/lib/liff";
import { useLineProfile } from "@/lib/useLineProfile";

const LOCATIONS_GROUP = [
  { emoji: "🍢", label: "Street food" },
  { emoji: "🍽️", label: "Restaurants" },
  { emoji: "🚇", label: "Near BTS" },
  { emoji: "🏬", label: "At the mall" },
  { emoji: "🌙", label: "Late night" },
  { emoji: "🏙️", label: "Rooftops" },
];

const BUDGETS_GROUP = [
  { label: "฿ Cheap" },
  { label: "฿฿ Moderate" },
  { label: "฿฿฿ Fancy" },
  { label: "฿฿฿฿ Expensive" },
];

const DIET_GROUP = [
  { emoji: "🥬", label: "Vegan" },
  { emoji: "🕌", label: "Halal" },
  { emoji: "🌾", label: "Gluten-Free" },
  { emoji: "🐷", label: "No Pork" },
  { emoji: "🥓", label: "Keto" },
  { emoji: "🥛", label: "Dairy-Free" },
];

const staggerIn = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3, ease: [0.4, 0, 0.2, 1] as number[] },
});

export default function GroupSetup() {
  const [, navigate] = useLocation();
  const { profile } = useLineProfile();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [inviteSent, setInviteSent] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

  const toggleList = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (list.includes(item)) setter(list.filter((i) => i !== item));
    else if (list.length < 3) setter([...list, item]);
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

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col overflow-hidden" data-testid="group-setup-page">
      <div className="flex-shrink-0 bg-white border-b border-gray-100/60 z-40">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center active:scale-90 transition-all duration-200 flex-shrink-0"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-foreground" />
          </button>
          <h1 className="text-[17px] font-semibold flex-1" data-testid="text-page-title">Group Session</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <motion.div {...staggerIn(0.05)}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 mt-2">Area</h2>
          <div className="w-full h-40 rounded-2xl overflow-hidden mb-5 border border-gray-100"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <iframe
              title="Location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=100.50%2C13.73%2C100.56%2C13.76&layer=mapnik&marker=13.7466%2C100.5393"
              className="w-full h-full border-0"
              style={{ filter: "saturate(0.9) contrast(0.92) brightness(1.05)" }}
            />
          </div>
        </motion.div>

        <motion.div {...staggerIn(0.1)}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Setting</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {LOCATIONS_GROUP.map((l) => (
              <button
                key={l.label}
                onClick={() => toggleList(selectedLocations, l.label, setSelectedLocations)}
                data-testid={`chip-group-location-${l.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-250 active:scale-[0.94] gpu-accelerated ${
                  selectedLocations.includes(l.label)
                    ? "bg-foreground text-white"
                    : "bg-white border border-gray-200/80 hover:border-gray-300"
                }`}
                style={selectedLocations.includes(l.label) ? { boxShadow: "0 6px 20px -4px rgba(0,0,0,0.15)" } : {}}
              >
                <span className={`text-lg inline-block transition-transform duration-300 ${selectedLocations.includes(l.label) ? "scale-110" : ""}`}>{l.emoji}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div {...staggerIn(0.15)}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Budget</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {BUDGETS_GROUP.map((b) => (
              <button
                key={b.label}
                onClick={() => setSelectedBudget(b.label)}
                data-testid={`chip-group-budget-${b.label.split(' ')[1]?.toLowerCase()}`}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-250 active:scale-[0.94] gpu-accelerated ${
                  selectedBudget === b.label
                    ? "bg-foreground text-white"
                    : "bg-white border border-gray-200/80 hover:border-gray-300"
                }`}
                style={selectedBudget === b.label ? { boxShadow: "0 6px 20px -4px rgba(0,0,0,0.15)" } : {}}
              >
                {b.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div {...staggerIn(0.2)}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Diet</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {DIET_GROUP.map((d) => (
              <button
                key={d.label}
                onClick={() => toggleList(selectedDiet, d.label, setSelectedDiet)}
                data-testid={`chip-group-diet-${d.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-250 active:scale-[0.94] gpu-accelerated ${
                  selectedDiet.includes(d.label)
                    ? "bg-foreground text-white"
                    : "bg-white border border-gray-200/80 hover:border-gray-300"
                }`}
                style={selectedDiet.includes(d.label) ? { boxShadow: "0 6px 20px -4px rgba(0,0,0,0.15)" } : {}}
              >
                <span className={`text-lg inline-block transition-transform duration-300 ${selectedDiet.includes(d.label) ? "scale-110" : ""}`}>{d.emoji}</span>
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div {...staggerIn(0.25)}>
          <button
            onClick={handleInvite}
            data-testid="button-invite-line"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200/80 bg-white active:scale-[0.97] transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-200/80">
              <Share2 className="w-4 h-4 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold text-[#1A1A1A]">
                {inviteSent ? "Invite Sent!" : "Invite via LINE"}
              </span>
              <p className="text-xs text-muted-foreground">Share with your group</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        </motion.div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-100/60 px-6 py-4 pb-5 safe-bottom">
        <button
          onClick={async () => {
            const sessionId = await getOrCreateSessionId();
            navigate(`/group/waiting?session=${sessionId}`);
          }}
          data-testid="button-start-session"
          className="w-full py-4 rounded-full bg-foreground text-white font-bold text-[15px] active:scale-[0.97] transition-transform duration-200"
          style={{ boxShadow: "0 8px 25px -5px rgba(0,0,0,0.25)" }}
        >
          Start Session
        </button>
      </div>
    </div>
  );
}
