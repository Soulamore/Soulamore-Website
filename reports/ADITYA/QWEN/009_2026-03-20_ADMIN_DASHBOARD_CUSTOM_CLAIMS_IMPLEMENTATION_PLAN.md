# 🔐 Firebase Custom Claims Implementation Plan - Admin Dashboard Backend
**Date:** March 20, 2026  
**Developer:** Qwen Code  
**Session:** Admin Dashboard - Real Role-Based Access Control  
**Status:** 📋 Planning Phase  

---

## 📋 Executive Summary

Implementing **Firebase Custom Claims** for secure, server-side role management across Soulamore platform. This replaces client-side role checks with cryptographically signed ID tokens, providing true security for dashboard navigation and data access.

### Why Custom Claims?
- ✅ **Secure**: Claims are signed by Firebase, cannot be forged on client
- ✅ **Persistent**: Survive across sessions until explicitly changed
- ✅ **Available in Rules**: Can be used in Firestore Security Rules
- ✅ **Client-Readable**: Available via `getIdTokenResult()` on client

---

## 🎯 Objectives

1. **Create Cloud Functions** for role management (list users, set role, approve application)
2. **Update Admin Dashboard** to call Cloud Functions instead of direct Firestore writes
3. **Update Firestore Security Rules** to use `request.auth.token.role`
4. **Implement Token Refresh** logic on client after role changes
5. **Add Default Role Assignment** on user signup via Auth trigger

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD (Frontend)                    │
│  - List users (calls Cloud Function)                            │
│  - View user details                                            │
│  - Assign roles (calls Cloud Function)                          │
│  - Approve applications (calls Cloud Function)                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (HTTPS Callable Functions)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              CLOUD FUNCTIONS (Backend - Secure)                  │
│  - listUsers() - Verify admin, fetch from Auth + Firestore      │
│  - setRole() - Verify admin, set custom claims                  │
│  - approveApplication() - Verify admin, set role + update status│
│  - onCreateUser() - Trigger: assign default role                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (Firebase Admin SDK)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              FIREBASE AUTH + FIRESTORE                           │
│  - Auth: Store users with custom claims                         │
│  - Firestore: Store user profiles, applications                 │
│  - Security Rules: Enforce role-based access                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Files to Create

### Cloud Functions (New)
| File | Purpose | Type |
|------|---------|------|
| `functions/src/index.ts` | Main entry point | TypeScript |
| `functions/src/roles/list-users.ts` | List all users with claims | Callable |
| `functions/src/roles/set-role.ts` | Assign/update user role | Callable |
| `functions/src/roles/approve-application.ts` | Approve peer/psych application | Callable |
| `functions/src/triggers/on-user-create.ts` | Assign default role on signup | Auth Trigger |
| `functions/src/roles/index.ts` | Export all role functions | Barrel |

### Admin Dashboard Updates
| File | Changes | Purpose |
|------|---------|---------|
| `portal/admin-dashboard.html` | ~200 lines | Call Cloud Functions for user management |
| `assets/js/admin-role-manager.js` | NEW (~150 lines) | Client-side role management service |

### Security Rules Updates
| File | Changes | Purpose |
|------|---------|---------|
| `firestore.rules` | ~50 lines | Add role-based access with `request.auth.token.role` |

---

## 🔧 Implementation Steps

### **Phase 1: Setup & Configuration** (1-2 hours)

#### 1.1 Install Dependencies
```bash
cd functions
npm install firebase-admin firebase-functions --save
npm install -D typescript @types/node @types/firebase-admin
```

#### 1.2 Update `functions/package.json`
```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "npm run build && firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.11.0",
    "firebase-functions": "^4.5.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.0"
  },
  "engines": {
    "node": "18"
  }
}
```

#### 1.3 Update `functions/tsconfig.json`
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": ["src"]
}
```

---

### **Phase 2: Cloud Functions Implementation** (3-4 hours)

#### 2.1 Create `functions/src/index.ts`
```typescript
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Admin SDK
admin.initializeApp();

