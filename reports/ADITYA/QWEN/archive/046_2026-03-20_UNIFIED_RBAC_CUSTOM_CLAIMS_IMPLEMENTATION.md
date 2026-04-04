# 🔐 Unified Implementation Plan: RBAC with Firebase Custom Claims
**Date:** March 20, 2026  
**Contributors:** Qwen Code + ANTIGRAVITY (Google Deepmind)  
**Session:** Admin Dashboard - Production-Grade Role-Based Access Control  
**Status:** 📋 READY FOR IMPLEMENTATION  

---

## 📋 Executive Summary

**Unified approach** combining Qwen's detailed Cloud Functions architecture with ANTIGRAVITY's RBAC transformation strategy. This implementation transitions Soulamore from client-side role checks to **cryptographically secure Firebase Custom Claims**.

### Why This Matters:
| Current State (V1) | Proposed State (V2) |
|--------------------|--------------------|
| ❌ Firestore-based roles (client-writable) | ✅ Firebase Auth claims (signed, immutable) |
| ❌ localStorage/sessionStorage sync | ✅ Automatic via `getIdTokenResult()` |
| ❌ In-page JavaScript enforcement | ✅ `auth-guard.js` middleware |
| ❌ Slow Firestore lookups in rules | ✅ Fast `request.auth.token.role` checks |

---

## 🎯 Implementation Objectives

1. **Deploy 3 Cloud Functions** for role management
2. **Update Auth Guard** to verify token claims before routing
3. **Refactor Admin Dashboard** to use Cloud Functions
4. **Deploy Firestore Rules V2** with token-based checks
5. **Promote existing admin** to Custom Claims (one-time script)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD (Frontend)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  auth-guard.js (V2) - Token verification before routing  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  admin-role-manager.js - Cloud Function client layer    │  │
│  │  - listUsers()                                           │  │
│  │  - setRole(targetUid, newRole)                          │  │
│  │  - approveApplication()                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (HTTPS Callable Functions)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              CLOUD FUNCTIONS (Backend - Secure)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. assignDefaultRole() - Trigger: auth.user().onCreate  │  │
│  │     → Assigns 'user' role to new signups                 │  │
│  │     → Creates Firestore profile                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  2. setRole() - Callable (Admin only)                    │  │
│  │     → Verifies caller is admin                           │  │
│  │     → Sets custom claims via Admin SDK                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  3. listUsers() - Callable (Admin only)                  │  │
│  │     → Fetches users from Firebase Auth                   │  │
│  │     → Includes custom claims in response                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  4. approveApplication() - Callable (Admin only)         │  │
│  │     → Approves peer/psychologist applications            │  │
│  │     → Sets role + updates Firestore status               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (Firebase Admin SDK)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              FIREBASE AUTH + FIRESTORE                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Auth: Users with custom claims (role, createdAt)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Firestore: User profiles, applications, bookings        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Security Rules V2: request.auth.token.role checks       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Files Structure

### Cloud Functions (Backend)
```
functions/
├── src/
│   ├── index.ts                  # Main entry point
│   ├── config.ts                 # Firebase config
│   ├── roles/
│   │   ├── index.ts              # Barrel export
│   │   ├── list-users.ts         # List users with claims
│   │   ├── set-role.ts           # Assign/update role
│   │   └── approve-application.ts # Approve peer/psych
│   └── triggers/
│       └── on-user-create.ts     # Default role assignment
├── package.json
└── tsconfig.json
```

### Client-Side (Frontend)
```
assets/js/
├── firebase-config.js            # Existing Firebase init
├── auth-guard.js                 # UPDATED: Token verification
└── admin-role-manager.js         # NEW: Cloud Function client

portal/
└── admin-dashboard.html          # UPDATED: Use Cloud Functions
```

### Security
```
firestore.rules                   # UPDATED: Token-based rules
```

---

## 🔧 Implementation Phases

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

/**
 * List all users with their custom claims
 * Admin-only function
 */
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

/**
 * Assign or update a user's custom claim role
 * Admin-only function
 */
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

/**
 * Approve a peer or psychologist application
 * Sets custom claim role + updates Firestore status
 * Admin-only function
 */
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

/**
 * Trigger: Automatically assign default role when new user signs up
 */
