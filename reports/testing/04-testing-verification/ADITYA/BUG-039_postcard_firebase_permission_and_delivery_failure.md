# BUG-039: Soulamore Away Postcard Firebase Permission Error and Email Delivery Failure

---

## 📋 Ticket Metadata
- **Status:** `⬜ BACKLOG`
- **Severity:** `🟠 HIGH`
- **Reporter:** Aditya (via 260706 - Calender time slots.docx)
- **Assignee:** Unassigned
- **Date Reported:** 2026-07-07
- **Target Release / Feature:** Soulamore Away Postcard / Email Service

---

## 🔍 Bug Description
In the Soulamore Away space (`/spaces/soulamore-away/index.html`), sending a digital postcard displays a "Sealed & Sent" success animation on the frontend. However, the postcard is actually blocked by a Firestore permission-denied error in the background and is not written to the database. As a result, the email is not received by the recipient.

### 💻 Environment Details
- **Environment:** localhost:3000 / Live Site
- **OS / Browser:** All
- **User Account Type:** Anonymous Visitor / Client

---

## 🛠️ Steps to Reproduce
1. Navigate to `/spaces/soulamore-away/index.html`.
2. Write a message on the postcard, select a mood, enter a friend's email address, and click "Send Postcard".
3. Check the browser console.

### 📈 Expected Behavior
The postcard document should be saved to the `postcards` Firestore collection, and a transactional trigger should write to the `mail` collection to send an email template via ZeptoMail/Brevo, without permission errors.

### 📉 Actual Behavior
The frontend shows a success animation, but a permission-denied console warning is logged, and neither the postcard doc nor the email is written to Firebase.

---

## 📸 Screenshots & Logs
### Visual Evidence
- Referenced in raw report: `260706 - Calender time slots.docx` (image 9 text).

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** 
- **Fix Implemented:** 
- **Files Modified:** 
- **Date Resolved:** 

---

## 🧪 Verification Log (Completed by Tester)
*Both the developer and a secondary tester must independently verify this resolution.*

### Developer Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** 

### Independent Tester Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** 
