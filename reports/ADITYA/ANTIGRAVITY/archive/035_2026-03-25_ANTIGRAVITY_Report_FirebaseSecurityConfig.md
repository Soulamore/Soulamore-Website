# Firebase Security Configuration Guide

## ⚠️ CRITICAL: Production Deployment Checklist

Before deploying Soulamore to production, complete these Firebase security configurations:

---

## 1. API Key Restriction (CRITICAL)

**Current Status:** ❌ API key is unrestricted and publicly exposed in `firebase-config.js`

**Required Actions:**

### Step 1: Restrict API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **soulamore-f0a64**
3. Navigate to **APIs & Services** > **Credentials**
4. Find API key: `AIzaSyDxHa9CR8OVpDn9MObPCzbnsYTCWcTb-9k`
5. Click **Edit** (pencil icon)
6. Under **Application restrictions**:
   - Select **HTTP referrers (websites)**
   - Add authorized domains:
     ```
     https://soulamore-f0a64.web.app/*
     https://soulamore-f0a64.firebaseapp.com/*
     http://localhost:*
     https://yourdomain.com/*  (if using custom domain)
     ```
7. Under **API restrictions**:
   - Select **Restrict key**
   - Enable only:
     - Identity Toolkit API
     - Token Service API
     - Cloud Firestore API
8. Click **Save**

### Step 2: Environment Variables (Recommended)
For better security, move API key to environment variables:

```javascript
// firebase-config.js (production pattern)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: "soulamore-f0a64.firebaseapp.com",
    // ... rest of config
};
```

Create `.env` file (NEVER commit to Git):
```
FIREBASE_API_KEY=AIzaSyDxHa9CR8OVpDn9MObPCzbnsYTCWcTb-9k
```

Add to `.gitignore`:
```
.env
.env.local
```

---

## 2. Authorized Domains for OAuth (CRITICAL)

**Current Status:** ❌ Only default domains authorized

**Required Actions:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **soulamore-f0a64**
3. Navigate to **Authentication** > **Settings** > **Authorized domains**
4. Click **Add domain** for each:
   ```
   soulamore-f0a64.web.app
   soulamore-f0a64.firebaseapp.com
   localhost
   yourdomain.com  (if using custom domain)
   ```
5. Remove any unused domains

**Why this matters:** Google OAuth popup will fail with error `auth/unauthorized-domain` if the hosting domain is not in this list.

---

## 3. Firestore Security Rules

**Current Status:** ⚠️ Check current rules

### Recommended Rules for User Authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can create their own document on first login
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own document
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Only admins can delete (implement admin check)
      allow delete: if false;
    }
    
    // Roles collection (for peer/psychologist verification)
    match /roles/{userId} {
      // Anyone authenticated can read roles (to check permissions)
      allow read: if request.auth != null;
      
      // Only admins can write roles
      allow write: if false;  // TODO: Add admin check
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Deploy Rules:**
```bash
firebase deploy --only firestore:rules
```

---

## 4. Enable Required Authentication Methods

Ensure these are enabled in **Firebase Console > Authentication > Sign-in method**:

- ✅ Email/Password
- ✅ Google
- ❌ Disable unused providers (Facebook, Twitter, etc.) for security

---

## 5. Configure OAuth Consent Screen (Google Cloud)

1. Go to [Google Cloud Console > OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. Select **External** user type
3. Fill in:
   - **App name:** Soulamore
   - **User support email:** your-email@domain.com
   - **Developer contact:** your-email@domain.com
   - **Authorized domains:** soulamore-f0a64.web.app
4. Add Scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Save and Continue

---

## 6. Security Best Practices

### ✅ Implemented:
- CSP (Content Security Policy) added to login.html
- Referrer policy configured
- Console logging of user data removed
- Session storage for user data (better than localStorage for auth)

### ⚠️ TODO:
- [ ] Enable App Check for abuse prevention
- [ ] Set up Firebase monitoring/alerts
- [ ] Configure rate limiting for auth endpoints
- [ ] Add email verification requirement
- [ ] Implement password reset flow
- [ ] Add 2FA (Two-Factor Authentication) option

---

## 7. Monitoring & Alerts

Set up monitoring in Firebase Console:

1. **Authentication > Users:** Monitor signup patterns
2. **Usage tab:** Watch for quota usage spikes
3. **Set up alerting** for:
   - Failed login attempts spike
   - New user signups spike
   - Quota approaching limits

---

## 8. Deployment Checklist

Before going live:

- [ ] API key restricted to production domains
- [ ] Authorized domains configured for OAuth
- [ ] Firestore rules deployed and tested
- [ ] OAuth consent screen published
- [ ] CSP configured on all auth pages
- [ ] Environment variables set up
- [ ] Firebase monitoring enabled
- [ ] Backup plan for user data
- [ ] HTTPS enforced on hosting
- [ ] Custom error pages configured

---

## 9. Testing in Production

After deployment:

1. **Test Google login** from production URL
2. **Test email/password** signup and login
3. **Verify CSP** doesn't block legitimate requests (check browser console)
4. **Test role-based routing** (user/peer/psychologist)
5. **Verify Firestore** read/write permissions
6. **Check Firebase logs** for errors

**Emergency Rollback:**
```bash
firebase hosting:rollback
```

---

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Security Rules Reference](https://firebase.google.com/docs/firestore/security/get-started)
- [Google Cloud Console](https://console.cloud.google.com)
- [Firebase Console](https://console.firebase.google.com)

---

**Last Updated:** 2026-01-17
**Reviewed By:** Automated Security Audit
