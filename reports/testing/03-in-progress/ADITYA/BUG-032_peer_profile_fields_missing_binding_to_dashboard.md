# BUG-032: Peer Profile Fields Missing Binding to Peer Dashboard Form

---

## 📋 Ticket Metadata
- **Status:** `🔄 IN_PROGRESS`
- **Severity:** 🟠 HIGH
- **Reporter:** Aditya (Developer Audit)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-07-05
- **Target Release / Feature:** Peer Portal / Profile Editing Linkage

---

## 🔍 Bug Description
Peers cannot edit or save certain details on their public profile page from the peer dashboard:
1. **Languages**: The languages text input is missing an `id` attribute, preventing it from loading or saving correct data.
2. **"My Approach" Sections**: Textareas for *"This space may feel right if..."* and *"What our conversation looks like"* lack `id` attributes, meaning changes are never saved to Firestore.
3. **Boundaries Section**: The boundaries content displayed on the profile page is completely missing from the dashboard form, so it cannot be customized.

### 💻 Environment Details
- **Environment:** Localhost / Live Site
- **OS / Browser:** All
- **User Account Type:** Peer Supporters

---

## 🛠️ Steps to Reproduce
1. Log in to the peer portal: `portal/peer-dashboard.html`
2. Navigate to the **My Profile** tab.
3. Change the details under Languages, Approach, and Conversation Style, then click **Save Changes**.
4. Reload the page or navigate to the public profile page.
5. Notice that the languages default back, and the changes to match/conversation style are not saved in Firestore. Notice also that the "Boundaries" section cannot be edited.

### 📈 Expected Behavior
1. All public profile page fields (Name, Quote, Bio, Tags, Languages, Approach, Conversation, and Boundaries) can be loaded and edited from the peer dashboard.
2. Saving edits updates the corresponding Firestore document fields in `/professionals/{uid}`.

### 📉 Actual Behavior
1. Form fields lack identifier bindings (`id` attributes).
2. The boundaries input is completely absent from the form.
3. The dashboard script falls back to writing partial data and ignores un-bound fields.

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** Incomplete HTML form attributes and missing input components in the profile configuration dashboard layout, along with missing Firestore mapping statements.
- **Fix Implemented:** *(In progress)*
- **Files Modified:** 
  - [portal/peer-dashboard.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/peer-dashboard.html)
- **Date Resolved:** 

---

## 🧪 Verification Log (Completed by Tester)
*Both the developer and a secondary tester must independently verify this resolution.*

### Developer Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** `⬜ PENDING`

### Independent Tester Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** `⬜ PENDING`
