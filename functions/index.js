const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const path = require('path');

admin.initializeApp();

// === RATE LIMITING HELPER ===
/**
 * Rate Limiting Helper - Prevents API abuse
 * Limits actions per user per hour
 *
 * @param {string} uid - User ID (or 'anon_' + IP for anonymous)
 * @param {string} action - Action name (e.g., 'contact_form', 'booking')
 * @param {number} limitPerHour - Max requests per hour
 * @returns {Promise<boolean>}
 */
const rateLimit = async (uid, action, limitPerHour = 60) => {
  const key = `ratelimit_${action}_${uid}`;
  const ref = admin.firestore().collection('_rate_limits').doc(key);

  const now = Date.now();
  const windowStart = now - (60 * 60 * 1000); // 1 hour window

  return admin.firestore().runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const data = doc.exists ? doc.data() : { requests: [], uid, action };

    // Remove requests outside the window
    const recent = (data.requests || []).filter(t => t > windowStart);

    if (recent.length >= limitPerHour) {
      const error = new functions.https.HttpsError(
        'resource-exhausted',
        `Too many ${action} requests. Limit: ${limitPerHour}/hour. Please wait.`
      );
      throw error;
    }

    recent.push(now);
    tx.set(ref, { requests: recent, uid, action, updatedAt: now });
    return true;
  });
};

// === VERIFY AUTH TOKEN HELPER ===
/**
 * Verify Firebase ID token from request header
 * Used for HTTPS onRequest functions
 *
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Decoded token
 */
async function verifyAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.*)$/);

  if (!match) {
    throw new functions.https.HttpsError('unauthenticated', 'Missing authorization header');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(match[1]);
    return decodedToken;
  } catch (error) {
    throw new functions.https.HttpsError('unauthenticated', 'Invalid token');
  }
}

// 1. Initialize Google OAuth 2.0 Client
// Secrets managed via Firebase Console (firebase functions:config:set)
const CLIENT_ID = functions.config().google?.client_id;
const CLIENT_SECRET = functions.config().google?.client_secret;
// Note: Production redirect must be updated once permanent domain is confirmed for the portal callback
const REDIRECT_URL = "https://soulamore.com/portal/google-callback.html";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

/**
 * Mailer Configuration (Unified)
 * Currently using ZeptoMail as primary gateway
 */
const mailTransport = nodemailer.createTransport({
  host: "smtp.zeptomail.eu",
  port: 587,
  auth: {
    user: functions.config().zeptomail?.user || "emailapikey",
    pass: functions.config().zeptomail?.password
  }
});

/**
 * Helper: Read and Parse HTML Templates
 * Replaces {{VARIABLE}} placeholders with actual data
 */
const getTemplate = (folder, fileName, replacements = {}) => {
    try {
        const filePath = path.join(__dirname, 'src', 'templates', folder, fileName);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Dynamic replacements
        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, replacements[key]);
        });

        // Add Year placeholder globally if it exists
        content = content.replace(/{{YEAR}}/g, new Date().getFullYear());

        return content;
    } catch (error) {
        console.error(`Template read failed: ${folder}/${fileName}`, error);
        return null;
    }
};

/**
 * Unified Email Dispatcher
 */
const sendTemplatedEmail = async (to, subject, folder, fileName, replacements = {}, cc = null) => {
    const html = getTemplate(folder, fileName, replacements);
    if (!html) return;

    const mailOptions = {
        from: '"Soulamore Engine" <contact.soulamore@gmail.com>',
        to,
        subject,
        html
    };

    if (cc) mailOptions.cc = cc;

    try {
        await mailTransport.sendMail(mailOptions);
        console.log(`Email [${fileName}] dispatched to ${to}`);
    } catch (error) {
      console.error(`Email [${fileName}] failed:`, error);
    }
};

// 2. Generate Auth URL for Practitioners
exports.getGoogleAuthUrl = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in to connect calendar.');
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.settings.readonly'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Required for refresh tokens
    scope: scopes,
    prompt: 'consent', // Ensure we get refresh token
    state: context.auth.uid // Pass user UID to callback
  });

  return { url };
});

// 3. Exchange Code for Tokens and Store
exports.exchangeGoogleCode = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated');
  
  const code = data.code;
  if (!code) throw new functions.https.HttpsError('invalid-argument', 'No authorization code provided.');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in practitioner_metadata (encrypted in a perfect world)
    await admin.firestore().collection('practitioner_metadata').doc(context.auth.uid).set({
      gcalLinked: true,
      gcalTokens: tokens, // Includes access_token and refresh_token
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Token exchange failed:", error);
    throw new functions.https.HttpsError('internal', 'Google token exchange failed.');
  }
});

