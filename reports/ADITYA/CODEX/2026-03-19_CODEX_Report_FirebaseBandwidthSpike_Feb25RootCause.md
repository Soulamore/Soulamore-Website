# 2026-03-19 | CODEX | REPORT | Firebase Bandwidth Spike Root Cause Around Feb 25

> **Status:** Complete  
> **Prepared For:** Aditya  
> **Prepared By:** Codex  
> **Scope:** Investigate what changed around February 25, 2026 that most likely caused Firebase Hosting downloads to spike and billing to increase.

---

## Executive Summary

In simple words, the spike was **not caused by one single bad page on February 25**.

The problem was a combination of three things:

1. **Firebase Hosting was set up too broadly**, so the site was serving from the whole project root.
2. **Caching was effectively disabled**, so browsers and bots kept downloading files again and again instead of reusing them.
3. **New SEO and live news features added on February 27, 2026** likely brought in much more crawler traffic right after the site became heavier.

The first risky condition already existed before February 25.  
The first major weight increase happened on **February 24, 2026**.  
The strongest traffic trigger appears on **February 27, 2026**.

So the most accurate answer is:

> **February 25 itself was not the main root cause.**  
> The main root cause was an existing hosting/caching setup, made worse by a larger deployable site on February 24 and a more crawlable, news-heavy site on February 27.

---

## The Question This Report Answers

You asked:

> "What exactly changed around February 25 that might have caused the downloads to go exponential?"

This report answers that by checking:

- Git history around February 25 to February 27
- Firebase Hosting configuration
- Deployable repo size before and after key commits
- News and SEO changes that may have increased bot traffic
- Existing billing audit notes already stored in the repo

---

## Short Answer

If you want the shortest possible answer:

- **February 24, 2026:** the site became much heavier because a large `knowledge source/` content set was added.
- **February 25, 2026:** assessment work shipped, but it does **not** look like the main bandwidth driver.
- **February 27, 2026:** live news, news archive, robots/sitemap expansion, and cache-busting were added. This is the most likely moment where downloads started behaving "exponentially".
- **March 16, 2026:** a later fix confirms the diagnosis by tightening Firebase Hosting ignores and enabling proper caching in [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L8).

---

## Key Finding In Plain Language

Imagine your website as a shop.

- Before, people should only have been able to access the front counter.
- But your Firebase setup was closer to saying: **"Show visitors the whole warehouse too."**
- Then the warehouse got bigger on February 24.
- Then on February 27, you put up more road signs and a bigger directory so more people and bots could find everything.
- At the same time, your "do not cache" rules meant visitors kept re-downloading files instead of reusing what they already had.

That is why the graph does not look like a clean one-time jump. It looks like repeated heavy downloading.

---

## Timeline Of What Changed

### February 24, 2026

Commit: `1eb732f0`  
Message: `feat: blog updates (author styling, firebase likes, responsive)`

What matters here is not the commit title.  
What matters is that this commit added a very large tracked content tree, especially `knowledge source/`.

Measured from the git tree:

- Repo size before this point: about **23.5 MB**
- Repo size after this point: about **67.9 MB**
- `knowledge source/` alone: about **42.5 MB**

This means the site became much heavier **before** February 25.

Why this matters:

- If Hosting is serving from the project root
- And caching is weak
- Then every visitor or bot costs more bandwidth immediately

### February 25, 2026

Commit: `3691e495`  
Message: `Epic 8: Implement Assessment Expansion Phase 1 - AI batch generation & dynamic grid UI`

Files changed:

- `assets/js/assessment-data.js`
- `spaces/assessments/index.html`

This commit clearly expanded the assessments feature.  
But based on the diff and repo size, it did **not** add a large binary payload by itself.

Measured from the git tree:

- Size after February 24: about **67.9 MB**
- Size after this February 25 commit: about **68.0 MB**

So the February 25 assessments change was real, but the bandwidth effect from this specific commit looks relatively small compared with the broader hosting problem.

### February 27, 2026

This is the most important day after February 24.

Several commits landed:

- `c233d6fe`  
  `feat: implement live news feed, press kit, and cloud automation 24/7`
- `f5e40a94`  
  `Perf/Fix: implement instant news loading (SWR) and cache busting`
- `a8cb598f`  
  `feat: optimize news pipeline, implement 30-min refresh, and add permanent SEO archive`

These changes matter because they likely increased **traffic**, not just file size.

What changed:

