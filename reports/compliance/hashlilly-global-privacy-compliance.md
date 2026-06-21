# Hashlilly Portfolio — Global Data Privacy Compliance Report
**Prepared for:** Antigravity (Development & Design Studio)  
**Prepared by:** Aditya / Hashlilly Private Limited  
**Scope:** soulamore.com · hashlilly.in · thatsmissing.com · boozedin.com  
**Date:** June 2026  
**Classification:** Internal — Developer & Legal Handoff

---

## How to Read This Document

This document is structured in two parts:

**Part A — Law-by-Law Reference:** Every major jurisdiction's law explained — what it requires, how it applies to you, penalties for non-compliance.

**Part B — Universal Website Implementation Checklist:** The concrete technical and design changes Antigravity must build into all four products to satisfy all jurisdictions simultaneously. Most compliance requirements overlap — one correct implementation satisfies 15+ laws at once.

**Product Risk Tiers:**
- 🔴 **Soulamore** — Highest risk. Mental health = sensitive data in every jurisdiction globally. Student/youth audience triggers child data protections.
- 🔴 **That's Missing** — High risk. Startup intelligence = potential B2B data, investor data, commercial PII at scale.
- 🟠 **BoozeD In** — High risk. Professional identity, employment data, networking = regulated PII in most frameworks.
- 🟡 **hashlilly.in** — Medium risk. Primarily business data and dashboard. Lowest individual PII surface but still in scope.

---

# PART A: JURISDICTION-BY-JURISDICTION REFERENCE

---

## 1. European Union — GDPR
**General Data Protection Regulation (2018)**  
**Regulator:** European Data Protection Board (EDPB) + national DPAs  
**Penalty:** Up to €20 million or 4% of global annual turnover, whichever is higher

### Applies to You If:
You offer services to EU residents or monitor their behavior — even if you are based in India. If a user from Germany signs up for Soulamore or That's Missing, GDPR applies to that user's data. Given That's Missing targets the global startup ecosystem and Soulamore may attract diaspora users, GDPR applicability is near-certain.

### Core Requirements

**Lawful Basis for Processing**  
You must have one of six lawful bases before processing any personal data. For your products:
- Consent (the default for SaaS products — must be freely given, specific, informed, and unambiguous)
- Contract (processing needed to deliver the service you promised)
- Legitimate Interests (only where interests are balanced against user rights — document this)

**Individual Rights You Must Support:**
- Right of Access (users can request all data you hold on them)
- Right to Rectification (users can correct inaccurate data)
- Right to Erasure / "Right to Be Forgotten"
- Right to Data Portability (export data in machine-readable format)
- Right to Restrict Processing
- Right to Object (especially to profiling and direct marketing)
- Rights related to automated decision-making

**Consent Requirements:**
- No pre-ticked boxes
- Granular (separate consent for each purpose)
- Revocable at any time, as easily as given
- Records of consent must be stored

**Special Category Data (Soulamore):**  
Mental health data, health data, and data concerning vulnerable individuals requires **explicit consent** — a higher standard than standard consent. Cannot rely on soft opt-ins.

**Data Protection Officer (DPO):**  
Required if you process special category data at scale. At minimum, appoint a designated privacy contact.

**Data Processing Agreements (DPAs):**  
Any third party that processes user data on your behalf (AWS, Stripe, SendGrid, Google Analytics, etc.) must have a signed DPA in place.

**Cross-Border Transfers:**  
Data cannot leave the EU/EEA unless:
- The destination country has an EU adequacy decision (India does NOT have one as of 2026)
- You use Standard Contractual Clauses (SCCs) with your processors
- Users give explicit, informed consent for the transfer

**Privacy by Design:**  
Data minimization, purpose limitation, and security must be built in from the start — not bolted on.

**Breach Notification:**  
Notify the relevant supervisory authority within 72 hours of becoming aware of a breach. Notify affected users without undue delay if there is high risk to their rights.

---

## 2. United Kingdom — UK GDPR + Data Protection Act 2018
**Regulator:** Information Commissioner's Office (ICO)  
**Penalty:** Up to £17.5 million or 4% of global annual turnover

Post-Brexit, the UK maintains a regime that is essentially equivalent to EU GDPR. All GDPR requirements above apply. The UK ICO issued its own adequacy decision and SCCs. For practical purposes: **comply with GDPR, you comply with UK GDPR.** The ICO has granted the EU an adequacy decision for UK→EU transfers.

---

## 3. United States — Federal + State Patchwork

The US has no single federal privacy law. Compliance requires tracking the most restrictive state laws.

### 3a. California — CCPA / CPRA
**California Consumer Privacy Act (2020) + California Privacy Rights Act (2023)**  
**Regulator:** California Privacy Protection Agency (CPPA)  
**Penalty:** Up to $7,500 per intentional violation; $2,500 per unintentional

**Applies to you if** you collect personal information of California residents AND meet any one of:
- Annual gross revenue > $25 million
- Buy/sell/receive/share personal info of 100,000+ consumers or households per year
- Derive 50%+ of revenue from selling personal information

Even if you don't meet the thresholds now, build for compliance — you will cross them.

**Key Rights:**
- Right to Know (what data is collected and why)
- Right to Delete
- Right to Correct
- Right to Opt-Out of Sale or Sharing of Personal Information
- Right to Limit Use of Sensitive Personal Information
- Right to Non-Discrimination (for exercising rights)
- Right to Portability

**Sensitive Personal Information (SPI):**  
Health/mental health data (Soulamore) is SPI under CPRA. Users have the right to limit its use to only what's necessary to provide the service.

**"Do Not Sell or Share My Personal Information":**  
If you share data with third parties for advertising or cross-context behavioral tracking, you must provide a prominent opt-out link on your homepage.

**Privacy Policy Requirements:**  
Must list categories of data collected, sources, purposes, third parties data is shared with, and retention periods.

