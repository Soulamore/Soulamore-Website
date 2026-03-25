# 2026-03-19 | CODEX | PLAN | Bandwidth Reduction Without Changing The Website

> **Status:** Complete  
> **Prepared For:** Aditya  
> **Prepared By:** Codex  
> **Scope:** Create a practical plan to reduce bandwidth risk and billing exposure without changing the visible website itself.

---

## Executive Summary

Yes, there is a lot you can do **without redesigning or changing the website experience**.

The correct approach is to reduce risk at the **deployment**, **hosting**, **crawler**, **monitoring**, and **billing** layers instead of changing the pages themselves.

The biggest idea is this:

> Do not treat this as only a frontend problem.  
> Treat it as a **production delivery problem**.

That means:

- deploy less
- expose less
- let caches work
- let crawlers see less
- set alerts earlier
- make production safer than development

---

## Direct Recommendation

## Recommended Upgrade

If you want to keep using Firebase, the recommended path is:

### Recommended

**Firebase Hosting on Blaze plan**

### Not Recommended For This Specific Problem

**Firebase App Hosting** as the solution to your bandwidth issue

### Why

This project is still best treated mainly as a **static Hosting** problem, not an App Hosting problem.

Firebase Hosting is simpler for this use case and is mainly billed on:

- storage
- data transfer beyond free quota

Firebase Hosting pricing reference:

- https://firebase.google.com/docs/hosting/usage-quotas-pricing

Firebase App Hosting pricing includes a more complex set of services such as:

- Cloud Run
- Cloud Build
- Artifact Registry
- Cloud Logging
- cached and uncached bandwidth categories

Firebase App Hosting costs reference:

- https://firebase.google.com/docs/app-hosting/costs

So the best recommendation is:

> Stay on **Firebase Hosting**, upgrade to **Blaze**, and harden the delivery model.

---

## Important Warning

Budget alerts are important, but they are **not a hard cap**.

That means:

- they warn you
- they do not automatically stop charges

So budget alerts are necessary, but they are not enough on their own.

---

## Goal Of This Plan

Reduce bandwidth costs **without changing how the website looks or behaves for normal users**.

This means the plan avoids:

- redesigning pages
- removing animations for users
- rewriting the frontend
- changing product flows

Instead, it focuses on:

- deployment scope
- production isolation
- crawl control
- traffic control
- observability
- emergency response

---

## The Main Idea In Simple Words

Right now the safest strategy is not:

> "Make the website less pretty."

It is:

> "Make production serve only what production should serve."

That is the difference between:

- a heavy website that is manageable
- and a heavy website that becomes financially dangerous

---

## Risk Areas To Reduce Without Website Changes

These are the key areas where you can cut risk without touching the website UX:

1. **What gets deployed**
2. **What search engines can discover**
3. **What bots can hit repeatedly**
4. **What gets monitored**
5. **How fast you get warned**
6. **How fast you can shut things down safely**

---

## Recommended Plan

## Phase 1: Immediate Protection

These are the first actions to take before relaunching.

### 1. Deploy the hardening changes already prepared

These repo-side changes have already been made and should be deployed:

