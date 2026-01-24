/**
 * Firebase Configuration & Initialization
 * Central hub for all backend connections.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, PhoneAuthProvider, RecaptchaVerifier, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPhoneNumber, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, linkWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: User to provide these keys from Firebase Console > Project Settings
// Live Configuration (Soulamore)
const firebaseConfig = {
    apiKey: "AIzaSyDxHa9CR8OVpDn9MObPCzbnsYTCWcTb-9k",
    authDomain: "soulamore-f0a64.firebaseapp.com",
    projectId: "soulamore-f0a64",
    storageBucket: "soulamore-f0a64.firebasestorage.app",
    messagingSenderId: "649985161002",
    appId: "1:649985161002:web:66141929d4acd4451a5053",
    measurementId: "G-2K2Z1Q2D1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Use default Firestore database (native Firestore, not MongoDB-compatible)
const db = getFirestore(app);
// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Enable Auth persistence (session stays across page refreshes)
import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Auth persistence enabled");
    })
    .catch((error) => {
        console.error("Auth persistence error:", error);
    });

// Enable Firestore offline persistence
import { enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
enableIndexedDbPersistence(db)
    .then(() => {
        console.log("Firestore offline persistence enabled");
    })
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn("Multiple tabs open, persistence enabled in first tab only");
        } else if (err.code === 'unimplemented') {
            console.warn("Browser doesn't support offline persistence");
        }
    });

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
export { db, collection, addDoc, serverTimestamp, auth, googleProvider, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, limit, onSnapshot, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, FacebookAuthProvider, PhoneAuthProvider, RecaptchaVerifier, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPhoneNumber, linkWithCredential, EmailAuthProvider };

console.log("Firebase initialized.");
