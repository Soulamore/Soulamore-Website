# Data Breach Response Playbook
**Owner:** Hashlilly Private Limited
**Maintained by:** Aditya (Data Controller)
**Version:** 1.0
**Last Updated:** [INSERT DATE]

---

## Overview

This playbook defines the step-by-step response to a personal data breach across any Hashlilly product. A "data breach" is any incident resulting in accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data.

**Time is critical.** GDPR and most global laws require regulator notification within 72 hours. DPDP Act (India) requires notification as per DPBI timelines. Missing these windows triggers additional liability.

---

## Severity Classification

| Level | Description | Examples |
|---|---|---|
| P1 — Critical | Confirmed breach of sensitive or large-scale data | Soulamore wellness data exposed; database dump leaked; credentials compromised at scale |
| P2 — High | Probable breach, scope unclear; or confirmed breach of non-sensitive data at scale | Server misconfiguration exposing user emails; unauthorized API access |
| P3 — Medium | Suspected breach or limited scope confirmed | Single user's data accidentally exposed to another user; test data leaked |
| P4 — Low | Near-miss or no personal data involved | Attempted attack blocked; internal system data with no PII exposed |

P1 and P2 trigger this full playbook. P3 triggers abbreviated response. P4 is logged only.

---

## Response Timeline

### Hour 0–1: Detection and Initial Triage

**Whoever discovers the incident:**
- [ ] Do NOT delete logs, modify files, or attempt to "clean up" — preserve all evidence
- [ ] Immediately notify Aditya (Data Controller): [phone/email]
- [ ] Notify Antigravity lead engineer: [contact]
- [ ] Create incident ticket in [project management tool] — label SECURITY-INCIDENT
- [ ] Begin incident log (see template at end of this document)

**Initial assessment questions:**
1. What systems or data were affected?
2. What categories of personal data are involved? (wellness data? professional data? payment data?)
3. How many users may be affected? (estimate)
4. Is the breach ongoing or contained?
5. How was it discovered? (automated alert, user report, external researcher, attacker contact)

### Hour 1–4: Containment

- [ ] Isolate affected systems if breach is ongoing (take offline if necessary)
- [ ] Revoke compromised API keys, credentials, or tokens
- [ ] Force logout all active sessions if account credentials may be compromised
- [ ] Patch the vulnerability if identified (do not deploy untested fixes under pressure — stability matters)
- [ ] Preserve: server logs, access logs, error logs, database logs — export and store securely
- [ ] Block attacking IP ranges if source is identified (coordinate with Cloudflare)
- [ ] Notify cloud provider's security team if their infrastructure is involved

### Hour 4–24: Assessment and Documentation

- [ ] Determine confirmed scope: exact data categories, exact or estimated number of affected users
- [ ] Determine root cause (as far as known)
- [ ] Assess likely harm to affected individuals (identity theft risk? mental health data exposure? financial data?)
- [ ] Engage legal counsel — share incident summary
- [ ] Determine notifiability: is this a "high risk" breach requiring user notification?
- [ ] Draft initial regulator notification (see templates below)
- [ ] Internal briefing: Aditya + legal counsel + Antigravity lead

### Hour 24–72: Regulator Notification

**GDPR (EU/UK users):**
- [ ] File initial notification with lead EU supervisory authority (whichever EU country has most users, or Ireland ICO as default for many English-language products)
- [ ] UK: notify ICO at ico.org.uk if UK users affected
- [ ] Notification can be submitted before full scope is known — update with further information as available

**India DPDP Act:**
- [ ] Notify Data Protection Board of India (DPBI) within prescribed timeline
- [ ] Format: as specified by DPBI (check current regulations at meity.gov.in)

**Australia:**
- [ ] Notify OAIC if "eligible data breach" (likely to result in serious harm)

**Brazil LGPD:**
- [ ] Notify ANPD within 2 business days

**US — CCPA:**
- [ ] If 500+ California residents affected: notify California AG
- [ ] State breach notification laws: check each state's specific requirement (most are 30–60 days)

**Other jurisdictions:** Refer to global compliance report for regulator contacts and timelines.

### Regulator Notification Template

