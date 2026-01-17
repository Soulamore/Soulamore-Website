# Setup Instructions - Execute These Steps

## ⚠️ Prerequisites Required

You need to install **Node.js** and **Firebase CLI** first. Here's how:

### Quick Install (macOS with Homebrew)

```bash
# Install Node.js (includes npm)
brew install node

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### Or Download Node.js

1. Visit: https://nodejs.org/
2. Download LTS version
3. Install the .pkg file
4. Then run: `npm install -g firebase-tools`
5. Then run: `firebase login`

---

## 🚀 After Installing Prerequisites: Run This

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
./scripts/complete-setup.sh
```

This will automatically execute all 5 steps:
1. ✅ Install dependencies
2. ✅ Set Razorpay credentials  
3. ✅ Deploy Firebase Functions
4. ✅ Update Function URL in code
5. ✅ Provide testing instructions

---

## 📋 Manual Steps (If Script Doesn't Work)

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

### Step 3: Deploy Functions
```bash
firebase deploy --only functions
```

**Copy the Function URL from output** (looks like):
```
https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment
```

### Step 4: Update Function URL

Open `assets/js/payment-handler.js` and replace line 16 with your Function URL from Step 3.

### Step 5: Test

1. Open: `/our-peers/physical-wellness/renu-dogra-booking.html`
2. Complete a test booking
3. Use test card: `4111 1111 1111 1111`

---

## ✅ Verification

After setup, verify:
- [ ] `node --version` shows v18.x or higher
- [ ] `npm --version` shows 9.x or higher  
- [ ] `firebase --version` shows 13.x or higher
- [ ] `firebase login` successful
- [ ] Functions deployed successfully
- [ ] Function URL updated in payment-handler.js

---

## 🆘 Need Help?

- **Installation issues**: See `docs/INSTALLATION_GUIDE.md`
- **Setup issues**: See `docs/EXECUTE_SETUP.md`
- **Detailed status**: See `docs/SETUP_STATUS.md`

