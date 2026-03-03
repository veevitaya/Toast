export function trackEvent(
  eventType: string,
  data?: { userId?: string; restaurantId?: number; metadata?: Record<string, any> }
) {
  let userId = "anonymous";
  try {
    const profile = localStorage.getItem("toast_user_profile");
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.displayName) userId = parsed.displayName;
    }
  } catch {}

  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      userId: data?.userId || userId,
      restaurantId: data?.restaurantId,
      metadata: data?.metadata ? JSON.stringify(data.metadata) : undefined,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});
}
