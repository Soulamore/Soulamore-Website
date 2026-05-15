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

// --- ROUTES ---
const router = express.Router();

// 1. Health Probe (Telemetry)
router.get('/health', validateFirebaseIdToken, async (req, res) => {
    // Only allow admins to check API health
    try {
        const user = (req as any).user;
        const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        if (!userDoc.exists || (userData?.role !== 'admin' && !userData?.admin)) {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        const { probeAllServices } = require('./healthMonitoring');
        const results = await probeAllServices();
        res.json(results);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. LLM Chat (SoulBot)
router.post('/chat', validateFirebaseIdToken, async (req, res) => {
    try {
        const { appId, messages, model, temperature } = req.body;
        const { handleLlmRequest } = require('./llmRouter');
        const result = await handleLlmRequest({ appId, messages, model, temperature }, (req as any).user);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Campaign Preview
router.post('/campaign/preview', validateFirebaseIdToken, async (req, res) => {
    try {
        const { handleCampaignPreview } = require('./campaigns');
        const result = await handleCampaignPreview(req.body, (req as any).user);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Campaign Trigger
router.post('/campaign/trigger', validateFirebaseIdToken, async (req, res) => {
    try {
        const { handleCampaignTrigger } = require('./campaigns');
        const result = await handleCampaignTrigger(req.body, (req as any).user);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Mount router under /api
app.use('/api', router);

// Export the Express App as a v2 Cloud Function
export const api = onRequest({ 
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 300
}, app);
