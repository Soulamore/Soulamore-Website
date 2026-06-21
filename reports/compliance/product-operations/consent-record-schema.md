# Consent Record Schema — Technical Specification
**Owner:** Antigravity (implement) / Aditya (approve)
**Version:** 1.0
**Applies to:** All Hashlilly products

---

## Purpose

This document specifies the database schema and API behaviour required to store, retrieve, and honour user consent records across all Hashlilly products. Correct consent record-keeping is a legal requirement under GDPR (Article 7), DPDP Act 2023, LGPD, CASL, and most other global privacy frameworks.

**Key rule:** Every consent given must be recorded with who, what, when, how, and from where. Every withdrawal must be recorded and honoured immediately.

---

## 1. Cookie / Banner Consent Schema

### Table: `cookie_consents`

```sql
CREATE TABLE cookie_consents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token       VARCHAR(255) NOT NULL,     -- anonymous identifier if no user account yet
  user_id             UUID REFERENCES users(id) ON DELETE SET NULL,  -- null if pre-registration
  
  -- Consent choices per category
  strictly_necessary  BOOLEAN NOT NULL DEFAULT true,  -- always true, not optional
  functional          BOOLEAN NOT NULL DEFAULT false,
  analytics           BOOLEAN NOT NULL DEFAULT false,
  marketing           BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  consent_version     VARCHAR(20) NOT NULL,      -- version of cookie policy shown e.g. "1.0"
  ip_address          INET,                       -- anonymised or hashed after 24 hours
  user_agent          TEXT,
  jurisdiction        VARCHAR(10),               -- inferred from IP e.g. "EU", "IN", "US-CA"
  consent_method      VARCHAR(50),               -- "banner_accept_all" | "banner_custom" | "banner_reject_all"
  
  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 year'
);

CREATE INDEX ON cookie_consents(user_id);
CREATE INDEX ON cookie_consents(session_token);
```

### Behaviour Rules

```
1. Create a new record on first banner interaction — even before user has an account.
   Use session_token to link. When user registers, update user_id.

2. On consent update (user visits Cookie Settings and changes preferences):
   - Do NOT update existing record
   - INSERT a new record with updated_at = now()
   - The latest record per user_id (or session_token) is the current consent

3. Anonymise ip_address after 24 hours: UPDATE SET ip_address = NULL

4. Honour consent immediately:
   - analytics = false → no GA4 / analytics scripts loaded on next page load
   - marketing = false → no ad pixels loaded
   - This enforcement happens client-side (CMP) and is verified server-side 
     for any server-side analytics calls

5. Expiry: consent expires after 1 year. Re-prompt user with banner.
```

---

## 2. Processing Consent Schema (Soulamore — Wellness Data)

This is the explicit consent for sensitive data processing, separate from cookie consent.

### Table: `processing_consents`

```sql
CREATE TABLE processing_consents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- What was consented to
  consent_type        VARCHAR(100) NOT NULL,
  -- Values:
  -- 'wellness_data_processing'  → journal, mood, wellness features
  -- 'marketing_emails'          → optional marketing
  -- 'product_updates'           → product changelog emails
  -- 'parental_consent_minor'    → parent consenting for minor
  -- 'data_portability'          → consent to receive data export
  
  -- What the user saw
  consent_version     VARCHAR(20) NOT NULL,      -- matches version in Privacy Policy
  consent_text_shown  TEXT NOT NULL,             -- exact text of consent statement shown
  
  -- The decision
  consented           BOOLEAN NOT NULL,          -- true = consented, false = declined
  
  -- How it was given
  consent_method      VARCHAR(50) NOT NULL,
  -- Values: 'onboarding_modal' | 'settings_toggle' | 'parental_email' | 'api'
  
  -- Context
  ip_address          INET,
  user_agent          TEXT,
  
  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Withdrawal
  withdrawn_at        TIMESTAMPTZ,              -- null if still active
  withdrawal_method   VARCHAR(50)               -- 'settings_toggle' | 'deletion_request' | 'admin'
);

CREATE INDEX ON processing_consents(user_id, consent_type);
CREATE INDEX ON processing_consents(user_id, consented, withdrawn_at);
```

### Behaviour Rules

