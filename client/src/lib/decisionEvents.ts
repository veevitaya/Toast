type DecisionEventType =
  | "hero_impression"
  | "primary_cta_clicked"
  | "alternative_requested"
  | "refine_opened"
  | "refine_applied"
  | "recommendation_accepted"
  | "recommendation_rejected"
  | "detail_viewed"
  | "saved"
  | "session_abandoned";

interface DecisionEventPayload {
  userId?: string | null;
  eventType: DecisionEventType;
  restaurantId?: number | null;
  metadata?: Record<string, any>;
  sessionId?: string | null;
}

const EVENT_QUEUE: DecisionEventPayload[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 3000;
const MAX_BATCH = 10;

function flushEvents() {
  if (EVENT_QUEUE.length === 0) return;

  const batch = EVENT_QUEUE.splice(0, MAX_BATCH);

  for (const evt of batch) {
    fetch("/api/toast-decides/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evt),
      keepalive: true,
    }).catch(() => {});
  }

  if (EVENT_QUEUE.length > 0) {
    flushTimer = setTimeout(flushEvents, 500);
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushEvents();
  }, FLUSH_INTERVAL);
}

export function trackDecisionEvent(
  eventType: DecisionEventType,
  opts?: {
    userId?: string | null;
    restaurantId?: number | null;
    metadata?: Record<string, any>;
  }
) {
  const userId = opts?.userId || getStoredUserId();

  EVENT_QUEUE.push({
    userId,
    eventType,
    restaurantId: opts?.restaurantId || null,
    metadata: opts?.metadata || undefined,
  });

  if (EVENT_QUEUE.length >= MAX_BATCH) {
    flushEvents();
  } else {
    scheduleFlush();
  }
}

function getStoredUserId(): string | null {
  try {
    const raw = localStorage.getItem("toast_guest_profile");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.lineUserId || parsed.userId || null;
    }
  } catch {}
  return null;
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    flushEvents();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushEvents();
    }
  });
}
