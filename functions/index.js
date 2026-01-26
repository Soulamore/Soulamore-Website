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


