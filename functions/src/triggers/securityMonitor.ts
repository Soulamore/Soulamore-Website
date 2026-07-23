import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Log Security Event
 * Allows logging of security-related events to Firestore
 */
export const logSecurityEvent = functions.runWith({
  timeoutSeconds: 60,
  memory: '256MB'
}).https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { eventType, description, severity, metadata } = data;
  if (!eventType || !description || !severity) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing eventType, description, or severity.');
  }

  const db = admin.firestore();

  try {
    const securityEvent = {
      userId: context.auth.uid,
      userEmail: context.auth.token.email || 'anonymous',
      eventType,
      description,
      severity, // 'low' | 'medium' | 'high' | 'critical'
      metadata: metadata || {},
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('security_events').add(securityEvent);
    functions.logger.info(`🚨 [logSecurityEvent] Security event logged: ${eventType} (${severity}) by ${context.auth.uid}`);

    return { success: true };
  } catch (error: any) {
    console.error("🔥 [logSecurityEvent] Error:", error.message);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to log security event');
  }
});
