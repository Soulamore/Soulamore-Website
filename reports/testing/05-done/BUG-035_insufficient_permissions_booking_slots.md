# BUG-035: Insufficient Permissions when choosing Peer/Psychologist Booking Slots

---

## 📋 Ticket Metadata
- **Status:** `✅ DONE`
- **Severity:** `🔴 CRITICAL`
- **Reporter:** Aditya (via 260706 - Calender time slots.docx)
- **Assignee:** Antigravity
- **Date Reported:** 2026-07-07
- **Target Release / Feature:** Booking Widget / Availability Slot Booking

---

## 🔍 Bug Description
When a user (guest or standard client) loads the booking widget on a peer's or psychologist's profile and selects a date, they encounter a "Missing or insufficient permissions" error in the browser console. As a result, the booking slots fail to load or show as unavailable, preventing any successful session scheduling.

### 💻 Environment Details
- **Environment:** localhost:3000 / Public Profiles
- **OS / Browser:** All
- **User Account Type:** Guest (Anonymous) / Standard Client

---

## 🛠️ Steps to Reproduce
1. Navigate to a Peer or Psychologist public profile page (e.g., `/our-peers/profile.html?id=...` or `/our-psychologists/profile.html?id=...`).
2. Scroll to the "Book a Session" widget.
3. Select a date.
4. Check the browser console.

### 📈 Expected Behavior
Available time slots should load successfully based on the practitioner's configured availability and existing confirmed/pending bookings, without console security errors.

### 📉 Actual Behavior
Console outputs: `FirebaseError: Missing or insufficient permissions.`
No available slots are displayed, or the widget falls back to empty slots because `checkSlotAvailability` catches the Firestore permission error and returns `false`.

---

## 📸 Screenshots & Logs
### Visual Evidence
- Referenced in raw report: `260706 - Calender time slots.docx` (images 1 & 2).

### Console / Server Logs
```text
Error checking slot availability: FirebaseError: Missing or insufficient permissions.
```

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** 
  1. The browser date input formatting returned localized formats (like `/` slashes) causing `Invalid Date` parsing on standard dash-separated string splits.
  2. App Check returned `400 Bad Request` during local testing on local network IP addresses or custom local domains because the debug token was restricted to exact `localhost` and `127.0.0.1` strings.
  3. Anonymous Sign-in was disabled in the Firebase Console, preventing authenticated anonymous guest booking registration.
- **Fix Implemented:** 
  1. Implemented robust date parsing logic in the booking widget supporting both YYYY-MM-DD and local formats.
  2. Expanded `firebase-config.js` to automatically detect local IP subnets (`192.168.x.x`, `10.x.x.x`, `172.x.x.x`, and `.local`) to enable developer debug tokens locally.
  3. Created an automatic user warning advising to enable Anonymous Authentication under Firebase settings, which was subsequently resolved and toggled on by the administrator.
- **Files Modified:** [booking-widget.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/booking-widget.js), [firebase-config.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/firebase-config.js)
- **Date Resolved:** 2026-07-07

---

## 🧪 Verification Log (Completed by Tester)
*Both the developer and a secondary tester must independently verify this resolution.*

### Developer Verification
- **Verified By:** Antigravity
- **Verification Date:** 2026-07-07
- **Test Result:** `✅ PASS`

### Independent Tester Verification
- **Verified By:** Aditya (User)
- **Verification Date:** 2026-07-07
- **Test Result:** `✅ PASS` (Anonymous Sign-in enabled and verified working)
