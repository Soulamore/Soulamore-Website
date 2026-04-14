/**
 * On User Create Trigger
 * Automatically assigns default role when new user signs up
 * 
 * TRIGGER: Firebase Auth user creation
 * 
 * @version 1.0.0
 * @date March 20, 2026
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { generateSoulamoreEmail, sendEmail } from '../emailService';

/**
 * Trigger: Automatically assign default role when new user signs up
 * 
 * This function:
 * 1. Sets custom claims with 'user' role
 * 2. Creates user profile in Firestore
 * 
 * @param user - The newly created user record
 */
export const onUserCreate = functions.auth.user().onCreate(async (user): Promise<void> => {
  const customClaims = {
    role: 'user', // Default role for all new users
    createdAt: new Date().toISOString()
  };

  try {
    functions.logger.info(`🆕 New user created: ${user.uid} (${user.email})`);

    // 1. Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    functions.logger.info(`✅ Default role 'user' assigned to ${user.uid}`);

    // 2. Create user profile in Firestore
    const db = admin.firestore();
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      photoURL: user.photoURL,
      role: 'user',
      emailVerified: user.emailVerified,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSignInAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(user.uid).set(userProfile);
    functions.logger.info(`✅ User profile created in Firestore for ${user.uid}`);

    // 2.5 Send Welcome Email
    if (user.email) {
        try {
            const { subject, html } = generateSoulamoreEmail('signup_welcome', { 
                name: user.displayName || user.email?.split('@')[0] || 'Friend' 
            });
            await sendEmail({ email: user.email }, subject, html);
        } catch (emailErr) {
            functions.logger.error('Welcome email failed:', emailErr);
        }
    }

    // 3. Log user creation
    await db.collection('user_creation_logs').add({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: user.providerData[0]?.providerId || 'unknown'
    });

    functions.logger.info(`✅ User creation complete for ${user.uid}`);

  } catch (error) {
    functions.logger.error('Error assigning default role:', error);
    // Don't throw - user was created successfully, role can be assigned later
    // But log the error for investigation
  }
});
