# Execute Setup - Quick Guide

## ⚠️ Prerequisites Required

Before executing the 5 steps, you need:

1. **Node.js** (includes npm) - [Download](https://nodejs.org/)
2. **Firebase CLI** - Install with: `npm install -g firebase-tools`

See `docs/INSTALLATION_GUIDE.md` for detailed installation instructions.

---

## 🚀 Option 1: Automated Setup (Recommended)

Once Node.js and Firebase CLI are installed, run:

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
./scripts/complete-setup.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Set Razorpay credentials
- ✅ Deploy Firebase Functions
- ✅ Update payment-handler.js with Function URL
- ✅ Provide testing instructions

**Time**: ~5-10 minutes (mostly deployment time)

---

## 🔧 Option 2: Manual Setup (Step by Step)

### Step 1: Install Dependencies

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website/functions
npm install
```

### Step 2: Set Razorpay Credentials

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
firebase functions:config:set razorpay.key_id="rzp_test_S4uV6QL9r7JLPL"
firebase functions:config:set razorpay.key_secret="zohp5TN7Je6YtYkqBEpiSczN"
```

### Step 3: Deploy Firebase Functions

```bash
firebase deploy --only functions
```

**Copy the Function URL from the output** (looks like):
```
https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment
```

### Step 4: Update Function URL

Open `assets/js/payment-handler.js` and replace line 16:

```javascript
const FIREBASE_FUNCTION_URL = "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/verifyPayment";
```

With your actual URL from Step 3.

### Step 5: Test

1. Open: `/our-peers/physical-wellness/renu-dogra-booking.html`
2. Complete a test booking
3. Use test card: `4111 1111 1111 1111`

---

## 📋 Checklist

Before starting:
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Firebase CLI installed (`firebase --version`)
- [ ] Logged into Firebase (`firebase login`)

After setup:
- [ ] Dependencies installed
- [ ] Credentials set in Firebase
- [ ] Functions deployed
- [ ] Function URL updated in code
- [ ] Test booking completed

---

## 🐛 Troubleshooting

### "command not found: npm"
- Install Node.js from https://nodejs.org/

### "command not found: firebase"
- Run: `npm install -g firebase-tools`

### "You are not logged in"
- Run: `firebase login`

### "Permission denied"
- Use `sudo` or configure npm prefix (see Installation Guide)

---

## ⏱️ Estimated Time

- **Installation**: 5-10 minutes (one-time)
- **Setup**: 5-10 minutes (automated script)
- **Total**: ~15-20 minutes

---

## ✅ Success Indicators

After successful setup:
- ✅ Functions deployed without errors
- ✅ Function URL visible in deployment output
- ✅ payment-handler.js updated with Function URL
- ✅ Test booking completes successfully
- ✅ Booking appears in Firestore

---

## 📞 Need Help?

- Check logs: `firebase functions:log`
- Verify config: `firebase functions:config:get`
- See detailed guides:
  - `docs/INSTALLATION_GUIDE.md` - Tool installation
  - `docs/SETUP_STATUS.md` - Detailed setup status
  - `docs/FIREBASE_FUNCTIONS_SETUP.md` - Functions setup



