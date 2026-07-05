# BUG-023: Guest Booking Missing User and Peer Details in Firestore

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🔴 CRITICAL
- **Reporter:** Aditya (Developer Audit)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-06-28
- **Target Release / Feature:** Booking System / Notifications

---

## 🔍 Bug Description
When guest bookings are initialized, the client-side booking widget does not pass the guest's contact name (`userName`) or email (`userEmail`) to the document creation API. This prevents cloud email triggers from finding guest destination emails and leaves practitioners unaware of who booked their slots.

### 💻 Environment Details
- **Environment:** localhost:3000 / User Dashboard
- **OS / Browser:** Windows / Chrome
- **User Account Type:** Guest User / Anonymous

---

## 🛠️ Steps to Reproduce
1. Navigate to a peer/psychologist profile.
2. Fill out guest checkout details and select a slot.
3. Complete booking checkout.
4. Inspect the generated Firestore booking document.
5. Notice that `userName`, `userEmail`, and `peerName` are missing.

### 📈 Expected Behavior
The booking document records the guest's name, email, and practitioner name to support dashboard display and email delivery.

### 📉 Actual Behavior
These fields are left undefined, resulting in failed email logs and anonymous dashboard entries.

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** The client-side booking widget was not passing `userName`, `userEmail`, and `peerName` variables to the `createBookingRequest` function, leaving them undefined in the created Firestore booking document, which caused cloud triggers to fail email delivery and practitioners to see anonymous entries.
- **Fix Implemented:** Updated `booking-widget.js` to correctly extract guest input details (`guestName`, `guestEmail`) or authenticated user details and pass them to the `createBookingRequest()` function. Updated the database creation logic in `peer-booking-handler.js` to record `userName`, `userEmail`, and `peerName` in the Firestore booking document.
- **Files Modified:** 
  - [assets/js/booking-widget.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/booking-widget.js)
  - [assets/js/peer-booking-handler.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/peer-booking-handler.js)
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
