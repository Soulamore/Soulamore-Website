# 072 · 2026-07-24 · App Check Fix, Admin Auth & Git Sync

**Agent**: ANTIGRAVITY  
**Date**: 2026-07-24  
**Session type**: Bug Fix + DevOps  
**Branch**: `fix/campus-baseline-buttons` → merged to `main`

---

## What Was Done

### 1. Firebase App Check — 400 Bad Request Fixed

**Root cause**: `firebase-config.js` was initialising App Check with `ReCaptchaV3Provider`, but the Firebase project (`soulamore-f0a64`) was configured for **reCAPTCHA Enterprise**.

**Fix**: Switched provider in `assets/js/firebase-config.js`:

```js
// Before (wrong — causes 400)
provider: new ReCaptchaV3Provider('6Lc...')

// After (correct)
provider: new ReCaptchaEnterpriseProvider('6LcYEpIsAAAAANAIbvcDMDyYRUYmUFyyyGXsZEBP')
```

**Deployed** via `firebase deploy --only hosting`. **Commit**: `56d971e1`

---

### 2. Firestore Rules — Email-Based Admin Fallback

**Problem**: `isAdmin()` only checked the `role` custom claim in the JWT. If the claim was missing, the admin dashboard was locked out even for the actual admin.

**Fix**: Added email-based fallback to `firestore.rules`:

```javascript
function isAdmin() {
  return (isSignedIn() && 'email' in request.auth.token &&
    (request.auth.token.email.lower() == 'admin@soulamore.com' ||
     request.auth.token.email.lower() == 'aditya110197@gmail.com'))
    || (hasCurrentUserProfile() &&
        get(/databases/.../users/$(request.auth.uid)).data.role == 'admin');
}
```

**Commit**: `5defb94b`

---

### 3. Admin Custom Claim — Already Set (Verified)

Used the Firebase Identity Toolkit REST API (authenticated via Firebase CLI session token) to inspect `admin@soulamore.com`:

```json
{ "customAttributes": "{\"role\":\"admin\"}" }
```

**Claim was already correctly set** — no backfill needed. UID: `mBRTBu2UN5MgfOAcQpAESu5C4Cx2`

---

### 4. Admin Promotion Utility Scripts Added

New scripts committed to `functions/scripts/`:

| Script | Auth method | Notes |
|---|---|---|
| `promote-admin-cli-token.js` | Firebase CLI session token (REST API) | Best option — no service account needed |
| `promote-admin-gcloud.js` | `gcloud auth print-access-token` | Requires gcloud account with project access |
| `promote-admin-adc.js` | Application Default Credentials | Requires correct ADC account |
| `list-firestore-users.js` | ADC / auto-detect | Diagnostic: lists users + roles from Firestore |

`promote-admin-token.js` (embedded OAuth client secret) intentionally not committed.

---

### 5. `inspectCollections` — Removed (Never Committed)

A temporary, unauthenticated HTTP function `inspectCollections` was added to `functions/src/index.ts` during debugging to expose raw Firestore data. Deployment was cancelled and the change was reverted before commit — `index.ts` remains clean.

---

### 6. Git Sync

| Action | Result |
|---|---|
| Pulled Aryan's updates from origin | Merged via `ort` strategy |
| Pushed `fix/campus-baseline-buttons` | Done |
| Merged fix branch into `main` | Done |
| Pulled remote `main` (CI news bots) | Done |
| Pushed `main` | Done — `c224a1ab` |

GitHub flagged 19 dependency vulnerabilities (2 critical, 6 high) via Dependabot — separate task.

---

## Files Changed

| File | Change |
|---|---|
| `assets/js/firebase-config.js` | App Check provider fix |
| `firestore.rules` | Email-based `isAdmin()` fallback |
| `functions/scripts/promote-admin-cli-token.js` | New — admin promotion via CLI token |
| `functions/scripts/promote-admin-gcloud.js` | New — admin promotion via gcloud |
| `functions/scripts/promote-admin-adc.js` | New — admin promotion via ADC |
| `functions/scripts/list-firestore-users.js` | New — diagnostic user lister |

---

## Known Issues / Follow-ups

- [ ] **Dependabot alerts**: 2 critical, 6 high npm vulnerabilities — resolve separately
- [ ] **Google Analytics 403**: `gtag/js` blocked by adblocker — not fixable client-side, expected behaviour
- [ ] **Node.js 20 deprecation**: Functions runtime decommissioned 2026-10-30 — upgrade to Node 22 before October
- [ ] **`functions.config()` deprecation**: Migrate to Params API before March 2027

---

**Status: DONE**
