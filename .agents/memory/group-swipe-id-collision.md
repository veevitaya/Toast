---
name: Group swipe id collision (menu vs restaurant)
description: group_swipes.menuItemId holds BOTH dish ids and restaurant ids; never group/aggregate by that id alone.
---

In the group flow, `group_swipes.menuItemId` is a single column reused for two unrelated
tables — `menu_items` (dishes) and `restaurants` — disambiguated only by the row's
`swipeType` (`'menu' | 'restaurant'`). Both tables are independent serial PKs, so their
id ranges overlap (e.g. dish #30 and restaurant #30 both exist).

**Rule:** any grouping, vote aggregation, map lookup, or final-pick matching over group
swipes / matched items MUST key by the composite `${swipeType}:${id}`, not the raw numeric
id. Resolve each entry strictly from its own table map (menu→menuItemMap, restaurant→
restaurantMap) — never fall back across tables, or a missing dish silently renders as a
same-id restaurant.

**Why:** a menu-first session has BOTH phases of swipes (phase 1 dishes, phase 2
restaurants). Keying by raw id merges a dish's voters with a colliding restaurant's voters
before results are built, producing a wrong/aggregated final pick and a banner that points
at the wrong card. Caught by architect review during the tie-breaker integration.

**How to apply:** touches `fetchRankedResults` in `client/src/pages/GroupSwipe.tsx`, the
tie-breaker `RankedResult`/final-pick banner, and any future feature that reads
`group_swipes` or matched items across the menu→restaurant phase transition.