// Export role management functions
export * from './roles';
export * from './triggers/on-user-create';
```

#### 2.2 Create `functions/src/roles/list-users.ts`
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface ListUsersRequest {
  maxResults?: number;
  nextPageToken?: string;
}

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  createdAt: string;
  lastSignInTime: string;
}

export const listUsers = functions.https.onCall(
  async (data: ListUsersRequest, context): Promise<{ users: UserData[]; nextPageToken?: string }> => {
    // 1. Authenticate & Authorize
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    // 2. Check admin role
    const callerClaims = context.auth.token;
    if (callerClaims.role !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can list users'
      );
    }

    const maxResults = data.maxResults || 100;
    const pageToken = data.nextPageToken;

    try {
      // 3. Fetch users from Firebase Auth
      const listUsersResult = await admin.auth().listUsers(maxResults, pageToken);
      
      // 4. Map to UserData with custom claims
      const users: UserData[] = listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.customClaims?.role as string || 'user',
        createdAt: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }));

      return {
        users,
        nextPageToken: listUsersResult.pageToken
      };
    } catch (error) {
      console.error('Error listing users:', error);
      throw new functions.https.HttpsError('internal', 'Unable to retrieve user list');
    }
  }
);
```

#### 2.3 Create `functions/src/roles/set-role.ts`
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface SetRoleRequest {
  targetUid: string;
  newRole: string;
}

const ALLOWED_ROLES = ['user', 'peer', 'psychologist', 'admin'];

