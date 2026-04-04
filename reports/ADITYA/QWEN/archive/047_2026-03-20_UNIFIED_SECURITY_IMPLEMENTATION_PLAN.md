# 🔐 Unified Security Implementation Plan - RBAC + Audit Remediation
**Date:** March 20, 2026  
**Contributors:** Qwen Code + ANTIGRAVITY (Google Deepmind)  
**Session:** Security Audit Remediation & RBAC Implementation  
**Status:** 📋 READY FOR EXECUTION  

---

## 📋 Executive Summary

This plan unifies two critical initiatives:
1. **Firebase Custom Claims RBAC** - Secure role-based access control
2. **Security Audit Remediation** - 22 findings from bot abuse prevention audit

### Priority Matrix:
| Priority | Findings | Timeline | Blocking |
|----------|----------|----------|----------|
| **P0 - Critical** | F-01, F-03, F-04, F-09, F-11 | Immediate | ✅ Yes |
| **P1 - High** | F-02, F-05, F-07, F-08, F-10, F-12 | This week | ⚠️ Recommended |
| **P2 - Medium** | F-06, F-13 to F-19 | This month | ❌ No |
| **P3 - Low** | F-20 to F-22 | Next month | ❌ No |

---

## 🚨 22 Security Audit Findings

### Phase 1: Critical (P0) - IMMEDIATE

| ID | Severity | Issue | Remediation |
|----|----------|-------|-------------|
| **F-01** | 🔴 CRITICAL | Hardcoded Google OAuth secret & ZeptoMail API key | Move to `firebase functions:config` |
| **F-03** | 🔴 CRITICAL | Hardcoded bypasses in auth-guard.js (lines 96-99) | DELETE dev- and admin_root bypasses |
| **F-04** | 🔴 CRITICAL | releasePayout uses Firestore role (user-writable) | Use Custom Claims (`context.auth.token.role`) |
| **F-09** | 🔴 CRITICAL | active_souls allows unauthenticated writes | Require auth + schema validation |
| **F-11** | 🟠 HIGH | payments collection allows client updates | Set `allow update: if false` |

### Phase 2: High (P1) - This Week

| ID | Severity | Issue | Remediation |
|----|----------|-------|-------------|
| **F-02** | 🟠 HIGH | verifyPayment lacks ID token verification | Add `verifyAuthToken` helper |
| **F-07** | 🟠 HIGH | No amount validation in verifyPayment | Compare expectedAmount vs paid |
| **F-08** | 🟠 HIGH | createRazorpayOrder unprotected | Add App Check + auth validation |
| **F-05** | 🟠 HIGH | Self-assigned roles possible | Block client writes to roles collection |
| **F-10** | 🟠 HIGH | soulbot_usage rate-limiting client-side | Move to Cloud Functions |
| **F-12** | 🟠 HIGH | isHidden field unprotected | Restrict to admin-only writes |

### Phase 3: Medium/Low (P2/P3) - This Month

| ID | Severity | Issue | Remediation |
|----|----------|-------|-------------|
| **F-06** | 🟡 MEDIUM | sessionStorage bootstrap in auth-guard | Remove, use only Custom Claims |
| **F-13** | 🟡 MEDIUM | blog_comments allows any keys | Add schema validation |
| **F-14** | 🟡 MEDIUM | forum_posts allows any keys | Add schema validation |
| **F-15** | 🟡 MEDIUM | problem-wall-notes reactions unprotected | Restrict to valid fields only |
| **F-16** | 🟡 MEDIUM | blog_posts drafts visible to all | Add author-only filter |
| **F-17** | 🟡 MEDIUM | get() role lookups in rules | Replace with `request.auth.token.role` |
| **F-18** | 🟡 LOW | sendBookingReminders not idempotent | Use transactions |
| **F-19** | 🟡 LOW | Google OAuth tokens unencrypted | Encrypt before storage |
| **F-20** | 🔵 LOW | Legacy collections exposed | Remove or restrict access |
| **F-21** | 🔵 LOW | No CORS origin validation | Add allowed origins list |
| **F-22** | 🔵 LOW | App Check not enforced | Enable for all functions |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Firebase App Check (Bot Prevention)                   │
│  - reCAPTCHA Enterprise verification                            │
│  - Blocks 99% of automated scripts                              │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Custom Claims (Identity)                              │
│  - Cryptographically signed roles                               │
│  - Cannot be forged or modified by client                       │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: Firestore Rules (Data Access)                         │
│  - Schema validation (keys, types, sizes)                       │
│  - Authorship checks (userId == auth.uid)                       │
│  - Role-based access (token.role)                               │
├─────────────────────────────────────────────────────────────────┤
│  Layer 4: Cloud Functions (Server-Side Logic)                   │
│  - Secrets in environment config                                │
│  - Token verification on all endpoints                          │
│  - Rate limiting & idempotency                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Phases