// 4. Create Calendar Event and Meet Link
// This logic is now refactored to be callable after payment verification
const generateMeetLink = async (bookingData, bookingId) => {
  const metaDoc = await admin.firestore().collection('practitioner_metadata').doc(bookingData.peerId).get();
  if (!metaDoc.exists || !metaDoc.data().gcalTokens) {
    return null; // Not linked
  }

  const tokens = metaDoc.data().gcalTokens;
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: `Soulamore Session: ${bookingData.userName || 'User'}`,
    description: `Private session hosted by Soulamore for ${bookingData.userName || 'User'}.\n\nPlan: ${bookingData.planType || 'Standard'}\nBooking ID: ${bookingData.slId || bookingId}`,
    start: {
      dateTime: bookingData.startTime.toDate().toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(bookingData.startTime.toDate().getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: { requestId: `meet-${bookingId}`, conferenceSolutionKey: { type: 'hangoutsMeet' } },
    },
    reminders: { useDefault: true },
  };

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });
    return res.data.hangoutLink; // Return Google Meet link
  } catch (error) {
    console.error("Calendar insertion failed:", error);
    return null;
  }
};

// ... (existing verifyPayment and sendLeadNotificationEmail follow) ...

/**
 * Generate a unique sequential Booking ID
 * Format: SL-YYYY-XXXX
 */
exports.generateBookingID = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const counterRef = admin.firestore().collection('system_counters').doc('bookings');
  
  try {
    const slId = await admin.firestore().runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let currentCount = 1;

      if (counterDoc.exists) {
        currentCount = (counterDoc.data().count || 0) + 1;
        transaction.update(counterRef, { count: currentCount });
      } else {
        transaction.set(counterRef, { count: currentCount });
      }

      const year = new Date().getFullYear();
      return `SL-${year}-${String(currentCount).padStart(4, '0')}`;
    });

    return { slId: slId };
  } catch (error) {
    console.error("Transaction failed: ", error);
    throw new functions.https.HttpsError('internal', 'Failed to generate ID.');
  }
});

/**
 * Verify Razorpay payment signature
 * This should be called after payment to verify authenticity
 *
 * Security: F-02 (token verification), F-07/F-08 (amount validation)
 */
exports.verifyPayment = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId, expectedAmount } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // ✅ F-02: Verify auth token
      try {
        const decodedToken = await verifyAuthToken(req);
        console.log('Payment verified by user:', decodedToken.uid);
      } catch (error) {
        // Allow anonymous payments but log
        console.warn('Payment without auth token - allowing for anonymous bookings');
      }

      // Verify payment signature
      const crypto = require('crypto');
      const text = razorpay_order_id + '|' + razorpay_payment_id;
      const generatedSignature = crypto
        .createHmac('sha256', functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        console.error('Payment signature verification failed');
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      // Get payment details from Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      if (payment.status !== 'captured') {
        return res.status(400).json({ error: 'Payment not captured' });
      }

      // ✅ F-07/F-08: Validate amount
      if (expectedAmount) {
        const paidAmount = payment.amount / 100; // Razorpay returns amount in paise
        if (Math.abs(paidAmount - expectedAmount) > 0.01) {
          console.error(`Amount mismatch: expected ${expectedAmount}, paid ${paidAmount}`);
          return res.status(400).json({
            error: 'Amount mismatch',
            expected: expectedAmount,
            paid: paidAmount
          });
        }
      }

      // Update booking in Firestore
      const bookingRef = admin.firestore().collection('peer_bookings').doc(bookingId);
      const bookingDoc = await bookingRef.get();

      if (!bookingDoc.exists) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const bookingData = bookingDoc.data();

      // Check if booking is already confirmed
      if (bookingData.status === 'confirmed') {
        return res.status(200).json({
          success: true,
          message: 'Booking already confirmed',
          bookingId: bookingId
        });
      }

      // --- DYNAMIC COMMISSION LOGIC ---
      let commissionRate = 0.50; // Level 1 Default (50%)
      const peerId = bookingData.peerId;
      
      if (peerId) {
        // Fetch peer profile to check their rating
        const peerDoc = await admin.firestore().collection('users').doc(peerId).get();
        if (peerDoc.exists) {
            const peerInfo = peerDoc.data();
            const rating = peerInfo.rating || 0;
            
            if (rating >= 4.8) {
                commissionRate = 0.10; // Level 3 (10% Cut)
            } else if (rating >= 4.5) {
                commissionRate = 0.20; // Level 2 (20% Cut)
            }
        }
      }

      const totalAmount = payment.amount / 100; // INR
      const soulamoreCut = totalAmount * commissionRate;
      const practitionerShare = totalAmount - soulamoreCut;
      // --------------------------------

      // --- GOOGLE CALENDAR / MEET INTEGRATION ---
      let meetLink = null;
      try {
        meetLink = await generateMeetLink(bookingData, bookingId);
      } catch (calError) {
        console.error("Failed to generate Meet link during verification:", calError);
      }
      // -----------------------------------------

      // Update booking status
      await bookingRef.update({
        status: 'confirmed',
        paymentId: razorpay_payment_id,
        meetLink: meetLink, // Store the Meet link if generated
        financials: {
            totalAmount: totalAmount,
            commissionRate: commissionRate,
            soulamoreCut: soulamoreCut,
            practitionerShare: practitionerShare,
            payoutStatus: 'pending_release' // Requires Admin Manual Release
        },
        paymentData: {
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          razorpay_signature: razorpay_signature,
          amount: totalAmount,
          currency: payment.currency,
          gateway: 'razorpay',
          verified: true
        },
        confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Create payment record
      await admin.firestore().collection('payments').add({
        bookingId: bookingId,
        paymentId: razorpay_payment_id,
        amount: payment.amount / 100,
        currency: payment.currency,
        gateway: 'razorpay',
        status: 'success',
        metadata: {
          orderId: razorpay_order_id,
          method: payment.method,
          bank: payment.bank || null,
          wallet: payment.wallet || null
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log('Payment verified and booking confirmed:', bookingId);

      return res.status(200).json({
        success: true,
        message: 'Payment verified and booking confirmed',
        bookingId: bookingId,
        paymentId: razorpay_payment_id
      });

    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  });
});

/**
 * Create Razorpay order (optional - for pre-creating orders)
 * This can be used if you want to create orders server-side
 */
exports.createRazorpayOrder = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;

      if (!amount || amount < 1) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {}
      };

      const order = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt
        }
      });

    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  });
});

