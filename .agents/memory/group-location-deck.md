---
name: Group location → restaurant deck
description: How a group session's real GPS location must drive the swipe deck without emptying the central-Bangkok seed data.
---

# Group location must distance-SORT the deck, never name-filter

When a group session's real location drives restaurant results, sort the deck by
haversine distance to the session coords. Do NOT hard-filter restaurants by a
location *name*.

**Why:** The seed restaurant data is central-Bangkok only, and reverse-geocoded
area labels carry suffixes (e.g. "Bang Na District") that don't substring-match
the stored districts. A name-based location filter therefore returns zero rows
for any out-of-list / real-GPS area and empties the deck. Distance-sort always
returns the nearest available spots instead, so the deck is never empty.

**How to apply:**
- Pass real coords (lat/lng) into the restaurant + dish→restaurant fetches and
  sort by distance; keep any legacy location-name filter only as a
  non-destructive fallback (apply the filtered subset only if it is non-empty).
- Any restaurant response whose ordering depends on lat/lng MUST include rounded
  lat/lng in its cache key, or one user's distance-sorted list gets served to a
  user at different coords (cross-location cache contamination).
- A keyless reverse-geocode proxy (OSM Nominatim) is acceptable (same provider
  the app already uses for maps), but it must be per-IP rate limited and use a
  bounded cache.
- When a location picker reverse-geocodes for a *display* label (Solo "What
  sounds good?" mirrors Group "Set the Plan"), gate the primary action button on
  *coords arrival*, not on the geocode finishing — the decision only needs
  coords; the area name is cosmetic. Blocking the CTA on the name lookup
  needlessly stalls the main action.
