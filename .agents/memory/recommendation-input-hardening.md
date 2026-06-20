---
name: Harden untrusted JSON shapes at engine choke points
description: Where to guard request-controlled type-confusion in the recommendation pipeline so 500s don't slip past per-route checks.
---

Public recommendation endpoints accept rich JSON bodies whose fields flow into the shared recommendation engine. TypeScript types on the request are NOT runtime guarantees — a client can send arrays with non-string elements, or objects/null where a primitive is expected.

**Rule:** Validate/normalize untrusted shapes at the engine choke point (where the value is actually consumed by a string/array method), not only per-route. A per-route guard misses other callers and deeper nested elements.

**Why:** Adversarial bodies caused 500s that passed top-level per-route guards — the crash was deeper: array elements were lowercased inside the engine, and a label field was passed through raw. Guarding once at the consuming site (and centralizing scalar guards at the engine entry) fixes all callers at once.

**How to apply:** When a request field is mapped/lowercased/iterated, coerce it where it's consumed — filter arrays to the expected element type before `.map(...toLowerCase())`; coerce scalar labels to `string | undefined` at the engine entry; only `Object.entries()` plain non-null non-array objects, and default malformed entries. Add adversarial regression cases (mixed-type arrays, null containers) so it stays fixed.
