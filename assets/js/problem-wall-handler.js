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
    getDocs,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const WALL_COLLECTION = "problem-wall-notes";

/* Helper for Debugging */
function log(msg) {
    if (window.logDebug) window.logDebug(msg);
}
const SEEDED_NOTES = [
    { text: "I wish I could pause time.", hearts: 67, flowers: 24, candles: 14 },
    { text: "My anxiety is winning today.", hearts: 88, flowers: 29, candles: 17 },
    { text: "Smiling is exhausting.", hearts: 73, flowers: 21, candles: 10 },
    { text: "I want to be heard.", hearts: 54, flowers: 19, candles: 9 },
    { text: "Just getting by is hard enough.", hearts: 95, flowers: 33, candles: 18 },
    { text: "I miss my childhood.", hearts: 134, flowers: 52, candles: 31 },
    { text: "The future scares me.", hearts: 82, flowers: 28, candles: 16 },
    { text: "I don't know who I am anymore.", hearts: 76, flowers: 25, candles: 13 },
    { text: "Everyone expects so much from me.", hearts: 62, flowers: 20, candles: 11 },
    { text: "I'm trying my best, but it feels like it's not enough.", hearts: 115, flowers: 42, candles: 24 },
    { text: "I feel like a burden.", hearts: 98, flowers: 36, candles: 20 },
    { text: "Why is it so hard to be happy?", hearts: 85, flowers: 30, candles: 15 },
    { text: "I just want peace.", hearts: 145, flowers: 58, candles: 35 },
    { text: "Life feels heavy right now.", hearts: 70, flowers: 23, candles: 12 },
    { text: "I feel so lonely in a crowded room.", hearts: 92, flowers: 44, candles: 15 },
    { text: "Am I the only one pretending?", hearts: 65, flowers: 18, candles: 8 },
    { text: "I need a hug that lasts an hour.", hearts: 150, flowers: 60, candles: 40 },
    { text: "Tomorrow is another battle.", hearts: 45, flowers: 12, candles: 5 },
    { text: "I just want to sleep for a week.", hearts: 110, flowers: 35, candles: 22 },
    { text: "Is it okay to not be okay?", hearts: 200, flowers: 80, candles: 50 },
    { text: "I miss the old me.", hearts: 130, flowers: 50, candles: 28 },
    { text: "I'm tired of being strong.", hearts: 160, flowers: 70, candles: 35 },
    { text: "Everything feels overwhelming.", hearts: 85, flowers: 25, candles: 15 },
    { text: "I just need a sign.", hearts: 50, flowers: 15, candles: 10 },
    { text: "Forgiving myself is the hardest part.", hearts: 95, flowers: 40, candles: 20 }
];

/**
 * Initialize Wall Logic
 * Handles Auth, Seeding, and Subscribing
 */
export function initWall(renderCallback, updateUICallback, statsCallback) {
    log("initWall: Waiting for Auth...");
    onAuthStateChanged(auth, (user) => {
        if (user) {
            log(`Auth State: Signed In (${user.uid})`);
            // Seed first, but always setup listeners regardless of seed result
            seedDatabase()
                .catch(e => log(`Seeding skipped: ${e.message}`))
                .finally(() => {
                    setupWallListeners(renderCallback, updateUICallback, statsCallback);
                });
        } else {
            log("Auth State: Signed Out. Attempting Anon Sign-In...");
            signInAnonymously(auth).then(() => {
                // onAuthStateChanged will fire again with user
            }).catch(e => {
                log(`Auth Failed: ${e.message}`);
                console.error("Auth Failed:", e);
            });
        }
    });
}

/**
 * Subscribe to Notes
 */
/**
* Subscribe to Notes
*/
function setupWallListeners(renderCallback, updateUICallback, statsCallback) {
    log("Setting up Firestore Query...");

    // REMOVED 'where' clause to avoid creating a Composite Index right now.
    // We will filter isHidden in client-side code.
    const q = query(
        collection(db, WALL_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(200)
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

            // Update stats (include hidden notes in stats?)
            // If we filter "isHidden" == false in query, we lose stats from hidden notes.
            // But if we query all, we can calculate stats.
            // Let's assume we want total stats.

            // Wait, if I add 'where' to query, I need a composite index on isHidden + createdAt.
            // Start with Client-Side Filtering to avoid Index issues for now.

            stats.hearts += (data.hearts || 0);
            stats.flowers += (data.flowers || 0);
            stats.candles += (data.candles || 0);

            if (data.isHidden) {
                // Ensure hidden notes are removed from UI
                const el = document.querySelector(`.note[data-note-id="${noteId}"]`);
                if (el) el.remove();
                return;
            }

            // Validation: Must have text
            if (!data.text) {
                return;
            }

            if (!processedIds.has(noteId)) {
                renderCallback(noteId, data);
                processedIds.add(noteId);

                // AUDIO: Play sound for NEW REMOTE notes only
                if (!isFirstSnapshot && !doc.metadata.hasPendingWrites && window.playSound) {
                    window.playSound('post');
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
 * Supports Optimistic UI Updates
 */
export async function postNoteToWall(text, optimisticCallback) {
    // 1. Optimistic Update (Immediate Feedback)
    const tempId = 'temp-' + Date.now();
    const noteData = {
        text: text,
        // x/y removed - calculated by HybridLayout
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
            // x/y removed
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
 * Seeding Logic (Robust)
 */
async function seedDatabase() {
    try {
        const coll = collection(db, WALL_COLLECTION);

        // Simple query: Get all seeded notes (usually small number)
        // Filter isHidden in memory to avoid composite index requirement
        const q = query(coll, where("isSeeded", "==", true));
        const snapshot = await getDocs(q); // Fetch docs, not just count

        const visibleSeeds = snapshot.docs.filter(d => !d.data().isHidden).length;

        if (visibleSeeds >= 20) {
            log(`Database has ${visibleSeeds} visible seeds. Skipping.`);
            return;
        }

        log(`Database low on seeds (${visibleSeeds}). Seeding placeholders...`);
        const batchSize = 25 - visibleSeeds;

        // Pick random subset or just top N
        for (let i = 0; i < batchSize && i < SEEDED_NOTES.length; i++) {
            const note = SEEDED_NOTES[i];
            await addDoc(coll, {
                text: note.text,
                hearts: note.hearts || 0,
                flowers: note.flowers || 0,
                candles: note.candles || 0,
                createdAt: serverTimestamp(),
                isSeeded: true,
                isHidden: false
            });
        }
        log("Seeding Complete.");
    } catch (e) {
        console.error("Seeding Error:", e);
    }
}


