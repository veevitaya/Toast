import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TutorialOverlay } from "./TutorialOverlay";
import {
  hasCompletedTutorial,
  type TutorialFeatureId,
} from "@/lib/tutorialState";

const FEATURES: TutorialFeatureId[] = ["solo", "group", "trending"];

/** Map a pathname to its feature id for first-time auto-trigger. */
function pathToFeature(pathname: string): TutorialFeatureId | null {
  if (pathname === "/" || pathname.startsWith("/swipe")) return "solo";
  if (pathname.startsWith("/group")) return "group";
  if (pathname.startsWith("/trending")) return "trending";
  return null;
}

function readQueryFeature(): TutorialFeatureId | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const t = params.get("tutorial");
  if (t && (FEATURES as string[]).includes(t)) return t as TutorialFeatureId;
  return null;
}

function clearQueryParam() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("tutorial");
  window.history.replaceState({}, "", url.toString());
}

export function TutorialController() {
  const [location] = useLocation();
  const [active, setActive] = useState<TutorialFeatureId | null>(null);

  // Auto-trigger from ?tutorial= or first-visit per route.
  useEffect(() => {
    // Suppress overlay (used for clean screenshots): /?tutorial=off
    if (typeof window !== "undefined") {
      const t = new URLSearchParams(window.location.search).get("tutorial");
      if (t === "off") {
        setActive(null);
        return;
      }
    }
    const queryFeature = readQueryFeature();
    if (queryFeature) {
      setActive(queryFeature);
      return;
    }
    // Only auto-trigger on the canonical landing path of each feature, not deep links.
    const feature = pathToFeature(location);
    if (!feature) return;
    if (feature === "solo" && location !== "/") return;
    if (feature === "group" && location !== "/group/setup") return;
    if (feature === "trending" && !location.startsWith("/trending")) return;
    if (!hasCompletedTutorial(feature)) {
      setActive(feature);
    }
  }, [location]);

  if (!active) return null;
  return (
    <TutorialOverlay
      featureId={active}
      onClose={() => {
        clearQueryParam();
        setActive(null);
      }}
    />
  );
}
