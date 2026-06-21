# Hashlilly Portfolio — Security Audit Report
**Prepared for:** Antigravity (Development & Design Studio)  
**Prepared by:** Aditya / Hashlilly Private Limited  
**Scope:** soulamore.com · hashlilly.in · thatsmissing.com · boozedin.com  
**Date:** June 2026  
**Classification:** Internal — Developer Handoff

---

## Executive Summary

This report documents security vulnerabilities commonly introduced by AI-assisted ("vibe coded") development across the Hashlilly product portfolio. The trigger was a documented real-world incident where a restaurant app exposed table-level order data and allowed cross-table order placement simply by editing a URL parameter (`/table/C4` → `/table/C7`). This class of vulnerability — **Insecure Direct Object Reference (IDOR)** — is one of many patterns that emerge when code is generated without security review.

Given that all four products handle sensitive data (anonymous mental health disclosures on Soulamore, professional identity on BoozeD In, proprietary startup intelligence on That's Missing, and business/financial data on hashlilly.in), the risk surface is significant.

This report is structured by vulnerability class, with product-specific callouts, risk ratings, and concrete fixes for each issue. Treat every item here as a mandatory action before any product goes to production or scales its user base.

**Risk Rating Key:**
- 🔴 CRITICAL — Immediate exploitation risk, user data at stake
- 🟠 HIGH — Significant risk, must fix before launch
- 🟡 MEDIUM — Real risk, fix within first sprint post-launch
- 🟢 LOW — Best practice, fix when capacity allows

---

## Section 1: Insecure Direct Object Reference (IDOR)

**The restaurant table exploit is this exact class of bug.**

### What It Is
When an API or URL uses a predictable identifier (sequential integer, simple code) to reference an object, and the server does not verify that the requesting user is *authorized* to access that object — any user can enumerate and access other users' data.

### How It Appears in Vibe Coded Apps
AI code generators default to the simplest possible identifier scheme: auto-increment integers (`user_id=1`, `order_id=42`, `session_id=100`). They also frequently skip authorization checks when generating CRUD operations, assuming the frontend "won't show" the wrong data — which is not a security control.

### Product-Specific Risks

**Soulamore** 🔴 CRITICAL  
Anonymous wellness journaling means users believe their entries are private. If sessions, journal entries, or mood logs are stored with sequential IDs and the API does not verify ownership, any user can read any other user's mental health disclosures. This is not just a security failure — it is a potential regulatory and reputational catastrophe.

**BoozeD In** 🔴 CRITICAL  
Professional profiles, connection requests, direct messages, and job postings referenced by sequential IDs would allow a user to read another professional's private messages or modify their profile/listings.

**That's Missing** 🟠 HIGH  
Startup intelligence reports, saved searches, and user-generated opportunity analyses represent proprietary research. If report IDs are sequential, a competitor can enumerate all reports.

**hashlilly.in** 🟠 HIGH  
Dashboard data, billing records, and product access configurations. An attacker switching their `account_id` in a request could access another company's subscription state.

### Fix
```
1. Replace all sequential integer IDs in user-facing references with UUIDs (v4).
   - Wrong: /api/journal/42
   - Right: /api/journal/f47ac10b-58cc-4372-a567-0e02b2c3d479

2. Every API endpoint that fetches or mutates an object MUST verify:
   - Is the requesting user authenticated? (auth check)
   - Does the requesting user OWN this object? (ownership check)
   
   Example (Node/Express):
   const entry = await JournalEntry.findById(req.params.id);
   if (!entry || entry.userId !== req.user.id) {
     return res.status(403).json({ error: 'Forbidden' });
   }

3. Never rely on the frontend to hide data. The API must enforce authorization
   independently of what the UI displays.
```

---

## Section 2: Broken Authentication & Session Management

### What It Is
Flaws in how users are identified and how their sessions are maintained — including weak tokens, improper expiry, missing logout, and token storage vulnerabilities.

### How It Appears in Vibe Coded Apps
AI generators frequently produce authentication that "works" in the happy path but skips edge cases: tokens that never expire, JWTs stored in localStorage (XSS-vulnerable), missing refresh token rotation, and no rate limiting on login endpoints.

### Product-Specific Risks

**Soulamore** 🔴 CRITICAL  
Anonymous-by-design means the auth token IS the user's identity. If that token is stolen via XSS or intercepted, the attacker has full access to the user's mental health data with no username/password fallback to reset.

**BoozeD In** 🔴 CRITICAL  
Professional identity and private messages. Session hijacking exposes the full social graph and DMs.

**All Products** 🟠 HIGH  
- JWTs stored in `localStorage` are readable by any JavaScript on the page (XSS vector).
- Long-lived or non-expiring tokens mean a stolen token gives permanent access.
- Missing brute-force protection on login endpoints.

### Fix
```
1. Token Storage:
   - Store JWTs in httpOnly, Secure, SameSite=Strict cookies — NOT localStorage.
   - httpOnly prevents JavaScript from reading the cookie entirely.

2. Token Expiry:
   - Access tokens: short-lived (15 minutes).
   - Refresh tokens: longer (7–30 days), stored httpOnly, rotated on each use.
   - Invalidate refresh tokens on logout server-side.

3. Login Endpoint Protection:
   - Rate limit login attempts: max 5 failed attempts per IP per 15 minutes.
   - Implement exponential backoff after repeated failures.
   - Use CAPTCHA (hCaptcha or Cloudflare Turnstile) after 3 failed attempts.

4. Soulamore-Specific:
   - Anonymous sessions still need a server-side session ID.
   - On "forget me" / data deletion requests, invalidate all tokens immediately.
   - Consider device fingerprinting as a secondary identifier for anonymous users.
```

---

## Section 3: Missing or Misconfigured Authorization (Access Control)

### What It Is
Even when authentication is correct (you know WHO the user is), authorization (what they're ALLOWED TO DO) may be absent or misconfigured.

### How It Appears in Vibe Coded Apps
AI generators often create role fields in the database ("role": "admin") but forget to actually check them in API routes. Alternatively, they check role on the frontend but not the backend — meaning an attacker who calls the API directly bypasses all frontend checks.

### Product-Specific Risks

**hashlilly.in** 🔴 CRITICAL  
The Hub model involves multiple products under one login with role-based unlocking on purchase. If purchase/role checks exist only in the frontend router, a user can navigate directly to premium routes. If admin endpoints exist without role checks, any authenticated user can access them.

**BoozeD In** 🟠 HIGH  
Recruiter vs candidate vs company vs admin roles. Misconfigured access control lets a candidate modify a company's job posting or read recruiter-only pipeline data.

**That's Missing** 🟠 HIGH  
Free vs paid tier access to intelligence reports. Role check bypass = full paid feature access without payment.

**Soulamore** 🟠 HIGH  
Admin/moderator access to user data must be strictly limited and audit-logged. AI-generated admin panels often expose full user tables without access control.

### Fix
```
1. Implement server-side middleware that checks role/permission on EVERY protected route.
   Never rely on frontend navigation guards as a security control.

2. Principle of Least Privilege:
   - API keys and service accounts get only the permissions they need.
   - Admin routes should be on a separate path prefix (/admin/*) with an additional
     admin-role middleware layer.

3. For the Hashlilly Hub:
   - Product access must be verified server-side on every request, not just on login.
   - Store purchased product entitlements in the database, check them in API middleware.

4. Audit Log for sensitive operations (especially Soulamore admin access to user data):
   - Log: who, what action, what object, timestamp, IP.
   - Store logs separately from application database — append-only.
```

---

## Section 4: Sensitive Data Exposure

### What It Is
Returning more data than necessary in API responses, exposing fields that should be private, or transmitting data without proper encryption.

### How It Appears in Vibe Coded Apps
When an AI generates a "get user" endpoint, it typically returns the entire database row — including hashed passwords, internal flags, admin metadata, billing info, and other fields never intended for the client. This is called **API over-fetching** and is extremely common in generated code.

### Product-Specific Risks

**Soulamore** 🔴 CRITICAL  
A `/api/user/profile` endpoint that returns the full user object might include: internal risk flags, mood history, therapist referral notes, IP addresses, device info, or other data the user never consented to share.

**BoozeD In** 🟠 HIGH  
Returning full user objects in search results might expose: email addresses, phone numbers, private notes, or connection status fields not intended for public profiles.

**All Products** 🟠 HIGH  
- API responses including `password_hash`, `internal_flags`, `created_by_admin`, `stripe_customer_id`, etc.
- Debug endpoints left active in production (`/api/debug`, `/api/test`, `/__debug__`).
- Stack traces returned in API error responses (reveals file paths, library versions, database schema).

**That's Missing** 🟡 MEDIUM  
Investor/startup intelligence data. API responses for one user's saved list might include metadata about other users' interaction with the same startup (engagement counts, etc.) that should be aggregated and anonymized.

### Fix
```
1. Create explicit Data Transfer Objects (DTOs) for every API response.
   Never return raw database models to the client.
   
   // Wrong (returns everything):
   res.json(await User.findById(id));
   
   // Right (explicit whitelist):
   const user = await User.findById(id);
   res.json({
     id: user.id,
     displayName: user.displayName,
     avatarUrl: user.avatarUrl,
   });

2. Remove all debug/test routes before deploying to production.
   Use environment variables to gate any diagnostic endpoints:
   if (process.env.NODE_ENV !== 'development') { return res.status(404); }

3. Return generic error messages to clients:
   - Wrong: "Column 'email' at index 2 violated unique constraint"
   - Right: "An account with this email already exists."
   Log the full error server-side only.

4. Ensure all data in transit uses TLS 1.2+ (HTTPS everywhere, no HTTP fallback).
   Set HSTS header: Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Section 5: Injection Vulnerabilities (SQL, NoSQL, Command)

### What It Is
When user-supplied input is incorporated into a database query or system command without proper sanitization, allowing an attacker to alter the query's logic or execute arbitrary commands.

### How It Appears in Vibe Coded Apps
AI generators sometimes use string interpolation to build queries, especially when writing "quick" implementations or when the prompt didn't specify to use parameterized queries. NoSQL injection in MongoDB is equally common and often overlooked.

### Product-Specific Risks

**All Products** 🔴 CRITICAL if present  
SQL/NoSQL injection in authentication endpoints is particularly dangerous — it can allow complete auth bypass.  
Search endpoints across all four products (startup search on That's Missing, people search on BoozeD In) are high-risk injection surfaces.

**Soulamore** 🔴 CRITICAL  
Any search or filter on journal entries, mood logs, or user data. Injection here could expose all users' mental health data.

### Fix
```
1. NEVER build queries with string concatenation or template literals.

   // Wrong (SQL injection risk):
   db.query(`SELECT * FROM users WHERE email = '${email}'`);
   
   // Right (parameterized):
   db.query('SELECT * FROM users WHERE email = $1', [email]);

2. For MongoDB/NoSQL:
   // Wrong (NoSQL injection via object injection):
   User.findOne({ email: req.body.email }); // if email = { "$gt": "" }, returns all users
   
   // Right (sanitize and type-check input):
   if (typeof req.body.email !== 'string') return res.status(400).send('Invalid input');
   User.findOne({ email: req.body.email });
   
   // Or use a validation library (Zod, Joi, Yup) to enforce input shape.

3. Use an ORM/ODM (Prisma, TypeORM, Mongoose with strict schema) — these handle
   parameterization by default for standard operations. Be careful with raw query
   escape hatches.

4. Input validation on ALL user-supplied fields:
   - Type check (string, number, boolean)
   - Length limits (don't allow 10MB strings in a username field)
   - Format validation (email regex, UUID format, etc.)
```

---

## Section 6: Cross-Site Scripting (XSS)

### What It Is
When user-supplied content is rendered in a browser without sanitization, allowing an attacker to inject malicious JavaScript that runs in other users' browsers — stealing cookies, session tokens, redirecting users, or defacing the UI.

### How It Appears in Vibe Coded Apps
AI generators often use `dangerouslySetInnerHTML` in React or direct `innerHTML` assignments in vanilla JS. They also frequently forget to sanitize markdown or rich text content before rendering.

### Product-Specific Risks

**Soulamore** 🔴 CRITICAL  
If journal entries or mood descriptions allow any HTML/markdown and are rendered without sanitization, a user who shares a "journal entry" or a moderation flow could execute scripts in a moderator's or another user's session.

**BoozeD In** 🟠 HIGH  
User-generated content in profiles, bios, posts, and messages. A script injected in a profile bio runs for every user who views that profile.

**That's Missing** 🟠 HIGH  
Startup descriptions, user-submitted tags, and opportunity notes. If any is rendered without sanitization, XSS is possible.

**hashlilly.in** 🟡 MEDIUM  
Lower risk if it's primarily a marketing/dashboard site with minimal user-generated content. Still check any admin-facing user content display.

### Fix
```
1. React: Never use dangerouslySetInnerHTML unless the content is from a trusted,
   server-controlled source. Even then, sanitize first.

2. For any user-generated content that must render as HTML (rich text editors):
   Use DOMPurify before rendering:
   import DOMPurify from 'dompurify';
   const clean = DOMPurify.sanitize(userContent);
   element.innerHTML = clean;

3. For markdown rendering (e.g., Soulamore journal entries):
   Use a safe markdown library (marked + DOMPurify, or remark with rehype-sanitize).
   Do NOT use marked alone without sanitization.

4. Set Content Security Policy (CSP) header:
   Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
   This limits where scripts can be loaded from, reducing XSS impact even if injection occurs.

5. Encode user-supplied data when embedding in URLs, HTML attributes, or JSON contexts.
   Never concatenate user input directly into these contexts.
```

---

## Section 7: Cross-Site Request Forgery (CSRF)

### What It Is
An attack that tricks a logged-in user into unknowingly submitting a request to your application from another website — causing state-changing actions (password change, data deletion, fund transfer) without the user's intent.

### How It Appears in Vibe Coded Apps
Vibe coded apps using cookie-based auth without CSRF tokens are vulnerable. AI generators often omit CSRF protection entirely, especially when generating "simple" REST APIs.

### Product-Specific Risks

**All Products** 🟠 HIGH  
Any state-changing operation (POST, PUT, DELETE) protected only by cookies is potentially CSRF-vulnerable.

**Soulamore** 🔴 CRITICAL  
An attacker could embed a hidden form on another page that submits a "delete account" or "change anonymity settings" request when a logged-in Soulamore user visits that page.

**BoozeD In** 🟠 HIGH  
Posting on behalf of a user, accepting connection requests, or modifying profile settings via CSRF.

### Fix
```
1. If using cookie-based auth (recommended per Section 2), use SameSite=Strict cookies:
   Set-Cookie: session=...; SameSite=Strict; HttpOnly; Secure
   SameSite=Strict alone prevents most CSRF attacks from other origins.

2. For additional protection (especially on forms), implement CSRF tokens:
   - Server generates a unique token per session, embeds in forms.
   - Server validates token on every state-changing request.
   - Use a library: csurf (Node), Django's built-in CSRF middleware, etc.

3. Always validate the Origin and Referer headers on state-changing API endpoints.
   Reject requests where Origin does not match your domain.

4. APIs consumed by your own frontend: verify Content-Type: application/json
   on POST/PUT/DELETE requests — form-based CSRF attacks can't set this header.
```

---

## Section 8: Security Misconfigurations

### What It Is
Default configurations, unnecessary features enabled, verbose error messages, open cloud storage buckets, missing security headers, and other setup-level mistakes that create unnecessary attack surface.

### How It Appears in Vibe Coded Apps
AI generators scaffold projects with development-friendly defaults (CORS set to `*`, debug mode on, all ports open, public S3 buckets) and these defaults often reach production unchanged.

### Specific Risks Across the Portfolio

**CORS Misconfiguration** 🔴 CRITICAL  
Setting `Access-Control-Allow-Origin: *` on an API that uses cookie auth means any website can make credentialed requests to your API.

```
// Wrong:
app.use(cors()); // defaults to *

// Right:
app.use(cors({
  origin: ['https://soulamore.com', 'https://www.soulamore.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

**Security Headers** 🟠 HIGH  
Missing HTTP security headers across all four properties. Use `helmet` (Node.js) or equivalent:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY  (prevents clickjacking)
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: (see XSS section)
```

**Open Cloud Storage (S3 / Firebase / Supabase)** 🔴 CRITICAL  
Vibe coded apps frequently configure cloud storage buckets with public read/write access for simplicity.
- Check every S3 bucket, Firebase Storage rule, and Supabase Storage bucket.
- User-uploaded files (profile photos, documents) must NOT be publicly listable.
- Signed URLs with expiry should be used for serving private files.

**Environment Variables in Client Code** 🔴 CRITICAL  
Variables prefixed `NEXT_PUBLIC_` or `VITE_` are bundled into the frontend JS and visible to anyone.
- API keys, secret tokens, and database credentials must NEVER be in client-side env vars.
- Private keys stay on the server. Period.

**Default Admin Credentials / Endpoints** 🟠 HIGH  
- Remove or password-protect any auto-generated admin panels (e.g., `/admin`, `/_panel`).
- Change all default passwords on any service (database, Redis, admin UI).
- Disable unused services and close unused ports.

**Dependency Vulnerabilities** 🟡 MEDIUM  
- Run `npm audit` and `pip audit` (or equivalent) and fix high/critical vulnerabilities.
- Set up automated dependency scanning (GitHub Dependabot, Snyk).

---

## Section 9: Rate Limiting & Abuse Prevention

### What It Is
Without rate limiting, attackers can enumerate data, brute-force credentials, scrape your entire database, abuse API endpoints, or perform denial-of-service attacks — all for free.

### How It Appears in Vibe Coded Apps
Rate limiting is almost never included in AI-generated boilerplate because it doesn't affect the "happy path" during development.

### Product-Specific Risks

**That's Missing** 🔴 CRITICAL  
A startup intelligence platform with no rate limiting can be entirely scraped in minutes. All data that users pay for can be extracted freely.

**Soulamore** 🟠 HIGH  
- Registration endpoint: bots can create thousands of fake accounts.
- Mood/journal submission endpoint: can be flooded.
- Wellness resource lookup: can be scraped for content.

**BoozeD In** 🟠 HIGH  
- Profile search: entire member database can be enumerated and scraped.
- Connection request endpoint: can be spammed.
- Message sending: can be used for spam campaigns.

**All Products — Login Endpoints** 🔴 CRITICAL  
Unprotected login endpoints allow credential stuffing attacks (trying millions of leaked username/password combos from other breaches).

### Fix
```
1. Rate limit by IP on all public endpoints.
   Use express-rate-limit (Node), Django REST Framework throttling, or Cloudflare Rules.

   // Example (Node/Express):
   const rateLimit = require('express-rate-limit');
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 attempts per window per IP
     message: 'Too many login attempts. Please try again in 15 minutes.',
   });
   app.post('/api/auth/login', loginLimiter, loginHandler);
   
   const apiLimiter = rateLimit({
     windowMs: 60 * 1000, // 1 minute
     max: 60, // 60 requests per minute per IP
   });
   app.use('/api/', apiLimiter);

2. For authenticated API endpoints, rate limit by user ID in addition to IP.
   This prevents token-holding bots from abusing endpoints.

3. For That's Missing specifically:
   - Implement pagination that cannot be trivially iterated (cursor-based with opaque tokens).
   - Consider API key-based access with per-key rate limits for any public API tier.
   - Log and alert on unusual access patterns (100+ requests/minute from one user).

4. Use Cloudflare or a similar WAF layer in front of all four domains for:
   - Bot detection
   - DDoS mitigation
   - Geographic rate limiting if needed
```

---

## Section 10: File Upload Vulnerabilities

### What It Is
Unrestricted file uploads allow attackers to upload malicious files (scripts, executables, oversized files) that can be executed on your server or used to attack other users.

### How It Appears in Vibe Coded Apps
AI generators often implement file uploads that accept any file type, store files without renaming them, and sometimes store them in a web-accessible directory — allowing uploaded PHP/JS files to be executed by visiting their URL.

### Product-Specific Risks

**BoozeD In** 🟠 HIGH  
Profile photos, portfolio documents, CV uploads. Without validation, an attacker uploads `shell.php` or a 4GB file.

**Soulamore** 🟡 MEDIUM  
If users can upload images to journal entries or profile pictures.

**hashlilly.in** 🟡 MEDIUM  
Any file upload in the admin or onboarding flow.

### Fix
```
1. Validate file type server-side by reading the file's magic bytes (first bytes),
   NOT by trusting the file extension or Content-Type header supplied by the client.
   Use libraries: file-type (Node), python-magic (Python).

2. Rename uploaded files to a UUID before storage. Never preserve the original filename.
   Wrong: storing as "shell.php" → accessible at /uploads/shell.php
   Right: storing as "3f2a1b.jpg" (regardless of original name)

3. Store uploaded files OUTSIDE the web root (not in /public).
   Serve them through a controlled route that applies auth checks:
   GET /api/files/:fileId (checks ownership, then streams from storage)

4. Set maximum file size limits (2–5 MB for images, 10 MB for documents).
   Apply this at the web server level, not just the application level.

5. For images: run them through a image re-encoding step (sharp, Pillow) before storage.
   This strips embedded metadata and destroys any polyglot payload hidden in the image.

6. Use cloud storage (S3, Firebase) for file storage with serving via pre-signed URLs.
   Never execute files from storage. Disable script execution in storage buckets.
```

---

## Section 11: Logging, Monitoring & Incident Response

### What It Is
Without proper logging, you will not know when you are being attacked, when a breach has occurred, or what the attacker accessed. Without monitoring, you will not be alerted until users report problems — often days after a breach.

### How It Appears in Vibe Coded Apps
AI generators produce functional apps with zero logging or with `console.log` statements that go nowhere in production. No alerting. No audit trail.

### What to Implement

**Application Logging** 🟠 HIGH  
```
Log the following events:
- All authentication events (login success, failure, logout, token refresh)
- All authorization failures (403 responses)
- All admin actions
- All data deletion events
- Account creation and deletion
- Password/email change requests
- Payment events
- Unusual patterns (10+ failed requests from one IP, etc.)

Log format should include: timestamp, user_id (or 'anonymous'), action, 
resource, IP address, user_agent, outcome.

Do NOT log: passwords, tokens, full credit card numbers, or raw PII that 
is not necessary for the audit record.
```

**Structured Log Storage** 🟡 MEDIUM  
```
- Use a log aggregation service: Logtail, Papertrail, Datadog, or Axiom.
- Logs must be write-once / append-only from the application's perspective.
- Retain security logs for minimum 12 months.
```

**Alerting** 🟠 HIGH  
```
Set up alerts for:
- 10+ failed logins for the same account in 5 minutes (credential stuffing)
- Any 500 error spike (potential attack or misconfiguration)
- Admin panel access outside business hours
- Sudden spike in API requests (scraping attempt)
- Any access to deleted user data
```

**Soulamore-Specific: Breach Notification Plan** 🔴 CRITICAL  
Given the sensitive nature of mental health data, define and document:  
- Who is notified internally in case of breach (hour 1)  
- How users will be notified (within 72 hours per GDPR-equivalent standards)  
- What data was exposed (requires knowing exactly what you store — document this)  
- Legal obligations under Indian data protection regulations (DPDP Act 2023)

---

## Section 12: Data Privacy & Compliance (India-Specific)

### What It Is
The **Digital Personal Data Protection Act, 2023 (DPDP Act)** is now in force in India. It imposes obligations on entities that collect and process personal data of Indian residents. Non-compliance carries penalties up to ₹250 crore.

### Product-Specific Obligations

**Soulamore** 🔴 CRITICAL  
Mental health data is **Sensitive Personal Data** under Indian law. This triggers heightened obligations:
- Explicit, granular, revocable consent before collection
- Purpose limitation (data collected for wellness cannot be used for marketing)
- Data minimization (collect only what is necessary)
- Right to erasure (user requests deletion → complete deletion within defined timeframe)
- No sharing with third parties without explicit consent and disclosure

**All Products** 🟠 HIGH  
- Privacy Policy must accurately describe what data is collected, why, and with whom it is shared.
- Terms of Service must be in plain language (not just legalese).
- Cookie consent banner with genuine opt-out for non-essential cookies.
- Data retention policy: define and enforce how long different data types are kept.

**BoozeD In** 🟠 HIGH  
Employment/professional data has specific protections. Background check data, if collected, has heightened requirements.

### Minimal Compliance Checklist
```
□ Privacy Policy drafted by a lawyer, reviewed for DPDP Act compliance
□ Cookie consent implemented (not pre-ticked boxes)
□ User data deletion endpoint functional and tested
□ Data inventory documented: what data, where stored, who has access
□ Third-party data processors (analytics, payment, email) listed in Privacy Policy
□ Opt-out of marketing emails implemented and functional
□ Age verification or parental consent mechanism if any product serves under-18s
  (Soulamore targets students — define minimum age clearly)
```

---

## Section 13: Third-Party Integrations & Supply Chain

### What It Is
Third-party libraries, SDKs, analytics scripts, payment processors, and OAuth integrations each introduce their own attack surface. An attacker who compromises one upstream library compromises every app using it.

### How It Appears in Vibe Coded Apps
AI generators include the most convenient library for every task, often without checking maintenance status, known vulnerabilities, or the permissions the library requests.

### Risks Across the Portfolio

**Analytics Scripts (Google Analytics, Mixpanel, Hotjar)** 🟡 MEDIUM  
These scripts run with full JavaScript access on your page and can read any DOM content. On Soulamore, if a mood journal entry is visible in the DOM while an analytics session recording is active, that data may be captured and sent to third-party servers without user consent.

**Payment Processors (Stripe, Razorpay)** 🟠 HIGH  
- Use official SDKs only. Never implement payment flows manually.
- Use hosted payment pages or tokenization — never handle raw card numbers.
- Verify payment events using webhook signatures, not just frontend confirmation.
  (Frontend can be manipulated: always confirm payment server-side via webhook before granting access.)

**OAuth Providers (Google, LinkedIn Sign-In)** 🟡 MEDIUM  
- Validate the `state` parameter to prevent CSRF on OAuth callback.
- Validate `id_token` server-side before creating or logging in a user.
- Never trust claims from the frontend about OAuth success.

**npm/pip Dependencies** 🟠 HIGH  
- Lock dependency versions (package-lock.json, requirements.txt with pinned versions).
- Run vulnerability scans before every deployment.
- Be particularly careful with packages that have shell access, file system access, or network access.

---

## Section 14: API Design Security

### What It Is
Beyond individual endpoint vulnerabilities, overall API design choices affect security posture — particularly relevant for That's Missing (which may have a public/partner API) and BoozeD In (which integrates with professional platforms).

### Key Issues in Vibe Coded APIs

**GraphQL-Specific Risks** (if any product uses GraphQL)  
- Introspection enabled in production reveals your entire data schema.
  → Disable introspection in production.
- No query depth/complexity limits allow DoS via deeply nested queries.
  → Implement query depth limits and query cost analysis.

**Mass Assignment** 🟠 HIGH  
AI generators often accept the entire request body and pass it directly to `Model.create(req.body)`. A user who adds `{"role": "admin", "verified": true}` to their registration request gets admin access.
```
// Wrong:
User.create(req.body);

// Right:
User.create({
  email: req.body.email,
  password: req.body.password,
  displayName: req.body.displayName,
  // role and verified are set server-side only
});
```

**Verbose API Documentation Exposure** 🟡 MEDIUM  
Swagger/OpenAPI docs left accessible in production reveal your entire API structure to attackers.  
→ Disable or password-protect API documentation in production environments.

---

## Implementation Priority & Recommended Sprint Plan

### Sprint 1 — Stop the Bleeding (Week 1–2)
Priority: Fix anything that is immediately exploitable.

| # | Action | Applies To |
|---|--------|------------|
| 1 | Audit and fix all IDOR vulnerabilities — add ownership checks to every resource endpoint | All |
| 2 | Move auth tokens from localStorage to httpOnly cookies | All |
| 3 | Fix CORS from `*` to explicit origin whitelist | All |
| 4 | Add rate limiting to login, registration, and sensitive endpoints | All |
| 5 | Close all debug/test endpoints in production | All |
| 6 | Audit S3/Firebase/Supabase bucket permissions — make private what is not public | All |
| 7 | Remove all private keys and secrets from client-side code and env vars | All |

### Sprint 2 — Harden the Core (Week 3–4)

| # | Action | Applies To |
|---|--------|------------|
| 8 | Replace sequential IDs with UUIDs across all models | All |
| 9 | Implement DTOs — never return raw DB objects to clients | All |
| 10 | Add input validation library (Zod/Joi) on all API routes | All |
| 11 | Fix mass assignment — whitelist allowed fields on all create/update operations | All |
| 12 | Implement security headers (use helmet) | All |
| 13 | Add parameterized queries everywhere — audit for string-interpolated queries | All |
| 14 | Sanitize user-generated HTML/markdown with DOMPurify before rendering | Soulamore, BoozeD In |

### Sprint 3 — Observe & Comply (Week 5–6)

| # | Action | Applies To |
|---|--------|------------|
| 15 | Implement structured security logging | All |
| 16 | Set up error monitoring (Sentry) — generic errors to users, full errors to logs | All |
| 17 | Set up alerting for auth failures and traffic spikes | All |
| 18 | Conduct DPDP Act compliance review — update Privacy Policy | Soulamore, All |
| 19 | Implement user data deletion endpoint | Soulamore, All |
| 20 | Run `npm audit` / `pip audit` — fix critical and high CVEs | All |

### Sprint 4 — Penetration Testing & Ongoing

| # | Action |
|---|--------|
| 21 | Engage a security professional for penetration testing before any public launch |
| 22 | Set up Dependabot or Snyk for automated dependency scanning |
| 23 | Establish a responsible disclosure/bug bounty policy |
| 24 | Schedule quarterly security review as part of product roadmap |

---

## Quick Reference: What to Check in Every AI-Generated Route

Antigravity should apply this checklist to every API route that was generated by AI or added without explicit security review:

```
□ Authentication: Does this route verify the user is logged in?
□ Authorization: Does this route verify the user OWNS the requested resource?
□ Input Validation: Is all user input validated for type, length, and format?
□ Output: Does the response use a DTO (not a raw DB model)?
□ SQL/NoSQL: Are all queries parameterized (no string interpolation)?
□ Rate Limiting: Is this endpoint protected from brute force / scraping?
□ Error Handling: Does any error path leak internal details?
□ File Uploads: Are file type, size, and name validated and sanitized?
□ Logging: Are relevant events (especially failures) logged?
□ CORS: Is the CORS configuration specific to known origins?
```

---

## Summary

The restaurant table exploit (IDOR via URL parameter) is just the most visible example of a category of vulnerabilities that are endemic to AI-generated code. The reason these bugs appear is not that AI is "bad at security" — it is that AI optimizes for code that works in the happy path, and security is fundamentally about defending against paths that were not anticipated.

The four Hashlilly properties operate in sensitive verticals (mental health, professional identity, startup intelligence, financial dashboards). The cost of a breach in any of these — regulatory, reputational, and human — is far higher than the cost of the fixes described in this report.

All items in Sprint 1 should be treated as launch blockers.

---

*Report generated for internal use by Hashlilly Private Limited. Not for distribution.*  
*Revision history to be maintained by Antigravity upon implementation.*
