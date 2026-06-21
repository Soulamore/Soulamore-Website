# Website Legal & UX Compliance Requirements — Hashlilly Portfolio
**Version:** 1.0
**Prepared by:** Aditya / Hashlilly Private Limited
**Date:** June 2026
**For:** Antigravity (implementation) + Legal Counsel (review)
**Applies to:** soulamore.com · thatsmissing.com · boozedin.com · hashlilly.in

---

## How to Use This Document

This document defines every visible, functional, and copy-level requirement that must exist on the live websites to remain legally compliant and user-trustworthy. It is structured as a direct handoff to Antigravity — each section specifies what to build, where it goes, and what the words should say.

Items marked 🔴 are legal requirements — non-negotiable before launch.
Items marked 🟠 are strongly recommended — required within first month post-launch.
Items marked 🟢 are best practice — build when capacity allows.

---

## 1. FOOTER — Every Page, Every Product

The footer is a legal document surface. Every page of every product must render the following without requiring login, JavaScript, or any user interaction.

### 1a. Required Footer Links (All Four Products)

```
Privacy Policy  |  Terms of Service  |  Cookie Settings  |  Disclaimer  |  Contact Us
```

**For US traffic (California visitors):** 🔴
Add a separate, functional link:
```
Do Not Sell or Share My Personal Information
```
This must be a standalone page or modal — not just a section inside the Privacy Policy.

**For India (all products):** 🔴
Add a visible Grievance Officer line — required by IT Act 2000:
```
Grievance Officer: [Name] — grievance@[product].com
```
This is a named individual with a contact email, published on the website. Required by law for any platform with Indian users.

### 1b. Required Company Information (hashlilly.in footer + all product footers) 🔴

Required by the Companies Act 2013 for any Indian company operating online:
```
Hashlilly Private Limited
CIN: [Your CIN number]
Registered Address: [Full registered address]
© [Year] Hashlilly Private Limited. All rights reserved.
```

### 1c. Soulamore Footer — Additional Requirement 🔴
One-line disclaimer always visible in footer:
```
Soulamore is not a clinical service and does not provide medical advice.
If you are in crisis, call iCall: 9152987821  |  Crisis Help →
```
"Crisis Help" links to `/help` page (always accessible, no login required).

### 1d. That's Missing Footer — Additional Requirement 🟠
```
Content is for informational purposes only. Not investment or business advice.
```

### 1e. BoozeD In Footer — Additional Requirement 🟠
```
BoozeD In is an 18+ platform for drinks industry professionals.
```

---

## 2. COOKIE CONSENT BANNER

### 2a. Trigger Behaviour 🔴
- Fires on **first visit**, **before any non-essential script loads**
- GA4, analytics pixels, marketing pixels, support chat widgets — none load until consent is granted
- Banner persists until the user makes an active choice
- Cannot auto-dismiss on timer
- Cannot be dismissed by clicking outside the banner

### 2b. Required Elements 🔴

The banner must have **three equally prominent options**:

```
┌─────────────────────────────────────────────────────────────┐
│  We use cookies to understand how you use [Product] and     │
│  improve it. Choose what you're comfortable with.           │
│                                                             │
│  [Reject All]   [Manage Preferences]   [Accept All]         │
└─────────────────────────────────────────────────────────────┘
```

**Critical design rules:**
- "Reject All" and "Accept All" must be **equal visual weight** — same button size, same colour prominence
- "Reject All" must NOT be: grey text, a small link, hidden behind a secondary screen, or require more clicks than "Accept All"
- No pre-selected toggles in "Manage Preferences" — all optional categories OFF by default
- "Strictly Necessary" toggle must be greyed out and uneditable (always on)

### 2c. "Manage Preferences" Panel

```
Cookie Preferences

● Strictly Necessary        [Always On — cannot disable]
  Required for login and basic site function.

○ Functional               [OFF by default]
  Remembers your language and display preferences.

○ Analytics                [OFF by default]
  Helps us understand how the product is used (no personal content).

○ Marketing                [OFF by default]
  Personalised ads and cross-site tracking.

[Save Preferences]
```

