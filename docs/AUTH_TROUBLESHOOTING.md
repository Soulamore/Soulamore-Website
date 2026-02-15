# Authentication Troubleshooting Guide

## Quick Checklist

### 1. Verify Firebase Console Configuration
**CRITICAL:** All authentication methods must be enabled in Firebase Console first!

1. Go to: https://console.firebase.google.com/project/soulamore-f0a64/authentication/providers
2. Enable each provider:
   - ✅ **Google** - Toggle ON, enter support email, Save
   - ✅ **Facebook** - Toggle ON, enter App ID & Secret, Save
   - ✅ **Phone** - Toggle ON, Save

### 2. Check Browser Console
Open browser DevTools (F12) and check Console tab for errors:

**Common Errors:**
- `auth/operation-not-allowed` → Provider not enabled in Firebase Console
- `auth/unauthorized-domain` → Domain not in authorized list
- `auth/popup-blocked` → Browser blocked popup
- `CORS error` → Accessing via `file://` instead of HTTPS

### 3. Verify You're on HTTPS
Authentication **requires HTTPS**:
- ✅ `https://soulamore.com/portal/login.html` - Works
- ❌ `file:///path/to/login.html` - Won't work
- ❌ `http://localhost/login.html` - May not work (use HTTPS)

### 4. Test Each Method

#### Google Login
1. Click Google button
2. Should open Google account picker
3. Select account
4. Should redirect to dashboard

**If it fails:**
- Check Console for error code
- Verify Google provider is enabled in Firebase Console
- Check if popup was blocked

#### Facebook Login
1. Click Facebook button
2. Should open Facebook authorization popup
3. Authorize app
4. Should redirect to dashboard

**If it fails:**
- Check Console for error code
- Verify Facebook provider is enabled
- Verify App ID & Secret are correct in Firebase Console
- Check Facebook Developer Console for redirect URI: `https://soulamore-f0a64.firebaseapp.com/__/auth/handler`

#### Phone Login
1. Click Phone button
2. Enter phone with country code (e.g., `+919501808162`)
3. Click "Send OTP"
4. Enter 6-digit code from SMS
5. Click "Verify & Login"
6. Should redirect to dashboard

**If it fails:**
- Check Console for error code
- Verify Phone provider is enabled
- Ensure you're on HTTPS (not file://)
- Check if reCAPTCHA loaded (should be invisible)
- Verify phone number format includes country code

## Common Issues & Solutions

### Issue: "System loading... or blocked by browser security"
**Cause:** Module scripts not loading, possibly due to CORS or file:// protocol

**Solution:**
1. Ensure you're accessing via HTTPS: `https://soulamore.com/portal/login.html`
2. Check browser console for CORS errors
3. Clear browser cache and reload
4. Try incognito/private window

### Issue: "operation-not-allowed"
**Cause:** Authentication provider not enabled in Firebase Console

**Solution:**
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable the provider (Google/Facebook/Phone)
3. Save changes
4. Wait 1-2 minutes for changes to propagate
5. Try again

### Issue: "unauthorized-domain"
**Cause:** Domain not in Firebase authorized domains list

**Solution:**
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your domain: `soulamore.com` and `www.soulamore.com`
3. Save changes
4. Try again

### Issue: "popup-blocked"
**Cause:** Browser blocked the authentication popup

**Solution:**
1. Allow popups for `soulamore.com` in browser settings
2. Check browser's popup blocker icon in address bar
3. Try again

### Issue: Phone OTP not received
**Cause:** Multiple possible issues

**Solution:**
1. Verify phone number format: `+[country code][number]` (e.g., `+919501808162`)
2. Check Firebase Console → Authentication → Users for test numbers
3. Verify Phone provider is enabled
4. Check if you're on Blaze plan (required for phone auth)
5. Check SMS delivery in Firebase Console → Authentication → Users

### Issue: Functions not defined / ReferenceError
**Cause:** Module scripts not loading or timing issue

**Solution:**
1. Check browser console for import errors
2. Verify all files are accessible (no 404 errors)
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. Check Network tab for failed script loads

## Testing Checklist

- [ ] All providers enabled in Firebase Console
- [ ] Authorized domains include `soulamore.com` and `www.soulamore.com`
- [ ] Accessing via HTTPS (not file://)
- [ ] Browser console shows no errors
- [ ] Popups are allowed
- [ ] Google login works
- [ ] Facebook login works (if configured)
- [ ] Phone login works (if configured)

## Still Not Working?

1. **Check Firebase Console Logs:**
   - Go to Firebase Console → Authentication → Users
   - Check for any error messages

2. **Check Browser Network Tab:**
   - Open DevTools → Network tab
   - Try authentication
   - Look for failed requests (red)
   - Check response for error messages

3. **Verify CSP Settings:**
   - Check browser console for CSP violations
   - Ensure all required domains are in CSP

4. **Test in Incognito:**
   - Extensions or cached data might interfere
   - Try in incognito/private window

5. **Check Firebase Project:**
   - Verify you're using correct project: `soulamore-f0a64`
   - Check API keys are correct in `firebase-config.js`

## Need Help?

If issues persist:
1. Check browser console for specific error codes
2. Check Firebase Console → Authentication → Users for errors
3. Verify all setup steps in `FIREBASE_AUTH_SETUP.md` are completed


