/**
 * Soulamore Provider Profile Moderation System
 * Handles profile edit submissions, admin approvals, and rejections.
 * 
 * @version 1.0.0
 * @date August 2026
 */

import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Helper to verify admin permissions
 */
async function verifyAdmin(uid: string, token: any) {
  if (token?.role === 'admin' || token?.admin === true) {
    return true;
  }
  // Fallback check in admins collection or user doc
  const userDoc = await db.collection('users').doc(uid).get();
  if (userDoc.exists && (userDoc.data()?.role === 'admin' || userDoc.data()?.isAdmin === true)) {
    return true;
  }
  const adminDoc = await db.collection('admins').doc(uid).get();
  if (adminDoc.exists) {
    return true;
  }
  throw new HttpsError('permission-denied', 'Only administrators can perform this action.');
}

/**
 * Submit Profile Edit Request (Provider Callable)
 * Providers submit edits to bio, tagline, credentials, specialties, avatar staging path.
 * Live profile is NOT updated until approved by an admin.
 */
export const submitProfileEdit = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to submit profile changes.');
  }

  const uid = request.auth.uid;
  const proposedData = request.data?.proposedData;

  if (!proposedData || typeof proposedData !== 'object') {
    throw new HttpsError('invalid-argument', 'Invalid profile proposed data.');
  }

  // Ensure target provider document exists or fallback to uid
  const targetProviderId = request.data?.providerId || uid;

  // Verify that provider is modifying their own profile (or is admin)
  if (targetProviderId !== uid) {
    await verifyAdmin(uid, request.auth.token);
  }

  const liveDocRef = db.collection('providers').doc(targetProviderId);
  const liveDoc = await liveDocRef.get();

  const previousSnapshot = liveDoc.exists ? liveDoc.data() || {} : {};

  // Sanitize proposed fields
  const sanitizedProposedData: Record<string, any> = {};
  const allowedFields = [
    'displayName',
    'tagline',
    'bio',
    'specialties',
    'languages',
    'education',
    'credentials',
    'experienceYears',
    'consultationModes',
    'avatarStagingPath'
  ];

  for (const field of allowedFields) {
    if (proposedData[field] !== undefined) {
      sanitizedProposedData[field] = proposedData[field];
    }
  }

  // Create pending edit request in subcollection
  const editRequestRef = liveDocRef.collection('editRequests').doc();
  const requestId = editRequestRef.id;

  const editRequestPayload = {
    requestId,
    providerId: targetProviderId,
    submittedBy: uid,
    submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'pending',
    proposedData: sanitizedProposedData,
    previousSnapshot: {
      displayName: previousSnapshot.displayName || null,
      tagline: previousSnapshot.tagline || null,
      bio: previousSnapshot.bio || null,
      specialties: previousSnapshot.specialties || [],
      languages: previousSnapshot.languages || [],
      credentials: previousSnapshot.credentials || null,
      avatarUrl: previousSnapshot.avatarUrl || null
    }
  };

  await editRequestRef.set(editRequestPayload);

  // Write audit log
  await db.collection('auditLogs').add({
    actorId: uid,
    actorRole: request.auth.token?.role || 'provider',
    action: 'profile_edit_submitted',
    targetProviderId,
    targetRequestId: requestId,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    requestId,
    status: 'pending',
    message: 'Profile edit request submitted successfully and is awaiting admin review.'
  };
});

/**
 * Approve Profile Edit Request (Admin Callable)
 * Promotes proposed data into live provider document and copies staged avatar image to public path.
 */
export const approveProfileEdit = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  await verifyAdmin(request.auth.uid, request.auth.token);

  const { providerId, requestId, reviewNote } = request.data || {};
  if (!providerId || !requestId) {
    throw new HttpsError('invalid-argument', 'Missing providerId or requestId.');
  }

  return db.runTransaction(async (transaction) => {
    const editReqRef = db.collection('providers').doc(providerId).collection('editRequests').doc(requestId);
    const editReqDoc = await transaction.get(editReqRef);

    if (!editReqDoc.exists) {
      throw new HttpsError('not-found', 'Edit request not found.');
    }

    const reqData = editReqDoc.data();
    if (reqData?.status !== 'pending') {
      throw new HttpsError('failed-precondition', `Edit request is already ${reqData?.status}.`);
    }

    const proposedData = reqData.proposedData || {};
    const liveDocRef = db.collection('providers').doc(providerId);

    // If an avatar was staged, handle promotion
    let finalAvatarUrl = null;
    if (proposedData.avatarStagingPath) {
      try {
        const bucket = admin.storage().bucket();
        const stagedFile = bucket.file(proposedData.avatarStagingPath);
        const destinationPath = `public-avatars/${providerId}/avatar_${Date.now()}.jpg`;
        const destFile = bucket.file(destinationPath);

        await stagedFile.copy(destFile);
        await destFile.makePublic();

        finalAvatarUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
        proposedData.avatarUrl = finalAvatarUrl;
        delete proposedData.avatarStagingPath;
      } catch (err: any) {
        console.warn('Avatar staging copy failed or storage unavailable:', err?.message);
      }
    }

    // Update live profile document
    transaction.set(liveDocRef, {
      ...proposedData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastApprovedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastApprovedBy: request.auth?.uid
    }, { merge: true });

    // Update edit request status
    transaction.update(editReqRef, {
      status: 'approved',
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewedBy: request.auth?.uid,
      reviewNote: reviewNote || null
    });

    // Write audit log
    const auditRef = db.collection('auditLogs').doc();
    transaction.set(auditRef, {
      actorId: request.auth?.uid,
      actorRole: 'admin',
      action: 'profile_edit_approved',
      targetProviderId: providerId,
      targetRequestId: requestId,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      providerId,
      requestId,
      status: 'approved',
      avatarUrl: finalAvatarUrl
    };
  });
});

/**
 * Reject Profile Edit Request (Admin Callable)
 * Rejects proposed edit with a review note.
 */
export const rejectProfileEdit = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  await verifyAdmin(request.auth.uid, request.auth.token);

  const { providerId, requestId, reviewNote } = request.data || {};
  if (!providerId || !requestId) {
    throw new HttpsError('invalid-argument', 'Missing providerId or requestId.');
  }

  const editReqRef = db.collection('providers').doc(providerId).collection('editRequests').doc(requestId);
  const editReqDoc = await editReqRef.get();

  if (!editReqDoc.exists) {
    throw new HttpsError('not-found', 'Edit request not found.');
  }

  if (editReqDoc.data()?.status !== 'pending') {
    throw new HttpsError('failed-precondition', 'Edit request is not pending.');
  }

  await editReqRef.update({
    status: 'rejected',
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedBy: request.auth.uid,
    reviewNote: reviewNote || 'Profile edit rejected by administrator.'
  });

  await db.collection('auditLogs').add({
    actorId: request.auth.uid,
    actorRole: 'admin',
    action: 'profile_edit_rejected',
    targetProviderId: providerId,
    targetRequestId: requestId,
    reviewNote: reviewNote || null,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    providerId,
    requestId,
    status: 'rejected'
  };
});