- stricter Hosting ignores in [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L10)
- stricter crawl controls in [robots.txt](/c:/Users/adity/Desktop/Projects/Soulamore-Website/robots.txt#L1)
- cleaned current [sitemap.xml](/c:/Users/adity/Desktop/Projects/Soulamore-Website/sitemap.xml)
- safer sitemap generation in [scripts/generate_sitemap.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/scripts/generate_sitemap.js#L7)
- removed popup cache-busting in [assets/js/launch-popup.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/launch-popup.js#L23)

Why:

- this reduces accidental public files
- this reduces non-production indexing
- this removes one repeated forced reload pattern

### 2. Upgrade to Blaze only when protections are ready

If you are going live again, Blaze is the correct billing mode for safety and continuity.

Why:

- free tier alone is too fragile for a site with unpredictable download patterns
- Blaze lets the site stay up, but with correct alerts and controls

Important:

- do not upgrade and relaunch blindly
- upgrade only after monitoring and controls are set

### 3. Set billing alerts immediately

Create Google Cloud billing budgets with alerts at:

- 25%
- 50%
- 75%
- 90%
- 100%

Why:

- you need warning before the bill becomes large
- even though alerts do not cap usage, they reduce surprise

### 4. Turn on billing export

Enable billing export to BigQuery or at least make sure detailed billing visibility is available.

Why:

- you need to know what started growing first
- next time, you should be able to answer the question with data, not inference

---

## Phase 2: Structural Hosting Safety

This is the highest-value improvement.

### 5. Stop deploying from the repo root

Right now Hosting still uses:

- `"public": "."`

That is safer than before only because ignores are better.  
But it is still not ideal.

Recommended change:

- create a dedicated production deploy directory
- only copy approved live files into it
- deploy from that directory only

Why:

- this removes the largest structural risk
- production stops depending on "ignore everything dangerous"
- you move from blacklist thinking to allowlist thinking

This is the single best no-website-change improvement.

### 6. Create a strict production allowlist

Instead of asking:

> "What should we ignore?"

Ask:

> "What exact files should production contain?"

That means:

- approved pages only
- approved assets only
- approved data files only

Exclude by design:

- backup files
- lab folders
- preview folders
- working files
- reports
- scripts
- source-only folders

Why:

- this reduces the chance of future accidents dramatically

### 7. Separate production and staging

Use different Firebase projects or at minimum clearly separate production deployment targets from experiments.

Why:

- production should not inherit temporary experiments
- staging can remain flexible without exposing cost risk to the live domain

Recommended model:

- one production Firebase project
- one staging Firebase project

---

## Phase 3: Crawl and Bot Control

If you do not want to change the site, then controlling **who downloads it** becomes very important.

### 8. Keep robots and sitemap strict

Rules:

- sitemap must contain only production-worthy URLs
- non-production paths must stay out permanently
- test/lab/preview folders must never be advertised

Why:

- crawlers follow the signals you give them
- a bad sitemap turns crawl waste into bandwidth cost

### 9. Add edge protection in front of the site

Recommended:

- put the domain behind a CDN/WAF layer with bot filtering and rate limiting

Examples of what you want conceptually:

- bot management
- rate limiting
- basic abuse blocking
- challenge suspicious traffic

Why:

- scraper traffic is often the expensive part
- this protects bandwidth without changing the website design

### 10. Use a domain/CDN setup that gives you traffic visibility

Whatever sits in front of your origin should help answer:

- which paths are hottest
- which user agents are abusive
- which countries are producing suspicious traffic

Why:

- invisible traffic is expensive traffic

---

## Phase 4: Monitoring And Operational Discipline

### 11. Monitor Hosting download usage daily after relaunch

For the first 14 days:

- check usage every day

After that:

- every 2 to 3 days

Watch for:

- sudden transfer spikes
- steady daily climb
- large jumps after content updates

Why:

- bandwidth incidents are easier to stop early than late

### 12. Create a simple production release checklist

Before any deploy:

- confirm sitemap changes
- confirm robots changes
- confirm no backup/lab artifacts are included
- confirm no cache-busting was introduced
- confirm no new public archive/data folders were exposed

Why:

- small mistakes in deploy hygiene are expensive on Firebase Hosting

### 13. Create an emergency shutdown playbook

You should have a written 3-step or 5-step emergency response for:

- traffic spike
- billing spike
- bot attack

Example structure:

1. Pause or redirect traffic
2. Roll back to last safe config
3. Disable risky routes or assets if needed
4. Freeze deploys
5. Review logs before relaunch

Why:

- emergencies are handled badly when the procedure is invented live

---

## Priority Order

If you want the order of action:

### P0 - Before Relaunch

1. Deploy the hardening already prepared
2. Upgrade to Blaze
3. Set billing budgets and alerts
4. Enable billing visibility/export

### P1 - Highest Structural Safety

5. Stop using root-based Hosting deploys
6. Create a production allowlist deploy directory
7. Separate production and staging

### P2 - Traffic Protection

8. Add CDN/WAF/bot filtering
9. Keep robots and sitemap strict

### P3 - Operating Discipline

10. Daily usage review after relaunch
11. Release checklist
12. Emergency shutdown playbook

---

## What I Recommend Most Strongly

If you only do three things, do these:

### 1. Move away from root-based Hosting deploys

This is the most important structural fix.

### 2. Put strict alerts and monitoring in place

You need earlier signal.

### 3. Add bot protection in front of the site

If bandwidth grows because of scrapers or aggressive crawlers, this is the fastest way to reduce waste without touching design.

---

## What You Do Not Need To Change Yet

Because your instruction is to avoid website changes, I am **not** recommending these as the first step:

- redesigning animations
- cutting features from the live UX
- deleting news UI
- rewriting the frontend architecture
- removing pages users depend on

Those can come later if needed, but they are not the best first move.

---

## Best Practical Recommendation

The best balanced path is:

> Keep the same website experience, stay on Firebase Hosting, upgrade to Blaze, deploy only a clean production bundle, add monitoring, and protect the domain from wasteful bot traffic.

That gives you the most protection with the least product disruption.

---

## Suggested Implementation Path For This Repo

Based on the current repo, the next practical engineering step would be:

### Step 1

Deploy the already prepared hardening changes

### Step 2

Create a dedicated production deployment directory and stop serving from repo root

### Step 3

Review current live routes and explicitly include only:

- approved HTML pages
- approved assets
- approved data files

### Step 4

Configure budgets, alerts, and usage monitoring before relaunch

### Step 5

Put the custom domain behind a bot-protected edge layer

---

## Completed

- Produced a no-website-change mitigation plan focused on deployment, monitoring, crawl control, and billing safety.
- Included a platform recommendation: **Firebase Hosting on Blaze** rather than App Hosting for this issue.
- Grounded the plan in current repo state and current Firebase pricing documentation.

## In-Progress

- No production deploy was performed in this session.
- The dedicated production deploy directory has not yet been implemented.

## Blockers

- Actual billing safeguards and bot protection require configuration outside the repo.
- A move away from root-based Hosting needs a deployment structure decision from you.

## Next Action

- The best next step is to implement a **dedicated production deploy directory** and remove `"public": "."` from the production Hosting flow.

---

*Prepared by Codex for the Soulamore Dev Team.*
