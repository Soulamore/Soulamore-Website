import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { sendEmail, compileTemplate } from './emailService';

/**
 * Admin: Trigger Custom Campaign (Soulamore Collective)
 * High-power broadcast for global messages and community outreach.
 */
/**
 * Core Logic: Trigger Custom Campaign
 */
export async function handleCampaignTrigger(data: any, auth: any) {
    // 1. Mandatory Admin Check
    const userDoc = await admin.firestore().collection('users').doc(auth.uid).get();
    if (!userDoc.exists || (userDoc.data()?.role !== 'admin' && !userDoc.data()?.admin)) {
        throw new Error('Only admins can trigger campaigns.');
    }

    // Alignment with dashboard payload: templateData contains title/content
    const { targetGroup, templateData, campaignData, isTest, customEmails, testEmail } = data;
    
    const finalSubject = templateData?.title || campaignData?.title || data.subject;
    const finalBody = templateData?.content || campaignData?.content || data.body;
    const finalIsTest = isTest || testEmail;

    if (!finalSubject || !finalBody) {
        throw new Error('Missing subject/title or body/content.');
    }

    // 2. Resolve Recipients
    let recipients: { email: string; name?: string }[] = [];

    if (finalIsTest) {
        recipients = [{ email: auth.email || 'contact.adityaharsh@gmail.com', name: 'Admin Tester' }];
    } else if (customEmails && Array.isArray(customEmails)) {
        recipients = customEmails.map((e: string) => ({ email: e }));
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
}

export const triggerCustomCampaign = functions.runWith({
  timeoutSeconds: 540,
  memory: '512MB'
}).https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin login required.');
    try {
        return await handleCampaignTrigger(data, context.auth);
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Core Logic: Preview Email
 */
export async function handleCampaignPreview(data: any, auth: any) {
    const userDoc = await admin.firestore().collection('users').doc(auth.uid).get();
    if (!userDoc.exists || (userDoc.data()?.role !== 'admin' && !userDoc.data()?.admin)) {
        throw new Error('Admin role required');
    }

    const { subject, body, campaignData, templateData } = data;
    const finalSubject = subject || templateData?.title || campaignData?.title || "Preview Subject";
    const finalBody = body || templateData?.content || campaignData?.content || "Preview Content";

    const html = compileTemplate({ email: auth.email || 'preview@soulamore.com', name: 'Alex Designer' }, finalSubject, finalBody, 'broadcast');

    return { subject: finalSubject, html };
}

export const adminPreviewEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Auth required');
    try {
        return await handleCampaignPreview(data, context.auth);
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
