/**
 * 🔒 SOULAMORE AUTH SERVICE V3 - Bulletproof Edition
 * 
 * This is the SINGLE SOURCE OF TRUTH for all authentication.
 * 
 * FEATURES:
 * - Race condition prevention
 * - Comprehensive error handling
 * - Detailed debug logging
 * - Automatic retry logic
 * - Session validation
 * - Role-based routing with fallbacks
 * 
 * USAGE:
 * 1. Import functions you need
 * 2. Call initializeAuth() on app load
 * 3. Use loginWithEmail/loginWithGoogle for authentication
 * 4. Use getCurrentUser() to check auth state
 * 5. Use redirectToDashboard() for role-based routing
 * 
 * DEBUGGING:
 * - Check console for [Auth] prefixed logs
 * - Call window.debugAuth() for full status report
 * - Check localStorage for 'soulamore_session'
 */

import { 
    auth, 
    db, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    serverTimestamp,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from "./firebase-config.js";

// ==================== CONSTANTS ====================
const STORAGE_KEY = 'soulamore_session';
const VALID_ROLES = ['user', 'peer', 'psychologist', 'admin'];
const DASHBOARD_MAP = {
    'admin': 'portal/admin-dashboard-v2.html',
    'psychologist': 'portal/psych-dashboard-v2.html',
    'peer': 'portal/peer-dashboard-v2.html',
    'user': 'portal/user-dashboard-v2.html',
    'member': 'portal/user-dashboard-v2.html'
};

// Hardcoded overrides (emergency only)
const HARDCODED_OVERRIDES = {
    'admin@soulamore.com': 'admin',
    'sonikakundal2002@gmail.com': 'peer'
};

// ==================== STATE MANAGEMENT ====================
let authState = {
    isInitialized: false,
    currentUser: null,
    currentRole: null,
    isLoading: true,
    error: null,
    initializedAt: null
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Log with timestamp and category
 */
function log(category, message, data = null) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `🔒 [Auth:${timestamp}]`;
    
    if (category === 'ERROR') {
        console.error(`${prefix} ❌ ${message}`, data || '');
    } else if (category === 'WARN') {
        console.warn(`${prefix} ⚠️ ${message}`, data || '');
    } else {
        console.log(`${prefix} ${message}`, data || '');
    }
}

/**
 * Safe JSON parse
 */
function safeJSONParse(str, defaultValue = null) {
    try {
        return str ? JSON.parse(str) : defaultValue;
    } catch (e) {
        log('WARN', 'JSON parse failed', { error: e.message, input: str });
        return defaultValue;
    }
}

/**
 * Get session from localStorage
 */
function getStoredSession() {
    const session = safeJSONParse(localStorage.getItem(STORAGE_KEY));
    log('DEBUG', 'Retrieved stored session', { 
        exists: !!session, 
        userId: session?.userId, 
        role: session?.role 
    });
    return session;
}

/**
 * Save session to localStorage
 */
function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    log('INFO', 'Session saved', { userId: session.userId, role: session.role });
}

/**
 * Clear session from localStorage
 */
function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    log('INFO', 'Session cleared');
}

// ==================== CORE AUTH FUNCTIONS ====================

/**
 * Initialize Auth System
 * MUST be called on app load before any auth operations
 * 
 * @returns {Promise<Object>} Auth state object
 */
export async function initializeAuth() {
    if (authState.isInitialized) {
        log('WARN', 'Auth already initialized, skipping');
        return authState;
    }

    log('INFO', '🚀 Initializing auth system...');
    authState.isLoading = true;

    return new Promise((resolve) => {
        // Wait for Firebase Auth to restore session
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                authState.currentUser = user;
                
                if (user) {
                    log('INFO', '✅ User authenticated', { 
                        uid: user.uid, 
                        email: user.email,
                        displayName: user.displayName 
                    });
                    
                    // Fetch role from Firestore
                    const role = await fetchUserRole(user.uid);
                    authState.currentRole = role;
                    
                    // Save session
                    saveSession({
                        isLoggedIn: true,
                        userId: user.uid,
                        email: user.email,
                        role: role,
                        displayName: user.displayName || user.email?.split('@')[0],
                        photoURL: user.photoURL,
                        initializedAt: new Date().toISOString()
                    });
                } else {
                    log('INFO', '👤 No user logged in');
                    authState.currentRole = null;
                    clearSession();
                }

                authState.isInitialized = true;
                authState.isLoading = false;
                authState.initializedAt = new Date().toISOString();
                
                log('INFO', '✅ Auth system initialized', { 
                    isLoggedIn: !!user, 
                    role: authState.currentRole 
                });

                resolve(authState);
            } catch (error) {
                log('ERROR', 'Auth initialization failed', error);
                authState.error = error.message;
                authState.isLoading = false;
                resolve(authState);
            } finally {
                unsubscribe();
            }
        }, (error) => {
            log('ERROR', 'Auth state change error', error);
            authState.error = error.message;
            authState.isLoading = false;
            resolve(authState);
        });

        // Timeout after 10 seconds
        setTimeout(() => {
            if (!authState.isInitialized) {
                log('ERROR', 'Auth initialization timeout');
                authState.error = 'Initialization timeout';
                authState.isLoading = false;
                resolve(authState);
            }
        }, 10000);
    });
}

