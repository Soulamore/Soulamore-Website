# BUG-024: Booking Checkout Crashes When Anonymous Auth is Disabled

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🔴 CRITICAL
- **Reporter:** Aditya (Developer Audit)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-06-28
- **Target Release / Feature:** Booking System / Authentication

---

## 🔍 Bug Description
If Anonymous Authentication is turned off in the remote Firebase Console, calling `signInAnonymously()` during guest checkout throws `auth/admin-restricted-operation`. This completely blocks booking initialization.

### 💻 Environment Details
- **Environment:** Live / Localhost
- **OS / Browser:** Windows / Chrome
- **User Account Type:** Anonymous Guest

---

## 🛠️ Steps to Reproduce
1. Disable anonymous auth in Firebase Console.
2. Attempt guest booking checkout.
3. Click "Confirm & Pay".
4. Checkout fails immediately with the Firebase Auth restricted operation warning.

### 📈 Expected Behavior
The checkout continues to Razorpay checkout and records local bookings when Firestore writes fail.

### 📉 Actual Behavior
Execution halts, blocking Razorpay checkout initialization.

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** Calling `signInAnonymously()` throws `auth/admin-restricted-operation` when the anonymous provider is disabled in Firebase console, causing a crash that halts Razorpay order creation.
- **Fix Implemented:** Implemented try-catch fallback in `booking-widget.js` to initialize local-only guest session memory if remote Firebase auth is unavailable, allowing checkout flow to continue.
- **Files Modified:** 
  - [assets/js/booking-widget.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/booking-widget.js)
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
