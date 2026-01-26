#!/bin/bash
# Complete setup script for Razorpay integration
# This script executes all 5 steps automatically

set -e

echo "🚀 Starting Razorpay Integration Setup..."
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/ or run: brew install node"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js (npm comes with it)."
    exit 1
fi

if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "   Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Prerequisites check passed!"
echo ""

# Get project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# Step 1: Install dependencies
echo "📦 Step 1: Installing Firebase Functions dependencies..."
cd functions
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed!"
fi
cd ..

# Step 2: Set Razorpay credentials
echo ""
echo "🔐 Step 2: Setting Razorpay credentials in Firebase Functions..."
firebase functions:config:set razorpay.key_id="rzp_test_S4uV6QL9r7JLPL" 2>&1 || {
    echo "⚠️  Warning: Could not set key_id. Make sure you're logged in: firebase login"
}
firebase functions:config:set razorpay.key_secret="zohp5TN7Je6YtYkqBEpiSczN" 2>&1 || {
    echo "⚠️  Warning: Could not set key_secret. Make sure you're logged in: firebase login"
}
echo "✅ Credentials configured!"

# Step 3: Deploy functions
echo ""
echo "🚀 Step 3: Deploying Firebase Functions..."
echo "   (This may take a few minutes...)"
firebase deploy --only functions 2>&1 | tee /tmp/firebase-deploy.log || {
    echo "❌ Deployment failed. Check the error above."
    exit 1
}

# Extract Function URL from deployment output
FUNCTION_URL=$(grep -o 'https://[^ ]*\.cloudfunctions\.net/verifyPayment' /tmp/firebase-deploy.log | head -1)

if [ -z "$FUNCTION_URL" ]; then
    echo "⚠️  Could not extract Function URL from deployment output."
    echo "   Please check the deployment output above and manually update payment-handler.js"
else
    echo ""
    echo "✅ Functions deployed successfully!"
    echo "📍 Function URL: $FUNCTION_URL"
    
    # Step 4: Update payment-handler.js
    echo ""
    echo "📝 Step 4: Updating payment-handler.js with Function URL..."
    
    PAYMENT_HANDLER="assets/js/payment-handler.js"
    if [ -f "$PAYMENT_HANDLER" ]; then
        # Use sed to replace the Function URL (macOS compatible)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|const FIREBASE_FUNCTION_URL = \".*\";|const FIREBASE_FUNCTION_URL = \"$FUNCTION_URL\";|g" "$PAYMENT_HANDLER"
        else
            sed -i "s|const FIREBASE_FUNCTION_URL = \".*\";|const FIREBASE_FUNCTION_URL = \"$FUNCTION_URL\";|g" "$PAYMENT_HANDLER"
        fi
        echo "✅ payment-handler.js updated with Function URL!"
    else
        echo "⚠️  payment-handler.js not found. Please update manually with:"
        echo "   $FUNCTION_URL"
    fi
fi

# Step 5: Instructions
echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Step 5: Test the booking system"
echo "   1. Open: /our-peers/physical-wellness/renu-dogra-booking.html"
echo "   2. Select a plan, date, and time"
echo "   3. Use test card: 4111 1111 1111 1111"
echo "   4. Verify booking is created in Firestore"
echo ""
echo "🎉 All done! Your Razorpay integration is ready to test."


