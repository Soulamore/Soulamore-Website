/**
 * Problem Wall Handler
 * Manages real-time posts and reactions for the anonymous wall.
 */
import { db } from "./firebase-config.js";
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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const WALL_COLLECTION = "problem_wall_posts";

/**
 * Subscribe to the Wall
 * Listens for the latest 50 posts.
 */
export function subscribeToWall(callback) {
    const q = query(
        collection(db, WALL_COLLECTION),
        orderBy("timestamp", "desc"),
        limit(50)
    );

    return onSnapshot(q, (snapshot) => {
        const posts = [];
        snapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });
        callback(posts);
    });
}

/**
 * Post a Problem
 * Adds a new anonymous post to Firestore.
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
 * Atomically increments the reaction count.
 */
export async function reactToPost(postId, reactionType) {
    if (!['heart', 'flower', 'candle'].includes(reactionType)) return;

    const postRef = doc(db, WALL_COLLECTION, postId);

    // Dynamic field update using template literal syntax for key
    // Firestore requires "reactions.heart" dot notation for nested fields
    const fieldPath = `reactions.${reactionType}`;

    try {
        await updateDoc(postRef, {
            [fieldPath]: increment(1)
        });
        return { success: true };
    } catch (error) {
        console.error("Error reacting:", error);
        return { success: false, error: error };
    }
}
