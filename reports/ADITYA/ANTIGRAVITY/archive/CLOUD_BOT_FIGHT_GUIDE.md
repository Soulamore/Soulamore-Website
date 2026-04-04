# Cloudflare Bot Fight Mode Setup Guide

To resolve the 404 error and successfully enable Bot Fight Mode for **Soulamore**, please follow these manual steps in your Cloudflare Dashboard.

## 1. Navigating to Bot Security
If the direct link is giving a 404, the dashboard layout may have changed. Use this manual path:
1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Select your domain (**soulamore.com**).
3. In the left sidebar, click on **Security**.
4. Inside the Security menu, select **Bots**.

## 2. Enabling Bot Fight Mode
- **Free Plan:** Look for the **Bot Fight Mode** toggle and switch it to **On**. This will challenge requests from known "bad" bots.
- **Pro/Business Plan:** You will see **Super Bot Fight Mode**. We recommend:
    - **Definitely Automated:** Block or Managed Challenge.
    - **Verified Bots:** Allow (Googlebot, etc.).
    - **Static Resources:** Enable "Optimize Wordpress" or general resource protection if applicable.

## 3. Verify Proxy (Orange Cloud)
Ensure your DNS records for `soulamore.com` and `www` have the **Orange Cloud (Proxied)** enabled. Bot Fight Mode *only* works on proxied traffic.
- Section: **DNS** -> **Records**.

## 4. Troubleshooting 404s
If you still see a 404 inside the Cloudflare dashboard:
- It might be a session timeout. **Refresh the page** or log out and back in.
- Ensure you have **Administrator** or **Super Administrator** permissions for the Cloudflare account.

> [!IMPORTANT]
> Enabling Bot Fight Mode will significantly reduce the Firebase Hosting egress costs by preventing automated scrapers from downloading your site repeatedly.
