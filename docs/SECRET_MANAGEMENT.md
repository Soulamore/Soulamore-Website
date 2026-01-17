# Secret Management Guide

## The Problem

You asked: **"Should I store Razorpay Key Secret in GitHub Secrets?"**

**Short Answer**: Yes, but **NOT for injecting into client-side code**. Use it for Firebase Functions deployment.

## Two Approaches

### ❌ Approach 1: Client-Side Only (Current - Test Mode Only)

**What**: Store Key ID in client-side code, handle payment client-side

**Pros**:
- Quick to set up
- Works for testing

**Cons**:
- ❌ Key Secret exposed if used client-side
- ❌ No server-side payment verification
- ❌ Vulnerable to payment fraud
- ❌ **NOT SECURE FOR PRODUCTION**

**When to use**: Test mode only

---

### ✅ Approach 2: Firebase Functions (Recommended for Production)

**What**: Use Firebase Functions for secure server-side payment verification

**Pros**:
- ✅ Key Secret stays server-side (never exposed)
- ✅ Secure payment signature verification
- ✅ Prevents payment fraud
- ✅ Production-ready
- ✅ Free tier covers moderate usage

**Cons**:
- Requires Firebase Functions setup (one-time, ~30 minutes)

**When to use**: Production (required for security)

---

## Recommended Setup

### For Development/Testing (Now)

1. **Use current setup** (Key ID in client-side code)
2. **Test with Razorpay test cards**
3. **No Key Secret needed** for basic testing

### For Production (Before Launch)

1. **Set up Firebase Functions** (see `docs/FIREBASE_FUNCTIONS_SETUP.md`)
2. **Store Key Secret in Firebase Functions config**:
   ```bash
   firebase functions:config:set razorpay.key_secret="YOUR_KEY_SECRET"
   ```
3. **Use GitHub Secrets for CI/CD** (optional):
   - Store Key Secret in GitHub Secrets
   - Use in GitHub Actions to set Firebase Functions config
   - **Never inject into client-side code**

---

## GitHub Secrets Usage

### ✅ Correct Usage (For Firebase Functions)

```yaml
# .github/workflows/deploy.yml
- name: Set Firebase Functions Config
  run: |
    firebase functions:config:set razorpay.key_secret="${{ secrets.RAZORPAY_KEY_SECRET }}"
  env:
    RAZORPAY_KEY_SECRET: ${{ secrets.RAZORPAY_KEY_SECRET }}
```

**This is secure** because:
- Secret is used to configure Firebase Functions (server-side)
- Never appears in client-side code
- Never exposed in browser

### ❌ Wrong Usage (Injecting into Client-Side)

```yaml
# DON'T DO THIS
- name: Inject Secret into HTML
  run: |
    sed -i "s/YOUR_KEY_SECRET/${{ secrets.RAZORPAY_KEY_SECRET }}/g" assets/js/payment-handler.js
```

**This is NOT secure** because:
- Secret ends up in client-side JavaScript
- Anyone can view it in browser DevTools
- Exposed in source code

---

## Security Best Practices

1. **Key ID (Public)**: ✅ Can be in client-side code
2. **Key Secret (Private)**: ❌ Never in client-side code
3. **Payment Verification**: ✅ Always server-side
4. **GitHub Secrets**: ✅ Use for CI/CD, not client injection

---

## Quick Decision Guide

**Are you testing?**
- ✅ Use current setup (Key ID only)
- ✅ No Key Secret needed yet

**Are you going live?**
- ✅ Set up Firebase Functions
- ✅ Store Key Secret in Functions config
- ✅ Use Functions for payment verification

---

## Files Created

1. **`functions/index.js`** - Firebase Functions for payment verification
2. **`functions/package.json`** - Dependencies
3. **`docs/FIREBASE_FUNCTIONS_SETUP.md`** - Setup instructions
4. **`docs/SECRET_MANAGEMENT.md`** - This file

---

## Next Steps

1. **For now**: Test with current setup (Key ID only)
2. **Before production**: 
   - Set up Firebase Functions
   - Store Key Secret securely
   - Update payment handler with Function URL

See `docs/FIREBASE_FUNCTIONS_SETUP.md` for detailed instructions.

