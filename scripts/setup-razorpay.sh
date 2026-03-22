#!/bin/bash
# Script to set up Razorpay credentials in Firebase Functions
# Run this after initializing Firebase Functions

set -e

echo "🔐 Setting up Razorpay credentials in Firebase Functions..."
echo ""

# Set Razorpay Key ID
echo "Setting Razorpay Key ID..."
firebase functions:config:set razorpay.key_id="rzp_test_S4uV6QL9r7JLPL"

# Set Razorpay Key Secret
echo "Setting Razorpay Key Secret..."
firebase functions:config:set razorpay.key_secret="zohp5TN7Je6YtYkqBEpiSczN"

echo ""
echo "✅ Razorpay credentials configured!"
echo ""
echo "Next steps:"
echo "1. Install dependencies: cd functions && npm install"
echo "2. Deploy functions: firebase deploy --only functions"
echo "3. Copy the Function URL and update assets/js/payment-handler.js"
echo ""



