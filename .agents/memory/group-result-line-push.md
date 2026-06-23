---
name: Group result LINE push
description: Non-obvious decisions for auto-pushing a group session's decision to LINE (Messaging API push/multicast).
---

# Group decision → LINE result push

When a group session is decided, the server pushes a Flex result to the LINE group
(if its id was captured) or multicasts to members, deep-linking to the result
(menu → `/menu-item/:id`, restaurant → `/restaurant/:id`).

## Fire on the host's decision ACTION, not on the match overlay
**Rule:** trigger the push from the explicit host action (tapping "View Restaurant(s)"
for a single full-match, and tie-breaker completion) — NOT from a `useEffect` on the
match overlay being shown.
**Why:** the push is a one-shot atomic claim. In menu-first vibes a transient single
match can appear and then be superseded by an auto-tie-breaker. Firing on the overlay
would lock the one-shot claim to that transient match and push the WRONG result.
**How to apply:** any new trigger must be a genuine decision point, not a render of a
candidate match.

## LINE request timeout must be shorter than the stale-claim window
**Rule:** `linePush`/`lineMulticast` use `AbortSignal.timeout(15s)`; the storage
claim treats a `sending` claim as stale/re-claimable after 60s.
**Why:** if a send could hang past the stale window, a second trigger would re-claim
and send again → duplicate LINE post. Keeping the send timeout well under the stale
window guarantees the first attempt resolves (sent/failed) before any re-claim.
**How to apply:** if you change either value, keep send-timeout << stale-window.

## Completion CAS on the claim token
`completeGroupSessionNotification` CAS's on `notificationStartedAt = claimToken AND
notifiedAt IS NULL` so a superseded/stale sender can neither regress `sent`→`failed`
nor double-send.

## Host-gating is non-cryptographic by design
notify-result gates on `body.lineUserId === session.hostLineUserId`, matching the
app-wide anonymous LINE/guest-session model (guests have no verifiable token). The id
is still validated against real matches / tie-winner, so only a real decision can be
pushed. Don't add a token requirement here alone — it would need an app-wide migration.
