# BUG-029: Peer Directory Card UI Misalignment and Spacing Issues

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🟡 MEDIUM
- **Reporter:** Aditya (Via screenshot & audit)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-07-05
- **Target Release / Feature:** Peer Support / Peer Directory UI

---

## 🔍 Bug Description
In the Peers listing directory (`/our-peers/index.html`), the layout of peer cards displays alignment issues:
1. **Vertical Misalignment**: The "View Profile" action buttons are not aligned vertically across cards because of different tag wrapper heights (e.g., when tags wrap to two rows).
2. **Text Squishing**: The bottom language and volunteer status text are squished together without spacing (e.g., displaying as "HindiVolunteer" or "EnglishTop Rated").

### 💻 Environment Details
- **Environment:** Localhost / Live Site
- **OS / Browser:** Windows / Chrome
- **User Account Type:** All users

---

## 🛠️ Steps to Reproduce
1. Navigate to the Peers listing page: [our-peers/index.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/index.html)
2. Observe the cards grid.
3. Notice that "View Profile" buttons are at different heights depending on the card content.
4. Observe the lack of space between the language text and the volunteer status (e.g. `HindiVolunteer`).

### 📈 Expected Behavior
1. All cards should align their bottom action sections ("View Profile" and status details) to the bottom of the card container, ensuring a clean grid layout.
2. The language icon/text and the volunteer/top-rated text should be spaced apart on opposite sides of the card using `justify-content: space-between`.

### 📉 Actual Behavior
1. Varying tag rows push buttons down, creating an uneven grid layout.
2. Shrink-wrapped wrapper has no width, rendering the flex spacing rule ineffective and squishing text together.

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** 
  1. The `.peer-card` uses `flex-direction: column` and `align-items: center` to center items. However, the bottom section did not have a flex wrapper with `margin-top: auto` to absorb empty space and force bottom-alignment.
  2. The language and status container `div` used `display: flex; justify-content: space-between;` but lacked a `width: 100%` setting. Because of the parent `align-items: center`, the `div` shrink-wrapped to its content size, neutralizing `justify-content: space-between` and squishing the text.
- **Fix Implemented:** 
  1. Wrapped the bottom elements (language/price row, "View Profile" button, and "This is You" note) in a `div` styled with `margin-top: auto; width: 100%;` to align them perfectly across all cards in the grid.
  2. Added `width: 100%;` to the inner language/price flex row to resolve the shrink-wrapping alignment bug and restore the `space-between` layout.
- **Files Modified:** 
  - [our-peers/index.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/index.html)
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
