/**
 * AUTH GUARD V2 - Role-Based Access Control
 * Redirects users to correct dashboard based on their role
 *
 * Roles: admin, psychologist, peer, user (member)
 */
(function () {
    console.log('🔒 Auth Guard Checking...');

    const currentPath = window.location.pathname.toLowerCase();
    const LOGIN_URL = '../portal/login.html';

    // Dashboard role requirements
    const ROLE_RULES = {
        'user-dashboard': ['user', 'member', 'peer', 'psychologist', 'admin'],
        'peer-dashboard': ['peer'],
        'psych-dashboard': ['psychologist'],
        'admin-dashboard': ['admin']
    };

    // Get user's role from Firestore
    async function getUserRole(uid) {
        try {
            const { getFirestore, doc, getDoc } = await import('./firebase-config.js');
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', uid));

            if (userDoc.exists()) {
                const role = userDoc.data().role?.toLowerCase() || 'user';
                console.log('✅ User role loaded:', role);
                return role;
            }

            console.warn('⚠️ No user profile found');
            return 'user';
        } catch (err) {
            console.error('❌ Error loading role:', err);
            return 'user';
        }
    }

    // Redirect to correct dashboard based on role
    function redirectToDashboard(role) {
        const roleLower = role.toLowerCase();

        // Map roles to dashboard URLs
        const dashboardMap = {
            'admin': '../portal/admin-dashboard.html',
            'psychologist': '../portal/psych-dashboard.html',
            'peer': '../portal/peer-dashboard.html',
            'user': '../portal/user-dashboard.html',
            'member': '../portal/user-dashboard.html'
        };

        const targetDashboard = dashboardMap[roleLower] || dashboardMap['user'];
        const currentDashboard = window.location.pathname;

        // Only redirect if not already on correct dashboard
        if (!currentDashboard.includes(targetDashboard)) {
            console.log('🔄 Redirecting to', roleLower, 'dashboard:', targetDashboard);
            window.location.href = targetDashboard;
        }
    }

    // Main auth check
    async function runAuthCheck() {
        try {
            const { getAuth, onAuthStateChanged } = await import('./firebase-config.js');
            const auth = getAuth();

            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    console.log('⚠️ No user logged in, redirecting to login');
                    window.location.href = LOGIN_URL;
                    return;
                }

                console.log('✅ User authenticated:', user.email);

                // Get user's role from Firestore
                const role = await getUserRole(user.uid);

                // Store role in session storage for quick access
                sessionStorage.setItem('userRole', role);

                // Check if user is on the correct dashboard for their role
                let currentPage = '';
                for (const [pageKey, allowedRoles] of Object.entries(ROLE_RULES)) {
                    if (currentPath.includes(pageKey)) {
                        currentPage = pageKey;

                        // Check if user's role is allowed on this page
                        if (!allowedRoles.includes(role.toLowerCase())) {
                            console.warn('⛔ Role', role, 'not allowed on', pageKey);
                            redirectToDashboard(role);
                        } else {
                            console.log('✅ Access granted to', pageKey, 'for role:', role);
                        }
                        break;
                    }
                }

                // If not on a dashboard page, redirect to appropriate dashboard
                if (!currentPage) {
                    console.log('📍 Not on a dashboard page, redirecting to', role, 'dashboard');
                    redirectToDashboard(role);
                }
            });

        } catch (error) {
            console.error('❌ Auth Guard failed:', error);
            // Fail open - allow access but log error
        }
    }

    // Run auth check
    runAuthCheck();

    console.log('✅ Auth Guard initialized');
})();
