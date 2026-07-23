# Critical Error Report: Peer Booking Persistence and Email Failure

**Reporter:** Aryan  
**Recorded by:** Codex  
**Date:** 2026-07-23  
**Severity:** Critical  
**Status:** Open / Unresolved  
**Area:** Peer booking workflow, user dashboard, booking notifications, email delivery

## Summary

The temporary payment-free peer booking workflow does not complete its expected downstream behavior. After a user selects a peer, date, and time slot and attempts a test booking, the booking is not displayed under **Dashboard → Guided Sessions → Upcoming Sessions**. No booking confirmation email is received by the booking user or the peer.

This prevents verification of booking persistence, dashboard visibility, peer notification, and email delivery while payments are archived.

## Observed Result

- The user dashboard displays **“No upcoming sessions scheduled.”**
- The expected booking is absent from the Upcoming Sessions view.
- No confirmation email is received by the user.
- No new-booking email is received by the peer.
- The end-to-end booking test cannot be considered successful.

## Expected Result

After selecting an available slot and confirming a test booking:

1. A real booking document should be stored in `peer_bookings`.
2. Its status should transition from `pending_payment` to `confirmed`.
3. The booking should appear in the booking user's Upcoming Sessions.
4. The booking should appear in the peer's booking/session view.
5. The normal booking-confirmation trigger should run.
6. Confirmation emails should be sent to both the user and the peer.
7. Email delivery results should be recorded on the booking under `emailDelivery`.
8. No payment or Razorpay transaction should be created while test mode is enabled.

## Reproduction

1. Sign in to Soulamore.
2. Open the peer listing and select **View Profile**.
3. Choose a future date.
4. Select an available time slot.
5. Click **Confirm Test Booking**.
6. Open `/portal/user-dashboard.html?view=bookings`.
7. Observe that Upcoming Sessions remains empty.
8. Check the user and peer email inboxes, including spam folders.
9. Observe that neither confirmation email was received.

## Evidence

The supplied screenshot shows the authenticated user dashboard for **Aditya Harsh** on the Guided Sessions page. The Upcoming Sessions panel states **“No upcoming sessions scheduled.”**

## Impact

- Peer booking persistence cannot be verified.
- Dashboard booking queries cannot be verified.
- User and peer email delivery cannot be verified.
- Slot-conflict protection may be unreliable if the booking was never persisted.
- The payment module must not be reintroduced until this workflow is confirmed.
- Users may believe they booked a session when no visible session or confirmation exists.

## Suspected Failure Boundaries

The exact failing boundary has not yet been confirmed. Investigation must distinguish between:

- The deployed `createBookingInTestMode` callable not being invoked.
- The callable failing before writing the booking.
- A booking being stored under a different authenticated user ID.
- The dashboard querying a different collection, status set, or user ID field.
- The dashboard suppressing `confirmed` test-mode bookings.
- The booking status update not activating `onBookingUpdated`.
- The email trigger running but failing due to missing peer/user records or email configuration.
- The custom domain serving cached frontend code that calls an older function path.

## Required Diagnostic Evidence

Before implementing another fix, collect:

1. Browser console and Network response for `createBookingInTestMode`.
2. Cloud Function logs for `createBookingInTestMode` at the booking timestamp.
3. Firestore evidence for the expected document in `peer_bookings`.
4. The booking document's `userId`, `peerId`, `status`, `startTime`, and `workflowTest`.
5. The dashboard's active Firebase Auth UID and booking query.
6. Cloud Function logs for `onBookingUpdated`.
7. The booking document's `emailDelivery` field, if present.
8. Email provider response/error logs and confirmation that the user and peer documents contain valid email addresses.

## Acceptance Criteria

This issue is resolved only when one payment-free test booking:

- appears in the user dashboard,
- appears for the booked peer,
- persists as `confirmed` in Firestore,
- records the test-workflow marker,
- sends both confirmation emails,
- records both delivery outcomes,
- and creates no payment record.

## Safety Note

Keep the payment module archived while this incident remains open. Do not treat a success message in the browser as proof of completion; persistence, dashboard visibility, trigger execution, and email delivery must each be verified independently.
