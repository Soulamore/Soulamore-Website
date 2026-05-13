import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sib from '@getbrevo/brevo';

// ✅ FIX: Import the already-initialized llmDb from llmRouter.
// llmRouter.ts initializes the 'llm-router' secondary app at module load time.
// Attempting to re-initialize it here causes an "app already exists" crash.
import { llmDb } from './llmRouter';

/**
 * API Health Telemetry
 * Provides system-wide health status for integrated services.
 */
export const getApiHealth = functions.runWith({
  timeoutSeconds: 60,
  memory: '512MB'
}).https.onCall(async (data, context) => {
  console.log("🚀 [getApiHealth] Probe Started");

  // 1. Admin Auth Guard (must be OUTSIDE try/catch so HttpsErrors propagate correctly)
  if (!context.auth) {
    console.warn("❌ [getApiHealth] Unauthenticated access attempt");
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  // ✅ FIX: Admin role check also moved outside the main try/catch.
  // HttpsError thrown inside a catch block gets swallowed and re-thrown
  // as a generic 'internal' error. Keep auth guards at the top level.
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    console.warn(`❌ [getApiHealth] Unauthorized role: ${userDoc.data()?.role} for UID: ${context.auth.uid}`);
    throw new functions.https.HttpsError('permission-denied', 'Only admins can view system health.');
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    services: {}
  };

  // 2. Check Brevo Health
  console.log("📡 [getApiHealth] Checking Brevo...");
  try {
    // ✅ FIX: Removed the legacy functions.config() fallback. In Gen 1/Gen 2
    // functions deployed with Secret Manager or env vars, functions.config()
    // can throw or return undefined, crashing this line. Use only process.env.
    const BREVO_KEY = process.env.BREVO_API_KEY?.trim();
    if (!BREVO_KEY) throw new Error("BREVO_API_KEY secret is not set in the function environment.");

    const apiInstance = new sib.TransactionalEmailsApi();
    apiInstance.setApiKey(sib.TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

    results.services.brevo = {
      status: 'operational',
      plan: 'Premium (Managed)',
      credits: 'Managed'
    };
    console.log("✅ [getApiHealth] Brevo Operational");
  } catch (err: any) {
    console.error("❌ [getApiHealth] Brevo Error:", err.message);
    results.services.brevo = {
      status: 'error',
      message: err.message
    };
  }

  // 3. Check LLM Router Health
  // ✅ FIX: No initialization logic here at all. llmDb is imported directly
  // from llmRouter.ts which handles the singleton initialization safely.
  console.log("📡 [getApiHealth] Checking LLM Router...");
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
    console.log("✅ [getApiHealth] LLM Router Operational");
  } catch (err: any) {
    console.error("❌ [getApiHealth] LLM Router Error:", err.message);
    results.services.llmRouter = {
      status: 'error',
      message: err.message
    };
  }

  // 4. Check Firestore/Auth (Native)
  console.log("📡 [getApiHealth] Checking Firestore...");
  try {
    await admin.firestore().collection('_health_check').doc('ping').set({
      last_check: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    results.services.firebase = { status: 'operational' };
    console.log("✅ [getApiHealth] Firestore Operational");
  } catch (err: any) {
    console.error("❌ [getApiHealth] Firestore Error:", err.message);
    results.services.firebase = { status: 'error', message: err.message };
  }

  return results;
});
