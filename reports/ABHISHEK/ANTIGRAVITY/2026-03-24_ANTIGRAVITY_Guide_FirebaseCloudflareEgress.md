# Firebase + Cloudflare: Egress & cost controls

This guide is for **Soulamore** when **Firebase Hosting** is the main driver of spend (high **downloads / egress**, often from bots, crawlers, or uncached repeat traffic—not “real users” only).

**Related:** [BILLING_LIMITS_SETUP.md](./BILLING_LIMITS_SETUP.md) (Gemini API budgets).

---

## Goals

1. **See** cost and traffic before it becomes a five‑figure surprise.
2. **Reduce** bytes served (caching, smaller deploy surface, fewer giant responses).
3. **Block or throttle** abusive or noisy automated clients at the edge (**Cloudflare**).
4. **Keep** Firebase Auth / Firestore / Functions working when Cloudflare sits in front of your domain.

---

## Part A — Google Cloud / Firebase (billing & visibility)

### A1. Billing reports & SKU drill‑down

- **Billing account overview:**  
  https://console.cloud.google.com/billing  
  Open the account you use for Firebase (e.g. **Firebase Payment**).

- **Reports (group by SKU):**  
  `https://console.cloud.google.com/billing/<BILLING_ACCOUNT_ID>/reports`  
  - Time range: month where the spike occurred.  
  - **Group by:** SKU (or Service, then expand Firebase Hosting).  
  - **Projects:** `soulamore-f0a64`  
  Confirm line items such as Hosting **network egress / data transfer** (names vary by invoice).

- **Cost table (export CSV):**  
  `https://console.cloud.google.com/billing/<BILLING_ACCOUNT_ID>/cost-management/cost-table`  
  Sort by cost; use CSV for your own records or support tickets.

### A2. Budgets & alerts (required)

- **Budgets:**  
  `https://console.cloud.google.com/billing/<BILLING_ACCOUNT_ID>/budgets`

Create at least:

| Budget | Amount (example) | Alerts |
|--------|-------------------|--------|
| Monthly total | Start at what you can afford (e.g. ₹2,000–5,000 or $25–50) | 50%, 90%, 100% → **email** |
| Optional second budget | Scoped to **project** `soulamore-f0a64` | Same |

**Note:** “Disable billing at 100%” exists but can take down **all** linked GCP services for the project—investigate before enabling.

### A3. Firebase console — Hosting usage

- **Usage & quotas:**  
  https://console.firebase.google.com/project/soulamore-f0a64/usage  

Watch **Hosting → Storage** vs **Downloads**. Your historical pain was **Downloads (egress)**, not storage.

### A4. Firebase Hosting configuration (this repo)

**File:** `firebase.json`

**Already aligned with cost control:**

- **`ignore`** — Excludes `docs/`, `functions/`, `soulbot/`, dotfolders, etc., so they are **not deployed** to Hosting (smaller site + less accidental exposure).
- **`headers`** — Separate rules for HTML, static assets, and JSON (long cache for immutable-style assets).

**Enhancements to consider:**

1. **SPA rewrite `**` → `/index.html`**  
   Every unknown path returns your main shell; aggressive crawlers can amplify egress.  
   - **Option A (safest for UX):** Keep rewrite; rely on **Cloudflare** (Part B) for bot throttling and caching.  
   - **Option B (advanced):** Add **explicit `rewrites`** for real routes and avoid sending *every* 404-like path to a multi‑MB `index.html` where possible—or serve a tiny **static 404** for unknown paths (requires routing design).

2. **HTML cache**  
   Current pattern uses `max-age=3600` for `**/*.html`. If you need faster content updates, shorten **only** for `index.html` via a dedicated `source` rule; keep long cache for other HTML that rarely changes.

3. **Heavy assets**  
   Move large video/audio/print-quality PDFs to **R2 / Cloud Storage + signed URLs** or a dedicated media domain with **aggressive caching**, so Hosting egress isn’t the only path.

4. **Deploy hygiene**  
   Periodically check **Hosting releases** in Firebase console; old retained versions can count toward **storage** (not usually the main egress issue, but worth knowing).

### A5. Firebase Auth (custom domain behind Cloudflare)

When traffic goes **example.com** → Cloudflare → Firebase Hosting:

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**  
   Add: `yourdomain.com`, `www.yourdomain.com` (and any host users actually use).

2. Keep **Firebase Dynamic Links / email link** domains updated if you use them.

### A6. If egress stays high on Hosting only

**Architectural option:**  

- Host the **static site** on **Cloudflare Pages** (or keep Pages + Workers).  
- Keep **Firebase Auth + Firestore + Functions** as today.  

That moves bulk CDN egress to Cloudflare’s pricing/caching model; you still update Firebase client config (API keys, auth domain) as needed.