### **Phase 1: Critical Security Fixes (P0)** - 2-3 hours

#### 1.1 F-01: Rotate & Secure Secrets

**File:** `functions/index.js`

**Before:**
```javascript
const CLIENT_SECRET = "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"; // ❌ HARDCODED
const ZEPTOMAIL_PASS = "yA6KbHtS7w/0lzkCRhRo1MCI9ohk//1q2n+15CDmeMIlLoGzh6E51kFpKtq7dTfeiI7W5f1SP48WJ9uwuIwKKpJnY9AHLJTGTuv4P2uV48xh8ciEYNYigZisALkRFKBJcBknDy83RPMmWA=="; // ❌ HARDCODED
```

**After:**
```javascript
// ✅ Using Firebase Config
const CLIENT_SECRET = functions.config().google.client_secret;
const ZEPTOMAIL_PASS = functions.config().zeptomail.password;
```

**Deployment:**
```bash
# Set secrets
firebase functions:config:set \
  google.client_id="YOUR_CLIENT_ID" \
  google.client_secret="YOUR_NEW_SECRET" \
  zeptomail.user="emailapikey" \
  zeptomail.password="YOUR_NEW_API_KEY"

# Rotate keys in:
# 1. Google Cloud Console > APIs & Services > Credentials
# 2. ZeptoMail Dashboard > SMTP Settings
```

---

#### 1.2 F-03: Remove Hardcoded Bypasses

**File:** `assets/js/auth-guard.js` (lines 96-99)

**DELETE THIS CODE:**
```javascript
// ❌ CRITICAL SECURITY VULNERABILITY - REMOVE IMMEDIATELY
if (session?.userId && (session.userId.startsWith('dev-') || session.userId === 'admin_root')) {
  console.log("🛠️ Bypass Active: skipping Firebase validation for session:", session.userId);
  return;
}
```

**Replacement:**
No replacement needed. All users must verify via Firebase Custom Claims.

---

#### 1.3 F-04: Refactor releasePayout to Use Custom Claims

**File:** `functions/index.js`

**Before:**
```javascript
// ❌ INSECURE: Reading role from Firestore (user-writable)
const userDoc = await admin.firestore().collection('users').doc(uid).get();
if (userDoc.data().role !== 'admin') {
  throw new Error('Unauthorized');
}
```

**After:**
```javascript
// ✅ SECURE: Using Custom Claims
if (!context.auth || context.auth.token.role !== 'admin') {
  throw new functions.https.HttpsError('permission-denied', 'Admin access required');
}
```

---

#### 1.4 F-09: Secure active_souls Collection

**File:** `firestore.rules`

**Before:**
```javascript
match /active_souls/{document=**} {
  allow read: if true;
  allow create: if true;
  allow update: if true; // ❌ INSECURE
}
```

**After:**
```javascript
match /active_souls/{document=**} {
  allow read: if request.auth != null;
  allow create: if request.auth != null 
                && request.resource.data.keys().hasOnly(['uid', 'timestamp', 'status'])
                && request.resource.data.uid == request.auth.uid;
  allow update: if request.auth != null 
                && resource.data.uid == request.auth.uid
                && request.resource.data.keys().hasOnly(['status', 'lastSeen']);
  allow delete: if false;
}
```

---

#### 1.5 F-11: Lock Down payments Collection

**File:** `firestore.rules`

**Before:**
```javascript
match /payments/{paymentId} {
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow update: if request.auth != null; // ❌ INSECURE
}
```

**After:**
```javascript
match /payments/{paymentId} {
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null; // System creates via Cloud Function
  allow update: if false; // ❌ NEVER ALLOW CLIENT UPDATES
  allow delete: if false;
}
```

---

### **Phase 2: High Priority Fixes (P1)** - 3-4 hours

#### 2.1 F-02: Add ID Token Verification to verifyPayment

**File:** `functions/index.js`

