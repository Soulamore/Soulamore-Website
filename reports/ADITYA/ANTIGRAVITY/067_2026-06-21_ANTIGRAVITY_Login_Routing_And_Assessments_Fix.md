# ANTIGRAVITY Solution Report: Login Routing Bug & Assessments TDZ Error

**Date:** 2026-06-21
**Agent:** Antigravity (applying orchestrator / frontend-specialist rules)
**Scope:** Navigation Routing across the SPA & Assessment Module Initialization

## 1. The Root Cause of the Login Routing Bug
The user repeatedly encountered a 404 error when clicking "Log In" from nested pages (e.g., `/tools/5-step-reset.html`). 
The previous logic for `getRootPath()` inside `components.js` calculated the relative depth by comparing `script.src` with `window.location.href`, and explicitly parsing their string lengths. This approach failed catastrophically when the site was hosted on certain test environments or domain subfolders. When the math failed, it returned an empty string `""` instead of the correct depth `../`, causing `navAuthBtn.href` to evaluate as `./portal/login.html` instead of `../portal/login.html`, leading to a 404 page at `/tools/portal/login.html`.

**The Solution:**
We completely rewrote `getRootPath()` across both `components.js` and `auth-handler.js`. Instead of parsing strings and calculating domain lengths, the function now directly extracts the relative path explicitly written in the script tag's HTML (`script.getAttribute('src')`) and counts the occurrences of `../`. This guarantees a mathematically flawless calculation of depth, entirely agnostic of the domain, server, or subfolder the site is hosted on.

To ensure the bug fix propagated immediately, we instituted a global cache-buster, replacing all `<script src="assets/js/components.js">` instances with `<script src="assets/js/components.js?v=3.5">` repository-wide.

## 2. The Assessments "filteredTests" Initialization Error
While testing, the user encountered a fatal error on the Assessments directory page: `ReferenceError: Cannot access 'filteredTests' before initialization`.

**The Root Cause:**
The `initializeEngine()` function in `spaces/assessments/index.html` was wrapped inside a `try/catch` block. However, the variables `filteredTests`, `currentPage`, and several others were declared using `let` and `const` *below* the `try/catch` block. Because JavaScript `let` and `const` variables are subject to the Temporal Dead Zone (TDZ), when `initializeEngine()` ran, it attempted to access `filteredTests` before the Javascript engine had reached its declaration, causing an immediate crash.

**The Solution:**
We surgically moved the declarations for `filteredTests`, `currentPage`, `BATCH_SIZE`, `activeDomains`, `activeContexts`, and the DOM element queries to the top of the closure, immediately preceding the `try/catch` block. This ensures all variables are fully hoisted and initialized in memory by the time `initializeEngine()` starts executing. 

## 3. Miscellaneous Fixes
* **UI Overlaps:** Resolved an overlapping UI issue on the bottom right of the screen between the "Soulbot" floating action button and the "Feedback" widget by moving the feedback widget permanently to the `bottom-left` corner.
* **404 Absolute Links:** Fixed all navigation links inside `404.html` so they use absolute routing (e.g., `/index.html` instead of `index.html`). Previously, because 404 errors occurred on deeply nested URLs, the relative links would lead users to secondary 404 errors.

---
**Status:** ALL tasks completed successfully and committed to the `fix/login-routing-bug` branch.
