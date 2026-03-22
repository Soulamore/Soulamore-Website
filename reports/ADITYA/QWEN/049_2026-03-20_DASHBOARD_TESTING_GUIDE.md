# 🧪 DASHBOARD TESTING GUIDE - COMPLETE

**Date:** March 20, 2026  
**Status:** ✅ **SERVER RUNNING - READY TO TEST**

---

## 🚀 SERVER STATUS

```
✅ Server: RUNNING
✅ Port: 3500
✅ Access: http://localhost:3500
✅ CORS: Enabled
✅ Cache: Disabled (-c-1)
```

---

## 📍 START HERE - DASHBOARD HUB

**Open This First:**
```
http://localhost:3500/dashboard-hub.html
```

**You Should See:**
- ✅ 4 dashboard cards in grid (Admin, User, Peer, Psych)
- ✅ Cards side-by-side (NOT stacked)
- ✅ Hover effects on cards
- ✅ "Online" status indicators

**If you see this correctly → Server is working! ✅**

---

## 🎯 COMPLETE TESTING CHECKLIST

### **Test 1: Dashboard Hub Layout** ✅

**URL:** `http://localhost:3500/dashboard-hub.html`

**Expected:**
```
┌─────────────────────────────────────────┐
│                                         │
│      🎨 Soulamore Dashboards            │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │  Admin   │  │   User   │            │
│  │    🛡️    │  │    👤    │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │   Peer   │  │  Psych   │            │
│  │    🤝    │  │    ⚕️    │            │
│  └──────────┘  └──────────┘            │
│                                         │
└─────────────────────────────────────────┘
```

**Check:**
- [ ] 4 cards visible
- [ ] Cards in grid (2x2 or responsive)
- [ ] NOT stacked vertically
- [ ] Hover effect works (cards lift up)
- [ ] Border colors correct (Admin=Indigo, User=Teal, Peer=Peach, Psych=Teal)

---

### **Test 2: Admin Dashboard** ✅

**URL:** `http://localhost:3500/portal/admin-dashboard.html`

**Expected:**
- ✅ Loading screen appears briefly
- ✅ Loading screen hides after max 10 seconds
- ✅ Dashboard shows with sidebar
- ✅ "User Management" section visible
- ✅ 12 users loaded in table
- ✅ Overview stats section visible

**Check Console (F12):**
```
✅ "✅ Admin dashboard loaded (with or without data)"
⚠️ "Error loading content queue: Missing or insufficient permissions" (OK - needs index)
```

**Test Features:**
- [ ] Sidebar navigation works
- [ ] User Management tab shows users
- [ ] Can click on users
- [ ] Overview tab shows stats
- [ ] Logout button works

---

### **Test 3: User Dashboard** ✅

**URL:** `http://localhost:3500/portal/user-dashboard.html`

**Expected:**
- ✅ Dashboard loads
- ✅ Sidebar shows user info
- ✅ Home view displays
- ✅ Stats visible (Sessions, Journal, Mood, Resources)
- ✅ Logout button in footer

**Check Console (F12):**
```
✅ "🚀 User Dashboard Dynamic Data Loader initialized"
✅ "✅ User profile loaded: [Name] | Role: [role]"
```

**Test Features:**
- [ ] Sidebar navigation works
- [ ] Can switch views (Home, Journal, Bookings, etc.)
- [ ] Profile shows correct info
- [ ] Logout button works (confirms, then redirects)

---

### **Test 4: Peer Dashboard** ✅

**URL:** `http://localhost:3500/portal/peer-dashboard.html`

**Expected:**
- ✅ Dashboard loads
- ✅ Peer-specific features visible
- ✅ Impact metrics section
- ✅ Availability settings (if peer)
- ✅ Sidebar with peer navigation

**Check Console (F12):**
```
✅ "✅ Peer Dashboard Initialized"
✅ "📊 User stats loaded"
```

**Test Features:**
- [ ] Sidebar navigation works
- [ ] Impact metrics visible
- [ ] Availability section accessible
- [ ] Logout button works

---

### **Test 5: Psychologist Dashboard** ✅

**URL:** `http://localhost:3500/portal/psych-dashboard.html`

**Expected:**
- ✅ Dashboard loads
- ✅ Practice stats visible
- ✅ Client roster section
- ✅ Sidebar with psych navigation

**Check Console (F12):**
```
✅ "✅ Psych Dashboard Initialized"
✅ "📊 Practice stats loaded"
```

**Test Features:**
- [ ] Sidebar navigation works
- [ ] Practice stats visible
- [ ] Client roster accessible
- [ ] Logout button works

