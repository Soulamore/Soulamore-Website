/**
 * Presence Handler for Soulamore
 * Tracks active users anonymously via Firestore to show "Live Users" count.
 */
import { db, collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, where, getDocs } from "./firebase-config.js";

const PRESENCE_COLLECTION = "active_souls";
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

// Generate a session ID for this tab
const sessionId = 'soul_' + Math.random().toString(36).substr(2, 9);
let docRef = null;

async function startPresence() {
    try {
        // Create initial presence document
        docRef = await addDoc(collection(db, PRESENCE_COLLECTION), {
            page: window.location.pathname,
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

        // Start listening for count
        listenToPresence();

    } catch (e) {
        console.error("Presence system failed:", e);
    }
}

function listenToPresence() {
    // Listen to changes in the active_souls collection
    // Note: In a high-traffic app, we'd use a cloud function to aggregate this counter.
    // For now, client-side counting is fine for < 100 concurrents.
    const q = query(
        collection(db, PRESENCE_COLLECTION),
        where("lastActive", ">", new Date(Date.now() - 60000)) // Active in last minute
    );

    onSnapshot(q, (snapshot) => {
        const count = snapshot.size; // Total documents found
        updateUI(count);
    });
}

function updateUI(count) {
    // Update any element with class 'live-count-display'
    const displays = document.querySelectorAll('.live-count-display');
    displays.forEach(el => {
        el.innerText = count > 1 ? `${count} peers online` : `1 peer online`;
    });

    // Update specific "Status Dots" in peer cards
    const statusDots = document.querySelectorAll('.status-dot');
    statusDots.forEach(dot => {
        // If we have > 5 people, show "Online" as confirmed.
        // If low, maybe show "Away" or just keep "Online" for positivity.
        // For Soulamore, let's keep it "Online" but maybe pulse faster if crowded.
        if (count > 10) {
            dot.classList.add('high-traffic'); // Add CSS for faster pulse?
        }
    });

    // Optional: Global widget text
    const widgetText = document.getElementById('global-live-count');
    if (widgetText) {
        widgetText.innerText = count;
    }
}

// Auto-start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPresence);
} else {
    startPresence();
}
