# Intellectual Property Ownership Policy — Hashlilly Private Limited
**Version:** 1.0
**Owner:** Aditya / Hashlilly Private Limited
**Effective Date:** [INSERT DATE]

---

## Purpose

This policy defines who owns intellectual property created in connection with Hashlilly Private Limited — including code, design, content, data, and brand assets. This is critical because Hashlilly works with external contractors (Antigravity), and IP ownership must be explicitly assigned in writing to avoid future disputes.

---

## 1. What IP Exists at Hashlilly

### 1a. Software and Code
- Backend API codebases for all products (Soulamore, That's Missing, BoozeD In, hashlilly.in)
- Frontend web applications
- Mobile applications (if any)
- Automation scripts, deployment infrastructure, CI/CD pipelines
- AI/ML models, algorithms, prompt engineering systems

### 1b. Design and Brand Assets
- Logos, iconography, illustration systems
- UI design files (Figma, Adobe XD, etc.)
- Brand guidelines and design systems
- Marketing assets, social media templates

### 1c. Content and Data
- Editorial content, blog posts, research reports
- Startup intelligence datasets and analyses (That's Missing)
- User-generated content (owned by users per ToS — licensed to Hashlilly)
- Platform-generated aggregate data and insights

### 1d. Trademarks and Brand Names
- All marks listed in the Trademark Filing Plan
- Domain names: hashlilly.in, soulamore.com, thatsmissing.com, boozedin.com

---

## 2. Ownership Assignments

### 2a. Founder-Created IP
All intellectual property created by the founder (Aditya) in connection with Hashlilly — including concepts, product specifications, business plans, brand names, and content — is owned by **Hashlilly Private Limited** from the date the company was incorporated, or from the date of creation, whichever is earlier.

### 2b. Contractor and Agency IP (Antigravity and Others)

**Default rule under Indian Copyright Act:** The creator (contractor) owns copyright unless there is a written agreement to the contrary.

**This means: without a signed IP assignment agreement, Antigravity owns the code and designs they build.**

**Required action:** Every engagement with Antigravity (and any other contractor) must include a signed agreement with the following clauses:

#### IP Assignment Clause (must be in every contractor agreement)
```
"All work product, inventions, code, designs, content, and other materials 
created by the Contractor in the course of performing services for Hashlilly 
Private Limited ("Work Product") shall be deemed works made for hire. To the 
extent any Work Product does not qualify as works made for hire under applicable 
law, the Contractor hereby irrevocably assigns to Hashlilly Private Limited all 
right, title, and interest in and to such Work Product, including all intellectual 
property rights therein, throughout the world, in perpetuity.

The Contractor retains no rights to the Work Product and agrees to execute any 
further documents reasonably requested by Hashlilly to perfect or record such 
assignment."
```

#### Pre-Existing IP
If Antigravity incorporates any pre-existing tools, libraries, frameworks, or proprietary code into Hashlilly products, this must be:
- Disclosed in writing before incorporation
- Either assigned to Hashlilly, or licensed to Hashlilly under a perpetual, royalty-free, irrevocable licence
- Open-source components documented with their licence (MIT, Apache 2.0, GPL — GPL has viral effects, avoid where possible)

### 2c. Employees (When Hired)
Employment agreements must contain:
- IP assignment clause (all work-related inventions belong to Hashlilly)
- Moral rights waiver (to the extent permitted by law)
- Non-compete and non-solicitation clauses (reasonable in scope and duration)
- Confidentiality obligations surviving termination

### 2d. User-Generated Content
Per Terms of Service: users retain ownership; grant Hashlilly a limited licence for service delivery. Hashlilly does not claim ownership of user content.

---

## 3. Confidentiality

All contractors, employees, and advisors with access to Hashlilly's code, business data, user data, or strategic plans must sign an NDA before access is granted. See NDA template in this package.

---

## 4. Open Source Policy

Hashlilly products may use open-source components. Rules:
- MIT, Apache 2.0, BSD: permitted freely
- LGPL: permitted with care; do not modify the LGPL library itself
- GPL v2 / GPL v3: **avoid in commercial products** — GPL has viral effect (requires your code to also be GPL if you distribute)
- AGPL: **do not use** in any product — AGPL requires source disclosure even for SaaS
- Unknown / no licence: **do not use** — treat as all-rights-reserved

Maintain a software bill of materials (SBOM) listing all open-source dependencies and their licences. Antigravity to provide this with each major release.

---

## 5. Domain Names

All domain names used by Hashlilly products must be:
- Registered in Hashlilly Private Limited's name (not the founder's personal name, not Antigravity's name)
- Renewed with auto-renewal enabled
- Registered for minimum 3 years

Current domains to verify:
- hashlilly.in
- soulamore.com
- thatsmissing.com
- boozedin.com

---

## 6. IP Audit

Conduct an IP audit annually:
- Verify all contractor agreements contain IP assignment clauses
- Verify domains are registered to Hashlilly
- Verify trademark applications/registrations are current
- Verify open-source SBOM is up to date
- Verify no unlicensed third-party assets (fonts, icons, photos, music) are used in products
