import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// --- AUTH MIDDLEWARE ---
const validateFirebaseIdToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        (req as any).user = decodedIdToken;
        next();
    } catch (error) {
        res.status(403).send('Unauthorized');
    }
};

// --- ENDPOINTS ---

// 1. Health Probe (Telemetry)
app.get('/health', validateFirebaseIdToken, async (req, res) => {
    // Only allow admins to check API health
    const user = (req as any).user;
    if (user.role !== 'admin' && !user.admin) {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }

    try {
        // Reuse logic from healthMonitoring.ts
        const { probeAllServices } = require('./healthMonitoring');
        const results = await probeAllServices();
        res.json(results);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. LLM Chat (SoulBot)
app.post('/chat', validateFirebaseIdToken, async (req, res) => {
    try {
        const { appId, messages, model, temperature } = req.body;
        // Reuse logic from llmRouter.ts
        const { handleLlmRequest } = require('./llmRouter');
        const result = await handleLlmRequest({ appId, messages, model, temperature }, (req as any).user);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Export the Express App as a v2 Cloud Function
export const api = onRequest({ 
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 300
}, app);
