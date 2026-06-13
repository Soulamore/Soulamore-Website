# Report: Domain Routing & Cloudflare Funneling
**Date**: 2026-04-27
**Status**: Planning / Execution Started

## 1. Objective
To funnel all website traffic exclusively through `soulamore.com` (via Cloudflare) and effectively "disconnect" the default Firebase Hosting domains (`.web.app` and `.firebaseapp.com`) for both users and search engines.

## 2. Current State Analysis
- **Inconsistency**: Root `index.html` redirects to `www.soulamore.com` but its canonical tag points to `soulamore.com`.
- **Gaps**: Most sub-pages (e.g., in `/spaces/`, `/tools/`, `/portal/`) lack redirection logic and canonical tags.
- **Risk**: Search engines may index Firebase domains, leading to "Duplicate Content" penalties and bypassing Cloudflare WAF/Firewall rules.

## 3. Implementation Strategy

### Tier 1: Instant Redirection (Client-Side)
- **Logic**: Check `window.location.hostname`. If it matches `*.web.app` or `*.firebaseapp.com`, perform a `location.replace()` to the equivalent path on `soulamore.com`.
- **Placement**: Top of `<head>` in ALL HTML files to ensure minimal loading of unauthorized versions.

### Tier 2: SEO Integrity (Canonicalization)
- **Logic**: Inject `<link rel="canonical">` into every page.
- **Dynamic Paths**: The URL must point to the specific path (e.g., `https://soulamore.com/spaces/assessments/index`) rather than just the homepage.

### Tier 3: Global Safety Net
- **Logic**: Redundancy check in `components.js` to handle any edge cases or future files where the head-script might be missing.

## 4. Manual Actions Required (User)
1. **Cloudflare HSTS**: Ensure "Strict Transport Security (HSTS)" is enabled.
2. **Always Use HTTPS**: Enable in Cloudflare to prevent insecure Firebase hits.
3. **WAF Rules**: Use Cloudflare to block known bot traffic reaching the custom domain.

## 5. Execution Roadmap
- [ ] Create Python utility to automate script injection across 390+ files.
- [ ] Normalize `index.html` to point to `soulamore.com` (non-www).
- [ ] Verify canonical tag generation for nested directories.
- [ ] Final audit of Firebase redirects.
