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
            // Additional profile fields
            bio: userSnap.exists() ? userSnap.data().bio || '' : '',
            role: userSnap.exists() ? userSnap.data().role || '' : '',
            interests: userSnap.exists() ? userSnap.data().interests || [] : [],
            location: userSnap.exists() ? userSnap.data().location || '' : '',
            phone: userSnap.exists() ? userSnap.data().phone || '' : '',
            dateOfBirth: userSnap.exists() ? userSnap.data().dateOfBirth || '' : '',
            preferences: userSnap.exists() ? userSnap.data().preferences || {} : {
                notifications: true,
                emailUpdates: true,
                theme: 'dark'
            }
        };

        let isNewUser = false;

        if (userSnap.exists()) {
            // Update existing profile
            await updateDoc(userRef, {
                displayName: profileData.displayName,
                email: profileData.email,
                photoURL: profileData.photoURL,
                updatedAt: serverTimestamp()
            });
            console.log('User profile updated:', user.uid);
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

