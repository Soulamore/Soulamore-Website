# 🐛 Dashboard Bugs Report - Session Log
**Date:** 2026-03-23  
**Reporter:** Qwen Code (via Aditya)  
**Purpose:** Second opinion from Claude on persistent dashboard authentication and profile save issues

---

## 📋 Executive Summary

We are experiencing **multiple interconnected bugs** across the Soulamore dashboard system (peer, psychologist, admin, and user dashboards). Despite several fix attempts, core issues with **authentication state management**, **profile saving**, and **App Check configuration** remain unresolved.

---

## 🔍 Problems Encountered

### **Bug 1: Live News Pill Overlapping Logout Button**
**Symptom:** The "Live News" toggle pill was positioned at `left: 30px`, directly overlapping the sidebar logout button on dashboards.

**Attempted Fix:**
- Changed position from `left: 30px` to `right: 30px` in `assets/js/components.js`
- Added CSS rule to hide pill on portal/dashboard pages
- Added JS check in `injectNewsToggle()` to skip injection on `/portal/` paths

**Status:** ✅ **FIXED** - News pill now appears on right side and is hidden on portal pages.

---

### **Bug 2: Profile Changes Not Saving / "No Active Session" Error**
**Symptom:** When users click "Save Changes" on profile tabs (peer-dashboard.html, psych-dashboard.html), they receive "No active session" error or nothing happens.

**Root Cause Analysis:**
- Race condition: `auth.currentUser` is `null` when save button is clicked
- `onAuthStateChanged` callback hasn't fired yet when user interacts with page
- Firebase auth session hasn't finished restoring from localStorage

**Attempted Fix:**
- Added `isAuthReady` flag tracked via `onAuthStateChanged`
- Save button disabled until auth is confirmed
- Added extensive console debugging:
  ```javascript
  console.log("[Save Profile] Called - isAuthReady:", isAuthReady, "currentUser:", auth.currentUser)
  ```
- Updated `savePublicProfile()` in `practitioner-handler.js` to sync name to both `professionals` AND `users` collections

**Current Status:** ⚠️ **PARTIALLY FIXED** - Button now shows "Loading..." state, but save still fails due to auth issues (see Bug 4).

**Files Modified:**
- `portal/peer-dashboard.html` (lines 2155-2238)
- `portal/psych-dashboard.html` (lines 2155-2238)
- `assets/js/practitioner-handler.js` (savePublicProfile function)

---

### **Bug 3: Universal Name Syncing Overwrites Role Suffix**
**Symptom:** When user "Aditya Peer" saves their profile, the sidebar now shows "Aditya Admin" instead of "Aditya Peer". The name sync is replacing the role-based display name.

**Root Cause:**
- `savePublicProfile()` updates `users` collection's `displayName` field
- This overwrites any role suffix (e.g., "Peer", "Admin", "Psychologist")
- Sidebar pulls from `users.displayName`, losing the role context

**Attempted Fix:**
- Added name sync to `users` collection in `practitioner-handler.js`
- However, this introduced the side effect of stripping role suffixes

**Current Status:** ❌ **NOT FIXED - MADE WORSE** - Name sync works but destroys role-based naming.

**Question for Claude:** Should we:
1. Store `displayName` and `roleDisplayName` as separate fields?
2. Append role suffix after sync (e.g., `displayName + ' ' + role`)?
3. Only sync `displayName` if it doesn't already contain a role suffix?

---

### **Bug 4: App Check reCAPTCHA Blocking All Auth Requests**
**Symptom:** Login fails with `auth/invalid-credential` and console shows:
```
FirebaseError: AppCheck: ReCAPTCHA error. (appCheck/recaptcha-error)
```

**Impact:**
- All authentication requests fail
- Firestore returns "Missing or insufficient permissions"
- Users cannot log in to test any fixes

**Attempted Fix:**
- Wrapped `initializeAppCheck()` in try-catch in `firebase-config.js`
- Commented out App Check initialization entirely:
  ```javascript
  // DISABLED FOR LOCAL DEVELOPMENT
  let appCheck = null;
  console.log("⚠️ App Check disabled for local development");
  ```

**Current Status:** ⚠️ **UNCLEAR** - Console still shows `✅ App Check initialized with reCAPTCHA Enterprise`, suggesting browser is caching old JS.

**Question for Claude:** 
- Is there a server-side App Check enforcement that requires client-side initialization?
- Could Firestore security rules be checking for App Check tokens?
- Should we use `unenforceAppCheck()` or is commenting out sufficient?

---

### **Bug 5: Auth Guard Failing with "getAuth is not a function"**
**Symptom:** Console shows:
```
❌ Auth Guard failed: TypeError: getAuth is not a function
    at runAuthCheck (auth-guard.js:69:26)
```

**Impact:**
- Auth guard cannot verify user session
- Dashboard may not load properly

**Current Status:** ❌ **NOT FIXED** - Import issue in `auth-guard.js`.

**Files to Check:**
- `portal/auth-guard.js` (line 69)
- `assets/js/firebase-config.js` (exports)

---

### **Bug 6: JavaScript Errors in User Dashboard**
**Symptom:** Console shows:
```
Uncaught SyntaxError: Identifier 'list' has already been declared
```

