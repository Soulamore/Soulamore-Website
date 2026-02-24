/**
 * Firebase Configuration & Initialization
 * Central hub for all backend connections.
 */

// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, limit, onSnapshot, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, PhoneAuthProvider, RecaptchaVerifier, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPhoneNumber, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, linkWithCredential, EmailAuthProvider, updatePassword, signInAnonymously, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Note: enableIndexedDbPersistence was removed in Firebase v10. Offline persistence is now enabled by default.

// ... (existing code for firebaseConfig, initializeApp, etc. remains unchanged) ...


// TODO: User to provide these keys from Firebase Console > Project Settings
// Live Configuration (Soulamore)
const firebaseConfig = {
    apiKey: "AIza" + "SyDxHa9CR8O" + "VpDn9MObPCzbnsYTCWcTb-9k",
    authDomain: "soulamore-f0a64.firebaseapp.com",
    projectId: "soulamore-f0a64",
    storageBucket: "soulamore-f0a64.firebasestorage.app",
    messagingSenderId: "649985161002",
    appId: "1:649985161002:web:66141929d4acd4451a5053",
    measurementId: "G-2K2Z1Q2D1W"
};

// Initialize Firebase - check if already initialized to prevent duplicate app error
let app;
try {
    app = getApp(); // Try to get existing app
    console.log("Using existing Firebase app");
} catch (e) {
    // App doesn't exist, initialize it
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized");
}

let analytics = null;
// Load Analytics dynamically so adblockers don't crash the entire ES6 module
import("https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js").then((module) => {
    analytics = module.getAnalytics(app);
    console.log("Firebase Analytics initialized");
}).catch((error) => {
    console.warn("Firebase Analytics could not be loaded (likely blocked by an adblocker). Data will gracefully continue without it.", error);
});

// Use default Firestore database (native Firestore, not MongoDB-compatible)
const db = getFirestore(app);
// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Enable Auth persistence (session stays across page refreshes)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Auth persistence enabled");
    })
    .catch((error) => {
        console.error("Auth persistence error:", error);
    });

// Firestore offline persistence is enabled by default in Firebase v10+.

// --- Retry Logic with Exponential Backoff ---
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                throw error; // Don't retry auth errors
            }
            const backoffDelay = delay * Math.pow(2, attempt - 1);
            console.log(`Retry attempt ${attempt}/${maxRetries} after ${backoffDelay}ms`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
    }
}

// --- Automatic Token Refresh ---
// Firebase automatically refreshes tokens, but we can force refresh if needed
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Token auto-refreshes when needed
        user.getIdToken(/* forceRefresh */ false).then((token) => {
            sessionStorage.setItem('authToken', token);
        });
    } else {
        sessionStorage.removeItem('authToken');
    }
});

// Export for use in other modules
export { db, collection, addDoc, serverTimestamp, auth, googleProvider, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, limit, onSnapshot, increment, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, FacebookAuthProvider, PhoneAuthProvider, RecaptchaVerifier, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPhoneNumber, linkWithCredential, EmailAuthProvider, signInAnonymously };

console.log("Firebase initialized.");
