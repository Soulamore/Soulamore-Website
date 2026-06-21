# 🐛 DASHBOARD ACCESS & FLICKER ISSUES - DIAGNOSTIC REPORT

**Date:** March 22, 2026  
**Status:** 🔍 **DIAGNOSED - FIX PLAN CREATED**  
**Severity:** 🔴 HIGH (Blocks dashboard access)

---

## 📋 REPORTED ISSUES

1. **Cannot open dashboards** - Developer Preview buttons not working
2. **Flicker issues** - Dashboards flicker on load
3. **Login redirect problems** - Users can't access dashboards after login

---

## 🔍 ROOT CAUSE ANALYSIS

### **Issue 1: Developer Preview Button Not Working** 🔴

**Location:** `portal/login.html` (line 166, 893)

**Problem:**
```javascript
function handleDevBypass(event) {
    if (event) event.preventDefault(); // ✅ GOOD
    
    const intent = sessionStorage.getItem('loginIntent') || 'user';
    const btn = document.querySelector('button[onclick="handleDevBypass()"]'); 
    // ❌ BAD: Selector fails because HTML has onclick="handleDevBypass(event)" not onclick="handleDevBypass()"
    
    // Session created is incompatible with auth-guard-strict.js
    const session = {
        isLoggedIn: true,
        userId: 'dev-' + intent,
        role: intent,  // ❌ Missing 'name' and 'email' fields
        email: intent + '@soulamore.dev'
    };
}
```

**Root Cause:**
1. Button selector doesn't match (missing `(event)` in selector)
2. Session object missing required fields (`name`, `photoURL`)
3. `auth-guard-strict.js` expects complete session object

---

### **Issue 2: Auth Guard Flicker** 🟠

**Location:** `assets/js/auth-guard-strict.js` vs `assets/js/auth-guard.js`

**Problem:**
- **TWO auth guards exist** - both trying to redirect
- `auth-guard-strict.js` - Blocks access, redirects to login
- `auth-guard.js` - Permissive, allows all logged-in users
- **Dashboards use different guards:**
  - `admin-dashboard.html` uses `auth-guard-strict.js` (line 16)
  - Other dashboards may use `auth-guard.js` or none

**Flicker Sequence:**
```
1. Dashboard loads
2. auth-guard-strict.js runs → checks role
3. Role doesn't match → redirects to login
4. login.html auto-redirects back to dashboard
5. auth-guard.js runs → allows access
6. FLICKER: User sees redirect loop
```

---

### **Issue 3: Login Redirect Chain** 🟡

**Location:** `portal/login.html` (lines 237-243)

**Problem:**
```javascript
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // LOOP PREVENTION check exists but may fail
        const fromDashboard = document.referrer && document.referrer.includes('dashboard');
        if (fromDashboard) {
            return; // Stays on login
        }
        
        // Auto-redirect even if just came from dashboard
        window.location.href = dashboard; // ❌ Causes loop
    }
});
```

---

## ✅ FIX PLAN

### **Fix 1: Developer Preview Button** (10 minutes)

**File:** `portal/login.html`

**Changes:**
```javascript
// OLD (line 897):
const btn = document.querySelector('button[onclick="handleDevBypass()"]');

// NEW:
const btn = event.target; // Use event.target directly

// OLD session (lines 907-912):
const session = {
    isLoggedIn: true,
    userId: 'dev-' + intent,
    role: intent,
    email: intent + '@soulamore.dev'
};

// NEW session (add missing fields):
const session = {
    isLoggedIn: true,
    userId: 'dev-' + intent,
    role: intent,
    email: intent + '@soulamore.dev',
    name: 'Dev ' + intent.charAt(0).toUpperCase() + intent.slice(1),
    photoURL: '../assets/images/default-avatar.png'
};
```

---

### **Fix 2: Unify Auth Guards** (20 minutes)

**Option A: Use auth-guard.js everywhere** (Recommended - Less restrictive)

1. **Update `admin-dashboard.html`** (line 16):
```html
<!-- OLD -->
<script src="/assets/js/auth-guard-strict.js"></script>

<!-- NEW -->
<script src="/assets/js/auth-guard.js"></script>
```

