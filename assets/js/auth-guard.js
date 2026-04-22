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

    // Dashboard role requirements - STRICT ENFORCEMENT
    const ROLE_RULES = {
        'user-dashboard': ['user', 'member'],
        'peer-dashboard': ['peer'],
        'psych-dashboard': ['psychologist'],
        'admin-dashboard': ['admin']
    };

    // Get user's role via RoleHelper (Standardized)
    async function getUserRole(uid, email) {
        try {
            const { getUserRole: getRobustRole } = await import('./role-helper.js');
            const roleInfo = await getRobustRole(uid, email);
            console.log('✅ User role loaded via RoleHelper:', roleInfo.role);
            return roleInfo.role;
        } catch (err) {
            console.error('❌ Error loading role via RoleHelper:', err);
            return 'user';
        }
    }

    // Redirect to correct dashboard based on role
    function redirectToDashboard(role) {
        const roleLower = role.toLowerCase();

        // Map roles to dashboard URLs (absolute paths)
        const dashboardMap = {
            'admin': '/portal/admin-dashboard.html',
            'psychologist': '/portal/psych-dashboard.html',
            'peer': '/portal/peer-dashboard.html',
            'user': '/portal/user-dashboard.html',
            'member': '/portal/user-dashboard.html'
        };

        const targetDashboard = dashboardMap[roleLower] || dashboardMap['user'];

        // Compare by filename to avoid relative vs absolute path mismatches
        const currentFile = window.location.pathname.split('/').pop();
        const targetFile = targetDashboard.split('/').pop();

        // Only redirect if not already on correct dashboard
        if (currentFile !== targetFile) {
            console.log('🔄 Redirecting to', roleLower, 'dashboard:', targetDashboard);
            window.location.replace(targetDashboard);
        }
    }

    // Main auth check
    async function runAuthCheck() {
        try {
            const { auth, onAuthStateChanged } = await import('./firebase-config.js');

            onAuthStateChanged(auth, async (user) => {
                // --- DEV BYPASS CHECK ---
                const session = JSON.parse(localStorage.getItem('soulamore_session') || '{}');
                const isDevSession = session.isLoggedIn && session.userId && session.userId.startsWith('dev-');

                if (!user && !isDevSession) {
                    console.log('⚠️ No user logged in, redirecting to login');
                    window.location.href = LOGIN_URL;
                    return;
                }

                console.log('✅ User authenticated:', user ? user.email : 'Dev Session');

                // Get user's role
                let role = isDevSession ? session.role : await getUserRole(user.uid, user.email);

                // Update role in session if needed
                if (session.role !== role) {
                    session.role = role;
                    localStorage.setItem('soulamore_session', JSON.stringify(session));
                }

                try {
                    const { redirectIfMaintenanceActive } = await import('./maintenance-mode.js');
                    const redirectedForMaintenance = await redirectIfMaintenanceActive({ role });
                    if (redirectedForMaintenance) {
                        console.warn('Maintenance mode active. Redirecting non-admin user.');
                        return;
                    }
                } catch (maintenanceError) {
                    console.warn('Maintenance check failed inside auth guard:', maintenanceError.message);
                }

                // 🔄 IMMEDIATE REDIRECT: Check if user is on correct dashboard
                let currentPage = '';
                for (const [pageKey, allowedRoles] of Object.entries(ROLE_RULES)) {
                    if (currentPath.includes(pageKey)) {
                        currentPage = pageKey;

                        // Check if user's role matches this dashboard
                        if (!allowedRoles.includes(role.toLowerCase())) {
                            console.warn('⛔ Role', role, 'not allowed on', pageKey, '- Redirecting to', role, 'dashboard');
                            redirectToDashboard(role);
                            return; // Exit immediately
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
