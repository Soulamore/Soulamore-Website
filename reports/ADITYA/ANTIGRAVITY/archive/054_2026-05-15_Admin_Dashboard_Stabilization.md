# Admin Dashboard Stabilization & API Migration (2026-05-15)

## Status: COMPLETED (Pre-Deployment Ready)
**Lead Agent**: Antigravity
**Focus**: Infrastructure Hardening & API Consolidation

### 🎯 Objective
Finalize the restoration of the Soulamore Admin Dashboard by consolidating navigation logic and migrating the Campaign Engine to the unified same-origin `/api` architecture.

---

### 📋 TODO List

- [x] **Infrastructure: API Bridge Enhancement**
    - [x] Update `functions/src/apiRouter.ts` to include `/api/campaign/preview` and `/api/campaign/trigger` routes.
    - [x] Implement robust error handling and logging for campaign dispatches.
    - [x] Verify `validateFirebaseIdToken` correctly filters non-admin requests for these sensitive routes.

- [x] **Backend: Campaign Engine Refactor**
    - [x] Modify `functions/src/campaigns.ts` to expose core logic for preview and trigger.
    - [x] Align parameter handling (`templateData`, `isTest`) with dashboard requirements.
    - [x] Test batch dispatching logic with Brevo SMTP relay.

- [x] **Frontend: Dashboard Consolidation**
    - [x] Merge fragmented `switchView` hooks into a single handler in `portal/admin-dashboard.html`.
    - [x] Transition `previewSoulBroadcast` and `triggerSoulBroadcast` to `fetch()` based API calls.
    - [x] Fix potential race conditions in initial data loading.

- [ ] **Verification & Audit**
    - [ ] Validate real-time telemetry badges (Brevo, LLM, Firebase).
    - [ ] Confirm AI Campaign Generation successfully populates forms via `/api/chat`.
    - [ ] Run full system check on navigation and session management.

---

### 🛠️ Technical Context
- **API Base**: `/api` (Express v2 Function)
- **Auth Strategy**: Firebase ID Token via `Authorization: Bearer <token>`
- **Telemetry**: Probing Brevo SMTP, LLM Router Firestore, and Firebase Core status.
