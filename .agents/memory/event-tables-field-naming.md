---
name: Event tables have divergent field names
description: The two event tables look interchangeable but use different column names; route code repeatedly grabbed the wrong field.
---

Toast has two separate event tables whose row shapes are easy to confuse, and `server/routes.ts` has historically read the wrong field off whichever events array it had:

- `analytics_events` (via `storage.getEvents`): payload is `metadata`, time is `timestamp`. There is **no** `createdAt`.
- `user_behavior_events` (via `storage.getUserBehaviorEvents`): payload is `metadataJson` (jsonb), time is `createdAt`. There is **no** `metadata`/`timestamp`.

**Why:** Reading `e.createdAt` off analytics events produced `NaN ... ago` dates in owner reviews; reading `e.metadata` off behavior events made the partner "most used vibe" stat silently always-empty. Both compiled fine and failed only at runtime/display.

**How to apply:** Before accessing `metadata*`/`timestamp`/`createdAt` on an events array in routes, trace which storage method (hence which table) produced it, and use that table's field names. `metadataJson` is jsonb (already an object) but keep a `typeof === "string" ? JSON.parse : value` guard for safety.
