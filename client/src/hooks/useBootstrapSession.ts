import { useState, useEffect, useRef, useCallback } from "react";

interface BootstrapUser {
  id: number | null;
  lineUserId: string;
  displayName: string;
  avatarUrl: string | null;
}

interface BootstrapSession {
  isFirstVisit: boolean;
  daypart: string;
  serverTime: string;
  locationUsed: boolean;
  sessionId: number | null;
}

interface TasteDnaSummary {
  comfort: number;
  exploration: number;
  healthy: number;
  indulgent: number;
  spicy: number;
  distance: number;
  budget: number;
  novelty: number;
}

interface BootstrapPick {
  restaurantId: number;
  name: string;
  imageUrl: string;
  distanceText: string | null;
  confidenceLabel: string;
  reasonChips: string[];
  match: number;
  rating: string;
  priceLevel: number;
  category: string;
  address: string;
  district: string | null;
}

export interface BootstrapPayload {
  user: BootstrapUser | null;
  session: BootstrapSession;
  tasteDnaSummary: TasteDnaSummary;
  dailyPick: BootstrapPick | null;
  alternatives: BootstrapPick[];
}

const CACHE_KEY = "toast_bootstrap_v2";
const CACHE_TTL = 5 * 60 * 1000;

function getCachedBootstrap(): BootstrapPayload | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedBootstrap(data: BootstrapPayload) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

const bootstrapState = {
  payload: getCachedBootstrap(),
  loading: !getCachedBootstrap(),
  error: null as string | null,
  promise: null as Promise<BootstrapPayload | null> | null,
  fetched: false,
};

function doFetch(accessToken?: string | null): Promise<BootstrapPayload | null> {
  if (bootstrapState.promise) return bootstrapState.promise;

  bootstrapState.promise = fetch("/api/session/bootstrap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken: accessToken || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
    }),
  })
    .then(res => {
      if (!res.ok) throw new Error("Bootstrap failed");
      return res.json();
    })
    .then((data: BootstrapPayload) => {
      bootstrapState.payload = data;
      bootstrapState.loading = false;
      bootstrapState.error = null;
      bootstrapState.fetched = true;
      setCachedBootstrap(data);
      return data;
    })
    .catch(() => {
      bootstrapState.error = "Failed to load session";
      bootstrapState.loading = false;
      bootstrapState.fetched = true;
      return bootstrapState.payload;
    })
    .finally(() => {
      bootstrapState.promise = null;
    });

  return bootstrapState.promise;
}

export function prefetchBootstrap(accessToken?: string | null) {
  if (bootstrapState.fetched || bootstrapState.promise) return;
  doFetch(accessToken);
}

export function useBootstrapSession() {
  const [, forceUpdate] = useState(0);
  const subRef = useRef(false);

  useEffect(() => {
    subRef.current = true;
    if (!bootstrapState.fetched && !bootstrapState.promise) {
      doFetch().then(() => {
        if (subRef.current) forceUpdate(n => n + 1);
      });
    } else if (bootstrapState.promise) {
      bootstrapState.promise.then(() => {
        if (subRef.current) forceUpdate(n => n + 1);
      });
    }
    return () => { subRef.current = false; };
  }, []);

  const refetch = useCallback((accessToken?: string | null) => {
    bootstrapState.fetched = false;
    bootstrapState.promise = null;
    sessionStorage.removeItem(CACHE_KEY);
    doFetch(accessToken).then(() => {
      if (subRef.current) forceUpdate(n => n + 1);
    });
  }, []);

  return {
    payload: bootstrapState.payload,
    loading: bootstrapState.loading && !bootstrapState.payload,
    error: bootstrapState.error,
    refetch,
  };
}
