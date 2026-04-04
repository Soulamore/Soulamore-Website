# 🔐 Firebase Custom Claims - Setup & Deployment Guide

**Date:** March 20, 2026  
**Version:** 1.0.0  
**Status:** Ready for Deployment

---

## 📋 Overview

This guide walks you through deploying the Firebase Custom Claims implementation for secure role-based access control (RBAC) in Soulamore.

### What You'll Deploy:
- ✅ **4 Cloud Functions** for role management
- ✅ **Auth Guard V2** for token-based routing
- ✅ **Admin Role Manager** client service
- ✅ **Firestore Security Rules V2** with role checks
- ✅ **One-time scripts** for admin promotion and backfill

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd functions
npm install
```

This installs:
- `firebase-admin` (v11.11.0)
- `firebase-functions` (v4.5.0)
- `typescript` (v5.3.3)

---

### Step 2: Download Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **soulamore-f0a64**
3. Click **⚙️ Settings** > **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Save the downloaded JSON file as `functions/serviceAccountKey.json`

⚠️ **SECURITY WARNING:** Never commit this file to Git! It's already in `.gitignore`.

---

### Step 3: Build Cloud Functions

```bash
cd functions
npm run build
```

This compiles TypeScript to JavaScript in the `lib/` folder.

**Verify build succeeded:**
```bash
ls lib/
# Should show: index.js, roles/, triggers/
```

---

### Step 4: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

**Expected output:**
```
✔  functions[listUsers(us-central1)] Successful create operation.
✔  functions[setRole(us-central1)] Successful create operation.
✔  functions[approveApplication(us-central1)] Successful create operation.
✔  functions[onUserCreate(us-central1)] Successful create operation.
✔  functions[healthCheck(us-central1)] Successful create operation.
```

---

### Step 5: Promote Admin Account

Run the one-time script to promote your admin account:

```bash
cd functions
npm run promote-admin
```

**Before running, update the email in `scripts/promote-admin.js`:**
```javascript
const ADMIN_EMAIL = 'admin@soulamore.com'; // Your admin email
```

**Expected output:**
```
🚀 Promoting user to admin...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Searching for user: admin@soulamore.com...
✅ Found user: abc123xyz
✅ Custom claims updated successfully
✅ Firestore profile updated

🎉 SUCCESS!
User admin@soulamore.com has been promoted to ADMIN

⚠️  IMPORTANT: The user must log out and log back in to receive the new role.
```

---

### Step 6: Backfill Existing Users (Optional)

If you have existing users in Firestore, run the backfill script:

```bash
npm run backfill-roles
```

**What it does:**
- Reads all users from Firestore
- Sets custom claims based on their `role` field
- Skips users who already have matching claims

**Expected output:**
```
🔄 Starting user role backfill...
📥 Fetching users from Firestore...
✅ Found 50 users

✅ Backfilled abc123 with role: user
✅ Backfilled def456 with role: peer
✅ Backfilled ghi789 with role: psychologist
✅ Backfilled jkl012 with role: admin

🎉 Backfill Complete!
✅ Successful: 47
⏭️  Skipped: 3
❌ Failed: 0
```

---

### Step 7: Deploy Firestore Security Rules V2

```bash
firebase deploy --only firestore:rules
```

**Updated rules include:**
- `hasRole()` helper function
- `isAdmin()` helper function
- Role-based access for all collections
- `request.auth.token.role` checks

---

### Step 8: Test Locally

#### Test 1: Login as Admin

1. Open: `http://localhost:3500/portal/login.html`
2. Login with admin account
3. Navigate to: `portal/admin-dashboard.html`
4. **Expected:** Access granted, dashboard loads

#### Test 2: List Users

1. Open browser console (F12)
2. Run:
```javascript
import { listUsers } from './assets/js/admin-role-manager.js';
listUsers().then(console.log).catch(console.error);
```
3. **Expected:** Array of users with roles

#### Test 3: Change User Role

1. In admin dashboard, go to "User Management"
2. Find a user
3. Change role dropdown from "User" to "Peer"
4. Click confirm
5. **Expected:** Success message, role updated

#### Test 4: Verify Token Refresh

1. User whose role changed must log out and back in
2. Open browser console
3. Run:
```javascript
import { getCurrentUserRole } from './assets/js/admin-role-manager.js';
getCurrentUserRole().then(console.log);
```
4. **Expected:** New role displayed

---

## 🧪 Testing Checklist

### Cloud Functions
- [ ] `listUsers()` returns users with roles
- [ ] `listUsers()` fails for non-admin (permission-denied)
- [ ] `setRole()` updates user role
- [ ] `setRole()` fails for non-admin
- [ ] `approveApplication()` approves peer application
- [ ] `approveApplication()` updates Firestore + claims
- [ ] `onUserCreate()` triggers on new signup
- [ ] `onUserCreate()` assigns 'user' role

### Auth Guard
- [ ] Admin can access admin-dashboard.html
- [ ] Non-admin redirected from admin-dashboard.html
- [ ] Peer can access peer-dashboard.html
- [ ] Psychologist can access psych-dashboard.html
- [ ] All roles can access user-dashboard.html

