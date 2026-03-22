/**
 * Backfill User Roles Script
 * One-time script to assign custom claims to all existing users based on their Firestore role
 * 
 * USAGE:
 * 1. Download service account key from Firebase Console
 * 2. Save as 'serviceAccountKey.json' in functions/ folder
 * 3. Run: npm run backfill-roles
 * 
 * @date March 20, 2026
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Check if service account key exists
const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error('❌ Service account key not found!');
  console.error('');
  console.error('Please follow these steps:');
  console.error('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.error('2. Click "Generate New Private Key"');
  console.error('3. Save the JSON file as "serviceAccountKey.json" in the functions/ folder');
  console.error('');
  process.exit(1);
}

// Initialize Admin SDK
const serviceAccount = require(keyPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const ALLOWED_ROLES = ['user', 'peer', 'psychologist', 'admin'];

async function backfillUserRoles() {
  try {
    console.log('');
    console.log('🔄 Starting user role backfill...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const db = admin.firestore();
    
    // 1. Get all users from Firestore
    console.log('📥 Fetching users from Firestore...');
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('⚠️  No users found in Firestore');
      process.exit(0);
    }
    
    console.log(`✅ Found ${usersSnapshot.size} users`);
    console.log('');
    
    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;
    
    // 2. Process each user
    for (const doc of usersSnapshot.docs) {
      const userId = doc.id;
      const userData = doc.data();
      const currentRole = userData.role || 'user';
      
      // Validate role
      if (!ALLOWED_ROLES.includes(currentRole)) {
        console.log(`⚠️  Invalid role for ${userId}: ${currentRole}. Setting to 'user'.`);
      }
      
      try {
        // 3. Get current Auth claims
        const userRecord = await admin.auth().getUser(userId);
        const currentClaims = userRecord.customClaims || {};
        
        // 4. Check if claims already match
        if (currentClaims.role === currentRole) {
          console.log(`⏭️  Skipping ${userId} - claims already match (${currentRole})`);
          skipCount++;
          continue;
        }
        
        // 5. Update custom claims
        const updatedClaims = {
          ...currentClaims,
          role: currentRole
        };
        
        await admin.auth().setCustomUserClaims(userId, updatedClaims);
        
        console.log(`✅ Backfilled ${userId} with role: ${currentRole}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Failed to backfill ${userId}:`, error.message);
        failCount++;
      }
    }
    
    // 3. Summary
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Backfill Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total: ${usersSnapshot.size}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Users must log out and log back in to receive their new custom claims.');
    console.log('');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run script
backfillUserRoles();
