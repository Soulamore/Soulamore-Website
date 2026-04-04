# Deep Audit: Professional Dashboard Rating System
**Date:** March 25, 2026
**Auditor:** Antigravity (Advanced Agentic Specialist)
**Objective:** Resolve "random numbers" and "zero rating" artifacts in practitioner dashboards.

---

## 🧭 Deep Audit Findings

We conducted a deep trace from Firestore data sources through the `peer-booking-handler.js` logic to the dashboard frontends.

### 1. The "Zero Rating" Issue
**Root Cause:** Hardcoded HTML placeholders combined with missing JavaScript data-binding.

| Page | Element | Status | Technical Detail |
| :--- | :--- | :--- | :--- |
| `peer-dashboard.html` | `#peer-rating` | ❌ Broken | Hardcoded as `0`. No JS function targets this ID to inject actual `user.rating`. |
| `peer-dashboard.html` | "0 ratings" text | ❌ Static | Hardcoded text in HTML. Not connected to a `ratingCount` field. |
| `psych-dashboard.html` | Overview Stats | ❌ Missing | Rating is not displayed in the primary stats rail at all. |

### 2. The "Random Numbers" Issue
**Root Cause:** Floating-point math in commission calculations and inconsistent output formatting.

*   **Logic Bug:** In `assets/js/peer-booking-handler.js`, calculations like `totalAmount * commissionRate` (e.g., `500 * 0.2`) often result in precision artifacts (e.g., `800.0000000000001`).
*   **Formatting Gap:** While the transaction table uses `.toFixed(2)`, the **Wallet Balance** and **Gross Totals** in various dashboard views are missing rounding logic, leading to "random-looking" long decimals.

### 3. Testimonial Integrity
**Root Cause:** Visual deceptive hardcoding.

*   **Findings:** In `peer-dashboard.html`, the stars in the `testimonial-card` (Wall of Love) are **hardcoded to 5 stars** in the HTML template. Even if a user review had a lower rating, the UI would still render 5 stars for every card.

### 4. Admin Visibility Gap
**Root Cause:** Missing metadata in management views.

*   **Findings:** The `loadAllUsers` function in `admin-dashboard.html` fetches the full user record but **completely ignores the `rating` and `ratingCount` fields** when rendering the table. Admins currently have zero visibility into practitioner performance from the dashboard.

---

## 🛠️ Recommended Fixes (Additive Approach)

> [!IMPORTANT]
> All fixes MUST follow the "Additive" rule: do not delete existing logic unless it is explicitly broken; instead, add the missing data-binding layers.

### **Phase 1: Dynamic Data Binding (Frontend)**
- [ ] **[JS]** Update `initDashboard` in `peer-dashboard.html` and `psych-dashboard.html` to fetch `user.rating` and `user.ratingCount` using `auth.onAuthStateChanged`.
- [ ] **[DOM]** Target `id="peer-rating"` and update text content. Update the "X ratings" sub-label.
- [ ] **[UI]** Add a rating display card to the `psych-dashboard.html` overview stats to maintain feature parity with the peer dashboard.

### **Phase 2: Mathematical Precision (Backend JS)**
- [ ] **[Logic]** Update `peer-booking-handler.js` to wrap all commission and share calculations in `Math.round(x * 100) / 100` or `.toFixed(2)` before saving to Firestore or rendering.
- [ ] **[UI]** Audit all "Total Earnings" and "Wallet" labels to ensure they use a consistent currency formatter.

### **Phase 3: Testimonial & Admin Integration**
- [ ] **[DOM]** Refactor the testimonial-card generator in `profile-catalog.js` (or dashboard scripts) to render stars using a loop based on the `rating` numeric value.
- [ ] **[Admin]** Modify `renderUsersTable` in `admin-dashboard.html` to include a new column for "Rating" (e.g., `4.5★ (12)`).

---

## 🚀 Handoff Notes for Qwen
- **Source of Truth:** Firestore `users` and `professionals` collections.
- **Key Logic File:** `assets/js/peer-booking-handler.js`.
- **Primary UI Targets:** `#peer-rating`, `.stat-card-value`.
- **Guideline:** Preserve Teal/Peach dominance. Use Slate labels for metadata.