### Security Rules
- [ ] Admin can read/write admin-only collections
- [ ] Non-admin cannot access admin collections
- [ ] Users can only update their own profile
- [ ] Peers can update peer applications
- [ ] Psychologists can update psych applications

---

## 🐛 Troubleshooting

### Error: "Service account key not found"

**Solution:**
```bash
# Make sure you saved the key in the correct location
ls functions/serviceAccountKey.json

# If missing, download again from Firebase Console
```

### Error: "Permission denied" when calling functions

**Solution:**
1. Verify you're logged in as admin
2. Run promote-admin script again
3. Log out and log back in
4. Force token refresh: `auth.currentUser.getIdToken(true)`

### Error: "User not found"

**Solution:**
```bash
# Check if user exists in Firebase Auth
firebase auth:export users.json
cat users.json | grep "your-email@example.com"
```

### Functions not triggering

**Solution:**
```bash
# Check function logs
firebase functions:log

# Look for errors in onUserCreate trigger
firebase functions:log --only onUserCreate
```

### Custom claims not updating

**Solution:**
- User must log out and log back in
- Or force token refresh: `getIdToken(true)`
- Claims have 1-hour cache by default

---

## 📊 Deployment Verification

### Check Function Status

```bash
firebase functions:list
```

**Expected output:**
```
┌────────────────────────────┬─────────────┬─────────────────────┐
│ Name                       │ Type        │ Trigger             │
├────────────────────────────┼─────────────┼─────────────────────┤
│ listUsers                  │ HTTP        │ httpsCallable       │
│ setRole                    │ HTTP        │ httpsCallable       │
│ approveApplication         │ HTTP        │ httpsCallable       │
│ onUserCreate               │ Trigger     │ auth.user().onCreate│
│ healthCheck                │ HTTP        │ httpsCallable       │
└────────────────────────────┴─────────────┴─────────────────────┘
```

### Check Custom Claims

```javascript
// In browser console (logged in as admin)
firebase.auth().currentUser.getIdTokenResult()
  .then(result => console.log('Claims:', result.claims));
```

**Expected:**
```javascript
Claims: {
  role: "admin",
  createdAt: "2026-03-20T..."
}
```

---

## 🔒 Security Best Practices

### 1. Protect Service Account Key

```bash
# Already in .gitignore, but verify:
cat .gitignore | grep serviceAccountKey
# Should show: serviceAccountKey.json
```

### 2. Monitor Function Calls

```bash
# View real-time logs
firebase functions:log

# View only admin function calls
firebase functions:log --only setRole,listUsers,approveApplication
```

### 3. Set Up Alerts

In Firebase Console:
1. Go to **Cloud Monitoring**
2. Create alert for:
   - Function error rate > 5%
   - Function latency > 5s
   - Permission denied errors

---

## 📈 Performance Metrics

### Expected Latency

| Function | P50 | P95 | P99 |
|----------|-----|-----|-----|
| `listUsers()` | 200ms | 500ms | 1s |
| `setRole()` | 150ms | 300ms | 500ms |
| `approveApplication()` | 300ms | 600ms | 1s |
| `onUserCreate()` (trigger) | 100ms | 200ms | 400ms |

### Rate Limits

- `setCustomUserClaims()`: 10 calls/second
- `listUsers()`: 10 calls/second
- HTTPS Callable Functions: 1,000 calls/second

---

## 🎯 Next Steps After Deployment

1. **Update Admin Dashboard UI**
   - Replace direct Firestore calls with `listUsers()`
   - Add role dropdown with `setRole()` call

2. **Monitor Function Usage**
   - Check Firebase Console > Functions
   - Monitor invocation count and errors

3. **Test with Real Users**
   - Create test account
   - Promote to peer
   - Verify dashboard access

4. **Document for Users**
   - Update admin guide
   - Document role change process
   - Create troubleshooting guide

---

## 📞 Support

### Common Issues

| Issue | Solution |
|-------|----------|
| Functions fail with "permission-denied" | Verify admin role with `getIdTokenResult()` |
| User role not updating | Force token refresh or re-login |
| Backfill script fails | Check service account permissions |
| Security rules not enforcing | Verify rules deployed with `firebase deploy` |

### Getting Help

1. Check function logs: `firebase functions:log`
2. Review error messages in browser console
3. Verify Firebase Console > Authentication > Users
4. Check Firestore rules in Firebase Console

---

## ✅ Deployment Complete Checklist

- [ ] Dependencies installed
- [ ] Service account key downloaded
- [ ] Cloud Functions built successfully
- [ ] Cloud Functions deployed
- [ ] Admin account promoted
- [ ] Existing users backfilled (optional)
- [ ] Security Rules V2 deployed
- [ ] Local testing passed
- [ ] Admin dashboard updated
- [ ] Documentation updated

---

**Deployment Guide Version:** 1.0.0  
**Last Updated:** March 20, 2026  
**Maintained By:** Soulamore Dev Team

---

*End of Setup & Deployment Guide* 🚀
