# BUG-027: Peer Profile Page Returns 404 Error when Selecting Profile

---

## 📋 Ticket Metadata
- **Status:** `⏳ PENDING_VERIFICATION`
- **Severity:** 🔴 CRITICAL
- **Reporter:** Abhishek Singla (Via Abhishek Bugs.docx)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-06-28
- **Target Release / Feature:** Peer Support / Peer Directory & Profiles

---

## 🔍 Bug Description
When navigating the Peers Directory (`/our-peers/index.html`) and clicking "View Profile" on any peer card, the application redirects the user to a 404 Not Found error page. This prevents users from viewing peer details or booking peer chat/call sessions.

### 💻 Environment Details
- **Environment:** Live Site (`https://soulamore.com/our-peers/`) / Localhost
- **OS / Browser:** Windows / Chrome
- **User Account Type:** Anonymous / Authenticated User

---

## 🛠️ Steps to Reproduce
1. Navigate to the Peers listing page: [our-peers/index.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/index.html)
2. Locate any peer profile card (e.g., Aditya, Zoya, Sonika, Rohan).
3. Click the `View Profile` button.
4. Observe that the browser attempts to navigate to the profile link (e.g. `profile.html?id=1` or `profile.html?id=20`).
5. Observe the redirect to the 404 Not Found page.

### 📈 Expected Behavior
Clicking "View Profile" should correctly open the peer profile detail page (`/our-peers/profile.html?id=[ID]` or `/our-peers/profile?id=[ID]`) and successfully render their bio, availability, and booking options.

### 📉 Actual Behavior
The application fails to resolve the path and redirects to the 404 Not Found page, displaying "You haven't lost your way." error.

---

## 📸 Screenshots & Logs
### Visual Evidence
#### Abhishek's Report Screenshots:
![Peers Directory](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/testing/01-inbox/ABHISHEK/extracted/media/image4.png)
![404 Error on View Profile](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/testing/01-inbox/ABHISHEK/extracted/media/image1.png)

#### Aditya's Report Screenshots (2026-07-04):
![Aditya's Peers Directory](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/testing/01-inbox/ADITYA/media/image1.png)
![Aditya's 404 Page](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/testing/01-inbox/ADITYA/media/image2.png)

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** 
  1. Under Firebase's `"cleanUrls": true` setting, path directory paths are served without trailing slashes. Thus, visiting `/our-peers/index.html` resolves the browser path to `/our-peers`.
  2. Because the URL path does not contain a trailing slash, relative links (such as `profile.html?id=...` or `palak-shori.html`) are resolved by the browser relative to the root `/` directory (e.g., `/profile.html?id=...`), loading the wrong root-level member profile page or causing a 404.
  3. Falling back to offline/demo data in `our-peers/profile.html` lacked local data mappings for Sonika (`id=20`), Rohan (`id=30`), Lakshit (`id=lakshit`), and Aarti (`id=aarti`), and did not check for string-based IDs.
  4. **404 Page Header Question:** The header in the 404 page is different from the standard website header (Home, Campus, Peers, Reset text links vs the full responsive site dropdowns) because the root `404.html` does not load `components.js` to dynamically inject the standard header. This is a deliberate fallback choice to avoid broken relative paths for script/CSS resources when errors are triggered on deeply nested directories (e.g., `/our-peers/profile.html?id=...`), ensuring that a clean, styled page with absolute navigation links is always rendered.
- **Fix Implemented:** 
  1. Converted relative profile page URLs in `our-peers/index.html` and `our-psychologists/psychologists.html` to root-relative paths (`/our-peers/profile.html?id=...` and `/our-psychologists/...`).
  2. Prepend leading slashes to homepage links in the root `index.html`.
  3. Added full fallback demo data for Sonika, Rohan, Lakshit, and Aarti in `our-peers/profile.html` and updated the conditional checks to support string-based identifiers.
- **Files Modified:** 
  - [index.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/index.html)
  - [our-peers/index.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/index.html)
  - [our-peers/profile.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-peers/profile.html)
  - [our-psychologists/psychologists.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/our-psychologists/psychologists.html)
- **Date Resolved:** 2026-07-04

---

## 🧪 Verification Log (Completed by Tester)
*Both the developer and a secondary tester must independently verify this resolution.*

### Developer Verification
- **Verified By:** Aditya (Developer)
- **Verification Date:** 2026-07-04
- **Test Result:** `✅ PASS`

### Independent Tester Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** `⬜ PENDING`
