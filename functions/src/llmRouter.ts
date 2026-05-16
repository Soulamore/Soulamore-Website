import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

// Initialize a secondary app for the LLM Router if it doesn't already exist.
// This runs once at module load time and is the single source of truth for the
// 'llm-router' app instance across the entire functions package.
let llmApp: admin.app.App;
try {
  llmApp = admin.app('llm-router');
} catch (e) {
  const serviceAccount = {
    "type": "service_account",
    "project_id": "llm-router-870c5",
    "private_key_id": "99dccd4585157fc2356197053275a8eabec75863",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDMbClLYymktVRi\nlxUd3qSeQSQA+p5uQDc78W0C/rmrpJzH/2e2EVYVw4FBA6TfLqvx0sLPgBI9qLRI\nKxisz14wJujg/jyLkYcg43sPpquzjeYGYhuemuhpSASsPR+x/ojYCy81yfp+FegE\nwp7ixUyw/P47RouXkC1oH1LawwEsRjqU/qb1ite9C3a+5waJ0wmcuM4FvcRc74Tq\nkH/U7zrqjq+g1mnFaPBEbBetyG1j4W4lTIHwXPH7rWOLfnJ6g748cHX54YQ+DjRu\nLIuT20LHohlkos2fH2ohLQitdnCf0ll+Ynfc7ABzSPgmL2WDiQ3jJ1srwvkY9em8\nLYkLb+4VAgMBAAECggEABW3P8PEav4WTTqT9ihQKIivPtXjycTIiZWSlhQFX0/+k\nrEkTq4mtVBmjmqLqo4S9S0hSJSmdEmcjFpGSb7B4K2Y1JBiMahZ81LpF3+YIxFV9\n6Oh9HEq35mfju+FJsLP2VWqCn/aTwPp69Xlnt9UOktq9M7zNY0KQeiXu0OGB6/eL\nUc1AGrZiv4S9nACMGX1XloEug1fPKrnoRC+90mS4s2i4BCQMCH+gkfdhbGrGlhfh\nf5WHdJwjF9a1XTIs1JM8u5nsmMFOR8DrF3IzHCn0y6llgUe3P0y4CsTimwOfSxJc\nWhawuhfcSQDJz9tUfweqsaUoINj9X5nImqf0WjAywQKBgQD3KXxNe4BfsegJyW5Q\nJ/9ADIpnObEtgqIF0/HAiIQgGGBWVs8RmBzR0PrY0zaQS8hrekxDN3BCBemVPM0Q\nAUQB3IsXBD7tspgjZst2iFdvmFC3x7rwarkV6gLhgE/9fSru5cWvZyW4qxRpzUL8\n9ZXDLcd+XhNLCRYf+gna1ZcN4QKBgQDTu3BrR4TZR70cGbRp5Jf8ehQ3zM+MQemg\nnBkL6NYFZqyhrNwmTweRT1cnf0ZV3pe1v4PhKAh01fNIxN6JHrVucZi2Acitey3e\n93OIc9yFzRxoDwKz8f8GjosZlfzabvfPIrffqFvPMW7m8bkZAKbsFmX/9LhAeJMz\nX6hsONretQKBgQCwMHSZz1Y94Val01+96CU/BTGMUEYLSToyqVmGhEqbjoTuR0ep\nJSQ2NaD7++TDjCI865t9twFhL1HJvuP3as+N/CdyquYpD80AP4D+6EZcGNpBiDGs\nvIdgJccT9SIQc6+tSUJYvVDYiawtl9MO/Apcbj/txyY9sSaCeP2Zb/UUQQKBgQDF\nfo7r4jgOnBXPQkLAi1MhU5XMPqRRhaGwCCpsq3AGdbEM1To8GXdLmSAIXXVz3z7P\nbqZKvJa2tGJLPCb+67/8FsWE78EJ4F33HgWL/9Zwj9OxVF8HDfD9YrRo1ziVXvCT\nKyUr39RTPR7fGBW5Npx8lp/p0ZCTwmQ7hTyKRbYSCQKBgQDQZuqbR7/eglyBz33V\nvr56YgF/zgvRcUQVUmPWvIcjFpRpq0ue1a1OxYCvhQOPEhFidisjudJwEWjbrGcD\nNfbwmh2Cq93plo8dmL+H4ceQvDg1gi9iJzeR5cVyLWqlypQWb5gLb8ZnudoV7VD1\nbwuSlZcFWOQw4pc/CRqynW9tVg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@llm-router-870c5.iam.gserviceaccount.com"
  };

  llmApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    projectId: 'llm-router-870c5'
  }, 'llm-router');
}

