# Header Injection & Stabilization Audit Log

## Status: RECOVERED
**Issue**: Global Header is not rendering on sub-pages or main pages.

---

## 1. Root Cause Analysis (What made the header go?)

- **Missing Injection Calls**: During previous refactoring (relocating the News Feed Toggle), the calls to `injectHeader()`, `injectFooter()`, and `injectFavicon()` were accidentally omitted from the `DOMContentLoaded` listener in `components.js`.
- **CSS Selector Mismatch**: The CSS in `island-header.css` (and other global styles) targets `header.island-nav`. However, the dynamically injected `<header>` tag was missing the `island-nav` class, leading to `display: none` or collapsed height due to "island physics" logic.
- **Initialization Timing**: On some pages, `components.js` might execute after the DOM is already ready, causing the `DOMContentLoaded` listener to never fire.

---

## 2. Required Actions (What must be done)

### A. Fix `components.js`
- **Class Injection**: Update the `injectHeader()` function to explicitly add `header.classList.add('island-nav')` to the header element. This is critical because global CSS targets `header.island-nav`.
- **Initialization Anchor**: Use line 29 (`// console.log...`) as a stable anchor for script patching if automated tools fail to match the `DOMContentLoaded` block.

### B. Verify HTML Structure
- Ensure every page contains a bare `<header></header>` tag.
- Verify `components.js` is included with the correct relative path.

---

## 3. Current Blockers
- **Tool Inconsistency**: `replace_file_content` and `grep_search` are failing to match exact strings in `components.js` despite them being visible in `view_file`. 
- **Hypothesis**: The file may have inconsistent line endings (CRLF vs LF) or non-breaking spaces that are invisible in standard view but break string matching.

---

## 4. Workaround for Codex/Other Agents
If standard edits fail, perform a surgical replacement of the entire `DOMContentLoaded` block or use a script to re-write the initialization section with clean whitespace.
