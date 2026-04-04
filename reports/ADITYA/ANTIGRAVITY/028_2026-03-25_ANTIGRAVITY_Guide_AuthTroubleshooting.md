# 🔒 SOULAMORE AUTHENTICATION TROUBLESHOOTING GUIDE
**Version:** 3.0 (Bulletproof Edition)
**Last Updated:** March 23, 2026

---

## 🚨 QUICK FIXES (Start Here!)

### **Problem: Can't Login**
```javascript
// Open browser console (F12) and run:
window.debugAuth();
```

**Check:**
1. Is `authState.currentUser` null? → Firebase not connected
2. Is `authState.error` set? → See error messages below
3. Is stored session valid? → Check localStorage

**Quick Fix:**
```javascript
// Clear auth state and retry
window.clearAuthSession();
location.reload();
```

---

### **Problem: Redirect Loop / Flicker**
```javascript
// Check current auth state
window.checkAuth();

// Force redirect to correct dashboard
window.forceAuthRedirect();
```

**Common Causes:**
- Role mismatch between session and Firestore
- Multiple auth guards running
- Browser cache issues

**Fix:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear auth session: `window.clearAuthSession()`
3. Login again

---

### **Problem: Wrong Dashboard After Login**
```javascript
// Check your role
const user = await window.debugAuth();
console.log('Role:', user.currentRole);

// Manually redirect
window.location.href = 'portal/YOUR-CORRECT-dashboard.html';
```

**Fix Role in Firestore:**
```javascript
// Run in console (admin only!)
const { db, doc, updateDoc } = await import('./assets/js/firebase-config.js');
await updateDoc(doc(db, 'users', 'YOUR-USER-ID'), { role: 'peer' });
// Replace with: 'user', 'peer', 'psychologist', or 'admin'
```

---

## 📋 DEBUG COMMANDS REFERENCE

| Command | Description |
|---------|-------------|
| `window.debugAuth()` | Show full auth status report |
| `window.checkAuth()` | Check current auth guard status |
| `window.forceAuthRedirect()` | Manually trigger redirect |
| `window.clearAuthSession()` | Clear stored session |
| `window.debugAuthTest()` | Run auth system tests |

---

## 🔍 ERROR CODES & SOLUTIONS

