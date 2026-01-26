# Firebase Functions for Soulamore

Secure server-side functions for payment verification and other sensitive operations.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set Razorpay credentials:
   ```bash
   firebase functions:config:set razorpay.key_id="YOUR_KEY_ID"
   firebase functions:config:set razorpay.key_secret="YOUR_KEY_SECRET"
   ```

3. Deploy:
   ```bash
   firebase deploy --only functions
   ```

## Functions

### `verifyPayment`
Verifies Razorpay payment signature and confirms booking.

**Endpoint**: `POST /verifyPayment`

**Request Body**:
```json
{
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature_xxx",
  "bookingId": "booking_xxx"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment verified and booking confirmed",
  "bookingId": "booking_xxx",
  "paymentId": "pay_xxx"
}
```

### `createRazorpayOrder` (Optional)
Creates a Razorpay order server-side.

**Endpoint**: `POST /createRazorpayOrder`

**Request Body**:
```json
{
  "amount": 1500,
  "currency": "INR",
  "receipt": "receipt_xxx",
  "notes": {}
}
```

## Security

- Key Secret is stored in Firebase Functions config (never in code)
- Payment signature verification prevents fraud
- All sensitive operations happen server-side

## See Also

- [Firebase Functions Setup Guide](../docs/FIREBASE_FUNCTIONS_SETUP.md)
- [Payment Gateway Setup](../docs/PAYMENT_GATEWAY_SETUP.md)


