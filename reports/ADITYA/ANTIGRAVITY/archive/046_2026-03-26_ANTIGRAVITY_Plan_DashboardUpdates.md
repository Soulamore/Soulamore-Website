# Dashboard UI Fixes & Feature Implementation Plan
**Date:** March 26, 2026
**Agent:** Antigravity (Frontend Specialist & Project Planner)
**Status:** 📝 **PLANNING MODE** (Awaiting Execution)

---

## 1. Remove the Floating Alert Bar (Merge Button)
- **Issue:** The `smart-alerts-container` (containing the "Duplicate Emails Detected" notice and "Merge Now" button) breaks the top visual alignment, causing the workspace header bottom-border to decouple from the sidebar underline.
- **Action:** Completely remove this floating container from the top of the `admin-dashboard.html` view to restore perfect visual alignment.

## 2. Relocate "Merge All" to Overview Grid
- **Issue:** Removing the alert bar removes the merge functionality.
- **Action:** Move the duplicate identification logic and merge capability into an Overview `dash-card`, placing it nicely within the dashboard grid alongside "Pending Approvals" and "Active Users".

## 3. Fix Dark Theme Text Contrast
- **Issue:** Text colors have poor contrast in certain cards in dark theme (e.g., the white-on-white text in the alert cards, or issues with button text rendering).
- **Action:** Audit and update the CSS rules that govern text colors inside these cards to ensure accessibility and premium legibility in dark mode.

## 4. Add "Duplicate Filter" to User Management
- **Issue:** Currently, there's no fast way to exclusively view the duplicated accounts in the user list.
- **Action:** Add a "Duplicates" filter option (or a drop-down toggle) inside the User Management search/filter bar so the admin can instantly view only the duplicated rows.

## 5. Fix Dropdown Styling (Background & Text Color)
- **Issue:** The `<option>` tags inside dropdowns (like "All Roles") display with a white background and light text in dark mode context, making them unreadable.
- **Action:** Apply custom CSS to the `<select>` and `<option>` elements so their background and text colors match the dark theme and look premium.

## 6. Manual Selection and Merge Action for Duplicates
- **Issue:** The platform doesn't let you choose exactly which duplicate entries to merge.
- **Action:** Provide a mechanism (like checks or multi-select UI) that lets the admin pick the specific duplicate rows. Add a new "Merge Selected" button that seamlessly triggers the merge operation for your selections only.

## 7. Migrate Existing Website Subscribers to Firebase
- **Issue:** The Newsletter Hub in the Admin Dashboard lacks the historical subscriber data stored locally.
- **Action:** Write an automated script/routine to parse `H:\Other computers\My laptop\Get Rich Quick Plans\Aditya Harsh\Soulamore\08 - Marketing\Website Subscribers\Website Subscriber.csv`. Batch import all these records directly into the Firebase `subscribers` collection so they instantly populate the Admin Dashboard.

## 8. Fix Firestore Permissions for Support Groups
- **Issue:** Accessing the "Support Groups Mgmt" module in the Admin dashboard throws a console error `FirebaseError: Missing or insufficient permissions` at `loadSupportGroups` (`admin-dashboard.html:2395`), resulting in a "Failed to load." UI state.
- **Action:** Audit and immediately hotfix the `firestore.rules` file to guarantee that admins have `read, write` clearance for the `support_groups` collection.

## 9. Create Missing "Groups Manager" View
- **Issue:** Clicking "Groups Manager" in the admin sidebar results in a console error `View not found: groups-management` (`portal-utils.js:31`). This is because the corresponding `div` with id `view-groups-management` does not actually exist in the HTML.
- **Action:** Create the missing `<div id="view-groups-management" class="view-section">` HTML boilerplate so the module renders and loads correctly when the sidebar link is clicked.

## 10. Comprehensive Safety Reports & Global Moderation Analytics
- **Issue:** The "Safety Reports" section currently lacks an automated, site-wide scanning system to proactively detect critical issues.
- **Action:** Enhance the "Safety Reports" dashboard to ingest alerts from a global Firestore moderation scanner that monitors content from all tools (Confession Box, Postcards, Forums, Problem Wall, and Active Chats). Organize these reports in the UI with a "Month-Wise Segregation" filter so admins can seamlessly track safety trends over time.
- **Brainstormed Moderation Scenarios to Implement:**
  - **Self-Harm / Suicide Threats (Critical):** Scan for crisis keywords (e.g., "kill myself", "want to die", "no reason to live") in Confession Box, Postcards, and active Chats, triggering an immediate high-priority red alert in the dashboard.
  - **Problem Wall Abuse (High):** Actively monitor and flag any abusive language, profanity, or harassment used in public "Problem Wall" posts to immediately protect the community feed.
  - **PII & Boundary Violations (High):** Detect sharing of phone numbers, emails, or social media links in chats. This is especially important for enforcing professional boundaries (e.g., preventing Peers from sharing personal contacts or moving off-platform).
  - **Abuse & Hate Speech (Medium):** Filter for extreme profanity, harassment, or bullying targeting marginalized groups across public and private tools.
  - **Solicitation / Scams (Medium):** Detect requests for money, suspicious financial links, or promotional spam.
  - **Manual Crisis Escalation (Action):** Provide a "Panic / Escalate" button for Peers in active sessions, allowing them to instantly flag a user as requiring an Admin or Psychologist intervention, sending the flag straight to this dashboard.

## 11. Create & Deploy Missing Composite Firestore Indexes
- **Issue:** The live Firebase console reveals that composite indexes currently only exist for `peer` collections and `blogs`. Previous agent records indicate Campus/Workplace indexes were created locally but never actually pushed to production. This will actively cause `FAILED_PRECONDITION` index crashes for Psychologists, Campus, and Workplace dashboard queries.
- **Action:** 
  1. Audit the codebase (`firestore.indexes.json` alongside `campus-handler.js`, `workplace-handler.js`) to log every required multi-field query.
  2. Explicitly define the missing indexes in `firestore.indexes.json` (such as compiling `campusId` + `classId`, or `status` + `createdAt` for missing models).
  3. Execute `firebase deploy --only firestore:indexes` via terminal to guarantee the configurations sync directly to your live production server so the pages do not crash.
  *(Status: Executed - Completed in background via CLI)*

## 12. Fix Floating Action Buttons Layout Conflict (Feedback & Live News)
- **Issue:** The global "Live News" pill button and the "Feedback" gradient button are colliding and overlapping each other in the bottom corner of the website, blocking interaction.
- **Action:** Audit the CSS positioning (`bottom`, `z-index`, specific viewport margins) of all floating corner widgets (Soulbot, Feedback, Live News). Adjust their vertical spacing so they stack cleanly, preventing overlap and ensuring they remain fully clickable and aesthetically separated.

---
*Waiting to execute or for additional items...*
