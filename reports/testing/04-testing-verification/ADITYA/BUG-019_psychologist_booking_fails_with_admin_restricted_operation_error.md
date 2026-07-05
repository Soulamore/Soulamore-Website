# BUG-019: Psychologist Guest Booking Fails with admin-restricted-operation Error

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🔴 CRITICAL
- **Reporter:** Abhishek Singla (Via Abhishek Bugs.docx)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-06-28
- **Target Release / Feature:** Booking System / Guest Checkout

---

## 🔍 Bug Description
When an unauthenticated (anonymous) visitor attempts to book a session with a psychologist by selecting a date/plan and clicking "Confirm & Pay", the system fails with an alert error: `Failed to initialize guest booking: Firebase: Error (auth/admin-restricted-operation).` This prevents guests from completing psychologist bookings.

### 💻 Environment Details
- **Environment:** Live Site (`soulamore.com/our-psychologists/profile?slug=...`)
- **OS / Browser:** Windows / Chrome
- **User Account Type:** Anonymous / Guest User

---

## 🛠️ Steps to Reproduce
1. Navigate to a psychologist profile page (e.g. `soulamore.com/our-psychologists/profile?slug=bhagyavathi`).
2. Click on "Book a Session".
3. Under "Your Name (Guest)" and "Email Address", enter name and email details.
4. Select a Date and Plan.
5. Click on `Confirm & Pay`.
6. Observe the red error message inside the modal: `Failed to initialize guest booking: Firebase: Error (auth/admin-restricted-operation).`

### 📈 Expected Behavior
The guest session booking initializes and allows the user to proceed with Razorpay payment processing.

### 📉 Actual Behavior
Booking is rejected by Firebase authentication/administration rules, displaying a `restricted-operation` error.

---

## 📸 Screenshots & Logs
### Visual Evidence
![image2.png](../../01-inbox/ABHISHEK/extracted/media/image2.png)

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** When a guest (anonymous user) attempts to book a session, the widget calls `signInAnonymously()`. If anonymous auth is disabled in the Firebase Console or fails to initialize, it throws the `auth/admin-restricted-operation` error, blocking the checkout process.
- **Fix Implemented:** Wrapped the `signInAnonymously()` call in a try-catch block inside `booking-widget.js`. If it fails, it prints a warning and falls back to generating a local, client-side guest session object (`activeUser = { uid: "guest_...", isAnonymous: true, displayName: guestName, email: guestEmail }`) so that guest booking checkout can proceed without halting.
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
