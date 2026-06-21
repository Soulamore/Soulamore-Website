# 2026-03-25 | CODEX | HANDOFF | Maintenance Mode And Security Hardening

> **Status:** Complete  
> **Prepared For:** Aditya  
> **Prepared By:** Codex  
> **Scope:** Harden Firestore rules, convert Maintenance Mode from placeholder UI into a working runtime control, and fix shared auth/logout issues discovered during verification.

---

## Executive Summary

I completed the local hardening pass that was still missing after the earlier admin dashboard changes.

The main outcomes are:

1. **Firestore rules are materially tighter** and no longer rely on duplicate match blocks for `peer_bookings` and `professionals`.
2. **Maintenance Mode is now a real feature**, backed by a Firestore runtime document and enforced on public/non-admin entry paths.
3. **Shared logout reliability is improved** by removing stale `getAuth()` imports from dashboard entry scripts and shared portal utilities.
4. **Payment auditability remains aligned** with the earlier payment tagging change in `peer-booking-handler.js`.

This is solid at the repo level. It is **not live in Firebase until the current local `firestore.rules` is published**.

---

## Completed

### 1. Refactored and hardened Firestore rules

File:

- [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L1)

Key changes:

- Added shared helper functions for `isSignedIn`, `isSelf`, and `isAdmin` at [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L4).
- Added public runtime config support at [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L53).
- Locked `blog_posts` reads so pending content is no longer publicly readable at [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L75).
- Consolidated `peer_bookings` into a single rule block with admin visibility built in at [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L229).
- Tightened `payments` creation so it must match a real booking owned by the authenticated user at [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L270).
- Reduced `professionals` to one final public-profile block at [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L302).

Why this matters:

- Pending moderation content is no longer accidentally public.
- Payment records are harder to forge from arbitrary authenticated clients.
- The ruleset is easier to reason about and less likely to drift because duplicate match blocks were removed.

### 2. Implemented working Maintenance Mode runtime

New file:

- [assets/js/maintenance-mode.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/maintenance-mode.js#L1)

What it does:

- Provides cached maintenance reads through [assets/js/maintenance-mode.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/maintenance-mode.js#L51).
- Decides which paths bypass maintenance at [assets/js/maintenance-mode.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/maintenance-mode.js#L46).
- Redirects non-admin traffic to the maintenance page at [assets/js/maintenance-mode.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/maintenance-mode.js#L78).

New page:

- [maintenance.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/maintenance.html#L1)

What it does:

- Shows a proper maintenance landing experience.
- Reads the live Firestore maintenance message at [maintenance.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/maintenance.html#L215).
- Redirects back to `/` if maintenance is no longer active at [maintenance.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/maintenance.html#L220).

### 3. Connected Maintenance Mode to the admin dashboard

File:

- [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L781)

What changed:

- Replaced the placeholder Maintenance Mode button with a real status panel, public notice textarea, and toggle control at [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L781).
- Added default message state at [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L819).
- Added maintenance loading/render logic at [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L1003).
- Added toggle write logic against `public_runtime/maintenance` at [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L1034).
- Included maintenance settings in the admin dashboard load sequence at [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L1109) and initial page boot at [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L2098).

### 4. Enforced maintenance checks on public and authenticated non-admin paths

Files:

- [assets/js/components.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/components.js#L1355)
- [assets/js/auth-guard.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-guard.js#L85)

What changed:

- Public shell pages now check maintenance before injecting the standard shell at [assets/js/components.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/components.js#L1355).
- Authenticated dashboard routes now check maintenance after role resolution and redirect non-admin users out when the mode is active at [assets/js/auth-guard.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-guard.js#L85).

### 5. Fixed shared logout/auth import issues

Files:

- [assets/js/portal-utils.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/portal-utils.js#L215)
- [portal/peer-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/peer-dashboard.html#L24)
- [portal/psych-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/psych-dashboard.html#L24)
- [portal/user-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/user-dashboard.html#L24)

What changed:

- Replaced stale `getAuth()` imports with the actual exported `auth` object from `firebase-config.js`.
- This removes a real logout fragility in shared runtime code and dashboard entry scripts.

### 6. Verified payment tagging remains aligned with the tightened rules

File:

- [assets/js/peer-booking-handler.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/peer-booking-handler.js#L337)

What is already in place:

- Payment records now include `userId` and `peerId` at [assets/js/peer-booking-handler.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/peer-booking-handler.js#L337) and [assets/js/peer-booking-handler.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/peer-booking-handler.js#L338), which is necessary for the tightened payment read and create rules.

---

## In-Progress

- No active code edit is still underway in this handoff.
- The local implementation is ready for deployment-side validation once Firebase rules are published.

---

## Blockers

### 1. Firestore rules are still local until published

The repo is fixed, but Firebase will not enforce the new rules until the contents of:

- [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L1)

are published through Firebase Console or deployed through the CLI.

This is the main blocker to calling the hardening fully live.

### 2. Live browser verification against Firebase was not available in this session

I verified repo state and rule structure locally, but I did not execute a live browser walkthrough against the deployed Firebase environment from this terminal session.

### 3. Existing build pipeline issue remains unrelated

`npm run build` is still failing in `journal-lab` because of an existing dependency resolution conflict around `eslint` and `eslint-plugin-react-hooks`. That issue is outside the maintenance/security work completed here.

---

## Next Action

1. **Publish the current local Firestore rules** from [firestore.rules](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L1).
2. After publish, verify in the live app:
   - admin can toggle Maintenance Mode from [portal/admin-dashboard.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html#L781)
   - public pages redirect to [maintenance.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/maintenance.html#L1) when enabled
   - admin dashboard still bypasses maintenance
   - blog moderation content is no longer publicly readable
   - sessions/accounting/support groups still load for admin

The precise first step for the next session is:

- **Open Firebase Console → Firestore Database → Rules → paste the current local `firestore.rules` contents → Publish.**

---

*Prepared by Codex for the Soulamore Dev Team.*
