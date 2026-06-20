---
name: Analytics event aliases & counting
description: Why owner/admin stat surfaces silently undercount, and the two rules that prevent it.
---

# Analytics event aliases & counting

Toast emits the same logical analytics action under **multiple `eventType` names**. The
canonical alias groupings live in `server/recommendation/index.ts` (the recommendation
engine treats them as equivalent):

- **views** = `view_detail` | `detail_viewed` | `restaurant_detail_opened`
- **saves** = `save` | `saved`
- **positive intent** = `swipe_right` | `recommendation_accepted` | `primary_cta_clicked`
- **delivery taps** = `delivery_click` | `delivery_tap`

## Rule 1: any stat that counts these must aggregate the whole alias set
A surface that counts only the primary name (e.g. just `view_detail`/`save`) **silently
undercounts** real activity. This bit the restaurant-owner dashboard
(`GET /api/admin/owner/dashboard`), which counted only `view_detail`/`save` and dropped
`detail_viewed`/`saved`.

**Why:** the client (`client/src/lib/decisionEvents.ts`) and the toast-decides event
endpoints emit the alias names, so they exist in `analytics_events` in the wild.

**How to apply:** when adding/editing any admin or owner metric, sum the alias set above
(keep it consistent with `recommendation/index.ts`). If "likes" should mean broader
positive intent, decide that as a product definition and change all surfaces together —
don't let one surface drift.

## Rule 2: never count event types by fetching rows then filtering in memory
`storage.getEvents()` is capped at `.limit(500)` ordered by `id DESC`. A high-volume
event type (e.g. `hero_impression` — one restaurant had 553 of 582 events) crowds out
older real-metric rows, so an in-memory `events.filter(...).length` undercounts.

**How to apply:** use a grouped SQL `COUNT()` scoped to the restaurant
(`storage.getRestaurantEventCounts(restaurantId)`), not fetch-then-filter.

## Note on admin analytics being mostly hardcoded
Most rich admin analytics panels (`AdminAnalytics`, `OwnerInsights`,
`AdminPartnerClickouts`, `AdminOwners` KPIs, `OwnerPerformance` charts,
`AdminPredictiveIntelligence`, `AdminReports`) render **static/hardcoded** numbers, not
real data (some, like gender split, have no backing field at all). The genuinely
real stats are: admin dashboard counts (users/restaurants/events/swipes/campaigns),
`/api/analytics/summary`, `/api/analytics/top-restaurants`, restaurants/claims counts,
contact-submission badge, and the owner dashboard views/likes/saves/deliveryTaps.
