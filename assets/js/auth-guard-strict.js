/**
 * AUTH GUARD V3 - STRICT Role-Based Access Control
 * BLOCKS access to dashboards unless user has correct role
 * 
 * ⚠️ SECURITY: Prevents unauthorized dashboard access
 */
(function () {
    console.log('🔒 Strict Auth Guard Loading...');

    const currentPath = window.location.pathname.toLowerCase();
    const LOGIN_URL = '../portal/login.html';
    
    // Dashboard role requirements (STRICT)
    const ROLE_RULES = {
        'user-dashboard': ['user', 'member'],
        'peer-dashboard': ['peer'],
        'psych-dashboard': ['psychologist'],
        'admin-dashboard': ['admin']
    };

    // Get user's role from Firestore
    async function getUserRole(uid, userEmail) {
        try {
            // HARDCODED BYPASSES (Match auth-context.js)
            const normalizedEmail = (userEmail || '').toLowerCase();

            // Admin Override
            if (normalizedEmail === 'admin@soulamore.com') {
                console.log('[AuthGuard] Hardcoded Admin detected.');
                return 'admin';
            }

            // Peer Test (Sonika)
            if (normalizedEmail === 'sonikakundal2002@gmail.com') {
                console.log('[AuthGuard] Hardcoded Peer (Sonika) detected.');
                return 'peer';
            }

            // Try Firestore
            const { getFirestore, doc, getDoc } = await import('./firebase-config.js');
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', uid));

            if (userDoc.exists()) {
                const role = userDoc.data().role?.toLowerCase() || 'user';
                console.log('✅ User role loaded from Firestore:', role);
                return role;
            }

            console.warn('⚠️ No user profile found');
            return 'user';
        } catch (err) {
            console.error('❌ Error loading role:', err);
            return 'user';
        }
    }

    // IMMEDIATELY redirect to correct dashboard
    function forceRedirectToDashboard(role) {
        const roleLower = role.toLowerCase();

        const dashboardMap = {
            'admin': '../portal/admin-dashboard.html',
            'psychologist': '../portal/psych-dashboard.html',
            'peer': '../portal/peer-dashboard.html',
            'user': '../portal/user-dashboard.html',
            'member': '../portal/user-dashboard.html'
        };

        const targetDashboard = dashboardMap[roleLower] || dashboardMap['user'];

        console.error('⛔ FORBIDDEN: Role', role, 'cannot access this dashboard. Redirecting to', targetDashboard);

        // Show forbidden message briefly then redirect
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: linear-gradient(135deg, #0f172a, #1e293b);
                color: white;
                font-family: sans-serif;
                text-align: center;
            ">
                <div>
                    <h1 style="font-size: 3rem; margin-bottom: 20px;">⛔ Access Denied</h1>
                    <p style="font-size: 1.2rem; margin-bottom: 30px;">
                        Your role (<strong>${role}</strong>) doesn't have access to this dashboard.
                    </p>
                    <p style="color: #94a3b8;">Redirecting to your dashboard...</p>
                </div>
            </div>
        `;

        // Redirect after 1.5 seconds
        setTimeout(() => {
            // Add redirect parameter to prevent login loop
            const loginWithRedirectParams = LOGIN_URL + '?redirected=true';
            window.location.href = loginWithRedirectParams;
        }, 1500);
    }

    // Main auth check - BLOCKS until verified
    async function runStrictAuthCheck() {
        try {
            const { getAuth, onAuthStateChanged } = await import('./firebase-config.js');
            const auth = getAuth();

            // Wait for auth state
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe(); // Stop listening after first trigger
                    resolve(user);
                });
            });

            // Get current user
            const user = auth.currentUser;
            
            if (!user) {
                console.log('⚠️ No user logged in, redirecting to login');
                window.location.href = LOGIN_URL + '?redirected=true';
                return;
            }

            console.log('✅ User authenticated:', user.email);

            // Get user's role from Firestore (with hardcoded bypasses)
            const role = await getUserRole(user.uid, user.email);

            // Store role in session storage
            sessionStorage.setItem('userRole', role);
            sessionStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: role
            }));
            
            // Check if user's role is allowed on this page
            let currentPage = '';
            let allowedRoles = [];
            
            for (const [pageKey, roles] of Object.entries(ROLE_RULES)) {
                if (currentPath.includes(pageKey)) {
                    currentPage = pageKey;
                    allowedRoles = roles;
                    break;
                }
            }
            
            // If not on a dashboard page, redirect to appropriate dashboard
            if (!currentPage) {
                console.log('📍 Not on a dashboard page, redirecting');
                forceRedirectToDashboard(role);
                return;
            }
            
            // STRICT CHECK: Block if role not allowed
            if (!allowedRoles.includes(role.toLowerCase())) {
                console.error('⛔ BLOCKED: Role', role, 'not allowed on', currentPage);
                forceRedirectToDashboard(role);
                return;
            }
            
            console.log('✅ Access GRANTED to', currentPage, 'for role:', role);
            // Allow page to continue loading
            
        } catch (error) {
            console.error('❌ Auth Guard failed:', error);
            // Fail CLOSED - redirect to login on error
            window.location.href = LOGIN_URL + '?redirected=true';
        }
    }

    // Run strict auth check IMMEDIATELY (blocks page load)
    runStrictAuthCheck();
    
    console.log('✅ Strict Auth Guard Active');
})();