---

### **Test 6: Role-Based Access Control** ✅

**Test Unauthorized Access:**

**Step 1:** Login as regular user (not admin)

**Step 2:** Try to access admin dashboard:
```
http://localhost:3500/portal/admin-dashboard.html
```

**Expected Result:**
```
┌─────────────────────────────────┐
│                                 │
│    ⛔ Access Denied             │
│                                 │
│  Your role (user) doesn't have  │
│  access to this dashboard.      │
│                                 │
│  Redirecting to your            │
│  dashboard...                   │
│                                 │
└─────────────────────────────────┘
```

**After 1.5 seconds:**
- ✅ Redirects to correct dashboard (user-dashboard.html)
- ✅ Console shows: "⛔ FORBIDDEN: Role user cannot access this dashboard"

**Check Console (F12):**
```
⛔ "⛔ BLOCKED: Role user not allowed on admin-dashboard"
🔄 "Redirecting to user dashboard..."
```

---

### **Test 7: Logout Functionality** ✅

**On Any Dashboard:**

**Step 1:** Click "Log Out" button

**Expected:**
- ✅ Confirmation dialog appears: "Are you sure you want to log out?"
- ✅ Click "OK"
- ✅ Console shows: "🚪 Logging out..."
- ✅ Console shows: "✅ Logout successful"
- ✅ Redirects to login page

**Check Console (F12):**
```
🚪 "Logging out..."
✅ "Logout successful"
```

**If Error:**
```
❌ "handleLogout is not defined"
```
**Fix:** Press `Ctrl + Shift + R` (hard refresh) to clear cache

---

### **Test 8: Light Mode** ✅

**On Any Dashboard:**

**Step 1:** Find theme toggle (sun/moon icon)

**Step 2:** Click to switch to Light Mode

