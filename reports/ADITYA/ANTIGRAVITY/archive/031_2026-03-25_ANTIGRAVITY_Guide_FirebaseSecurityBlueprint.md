# 🛡️ Master Security & Firebase Infrastructure Blueprint
**Project:** Soulamore Master Reference
**Date:** March 21, 2026
**Status:** 💎 INDUSTRY STANDARD - PRODUCTION READY
**Applicability:** Use as a template for *all* web & mobile projects using Firebase / Node.js.

---

## 📋 Executive Summary

This blueprint represents the "Golden Path" for building secure, scalable, and abuse-resistant full-stack applications. It consolidates learnings from the **Soulamore 2026 Security Audit**, focusing on Identity (IAM), Secret Management, Bot Prevention, and Network Security.

---

## 🔐 1. Identity & Access Management (IAM)

### 1.1 Custom Claims (The Ultimate RBAC)
**Principle:** Never trust client-provided roles. Use Firebase Custom Claims for cryptographically signed identity.
- **Implementation:** Use a Cloud Function to assign roles (Admin, Peer, Psychologist, etc.).
- **Security Rule:** `allow read: if request.auth.token.role == 'admin';`
- **Benefit:** Roles cannot be modified by the user in the browser.

### 1.2 Strict Auth Guarding (`auth-guard-strict.js`)
**Principle:** Perform redirection/authorization at the earliest possible lifecycle event.
- **Technique:** Inject the Auth Guard in the `<head>` of HTML files *before* any other scripts load.
- **Feature:** "Fails closed" – if the auth check fails, the user is redirected to `/login.html` immediately, preventing "Login Flicker."
- **Standard:** Use `onAuthStateChanged` combined with `getIdTokenResult()`.

---

## 🔑 2. Secret Management (Zero-Leak Policy)

### 2.1 Firebase CLI Config (No Git Secrets)
**Principle:** Hardcoded secrets in code (even private repos) are a high-severity vulnerability (Finding F-01).
- **Prohibited:** `const API_KEY = "12345";` in `index.js`.
- **Enforced:** Use `firebase functions:config:set google.client_secret="xxx"`.
- **Backend Access:** `const secret = functions.config().google.client_secret;`.
- **Local Dev:** Use `.env` files (added to `.gitignore`) with `process.env`.

---

## 🤖 3. Bot & Abuse Prevention (The Wall)

### 3.1 Firebase App Check (reCAPTCHA Enterprise)
**Principle:** Block scripted access to your API and Database before it even hits your logic.
- **Provider:** Use Google reCAPTCHA Enterprise.
- **Enforcement:** Enforce App Check in the Firebase Console for **Firestore** and **Cloud Functions**. 
- **Benefit:** Blocks scrapers and automated "wget/curl" attacks.

### 3.2 Server-Side Rate Limiting
**Principle:** Prevent hammer-attacks and brute-force (Finding F-10).
- **Tool:** Implement a `rateLimit` helper in Cloud Functions using Firestore transactions.
- **Thresholds:** 10 messages/hour for contact forms; 30/hour for chat; 5/hour for bookings.

### 3.3 Query Hardening (Anti-Scraping)
**Principle:** Prevent competitive scrapers from bulk-downloading your therapist database or blogs.
- **Rule:** `allow list: if request.query.limit != null && request.query.limit <= 10;`.
- **Result:** Forces pagination and makes bulk scraping computationally expensive.

---

## 🌐 4. Network & Browser Security

### 4.1 Content Security Policy (CSP)
**Principle:** Mitigate XSS and Data Injection at the browser level.
- **Meta Tag:** Use a standardized CSP meta tag in every HTML file.
- **Whitelist:** Strictly whitelist only necessary domains (Firebase, Google APIs, Razorpay, ZeptoMail).
- **Unsafe-inline:** Avoid `unsafe-inline` and `unsafe-eval` in production.

### 4.2 Security Headers (`firebase.json`)
**Principle:** Instruct the browser to protect the user via HTTP protocols.
- **Headers:** 
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY` (Anti-Clickjacking)
    - `Referrer-Policy: strict-origin-when-cross-origin`

---

## 📦 5. Operation & Monitoring

### 5.1 Bandwidth & Cost Monitoring
**Principle:** Detect "silent" scraping by monitoring usage spikes.
- **Daily Alerts:** Set a daily bandwidth alert (e.g., 500MB/day) in Google Cloud Billing.
- **Automated Detection:** Deploy a Cloud Function (`detectScrapingPatterns`) that checks for IPs/IDs with high request volume.

### 5.2 Unified Logout System
**Principle:** Ensure NO session traces remain on shared devices.
- **Logic:** `auth.signOut()` + `sessionStorage.clear()` + `localStorage.removeItem('user')` + `cookie cleanup`.

---

## 🚀 6. New Project Implementation Checklist

| Step | Action | Tool / File |
|------|--------|-------------|
| 1 | **Secret Rotation** | `firebase functions:config:set` |
| 2 | **RBAC Config** | `auth.setCustomUserClaims(uid, {role: 'admin'})` |
| 3 | **Auth Guard** | Place `auth-guard-strict.js` in `<head>` |
| 4 | **CSP Setup** | Add `<meta http-equiv="CSP">` |
| 5 | **Bot Layer** | Register App Check in Firebase Console |
| 6 | **Rule Lock** | `allow read, write: if false;` by default |

---

> [!IMPORTANT]
> **This blueprint is a living document.** Whenever a new security vulnerability is discovered and fixed in the field, update this guide to protect all future projects.

*Prepared by ANTIGRAVITY (Advanced Coding Agent)* 🛡️
