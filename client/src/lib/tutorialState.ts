export type TutorialFeatureId = "solo" | "group" | "trending";

const FEATURE_IDS: TutorialFeatureId[] = ["solo", "group", "trending"];

function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const probe = "__toast_tutorial_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

function readLineUserId(): string | null {
  const ls = safeStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem("toast_line_profile");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.userId || null;
  } catch {
    return null;
  }
}

export function getTutorialKey(featureId: TutorialFeatureId, lineUserId?: string | null): string {
  const id = lineUserId || readLineUserId() || "guest";
  return `toast_tutorial_${id}_${featureId}_completed`;
}

export function hasCompletedTutorial(featureId: TutorialFeatureId, lineUserId?: string | null): boolean {
  const ls = safeStorage();
  if (!ls) return false;
  return ls.getItem(getTutorialKey(featureId, lineUserId)) === "1";
}

export function markTutorialCompleted(featureId: TutorialFeatureId, lineUserId?: string | null): void {
  const ls = safeStorage();
  if (!ls) return;
  ls.setItem(getTutorialKey(featureId, lineUserId), "1");
}

export function resetTutorial(featureId: TutorialFeatureId, lineUserId?: string | null): void {
  const ls = safeStorage();
  if (!ls) return;
  ls.removeItem(getTutorialKey(featureId, lineUserId));
}

export function resetAllTutorials(lineUserId?: string | null): void {
  for (const f of FEATURE_IDS) resetTutorial(f, lineUserId);
}

export function shouldShowTutorial(featureId: TutorialFeatureId, lineUserId?: string | null): boolean {
  return !hasCompletedTutorial(featureId, lineUserId);
}

export function getAllCompletionState(lineUserId?: string | null): Record<TutorialFeatureId, boolean> {
  return {
    solo: hasCompletedTutorial("solo", lineUserId),
    group: hasCompletedTutorial("group", lineUserId),
    trending: hasCompletedTutorial("trending", lineUserId),
  };
}
