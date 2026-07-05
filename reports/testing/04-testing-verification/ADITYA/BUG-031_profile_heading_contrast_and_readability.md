# BUG-031: Peer Profile Card Headings Have Low Contrast (Invisible Text)

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🔴 CRITICAL
- **Reporter:** Aditya (Via screenshot & audit)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-07-05
- **Target Release / Feature:** Peer Support / Profile UI Contrast

---

## 🔍 Bug Description
On the Peer Profile detail pages (`/our-peers/profile.html?id=...`), the headings inside the white cards (such as "A little about me" and "This space may feel right if...") are virtually invisible. They render as white/very light gray text on a white card background, making them unreadable.

### 💻 Environment Details
- **Environment:** Localhost / Live Site
- **OS / Browser:** Windows / Chrome / Edge
- **User Account Type:** All Users

---

## 🛠️ Steps to Reproduce
1. Open any peer profile page (e.g. `our-peers/profile.html?id=1`).
2. Observe the content cards.
3. Notice that the section headings ("A little about me", "This space may feel right if...") are white-on-white and invisible unless highlighted.

### 📈 Expected Behavior
The headings should display clearly in the page's theme accent color (sage green, peach, or amber) with high contrast against the white background.

### 📉 Actual Behavior
The headings are transparent/white and bleed into the white background.

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** 
  The `.section-title` class had an inheritance collision. [global.css](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/css/global.css) defines `.section-title` with a white-to-gray linear gradient background and sets `-webkit-text-fill-color: transparent;` for dark-mode pages. When [our-peers/profile.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/profile.html) loads `global.css`, this text-fill rule overrides the `color: var(--accent-color)` property, making the text transparent and showing the white-gray background instead.
- **Fix Implemented:** 
  Added reset override rules in the local `<style>` block of [our-peers/profile.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/profile.html):
  ```css
  background: none !important;
  -webkit-text-fill-color: var(--accent-color) !important;
  ```
  This overrides the transparent fill and restores the correct themed contrast color.
- **Files Modified:** 
  - [our-peers/profile.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/profile.html)
- **Date Resolved:** 2026-07-05

---

## 🧪 Verification Log (Completed by Tester)
*Both the developer and a secondary tester must independently verify this resolution.*

### Developer Verification
- **Verified By:** Aditya (Developer)
- **Verification Date:** 2026-07-05
- **Test Result:** `✅ PASS`

### Independent Tester Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** `⬜ PENDING`