### 2d. Cookie Settings — Persistent Footer Link 🔴
After the banner is dismissed, **Cookie Settings** must remain in the footer permanently. Users have the legal right to change their consent at any time. Clicking it reopens the preferences panel.

### 2e. What NOT to Do (Dark Patterns — Actively Enforced by EU DPAs)
```
❌ "Accept" button is green, "Reject" is grey faded text
❌ "Accept All" is a big button, reject requires three more clicks
❌ Pre-ticked analytics or marketing checkboxes
❌ Banner says "By continuing to use this site you accept cookies"
❌ X button in corner closes the banner without registering a choice
❌ "We value your privacy" heading (flagged as manipulative by ICO)
```

### 2f. Soulamore — No Analytics Cookies, Ever 🔴
The cookie banner on Soulamore must not offer an Analytics or Marketing category. There are none. The banner is simpler:
```
We use cookies to keep you logged in and remember your preferences.
These are essential for the platform to work.
[Got it]  [Cookie Details]
```

---

## 3. PRIVACY POLICY PAGE

**URL:** `/privacy` — accessible without login, without JavaScript dependency

### 3a. Page Structure 🔴

**Top of page — TL;DR Summary Box (plain callout design):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The short version

• We collect your email and usage data to run the service.
• We never sell your data to anyone.
• You can delete your account and all your data at any time.
• [Soulamore] Your journal entries are encrypted and never shared.
• Questions? privacy@[product].com — we respond within 30 days.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Immediately below TL;DR:**
```
Effective Date: [DATE]   |   Last Updated: [DATE]   |   Version: 1.0
```

**Then the full policy in plain sections.**

### 3b. Tone Rules — Privacy Policy Copy

Replace every instance of legal jargon with plain language:

| Do Not Write | Write Instead |
|---|---|
| "Personal data" | "your information" or "your data" |
| "Data controller" | "we" or "Hashlilly" |
| "Processing your personal data" | "using your information" |
| "Third-party data processors" | "the tools we use to run the product" |
| "Legitimate interests" | (do not use this phrase in user-facing copy) |
| "You have the right to erasure" | "You can delete your account and all your data" |
| "Consent may be withdrawn at any time" | "You can turn this off at any time in your account settings" |
| "We may share your data with our affiliated entities" | "We may share your data with other Hashlilly products you use" |

### 3c. Version Control Requirement 🟠
When the Privacy Policy is updated:
- Update the "Last Updated" date and version number
- Keep the previous version accessible at `/privacy/v1.0` (or similar)
- Notify users by email and in-app banner at least **14 days before** material changes take effect
- Log which version of the policy each user consented to (handled by consent record schema)

---

## 4. TERMS OF SERVICE PAGE

**URL:** `/terms` — accessible without login

### 4a. Soulamore — Medical Disclaimer at the Very Top 🔴

Before any legal agreement text, before Section 1, before everything:

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠  IMPORTANT                                               │
│                                                             │
│  Soulamore is a self-reflection tool — not a therapy        │
│  service or medical platform. It does not provide           │
│  clinical advice, diagnosis, or treatment.                  │
│                                                             │
│  If you are in crisis, please contact:                      │
│  iCall: 9152987821  |  Vandrevala: 1860-2662-345           │
│  Emergency: 112                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4b. General Tone Rules — ToS Copy
- Use "you" and "we" throughout — not third-person legal entity references
- Bold key restrictions so users skimming can find them:
  - **You may not scrape, resell, or extract data from the platform.**
  - **You must be 18 or older to create an account.**
- Avoid ALL CAPS clauses — these are considered aggressive and are increasingly unenforceable in India and EU
- Include a plain-language section summary at the start of each major section:

```
Example:
Section 5 — Your Content
Short version: You own what you create. We need permission to store and 
display it so the service works. We will never sell your content.
[Full legal text follows]
```