**Expected:**
- ✅ Background changes to light color (#f8fafc)
- ✅ Sidebar becomes white
- ✅ Cards become white with visible borders
- ✅ Text becomes dark (#0f172a)
- ✅ Links have underlines
- ✅ Buttons have clear hover states

**Check:**
- [ ] Text is readable (dark on light)
- [ ] Cards have visible borders
- [ ] Buttons darken on hover (20% darker)
- [ ] Links have underlines
- [ ] All elements visible

**Check Console (F12):**
```
Should be NO CSP errors about Firebase Analytics
```

---

### **Test 9: Mobile Responsiveness** ✅

**On Any Dashboard:**

**Step 1:** Press `F12` (open DevTools)

**Step 2:** Press `Ctrl + Shift + M` (toggle device mode)

**Step 3:** Select device:
- iPhone SE (375px)
- iPhone 14 Pro (393px)
- Samsung Galaxy S23 (360px)

**Expected:**
- ✅ Sidebar collapses or becomes toggleable
- ✅ Content adjusts to screen width
- ✅ Buttons are ≥48px tall
- ✅ Touch targets ≥44px
- ✅ No horizontal scroll
- ✅ Text readable (≥16px)

**Check:**
- [ ] Layout responsive
- [ ] Buttons large enough
- [ ] Text readable
- [ ] No overflow
- [ ] Mobile menu works

---

### **Test 10: Firebase Integration** ✅

**On Admin Dashboard:**

**Expected:**
- ✅ 12 users loaded in User Management
- ✅ User details visible when clicked
- ✅ Role dropdown shows current role
- ✅ Can change roles (dropdown works)

**Check Console (F12):**
```
✅ "✅ Found 12 users in Firestore"
📄 "User: [uid] {email, role, displayName, ...}"
```

**If Permission Errors:**
```
⚠️ "Error loading users: FirebaseError: Missing or insufficient permissions"
```
**This is OK for now** - means you need to deploy Firestore rules (optional)

---

## 🐛 TROUBLESHOOTING

### **Problem: Dashboard Hub Shows Stacked Cards**

**Solution:**
```
1. Press Ctrl + Shift + R (hard refresh)
2. Clear browser cache
3. Check browser console for CSS errors
```

---

### **Problem: Logout Button Error**

**Error:** `handleLogout is not defined`

**Solution:**
```
1. Press Ctrl + Shift + Delete
2. Clear "Cached images and files"
3. Close browser completely
4. Re-open and try again
```

---

### **Problem: Dashboard Won't Load**

**Symptoms:**
- Blank page
- Console errors about Firebase

**Solution:**
```
1. Check server is running: netstat -ano | findstr :3500
2. Hard refresh: Ctrl + Shift + R
3. Check console for specific errors
4. Verify Firebase config in firebase-config.js
```

---

### **Problem: Redirect Loop**

**Symptoms:**
- Keeps redirecting between login and dashboard
- Console: "Redirect loop detected"

**Solution:**
```
1. Clear all browser data (Ctrl + Shift + Delete)
2. Close browser
3. Re-open
4. Login fresh
```

---

### **Problem: Light Mode Not Working**

**Symptoms:**
- Theme toggle does nothing
- Console errors

**Solution:**
```
1. Hard refresh: Ctrl + Shift + R
2. Check console for errors
3. Verify dashboard-themes.css loaded
4. Clear cache if needed
```

---

## ✅ PASS CRITERIA

**All Tests Pass If:**

- ✅ Dashboard hub shows 4 cards in grid
- ✅ All 4 dashboards load successfully
- ✅ Loading screens hide within 10 seconds
- ✅ Role-based access works (blocks unauthorized)
- ✅ Logout works on all dashboards
- ✅ Light mode switches correctly
- ✅ Mobile responsive (no horizontal scroll)
- ✅ Firebase data loads (users, stats)
- ✅ No critical console errors

---

## 📊 EXPECTED CONSOLE OUTPUT

**Admin Dashboard:**
```
🔒 Auth Guard Checking...
✅ Auth Guard initialized
✅ User authenticated: admin@soulamore.com
✅ User role loaded: admin
✅ Access granted to admin-dashboard for role: admin
✅ Admin dashboard loaded (with or without data)
📊 Found 12 users in Firestore
```

**User Dashboard:**
```
🔒 Auth Guard Checking...
✅ Auth Guard initialized
✅ User authenticated: user@example.com
✅ User role loaded: user
✅ Access granted to user-dashboard for role: user
🚀 User Dashboard Dynamic Data Loader initialized
✅ User profile loaded: [Name] | Role: user
```

**Peer Dashboard (Unauthorized User):**
```
🔒 Auth Guard Checking...
✅ Auth Guard initialized
✅ User authenticated: user@example.com
✅ User role loaded: user
⛔ Role user not allowed on peer-dashboard
⛔ FORBIDDEN: Role user cannot access this dashboard
🔄 Redirecting to user-dashboard.html
```

---

## 🎯 QUICK TEST COMMANDS

**Check Server:**
```bash
netstat -ano | findstr :3500
```
Should show: `TCP 0.0.0.0:3500 LISTENING`

**Hard Refresh:**
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

**Clear Cache:**
```
F12 → Right-click refresh → "Empty Cache and Hard Reload"
```

**Open DevTools:**
```
F12 or Ctrl + Shift + I
```

---

## 📝 TEST RESULTS TEMPLATE

**Copy and fill this out:**

```
TEST RESULTS - [Date] [Time]
================================

✅ Dashboard Hub:
- Cards in grid: YES / NO
- Hover effects: YES / NO
- All links work: YES / NO

✅ Admin Dashboard:
- Loads successfully: YES / NO
- Shows 12 users: YES / NO
- Loading screen hides: YES / NO
- Logout works: YES / NO

✅ User Dashboard:
- Loads successfully: YES / NO
- Profile shows: YES / NO
- Logout works: YES / NO

✅ Peer Dashboard:
- Loads successfully: YES / NO
- Peer features visible: YES / NO
- Logout works: YES / NO

✅ Psych Dashboard:
- Loads successfully: YES / NO
- Practice stats visible: YES / NO
- Logout works: YES / NO

✅ Role-Based Access:
- Blocks unauthorized: YES / NO
- Redirects correctly: YES / NO
- Shows access denied screen: YES / NO

✅ Light Mode:
- Switches correctly: YES / NO
- Text readable: YES / NO
- Cards have borders: YES / NO
- Links have underlines: YES / NO

✅ Mobile:
- Responsive layout: YES / NO
- Buttons ≥48px: YES / NO
- No horizontal scroll: YES / NO

ISSUES FOUND:
- [List any issues]

CONSOLE ERRORS:
- [List any critical errors]
```

---

## 🚀 START TESTING NOW!

**Server is RUNNING on port 3500**

**Open this first:**
```
http://localhost:3500/dashboard-hub.html
```

**Then test each dashboard in order:**
1. Dashboard Hub ✅
2. Admin Dashboard ✅
3. User Dashboard ✅
4. Peer Dashboard ✅
5. Psych Dashboard ✅
6. Role-Based Access ✅
7. Logout ✅
8. Light Mode ✅
9. Mobile ✅
10. Firebase ✅

---

**Ready to test! Open dashboard-hub.html now!** 🧪✨

**Report any issues you find!** 📝