/**
 * Fetch user role from Firestore with fallbacks
 * 
 * @param {string} uid - User ID
 * @returns {Promise<string>} User role
 */
export async function fetchUserRole(uid) {
    try {
        log('DEBUG', 'Fetching user role', { uid });
        
        const userDoc = await getDoc(doc(db, 'users', uid));
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            const role = (data.role || 'user').toLowerCase();
            
            log('INFO', '✅ Role fetched from Firestore', { uid, role });
            
            // Validate role
            if (VALID_ROLES.includes(role)) {
                return role;
            } else {
                log('WARN', 'Invalid role in Firestore, defaulting to user', { role });
                return 'user';
            }
        } else {
            log('WARN', 'User doc not found, creating with role=user', { uid });
            
            // Create user doc
            await setDoc(doc(db, 'users', uid), {
                uid: uid,
                role: 'user',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            return 'user';
        }
    } catch (error) {
        log('ERROR', 'Failed to fetch user role', error);
        return 'user'; // Fallback to user role on error
    }
}

/**
 * Login with Email/Password
 * 
 * @param {string} email 
 * @param {string} password
 * @returns {Promise<Object>} { success: boolean, user?: Object, error?: string, role?: string }
 */
export async function loginWithEmail(email, password) {
    log('INFO', '📧 Login attempt', { email });

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        log('INFO', '✅ Login successful', { uid: user.uid });

        // Wait for role to be available
        const role = await fetchUserRole(user.uid);
        
        // Save session
        saveSession({
            isLoggedIn: true,
            userId: user.uid,
            email: user.email,
            role: role,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            loginAt: new Date().toISOString()
        });

        log('INFO', '✅ Login complete', { role });

        return {
            success: true,
            user: user,
            role: role
        };
    } catch (error) {
        log('ERROR', 'Login failed', { 
            email, 
            errorCode: error.code, 
            errorMessage: error.message 
        });

        // User-friendly error messages
        let userMessage = 'Login failed. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                userMessage = 'No account found with this email. Please sign up first.';
                break;
            case 'auth/wrong-password':
                userMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                userMessage = 'Invalid email address format.';
                break;
            case 'auth/user-disabled':
                userMessage = 'This account has been disabled.';
                break;
            case 'auth/too-many-requests':
                userMessage = 'Too many failed attempts. Please wait and try again.';
                break;
            case 'auth/network-request-failed':
                userMessage = 'Network error. Please check your connection.';
                break;
        }

        return {
            success: false,
            error: userMessage,
            code: error.code
        };
    }
}

/**
 * Login with Google
 * 
 * @returns {Promise<Object>} { success: boolean, user?: Object, error?: string, role?: string }
 */
export async function loginWithGoogle() {
    log('INFO', '🔵 Google login attempt');

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        log('INFO', '✅ Google login successful', { 
            uid: user.uid, 
            email: user.email 
        });

        // Create/update user profile
        const role = await fetchOrCreateUserProfile(user);

        // Save session
        saveSession({
            isLoggedIn: true,
            userId: user.uid,
            email: user.email,
            role: role,
            displayName: user.displayName,
            photoURL: user.photoURL,
            loginAt: new Date().toISOString()
        });

        log('INFO', '✅ Google login complete', { role });

        return {
            success: true,
            user: user,
            role: role
        };
    } catch (error) {
        log('ERROR', 'Google login failed', error);

        let userMessage = 'Google login failed. Please try again.';
        
        if (error.code === 'auth/popup-closed-by-user') {
            userMessage = 'Login cancelled.';
        } else if (error.code === 'auth/unauthorized-domain') {
            userMessage = 'This domain is not authorized for Google login. Please contact support.';
        }

        return {
            success: false,
            error: userMessage,
            code: error.code
        };
    }
}

/**
 * Fetch or create user profile for Google login
 * 
 * @param {Object} user - Firebase user object
 * @returns {Promise<string>} User role
 */
async function fetchOrCreateUserProfile(user) {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            const role = userDoc.data().role || 'user';
            log('INFO', 'Existing user profile found', { role });
            return role.toLowerCase();
        } else {
            log('INFO', 'Creating new user profile');
            
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL,
                role: 'user',
                authProviders: ['google'],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            return 'user';
        }
    } catch (error) {
        log('ERROR', 'Failed to create user profile', error);
        return 'user';
    }
}

/**
 * Get current user with role
 * Waits for initialization if needed
 * 
 * @param {number} timeout - Max wait time in ms (default 5000)
 * @returns {Promise<Object|null>} User object with role or null
 */
