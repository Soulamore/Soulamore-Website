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
            authProviders: userSnap.exists() ?
                (userSnap.data().authProviders ? [...new Set([...userSnap.data().authProviders, ...(user.providerData.map(p => p.providerId))])] : ['email'])
                : (user.providerData.map(p => p.providerId)),

            // --- PROFESSIONAL PROFILE FIELDS ---
            // Identity
            bio: userSnap.exists() ? userSnap.data().bio || '' : '',
            role: userSnap.exists() ? userSnap.data().role || 'Member' : 'Member', // Default to Member
            phone: userSnap.exists() ? userSnap.data().phone || (user.phoneNumber || '') : (user.phoneNumber || ''),
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
                theme: 'dark' // Default calm dark mode
            }
        };

        let isNewUser = false;

        if (userSnap.exists()) {
            // Update existing profile (Merge deep if needed, but for now specific fields)
            // We rely on updateUserProfile for specific updates usually, but this ensures auth sync
            await updateDoc(userRef, {
                displayName: user.displayName || userSnap.data().displayName, // Don't overwrite if null
                email: user.email || userSnap.data().email,
                photoURL: user.photoURL || userSnap.data().photoURL,
                authProviders: profileData.authProviders,
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

        // Update roles collection when role changes to Peer or Psychologist
        if (updates.role) {
            try {
                const roleValue = (updates.role || "").toString().toLowerCase();
                const rolesRef = doc(db, "roles", uid);
                const roleFlags = {
                    updatedAt: serverTimestamp()
                };

                // Set role flags based on selected role
                if (roleValue === "psychologist") {
                    roleFlags.psychologist = true;
                    roleFlags.peer = false;
                } else if (roleValue === "peer") {
                    roleFlags.peer = true;
                    roleFlags.psychologist = false;
                } else {
                    // For other roles, clear peer/psychologist flags
                    roleFlags.peer = false;
                    roleFlags.psychologist = false;
                }

                // Use setDoc with merge to create or update the roles document
                await setDoc(rolesRef, roleFlags, { merge: true });
                console.log('Roles collection updated:', roleFlags);
            } catch (e) {
                console.error('Role sync failed:', e);
                // Don't fail the whole update if role sync fails
            }
        }

        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
}

