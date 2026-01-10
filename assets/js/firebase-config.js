/**
 * Firebase Configuration & Initialization
 * Central hub for all backend connections.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Export for use in other modules
export { db, collection, addDoc, serverTimestamp, auth, googleProvider, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, limit };

console.log("Firebase initialized.");
