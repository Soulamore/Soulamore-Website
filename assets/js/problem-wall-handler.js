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

/* Helper for Debugging */
function log(msg) {
    if (window.logDebug) window.logDebug(msg);
    else console.log("[Handler]", msg);
}

/**
 * Initialize Wall Logic
 * Handles Auth, Seeding, and Subscribing
 */
export function initWall(renderCallback, updateUICallback, statsCallback) {
    log("initWall: Waiting for Auth...");
    onAuthStateChanged(auth, (user) => {
        if (user) {
            log(`Auth State: Signed In (${user.uid})`);
            setupWallListeners(renderCallback, updateUICallback, statsCallback);
        } else {
            log("Auth State: Signed Out. Attempting Anon Sign-In...");
            signInAnonymously(auth).then((result) => {
                log(`Anon Sign-In Initialized: ${result.user.uid}`);
                // setupWallListeners calls implicitly via onAuthStateChanged usually, 
                // but since we are inside the else block of the listener, we might need to wait for the listener to fire again?
                // Actually, onAuthStateChanged fires on sign-in.
                // But let's call setup just in case or trust the listener flow?
                // Standard pattern: do nothing here, let the listener catch the change.
                // BUT, to be safe and explicit:
                // setupWallListeners(renderCallback, updateUICallback, statsCallback);
            }).catch(e => {
                log(`Auth Failed: ${e.message}`);
                console.error("Auth Failed:", e);
            });
        }
    });

    // Check for seeding requirements
    // seedDatabase(); // Disable seeding for now to focus on reading existing
}

/**
 * Subscribe to Notes
 */
function setupWallListeners(renderCallback, updateUICallback, statsCallback) {
    log("Setting up Firestore Query...");

    // Simple query first to verify access
    const q = query(
        collection(db, WALL_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(150)
    );

    const processedIds = new Set();
    const stats = { hearts: 0, flowers: 0, candles: 0 };
    let isFirstSnapshot = true;

    log("Attaching onSnapshot listener...");
    onSnapshot(q, (snapshot) => {
        log(`Snapshot received! Docs: ${snapshot.size}, Empty: ${snapshot.empty}`);

        // Stats Reset
        stats.hearts = 0; stats.flowers = 0; stats.candles = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const noteId = doc.id;

            // Validate data
            if (!data.text || data.x === undefined || data.y === undefined) {
                // log(`Skipping invalid note: ${noteId}`);
                return;
            }

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
                // log(`Rendering New Note: ${noteId}`);
                renderCallback(noteId, data);
                processedIds.add(noteId);

                // AUDIO: Play sound for NEW REMOTE notes only
                // 1. !isFirstSnapshot (Don't play on initial load)
                // 2. !doc.metadata.hasPendingWrites (Don't play for my own local optimistic writes)
                if (!isFirstSnapshot && !doc.metadata.hasPendingWrites && window.playSound) {
                    window.playSound('post'); // Paper rustle sound
                }
            } else {
                updateUICallback(noteId, data);
            }
        });

        isFirstSnapshot = false;
        if (statsCallback) statsCallback(stats);
    }, (error) => {
        log(`Snapshot ERROR: ${error.message} (${error.code})`);
        console.error("Firebase Snapshot Error:", error);
    });
}

/**
 * Post a Note
 */
/**
 * Post a Note
 * Supports Optimistic UI Updates
 */
export async function postNoteToWall(text, position, optimisticCallback) {
    // 1. Optimistic Update (Immediate Feedback)
    const tempId = 'temp-' + Date.now();
    const noteData = {
        text: text,
        x: position.x,
        y: position.y,
        hearts: 0,
        flowers: 0,
        candles: 0,
        createdAt: { seconds: Date.now() / 1000 }, // Mock timestamp
        isSeeded: false,
        isHidden: false
    };

    if (optimisticCallback) {
        optimisticCallback(tempId, noteData);
    }

    // 2. Background Sync
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
        // Note: We don't need to manually update the UI here because 
        // the onSnapshot listener will fire when the data reaches the server
        // and comes back. The UI should handle deduping if needed, 
        // or we rely on the snap to replace the temp node.
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
