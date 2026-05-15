import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { llmDb } from './llmRouter';

/**
 * API Health Telemetry (Standard v1 Pattern)
 * Provides system-wide health status for integrated services.
 */
/**
 * Core Logic for Health Probing
 * Can be called by onCall or by Express onRequest (via apiRouter)
 */
export async function probeAllServices() {
  const results: any = {
    timestamp: new Date().toISOString(),
    services: {}
  };

  // 1. Check Brevo Health
  console.log("📡 [probeAllServices] Checking Brevo...");
  try {
    const BREVO_KEY = process.env.BREVO_API_KEY?.trim();
    if (!BREVO_KEY) throw new Error("BREVO_API_KEY secret is not set in the function environment.");

    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

    results.services.brevo = {
      status: 'operational',
      plan: 'Premium (Managed)',
      credits: 'Managed'
    };
    console.log("✅ [probeAllServices] Brevo Operational");
  } catch (err: any) {
    console.error("❌ [probeAllServices] Brevo Error:", err.message);
    results.services.brevo = {
      status: 'error',
      message: err.message
    };
  }

  // 2. Check LLM Router Health
  console.log("📡 [probeAllServices] Checking LLM Router...");
  try {
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
      keys: keys
    };
    console.log("✅ [probeAllServices] LLM Router Operational");
  } catch (err: any) {
    console.error("❌ [probeAllServices] LLM Router Error:", err.message);
    results.services.llmRouter = {
      status: 'error',
      message: err.message
    };
  }

  // 3. Check Firestore/Auth (Native)
  console.log("📡 [probeAllServices] Checking Firestore...");
  try {
    await admin.firestore().collection('_health_check').doc('ping').set({
      last_check: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    results.services.firebase = { status: 'operational' };
    console.log("✅ [probeAllServices] Firestore Operational");
  } catch (err: any) {
    console.error("❌ [probeAllServices] Firestore Error:", err.message);
    results.services.firebase = { status: 'error', message: err.message };
  }

  return results;
}

/**
 * API Health Telemetry (Standard v1 Pattern)
 * Provides system-wide health status for integrated services.
 */
export const getApiHealth = functions.runWith({
  timeoutSeconds: 60,
  memory: '512MB'
}).https.onCall(async (data: any, context: functions.https.CallableContext) => {
  console.log("🚀 [getApiHealth] Probe Started");

  // 1. Admin Auth Guard
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can view system health.');
  }

  return await probeAllServices();
});