### **Firebase Auth Errors**

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/user-not-found` | No account with this email | User needs to sign up first |
| `auth/wrong-password` | Incorrect password | Reset password or retry |
| `auth/invalid-email` | Bad email format | Check email format |
| `auth/user-disabled` | Account disabled | Contact admin |
| `auth/too-many-requests` | Rate limited | Wait 5-10 minutes |
| `auth/network-request-failed` | Network error | Check internet connection |
| `auth/unauthorized-domain` | Domain not allowed | Add domain in Firebase Console |

### **Auth Guard Errors**

| Error | Meaning | Solution |
|-------|---------|----------|
| `Auth timeout` | Firebase took too long | Reload page, check Firebase |
| `Not authenticated` | No valid session | Login again |
| `Failed to fetch user role` | Firestore error | Check Firestore rules, network |
| `Role not allowed` | Wrong dashboard for role | Redirect will happen automatically |

---

## 🛠️ ADVANCED DEBUGGING

### **1. Check Firebase Connection**
```javascript
const { auth, db } = await import('./assets/js/firebase-config.js');
console.log('Firebase Auth:', auth);
console.log('Firebase DB:', db);
console.log('Current User:', auth.currentUser);
```

### **2. Check Firestore User Doc**
```javascript
const { db, doc, getDoc } = await import('./assets/js/firebase-config.js');
const userDoc = await getDoc(doc(db, 'users', 'YOUR-USER-ID'));
console.log('User Data:', userDoc.data());
```

### **3. Check Stored Session**
```javascript
const session = localStorage.getItem('soulamore_session');
console.log('Stored Session:', JSON.parse(session));
```

### **4. Manually Set Role (Testing Only)**
```javascript
// WARNING: For testing only!
localStorage.setItem('soulamore_session', JSON.stringify({
    isLoggedIn: true,
    userId: 'YOUR-UID',
    role: 'admin', // or 'peer', 'psychologist', 'user'
    email: 'test@example.com'
}));
location.reload();
```

---

## 🎯 ROLE-BASED DASHBOARD MAP

| Role | Dashboard | URL |
|------|-----------|-----|
| `admin` | Admin Dashboard | `portal/admin-dashboard.html` |
| `psychologist` | Psychologist Dashboard | `portal/psych-dashboard.html` |
| `peer` | Peer Dashboard | `portal/peer-dashboard.html` |
| `user` / `member` | User Dashboard | `portal/user-dashboard.html` |

---

## ✅ LOGIN FLOW CHECKLIST

### **For Users:**
1. [ ] Navigate to login page
2. [ ] Enter email and password
3. [ ] Click "Login"
4. [ ] Wait for redirect (2-5 seconds)
5. [ ] Arrive at correct dashboard

### **For Admins Testing:**
1. [ ] Open browser console (F12)
2. [ ] Run `window.debugAuth()` before login
3. [ ] Attempt login
4. [ ] Watch console logs for errors
5. [ ] Verify role in Firestore matches expected
6. [ ] Confirm redirect to correct dashboard

---

## 🔥 NUCLEAR OPTIONS (Last Resort)

### **1. Full Auth Reset**
```javascript
// Clear everything
localStorage.removeItem('soulamore_session');
sessionStorage.clear();
location.href = 'portal/login.html';
```

### **2. Force Re-login**
```javascript
// Sign out from Firebase
const { auth, signOut } = await import('./assets/js/firebase-config.js');
await signOut(auth);
localStorage.clear();
location.href = 'portal/login.html';
```

### **3. Create Fresh Test User**
```javascript
// Create new test user
const { auth, createUserWithEmailAndPassword } = await import('./assets/js/firebase-config.js');
const { db, doc, setDoc, serverTimestamp } = await import('./assets/js/firebase-config.js');

const cred = await createUserWithEmailAndPassword(auth, 'test@example.com', 'password123');
await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email: 'test@example.com',
    role: 'user',
    createdAt: serverTimestamp()
});
console.log('✅ Test user created:', cred.user.uid);
```

---

## 📊 AUTH SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                            │
│  - Uses auth-service-v3.js                               │
│  - Calls loginWithEmail() or loginWithGoogle()           │
│  - Saves session to localStorage                         │
│  - Redirects via handleRoleRouting()                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  AUTH GUARD V3                           │
│  - Runs on every dashboard page load                     │
│  - Checks stored session (fast)                          │
│  - Falls back to Firebase (slow)                         │
│  - Redirects to correct dashboard based on role          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 FIRESTORE (users)                        │
│  - Source of truth for user roles                        │
│  - Fields: uid, email, role, displayName, etc.           │
│  - Role values: user, peer, psychologist, admin          │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 TESTING CHECKLIST

### **Before Reporting a Bug:**
- [ ] Tried `window.debugAuth()`?
- [ ] Cleared browser cache?
- [ ] Checked console for errors?
- [ ] Verified Firebase connection?
- [ ] Checked Firestore user doc exists?
- [ ] Confirmed role is valid ('user', 'peer', 'psychologist', 'admin')?
- [ ] Tried nuclear options?

### **Information to Provide:**
1. Console output from `window.debugAuth()`
2. Any error messages (screenshot)
3. Which dashboard you're on
4. Which dashboard you expect
5. Your user role in Firestore
6. Browser and version

---

## 📞 CONTACT / ESCALATION

If all else fails:
1. Take screenshot of `window.debugAuth()` output
2. Take screenshot of console errors
3. Check Firestore user document
4. Verify Firebase Console → Authentication shows user
5. Contact admin with above information

---

## 🔄 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-03-23 | Bulletproof edition with comprehensive logging |
| 2.0 | 2026-03-20 | Added role-based routing |
| 1.0 | 2026-03-15 | Initial auth guard |

---

**Remember:** 90% of auth issues are solved by clearing cache and re-login!

*Last reviewed: March 23, 2026*
