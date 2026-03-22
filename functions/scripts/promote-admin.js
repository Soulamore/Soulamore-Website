/**
 * Promote Admin Script
 * One-time script to promote an existing user to admin via Custom Claims
 * 
 * USAGE:
 * 1. Download service account key from Firebase Console
 * 2. Save as 'serviceAccountKey.json' in functions/ folder
 * 3. Update ADMIN_EMAIL below
 * 4. Run: npm run promote-admin
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

// CONFIGURATION: Update this with your admin email
const ADMIN_EMAIL = 'admin@soulamore.com'; // Replace with your admin email

async function promoteUserToAdmin(userEmail) {
  try {
    console.log(`🔍 Searching for user: ${userEmail}...`);
    
    // 1. Get user by email
    const userRecord = await admin.auth().getUserByEmail(userEmail);
    console.log(`✅ Found user: ${userRecord.uid}`);
    
    // 2. Get current claims
    const currentClaims = userRecord.customClaims || {};
    console.log('📋 Current claims:', currentClaims);
    
    // 3. Add admin role
    const updatedClaims = {
      ...currentClaims,
      role: 'admin'
    };
    
    // 4. Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, updatedClaims);
    console.log('✅ Custom claims updated successfully');
    
    // 5. Update Firestore profile
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).update({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Firestore profile updated');
    
    console.log('');
    console.log('🎉 SUCCESS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User ${userEmail} (${userRecord.uid}) has been promoted to ADMIN`);
    console.log('');
    console.log('⚠️  IMPORTANT: The user must log out and log back in to receive the new role.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Log out of the admin account');
    console.log('2. Log back in');
    console.log('3. Navigate to admin-dashboard.html');
    console.log('4. You should now have full admin access!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error promoting user:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Make sure the email address is correct');
    console.error('2. Make sure the user exists in Firebase Authentication');
    console.error('3. Check that your service account key has admin permissions');
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run script
console.log('');
console.log('🚀 Promoting user to admin...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
promoteUserToAdmin(ADMIN_EMAIL);
