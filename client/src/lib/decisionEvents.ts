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
const FLUSH_INTERVAL = 5000;
const MAX_BATCH = 20;

function flushEvents() {
  if (EVENT_QUEUE.length === 0) return;

  const batch = EVENT_QUEUE.splice(0, MAX_BATCH);

  const sendViaFetch = (url: string, body: any) => {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  };

  if (batch.length === 1) {
    const payload = batch[0];
    if (typeof navigator.sendBeacon === "function") {
      const sent = navigator.sendBeacon(
        "/api/toast-decides/event",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      if (!sent) {
        sendViaFetch("/api/toast-decides/event", payload);
      }
    } else {
      sendViaFetch("/api/toast-decides/event", payload);
    }
  } else {
    sendViaFetch("/api/toast-decides/events", { events: batch });
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

let _cachedUserId: string | null | undefined = undefined;

function getStoredUserId(): string | null {
  if (_cachedUserId !== undefined) return _cachedUserId;
  try {
    const raw = localStorage.getItem("toast_guest_profile");
    if (raw) {
      const parsed = JSON.parse(raw);
      _cachedUserId = parsed.lineUserId || parsed.userId || null;
      return _cachedUserId;
    }
  } catch {}
  _cachedUserId = null;
  return null;
}

export function setTrackedUserId(id: string | null) {
  _cachedUserId = id;
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
