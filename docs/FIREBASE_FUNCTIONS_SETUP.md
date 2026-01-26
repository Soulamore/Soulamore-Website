# Firebase Functions Setup for Secure Payment Verification

## Overview

Firebase Functions provide a secure server-side environment for handling sensitive operations like payment verification. This keeps your Razorpay Key Secret secure and never exposes it to client-side code.

## Setup Instructions

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Initialize Firebase Functions

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
firebase init functions
```

When prompted:
- Select **JavaScript** (or TypeScript if you prefer)
- Install dependencies? **Yes**

### 3. Install Dependencies

```bash
cd functions
npm install
```

### 4. Set Razorpay Credentials

#### Option A: Using Firebase Config (Recommended)

```bash
firebase functions:config:set razorpay.key_id="rzp_test_9GBPBhwCaNsZjv"
firebase functions:config:set razorpay.key_secret="YOUR_KEY_SECRET_HERE"
```

**Important**: Replace `YOUR_KEY_SECRET_HERE` with your actual Razorpay Key Secret from the dashboard.

#### Option B: Using Environment Variables (Alternative)

Create a `.env` file in the `functions` directory:

```bash
cd functions
echo "RAZORPAY_KEY_ID=rzp_test_9GBPBhwCaNsZjv" > .env
echo "RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE" >> .env
```

**Note**: `.env` files are already in `.gitignore` - they won't be committed.

### 5. Get Your Firebase Function URL

After deploying, you'll get a URL like:
```
https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment
```

### 6. Update Payment Handler

Update `assets/js/payment-handler.js` with your actual Firebase Function URL:

```javascript
const FIREBASE_FUNCTION_URL = 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/verifyPayment';
```

Replace:
- `YOUR_REGION` with your Firebase region (e.g., `us-central1`)
- `YOUR_PROJECT_ID` with your Firebase project ID (e.g., `soulamore-f0a64`)

### 7. Deploy Functions

```bash
cd functions
firebase deploy --only functions
```

## Security Benefits

✅ **Key Secret Never Exposed**: Stays in Firebase Functions (server-side only)
✅ **Payment Verification**: Server-side signature verification prevents fraud
✅ **Secure Environment**: Firebase Functions run in isolated, secure environment
✅ **No Client-Side Secrets**: All sensitive operations happen server-side

## Testing

### 1. Test Locally (Optional)

```bash
cd functions
npm run serve
```

This starts the Firebase emulator. You can test functions locally before deploying.

### 2. Test in Production

1. Make a test booking
2. Use Razorpay test card: `4111 1111 1111 1111`
3. Check Firebase Functions logs:
   ```bash
   firebase functions:log
   ```

## GitHub Secrets (For CI/CD)

If you want to use GitHub Actions to deploy functions:

1. Go to GitHub → Settings → Secrets and variables → Actions
2. Add secrets:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
   - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON (already set)

3. Update GitHub Actions workflow to set config:
   ```yaml
   - name: Set Firebase Functions Config
     run: |
       firebase functions:config:set razorpay.key_id="${{ secrets.RAZORPAY_KEY_ID }}"
       firebase functions:config:set razorpay.key_secret="${{ secrets.RAZORPAY_KEY_SECRET }}"
   ```

## Cost Considerations

Firebase Functions pricing:
- **Free Tier**: 2 million invocations/month, 400,000 GB-seconds/month
- **Paid**: $0.40 per million invocations after free tier

For booking system:
- Each booking = 1 function call (payment verification)
- 100 bookings/month = well within free tier
- **Estimated cost**: ₹0/month for moderate usage

## Troubleshooting

### Function not found
- Check function URL is correct
- Verify function is deployed: `firebase functions:list`
- Check function logs: `firebase functions:log`

### Payment verification fails
- Verify Key Secret is set correctly
- Check function logs for errors
- Verify payment signature in Razorpay dashboard

### CORS errors
- Functions already include CORS handling
- If issues persist, check function URL is accessible

## Next Steps

1. ✅ Set up Firebase Functions
2. ✅ Configure Razorpay credentials
3. ✅ Deploy functions
4. ✅ Update payment handler with function URL
5. ✅ Test payment flow end-to-end

## Alternative: Keep Current Setup (Test Mode Only)

If you want to test quickly without setting up Functions:

- **Current setup works for test mode** (Key ID only)
- **Not secure for production** (no signature verification)
- **Recommendation**: Set up Functions before going live

For production, Firebase Functions is **required** for security.