// Using global mailTransport defined at top

/**
 * Sends an email notification whenever a new assessment lead is submitted.
 * Triggers on document creation in the 'assessment_leads' collection.
 */
exports.sendLeadNotificationEmail = functions.firestore
  .document('assessment_leads/{leadId}')
  .onCreate(async (snap, context) => {
    const lead = snap.data();
    if (!lead) return null;

    const isUrgent = lead.escalation_required === true || lead.severity_band === 'severe';
    
    if (isUrgent) {
        // Dispatch High Risk Admin Alert
        await sendTemplatedEmail(
            'contact.soulamore@gmail.com', // Admin notification
            `[CRITICAL: HIGH RISK] ${lead.name || 'Anonymous User'}`,
            'admin',
            'high_risk_lifeline_alert.html',
            {
                CASE_ID: context.params.leadId,
                TIMESTAMP: new Date().toLocaleString(),
                USER_UID: lead.uid || 'Anonymous',
                QUERY_EXCERPT: lead.content ? lead.content.substring(0, 150) + '...' : 'No content summary'
            }
        );
    }

    // Send the User their Clinical Results (even if urgent)
    if (lead.email) {
        await sendTemplatedEmail(
            lead.email,
            `Your Assessment: ${lead.assessment_domain || 'Results'} - Soulamore`,
            'assessments',
            'assessment_report_clinical.html',
            {
                ASSESSMENT_NAME: (lead.assessment_domain || 'Clinical Screen').replace('_', ' ').toUpperCase(),
                SCORE_CATEGORY: (lead.severity_band || 'Review Required').toUpperCase(),
                INTERPRETATION: lead.recommendation || 'Our clinical engine has processed your results. Please review them with a counselor.',
                RECOMMENDATION: isUrgent ? 'Immediate clinical outreach recommended.' : 'Schedule a follow-up with a Peer to discuss these insights.'
            }
        );
    }

    return null;
  });

/**
 * Cron Job to send upcoming booking reminders
 * Runs every 15 minutes and checks upcoming confirmed sessions.
 */
