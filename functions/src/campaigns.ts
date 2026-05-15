import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { sendEmail, compileTemplate } from './emailService';

/**
 * Admin: Trigger Custom Campaign (Soulamore Collective)
 * High-power broadcast for global messages and community outreach.
 */
export const triggerCustomCampaign = functions.runWith({
  timeoutSeconds: 540,
  memory: '512MB'
}).https.onCall(async (data, context) => {
    // 1. Mandatory Admin Check
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin login required.');
    
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can trigger campaigns.');
    }

    const { targetGroup, campaignData, subject, body, testEmail, externalRecipients } = data;
    
    // Support both direct subject/body and campaignData object from dashboard
    const finalSubject = subject || campaignData?.title;
    const finalBody = body || campaignData?.content;

    if (!finalSubject || !finalBody) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing subject/title or body/content.');
    }

    // 2. Resolve Recipients
    let recipients: { email: string; name?: string }[] = [];

    if (testEmail) {
        recipients = [{ email: testEmail, name: 'Admin Tester' }];
    } else if (externalRecipients && Array.isArray(externalRecipients)) {
        recipients = externalRecipients;
    } else {
        // Filter by targetGroup
        if (!targetGroup || targetGroup === 'all' || targetGroup === 'peers' || targetGroup === 'psychologists' || targetGroup === 'practitioners') {
            const usersRef = admin.firestore().collection('users');
            let query: any = usersRef;
            
            if (targetGroup === 'peers') query = usersRef.where('role', '==', 'peer');
            if (targetGroup === 'psychologists' || targetGroup === 'practitioners') query = usersRef.where('role', '==', 'practitioner');

            const usersSnap = await query.get();
            usersSnap.forEach((doc: any) => {
                const u = doc.data();
                if (u.email) recipients.push({ email: u.email, name: u.firstName || u.name });
            });
        }

        if (!targetGroup || targetGroup === 'all' || targetGroup === 'newsletters') {
            const newsSnap = await admin.firestore().collection('newsletters').get();
            newsSnap.forEach((doc: any) => {
                const n = doc.data();
                if (n.email && !recipients.some(r => r.email === n.email)) {
                    recipients.push({ email: n.email });
                }
            });
        }
    }

    console.log(`🚀 Starting campaign [${finalSubject}] to ${recipients.length} targets.`);

    // 3. Dispatch Emails
    const BATCH_SIZE = 50;
    let delivered = 0;
    let failed = 0;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE);
        const promises = batch.map(recipient => {
            const wrappedHtml = compileTemplate(recipient, finalSubject, finalBody, 'broadcast');
            return sendEmail(recipient, finalSubject, wrappedHtml)
                .then(res => { if(res.success) delivered++; else failed++; })
                .catch(() => failed++);
        });
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

/**
 * Admin: Preview Email
 * Returns the compiled HTML for a campaign message.
 */
export const adminPreviewEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Auth required');
    
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Admin role required');
    }

    const { subject, body, campaignData } = data;
    const finalSubject = subject || campaignData?.title || "Preview Subject";
    const finalBody = body || campaignData?.content || "Preview Content";

    // Use our standardized email service to compile the empathetic template
    // We pass a dummy recipient to get the full HTML
    const { compileTemplate } = require('./emailService');
    const html = compileTemplate({ email: 'preview@soulamore.com', name: 'Alex Designer' }, finalSubject, finalBody);

    return { subject: finalSubject, html };
});