```
1. Soulamore onboarding: INSERT record with consent_type='wellness_data_processing', 
   consented=true (if user taps "I understand and consent").

2. If user declines: INSERT with consented=false. 
   Block access to wellness features. Show plain informational content only.

3. Withdrawal via Settings → "Withdraw wellness data consent":
   - UPDATE processing_consents SET withdrawn_at = now(), withdrawal_method = 'settings_toggle'
   - Immediately stop all wellness data processing
   - Do NOT delete existing wellness data yet — await explicit deletion request
   - Prompt: "Your consent has been withdrawn. Your existing wellness data 
              is still stored. Would you like to delete it now? [Delete] [Keep]"

4. On account deletion:
   - INSERT withdrawal record for all active consents
   - Cascade delete all wellness data per retention schedule

5. Marketing emails: INSERT separate record for 'marketing_emails' consent at registration.
   opt-in checkbox = consented=true. Unchecked = do not insert (no record = no consent = no emails).
```

---

## 3. Parental Consent Schema (Soulamore Minors)

### Table: `parental_consents`

```sql
CREATE TABLE parental_consents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  minor_user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Parent / guardian details
  parent_email          VARCHAR(255) NOT NULL,
  parent_email_verified BOOLEAN NOT NULL DEFAULT false,
  
  -- Consent status
  status                VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- Values: 'pending' | 'approved' | 'denied' | 'expired' | 'withdrawn'
  
  -- What parent was shown
  consent_version       VARCHAR(20) NOT NULL,
  consent_text_shown    TEXT NOT NULL,
  
  -- Metadata
  request_sent_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at          TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days',
  response_ip           INET,
  response_user_agent   TEXT,
  
  -- Token for email link
  consent_token         VARCHAR(255) UNIQUE NOT NULL,  -- hashed token in email link
  consent_token_used    BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX ON parental_consents(minor_user_id);
CREATE INDEX ON parental_consents(consent_token);
```

### Behaviour Rules

```
1. On minor registration: INSERT with status='pending', generate consent_token, 
   send email to parent with link containing token.
   Minor account is created but LOCKED (cannot log in until status='approved').

2. Parent clicks approve link: 
   - Verify token exists, not used, not expired
   - UPDATE status='approved', responded_at=now(), consent_token_used=true
   - Unlock minor account
   - Send confirmation email to both parent and minor

3. Parent clicks deny link:
   - UPDATE status='denied'
   - DELETE minor user account and all associated data within 24 hours

4. No response after 7 days:
   - Scheduled job: UPDATE status='expired'
   - DELETE minor user account and all data within 24 hours
   - Send one reminder email at Day 4

5. Parent withdraws consent (via email request to privacy@soulamore.com):
   - UPDATE status='withdrawn'
   - Immediately lock minor account
   - Delete minor account and all data within 7 days
   - Confirm deletion to parent via email
```

---

## 4. Consent Audit API

Provide an internal admin endpoint (admin-only, not user-facing) for compliance audits:

```
GET /admin/consent-audit/:userId
Authorization: Admin JWT required

Response:
{
  "userId": "uuid",
  "cookieConsents": [...all records, newest first],
  "processingConsents": [...all records by type],
  "parentalConsent": {...if minor},
  "currentActiveConsents": {
    "analytics": true/false,
    "marketing": true/false,
    "wellness_data_processing": true/false,
    "marketing_emails": true/false
  }
}
```

This endpoint is used to respond to Data Subject Access Requests (DSAR) and regulator queries about what consent was given and when.

---

## 5. User-Facing Consent History (Privacy Dashboard)

In account settings → Privacy Dashboard, users see:

```
My Consent History

Cookie Preferences
[Last updated: DATE]
• Analytics cookies: ON / OFF
• Marketing cookies: ON / OFF
[Update Preferences]

Wellness Data Processing
[Consented: DATE]
[Status: Active / Withdrawn]
[Withdraw Consent]

Marketing Emails
[Opted in: DATE / Not opted in]
[Unsubscribe]

[Download full consent history as CSV]
```

---

## 6. Retention of Consent Records

```
Cookie consent records:       3 years from last update
Processing consent records:   Account lifetime + 3 years
Parental consent records:     Account lifetime + 3 years
Withdrawn consent records:    3 years from withdrawal date (proof of withdrawal)
Denied/expired parental:      90 days (audit purposes), then delete including parent email
```

---

## 7. Schema Migration Notes for Antigravity

- All consent tables use UUIDs, not integer IDs
- All timestamps are TIMESTAMPTZ (timezone-aware) — never store consent timestamps without timezone
- consent_text_shown must store the EXACT text shown to the user — if policy text changes, new records use new version
- IP addresses: anonymise/null after 24 hours via scheduled job
- consent_token for parental flow: store as bcrypt hash, not plaintext
- All consent tables are append-only from application perspective — no UPDATE on existing records except for withdrawal fields and token use
