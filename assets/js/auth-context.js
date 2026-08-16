
/**
 * auth-context.js
 * Handles role verification and routing after successful Firebase Auth.
 * Uses RoleHelper as source of truth.
 */

import { db, doc, getDoc } from "./firebase-config.js";
import { getUserRole } from "./role-helper.js";

export async function handleRoleRouting(user, intent, isNewUser = false) {
    console.log('[AuthContext] handleRoleRouting called');
    console.log('[AuthContext] User:', user.email, user.uid);
    console.log('[AuthContext] Intent:', intent);

    // --- Persistent Session Logic ---
    const session = {
        isLoggedIn: true,
        userId: user.uid,
        role: 'user', // Will be updated from RoleHelper
        email: user.email
    };

    // Helper to commit session and redirect
    const finalizeSession = (role, dashboardFile) => {
        session.role = role;

        // Ensure name and photo are in session for the UI
        session.name = user.displayName || user.email?.split('@')[0] || 'User';
        session.photoURL = user.photoURL || '../assets/images/default-avatar.png';

        localStorage.setItem("soulamore_session", JSON.stringify(session));

        // Use absolute path from root to avoid 404
        let finalPath = dashboardFile;
        if (!finalPath.startsWith('/')) {
            finalPath = '/' + finalPath;
        }
        if (!finalPath.startsWith('/portal/')) {
            finalPath = '/portal' + finalPath.replace(/^\//, '');
        }

        console.log(`✅ Session Created for [${role}]. Redirecting to ${finalPath}...`);
        window.location.replace(finalPath);
    };

    // 0. NEW USER ONBOARDING (First time login)
    if (isNewUser && intent === 'user') {
        const confirmMsg = "Welcome to Soulamore! Would you like to complete your profile now?";
        if (confirm(confirmMsg)) {
            finalizeSession('user', '/portal/user-dashboard-v2.html?showProfile=true');
            return;
        }
    }

    try {
        // 2. ROBUST ROLE VERIFICATION - Use RoleHelper
        console.log('[AuthContext] Fetching robust role via RoleHelper...');
        const roleInfo = await getUserRole(user.uid, user.email);
        const role = roleInfo.role;
        const displayRole = roleInfo.displayRole;

        console.log('[AuthContext] Role detected:', role, '| Display:', displayRole);

        // Fetch user doc for setup status
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Route based on role
        if (role === 'admin') {
            finalizeSession('admin', 'portal/admin-dashboard-v2.html');
            return;
        }

        if (role === 'peer') {
            finalizeSession('peer', 'portal/peer-dashboard-v2.html');
            return;
        }

        if (role === 'psychologist') {
            finalizeSession('psychologist', 'portal/psych-dashboard-v2.html');
            return;
        }

        // Default: user dashboard v2
        finalizeSession('user', 'portal/user-dashboard-v2.html');

    } catch (error) {
        console.error('[AuthContext] Routing Error:', error);
        // Fallback to user dashboard v2 on error
        finalizeSession('user', 'portal/user-dashboard-v2.html');
    }
}