### 4c. Last Updated Date 🔴
Prominently at the top. When changed materially — notify users 14 days in advance.

---

## 5. REGISTRATION AND SIGN-UP FORM

### 5a. Required Form Fields 🔴

| Field | Type | Required? | Notes |
|---|---|---|---|
| Email | Input | Yes | Standard |
| Password | Input | Yes | Show strength indicator |
| Date of Birth | Date picker | Yes | Must be actual DOB — not age checkbox |
| ToS + Privacy Policy consent | Checkbox | Yes | Unchecked by default |
| Marketing emails opt-in | Checkbox | No | Unchecked by default, optional |

**Age gate logic on DOB field:**
```
Under 13    → Block: "You must be at least 13 to use [Product]. 
               You cannot create an account."

13–17       → Soulamore: trigger parental consent flow
              All others: block with "You must be 18+ to use [Product]."

18+         → Proceed normally
```

### 5b. Consent Checkboxes — Exact Copy 🔴

**Checkbox 1 (required):**
```
I have read and agree to the Terms of Service and Privacy Policy.
```
"Terms of Service" and "Privacy Policy" must be hyperlinks that open the respective pages.

**Checkbox 2 (optional):**
```
Keep me in the loop with product updates and news. (Optional)
```

**What NOT to write:**
```
❌ "I agree to receive marketing communications from Hashlilly and its partners"
❌ "Subscribe to our newsletter"
❌ One combined checkbox for both ToS and marketing
❌ Pre-checked boxes of any kind
```

### 5c. Password Field Requirements 🟠
- Minimum 8 characters
- Show a visual strength indicator (weak / fair / strong)
- "Show password" toggle
- On breach: prompt user if their password appears in known breach databases (use HaveIBeenPwned API — free)

### 5d. Trust Signals on Registration Form 🟢
Small copy below the email field:
```
🔒  We never share your email. No spam — unsubscribe anytime.
```
For Soulamore, below the form:
```
🔒  Your journal entries are encrypted and private. 
    We never share wellness data with anyone.
```

---

## 6. ACCOUNT SETTINGS — PRIVACY DASHBOARD

This entire section must be **functional**, not just listed. Each item below must be a working feature, not a "contact us to request" flow.

**URL:** `/account/privacy` or `/settings/data`

### 6a. Required Features 🔴

**Download My Data**
```
Label: "Download everything we have about you"
Description: "We'll prepare a file with all your account data, 
              activity history, and content. Ready within 30 days."
Button: [Request Data Export]
```
On click: triggers export job, sends email when ready with download link.
Format: JSON or CSV, user's choice.

**Delete My Account**
```
Label: "Delete your account permanently"
Description: "This will permanently delete your account and all 
              associated data. This cannot be undone."
Button: [Delete My Account]  ← destructive red styling
```
Confirmation screen:
```
"Are you sure? This will permanently delete:
 • Your profile and account information
 • [Soulamore] All journal entries and mood logs
 • Your activity history and preferences

 This cannot be reversed.

 [Cancel]  [Yes, permanently delete my account]"
```
Completion: email confirmation sent to user. Data deleted within 30 days (wellness data: immediately).

**Withdraw Consent (Soulamore only)** 🔴
```
Label: "Withdraw wellness data consent"
Description: "You can stop us from processing your journal entries 
              and mood data at any time. You can re-enable this later."
Toggle: [ON / OFF]
```
On toggle OFF: immediately stops wellness data processing. Prompt appears:
```
"Consent withdrawn. Your existing wellness data is still stored.
 Would you like to delete it now?
 [Delete my wellness data]  [Keep it for now]"
```

**Email Preferences**
```
Label: "Email preferences"
[Toggle] Product updates and news — ON/OFF
[Toggle] Tips and feature announcements — ON/OFF
Transactional emails (account security, billing) cannot be disabled.
```

**Consent History** 🟠
```
Label: "My consent history"
[Table showing: what was consented to, date, version of policy shown]
[Download consent history as CSV]
```

