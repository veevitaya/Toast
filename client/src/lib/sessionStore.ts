import { useSyncExternalStore } from "react";

export interface SessionMemberInfo {
  displayName: string;
  pictureUrl?: string;
}

export interface ActiveSession {
  id: string;
  type: "solo" | "group";
  label: string;
  route: string;
  memberCount?: number;
  matchCount?: number;
  members?: SessionMemberInfo[];
  startedAt: number;
  status?: "waiting" | "swiping" | "completed" | "expired" | "deleted";
}

let sessions: ActiveSession[] = [];
let listeners: Set<() => void> = new Set();

function notify() {
  for (const l of listeners) l();
  try {
    sessionStorage.setItem("toast_sessions", JSON.stringify(sessions));
  } catch {}
}

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

// On a fresh app start, never resurface a session that has already ended.
// Group sessions live on the server, so they are NOT trusted from the local
// cache here — SessionBar re-hydrates a genuinely active (or recently
// completed) one from /api/sessions/active. This guarantees an ended group
// session can never linger as "Live" if reconciliation is slow, fails, or the
// local card was never marked terminal (e.g. ended while off the swipe page).
// Solo sessions are purely local, so we keep them unless terminal or too old.
function pruneStaleSessions(list: ActiveSession[]): ActiveSession[] {
  if (!Array.isArray(list)) return [];
  const now = Date.now();
  return list.filter((s) => {
    if (!s || !s.id) return false;
    if (s.type === "group") return false;
    if (s.status === "completed" || s.status === "expired" || s.status === "deleted") return false;
    if (s.startedAt && now - s.startedAt > SESSION_MAX_AGE_MS) return false;
    return true;
  });
}

try {
  const stored = sessionStorage.getItem("toast_sessions");
  if (stored) sessions = pruneStaleSessions(JSON.parse(stored));
} catch {}

export function addSession(session: ActiveSession) {
  if (sessions.find((s) => s.id === session.id)) return;
  sessions = [...sessions, session];
  notify();
}

export function removeSession(id: string) {
  sessions = sessions.filter((s) => s.id !== id);
  notify();
}

export function updateSession(id: string, updates: Partial<ActiveSession>) {
  sessions = sessions.map((s) => (s.id === id ? { ...s, ...updates } : s));
  notify();
}

export function useSessions(): ActiveSession[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => sessions,
  );
}
