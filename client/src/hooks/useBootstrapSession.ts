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

const CACHE_KEY = "toast_bootstrap_cache";
const CACHE_TTL = 5 * 60 * 1000;

function getCachedBootstrap(): BootstrapPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedBootstrap(data: BootstrapPayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      expiry: Date.now() + CACHE_TTL,
    }));
  } catch {}
}

export function useBootstrapSession() {
  const [payload, setPayload] = useState<BootstrapPayload | null>(() => getCachedBootstrap());
  const [loading, setLoading] = useState(!getCachedBootstrap());
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchBootstrap = useCallback(async (accessToken?: string | null) => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    try {
      setLoading(true);
      const res = await fetch("/api/session/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: accessToken || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          locale: navigator.language,
        }),
      });

      if (!res.ok) throw new Error("Bootstrap failed");

      const data: BootstrapPayload = await res.json();
      setPayload(data);
      setCachedBootstrap(data);
      setError(null);
    } catch (e) {
      setError("Failed to load session");
      const cached = getCachedBootstrap();
      if (cached) setPayload(cached);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchBootstrap();
    }
  }, [fetchBootstrap]);

  return {
    payload,
    loading,
    error,
    refetch: () => {
      fetchedRef.current = false;
      fetchBootstrap();
    },
  };
}
