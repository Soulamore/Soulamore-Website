# Installation Guide - Required Tools

## Prerequisites

Before executing the 5 setup steps, you need to install:

1. **Node.js** (includes npm)
2. **Firebase CLI**

## Step 0: Install Required Tools

### Install Node.js

**On macOS (using Homebrew):**
```bash
brew install node
```

**Or download from:**
https://nodejs.org/ (Download LTS version)

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

**Verify installation:**
```bash
firebase --version  # Should show 13.x.x or higher
```

### Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

**Verify you're logged in:**
```bash
firebase projects:list
```

You should see `soulamore-f0a64` in the list.

---

## After Installation: Execute the 5 Steps

Once Node.js and Firebase CLI are installed, follow the steps in `docs/SETUP_STATUS.md` or run:

```bash
# Step 1: Install dependencies
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website/functions
npm install

# Step 2: Set Razorpay credentials
cd ..
./scripts/setup-razorpay.sh

# Step 3: Deploy functions
firebase deploy --only functions

# Step 4: Update Function URL in payment-handler.js (manual - copy URL from Step 3 output)

# Step 5: Test booking system
```

---

## Quick Install Script (macOS)

If you have Homebrew, you can run:

```bash
# Install Node.js
brew install node

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify
node --version
npm --version
firebase --version
```

---

## Troubleshooting

### "command not found: npm"
- Node.js is not installed
- Install from https://nodejs.org/

### "command not found: firebase"
- Firebase CLI is not installed
- Run: `npm install -g firebase-tools`

### "Permission denied" when installing globally
- Use `sudo`: `sudo npm install -g firebase-tools`
- Or configure npm to use a directory you own: `npm config set prefix ~/.npm-global`

### "firebase login" fails
- Check internet connection
- Try: `firebase login --no-localhost` (for headless environments)

---

## Alternative: Use nvm (Node Version Manager)

If you prefer managing Node.js versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

