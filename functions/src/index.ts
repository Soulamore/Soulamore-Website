/**
 * Soulamore Cloud Functions - Index
 * Main entry point for all Cloud Functions
 * 
 * @version 1.0.0
 * @date March 20, 2026
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export role management functions
export * from './roles';

// Export auth triggers
export * from './triggers/on-user-create';

// Health check function
export const healthCheck = functions.https.onCall(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});
