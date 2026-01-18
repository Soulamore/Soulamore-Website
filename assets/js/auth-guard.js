/**
 * AUTH GUARD (Security Spine)
 * Enforces session validity and role permissions.
 * Included at the top of all protected dashboard pages.
 */
(function () {
    console.log('🔒 Auth Guard Checking...');

    const RAW_SESSION = localStorage.getItem("soulamore_session");

    // 1. Basic Existence Check
    if (!RAW_SESSION) {
        console.warn('⛔ No session found. Redirecting to login.');
        window.location.href = '../portal/login.html';
        return;
    }

    let session;
    try {
        session = JSON.parse(RAW_SESSION);
    } catch (e) {
        console.error('⛔ Corrupt session data. Clearing and redirecting.');
        localStorage.removeItem("soulamore_session");
        window.location.href = '../portal/login.html';
        return;
    }

    // 2. Is Logged In Check
    if (!session || !session.isLoggedIn) {
        console.warn('⛔ Session invalid or logged out.');
        window.location.href = '../portal/login.html';
        return;
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
            if (session.role !== requiredRole) {
                console.warn(`⛔ Unauthorized Access. Required: ${requiredRole}, Found: ${session.role}`);
                // Redirect to their correct dashboard to be helpful, or login if confused
                if (session.role === 'user') window.location.href = 'user-dashboard.html';
                else if (session.role === 'peer') window.location.href = 'peer-dashboard.html';
                else if (session.role === 'psychologist') window.location.href = 'psych-dashboard.html';
                else if (session.role === 'admin') window.location.href = 'admin-dashboard.html';
                else window.location.href = '../portal/login.html';
                return;
            }
        }
    }

    console.log('✅ Auth Guard Passed. Welcome, ' + session.userId);
})();