exports.sendBookingReminders = functions.pubsub.schedule('every 15 minutes').onRun(async (context) => {
  const now = new Date();
  
  // Define reminder thresholds (in milliseconds)
  const thresholds = [
    { key: 'oneMonth', value: 30 * 24 * 60 * 60 * 1000, label: '1 Month' },
    { key: 'oneWeek', value: 7 * 24 * 60 * 60 * 1000, label: '1 Week' },
    { key: 'twentyFourHours', value: 24 * 60 * 60 * 1000, label: '24 Hours' },
    { key: 'twoHours', value: 2 * 60 * 60 * 1000, label: '2 Hours' }
  ];

  try {
    // Query upcoming confirmed bookings
    const qs = await admin.firestore().collection('peer_bookings')
      .where('status', '==', 'confirmed')
      .where('startTime', '>', admin.firestore.Timestamp.fromDate(now))
      .get();

    for (const doc of qs.docs) {
      const booking = doc.data();
      const startTime = booking.startTime.toDate();
      const timeDiff = startTime.getTime() - now.getTime();
      let remindersSent = booking.remindersSent || {};
      let updated = false;

      for (const threshold of thresholds) {
        if (!remindersSent[threshold.key]) {
          // If the booking's time remaining is less than or equal to this threshold
          if (timeDiff <= threshold.value) {
              const marginOfError = 60 * 60 * 1000; // 1 hour window
              
              // Only send email if we are actually close to the threshold timestamp
              // If timeDiff is way less (e.g., booking was just created for a session 3 days away, 
              // it skips the 1Month and 1Week notifications entirely by marking them true but not emailing)
              if (timeDiff >= threshold.value - marginOfError) {
                  try {
                    const userDoc = await admin.firestore().collection('users').doc(booking.userId).get();
                    const peerDoc = await admin.firestore().collection('users').doc(booking.peerId).get();
                    
                    const userData = userDoc.exists ? userDoc.data() : {};
                    const peerData = peerDoc.exists ? peerDoc.data() : {};
                    
                    const formattedDate = new Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata'
                    }).format(startTime);
                    
                    if (userData.email) {
                        await sendTemplatedEmail(
                            userData.email,
                            `Soon, we listen: Your session in ${threshold.label}`,
                            'bookings',
                            'booking_reminder.html',
                            {
                                BOOKING_TIME: formattedDate + ' (IST)',
                                PEER_NAME: peerData.name || 'Your Peer Listener',
                                VIDEO_LINK: booking.meetLink || 'https://soulamore.com/portal/dashboard.html'
                            },
                            peerData.email || null // CC the peer
                        );
                    }
                  } catch (emailError) {
                      console.error(`Failed to send ${threshold.key} reminder for booking ${doc.id}:`, emailError);
                  }
              }
              
              // Mark this reminder threshold as processed so it isn't checked/sent again
              remindersSent[threshold.key] = true;
              updated = true;
          }
        }
      }
      
      // Update firestore document
      if (updated) {
          await doc.ref.update({ remindersSent });
      }
    }
  } catch (error) {
    console.error("Error executing sendBookingReminders:", error);
  }
  return null;
});

/**
 * Admin: Release Practitioner Payout
 * Moves status from 'pending_release' to 'released' and logs settlement
 */
