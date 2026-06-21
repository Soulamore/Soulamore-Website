# Minor Data Handling Policy — Soulamore
**Owner:** Hashlilly Private Limited
**Version:** 1.0
**Scope:** Users under 18 years of age on the Soulamore platform

---

## Why This Document Exists

Soulamore targets students and young professionals — a demographic that includes users under 18. Processing personal data of minors, especially sensitive wellness and mental health data, triggers the strictest obligations under every major privacy law globally. This policy defines the technical and operational approach Antigravity must implement.

---

## 1. Age Threshold Decision

**Hashlilly's policy:** The minimum age to use Soulamore **independently** is **18 years.**

Users aged 13–17 may access Soulamore only with **verified parental or guardian consent.**

Users under 13 are **not permitted** on the platform under any circumstances.

**Rationale:**
- India DPDP Act 2023: requires verifiable parental consent for all users under 18
- EU GDPR Article 8: requires parental consent for under-16 (or under-13 depending on member state)
- US COPPA: strict rules for under-13; CCPA: special rules for under-16
- South Korea PIPA: parental consent required for under-14
- The mental health nature of the platform makes conservative age thresholds a moral and legal necessity

---

## 2. Age Gate Implementation

### 2a. Registration Flow
All registration flows must include a date-of-birth field (not a checkbox — an actual DOB picker).

```
Age Gate Logic:
- Under 13: Block registration immediately. Show: 
  "Soulamore requires users to be at least 13 years old. 
   You cannot create an account at this time."
  
- 13–17: Divert to Parental Consent Flow (Section 3 below)

- 18+: Proceed to standard registration
```

### 2b. Why Not Just a Checkbox ("I am 18+")
Checkboxes do not satisfy DPDP Act 2023 "verifiable" parental consent requirements, nor COPPA. A date-of-birth field combined with email-verified parental consent is the minimum viable approach. For higher compliance, DigiLocker verification is the DPDP Act's approved mechanism for Indian users.

---

## 3. Parental Consent Flow (Users 13–17)

### Step 1 — Collect Parent/Guardian Contact
After DOB indicates 13–17, show:
```
"It looks like you're under 18. 
Soulamore requires a parent or guardian to approve your account.

Please enter your parent or guardian's email address.
We'll send them a consent request — your account will only 
be activated after they approve."
```

### Step 2 — Consent Email to Parent
Send to parent/guardian email:
```
Subject: Your approval is needed — [Child name]'s Soulamore account

[Child name/username] has requested to create an account on Soulamore, 
a wellness and self-reflection platform for young people.

Soulamore collects:
• A username or display name
• Date of birth
• Wellness journal entries and mood tracking data (if the user chooses to use these features)

This data is stored securely and never sold or shared with advertisers.
[Child's name] will not be visible to adults on the platform.

[APPROVE ACCOUNT — green button]
[DENY ACCOUNT — red button]

If you did not expect this email, please ignore it or contact privacy@soulamore.com.
```

### Step 3 — Parent Approves
- Record: parent email, consent timestamp, IP, consent version
- Activate the minor's account with minor-specific restrictions (Section 4)
- Store consent record for account lifetime + 3 years

### Step 4 — Parent Does Not Approve Within 7 Days
- Delete the pending account and all associated data
- Do not send further reminders after one follow-up at Day 4

### DigiLocker Verification (India — Enhanced Compliance)
For higher DPDP compliance, implement DigiLocker-based age and parental consent verification:
- Integrate with DigiLocker API for parental Aadhaar-linked consent
- This satisfies "verifiable" consent under DPDP Act Rules
- Antigravity to assess technical feasibility and DigiLocker API integration timeline

---

## 4. Restrictions on Minor Accounts

All accounts identified as belonging to users under 18 must have the following restrictions enforced **server-side** (not just frontend):

| Feature | Restriction |
|---|---|
| Behavioural advertising | Completely blocked — no ad targeting of any kind |
| Behavioural profiling | No profiling for commercial purposes |
| Analytics data sharing | Minor's data excluded from any analytics shared with third parties |
| Data used for ML/AI training | Minor's data excluded entirely |
| Public profile visibility | Disabled — minor accounts visible only within age-appropriate features |
| Direct messaging from adults | Blocked unless both parties are in the same verified peer group |
| Data sale or sharing | Absolutely prohibited — even if general users have opted in |
| Push notification tracking | Minimal — only transactional |

---

## 5. Parental Controls (If Minor Account Feature is Launched)

Where technically feasible, provide parents with:
- Ability to view what features the child has accessed (not content — only feature use)
- Ability to delete the child's account at any time
- Ability to withdraw consent at any time, triggering account deletion within 30 days
- A parent dashboard or email report option

---

## 6. Data Handling for Minor Accounts

### Enhanced Security
- Minor account data stored in a logically separated dataset
- Access restricted to minimum necessary engineering personnel
- Access to minor data requires additional authentication and is audit-logged

### Retention
- Same or shorter than standard retention schedules
- On parental consent withdrawal: delete within 7 days (shorter than standard 30-day window)
- On account deletion: delete immediately

### No Third-Party Sharing
Minor data (including anonymous analytics) is never shared with, sold to, or processed by any third party for commercial purposes.

---

## 7. Regulatory Requirements by Jurisdiction

| Jurisdiction | Law | Requirement |
|---|---|---|
| India | DPDP Act 2023 | Verifiable parental consent; no profiling of minors; DigiLocker preferred |
| EU/UK | GDPR Art. 8 / UK GDPR | Parental consent under 13–16 depending on country |
| US | COPPA | Verifiable parental consent under 13; no behavioural advertising |
| US (California) | CCPA | Opt-in required for data "sale" for under 16 |
| South Korea | PIPA | Parental consent under 14 |
| Brazil | LGPD | Parental consent for sensitive data of minors |
| Australia | Privacy Act / Online Safety Act | Best interests of child principle; age assurance under development |

---

## 8. Incident Response for Minor Data

If a breach involves minor accounts:
- Regulatory notification priority upgraded to P1 regardless of scale
- Parent/guardian notification sent in addition to user notification
- Regulatory notifications in all applicable jurisdictions
- Escalate immediately to legal counsel

---

## 9. Implementation Checklist for Antigravity

- [ ] DOB field on all registration flows (not age checkbox)
- [ ] Under-13 hard block — no account creation, no data stored
- [ ] 13–17 diversion to parental consent email flow
- [ ] Parental consent email template built and tested
- [ ] Consent record storage: parent email, timestamp, IP, consent version
- [ ] Minor account flag in database (boolean + consent_record_id)
- [ ] Server-side enforcement of all minor account restrictions
- [ ] Minor data logically separated in database (separate table or schema)
- [ ] Minor account data excluded from all analytics exports
- [ ] Parental consent withdrawal flow functional (deletes account within 7 days)
- [ ] Privacy Policy updated to reflect minor data handling
- [ ] DigiLocker integration scoped (post-MVP, for enhanced India compliance)
