/**
 * Session Manager
 * Handles cross-tab authentication state synchronization
 */

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Cross-tab state synchronization
export function initCrossTabSync() {
    const auth = getAuth();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'authStateChanged') {
            const newAuthState = event.newValue;

            if (newAuthState === 'logged_out') {
                // User logged out in another tab - sync this tab
                console.log('[CrossTab] Logout detected in another tab');
                window.location.href = '/portal/login.html';
            } else if (newAuthState === 'logged_in') {
                // User logged in another tab - refresh this tab
                console.log('[CrossTab] Login detected in another tab');
                const userRole = localStorage.getItem('userRole');
                if (userRole && window.location.pathname.includes('login')) {
                    // Redirect to appropriate dashboard
                    let dashboard = 'user-dashboard.html';
                    if (userRole === 'peer') dashboard = 'peer-dashboard.html';
                    if (userRole === 'psychologist') dashboard = 'psych-dashboard.html';
                    window.location.href = dashboard;
                }
            }
        }
    });

    // Broadcaster: Notify other tabs of auth changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            localStorage.setItem('authStateChanged', 'logged_in');
            localStorage.setItem('userRole', sessionStorage.getItem('userRole') || 'user');
        } else {
            localStorage.setItem('authStateChanged', 'logged_out');
            localStorage.removeItem('userRole');
        }
    });
}

// Advanced session management
export class SessionManager {
    static SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
    static INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    static initActivityTracking() {
        let lastActivity = Date.now();

        const updateActivity = () => {
            lastActivity = Date.now();
            sessionStorage.setItem('lastActivity', lastActivity.toString());
        };

        // Track user activity
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });

        // Check for inactivity every minute
        setInterval(() => {
            const timeSinceActivity = Date.now() - lastActivity;

            if (timeSinceActivity > SessionManager.INACTIVITY_TIMEOUT) {
                console.log('[SessionManager] User inactive - logging out');
                alert('You have been logged out due to inactivity.');
                SessionManager.logout();
            }
        }, 60000); // Check every minute
    }

    static async logout() {
        const auth = getAuth();
        try {
            await auth.signOut();
            sessionStorage.clear();
            localStorage.setItem('authStateChanged', 'logged_out');
            window.location.href = '/portal/login.html';
        } catch (error) {
            console.error('[SessionManager] Logout error:', error);
        }
    }

    static isSessionValid() {
        const lastActivity = parseInt(sessionStorage.getItem('lastActivity') || '0');
        const timeSinceActivity = Date.now() - lastActivity;
        return timeSinceActivity < SessionManager.INACTIVITY_TIMEOUT;
    }
}
