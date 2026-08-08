/**
 * Promote Admin Script (Firebase CLI Token)
 * Uses the Firebase CLI stored OAuth token — no service account key needed.
 * 
 * USAGE: node functions/scripts/promote-admin-token.js
 */

const admin = require('firebase-admin');
const { GoogleAuth, UserRefreshClient } = require('google-auth-library');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Read Firebase CLI tokens from configstore
const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ Firebase CLI configstore not found. Run: npx firebase login');
  process.exit(1);
}

const cliConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const tokens = cliConfig.tokens;

if (!tokens || !tokens.refresh_token) {
  console.error('❌ No Firebase CLI refresh token found. Run: npx firebase login');
  process.exit(1);
}

const ADMIN_EMAIL = 'admin@soulamore.com';
const PROJECT_ID = 'soulamore-f0a64';

// Build a Google OAuth2 credential using the Firebase CLI's refresh token
const client = new UserRefreshClient({
  clientId: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
  clientSecret: 'j9iVZfS7oa8nFbgFU9FmXud5',  // Firebase CLI public client secret
  refreshToken: tokens.refresh_token
});

admin.initializeApp({
  credential: {
    getAccessToken: async () => {
      const resp = await client.getAccessToken();
      return { access_token: resp.token, expires_in: 3600 };
    }
  },
  projectId: PROJECT_ID
});

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
    console.log(`✅ Custom claim role:'admin' set for ${email}`);
    console.log('\n🎉 Done! User must log out and log back in for new token.\n');
    console.log('ℹ️  Firestore profile will be auto-updated on next admin dashboard visit.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}


promoteToAdmin(ADMIN_EMAIL);
