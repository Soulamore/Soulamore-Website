/**
 * Promote Admin Script (Direct gcloud access token)
 * Uses a gcloud access token directly. Run:
 *   $token = gcloud auth print-access-token --account=aditya110197@gmail.com
 *   node functions/scripts/promote-admin-gcloud.js <token>
 * 
 * OR let it fetch automatically:
 *   node functions/scripts/promote-admin-gcloud.js
 */

const admin = require('firebase-admin');
const { execSync } = require('child_process');

const ADMIN_EMAIL = 'admin@soulamore.com';
const PROJECT_ID = 'soulamore-f0a64';

// Get access token either from arg or from gcloud
let accessToken = process.argv[2];
if (!accessToken) {
  try {
    accessToken = execSync('gcloud auth print-access-token --account=aditya110197@gmail.com', { encoding: 'utf8' }).trim();
    console.log('🔑 Got access token from gcloud (aditya110197@gmail.com)');
  } catch (e) {
    console.error('❌ Failed to get gcloud token:', e.message);
    process.exit(1);
  }
}

// Custom credential from access token
const credential = {
  getAccessToken: () => Promise.resolve({
    access_token: accessToken,
    expires_in: 3600
  })
};

admin.initializeApp({ credential, projectId: PROJECT_ID });

async function promoteToAdmin(email) {
  try {
    console.log(`\n🔍 Looking up user: ${email} ...`);
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found: ${userRecord.uid}`);

    const currentClaims = userRecord.customClaims || {};
    console.log('📋 Current claims:', JSON.stringify(currentClaims));

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      ...currentClaims,
      role: 'admin'
    });
    console.log(`✅ role:'admin' custom claim set for ${email}`);

    // Verify
    const updated = await admin.auth().getUser(userRecord.uid);
    console.log('✅ Verified claims:', JSON.stringify(updated.customClaims));
    console.log('\n🎉 Done! Log out and log back in to activate the new role.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

promoteToAdmin(ADMIN_EMAIL);