---

## Part B — Cloudflare (edge protection & caching)

**Prerequisites:** Your **website’s DNS** is on Cloudflare; the **orange cloud** (proxied) is on the records that point to Firebase (or to Pages if you migrate).

### B1. SSL/TLS

- **SSL/TLS** → **Overview** → **Full (strict)** (once origin certificate is valid).  
- Avoid **Flexible** if origin expects HTTPS.

### B2. Bot mitigation

- **Security** → **Bots**  
  - Enable **Bot Fight Mode** (free plan) or **Super Bot Fight Mode** (paid plans, stricter).  
- **Security** → **Settings**  
  - Review **Security Level** (e.g. Medium).  
  - **Challenge Passage** / **Browser Integrity Check** as appropriate.

### B3. Caching (reduce origin / Hosting hits)

**Caching** → **Configuration**

- **Caching Level:** Standard (or Aggressive only if you understand dynamic HTML risk).  
- **Browser Cache TTL:** Respect **Existing Headers** (lets Firebase `Cache-Control` apply at browser), or set a **minimum** edge TTL for static paths.

**Cache Rules** (Rules → Cache Rules):

Suggested patterns (adjust to your URL layout):

| Rule name | If URL | Cache eligibility | Edge TTL | Browser TTL |
|-----------|--------|-------------------|----------|-------------|
| Static assets | Path contains `/assets/` OR extension is css, js, woff2, png, jpg, webp, svg, ico | Cache everything | 1 month+ | Respect origin |
| HTML (optional) | Path is `/` or `*.html` | Bypass or short TTL if auth shell must always revalidate | — | Short |

**Important:** Over-caching **HTML** for logged-in app routes can cause stale UI; often you **short-cache HTML** and **long-cache** assets (your `firebase.json` already pushes in that direction).

### B4. Rate limiting (paid feature on many plans)

**Security** → **WAF** → **Rate limiting rules**

Examples:

- **Per IP:** max N requests per minute to `/` and major path prefixes.  
- Stricter limits on paths that return **large** responses.

Use logs (below) to pick `N`.

### B5. Hotlink protection

**Scrape Shield** (or equivalent in current UI):

- Enable **Hotlink Protection** if others embed your images from your domain.

### B6. Firewall / WAF custom rules

**Security** → **WAF** → **Custom rules**

Examples (tune after watching logs):

- Block or challenge countries you **never** serve (only if business‑acceptable).  
- Challenge requests with **no `User-Agent`** or known bad patterns.  
- Block ASNs that show up only in attack spikes (advanced; verify false positives).

### B7. Logs — find who burns bandwidth

- **Analytics** → **Web Analytics** (optional) or **Logs** (Logpush / Enterprise features vary by plan).  
- On lower plans, use **Security** → **Events** and sampling to see spikes.

Pair with **Google Search Console** (coverage / crawl stats) to see if **Googlebot** volume is unrealistic.

### B8. Under Attack Mode (emergency only)

**Quick Actions** → **Under Attack Mode**  

Shows interstitial to visitors; use briefly during an obvious DDoS or crawl storm, then disable.

---

## Part C — Operational checklist (order of work)

1. [ ] **Budgets + email alerts** on the GCP billing account.  
2. [ ] **Reports grouped by SKU** — confirm Hosting egress SKU for the bill.  
3. [ ] **Cloudflare proxy ON** for production hostnames.  
4. [ ] **Bot Fight Mode** (or better) enabled.  
5. [ ] **Cache rules** for static assets; avoid nuking dynamic HTML incorrectly.  
6. [ ] **Firebase Auth** authorized domains include Cloudflare hostnames.  
7. [ ] Review **`firebase.json`** `ignore` + `headers` after each major change.  
8. [ ] Optional: **Rate limiting** + custom WAF rules once you see traffic patterns.  
9. [ ] Longer-term: evaluate **Cloudflare Pages** for static hosting if Firebase egress remains unacceptable.

---

## Part D — Links (replace `<BILLING_ACCOUNT_ID>`)

| What | URL pattern |
|------|-------------|
| Billing home | https://console.cloud.google.com/billing |
| Reports | https://console.cloud.google.com/billing/<BILLING_ACCOUNT_ID>/reports |
| Cost table | https://console.cloud.google.com/billing/<BILLING_ACCOUNT_ID>/cost-management/cost-table |
| Budgets | https://console.cloud.google.com/billing/<BILLING_ACCOUNT_ID>/budgets |
| Firebase project usage | https://console.firebase.google.com/project/soulamore-f0a64/usage |

---

## Disclaimer

Pricing, product names (e.g. WAF, Bot Fight), and console paths change. Use this as a **checklist**; verify in current Google Cloud and Cloudflare docs for your plan.
