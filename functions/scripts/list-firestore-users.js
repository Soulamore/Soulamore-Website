const admin = require('firebase-admin');

// Initialize Admin SDK without arguments to use default credential (will use active CLI login account or ADC)
admin.initializeApp();

async function listUsers() {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('users').get();
    console.log('--- Firestore Users ---');
    snapshot.forEach(doc => {
      console.log(`UID: ${doc.id} | Email: ${doc.data().email} | Role: ${doc.data().role}`);
    });
    console.log('-----------------------');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

listUsers();
