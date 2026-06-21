# Records of Processing Activities (RoPA)
**Controller:** Hashlilly Private Limited
**Required by:** GDPR Article 30, India DPDP Act 2023, LGPD, and equivalents
**Last Updated:** [INSERT DATE]
**Review Frequency:** Quarterly or on any new data processing activity

---

> This document is an internal record. It is not published publicly but must be available to supervisory authorities upon request. Maintain one entry per processing activity per product.

---

## Product: Soulamore (soulamore.com)

### Activity 1 — User Account Registration and Authentication
| Field | Detail |
|---|---|
| Purpose | Creating and managing user accounts; authenticating users |
| Legal basis | Contract (necessary to deliver the service) |
| Categories of data subjects | Registered users (adults 18+; minors 13–17 with parental consent) |
| Categories of personal data | Email address, password hash, date of birth, account creation timestamp |
| Sensitive data | No |
| Recipients | Cloud infrastructure provider, authentication service |
| Cross-border transfers | India → [US/EU processor]: governed by SCCs |
| Retention | Account lifetime + 30 days post-deletion |
| Security measures | AES-256 at rest, TLS 1.3 in transit, hashed passwords (bcrypt/argon2) |

### Activity 2 — Wellness Data Processing (Journal, Mood Tracking)
| Field | Detail |
|---|---|
| Purpose | Providing self-reflection and wellness tracking features |
| Legal basis | Explicit consent |
| Categories of data subjects | Registered users who have provided explicit consent |
| Categories of personal data | Journal entry text, mood scores, wellness responses, timestamps |
| Sensitive data | YES — mental health / health data |
| Recipients | Cloud infrastructure provider only. No third-party analytics. |
| Cross-border transfers | India only. No cross-border transfer of wellness data. |
| Retention | Deleted immediately upon account deletion request; no archiving |
| Security measures | AES-256 at rest, TLS 1.3 in transit, strict role-based access (engineering access logged and audited) |

### Activity 3 — Email Communications
| Field | Detail |
|---|---|
| Purpose | Transactional emails (account verification, password reset); optional product updates |
| Legal basis | Contract (transactional); Consent (marketing/updates) |
| Categories of data subjects | Registered users |
| Categories of personal data | Email address, first name |
| Sensitive data | No |
| Recipients | Email service provider (DPA required) |
| Cross-border transfers | India → [US email provider]: SCCs |
| Retention | Active until unsubscribe + 1 year |

### Activity 4 — Platform Analytics
| Field | Detail |
|---|---|
| Purpose | Understanding feature usage to improve the platform |
| Legal basis | Legitimate interests (anonymised data only) |
| Categories of data subjects | All users (anonymised) |
| Categories of personal data | Anonymised session data, feature interaction counts, device type |
| Sensitive data | No (wellness content is NEVER included in analytics) |
| Recipients | Internal only / self-hosted analytics tool |
| Cross-border transfers | None |
| Retention | 24 months aggregated |

---

## Product: That's Missing (thatsmissing.com)

### Activity 1 — Account Registration and Subscription Management
| Field | Detail |
|---|---|
| Purpose | Account creation, subscription access, billing |
| Legal basis | Contract |
| Categories of data subjects | Individual users, business account holders |
| Categories of personal data | Name, email, password hash, role/organisation, billing information |
| Sensitive data | No |
| Recipients | Cloud provider, payment processor, email provider |
| Cross-border transfers | India → [processor country]: SCCs |
| Retention | Account lifetime + 30 days; billing 7 years |

### Activity 2 — Product Usage and Personalisation
| Field | Detail |
|---|---|
| Purpose | Delivering platform features; personalising opportunity feed |
| Legal basis | Contract |
| Categories of data subjects | Registered users |
| Categories of personal data | Saved items, search queries, annotations, feature interactions |
| Sensitive data | No |
| Recipients | Cloud infrastructure provider |
| Cross-border transfers | India → [processor]: SCCs |
| Retention | Account lifetime; deleted on account deletion |

### Activity 3 — Analytics
| Field | Detail |
|---|---|
| Purpose | Product improvement, feature prioritisation |
| Legal basis | Legitimate interests; Consent (for non-essential analytics cookies) |
| Categories of data subjects | Users (pseudonymised) |
| Categories of personal data | Pseudonymised user ID, page views, feature usage, session duration |
| Sensitive data | No |
| Recipients | Analytics provider (GA4 / PostHog) |
| Cross-border transfers | India → US: SCCs |
| Retention | 24 months |

---

## Product: BoozeD In (boozedin.com)

### Activity 1 — Professional Profile Creation and Networking
| Field | Detail |
|---|---|
| Purpose | Creating professional profiles; facilitating industry connections |
| Legal basis | Contract + Consent (profile visibility settings) |
| Categories of data subjects | Individual professionals, brand/organisation accounts |
| Categories of personal data | Name, email, job title, employer history, skills, certifications, location (city/country), profile photo |
| Sensitive data | No (professional data) |
| Recipients | Cloud provider; visible to other members per visibility settings |
| Cross-border transfers | India → [cloud processor]: SCCs |
| Retention | Account lifetime + 30 days |

### Activity 2 — Job Listings and Applications
| Field | Detail |
|---|---|
| Purpose | Connecting job seekers with industry employers |
| Legal basis | Contract + Consent (open-to-opportunities toggle) |
| Categories of data subjects | Job-seeking professionals; recruiting organisations |
| Categories of personal data | CV data, application messages, recruiter contact data |
| Sensitive data | No |
| Recipients | Cloud provider; recruiter accounts (per applicant consent) |
| Cross-border transfers | India → [processor]: SCCs |
| Retention | Application data 1 year |

### Activity 3 — Direct Messaging
| Field | Detail |
|---|---|
| Purpose | Enabling professional communication between members |
| Legal basis | Contract |
| Categories of data subjects | Registered members |
| Categories of personal data | Message content, sender/recipient IDs, timestamps |
| Sensitive data | No |
| Recipients | Cloud infrastructure provider only |
| Cross-border transfers | India → [processor]: SCCs |
| Retention | 2 years from message date |

---

## Product: Hashlilly.in

### Activity 1 — Contact Form and Enquiries
| Field | Detail |
|---|---|
| Purpose | Responding to business and product enquiries |
| Legal basis | Legitimate interests / pre-contractual steps |
| Categories of data subjects | Prospective users, partners, press |
| Categories of personal data | Name, email, message content, organisation |
| Sensitive data | No |
| Recipients | CRM / email tool (DPA required) |
| Cross-border transfers | India → [tool]: SCCs if applicable |
| Retention | 2 years |

### Activity 2 — Hub Account and Product Entitlements
| Field | Detail |
|---|---|
| Purpose | Unified login and product access management |
| Legal basis | Contract |
| Categories of data subjects | Paying subscribers |
| Categories of personal data | Email, password hash, purchased product entitlements, billing history |
| Sensitive data | No |
| Recipients | Cloud provider, payment processor |
| Cross-border transfers | SCCs with processors |
| Retention | Account lifetime + 30 days; billing 7 years |

---

## RoPA Maintenance Notes

- Add a new entry any time a new data processing activity is introduced
- Update existing entries when: new vendors are added, retention periods change, legal basis changes, data categories expand
- Review this document quarterly and after any product feature launch
- Make available to Data Protection Board of India (DPDB) or any relevant supervisory authority upon request within 72 hours
