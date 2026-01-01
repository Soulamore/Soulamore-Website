/**
 * Firebase Configuration & Initialization
 * Central hub for all backend connections.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: User to provide these keys from Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "soulamore-f0a64.firebaseapp.com",
    projectId: "soulamore-f0a64",
    storageBucket: "soulamore-f0a64.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export for use in data-handler.js
export { db, collection, addDoc, serverTimestamp };

console.log("Firebase initialized.");
