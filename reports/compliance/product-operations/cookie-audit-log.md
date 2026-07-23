# Cookie Audit Log — Hashlilly Portfolio
**Owner:** Antigravity (maintained) / Aditya (approved)
**Version:** 1.0
**Last Audited:** [INSERT DATE]
**Audit Frequency:** Every time a new third-party script or vendor is added; minimum quarterly review

---

## How to Use This Document

Every cookie or local storage item set by any Hashlilly domain must be listed here. Run a fresh audit using browser DevTools (Application → Cookies) or a tool like Cookiebot Scanner, Ghostery, or EditThisCookie on each domain after every deployment that adds new third-party scripts.

**Category Definitions:**
- **Strictly Necessary:** Required for core site functionality. No consent needed.
- **Functional:** Enhances experience but not essential. Consent recommended.
- **Analytics:** Measures usage and performance. Consent required under GDPR/DPDP.
- **Marketing:** Advertising, retargeting, cross-site tracking. Consent required.

---

## soulamore.com

**Last scanned:** [DATE]
**Scanned by:** [Name]
**Tool used:** [Cookiebot / Manual DevTools]

| Cookie Name | Provider | Category | Purpose | Duration | Consent Required | Status |
|---|---|---|---|---|---|---|
| session_id | Soulamore | Strictly Necessary | Authenticated session token | Session | No | ✅ Active |
| csrf_token | Soulamore | Strictly Necessary | CSRF protection | Session | No | ✅ Active |
| consent_prefs | Soulamore | Strictly Necessary | Stores consent choices | 1 year | No | ✅ Active |
| lang_pref | Soulamore | Functional | Language preference | 1 year | Recommended | ✅ Active |
| theme | Soulamore | Functional | Dark/light mode setting | 1 year | Recommended | ✅ Active |
| [Add any detected third-party cookies here] | | | | | | |

**Notes:**
- ⚠️ Soulamore must have ZERO analytics or marketing cookies. If any are found during audit, remove immediately.
- ⚠️ No session recording tools (Hotjar, FullStory, etc.) on Soulamore — ever.
- ⚠️ Do not add Google Analytics, Facebook Pixel, or any ad network pixel to Soulamore.

**Action items from this audit:** [Document any issues found]

---

## thatsmissing.com

**Last scanned:** [DATE]
**Scanned by:** [Name]
**Tool used:** [Tool]

| Cookie Name | Provider | Category | Purpose | Duration | Consent Required | Status |
|---|---|---|---|---|---|---|
| session_id | That's Missing | Strictly Necessary | Login session | Session | No | ✅ Active |
| csrf_token | That's Missing | Strictly Necessary | CSRF protection | Session | No | ✅ Active |
| consent_prefs | That's Missing | Strictly Necessary | Consent record | 1 year | No | ✅ Active |
| lang_pref | That's Missing | Functional | Language setting | 1 year | Recommended | ✅ Active |
| _ga | Google Analytics | Analytics | Usage statistics | 2 years | Yes | ⏳ Pending consent gate |
| _ga_[ID] | Google Analytics | Analytics | Session tracking | 2 years | Yes | ⏳ Pending consent gate |
| [Add any detected] | | | | | | |

**Compliance checks:**
- [ ] GA4 only fires after analytics consent is granted
- [ ] IP anonymisation enabled in GA4 config
- [ ] GA4 DPA signed (available at myaccount.google.com/data-and-privacy)
- [ ] No ad or remarketing features enabled in GA4

**Action items:** [Document]

---

## boozedin.com

**Last scanned:** [DATE]
**Scanned by:** [Name]
**Tool used:** [Tool]

| Cookie Name | Provider | Category | Purpose | Duration | Consent Required | Status |
|---|---|---|---|---|---|---|
| session_id | BoozeD In | Strictly Necessary | Login session | Session | No | ✅ Active |
| csrf_token | BoozeD In | Strictly Necessary | CSRF protection | Session | No | ✅ Active |
| consent_prefs | BoozeD In | Strictly Necessary | Consent record | 1 year | No | ✅ Active |
| lang_pref | BoozeD In | Functional | Language preference | 1 year | Recommended | ✅ Active |
| _ga | Google Analytics | Analytics | Usage statistics | 2 years | Yes | ⏳ Pending consent gate |
| _ga_[ID] | Google Analytics | Analytics | Session tracking | 2 years | Yes | ⏳ Pending consent gate |
| [Add any detected] | | | | | | |

**Notes:**
- If LinkedIn or Facebook Pixel is added for brand account marketing — this requires Marketing consent tier and must be disclosed in Cookie Policy.

**Action items:** [Document]

---

## hashlilly.in

**Last scanned:** [DATE]
**Scanned by:** [Name]
**Tool used:** [Tool]

| Cookie Name | Provider | Category | Purpose | Duration | Consent Required | Status |
|---|---|---|---|---|---|---|
| session_id | Hashlilly | Strictly Necessary | Hub login | Session | No | ✅ Active |
| csrf_token | Hashlilly | Strictly Necessary | CSRF protection | Session | No | ✅ Active |
| consent_prefs | Hashlilly | Strictly Necessary | Consent record | 1 year | No | ✅ Active |
| _ga | Google Analytics | Analytics | Usage statistics | 2 years | Yes | ⏳ Pending consent gate |
| _ga_[ID] | Google Analytics | Analytics | Session tracking | 2 years | Yes | ⏳ Pending consent gate |
| [Add any detected] | | | | | | |

**Action items:** [Document]

---

## Local Storage / Session Storage Audit

In addition to cookies, audit localStorage and sessionStorage for each domain. These are not covered by cookie consent but may store personal data.

| Domain | Key | Value Type | Purpose | Personal Data? | Encrypted? |
|---|---|---|---|---|---|
| soulamore.com | [key] | [type] | [purpose] | [Yes/No] | [Yes/No] |
| thatsmissing.com | [key] | [type] | [purpose] | [Yes/No] | [Yes/No] |
| boozedin.com | [key] | [type] | [purpose] | [Yes/No] | [Yes/No] |
| hashlilly.in | [key] | [type] | [purpose] | [Yes/No] | [Yes/No] |

**Rule:** Never store sensitive data (JWT tokens, user PII, wellness data) in localStorage — use httpOnly cookies for tokens, server-side storage for sensitive data.

---

## Audit History

| Date | Domain | Auditor | New Cookies Found | Issues Resolved | Notes |
|---|---|---|---|---|---|
| [Date] | All | [Name] | [List] | [List] | Initial audit |
| | | | | | |

---

## Triggers for Immediate Re-Audit

- Any new third-party script added to any domain
- Any new npm package that has browser-side analytics or tracking
- Any new integration (chat widget, support tool, A/B testing tool)
- After any major dependency update
- After any infrastructure change (CDN, reverse proxy)
