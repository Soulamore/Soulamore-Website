# Manual Audit Log - Soulamore Portals
**Reviewers:** Aditya (User) & Antigravity (AI Partner)  
**Start Date:** June 13, 2026  
**Status:** Active  

This document tracks UI/UX inconsistencies, layout offsets, console errors, and functional bugs identified during manual reviews of the Soulamore dashboard portals.

---

## 📋 Audit Log Table

| ID | Date | Component / Page | Screenshot / Asset | Issue Description | Status | Fix Details |
|---|---|---|---|---|---|---|
| **001** | June 13, 2026 | Users Tab - Verifications | N/A | "Pending Verifications" button was static and failed to perform any table filtering. | ✅ Fixed | Connected button to `filterUserStatus('pending')` handler, added status filtering in JS, and dynamically updated counts. |
| **002** | June 13, 2026 | Soulamore Away Postcard | N/A | Postcard delivery returned `FirebaseError: Missing or insufficient permissions.` and blocked email delivery. | ✅ Fixed | Updated `firestore.rules` to permit public writes (`allow create: if true`) for `/postcards` and `/mail` collections. |
| **003** | June 13, 2026 | Cards - Overview Tab | [Duplicate Card Screenshot](file:///C:/Users/adity/.gemini/antigravity-ide/brain/74860a67-c73e-4a98-8abb-f17d46dde369/.tempmediaStorage/media_74860a67-c73e-4a98-8abb-f17d46dde369_1781350591830.png) | The `.dash-card i` descendant selector applied too broadly, bloating card header icons and button icons to 1.5rem and adding 15px bottom margins. | ✅ Fixed | Restrained CSS selector to direct child icons (`.dash-card > i`), restoring baseline vertical alignment to nested header/button icons. |
| **004** | June 13, 2026 | Manual Review | Pending | [Waiting for next screenshot/issue report...] | 🔍 Queue | — |

---

## 🗂️ Verification Guidelines
1. Stage, commit, and push all verified changes to the remote repository.
2. Maintain the **Reports Archiving Protocol** (maximum of 5 files at the root of the `reports/ADITYA/ANTIGRAVITY` folder; older files must be moved to the `/archive` subdirectory).
