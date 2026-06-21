# Soulamore Compliance & Security TODO List

This checklist contains all immediate and short-term tasks needed to align **soulamore.com** with global privacy regulations (GDPR, DPDP Act 2023, CCPA, etc.) and address security vulnerabilities, using the exact specifications from the compliance package.

---

## 🔴 Phase 1: Legal Pages & Footer Compliance (Must do before launch)
- [ ] **Required Footer Links:** Implement visible links on all pages without requiring login or JavaScript:
  - Privacy Policy (`/privacy`)
  - Terms of Service (`/terms`)
  - Cookie Settings (reopens CMP preferences panel)
  - Disclaimer (`/disclaimer`)
  - Contact Us
- [ ] **India IT Act Grievance Officer:** Add a visible Grievance Officer block in the footer:
  - *Grievance Officer: [Name] — grievance@soulamore.com*
- [ ] **Medical Disclaimer Banner:** Add a one-line disclaimer visible in the footer on all pages:
  - *Soulamore is not a clinical service and does not provide medical advice. If you are in crisis, call iCall: 9152987821 | Crisis Help →* (Crisis Help must link directly to `/help`).
- [ ] **Indian Company Corporate Block:** Add Hashlilly Private Limited registered legal details:
  - *Hashlilly Private Limited | CIN: [CIN Number] | Registered Address: [Address] | © 2026 Hashlilly Private Limited.*
- [ ] **Privacy Policy Page:** Build `/privacy` (ensure it loads without authentication or JavaScript dependencies). Display the plain-language **TL;DR Summary Box** at the very top.
- [ ] **Terms of Service Page:** Build `/terms` with the **Medical Disclaimer Alert Box** featured at the absolute top of the page.

## 🔴 Phase 2: User Consent & Age Gate (Must do before launch)
- [ ] **Cookie Consent Banner:** Integrate a Cookie Consent Banner. Because Soulamore has **zero** analytics/marketing cookies, the banner must reflect *Strictly Necessary only* ("Got it / Cookie Details").
- [ ] **Sign-up Age Gate:** Add an actual DOB date-picker field on the sign-up form (no simple checkbox).
  - *Under 13:* Block account creation. Show: *"Soulamore requires users to be at least 13 years old. You cannot create an account at this time."*
  - *13–17:* Lock account (set status to `pending` in `parental_consents`) and trigger the **Parental Consent Flow**.
  - *18+:* Proceed to standard registration.
- [ ] **Parental Consent Email Flow:** Send a verification link to parent email. Link must contain a hashed token (`consent_token` saved as a bcrypt hash).
  - If parent approves: Update status to `approved` and unlock account.
  - If parent denies or does not respond within 7 days: Cascade delete the pending account and all data within 24 hours.
- [ ] **Wellness Data Consent Modal:** Build a full-screen, blocking modal before a user can access any wellness features (journal, mood tracker). User must tap an explicit button ("I understand and consent") to confirm sensitive data processing consent.

## 🔴 Phase 3: Crisis Response Protocol (Must do before launch)
- [ ] **Server-Side Keyword Detector:** Implement keyword detection in journal/mood inputs:
  - *Tier 1 (Emergency):* (e.g., "kill myself", "suicide", "want to die") Save the entry normally, then display a blocking modal showing crisis helpline details (iCall: 9152987821, Vandrevala Foundation: 1860-2662-345) and a mandatory *"I'm safe — continue to app"* button.
  - *Tier 2 (Concern):* Show a softer top-screen banner ("It sounds like things have been difficult. You deserve support...").
  - *Tier 3 (Distress):* Passively surface resource listings in feed.
- [ ] **Crisis Resources Page:** Build a static `/help` page (must load without auth or JS) containing domestic (India) and international crisis helpline contacts.
- [ ] **Logging Rules:** Ensure crisis events log only timestamps—**NEVER** user content or personal identifier information (PII).
- [ ] **Ambient Reassurance:** Add ambient security copy inside journal inputs: *“🔒 Private and encrypted. Only you can see this.”*

## 🔴 Phase 4: Server-Side Restrictions for Minor Accounts (Must do before launch)
- [ ] **Enforce Minor Account Restrictions:** For any accounts with a minor flag (under 18):
  - Completely block behavioral advertising and commercial behavioral profiling.
  - Exclude minor's data from any third-party analytics sharing.
  - Exclude minor's data entirely from ML/AI training datasets.
  - Disable public profile visibility.
  - Block direct messaging from adults (unless in same verified peer group).
  - Prohibit any data sale or sharing.

## 🔴 Phase 5: Security Hardening (Must do before launch)
- [ ] **IDOR Prevention:** Replace sequential integer IDs with UUID v4 in all database tables (journal entries, mood logs). Enforce server-side authentication and ownership checks on all API routes fetching/updating entries.
- [ ] **Cookie Auth:** Store JWTs in `httpOnly, Secure, SameSite=Strict` cookies. Do **not** use `localStorage` (protects against XSS token theft).
- [ ] **XSS Sanitization:** Sanitize journal entries (Markdown/HTML) using `DOMPurify` before rendering.
- [ ] **Rate Limiting:** Implement rate limits on the login, registration, and journal submission API routes.

## 🔴 Phase 6: Data Retention & Deletion Schedule (Must do before launch)
- [ ] **Cascade Hard Deletes:** Deletion requests must execute **hard deletes** (not flags/soft deletes) across all tables (users, journals, logs, etc.) within 30 days.
- [ ] **Wellness Data Backups:** Configure Soulamore wellness data backups to be overwritten within **24 hours**. Standard 7-30 day backup retention does NOT apply to wellness data.
- [ ] **Parental Consent Withdrawal SLA:** If a parent withdraws consent, lock the account immediately and hard delete all associated data within **7 days**.
- [ ] **Consent Records Retention:** Retain sensitive data consent records for account lifetime + 3 years. Retain withdrawal records for 3 years post-withdrawal.
- [ ] **Anonymize ip_address:** Run a scheduled job to null/anonymize `ip_address` in cookie and processing consent records after **24 hours**.

---

## 🟠 Phase 7: Privacy Operations (Do within 1 month post-launch)
- [ ] **Privacy Dashboard:** Build a working privacy dashboard under Account Settings:
  - *Download My Data:* Button that triggers a JSON/CSV file generation (delivered within 30 days).
  - *Delete My Account:* Destructive red button that cascades deletes across all database tables.
  - *Withdraw Consent Toggle:* Allows toggling off wellness data processing.
- [ ] **DigiLocker Integration Roadmap:** Scope and plan DigiLocker-based verification for Indian minors post-launch.
