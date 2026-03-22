/**
 * Practitioner Handler
 * Manages practitioner-specific data including ratings, earnings, and payout settings.
 */

import { db, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "./firebase-config.js";

const PRACTITIONER_METADATA_COLLECTION = "practitioner_metadata";

/**
 * Save payout settings securely
 * @param {string} userId - User ID
 * @param {object} settings - { upiId: string, bankName: string, accountNo: string, ifsc: string }
 * @returns {Promise<boolean>}
 */
export async function savePayoutSettings(userId, settings) {
    try {
        const metaRef = doc(db, PRACTITIONER_METADATA_COLLECTION, userId);
        
        // In a real app, we'd encrypt sensitive fields before saving
        // For now, we'll store them in a restricted collection
        await setDoc(metaRef, {
            payoutSettings: {
                ...settings,
                updatedAt: new Date().toISOString()
            },
            updatedAt: serverTimestamp()
        }, { merge: true });
        
        console.log("Payout settings saved for user:", userId);
        return true;
    } catch (error) {
        console.error("Error saving payout settings:", error);
        return false;
    }
}

/**
 * Get practitioner metadata (ratings, stats, payout settings)
 * @param {string} userId - User ID
 * @returns {Promise<object|null>}
 */
export async function getPractitionerMetadata(userId) {
    try {
        const metaRef = doc(db, PRACTITIONER_METADATA_COLLECTION, userId);
        const docSnap = await getDoc(metaRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting practitioner metadata:", error);
        return null;
    }
}

/**
 * Fetch practitioner's current commission level based on rating
 * @param {number} rating - Current rating
 * @returns {object} { level: number, cut: number }
 */
export function getCommissionLevel(rating) {
    if (rating >= 4.8) return { level: 3, cut: 0.10 };
    if (rating >= 4.5) return { level: 2, cut: 0.20 };
    return { level: 1, cut: 0.50 };
}

/**
 * Save public profile data to the professionals collection
 * @param {string} userId - User ID
 * @param {object} profileData - { name, quote, bio, tags, languages, rate, etc. }
 * @returns {Promise<boolean>}
 */
export async function savePublicProfile(userId, profileData) {
    try {
        const profRef = doc(db, "professionals", userId);
        await updateDoc(profRef, {
            ...profileData,
            lastProfileUpdate: serverTimestamp()
        });
        console.log("Public profile updated for user:", userId);
        return true;
    } catch (error) {
        // If doc doesn't exist, we might need setDoc (for newly approved peers)
        if (error.code === 'not-found') {
            try {
                const profRef = doc(db, "professionals", userId);
                await setDoc(profRef, {
                    ...profileData,
                    isVerified: true,
                    joinedAt: serverTimestamp()
                }, { merge: true });
                return true;
            } catch (innerError) {
                console.error("Error creating public profile:", innerError);
                return false;
            }
        }
        console.error("Error saving public profile:", error);
        return false;
    }
}
