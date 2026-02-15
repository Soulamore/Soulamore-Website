/**
 * Presence Handler for Soulamore
 * Tracks active users anonymously via Firestore to show "Live Users" count.
 * Features: Country Detection, Page-Specific Counting.
 */
import { db, collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, where, getDocs } from "./firebase-config.js";

const PRESENCE_COLLECTION = "active_souls";
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

// Generate a session ID for this tab
// Generate a secure session ID for this tab
const array = new Uint32Array(1);
crypto.getRandomValues(array);
const sessionId = 'soul_' + array[0].toString(36);
let docRef = null;
let userCountry = "Unknown";

// 1. Fetch User Country (IP-based, lightweight)
async function detectCountry() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        userCountry = data.country_name || "Unknown";
    } catch (e) {
        console.warn("Country detection failed, defaulting to Unknown.");
    }
}

async function startPresence() {
    try {
        await detectCountry();

        // Create initial presence document
        docRef = await addDoc(collection(db, PRESENCE_COLLECTION), {
            page: window.location.pathname,
            country: userCountry,
            lastActive: serverTimestamp(),
            device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"
        });

        // Set up heartbeat
        setInterval(async () => {
            if (document.visibilityState === 'visible' && docRef) {
                await updateDoc(docRef, {
                    lastActive: serverTimestamp()
                });
            }
        }, HEARTBEAT_INTERVAL);

        // Remove on window close
        window.addEventListener('beforeunload', () => {
            if (docRef) deleteDoc(docRef);
        });

        // Start listening
        initializeListeners();

    } catch (e) {
        console.error("Presence system failed:", e);
    }
}

function initializeListeners() {
    // 1. Soulamore Away: Listen for users from MY country
    if (window.location.href.includes('soulamore-away')) {
        listenToCountryPeers();
    }
    // 2. Campus: Listen for students (users on campus pages)
    else if (window.location.href.includes('campus')) {
        listenToStudentPeers();
    }
    // 3. Confession: Listen for people on this specific page
    else if (window.location.href.includes('confession')) {
        listenToConfessionPeers();
    }
    // Default Global Listener (optional)
}

// --- SPECIFIC LISTENERS ---

function listenToCountryPeers() {
    // Query: Active users active in last minute AND matching country
    // Note: Requires composite index if high scale. For now, client filter ok for small data.
    const q = query(
        collection(db, PRESENCE_COLLECTION),
        where("lastActive", ">", new Date(Date.now() - 60000)),
        where("country", "==", userCountry)
    );

    onSnapshot(q, (snapshot) => {
        let count = snapshot.size;
        // Optimistic UI: If I am here, count is at least 1.
        if (count < 1) count = 1;
        updateWidget(`soulamore-away`, count, userCountry);
    });
}

function listenToStudentPeers() {
    // Query: Active users whose 'page' contains 'campus'
    // Firestore textual search is limited. We might need to just query all active and filter client-side 
    // OR add a 'section' field to document.
    // For simplicity/speed: Query all active, filter in JS.
    const q = query(
        collection(db, PRESENCE_COLLECTION),
        where("lastActive", ">", new Date(Date.now() - 60000))
    );

    onSnapshot(q, (snapshot) => {
        let count = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.page && data.page.includes('campus')) count++;
        });
        updateWidget('campus', count);
    });
}

function listenToConfessionPeers() {
    const q = query(
        collection(db, PRESENCE_COLLECTION),
        where("lastActive", ">", new Date(Date.now() - 60000))
    );

    onSnapshot(q, (snapshot) => {
        let count = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.page && data.page.includes('confession')) count++;
        });
        updateWidget('confession', count);
    });
}

// --- UI UPDATER ---
function updateWidget(type, count, extraLabel = "") {
    const display = document.querySelector('.live-count-display');
    if (!display) return;

    if (type === 'soulamore-away') {
        // "X peers from India online"
        const label = count > 1 ? `${count} peers from ${extraLabel} online` : `You are the first from ${extraLabel}`;
        display.innerText = label;
    } else if (type === 'campus') {
        display.innerText = `${count} students online`;
    } else if (type === 'confession') {
        display.innerText = `${count} souls here with you`;
    }
}

// Auto-start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPresence);
} else {
    startPresence();
}

