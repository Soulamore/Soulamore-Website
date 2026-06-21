# Hashlilly Compliance Package — Master Index
**Version:** 1.0
**Prepared by:** Aditya / Hashlilly Private Limited
**Date:** June 2026
**For:** Antigravity (implementation) + Legal Counsel (review)

---

## What Is This Package

This is the complete legal, compliance, security, and IP documentation package for Hashlilly Private Limited and its four active products: Soulamore, That's Missing, BoozeD In, and hashlilly.in.

Every document in this package was produced to address:
1. Global data privacy law compliance (27 jurisdictions)
2. Security vulnerabilities introduced by AI-assisted ("vibe coded") development
3. Trademark and IP protection for the Hashlilly brand portfolio
4. Corporate operational hygiene (contracts, NDAs, data policies)
5. Product-specific obligations (mental health platform rules for Soulamore)

---

## ⚠️ Important Notice

**All documents marked with legal clauses (Terms of Service, Privacy Policies, DPA templates, NDA, Contractor Agreement) must be reviewed and approved by qualified legal counsel before publication or execution.** These documents are drafted as comprehensive operational frameworks — they are not a substitute for legal advice.

**All technical specifications (consent schema, cookie audit, security runbook) are ready for direct handoff to Antigravity for implementation.**

---

## Document Index

### 📁 company-level/
Documents that apply across all four products at the Hashlilly entity level.

| File | Description | For | Priority |
|---|---|---|---|
| `hashlilly-security-audit.md` | Full security vulnerability audit — IDOR, auth, injection, XSS, CSRF, misconfigs, rate limiting, file uploads, logging | Antigravity | 🔴 Immediate |
| `hashlilly-global-privacy-compliance.md` | 27-jurisdiction privacy law reference + universal implementation guide | Antigravity + Legal | 🔴 Immediate |
| `data-processing-agreement-template.md` | Template DPA to sign with all vendors (AWS, Stripe, SendGrid, etc.) | Aditya + Legal | 🔴 Immediate |
| `vendor-privacy-inventory.md` | Live register of all third-party processors, DPA status, server regions | Antigravity + Aditya | 🔴 Immediate |
| `records-of-processing-activities.md` | GDPR Art. 30 RoPA for all four products | Aditya + Legal | 🟠 Pre-launch |
| `breach-response-playbook.md` | Hour-by-hour breach response runbook with regulator notification templates | Aditya + Antigravity | 🟠 Pre-launch |
| `data-retention-schedule.md` | Retention periods for every data type, implementation spec for Antigravity | Antigravity | 🟠 Pre-launch |

### 📁 legal-per-product/soulamore/
| File | Description | For | Priority |
|---|---|---|---|
| `terms-of-service.md` | Full ToS including mental health disclaimer, minor restrictions, IP | Legal review → publish | 🔴 Pre-launch |
| `privacy-policy.md` | GDPR/DPDP/CCPA-compliant privacy policy for Soulamore | Legal review → publish | 🔴 Pre-launch |
| `cookie-policy.md` | Cookie table and consent instructions — zero analytics cookies | Legal review → publish | 🔴 Pre-launch |
| `disclaimer.md` | Not-a-medical-service disclaimer with crisis resources | Legal review → publish | 🔴 Pre-launch |

### 📁 legal-per-product/thatsmissing/
| File | Description | For | Priority |
|---|---|---|---|
| `terms-of-service.md` | ToS including IP restrictions, API use, data scraping prohibition | Legal review → publish | 🔴 Pre-launch |
| `privacy-policy.md` | Privacy policy with B2B data handling | Legal review → publish | 🔴 Pre-launch |
| `cookie-policy.md` | Cookie table including GA4 consent gate | Legal review → publish | 🔴 Pre-launch |
| `disclaimer.md` | Not-investment-advice disclaimer | Legal review → publish | 🔴 Pre-launch |

### 📁 legal-per-product/boozedin/
| File | Description | For | Priority |
|---|---|---|---|
| `terms-of-service.md` | ToS including professional profile rules, alcohol advertising compliance | Legal review → publish | 🔴 Pre-launch |
| `privacy-policy.md` | Privacy policy with professional data handling | Legal review → publish | 🔴 Pre-launch |
| `cookie-policy.md` | Cookie table | Legal review → publish | 🔴 Pre-launch |
| `disclaimer.md` | Job listings and professional networking disclaimer | Legal review → publish | 🔴 Pre-launch |

