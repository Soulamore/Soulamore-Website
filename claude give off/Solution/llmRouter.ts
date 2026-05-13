import * as functions from 'firebase-functions';
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

  const { appId, messages, model, temperature } = data;
  if (!appId || !messages) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing appId or messages.');
  }

  try {
    let apiKey: string;
    let baseURL: string;

    // 2. Resolve Key (Direct for Soulamore, Firestore for others)
    if (appId === 'soulamore' || appId === 'soulbot') {
      apiKey = SOULAMORE_ROUTER_KEY;
      baseURL = ROUTER_BASE_URL;
    } else {
      const keyDoc = await llmDb.collection('keys').doc(appId).get();
      if (!keyDoc.exists) {
        throw new functions.https.HttpsError('not-found', `No LLM configuration found for AppID: ${appId}`);
      }
      const config = keyDoc.data()!;
      if (config.status !== 'active') {
        throw new functions.https.HttpsError('unavailable', 'AI Service is currently disabled for this module.');
      }
      apiKey = config.key;
      baseURL = config.baseURL || 'https://api.openai.com/v1';
    }

    // 3. Dispatch to Router/Provider
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-app-id': appId
      },
      body: JSON.stringify({
        model: model || 'gpt-4o',
        messages: messages,
        temperature: temperature || 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw new Error(errorData.error?.message || 'Upstream LLM Error');
    }

    const result = await response.json();
    return result;

  } catch (error: any) {
    console.error(`LLM Router Error [${appId}]:`, error);
    throw new functions.https.HttpsError('internal', error.message || 'LLM Routing Failed');
  }
});
