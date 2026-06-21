# Technical Specification - User Deletion & Consolidation Merging Fixes

- **Agent**: Antigravity
- **Date**: 2026-06-14
- **Narrative Subject**: Resolution of Administrator Privileges (Firestore deletion rules) and consolidation logic correction (duplicate user merging) in the Admin Portal.

---

## 1. Narrative & Visual Impact

When administrators attempted to delete user accounts from the Admin Dashboard, the operations failed silently or threw `permission-denied` errors. Visually, the user profiles remained in the list, resulting in a feeling that the administrator lacked direct authority or control over database cleanups.

Furthermore, duplicate accounts merged via the dashboard consolidated incorrectly: the payment transaction history (`razorpayPayments`) was assigned back to the *secondary* (merged and deactivated) profile rather than being pushed to the *primary* active profile. This left primary user profiles without their associated purchase history.

---

## 2. Technical Root Causes

1. **Security Privilege Omission (`firestore.rules`)**:
   The `/users/{userId}` security matcher did not define `allow delete`. Although admins had `allow update`, any invocation of `deleteDoc` was blocked. Additionally, `match /roles/{userId}` had `allow delete: if false;`, which prevented admins from deleting role credentials when removing accounts.

2. **Inverted Target References (`admin-dashboard.html`)**:
   Inside `mergeCluster`, the code constructed a merge transaction updates object but committed it to `secondaryId` rather than `primaryId`.
   Inside `mergeSelectedUsers`, duplicate account merges completely skipped merging the `razorpayPayments` field.

---

## 3. Engineering Details

### Firestore Rule Modifications
[firestore.rules](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/firestore.rules#L25-L39):
```javascript
    // Users collection - Central profile data
    match /users/{userId} {
      allow read: if isSelf(userId) || isAdmin();
      allow create: if isSelf(userId);
      allow update: if isSelf(userId) 
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])
                    || isAdmin();
      allow delete: if isAdmin();
    }

    // Role verification flags (Verified Status)
    match /roles/{userId} {
      allow read: if isSelf(userId) || isAdmin();
      allow create, update: if isSelf(userId) || isAdmin();
      allow delete: if isAdmin();
    }
```

### Script Level Consolidation logic
[admin-dashboard.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/admin-dashboard.html):
- Imported `arrayUnion` on line 2005.
- Fixed `mergeSelectedUsers` on line 2027 to fetch secondary documents and push arrayUnion contents to the primary account.
- Fixed `mergeCluster` on line 3433 to apply updates to `primaryId` and set `isMerged: true` on `secondaryId`.
- Updated `deleteUserRecord` on line 5520 to delete both `/users/{uid}` and `/roles/{uid}`.

---

## 4. Verification & Status

### Firestore Rules Compilation & Release
```bash
$ firebase deploy --only firestore:rules
=== Deploying to 'soulamore-f0a64'...
+  cloud.firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
+  firestore: released rules firestore.rules to cloud.firestore
+  Deploy complete!
```

### Git Branch Coverage
All user management updates have been checked in and pushed:
- **Branch**: `fix/admin-user-management`
- **Latest Commit**: `fix: resolve firestore permission blocks on user deletions and correct logical inversions in user merging`
