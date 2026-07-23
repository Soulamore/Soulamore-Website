import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as functions from 'firebase-functions/v1';

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';
const PAYMENT_SECRETS = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
const PLAN_PRICES: Record<string, { amount: number; sessions: number }> = {
  per_session: { amount: 500, sessions: 1 },
  monthly: { amount: 1500, sessions: 4 },
  quarterly: { amount: 4500, sessions: 12 },
  yearly: { amount: 15000, sessions: 48 }
};

interface CreateOrderRequest {
  bookingId: string;
}

interface VerifyPaymentRequest {
  bookingId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function requiredString(value: unknown, field: string, maxLength = 128): string {
  if (typeof value !== 'string' || !value.trim() || value.length > maxLength) {
    throw new functions.https.HttpsError('invalid-argument', `${field} is invalid.`);
  }
  return value.trim();
}

function paymentCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    functions.logger.error('Razorpay secrets are not configured.');
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The payment service is not configured.'
    );
  }
  if (!keyId.startsWith('rzp_test_')) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Only Razorpay test keys are allowed in this integration.'
    );
  }
  return { keyId, keySecret };
}

async function razorpayRequest<T>(
  path: string,
  init: RequestInit,
  keyId: string,
  keySecret: string
): Promise<T> {
  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(`${RAZORPAY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const body = await response.json() as Record<string, unknown>;
  if (!response.ok) {
    functions.logger.error('Razorpay API request failed', {
      path,
      status: response.status,
      error: body.error
    });
    throw new functions.https.HttpsError(
      'internal',
      'Razorpay could not create the test order.'
    );
  }
  return body as T;
}

export const createRazorpayOrder = functions
  .runWith({ secrets: PAYMENT_SECRETS })
  .https.onCall(async (data: CreateOrderRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Sign in before paying.');
    }

    const bookingId = requiredString(data?.bookingId, 'bookingId');
    const firestore = admin.firestore();
    const bookingRef = firestore.collection('peer_bookings').doc(bookingId);
    const bookingSnapshot = await bookingRef.get();
    if (!bookingSnapshot.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found.');
    }

    const booking = bookingSnapshot.data() || {};
    if (booking.userId !== context.auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You can only pay for your own booking.'
      );
    }
    if (booking.status === 'confirmed') {
      throw new functions.https.HttpsError(
        'already-exists',
        'This booking is already confirmed.'
      );
    }
    if (booking.status !== 'pending_payment') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'This booking is not awaiting payment.'
      );
    }

    const plan = PLAN_PRICES[booking.planType];
    if (!plan) {
      throw new functions.https.HttpsError('failed-precondition', 'Unknown booking plan.');
    }

    const { keyId, keySecret } = paymentCredentials();
    const amountInPaise = plan.amount * 100;

    if (
      booking.razorpayOrderId
      && booking.razorpayOrderAmount === amountInPaise
      && booking.razorpayOrderStatus === 'created'
    ) {
      return {
        orderId: booking.razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId
      };
    }

    const order = await razorpayRequest<{
      id: string;
      amount: number;
      currency: string;
      status: string;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `booking_${bookingId}`.slice(0, 40),
        notes: {
          bookingId,
          userId: context.auth.uid,
          peerId: String(booking.peerId || '')
        }
      })
    }, keyId, keySecret);

    await bookingRef.update({
      amount: plan.amount,
      sessions: plan.sessions,
      razorpayOrderId: order.id,
      razorpayOrderAmount: order.amount,
      razorpayOrderStatus: order.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    functions.logger.info('Razorpay test order created', {
      bookingId,
      orderId: order.id,
      uid: context.auth.uid
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId
    };
  });

export const verifyPayment = functions
  .runWith({ secrets: PAYMENT_SECRETS })
  .https.onCall(async (data: VerifyPaymentRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Sign in before verifying payment.'
      );
    }

    const bookingId = requiredString(data?.bookingId, 'bookingId');
    const paymentId = requiredString(data?.razorpay_payment_id, 'razorpay_payment_id');
    const orderId = requiredString(data?.razorpay_order_id, 'razorpay_order_id');
    const signature = requiredString(data?.razorpay_signature, 'razorpay_signature', 256);
    const { keySecret } = paymentCredentials();
    const firestore = admin.firestore();
    const bookingRef = firestore.collection('peer_bookings').doc(bookingId);
    const paymentRef = firestore.collection('payments').doc(paymentId);
    const notificationRef = firestore.collection('notifications').doc(`booking_${bookingId}`);

    await firestore.runTransaction(async transaction => {
      const [bookingSnapshot, paymentSnapshot] = await Promise.all([
        transaction.get(bookingRef),
        transaction.get(paymentRef)
      ]);
      if (!bookingSnapshot.exists) {
        throw new functions.https.HttpsError('not-found', 'Booking not found.');
      }

      const booking = bookingSnapshot.data() || {};
      if (booking.userId !== context.auth?.uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You can only verify your own payment.'
        );
      }
      if (booking.razorpayOrderId !== orderId) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'The payment order does not match this booking.'
        );
      }

      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${booking.razorpayOrderId}|${paymentId}`)
        .digest('hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const receivedBuffer = Buffer.from(signature, 'utf8');
      if (
        expectedBuffer.length !== receivedBuffer.length
        || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
      ) {
        functions.logger.warn('Razorpay signature verification failed', {
          bookingId,
          orderId,
          uid: context.auth?.uid
        });
        throw new functions.https.HttpsError(
          'permission-denied',
          'Payment signature verification failed.'
        );
      }

      if (
        booking.status === 'confirmed'
        && booking.paymentId === paymentId
        && paymentSnapshot.exists
      ) {
        return;
      }
      if (booking.status !== 'pending_payment') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'This booking cannot be confirmed.'
        );
      }

      const amountInPaise = Number(booking.razorpayOrderAmount);
      transaction.update(bookingRef, {
        status: 'confirmed',
        paymentId,
        paymentData: {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          amount: amountInPaise / 100,
          currency: 'INR',
          gateway: 'razorpay',
          mode: 'test'
        },
        razorpayOrderStatus: 'paid',
        confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      transaction.set(paymentRef, {
        bookingId,
        paymentId,
        orderId,
        userId: booking.userId,
        peerId: booking.peerId || null,
        amount: amountInPaise / 100,
        amountInPaise,
        currency: 'INR',
        gateway: 'razorpay',
        mode: 'test',
        status: 'verified',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      if (booking.peerId) {
        transaction.set(notificationRef, {
          userId: booking.peerId,
          type: 'booking_confirmed',
          title: 'New Session Booked',
          message: 'A new paid test session has been confirmed.',
          bookingId,
          status: 'unread',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    functions.logger.info('Razorpay test payment verified', {
      bookingId,
      orderId,
      paymentId,
      uid: context.auth.uid
    });
    return { success: true, bookingId, paymentId, orderId };
  });
