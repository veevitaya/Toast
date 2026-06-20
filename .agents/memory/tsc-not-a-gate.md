---
name: tsc is not a build gate in Toast
description: Why a nonzero `npx tsc --noEmit` exit does not mean the app is broken in this repo.
---

`npx tsc --noEmit` reports long-standing pre-existing errors that do NOT block the running app. The dev server runs via `tsx` and the build via Vite/esbuild — both transpile without full type-checking, so these errors never reach runtime.

**Why:** The repo has accumulated pre-existing type errors (downlevel-iteration config, `T | undefined` vs `T | null` storage mismatches, stale mock/test objects) that are unrelated to most feature work.

**How to apply:** Don't treat a nonzero `tsc` exit as a failure gate. After editing, grep the tsc output for the files you actually changed and only fix errors that point at your edits. Don't mass-fix the pre-existing ones unless the task explicitly asks for it.
