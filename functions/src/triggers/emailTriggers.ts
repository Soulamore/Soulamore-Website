import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { generateSoulamoreEmail, sendEmail } from '../emailService';

/**
 * Trigger: On Newsletter Subscription
 */
export const onNewsletterCreated = functions.firestore
    .document('newsletters/{docId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        if (!data?.email) return null;

        const exploreRoutes = [
            'https://soulamore.com/tools/confession-box.html',
            'https://soulamore.com/tools/problem-wall.html',
            'https://soulamore.com/spaces/soulamore-away.html'
        ];
        const randomExploreUrl = exploreRoutes[Math.floor(Math.random() * exploreRoutes.length)];

        const { subject, html } = generateSoulamoreEmail('newsletter_welcome', { 
            name: 'Friend', 
            explore_url: randomExploreUrl 
        });

        return await sendEmail({ email: data.email }, subject, html);
    });

/**
 * Trigger: On Contact Form / Lifeline Request
 */
export const onContactCreated = functions.firestore
    .document('contacts/{docId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        if (!data?.email) return null;

        // Only trigger receipt for Lifeline or general support if requested
        if (data.subject === 'Lifeline Request' || data.subject === 'LIFELINE') {
            const { subject, html } = generateSoulamoreEmail('lifeline_receipt', { 
                name: data.name || 'Friend' 
            });
            return await sendEmail({ email: data.email }, subject, html);
        }
        return null;
    });

/**
 * Trigger: On Peer Booking Confirmation
 */
export const onBookingUpdated = functions.firestore
    .document('peer_bookings/{docId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        // Detect status change to confirmed
        if (newData.status === 'confirmed' && oldData.status !== 'confirmed') {
            try {
                // Fetch User data
                const userSnap = await admin.firestore().collection('users').doc(newData.userId).get();
                const userData = userSnap.data() || {};
                
                // Fetch Peer data
                const peerSnap = await admin.firestore().collection('users').doc(newData.peerId).get();
                const peerData = peerSnap.data() || {};

                const formattedDate = newData.startTime 
                    ? new Date(newData.startTime.toDate()).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
                    : 'Scheduled Time';

                const { subject, html } = generateSoulamoreEmail('booking_confirmed', {
                    name: userData.name || 'Friend',
                    slid: newData.slId || context.params.docId,
                    peer_name: peerData.name || 'Your Peer Listener',
                    date_time: formattedDate,
                    meet_link: newData.meetLink || 'https://soulamore.com/portal/'
                });

                // Send to User
                await sendEmail({ email: newData.userEmail || userData.email }, subject, html);

                // CC or separate alert to Peer
                if (peerData.email) {
                    await sendEmail(
                        { email: peerData.email, name: peerData.name }, 
                        `New Booking Confirmed: ${newData.slId}`, 
                        `<p>Hello ${peerData.name}, you have a new confirmed booking (${newData.slId}) for ${formattedDate}. Link: ${newData.meetLink}</p>`
                    );
                }

                return true;
            } catch (err) {
                console.error("Error in booking trigger:", err);
                return null;
            }
        }
        return null;
    });

/**
 * Trigger: On Application Submission
 */
export const onApplicationCreated = functions.firestore
    .document('{collection}/{docId}')
    .onCreate(async (snap, context) => {
        const col = context.params.collection;
        if (col !== 'peers' && col !== 'psychologists') return null;

        const data = snap.data();
        if (!data?.email) return null;

        const { subject, html } = generateSoulamoreEmail('application_received', { 
            name: data.name || 'Applicant',
            role: col === 'peers' ? 'Community Peer' : 'Psychologist'
        });


        return await sendEmail({ email: data.email }, subject, html);
    });

/**
 * Trigger: On Assessment Lead Created
 */
export const onLeadCreated = functions.firestore
    .document('assessment_leads/{leadId}')
    .onCreate(async (snap, context) => {
        const lead = snap.data();
        if (!lead) return null;

        const isUrgent = lead.escalation_required === true;
        const subjectPrefix = isUrgent ? '[URGENT: CRISIS ESCALATION] ' : '[New Assessment Lead] ';
        
        // 1. Internal Notification (Admin)
        const adminHtml = `
            <div style="font-family: 'Inter', sans-serif; color: #1A1A1A; padding: 40px; border-radius: 8px;">
                <h2 style="color: ${isUrgent ? '#ef4444' : '#2dd4bf'};">
                    ${isUrgent ? 'URGENT: CRISIS ESCALATION' : 'New Recommended Match Request'}
                </h2>
                <p>A user has completed an assessment and requested an outreach.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p><strong>Name:</strong> ${lead.name || 'Anonymous'}</p>
                <p><strong>Email:</strong> ${lead.email || 'Not Provided'}</p>
                <p><strong>Assessment:</strong> ${lead.assessment_domain || 'Unknown'}</p>
                <p><strong>Severity:</strong> ${lead.severity_band || 'N/A'}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666666;">Generated by Soulamore Assessment Clinical Engine</p>
            </div>
        `;

        await sendEmail(
            { email: 'support@soulamore.in' }, 
            `${subjectPrefix}Lead: ${lead.name || 'Anonymous'}`, 
            adminHtml
        );

        // 2. Automated User Report Delivery
        if (lead.email) {
            try {
                const { subject, html: reportHtml } = generateSoulamoreEmail('assessment_report', {
                    name: lead.name || 'Friend',
                    assessment_name: (lead.assessment_domain || 'Analysis').replace(/_/g, ' ').toUpperCase(),
                    score_category: (lead.severity_band || 'Inconclusive').toUpperCase(),
                    interpretation: lead.ai_reflection || '<p>Your pattern has been captured securely. We are processing your full blueprint.</p>',
                    recommendation: isUrgent 
                        ? 'Due to the intensity of your current pattern, we strongly recommend immediate human connection. Visit our "Get Help Now" page.' 
                        : 'We recommend exploring our curated tools like the "5-Step Reset" to begin your grounding journey.'
                });

                return await sendEmail(
                    { email: lead.email, name: lead.name },
                    subject,
                    reportHtml
                );
            } catch (err) {
                functions.logger.error("Failed to send assessment report email to user:", err);
            }
        }

        return null;
    });

