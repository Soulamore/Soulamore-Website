
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
    const finalizeSession = (role, dashboard) => {
        session.role = role;
        localStorage.setItem("soulamore_session", JSON.stringify(session));
        console.log(`✅ Session Created for [${role}]. Redirecting to ${dashboard}...`);
        window.location.href = dashboard;
    };

    // 1. ADMIN (Simple Check for MVP)
    if (intent === 'admin') {
        // In a real app, verify admin claim here. For MVP, we trust the intent or check specific email
        // const isAdmin = user.email.endsWith('@soulamore.com'); // Example constraint
        finalizeSession('admin', 'admin-dashboard.html');
        return;
    }

    // 2. USER (Default)
    if (intent === 'user') {
        finalizeSession('user', 'user-dashboard.html');
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
                finalizeSession('peer', 'peer-dashboard.html');
            } else {
                alert("Status: Application Pending. You are not yet verified as a Peer. Redirecting to User Dashboard.");
                finalizeSession('user', 'user-dashboard.html');
            }
            return;
        }

        if (intent === 'psychologist') {
            const isVerifiedPsych = roleDoc.exists() && roleDoc.data().psychologist === true;
            if (isVerifiedPsych) {
                finalizeSession('psychologist', 'psych-dashboard.html');
            } else {
                alert("Status: Not Verified. Professional access restricted. Redirecting to User Dashboard.");
                finalizeSession('user', 'user-dashboard.html');
            }
            return;
        }

    } catch (error) {
        console.error('[AuthContext] Role verification error:', error);
        alert("Unable to verify professional status. Redirecting to User Dashboard.");
        finalizeSession('user', 'user-dashboard.html');
    }
}
