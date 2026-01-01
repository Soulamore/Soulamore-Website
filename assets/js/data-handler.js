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
        await addDoc(collection(db, "applications"), {
            type: type, // 'peer' or 'psychologist'
            ...data,
            status: "new",
            timestamp: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("Error saving application: ", e);
        return false;
    }
}

// Make globally available for inline HTML onclicks (via a bridge helper if needed)
window.SoulBackend = {
    submitVent: handleVentSubmission,
    submitConfession: handleConfession,
    submitApp: handleApplication
};
