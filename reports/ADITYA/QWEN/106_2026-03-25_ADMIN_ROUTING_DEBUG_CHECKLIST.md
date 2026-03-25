# ADMIN ROUTING DEBUG CHECKLIST

## 🔍 Quick Diagnostic Test

**Run these commands in browser console AFTER logging in:**

### Step 1: Check Session Storage
```javascript
console.log('Session:', JSON.parse(localStorage.getItem('soulamore_session')));
```

**Expected Output:**
```javascript
{
  isLoggedIn: true,
  userId: "YOUR_UID",
  email: "admin@soulamore.com",
  role: "admin"  // ← Should be 'admin'
}
```

**If role is NOT 'admin':**
- The login auto-redirect is not fetching the correct role from Firestore
- OR Firestore document doesn't have `role: 'admin'`

---

### Step 2: Check Firestore User Document
```javascript
import { getFirestore, doc, getDoc } from './assets/js/firebase-config.js';
const db = getFirestore();
const user = await getDoc(doc(db, 'users', 'YOUR_UID_FROM_STEP_1'));
console.log('Firestore User Doc:', user.data());
```

**Expected Output:**
```javascript
{
  email: "admin@soulamore.com",
  displayName: "Your Name",
  role: "admin",  // ← Should be 'admin'
  ...
}
```

**If role is NOT 'admin':**
- Your Firestore user document needs to be updated
- Run this to fix:
```javascript
import { getFirestore, doc, updateDoc } from './assets/js/firebase-config.js';
const db = getFirestore();
await updateDoc(doc(db, 'users', 'YOUR_UID'), { role: 'admin' });
console.log('✅ Role updated to admin');
```

---

### Step 3: Test getUserRole Function
```javascript
import { getUserRole } from './assets/js/auth-service.js';
const role = await getUserRole('YOUR_UID');
console.log('getUserRole returned:', role);
```

**Expected:** `'admin'`

**If returns `'user'`:**
- Firestore query is failing
- OR role field is missing/empty in Firestore

---

## 🛠️ Common Fixes

### Fix 1: Update Your Role in Firestore
```javascript
import { getFirestore, doc, updateDoc } from './assets/js/firebase-config.js';
const db = getFirestore();
const user = firebase.auth().currentUser;
if (user) {
  await updateDoc(doc(db, 'users', user.uid), { role: 'admin' });
  console.log('✅ Role updated to admin in Firestore');
  // Refresh page to test
  location.reload();
}
```

### Fix 2: Clear Session and Re-login
```javascript
localStorage.removeItem('soulamore_session');
sessionStorage.clear();
location.href = 'login.html?fresh=true';
// Then login again
```

### Fix 3: Check Which Email is Actually Admin
```javascript
import { getFirestore, collection, getDocs, query, where } from './assets/js/firebase-config.js';
const db = getFirestore();
const q = query(collection(db, 'users'), where('role', '==', 'admin'));
const snap = await getDocs(q);
console.log('Admin users in Firestore:');
snap.forEach(doc => console.log(' -', doc.data().email, '| UID:', doc.id));
```

---

## 📊 Expected Flow (When Working)

```
1. Login with Google
   ↓
2. createOrUpdateUserProfile() creates/updates Firestore doc
   ↓
3. handleRoleRouting() fetches role from Firestore
   ↓
4. Finds role = 'admin'
   ↓
5. finalizeSession('admin', '/portal/admin-dashboard.html')
   ↓
6. Saves {role: 'admin'} to localStorage
   ↓
7. Redirects to admin-dashboard.html
   ↓
8. ✅ Admin dashboard loads
```

---

## 🎯 Most Likely Issue

**Your Firestore user document has `role: 'user'` or `role: ''` instead of `role: 'admin'`**

**Solution:** Run Fix 1 above to update your role to 'admin' in Firestore.

---

**Date:** March 25, 2026  
**Purpose:** Debug admin dashboard routing issue
