/**
 * Soulamore Cloud Functions - Index
 * Main entry point for all Cloud Functions
 * 
 * @version 1.0.0
 * @date March 20, 2026
 */

import * as admin from 'firebase-admin';
import { onCall } from 'firebase-functions/v2/https';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export role management functions
export * from './roles';

// Export auth triggers
export * from './triggers/on-user-create';

// Export email triggers
export * from './triggers/emailTriggers';

// Export new core services
export * from './llmRouter';
export * from './healthMonitoring'; // Exports getApiHealth
export * from './campaigns';
export * from './emailService';

// Health check function
export const healthCheckV2 = onCall({ cors: true }, () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});
