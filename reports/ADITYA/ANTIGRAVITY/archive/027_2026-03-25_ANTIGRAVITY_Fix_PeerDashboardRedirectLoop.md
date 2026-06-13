# FIX REPORT: Peer Dashboard "Double Redirect" Loop

**Date:** March 25, 2026  
**Agent:** ANTIGRAVITY  
**Status:** 🛡️ DIAGNOSED & PLAN READY

---

## 🔎 PROBLEM OVERVIEW
Users logging in as **Peers** (specifically Sonika) were successfully redirected to the Peer Dashboard but were immediately "kicked" back to the User Dashboard after 1-2 seconds.

## 🔴 ROOT CAUSE: THE "IDENTITY SPLIT"
Our audit discovered a critical discrepancy between the login logic and the security guard:

1. **Login Bypass (Email-Based)**: `auth-context.js` has a hardcoded bypass for `sonikas1625@gmail.com` that sends the user to `peer-dashboard.html`.
2. **Security Guard (UID-Based)**: Once on the dashboard, `auth-guard.js` checks the **UID** against Firestore. 
3. **The Mismatch**: 
   - Sonika's "Peer" record in Firestore is linked to UID: `OCxPJMHBKCOPWtMerMiVvRyzImy1`.
   - The user is currently logged in with UID: `LWqekB2Ld0UKAB5VzNwHSGK3Vpm1`.
   - Result: `Auth Guard` sees a "Member" UID on a "Peer" page and "corrects" the URL, leading to the loop.

## 🛠️ SOLUTION STRATEGY
We are moving away from inconsistent bypasses to a **Unified Role Consensus** model:

1. **Hardened RoleHelper**: We have already refactored `role-helper.js` to be resilient to permission errors (falling back to the `users` collection if `roles` is blocked).
2. **Removing Bypasses**: We will remove the email-based bypass from `auth-context.js` and rely entirely on `RoleHelper`.
3. **Data Synchronization**: The user must ensure that the logged-in UID has the correct role in the Firestore `users` and `roles` collections.

## ✅ NEXT ACTIONS
1. **Move Bypasses to RoleHelper**: If hardcoded bypasses are needed for testing, they must live ONLY in `RoleHelper` so both the Login and Guard agree.
2. **Sync Dashboard Guard**: Update `auth-guard.js` to provide a "Graceful Failure" mode where it warns instead of redirecting if the session and Firestore disagree (for debugging).

---
*Created by Antigravity - Lead Agentic Architect*
