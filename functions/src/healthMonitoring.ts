import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sib from '@getbrevo/brevo';

/**
 * API Health Telemetry
 * Provides system-wide health status for integrated services.
 */
export const getApiHealth = functions.runWith({
  timeoutSeconds: 60,
  memory: '512MB'
}).https.onCall(async (data, context) => {
  console.log("🚀 [getApiHealth] Probe Started");

  // 1. Admin Auth Guard
  if (!context.auth) {
    console.warn("❌ [getApiHealth] Unauthenticated access attempt");
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  try {
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
      const BREVO_KEY = (process.env.BREVO_API_KEY || (functions as any).config().brevo?.key)?.trim();
      if (!BREVO_KEY) throw new Error("Missing BREVO_API_KEY");
      
      const apiInstance = new sib.AccountApi();
      apiInstance.setApiKey(sib.AccountApiApiKeys.apiKey, BREVO_KEY);
      
      const accountInfo = await apiInstance.getAccount();
      results.services.brevo = {
        status: 'operational',
        plan: accountInfo.body.plan,
        credits: accountInfo.body.plan.find(p => p.type === 'credits')?.credits || 0
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
    console.log("📡 [getApiHealth] Checking LLM Router...");
    try {
      let llmApp: admin.app.App;
      try {
        llmApp = admin.app('llm-router');
      } catch (e) {
        console.log("🔄 [getApiHealth] Initializing llm-router via IAM/ProjectID...");
        try {
          llmApp = admin.initializeApp({
            projectId: 'llm-router-870c5'
          }, 'llm-router');
        } catch (initErr: any) {
          throw new Error(`Failed to initialize llm-router bridge: ${initErr.message}`);
        }
      }

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

  } catch (globalErr: any) {
    console.error("🔥 [getApiHealth] CRITICAL INTERNAL ERROR:", globalErr);
    // Return a safe object instead of throwing, so the UI can show the error in the logs
    return {
      timestamp: new Date().toISOString(),
      error: globalErr.message,
      services: {
        system: { status: 'error', message: globalErr.message }
      }
    };
  }
});
