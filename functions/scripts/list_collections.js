const admin = require('firebase-admin');
const serviceAccount = require('D:/Projects/CORE_INTELLIGENCE/Keys/soulamore-f0a64/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function listCollections() {
  const collections = await db.listCollections();
  console.log('Collections:');
  collections.forEach(collection => console.log('- ' + collection.id));
}

listCollections();
