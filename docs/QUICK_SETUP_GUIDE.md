# Quick Setup Guide - Razorpay Integration

## ✅ What's Already Done

1. ✅ Key ID updated in `assets/js/payment-handler.js`
2. ✅ Firebase Functions code created
3. ✅ Payment handler configured

## 🔧 What You Need to Do

### Step 1: Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Functions

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
firebase init functions
```

**When prompted:**
- Use an existing project? **Yes**
- Select project: **soulamore-f0a64**
- Language: **JavaScript**
- ESLint? **No** (or Yes if you want)
- Install dependencies? **Yes**

### Step 4: Set Razorpay Credentials in Firebase Functions

```bash
firebase functions:config:set razorpay.key_id="rzp_test_S4uV6QL9r7JLPL"
firebase functions:config:set razorpay.key_secret="zohp5TN7Je6YtYkqBEpiSczN"
```

**Important**: This stores your Key Secret securely in Firebase (server-side only).

### Step 5: Install Function Dependencies

```bash
cd functions
npm install
```

### Step 6: Deploy Firebase Functions

```bash
firebase deploy --only functions
```

**After deployment, you'll see output like:**
```
✔  functions[verifyPayment(us-central1)]: Successful create operation.
Function URL: https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment
```

**Copy this URL!** You'll need it in the next step.

### Step 7: Update Payment Handler with Function URL

Open `assets/js/payment-handler.js` and replace:

```javascript
const FIREBASE_FUNCTION_URL = "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/verifyPayment";
```

With your actual function URL (from Step 6), for example:

```javascript
const FIREBASE_FUNCTION_URL = "https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment";
```

### Step 8: Test the Booking System

1. Open: `/our-peers/physical-wellness/renu-dogra-booking.html`
2. Select a plan
3. Choose date & time
4. Click "Proceed to Payment"
5. Use Razorpay test card: `4111 1111 1111 1111`
6. Any CVV, any future expiry date
7. Verify booking is created in Firestore

## 🔍 Troubleshooting

### "Function not found" error

- Check function URL is correct
- Verify function is deployed: `firebase functions:list`
- Check function logs: `firebase functions:log`

### Payment verification fails

- Verify Key Secret is set: `firebase functions:config:get`
- Check function logs for errors
- Ensure you're using test mode keys

### CORS errors

- Functions already include CORS handling
- If issues persist, check function is accessible

## 📋 Checklist

- [ ] Firebase CLI installed
- [ ] Firebase Functions initialized
- [ ] Razorpay credentials set in Functions config
- [ ] Functions deployed
- [ ] Function URL updated in payment-handler.js
- [ ] Test booking completed successfully

## 🚀 Going Live

When ready for production:

1. **Switch to Live Mode** in Razorpay Dashboard
2. **Get Live Mode Keys** from Razorpay
3. **Update Functions config**:
   ```bash
   firebase functions:config:set razorpay.key_id="rzp_live_YOUR_LIVE_KEY"
   firebase functions:config:set razorpay.key_secret="YOUR_LIVE_SECRET"
   ```
4. **Redeploy functions**:
   ```bash
   firebase deploy --only functions
   ```
5. **Update Key ID** in `payment-handler.js` with live key

## 💰 Cost

Firebase Functions:
- **Free Tier**: 2M invocations/month
- **Your usage**: ~100 bookings/month = well within free tier
- **Cost**: ₹0/month

## 📞 Need Help?

- Check function logs: `firebase functions:log`
- Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
- See detailed docs: `docs/FIREBASE_FUNCTIONS_SETUP.md`


