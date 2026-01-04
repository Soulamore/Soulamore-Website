/**
 * Data Handler - The Bridge between Forms and Firestore
 * Handles: Vents, Confessions, Applications, and Soulbot Leads.
 */

import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

// --- 1. VENT BOX (Anonymous) ---
export async function handleVentSubmission(text, type = "burn") {
    // 1. Scrub PII
    const cleanText = window.PIIScrubber ? window.PIIScrubber.scrubStrict(text) : text;

    try {
        await addDoc(collection(db, "vents"), {
            content: cleanText,
            action: type, // 'burn', 'shred', 'void'
            timestamp: serverTimestamp(),
            device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"
        });
        console.log(`Vent (${type}) saved anonymously.`);
    } catch (e) {
        console.error("Error saving vent: ", e);
        // Fail silently to user (don't break their immersion)
    }
}

// --- 2. CONFESSION BOX ---
export async function handleConfession(text, email = null, phone = null) {
    try {
        await addDoc(collection(db, "confessions"), {
            content: text, // We assume they want their story told, but strict scrubbing is optional
            email: email,
            phone: phone,
            status: "pending",
            timestamp: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("Error saving confession: ", e);
        return false;
    }
}

// --- 3. APPLICATIONS (Join Us) ---
export async function handleApplication(type, data) {
    try {
        console.log("Attempting to save application...", type, data);
        const docRef = await addDoc(collection(db, "applications"), {
            type: type, // 'peer' or 'psychologist'
            ...data,
            status: "new",
            timestamp: serverTimestamp()
        });
        console.log("Application saved successfully! Document ID:", docRef.id);
        return true;
    } catch (e) {
        console.error("Error saving application: ", e);
        console.error("Error code:", e.code);
        console.error("Error message:", e.message);
        // CRITICAL: If permission denied (Rules) or Network Fail, 
        // return false so UI knows.
        if (e.code === 'permission-denied') {
            console.error("PERMISSION DENIED: Firestore security rules are blocking writes. Please update rules in Firebase Console.");
            alert("Database Permission Denied. Please check Firestore Rules in Firebase Console. The write was blocked by security rules.");
        } else if (e.code === 'unavailable') {
            console.error("Firestore is unavailable. Check your internet connection.");
        } else {
            console.error("Unknown error:", e);
        }
        return false;
    }
}

// --- 4. CONTACT FORM ---
export async function handleContact(name, email, subject, message) {
    try {
        await addDoc(collection(db, "contacts"), {
            name: name,
            email: email,
            subject: subject,
            message: message,
            status: "unread",
            timestamp: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("Error saving contact: ", e);
        return false;
    }
}

// --- 5. POSTCARD (Soulamore Away) ---
export async function handlePostcard(message, city = "Unknown") {
    try {
        // Simple scrub for postcards as they are public
        const cleanMessage = window.PIIScrubber ? window.PIIScrubber.scrubStrict(message) : message;

        await addDoc(collection(db, "postcards"), {
            message: cleanMessage,
            originCity: city,
            likes: 0,
            timestamp: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("Error sending postcard: ", e);
        return false;
    }
}

// Make globally available for inline HTML onclicks (via a bridge helper if needed)
window.SoulBackend = {
    submitVent: handleVentSubmission,
    submitConfession: handleConfession,
    submitApp: handleApplication,
    submitContact: handleContact,
    submitPostcard: handlePostcard
};
