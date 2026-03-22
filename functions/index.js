const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors')({ origin: true });

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
// Use hardcoded values as fallback if environment variables are missing
const CLIENT_ID = functions.config().google?.client_id || process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = functions.config().google?.client_secret || process.env.GOOGLE_CLIENT_SECRET;
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
    user: functions.config().zeptomail?.user || process.env.ZEPTOMAIL_USER || "emailapikey",
    pass: functions.config().zeptomail?.password || process.env.ZEPTOMAIL_PASSWORD
  }
});

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

    const isUrgent = lead.escalation_required === true;
    const subjectPrefix = isUrgent ? '[URGENT: CRISIS ESCALATION] ' : '[New Assessment Lead] ';

    // Build the email content
    const mailOptions = {
      from: `"Soulamore Engine" <contact.soulamore@gmail.com>`,
      to: 'contact.soulamore@gmail.com', // Sending specifically to the central email
      subject: `${subjectPrefix}Lead: ${lead.name || 'Anonymous'} - ${lead.assessment_domain || 'Unknown Domain'}`,
      html: `
        <div style="font-family: sans-serif; color: #e2e8f0; background-color: #0f172a; padding: 40px; border-radius: 8px;">
          <h2 style="color: ${isUrgent ? '#ef4444' : '#4ECDC4'}; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
            ${isUrgent ? 'URGENT: CRISIS ESCALATION' : 'New Recommended Match Request'}
          </h2>
          <p style="font-size: 1.1rem; opacity: 0.9;">A user has just completed an assessment and requested an outreach from a Peer or Psychologist.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 30px 0; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
            <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Name:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${lead.name || 'Anonymous'}</td></tr>
            <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Email:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${lead.email || 'Not Provided'}</td></tr>
            <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Phone:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${lead.phone || 'Not Provided'}</td></tr>
            <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Assessment Domain:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); text-transform: capitalize;">${(lead.assessment_domain || 'N/A').replace('_', ' ')}</td></tr>
            <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Severity Band:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>${(lead.severity_band || 'N/A').toUpperCase()}</strong></td></tr>
            <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Raw Score:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${lead.raw_score || '0'}</td></tr>
            <tr><td style="padding: 15px;"><strong>Escalation Required:</strong></td><td style="padding: 15px; ${isUrgent ? 'color: #ef4444; font-weight: bold;' : ''}">${isUrgent ? 'Yes (Immediate Action Required)' : 'No'}</td></tr>
          </table>

          <h3 style="margin-top: 30px; font-weight: 500; opacity: 0.8;">Risk Flags (Functional Impairment):</h3>
          <p style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px; font-family: monospace;">${lead.risk_flags === true ? 'Present - High functional impairment detected in cognitive/behavioral responses.' : (lead.risk_flags || 'None Detected')}</p>

          <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            This email was securely and automatically generated by the Soulamore Assessment Clinical Engine.
          </p>
        </div>
      `
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('Lead notification email dispatched to contact.soulamore@gmail.com');
      return null;
    } catch (error) {
      console.error('Error dispatching notification email:', error);
      return null;
    }
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
                   
                   const mailOptions = {
                     from: '"Soulamore Sessions" <contact.soulamore@gmail.com>',
                     subject: `Reminder: Upcoming Session in ${threshold.label}`,
                     html: `
                       <div style="font-family: sans-serif; color: #e2e8f0; background-color: #0f172a; padding: 40px; border-radius: 8px;">
                         <h2 style="color: #4ECDC4; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                           Session Reminder (${threshold.label})
                         </h2>
                         <p style="font-size: 1.1rem; opacity: 0.9;">Hello!</p>
                         <p style="font-size: 1.1rem; opacity: 0.9;">This is a friendly reminder that a session is scheduled for exactly <strong>${threshold.label}</strong> from now.</p>
                         
                         <table style="width: 100%; border-collapse: collapse; margin: 30px 0; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
                           <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Booking ID:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${booking.slId || doc.id}</td></tr>
                           <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Scheduled Time:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${formattedDate} (IST)</td></tr>
                           <tr><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Plan:</strong></td><td style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${booking.planType || 'Per Session'}</td></tr>
                         </table>
                         
                         <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                           This email was securely and automatically generated by Soulamore.
                         </p>
                       </div>
                     `
                   };
                   
                   // Determine recipients
                   if (userData.email) mailOptions.to = userData.email;
                   if (peerData.email) mailOptions.cc = peerData.email;
                   
                   // Fallback if no primary user email
                   if (!mailOptions.to && mailOptions.cc) {
                       mailOptions.to = mailOptions.cc;
                       delete mailOptions.cc;
                   }

                   if (mailOptions.to) {
                       await mailTransport.sendMail(mailOptions);
                       console.log(`Reminder (${threshold.key}) sent for booking ${doc.id}`);
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
