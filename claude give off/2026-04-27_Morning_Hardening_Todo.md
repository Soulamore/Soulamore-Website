# ☀️ Morning Hardening Todo: Bandwidth & Stability Lockdown
**Date:** 2026-04-27
**Status:** Urgent / Pre-Flight Checklist

This list contains the critical manual actions and codebase audits required to resolve the 80GB/day egress emergency and finalize the UI stabilization.

---

## 🔴 CRITICAL: Egress Emergency (Manual Console Actions)
*These must be done by the user in the Firebase/Cloudflare consoles.*

- [ ] **Disconnect Default Domains:** In Firebase Console -> Hosting, remove/disconnect `soulamore-f0a64.web.app` and `soulamore-f0a64.firebaseapp.com`. This forces all traffic through Cloudflare.
- [ ] **Cloudflare Firewall:** Add a "Block" rule for User-Agents: `meta-externalagent`, `sqlmap`, `nikto`, `masscan`, `curl`.
- [ ] **Cloudflare Rate Limiting:** Set a threshold of >120 requests/minute per IP.
- [ ] **Firebase Storage Rules:** Ensure `storage.rules` prevents public listing of the entire bucket.

---

## 🔍 CODEBASE AUDITS (AI/Developer Tasks)

### 1. The 404 Payload Audit
- [x] **File Size Check:** `404.html` reduced to **6.9KB** (from 13KB+).
- [x] **Header-Only 404:** Optimized version created with inlined assets and no external dependencies.
- [x] **Verify 404 Behavior:** Confirmed via `curl -I` that invalid paths return a true `404 Not Found` status.

### 2. Firestore Listener Audit (The "Egress Leak")
- [x] **Presence Handler:** Wrapped in an Interaction Gate in `presence-handler.js`.
- [x] **Data Handler:** `updatePulseStats` in `data-handler.js` now waits for user interaction before starting the listener.
- [x] **Problem Wall:** `initWall` in `problem-wall-handler.js` gated by user interaction.
- [x] **Optimization Goal:** All major listeners moved behind an "Interaction Gate" (mousedown, keydown, scroll, touchstart) to prevent bot-driven data drain.

### 3. UI Stabilization
- [x] **News Ticker:** Verified branding colors (#4ECDC4/Green for On, #F49F75/Orange for Off) are correctly applied.
- [x] **Z-Index Audit:** Moved Feedback button to `bottom: 52px` to clear the News Ticker; verified SoulBot widget is at `bottom: 80px`.

---

## 📈 PROGRESS TRACKING
- **Hardening Applied:** Scoped rewrites, Cache-Control, and Heartbeat doubling (Done).
- **Redirection Applied:** Domain redirection script added to `index.html` (Done).
- **Cleanup:** Duplicate logic in `components.js` removed (Done).

> [!IMPORTANT]
> Priority #1 for tomorrow morning is verifying the 404 file size and moving the `updatePulseStats` listener behind a user-interaction trigger.
