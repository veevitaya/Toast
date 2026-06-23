---
name: Toast group session flow is host-driven
description: Group decision sessions are intentionally host-led; non-hosts auto-return on match and there is no host→members navigation broadcast.
---

Toast group decision sessions are **host-driven by design**. During a session the host alone controls the match overlay (View / Top Picks / Keep Swiping / End). Non-hosts, on a full match, see the match briefly (~2.8s) and then auto-return to swiping; they follow the host only through session end (sessionEnded → results).

There is deliberately **no host→members navigation broadcast**: when the host opens a specific restaurant detail, that navigation is NOT pushed to other members' screens. This was an explicit scope decision, not an oversight.

**Why:** the requested behavior was "only the host decides what's next; everyone else just sees the match and keeps going." Building real-time host-selection navigation for all members is a separate, larger mechanism and was intentionally left out.

**How to apply:** don't "fix" the non-host match overlay by adding navigation/controls for non-hosts unless the user explicitly asks for shared/broadcast navigation. If they do, that's a new feature (a host-selection broadcast channel), not a bug fix.