### 6b. One-Click Unsubscribe from Emails 🔴
Every marketing email must contain a footer unsubscribe link that:
- Works with one click — no login required
- Takes effect immediately (within minutes, not "up to 10 days")
- Does not unsubscribe from transactional emails (password reset, billing)
- Lands on a simple confirmation page: "You've been unsubscribed. [Manage all email preferences]"

---

## 7. SOULAMORE — SPECIFIC WEBSITE REQUIREMENTS

### 7a. Homepage — "Not a Medical Service" Callout 🔴
Must appear above the fold or immediately below the hero section. Not in fine print. Not in the footer only. Visible without scrolling on desktop and mobile:

```
✅ "Soulamore is a space for reflection, not a replacement for therapy.
    If you're going through something difficult, please reach out to a professional."

❌ "DISCLAIMER: This platform does not constitute medical advice."
```

### 7b. Onboarding — Wellness Data Consent Modal 🔴
Full-screen blocking modal before first access to any wellness feature (journal, mood tracker). Cannot be dismissed by tapping outside. Requires explicit button tap:

```
Title: "Before you begin"

Body:
"Soulamore stores your journal entries and mood data to power 
your self-reflection experience.

This is sensitive information. Here's our commitment to you:
• It's encrypted and only you can see it
• We never share it with advertisers or third parties
• You can delete it all at any time from your account settings

If you ever need support beyond self-reflection, please reach 
out to a professional. We have crisis resources here → [link]

[I understand — let's go]     [Learn more about privacy]"
```

### 7c. Crisis Resources Page — `/help` 🔴
- Static page — no login required
- Loads without JavaScript (fallback for crisis situations where JS may not load)
- Accessible from footer on every page and from main navigation inside the app
- Accessible from the onboarding modal
- Design: clean, no noise, immediate scannability

**Page content:**
```
Need Support?

If you're in crisis or need to talk to someone right now:

INDIA
iCall — 9152987821
Vandrevala Foundation (24/7) — 1860-2662-345
AASRA — 9820466627
Emergency — 112

INTERNATIONAL
Crisis Text Line (US) — Text HOME to 741741
988 Lifeline (US) — Call or text 988
Samaritans (UK) — 116 123
Lifeline (Australia) — 13 11 14

Find crisis support in your country → [iasp.info link]

Soulamore is not a crisis service. If you are in immediate 
danger, please call emergency services.
```

### 7d. In-Journal Interface — Persistent Subtle Note 🟠
Inside the journal entry and mood tracking interface, a small, non-intrusive persistent element:
```
🔒  Private and encrypted. Only you can see this.
```
And in the interface footer or sidebar:
```
Need support beyond reflection? → Crisis resources
```
This is not a warning. It is ambient reassurance and resource accessibility.

---

## 8. THAT'S MISSING — SPECIFIC REQUIREMENTS

### 8a. "Not Investment Advice" Notice 🟠
Appears on every page displaying market intelligence, opportunity scores, or startup data:
```
For informational and research purposes only. 
Not investment, financial, or business advice.
```
Placement: below each intelligence report header, and in footer.

### 8b. API Terms Page 🔴 (before any API key is issued)
**URL:** `/api-terms`
Must include at minimum:
- Rate limits and acceptable use
- Prohibition on reselling, redistributing, or scraping data
- Prohibition on building competing products with the data
- Key revocation policy
- Data attribution requirements

### 8c. Paywall / Free vs Paid Clarity 🟠
Be explicit about what is behind the paywall before the user hits it:
```
✅ "This report is available on the Pro plan. 
    [See what's included →]"

❌ Show a blurred report and a popup that appears only after they try to read it
```
Obscuring what's paid vs free and showing it only after engagement is a dark pattern that affects trust.

---

## 9. BOOZEDIN — SPECIFIC REQUIREMENTS

### 9a. Age Gate 🔴
Drinks industry platform — 18+ mandatory. DOB field on registration, same as other products. No exceptions.

