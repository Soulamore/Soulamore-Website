
/**
 * auth-context.js
 * Handles role verification and routing after successful Firebase Auth.
 */

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function handleRoleRouting(user, intent) {
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

    // 1. ADMIN (Simple Check for MVP)
    if (intent === 'admin') {
        finalizeSession('admin', 'portal/admin-dashboard.html');
        return;
    }

    // 2. USER (Default)
    if (intent === 'user') {
        finalizeSession('user', 'portal/user-dashboard.html');
        return;
    }

    // 3. PEER & PSYCHOLOGIST (Firestore Verification)
    try {
        const db = getFirestore();
        const roleDocRef = doc(db, 'roles', user.uid);
        const roleDoc = await getDoc(roleDocRef);

        if (intent === 'peer') {
            const isVerifiedPeer = roleDoc.exists() && roleDoc.data().peer === true;
            if (isVerifiedPeer) {
                finalizeSession('peer', 'portal/peer-dashboard.html');
            } else {
                alert("Status: Application Pending. You are not yet verified as a Peer. Redirecting to User Dashboard.");
                finalizeSession('user', 'portal/user-dashboard.html');
            }
            return;
        }

        if (intent === 'psychologist') {
            const isVerifiedPsych = roleDoc.exists() && roleDoc.data().psychologist === true;
            if (isVerifiedPsych) {
                finalizeSession('psychologist', 'portal/psych-dashboard.html');
            } else {
                alert("Status: Not Verified. Professional access restricted. Redirecting to User Dashboard.");
                finalizeSession('user', 'portal/user-dashboard.html');
            }
            return;
        }

    } catch (error) {
        console.error('[AuthContext] Role verification error:', error);
        alert("Unable to verify professional status. Redirecting to User Dashboard.");
        finalizeSession('user', 'portal/user-dashboard.html');
    }
}
