/**
 * Problem Wall Handler
 * Manages real-time posts, reactions, and seeding for the anonymous wall.
 */
import { db, auth, signInAnonymously, onAuthStateChanged } from "./firebase-config.js";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    updateDoc,
    doc,
    increment,
    serverTimestamp,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const WALL_COLLECTION = "problem-wall-notes";

/**
 * Initialize Wall Logic
 * Handles Auth, Seeding, and Subscribing
 */
export function initWall(renderCallback, updateUICallback, statsCallback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setupWallListeners(renderCallback, updateUICallback, statsCallback);
        } else {
            signInAnonymously(auth).then(() => {
                setupWallListeners(renderCallback, updateUICallback, statsCallback);
            }).catch(e => console.error("Auth Failed:", e));
        }
    });

    // Check for seeding requirements
    seedDatabase();
}

/**
 * Subscribe to Notes
 */
function setupWallListeners(renderCallback, updateUICallback, statsCallback) {
    const q = query(
        collection(db, WALL_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(150)
    );

    const processedIds = new Set();
    const stats = { hearts: 0, flowers: 0, candles: 0 };

    onSnapshot(q, (snapshot) => {
        // Reset stats for recalculation or handle incremental if preferred
        // For simplicity, we'll re-tally visible snapshot notes + existing totals if needed
        // But the inline script did a full tally. Let's replicate that safety.
        stats.hearts = 0; stats.flowers = 0; stats.candles = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const noteId = doc.id;

            // Update stats
            stats.hearts += (data.hearts || 0);
            stats.flowers += (data.flowers || 0);
            stats.candles += (data.candles || 0);

            if (data.isHidden) {
                // Handle hiding element if logic exists in UI
                const el = document.querySelector(`.note[data-note-id="${noteId}"]`);
                if (el) el.remove();
                return;
            }

            if (!processedIds.has(noteId)) {
                renderCallback(noteId, data);
                processedIds.add(noteId);
            } else {
                updateUICallback(noteId, data);
            }
        });

        if (statsCallback) statsCallback(stats);
    }, (error) => {
        console.error("Firebase Snapshot Error:", error);
    });
}

/**
 * Post a Note
 */
export async function postNoteToWall(text, position) {
    try {
        await addDoc(collection(db, WALL_COLLECTION), {
            text: text,
            x: position.x,
            y: position.y,
            hearts: 0,
            flowers: 0,
            candles: 0,
            createdAt: serverTimestamp(),
            isSeeded: false,
            isHidden: false
        });
        return { success: true };
    } catch (error) {
        console.error("Error posting note:", error);
        return { success: false, error };
    }
}

/**
 * React to a Post
 */
export async function reactToNote(noteId, reactionType) {
    const map = { heart: 'hearts', flower: 'flowers', candle: 'candles' };
    const field = map[reactionType];
    if (!field) return;

    try {
        const noteRef = doc(db, WALL_COLLECTION, noteId);
        await updateDoc(noteRef, { [field]: increment(1) });
    } catch (error) {
        console.error("Reaction failed:", error);
    }
}

/**
 * Hide a Note (Mod)
 */
export async function hideNote(noteId) {
    try {
        const noteRef = doc(db, WALL_COLLECTION, noteId);
        await updateDoc(noteRef, { isHidden: true });
    } catch (error) {
        console.error("Hide failed:", error);
    }
}

/**
 * Seeding Logic
 */
async function seedDatabase() {
    // Only run if we suspect empty or first run. 
    // Optimization: Check if empty first
    const q = query(collection(db, WALL_COLLECTION), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return; // Already has data

    console.log("Seeding Database...");
    const notesToSeed = window.seededNotes || []; // Expects window.seededNotes from HTML config

    // Safety check for window.getGridPosition or default
    const getPos = window.getGridPosition || (() => ({ x: Math.random() * 2000, y: Math.random() * 2000 }));

    for (const note of notesToSeed) {
        const pos = getPos();
        try {
            await addDoc(collection(db, WALL_COLLECTION), {
                text: note.text,
                x: pos.x,
                y: pos.y,
                hearts: note.hearts || 0,
                flowers: note.flowers || 0,
                candles: note.candles || 0,
                createdAt: serverTimestamp(),
                isSeeded: true
            });
        } catch (e) {
            console.error("Seeding error:", e);
        }
    }
}
