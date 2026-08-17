import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Booking Service - Atomic Transaction Engine & Slot Management
 * Resolves BUG-040, BUG-042, BUG-044, BUG-045, BUG-048, BUG-049
 */

interface BookSessionParams {
  peerId: string;
  planType: string;
  startTime: string | number; // ISO string or timestamp ms
  endTime: string | number;
  userName?: string;
  userEmail?: string;
  targetUserId?: string; // Optional if provider is booking for client
  bookedByRole?: 'user' | 'peer' | 'psychologist' | 'admin';
  requestId?: string; // For idempotency
}

/**
 * Helper to calculate dynamic commission based on practitioner rating
 */
function calculateCommission(rating: number): number {
  if (rating >= 4.8) return 0.10; // 10%
  if (rating >= 4.5) return 0.20; // 20%
  return 0.50; // 50% default
}

/**
 * Helper to generate SL-ID (SL-YYYY-XXXX)
 */
function generateSLID(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SL-${year}-${random}`;
}

/**
 * 1. ATOMIC BOOKING FUNCTION (bookSessionCallable)
 * Wraps slot check, session doc creation, and audit logging inside a single Firestore transaction.
 */
export const bookSessionCallable = functions.https.onCall(async (data: BookSessionParams, context) => {
  const db = admin.firestore();

  // Determine active caller UID
  let callerUid = context.auth?.uid;
  const bookedByRole = data.bookedByRole || 'user';

  // If provider booking for a client, targetUserId is specified; otherwise user books for self
  const targetUserId = (bookedByRole === 'peer' || bookedByRole === 'psychologist' || bookedByRole === 'admin')
    ? (data.targetUserId || callerUid || 'guest_user')
    : (callerUid || 'guest_user');

  if (!data.peerId || !data.startTime || !data.endTime) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing peerId, startTime, or endTime.');
  }

  const startMs = new Date(data.startTime).getTime();
  const endMs = new Date(data.endTime).getTime();

  if (isNaN(startMs) || isNaN(endMs) || startMs >= endMs) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid startTime or endTime parameters.');
  }

  const requestId = data.requestId || `req_${startMs}_${data.peerId}_${targetUserId}`;
  const idempotencyRef = db.collection('booking_idempotency').doc(requestId);

  // Run atomic Firestore Transaction
  try {
    return await db.runTransaction(async (transaction) => {
      // A. Check Idempotency (prevent duplicate submits)
      const idempotencySnap = await transaction.get(idempotencyRef);
      if (idempotencySnap.exists) {
        functions.logger.info(`🔁 [bookSessionCallable] Idempotent request re-play: ${requestId}`);
        return idempotencySnap.data();
      }

      // B. Query existing bookings for peerId to assert zero overlapping sessions
      const bookingsRef = db.collection('peer_bookings');
      const querySnap = await transaction.get(
        bookingsRef
          .where('peerId', '==', data.peerId)
          .where('status', 'in', ['confirmed', 'pending_payment'])
      );

      for (const doc of querySnap.docs) {
        const b = doc.data();
        let existingStart = 0;
        let existingEnd = 0;

        if (b.startTime && b.startTime.toMillis) {
          existingStart = b.startTime.toMillis();
        } else if (b.startTime && b.startTime._seconds) {
          existingStart = b.startTime._seconds * 1000;
        } else {
          existingStart = new Date(b.startTime).getTime();
        }

        if (b.endTime && b.endTime.toMillis) {
          existingEnd = b.endTime.toMillis();
        } else if (b.endTime && b.endTime._seconds) {
          existingEnd = b.endTime._seconds * 1000;
        } else {
          existingEnd = new Date(b.endTime).getTime();
        }

        // Check for window overlap
        if (startMs < existingEnd && endMs > existingStart) {
          throw new functions.https.HttpsError('already-exists', 'Time slot is no longer available.');
        }
      }

      // C. Query practitioner details for commission calculation
      const peerDocRef = db.collection('users').doc(data.peerId);
      const peerSnap = await transaction.get(peerDocRef);
      let practitionerRating = 0;
      let pRole = 'PEER';
      let peerName = 'Peer Listener';

      if (peerSnap.exists) {
        const pData = peerSnap.data() || {};
        practitionerRating = pData.rating || 0;
        pRole = (pData.role || 'PEER').toUpperCase();
        peerName = pData.name || pData.displayName || 'Peer Listener';
      }

      const planType = data.planType || 'per_session';
      const planPrices: Record<string, number> = {
        per_session: 500,
        monthly: 1500,
        quarterly: 4500,
        yearly: 15000
      };
      const totalAmount = planPrices[planType] || 500;
      const commissionRate = calculateCommission(practitionerRating);
      const soulamoreCut = totalAmount * commissionRate;
      const practitionerShare = totalAmount - soulamoreCut;

      const slId = generateSLID();
      const newBookingRef = db.collection('peer_bookings').doc();
      const bookingId = newBookingRef.id;

      // Status: if booked directly by provider, auto-confirm; if booked by user, mark pending_payment
      const initialStatus = (bookedByRole === 'peer' || bookedByRole === 'psychologist' || bookedByRole === 'admin')
        ? 'confirmed'
        : 'pending_payment';

      const meetingUrl = `https://meet.jit.si/soulamore-${slId.toLowerCase()}`;

      const bookingData = {
        slId: slId,
        tag: pRole,
        userId: targetUserId,
        peerId: data.peerId,
        userName: data.userName || 'Client',
        userEmail: data.userEmail || '',
        peerName: peerName,
        planType: planType,
        startTime: admin.firestore.Timestamp.fromMillis(startMs),
        endTime: admin.firestore.Timestamp.fromMillis(endMs),
        meetingUrl: meetingUrl,
        amount: totalAmount,
        financials: {
          soulamoreCut: soulamoreCut,
          practitionerShare: practitionerShare,
          commissionRate: commissionRate,
          payoutStatus: 'pending'
        },
        status: initialStatus,
        bookedByRole: bookedByRole,
        bookedByUid: callerUid || 'system',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Atomic Write #1: Booking Document
      transaction.set(newBookingRef, bookingData);

      // Atomic Write #2: Audit Log Document (BUG-044)
      const auditRef = db.collection('audit_logs').doc();
      const auditData = {
        eventType: 'SESSION_BOOKED',
        bookingId: bookingId,
        slId: slId,
        userId: targetUserId,
        peerId: data.peerId,
        bookedByRole: bookedByRole,
        bookedByUid: callerUid || 'system',
        amount: totalAmount,
        status: initialStatus,
        startTime: admin.firestore.Timestamp.fromMillis(startMs),
        endTime: admin.firestore.Timestamp.fromMillis(endMs),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      };
      transaction.set(auditRef, auditData);

      // Atomic Write #3: Store Slot Document in `slots` collection (BUG-042)
      const slotRef = db.collection('slots').doc(`${data.peerId}_${startMs}`);
      transaction.set(slotRef, {
        slotId: `${data.peerId}_${startMs}`,
        peerId: data.peerId,
        startTime: admin.firestore.Timestamp.fromMillis(startMs),
        endTime: admin.firestore.Timestamp.fromMillis(endMs),
        status: 'booked',
        bookingId: bookingId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      const responsePayload = {
        bookingId: bookingId,
        slId: slId,
        amount: totalAmount,
        status: initialStatus,
        message: 'Session booked successfully'
      };

      // Atomic Write #4: Idempotency token
      transaction.set(idempotencyRef, responsePayload);

      return responsePayload;
    });
  } catch (error: any) {
    functions.logger.error('🔥 [bookSessionCallable] Error executing booking transaction:', error);
    throw new functions.https.HttpsError(
      error.code === 'already-exists' ? 'already-exists' : 'internal',
      error.message || 'Booking transaction failed.'
    );
  }
});

