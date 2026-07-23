/**
 * Promote Admin Script (Firebase CLI session token)
 * Uses the Firebase CLI's stored access token for contact.soulamore@gmail.com
 * 
 * USAGE: node functions/scripts/promote-admin-cli-token.js
 */

const admin = require('firebase-admin');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ADMIN_EMAIL = 'admin@soulamore.com';
const PROJECT_ID = 'soulamore-f0a64';

// Read Firebase CLI access token
const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
const cliConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const accessToken = cliConfig.tokens?.access_token;

if (!accessToken) {
  console.error('❌ No access token found in Firebase CLI config');
  process.exit(1);
}

console.log('🔑 Using Firebase CLI token for contact.soulamore@gmail.com');

// Use Firebase Auth REST API to set custom claims directly
// Firebase Identity Toolkit REST API endpoint
// POST https://identitytoolkit.googleapis.com/v1/projects/{project}/accounts?key=...
// This requires a valid access token with Firebase Admin permissions

async function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function promoteToAdmin() {
  try {
    // Step 1: Look up user by email using Identity Toolkit
    console.log(`\n🔍 Looking up ${ADMIN_EMAIL} ...`);
    const lookupResp = await httpRequest({
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/accounts:lookup`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }, { email: [ADMIN_EMAIL] });

    if (lookupResp.status !== 200) {
      console.error('❌ Lookup failed:', JSON.stringify(lookupResp.data, null, 2));
      process.exit(1);
    }

    const users = lookupResp.data.users || [];
    if (users.length === 0) {
      console.error('❌ User not found:', ADMIN_EMAIL);
      process.exit(1);
    }

    const user = users[0];
    console.log(`✅ Found: ${user.localId}`);
    const currentClaims = user.customAttributes ? JSON.parse(user.customAttributes) : {};
    console.log('📋 Current claims:', JSON.stringify(currentClaims));

    // Step 2: Set custom claims via Identity Toolkit
    const newClaims = { ...currentClaims, role: 'admin' };
    console.log(`\n🔄 Setting claims: ${JSON.stringify(newClaims)} ...`);

    const updateResp = await httpRequest({
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/accounts`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      localId: user.localId,
      customAttributes: JSON.stringify(newClaims)
    });

    if (updateResp.status !== 200) {
      console.error('❌ Update failed:', JSON.stringify(updateResp.data, null, 2));
      process.exit(1);
    }

    console.log(`✅ Custom claims set successfully!`);

    // Step 3: Verify
    const verifyResp = await httpRequest({
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/accounts:lookup`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }, { localId: [user.localId] });

    const verifiedUser = (verifyResp.data.users || [])[0];
    const verifiedClaims = verifiedUser?.customAttributes ? JSON.parse(verifiedUser.customAttributes) : {};
    console.log('✅ Verified claims:', JSON.stringify(verifiedClaims));

    console.log('\n🎉 SUCCESS! Log out and log back in to activate the new role.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

promoteToAdmin();
