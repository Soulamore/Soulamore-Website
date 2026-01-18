
/**
 * auth-context.js
 * Handles role verification and routing after successful Firebase Auth.
 */

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function handleRoleRouting(user, intent) {
    // Role routing after successful authentication

    // SAVE USER SESSION for Dashboard UI
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous
    };
    sessionStorage.setItem('user', JSON.stringify(userData));

    // ALWAYS allow 'user' intent (default role)
    if (intent === 'user') {
        sessionStorage.setItem('userRole', 'user');
        window.location.href = 'user-dashboard.html';
        return;
    }

    // For peer/psychologist: verify role in Firestore
    try {
        const db = getFirestore();
        const roleDocRef = doc(db, 'roles', user.uid);
        const roleDoc = await getDoc(roleDocRef);

        if (intent === 'peer') {
            // Check if user has verified peer role
            const isVerifiedPeer = roleDoc.exists() && roleDoc.data().peer === true;

            if (isVerifiedPeer) {
                sessionStorage.setItem('userRole', 'peer');
                window.location.href = 'peer-dashboard.html';
            } else {
                alert("Status: Application Pending. You are not yet verified as a Peer. Redirecting to User Dashboard.");
                sessionStorage.setItem('userRole', 'user');
                window.location.href = 'user-dashboard.html';
            }
            return;
        }

        if (intent === 'psychologist') {
            // Check if user has verified psychologist role
            const isVerifiedPsych = roleDoc.exists() && roleDoc.data().psychologist === true;

            if (isVerifiedPsych) {
                sessionStorage.setItem('userRole', 'psychologist');
                window.location.href = 'psych-dashboard.html';
            } else {
                alert("Status: Not Verified. Professional access restricted. Redirecting to User Dashboard.");
                sessionStorage.setItem('userRole', 'user');
                window.location.href = 'user-dashboard.html';
            }
            return;
        }
    } catch (error) {
        console.error('[AuthContext] Role verification error:', error.code || error.message);
        // On error, default to user dashboard for safety
        alert("Unable to verify professional status. Redirecting to User Dashboard.");
        sessionStorage.setItem('userRole', 'user');
        window.location.href = 'user-dashboard.html';
    }
}