/**
 * 2. SCHEDULED SLOT GENERATION SERVICE (generateDailySlotsSchedule)
 * Runs daily to pre-populate slots 30 days ahead based on provider recurring rules (BUG-042)
 */
export const generateDailySlotsSchedule = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.firestore();
  functions.logger.info('📅 [generateDailySlotsSchedule] Starting daily slot generation job...');

  try {
    const availSnap = await db.collection('peer_availability').get();
    const batch = db.batch();
    let slotCount = 0;

    const now = new Date();
    for (const doc of availSnap.docs) {
      const peerId = doc.id;
      const data = doc.data();
      const availabilityList = data.availability || [];

      // Generate slots for next 14 days
      for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + dayOffset);
        const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const daySchedules = availabilityList.filter((s: any) => s.day.toLowerCase() === dayName);

        for (const sched of daySchedules) {
          const [startHour, startMin] = (sched.startTime || '09:00').split(':').map(Number);
          const [endHour, endMin] = (sched.endTime || '17:00').split(':').map(Number);

          const slotStart = new Date(targetDate);
          slotStart.setHours(startHour, startMin, 0, 0);

          const slotEnd = new Date(targetDate);
          slotEnd.setHours(endHour, endMin, 0, 0);

          let current = new Date(slotStart);
          while (current < slotEnd) {
            const endCurr = new Date(current);
            endCurr.setHours(current.getHours() + 1);

            const slotId = `${peerId}_${current.getTime()}`;
            const slotRef = db.collection('slots').doc(slotId);

            batch.set(slotRef, {
              slotId: slotId,
              peerId: peerId,
              startTime: admin.firestore.Timestamp.fromDate(current),
              endTime: admin.firestore.Timestamp.fromDate(endCurr),
              status: 'available',
              generatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            slotCount++;
            current.setHours(current.getHours() + 1);
          }
        }
      }
    }

    await batch.commit();
    functions.logger.info(`✅ [generateDailySlotsSchedule] Generated/verified ${slotCount} slots.`);
  } catch (err: any) {
    functions.logger.error('🔥 [generateDailySlotsSchedule] Error generating slots:', err);
  }
});

/**
 * 3. RESCHEDULE SESSION CALLABLE (rescheduleSessionCallable - BUG-048)
 */