- A live news system was added
- Press and guide pages were added
- `robots.txt` and `sitemap.xml` were updated
- `sitemap.xml` expanded dramatically
- `company/news-archive.html` was added and fetches public archive JSON from `knowledge source/news sourced/...`
- The news feed temporarily used a timestamp query parameter, which bypasses normal browser caching

Measured from repo evidence:

- `sitemap.xml` grew from about **23 URLs** to about **668 URLs**
- The live archive page fetches from [company/news-archive.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/company/news-archive.html#L167)
- The current news renderer now fetches normally at [assets/js/news-renderer.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/news-renderer.js#L42), but history shows the February 27 version briefly used `?t=<timestamp>` cache busting

Why this matters:

- A much larger sitemap can attract more crawlers
- More landing pages can increase discovery
- Live news creates repeated fetches
- Cache-busting makes repeat downloads more expensive

### March 16, 2026

Commit: `eaa0dd3e`  
Message: `fix: optimize Firebase Hosting bandwidth usage by ignoring large folders and enabling caching`

This is effectively the "confirmation" commit.

It changed [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L8) so that:

- many large folders are ignored
- static assets are cached for a year
- HTML gets a shorter but still useful cache
- JSON gets a short cache instead of no-cache everywhere

The current file shows:

- ignore rules at [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L10)
- HTML caching at [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L55)
- static asset caching at [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L64)
- JSON caching at [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L73)

This fix strongly supports the conclusion that the old hosting and caching setup was the real root problem.

---

## Technical Evidence

## 1. Firebase Hosting Was Serving From The Project Root

Current file: [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L8)

The important line is:

- `"public": "."`

That means Hosting served from the repository root.

By itself, that is not always fatal.  
But it becomes dangerous when:

- ignore rules are incomplete
- large content folders exist
- cache rules are poor

The older Firebase config in git history had only a very small ignore list and a global `Cache-Control: no-cache`.

In practical terms, that meant:

- more files were eligible to be served
- repeat downloads were more likely

## 2. The Site Size Jumped Before February 25

Measured git tree sizes:

| Commit | Date | Approx tracked size |
| :--- | :--- | :--- |
| `80ca4528` | 2026-02-21 | 23.5 MB |
| `1eb732f0` | 2026-02-24 | 67.9 MB |
| `3691e495` | 2026-02-25 | 68.0 MB |
| `c233d6fe` | 2026-02-27 | 68.3 MB |
| `a8cb598f` | 2026-02-27 | 68.4 MB |
| `eaa0dd3e` | 2026-03-16 | 25.9 MB |

This tells us:

- the major payload jump happened on **February 24**
- February 25 added very little extra weight
- March 16 reduced the deployable size heavily by fixing Hosting config

## 3. February 25 Assessment Work Was Probably Not The Main Driver

Assessment-related commit:

- `3691e495` on February 25

It changed UI and data files, but it did not create the kind of heavy binary jump that would explain hundreds of GB of download by itself.

Conclusion:

> February 25 is important in the timeline, but it does **not** look like the primary bandwidth trigger.

## 4. February 27 Likely Increased Bot And Repeat Traffic

This is where the graph behavior starts to make more sense.

Important additions:

- live news feed
- news archive
- more landing pages
- larger sitemap
- SEO-oriented content

Evidence:

- `sitemap.xml` grew from about **23 URLs** to **668 URLs**
- current news archive fetch logic is visible at [company/news-archive.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/company/news-archive.html#L167)
- current shared news fetch logic is visible at [assets/js/news-renderer.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/news-renderer.js#L13)

Why this matters:

- search engine bots can discover more URLs
- each bot visit downloads more page assets
- if the site is not cached properly, those downloads repeat at full cost

## 5. Cache-Busting Made Repeat Downloads Worse

History shows that on February 27 the news feed temporarily fetched:

- `assets/data/news-feed.json?t=<timestamp>`

That timestamp makes every request look unique.  
A browser or intermediary cache cannot reuse the old response safely, because the URL is different every time.

That means:

- more network requests
- more bandwidth
- less benefit from caching

The current version no longer does that and instead fetches the plain URL in [assets/js/news-renderer.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/news-renderer.js#L45) and [assets/js/news-renderer.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/news-renderer.js#L78).

## 6. Existing Repo Audit Reaches The Same Root Cause

There is already a prior internal audit:

- [2026-03-16_ANTIGRAVITY_Firebase_Billing_Audit.md](/c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/ADITYA/ANTIGRAVITY/2026-03-16_ANTIGRAVITY_Firebase_Billing_Audit.md)

That report says the main causes were:

- too-broad deployment scope
- `no-cache` policy
- frequent news refresh
- cache-busting

My investigation agrees with that overall diagnosis.

### Cross-Verification Note

That earlier Antigravity audit mentions exposure of much larger content, including backups/models measured in many gigabytes.  
My git-based investigation measured the **tracked repository state** and found a much smaller deployable tracked tree, mostly around **68 MB** at the key point.

These are **not necessarily contradictory**:

- the Antigravity report likely reflects the broader deployed/local workspace reality at the time
- this Codex report focuses on **tracked git history** and the commits around February 25

---

## What Most Likely Caused The "Exponential" Shape

The graph likely looked exponential because several things stacked together:

1. A larger public payload existed after February 24.
2. The hosting rules were still too broad.
3. `no-cache` behavior meant the same files were repeatedly downloaded.
4. February 27 made the site easier for crawlers to discover through news and sitemap expansion.
5. Live news behavior and cache-busting increased repeated fetches.

So the growth probably came from **repeated heavy downloads over many requests**, not from a single giant file being downloaded once.

---

## Root Cause Ranking

From most likely to least likely:

### 1. Primary Root Cause

**Firebase Hosting misconfiguration**

- project root used as public directory
- incomplete ignore rules before March 16
- `no-cache` headers causing repeat full downloads

### 2. Major Amplifier

**Large content addition on February 24**

- especially `knowledge source/`
- made each visit or crawl more expensive

### 3. Major Trigger For Sharp Growth

**News and SEO rollout on February 27**

- many more discoverable URLs
- larger sitemap
- archive fetches
- likely more crawler visits

### 4. Secondary Amplifier

**Cache-busting on February 27**

- forced fresh downloads of the news feed

### 5. Lower Probability Main Cause

**Assessment expansion on February 25**

- real change
- likely not the main bandwidth driver on its own

---

## All Plausible Website-Side Reasons

This section is broader than the root-cause ranking.

The sections above identify what was **most likely** responsible.  
This section lists **all realistic reasons inside the website/repo** that could have contributed to high download usage.

Important note:

> Not every item below is proven to be the main cause.  
> Some are primary causes, some are amplifiers, and some are smaller contributors that still make each visit more expensive.

### 1. Hosting served from the project root

This is the biggest structural risk.

- Hosting used `"public": "."`
- That means the deploy starts from the whole repo root
- If ignore rules are not strict enough, many unnecessary files can become deployable

Why it matters:

- it increases the chance that non-production files are downloadable
- it makes every mistake in repo organization more expensive

### 2. Caching was too weak before the March 16 fix

Earlier config used broad `no-cache` behavior.

Why it matters:

- browsers re-download more often
- bots re-download more often
- repeated visits cost much more bandwidth than they should

### 3. The site became much larger on February 24

This happened when the large `knowledge source/` tree was added.

Why it matters:

- even if traffic stays the same, each crawl or visit becomes more expensive
- a broad Hosting scope turns a content increase into a bandwidth problem quickly

### 4. Heavy JavaScript bundles

Yes, your friend's point is valid.

Your repo does include some heavy frontend payloads, for example:

- [journal/assets/index-D5_SM0fe.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/journal/assets/index-D5_SM0fe.js)
- [journal/assets/index-B6niBb9T.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/journal/assets/index-B6niBb9T.js)
- [journal/assets/subset-shared.chunk-CdngczY2.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/journal/assets/subset-shared.chunk-CdngczY2.js)
- [journal/assets/flowchart-elk-definition-4a651766-DF01B4Cg.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/journal/assets/flowchart-elk-definition-4a651766-DF01B4Cg.js)
- [assets/js/assessment-data.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/assessment-data.js)

Why it matters:

- large JS increases download size per page load
- users on repeat visits pay the cost again if caching is weak
- crawlers and bots also download those files

### 5. Heavy animations and interaction layers

Animations by themselves are not usually the direct billing cause, but they often correlate with heavier frontend payloads.

This can include:

- animation libraries
- more CSS and JS
- more redraw-heavy components
- more image and video decoration
- more UI code shipped to every page

Why it matters:

- animations can make the site "heavy" in network terms if they require large assets or supporting JS
- even when the animation is GPU-side, the code and assets still have to be downloaded first

### 6. Large images and social preview assets

The site contains fairly large image assets, for example:

- [assets/images/social-preview.png](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/images/social-preview.png)
- [assets/images/social-preview-landscape.png](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/images/social-preview-landscape.png)
- [assets/images/social-preview-square.png](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/images/social-preview-square.png)
- [assets/images/logo-premium.png](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/images/logo-premium.png)
- [assets/images/Founder/Aditya Harsh.jpg](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/images/Founder/Aditya%20Harsh.jpg)

Why it matters:

- every page that uses large images costs more per load
- social bots also fetch OG images
- image-heavy pages can accumulate a lot of transfer over time

### 7. Large single-file data payloads

Some payloads are not images or app bundles, but data blobs shipped to the browser.

Example:

- [assets/js/assessment-data.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/assessment-data.js)

Why it matters:

- if a large data file is loaded on important pages, every visitor pays for it
- if that page gets indexed or shared widely, bandwidth grows quickly

### 8. News feed and live content fetches

The live news system added repeated content fetching behavior.

Evidence:

- [assets/js/news-renderer.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/news-renderer.js#L13)

Why it matters:

- dynamic data fetches add requests beyond the initial page load
- if multiple pages initialize the same news widget, many pages repeat the same JSON transfer

### 9. Cache-busting query parameters

History showed fetches like:

- `assets/data/news-feed.json?t=<timestamp>`

Why it matters:

- this bypasses normal caching
- even a small JSON file can become expensive if re-fetched constantly across users and bots

### 10. News archive exposed raw archive data files

Evidence:

- [company/news-archive.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/company/news-archive.html#L167)

Why it matters:

- archive pages can cause more data file requests
- bots may crawl archive-linked surfaces
- public raw data paths can become repeated download targets

### 11. SEO expansion increased crawler discovery

This is one of the strongest likely contributors.

Changes included:

- more content pages
- more landing pages
- a much larger sitemap
- robots/sitemap support for discovery

Why it matters:

- more indexed URLs means more bot visits
- each bot visit downloads HTML, CSS, JS, images, and metadata assets

### 12. Sitemap contained too many URLs, including non-production ones

At one point the sitemap expanded from about **23 URLs** to about **668 URLs**.

It also contained non-production or lower-value entries such as:

- `journal-lab`
- `New Pages/...`

Why it matters:

- it tells crawlers to spend time on more URLs
- it can waste bandwidth on pages that should not be promoted at all

### 13. Robots and sitemap were not strict enough early on

Even when not the main cause, crawler-control mistakes can amplify traffic.

Why it matters:

- pages that are technically reachable often get discovered eventually
- once crawlers find them, each path can trigger another full asset load

### 14. Embedded previews and iframes

The site uses iframe-based preview and tool embedding patterns in some places.

Examples include:

- [assets/js/launch-popup.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/launch-popup.js#L23)
- portal dashboard tool iframes in several portal pages

Why it matters:

- an iframe can trigger an extra page load inside another page load
- if the iframe points to a heavy page, bandwidth doubles for that interaction

### 15. Cache-busting iframe preview behavior

This was a smaller but real contributor.

The launch popup used to load:

- `./index.html?v=<timestamp>`

Why it matters:

- every popup session could force another homepage download
- this is exactly the kind of small repeated cost that becomes expensive at scale

### 16. Duplicate or leftover build artifacts

There are multiple signs of backup, preview, or duplicate files in the repo structure, such as:

- `*.bak`
- `*.backup`
- `current_wip`
- preview folders

Why it matters:

- if Hosting ignores are not strict, these files can be served too
- they add to the deployable surface area

### 17. Multiple pages reusing the same heavy shared frontend

A heavy homepage or heavy shared component system is more expensive when many pages load it.

Why it matters:

- the issue is not just "one heavy page"
- if many indexed pages share the same assets, total bandwidth climbs quickly

### 18. Client-side rendering patterns that make every page depend on JS

If content discovery depends on JS-heavy rendering or shared app-style scripts, then each visit downloads more code than a simpler static page would.

Why it matters:

- bots and users both pay the JS cost
- the site can feel static in architecture but still behave like a heavier application in transfer cost

### 19. Social sharing bots fetching OG images and metadata

Many pages use social preview assets like:

- [assets/images/social-preview.png](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/images/social-preview.png)

Why it matters:

- when pages are shared, bots from platforms and messengers fetch preview metadata and images
- this is usually not the main bill driver, but it adds background transfer

### 20. Scrapers or non-search bots

This is outside the repo but still website-related in effect.

Why it matters:

- a sitemap/news-heavy site can attract scrapers, not just normal search bots
- scrapers often ignore polite crawling behavior
- heavy pages make scraper traffic more expensive

### 21. Repeated visits to a heavy site after the free tier was crossed

Once the site is:

- heavy per visit
- weakly cached
- more crawlable

Then even normal traffic can become expensive much faster.

Why it matters:

- the cost jump can look sudden because the free allowance hides the early phase
- after that threshold, the same traffic pattern suddenly starts costing real money

### 22. JavaScript and animation heaviness as a contributor, not a sole explanation

This deserves a direct answer because it is a common misunderstanding.

The site being JS-heavy or animation-heavy can absolutely contribute by:

- making each page load larger
- increasing parse and network cost
- making repeat visits more expensive

But by itself, it usually does **not** explain a huge bandwidth bill unless combined with:

- poor caching
- increased bot traffic
- broad Hosting exposure
- repeated reload/fetch behavior

So the best wording is:

> A heavy frontend was probably part of the problem, but it was likely an **amplifier**, not the only root cause.

---

## Direct Answer To "What Changed Around Feb 25?"

The best plain-English answer is:

> Around February 25, the dangerous condition was already in place: Firebase Hosting was too broad and caching was poor.  
> On February 24 the site became much heavier.  
> On February 25 the assessments feature expanded, but this was probably not the main cause.  
> On February 27 the site became much more crawlable and active through live news, archive pages, and a huge sitemap increase, and that is the strongest explanation for the sharp bandwidth acceleration.

---

## Recommended Practical Interpretation

If you are deciding what to blame operationally:

- Do **not** blame only the assessment release on February 25.
- Blame the **combination** of:
  - root-level hosting scope
  - weak caching
  - larger deployable payload
  - traffic/crawler growth from the February 27 news and SEO rollout

If you are deciding what to watch in the future:

- any change to `firebase.json`
- any sudden increase in deployable file size
- any new sitemap/SEO expansion
- any cache-busting query parameter
- any page that exposes raw archive or data files directly

---

## Evidence Files

- Hosting config fix: [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L8)
- Current news fetch logic: [assets/js/news-renderer.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/news-renderer.js#L13)
- Current archive fetch path: [company/news-archive.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/company/news-archive.html#L167)
- Prior billing audit: [2026-03-16_ANTIGRAVITY_Firebase_Billing_Audit.md](/c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/ADITYA/ANTIGRAVITY/2026-03-16_ANTIGRAVITY_Firebase_Billing_Audit.md)

Key commits reviewed:

- `1eb732f0`
- `3691e495`
- `c233d6fe`
- `f5e40a94`
- `a8cb598f`
- `eaa0dd3e`

---

## Completed

- Produced a forensic root-cause report for the Firebase Hosting download spike focused on the February 24 to March 16 timeline.
- Verified the findings against current hosting and news-fetch logic in [firebase.json](/c:/Users/adity/Desktop/Projects/Soulamore-Website/firebase.json#L8), [assets/js/news-renderer.js](/c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/news-renderer.js#L13), and [company/news-archive.html](/c:/Users/adity/Desktop/Projects/Soulamore-Website/company/news-archive.html#L167).
- Cross-checked the conclusions with the earlier internal audit in [2026-03-16_ANTIGRAVITY_Firebase_Billing_Audit.md](/c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/ADITYA/ANTIGRAVITY/2026-03-16_ANTIGRAVITY_Firebase_Billing_Audit.md).
- Added this handoff document in [2026-03-19_CODEX_Report_FirebaseBandwidthSpike_Feb25RootCause.md](/c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/ADITYA/CODEX/2026-03-19_CODEX_Report_FirebaseBandwidthSpike_Feb25RootCause.md).

## In-Progress

- No production code changes are in progress in this session.
- A deeper billing reconstruction using Firebase console export data or CDN logs has not been performed in this repo session.

## Blockers

- Git history shows the tracked repository changes, but it does not show Firebase console request logs, bot identities, or exact per-URL bandwidth by day.
- If you want exact proof of "which URL consumed the most GB", that requires Firebase/GCP usage logs outside this repository.

## Next Action

- Pull Firebase detailed usage data for **February 24, 2026 through March 19, 2026** and compare top-downloaded paths against the commits `1eb732f0`, `c233d6fe`, `f5e40a94`, and `a8cb598f`.

---

*Prepared by Codex for the Soulamore Dev Team.*
