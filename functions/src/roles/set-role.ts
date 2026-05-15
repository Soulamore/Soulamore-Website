/**
 * Set Role Cloud Function
 * Allows admins to assign or update user roles via custom claims
 * 
 * SECURITY: Admin-only access
 * 
 * @version 1.0.0
 * @date March 20, 2026
 */

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

interface SetRoleRequest {
  targetUid: string;
  newRole: string;
}

// Allowed roles in the system
const ALLOWED_ROLES = ['user', 'peer', 'psychologist', 'admin'];

/**
 * Assign or update a user's custom claim role
 * Admin-only function - verifies caller has 'admin' role
 * 
 * @param data - Request data with target UID and new role
 * @param context - Function context with auth info
 * @returns Success message
 */
export const setRole = functions.https.onCall(
  async (data: SetRoleRequest, context): Promise<{ message: string; uid: string; role: string }> => {
    // 1. Authentication check
    if (!context.auth) {
      functions.logger.warn('⛔ Unauthenticated user attempted to set role');
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    // 2. Authorization check - must be admin
    if (context.auth.token.role !== 'admin') {
      functions.logger.warn(`⛔ Non-admin user (${context.auth.uid}) attempted to set role`);
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can assign roles'
      );
    }

    const { targetUid, newRole } = data;

    // 3. Input validation
    if (!targetUid) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID (targetUid) is required');
    }

    if (!newRole) {
      throw new functions.https.HttpsError('invalid-argument', 'Role (newRole) is required');
    }

    if (!ALLOWED_ROLES.includes(newRole)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}`
      );
    }

    try {
      functions.logger.info(`🔄 Admin ${context.auth.uid} setting role '${newRole}' for user ${targetUid}`);

      // 4. Verify target user exists
      const userRecord = await admin.auth().getUser(targetUid);
      
      // 5. Get current custom claims to preserve other claims
      const currentClaims = userRecord.customClaims || {};

      // 6. Update role claim (preserve other claims)
      const updatedClaims = {
        ...currentClaims,
        role: newRole
      };

      // 7. Set custom claims
      await admin.auth().setCustomUserClaims(targetUid, updatedClaims);

      functions.logger.info(`✅ Role '${newRole}' successfully assigned to ${targetUid}`);

      return {
        message: `Role '${newRole}' assigned successfully to ${userRecord.email || targetUid}`,
        uid: targetUid,
        role: newRole
      };
    } catch (error: any) {
      functions.logger.error('Error assigning role:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new functions.https.HttpsError('not-found', 'User not found');
      }
      
      throw new functions.https.HttpsError('internal', `Unable to assign role: ${error.message || 'Unknown error'}`);
    }
  }
);
