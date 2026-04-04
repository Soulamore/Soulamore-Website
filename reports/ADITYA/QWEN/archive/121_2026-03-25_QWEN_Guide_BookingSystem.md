# Soulamore Booking System - Complete Guide

## Overview
Your Soulamore platform already has a complete role-based booking system with availability management, session booking, and payment integration.

---

## 3 Main User Profiles

### 1. **End User** (Regular Member)
- **Dashboard:** `/portal/user-dashboard.html`
- **Capabilities:**
  - Browse peer/psychologist profiles at `/our-peers/` and `/our-psychologists/`
  - View peer availability (real-time)
  - Book sessions via the booking widget
  - View upcoming sessions in "My Sessions" tab
  - Make payments via Razorpay

### 2. **Peer** (Trained Peer Supporter)
- **Dashboard:** `/portal/peer-dashboard.html`
- **Capabilities:**
  - Set weekly availability schedule
  - View upcoming booked sessions
  - Manage profile (bio, approach, tags)
  - View community impact analytics
  - Access supervision and guidelines

### 3. **Psychologist** (Verified Professional)
- **Dashboard:** `/portal/psych-dashboard.html`
- **Capabilities:**
  - Same as Peer (set availability, view sessions)
  - Professional profile management
  - Higher session fees configuration

---

## How It Works

### For Peers/Psychologists: Setting Availability

1. **Login** → Redirects to role-specific dashboard
2. Navigate to **"Availability"** tab in sidebar
3. Use the **Weekly Schedule** builder:
   - Add time slots for each day (e.g., Monday 9:00 AM - 5:00 PM)
   - Multiple slots per day supported
   - Save schedule to Firestore (`peer_availability` collection)

**File:** `portal/peer-dashboard.html` (lines 1076-2150)
**Function:** `setPeerAvailability(peerId, availability)`

```javascript
// Example availability structure
[
  { day: 'monday', startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' },
  { day: 'wednesday', startTime: '10:00', endTime: '14:00', timezone: 'Asia/Kolkata' }
]
```

### For End Users: Booking a Session

1. **Browse Peers** at `/our-peers/index.html`
2. **Click on a Peer Profile** → Opens `/our-peers/profile.html?id={peerId}`
3. **View Profile** with:
   - Bio, approach, tags
   - Reviews from other users
   - **Booking Widget** (embedded)
4. **Select Date & Time** from available slots
5. **Choose Plan:**
   - Per Session (₹500)
   - Monthly (₹1500 / 4 sessions)
   - Quarterly (₹4500 / 12 sessions)
   - Yearly (₹15000 / 48 sessions)
6. **Payment** via Razorpay
7. **Confirmation** → Session appears in "My Sessions"

**File:** `assets/js/booking-widget.js`
**Functions:**
- `getAvailableSlots(peerId, date)` - Fetches available times
- `createBookingRequest(userId, peerId, planType, startTime, endTime)`

### For Peers: Viewing Upcoming Sessions

1. Login to **Peer Dashboard**
2. Navigate to **"Sessions"** tab
3. See **Upcoming Sessions** grid with:
   - User name/initials
   - Date & time
   - Session type (1:1, Monthly, etc.)
   - Status (Confirmed / Pending Payment)

**File:** `portal/peer-dashboard.html` (lines 809-850, 1521-1580)
**Function:** `getPeerBookings(peerId)`

---

## Database Collections

### `users`
User profiles with role field:
```javascript
{
  uid: "user123",
  displayName: "John Doe",
  email: "john@example.com",
  role: "Peer", // or "Psychologist", "Member"
  bio: "...",
  // ... other fields
}
```

### `roles`
Verification flags for professionals:
```javascript
{
  peer: true,        // If verified peer
  psychologist: true // If verified psychologist
}
```

### `peer_availability`
Weekly schedules:
```javascript
{
  peerId: "peer123",
  role: "peer",
  availability: [/* slots */],
  timezone: "Asia/Kolkata",
  updatedAt: Timestamp
}
```

### `peer_bookings`
Booking records:
```javascript
{
  userId: "user123",
  peerId: "peer123",
  planType: "per_session",
  startTime: Timestamp,
  endTime: Timestamp,
  amount: 500,
  sessions: 1,
  status: "confirmed", // or "pending_payment", "completed", "cancelled"
  paymentId: "pay_abc123",
  createdAt: Timestamp
}
```