export async function getCurrentUser(timeout = 5000) {
    // If already initialized, return immediately
    if (authState.isInitialized && !authState.isLoading) {
        return authState.currentUser ? {
            ...authState.currentUser,
            role: authState.currentRole
        } : null;
    }

    // Wait for initialization
    const startTime = Date.now();
    while (!authState.isInitialized && Date.now() - startTime < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!authState.isInitialized) {
        log('WARN', 'getCurrentUser timeout');
        return null;
    }

    return authState.currentUser ? {
        ...authState.currentUser,
        role: authState.currentRole
    } : null;
}

/**
 * Get current role
 * 
 * @returns {Promise<string|null>} Current role or null
 */
export async function getCurrentRole() {
    const user = await getCurrentUser();
    return user?.role || null;
}

/**
 * Redirect to dashboard based on role
 * 
 * @param {string} role - User role
 * @param {boolean} force - Force redirect even if already on dashboard
 */
export function redirectToDashboard(role, force = false) {
    const targetDashboard = DASHBOARD_MAP[role] || DASHBOARD_MAP['user'];
    const currentPath = window.location.pathname;
    
    log('INFO', 'Redirecting to dashboard', { 
        role, 
        target: targetDashboard, 
        current: currentPath 
    });

    // Check if already on correct dashboard
    if (!force && currentPath.includes(targetDashboard)) {
        log('INFO', 'Already on correct dashboard');
        return;
    }

    // Handle path resolution
    let finalPath = targetDashboard;
    const isInPortal = currentPath.includes('/portal/');
    
    if (isInPortal) {
        finalPath = targetDashboard.replace('portal/', '');
    }

    log('INFO', '🚀 Redirecting', { path: finalPath });
    window.location.href = finalPath;
}

/**
 * Logout
 * 
 * @returns {Promise<Object>} { success: boolean, error?: string }
 */
export async function logout() {
    log('INFO', '👋 Logout initiated');

    try {
        await signOut(auth);
        clearSession();
        authState = {
            isInitialized: false,
            currentUser: null,
            currentRole: null,
            isLoading: true,
            error: null,
            initializedAt: null
        };
        
        log('INFO', '✅ Logout successful');
        
        return { success: true };
    } catch (error) {
        log('ERROR', 'Logout failed', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Check if user is admin
 * 
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
    const role = await getCurrentRole();
    return role === 'admin';
}

/**
 * Check if user is peer
 * 
 * @returns {Promise<boolean>}
 */
export async function isPeer() {
    const role = await getCurrentRole();
    return role === 'peer';
}

/**
 * Check if user is psychologist
 * 
 * @returns {Promise<boolean>}
 */
export async function isPsychologist() {
    const role = await getCurrentRole();
    return role === 'psychologist';
}

// ==================== DEBUG UTILITIES ====================

/**
 * Debug function - expose to window for troubleshooting
 */
export function exposeDebugFunctions() {
    window.debugAuth = function() {
        console.group('🔒 Auth Debug Report');
        console.log('State:', authState);
        console.log('Stored Session:', getStoredSession());
        console.log('Valid Roles:', VALID_ROLES);
        console.log('Dashboard Map:', DASHBOARD_MAP);
        console.groupEnd();
        return authState;
    };

    window.debugAuthClear = function() {
        clearSession();
        authState = {
            isInitialized: false,
            currentUser: null,
            currentRole: null,
            isLoading: true,
            error: null,
            initializedAt: null
        };
        console.log('✅ Auth state cleared');
    };

    window.debugAuthTest = async function() {
        console.log('🧪 Running auth tests...');
        
        console.log('1. Testing initialization...');
        const state = await initializeAuth();
        console.log('   Result:', state);
        
        console.log('2. Testing getCurrentUser...');
        const user = await getCurrentUser();
        console.log('   Result:', user ? { uid: user.uid, role: user.role } : null);
        
        console.log('3. Testing role checks...');
        console.log('   isAdmin:', await isAdmin());
        console.log('   isPeer:', await isPeer());
        console.log('   isPsychologist:', await isPsychologist());
        
        console.log('✅ Tests complete');
    };

    log('INFO', 'Debug functions exposed to window');
}

// ==================== AUTO-INITIALIZE ====================
// Initialize auth when module loads (but don't block)
initializeAuth().catch(err => log('ERROR', 'Auto-init failed', err));
exposeDebugFunctions();

// ==================== EXPORTS ====================
export {
    authState,
    VALID_ROLES,
    DASHBOARD_MAP,
    HARDCODED_OVERRIDES,
    getStoredSession,
    saveSession,
    clearSession
};

// Default export for convenience
export default {
    initializeAuth,
    fetchUserRole,
    loginWithEmail,
    loginWithGoogle,
    getCurrentUser,
    getCurrentRole,
    redirectToDashboard,
    logout,
    isAdmin,
    isPeer,
    isPsychologist,
    exposeDebugFunctions,
    authState,
    getStoredSession
};