export const setRole = functions.https.onCall(
  async (data: SetRoleRequest, context): Promise<{ message: string }> => {
    // 1. Authenticate & Authorize
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    if (context.auth.token.role !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can assign roles'
      );
    }

    const { targetUid, newRole } = data;

    // 2. Validate role
    if (!ALLOWED_ROLES.includes(newRole)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}`
      );
    }

    try {
      // 3. Get current custom claims
      const userRecord = await admin.auth().getUser(targetUid);
      const currentClaims = userRecord.customClaims || {};

      // 4. Update role claim (preserve other claims)
      const updatedClaims = {
        ...currentClaims,
        role: newRole
      };

      // 5. Set custom claims
      await admin.auth().setCustomUserClaims(targetUid, updatedClaims);

      console.log(`✅ Role '${newRole}' assigned to user ${targetUid}`);

      return {
        message: `Role '${newRole}' assigned successfully`
      };
    } catch (error) {
      console.error('Error assigning role:', error);
      throw new functions.https.HttpsError('internal', `Unable to assign role: ${error.message}`);
    }
  }
);
```

#### 2.4 Create `functions/src/roles/approve-application.ts`
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface ApproveApplicationRequest {
  applicationId: string;
  collection: 'peers' | 'psychologists';
  newRole: 'peer' | 'psychologist';
}

export const approveApplication = functions.https.onCall(
  async (data: ApproveApplicationRequest, context): Promise<{ message: string }> => {
    // 1. Authenticate & Authorize
    if (!context.auth || context.auth.token.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }

    const { applicationId, collection, newRole } = data;

    try {
      const db = admin.firestore();
      const appRef = db.collection(collection).doc(applicationId);
      const appDoc = await appRef.get();

      if (!appDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Application not found');
      }

      const appData = appDoc.data()!;
      const userId = appData.userId || appData.authorId;

      if (!userId) {
        throw new functions.https.HttpsError('invalid-argument', 'Application missing userId');
      }

      // 2. Set custom claims
      const userRecord = await admin.auth().getUser(userId);
      const updatedClaims = {
        ...userRecord.customClaims,
        role: newRole
      };

      await admin.auth().setCustomUserClaims(userId, updatedClaims);

      // 3. Update application status
      await appRef.update({
        status: 'approved',
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: context.auth.uid
      });

      // 4. Update user profile in Firestore
      await db.collection('users').doc(userId).update({
        role: newRole,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Application ${applicationId} approved, role '${newRole}' assigned`);

      return {
        message: `Application approved. User is now ${newRole}`
      };
    } catch (error) {
      console.error('Error approving application:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
```

#### 2.5 Create `functions/src/triggers/on-user-create.ts`
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onUserCreate = functions.auth.user().onCreate(async (user): Promise<void> => {
  const customClaims = {
    role: 'user', // Default role
    createdAt: new Date().toISOString()
  };

  try {
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    console.log(`✅ Default role 'user' assigned to ${user.uid}`);

    // 5. Create user profile in Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User profile created for ${user.uid}`);
  } catch (error) {
    console.error('Error assigning default role:', error);
    // Don't throw - user was created successfully, role can be assigned later
  }
});
```

#### 2.6 Create `functions/src/roles/index.ts` (Barrel Export)
```typescript
export { listUsers } from './list-users';
export { setRole } from './set-role';
export { approveApplication } from './approve-application';
```

---

### **Phase 3: Client-Side Implementation** (2-3 hours)

#### 3.1 Create `assets/js/admin-role-manager.js`
```javascript
/**
 * Admin Role Manager - Client-side service for role management
 * Calls Cloud Functions for secure role operations
 */

import { auth, functionsInstance, httpsCallable } from './firebase-config.js';

/**
 * List all users with their roles
 * @returns {Promise<{users: Array, nextPageToken?: string}>}
 */
export async function listUsers(options = {}) {
    const { maxResults = 100, nextPageToken = undefined } = options;

    try {
        const listUsersFn = httpsCallable(functionsInstance, 'listUsers');
        const result = await listUsersFn({ maxResults, nextPageToken });
        return result.data;
    } catch (error) {
        console.error('❌ Error listing users:', error);
        throw error;
    }
}

/**
 * Assign or update a user's role
 * @param {string} targetUid - User ID to update
 * @param {string} newRole - New role ('user' | 'peer' | 'psychologist' | 'admin')
 */
export async function setRole(targetUid, newRole) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    // Force token refresh to ensure we have latest claims
    await user.getIdToken(true);

    try {
        const setRoleFn = httpsCallable(functionsInstance, 'setRole');
        const result = await setRoleFn({ targetUid, newRole });
        console.log('✅ Role updated:', result.data.message);
        return result.data;
    } catch (error) {
        console.error('❌ Error setting role:', error);
        throw error;
    }
}

/**
 * Approve a peer or psychologist application
 * @param {string} applicationId - Application document ID
 * @param {'peers' | 'psychologists'} collection - Collection name
 * @param {'peer' | 'psychologist'} newRole - Role to assign
 */
export async function approveApplication(applicationId, collection, newRole) {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    await user.getIdToken(true);

    try {
        const approveFn = httpsCallable(functionsInstance, 'approveApplication');
        const result = await approveFn({ applicationId, collection, newRole });
        console.log('✅ Application approved:', result.data.message);
        return result.data;
    } catch (error) {
        console.error('❌ Error approving application:', error);
        throw error;
    }
}

/**
 * Get current user's role from ID token
 * @returns {Promise<string>} User role
 */
export async function getCurrentUserRole() {
    const user = auth.currentUser;
    if (!user) return 'anonymous';

    try {
        const idTokenResult = await user.getIdTokenResult();
        return idTokenResult.claims.role || 'user';
    } catch (error) {
        console.error('❌ Error getting user role:', error);
        return 'user';
    }
}

/**
 * Force refresh user's ID token to get updated claims
 */
export async function refreshUserToken() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await user.getIdToken(true);
        console.log('✅ Token refreshed');
    } catch (error) {
        console.error('❌ Error refreshing token:', error);
    }
}

console.log('✅ Admin Role Manager loaded');
```

#### 3.2 Update `portal/admin-dashboard.html` - User Management Section

**Replace existing `loadAllUsers()` function:**
```javascript
// OLD: Direct Firestore query
// NEW: Call Cloud Function

import { listUsers, setRole, approveApplication } from '../assets/js/admin-role-manager.js';

async function loadAllUsers() {
    const container = document.getElementById('user-management-container');
    container.innerHTML = `
        <div style="padding:40px; text-align:center;">
            <i class="fas fa-spinner fa-spin" style="font-size:2rem;"></i>
            <p>Loading users...</p>
        </div>
    `;

    try {
        const result = await listUsers({ maxResults: 500 });
        const users = result.users;

        if (users.length === 0) {
            container.innerHTML = `
                <div style="padding:40px; text-align:center; color:#94a3b8;">
                    <i class="fas fa-users" style="font-size:3rem; margin-bottom:15px;"></i>
                    <p>No users found</p>
                </div>
            `;
            return;
        }

        renderUserTable(users);
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = `
            <div style="padding:40px; text-align:center; color:#ef4444;">
                <i class="fas fa-exclamation-circle" style="font-size:2rem;"></i>
                <p>Failed to load users</p>
                <p style="font-size:0.9rem; margin-top:10px;">${error.message}</p>
            </div>
        `;
    }
}

function renderUserTable(users) {
    const container = document.getElementById('user-management-container');
    
    let html = `
        <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:2px solid rgba(255,255,255,0.1);">
                        <th style="padding:12px; text-align:left;">User</th>
                        <th style="padding:12px;">Email</th>
                        <th style="padding:12px;">Role</th>
                        <th style="padding:12px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    users.forEach(user => {
        const roleClass = getRoleBadgeClass(user.role);
        html += `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${user.photoURL ? 
                            `<img src="${user.photoURL}" style="width:32px; height:32px; border-radius:50%;">` :
                            `<div style="width:32px; height:32px; border-radius:50%; background:rgba(78,205,196,0.2); display:flex; align-items:center; justify-content:center; color:var(--teal-glow); font-weight:600;">${(user.displayName || user.email || 'U')[0].toUpperCase()}</div>`
                        }
                        <span>${user.displayName || 'Unnamed User'}</span>
                    </div>
                </td>
                <td style="padding:12px; color:#94a3b8;">${user.email || 'N/A'}</td>
                <td style="padding:12px; text-align:center;">
                    <span class="${roleClass}" style="padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600;">
                        ${user.role}
                    </span>
                </td>
                <td style="padding:12px; text-align:center;">
                    <select onchange="handleRoleChange('${user.uid}', this.value)" 
                            style="background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); padding:6px 12px; border-radius:6px; cursor:pointer;">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                        <option value="peer" ${user.role === 'peer' ? 'selected' : ''}>Peer</option>
                        <option value="psychologist" ${user.role === 'psychologist' ? 'selected' : ''}>Psychologist</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

window.handleRoleChange = async function(uid, newRole) {
    if (!confirm(`Are you sure you want to change this user's role to '${newRole}'?`)) {
        loadAllUsers(); // Reload to reset dropdown
        return;
    }

    try {
        await setRole(uid, newRole);
        alert(`✅ User role updated to '${newRole}'`);
        
        // Note: User needs to log out and back in (or refresh token) to get new role
        loadAllUsers();
    } catch (error) {
        alert(`❌ Failed to update role: ${error.message}`);
        loadAllUsers();
    }
};
```

---

### **Phase 4: Security Rules Update** (1 hour)

#### Update `firestore.rules`

**Add helper functions at top:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Check if user has specific role
    function hasRole(requiredRole) {
      return request.auth != null && request.auth.token.role == requiredRole;
    }
    
    // Helper: Check if user has any of the specified roles
    function hasAnyRole(roles) {
      return request.auth != null && request.auth.token.role in roles;
    }
    
    // Helper: Check if user is admin
    function isAdmin() {
      return hasRole('admin');
    }
```

**Update existing rules to use role checks:**
```javascript
    // Example: Admin-only collections
    match /adminLogs/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // Example: Peer applications - admins and peers can read/write
    match /peers/{document=**} {
      allow read: if request.auth != null;
      allow create: if true; // Public submission
      allow update, delete: if request.auth != null || hasAnyRole(['admin', 'peer']);
    }
    
    // Example: Psychologist applications
    match /psychologists/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null || hasAnyRole(['admin', 'psychologist']);
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### **Phase 5: Testing & Deployment** (2 hours)

#### 5.1 Deploy Cloud Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

#### 5.2 Test Functions Locally
```bash
firebase emulators:start --only functions,auth,firestore
```

#### 5.3 Test Scenarios

| Test | Expected Result |
|------|-----------------|
| Call `listUsers()` without auth | ❌ Error: unauthenticated |
| Call `listUsers()` as non-admin | ❌ Error: permission-denied |
| Call `listUsers()` as admin | ✅ Returns user list |
| Call `setRole()` as admin | ✅ Role updated |
| Call `setRole()` as non-admin | ❌ Error: permission-denied |
| Create new user via signup | ✅ Default role 'user' assigned |
| Approve application | ✅ Role assigned + status updated |

---

## 📊 Migration Strategy

### Current State → Future State

| Feature | Current | Future |
|---------|---------|--------|
| **Role Storage** | Firestore `users/{uid}/role` | Firebase Auth Custom Claims |
| **Role Check** | Client-side Firestore read | `getIdTokenResult().claims.role` |
| **Security** | Firestore Rules (UID-based) | Firestore Rules (token.role-based) |
| **Admin Dashboard** | Direct Firestore writes | Cloud Functions |

### Migration Steps

1. **Deploy Cloud Functions** (read-only initially)
2. **Test with admin account** (verify claims work)
3. **Update admin dashboard** to use Cloud Functions
4. **Update Firestore Rules** to check `request.auth.token.role`
5. **Backfill existing users** with custom claims (one-time script)
6. **Remove old role assignment logic** from client

---

## 🧪 Testing Checklist

### Cloud Functions
- [ ] `listUsers()` returns users with roles
- [ ] `setRole()` updates claims successfully
- [ ] `approveApplication()` updates both claims and Firestore
- [ ] `onUserCreate()` assigns default role
- [ ] Non-admin users cannot call admin functions
- [ ] Unauthenticated users get proper errors

### Admin Dashboard
- [ ] User list loads from Cloud Function
- [ ] Role dropdown updates role via Cloud Function
- [ ] Success/error messages display correctly
- [ ] Token refresh happens after role change

### Security Rules
- [ ] Admin can access admin-only collections
- [ ] Non-admin cannot access admin collections
- [ ] Role-based rules work in production

---

## 📁 Files Summary

### Created (New)
| File | Lines | Purpose |
|------|-------|---------|
| `functions/src/index.ts` | 20 | Main entry point |
| `functions/src/roles/list-users.ts` | 60 | List users function |
| `functions/src/roles/set-role.ts` | 50 | Set role function |
| `functions/src/roles/approve-application.ts` | 70 | Approve application |
| `functions/src/triggers/on-user-create.ts` | 40 | Default role trigger |
| `functions/src/roles/index.ts` | 5 | Barrel export |
| `assets/js/admin-role-manager.js` | 100 | Client service |

**Total New:** ~345 lines

### Modified
| File | Changes | Purpose |
|------|---------|---------|
| `functions/package.json` | +20 | Dependencies |
| `functions/tsconfig.json` | +30 | TypeScript config |
| `portal/admin-dashboard.html` | ~150 | Call Cloud Functions |
| `firestore.rules` | ~50 | Role-based rules |

**Total Modified:** ~250 lines

---

## 🚀 Next Steps

1. **Review this plan** with user
2. **Implement Phase 1-2** (Cloud Functions)
3. **Test locally** with emulators
4. **Deploy to production**
5. **Update admin dashboard** (Phase 3)
6. **Update security rules** (Phase 4)
7. **Full testing** (Phase 5)

---

## ⚠️ Important Notes

1. **Custom Claims Propagation**: After setting claims, user must refresh token (log out/in or call `getIdTokenResult(true)`)
2. **Claim Size Limit**: Custom claims limited to 1000 bytes total
3. **Rate Limits**: `setCustomUserClaims()` limited to 10 calls per second
4. **Security**: Never expose Admin SDK on client - always use Cloud Functions

---

**Report Generated:** March 20, 2026  
**Developer:** Qwen Code  
**Estimated Implementation Time:** 8-10 hours  
**Complexity:** Medium-High

---

*End of Implementation Plan - Ready to begin Phase 1* 🚀
