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
export async function postProblem(text, isPublic = true) {
    try {
        // Large Canvas Logic (5000x5000)
        // Center is 2500, 2500. We want to scatter around the center.
        // Spread +/- 1000px
        const centerX = 2500;
        const centerY = 2500;
        const spread = 1200;

        // Random offset
        const x = centerX + (Math.random() * spread * 2) - spread;
        const y = centerY + (Math.random() * spread * 2) - spread;

        // Random Pastel Color
        const colors = ['#fffefb', '#fdfbf7', '#fefce8', '#f0f9ff', '#fff1f2'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        await addDoc(collection(db, WALL_COLLECTION), {
            text: text,
            isPublic: isPublic,
            timestamp: serverTimestamp(),
            color: color,
            position: { x, y }, // Absolute px coordinates now
            reactions: {
                heart: 0,
                flower: 0,
                candle: 0
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Error posting to wall:", error);
        return { success: false, error: error.message };
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
