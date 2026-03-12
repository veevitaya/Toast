import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { TrendingUp, Copy, Check, X, Share2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import mascotImg from "@assets/toast_mascot_nobg.png";
import { sendGroupInvite, getAccessToken, getGroupInviteUrl } from "@/lib/liff";
import { useLineProfile } from "@/lib/useLineProfile";

interface SessionMember {
  id: number;
  sessionCode: string;
  lineUserId: string;
  displayName: string;
  pictureUrl: string | null;
  joinedAt: string;
}

interface SessionData {
  sessionCode: string;
  hostLineUserId: string;
  status: string;
  sessionType: string | null;
  sourceData: string | null;
}

function getHostProfile(): { userId: string; displayName: string; pictureUrl?: string } | null {
  try {
    const raw = sessionStorage.getItem("toast_group_host_profile");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function isHost(sessionId: string): boolean {
  return sessionStorage.getItem("toast_group_host_session") === sessionId;
}

export default function WaitingRoom() {
  const [, navigate] = useLocation();
  const sessionId = new URLSearchParams(window.location.search).get("session") || "";
  const hostOfSession = isHost(sessionId);
  const { profile: lineProfile, loading: profileLoading, isLineUser, authRequired: lineAuthRequired, triggerLineLogin } = useLineProfile({ requireAuth: !hostOfSession });

  const hostProfile = hostOfSession ? getHostProfile() : null;
  const [localGuestProfile, setLocalGuestProfile] = useState<{ userId: string; displayName: string; pictureUrl?: string } | null>(() => {
    try {
      const sessionRaw = localStorage.getItem(`toast_guest_${sessionId}`);
      if (sessionRaw) return JSON.parse(sessionRaw);
      const raw = sessionStorage.getItem("toast_guest_profile");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  });
  const profile = lineProfile || localGuestProfile || (hostOfSession ? (hostProfile || { userId: `host_${sessionId}`, displayName: "You" }) : null);
  const authRequired = lineAuthRequired && !localGuestProfile;

  const [members, setMembers] = useState<SessionMember[]>([]);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestJoining, setGuestJoining] = useState(false);
  const [lineLoginPending, setLineLoginPending] = useState(false);
  const [lineLoginError, setLineLoginError] = useState<string | null>(null);
  const joiningRef = useRef(false);

  const getUserLocation = useCallback(async (): Promise<{ latitude: string; longitude: string } | null> => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, maximumAge: 60000 });
      });
      return { latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() };
    } catch {
      return null;
    }
  }, []);

  const createOrJoinSession = useCallback(async () => {
    if (!profile || !sessionId || joiningRef.current) return;
    joiningRef.current = true;

    const loc = await getUserLocation();
    const accessToken = getAccessToken();

    try {
      if (hostOfSession) {
        const checkRes = await fetch(`/api/group/sessions/${sessionId}`);
        if (checkRes.ok) {
          setSessionCreated(true);
          const data = await checkRes.json();
          if (data.members) setMembers(data.members);
          if (data.session) setSessionInfo(data.session);
          return;
        }
      }

      const joinRes = await fetch(`/api/group/sessions/${sessionId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "X-Line-Access-Token": accessToken } : {}),
        },
        body: JSON.stringify({
          lineUserId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl || "",
          latitude: loc?.latitude,
          longitude: loc?.longitude,
        }),
      });

      if (joinRes.ok) {
        setSessionCreated(true);
        const data = await joinRes.json();
        if (data.members) setMembers(data.members);
        if (data.session) setSessionInfo(data.session);
      } else if (joinRes.status === 404) {
        const createRes = await fetch("/api/group/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { "X-Line-Access-Token": accessToken } : {}),
          },
          body: JSON.stringify({
            sessionCode: sessionId,
            hostLineUserId: profile.userId,
            hostDisplayName: profile.displayName,
            hostPictureUrl: profile.pictureUrl || "",
            latitude: loc?.latitude,
            longitude: loc?.longitude,
          }),
        });
        if (createRes.ok) {
          setSessionCreated(true);
        } else {
          setError("Could not create or join session. Please try again.");
        }
      } else {
        const errData = await joinRes.json().catch(() => null);
        setError(errData?.message || "Failed to join session. Please try again.");
      }

      if (loc && sessionId) {
        fetch(`/api/group/sessions/${sessionId}/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineUserId: profile.userId,
            latitude: loc.latitude,
            longitude: loc.longitude,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Session create/join failed:", err);
      setError("Failed to connect to session. Check your connection and try again.");
    } finally {
      joiningRef.current = false;
    }
  }, [profile, sessionId, getUserLocation, hostOfSession]);

  useEffect(() => {
    if (sessionCreated) return;
    const ready = hostOfSession
      ? !!profile && !!sessionId
      : !profileLoading && !!profile && !!sessionId;
    if (ready) {
      createOrJoinSession();
    }
  }, [profileLoading, profile, sessionId, hostOfSession, sessionCreated]);

  useEffect(() => {
    if (!sessionCreated || !sessionId) return;

    const pendingInvite = sessionStorage.getItem("toast_group_pending_invite");
    if (pendingInvite === sessionId) {
      sessionStorage.removeItem("toast_group_pending_invite");
      setTimeout(() => {
        setShowShareModal(true);
      }, 400);
    }
  }, [sessionCreated, sessionId]);

  useEffect(() => {
    if (!sessionCreated || !sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/group/sessions/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data.members);
          if (data.session) setSessionInfo(data.session);
          if (data.session?.status === "swiping") {
            navigate(`/group/swipe?session=${sessionId}`);
          }
        }
      } catch {}
    };

    fetchSession();
    const interval = setInterval(fetchSession, 2000);
    return () => clearInterval(interval);
  }, [sessionCreated, sessionId, navigate]);

  const handleInviteMore = () => {
    setLinkCopied(false);
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    const joinUrl = getGroupInviteUrl(sessionId);
    try {
      await navigator.clipboard.writeText(joinUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = joinUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const handleShareVieLine = async () => {
    const result = await sendGroupInvite(sessionId);
    if (result.method === "clipboard") {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const handleGuestJoin = async () => {
    if (!guestName.trim() || !sessionId) return;
    setGuestJoining(true);
    setError(null);
    const existingRaw = localStorage.getItem(`toast_guest_${sessionId}`);
    let guestUserId: string;
    if (existingRaw) {
      try {
        guestUserId = JSON.parse(existingRaw).userId;
      } catch {
        guestUserId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      }
    } else {
      guestUserId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
    const guestProf = { userId: guestUserId, displayName: guestName.trim() };
    localStorage.setItem(`toast_guest_${sessionId}`, JSON.stringify(guestProf));
    sessionStorage.setItem("toast_guest_profile", JSON.stringify(guestProf));
    localStorage.setItem("toast_guest_profile", JSON.stringify(guestProf));

    try {
      const joinRes = await fetch(`/api/group/sessions/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: guestUserId,
          displayName: guestName.trim(),
          pictureUrl: "",
        }),
      });

      if (joinRes.ok) {
        setLocalGuestProfile(guestProf);
        setSessionCreated(true);
        const data = await joinRes.json();
        if (data.members) setMembers(data.members);
        if (data.session) setSessionInfo(data.session);
      } else {
        sessionStorage.removeItem("toast_guest_profile");
        localStorage.removeItem(`toast_guest_${sessionId}`);
        const errData = await joinRes.json().catch(() => null);
        setError(errData?.message || "Could not join session. Please try again.");
      }
    } catch (err) {
      console.error("Guest join failed:", err);
      sessionStorage.removeItem("toast_guest_profile");
      localStorage.removeItem(`toast_guest_${sessionId}`);
      setError("Failed to connect. Check your connection and try again.");
    }
    setGuestJoining(false);
  };

  const memberCount = members.length;
  const canStart = memberCount >= 2;

  const handleStartSwiping = async () => {
    if (profile) {
      try {
        await fetch(`/api/group/sessions/${sessionId}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "swiping", lineUserId: profile.userId }),
        });
      } catch {}
    }
    navigate(`/group/swipe?session=${sessionId}`);
  };


  if (profileLoading && !hostOfSession) {
    return (
      <div className="w-full h-[100dvh] bg-[#FCFCFC] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground text-center mb-4">No session ID found. Start a new group from the home page.</p>
        <button
          onClick={() => navigate("/group")}
          className="px-6 py-3 rounded-full bg-foreground text-white font-bold text-sm"
          data-testid="button-new-group"
        >
          Start New Group
        </button>
        <BottomNav />
      </div>
    );
  }

  if (authRequired && !hostOfSession) {
    return (
      <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col items-center justify-center px-6" data-testid="line-permission-gate">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-32 h-32 bg-green-50/40 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[15%] w-40 h-40 bg-green-50/40 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="mb-5"
        >
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center"
            style={{ boxShadow: "0 8px 30px -6px rgba(234,179,8,0.15)" }}
          >
            <img src={mascotImg} alt="Toast mascot" className="h-12 w-12 object-contain" draggable={false} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[24px] font-bold mb-2 text-center"
        >
          Join the Session
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center text-sm mb-6 max-w-[280px]"
        >
          Enter your name so your friends know you've joined!
        </motion.p>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="w-full max-w-xs flex flex-col gap-3 mb-4"
        >
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGuestJoin(); }}
            placeholder="Your name"
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-[15px] font-medium text-center focus:outline-none focus:border-[#FFCC02] focus:ring-2 focus:ring-[#FFCC02]/20 transition-all"
            data-testid="input-guest-name"
            autoFocus
          />
          <button
            onClick={handleGuestJoin}
            disabled={!guestName.trim() || guestJoining}
            className={`w-full py-4 rounded-full font-bold text-[15px] transition-all active:scale-[0.96] ${
              guestName.trim()
                ? "bg-[#FFCC02] text-[#2d2000]"
                : "bg-gray-100 text-muted-foreground"
            }`}
            style={guestName.trim() ? { boxShadow: "var(--shadow-glow-primary)" } : {}}
            data-testid="button-join-session"
          >
            {guestJoining ? "Joining..." : "Join Session"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center" data-testid="text-guest-error">{error}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            onClick={async () => {
              setLineLoginPending(true);
              setLineLoginError(null);
              const success = await triggerLineLogin();
              if (!success) {
                setLineLoginPending(false);
                setLineLoginError("LINE login is not available right now. Please enter your name above to join.");
              }
            }}
            disabled={lineLoginPending}
            className={`w-full py-4 rounded-full font-bold text-[15px] text-white active:scale-[0.96] transition-all ${lineLoginPending ? "bg-[#00B900]/60" : "bg-[#00B900]"}`}
            style={{ boxShadow: "0 6px 20px -4px rgba(0,185,0,0.3)" }}
            data-testid="button-line-login"
          >
            {lineLoginPending ? "Connecting to LINE..." : "Continue with LINE"}
          </button>
          {lineLoginError && (
            <p className="text-amber-600 text-xs text-center mt-1" data-testid="text-line-login-error">{lineLoginError}</p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[11px] text-muted-foreground text-center mt-4 max-w-[240px]"
        >
          Session code: <span className="font-mono font-bold">{sessionId}</span>
        </motion.p>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-[#FCFCFC] flex flex-col items-center justify-center px-6 pb-20 relative overflow-hidden" data-testid="waiting-room-page">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-32 h-32 bg-amber-50/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[15%] w-40 h-40 bg-amber-50/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 200 }}
        className="mb-5"
      >
        <div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center"
          style={{ boxShadow: "0 8px 30px -6px rgba(234,179,8,0.15)" }}
        >
          <img src={mascotImg} alt="Toast mascot" className="h-12 w-12 object-contain animate-soft-bob gpu-accelerated" draggable={false} />
        </div>
      </motion.div>

      {isLineUser && profile && (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full mb-3"
          data-testid="badge-line-connected"
        >
          <div className="w-4 h-4 rounded-full overflow-hidden">
            {profile.pictureUrl ? (
              <img src={profile.pictureUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-green-200 flex items-center justify-center">
                <span className="text-[8px] font-bold text-green-700">{profile.displayName.charAt(0)}</span>
              </div>
            )}
          </div>
          <span className="text-[12px] font-semibold">Connected as {profile.displayName}</span>
        </motion.div>
      )}

      {sessionInfo?.sessionType === "trending" && (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full mb-3"
          data-testid="badge-trending-session"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-[12px] font-semibold">Trending Swipe Session</span>
        </motion.div>
      )}

      <motion.h1
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="text-[26px] font-semibold mb-2 text-center"
        data-testid="text-waiting-title"
      >
        {memberCount < 2 ? "Waiting for friends..." : "Ready to go!"}
      </motion.h1>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="flex gap-1">
          {members.map((m) => (
            <div
              key={m.lineUserId}
              className="w-2 h-2 rounded-full bg-[hsl(160,60%,45%)] transition-all duration-500"
            />
          ))}
          {memberCount < 2 && <div className="w-2 h-2 rounded-full bg-gray-200" />}
        </div>
        <span className="text-muted-foreground text-sm font-medium" data-testid="text-member-count">
          {memberCount} joined
        </span>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 mb-8 max-w-sm">
        {members.map((m, idx) => (
          <motion.div
            key={m.lineUserId}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + idx * 0.08, type: "spring", damping: 18, stiffness: 200 }}
            className="flex flex-col items-center gap-2"
            data-testid={`member-${m.lineUserId}`}
          >
            <div className="relative">
              <div
                className="w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] border-[hsl(160,60%,45%)] transition-all duration-500"
                style={{ boxShadow: "0 6px 20px -4px rgba(0,200,100,0.15)" }}
              >
                {m.pictureUrl ? (
                  <img src={m.pictureUrl} alt={m.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-amber-600">{m.displayName.charAt(0)}</span>
                  </div>
                )}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 300, delay: 0.15 }}
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[hsl(160,60%,45%)] flex items-center justify-center border-2 border-white"
              >
                <span className="text-white text-[10px] font-bold">✓</span>
              </motion.div>
            </div>
            <span className="text-sm font-bold">{m.lineUserId === profile?.userId ? "You" : m.displayName}</span>
            <span className="text-[11px] font-semibold text-[hsl(160,60%,45%)]">Ready</span>
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", damping: 18, stiffness: 200 }}
          className="flex flex-col items-center gap-2"
        >
          <button
            onClick={handleInviteMore}
            className="w-[72px] h-[72px] rounded-full border-[3px] border-dashed border-gray-200 flex items-center justify-center active:scale-[0.95] transition-transform"
            data-testid="button-invite-more"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="text-sm font-bold text-muted-foreground">Invite</span>
          <span className="text-[11px] font-semibold text-muted-foreground">via LINE</span>
        </motion.div>
      </div>

      {error && (
        <div className="flex flex-col items-center gap-2 mb-4">
          <p className="text-red-500 text-sm" data-testid="text-error">{error}</p>
          <button
            onClick={() => { setError(null); createOrJoinSession(); }}
            className="px-4 py-2 rounded-full bg-gray-100 text-sm font-semibold text-foreground active:scale-95 transition-transform"
            data-testid="button-retry-join"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <motion.button
          onClick={handleStartSwiping}
          data-testid="button-start-swiping"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`w-full py-4 rounded-full font-bold text-[15px] transition-all duration-500 active:scale-[0.96] gpu-accelerated ${
            canStart
              ? "bg-[#FFCC02] text-[#2d2000]"
              : "bg-gray-100 text-muted-foreground"
          }`}
          style={canStart ? { boxShadow: "var(--shadow-glow-primary)" } : {}}
          disabled={!canStart}
        >
          {canStart ? "Start Swiping!" : "Waiting for more friends..."}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[11px] text-muted-foreground text-center"
        >
          Session code: <span className="font-mono font-bold">{sessionId}</span>
        </motion.p>
      </div>

      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 flex items-end justify-center"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">Invite Friends</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  data-testid="button-close-share-modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Share this link with your friends:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-xl px-3 py-2.5 text-sm font-mono text-gray-700 truncate border border-gray-100" data-testid="text-invite-link">
                    {getGroupInviteUrl(sessionId)}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                      linkCopied ? "bg-green-500 text-white" : "bg-[#FFCC02] text-[#2d2000]"
                    }`}
                    data-testid="button-copy-link"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {linkCopied && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-600 font-semibold mt-2 text-center"
                  >
                    Link copied! Paste it in your chat.
                  </motion.p>
                )}
              </div>

              <button
                onClick={handleShareVieLine}
                className="w-full py-4 rounded-full font-bold text-[15px] text-white bg-[#00B900] active:scale-[0.96] transition-transform mb-3"
                style={{ boxShadow: "0 6px 20px -4px rgba(0,185,0,0.3)" }}
                data-testid="button-share-via-line"
              >
                <div className="flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share via LINE
                </div>
              </button>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 rounded-full font-semibold text-[14px] text-muted-foreground bg-gray-100 active:scale-[0.96] transition-transform"
                data-testid="button-done-sharing"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
