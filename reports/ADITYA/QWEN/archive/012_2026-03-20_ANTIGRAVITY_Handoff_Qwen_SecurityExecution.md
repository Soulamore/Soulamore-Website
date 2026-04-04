# 🟢 Handoff: Security Audit Remediation & RBAC Implementation - QWEN

**Date:** March 20, 2026
**From:** `@[antigravity]`
**To:** `@[qwen]`
**Classification:** CRITICAL / SECURITY

---

## 1. Context & Objective
The Soulamore platform has undergone a comprehensive full-stack security audit. This resulted in **22 findings** (4 Critical, 7 High, 7 Medium, 4 Low) covering potential credential leaks, authentication bypasses, and insecure Role-Based Access Control (RBAC).

**Your mission is to execute the remediation roadmap defined in the project artifacts.**

---

## 2. Key Artifacts for Takeover
You MUST read these before performing any work:

| Artifact | Purpose |
| --- | --- |
| [implementation_plan.md](file:///c:/Users/adity/.gemini/antigravity/brain/5c356f04-03a8-46d7-b232-34fdf6c4c2a5/implementation_plan.md) | Phased roadmap for all code changes. |
| [task.md](file:///c:/Users/adity/.gemini/antigravity/brain/5c356f04-03a8-46d7-b232-34fdf6c4c2a5/task.md) | Progress tracking for Phase 1, 2, and 3. |
| [Security Audit Report](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/ADITYA/ANTIGRAVITY/2026-03-20_ANTIGRAVITY_Security_Audit_Bot_Abuse_Prevention.md) | Detailed findings and remediation logic (F-01 to F-22). |

---

## 3. High-Priority Work (Phase 1)
The following tasks are considered **BLOCKING** and should be addressed in your next session:

1.  **F-01 [CRITICAL]:** Rotate hardcoded Google OAuth secret and ZeptoMail SMTP key in `functions/index.js`. Move them to `firebase functions:config`.
2.  **F-03 [CRITICAL]:** Delete the `dev-` and `admin_root` hardcoded bypasses in `auth-guard.js` (lines 96-99).
3.  **F-04 [CRITICAL]:** Refactor `releasePayout` in `functions/index.js` to use Firebase Custom Claims (`context.auth.token.role === 'admin'`) instead of a user-writable Firestore field.
4.  **F-09 [CRITICAL]:** Secure the `active_souls` collection in `firestore.rules` to prevent unauthenticated write abuse.
5.  **F-11 [HIGH]:** Lock the `payments` collection in `firestore.rules` to prevent direct client-side updates (`allow update: if false`).

---

## 4. Technical Constraints
- **Custom Claims**: Transition to server-side roles. No more reading `role` from the `users` collection for security-critical decisions.
- **Node.js Environment**: Use `firebase-admin` for setting claims.
- **Firestore Rules**: Follow the principle of **Private by Default**.

---

## 5. Deployment Reminder
Before deploying any changes to `firestore.rules` or `functions`, ensure the **Structural Hosting Fixes** (moving away from root deployment) are finalized to prevent bandwidth spikes.

---

**Status:** Awaiting Execution of Phase 1.
**Next Specialist:** `@[qwen]`
