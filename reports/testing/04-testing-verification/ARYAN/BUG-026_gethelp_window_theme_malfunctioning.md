# BUG-026: GetHelp Window Theme Malfunctioning

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🟡 MEDIUM
- **Reporter:** Aryan Harsh (Via Bug Report)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-07-02
- **Target Release / Feature:** Crisis Support / GetHelp

---

## 🔍 Bug Description
The GetHelp/Crisis Support window (`get-help-now.html`) utilizes a customized `Midnight Vegito (Safety Edition)` theme that is functionally mismatched with the standard, dark-themed `Midnight Vegito` style used globally across the website. The page overrides `--deep-space` to a very bright light-peach color (`#FFF5F0`) and uses dark text, but does not correctly calibrate card components, glassmorphism borders, and hover states. This leads to low contrast and visibility issues (e.g., `.helpline-card` hover states blending into the light background). Additionally, `assets/js/components.js` is imported twice, causing redundant scripts to run.

### 💻 Environment Details
- **Environment:** Live / Localhost (`/get-help-now.html`)
- **OS / Browser:** All OS / Browsers (Windows, macOS, Chrome, Safari, etc.)
- **User Account Type:** Authenticated & Anonymous Users

---

## 🛠️ Steps to Reproduce
1. Navigate to `/get-help-now.html` or click the "Get Help" button on the launch preview popup.
2. Observe the page background is bright light-peach instead of the dark `Midnight Vegito` theme (`#0f172a`).
3. Hover over any of the confidential helpline cards (e.g., AASRA, Kiran, iCall).
4. Notice that on hover, the card's background transitions to `rgba(255, 255, 255, 0.9)`, which makes it almost indistinguishable from the page's light background, causing contrast/readability issues.
5. Inspect the HTML document source and see that `assets/js/components.js` is imported at line 729 and again at line 886.

### 📈 Expected Behavior
The theme variables and design tokens for `get-help-now.html` should be dark-themed, aligned with the rest of the global `Midnight Vegito` style (using a dark background like `#0f172a` and light text), or if a light comfort tone is intended, the components and hover states should be styled to maintain high accessibility contrast. Redundant JS loads should be eliminated.

### 📉 Actual Behavior
The background is a very bright light-peach color, hover states on cards lack sufficient contrast against the background, and duplicate component scripts are loaded.

---

## 📸 Screenshots & Logs
### Visual Evidence
> *No screenshots attached. Refer to `/get-help-now.html` to inspect theme styling directly.*

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** The style block in `get-help-now.html` overrode `--deep-space` to a bright light-peach (#FFF5F0) color instead of utilizing the dark-theme values associated with the `Midnight Vegito` name. This caused a heavy contrast mismatch with standard components, header overlays, and card hover states.
- **Fix Implemented:** Corrected CSS variables inside the style tag of `get-help-now.html` to align with standard Midnight Vegito dark theme styles (using `#0f172a` as `--deep-space` and `#f1f5f9` as main text). Updated `.emergency-card` text color to `#fee2e2` for dark background readability, changed helpline and step card hover background styles to transparent white (`rgba(255, 255, 255, 0.1)`), adjusted custom breathing circle background to `rgba(15, 23, 42, 0.6)`, and removed the duplicate `components.js` import at the bottom of the document.
- **Files Modified:** 
  - `get-help-now.html`
- **Date Resolved:** 2026-07-02

---

## 🧪 Verification Log (Completed by Tester)
*Both the developer and a secondary tester must independently verify this resolution.*

### Developer Verification
- **Verified By:** Aditya (Developer)
- **Verification Date:** 2026-07-02
- **Test Result:** `✅ PASS`

### Independent Tester Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** `⬜ PENDING`
