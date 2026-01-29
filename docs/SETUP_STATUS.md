# Setup Status - Razorpay Integration

## ✅ What's Been Done

### 1. Code Updates
- ✅ **Key ID updated** in `assets/js/payment-handler.js`: `rzp_test_S4uV6QL9r7JLPL`
- ✅ **Payment handler** configured to use Firebase Functions
- ✅ **Firebase Functions** code created (`functions/index.js`)
- ✅ **Setup script** created (`scripts/setup-razorpay.sh`)

### 2. Files Ready
- ✅ `assets/js/payment-handler.js` - Updated with your Key ID
- ✅ `functions/index.js` - Payment verification function
- ✅ `functions/package.json` - Dependencies defined
- ✅ `docs/QUICK_SETUP_GUIDE.md` - Step-by-step guide

## 🔧 What You Need to Do (5 Steps)

### Step 1: Install Firebase Functions Dependencies

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website/functions
npm install
```

This installs:
- `firebase-functions`
- `firebase-admin`
- `razorpay`
- `cors`

### Step 2: Set Razorpay Credentials in Firebase

**Option A: Use the setup script (Easiest)**
```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
./scripts/setup-razorpay.sh
```

**Option B: Manual setup**
```bash
firebase functions:config:set razorpay.key_id="rzp_test_S4uV6QL9r7JLPL"
firebase functions:config:set razorpay.key_secret="zohp5TN7Je6YtYkqBEpiSczN"
```

**Important**: This stores your Key Secret securely in Firebase (server-side only, never exposed).

### Step 3: Deploy Firebase Functions

```bash
firebase deploy --only functions
```

**After deployment, you'll see:**
```
✔  functions[verifyPayment(us-central1)]: Successful create operation.
Function URL: https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment
```

**📋 Copy this URL!** You'll need it in the next step.

### Step 4: Update Payment Handler with Function URL

Open `assets/js/payment-handler.js` and find this line (around line 13):

```javascript
const FIREBASE_FUNCTION_URL = "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/verifyPayment";
```

Replace it with your actual function URL from Step 3. For example:

```javascript
const FIREBASE_FUNCTION_URL = "https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment";
```

### Step 5: Test the Booking System

1. Open your booking page: `/our-peers/physical-wellness/renu-dogra-booking.html`
2. Select a pricing plan
3. Choose a date from the calendar
4. Select an available time slot
5. Click "Proceed to Payment"
6. Use Razorpay test card:
   - **Card Number**: `4111 1111 1111 1111`
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Expiry**: Any future date (e.g., `12/25`)
   - **Name**: Any name
7. Complete payment
8. Verify booking is created in Firestore

## 🔍 Verification Checklist

After completing all steps, verify:

- [ ] Functions dependencies installed (`cd functions && npm list`)
- [ ] Razorpay credentials set (`firebase functions:config:get`)
- [ ] Functions deployed (`firebase functions:list`)
- [ ] Function URL updated in `payment-handler.js`
- [ ] Test booking completed successfully
- [ ] Booking appears in Firestore `peer_bookings` collection

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js: https://nodejs.org/
- Verify: `node --version` and `npm --version`

### "firebase: command not found"
- Install Firebase CLI: `npm install -g firebase-tools`
- Verify: `firebase --version`

### "Function not found" error
- Check function URL is correct in `payment-handler.js`
- Verify function is deployed: `firebase functions:list`
- Check function logs: `firebase functions:log`

### Payment verification fails
- Verify credentials are set: `firebase functions:config:get`
- Check function logs: `firebase functions:log`
- Ensure you're using test mode keys

### CORS errors
- Functions already include CORS handling
- If issues persist, check function URL is accessible

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Key ID | ✅ Updated | `rzp_test_S4uV6QL9r7JLPL` |
| Key Secret | ⏳ Pending | Needs to be set in Firebase Functions config |
| Functions Code | ✅ Ready | `functions/index.js` |
| Dependencies | ⏳ Pending | Run `npm install` in functions directory |
| Functions Deployed | ⏳ Pending | Run `firebase deploy --only functions` |
| Function URL | ⏳ Pending | Update after deployment |

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
cd functions && npm install

# 2. Set credentials (using script)
cd .. && ./scripts/setup-razorpay.sh

# 3. Deploy functions
firebase deploy --only functions

# 4. Copy Function URL from output and update payment-handler.js
# 5. Test booking system
```

## 📚 Additional Resources

- **Quick Setup Guide**: `docs/QUICK_SETUP_GUIDE.md`
- **Firebase Functions Setup**: `docs/FIREBASE_FUNCTIONS_SETUP.md`
- **Secret Management**: `docs/SECRET_MANAGEMENT.md`
- **Payment Gateway Setup**: `docs/PAYMENT_GATEWAY_SETUP.md`

## 💡 Pro Tips

1. **Test Mode**: You're currently in test mode - perfect for testing!
2. **Function Logs**: Use `firebase functions:log` to debug issues
3. **Firestore Rules**: Make sure rules are deployed: `firebase deploy --only firestore:rules`
4. **Going Live**: When ready, switch to live mode keys in Razorpay dashboard

## ✅ Next Steps

1. Run the 5 steps above
2. Test a booking
3. Verify everything works
4. Let me know if you encounter any issues!

---

**Estimated Time**: 10-15 minutes
**Difficulty**: Easy (just follow the steps)



