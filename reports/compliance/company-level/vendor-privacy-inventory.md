# Vendor Privacy Inventory — Hashlilly Private Limited
**Version:** 1.0
**Owner:** Aditya / Hashlilly Private Limited
**Last Reviewed:** [INSERT DATE]
**Review Frequency:** Quarterly

---

## How to Use This Document

Every third-party service that receives, stores, or processes personal data from any Hashlilly product must be listed here. This is a living document — update it every time a new tool is added or removed. Required for GDPR Article 30 RoPA, DPDP Act compliance, and internal vendor audit.

**DPA Status Key:**
- ✅ DPA signed and on file
- 🔄 DPA requested, pending
- ❌ DPA not yet requested
- N/A Not applicable (no personal data involved)

---

## Category 1 — Cloud Infrastructure

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| Amazon Web Services | All | Hosting, storage, databases | All user data | ap-south-1 (Mumbai) | 🔄 | Required for EU users | Download AWS DPA from aws.amazon.com/agreement |
| [GCP / Supabase / Firebase] | [Product] | [Service] | [Data] | [Region] | ❌ | [Yes/No] | |

**Action:** Download and execute AWS DPA. Ensure EU region (eu-west-1) is used for EU user data if technically feasible.

---

## Category 2 — Authentication

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| [Auth0 / Firebase Auth / Supabase Auth] | All | User authentication, session management | Email, password hash, session tokens | [Region] | ❌ | [Yes/No] | |

---

## Category 3 — Email Service

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| [SendGrid / Mailgun / Postmark / Brevo] | All | Transactional and marketing email | Name, email address | US/EU | ❌ | Required | Most providers offer standard DPAs online |

---

## Category 4 — Payment Processing

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| Razorpay | hashlilly.in, That's Missing, BoozeD In | Payment processing | Billing name, card last 4, billing address | India | ❌ | N/A (India-India) | Razorpay is PCI-DSS compliant |
| Stripe | [If used] | Payment processing | Billing name, card token, billing address | US/EU | ❌ | Required | Stripe DPA available at stripe.com/legal/dpa |

---

## Category 5 — Analytics

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| Google Analytics (GA4) | That's Missing, BoozeD In, hashlilly.in | Usage analytics | IP (anonymised), device, behaviour | US | ❌ | Required | **DO NOT use on Soulamore.** Configure IP anonymisation. |
| [Mixpanel / Amplitude / PostHog] | [Product] | Product analytics | [Data] | [Region] | ❌ | [Yes/No] | PostHog can be self-hosted (preferred for privacy) |

**Critical Note:** No analytics tool that processes personal data should ever receive wellness content, journal entries, or mood data from Soulamore.

---

## Category 6 — Error Monitoring

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| Sentry | All | Error tracking, crash reporting | Stack traces, user IDs, IP | US | ❌ | Required | Configure to scrub PII from error payloads before sending |

---

## Category 7 — Customer Support

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| [Intercom / Crisp / Freshdesk / Zendesk] | [Product] | Support chat and ticketing | Name, email, support messages | [Region] | ❌ | [Yes/No] | For Soulamore: support tool must not log wellness session content |

---

## Category 8 — CDN / Security

| Vendor | Product(s) | Service | Data Processed | Server Region | DPA Status | SCCs? | Notes |
|---|---|---|---|---|---|---|---|
| Cloudflare | All | CDN, DDoS protection, WAF | IP addresses, request metadata | Global | ❌ | Required | Cloudflare DPA available at cloudflare.com/gdpr/introduction |

---

## Category 9 — Communication & Collaboration (Internal)

| Vendor | Use | Data Processed | DPA Status | Notes |
|---|---|---|---|---|
| [Slack / Notion / Google Workspace] | Internal team | Employee/contractor data only | ❌ | Avoid sharing user PII in team chat tools |

---

## Vendor Removal Checklist

When a vendor is removed or replaced, complete the following:
- [ ] Delete all personal data from vendor's platform (request confirmation in writing)
- [ ] Revoke all API keys and access credentials
- [ ] Remove vendor from this inventory
- [ ] Update Privacy Policies on affected products to remove vendor reference
- [ ] Document deletion in Records of Processing Activities

---

## Next Actions

| Priority | Action | Owner | Deadline |
|---|---|---|---|
| 🔴 | Sign AWS DPA | Aditya | [Date] |
| 🔴 | Sign Stripe DPA (if used) | Aditya | [Date] |
| 🔴 | Disable GA4 on Soulamore entirely | Antigravity | [Date] |
| 🟠 | Configure Sentry PII scrubbing on all products | Antigravity | [Date] |
| 🟠 | Sign Cloudflare DPA | Aditya | [Date] |
| 🟠 | Review and sign all remaining vendor DPAs | Aditya | [Date] |
