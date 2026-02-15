/**
 * Role Helper
 * Utility functions to check and manage user roles
 */

import { db, doc, getDoc } from "./firebase-config.js";
import { getUserProfile } from "./profile-handler.js";

/**
 * Get user role - checks both roles collection and users collection
 * @param {string} userId - User ID
 * @returns {Promise<{role: string, isPeer: boolean, isPsychologist: boolean, isUser: boolean}>}
 */
export async function getUserRole(userId) {
    try {
        // Check roles collection for verification flags
        const roleDocRef = doc(db, 'roles', userId);
        const roleDoc = await getDoc(roleDocRef);
        
        const rolesData = roleDoc.exists() ? roleDoc.data() : {};
        const isPeer = rolesData.peer === true;
        const isPsychologist = rolesData.psychologist === true;
        
        // Check users collection for display role
        const userProfile = await getUserProfile(userId);
        const displayRole = userProfile?.role || 'Member';
        
        // Determine primary role
        let primaryRole = 'user';
        if (isPsychologist) {
            primaryRole = 'psychologist';
        } else if (isPeer) {
            primaryRole = 'peer';
        } else if (displayRole && displayRole.toLowerCase() !== 'member') {
            // Use display role if it's set and not just 'Member'
            primaryRole = displayRole.toLowerCase();
        }
        
        return {
            role: primaryRole,
            displayRole: displayRole,
            isPeer: isPeer,
            isPsychologist: isPsychologist,
            isUser: !isPeer && !isPsychologist,
            verified: isPeer || isPsychologist
        };
    } catch (error) {
        console.error('Error getting user role:', error);
        // Default to user if error
        return {
            role: 'user',
            displayRole: 'Member',
            isPeer: false,
            isPsychologist: false,
            isUser: true,
            verified: false
        };
    }
}

/**
 * Check if user is a peer
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isPeer(userId) {
    const roleInfo = await getUserRole(userId);
    return roleInfo.isPeer;
}

/**
 * Check if user is a psychologist
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isPsychologist(userId) {
    const roleInfo = await getUserRole(userId);
    return roleInfo.isPsychologist;
}

/**
 * Check if user is a regular user (not peer or psychologist)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isRegularUser(userId) {
    const roleInfo = await getUserRole(userId);
    return roleInfo.isUser;
}

/**
 * Check if user is a professional (peer or psychologist)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isProfessional(userId) {
    const roleInfo = await getUserRole(userId);
    return roleInfo.isPeer || roleInfo.isPsychologist;
}

/**
 * Get role from session storage (faster, but less reliable)
 * @returns {string} - 'user', 'peer', 'psychologist', or 'user' as default
 */
export function getRoleFromSession() {
    try {
        const session = JSON.parse(localStorage.getItem('soulamore_session') || '{}');
        return session.role || 'user';
    } catch (error) {
        return 'user';
    }
}

