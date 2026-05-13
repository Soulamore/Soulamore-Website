import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from './emailService';

/**
 * Admin: Universal Broadcast Campaign (Soulamore Collective)
 * High-power broadcast for global messages and community outreach.
 */
export const adminBroadcastCampaign = functions.runWith({
  timeoutSeconds: 540,
  memory: '512MB'
}).https.onCall(async (data, context) => {
    // 1. Mandatory Admin Check
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin login required.');
    
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can trigger campaigns.');
    }

    const { subject, body, testEmail, externalRecipients } = data;
    if (!subject || !body) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing subject or body.');
    }

    // 2. Resolve Recipients
    let recipients: { email: string; name?: string }[] = [];

    if (testEmail) {
        recipients = [{ email: testEmail, name: 'Admin Tester' }];
    } else if (externalRecipients && Array.isArray(externalRecipients)) {
        recipients = externalRecipients;
    } else {
        // Default: Broadcast to all active users and newsletter subscribers
        const usersSnap = await admin.firestore().collection('users').get();
        usersSnap.forEach(doc => {
            const u = doc.data();
            if (u.email) recipients.push({ email: u.email, name: u.name });
        });

        const newsSnap = await admin.firestore().collection('newsletters').get();
        newsSnap.forEach(doc => {
            const n = doc.data();
            if (n.email && !recipients.some(r => r.email === n.email)) {
                recipients.push({ email: n.email });
            }
        });
    }

    console.log(`🚀 Starting campaign [${subject}] to ${recipients.length} targets.`);

    // 3. Dispatch Emails in batches of 50 to avoid timeout/rate limits
    const BATCH_SIZE = 50;
    let delivered = 0;
    let failed = 0;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE);
        const promises = batch.map(recipient => 
            sendEmail(recipient, subject, body)
                .then(res => { if(res.success) delivered++; else failed++; })
                .catch(() => failed++)
        );
        await Promise.allSettled(promises);
    }

    return { 
        success: true, 
        message: `Campaign dispatched: ${delivered} delivered, ${failed} failed.`,
        delivered,
        failed,
        total: recipients.length
    };
});
