/**
 * Auth Service
 * Handles Google Login, Email/Pass Login, and User Session.
 */
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, linkWithPopup } from "./firebase-config.js";

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
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, error: error.message };
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
        return { success: false, error: error.message };
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
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            callback(null);
        }
    });
}
