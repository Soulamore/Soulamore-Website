/**
 * Auth Service
 * Handles Google Login, Email/Pass Login, and User Session.
 */
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, linkWithCredential, FacebookAuthProvider, PhoneAuthProvider, RecaptchaVerifier, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPhoneNumber, EmailAuthProvider } from "./firebase-config.js";

/**
 * Sign Up with Email/Password
 */
export async function signUpWithEmail(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Ideally updateProfile here (but requires another import 'updateProfile')
        // For MVP we just return user
        console.log("Registered:", user.uid);
        return { success: true, user: user };
    } catch (error) {
        console.error("SignUp Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign In with Email/Password
 */
export async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Email login success:", userCredential.user.email);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Email Login Error:", error);
        // Return error code for better debugging
        const errorCode = error.code || error.message;
        const errorMessage = error.message || 'Unknown error occurred';
        return { success: false, error: errorMessage, code: errorCode };
    }
}

/**
 * Sign In with Google
 */
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Google Login Success:", user.displayName);
        return { success: true, user: user };
    } catch (error) {
        console.error("Google Login Error:", error);
        // Return error code for better debugging
        const errorCode = error.code || error.message;
        const errorMessage = error.message || 'Unknown error occurred';
        return { success: false, error: errorMessage, code: errorCode };
    }
}

/**
 * Logout
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        // localStorage.removeItem('user_role'); // Legacy
        localStorage.removeItem('soulamore_session'); // Core Session
        sessionStorage.clear(); // Clear all temp data
        return { success: true };
    } catch (error) {
        console.error("Logout Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Update Password
 */
export async function updateUserPassword(newPassword) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");

        await updatePassword(user, newPassword);
        return { success: true };
    } catch (error) {
        console.error("Update Password Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Link Google Account
 */
export async function linkGoogleAccount() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");

        const result = await linkWithPopup(user, googleProvider);
        return { success: true, user: result.user };
    } catch (error) {
        console.error("Link Account Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Auth State Listener
 * Use this in dashboard to detect login status
 */

/**
 * Sign In with Email Link (Passwordless Start)
 */
export async function startEmailLogin(email) {
    const actionCodeSettings = {
        // TODO: Update URL to your production domain or localhost
        url: window.location.origin + '/portal/verify-email.html',
        handleCodeInApp: true
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        return { success: true };
    } catch (error) {
        console.error("Email Link Error:", error);
        return { success: false, error: calmErrorHandler(error) };
    }
}

/**
 * Complete Email Link Login (Verify)
 */
export async function completeEmailLogin(url) {
    try {
        if (isSignInWithEmailLink(auth, url)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened link on different device, ask for email
                email = window.prompt('Please provide your email for confirmation');
            }
            const result = await signInWithEmailLink(auth, email, url);
            window.localStorage.removeItem('emailForSignIn');
            return { success: true, user: result.user };
        }
        return { success: false, error: "Invalid link" };
    } catch (error) {
        console.error("Email Verify Error:", error);
        return { success: false, error: calmErrorHandler(error) };
    }
}

/**
 * Sign In with Phone (Start)
 * Note: verifier MUST be a RecaptchaVerifier instance created in UI
 */
export async function startPhoneLogin(phoneNumber, verifier) {
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        return { success: true, confirmationResult };
    } catch (error) {
        console.error("Phone Auth Error:", error);
        return { success: false, error: calmErrorHandler(error) };
    }
}

/**
 * Complete Phone Login (Verify Code)
 */
export async function completePhoneLogin(confirmationResult, code) {
    try {
        const result = await confirmationResult.confirm(code);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: calmErrorHandler(error) };
    }
}

/**
 * Sign In with Facebook
 */
export async function loginWithFacebook() {
    try {
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return { success: true, user: result.user };
    } catch (error) {
        // Handle Account Linking Error specifically
        if (error.code === 'auth/account-exists-with-different-credential') {
            return { success: false, error: "Account exists. Please login with your original method to link.", credential: error.customData.email };
        }
        return { success: false, error: calmErrorHandler(error) };
    }
}

/**
 * Unify Account (Link Credentials)
 * Use when a user is already signed in (or we catch an error) and want to link methods.
 */
export async function unifyAccount(credential) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in to link.");

        await linkWithCredential(user, credential);
        return { success: true };
    } catch (error) {
        return { success: false, error: calmErrorHandler(error) };
    }
}

/**
 * Calm Error Handler
 * Converts scary Firebase errors into gentle human text.
 */
function calmErrorHandler(error) {
    const code = error.code || '';
    if (code.includes('auth/invalid-email')) return "That email doesn't look quite right.";
    if (code.includes('auth/user-not-found')) return "We couldn't find an account with that email.";
    if (code.includes('auth/wrong-password')) return "The password didn't match. Try again.";
    if (code.includes('auth/email-already-in-use')) return "That email is already connected to an account.";
    if (code.includes('auth/popup-closed-by-user')) return "Sign in was cancelled.";
    if (code.includes('auth/invalid-verification-code')) return "That code wasn't right. You can try again.";
    if (code.includes('auth/code-expired')) return "The code expired. Let's send a new one.";

    return "Something didn't go as planned. Please try again.";
}

/**
 * Auth State Listener (Existing wrapper)
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            callback(null);
        }
    });
}
