import { useState, useEffect } from "react";
import { initLiff, initLiffOA, getProfile, isLoggedIn, isLiffAvailable, isLineOAAvailable, login, isInLiff, syncProfileToServer, type LineProfile } from "./liff";

const GUEST_KEY = "toast_guest_profile";

function getGuestProfile(): LineProfile {
  const stored = localStorage.getItem(GUEST_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch {}
  }
  const guestId = "guest_" + Math.random().toString(36).substring(2, 10);
  const profile: LineProfile = {
    userId: guestId,
    displayName: "You",
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
          } else if (isInLiff()) {
            login();
            return;
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

  const triggerLineLogin = () => {
    const useOA = requireAuth && isLineOAAvailable();
    if (useOA) {
      initLiffOA().then((ready) => {
        if (ready) {
          login();
        }
      });
    } else {
      initLiff().then((ready) => {
        if (ready) {
          login();
        }
      });
    }
  };

  const continueAsGuest = () => {
    const guest = getGuestProfile();
    setProfileState(guest);
    setIsLineUser(false);
    setAuthRequired(false);
  };

  return { profile, loading, isLineUser, authRequired, triggerLineLogin, continueAsGuest };
}
