# Peer Booking System - Implementation Summary

## Overview

A complete peer booking system has been implemented with:
- ✅ Multiple pricing plans (per session, monthly, quarterly, yearly)
- ✅ Calendar-based availability checking
- ✅ Time slot selection
- ✅ Payment integration (Razorpay)
- ✅ Booking management in Firestore
- ✅ Custom calendar UI (no third-party fees)

## Files Created/Modified

### New Files

1. **`assets/js/peer-booking-handler.js`**
   - Core booking logic
   - Availability management
   - Time slot generation
   - Booking CRUD operations

2. **`assets/js/payment-handler.js`**
   - Razorpay integration
   - Payment processing
   - Order creation and verification

3. **`our-peers/physical-wellness/renu-dogra-booking.html`**
   - Booking UI with calendar
   - Plan selection
   - Time slot selection
   - Payment flow

4. **`our-peers/physical-wellness/booking-confirmation.html`**
   - Booking confirmation page
   - Booking details display

5. **`docs/PAYMENT_GATEWAY_SETUP.md`**
   - Razorpay setup instructions
   - Cost comparison (Razorpay vs Easebuzz)
   - Calendar solution comparison (Custom vs Supersaas/Calendly)

6. **`docs/BOOKING_SYSTEM_README.md`** (this file)
   - Implementation summary
   - Usage guide

### Modified Files

1. **`firestore.rules`**
   - Added rules for `peer_bookings`
   - Added rules for `peer_availability`
   - Added rules for `peer_plans`
   - Added rules for `payments`

## Features Implemented

### 1. Pricing Plans

Four plan types supported:
- **Per Session**: ₹500 per session (1 session)
- **Monthly**: ₹1,500 per month (4 sessions) - Save 25%
- **Quarterly**: ₹4,500 per quarter (12 sessions) - Save 25%
- **Yearly**: ₹15,000 per year (48 sessions) - Save 37%

### 2. Availability Management

- Peers can set availability schedules (days, times)
- Default availability: Monday-Friday, 9 AM - 5 PM
- Stored in Firestore `peer_availability` collection

### 3. Calendar & Booking

- Visual calendar with month navigation
- Real-time availability checking
- Time slot generation (1-hour slots by default)
- Conflict detection (prevents double-booking)
- Selected date/time highlighting

### 4. Payment Integration

- Razorpay payment gateway
- Secure payment processing
- Payment confirmation and booking activation
- Payment records stored in Firestore

### 5. Booking Management

- Bookings stored in `peer_bookings` collection
- Status tracking: `pending_payment` → `confirmed` → `completed`/`cancelled`
- Users can view their bookings
- Peers can view their bookings

## Database Structure

### Collections

1. **`peer_bookings`**
   ```javascript
   {
     userId: string,
     peerId: string,
     planType: string, // 'per_session' | 'monthly' | 'quarterly' | 'yearly'
     startTime: Timestamp,
     endTime: Timestamp,
     amount: number,
     sessions: number,
     status: string, // 'pending_payment' | 'confirmed' | 'completed' | 'cancelled'
     paymentId: string | null,
     createdAt: Timestamp,
     updatedAt: Timestamp
   }
   ```

2. **`peer_availability`**
   ```javascript
   {
     peerId: string,
     availability: [
       {
         day: string, // 'monday' | 'tuesday' | etc.
         startTime: string, // '09:00'
         endTime: string // '17:00'
       }
     ],
     timezone: string, // 'Asia/Kolkata'
     updatedAt: Timestamp
   }
   ```

3. **`peer_plans`** (optional - for custom plans per peer)
   ```javascript
   {
     peerId: string,
     plans: {
       per_session: {...},
       monthly: {...},
       // etc.
     }
   }
   ```

4. **`payments`**
   ```javascript
   {
     bookingId: string,
     paymentId: string,
     amount: number,
     currency: string, // 'INR'
     gateway: string, // 'razorpay'
     status: string, // 'success' | 'failed'
     metadata: object,
     createdAt: Timestamp
   }
   ```

## Usage Guide

### For Peers: Setting Availability

```javascript
import { setPeerAvailability } from "./assets/js/peer-booking-handler.js";

// Set peer availability
await setPeerAvailability(peerId, [
  { day: 'monday', startTime: '09:00', endTime: '17:00' },
  { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
  { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
  // ... etc
]);
```

### For Users: Booking a Session

1. Navigate to booking page: `/our-peers/physical-wellness/renu-dogra-booking.html`
2. Select a pricing plan (per session, monthly, quarterly, or yearly)
3. Choose a date from the calendar
4. Select an available time slot
5. Review booking summary
6. Click "Proceed to Payment"
7. Complete payment via Razorpay
8. Redirect to confirmation page