export const onUserCreate = functions.auth.user().onCreate(async (user): Promise<void> => {
  const customClaims = {
    role: 'user', // Default role
    createdAt: new Date().toISOString()
  };

  try {
    // 1. Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    console.log(`✅ Default role 'user' assigned to ${user.uid}`);

    // 2. Create user profile in Firestore
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

#### 3.2 Update `assets/js/auth-guard.js`

**Add token verification before role routing:**
```javascript
import { auth } from './firebase-config.js';
import { getCurrentUserRole } from './admin-role-manager.js';

// ... existing code ...

/**
 * Enhanced role verification with Custom Claims
 */
async function verifyUserRole() {
    const user = auth.currentUser;
    if (!user) return 'anonymous';

    try {
        // Force token refresh to get latest claims
        const idTokenResult = await user.getIdTokenResult(true);
        const role = idTokenResult.claims.role || 'user';
        
        console.log('✅ Verified user role:', role);
        return role;
    } catch (error) {
        console.error('❌ Error verifying role:', error);
        return 'user';
    }
}

// Update handleRoleRouting to use verified role
async function handleRoleRouting(user) {
    const role = await verifyUserRole();
    
    // Store in sessionStorage for quick access
    sessionStorage.setItem('userRole', role);
    
    // Route based on verified role
    switch(role) {
        case 'admin':
            window.location.href = '/portal/admin-dashboard.html';
            break;
        case 'psychologist':
            window.location.href = '/portal/psych-dashboard.html';
            break;
        case 'peer':
            window.location.href = '/portal/peer-dashboard.html';
            break;
        default:
            window.location.href = '/portal/user-dashboard.html';
    }
}
```

#### 3.3 Update `portal/admin-dashboard.html`

**Replace user management section:**
```javascript
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

window.handleRoleChange = async function(uid, newRole) {
    if (!confirm(`Are you sure you want to change this user's role to '${newRole}'?`)) {
        loadAllUsers(); // Reload to reset dropdown
        return;
    }

    try {
        await setRole(uid, newRole);
        alert(`✅ User role updated to '${newRole}'\n\nNote: User must log out and back in to receive new role.`);
        loadAllUsers();
    } catch (error) {
        alert(`❌ Failed to update role: ${error.message}`);
        loadAllUsers();
    }
};
```

---

### **Phase 4: Firestore Security Rules V2** (1 hour)

#### Update `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // === HELPER FUNCTIONS ===
    
    // Check if user has specific role
    function hasRole(requiredRole) {
      return request.auth != null && request.auth.token.role == requiredRole;
    }
    
    // Check if user has any of the specified roles
    function hasAnyRole(roles) {
      return request.auth != null && request.auth.token.role in roles;
    }
    
    // Check if user is admin
    function isAdmin() {
      return hasRole('admin');
    }
    
    // Check if user is owner
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    // === USER PROFILES ===
    match /users/{userId} {
      allow read: if request.auth != null; // Any authenticated user can read
      allow create: if isOwner(userId); // Users can create their own profile
      allow update, delete: if isOwner(userId) || isAdmin(); // Owner or admin
    }

    // === ACTIVE FEATURES ===

    // Peer Application Forms
    match /peers/{document=**} {
      allow read: if request.auth != null;
      allow create: if true; // Public submission
      allow update, delete: if request.auth != null || hasAnyRole(['admin', 'peer']);
    }

    // Psychologist Application Forms
    match /psychologists/{document=**} {
      allow read: if request.auth != null;
      allow create: if true; // Public submission
      allow update, delete: if request.auth != null || hasAnyRole(['admin', 'psychologist']);
    }

    // Confession Box
    match /confessions/{document=**} {
      allow read: if request.auth != null;
      allow create: if true; // Anonymous submission
      allow update, delete: if isAdmin(); // Admins only
    }

    // Peer Bookings
    match /peer_bookings/{bookingId} {
      allow read: if (request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      resource.data.peerId == request.auth.uid))
                     || isAdmin();
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if (request.auth != null && 
                       ((resource.data.userId == request.auth.uid && resource.data.status == 'pending_payment') ||
                        (resource.data.peerId == request.auth.uid && resource.data.status in ['pending_payment', 'confirmed'])))
                       || isAdmin();
      allow delete: if (request.auth != null && 
                       resource.data.userId == request.auth.uid && 
                       resource.data.status == 'pending_payment')
                       || isAdmin();
    }

    // Admin-only collections
    match /adminLogs/{document=**} {
      allow read, write: if isAdmin();
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### **Phase 5: One-Time Admin Promotion Script** (30 minutes)

#### Create `scripts/promote-admin.js`
```javascript
/**
 * One-time script to promote existing user to admin via Custom Claims
 * Run this AFTER deploying Cloud Functions
 */

const admin = require('firebase-admin');

// Initialize Admin SDK
const serviceAccount = require('../serviceAccountKey.json'); // Download from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function promoteUserToAdmin(userEmail) {
  try {
    // 1. Get user by email
    const userRecord = await admin.auth().getUserByEmail(userEmail);
    
    // 2. Get current claims
    const currentClaims = userRecord.customClaims || {};
    
    // 3. Add admin role
    const updatedClaims = {
      ...currentClaims,
      role: 'admin'
    };
    
    // 4. Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, updatedClaims);
    
    console.log(`✅ User ${userEmail} (${userRecord.uid}) promoted to admin`);
    console.log('⚠️  User must log out and back in to receive new role');
    
  } catch (error) {
    console.error('❌ Error promoting user:', error);
  }
}

// Run script
const ADMIN_EMAIL = 'admin@soulamore.com'; // Replace with your admin email
promoteUserToAdmin(ADMIN_EMAIL);
```

---

### **Phase 6: Testing & Deployment** (2 hours)

#### 6.1 Deploy Cloud Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

#### 6.2 Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

#### 6.3 Test Scenarios

| Test | Expected Result |
|------|-----------------|
| Call `listUsers()` without auth | ❌ Error: unauthenticated |
| Call `listUsers()` as non-admin | ❌ Error: permission-denied |
| Call `listUsers()` as admin | ✅ Returns user list |
| Call `setRole()` as admin | ✅ Role updated |
| Call `setRole()` as non-admin | ❌ Error: permission-denied |
| Create new user via signup | ✅ Default role 'user' assigned |
| Approve application | ✅ Role assigned + status updated |
| Access admin dashboard without admin role | ❌ Redirected to user dashboard |
| Access admin dashboard with admin role | ✅ Access granted |

---

## 📊 Migration Strategy

### Current State → Future State

| Feature | Current | Future | Migration |
|---------|---------|--------|-----------|
| **Role Storage** | Firestore `users/{uid}/role` | Firebase Auth Custom Claims | Backfill script |
| **Role Check** | Client-side Firestore read | `getIdTokenResult().claims.role` | Update auth-guard |
| **Security** | Firestore Rules (UID-based) | Firestore Rules (token.role-based) | Deploy rules V2 |
| **Admin Dashboard** | Direct Firestore writes | Cloud Functions | Update UI |

### Backfill Existing Users

```javascript
// Run once to backfill all existing users with 'user' role
const admin = require('firebase-admin');
admin.initializeApp();

async function backfillUserRoles() {
  const db = admin.firestore();
  const usersSnapshot = await db.collection('users').get();
  
  let count = 0;
  for (const doc of usersSnapshot.docs) {
    const userData = doc.data();
    const role = userData.role || 'user';
    
    try {
      await admin.auth().setCustomUserClaims(doc.id, { role });
      count++;
      console.log(`✅ Backfilled ${doc.id} with role: ${role}`);
    } catch (error) {
      console.error(`❌ Failed to backfill ${doc.id}:`, error);
    }
  }
  
  console.log(`🎉 Backfilled ${count} users`);
}

backfillUserRoles();
```

---

## 🧪 Verification Checklist

### Cloud Functions
- [ ] `listUsers()` returns users with roles
- [ ] `setRole()` updates claims successfully
- [ ] `approveApplication()` updates both claims and Firestore
- [ ] `onUserCreate()` assigns default role
- [ ] Non-admin users cannot call admin functions
- [ ] Unauthenticated users get proper errors

### Auth Guard
- [ ] Token refresh happens on page load
- [ ] Role verified before routing
- [ ] Non-admin redirected from admin dashboard
- [ ] Admin can access all dashboards

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
| `scripts/promote-admin.js` | 30 | One-time admin promotion |

**Total New:** ~375 lines

### Modified
| File | Changes | Purpose |
|------|---------|---------|
| `functions/package.json` | +20 | Dependencies |
| `functions/tsconfig.json` | +30 | TypeScript config |
| `assets/js/auth-guard.js` | ~50 | Token verification |
| `portal/admin-dashboard.html` | ~100 | Call Cloud Functions |
| `firestore.rules` | ~80 | Role-based rules |

**Total Modified:** ~280 lines

---

## ⚠️ Important Notes

1. **Token Propagation Delay**: After setting claims, user must refresh token (log out/in or call `getIdTokenResult(true)`)
2. **Claim Size Limit**: Custom claims limited to 1000 bytes total
3. **Rate Limits**: `setCustomUserClaims()` limited to 10 calls per second
4. **Security**: Never expose Admin SDK on client - always use Cloud Functions

---

## 🚀 Next Steps

1. **Review this unified plan** with user
2. **Implement Phase 1-2** (Cloud Functions)
3. **Run backfill script** for existing users
4. **Promote admin account** to Custom Claims
5. **Test locally** with emulators
6. **Deploy to production**
7. **Update admin dashboard** (Phase 3)
8. **Deploy security rules** (Phase 4)
9. **Full testing** (Phase 6)

---

**Report Generated:** March 20, 2026  
**Contributors:** Qwen Code + ANTIGRAVITY  
**Estimated Implementation Time:** 8-10 hours  
**Complexity:** Medium-High

---

*Unified Implementation Plan - Ready to begin Phase 1* 🚀