**Add Helper Function:**
```javascript
/**
 * Verify Firebase ID token from request header
 */
async function verifyAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.*)$/);
  
  if (!match) {
    throw new functions.https.HttpsError('unauthenticated', 'Missing authorization header');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(match[1]);
    return decodedToken;
  } catch (error) {
    throw new functions.https.HttpsError('unauthenticated', 'Invalid token');
  }
}
```

**Update verifyPayment:**
```javascript
exports.verifyPayment = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      // ✅ VERIFY TOKEN
      const decodedToken = await verifyAuthToken(req);
      const uid = decodedToken.uid;

      // ... rest of payment verification
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  });
});
```

---

#### 2.2 F-05: Block Self-Assigned Roles

**File:** `firestore.rules`

```javascript
match /roles/{userId} {
  // Users can read their own role
  allow read: if request.auth != null && request.auth.uid == userId;
  
  // ONLY ADMINS CAN WRITE (via Cloud Function)
  allow create, update: if false; // ❌ BLOCK ALL CLIENT WRITES
  
  // Admin management via Custom Claims only
  allow delete: if false;
}
```

---

#### 2.3 F-07/F-08: Payment Amount Validation

**File:** `functions/index.js`

**Update verifyPayment:**
```javascript
// ✅ VALIDATE AMOUNT
const bookingDoc = await admin.firestore().collection('peer_bookings').doc(bookingId).get();
const expectedAmount = bookingDoc.data().amount;

if (payment.amount !== expectedAmount) {
  return res.status(400).json({ 
    error: 'Amount mismatch',
    expected: expectedAmount,
    paid: payment.amount
  });
}
```

---

#### 2.4 F-10: Move soulbot_usage to Cloud Functions

**File:** `functions/index.js`

**Add Rate Limiting Function:**
```javascript
exports.checkSoulbotRateLimit = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const uid = context.auth.uid;
  const today = new Date().toISOString().split('T')[0];
  const usageRef = admin.firestore().collection('soulbot_usage').doc(`${uid}_${today}`);

  return admin.firestore().runTransaction(async (transaction) => {
    const usageDoc = await transaction.get(usageRef);
    const count = usageDoc.exists ? usageDoc.data().count : 0;

    if (count >= 10) { // 10 messages per day limit
      throw new functions.https.HttpsError('resource-exhausted', 'Daily limit reached');
    }

    transaction.set(usageRef, {
      userId: uid,
      date: today,
      count: count + 1
    }, { merge: true });

    return { remaining: 10 - count - 1 };
  });
});
```

---

### **Phase 3: Medium/Low Priority (P2/P3)** - 4-5 hours

#### 3.1 F-06: Remove sessionStorage Bootstrap

**File:** `auth-guard.js`

**REMOVE THIS CODE:**
```javascript
// ❌ REMOVE: sessionStorage bootstrap
if (!RAW_SESSION) {
  const storedUser = sessionStorage.getItem('user');
  if (storedUser) {
    // ... bootstrap logic
  }
}
```

**Use only Custom Claims:**
```javascript
const idTokenResult = await user.getIdTokenResult();
const role = idTokenResult.claims.role;
```

---

#### 3.2 F-13/F-14: Schema Validation for blog_comments & forum_posts

**File:** `firestore.rules`

```javascript
// Blog Comments Schema
match /blog_comments/{commentId} {
  allow create: if request.auth != null
                && request.resource.data.keys().hasOnly(['blogId', 'content', 'parentId'])
                && request.resource.data.content.size() < 2000
                && request.resource.data.blogId is string;
}

// Forum Posts Schema
match /forum_posts/{postId} {
  allow create: if request.auth != null
                && request.resource.data.keys().hasOnly(['title', 'content', 'category', 'tags'])
                && request.resource.data.title.size() < 200
                && request.resource.data.content.size() < 10000
                && request.resource.data.category in ['anxiety', 'relationships', 'student-life', 'depression', 'self-care', 'family', 'career', 'general'];
}
```

---

#### 3.3 F-16: Filter blog_posts Drafts

**File:** `firestore.rules`

```javascript
match /blog_posts/{blogId} {
  // Published posts are public
  allow read: if resource.data.status == 'published';
  
  // Authors can read their own drafts
  allow read: if request.auth != null 
              && resource.data.authorId == request.auth.uid;
  
  // Admins can read all
  allow read: if request.auth != null 
              && request.auth.token.role == 'admin';
}
```

