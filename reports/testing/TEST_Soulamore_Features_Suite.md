# Soulamore Platform: Features Testing Suite & Use Cases
**Prepared by:** Antigravity (QA/Test Specialist)
**For:** Aditya & Abhishek (Testing Team)
**Date:** 21 June 2026
**Classification:** Internal — Active Testing Workspace & Living Test Register
**Status:** Living Document (Update as you test)

---

## 🏁 Session Handoff Info
*   **✅ Completed**: Setup of the testing report following the Universal Reporting Protocol. Staged and configured Git tracking for reports folders except for local archives.
*   **🚧 In-Progress**: Manual feature testing by Aditya and Abhishek.
*   **⚠️ Blockers**: None. Active session fully authenticated.
*   **⏭️ Next Action**: Abhishek/Aditya to run manual test cases detailed in Section 2 and Section 3 below on `localhost:3000` or the live site.

---

> [!NOTE]
> **Aditya & Abhishek:** Use this file as your collaborative test register. When you verify a feature, update your respective status row (e.g., mark it `✅ PASS` or `❌ FAIL [Details]`) and write the verification date. Both of you must independently verify each use case.

---

## 🖥️ SECTION 1: USER & ADMIN DASHBOARDS USE CASES

### Use Case 1.1 — User Dashboard: Wellness Data Consent Wall
* **Verify that new users are blocked from dashboard access until they give explicit consent for processing sensitive wellness data.**

| Attribute | Details |
|---|---|
| **Actors** | Registered User |
| **Pre-conditions** | User is logged in but has not yet accepted the wellness data processing consent. |
| **Test Steps** | 1. Navigate to `/portal/user-dashboard.html` while logged in.<br>2. Confirm a full-screen modal ("Before You Begin") appears immediately, blocking the dashboard view.<br>3. Attempt to click outside the modal or press `ESC` to close it.<br>4. Click the **"I Consent"** button inside the modal. |
| **Expected Results** | - The modal cannot be dismissed by clicking outside or pressing `ESC`. It hard-blocks all user dashboard interaction.<br>- Clicking "I Consent" successfully writes a consent record to `processing_consents` collection in Firestore, closes the modal, and unlocks the dashboard. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

### Use Case 1.2 — User Dashboard: Data Export (Portability)
* **Verify that users can download all their personal and wellness data in a structured, portable JSON format.**

| Attribute | Details |
|---|---|
| **Actors** | Authenticated User |
| **Pre-conditions** | User is logged in and has existing data (journals, mood logs, profile info) in Firestore. |
| **Test Steps** | 1. Navigate to settings panel inside the user dashboard.<br>2. Find the **"Privacy & Data Rights"** section.<br>3. Click the **"Download My Data (JSON)"** button.<br>4. Inspect the downloaded `.json` file. |
| **Expected Results** | - An HTTP-callable function `exportUserData` compiles user profile, journals, mood entries, consent records, and bookings.<br>- A JSON file downloads automatically containing structured data with Firestore Timestamps formatted as ISO strings. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

### Use Case 1.3 — User Dashboard: Consent Withdrawal
* **Verify that users can withdraw their wellness data processing consent, locking their account and preparing it for deletion.**

| Attribute | Details |
|---|---|
| **Actors** | Authenticated User |
| **Pre-conditions** | User is logged in and has previously accepted wellness consent. |
| **Test Steps** | 1. Navigate to **Privacy & Data Rights** section in the settings panel.<br>2. Locate the active **"Wellness Data Consent"** toggle status (Active).<br>3. Click **"Withdraw Consent"** and confirm the confirmation popup. |
| **Expected Results** | - The consent record status is updated in Firestore `processing_consents`.<br>- The user is automatically signed out immediately to enforce processing halt.<br>- Future logins are redirected back to the consent wall. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

### Use Case 1.4 — Admin Dashboard: Security Event Monitoring
* **Verify that admins can view real-time security events, brute force detections, and anomalies.**

| Attribute | Details |
|---|---|
| **Actors** | Platform Administrator |
| **Pre-conditions** | Admin is logged in and has access to `/portal/admin-dashboard.html`. |
| **Test Steps** | 1. Open the Admin Dashboard.<br>2. Click on the **"Security Events"** tab/link in the sidebar.<br>3. Confirm that logged client-side or server-side events are listed.<br>4. Click **"Refresh Logs"** and check for updates. |
| **Expected Results** | - Recent security events (timestamps, severity, user identifier, description) fetch successfully from the `security_events` collection.<br>- Unauthorized access attempts are logged with IP hashes/IDs. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

### Use Case 1.5 — Admin Dashboard: Immediate Deletion (Bypass 30-day Retention)
* **Verify that admins can instantly delete a user's entire footprint, bypassing the 30-day retention schedule.**

| Attribute | Details |
|---|---|
| **Actors** | Platform Administrator |
| **Pre-conditions** | Admin is logged in; target user has requested deletion and is marked `pending_deletion`. |
| **Test Steps** | 1. Open Admin Dashboard and select the **"Users"** tab.<br>2. Locate the user marked `Pending Deletion`.<br>3. Click the **"Delete User (Immediate)"** button. |
| **Expected Results** | - Admin triggers secure Cloud Function `runAccountDeletion`.<br>- All related collections are cascade-deleted instantly.<br>- Firebase Auth profile of the user is deleted immediately. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

