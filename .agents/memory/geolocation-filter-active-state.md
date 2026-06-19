---
name: Geolocation filter active state
description: Why a "near me" / geolocation filter must not be marked active until coordinates resolve.
---

# Geolocation filter active state

When a "Near me" (or any geolocation-backed) filter is toggled on, the browser
sets the active flag synchronously but the coordinates only arrive in the async
`getCurrentPosition` callback. If the user can submit during that window, the
request sends `nearMe: true` with **no** lat/lng, and the backend (which only
applies distance ranking when both coords are numbers) silently no-ops it — the
filter looks active in the UI but does nothing.

**Why:** distance/near-me ranking on the server is gated on numeric coords, so a
coordless "active" filter is a silent decorative no-op — exactly the failure mode
"functional, not decorative" requirements are trying to avoid.

**How to apply:**
- Derive a `locating = useCurrentLoc && !coords` state.
- In the payload builder, treat near-me as active only when coords exist
  (`useNear = useCurrentLoc && !!coords`); otherwise omit nearMe/coords.
- Block/disable the submit CTA while `locating`, and surface a "getting your
  location…" hint so the pending state is visible.
- Geolocation error/timeout callbacks must reset the active flag so the CTA
  re-enables.
