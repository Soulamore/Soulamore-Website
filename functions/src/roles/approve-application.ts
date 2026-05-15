/**
 * Approve Application Cloud Function
 * Allows admins to approve peer or psychologist applications
 * Sets custom claim role + updates Firestore status
 * 
 * SECURITY: Admin-only access
 * 
 * @version 1.0.0
 * @date March 20, 2026
 */

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

interface ApproveApplicationRequest {
  applicationId: string;
  collection: 'peers' | 'psychologists';
  newRole: 'peer' | 'psychologist';
}

/**
 * Approve a peer or psychologist application
 * Admin-only function - verifies caller has 'admin' role
 * 
 * This function:
 * 1. Verifies the application exists
 * 2. Sets custom claim role for the user
 * 3. Updates application status to 'approved'
 * 4. Updates user profile in Firestore
 * 
 * @param data - Request data with application details
 * @param context - Function context with auth info
 * @returns Success message
 */
export const approveApplication = functions.https.onCall(
  async (data: ApproveApplicationRequest, context): Promise<{ message: string; userId: string; role: string }> => {
    // 1. Authentication & Authorization check
    if (!context.auth || context.auth.token.role !== 'admin') {
      functions.logger.warn(`⛔ Unauthorized application approval attempt by ${context.auth?.uid || 'anonymous'}`);
      throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }

    const { applicationId, collection, newRole } = data;

    // 2. Input validation
    if (!applicationId) {
      throw new functions.https.HttpsError('invalid-argument', 'Application ID is required');
    }

    if (!collection || !['peers', 'psychologists'].includes(collection)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid collection. Must be "peers" or "psychologists"'
      );
    }

    if (!newRole || !['peer', 'psychologist'].includes(newRole)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid role. Must be "peer" or "psychologist"'
      );
    }

    const db = admin.firestore();

    try {
      functions.logger.info(`📝 Admin ${context.auth.uid} approving application ${applicationId} in ${collection}`);

      // 3. Get application document
      const appRef = db.collection(collection).doc(applicationId);
      const appDoc = await appRef.get();

      if (!appDoc.exists) {
        functions.logger.warn(`⚠️ Application ${applicationId} not found`);
        throw new functions.https.HttpsError('not-found', 'Application not found');
      }

      const appData = appDoc.data()!;
      
      // 4. Get user ID from application
      const userId = appData.userId || appData.authorId || appData.uid;

      if (!userId) {
        functions.logger.error('❌ Application missing userId field');
        throw new functions.https.HttpsError('invalid-argument', 'Application missing user ID');
      }

      // 5. Get current user record from Auth
      const userRecord = await admin.auth().getUser(userId);
      
      // 6. Set custom claims
      const currentClaims = userRecord.customClaims || {};
      const updatedClaims = {
        ...currentClaims,
        role: newRole
      };

      await admin.auth().setCustomUserClaims(userId, updatedClaims);
      functions.logger.info(`✅ Custom claims set for ${userId}: role = ${newRole}`);

      // 7. Update application status in Firestore
      await appRef.update({
        status: 'approved',
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: context.auth.uid,
        role: newRole // Store role in application for reference
      });

      // 8. Update user profile in Firestore
      const userRef = db.collection('users').doc(userId);
      await userRef.update({
        role: newRole,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      functions.logger.info(`✅ Application ${applicationId} approved. User ${userId} is now ${newRole}`);

      return {
        message: `Application approved. ${userRecord.email || userId} is now a ${newRole}.`,
        userId: userId,
        role: newRole
      };
    } catch (error: any) {
      functions.logger.error('Error approving application:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError('internal', `Unable to approve application: ${error.message || 'Unknown error'}`);
    }
  }
);
