# FIRESTORE_RULES_DEPLOYMENT_GUIDE.md

## 🚨 CRITICAL: Deploy Firestore Rules for Content Queue

**Date:** March 25, 2026  
**Priority:** 🔴 HIGH

---

## 📋 PROBLEM

Firebase CLI deployment failed with permission error:
```
Error: 403 The caller does not have permission
```

**Impact:** Content queue cannot load peer stories and blogs for admin approval.

---

## ✅ SOLUTION: Manual Deployment via Firebase Console

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select project: **soulamore-f0a64**
3. Navigate to: **Firestore Database** → **Rules**

### Step 2: Copy the Rules

Open `firestore.rules` file and copy the ENTIRE content, OR use these specific rules for content moderation:

```javascript
// ==================== CONTENT MODERATION (Admin Access) ====================

// Peer Stories - for content queue approval
match /peer_stories/{storyId} {
  allow read: if request.auth != null; // All authenticated users can read published stories
  allow create: if request.auth != null; // Peers can submit stories
  // Admin can read ALL stories (including pending) and update/delete
  allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Blogs - for content queue approval
match /blogs/{blogId} {
  allow read: if request.auth != null; // All authenticated users can read published blogs
  allow create: if request.auth != null; // Authors can create blogs
  // Admin can read ALL blogs (including pending) and update/delete
  allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

### Step 3: Paste and Publish
1. **Paste** the rules into the Firebase Console rules editor
2. **Click "Publish"**
3. **Wait 30-60 seconds** for rules to propagate

### Step 4: Verify
1. Refresh admin dashboard
2. Go to "Content Queue" tab
3. Should now load pending stories/blogs

---

## 🔧 ALTERNATIVE: Fix Firebase CLI Permissions

If you want to use Firebase CLI in the future:

### Option 1: Grant Permissions
1. Go to: https://console.developers.google.com/iam-admin/iam?project=soulamore-f0a64
2. Find your account: `contact.adityaharsh@gmail.com`
3. Click **Edit** (pencil icon)
4. Add role: **Service Usage Consumer**
5. Click **Save**
6. Wait 5 minutes
7. Retry: `firebase deploy --only firestore:rules`

### Option 2: Use Different Account
Login with account that has owner permissions:
```bash
firebase logout
firebase login
firebase deploy --only firestore:rules
```

---

## 🧪 TESTING

### After Deploying Rules:

1. **Refresh admin dashboard**
2. **Check console logs:**
   ```
   ✅ Found X pending stories
   ✅ Found Y pending blogs
   ✅ Content queue loaded with Z items
   ```
3. **Content Queue tab should show:**
   - Story/blog cards (if pending content exists)
   - OR "Nothing to show" (if queue is empty)

---

## 📊 EXPECTED BEHAVIOR

### With Pending Content:
```
📝 Story Title
By: Author Name • Submitted Date
"Content excerpt..."
[Preview] [Reject] [Approve & Publish]
```

### Without Pending Content:
```
📭 Nothing to show
No pending content in queue
```

### With Permission Error (BEFORE FIX):
```
⚠️ Error loading content queue
Missing or insufficient permissions
```

---

**Deploy Date:** March 25, 2026  
**Status:** ⏳ AWAITING MANUAL DEPLOYMENT

---

*End of Guide* 🚀
