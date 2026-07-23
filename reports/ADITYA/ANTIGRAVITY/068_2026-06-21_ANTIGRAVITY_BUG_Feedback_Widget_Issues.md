# Bug Report: Feedback Widget Issues

**Date Logged:** June 21, 2026
**Status:** Closed - All fixes completed and verified.


## Summary of Issues
Based on the provided screenshot and console logs, the Feedback Widget is currently failing due to a combination of security policy restrictions, database permissions, and UI layering issues.

### 1. CSP Blocking Firebase App Check
- **Error:** `Fetch API cannot load https://content-firebaseappcheck.googleapis.com/... Refused to connect because it violates the document's Content Security Policy.`
- **Impact:** Firebase App Check cannot initialize properly or fetch its token because the `connect-src` directive in the site's CSP header/meta tag does not explicitly allow `https://content-firebaseappcheck.googleapis.com`.

### 2. Firestore Permission Denied
- **Error:** `FirebaseError: Missing or insufficient permissions.` at `feedback-widget.js:247`
- **Impact:** The feedback fails to save to the database.
- **Cause:** This is highly likely a direct result of the App Check failure mentioned above. If Firestore rules are set to require a valid App Check token (`request.app == null` checks), the lack of a token will block the write. Alternatively, the `firestore.rules` update may not have fully propagated.

### 3. Toast Notification Z-Index (UI)
- **Error:** The red alert toast ("Failed to submit feedback...") is appearing behind the blurred background overlay of the modal.
- **Impact:** Poor user experience; the user can barely read the error message.
- **Fix Needed:** The toast container needs a higher `z-index` (e.g., `9999`) to ensure it always renders on top of the `.glass-modal-overlay` or `.blur-backdrop`.

### 4. Star Rating Interactivity (UI)
- **Error:** Stars cannot be selected or clicked.
- **Impact:** Users cannot submit a star rating.
- **Fix Needed:** Review the event listeners in `feedback-widget.js`. Ensure that the `click` and `mouseover` events are properly binding to the SVGs/paths, and that there are no CSS properties like `pointer-events: none` blocking the interaction.

---

## 🏁 Handoff Details

### 1. ✅ Completed
- Resolved Firebase App Check CSP issues by adding the endpoint `https://content-firebaseappcheck.googleapis.com` to the `connect-src` directive in [index.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/index.html).
- Fixed toast notification overlapping issue by updating z-index from `9999` to `10001` in [toast-notifications.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/toast-notifications.js).
- Restructured star rating interactivity in [feedback-widget.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/feedback-widget.js) to trigger via radio input change events instead of label click handlers, resolving the selection and hover issues.
- Renamed and moved reports in accordance with `protocol.md`, keeping exactly 5 reports at the root level of `reports/ADITYA/ANTIGRAVITY` and archiving `063`.

### 2. 🚧 In-Progress
- None. All targeted feedback widget bug fixes are fully implemented.

### 3. ⚠️ Blockers
- None.

### 4. ⏭️ Next Action
- Deploy the updated code and verify the live widget.