2. **Update other dashboards** to use same guard

3. **Delete or deprecate `auth-guard-strict.js`**

**Option B: Fix auth-guard-strict.js** (Keep strict mode but fix bugs)

- Add proper session handling
- Fix redirect loop prevention
- Add timeout to prevent rapid redirects

---

### **Fix 3: Login Redirect Logic** (10 minutes)

**File:** `portal/login.html`

**Changes:**
```javascript
// Add better loop prevention (line 215):
const lastLoginTime = sessionStorage.getItem('lastLoginTime');
const now = Date.now();
if (lastLoginTime && (now - lastLoginTime) < 5000) {
    console.warn("⚠️ Login redirect loop detected. Staying on login.");
    return;
}
sessionStorage.setItem('lastLoginTime', now);

// Add check before auto-redirect (line 243):
const justCameFromDashboard = sessionStorage.getItem('justLeftDashboard');
if (justCameFromDashboard) {
    console.log("User just left dashboard, staying on login");
    return;
}
```

---

### **Fix 4: Add Debug Mode** (5 minutes)

**File:** `portal/login.html`

**Add debug logging:**
```javascript
// Add before line 205:
console.log('=== LOGIN DEBUG ===');
console.log('loginIntent:', sessionStorage.getItem('loginIntent'));
console.log('returnUrl:', sessionStorage.getItem('returnUrl'));
console.log('referrer:', document.referrer);
```

---

## 📝 IMPLEMENTATION PRIORITY

### **Critical (Do First)** 🔴
1. **Fix Developer Preview button** (10 min)
   - Fix button selector
   - Add missing session fields
   
2. **Test all 4 dashboards** (5 min)
   - Admin, User, Peer, Psych
   - Verify no flicker

### **High Priority** 🟠
3. **Unify auth guards** (20 min)
   - Choose one guard (recommend auth-guard.js)
   - Update all dashboards
   - Test redirect chain

4. **Fix login redirect logic** (10 min)
   - Add loop prevention
   - Add timing checks

### **Medium Priority** 🟡
5. **Add debug mode** (5 min)
   - Console logging
   - Session inspection

6. **Create test documentation** (10 min)
   - How to test each dashboard
   - Expected behavior

---

## 🧪 TESTING CHECKLIST

### **Developer Preview Test**
- [ ] Click "Developer Preview (Skip Login)" button
- [ ] Select User → Should redirect to user-dashboard.html
- [ ] Select Peer → Should redirect to peer-dashboard.html
- [ ] Select Psychologist → Should redirect to psych-dashboard.html
- [ ] Select Admin → Should redirect to admin-dashboard.html
- [ ] No flicker on any dashboard
- [ ] Dashboard loads successfully

### **Normal Login Test**
- [ ] Login with Google
- [ ] Auto-redirect to correct dashboard based on role
- [ ] No redirect loop
- [ ] No flicker
- [ ] Logout works
- [ ] Can login again after logout

### **Auth Guard Test**
- [ ] Access admin dashboard as user → Should redirect to user dashboard
- [ ] Access peer dashboard as user → Should redirect to user dashboard
- [ ] Access correct dashboard → Should work
- [ ] No infinite loops

---

## 📊 EXPECTED IMPACT

| Issue | Before Fix | After Fix |
|-------|------------|-----------|
| **Dev Preview** | ❌ Broken | ✅ Working |
| **Flicker** | ❌ Visible | ✅ None |
| **Redirect Loop** | ❌ Occasional | ✅ Never |
| **Dashboard Access** | ❌ Blocked | ✅ Working |

---

## 🎯 NEXT STEPS

1. **Implement Fix 1** (Dev Preview button) - 10 min
2. **Test all dashboards** - 5 min
3. **Implement Fix 2** (Unify guards) - 20 min
4. **Retest** - 10 min
5. **Document** - 10 min

**Total Time:** ~55 minutes

---

*Diagnostic Report Created: March 22, 2026*  
*By: Qwen Code*  
*Status: 🔍 Diagnosed - Ready for Implementation*
