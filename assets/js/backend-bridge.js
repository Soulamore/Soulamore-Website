
/**
 * Backend Bridge
 * Connects the global window.SoulBackend object to the modular Firebase functions.
 * Expected to be loaded as a module in index.html.
 */
import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

// --- 1. CONTACT FORM (Lifeline) ---
async function submitContact(name, email, subject, message) {
    try {
        console.log("Backend Bridge: Submitting contact...", { name, email });
        await addDoc(collection(db, "contacts"), {
            name: name,
            email: email,
            subject: subject,
            message: message,
            status: "unread",
            timestamp: serverTimestamp()
        });
        console.log("Backend Bridge: Contact submitted successfully.");
        return true;
    } catch (e) {
        console.error("Backend Bridge Error (Contact):", e);
        return false;
    }
}

// --- 2. NEWSLETTER FORM ---
async function submitNewsletter(email) {
    if (!email || !email.includes('@')) return false;
    try {
        console.log("Backend Bridge: Submitting newsletter...", email);
        await addDoc(collection(db, "newsletters"), {
            email: email,
            timestamp: serverTimestamp(),
            source: window.location.pathname
        });
        console.log("Backend Bridge: Newsletter submitted successfully.");
        return true;
    } catch (e) {
        console.error("Backend Bridge Error (Newsletter):", e);
        return false;
    }
}

// --- EXPOSE TO WINDOW ---
window.SoulBackend = {
    submitContact: submitContact,
    submitNewsletter: submitNewsletter
};

console.log("SoulBackend Bridge Initialized.");
