
/**
 * auth-context.js
 * Handles role verification and routing after successful Firebase Auth.
 */

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function handleRoleRouting(user, intent, isNewUser = false) {
    // Role routing after successful authentication

    // --- NEW: Persistent Session Logic (Admin Request Jan 18) ---
    const session = {
        isLoggedIn: true,
        userId: user.uid,
        role: intent, // Default role, verified below
        email: user.email
    };

    // Helper to commit session and redirect
    const finalizeSession = (role, dashboardFile) => {
        session.role = role;
        localStorage.setItem("soulamore_session", JSON.stringify(session));

        // FIX: Handle Relative Paths (Root vs Portal)
        let finalPath = dashboardFile;
        const isInPortal = window.location.pathname.includes('/portal/');

        if (isInPortal) {
            // If already in portal, remove 'portal/' prefix if present
            finalPath = dashboardFile.replace('portal/', '');
        } else {
            // If at root, ensure 'portal/' prefix is present
            if (!finalPath.startsWith('portal/')) {
                finalPath = 'portal/' + finalPath;
            }
        }

        console.log(`✅ Session Created for [${role}]. Redirecting to ${finalPath}...`);
        window.location.href = finalPath;
    };

    // 0. NEW USER ONBOARDING (First time login)
    if (isNewUser && intent === 'user') {
        const confirmMsg = "Welcome to Soulamore! Would you like to complete your profile now?";
        if (confirm(confirmMsg)) {
            // Redirect to Profile for completion
            // Assuming profile.html handles it, or pass a query param ?mode=edit
            // Using same path logic as finalizeSession but different target
            let profilePath = 'portal/user-dashboard.html?showProfile=true'; // Sending to dashboard but triggering profile view
            if (window.location.pathname.includes('/portal/')) {
                profilePath = 'user-dashboard.html?showProfile=true';
            }
            finalizeSession('user', profilePath);
            return;
        }
    }

    // 1. HARDCODED BYPASSES (Emergency Override)
    const normalizedEmail = (user.email || '').toLowerCase();
    
    // Admin Override
    if (normalizedEmail === 'admin@soulamore.com') {
        console.log('[AuthContext] Hardcoded Admin detected.');
        sessionStorage.setItem('userRole', 'admin');
        finalizeSession('admin', 'portal/admin-dashboard.html');
        return;
    }

    // Peer Test (Sonika)
    if (normalizedEmail === 'sonikakundal2002@gmail.com') {
        console.log('[AuthContext] Hardcoded Peer (Sonika) detected.');
        sessionStorage.setItem('userRole', 'peer');
        finalizeSession('peer', 'portal/peer-dashboard.html');
        return;
    }

    try {
        // 2. FIRESTORE ROLE VERIFICATION (Primary Source of Truth)
        const db = getFirestore();
        const roleDocRef = doc(db, 'roles', user.uid);
        const roleDoc = await getDoc(roleDocRef);
        const roleData = roleDoc.exists() ? roleDoc.data() : {};

        // A. SYSTEM ADMIN FLAG
        if (roleData.admin === true || intent === 'admin') {
            sessionStorage.setItem('userRole', 'admin');
            finalizeSession('admin', 'portal/admin-dashboard.html');
            return;
        }

        // B. PEER ROLE FLAG (or intent with existing flag)
        if (roleData.peer === true || intent === 'peer') {
            if (roleData.peer === true) {
                sessionStorage.setItem('userRole', 'peer');
                finalizeSession('peer', 'portal/peer-dashboard.html');
            } else if (intent === 'peer') {
                alert("Status: Application Pending. You are not yet verified as a Peer. Redirecting to User Dashboard.");
                finalizeSession('user', 'portal/user-dashboard.html');
            }
            return;
        }

        // C. PSYCHOLOGIST ROLE FLAG
        if (roleData.psychologist === true || intent === 'psychologist') {
            if (roleData.psychologist === true) {
                sessionStorage.setItem('userRole', 'psychologist');
                finalizeSession('psychologist', 'portal/psych-dashboard.html');
            } else if (intent === 'psychologist') {
                alert("Status: Not Verified. Professional access restricted. Redirecting to User Dashboard.");
                finalizeSession('user', 'portal/user-dashboard.html');
            }
            return;
        }

    } catch (error) {
        console.error('[AuthContext] Role verification error:', error);
    }

    // 3. DEFAULT: USER DASHBOARD
    finalizeSession('user', 'portal/user-dashboard.html');
}
