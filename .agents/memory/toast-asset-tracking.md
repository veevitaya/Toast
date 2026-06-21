---
name: Toast asset tracking (attached_assets is git-ignored)
description: Where to put images so they ship/version with the code vs. the ignored scratch dir.
---

# Where Toast images must live

`attached_assets/` is **git-ignored** in this repo (`.gitignore` ignores `attached_assets`, `attached_assets/`, `*attached_assets/`). The `@assets` Vite alias points there. So anything imported via `@assets/...` is NOT tracked by git and will not be in commits/checkpoints — it only survives because the dev box and Replit workspace deploy use the physical files on disk.

**Rule:** any image that must version with the code (tutorial screenshots, mascots, logos used by a feature you're shipping) goes in the **tracked** `client/src/assets/` tree and is imported via the `@` alias, e.g. `@/assets/tutorial/foo.jpg` / `@/assets/mascots/bar.png`. `client/src/assets/mascots/*` is the precedent.

**Why:** a code change that references a new `@assets/...` (ignored) file produces a commit where the code points at an image that isn't in git — fragile for clean checkouts/forks and invisible to checkpoints. Putting it under `client/src/assets/` keeps the asset and the code that imports it in the same commit.

**How to apply:** when adding new images for a feature, create/use a folder under `client/src/assets/` and import with `@/assets/...`. Only use `@assets/` (attached_assets) for genuinely throwaway/user-uploaded scratch material that doesn't need to be committed.
