/**
 * Profile Handler
 * Manages user profile creation and updates in Firestore
 */

import { db, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "./firebase-config.js";

/**
 * Create or update user profile in Firestore
 */
export async function createOrUpdateUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        const profileData = {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
            updatedAt: serverTimestamp(),
            // --- PROFESSIONAL PROFILE FIELDS ---
            // Identity
            bio: userSnap.exists() ? userSnap.data().bio || '' : '',
            role: userSnap.exists() ? userSnap.data().role || 'Psychologist' : 'Psychologist',
            phone: userSnap.exists() ? userSnap.data().phone || '' : '',
            location: userSnap.exists() ? userSnap.data().location || '' : '',

            // Professional Details
            title: userSnap.exists() ? userSnap.data().title || '' : '', // e.g. "Clinical Psychologist"
            qualification: userSnap.exists() ? userSnap.data().qualification || '' : '',
            licenseNumber: userSnap.exists() ? userSnap.data().licenseNumber || '' : '',
            languages: userSnap.exists() ? userSnap.data().languages || [] : [],
            sessionFee: userSnap.exists() ? userSnap.data().sessionFee || '' : '',

            // Rich Content
            experience: userSnap.exists() ? userSnap.data().experience || [] : [], // Array of strings or objects
            expertise: userSnap.exists() ? userSnap.data().expertise || [] : [], // Tags
            therapeuticStyle: userSnap.exists() ? userSnap.data().therapeuticStyle || [] : [], // New SWOT Style
            firstSessionExpectations: userSnap.exists() ? userSnap.data().firstSessionExpectations || '' : '', // New SWOT Expectation
            values: userSnap.exists() ? userSnap.data().values || [] : [],

            // Peer Specific (Optional overlap)
            livedExperience: userSnap.exists() ? userSnap.data().livedExperience || [] : [],

            // Settings
            preferences: userSnap.exists() ? userSnap.data().preferences || {} : {
                notifications: true,
                emailUpdates: true,
                theme: 'dark'
            }
        };

        let isNewUser = false;

        if (userSnap.exists()) {
            // Update existing profile (Merge deep if needed, but for now specific fields)
            // We rely on updateUserProfile for specific updates usually, but this ensures auth sync
            await updateDoc(userRef, {
                displayName: profileData.displayName,
                email: profileData.email,
                photoURL: profileData.photoURL,
                updatedAt: serverTimestamp()
            });
            console.log('User profile synced on auth:', user.uid);
        } else {
            // Create new profile
            await setDoc(userRef, profileData);
            console.log('User profile created (First Time):', user.uid);
            isNewUser = true;
        }

        return { success: true, isNewUser };
    } catch (error) {
        console.error('Error creating/updating user profile:', error);
        return false;
    }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
}

/**
 * Update user profile fields
 */
export async function updateUserProfile(uid, updates) {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        console.log('Profile updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
}