// ✅ Export llmDb so other modules (healthMonitoring.ts) can import it
// directly without attempting a second initialization of 'llm-router'.
export const llmDb = llmApp.firestore();


// Soulamore Router Key (Cross-account identification)
const SOULAMORE_ROUTER_KEY = "router_svpkARCYUuTATB_3e8gKpNLQ8G2hoSL4";
const ROUTER_BASE_URL = "https://llm-router-870c5.web.app/v1";

/**
 * Core Logic for LLM Routing with Fallback
 * Tries multiple keys in order of priority (High-end first)
 */
export async function handleLlmRequest(data: any, auth: any) {
  const { appId, messages, model, temperature } = data;
  if (!appId || !messages) {
    throw new Error('Missing appId or messages.');
  }

  // 1. Fetch all active keys from the central router
  const keysSnap = await llmDb.collection('keys').where('status', '==', 'active').get();
  let availableConfigs = keysSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as any));

  if (availableConfigs.length === 0) {
    throw new Error('No active LLM configurations available in the router.');
  }

  // 2. Define Priority (Latest/High-end models first)
  // Higher rank = Higher priority
  const getPriority = (config: any) => {
    const name = (config.name || '').toLowerCase();
    const modelStr = (config.model || '').toLowerCase();
    
    if (name.includes('gpt-5') || name.includes('gpt-4o') || modelStr.includes('gpt-4o')) return 100;
    if (name.includes('opus') || name.includes('claude-3-5')) return 95;
    if (name.includes('gpt-4') || modelStr.includes('gpt-4')) return 80;
    if (name.includes('sonnet') || name.includes('claude-3')) return 70;
    if (name.includes('gpt-3.5') || modelStr.includes('gpt-3.5')) return 50;
    return 10; // Default low priority
  };

  availableConfigs.sort((a, b) => getPriority(b) - getPriority(a));

  // 3. Attempt requests with fallback
  let lastError = null;
  for (const config of availableConfigs) {
    try {
      console.log(`🤖 [llmRouter] Attempting request with key: ${config.name} (${config.provider})`);
      
      const apiKey = config.key;
      const baseURL = config.baseURL || 'https://api.openai.com/v1';
      const targetModel = model || config.model || 'gpt-4o';

      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-app-id': appId
        },
        body: JSON.stringify({
          model: targetModel,
          messages: messages,
          temperature: temperature || 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        const msg = errorData.error?.message || `HTTP ${response.status}`;
        console.warn(`⚠️ [llmRouter] Key ${config.name} failed: ${msg}. Trying next...`);
        lastError = new Error(msg);
        continue; // Try next key
      }

      const result = await response.json();
      console.log(`✅ [llmRouter] Request successful with key: ${config.name}`);
      return result;

    } catch (err: any) {
      console.error(`❌ [llmRouter] Network/Fetch error with key ${config.name}:`, err.message);
      lastError = err;
      continue; // Try next key
    }
  }

  throw lastError || new Error('All LLM keys failed to process the request.');
}

/**
 * LLM Router Function
 * Securely fetches keys from the central router and dispatches chat requests.
 */
export const llmChat = functions.runWith({
  timeoutSeconds: 300,
  memory: '512MB'
}).https.onCall(async (data, context) => {
  // 1. Auth Guard
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  try {
    return await handleLlmRequest(data, context.auth);
  } catch (error: any) {
    console.error(`LLM Router Error [${data.appId}]:`, error);
    throw new functions.https.HttpsError('internal', error.message || 'LLM Routing Failed');
  }
});
