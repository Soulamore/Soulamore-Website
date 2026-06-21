# Firebase Authentication Setup Guide

This guide explains how to enable and configure Google, Facebook, and Phone (SMS) authentication in Firebase Console.

## Prerequisites

- Access to Firebase Console: https://console.firebase.google.com
- Your project: `soulamore-f0a64`
- Admin access to configure authentication providers

## Step 1: Enable Authentication Providers

1. Go to **Firebase Console** → **Authentication** → **Sign-in method**
2. Enable the following providers:

### Google Authentication

1. Click on **Google** provider
2. Toggle **Enable** to ON
3. Enter your **Project support email** (e.g., `support@soulamore.com`)
4. Click **Save**

**Note:** Google authentication works automatically - no additional API keys needed.

### Facebook Authentication

1. Click on **Facebook** provider
2. Toggle **Enable** to ON
3. You'll need:
   - **App ID**: From Facebook Developer Console
   - **App Secret**: From Facebook Developer Console
4. Click **Save**

#### Getting Facebook App ID and Secret

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing app
3. Go to **Settings** → **Basic**
4. Copy **App ID** and **App Secret**
5. Add **Valid OAuth Redirect URIs**:
   - `https://soulamore-f0a64.firebaseapp.com/__/auth/handler`
   - `https://soulamore.com/__/auth/handler`
   - `https://www.soulamore.com/__/auth/handler`

### Phone Authentication (SMS)

1. Click on **Phone** provider
2. Toggle **Enable** to ON
3. **Test phone numbers** (optional): Add test numbers for development
   - Format: `+919501808162` (with country code)
4. Click **Save**

**Important:** Phone authentication requires:
- Firebase Blaze (pay-as-you-go) plan
- reCAPTCHA verification (automatically handled)
- Phone numbers must include country code (e.g., `+91` for India)

## Step 2: Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Ensure these domains are listed:
   - `soulamore.com`
   - `www.soulamore.com`
   - `soulamore-f0a64.firebaseapp.com`
   - `localhost` (for local development)

## Step 3: Verify CSP Settings

The Content Security Policy (CSP) has been updated to allow:
- Google authentication domains
- Facebook authentication domains
- reCAPTCHA domains for phone authentication

Files updated:
- `index.html`
- `portal/login.html`
- `firebase.json`

## Step 4: Test Authentication

### Test Google Login
1. Go to `/portal/login.html`
2. Click **Google** button
3. Select Google account
4. Should redirect to dashboard

### Test Facebook Login
1. Go to `/portal/login.html`
2. Click **Facebook** button
3. Authorize app
4. Should redirect to dashboard

### Test Phone Login
1. Go to `/portal/login.html`
2. Click **Phone** button
3. Enter phone number with country code (e.g., `+919501808162`)
4. Click **Send OTP**
5. Enter 6-digit OTP received via SMS
6. Click **Verify & Login**
7. Should redirect to dashboard

## Troubleshooting

### "Auth/operation-not-allowed"
- **Cause:** Provider not enabled in Firebase Console
- **Fix:** Enable the provider in Firebase Console → Authentication → Sign-in method

### "Auth/unauthorized-domain"
- **Cause:** Domain not authorized
- **Fix:** Add domain to Firebase Console → Authentication → Settings → Authorized domains

### "Auth/popup-blocked"
- **Cause:** Browser blocked popup
- **Fix:** Allow popups for `soulamore.com` in browser settings

### "Auth/network-request-failed"
- **Cause:** Network issue or CSP blocking
- **Fix:** Check browser console for CSP violations, verify CSP settings

### Phone Authentication Not Working
- **Cause 1:** Not on HTTPS (file:// protocol)
- **Fix:** Access via `https://soulamore.com` or local server

- **Cause 2:** reCAPTCHA not loading
- **Fix:** Check CSP allows `https://www.gstatic.com/recaptcha/` and `https://recaptcha.google.com`

- **Cause 3:** Phone provider not enabled
- **Fix:** Enable Phone provider in Firebase Console

### Facebook Login Not Working
- **Cause 1:** App ID/Secret incorrect
- **Fix:** Verify credentials in Firebase Console

- **Cause 2:** OAuth redirect URI not configured
- **Fix:** Add redirect URI in Facebook Developer Console

- **Cause 3:** CSP blocking Facebook domains
- **Fix:** Verify CSP includes `https://www.facebook.com` and `https://graph.facebook.com`

## Code Implementation

All authentication methods are implemented in:
- `assets/js/auth-service.js` - Core authentication functions
- `assets/js/firebase-config.js` - Firebase configuration
- `portal/login.html` - Login UI and handlers

## Security Notes

1. **Never commit API keys** - All sensitive data should be in environment variables
2. **Use HTTPS** - Authentication requires secure connection
3. **Enable App Check** (optional) - Protect your backend from abuse
4. **Monitor usage** - Check Firebase Console → Authentication → Users for suspicious activity

## Next Steps

After enabling providers:
1. Test each authentication method
2. Monitor Firebase Console for errors
3. Set up user profile creation (already implemented in `profile-handler.js`)
4. Configure email templates (optional) in Firebase Console → Authentication → Templates