```
TO: [Supervisory Authority Name]
FROM: Hashlilly Private Limited
RE: Personal Data Breach Notification — [Product Name]
DATE: [Date]

1. NATURE OF BREACH
[Describe what happened: unauthorized access / accidental disclosure / ransomware / etc.]

2. DATE AND TIME OF BREACH
Occurred: [Date/time or estimated range]
Discovered: [Date/time]

3. CATEGORIES OF PERSONAL DATA INVOLVED
[e.g., Email addresses, mood tracking data, professional profiles]

4. APPROXIMATE NUMBER OF DATA SUBJECTS AFFECTED
[Number or estimate — update as known]

5. LIKELY CONSEQUENCES
[e.g., Risk of unauthorized access to mental health disclosures, identity data exposure]

6. MEASURES TAKEN OR PROPOSED
Immediate: [What was done to stop the breach]
Remediation: [What will be done to prevent recurrence]

7. CONTACT FOR THIS MATTER
[Aditya's name, title, email, phone]
[Legal counsel contact if applicable]

NOTE: This is an initial notification. Further information will be provided as the investigation continues.
```

### Hour 72+: User Notification (if high risk to individuals)

Notify affected users when the breach is likely to result in high risk to their rights and freedoms (identity theft, financial loss, exposure of sensitive data, safety risk).

**User notification must include:**
- What happened (plain language)
- What data was involved
- What we have done to address it
- What affected users should do (change password, monitor accounts, etc.)
- Our contact for questions

**Channels:**
- Email to affected users (even if they unsubscribed from marketing — this is transactional)
- In-app banner on next login
- Dedicated status page: [domain]/security-notice

**User Notification Template:**

```
Subject: Important Security Notice — Your [Product] Account

Dear [Name / "Valued Member"],

We are writing to inform you of a security incident that may have affected your account on [Product].

WHAT HAPPENED
[Plain language description — 2–3 sentences]

WHAT INFORMATION WAS INVOLVED
[Specific data categories — be precise]

WHAT WE ARE DOING
[Steps taken to contain and remediate]

WHAT YOU SHOULD DO
[Specific actions: change your password, monitor for suspicious activity, etc.]

We sincerely apologise for this incident and take full responsibility for protecting your data.

If you have questions, contact us at privacy@[product].com.

[Aditya / Hashlilly Private Limited]
```

---

## Post-Incident Review (Within 30 Days)

- [ ] Full root cause analysis document completed
- [ ] Security patches deployed and verified
- [ ] Updated security audit report shared with Antigravity
- [ ] Regulatory final report submitted (where required)
- [ ] Internal lessons-learned meeting held
- [ ] This playbook updated if process gaps identified
- [ ] Affected users followed up with outcome communication (where appropriate)

---

## Incident Log Template

```
INCIDENT ID: SEC-[YEAR]-[NUMBER]
DATE/TIME DISCOVERED:
DISCOVERED BY:
PRODUCT(S) AFFECTED:
SYSTEMS AFFECTED:
DATA CATEGORIES INVOLVED:
ESTIMATED USERS AFFECTED:
BREACH ONGOING AT DISCOVERY: Yes / No
BREACH CONTAINED AT: [Date/Time]
ROOT CAUSE (initial):
ROOT CAUSE (confirmed):
REGULATORY NOTIFICATIONS FILED:
  - [Authority]: Filed [date], Reference [number]
USER NOTIFICATIONS SENT: Yes / No / Not required
REMEDIATION COMPLETED: [Date]
INCIDENT CLOSED: [Date]
POST-INCIDENT REVIEW DATE:
```

---

## Emergency Contacts

| Role | Name | Contact |
|---|---|---|
| Data Controller (Primary) | Aditya | [phone] [email] |
| Antigravity Lead Engineer | [Name] | [phone] [email] |
| Legal Counsel | [Name / Firm] | [phone] [email] |
| Cloud Provider Security | AWS/GCP Support | [Support tier contact] |
| Cloudflare Emergency | Cloudflare | [Account support] |

---

*Review this playbook annually and after every incident. Run a tabletop exercise (simulated breach walkthrough) at least once per year.*
