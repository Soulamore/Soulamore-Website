# Payment Gateway Setup Guide

## Payment Gateway Selection: Razorpay

We've chosen **Razorpay** as the payment gateway for Soulamore based on the following factors:

### Cost Comparison

#### Razorpay Pricing
- **Transaction Fee**: 2% + GST (for payments up to ₹1,00,000)
- **Transaction Fee**: 1.5% + GST (for payments above ₹1,00,000)
- **Setup Fee**: ₹0 (Free)
- **Annual Maintenance**: ₹0 (Free)
- **Settlement Time**: T+1 to T+3 (1-3 business days)
- **Payment Methods**: Cards, UPI, Netbanking, Wallets, BNPL

#### Easebuzz Pricing (Alternative)
- **Transaction Fee**: ~2% + GST (varies by plan)
- **Setup Fee**: ₹0 - ₹5000 (depends on plan)
- **Settlement Time**: T+1 to T+3
- **Payment Methods**: Similar to Razorpay

### Why Razorpay?

1. **Better Documentation**: Comprehensive API docs and SDKs
2. **More Popular**: Better community support and resources
3. **Reliable**: Established player with good uptime
4. **Cost-Effective**: Similar pricing, but better value for features
5. **Better Integration**: Easier to integrate with Firebase/Firestore
6. **Developer-Friendly**: Better error handling and debugging tools

### Cost Optimization Recommendations

For cost optimization while maintaining quality:

1. **Use Razorpay Standard Plan** (2% + GST)
   - No monthly fees
   - Suitable for volumes under ₹10L/month
   - Upgrade to RazorpayX only if you need advanced features

2. **Consider Subscription Models**
   - Monthly/Quarterly/Yearly plans reduce transaction costs
   - Bulk payments (yearly) = fewer transactions = lower overall fees

3. **Monitor Transaction Volume**
   - At ₹10L+ monthly volume, negotiate better rates
   - Consider RazorpayX or enterprise pricing

## Setup Instructions

### 1. Create Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for an account
3. Complete KYC verification
4. Activate your account

### 2. Get API Keys

1. Go to **Settings** → **API Keys**
2. Create a new API key (test or live)
3. Copy your **Key ID** (starts with `rzp_test_` or `rzp_live_`)
4. Copy your **Key Secret** (shown only once - save it securely!)

### 3. Configure in Code

#### For Development (Test Mode)

Update `assets/js/payment-handler.js`:

```javascript
const RAZORPAY_KEY_ID = "rzp_test_YOUR_TEST_KEY_ID";
```

#### For Production (Live Mode)

**IMPORTANT**: Never expose your Key Secret in client-side code!

For production, you should:

1. **Option A: Use Firebase Functions** (Recommended)
   - Create a Firebase Cloud Function to handle order creation and payment verification
   - Store Key Secret securely in Firebase Functions environment variables
   - Example: `functions/src/payments.js`

2. **Option B: Use Environment Variables** (If using backend)
   - Store Key Secret in environment variables
   - Never commit to git

3. **Current Implementation** (Development Only)
   - The current code uses client-side order creation for development
   - **This should be moved to backend for production**

### 4. Update Payment Handler

Replace `YOUR_RAZORPAY_KEY_ID` in `assets/js/payment-handler.js`:

```javascript
const RAZORPAY_KEY_ID = "rzp_test_YOUR_ACTUAL_KEY_ID"; // Replace with actual key
```