/**
 * Bridge Trigger: On Legacy 'mail' Collection
 * Allows frontend triggerEmail() to work via ZeptoMail instead of Firebase Extension.
 */
export const onLegacyMailCreated = functions.firestore
    .document('mail/{docId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        if (!data?.to || !data?.message) return null;

        const recipient = {
            email: data.to,
            name: data.name || 'Friend'
        };

        const subject = data.message.subject || 'Update from Soulamore';
        const html = data.message.html || `<p>${data.message.text || 'Message processed.'}</p>`;

        return await sendEmail(recipient, subject, html);
    });

/**
 * === ADMIN CAMPAIGN TRIGGERS (MANUAL) ===
 */

/**
 * Trigger: Manual Newsletter Blast
 * Sends to all subscribers in 'newsletterSubscribers' collection
 */
export const triggerNewsletterBlast = functions.https.onCall(async (data, context) => {
    // Check auth
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin only.');
    
    // Check role (requires admin)
    const adminDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (adminDoc.data()?.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized access.');
    }

    const snapshot = await admin.firestore().collection('newsletters').get();
    if (snapshot.empty) return { success: true, count: 0 };

    let successCount = 0;
    let failCount = 0;

    const { subject, html } = generateSoulamoreEmail('newsletter_welcome', { 
        name: 'Friend'
    });

    for (const doc of snapshot.docs) {
        const sub = doc.data();
        try {
            await sendEmail({ email: sub.email }, subject, html);
            successCount++;
        } catch (err) {
            failCount++;
        }
    }

    return { success: true, results: { success: successCount, failed: failCount } };
});

/**
 * Trigger: Problem Wall Spotlight
 * Promotes the Wall to all users
 */
export const triggerProblemWallPromo = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin only.');
    
    const adminDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (adminDoc.data()?.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized access.');
    }

    const snapshot = await admin.firestore().collection('users').get();
    if (snapshot.empty) return { success: true, count: 0 };

    const subject = "A Safe Place to Release Your Secrets 🖋️";
    const html = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; text-align: center;">
            <h2 style="font-family: 'Outfit', sans-serif; color: #0f172a;">Your Voice Matters, Anonymously.</h2>
            <p>Our Problem Wall has become a global sanctuary for those holding onto unspoken weights. Today, we invite you to share yours.</p>
            <div style="margin: 30px 0;">
                <a href="https://soulamore.com/portal/wall" 
                   style="background: #4ECDC4; color: #0f172a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: 700;">
                   VISIT THE WALL
                </a>
            </div>
            <p style="font-size: 13px; color: #64748b;">No login required for posting. Your identity remains yours alone.</p>
        </div>
    `;

    let successCount = 0;
    for (const doc of snapshot.docs) {
        const user = doc.data();
        if (user.email) {
            try {
                await sendEmail({ email: user.email }, subject, html);
                successCount++;
            } catch (err) { /* skip fails */ }
        }
    }

    return { success: true, results: { success: successCount } };
});

/**
 * Trigger: Expat Support (Soulamore Away)
 */
export const triggerExpatOutreach = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin only.');
    
    const adminDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (adminDoc.data()?.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized access.');
    }

    const snapshot = await admin.firestore().collection('users').where('isAbroad', '==', true).get();
    
    const subject = "Soulamore Away: Specialized Expat Support";
    const html = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px;">
            <h2 style="font-family: 'Outfit', sans-serif; color: #0f172a;">Mental Health Knows No Borders.</h2>
            <p>Living abroad brings unique psychological challenges. Soulamore Away is our specialized program for the Indian diaspora, matching you with culturally aligned therapists who understand your journey.</p>
            <a href="https://soulamore.com/away" style="color: #4ECDC4; font-weight: 700;">Explore specialized support &rarr;</a>
        </div>
    `;

    let count = 0;
    for (const doc of snapshot.docs) {
        const user = doc.data();
        if (user.email) {
            await sendEmail({ email: user.email }, subject, html);
            count++;
        }
    }

    return { success: true, results: { success: count } };
});

/**
 * Trigger: On Feedback Submitted
 */
export const onFeedbackCreated = functions.firestore
    .document('feedback/{docId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        if (!data) return null;

        const body = `
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid rgba(45, 212, 191, 0.2);">
                <h2 style="color: #2dd4bf; margin-top: 0;">New User Feedback</h2>
                <p><strong>Rating:</strong> ${data.rating ? data.rating + ' / 5 Stars ⭐' : 'No rating'}</p>
                <p><strong>Feedback:</strong><br/>${data.feedback || 'No text'}</p>
                <p><strong>User Email:</strong> ${data.email || 'Anonymous'}</p>
                <p><strong>Page:</strong> ${data.page || 'Unknown'}</p>
            </div>
        `;

        const { compileTemplate } = await import('../emailService');
        const html = compileTemplate(
            { email: 'support@soulamore.in', name: 'Soulamore Admin' },
            'New Site Feedback Received',
            body
        );

        return await sendEmail(
            { email: 'support@soulamore.in', name: 'Soulamore Admin' },
            'New Site Feedback Received',
            html
        );
    });

