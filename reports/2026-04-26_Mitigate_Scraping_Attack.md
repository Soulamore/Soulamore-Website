# Incident Report: Firebase Path-Explosion Scraping Attack

**Date:** 2026-04-26
**Attacker:** `meta-externalagent 1.1`
**Target Domains:** `soulamore-f0a64.web.app`, `soulamore-f0a64.firebaseapp.com`

## Incident Summary
The attacker generated millions of random, non-existent, nested paths (e.g., `/spaces/portal/tools/...`) against the default Firebase hosting domains. Due to a wildcard SPA fallback rewrite (`"source": "**", "destination": "/index.html"`) in `firebase.json`, Firebase responded to every fake path with a `200 OK` status and served the 120 KB `index.html` file. This bypassed Cloudflare (which only protects the custom domain `soulamore.com`) and ignored `robots.txt` because the bot acts as a brute-force scraper rather than a polite crawler. The result was massive bandwidth consumption.

## Mitigations Implemented

### 1. Stopped SPA Rewrite Abuse (Committed)
**Action Taken:** Removed the `"rewrites"` block from `firebase.json`.
**Why:** Randomly generated URLs will now return a `404 Not Found` rather than continuously serving `index.html`. This immediately drops the bandwidth consumed by the attack because the attacker can no longer download 120 KB payloads on every fake URL. The site will correctly serve your `404.html` fallback.

### 2. Why Some Suggested Steps Were Excluded (Important)

**Skipped: `X-Robots-Tag: noindex, nofollow` in `firebase.json`**
Adding an `X-Robots-Tag` header for `"source": "**"` in `firebase.json` applies globally to all traffic hitting Firebase Hosting, **including your main production site `soulamore.com`**. Implementing this would have forced Google and other legitimate search engines to instantly de-index your entire website, devastating your SEO.

**Skipped: 301 Redirect for `**` in `firebase.json`**
Adding a wildcard redirect to `https://www.soulamore.com` inside `firebase.json` does not filter by requested hostname. If deployed, a request to `https://www.soulamore.com` would match the wildcard and redirect back to itself indefinitely, resulting in an **infinite redirect loop** that would break your production site.

## Recommended Manual Actions (Required)

To fully block the remaining attack surface, please perform these manual steps:

### Step A: Disable Default Domains in Firebase Console
The most secure way to block traffic hitting the `.web.app` and `.firebaseapp.com` endpoints is to disable them directly in the Firebase Console:
1. Go to **Firebase Console** > **Hosting**.
2. Scroll to the **Domains** section.
3. Locate `soulamore-f0a64.web.app` and `soulamore-f0a64.firebaseapp.com`.
4. Click the three dots (options menu) next to them and select **Delete** or **Disable**.

### Step B: Add Cloudflare WAF Rule
Block the attacker completely on your main domain using Cloudflare:
1. Go to **Cloudflare Dashboard** > **Security** > **WAF**.
2. Create a new firewall rule:
   - **Field:** `User Agent`
   - **Operator:** `contains`
   - **Value:** `meta-externalagent`
3. **Action:** `Block`
4. Deploy the rule.

## Next Steps
The code changes to `firebase.json` and this report have been committed and pushed to the Git repository. Please merge them into `main` and deploy to Firebase immediately to stop the bandwidth drain.