### 5. Configure Webhook (Optional but Recommended)

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Add webhook URL: `https://your-domain.com/api/razorpay-webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Use webhook to verify payments server-side (more secure)

### 6. Test Payments

1. Use Razorpay test cards:
   - Success: `4111 1111 1111 1111` (any CVV, any future date)
   - Failure: `4000 0000 0000 0002`
2. Test different payment methods (UPI, cards, netbanking)
3. Verify bookings are created in Firestore after successful payment

## Security Best Practices

1. **Never Expose Key Secret**: Keep it server-side only
2. **Verify Payment Signature**: Always verify payment signature on backend
3. **Use HTTPS**: Ensure all payment pages use HTTPS
4. **Store Payment IDs**: Save payment IDs in Firestore for reference
5. **Handle Failures**: Implement proper error handling for failed payments
6. **Log Transactions**: Log all payment attempts for audit

## Cost Estimates

### Monthly Transaction Costs (Example)

Assuming ₹50,000/month in bookings:

- **Per Session Plans** (₹500 each): 100 transactions = ₹50,000
  - Transaction fee: ₹50,000 × 2% = ₹1,000
  - GST (18%): ₹180
  - **Total: ₹1,180/month**

- **Monthly Plans** (₹1,500 each): 33 transactions = ₹49,500
  - Transaction fee: ₹49,500 × 2% = ₹990
  - GST (18%): ₹178.20
  - **Total: ₹1,168.20/month**

- **Yearly Plans** (₹15,000 each): 3 transactions = ₹45,000
  - Transaction fee: ₹45,000 × 2% = ₹900
  - GST (18%): ₹162
  - **Total: ₹1,062/month**

**Recommendation**: Encourage yearly plans to reduce transaction volume and costs.

## Calendar/Scheduling Solution: Custom Implementation

Instead of using paid services like Supersaas or Calendly, we've built a **custom calendar system** integrated with Firestore for the following reasons:

### Cost Comparison

#### Supersaas Pricing
- **Free Plan**: Limited features, 25 bookings/month
- **Basic Plan**: $9/month (~₹750/month) - Up to 100 bookings
- **Professional Plan**: $29/month (~₹2,400/month) - Unlimited bookings

#### Calendly Pricing
- **Free Plan**: Limited features
- **Essential Plan**: $10/month (~₹830/month) per user
- **Professional Plan**: $16/month (~₹1,330/month) per user

#### Cal.com (Open Source)
- **Self-Hosted**: Free (requires server costs)
- **Hosted**: $12/month (~₹1,000/month) per user

#### Our Custom Solution
- **Cost**: ₹0/month (no third-party fees)
- **Integration**: Seamless with Firestore
- **Customization**: Full control over features and UI
- **Data Ownership**: All data stored in your Firestore database

### Custom Implementation Benefits

1. **Zero Recurring Costs**: No monthly fees for scheduling
2. **Full Control**: Customize calendar, availability, and booking flow
3. **Firestore Integration**: Direct integration with your database
4. **Data Ownership**: All booking data in your Firestore
5. **Scalable**: No per-user or per-booking limits
6. **Brand Consistency**: Matches your website design

### Features Included

- ✅ Calendar view with month navigation
- ✅ Availability checking based on peer schedule
- ✅ Time slot selection
- ✅ Booking conflict detection
- ✅ Multiple pricing plans (per session, monthly, quarterly, yearly)
- ✅ Payment integration
- ✅ Booking management in Firestore

### Future Enhancements

If needed, you can add:
- Email notifications
- SMS reminders
- Calendar sync (Google Calendar, Outlook)
- Recurring bookings
- Waiting lists
- Cancellation/rescheduling

## Next Steps

1. ✅ Payment handler created (`assets/js/payment-handler.js`)
2. ✅ Booking handler created (`assets/js/peer-booking-handler.js`)
3. ✅ Booking UI created (`our-peers/physical-wellness/renu-dogra-booking.html`)
4. ✅ Firestore rules updated
5. ⏳ **TODO**: Get Razorpay API keys and configure
6. ⏳ **TODO**: Test payment flow end-to-end
7. ⏳ **TODO**: (Optional) Set up Firebase Functions for secure payment handling

## Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Razorpay Support**: support@razorpay.com
- **Integration Help**: Check `assets/js/payment-handler.js` for implementation details



