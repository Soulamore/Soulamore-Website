import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sib from '@getbrevo/brevo';

/**
 * API Health Telemetry
 * Provides system-wide health status for integrated services.
 */
export const getApiHealth = functions.https.onCall(async (data, context) => {
  // 1. Admin Auth Guard
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  // Check if user is admin
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can view system health.');
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    services: {}
  };

  // 2. Check Brevo Health
  try {
    const BREVO_KEY = (process.env.BREVO_API_KEY || (functions as any).config().brevo?.key)?.trim();
    const apiInstance = new sib.AccountApi();
    apiInstance.setApiKey(sib.AccountApiApiKeys.apiKey, BREVO_KEY);
    
    const accountInfo = await apiInstance.getAccount();
    results.services.brevo = {
      status: 'operational',
      plan: accountInfo.body.plan,
      credits: accountInfo.body.plan.find(p => p.type === 'credits')?.credits || 0
    };
  } catch (err: any) {
    results.services.brevo = {
      status: 'error',
      message: err.message
    };
  }

  // 3. Check LLM Router Health
  try {
    const llmApp = admin.app('llm-router');
    const llmDb = llmApp.firestore();
    const keysSnap = await llmDb.collection('keys').get();
    
    const keys = keysSnap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || doc.id,
        status: d.status || 'unknown',
        provider: d.provider || 'custom'
      };
    });

    results.services.llmRouter = {
      status: 'operational',
      activeKeys: keys.filter(k => k.status === 'active').length,
      totalKeys: keys.length,
      keys: keys // Detailed telemetry for the dashboard
    };
  } catch (err: any) {
    results.services.llmRouter = {
      status: 'error',
      message: err.message
    };
  }

  // 4. Check Firestore/Auth (Native)
  try {
    await admin.firestore().collection('_health_check').doc('ping').set({
      last_check: admin.firestore.FieldValue.serverTimestamp()
    });
    results.services.firebase = { status: 'operational' };
  } catch (err: any) {
    results.services.firebase = { status: 'error', message: err.message };
  }

  return results;
});