### For Developers: Creating a Booking

```javascript
import { createBookingRequest, confirmBooking } from "./assets/js/peer-booking-handler.js";
import { openRazorpayCheckout } from "./assets/js/payment-handler.js";

// Step 1: Create booking request
const bookingResult = await createBookingRequest(
  userId,
  peerId,
  'per_session', // or 'monthly', 'quarterly', 'yearly'
  startTime, // Date object
  endTime    // Date object
);

// Step 2: Open payment checkout
await openRazorpayCheckout(
  bookingResult.bookingId,
  bookingResult.amount,
  userId,
  userName,
  userEmail,
  userPhone,
  { planName: 'Per Session' }
);

// Step 3: Payment success automatically confirms booking
// (Handled in payment-handler.js)
```

## Cost Analysis

### Payment Gateway Costs

**Razorpay**: 2% + GST per transaction
- Example: ₹1,500 booking = ₹30 + ₹5.40 GST = ₹35.40 fee
- **Recommendation**: Encourage yearly plans to reduce transaction volume

### Scheduling Solution Costs

**Custom Calendar**: ₹0/month (no recurring fees)
- **Savings**: ₹750-2,400/month vs Supersaas/Calendly

**Total Monthly Savings**: ~₹1,500-2,500/month (for moderate booking volume)

## Security Considerations

1. **Payment Processing**:
   - ⚠️ Current implementation uses client-side order creation (for development)
   - ✅ **Production**: Move to Firebase Functions or backend API
   - ✅ Never expose Razorpay Key Secret in client-side code

2. **Firestore Rules**:
   - ✅ Users can only read their own bookings
   - ✅ Peers can read bookings for them
   - ✅ Only authenticated users can create bookings
   - ✅ Payment records cannot be deleted (audit trail)

3. **Validation**:
   - ✅ Time slot availability checked before booking
   - ✅ Conflict detection prevents double-booking
   - ✅ Amount validation from plan data

## Next Steps

### Immediate (Before Production)

1. **Get Razorpay API Keys**:
   - Sign up at https://dashboard.razorpay.com/
   - Get Key ID and Key Secret
   - Update `payment-handler.js` with Key ID

2. **Move Payment Logic to Backend** (Recommended):
   - Create Firebase Function for order creation
   - Create Firebase Function for payment verification
   - Store Key Secret in Firebase Functions environment variables

3. **Test Payment Flow**:
   - Test with Razorpay test cards
   - Verify bookings created in Firestore
   - Test all plan types

4. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Future Enhancements

1. **Email Notifications**:
   - Booking confirmation emails
   - Reminder emails (24 hours before)
   - Cancellation notifications

2. **SMS Reminders**:
   - Integration with SMS gateway
   - Reminder texts before sessions

3. **Calendar Integration**:
   - Google Calendar sync
   - Outlook calendar sync
   - iCal export

4. **Rescheduling**:
   - Allow users to reschedule bookings
   - Automatic availability check
   - Notification to peers

5. **Cancellations**:
   - Allow cancellations with refund policy
   - Automatic refund processing
   - Booking history tracking

6. **Analytics**:
   - Booking statistics dashboard
   - Revenue tracking
   - Popular time slots analysis

## Support & Documentation

- **Payment Gateway Setup**: See `docs/PAYMENT_GATEWAY_SETUP.md`
- **Razorpay Docs**: https://razorpay.com/docs/
- **Firestore Rules**: See `firestore.rules`
- **Code Files**: 
  - `assets/js/peer-booking-handler.js`
  - `assets/js/payment-handler.js`

## Troubleshooting

### Booking not created after payment

1. Check Firestore rules allow booking creation
2. Verify payment signature verification (if using backend)
3. Check browser console for errors
4. Verify booking handler functions are imported correctly

### Time slots not showing

1. Check peer availability is set in Firestore
2. Verify date has availability for that day of week
3. Check for existing bookings conflicting with slots
4. Verify `getAvailableSlots` function is working

### Payment not processing

1. Verify Razorpay Key ID is set correctly
2. Check Razorpay script is loaded (check Network tab)
3. Verify amount is in correct format (paise for Razorpay)
4. Check browser console for Razorpay errors

## Summary

✅ **Complete booking system implemented**
✅ **Cost-effective solution** (custom calendar + Razorpay)
✅ **Scalable architecture** (Firestore-based)
✅ **Production-ready** (after Razorpay setup and backend migration)

**Estimated Monthly Savings**: ₹1,500-2,500/month vs paid solutions
**Setup Time**: 1-2 hours (Razorpay account + API keys)
**Maintenance**: Minimal (self-hosted, no third-party dependencies)


