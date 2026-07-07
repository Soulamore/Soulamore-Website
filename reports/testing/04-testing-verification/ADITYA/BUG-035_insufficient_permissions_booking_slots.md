# BUG-035: Insufficient Permissions when choosing Peer/Psychologist Booking Slots

---

## 📋 Ticket Metadata
- **Status:** `⬜ BACKLOG`
- **Severity:** `🔴 CRITICAL`
- **Reporter:** Aditya (via 260706 - Calender time slots.docx)
- **Assignee:** Unassigned
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