## 🔒 SECTION 2: SIGNUP & COMPLIANCE USE CASES

### Use Case 2.1 — Signup: DOB Gating (Under 13 Hard Block)
* **Verify that users under 13 years of age are prohibited from creating accounts.**

| Attribute | Details |
|---|---|
| **Actors** | Anonymous Visitor |
| **Pre-conditions** | Visitor is on the signup page `/portal/signup.html`. |
| **Test Steps** | 1. Input signup details: name, email, password.<br>2. In the Date of Birth picker, select a date that evaluates to **under 13 years old** from the current date.<br>3. Click **"Sign Up"**. |
| **Expected Results** | - The signup attempt is immediately blocked client-side.<br>- An error message displays: *"Soulamore requires users to be at least 13 years old. You cannot create an account."*<br>- No write operation occurs to Firebase Auth or Firestore. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

### Use Case 2.2 — Signup: DOB Gating (13–17 Minor Parental Consent Flow)
* **Verify that minors (13–17) trigger the parental consent flow and are locked out until parent approves.**

| Attribute | Details |
|---|---|
| **Actors** | Anonymous Visitor (Minor) |
| **Pre-conditions** | Visitor is on the signup page. |
| **Test Steps** | 1. Enter details and select a DOB that evaluates to **between 13 and 17 years old**.<br>2. Confirm that a **Parent/Guardian Email** field appears dynamically.<br>3. Fill in parent's email and complete registration.<br>4. Attempt to log in immediately using the new credentials. |
| **Expected Results** | - Account is created but flagged `ageGateTier: 'minor'` and `parentalConsentStatus: 'pending'`.<br>- Parent receives authorization link via email.<br>- Minor is redirected to `/auth/parental-consent-pending.html` and logged out.<br>- Logging in before approval displays the pending screen and logs the user out. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

### Use Case 2.3 — Parental Approval Page
* **Verify that a parent can approve a minor's registration using the email token link without logging in.**

| Attribute | Details |
|---|---|
| **Actors** | Parent / Guardian |
| **Pre-conditions** | A minor registered and triggered a parental consent pending record. |
| **Test Steps** | 1. Visit `/auth/parental-consent.html?token=VALID_TOKEN&child=CHILD_UID` in a clean browser window.<br>2. Click **"Approve Consent"**.<br>3. Return to the minor's login page and log in as the minor. |
| **Expected Results** | - Click handler updates Firestore `parental_consents/{id}` status to `approved`.<br>- The minor can now log in successfully and access their dashboard. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

### Use Case 2.4 — Password Security checks (HIBP Range API Integration)
* **Verify that breached passwords are caught client-side before registration.**

| Attribute | Details |
|---|---|
| **Actors** | Anonymous Visitor |
| **Pre-conditions** | Visitor is on the signup page. |
| **Test Steps** | 1. Enter details and DOB.<br>2. Set password to a known breached password (e.g., `password123`).<br>3. Click **"Sign Up"**. |
| **Expected Results** | - Password SHA-1 hash is computed; the first 5 characters are sent to the HIBP range API.<br>- Registration is blocked with a warning: *"This password has appeared in a data breach. Please choose a more secure password."* |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

## 🍪 SECTION 3: COOKIE & PRIVACY CONTROLS

### Use Case 3.1 — Granular Cookie Banner
* **Verify that the cookie banner allows users to reject all non-essential tracking.**

| Attribute | Details |
|---|---|
| **Actors** | Visitor |
| **Pre-conditions** | Cookies/Local Storage cleared. |
| **Test Steps** | 1. Visit the homepage `/index.html`.<br>2. Locate the cookie banner at the bottom.<br>3. Click the **"Essential Only"** button.<br>4. Check `localStorage` for `cookieConsent`. |
| **Expected Results** | - `localStorage.getItem('cookieConsent')` is set to `essential`.<br>- The banner disappears and no tracking scripts are initialized. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

## 🛠️ SECTION 4: CORPORATE & MARKETING CONTROLS

### Use Case 4.1 — Global Footer Compliance Verification
* **Verify that the corporate footer displays correct legal names, registrations, and grievance officer email across all subpages.**

| Attribute | Details |
|---|---|
| **Actors** | Visitor |
| **Pre-conditions** | Browsing the live site. |
| **Test Steps** | 1. Navigate to `/spaces/soulamore-workplace/plans.html` and scroll to the bottom.<br>2. Navigate to `/index.html` and scroll to the bottom.<br>3. Confirm company name is `Hashlilly (OPC) Private Limited`.<br>4. Confirm contact email is `support@soulamore.in`.<br>5. Verify that the advertising automation scope line is removed. |
| **Expected Results** | - Company information matches the updated legally compliant terms.<br>- Cache-busted versions (`?v=3.6`) force the updated script on both desktops and mobile devices. |
| **Aditya (AD) Status** | `⬜ PENDING` |
| **Aditya (AD) Date** | — |
| **Abhishek (AB) Status** | `⬜ PENDING` |
| **Abhishek (AB) Date** | — |

---

## 📝 UPDATES & TESTING LOG

Use this space to add notes, comments, and bug details discovered during testing.

*   *Aditya & Abhishek - Log entries here when updating this report.*