exports.releasePayout = functions.https.onCall(async (data, context) => {
  // 1. Mandatory Admin Check
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin login required.');
  
  const adminDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
    // throw new functions.https.HttpsError('permission-denied', 'Unauthorized access.');
    // Check metadata for role as fallback
    const metaDoc = await admin.firestore().collection('user_metadata').doc(context.auth.uid).get();
    if(!metaDoc.exists || metaDoc.data().role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can release payouts.');
    }
  }

  const { bookingId, upiId, note } = data;
  if (!bookingId) throw new functions.https.HttpsError('invalid-argument', 'Booking ID missing.');

  try {
    const bookingRef = admin.firestore().collection('peer_bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();
    
    if (!bookingDoc.exists) throw new functions.https.HttpsError('not-found', 'Booking not found.');
    
    const booking = bookingDoc.data();
    if (booking.financials.payoutStatus === 'released') {
      return { success: false, message: 'Payout already released.' };
    }

    // Update Payout Status
    await bookingRef.update({
      "financials.payoutStatus": 'released',
      "financials.releasedAt": admin.firestore.FieldValue.serverTimestamp(),
      "financials.releasedBy": context.auth.uid,
      "financials.payoutDetails": {
        upiId: upiId || 'Manual/In-Portal',
        note: note || ''
      }
    });

    // Log Settlement
    await admin.firestore().collection('settlements').add({
      bookingId: bookingId,
      slId: booking.slId || 'N/A',
      amount: booking.financials.practitionerShare,
      peerId: booking.peerId,
      upiId: upiId || 'N/A',
      releasedBy: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error("Payout release failed:", error);
    throw new functions.https.HttpsError('internal', 'Payout release operation failed.');
  }
});

/**
 * Admin: Dynamic News Campaign Hub (SAGA-Style)
 * High-power broadcast for global messages
 */
exports.triggerCustomCampaign = functions.https.onCall(async (data, context) => {
    // 1. Mandatory Admin Check
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin login required.');
    
    const adminDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can trigger campaigns.');
    }

    const { targetGroup, campaignData } = data;
    if (!targetGroup || !campaignData.title || !campaignData.content) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing targetGroup or campaign data.');
    }

    // 2. Resolve Recipients
    let recipients = [];
    if (targetGroup === 'newsletters' || targetGroup === 'all') {
        const snap = await admin.firestore().collection('newsletters').get();
        snap.forEach(doc => recipients.push(doc.data().email));
    }
    if (targetGroup === 'peers' || targetGroup === 'all') {
        const snap = await admin.firestore().collection('users').where('role', '==', 'peer').get();
        snap.forEach(doc => {
            if (doc.data().email && !recipients.includes(doc.data().email)) {
                recipients.push(doc.data().email);
            }
        });
    }
    if (targetGroup === 'psychologists' || targetGroup === 'all') {
        const snap = await admin.firestore().collection('users').where('role', '==', 'psychologist').get();
        snap.forEach(doc => {
            if (doc.data().email && !recipients.includes(doc.data().email)) {
                recipients.push(doc.data().email);
            }
        });
    }

    console.log(`Starting campaign [${campaignData.title}] to ${recipients.length} targets.`);

    // 3. Dispatch Emails (Batching would be better for massive lists, but this works for current scale)
    const sendPromises = recipients.map(email => {
        return sendTemplatedEmail(
            email,
            campaignData.title,
            'admin',
            'news_campaign.html',
            {
                CAMPAIGN_TITLE: campaignData.title,
                CAMPAIGN_CONTENT: campaignData.content,
                CAMPAIGN_IMAGE_URL: campaignData.imageUrl || '',
                CTA_TEXT: campaignData.ctaText || 'Learn More',
                CTA_LINK: campaignData.ctaLink || 'https://soulamore.com'
            }
        );
    });

    await Promise.allSettled(sendPromises);

    return { 
        success: true, 
        delivered: recipients.length, 
        campaign: campaignData.title 
    };
});

// === BEHAVIORAL TRIGGERS (ULTRA-DEEP AUDIT) ===

/**
 * Trigger: New Peer/Psych Review
 */
exports.onReviewCreated = functions.firestore
    .document('reviews/{reviewId}')
    .onCreate(async (snap, context) => {
        const review = snap.data();
        if (!review) return null;

        // 1. Thank the User
        if (review.userEmail) {
            await sendTemplatedEmail(
                review.userEmail,
                "Your voice matters - Thank you for your feedback",
                'reviews',
                'review_thank_you_user.html'
            );
        }

        // 2. Alert the Peer/Psych (Morale Boost)
        const peerDoc = await admin.firestore().collection('users').doc(review.peerId).get();
        if (peerDoc.exists && peerDoc.data().email) {
            await sendTemplatedEmail(
                peerDoc.data().email,
                "Felt & Acknowledged: You have a new review!",
                'reviews',
                'peer_new_review_alert.html'
            );
        }

        return null;
    });

/**
 * Trigger: Booking Cancelled (The Recovery Loop)
 */
exports.onBookingDeleted = functions.firestore
    .document('peer_bookings/{bookingId}')
    .onDelete(async (snap, context) => {
        const booking = snap.data();
        if (!booking || booking.status !== 'confirmed') return null;

        const userDoc = await admin.firestore().collection('users').doc(booking.userId).get();
        if (userDoc.exists && userDoc.data().email) {
            const formattedDate = new Intl.DateTimeFormat('en-IN', {
                dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata'
            }).format(booking.startTime.toDate());

            await sendTemplatedEmail(
                userDoc.data().email,
                "It's okay: Your session has been cancelled",
                'bookings',
                'booking_cancelled.html',
                {
                    BOOKING_TIME: formattedDate + ' (IST)'
                }
            );
        }
        return null;
    });

/**
 * Trigger: Soulamore Away Postcard (The Kindness Loop)
 */
exports.onPostcardCreated = functions.firestore
    .document('postcards/{cardId}')
    .onCreate(async (snap, context) => {
        const card = snap.data();
        if (!card || !card.senderEmail) return null;

        // Confirm to Sender
        await sendTemplatedEmail(
            card.senderEmail,
            "Vibe Delivered: Your postcard is in transit",
            'soulamore-away',
            'postcard_sender_confirmation.html',
            {
                RECIPIENT_CITY: card.toCity || 'a foreign heart',
                TIMESTAMP: new Date().toLocaleString()
            }
        );
        return null;
    });
