import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { TrendingUp, Copy, Check, X, Share2, MapPin, Navigation, Search, ArrowLeft, Sparkles, Plus } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import mascotImg from "@assets/toast_mascot_nobg.png";
import { sendGroupInviteNoRedirect, getAccessToken, getGroupInviteUrl, getLineGroupId } from "@/lib/liff";
import { useLineProfile } from "@/lib/useLineProfile";
import { getSavedDisplayName, getOnboardingProfile } from "@/hooks/use-onboarding";
import { fetchWithTimeout } from "@/lib/queryClient";
import { useLanguage } from "@/i18n/LanguageProvider";

const BANGKOK_LOCATIONS = [
  { name: "Ari", lat: "13.7710", lng: "100.5450" },
  { name: "Chinatown", lat: "13.7410", lng: "100.5100" },
  { name: "Ekkamai", lat: "13.7310", lng: "100.5690" },
  { name: "Old Town", lat: "13.7560", lng: "100.5018" },
  { name: "Riverside", lat: "13.7230", lng: "100.5130" },
  { name: "Sathorn", lat: "13.7220", lng: "100.5290" },
  { name: "Siam", lat: "13.7454", lng: "100.5341" },
  { name: "Silom", lat: "13.7285", lng: "100.5310" },
  { name: "Sukhumvit", lat: "13.7420", lng: "100.5400" },
  { name: "Thonglor", lat: "13.7320", lng: "100.5783" },
];

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
  hostDisplayName?: string;
  locationName?: string | null;
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
  const { t } = useLanguage();
  const sessionId = new URLSearchParams(window.location.search).get("session") || "";
  const hostOfSession = isHost(sessionId);
  const { profile: lineProfile, loading: profileLoading, isLineUser } = useLineProfile({ requireAuth: false });

  const hostProfile = hostOfSession ? getHostProfile() : null;

  const [localGuestProfile, setLocalGuestProfile] = useState<{ userId: string; displayName: string; pictureUrl?: string } | null>(() => {
    if (!sessionId || hostOfSession) return null;
    try {
      const sessionRaw = localStorage.getItem(`toast_guest_${sessionId}`);
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed.joinedAsGuest) return parsed;
      }
    } catch {}
    return null;
  });

  const inviteeLineProfile = !hostOfSession && isLineUser ? lineProfile : null;

  const hasKnownIdentity = !!getOnboardingProfile() || !!getSavedDisplayName() || !!localGuestProfile || !!inviteeLineProfile;

  const profile = hostOfSession
    ? (lineProfile || hostProfile || { userId: `host_${sessionId}`, displayName: "Host" })
    : (localGuestProfile || inviteeLineProfile || (hasKnownIdentity ? lineProfile : null));
  const needsNameEntry = !profile && !hostOfSession && !profileLoading;

  const [members, setMembers] = useState<SessionMember[]>([]);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [guestName, setGuestName] = useState(() => getSavedDisplayName() || "");
  const [guestJoining, setGuestJoining] = useState(false);
  const joiningRef = useRef(false);
  const [sessionLocationName, setSessionLocationName] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

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

    const accessToken = getAccessToken();

    try {
      if (hostOfSession) {
        const checkRes = await fetchWithTimeout(`/api/group/sessions/${sessionId}`);
        if (checkRes.status === 410) {
          setSessionExpired(true);
          return;
        }
        if (checkRes.ok) {
          setSessionCreated(true);
          const data = await checkRes.json();
          if (data.members) setMembers(data.members);
          if (data.session) setSessionInfo(data.session);
          if (data.session?.status === "completed") {
            setSessionCompleted(true);
          }
          return;
        }
      }

      const loc = await getUserLocation();

      const joinRes = await fetchWithTimeout(`/api/group/sessions/${sessionId}/join`, {
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
          lineGroupId: getLineGroupId() || undefined,
        }),
      });

      if (joinRes.status === 410) {
        setSessionExpired(true);
      } else if (joinRes.ok) {
        setSessionCreated(true);
        const data = await joinRes.json();
        if (data.members) setMembers(data.members);
        if (data.session) setSessionInfo(data.session);
      } else if (joinRes.status === 404) {
        const createRes = await fetchWithTimeout("/api/group/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { "X-Line-Access-Token": accessToken } : {}),
          },
          body: JSON.stringify({
            hostLineUserId: profile.userId,
            hostDisplayName: profile.displayName,
            hostPictureUrl: profile.pictureUrl || "",
            latitude: loc?.latitude,
            longitude: loc?.longitude,
            lineGroupId: getLineGroupId() || undefined,
          }),
        });
        if (createRes.ok) {
          const createdSession = await createRes.json();
          if (createdSession.sessionCode && createdSession.sessionCode !== sessionId) {
            const newUrl = `/group/waiting?session=${createdSession.sessionCode}&host=true`;
            window.location.replace(newUrl);
            return;
          }
          setSessionCreated(true);
        } else {
          const retryJoin = await fetchWithTimeout(`/api/group/sessions/${sessionId}/join`, {
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
          if (retryJoin.ok) {
            setSessionCreated(true);
            const data = await retryJoin.json();
            if (data.members) setMembers(data.members);
            if (data.session) setSessionInfo(data.session);
          } else {
            setError(t("waiting.error_create_join"));
          }
        }
      } else {
        const errData = await joinRes.json().catch(() => null);
        setError(errData?.message || t("waiting.error_join"));
      }

      if (loc && sessionId) {
        fetchWithTimeout(`/api/group/sessions/${sessionId}/location`, {
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

  const tasteSyncedRef = useRef(false);
  useEffect(() => {
    if (!sessionCreated || !sessionId || !profile?.userId) return;
    if (tasteSyncedRef.current) return;
    let raw: string | null = null;
    try { raw = sessionStorage.getItem("toast_group_taste"); } catch {}
    if (!raw) return;
    let taste: { mood?: string; cuisines?: string[]; budget?: number; diet?: string[] };
    try { taste = JSON.parse(raw); } catch { return; }
    tasteSyncedRef.current = true;
    const lineToken = getAccessToken();
    fetchWithTimeout(`/api/group/sessions/${sessionId}/taste`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(lineToken ? { "X-Line-Access-Token": lineToken } : {}),
      },
      body: JSON.stringify({
        lineUserId: profile.userId,
        mood: taste.mood ?? null,
        cuisines: Array.isArray(taste.cuisines) ? taste.cuisines : [],
        budget: typeof taste.budget === "number" ? taste.budget : null,
        diet: Array.isArray(taste.diet) ? taste.diet : [],
      }),
    })
      .then((res) => {
        if (!res.ok) {
          tasteSyncedRef.current = false;
          console.warn("[WaitingRoom] taste sync failed", res.status);
        }
      })
      .catch(() => { tasteSyncedRef.current = false; });
  }, [sessionCreated, sessionId, profile?.userId]);

  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionDeleted, setSessionDeleted] = useState(false);

  useEffect(() => {
    if (!sessionCreated || !sessionId) return;
    const controller = new AbortController();

    const fetchSession = async () => {
      try {
        const res = await fetchWithTimeout(`/api/group/sessions/${sessionId}`, {
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          setMembers(data.members);
          if (data.session) {
            setSessionInfo(data.session);
            if (data.session.locationName && !sessionLocationName) {
              setSessionLocationName(data.session.locationName);
            }
          }
          if (data.session?.status === "swiping") {
            navigate(`/group/swipe?session=${sessionId}`);
          }
          if (data.session?.status === "completed") {
            setSessionCompleted(true);
          }
          if (data.session?.status === "deleted") {
            setSessionDeleted(true);
          }
        } else if (res.status === 410) {
          setSessionExpired(true);
        } else if (res.status === 404) {
          setSessionDeleted(true);
        }
      } catch {}
    };

    fetchSession();
    const interval = setInterval(fetchSession, 4000);
    return () => { clearInterval(interval); controller.abort(); };
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
    const result = await sendGroupInviteNoRedirect(sessionId);
    if (result.method === "clipboard") {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
    if (result.shared) {
      setShowShareModal(false);
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
      const globalGuest = localStorage.getItem("toast_guest_profile");
      if (globalGuest) {
        try {
          guestUserId = JSON.parse(globalGuest).userId;
        } catch {
          guestUserId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        }
      } else {
        guestUserId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      }
    }
    const guestProf = { userId: guestUserId, displayName: guestName.trim(), joinedAsGuest: true };
    localStorage.setItem(`toast_guest_${sessionId}`, JSON.stringify(guestProf));
    sessionStorage.setItem("toast_guest_profile", JSON.stringify(guestProf));
    localStorage.setItem("toast_guest_profile", JSON.stringify(guestProf));

    const existingOnboarding = localStorage.getItem("toast_user_profile");
    if (!existingOnboarding) {
      localStorage.setItem("toast_user_profile", JSON.stringify({
        displayName: guestName.trim(),
        cuisinePreferences: [],
        dietaryRestrictions: [],
        defaultBudget: 2,
        defaultDistance: "3000",
        pictureUrl: "",
        partnerName: "",
        partnerPictureUrl: "",
        partnerLinked: false,
        onboardingComplete: true,
      }));
    } else {
      try {
        const parsed = JSON.parse(existingOnboarding);
        if (!parsed.displayName) {
          parsed.displayName = guestName.trim();
          parsed.onboardingComplete = true;
          localStorage.setItem("toast_user_profile", JSON.stringify(parsed));
        }
      } catch {}
    }

    try {
      const joinRes = await fetchWithTimeout(`/api/group/sessions/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: guestUserId,
          displayName: guestName.trim(),
          pictureUrl: "",
          lineGroupId: getLineGroupId() || undefined,
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
  const isActuallyHost =
    hostOfSession ||
    (!!sessionInfo && !!profile && profile.userId === sessionInfo.hostLineUserId);

  const handleStartSwiping = async () => {
    if (!isActuallyHost || !profile) return;
    try {
      const res = await fetchWithTimeout(`/api/group/sessions/${sessionId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "swiping", lineUserId: profile.userId }),
      });
      if (res.ok) {
        navigate(`/group/swipe?session=${sessionId}`);
      }
    } catch {}
  };


  if (profileLoading && !hostOfSession) {
    return (
      <div className="w-full h-[100dvh] bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="w-full h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground text-center mb-4">No session ID found. Start a new group from the home page.</p>
        <button
          onClick={() => navigate("/group")}
          className="px-6 py-3 rounded-full bg-foreground text-white font-bold text-sm"
          data-testid="button-new-group"
        >
          {t("waiting.start_new_group")}
        </button>
        <BottomNav />
      </div>
    );
  }

  if (needsNameEntry && !hostOfSession) {
    return (
      <div className="w-full h-[100dvh] bg-background flex flex-col items-center justify-center px-6" data-testid="join-session-gate">
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
            className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center"
            style={{ boxShadow: "0 8px 30px -6px rgba(234,179,8,0.15)" }}
          >
            <img src={mascotImg} alt="Toast mascot" className="h-20 w-20 object-contain" draggable={false} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[24px] font-bold mb-2 text-center"
        >
          {t("waiting.join_session_title")}
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center text-sm mb-6 max-w-[280px]"
        >
          {t("waiting.join_session_desc")}
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
            placeholder={t("waiting.your_name")}
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
            {guestJoining ? t("waiting.joining") : t("waiting.join_session")}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center" data-testid="text-guest-error">{error}</p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[11px] text-muted-foreground text-center mt-2 max-w-[240px]"
        >
          {t("waiting.session_code")} <span className="font-mono font-bold">{sessionId}</span>
        </motion.p>

        <BottomNav />
      </div>
    );
  }

  if (sessionCompleted && sessionId) {
    navigate(`/group/swipe?session=${sessionId}`);
    return null;
  }

  if (sessionExpired || sessionDeleted) {
    return (
      <div className="w-full h-[100dvh] bg-background flex flex-col items-center justify-center px-6" data-testid="session-ended-page">
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
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <img src={mascotImg} alt="Toast mascot" className="h-20 w-20 object-contain opacity-60" draggable={false} />
          </div>
        </motion.div>
        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[22px] font-bold mb-2 text-center"
        >
          {sessionDeleted ? t("waiting.session_removed") : t("waiting.session_expired")}
        </motion.h1>
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center text-sm mb-6 max-w-[280px]"
          data-testid="text-session-ended-message"
        >
          {sessionDeleted
            ? t("waiting.session_removed_desc")
            : t("waiting.session_expired_desc")}
        </motion.p>
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3"
        >
          <button
            onClick={() => navigate("/group")}
            className="px-6 py-3 rounded-full bg-[#FFCC02] text-[#2d2000] font-bold text-sm active:scale-[0.96] transition-transform"
            style={{ boxShadow: "var(--shadow-glow-primary)" }}
            data-testid="button-new-session"
          >
            New Session
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full bg-gray-100 text-foreground font-bold text-sm active:scale-[0.96] transition-transform"
            data-testid="button-go-home"
          >
            Home
          </button>
        </motion.div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] flex flex-col bg-background" style={{ color: "#1A1A1A" }} data-testid="waiting-room-page">
      <header className="flex items-center justify-between px-6 pt-14 pb-2">
        <button
          aria-label="Go back"
          data-testid="button-back"
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9A938A]">
          Waiting room
        </span>
      </header>

      <main className="flex-1 px-6 pb-44 pt-3">
        <div className="mb-5">
          <h1 className="text-[28px] font-bold tracking-tight leading-tight" data-testid="text-waiting-title">
            {memberCount < 2 ? "Who's in?" : "Everyone's here"}
          </h1>
          <p className="text-[15px] mt-2 leading-relaxed text-[#1A1A1A]/60">
            Your crew's joining from the LINE invite. Hit start once everyone's here.
          </p>
        </div>

        {isLineUser && profile && (
          <div className="inline-flex items-center gap-2 bg-[#06C755]/10 text-[#06C755] px-3 py-1.5 rounded-full mb-4" data-testid="badge-line-connected">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
            <span className="text-[12px] font-semibold">Connected as {profile.displayName}</span>
          </div>
        )}

        <div className="rounded-[28px] bg-white p-5" style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            {sessionInfo?.sessionType === "trending" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#FAF6EF]" data-testid="badge-trending-session">
                <TrendingUp className="w-3.5 h-3.5 text-[#9A938A]" /> Trending
              </span>
            )}
            {isActuallyHost && sessionCreated ? (
              <button
                data-testid="button-set-location"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#FAF6EF] active:scale-95 transition-transform"
              >
                <MapPin className="w-3.5 h-3.5 text-[#9A938A]" /> {sessionLocationName || "Set location"}
              </button>
            ) : sessionInfo?.locationName ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#FAF6EF]" data-testid="text-session-location">
                <MapPin className="w-3.5 h-3.5 text-[#9A938A]" /> {sessionInfo.locationName}
              </span>
            ) : null}
            {isActuallyHost && sessionCreated && (
              <button
                data-testid="button-invite-chip"
                onClick={handleInviteMore}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#06C755]/10 text-[#06C755] active:scale-95 transition-transform"
              >
                <Share2 className="w-3.5 h-3.5" /> Invite
              </button>
            )}
          </div>

          <AnimatePresence>
            {isActuallyHost && sessionCreated && showLocationPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mb-5 space-y-2">
                  <button
                    onClick={async () => {
                      setDetectingLocation(true);
                      try {
                        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, maximumAge: 60000 });
                        });
                        const lat = pos.coords.latitude.toString();
                        const lng = pos.coords.longitude.toString();
                        let nearest = BANGKOK_LOCATIONS[0];
                        let minDist = Infinity;
                        for (const loc of BANGKOK_LOCATIONS) {
                          const d = Math.hypot(parseFloat(loc.lat) - pos.coords.latitude, parseFloat(loc.lng) - pos.coords.longitude);
                          if (d < minDist) { minDist = d; nearest = loc; }
                        }
                        setSessionLocationName(nearest.name);
                        setShowLocationPicker(false);
                        try {
                          await fetchWithTimeout(`/api/group/sessions/${sessionId}/session-location`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ lineUserId: profile?.userId, locationName: nearest.name, locationLat: lat, locationLng: lng }),
                          });
                        } catch {}
                      } catch {
                        setDetectingLocation(false);
                      }
                      setDetectingLocation(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FAF6EF] text-[#1A1A1A] active:scale-[0.97] transition-all"
                    disabled={detectingLocation}
                    data-testid="button-use-current-location"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? "animate-pulse" : ""}`} />
                    {detectingLocation ? "Detecting location..." : "Use my current location"}
                  </button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A938A]" />
                    <input
                      type="text"
                      placeholder="Search area..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-black/[0.08] text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#FFCC02]"
                      data-testid="input-location-search"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2" data-testid="location-picker-grid">
                    {BANGKOK_LOCATIONS.filter((loc) =>
                      !locationSearch || loc.name.toLowerCase().includes(locationSearch.toLowerCase())
                    ).map((loc) => (
                      <button
                        key={loc.name}
                        onClick={async () => {
                          setSessionLocationName(loc.name);
                          setShowLocationPicker(false);
                          setLocationSearch("");
                          try {
                            await fetchWithTimeout(`/api/group/sessions/${sessionId}/session-location`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                lineUserId: profile?.userId,
                                locationName: loc.name,
                                locationLat: loc.lat,
                                locationLng: loc.lng,
                              }),
                            });
                          } catch {}
                        }}
                        className={`px-3 py-2 rounded-xl text-[13px] font-medium transition-all active:scale-[0.96] ${
                          sessionLocationName === loc.name
                            ? "bg-[#FFCC02] text-[#1A1A1A]"
                            : "bg-[#FAF6EF] text-[#1A1A1A]"
                        }`}
                        data-testid={`location-option-${loc.name.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col items-center text-center">
            <motion.img
              src={mascotImg}
              alt="Toast mascot"
              className="h-24 w-24 object-contain"
              draggable={false}
              animate={canStart ? { y: 0 } : { y: [0, -7, 0] }}
              transition={{ duration: 2.4, repeat: canStart ? 0 : Infinity, ease: "easeInOut" }}
              data-testid="img-waiting-mascot"
            />
            <p className="text-[19px] font-bold leading-tight mt-2" data-testid="text-member-count">
              {memberCount} joined
            </p>
            <p className="text-[13.5px] mt-1 leading-snug text-[#9A938A]">
              {canStart ? "Everyone's here — let's start!" : "Waiting for friends to join…"}
            </p>
            {members.length > 0 && (
              <div className="flex -space-x-2 mt-3 justify-center">
                {members.slice(0, 6).map((m) => (
                  <span
                    key={m.lineUserId}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-white overflow-hidden bg-[#F3F1EC] text-[#1A1A1A]"
                  >
                    {m.pictureUrl ? <img src={m.pictureUrl} alt="" className="w-full h-full object-cover" /> : m.displayName.charAt(0)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 mt-4" style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-[#9A938A]">
              The crew · {memberCount}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#06C755]">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex w-full h-full rounded-full opacity-60 bg-[#06C755]" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-[#06C755]" />
              </span>
              Live
            </span>
          </div>
          <p className="text-[12px] mt-1 mb-3 text-[#9A938A]">Updates live as your crew joins</p>

          <div className="space-y-1">
            {members.map((m, idx) => {
              const isMe = m.lineUserId === profile?.userId;
              const isMemberHost = sessionInfo ? m.lineUserId === sessionInfo.hostLineUserId : idx === 0;
              const label = isMe ? "You" : m.displayName;
              const ringColor = isMemberHost ? "#FFCC02" : "#06C755";
              return (
                <div key={m.lineUserId} data-testid={`member-${m.lineUserId}`} className="w-full flex items-center gap-3 py-1.5">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 overflow-hidden bg-[#F3F1EC] text-[#1A1A1A]"
                    style={{ boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${ringColor}` }}
                  >
                    {m.pictureUrl ? <img src={m.pictureUrl} alt={m.displayName} className="w-full h-full object-cover" /> : m.displayName.charAt(0)}
                  </span>
                  <span className="flex-1 text-[15px] font-semibold truncate" data-testid={`text-member-name-${m.lineUserId}`}>
                    {label}
                  </span>
                  {isMemberHost ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-bold shrink-0" style={{ backgroundColor: "rgba(255,204,2,0.2)", color: "#1A1A1A" }}>
                      Host
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full text-[12.5px] font-bold shrink-0" style={{ backgroundColor: "rgba(6,199,85,0.12)", color: "#06C755" }}>
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Joined
                    </span>
                  )}
                </div>
              );
            })}

            {isActuallyHost && sessionCreated && (
              <button
                onClick={handleInviteMore}
                data-testid="button-invite-more"
                className="w-full flex items-center gap-3 py-2 mt-1 text-left active:scale-[0.99] transition-transform"
              >
                <span className="w-10 h-10 rounded-full border-2 border-dashed border-[#E3DED3] flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-[#9A938A]" />
                </span>
                <span className="flex-1 text-[14px] font-semibold text-[#9A938A]">Invite more friends</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-red-500 text-sm" data-testid="text-error">{error}</p>
            <button
              onClick={() => { setError(null); createOrJoinSession(); }}
              className="px-4 py-2 rounded-full bg-white border border-black/[0.06] text-sm font-semibold text-[#1A1A1A] active:scale-95 transition-transform"
              data-testid="button-retry-join"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto px-6 pt-4 pb-[88px]"
        style={{ background: "linear-gradient(to top, hsl(var(--background)) 70%, hsla(30,20%,97%,0))" }}
      >
        {isActuallyHost ? (
          <button
            onClick={handleStartSwiping}
            disabled={!canStart}
            data-testid="button-start-swiping"
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
            style={{ backgroundColor: "#FFCC02", color: "#1A1A1A", boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            <Sparkles className="w-[18px] h-[18px]" /> Let's start!
          </button>
        ) : (
          <div
            data-testid="text-waiting-for-host"
            className="w-full h-14 rounded-full bg-white text-[#9A938A] font-bold text-[15px] flex items-center justify-center border border-black/[0.06]"
          >
            Waiting for the host to start…
          </div>
        )}
        {isActuallyHost && !canStart && (
          <p className="text-center text-[12.5px] font-medium mt-3 text-[#9A938A]">
            Invite at least 1 more friend to start
          </p>
        )}
        <p className="text-center text-[11px] text-[#9A938A] mt-3">
          Session code <span className="font-mono font-bold">{sessionId}</span>
        </p>
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
                <h3 className="text-lg font-bold">{t("waiting.invite_friends")}</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  data-testid="button-close-share-modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">{t("waiting.share_link_desc")}</p>
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
