# 📱 UI Layout Audit & Fix Report (V2)

## 1. The Problem: "Button Overlap"
User reported persistent overlapping of functional elements (Zoom Slider, FAB Buttons) in the mobile view.
**Constraint**: User specifically requested **Zoom Slider must remain at the bottom**.

### Layer Analysis (Pre-Fix)
The mobile bottom screen estate was extremely crowded with 4 distinct layers fighting for the same 150px of vertical space:

1.  **Bottom Navigation** (Fixed): `bottom: 20px`. Top edge ~80px.
2.  **Mobile Stats Bar**: `bottom: 95px`. Top edge ~145px.
3.  **Zoom Slider** (Center): `bottom: 155px`. Width: ~250px.
4.  **FAB Stack** (Right): `bottom: 160px`. Width: 55px.

### Root Cause
Because the Zoom Slider is centered and wide, and the FAB buttons are right-aligned at the same vertical level (`bottom: ~150-170px`), they physically collide on narrow screens (iPhone/Galaxy). Use of the bottom area for *both* zoom and actions created a conflict.

---

## 2. The Solution: "Vertical Staggering"

To respect the user's preference for bottom-aligned Zoom controls, we utilized **vertical staggering** to separate the "Center Control Zone" from the "Right Action Zone".

### Implemented Layout Changes

#### 🅰️ Zoom Controls -> Anchored Bottom Center ⬇️
- **Position**: `bottom: 155px` (Centered).
- **Z-Index**: High.
- **Why**: Sits comfortably above the Stats Bar (95px), easily accessible with a thumb.

#### 🅱️ SoulBot & FABs -> Pushed Up "The Stack" ↗️
- **SoulBot Position**: `bottom: 220px` (Right).
- **Write/Center Buttons**: `bottom: 290px` (Right).
- **Why**: By pushing the action buttons *higher up the Y-axis*, we clear the horizontal band occupied by the Zoom Slider. The "Action Stack" now floats in the empty mid-right space, completely free of overlap.

---

## 3. Visual Hierarchy (Result)

| Zone | Element | Interaction |
| :--- | :--- | :--- |
| **Mid-Right** | FAB Stack (Write/Center) | Primary Actions |
| **Lower-Right** | SoulBot | Assistant |
| **Bottom Center** | Zoom Slider | View Control |
| **Bottom Edge** | Stats Bar + Nav | Context & Navigation |

This layout creates a "Control Cockpit" feel where every element has its own distinct vertical tier.
