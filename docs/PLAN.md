# Soulamore Infrastructure Upgrade: PLAN.md

## 1. Objective
Transition Soulamore's infrastructure to high-performance, isolated standards for AI and Communication. 
- **AI**: Implement isolated LLM routing for assessments and chat.
- **Email**: Migrate to Brevo and enable mass marketing capabilities.
- **Monitoring**: Add health telemetry for all integrated services.

## 2. Component Breakdown

### A. Backend Intelligence (Firebase Functions)
- **Email Migration**:
  - `functions/src/emailService.ts`: Replace `zeptomail` SDK with `@getbrevo/brevo`.
  - Implement a unified `sendEmail` interface that supports both transactional and bulk payloads.
- **LLM Routing**:
  - `functions/src/llmRouter.ts` [NEW]: Implement the `x-app-id` header pattern to select specific API keys from Secrets Manager.
  - Support `soul-assessment` and `soul-bot` App-IDs.
- **Health Telemetry**:
  - `functions/src/healthMonitoring.ts` [NEW]: Secure HTTPS callable function to check API quotas and service status.

### B. Admin Dashboard (Frontend)
- **Navigation Enhancement**:
  - Inject "API Health" and "Campaign Center" into the sidebar.
- **Campaign Center**:
  - Implement a vanilla JS version of `UniversalEmailAdminManager` logic.
  - Features: CSV upload (PapaParse), template selection, live preview, and batch dispatch.
- **Health Dashboard**:
  - Real-time status indicators for Firebase, Brevo, and LLM Routers.

## 3. Tech Stack & Dependencies
- **SDKs**: `@getbrevo/brevo` (v2.0+)
- **Parser**: `PapaParse` (via CDN for dashboard)
- **Secrets**: Firebase Secret Manager (`BREVO_API_KEY`, `LLM_HUB_API_KEY`)

## 4. Verification & Security
- **Auth Guard**: New functions must be strictly protected by `admin` role checks.
- **Rate Limiting**: Apply Firestore-based rate limiting to the new LLM router to prevent credit exhaustion.
- **Validation**: 
  - `npm run build` in functions.
  - Test campaign dispatch to `contact.adityaharsh@gmail.com`.

## 5. Deployment Phases
1. **Foundation**: Update dependencies and set secrets.
2. **Backend**: Implement Brevo service and LLM router.
3. **Frontend**: Update Admin Sidebar and inject new view modules.
4. **Verification**: Final audit and test dispatches.