### 📁 legal-per-product/hashlilly-in/
| File | Description | For | Priority |
|---|---|---|---|
| `terms-of-service.md` | Corporate site and Hub ToS | Legal review → publish | 🟠 Pre-launch |
| `privacy-policy.md` | Corporate site privacy policy | Legal review → publish | 🟠 Pre-launch |
| `cookie-policy.md` | Cookie table | Legal review → publish | 🟠 Pre-launch |

### 📁 trademark-ip/
| File | Description | For | Priority |
|---|---|---|---|
| `trademark-filing-plan.md` | Full filing strategy — 8 marks, India + Madrid Protocol, Classes 35/41/42/43/44 | Aditya + TM Attorney | 🔴 Immediate |
| `trademark-watching-brief.md` | Monitoring schedule, conflict response protocol | Aditya + TM Attorney | 🟠 Post-filing |
| `ip-ownership-policy.md` | Who owns what — founder IP, contractor IP assignment, open source rules, domain policy | Aditya + Legal | 🔴 Immediate |

### 📁 corporate-operational/
| File | Description | For | Priority |
|---|---|---|---|
| `contractor-agreement-template.md` | Full contractor agreement with IP assignment, NDA, DPDP data processor obligations — use for Antigravity and all future contractors | Legal review → execute | 🔴 Immediate |
| `nda-template.md` | Mutual/one-way NDA for investor, partnership, and hiring conversations | Legal review → execute | 🔴 Immediate |
| `acceptable-use-policy.md` | Platform-wide AUP covering all four products | Legal review → publish | 🟠 Pre-launch |
| `employee-data-policy.md` | HR data handling policy for staff and contractors | Aditya | 🟡 When hiring |

### 📁 soulamore-specific/
| File | Description | For | Priority |
|---|---|---|---|
| `mental-health-disclaimer-extended.md` | Extended disclaimer with display requirements and onboarding acknowledgement modal spec | Antigravity + Legal | 🔴 Pre-launch |
| `crisis-response-protocol.md` | Full technical spec for crisis signal detection, Tier 1/2/3 responses, crisis resources page | Antigravity | 🔴 Pre-launch |
| `minor-data-handling-policy.md` | Age gate spec, parental consent flow, minor account restrictions, DigiLocker integration roadmap | Antigravity + Legal | 🔴 Pre-launch |

### 📁 product-operations/
| File | Description | For | Priority |
|---|---|---|---|
| `incident-response-runbook.md` | SEV1–4 response process, legal/regulator request handling, monitoring stack | Antigravity + Aditya | 🟠 Pre-launch |
| `cookie-audit-log.md` | Per-domain cookie register, audit history, re-audit triggers | Antigravity | 🟠 Pre-launch |
| `consent-record-schema.md` | Full database schema + behaviour rules for cookie consent, processing consent, parental consent | Antigravity | 🔴 Pre-launch |

---

## Implementation Priority Summary

### 🔴 Do Before Any Product Goes Live
1. Execute Contractor Agreement with Antigravity (IP assignment is critical)
2. File trademark applications for HASHLILLY and SOULAMORE at minimum
3. Sign AWS DPA (and all other vendor DPAs)
4. Implement cookie consent gate (CMP) on all domains — no analytics until consent
5. Build consent record schema in database
6. Implement IDOR fixes and auth token security (from security audit)
7. Publish Privacy Policy, ToS, Cookie Policy on all domains
8. Implement Soulamore age gate and parental consent flow
9. Build Soulamore crisis response modal (Tier 1)
10. Remove all debug/test endpoints from production

### 🟠 Do Within First Month Post-Launch
11. Complete vendor DPA inventory for all processors
12. Build user Privacy Dashboard (data export, deletion, consent history)
13. Implement data retention automated deletion jobs
14. Complete Records of Processing Activities
15. Brief Aditya and Antigravity lead on breach response playbook
16. Set up monitoring and alerting stack
17. File remaining trademark applications (That's Missing, BoozeD In, etc.)

### 🟡 Ongoing / Quarterly
18. Cookie audit — every quarter and on any new script added
19. Vendor inventory review
20. Security audit review
21. Trademark watching brief review
22. Privacy Policy review (update on regulatory changes)

---

## Contacts Referenced in This Package

| Role | Name | Contact |
|---|---|---|
| Data Controller / Founder | Aditya | [email] |
| Antigravity Lead | [Name] | [email] |
| Legal Counsel (to appoint) | TBD | TBD |
| Trademark Attorney (to appoint) | TBD | TBD |
| Privacy email (all products) | — | privacy@[product].com |
| Grievance Officer (India) | TBD | grievance@[product].com |
| Abuse reporting | — | abuse@[product].com |

---

*This package is confidential and for internal use by Hashlilly Private Limited and its authorised advisors only.*
*Document version: 1.0 — June 2026*
