/**
 * Admin Role Manager - Client-side service for role management
 * Securely calls Cloud Functions for role operations
 * 
 * FEATURES:
 * - List all users with their roles (admin only)
 * - Assign/update user roles (admin only)
 * - Approve peer/psychologist applications (admin only)
 * - Force token refresh after role changes
 * 
 * @version 1.0.0
 * @date March 20, 2026
 */

import { auth, functionsInstance, httpsCallable } from './firebase-config.js';

/**
 * List all users with their roles from Firebase Auth
 * Requires admin role
 * 
 * @param {Object} options - Query options
 * @param {number} options.maxResults - Max users to fetch (default: 100)
 * @param {string} options.nextPageToken - Token for pagination
 * @returns {Promise<{users: Array<{uid, email, displayName, role, createdAt, lastSignInTime}>, nextPageToken?: string}>}
 */
export async function listUsers(options = {}) {
    const { maxResults = 100, nextPageToken = undefined } = options;

    const user = auth.currentUser;
    if (!user) {
        throw new Error('User must be authenticated');
    }

    // Force token refresh to ensure we have admin claims
    await user.getIdToken(true);

    try {
        console.log('📋 Fetching user list from Cloud Function...');
        const listUsersFn = httpsCallable(functionsInstance, 'listUsers');
        const result = await listUsersFn({ maxResults, nextPageToken });
        
        console.log('✅ Loaded', result.data.users.length, 'users');
        return result.data;
    } catch (error) {
        console.error('❌ Error listing users:', error);
        
        // Parse Cloud Function error
        if (error.code === 'permission-denied') {
            throw new Error('Access denied: Admin role required');
        } else if (error.code === 'unauthenticated') {
            throw new Error('Please log in to continue');
        }
        
        throw error;
    }
}

/**
 * Assign or update a user's role via Cloud Function
 * Requires admin role
 * 
 * @param {string} targetUid - User ID to update
 * @param {string} newRole - New role ('user' | 'peer' | 'psychologist' | 'admin')
 * @returns {Promise<{message: string}>}
 */
export async function setRole(targetUid, newRole) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User must be authenticated');
    }

    // Validate role
    const ALLOWED_ROLES = ['user', 'peer', 'psychologist', 'admin'];
    if (!ALLOWED_ROLES.includes(newRole)) {
        throw new Error(`Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}`);
    }

    // Force token refresh
    await user.getIdToken(true);

    try {
        console.log('🔄 Setting role for', targetUid, 'to', newRole);
        const setRoleFn = httpsCallable(functionsInstance, 'setRole');
        const result = await setRoleFn({ targetUid, newRole });
        
        console.log('✅ Role updated:', result.data.message);
        
        // Note: User whose role was changed needs to refresh token
        // This will happen automatically on next login or manual refresh
        return result.data;
    } catch (error) {
        console.error('❌ Error setting role:', error);
        
        if (error.code === 'permission-denied') {
            throw new Error('Access denied: Admin role required');
        } else if (error.code === 'not-found') {
            throw new Error('User not found');
        }
        
        throw error;
    }
}

/**
 * Approve a peer or psychologist application
 * Sets custom claim role + updates Firestore status
 * Requires admin role
 * 
 * @param {string} applicationId - Application document ID
 * @param {'peers' | 'psychologists'} collection - Collection name
 * @param {'peer' | 'psychologist'} newRole - Role to assign
 * @returns {Promise<{message: string}>}
 */
export async function approveApplication(applicationId, collection, newRole) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User must be authenticated');
    }

    // Validate parameters
    if (!['peers', 'psychologists'].includes(collection)) {
        throw new Error('Invalid collection. Must be "peers" or "psychologists"');
    }

    if (!['peer', 'psychologist'].includes(newRole)) {
        throw new Error('Invalid role. Must be "peer" or "psychologist"');
    }

    await user.getIdToken(true);

    try {
        console.log('✅ Approving application:', applicationId, 'in', collection);
        const approveFn = httpsCallable(functionsInstance, 'approveApplication');
        const result = await approveFn({ applicationId, collection, newRole });
        
        console.log('✅ Application approved:', result.data.message);
        return result.data;
    } catch (error) {
        console.error('❌ Error approving application:', error);
        
        if (error.code === 'permission-denied') {
            throw new Error('Access denied: Admin role required');
        } else if (error.code === 'not-found') {
            throw new Error('Application not found');
        }
        
        throw error;
    }
}

/**
 * Get current user's role from ID token claims
 * @returns {Promise<string>} User role
 */
export async function getCurrentUserRole() {
    const user = auth.currentUser;
    if (!user) {
        return 'anonymous';
    }

    try {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || 'user';
        return role;
    } catch (error) {
        console.error('❌ Error getting user role:', error);
        return 'user';
    }
}

/**
 * Force refresh user's ID token to get updated custom claims
 * Call this after role changes to get fresh claims
 */
export async function refreshUserToken() {
    const user = auth.currentUser;
    if (!user) {
        console.warn('⚠️ No user logged in - cannot refresh token');
        return;
    }

    try {
        console.log('🔄 Refreshing user token...');
        await user.getIdToken(true);
        console.log('✅ Token refreshed successfully');
        
        // Update sessionStorage with new role
        const role = await getCurrentUserRole();
        sessionStorage.setItem('userRole', role);
        
        // Update localStorage session
        const session = {
            isLoggedIn: true,
            userId: user.uid,
            role: role,
            email: user.email,
            refreshedAt: Date.now()
        };
        localStorage.setItem('soulamore_session', JSON.stringify(session));
        
    } catch (error) {
        console.error('❌ Error refreshing token:', error);
    }
}

/**
 * Check if current user has admin role
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
    const role = await getCurrentUserRole();
    return role === 'admin';
}

/**
 * Wait for admin verification before executing callback
 * Useful for admin-only page initialization
 * 
 * @param {Function} callback - Function to call if user is admin
 * @param {Function} onNotAdmin - Function to call if user is not admin (optional)
 */
export async function requireAdmin(callback, onNotAdmin) {
    const user = auth.currentUser;
    if (!user) {
        console.error('❌ User not authenticated');
        if (onNotAdmin) onNotAdmin();
        return;
    }

    try {
        const idTokenResult = await user.getIdTokenResult(true);
        const role = idTokenResult.claims.role;

        if (role === 'admin') {
            console.log('✅ Admin verified');
            callback();
        } else {
            console.warn('⛔ User is not an admin. Role:', role);
            if (onNotAdmin) {
                onNotAdmin();
            } else {
                // Default: redirect to user dashboard
                window.location.href = 'user-dashboard.html';
            }
        }
    } catch (error) {
        console.error('❌ Error verifying admin:', error);
        if (onNotAdmin) onNotAdmin();
    }
}

// Auto-refresh token on page load if user is logged in
// This ensures we have the latest custom claims
if (typeof window !== 'undefined') {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log('🔄 Auto-refreshing token for', user.email);
            await refreshUserToken();
        }
    });
}

console.log('✅ Admin Role Manager loaded - Custom Claims client ready');
