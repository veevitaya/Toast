---
name: Group endpoint host/member auth
description: Two caller-identity patterns for /api/group/sessions endpoints; which to use for host/member gating and why.
---

Group-session endpoints have TWO caller-identity patterns. Use the verified one for any host- or member-gated action.

- **Weak (guest fallback only):** trust the body-supplied `lineUserId` and compare to `session.hostLineUserId`. Spoofable — session GET responses expose `hostLineUserId`, so anyone with the session code can impersonate the host.
- **Strong (preferred):** read the `x-line-access-token` header, verify it via the `verifyLineAccessToken` helper, and let the verified `userId` OVERRIDE the body id; fall back to the body id only when no token is present (real guests). Then compare the resolved id to the host/member.

**Why:** a broken-access-control review finding — without verification a non-host group member could trigger/consume a host-only one-shot action. The verified-override pattern raises the bar for real LINE users while keeping guest sessions working.

**How to apply:** when adding or auditing any host/member-gated `POST /api/group/sessions/:code/*` action, mirror the `taste` endpoint's resolve-then-gate block, and make the client send the `X-Line-Access-Token` header (from the liff `getAccessToken()`).
