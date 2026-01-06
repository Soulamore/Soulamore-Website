/**
 * Data Handler - The Bridge between Forms and Firestore
 * Handles: Vents, Confessions, Applications, and Soulbot Leads.
 */

import { db, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from "./firebase-config.js";

// --- 1. VENT BOX (Anonymous) ---
// --- 1. VENT BOX (Anonymous) ---
export async function handleVentSubmission(text, type = "burn") {
    try {
        await addDoc(collection(db, "vents"), {
            content: text, // Storing raw text as requested, anonymity is policy-based
            action: type, // 'burn', 'shred', 'void'
            timestamp: serverTimestamp(),
            device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"
        });
        console.log(`Vent (${type}) saved anonymously.`);
        return true;
    } catch (e) {
        console.error("Error saving vent: ", e);
        return false;
    }
}

// --- 1.5 ECHO SPACE (Loneliness) ---
export async function handleEcho(text) {
    try {
        await addDoc(collection(db, "echoes"), {
            content: text,
            timestamp: serverTimestamp(),
            public: true // Flag for potential future display
        });
        console.log("Echo sent to the void.");
        return true;
    } catch (e) {
        console.error("Error sending echo: ", e);
        return false;
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
    // user requested separate collections for easier sorting
    // user requested separate collections for easier sorting
    const collectionName = type === 'psychologist' ? 'psychologists' : 'peers';

    try {
        console.log(`Attempting to save application to ${collectionName}...`, data);
        const docRef = await addDoc(collection(db, collectionName), {
            type: type, // Keeping type for redundancy check
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

// --- 9. LIVE AGGREGATE STATS (Real-time) ---
export function subscribeToShredCount(callback) {
    // Listen to 'vents' collection
    // Optimization: For large datasets, use a distributed counter extension.
    // For current scale (<20k), snapshot size is acceptable.
    const q = query(collection(db, "vents"));

    // Return unsubscribe function
    return onSnapshot(q, (snapshot) => {
        if (callback) callback(snapshot.size);
    }, (error) => {
        console.error("Error subscribing to shred stats:", error);
    });
}

// Make globally available for inline HTML onclicks (via a bridge helper if needed)
// --- 10. NEWSLETTER LIVE COUNT ---
export function subscribeToNewsletterCount(callback) {
    const q = query(collection(db, "newsletters"));
    return onSnapshot(q, (snapshot) => {
        if (callback) callback(snapshot.size);
    }, (error) => {
        console.error("Error subscribing to newsletter stats:", error);
    });
}

// Make globally available for inline HTML onclicks (via a bridge helper if needed)
window.SoulBackend = {
    submitVent: handleVentSubmission,
    submitEcho: handleEcho,
    submitConfession: handleConfession,
    submitApp: handleApplication,
    submitContact: handleContact,
    submitPostcard: handlePostcard,
    submitNewsletter: handleNewsletter,
    getAggregateStats: getAggregateStats,
    subscribeToShredCount: subscribeToShredCount,
    subscribeToNewsletterCount: subscribeToNewsletterCount
};

// --- 8. NEWSLETTER SUBSCRIPTION ---
async function handleNewsletter(email) {
    if (!email || !email.includes('@')) return false;

    try {
        // Attempt to get location data (City/State)
        let locationData = { city: "Unknown", region: "Unknown", country: "Unknown" };
        try {
            const ipRes = await fetch('https://ipapi.co/json/');
            const ipJson = await ipRes.json();
            if (ipJson.city) locationData.city = ipJson.city;
            if (ipJson.region) locationData.region = ipJson.region;
            if (ipJson.country_name) locationData.country = ipJson.country_name;
        } catch (e) {
            console.warn("Location fetch failed for newsletter:", e);
        }

        await addDoc(collection(db, "newsletters"), {
            email: email,
            location: locationData,
            timestamp: serverTimestamp(),
            source: window.location.pathname
        });
        return true;
    } catch (e) {
        console.error("Newsletter error:", e);
        return false;
    }
}

// --- 7. AGGREGATE STATS (Vent/Shred Counts) ---
export async function getAggregateStats(type) {
    // Note: Reading collection size can be expensive ($$$) if millions of docs.
    // For small/medium scale (<50k), getCountFromServer is optimized.
    try {
        if (type === 'daily_vents') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const q = query(collection(db, "vents"), where("timestamp", ">=", today));
            // For older SDKs that don't support getCount, we fallback to getDocs.
            // But we should use getCountFromServer if possible.
            // Assuming recent SDK:
            const snapshot = await getDocs(q);
            return snapshot.size;
        }

        else if (type === 'total_shreds') {
            const q = collection(db, "shreds");
            // const snapshot = await getCountFromServer(q); // Preferred
            const snapshot = await getDocs(q); // Fallback
            return snapshot.size; // .data().count;
        }
        return 0;
    } catch (e) {
        console.error("Stats error:", e);
        return 0;
    }
}
