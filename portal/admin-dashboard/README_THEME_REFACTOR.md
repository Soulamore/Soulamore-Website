# Theme Refactor Exemption

> **STATUS: PENDING REFACTOR**

This directory (admin-dashboard and dashboard-related files) has been explicitly excluded from the automated Day/Night Theme inline color refactoring process (Phase 3). 

**Why?**
These pages currently contain hardcoded inline styles (colors, spacing, and gradients) that bypass the global theme variable system. Due to the high risk of breaking their functionality or layout, they were isolated.

**What needs to be done on the next pass:**
- Inline colors (hex, rgb/rgba) must be removed and replaced with global `var(--)` CSS variables.
- Inline spacing (margin, padding) should be standardized using utility classes.
- Future compliance requires full adherence to the `theme.css` variable system.
