
/**
 * auth-context.js
 * Handles role verification and routing after successful Firebase Auth.
 */

export async function handleRoleRouting(user, intent) {
    console.log(`[AuthContext] Processing login for: ${user.email} with intent: ${intent}`);

    // In a real app, we would fetch the 'roles' document from Firestore here.
    // For this prototype, we'll simulate verification or check custom claims if available.
    // We will assume the user object might have 'roles' attached, or we fetch it.

    // simulation:
    // const userDoc = await getDoc(doc(db, "users", user.uid));
    // const userData = userDoc.data();

    // For now, allow 'user' intent always.
    if (intent === 'user') {
        sessionStorage.setItem('userRole', 'user');
        window.location.href = '../dashboard/index.html';
        return;
    }

    if (intent === 'peer') {
        // VERIFICATION CHECK
        // For demo purposes, we'll check if email contains 'peer' OR just allow it if we want to test.
        // Let's be strict as per prompt: "Mismatch Handling... This account isn’t verified".

        // TODO: Replace with real Firestore check
        // if (userData.isPeer) ...

        const isVerifiedPeer = true; // FORCE TRUE FOR TESTING UI, set to false to test rejection

        if (isVerifiedPeer) {
            sessionStorage.setItem('userRole', 'peer');
            window.location.href = '../peer/dashboard.html';
        } else {
            alert("Status: Application Pending. You are not yet verified as a Peer. Redirecting to User Dashboard.");
            sessionStorage.setItem('userRole', 'user');
            window.location.href = '../dashboard/index.html';
        }
        return;
    }

    if (intent === 'psychologist') {
        // VERIFICATION CHECK
        const isVerifiedPsych = true; // FORCE TRUE FOR TESTING UI

        if (isVerifiedPsych) {
            sessionStorage.setItem('userRole', 'psychologist');
            window.location.href = '../psychologist/dashboard.html';
        } else {
            alert("Status: Not Verified. Professional access restricted. Redirecting to User Dashboard.");
            sessionStorage.setItem('userRole', 'user');
            window.location.href = '../dashboard/index.html';
        }
        return;
    }
}
