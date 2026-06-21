import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Privacy Rights Handler
 * Handles data export for compliance (GDPR Art.20 / DPDP)
 */
export const exportUserData = functions.runWith({
  timeoutSeconds: 120,
  memory: '512MB'
}).https.onCall(async (data: any, context: functions.https.CallableContext) => {
  // 1. Auth Guard
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const uid = context.auth.uid;
  console.log(`📡 [exportUserData] Exporting data for user: ${uid}`);

  try {
    const db = admin.firestore();

    // 1. Fetch single document profile/roles/journals
    const userDoc = await db.collection('users').doc(uid).get();
    const roleDoc = await db.collection('roles').doc(uid).get();
    const journalDoc = await db.collection('journals').doc(uid).get();
    const walletDoc = await db.collection('wallets').doc(uid).get();
    const userWalletDoc = await db.collection('user_wallets').doc(uid).get();

    // 2. Query other collections filtered by user
    const [
      journalEntriesSnap,
      moodEntriesSnap,
      processingConsentsSnap,
      cookieConsentsSnap,
      parentalConsentsSnap,
      bookingsSnap,
      confessionsSnap,
      savedItemsSnap
    ] = await Promise.all([
      db.collection('journal_entries').where('userId', '==', uid).get(),
      db.collection('mood_entries').where('userId', '==', uid).get(),
      db.collection('processing_consents').where('userId', '==', uid).get(),
      db.collection('cookie_consents').where('userId', '==', uid).get(),
      db.collection('parental_consents').where('minorUserId', '==', uid).get(),
      db.collection('peer_bookings').where('userId', '==', uid).get(),
      db.collection('confessions').where('uid', '==', uid).get(),
      db.collection('user_saved_items').where('userId', '==', uid).get()
    ]);

    // 3. Helper to format snapshot data safely
    const formatDocs = (snap: admin.firestore.QuerySnapshot) => {
      return snap.docs.map(doc => {
        const d = doc.data();
        // Convert Firestore Timestamps to ISO strings for cleaner JSON export
        const cleanData: any = {};
        for (const [key, value] of Object.entries(d)) {
          if (value && typeof value === 'object' && 'toDate' in value && typeof (value as any).toDate === 'function') {
            cleanData[key] = (value as any).toDate().toISOString();
          } else {
            cleanData[key] = value;
          }
        }
        return { id: doc.id, ...cleanData };
      });
    };

    const cleanDocData = (docSnap: admin.firestore.DocumentSnapshot) => {
      if (!docSnap.exists) return null;
      const d = docSnap.data() || {};
      const cleanData: any = {};
      for (const [key, value] of Object.entries(d)) {
        if (value && typeof value === 'object' && 'toDate' in value && typeof (value as any).toDate === 'function') {
          cleanData[key] = (value as any).toDate().toISOString();
        } else {
          cleanData[key] = value;
        }
      }
      return { id: docSnap.id, ...cleanData };
    };

    // 4. Assemble JSON response
    const exportData: any = {
      exportedAt: new Date().toISOString(),
      userId: uid,
      profile: cleanDocData(userDoc),
      roles: cleanDocData(roleDoc),
      journal: cleanDocData(journalDoc),
      wallet: cleanDocData(walletDoc) || cleanDocData(userWalletDoc),
      journalEntries: formatDocs(journalEntriesSnap),
      moodEntries: formatDocs(moodEntriesSnap),
      processingConsents: formatDocs(processingConsentsSnap),
      cookieConsents: formatDocs(cookieConsentsSnap),
      parentalConsents: formatDocs(parentalConsentsSnap),
      bookings: formatDocs(bookingsSnap),
      confessions: formatDocs(confessionsSnap),
      savedItems: formatDocs(savedItemsSnap)
    };

    return { success: true, data: exportData };
  } catch (error: any) {
    console.error("🔥 [exportUserData] Error:", error.message);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to export user data');
  }
});
