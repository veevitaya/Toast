import { useState, useEffect } from "react";
import { initLiff, initLiffOA, getProfile, isLoggedIn, isLiffAvailable, isLineOAAvailable, login, isInLiff, syncProfileToServer, getLineOALiffId, type LineProfile } from "./liff";
import { getSavedDisplayName } from "@/hooks/use-onboarding";

const GUEST_KEY = "toast_guest_profile";

const GUEST_NAMES = [
  "Hungry Panda", "Spicy Tiger", "Noodle Ninja", "Pad Thai Pro",
  "Mango Bear", "Som Tam Fan", "Toast Buddy", "Rice Rebel",
  "Curry Cat", "Satay Star", "Dim Sum Dog", "Wok Walker",
  "Basil Boss", "Chili Champ", "Sushi Scout", "Ramen Ranger",
];

function getGuestProfile(): LineProfile {
  const stored = localStorage.getItem(GUEST_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const savedName = getSavedDisplayName();
      if (savedName && parsed.displayName !== savedName) {
        parsed.displayName = savedName;
        localStorage.setItem(GUEST_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {}
  }
  const guestId = "guest_" + Math.random().toString(36).substring(2, 10);
  const savedName = getSavedDisplayName();
  const guestName = savedName || GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
  const profile: LineProfile = {
    userId: guestId,
    displayName: guestName,
    pictureUrl: undefined,
  };
  localStorage.setItem(GUEST_KEY, JSON.stringify(profile));
  return profile;
}

export function useLineProfile(options?: { requireAuth?: boolean }) {
  const [profile, setProfileState] = useState<LineProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLineUser, setIsLineUser] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

  const requireAuth = options?.requireAuth ?? false;

  useEffect(() => {
    async function init() {
      const useOA = requireAuth && isLineOAAvailable();
      const liffAvailable = useOA ? isLineOAAvailable() : isLiffAvailable();

      if (liffAvailable) {
        const ready = useOA ? await initLiffOA() : await initLiff();
        if (ready) {
          if (isLoggedIn()) {
            const p = await getProfile();
            if (p) {
              localStorage.setItem(GUEST_KEY, JSON.stringify(p));
              setProfileState(p);
              setIsLineUser(true);
              setLoading(false);
              syncProfileToServer(p);
              return;
            }
          } else if (isInLiff() && requireAuth) {
            login();
            return;
          } else if (isInLiff() && !requireAuth) {
            // In LIFF but not logged in — skip login, use guest profile
          } else if (requireAuth) {
            setAuthRequired(true);
            setLoading(false);
            return;
          }
        }
      }

      if (requireAuth) {
        setAuthRequired(true);
        setLoading(false);
        return;
      }

      setProfileState(getGuestProfile());
      setIsLineUser(false);
      setLoading(false);
    }
    init();
  }, [requireAuth]);

  const triggerLineLogin = async (): Promise<boolean> => {
    const useOA = requireAuth && isLineOAAvailable();
    try {
      const ready = useOA ? await initLiffOA() : await initLiff();
      if (ready) {
        login();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return true;
      }
    } catch (err) {
      console.error("LINE login trigger failed:", err);
    }

    const liffId = useOA ? getLineOALiffId() : (import.meta.env.VITE_LIFF_ID || "");
    if (liffId) {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `https://liff.line.me/${liffId}${currentPath}`;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return true;
    }

    return false;
  };

  const continueAsGuest = () => {
    const guest = getGuestProfile();
    setProfileState(guest);
    setIsLineUser(false);
    setAuthRequired(false);
  };

  const refreshProfile = () => {
    if (!isLineUser) {
      setProfileState(getGuestProfile());
    }
  };

  return { profile, loading, isLineUser, authRequired, triggerLineLogin, continueAsGuest, refreshProfile };
}
