/**
 * Promote Admin Script (Application Default Credentials)
 * Uses ADC (gcloud auth application-default login) instead of service account key
 * 
 * USAGE:
 * 1. Ensure you are logged in: gcloud auth application-default login
 * 2. Run: node functions/scripts/promote-admin-adc.js
 */

const admin = require('firebase-admin');

// Use Application Default Credentials (gcloud ADC)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'soulamore-f0a64'
});

const ADMIN_EMAIL = 'admin@soulamore.com';

async function promoteToAdmin(email) {
  const db = admin.firestore();
  try {
    console.log(`\n🔍 Looking up user: ${email} ...`);
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found: ${userRecord.uid}`);

    const currentClaims = userRecord.customClaims || {};
    console.log('📋 Current claims:', currentClaims);

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      ...currentClaims,
      role: 'admin'
    });
    console.log(`✅ Custom claim role:'admin' set for ${email}`);

    // Also update Firestore profile
    const userRef = db.collection('users').doc(userRecord.uid);
    const snap = await userRef.get();
    if (snap.exists) {
      await userRef.update({ role: 'admin', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    } else {
      await userRef.set({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || 'Admin',
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ Firestore profile updated for ${email}`);

    console.log('\n🎉 Done! User must log out and log back in to get the new token.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

promoteToAdmin(ADMIN_EMAIL);
