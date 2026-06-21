import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Deletion Cascade Helper
 * Wipes all user-related documents across Firestore and deletes the Auth user
 */
export async function deleteUserCascade(uid: string) {
  const db = admin.firestore();
  
  functions.logger.info(`🧹 [deleteUserCascade] Starting cascade deletion for user: ${uid}`);

  const batch = db.batch();

  // 1. Delete single documents
  const singleDocRefs = [
    db.collection('users').doc(uid),
    db.collection('roles').doc(uid),
    db.collection('journals').doc(uid),
    db.collection('wallets').doc(uid),
    db.collection('user_wallets').doc(uid),
    db.collection('user_wallet').doc(uid)
  ];

  for (const ref of singleDocRefs) {
    batch.delete(ref);
  }

  // 2. Query other collections filtered by user, and delete in batches
  const queries = [
    db.collection('journal_entries').where('userId', '==', uid),
    db.collection('mood_entries').where('userId', '==', uid),
    db.collection('processing_consents').where('userId', '==', uid),
    db.collection('cookie_consents').where('userId', '==', uid),
    db.collection('parental_consents').where('minorUserId', '==', uid),
    db.collection('peer_bookings').where('userId', '==', uid),
    db.collection('confessions').where('uid', '==', uid),
    db.collection('user_saved_items').where('userId', '==', uid)
  ];

  for (const q of queries) {
    const snap = await q.get();
    snap.forEach(doc => {
      batch.delete(doc.ref);
    });
  }

  // Also delete from deletion_requests
  batch.delete(db.collection('deletion_requests').doc(uid));

  // Commit firestore deletes
  await batch.commit();
  functions.logger.info(`✅ Firestore documents cascade deleted for user ${uid}`);

  // 3. Delete Firebase Auth Account
  try {
    await admin.auth().deleteUser(uid);
    functions.logger.info(`✅ Firebase Auth user deleted for ${uid}`);
  } catch (authErr: any) {
    if (authErr.code === 'auth/user-not-found') {
      functions.logger.warn(`⚠️ User auth record not found for ${uid}`);
    } else {
      functions.logger.error(`🔥 Failed to delete user auth for ${uid}:`, authErr.message);
      throw authErr;
    }
  }
}

/**
 * Firestore Trigger: onDeletionRequestCreated
 * Triggers when a user adds their ID to `deletion_requests`
 */
export const onDeletionRequestCreated = functions.firestore
  .document('deletion_requests/{userId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const db = admin.firestore();

    functions.logger.info(`🚨 [onDeletionRequestCreated] User requested deletion: ${userId}`);

    try {
      // 1. Mark user profile status
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      const deletionHoldDays = 30; // 30-day legal window
      const scheduledDeletionAt = new Date();
      scheduledDeletionAt.setDate(scheduledDeletionAt.getDate() + deletionHoldDays);

      if (userDoc.exists) {
        await userRef.update({
          status: 'pending_deletion',
          scheduledDeletionAt: admin.firestore.Timestamp.fromDate(scheduledDeletionAt),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        functions.logger.info(`✅ User profile marked pending_deletion for ${userId}`);
      }

      // 2. Add metadata to the deletion request itself
      await snap.ref.set({
        userId,
        status: 'pending',
        deletionRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
        scheduledDeletionAt: admin.firestore.Timestamp.fromDate(scheduledDeletionAt)
      }, { merge: true });

      functions.logger.info(`✅ Deletion request metadata initialized for ${userId}`);
    } catch (err: any) {
      functions.logger.error(`🔥 Error in onDeletionRequestCreated for ${userId}:`, err.message);
    }
  });

/**
 * Cron Job Scheduler: cleanupPendingDeletions
 * Runs daily to check for user deletion requests older than 30 days
 */
export const cleanupPendingDeletions = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = new Date();

    functions.logger.info(`⏳ [cleanupPendingDeletions] Running automated data retention cleanup job`);

    try {
      // Query deletion requests that are pending and scheduled deletion date is past
      const snap = await db.collection('deletion_requests')
        .where('scheduledDeletionAt', '<=', admin.firestore.Timestamp.fromDate(now))
        .get();

      if (snap.empty) {
        functions.logger.info(`✅ No pending deletions require action today`);
        return;
      }

      functions.logger.info(`🚨 Found ${snap.size} user accounts ready for permanent erasure`);

      for (const doc of snap.docs) {
        const userId = doc.id;
        try {
          await deleteUserCascade(userId);
          functions.logger.info(`✅ Successfully purged account ${userId} permanently`);
        } catch (err: any) {
          functions.logger.error(`🔥 Failed to purge account ${userId}:`, err.message);
        }
      }
    } catch (err: any) {
      functions.logger.error(`🔥 Error in cleanupPendingDeletions job:`, err.message);
    }
  });

/**
 * HTTPS Callable: runAccountDeletion (Admin Only)
 * Bypasses the 30-day retention lock to perform immediate erasure
 */
export const runAccountDeletion = functions.runWith({
  timeoutSeconds: 120,
  memory: '512MB'
}).https.onCall(async (data: any, context: functions.https.CallableContext) => {
  // 1. Auth Guard
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  // 2. Admin verification
  const requesterUid = context.auth.uid;
  const db = admin.firestore();

  try {
    const requesterDoc = await db.collection('users').doc(requesterUid).get();
    if (!requesterDoc.exists || requesterDoc.data()?.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only administrators can initiate immediate deletion.');
    }

    const targetUserId = data.userId;
    if (!targetUserId) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing target userId.');
    }

    functions.logger.warn(`🚨 Admin ${requesterUid} is performing immediate purge on user ${targetUserId}`);

    await deleteUserCascade(targetUserId);

    return { success: true, message: `Permanently deleted user ${targetUserId}` };
  } catch (err: any) {
    if (err instanceof functions.https.HttpsError) throw err;
    console.error("🔥 [runAccountDeletion] Error:", err.message);
    throw new functions.https.HttpsError('internal', err.message || 'Failed to delete user');
  }
});