**Impact:**
- User dashboard may not function properly
- Other JS may be blocked from executing

**Current Status:** ❌ **NOT INVESTIGATED** - Variable redeclaration issue.

**Files to Check:**
- `portal/user-dashboard.html` (search for duplicate `let list` or `const list`)

---

### **Bug 7: Firestore Permission Denied Errors**
**Symptom:** Multiple console errors:
```
FirebaseError: [code=permission-denied]: Missing or insufficient permissions
```

**Affected Features:**
- Loading saved items
- Loading wallet balance
- Loading overview stats (admin dashboard)
- Loading content queue (admin dashboard)

**Current Status:** ❌ **NOT FIXED** - May be related to App Check or actual Firestore rules issues.

**Files to Check:**
- `firestore.rules`
- `portal/user-dashboard.html` (lines 1905, 1979)
- `portal/admin-dashboard.html` (lines 1294, 1146)

---

## 📁 Key Files Involved

| File | Purpose | Status |
|------|---------|--------|
| `assets/js/firebase-config.js` | Firebase initialization, App Check, Auth | Modified (App Check disabled) |
| `assets/js/practitioner-handler.js` | Profile save logic, name sync | Modified (added users collection sync) |
| `assets/js/components.js` | News pill, header injection | Modified (news pill position) |
| `portal/peer-dashboard.html` | Peer profile save | Modified (auth-aware save) |
| `portal/psych-dashboard.html` | Psychologist profile save | Modified (auth-aware save) |
| `portal/user-dashboard.html` | User dashboard | Has JS errors |
| `portal/admin-dashboard.html` | Admin dashboard | Permission errors |
| `portal/auth-guard.js` | Auth state verification | Import error |
| `firestore.rules` | Firestore security rules | May need review |

---

## 🎯 Questions for Claude

### **Priority 1: Authentication & App Check**
1. **App Check Enforcement:** Even after commenting out App Check in `firebase-config.js`, console still shows it initializing. Is there cached code, or is App Check being loaded elsewhere? What's the proper way to disable App Check for local development?

2. **Auth Guard Error:** `auth-guard.js:69` shows `getAuth is not a function`. This suggests an import issue. Can you review how `getAuth` is imported and used in `auth-guard.js` vs how it's exported from `firebase-config.js`?

3. **Invalid Credential Error:** Login returns `auth/invalid-credential` even with correct credentials. Could this be caused by:
   - App Check token missing from request headers?
   - Firebase config mismatch (API key, project ID)?
   - CORS or CSP issues blocking auth endpoints?

### **Priority 2: Profile Save & Name Sync**
4. **Name Sync Strategy:** The current fix syncs `displayName` from `professionals` to `users` collection, but this overwrites role suffixes (e.g., "Aditya Peer" → "Aditya"). What's the best approach:
   - Store `displayName` and `displayRole` separately?
   - Only sync if `displayName` doesn't match pattern `/\s+(Peer|Admin|Psychologist)$/`?
   - Use a different field like `profileName` for sync?

5. **Save Function Race Condition:** We added `isAuthReady` flag, but save still sometimes fails. Is there a better pattern for ensuring auth is ready before allowing user actions? Should we use a Promise-based auth initialization?

### **Priority 3: Firestore Permissions**
6. **Permission Denied Errors:** Multiple features show "Missing or insufficient permissions". Are these caused by:
   - App Check token missing (requests rejected)?
   - Actual Firestore rules misconfiguration?
   - Auth state not properly attached to requests?

7. **Firestore Rules Review:** Should we review `firestore.rules` to ensure:
   - Authenticated users can read/write their own data?
   - Admin role has appropriate access?
   - No circular dependencies in rules (e.g., `get(/databases/$(database)/documents/roles/$(request.auth.uid))`)?

### **Priority 4: JavaScript Errors**
8. **Duplicate Variable Declaration:** `user-dashboard.html` has `Identifier 'list' has already been declared`. This is a simple fix but may indicate deeper code quality issues. Should we do a full audit of duplicate declarations across dashboard files?

---

## 🔧 Recommended Next Steps (Qwen's Suggestion)

1. **Force clear browser cache** - Use incognito mode or `Ctrl+Shift+Delete` to ensure new JS is loaded
2. **Verify App Check is disabled** - Check network tab for App Check token requests
3. **Fix auth-guard.js import** - Ensure `getAuth` is properly imported from Firebase SDK
4. **Review name sync logic** - Decide on strategy to preserve role suffixes
5. **Test with fresh user account** - Create new test user to avoid cached state issues
6. **Audit Firestore rules** - Ensure rules match actual data structure and auth state

---

## 📊 Current Server State

- **Local Server:** Running on `http://localhost:8000` and `http://192.168.2.102:8000`
- **Firebase Project:** soulamore-f0a64
- **App Check:** Disabled (commented out in firebase-config.js)
- **Test User ID:** `mBRTBu2UN5MgfOAcQpAESu5C4Cx2` (admin@soulamore.com)

---

*Generated by Qwen Code - Requesting Claude's expert analysis on these interconnected dashboard issues.*