export const rescheduleSessionCallable = functions.https.onCall(async (data: { bookingId: string; newStartTime: string | number; newEndTime: string | number }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated to reschedule.');
  }

  const db = admin.firestore();
  const { bookingId, newStartTime, newEndTime } = data;

  const newStartMs = new Date(newStartTime).getTime();
  const newEndMs = new Date(newEndTime).getTime();

  return await db.runTransaction(async (transaction) => {
    const bookingRef = db.collection('peer_bookings').doc(bookingId);
    const bookingSnap = await transaction.get(bookingRef);

    if (!bookingSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found.');
    }

    const booking = bookingSnap.data()!;
    if (booking.userId !== context.auth!.uid && booking.peerId !== context.auth!.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Unauthorized to reschedule this booking.');
    }

    // Check overlap for new time
    const overlapSnap = await transaction.get(
      db.collection('peer_bookings')
        .where('peerId', '==', booking.peerId)
        .where('status', 'in', ['confirmed', 'pending_payment'])
    );

    for (const doc of overlapSnap.docs) {
      if (doc.id === bookingId) continue; // skip self
      const b = doc.data();
      const bStart = b.startTime?.toMillis ? b.startTime.toMillis() : new Date(b.startTime).getTime();
      const bEnd = b.endTime?.toMillis ? b.endTime.toMillis() : new Date(b.endTime).getTime();

      if (newStartMs < bEnd && newEndMs > bStart) {
        throw new functions.https.HttpsError('already-exists', 'Target reschedule time slot is occupied.');
      }
    }

    transaction.update(bookingRef, {
      startTime: admin.firestore.Timestamp.fromMillis(newStartMs),
      endTime: admin.firestore.Timestamp.fromMillis(newEndMs),
      rescheduledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Write audit log
    const auditRef = db.collection('audit_logs').doc();
    transaction.set(auditRef, {
      eventType: 'SESSION_RESCHEDULED',
      bookingId: bookingId,
      slId: booking.slId,
      requestedBy: context.auth!.uid,
      newStartTime: admin.firestore.Timestamp.fromMillis(newStartMs),
      newEndTime: admin.firestore.Timestamp.fromMillis(newEndMs),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { status: 'success', message: 'Session rescheduled successfully.' };
  });
});

/**
 * 4. CANCEL SESSION CALLABLE (cancelSessionCallable - BUG-048)
 */
export const cancelSessionCallable = functions.https.onCall(async (data: { bookingId: string; reason?: string }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated to cancel.');
  }

  const db = admin.firestore();
  const { bookingId, reason } = data;

  return await db.runTransaction(async (transaction) => {
    const bookingRef = db.collection('peer_bookings').doc(bookingId);
    const bookingSnap = await transaction.get(bookingRef);

    if (!bookingSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found.');
    }

    const booking = bookingSnap.data()!;
    transaction.update(bookingRef, {
      status: 'cancelled',
      cancellationReason: reason || 'User requested cancellation',
      cancelledBy: context.auth!.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Write audit log
    const auditRef = db.collection('audit_logs').doc();
    transaction.set(auditRef, {
      eventType: 'SESSION_CANCELLED',
      bookingId: bookingId,
      slId: booking.slId,
      cancelledBy: context.auth!.uid,
      reason: reason || 'User requested cancellation',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { status: 'success', message: 'Session cancelled.' };
  });
});

/**
 * 5. TOGGLE PROVIDER SLOT (toggleProviderSlotCallable - BUG-045)
 */
export const toggleProviderSlotCallable = functions.https.onCall(async (data: { peerId: string; startTime: string | number; isBlocked: boolean }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
  }

  const db = admin.firestore();
  const { peerId, startTime, isBlocked } = data;
  const startMs = new Date(startTime).getTime();
  const slotId = `${peerId}_${startMs}`;

  const slotRef = db.collection('slots').doc(slotId);
  await slotRef.set({
    slotId: slotId,
    peerId: peerId,
    startTime: admin.firestore.Timestamp.fromMillis(startMs),
    status: isBlocked ? 'blocked' : 'available',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return { status: 'success', slotId };
});

/**
 * 6. ICS CALENDAR FILE GENERATOR (generateICSContent)
 */
export function generateICSContent(booking: {
  slId: string;
  peerName: string;
  userName: string;
  startTime: Date | number | string;
  endTime: Date | number | string;
  meetingUrl?: string;
}): string {
  const start = new Date(booking.startTime).toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(booking.endTime).toISOString().replace(/-|:|\.\d+/g, '');
  const now = new Date().toISOString().replace(/-|:|\.\d+/g, '');
  const meetingLink = booking.meetingUrl || `https://soulamore.com/portal/user-dashboard-v2.html?view=bookings`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Soulamore Inc//Appointments Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:soulamore-${booking.slId}@soulamore.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Soulamore Wellness Session (${booking.peerName} & ${booking.userName})`,
    `DESCRIPTION:Your Soulamore Session is scheduled! Join meeting room here: ${meetingLink}`,
    `LOCATION:${meetingLink}`,
    `URL:${meetingLink}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Soulamore Session starting in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