---

#### 3.4 F-17: Replace get() Role Lookups

**File:** `firestore.rules`

**Before:**
```javascript
// ❌ SLOW: Firestore lookup
allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

**After:**
```javascript
// ✅ FAST: Custom Claims
allow read: if request.auth.token.role == 'admin';
```

---

#### 3.5 F-18: Idempotent Booking Reminders

**File:** `functions/index.js`

```javascript
exports.sendBookingReminders = functions.pubsub.schedule('every 15 minutes').onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();
  const reminderWindow = new Date(now.toDate().getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const bookingsSnapshot = await admin.firestore().collection('peer_bookings')
    .where('startTime', '>=', now)
    .where('startTime', '<=', reminderWindow)
    .where('reminderSent', '==', false)
    .get();

  const batch = admin.firestore().batch();

  bookingsSnapshot.docs.forEach(doc => {
    // Send email
    // ... email logic

    // Mark as sent (idempotent)
    batch.update(doc.ref, { reminderSent: true });
  });

  await batch.commit();
  return null;
});
```

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] Rotate Google OAuth secret
- [ ] Rotate ZeptoMail API key
- [ ] Set secrets via `firebase functions:config:set`
- [ ] Review all 22 findings

### Phase 1 Deployment (Critical)
- [ ] Remove hardcoded bypasses from auth-guard.js
- [ ] Update releasePayout to use Custom Claims
- [ ] Deploy firestore.rules with active_souls fix
- [ ] Deploy firestore.rules with payments lock
- [ ] Test admin access still works

### Phase 2 Deployment (High)
- [ ] Add verifyAuthToken helper
- [ ] Update verifyPayment with amount validation
- [ ] Lock roles collection
- [ ] Move soulbot_usage to Cloud Functions
- [ ] Test payment flow

### Phase 3 Deployment (Medium/Low)
- [ ] Remove sessionStorage bootstrap
- [ ] Add schema validation to all collections
- [ ] Replace get() role lookups
- [ ] Make reminders idempotent
- [ ] Encrypt Google OAuth tokens

---

## 🧪 Testing Plan

### Security Tests
- [ ] Attempt to access admin dashboard without admin role → Should redirect
- [ ] Attempt to update payments collection → Should fail
- [ ] Attempt to self-assign role → Should fail
- [ ] Attempt to create blog post with invalid keys → Should fail
- [ ] Attempt to call verifyPayment without token → Should fail

### Functional Tests
- [ ] Admin can still approve applications
- [ ] Payments still work correctly
- [ ] Booking reminders still send
- [ ] Soulbot rate limiting works
- [ ] Google Calendar integration still works

---

## 📁 Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `functions/index.js` | Secrets, verifyPayment, releasePayout, reminders | P0 |
| `assets/js/auth-guard.js` | Remove bypasses, sessionStorage | P0 |
| `firestore.rules` | active_souls, payments, roles, schema validation | P0 |
| `functions/.env` | Add secrets (gitignored) | P0 |

---

## ⚠️ Breaking Changes

### After Deployment:
1. **Dev bypasses removed** - No more `dev-` or `admin_root` shortcuts
2. **Payments locked** - Client cannot update payment documents
3. **Roles locked** - Must use Custom Claims via Cloud Functions
4. **sessionStorage removed** - Only Custom Claims for role verification

### Migration Required:
1. Promote existing admins via Custom Claims script
2. Backfill user roles with backfill script
3. Test all payment flows
4. Verify admin dashboard access

---

## 📞 Support Resources

### Documentation
- `functions/DEPLOYMENT_GUIDE.md` - Cloud Functions deployment
- `reports/QWEN/2026-03-20_CUSTOM_CLAIMS_SETUP_COMPLETE.md` - Custom Claims setup
- `reports/ADITYA/ANTIGRAVITY/2026-03-20_ANTIGRAVITY_Security_Audit_Bot_Abuse_Prevention.md` - Original audit

### Commands
```bash
# Set secrets
firebase functions:config:set google.client_secret="SECRET"

# Deploy functions
firebase deploy --only functions

# Deploy rules
firebase deploy --only firestore:rules

# View logs
firebase functions:log
```

---

**Implementation Plan Version:** 1.0.0  
**Last Updated:** March 20, 2026  
**Status:** Ready for Execution

---

*End of Unified Security Implementation Plan* 🚀
