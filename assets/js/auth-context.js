
/**
 * auth-context.js
 * Handles role verification and routing after successful Firebase Auth.
 */

export async function handleRoleRouting(user, intent) {
    console.log(`[AuthContext] Processing login for: ${user.email} with intent: ${intent}`);

    // SAVE USER SESSION for Dashboard UI
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous
    };
    sessionStorage.setItem('user', JSON.stringify(userData));

    // In a real app, we would fetch the 'roles' document from Firestore here.
    // For this prototype, we'll simulate verification or check custom claims if available.

    // For now, allow 'user' intent always.
    if (intent === 'user') {
        sessionStorage.setItem('userRole', 'user');
        window.location.href = 'user-dashboard.html';
        return;
    }

    if (intent === 'peer') {
        // VERIFICATION CHECK
        const isVerifiedPeer = true; // FORCE TRUE FOR TESTING UI

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
        // VERIFICATION CHECK
        const isVerifiedPsych = true; // FORCE TRUE FOR TESTING UI

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
}
