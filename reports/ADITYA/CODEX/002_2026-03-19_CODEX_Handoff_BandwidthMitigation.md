# 2026-03-19 | CODEX | HANDOFF | Bandwidth Mitigation Hardening

> **Status:** Complete  
> **Prepared For:** Aditya  
> **Prepared By:** Codex  
> **Scope:** Apply immediate repo-side mitigations to reduce repeated Firebase Hosting downloads and stop non-production paths from being advertised.

---

## Executive Summary

Yes, there were still a few things I could fix immediately inside the repo without needing Firebase console access.

I applied a small hardening pass focused on three areas:

1. **Stop one remaining cache-busting behavior** that forced the homepage preview iframe to reload from a unique URL.
2. **Keep more non-production files out of Firebase Hosting**, especially source folders, preview folders, and backup files.
3. **Stop sitemap and robots from advertising non-production paths**, especially `journal-lab` and old `New Pages` URLs.

These changes do not solve billing retroactively, but they reduce the chance of the same pattern recurring.

---

## What Was Changed

### 1. Removed cache-busting from the popup iframe

File:

- [assets/js/launch-popup.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/launch-popup.js#L23)

Change:

- Replaced `./index.html?v=${new Date().getTime()}` with `./index.html`

Why:

- The old version created a unique URL every time the popup loaded.
- That bypassed normal caching and could force a fresh homepage download per session.

### 2. Hardened Firebase Hosting ignore rules

File:

- [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L10)

Added ignore coverage for:

- `journal-lab/**`
- `portal/claude-preview/**`
- `**/*.bak`
- `**/*.backup`
- `**/*.tmp`
- `**/*.log`
- `**/*current_wip*`
- `full_diff.txt`

Why:

- These files and folders are not production pages.
- With `hosting.public` still set to `"."`, the safest move is to aggressively ignore anything that looks like source, preview, backup, or transient output.

### 3. Hardened crawler rules

File:

- [robots.txt](/c:/Users/adity/Desktop/Projects/Soulamore-Website/robots.txt#L1)

Added:

- `Disallow: /journal-lab/`
- `Disallow: /portal/claude-preview/`

Why:

- This reduces search crawler discovery of non-production surfaces.
- It is not a security control, but it is a useful crawl-reduction control.

### 4. Fixed sitemap generation rules

File:

- [scripts/generate_sitemap.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/scripts/generate_sitemap.js#L7)

Updated the generator to exclude:

- `journal-lab`
- `.firebase`
- `.github`
- `.agent`
- `docs`
- `reports`
- `roadmap`
- `design-system`
- `soulbot`

And skip paths/files such as:

- `portal/claude-preview/`
- `New Pages/`
- `.bak`
- `.backup`
- `current_wip`
- portal pages other than `portal/login.html`
- `engine.html`
- `results.html`

Why:

- The old generator was too permissive.
- It was allowing non-production paths to end up in the sitemap.

### 5. Cleaned the current live sitemap file

File:

- [sitemap.xml](/c:/Users/adity/Desktop/Projects/Soulamore-Website/sitemap.xml)

Removed current entries for:

- `journal-lab/dist/index.html`
- `journal-lab/index.html`
- `New Pages/Peer Landing.html`
- `New Pages/Psychologists Landing.html`

Why:

- Even if the generator is fixed, the currently checked-in sitemap still advertised those URLs.
- Removing them now avoids waiting for a future regeneration.

---

## Why These Changes Matter

These changes help in practical ways:

- fewer forced cache misses
- fewer accidental public files
- fewer crawler-discoverable non-production URLs
- fewer chances of source/backup artifacts being repeatedly downloaded

This is a meaningful reduction in avoidable bandwidth waste.

---

## What This Does Not Solve Yet

There are still bigger structural improvements possible:

1. **Best fix:** stop using `"public": "."` and move Hosting to a dedicated deploy directory.
2. **Potential cleanup:** prune duplicate heavy assets in `journal/` if they are stale and not referenced.
3. **Operational fix:** set Firebase budget alerts and detailed usage alerts in GCP/Firebase.
4. **Forensics fix:** inspect Firebase/GCP usage logs to identify exact top-downloaded paths and user agents.

Those require either broader refactoring or console-side access.

---

## Completed

- Removed popup iframe cache busting in [assets/js/launch-popup.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/launch-popup.js#L23).
- Expanded Hosting ignore rules in [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L10).
- Added crawler disallow rules in [robots.txt](/c:/Users/adity/Desktop/Projects/Soulamore-Website/robots.txt#L1).
- Hardened sitemap generation in [scripts/generate_sitemap.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/scripts/generate_sitemap.js#L7).
- Removed known non-production URLs from [sitemap.xml](/c:/Users/adity/Desktop/Projects/Soulamore-Website/sitemap.xml).

## In-Progress

- No active code change is currently in progress.
- I have not yet converted Hosting away from root-based deployment.

## Blockers

- I do not have Firebase console usage logs from inside this repo session, so I cannot prove exact per-path bandwidth consumption from server-side logs.
- Moving Hosting from `"public": "."` to a dedicated deploy folder would need a larger deployment-structure decision.

## Next Action

- The highest-value next step is to replace root-based Hosting with a dedicated production output directory, then deploy only the exact files meant for `soulamore.com`.

---

*Prepared by Codex for the Soulamore Dev Team.*
