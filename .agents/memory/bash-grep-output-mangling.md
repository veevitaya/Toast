---
name: Bash grep/rg output mangles identifiers
description: In this workspace, bash tool output redacts/garbles certain strings; trust the read tool for real file content.
---

# Bash `rg`/`grep` output garbles real strings

**Symptom:** Running `rg`/`grep` via the bash tool returns matches where real tokens are replaced with placeholders — e.g. Bangkok area names like "Thonglor"/"Ekkamai" show as `ln`, `BANGKOK_LOCATIONS` shows as `n`, and `navigator.geolocation.getCurrentPosition` shows as `n.n`. The MATCH locations (file:line) are correct, but the displayed CONTENT is wrong.

**Why:** Some redaction/garbling layer is applied to bash tool stdout in this environment. It is a display artifact, not the real file. The `read` tool returns the true, un-garbled content.

**How to apply:** Use bash `rg`/`grep` only to LOCATE files and line numbers. Never trust the displayed match content or quote it into edits. Always confirm actual code with the `read` tool before reasoning about or editing it. Don't waste turns puzzling over "corrupted" code that the read tool shows is fine.
