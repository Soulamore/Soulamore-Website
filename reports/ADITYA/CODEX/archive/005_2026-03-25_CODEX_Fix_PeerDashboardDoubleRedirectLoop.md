# 2026-03-25 | CODEX | FIX | Peer Dashboard Double Redirect Loop

> **Status:** Complete  
> **Prepared For:** Aditya  
> **Prepared By:** Codex  
> **Scope:** Remove the active role-resolution split that was sending peer users to `peer-dashboard.html` and then back off that page seconds later.

---

## Executive Summary

I finalized the repo-side fix for the peer dashboard "double redirect" loop.

The core issue was not just one bad redirect. The active auth flow had **two competing routing authorities**:

1. `portal/login.html` was sending users to peer and psychologist destinations based on `intent` and setup checks.
2. `assets/js/auth-guard.js` was re-checking the logged-in user's actual role and correcting the route after page load.

That split made a peer-intent login capable of landing on the peer dashboard even when the canonical role resolution did not agree, which then triggered the second redirect.

I fixed this by making the active login and guard paths use the same shared role-routing flow.

---

## Completed

### 1. Centralized active role overrides and role normalization

File:

- [assets/js/role-helper.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/role-helper.js#L9)

Key changes:

- Added a centralized `HARDCODED_ROLE_OVERRIDES` map at [assets/js/role-helper.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/role-helper.js#L9).
- Added `normalizeRoleValue()` at [assets/js/role-helper.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/role-helper.js#L13) so `Member` and `user` resolve consistently.
- Updated `getUserRole(userId, userEmail)` at [assets/js/role-helper.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/role-helper.js#L33) so the email override logic lives in one place instead of being duplicated across login and guard code.

Why this matters:

- The active system now has one place to decide special-case roles.
- The old peer email bypass is no longer split away from the guard logic.

### 2. Removed the active peer bypass from shared post-login routing

File:

- [assets/js/auth-context.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-context.js#L56)

Key changes:

- Removed the hardcoded Sonika peer redirect from the live `handleRoleRouting()` flow.
- Switched `handleRoleRouting()` to call `getUserRole(user.uid, user.email)` at [assets/js/auth-context.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-context.js#L59).
- Kept dashboard/setup routing decisions based on the resolved canonical role at [assets/js/auth-context.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-context.js#L76).

Why this matters:

- Login completion no longer forces a peer dashboard route independently of the real role resolver.

### 3. Aligned the dashboard guard with the same role resolver inputs

File:

- [assets/js/auth-guard.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-guard.js#L22)

Key changes:

- Updated the guard helper signature to `getUserRole(uid, email)` at [assets/js/auth-guard.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-guard.js#L22).
- Passed `user.email` through to `role-helper` at [assets/js/auth-guard.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-guard.js#L25).
- Updated the main auth check to resolve role with both UID and email at [assets/js/auth-guard.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-guard.js#L75).

Why this matters:

- The guard and the login router now consult the same resolver with the same inputs.

### 4. Updated auth service role reads to defer to RoleHelper

File:

- [assets/js/auth-service.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-service.js#L46)

Key changes:

- `getUserRole(uid, email)` now uses `getCanonicalUserRole()` from `role-helper` at [assets/js/auth-service.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-service.js#L49).

Why this matters:

- Any login-page code path that still imports role reads from `auth-service.js` now gets the same answer as the guard and auth context.

### 5. Removed direct peer/psych redirects from the live login page

File:

- [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L252)

Key changes:

- The "already authenticated" login-page redirect now reuses `handleRoleRouting()` at [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L252).
- Phone login now awaits the shared router at [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L361).
- Facebook login now routes only through `handleRoleRouting()` at [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L397).
- Google login now routes only through `handleRoleRouting()` at [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L466).
- Email login now routes only through `handleRoleRouting()` at [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L570).
- The active `window.__loginInProgress` race guards remain in place for the interactive login flows at [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L381), [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L442), and [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L524).

Why this matters:

- The login page no longer sends users straight to peer or psychologist pages before shared role verification finishes.
- That removes the exact condition that produced the second redirect.

---

## In-Progress

- No code edits are left partially applied in this fix.
- The repo-side redirect logic is now internally consistent for the active auth path.

---

## Blockers

### 1. Live account data still determines the final route

If the affected Firebase user still has mismatched role/setup data in Firestore, the system will now route consistently, but it will route according to that canonical data. This fix removes the loop caused by disagreement in code; it does not rewrite user records.

### 2. Browser-level auth verification is still pending

I verified the code path changes locally and ran:

- `git diff --check -- assets/js/role-helper.js assets/js/auth-context.js assets/js/auth-guard.js assets/js/auth-service.js portal/login.html`

I did **not** run a full browser login against the live Firebase project from this session.

### 3. Legacy/deprecated auth files still contain old hardcoded peer references

These are not part of the active path I fixed, but they still exist:

- `assets/js/auth-service-v3.js`
- `assets/js/auth-guard-strict.js.deprecated`

They are residual cleanup risk if the project later switches to those files without reconciling their logic.

---

## Next Action

1. Log in with the affected peer account through [portal/login.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/login.html#L1).
2. Confirm the account remains on [portal/peer-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/peer-dashboard.html#L1) without a second redirect.
3. If it still lands on the wrong destination, inspect the live Firestore `users/{uid}` and `roles/{uid}` documents for the actual logged-in UID and correct the role/setup data.

The precise first step for the next session is:

- **Sign in with the previously affected peer account and watch whether the route settles once on `peer-dashboard.html` instead of bouncing.**

---

*Prepared by Codex for the Soulamore Dev Team.*
