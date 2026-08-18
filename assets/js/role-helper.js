/**
 * Role Helper
 * Utility functions to check and manage user roles
 */

import { db, doc, getDoc } from "./firebase-config.js";
import { getUserProfile } from "./profile-handler.js";

const HARDCODED_ROLE_OVERRIDES = {
    'admin@soulamore.com': 'admin',
    'aditya110197@gmail.com': 'admin',         // Aditya (Super Admin / Platform Owner)
    'abhisheksingla74@gmail.com': 'peer',     // Zoya Narula (Peer Listener)
    'sonikas1625@gmail.com': 'peer',          // Sonika Sharma (Peer Listener)
    'yashmeetkaur011@gmail.com': 'psychologist', // Bhagyavathi (Psychologist)
    'aryanharsh2005@gmail.com': 'psychologist'   // Palak Shori (Psychologist)
};

function normalizeRoleValue(role) {
    const normalized = (role || '').toString().trim().toLowerCase();

    if (normalized === 'member' || normalized === 'user') {
        return 'user';
    }

    if (normalized === 'peer' || normalized === 'psychologist' || normalized === 'admin') {
        return normalized;
    }

    return '';
}

/**
 * Get user role - checks both roles collection and users collection
 * @param {string} userId - User ID
 * @param {string} userEmail - User email, used for centralized overrides
 * @returns {Promise<{role: string, isPeer: boolean, isPsychologist: boolean, isUser: boolean}>}
 */
export async function getUserRole(userId, userEmail = '') {
    let isPeer = false;
    let isPsychologist = false;
    let displayRole = 'Member';

    const emailOverride = HARDCODED_ROLE_OVERRIDES[(userEmail || '').toLowerCase()];
    if (emailOverride) {
        console.warn('Applying centralized role override:', { email: userEmail, role: emailOverride });
        return {
            role: emailOverride,
            displayRole: emailOverride === 'admin' ? 'Admin' : emailOverride,
            isPeer: emailOverride === 'peer',
            isPsychologist: emailOverride === 'psychologist',
            isUser: emailOverride === 'user',
            verified: true
        };
    }

    try {
        // 1. Try checking roles collection for verification flags
        try {
            const roleDocRef = doc(db, 'roles', userId);
            const roleDoc = await getDoc(roleDocRef);
            if (roleDoc.exists()) {
                const rolesData = roleDoc.data();
                isPeer = rolesData.peer === true;
                isPsychologist = rolesData.psychologist === true;
            }
        } catch (roleError) {
            console.warn('Role collection read failed (likely permissions):', roleError.message);
            // Non-fatal, continue to user profile
        }

        // 2. Try checking users collection for display role
        try {
            const userProfile = await getUserProfile(userId);
            displayRole = userProfile?.role || 'Member';
        } catch (profileError) {
            console.warn('User profile read failed:', profileError.message);
        }
        
        // Determine primary role
        let primaryRole = 'user';
        if (isPsychologist) {
            primaryRole = 'psychologist';
        } else if (isPeer) {
            primaryRole = 'peer';
        } else {
            const normalizedDisplayRole = normalizeRoleValue(displayRole);
            if (normalizedDisplayRole) {
                primaryRole = normalizedDisplayRole;
            }
        }
        
        return {
            role: primaryRole,
            displayRole: displayRole,
            isPeer: isPeer,
            isPsychologist: isPsychologist,
            isUser: !isPeer && !isPsychologist,
            verified: isPeer || isPsychologist
        };
    } catch (criticalError) {
        console.error('Critical error in getUserRole:', criticalError);
        // Absolute fallback
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

