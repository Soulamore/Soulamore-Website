# 🚀 Website Optimization Todo: Performance & Bandwidth Sprint
**Date:** 2026-04-27
**Status:** Planning / Execution

This list outlines the performance optimizations to be implemented based on the multi-tier optimization guide, focusing on reducing egress and improving Core Web Vitals.

---

## 🟢 TIER 1: Instant Wins
- [ ] **Brotli Compression**: Enable in Cloudflare (Speed > Optimization > Brotli). *[User Action Required]*
- [ ] **WebP Image Conversion**: Convert all `.png` and `.jpg` assets in `/assets/images/` to `.webp` using `imagemin`.
- [ ] **Long-term Caching**: Update `firebase.json` with aggressive `Cache-Control` headers for static assets (1 year) and shorter for HTML (5 mins).

---

## 🟡 TIER 2: JS Bundle Weight
- [ ] **JS Audit**: Run a manual audit of `assets/js/` to identify heavy dependencies.
- [ ] **Modular Firebase Verification**: Ensure all Firebase imports use the modular (v9+) syntax to enable tree-shaking.
- [ ] **Library Replacement**: Check for `moment.js` or `lodash` and replace with `dayjs` or `lodash-es`.

---

## 🟠 TIER 3 & 4: Architecture & Splitting
- [ ] **Lazy Loading**: Identify heavy components (like SoulBot or Problem Wall) that can be lazy-loaded on user interaction.
- [ ] **Code Splitting**: Evaluate if moving to a build tool (Vite/ESBuild) is feasible for this static structure.

---

## 🟣 TIER 5 & 6: Assets & Pipeline
- [ ] **Font Subsetting**: Optimize fonts in `/assets/fonts/` to only include necessary character sets.
- [ ] **Asset Minification**: Ensure all CSS and JS files are minified in the deployment pipeline.

---

## 📊 PROGRESS TRACKING
- **Optimization Strategy**: Defined (Done).
- **Tooling Installed**: `imagemin`, `imagemin-webp`, `source-map-explorer` (Done by User).
- **404 Reduction**: Payload reduced from 133KB to 6.9KB (Done).
