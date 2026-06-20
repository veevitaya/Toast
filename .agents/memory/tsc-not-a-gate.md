---
name: tsc is not a build gate in Toast
description: Why `npx tsc --noEmit` shows ~30 scary errors that don't break the app, and which to ignore.
---

`npx tsc --noEmit` in this repo reports ~30 errors that do NOT block the running app. The dev server runs via `tsx` and the build via Vite/esbuild, both of which transpile without full type-checking, so these errors never reach runtime.

**Why:** The repo's effective TS target/config doesn't enable `--downlevelIteration`, and several storage return types are `T | undefined` where callers expect `T | null`. These are long-standing and unrelated to most feature work.

Recurring pre-existing categories (safe to ignore unless explicitly in scope):
- `TS2802` Set/Map iteration ("can only be iterated through with --downlevelIteration") in GroupSwipe, Profile, sessionStore, use-line-profile, and the rateLimit/getCached helpers in server/routes.ts.
- storage `... | undefined` vs `... | null` mismatches in server/routes.ts (taste profile / moment context args).
- `getRestaurant` (singular) referenced but only `getRestaurants` exists.
- RestaurantDetail.tsx mock objects missing fields (district, vibes, ownerId, ...).
- `@types/qrcode` missing.

**How to apply:** After editing, don't treat a nonzero `tsc` exit as failure. Instead grep tsc output for the specific files you changed; only fix errors that point at your edits. Don't mass-fix the pre-existing ones unless the task asks for it.
