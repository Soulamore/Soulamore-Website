# 📝 QUICK REFERENCE - User Action Items
**Date:** March 20, 2026  
**Total Time:** ~40 minutes  

---

## 🔴 TASK 1: Rotate Secrets (10 min)

### Google OAuth
```bash
# 1. Go to https://console.cloud.google.com/apis/credentials
# 2. Reset OAuth secret
# 3. Run:
firebase functions:config:set google.client_secret="NEW_SECRET_HERE"
```

### ZeptoMail
```bash
# 1. Go to ZeptoMail Dashboard
# 2. Generate new API key
# 3. Run:
firebase functions:config:set zeptomail.password="NEW_KEY_HERE"
```

### Deploy
```bash
firebase deploy --only functions
```

---

## 🟠 TASK 2: App Check (15 min)

### 1. Register App
```
Firebase Console → App Check → Register App
Choose reCAPTCHA v3
Copy site key
```

### 2. Update Code
**File:** `assets/js/firebase-config.js`

**Add:**
```javascript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('PASTE_SITE_KEY_HERE'),
  isTokenAutoRefreshEnabled: true
});
```

### 3. Enforce
```
Firebase Console → App Check → Enforce for:
✓ Firestore
✓ Cloud Functions
```

### 4. Deploy
```bash
firebase deploy --only hosting
```

---

## 🟠 TASK 3: Monitoring Alerts (10 min)

```
Google Cloud Console → Billing → Budgets & alerts

Create Budget:
- Name: "Soulamore Bandwidth Alert"
- Amount: Your expected monthly spend
- Alerts at: 50%, 75%, 90%
- Email: contact.soulamore@gmail.com
```

---

## 🔴 TASK 4: Verify Bypass Removal (5 min)

### Check
**File:** `assets/js/auth-guard.js`

**Ensure REMOVED (lines 96-99):**
```javascript
// ❌ DELETE THIS:
if (session?.userId && (session.userId.startsWith('dev-') || session.userId === 'admin_root')) {
  console.log("🛠️ Bypass Active...");
  return;
}
```

### Deploy
```bash
firebase deploy --only hosting
```

### Test
```
1. Open admin-dashboard.html without admin role
2. Should redirect to user-dashboard.html
```

---

## ✅ DEPLOY EVERYTHING

```bash
# Full deployment
firebase deploy --only firestore:rules,functions,hosting

# Or step by step
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting
```

---

## 🧪 TEST

### Query Limits
```javascript
// Should work
firebase.firestore().collection('therapists').limit(10).get()

// Should fail
firebase.firestore().collection('therapists').get()
```

### Rate Limiting
```javascript
// Run 11 times rapidly - 11th should fail
const fn = httpsCallable(functions, 'submitContactForm');
fn({ name: 'Test', email: 'test@test.com', message: 'Test' });
```

### Security Headers
```
DevTools → Network → Load page → Check headers:
✓ X-Content-Type-Options: nosniff
✓ X-Frame-Options: DENY
✓ X-Robots-Tag: noarchive, nosnippet
```

---

## 📞 FULL DOCUMENTATION

**Read:** `reports/QWEN/2026-03-20_USER_ACTION_REQUIRED.md`

Contains detailed steps for all 4 tasks.

---

**Quick Reference Card - Pin This!** 📌
