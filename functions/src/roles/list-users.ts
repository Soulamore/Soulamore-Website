/**
 * List Users Cloud Function
 * Allows admins to fetch all users with their custom claims
 * 
 * SECURITY: Admin-only access
 * 
 * @version 1.0.0
 * @date March 20, 2026
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface ListUsersRequest {
  maxResults?: number;
  nextPageToken?: string;
}

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  phoneNumber: string | null;
  disabled: boolean;
  createdAt: string;
  lastSignInTime: string;
}

/**
 * List all users with their custom claims
 * Admin-only function - verifies caller has 'admin' role
 * 
 * @param data - Request data with pagination options
 * @param context - Function context with auth info
 * @returns List of users with their metadata and roles
 */
export const listUsers = functions.https.onCall(
  async (data: ListUsersRequest, context): Promise<{ users: UserData[]; nextPageToken?: string }> => {
    // 1. Authentication check
    if (!context.auth) {
      functions.logger.warn('⛔ Unauthenticated user attempted to list users');
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    // 2. Authorization check - must be admin
    const callerClaims = context.auth.token;
    if (callerClaims.role !== 'admin') {
      functions.logger.warn(`⛔ Non-admin user (${context.auth.uid}) attempted to list users`);
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can list users'
      );
    }

    const maxResults = Math.min(data.maxResults || 100, 1000); // Firebase limit: 1000
    const pageToken = data.nextPageToken;

    try {
      functions.logger.info(`📋 Admin ${context.auth.uid} requesting user list (max: ${maxResults})`);

      // 3. Fetch users from Firebase Auth
      const listUsersResult = await admin.auth().listUsers(maxResults, pageToken);
      
      // 4. Map to UserData with custom claims
      const users: UserData[] = listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.customClaims?.role as string || 'user',
        phoneNumber: user.phoneNumber,
        disabled: user.disabled,
        createdAt: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }));

      functions.logger.info(`✅ Successfully fetched ${users.length} users`);

      return {
        users,
        nextPageToken: listUsersResult.pageToken
      };
    } catch (error) {
      functions.logger.error('Error listing users:', error);
      throw new functions.https.HttpsError('internal', 'Unable to retrieve user list');
    }
  }
);