### 3b. Other Active US State Laws (as of 2026)
These states have comprehensive consumer privacy laws in effect. All follow similar patterns to CCPA:

| State | Law | In Effect |
|-------|-----|-----------|
| Virginia | VCDPA | Jan 2023 |
| Colorado | CPA | Jul 2023 |
| Connecticut | CTDPA | Jul 2023 |
| Utah | UCPA | Dec 2023 |
| Texas | TDPSA | Jul 2024 |
| Montana | MTCDPA | Oct 2024 |
| Oregon | OCPA | Jul 2024 |
| New Hampshire | NHPA | Jan 2025 |
| Kentucky | KCDPA | Jan 2026 |
| Delaware | DPDPA | Jan 2025 |
| Iowa | ICDPA | Jan 2025 |
| Indiana | ICDPA | Jan 2026 |
| New Jersey | NJDPA | Jan 2025 |
| Tennessee | TIPA | Jul 2025 |

**Practical approach:** Build for CCPA/CPRA + GDPR. These two cover the highest bar. State laws are generally less strict and overlap significantly with both.

### 3c. Federal Sectoral Laws Still Applicable
- **COPPA** (Children's Online Privacy Protection Act): If any user is under 13, verifiable parental consent is required. Relevant for Soulamore given student/youth audience. Zero-tolerance enforcement.
- **CAN-SPAM**: All commercial emails must include unsubscribe and sender identification.
- **HIPAA**: Does NOT apply (you are not a covered health entity), but the mental health angle on Soulamore means you should treat health data with HIPAA-equivalent care as a best practice.

---

## 4. Canada — PIPEDA + Quebec Law 25
**Personal Information Protection and Electronic Documents Act**  
**Regulator:** Office of the Privacy Commissioner of Canada (OPC)  
**Penalty (PIPEDA):** Up to CAD $100,000  
**Penalty (Quebec Law 25):** Up to CAD $25 million or 4% of worldwide turnover

**Applies to you if** you collect, use, or disclose personal information about Canadians in the course of commercial activity.

**PIPEDA Key Requirements:**
- Meaningful consent before collecting personal information
- Collect only what is necessary (data minimization)
- Purpose must be stated at or before collection
- Users can withdraw consent and request deletion
- Safeguards appropriate to the sensitivity of the information
- Privacy Policy must be readily available

**Quebec Law 25 (Bill 64) — stricter, effectively GDPR-like:**
- Privacy Impact Assessments (PIAs) for new projects
- Breach notification within 72 hours to the Commission d'accès à l'information (CAI)
- Explicit consent for sensitive data
- Right to data portability
- "Privacy by default" requirement
- Automated decision-making disclosure

**Practical Note:** Quebec Law 25 sets the de facto bar for Canadian compliance. Build to it.

---

## 5. Brazil — LGPD
**Lei Geral de Proteção de Dados (2020)**  
**Regulator:** Autoridade Nacional de Proteção de Dados (ANPD)  
**Penalty:** Up to 2% of revenue in Brazil, capped at BRL 50 million per violation

**Applies to you if** you process data of Brazilian residents, regardless of where you are based.

**Core Requirements (GDPR-equivalent):**
- Ten lawful bases for processing (consent is one; legitimate interest, contract, etc.)
- Consent must be written and specific; burden of proof is on the data controller
- Eight individual rights: access, correction, deletion, portability, information, non-discrimination, revocation of consent, review of automated decisions
- Data Protection Officer (DPO / Encarregado) appointment encouraged; mandatory for large-scale processors
- Breach notification to ANPD within 2 business days of becoming aware
- Data transfers only to countries with adequate protection or via contractual clauses

**Sensitive Data under LGPD:**  
Health data, biometric data, data about minors. Soulamore's mental health focus is firmly in this category. Explicit, specific, highlighted consent required.

---

## 6. Australia — Privacy Act 1988 (APPs)
**Australian Privacy Principles**  
**Regulator:** Office of the Australian Information Commissioner (OAIC)  
**Penalty:** Up to AUD $50 million for serious or repeated interference (post-2023 amendments)

**Applies to you if** you have an annual turnover over AUD $3 million OR handle sensitive information OR provide health services. The turnover threshold may be removed in upcoming amendments — build for compliance now.

**13 Australian Privacy Principles (APPs):**
- APP 1: Open and transparent management of personal information (Privacy Policy)
- APP 3: Collection of solicited personal information — must be necessary for function
- APP 5: Notification of collection — at or before collection
- APP 6: Use or disclosure for the primary purpose only (or with consent)
- APP 7: Direct marketing — must provide opt-out
- APP 8: Cross-border disclosure — must ensure comparable protection
- APP 11: Security of personal information — reasonable steps
- APP 12: Access to personal information on request
- APP 13: Correction of personal information on request

**Sensitive Information (includes health information):**  
Requires explicit consent for collection. Soulamore is directly in scope.

**Notifiable Data Breaches (NDB) Scheme:**  
Notify the OAIC and affected individuals of eligible data breaches as soon as practicable.

---

## 7. India — DPDP Act 2023 + DPDP Rules 2025
**Digital Personal Data Protection Act, 2023 + Rules notified November 2025**  
**Regulator:** Data Protection Board of India (DPBI)  
**Penalty:** Up to INR 250 crore (~USD 30 million) for serious violations  
**Compliance Deadline:** 13 May 2027 (18 months from Rules notification)

**This is your primary home jurisdiction. Non-compliance here is the most immediately enforceable.**

**Key Requirements:**
- Explicit, granular, revocable **consent** before processing personal data
- Notice must be in plain language in all 22 scheduled Indian languages (or at minimum English + Hindi + regional)
- **Data minimization** — collect only what is strictly necessary
- **Purpose limitation** — data collected for wellness cannot be used for marketing
- **Retention limits** — erase data when purpose is fulfilled or consent withdrawn
- User rights: access, correction, erasure, grievance redressal, nominating a representative
- **Breach notification** to DPBI within timelines to be specified (currently modeled on 72-hour rule)
- **Children (under 18):** Verifiable parental consent required before any processing. No behavioral targeting, profiling, or behavioral advertising directed at children. Age-gating mechanism required. **DigiLocker-based parental verification** is the approved mechanism for India.

**Soulamore — Critical Risk:**  
If Soulamore targets students, a significant portion of the user base may be under 18. This triggers the highest tier of DPDP obligations. Age verification, parental consent workflow, and behavioral targeting restrictions are mandatory before launch.

**Significant Data Fiduciary (SDF):**  
If designated as an SDF (high-volume or sensitive data processors), additional obligations apply: Data Protection Impact Assessments (DPIAs), independent audits, Data Protection Officer appointment. Soulamore, if it scales, will likely be designated.

**Third-Party Processor Contracts:**  
All vendors (cloud, email, analytics) must have data processing agreements compliant with DPDP Rules.

---

## 8. Japan — APPI
**Act on the Protection of Personal Information (amended 2022)**  
**Regulator:** Personal Information Protection Commission (PPC)**  
**Penalty:** Up to JPY 100 million (corporate), JPY 1 million (individual violations)

**Applies to you if** you handle personal information of persons in Japan (extraterritorial reach confirmed in 2022 amendments).

**Key Requirements:**
- Specify purpose of use and notify at or before collection
- Obtain explicit consent for sensitive information (health, medical history)
- Cross-border transfers: must ensure recipient has comparable standards; notify users of destination country and protection level
- Breach notification to PPC and affected individuals (amendments require reporting within 3–5 days)
- Right of disclosure, correction, deletion, and suspension of use
- Third-party disclosure notification

**Adequacy:** Japan has an EU adequacy decision, making EU→Japan transfers easier. Build GDPR-quality consent and you satisfy APPI.

---

## 9. South Korea — PIPA
**Personal Information Protection Act (amended 2023)**  
**Regulator:** Personal Information Protection Commission (PIPC)  
**Penalty:** Up to KRW 3 billion or 3% of revenue; imprisonment up to 10 years for serious violations

**One of the world's strictest privacy laws.** PIPA has EU adequacy status.

**Key Requirements:**
- Explicit written consent for collection, use, and third-party disclosure — each purpose requires separate consent
- Sensitive information (health, biometrics, etc.) requires explicit consent + stored separately
- Mandatory appointment of Privacy Officer (CPO)
- Breach notification within 72 hours to PIPC; user notification within 72 hours
- Data localization: certain data types must be stored in Korea or under controlled transfer
- Destruction of data when retention period ends or purpose is achieved — within fixed timelines
- Privacy Impact Assessment for certain processing activities
- Users have rights of access, correction, deletion, suspension, and portability

**Note for Soulamore:** Mental health data is sensitive under PIPA. Any Korean user base requires the highest consent tier.

---

## 10. China — PIPL
**Personal Information Protection Law (2021)**  
**Regulator:** Cyberspace Administration of China (CAC)  
**Penalty:** Up to RMB 50 million or 5% of prior year revenue; business suspension; blacklisting

**Applies to you if** you process personal information of persons within China OR your processing activities outside China affect the rights of persons in China.

**Key Requirements:**
- Separate, specific consent for each purpose; separate consent for sensitive personal information
- Cross-border transfer restrictions: security assessment by CAC required for transfers of large volumes; Standard Contract for smaller transfers
- Data localization: critical information infrastructure operators and large-scale processors must store data in China
- Privacy Policy in Chinese, accessible at all times
- Breach notification to regulators within specified timeframe
- Individuals' rights: access, copy, correction, deletion, portability, explanation of automated decisions

**Practical Note for Hashlilly:**  
If you have no intentional presence in China and do not specifically target Chinese users, PIPL extraterritorial reach is less likely to be enforced. However, if Chinese users sign up (possible for That's Missing given global startup focus), document your transfer mechanisms. Consider geofencing China if you are not prepared to comply fully.

---

## 11. Singapore — PDPA
**Personal Data Protection Act (amended 2021)**  
**Regulator:** Personal Data Protection Commission (PDPC)  
**Penalty:** Up to SGD 1 million or 10% of annual Singapore turnover

**Key Requirements:**
- Consent (express or deemed) for collection, use, and disclosure
- "Deemed consent" when users voluntarily provide data — but purpose must be reasonable
- Mandatory Data Protection Officer (DPO) appointment and registration with PDPC
- Breach notification within 3 calendar days to PDPC; notification to affected individuals if significant harm likely
- Do-Not-Call Registry compliance for direct marketing via calls/SMS
- Data portability obligation (right to request transfer to another organization)
- Prohibition on processing that causes significant harm (profiling for exploitative purposes)

---

## 12. Thailand — PDPA
**Personal Data Protection Act (2022)**  
**Regulator:** Personal Data Protection Committee (PDPC)**  
**Penalty:** Up to THB 5 million administrative; THB 1 million criminal; imprisonment up to 1 year

GDPR-modeled. Key requirements align with GDPR: lawful basis, consent, individual rights, data minimization, breach notification. Sensitive data (health) requires explicit consent. Cross-border transfers need adequate protection or contractual safeguards.

---

## 13. Malaysia — PDPA
**Personal Data Protection Act 2010 (amendments pending 2024–2025)**  
**Regulator:** Department of Personal Data Protection (JPDP)  
**Penalty:** Up to MYR 500,000 and/or 3 years imprisonment (expected to increase with amendments)

Seven data protection principles: General, Notice and Choice, Disclosure, Security, Retention, Data Integrity, Access. Consent required; sensitive personal data (health) requires explicit consent. No transfers to countries without adequate protection unless consent or contractual safeguards.

---

## 14. Indonesia — PDPL
**Personal Data Protection Law (2024)**  
**Regulator:** Ministry of Communication and Information Technology  
**Penalty:** Up to 2% of annual revenue; up to IDR 60 billion; imprisonment up to 6 years

GDPR-modeled framework. Lawful bases including consent; individual rights (access, correction, deletion, portability); explicit consent for sensitive data (health); 14-day breach notification; DPO appointment for certain organizations.

---

## 15. Philippines — Data Privacy Act 2012
**Regulator:** National Privacy Commission (NPC)  
**Penalty:** Up to PHP 5 million and/or 6 years imprisonment

Consent, legitimate purpose, proportionality as core principles. Individual rights (access, correction, erasure, data portability). Sensitive personal information (health, psychographic data) has stricter rules. 72-hour breach notification to NPC. Data Protection Officer required.

---

## 16. Vietnam — PDPD
**Personal Data Protection Decree (2023)**  
**Regulator:** Ministry of Public Security  
**Penalty:** Up to VND 100 million (administrative); criminal charges possible

Strict consent requirements with documented records. Cross-border transfers require prior security assessments submitted to the Ministry of Public Security. 72-hour breach notification. Data localization requirements for certain sectors. One of the strictest transfer regimes in Southeast Asia.

---

## 17. UAE — Federal PDPL + DIFC + ADGM
**Federal Personal Data Protection Law (2021, effective 2022)**  
**Regulator:** UAE Data Office (federal); DIFC Commissioner of Data Protection (DIFC); ADGM Registration Authority (ADGM)  
**Penalty:** Up to AED 5 million (federal PDPL)

Consent-based framework. Sensitive data (health) requires explicit consent. Cross-border transfers only to adequate countries or via contract. Breach notification within 72 hours. Right to access, correction, deletion, objection. Note: DIFC and ADGM are separate free zone jurisdictions with their own GDPR-modeled laws — if you have any business presence there, those apply instead.

---

## 18. Saudi Arabia — PDPL
**Personal Data Protection Law (2021, full effect 2023)**  
**Regulator:** Saudi Data and Artificial Intelligence Authority (SDAIA)**  
**Penalty:** Up to SAR 5 million; imprisonment

Consent required unless exemption applies. Sensitive data (health, financial, genetic) requires explicit consent. Cross-border transfers: only to countries with equivalent standards or via SDAIA approval. 72-hour breach notification to SDAIA. Individual rights: access, correction, deletion. Data must be stored in Saudi Arabia for certain sensitive categories (data localization).

---

## 19. Israel — Privacy Protection Law (PPL)
**Regulator:** Privacy Protection Authority (PPA)**  
**Penalty:** Criminal and civil sanctions

EU adequacy status. GDPR-aligned. Consent, database registration for certain databases, individual rights, security obligations, transfer restrictions. For practical purposes, GDPR compliance covers Israel.

---

## 20. South Africa — POPIA
**Protection of Personal Information Act (2021)**  
**Regulator:** Information Regulator  
**Penalty:** Up to ZAR 10 million and/or 10 years imprisonment

Eight conditions for lawful processing: accountability, processing limitation, purpose specification, further processing limitation, information quality, openness, security, data subject participation. Special personal information (health, biometrics) has heightened requirements. Breach notification to Information Regulator and data subjects. Data subject rights similar to GDPR.

---

## 21. Kenya — Data Protection Act 2019
**Regulator:** Office of the Data Protection Commissioner (ODPC)  
**Penalty:** Up to KES 3 million or 1% of annual turnover

GDPR-modeled. Lawful basis, consent, individual rights, data minimization, breach notification within 72 hours. Data processors must be registered with ODPC.

---

## 22. Nigeria — NDPR + NDPA
**Nigeria Data Protection Regulation (2019) / Nigeria Data Protection Act (2023)**  
**Regulator:** Nigeria Data Protection Commission (NDPC)  
**Penalty:** Up to 2% of annual gross revenue or NGN 10 million

GDPR-influenced. Lawful basis including consent; individual rights; data minimization; security; breach reporting; third-party data processing agreements required. Audit requirements for large data processors.

---

## 23. Argentina — PDPA
**Personal Data Protection Act 25.326 (2000, modernization in progress)**  
**Regulator:** Agencia de Acceso a la Información Pública (AAIP)**  
**Penalty:** Up to ARS 3 million

EU adequacy status. Individual rights, consent, sensitive data (health) protections, database registration, security measures, cross-border transfer restrictions to countries without adequate protection.

---

## 24. Mexico — LFPDPPP
**Federal Law on Protection of Personal Data Held by Private Parties (2010)**  
**Regulator:** Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos (INAI)  
**Penalty:** Up to MXN 320 million

Privacy notice (Aviso de Privacidad) mandatory. ARCO rights (Access, Rectification, Cancellation, Opposition). Sensitive data (health) requires explicit consent. Cross-border transfers: contractual safeguards required.

---

## 25. New Zealand — Privacy Act 2020
**Regulator:** Office of the Privacy Commissioner (OPC)**  
**Penalty:** Up to NZD 10,000 per offence; significant reputational enforcement

13 Information Privacy Principles (similar to Australian APPs). Mandatory breach notification: report to OPC and notify affected individuals when serious harm is likely. Collection from sources other than the individual requires notice. Individual access and correction rights.

---

## 26. Turkey — KVKK
**Law on the Protection of Personal Data No. 6698 (2016)**  
**Regulator:** Personal Data Protection Authority (KVKK)  
**Penalty:** Up to TRY 1 million + criminal liability

GDPR-modeled. Explicit consent for sensitive data (health). Data controller registration with VERBIS registry. Cross-border transfers require adequacy decision or explicit consent. 72-hour breach notification.

---

## 27. Switzerland — nFADP
**New Federal Act on Data Protection (2023)**  
**Regulator:** Federal Data Protection and Information Commissioner (FDPIC)**  
**Penalty:** Up to CHF 250,000 (personal liability of data protection officer)

GDPR-equivalent, with some differences (stronger focus on individual criminal liability vs. corporate fines). EU adequacy maintained. Same practical requirements as GDPR for most purposes.

---

# PART B: UNIVERSAL IMPLEMENTATION GUIDE FOR ANTIGRAVITY

The good news: **GDPR + DPDP Act + CCPA + LGPD together cover 90% of what every other law requires.** Build those correctly and you are substantially compliant globally. What follows is the complete list of website and system changes needed.

---

## B1. Consent Management Platform (CMP)

**This is the single highest-priority technical implementation.**

### What to Build / Integrate
A CMP must be implemented on all four domains. It manages cookie consent, processing consent, and records of consent.

**Recommended tools (any one):**
- Cookiebot (GDPR, CCPA, LGPD, DPDP certified — easiest global coverage)
- OneTrust (enterprise-grade, covers all 50+ jurisdictions)
- Usercentrics
- Osano

**What the CMP must do:**

```
1. On first visit (before any tracking loads):
   - Display a consent banner/modal
   - Categorize cookies: Strictly Necessary | Functional | Analytics | Marketing
   - Pre-ticked boxes are ILLEGAL under GDPR — all optional categories OFF by default
   - "Accept All" and "Reject All" buttons must be equally prominent
   - "Manage Preferences" link for granular control
   
2. No analytics, marketing, or non-essential scripts may load until:
   - User actively accepts them (GDPR/LGPD/KVKK/POPIA)
   - OR user is from a jurisdiction where implied consent is allowed (e.g., US outside CA)
   
3. Consent records stored:
   - Timestamp, session ID, jurisdiction, categories consented to
   - Retained for minimum 3 years (GDPR enforcement standard)
   
4. Consent withdrawal:
   - Link in footer: "Cookie Settings" / "Privacy Preferences" — always accessible
   - Withdrawal must be as easy as giving consent
   - On withdrawal, non-essential cookies must be deleted immediately
```

**Product-specific note for Soulamore:**  
Processing consent (not just cookie consent) must be obtained before a user creates a journal entry, shares mood data, or engages with any wellness feature. This is a separate, explicit in-app consent flow — not just a cookie banner.

---

## B2. Privacy Policy

**Every domain needs a complete, accurate, legally-sound Privacy Policy.**

### Mandatory Sections

```
1. Who We Are
   - Full legal entity name (Hashlilly Private Limited)
   - Registered address
   - Contact email: privacy@[domain].com
   - Data Protection Officer contact (once appointed)

2. What Data We Collect
   - Exhaustive itemized list: name, email, device ID, IP address, usage data,
     payment info, user-generated content, etc.
   - Be specific per product (journal entries, mood logs = Soulamore; 
     startup data = That's Missing; professional history = BoozeD In)

3. How We Collect It
   - Directly (sign-up forms, in-app inputs)
   - Automatically (cookies, analytics, device info)
   - From third parties (OAuth providers, payment processors)

4. Why We Process It (Legal Basis per GDPR)
   - Delivering the service (contract)
   - With your consent (list each consent-based purpose separately)
   - Legal obligations
   - Legitimate interests (describe them)

5. Who We Share It With
   - Exhaustive list of categories: cloud infrastructure (AWS/GCP/etc.), 
     payment processors (Stripe/Razorpay), email service providers, 
     analytics (if any — consider removing for Soulamore entirely),
     customer support tools

6. International Transfers
   - State which countries data may be transferred to
   - Mechanism used (SCCs, adequacy, consent)
   - Specific note for India: data processed in India; transfers to US/EU 
     processors governed by SCCs

7. Data Retention
   - Specific periods per data type (not "as long as necessary" — that fails GDPR)
   - Example: Account data → deleted 30 days after account closure
   - Example: Journal entries (Soulamore) → deleted immediately on user deletion request
   - Example: Billing records → 7 years (tax/legal requirement)

8. Your Rights (list ALL — covers every jurisdiction)
   - Access your data
   - Correct inaccurate data
   - Delete your data ("Right to be Forgotten")
   - Port your data
   - Withdraw consent
   - Object to processing
   - Restrict processing
   - Rights related to automated decisions
   - Lodge a complaint with a supervisory authority
   - For US users: Right to opt out of sale/sharing
   - For Indian users: Right to nominate a representative

9. Children's Data
   - Age restriction (specify: "This service is not intended for users under [16/18]")
   - Soulamore: define age-gate mechanism and parental consent workflow
   - COPPA compliance statement if any US under-13 use is possible

10. Sensitive Data (Soulamore specifically)
    - Explicit statement that mental health data is processed
    - Legal basis: explicit consent
    - How it is protected (encryption, access controls, no sharing)

11. Cookies Section
    - Or link to separate Cookie Policy

12. Changes to This Policy
    - How users will be notified (email + in-app banner)

13. Contact Us / How to Exercise Rights
    - Email address: privacy@[domain].com
    - Response timeline: 30 days (GDPR standard), 45 days (CCPA), 72 hours for breaches
    - Links to national supervisory authorities for EU/UK users
```

### Language & Accessibility
- Plain language — no legalese. Tested at reading level of a 16-year-old.
- For Indian compliance: must be available in English. Hindi translation strongly recommended. Regional languages for broader reach.
- For Brazil: Portuguese translation.
- For China (if targeting): Simplified Chinese.
- Accessible via direct URL: `[domain]/privacy` — not buried in menus.

---

## B3. Terms of Service / Terms of Use

```
Must include:
- Age minimums clearly stated
- What users can and cannot do with the platform
- Intellectual property ownership (user-generated content ownership — critical for Soulamore)
- Disclaimers (Soulamore: not a substitute for professional medical/mental health care)
- Governing law (India) and dispute resolution
- Limitation of liability
- Account termination conditions
- User data upon termination
```

---

## B4. In-App Consent Flows

**Beyond the cookie banner — active consent at the point of data collection.**

### Registration / Sign-Up Flow
```
□ Checkbox: "I agree to the Terms of Service" [required, not pre-ticked, links to ToS]
□ Checkbox: "I have read and understood the Privacy Policy" [required, links to Privacy]
□ Optional checkbox: "I agree to receive product updates and marketing emails" 
  [NOT required, not pre-ticked — opt-in only]
□ Age declaration: "I confirm I am 18 years of age or older" 
  [or date-of-birth field that gates under-18 users]
```

### Soulamore — Additional In-App Consent
```
Before any wellness feature (journal, mood tracking, therapist chat):
□ Full-screen consent modal (not just a banner):
  - "Soulamore collects your mental health and wellness entries. 
     This is sensitive personal data under applicable privacy laws."
  - "This data is stored encrypted, never sold, never shared with third parties 
     without your explicit consent."
  - "You can delete all your data at any time from your account settings."
  - [I understand and consent] [I do not consent — return to home]
  
This consent must be separate from registration consent.
```

### BoozeD In — Professional Data Consent
```
Before profile creation:
- Clear notice that professional information is visible to other platform members
- Granular settings: "Who can see my profile: Everyone / Connections only / Nobody"
- Separate consent for: employer discovery features, recruiter visibility, data for matching
```

---

## B5. User Rights Portal (Data Subject Request System)

**Every user must be able to exercise their rights. This requires a functional system.**

### What to Build
```
A "Privacy Dashboard" or "My Data" section in every product's account settings.

Minimum features:
□ Download My Data
  - Export all user data as JSON or CSV within 30 days of request
  - Covers: profile data, activity logs, user-generated content, preferences
  
□ Delete My Account
  - Permanently deletes all personal data
  - Confirmation screen: "This cannot be undone. All your data will be permanently deleted."
  - Completion within 30 days (GDPR) / 45 days (CCPA)
  - Exception: retain billing records for 7 years (legal requirement — separate, anonymized)
  
□ Correct My Data
  - Edit profile information directly, or submit correction request
  
□ Withdraw Consent
  - Toggle: "Withdraw consent for [analytics / marketing / data processing]"
  - Immediately stops non-essential processing
  
□ View Consent History
  - Log of what consent was given and when
  
□ Contact Privacy Team
  - Form that submits to privacy@[domain].com
  - Auto-acknowledgement email with reference number and timeline
```

### Backend Requirements
```
All deletion requests must:
1. Mark user as "deletion pending" immediately
2. Cascade delete across all tables (not just the users table)
3. Remove from all third-party processors (send deletion request to email provider, 
   analytics platform, support tool)
4. Complete within 30 days
5. Send confirmation email to user
6. Log the deletion event in an audit log (retain log for 3 years minimum)
```

---

## B6. Cookie Management

### Cookie Audit (Do This First)
```
Audit every cookie set by each domain:
- List: name, provider, type, duration, purpose
- Categorize: Strictly Necessary | Functional | Analytics | Marketing/Advertising
- Remove any cookies you don't need
- For each third-party cookie, ensure a DPA is in place with that vendor

Tools to run the audit: Cookiebot Scanner, OneTrust Cookie Scanner, 
or manually via Chrome DevTools → Application → Cookies
```

### Cookie Policy Page
Separate page at `[domain]/cookies`:
```
- Table: Cookie name | Provider | Purpose | Duration | Type
- Explanation of how to control cookies via browser settings
- Link back to consent management preferences
```

### Implementation Rule
```
No non-essential cookies may be set until consent is obtained.

Strictly Necessary (load always, no consent needed):
- Session cookie (auth)
- CSRF token cookie
- Cookie consent preference cookie itself
- Shopping cart / checkout state

Need Consent Before Loading:
- Google Analytics / GA4
- Hotjar / session recording tools
- Facebook Pixel / any ad pixel
- Intercom / support chat (if used)
- Any third-party widget that sets its own cookies
```

---

## B7. Email Marketing Compliance

```
CAN-SPAM (US), CASL (Canada), GDPR (EU), DPDP (India):

□ All marketing emails must include:
  - Sender's physical address
  - Clear identification as commercial email
  - One-click unsubscribe link (functional within 10 business days under CAN-SPAM,
    immediately under GDPR/CASL)
  
□ Unsubscribe must:
  - Work with one click (no login required to unsubscribe)
  - Immediately suppress the email address from marketing lists
  - Not unsubscribe from transactional emails (password reset, billing)
  
□ Subscription records must store:
  - When the user subscribed
  - What they were told they were subscribing to
  - IP address and timestamp (CASL requirement)
  
□ Canada (CASL): Requires express consent for commercial electronic messages.
  Pre-existing business relationship provides implied consent for 2 years only.
  
□ Never email users who have not opted in to marketing, regardless of 
  them having an account.
```

---

## B8. Data Breach Response Protocol

**Must be documented and tested before launch on every product.**

```
Hour 0–1: Detection & Containment
- On-call engineer assesses scope: what data, how many users, how accessed
- Isolate affected systems to prevent further exfiltration
- Preserve logs (do not delete anything — needed for investigation)

Hour 1–24: Internal Escalation
- Notify Aditya (data controller) immediately
- Engage legal counsel
- Determine if breach is "notifiable" (risk to users' rights and freedoms)
- Begin documentation: what happened, when, what data, how many individuals

Within 72 Hours: Regulator Notification (GDPR, LGPD, DPDP, CCPA, POPIA, etc.)
- File initial report with relevant DPAs even if investigation is incomplete
- Required fields: nature of breach, categories and approximate numbers of 
  individuals and records, likely consequences, measures taken or proposed
- GDPR: notify lead supervisory authority (whichever EU country has most users)
- India DPDP: notify Data Protection Board of India
- Australia: notify OAIC
- US CCPA: notify California AG if 500+ Californians affected

User Notification (High Risk Breaches):
- Without undue delay once high risk to individuals is confirmed
- Plain language: what happened, what data was involved, what you are doing,
  what the user should do (change password, monitor accounts, etc.)
- Dedicated web page: [domain]/security-notice (no SEO, direct URL only)

Post-Incident:
- Full incident report within 30 days
- Root cause analysis
- Remediation implementation
- Update Antigravity on security patches required
```

---

## B9. Third-Party Vendor Management

```
Every vendor that touches user data must have a signed agreement.

Step 1: Inventory all vendors
Common categories:
- Cloud hosting (AWS, GCP, Azure, Supabase, Firebase)
- Email (SendGrid, Mailgun, Postmark, Brevo)
- Payment (Stripe, Razorpay)
- Analytics (Google Analytics, Mixpanel, Amplitude, PostHog)
- Support (Intercom, Zendesk, Freshdesk)
- Error monitoring (Sentry)
- CDN (Cloudflare)
- Authentication (Auth0, Firebase Auth)

Step 2: For each vendor, obtain or sign:
- Data Processing Agreement (DPA) — most major vendors have standard DPAs; request them
- Confirm what data they receive and why
- Confirm their sub-processors
- Confirm breach notification SLA to you

Step 3: EU Standard Contractual Clauses (SCCs)
- Required for any transfer of EU user data to non-adequate countries
- Most major US vendors (AWS, Google, Stripe) provide EU SCCs pre-signed
- Download and retain these for your records

Step 4: Reduce data shared with third parties
- Do NOT send raw user data to analytics tools if avoidable
- Use anonymization/pseudonymization before sending to analytics
- For Soulamore: NEVER send journal content, mood data, or any wellness entries 
  to any third-party analytics tool under any circumstances
```

---

## B10. Children & Minors — Special Obligations

```
Minimum age thresholds by jurisdiction:
- GDPR (EU): 16 years (some member states allow 13 with national law)
- UK GDPR: 13 years
- CCPA/COPPA (US): COPPA = under 13; CCPA = under 16 for opt-in data sale
- India DPDP: under 18 requires verifiable parental consent
- South Korea PIPA: under 14 requires parental consent
- Brazil LGPD: under 18 for sensitive data
- Singapore PDPA: under 18 without parental consent for sensitive data

Recommendation for all Hashlilly products: Set minimum age at 18 globally.
For Soulamore specifically: If targeting students (some under 18), you MUST:

□ Implement age-gate on registration (date of birth field)
□ For Indian users under 18: DigiLocker parental consent verification workflow
□ For EU/UK users under 16: parental consent email verification
□ Block behavioral profiling, tracking, targeted recommendations for under-18 accounts
□ No behavioral advertising directed at under-18 users
□ Separate data storage for minor accounts with stricter access controls
□ Enhanced deletion — minor's data deleted completely within shorter period on request

If you cannot implement verifiable age-gating and parental consent:
Set age minimum at 18 everywhere and enforce via ToS + date-of-birth collection.
Document this decision.
```

---

## B11. Accessibility of Legal Documents

```
All legal pages must:
□ Load within 3 seconds (performance)
□ Be accessible via direct URL (no JavaScript required to view)
□ Be indexed for internal search but opt-out of external search engine indexing for 
  any draft/staging versions
□ Display effective date and last-updated date prominently
□ Version history maintained (keep previous versions accessible)
□ Footer links on every page of every product:
  - Privacy Policy
  - Terms of Service
  - Cookie Policy / Cookie Settings
  - Contact Us
  - [For US traffic] "Do Not Sell or Share My Personal Information"
```

---

## B12. Data Localization Notes by Jurisdiction

```
Jurisdictions with data localization requirements (data must remain in-country):
- Russia (FZ-242): Russian citizens' personal data in Russian servers
- China (PIPL/MLPS): Certain sensitive data must stay in China
- Saudi Arabia (PDPL): Sensitive categories may require local storage
- Vietnam (PDPD): Transfer requires pre-approval security assessment
- Indonesia (PDPL): Certain strategic data must remain in-country
- India (DPDP): No general localization; "critical personal data" categories TBD

Practical approach for Hashlilly:
- Host primary infrastructure in India (AWS Mumbai, GCP Mumbai) — satisfies DPDP
- Use EU-region cloud for EU users where technically feasible
- For Russia, China, Vietnam, Saudi Arabia: consider whether to actively 
  serve users there or implement geofencing until localization is feasible
- Document your hosting regions in your Privacy Policy
```

---

## B13. Cross-Border Transfer Mechanisms Checklist

```
When EU/UK user data flows to India (your primary infrastructure):
□ Standard Contractual Clauses (SCCs) — EU issued June 2021 version
  between Hashlilly as data importer and the EU-based sub-processor
  OR executed by the EU user explicitly consenting to the transfer
□ Document the transfer in your Records of Processing Activities (RoPA)
□ Transfer Impact Assessment (TIA) — assess India's legal framework against GDPR standards

When any user data flows to US-based processors (AWS, Google, Stripe, etc.):
□ EU-US Data Privacy Framework (DPF) — check if your US processor is DPF-certified
□ If not DPF-certified: use processor's published SCCs
□ UK: UK IDTA (International Data Transfer Agreement) for UK-to-third-country transfers

Adequacy Decisions (can transfer freely, no additional mechanism needed):
EU → Japan ✓ | EU → South Korea ✓ | EU → Canada (commercial) ✓ 
EU → New Zealand ✓ | EU → Argentina ✓ | EU → Israel ✓ | EU → Switzerland ✓
EU → US (via DPF — check certification) ✓
```

---

## B14. Records of Processing Activities (RoPA)

**Required under GDPR Art. 30. Best practice globally. Must be maintained internally.**

```
For each product, maintain a spreadsheet/document with:
- Processing activity name
- Controller (Hashlilly Private Limited)
- Purpose of processing
- Categories of data subjects (users, minors, professionals, etc.)
- Categories of personal data
- Recipients / third parties
- Cross-border transfers and mechanisms
- Retention periods
- Security measures

This is an internal document — not published, but must be available to 
regulators on request. Keep it updated whenever you add a new data type, 
vendor, or feature.
```

---

## Priority Implementation Plan for Antigravity

### Phase 1 — Legal Foundations (Before Any Public Launch)
```
□ Draft Privacy Policy (all 4 domains — unique per product)
□ Draft Terms of Service (all 4 domains)
□ Draft Cookie Policy (all 4 domains)
□ Engage a privacy lawyer to review all documents
□ privacy@[domain].com email addresses set up and monitored
□ Footer links implemented on all 4 domains
```

### Phase 2 — Technical Consent Infrastructure (Sprint 1–2)
```
□ CMP integrated on all 4 domains (Cookiebot / OneTrust)
□ All non-essential scripts blocked until consent obtained
□ Cookie audit completed — table published on each Cookie Policy page
□ Age-gating on registration (date of birth field minimum)
□ Marketing email opt-in checkbox added (unchecked by default)
□ "Do Not Sell or Share" link added for US traffic (Soulamore, That's Missing, BoozeD In)
```

### Phase 3 — User Rights System (Sprint 3–4)
```
□ "My Data" / Privacy Dashboard built in account settings (all products)
□ Data export feature functional (JSON/CSV within 30 days)
□ Account deletion flow functional (cascades to all data)
□ Consent withdrawal toggles functional
□ Privacy request form → privacy@[domain].com with auto-acknowledgement
□ Response workflow documented: who handles requests, in what timeframe
```

### Phase 4 — Vendor & Process Hygiene (Sprint 5–6)
```
□ Vendor inventory completed
□ DPAs obtained/signed from all data processors
□ EU SCCs collected from all EU-user-data-touching processors
□ RoPA document created and maintained for each product
□ Breach response protocol documented and team briefed
□ Data retention schedule implemented in code (automated deletion jobs)
```

### Phase 5 — Product-Specific Obligations (Ongoing)
```
Soulamore:
□ Explicit in-app wellness data consent flow (separate from registration)
□ Mental health data stored encrypted, access-restricted, never in analytics tools
□ Under-18 handling policy implemented
□ "Not a medical service" disclaimer on all wellness features
□ Breach notification plan specific to sensitive data scenario

That's Missing:
□ B2B data processing agreements if processing employee/founder data at scale
□ Opt-out mechanism for public professional profiles if aggregated
□ Anti-scraping + rate limiting (reduces data subject risk)

BoozeD In:
□ Profile visibility controls (public / connections / private)
□ Employment history consent (explicit: "This data will be visible to recruiters")
□ Data retention for inactive accounts (notify + delete after 24 months inactivity)

hashlilly.in:
□ Business data handling — if processing employee/contractor data, add B2B DPAs
□ Dashboard access logs — retain for 1 year minimum
```

---

## Quick Reference: Fines by Jurisdiction

| Jurisdiction | Law | Max Fine |
|---|---|---|
| EU | GDPR | €20M or 4% global revenue |
| UK | UK GDPR | £17.5M or 4% global revenue |
| USA (California) | CCPA/CPRA | $7,500/intentional violation |
| Brazil | LGPD | 2% Brazil revenue, BRL 50M cap |
| India | DPDP Act | INR 250 crore (~USD 30M) |
| Australia | Privacy Act | AUD 50M |
| South Korea | PIPA | 3% revenue; 10 years imprisonment |
| Singapore | PDPA | SGD 1M or 10% SG revenue |
| UAE | PDPL | AED 5M |
| Saudi Arabia | PDPL | SAR 5M |
| South Africa | POPIA | ZAR 10M |
| Japan | APPI | JPY 100M |
| China | PIPL | RMB 50M or 5% global revenue |
| Canada | PIPEDA / Quebec Law 25 | CAD 25M or 4% global revenue |
| Turkey | KVKK | TRY 1M + criminal |
| Switzerland | nFADP | CHF 250,000 (personal liability) |
| Indonesia | PDPL | 2% annual revenue; IDR 60B |
| Philippines | DPA 2012 | PHP 5M |
| Vietnam | PDPD | VND 100M |
| Argentina | PDPA | ARS 3M |
| Mexico | LFPDPPP | MXN 320M |
| New Zealand | Privacy Act 2020 | NZD 10,000/offence |
| Nigeria | NDPA | 2% annual revenue or NGN 10M |

---

## Recommended Ongoing Compliance Stack

| Function | Tool / Approach |
|---|---|
| Cookie Consent Management | Cookiebot or OneTrust |
| Privacy Policy Generator (draft) | Iubenda, Termly (then lawyer-reviewed) |
| Data Subject Request Management | Osano, DataGrail, or custom dashboard |
| Vendor DPA Tracking | Internal spreadsheet + DocuSign |
| Privacy Monitoring / Law Updates | IAPP newsletter, OneTrust regulatory updates |
| Legal Counsel | Privacy lawyer familiar with DPDP + GDPR |
| Annual Audit | Internal review + optional third-party assessment |

---

*Report generated for internal use by Hashlilly Private Limited.*  
*This document provides operational guidance and does not constitute legal advice.*  
*All products must be reviewed by qualified legal counsel before public launch.*  
*Revision history to be maintained by Antigravity upon implementation.*  
*Last Updated: June 2026*
