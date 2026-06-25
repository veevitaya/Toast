---
name: Tie-breaker DisplayItem naming
description: Why "destination" UI for group tie-breakers must use item.place, not item.name
---

# Tie-breaker DisplayItem: destination is `place`, not `name`

Any tie-breaker UI that names the *place the group is going to eat* (the winner /
"destination" reveal) must render `item.place || item.name` as the title — never
`item.name` alone.

**Why:** `toDisplayItem()` builds a `DisplayItem` differently per swipe mode. In
**menu-mode** tie-breakers `name` = the winning *dish* and `place` = the
*restaurant*. In **restaurant-mode** both `name` and `place` are the restaurant
name. So a reveal that shows `item.name` directly will display a dish (e.g. "Som
Tam") as the destination in any menu-first tie-breaker — which is wrong, the table
is going to a restaurant. This was a real regression caught in review.

**How to apply:** title = `item.place || item.name`. Show the dish as supporting
context only when `item.place && item.place !== item.name` (e.g. "for {item.name}").
When `place` is undefined (menu item with no restaurant), falling back to the dish
as title is acceptable — do not fabricate a restaurant name.