### 9b. Alcohol Advertising Compliance Notice 🟠
On any page where brand accounts can post promotional content:
```
Alcohol marketing on BoozeD In is intended for adults only. 
Brand accounts are responsible for compliance with applicable 
advertising standards in their target markets.
```

### 9c. Profile Visibility Controls — Prominent Placement 🔴
Must be visible and accessible from account settings without needing documentation to find. Label clearly:
```
Who can see your profile:
○ Everyone (public)
● Members only
○ My connections only
○ Hidden from search
```
Default on registration: **Members only** — not public. User upgrades visibility by choice.

### 9d. "Open to Opportunities" Toggle 🟠
Separate, clearly labelled toggle in profile settings:
```
Open to new opportunities
[Toggle ON/OFF]
"Recruiters and brands can see you're open to work. 
 Your current employer will not be notified."
```
This mirrors LinkedIn's pattern — users understand it. The "employer will not be notified" copy is a trust signal that dramatically increases toggle adoption.

---

## 10. ERROR PAGES AND SYSTEM MESSAGES

### 10a. Error Message Rules 🔴
All production error responses to users must be:
- Generic — no stack traces, no file paths, no database error text, no user IDs
- Helpful — tell the user what to do next
- Branded — matches the product's visual design

```
✅ "Something went wrong. Please try again. 
    If the problem continues, contact support@[product].com"

❌ "PostgreSQL error: duplicate key value violates unique constraint 
    'users_email_key' on column 'email' at index 2"

❌ "Error 500 — Internal Server Error" (raw, unstyled)
```

### 10b. 403 / Unauthorised Page 🔴
```
✅ "You don't have access to this page."

❌ "403 Forbidden — Access denied to /api/users/42/journal/entries"
   (leaks URL structure and that user ID 42 exists)
```

### 10c. 404 Page 🟠
Custom 404 that matches brand design. Include:
- Navigation links back to main sections
- Search or home button
- For Soulamore: subtle note that crisis resources are always at `/help`

### 10d. Maintenance / Downtime Page 🟠
Maintain a live status page at `status.[product].com`. During downtime, show:
```
[Product] is currently down for maintenance.
We expect to be back by [time].
Check status.thatsmissing.com for updates.
```
Never show a raw server error to users during downtime.

---

## 11. EMAIL COMPLIANCE — EVERY MARKETING EMAIL

### 11a. Required Footer in Every Marketing Email 🔴

```
You're receiving this because you signed up for [Product] updates.

Unsubscribe instantly  |  Manage preferences

Hashlilly Private Limited
[Registered Address]
India
```

- "Unsubscribe instantly" must be a working one-click link — no login required
- Physical address is required by CAN-SPAM (US), CASL (Canada), and equivalents
- One-click = one click. Not "click here, then confirm on the next page"

### 11b. Subject Line Rules 🔴
```
❌ Misleading subject lines ("Re: Your account" when it's marketing)
❌ False urgency ("Your account will be deleted")
❌ Deceptive sender names ("No-reply security@[phishing-looking-domain]")

✅ Honest subject that reflects email content
✅ Sender name matches the product: "Soulamore" or "That's Missing"
✅ Reply-to is a monitored address — not a dead no-reply
```

### 11c. Transactional vs Marketing Distinction 🔴
Transactional emails (password reset, billing, account security, data export ready) can always be sent — they are not marketing. Do not mix marketing content into transactional emails. A billing confirmation is not an opportunity to upsell.

---

## 12. GENERAL TONE PRINCIPLES — ALL PRODUCTS

### 12a. Replace Legalese with Plain Language

| Legal Copy | User-Facing Copy |
|---|---|
| "We process personal data" | "We use your information" |
| "Data subject rights" | "What you can do with your data" |
| "Third-party processors" | "The tools we use to run [Product]" |
| "Withdraw consent" | "Turn this off" |
| "Right to erasure" | "Delete your account and data" |
| "We may collect information automatically" | "We automatically collect some technical info like your browser type and IP address" |
| "Pursuant to our Privacy Policy" | "As explained in our Privacy Policy" |
| "We may share aggregated non-personally identifiable data" | "We share anonymised usage statistics — these can't be traced back to you" |

