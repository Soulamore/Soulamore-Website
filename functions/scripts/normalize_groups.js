/**
 * Maintenance Script: Normalize Support Groups
 * Populates missing 'link' (WhatsApp invite) fields in Firestore 'support_groups' collection.
 * 
 * Usage: node functions/scripts/normalize_groups.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Reference the centralized key
const serviceAccountPath = 'D:/Projects/CORE_INTELLIGENCE/Keys/soulamore-f0a64/serviceAccountKey.json';
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Gold Standard WhatsApp Links
const WHATSAPP_MAP = {
  'Relationships': 'https://chat.whatsapp.com/LRoFCws0rHG2KSwnYIH3kW',
  'Neurodivergence': 'https://chat.whatsapp.com/LL39jGibqf3DFYcfekBuqg',
  'Habits': 'https://chat.whatsapp.com/CmqGzHKzpblHBFGFojAtfB',
  'Expats in Germany': 'https://chat.whatsapp.com/I7fFRL5Z69iDgIwuMXmdGV',
  'Women\'s Circles': 'https://chat.whatsapp.com/LKTLKt6uRPgBJhOBY7AKoO',
  'Students in India': 'https://chat.whatsapp.com/Gnd9R7S5RCJ5XjD3E5fmWH'
};

async function normalizeGroups() {
  console.log('🚀 Starting Support Groups normalization...');
  
  try {
    const groupsRef = db.collection('support_groups');
    const snapshot = await groupsRef.get();
    
    if (snapshot.empty) {
      console.log('⚠️ No support groups found in Firestore.');
      return;
    }

    let updatedCount = 0;
    const batch = db.batch();

    snapshot.forEach(doc => {
      const data = doc.data();
      const groupName = data.name;
      
      // Check if we have a gold standard link for this group
      const goldLink = WHATSAPP_MAP[groupName];
      
      if (goldLink) {
        // Update if link is missing or generic/placeholder
        if (!data.link || data.link === '#' || data.link.includes('placeholder')) {
          batch.update(doc.ref, { 
            link: goldLink,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            normalized: true
          });
          console.log(`✅ Queued update for: ${groupName}`);
          updatedCount++;
        } else {
          console.log(`ℹ️ Group already has valid link: ${groupName}`);
        }
      } else {
        console.log(`❓ No link mapping found for: ${groupName}`);
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`\n✨ Successfully normalized ${updatedCount} groups.`);
    } else {
      console.log('\n😴 No updates needed.');
    }

  } catch (error) {
    console.error('❌ Normalization failed:', error);
  } finally {
    process.exit();
  }
}

normalizeGroups();
