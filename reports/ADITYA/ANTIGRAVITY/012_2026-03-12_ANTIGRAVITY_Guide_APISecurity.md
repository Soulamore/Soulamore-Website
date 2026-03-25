# Security Guide: Managing API Keys

## The Core Problem
You need API keys for your app to work, but if you commit them to GitHub, they are "leaked" to the world. Bots scan public repositories instantly to steal these keys.

## 1. Firebase Keys (Public)
> **Verdict: Safe to be public (with rules).**

Your `firebase-config.js` keys (`apiKey`, `authDomain`, etc.) are designed to be public. They are like the address of your building.
*   **How it's secured**: You lock the doors, not hide the address.
    *   **Firestore Rules**: `request.auth != null` ensures only logged-in users can read/write data.
    *   **Authorized Domains**: In Firebase Console, you restrict which domains (e.g., `soulamore.com`, `localhost`) can use these keys for specific services like Auth.

**Action**: No change needed for `firebase-config.js`, but ensure your Firestore Rules remain strict.

## 2. Gemini API Keys (Private)
> **Verdict: DANGEROUS to be public.**

Your Gemini API key is like your credit card. Anyone with it can use your quota and incur costs.
*   **The Leak**: `soulbot.html` had a placeholder `YOUR_GEMINI_API_KEY_HERE`. If you replace this with a real key and push to GitHub, it is leaked.

### Solutions
#### Option A: HTTP Referrer Restrictions (Easiest, "Good Enough")
1.  Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
2.  Edit your Gemini API Key.
3.  Under **Application restrictions**, select **Websites**.
4.  Add your domains:
    *   `https://soulamore.com/*`
    *   `https://soulamore.web.app/*`
    *   `http://localhost:*` (for development)
5.  **Result**: Even if the key is leaked in `soulbot.html`, it *cannot* be used from anywhere except your website.

#### Option B: Backend Proxy (Best Practice)
1.  Do not put the key in frontend code at all.
2.  Create a Firebase Cloud Function (backend) that holds the key.
3.  Frontend calls `getSoulBotResponse()` -> Cloud Function (uses key) -> Gemini.
4.  **Result**: Key is never exposed to the user's browser.

## Summary Checklist
- [ ] **Restrict Gemini Key**: Apply HTTP Referrer restrictions in Google Cloud Console immediately.
- [ ] **Audit Rules**: Regularly check `firestore.rules`.
- [ ] **Env Vars**: For local dev, use `.env` files and add them to `.gitignore`.
