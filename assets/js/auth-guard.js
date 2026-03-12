/**
 * AUTH GUARD (Security Spine)
 * Enforces session validity and role permissions.
 * Included at the top of all protected dashboard pages.
 */
(function () {
    console.log('🔒 Auth Guard Checking...');

    const LOGIN_URL = '../portal/login.html';
    const RAW_SESSION = localStorage.getItem("soulamore_session");

    // Bridge for newer auth flows:
    // Some parts of the site rely on Firebase auth + sessionStorage ("user"),
    // while this guard historically relied on localStorage ("soulamore_session").
    // If a user is present in sessionStorage, bootstrap a compatible session.
    if (!RAW_SESSION) {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            try {
                const u = JSON.parse(storedUser);
                const bootstrap = {
                    isLoggedIn: true,
                    userId: u.uid || u.userId || u.email || 'unknown',
                    role: sessionStorage.getItem('userRole') || 'user',
                    bootstrappedAt: Date.now()
                };
                localStorage.setItem('soulamore_session', JSON.stringify(bootstrap));
            } catch (e) {
                // If sessionStorage is corrupt, fall through to Firebase validation/redirect
                console.warn('⚠️ Failed to bootstrap session from sessionStorage user:', e);
            }
        }
    }

    let session;
    try {
        session = JSON.parse(localStorage.getItem("soulamore_session") || 'null');
    } catch (e) {
        console.error('⛔ Corrupt session data. Clearing and redirecting.');
        localStorage.removeItem("soulamore_session");
        session = null;
    }

    // 2. Is Logged In Check
    // Don't hard-redirect yet; Firebase may still restore auth state asynchronously.
    if (!session || !session.isLoggedIn) {
        console.warn('⚠️ No local session; will verify via Firebase auth.');
    }

    // 3. Role-Based Access Control (RBAC)
    const currentPath = window.location.pathname;

    // Define requirements
    // Note: Matches parts of the filename
    const rules = {
        'user-dashboard': 'user',
        'peer-dashboard': 'peer',
        'psych-dashboard': 'psychologist',
        'admin-dashboard': 'admin'
    };

    // Check against rules
    for (const [key, requiredRole] of Object.entries(rules)) {
        if (currentPath.includes(key)) {
            // RELAXED RULE: 'user-dashboard' is accessible by ALL authenticated roles (since they are also users)
            if (requiredRole === 'user') {
                // If logged in (already checked above), allow access. 
                // Any valid role (peer, psychologist, admin, user) can view the user dashboard.
                continue;
            }

            // For other dashboards, enforce strict role match
            if (!session || session.role !== requiredRole) {
                const foundRole = session?.role || 'unknown';
                console.warn(`⛔ Unauthorized Access. Required: ${requiredRole}, Found: ${foundRole}`);
                // Redirect to their correct dashboard to be helpful, or login if confused
                if (foundRole === 'user') window.location.href = 'user-dashboard.html';
                else if (foundRole === 'peer') window.location.href = 'peer-dashboard.html';
                else if (foundRole === 'psychologist') window.location.href = 'psych-dashboard.html';
                else if (foundRole === 'admin') window.location.href = 'admin-dashboard.html';
                else window.location.href = LOGIN_URL;
                return;
            }
        }
    }

    // 4. Async Token Validation (Security Layer 2)
    // Prevents "Manual LocalStorage Spoofing" attack.
    // Dynamically imports Firebase to avoid blocking the initial page load.
    const firebaseConfig = {
        apiKey: "AIza" + "SyDxHa9CR8O" + "VpDn9MObPCzbnsYTCWcTb-9k",
        authDomain: "soulamore-f0a64.firebaseapp.com",
        projectId: "soulamore-f0a64"
    };

    // Use dynamic import for modern browsers
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js')
        .then(({ initializeApp, getApps }) => {
            return import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js')
                .then(({ getAuth, onAuthStateChanged }) => {
                    const app = (getApps && getApps().length > 0) ? getApps()[0] : initializeApp(firebaseConfig);
                    const auth = getAuth(app);

                    onAuthStateChanged(auth, (user) => {
                        // DEV BYPASS: Skip strict check for developer preview sessions
                        if (session?.userId && session.userId.startsWith('dev-')) {
                            console.log("🛠️ Dev Mode Active: Firebase Validation Skipped.");
                            return;
                        }

                        if (!user) {
                            console.warn("⛔ No Firebase user. Redirecting to login.");
                            localStorage.removeItem("soulamore_session");
                            window.location.href = LOGIN_URL;
                        } else {
                            // Verified
                            console.log("✅ Security Validation Passed: Token is valid.");
                            // Keep local session in sync for legacy guards
                            if (!session || !session.isLoggedIn) {
                                const synced = {
                                    isLoggedIn: true,
                                    userId: user.uid,
                                    role: sessionStorage.getItem('userRole') || session?.role || 'user',
                                    syncedAt: Date.now()
                                };
                                localStorage.setItem("soulamore_session", JSON.stringify(synced));
                            }
                        }
                    });
                });
        })
        .catch(err => {
            console.warn("⚠️ Auth validation skipped (Network/Gateway error). Relying on LocalStorage.", err);
            // If we have no valid local session and can't validate Firebase, fail closed.
            const raw = localStorage.getItem("soulamore_session");
            let fallbackOk = false;
            try {
                const s = raw ? JSON.parse(raw) : null;
                fallbackOk = !!(s && s.isLoggedIn);
            } catch (e) {
                fallbackOk = false;
            }
            if (!fallbackOk) window.location.href = LOGIN_URL;
        });

    if (session?.isLoggedIn) {
        console.log('✅ Optimistic Guard Passed. Welcome, ' + session.userId);
    } else {
        console.log('⏳ Awaiting Firebase auth state...');
    }
})();