### 12b. Trust Signals That Cost Zero Development Time 🟢

On sign-up forms — below the email field:
```
🔒  No spam. Unsubscribe anytime.
```

On Soulamore journal / mood input:
```
🔒  Only you can see this.
```

On payment forms:
```
🔒  Payments processed securely by [Stripe/Razorpay]. 
    We never store your card details.
```

On data export page:
```
🔒  Your export is encrypted and the download link expires in 24 hours.
```

These micro-copy trust signals reduce drop-off on sensitive forms and are a direct signal to regulators that you are operating in good faith.

### 12c. Notifications and Alerts — Tone
```
✅ "We updated our Privacy Policy. Here's what changed: [summary]
    [View full policy]  [OK, got it]"

❌ "NOTICE: Our Privacy Policy has been updated. Continued use of 
    the platform constitutes acceptance of the updated terms."
    (This is a legal trap disguised as a notification — users hate it 
     and EU courts increasingly disallow it as valid consent)
```

---

## 13. IMPLEMENTATION CHECKLIST FOR ANTIGRAVITY

Use this as a launch QA checklist. Every item must be ticked before any product goes live.

### Legal Presence
- [ ] Footer contains: Privacy Policy, ToS, Cookie Settings, Disclaimer, Contact, Grievance Officer
- [ ] Footer contains: Hashlilly Private Limited, CIN, Registered Address
- [ ] hashlilly.in footer repeated on all four product footers
- [ ] `/privacy` loads without login and without JavaScript dependency
- [ ] `/terms` loads without login and without JavaScript dependency
- [ ] `/help` (Soulamore) loads without login, loads without JavaScript
- [ ] "Do Not Sell or Share" link in footer (functional page or modal)

### Cookie Consent
- [ ] CMP fires before GA4 or any non-essential script loads
- [ ] "Reject All" is equal visual weight to "Accept All"
- [ ] No pre-ticked optional categories
- [ ] "Cookie Settings" link in footer opens preferences panel
- [ ] Consent choice is stored and respected on next visit
- [ ] Soulamore: zero analytics/marketing cookies — banner is Strictly Necessary only

### Registration
- [ ] Date of birth field present (not age checkbox)
- [ ] Under-13 hard block implemented
- [ ] ToS + Privacy checkbox: unchecked by default, links are hyperlinked
- [ ] Marketing opt-in checkbox: separate, unchecked by default, labelled optional
- [ ] No pre-checked boxes anywhere on any form

### Account / Privacy Dashboard
- [ ] "Download My Data" button — functional, delivers export within 30 days
- [ ] "Delete My Account" — functional, confirmation screen, data deleted within 30 days
- [ ] Soulamore: "Withdraw wellness data consent" toggle — functional
- [ ] Email preferences page — functional unsubscribe per category
- [ ] One-click email unsubscribe in all marketing emails — no login required

### Soulamore
- [ ] "Not a medical service" callout above the fold on homepage
- [ ] Wellness data consent modal — blocking, requires explicit tap
- [ ] Crisis resources page `/help` — live, no login, no JS dependency
- [ ] In-journal "only you can see this" micro-copy present
- [ ] Crisis resources link in main navigation inside app

### Error Handling
- [ ] All 500 errors return generic user-friendly message — no stack traces
- [ ] All 403 errors return generic message — no URL structure leaked
- [ ] Custom 404 page — branded, with navigation
- [ ] No raw server error pages visible in production

### Emails
- [ ] All marketing emails contain one-click unsubscribe link
- [ ] All marketing emails contain Hashlilly registered address
- [ ] Transactional emails do not contain marketing content
- [ ] Sender name matches product name
- [ ] Reply-to is a monitored inbox

---

*This document is a living specification. Update it whenever a new feature, integration, or legal requirement changes what must appear on the website.*
*Version 1.0 — June 2026 — Hashlilly Private Limited*
