const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'soulamore-f0a64'
    });
}

const db = admin.firestore();

async function checkGroups() {
    console.log("Checking support_groups collection...");
    const snap = await db.collection('support_groups').get();
    console.log(`Found ${snap.size} documents.`);
    
    snap.forEach(doc => {
        const data = doc.data();
        console.log(`- [${doc.id}]: ${data.title || data.name} (Listed: ${data.isListed !== false})`);
    });
}

checkGroups().catch(console.error);
