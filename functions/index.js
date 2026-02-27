/**
 * Firebase Functions for Soulamore
 * Handles secure server-side operations like payment verification
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');

// CodeQL Fix: Permissive CORS configuration
// Restrict to specific allowed origins instead of true (wildcard)
const allowedOrigins = [
  'https://soulamore-f0a64.web.app',
  'https://soulamore-f0a64.firebaseapp.com',
  'https://soulamore.com',
  'https://www.soulamore.com', // Assuming custom domain
  'http://localhost:5000',     // Local testing
  'http://127.0.0.1:5500'      // VS Code Live Server
];

const cors = require('cors')({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Optional: For now, during development, you might want to log this but allow it to avoid breakage,
      // but the CodeQL fix requires blocking.
      console.warn(`Blocked CORS for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  }
});

admin.initializeApp();

// Initialize Razorpay with Key ID and Secret from environment variables
const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id || process.env.RAZORPAY_KEY_ID,
  key_secret: functions.config().razorpay.key_secret || process.env.RAZORPAY_KEY_SECRET
});

/**
 * Verify Razorpay payment signature
 * This should be called after payment to verify authenticity
 */
exports.verifyPayment = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Verify payment signature
      const crypto = require('crypto');
      const text = razorpay_order_id + '|' + razorpay_payment_id;
      const generatedSignature = crypto
        .createHmac('sha256', functions.config().razorpay.key_secret || process.env.RAZORPAY_KEY_SECRET)
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

      // Update booking status
      await bookingRef.update({
        status: 'confirmed',
        paymentId: razorpay_payment_id,
        paymentData: {
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          razorpay_signature: razorpay_signature,
          amount: payment.amount / 100, // Convert paise to INR
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

const nodemailer = require('nodemailer');

// Configure the email transport using ZeptoMail SMTP
const mailTransport = nodemailer.createTransport({
  host: "smtp.zeptomail.eu",
  port: 587,
  auth: {
    user: functions.config().zeptomail?.user || process.env.ZEPTOMAIL_USER || "emailapikey",
    pass: functions.config().zeptomail?.password || process.env.ZEPTOMAIL_PASSWORD || "yA6KbHtS7w/0lzkCRhRo1MCI9ohk//1q2n+15CDmeMIlLoGzh6E51kFpKtq7dTfeiI7W5f1SP48WJ9uwuIwKKpJnY9AHLJTGTuv4P2uV48xh8ciEYNYigZisALkRFKBJcBknDy83RPMmWA=="
  }
});

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
