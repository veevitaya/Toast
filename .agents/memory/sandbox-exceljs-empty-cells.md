---
name: Sandbox exceljs writes empty cells
description: xlsx files written via exceljs inside the code_execution sandbox lose all cell values; use a plain node script instead.
---

**Rule:** Never generate .xlsx files with exceljs from inside the code_execution (notebook) sandbox. Write a standalone Node script in the workspace (CJS + `require('exceljs')`) and run it with `node` via bash.

**Why:** When exceljs was imported in the sandbox via `await import('exceljs')`, `writeFile` produced a structurally valid workbook where every cell had its style but **no value** — no `<v>`, no inline `<is>`, no sharedStrings. In-memory rowCount looked correct, so the corruption was invisible until the raw XML was inspected (`unzip` + grep for `<v>`/`<si>`). The exact same exceljs 4.4.0 works perfectly when run in plain `node`.

**How to apply:** For any spreadsheet deliverable, put the generator in `scripts/*.cjs` (precedent: `scripts/generate-copy-chart.cjs`), run it with bash, then verify by unzipping the xlsx and checking `xl/sharedStrings.xml` is non-trivial before presenting. Also note: exceljs read-modify-write of a styled workbook is fragile — prefer rebuilding the whole file in one pass.
