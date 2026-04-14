/**
 * 🔒 UNIFIED AUTH GUARD V3 - Bulletproof Edition
 * 
 * SINGLE AUTH GUARD FOR ALL DASHBOARDS
 * 
 * Features:
 * - No flicker (uses stored session for immediate redirect)
 * - Comprehensive logging
 * - Automatic retry on failure
 * - Graceful degradation
 * 
 * USAGE:
 * Include in HTML head:
 * <script src="../assets/js/auth-guard-v3.js" defer></script>
 * 
 * DEBUGGING:
 * - Check console for [AuthGuard] logs
 * - Call window.checkAuth() for status
 * - Call window.forceAuthRedirect() to manually redirect
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        LOGIN_URL: '../portal/login.html',
        INIT_TIMEOUT: 8000,
        REDIRECT_DELAY: 100,
        STORAGE_KEY: 'soulamore_session',
        DEBUG: true // Set to false in production
    };

    // ==================== DASHBOARD MAPPING ====================
    const DASHBOARD_RULES = {
        'admin-dashboard': { allowed: ['admin'], redirect: 'portal/admin-dashboard.html' },
        'psych-dashboard': { allowed: ['psychologist'], redirect: 'portal/psych-dashboard.html' },
        'peer-dashboard': { allowed: ['peer'], redirect: 'portal/peer-dashboard.html' },
        'user-dashboard': { allowed: ['user', 'member', 'peer', 'psychologist', 'admin'], redirect: 'portal/user-dashboard.html' }
    };

    // ==================== STATE ====================
    let guardState = {
        isChecking: false,
        isComplete: false,
        currentUser: null,
        currentRole: null,
        error: null
    };

    // ==================== UTILITY FUNCTIONS ====================
    function log(level, message, data = null) {
        if (!CONFIG.DEBUG && level === 'DEBUG') return;
        
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const prefix = `🔒 [AuthGuard:${timestamp}]`;
        const msg = `${prefix} ${message}`;
        
        if (level === 'ERROR') {
            console.error(msg, data || '');
        } else if (level === 'WARN') {
            console.warn(msg, data || '');
        } else {
            console.log(msg, data || '');
        }
    }

    function getStoredSession() {
        try {
            const session = localStorage.getItem(CONFIG.STORAGE_KEY);
            return session ? JSON.parse(session) : null;
        } catch (e) {
            log('ERROR', 'Failed to parse stored session', e);
            return null;
        }
    }

    function getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        for (const [pageKey, config] of Object.entries(DASHBOARD_RULES)) {
            if (path.includes(pageKey)) {
                return { key: pageKey, config };
            }
        }
        return null;
    }

    // ==================== CORE AUTH CHECK ====================
    async function checkAuth() {
        if (guardState.isChecking) {
            log('DEBUG', 'Auth check already in progress');
            return guardState;
        }

        guardState.isChecking = true;
        log('INFO', '🔍 Starting auth check...');

        try {
            // Step 1: Check stored session (fast path)
            const session = getStoredSession();
            let hasValidLocalSession = false;
            
            if (session?.isLoggedIn && session?.userId && session?.role) {
                log('INFO', '✅ Valid stored session found, bypassing flicker while revalidating...', { 
                    userId: session.userId, 
                    role: session.role 
                });
                
                guardState.currentUser = { uid: session.userId, role: session.role };
                guardState.currentRole = session.role;
                guardState.isComplete = true;
                hasValidLocalSession = true;
            }

            log('DEBUG', 'Checking Firebase to secure/revalidate session...');

            // Step 2: Check Firebase Auth (slow path or background check)
            const { auth, onAuthStateChanged } = await import('./firebase-config.js');
            
            const firebasePromise = new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    log('WARN', 'Firebase auth timeout');
                    guardState.error = 'Auth timeout';
                    if (!hasValidLocalSession) {
                        guardState.isComplete = true;
                        resolve(guardState);
                    }
                }, CONFIG.INIT_TIMEOUT);

                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    clearTimeout(timeout);
                    
                    if (user) {
                        log('INFO', '✅ Firebase auth confirmed', { 
                            uid: user.uid, 
                            email: user.email 
                        });
                        
                        // Fetch role
                        try {
                            const { getFirestore, doc, getDoc } = await import('./firebase-config.js');
                            const db = getFirestore();
                            const userDoc = await getDoc(doc(db, 'users', user.uid));
                            
                            const role = userDoc.exists() ? (userDoc.data().role || 'user') : 'user';
                            
                            guardState.currentUser = { uid: user.uid, role };
                            guardState.currentRole = role;
                            
                            // Save session for next time
                            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                                isLoggedIn: true,
                                userId: user.uid,
                                role: role,
                                email: user.email
                            }));
                            
                            log('INFO', '✅ Auth validation complete', { role });
                        } catch (error) {
                            log('ERROR', 'Failed to fetch user role', error);
                            guardState.currentRole = 'user';
                        }
                    } else {
                        log('INFO', '❌ No Firebase user. Revoking auth access.');
                        guardState.error = 'Not authenticated';
                        localStorage.removeItem(CONFIG.STORAGE_KEY);
                        if (hasValidLocalSession) {
                            log('WARN', '🚫 Stored session invalid/expired. Forcing redirect to login.');
                            window.location.href = CONFIG.LOGIN_URL;
                        }
                    }
                    
                    guardState.isComplete = true;
                    // Note: We don't unsubscribe() immediately if we want to monitor continuous logout events, but to keep existing logic we unsubscribe 
                    // unless we want to act as a persistent listener. We will leave unsubscribe() to prevent memory leaks for this check.
                    unsubscribe();
                    
                    if (!hasValidLocalSession) {
                        resolve(guardState);
                    }
                }, (error) => {
                    log('ERROR', 'Firebase auth error', error);
                    guardState.error = error.message;
                    localStorage.removeItem(CONFIG.STORAGE_KEY);
                    if (hasValidLocalSession) {
                        window.location.href = CONFIG.LOGIN_URL;
                    } else {
                        guardState.isComplete = true;
                        resolve(guardState);
                    }
                });
            });

            if (hasValidLocalSession) {
                // Instantly return the local state to unblock UI render without waiting for Firebase
                return guardState;
            }

            // Await Firebase resolution if we have no local cache
            return firebasePromise;
        } catch (error) {
            log('ERROR', 'Auth check failed', error);
            guardState.error = error.message;
            guardState.isComplete = true;
            return guardState;
        } finally {
            guardState.isChecking = false;
        }
    }

    // ==================== REDIRECT LOGIC ====================
    function redirectToLogin() {
        log('WARN', '🚫 Redirecting to login');
        
        // Save current location for return
        sessionStorage.setItem('returnUrl', window.location.pathname);
        
        // Redirect
        window.location.href = CONFIG.LOGIN_URL;
    }

    function redirectToDashboard(role) {
        const currentPage = getCurrentPage();
        if (!currentPage) {
            log('DEBUG', 'Not on a dashboard page');
            return;
        }

        const { key, config } = currentPage;
        
        log('DEBUG', 'Checking dashboard access', { 
            page: key, 
            role: role, 
            allowed: config.allowed 
        });

        // Check if role is allowed
        if (config.allowed.includes(role.toLowerCase())) {
            log('INFO', '✅ Access granted to', key);
            return; // Stay on current page
        }

        // Redirect to correct dashboard
        log('WARN', '🚫 Role not allowed, redirecting', { 
            current: key, 
            role: role,
            target: config.redirect 
        });
        
        setTimeout(() => {
            window.location.href = config.redirect;
        }, CONFIG.REDIRECT_DELAY);
    }

    // ==================== MAIN EXECUTION ====================
    async function runAuthGuard() {
        log('INFO', '🛡️ Auth Guard starting...');

        try {
            // Wait for auth check
            const state = await checkAuth();

            if (!state.isComplete) {
                log('ERROR', 'Auth check did not complete');
                return;
            }

            // Check if authenticated
            if (!state.currentUser || state.error) {
                log('WARN', 'User not authenticated');
                redirectToLogin();
                return;
            }

            // Check dashboard access
            const role = state.currentRole;
            log('INFO', 'Checking role access', { role });
            
            redirectToDashboard(role);
            
            log('INFO', '✅ Auth Guard complete');
        } catch (error) {
            log('ERROR', 'Auth Guard failed', error);
            // Don't redirect on error - let user see the page
        }
    }

    // ==================== EXPOSE DEBUG FUNCTIONS ====================
    window.checkAuth = function() {
        console.group('🔒 Auth Guard Status');
        console.log('State:', guardState);
        console.log('Stored Session:', getStoredSession());
        console.log('Current Page:', getCurrentPage());
        console.groupEnd();
        return guardState;
    };

    window.forceAuthRedirect = function() {
        log('INFO', 'Manual redirect requested');
        runAuthGuard();
    };

    window.clearAuthSession = function() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        guardState = {
            isChecking: false,
            isComplete: false,
            currentUser: null,
            currentRole: null,
            error: null
        };
        console.log('✅ Auth session cleared');
    };

    // ==================== INITIALIZE ====================
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAuthGuard);
    } else {
        runAuthGuard();
    }

    log('INFO', 'Auth Guard v3 loaded');
})();
