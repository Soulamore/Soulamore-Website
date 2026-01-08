# SOULAMORE: The Design Compendium & Project Manifesto
*The definitive guide to the design standards, user preferences, and technical architecture of Soulamore.*

---

## 🌟 1. The Core Philosophy ("The Soul")

**"Perfection or Nothing."**
The UI is not just a wrapper; it is the product. Soulamore must feel **premium, deep, and alive**. We do not accept "good enough" web standards. If a layout breaks or looks "weird" for even 50 pixels of drag-resize, it is a failure.

### The "Aditya Standard" (User Preferences)
*   **Zero Tolerance for Squishing**: Cards, images, and grids must NEVER look compressed or distorted. If horizontal space runs out, we stack immediately.
*   **"Nuclear" Certainty**: We prefer `!important` and inline styles over elegant but fragile CSS cascades if it guarantees the user sees the right thing (especially on mobile).
*   **Hybrid Layouts**: We love complex, hanging elements (like the Sticker) on Desktop, but they must become standard, safe blocks on Mobile. No "in-between" broken states.
*   **Premium Aesthetics**:
    *   **Colors**: Deep Space Navy (`#0f172a`) + Teal Glow (`#4ECDC4`) + Peach Accents (`#FFD166`).
    *   **Feel**: Glassmorphism (`backdrop-filter`), smooth transitions (`fade-in`), and subtle glows.
    *   **Interaction**: Hover effects must be tangible (lifts, glows).

---

## 📱 2. Layout & Responsiveness Rules

### The "1500px Rule" (The Golden Breakpoint)
We identified that standard breakpoints (1024px) are insufficient for our "Hanging Elements."
*   **Logic**: Laptops (13"-15") often lack the margin space for designs that hang off the main container.
*   **Rule**: Any element that hangs/floats (like the "Wiring Backend" sticker) MUST switch to a safe "Mobile Block" layout at **1500px**.
    *   **Desktop (>1500px)**: Hanging, Absolute, Tilted.
    *   **Laptop/Tablet/Mobile (<1500px)**: Block, Relative, Centered, Top-of-Flow.

### The "Stack Early" Rule
*   **Grids**: Multi-column grids (like the Component Grid) must switch to single-column stacks as soon as cards feel cramped.
*   **Mobile Experience**: The mobile site is a vertical stream. Key items (like the Sticker) become their own "Sections" rather than overlays.

---

## 🧩 3. Component Bible

### A. The Hero Section & "The Sticker"
*   **Purpose**: The first impression. Deep, emotive, containing the primary hook.
*   **The Sticker**: A critical dynamic element.
    *   **Desktop**: It is a "Post-it" note hanging off the left edge. It adds informality and depth.
    *   **Mobile**: It is the **Header Announcement**. It sits precisely at the top (margin: 0), pushing the main headline down. It signals status ("Wiring Backend...") immediately.
    *   **Fix History**: We moved it physically in the DOM to be the first child to ensure this flow works naturally without negative margins.

### B. The Compass Grid ("Find Your Calm Space")
*   **Purpose**: The main navigation menu for tools.
*   **Structure**: 4 Cards (Reset, Reflect, Connect, Release).
    *   *Removed*: "Drop It" was removed to declutter. 4 items create a perfect balanced grid.
*   **Design**: Glassmorphism cards with icon glows on hover.

### C. The Header & Navigation
*   **Behavior**: "Island" navigation on desktop (floating).
*   **Mobile Menu**: Full-screen overlay triggered by a Hamburger icon.
*   **Breakpoint**: Synced with the Sticker at **1150px** (or 1500px depending on tightness) to ensure headers don't collide with nav items.

---

## 👾 4. "Drop It" Game Standards
*See `docs/DROP_IT_GOLD_STANDARD.md` for full physics details.*
*   **Aesthetic**: Retro-arcade meets Modern-Glow.
*   **Mechanic**: Must feel satisfying. Explosions, screen shakes (subtle), particle effects.
*   **Integration**: Accessed via the Sticker or direct links. It is a "Hidden Gem" rather than a primary tool.

---

## 🛠 5. Technical Protocols

### The "Cache Bust" Protocol
*   **Problem**: Mobile browsers (iOS Safari/Chrome) stick to cached CSS aggressively.
*   **Solution**: EVERY significant CSS push must include a version bump in `index.html`:
    *   `<link href="style.css?v=FINAL_LAPTOP_FIX">`
    *   Never assume a deploy is visible until this is updated.

### The "Nuclear" Debug Protocol
*   **When**: A user reports "I don't see it" on a live site.
*   **Action**:
    1.  Add visible text markers (e.g., "(v2.0)") to HTML content.
    2.  Add `Cache-Control` meta tags.
    3.  If marker is missing -> Deployment failed (Permission error, etc.).
    4.  If marker is present -> Browser caching issue.

### Deployment Permissions
*   **PowerShell Error**: "Running scripts is disabled."
*   **Fix**: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` before `firebase deploy`.

---
*Maintained by Antigravity Agent. Last Updated: Jan 2026.*