### `payments`
Payment records:
```javascript
{
  bookingId: "booking123",
  paymentId: "pay_abc123",
  amount: 500,
  currency: "INR",
  gateway: "razorpay",
  status: "success",
  metadata: { /* Razorpay response */ }
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `assets/js/peer-booking-handler.js` | Core booking logic, availability management |
| `assets/js/booking-widget.js` | UI widget for booking (embedded in profiles) |
| `assets/js/role-helper.js` | Role verification utilities |
| `assets/js/auth-context.js` | Role-based login routing |
| `portal/peer-dashboard.html` | Peer dashboard with availability manager |
| `portal/user-dashboard.html` | User dashboard with session viewer |
| `our-peers/profile.html` | Public peer profile with booking widget |
| `firestore.rules` | Security rules for all collections |

---

## Authentication Flow

1. **Login Page** (`portal/login.html`)
   - User selects role pill (User / Peer / Pro)
   - Logs in with email/password/social
   - `auth-context.js` verifies role from Firestore `roles` collection
   - Redirects to appropriate dashboard

2. **Role Verification:**
   - **User** → Direct access to `user-dashboard.html`
   - **Peer** → Checks `roles/{uid}.peer === true` → `peer-dashboard.html`
   - **Psychologist** → Checks `roles/{uid}.psychologist === true` → `psych-dashboard.html`
   - If not verified → Redirects to user dashboard with alert

---

## Payment Integration

- **Gateway:** Razorpay
- **Flow:**
  1. Create booking with `pending_payment` status
  2. Open Razorpay checkout
  3. On success → Update booking to `confirmed`
  4. Create payment record
  5. Trigger email confirmation

**File:** `assets/js/payment-handler.js`

---

## Email Notifications

After successful booking:
- Booking confirmation email sent to user
- Includes meeting link and calendar link
- Triggered via `window.SoulBackend.triggerEmail()`

---

## Firestore Security Rules

Key rules from `firestore.rules`:

```javascript
// Peer Bookings
match /peer_bookings/{bookingId} {
  allow read: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     resource.data.peerId == request.auth.uid);
  allow create: if request.auth != null && 
    request.resource.data.userId == request.auth.uid;
  allow update: if request.auth != null && 
    (resource.data.userId == request.auth.uid && resource.data.status == 'pending_payment') ||
    (resource.data.peerId == request.auth.uid && resource.data.status in ['pending_payment', 'confirmed']);
}

// Peer Availability
match /peer_availability/{peerId} {
  allow read: if true; // Public read for checking availability
  allow create, update: if request.auth != null && request.auth.uid == peerId;
}
```

---

## Testing the System

### As a Peer:
1. Login as peer (ensure `roles/{uid}.peer = true`)
2. Go to **Availability** tab
3. Add slots for today/tomorrow
4. Save schedule

### As a User:
1. Login as regular user
2. Visit `/our-peers/profile.html?id=1` (demo peer)
3. Scroll to booking widget
4. Select date/time
5. Complete payment (test mode)
6. Check "My Sessions" in dashboard

### Verify:
1. Return to peer dashboard
2. Check "Sessions" tab
3. New booking should appear

---

## Customization Options

### 1. **Pricing Plans**
Edit `assets/js/peer-booking-handler.js`:
```javascript
export const DEFAULT_PLANS = {
  [PEER_PLAN_TYPES.PER_SESSION]: { price: 500, sessions: 1 },
  [PEER_PLAN_TYPES.MONTHLY]: { price: 1500, sessions: 4 },
  // ...
};
```

### 2. **Session Duration**
Currently 1 hour slots. Modify `getAvailableSlots()` function.

### 3. **Timezone**
Currently hardcoded to `Asia/Kolkata`. Can be made user-specific.

### 4. **Booking Buffer**
Add gap between sessions by modifying slot generation logic.

---

## Missing / Future Enhancements

1. **Psychologist-specific pricing** (currently uses same plans)
2. **Video conferencing integration** (currently placeholder links)
3. **Calendar sync** (UI exists, needs API integration)
4. **Automated reminders** (email/SMS before sessions)
5. **Session notes** (for peers to document sessions)
6. **Recurring bookings** (for monthly/quarterly plans)

---

## Support

For issues or questions:
- Check console logs for error messages
- Verify Firestore rules in Firebase Console
- Ensure Razorpay test keys are configured
- Check `window.SoulBackend` for email functionality
