# BUG-010: Peer Profile 404 and Weird Header

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🟠 HIGH
- **Reporter:** Aditya (Via 260627 - Login loop and dashboard login loop.docx), Abhishek Singla (Via Abhishek Bugs.docx)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-06-27 (Abhishek: 2026-06-28)
- **Target Release / Feature:** Peer Dashboard / Peer Directory

---

## 🔍 Bug Description
Clicking on a peer profile link in the user dashboard or peer directory redirects the user to a 404 page, and the header layout/styling appears broken or misaligned.

### 💻 Environment Details
- **Environment:** localhost:3000 / Live Site
- **OS / Browser:** Windows / macOS (Reported by team)
- **User Account Type:** Authenticated User (Member)

---

## 🛠️ Steps to Reproduce
1. Log into the User Dashboard or navigate to the Peers directory.
2. Go to the Peer support section or list of peers.
3. Click on a peer profile link (e.g. View Profile button).
4. Observe the 404 error page and distorted header.

### 📈 Expected Behavior
Clicking on a peer profile routes correctly to the selected peer's profile page with a consistent, premium styled header.

### 📉 Actual Behavior
The page routes to a 404 page (attempting to load `auth/login.html` or another incorrect path) and shows a broken header layout.

---

## 📸 Screenshots & Logs
### Visual Evidence
- **Reported by Aditya:**
  ![image1.png](../01-inbox/ADITYA/media/image1.png)
- **Reported by Abhishek (Peers Directory and 404 Page):**
  ![image4.png](../01-inbox/ABHISHEK/extracted/media/image4.png)
  ![image1.png](../01-inbox/ABHISHEK/extracted/media/image1.png)

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** 
  1. The User Dashboard CTA was linked to a raw `../our-peers/profile.html` which fails with a blank page/profile error when accessed without an `id` query parameter.
  2. In `our-psychologists/psychologists.html`, the fallback profile link for practitioners incorrectly linked to `../our-peers/profile.html?id=` instead of the psychologist template profile page, leading to template misalignment.
- **Fix Implemented:** 
  1. Updated the User Dashboard "Talk to a Peer" CTA click handler to navigate to `../our-peers/index.html` (the peer listing directory) where users can properly select a peer.
  2. Updated the psychologist profile fallback link in `our-psychologists/psychologists.html` to correctly map to `profile.html?id=` in the same folder.
- **Files Modified:** 
  - `portal/user-dashboard.html`
  - `our-psychologists/psychologists.html`
- **Date Resolved:** 2026-06-28

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
