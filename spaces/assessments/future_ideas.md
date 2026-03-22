# Future UI Ideas: Assessment Navigation

These ideas were explored during the transition from infinite scroll to batch pagination. They serve as inspiration for future "high-end" UI upgrades.

---

## 🎨 Option B: The "Cinematic Ribbon"
Transform the grid into a horizontally navigable ribbon. Instead of vertical batches, the grid "slides" left or right when the user clicks the arrows.

### Core Concept
- **Netflix-Style Browsing**: Users swipe or click arrows to slide through categories.
- **Micro-Animations**: Cards scale up or glow when they enter the center of the viewport.
- **Mobile First**: Extremely intuitive for touch devices where horizontal swiping is a primary gesture.

### Considerations
- **Pros**: Feels native, premium, and minimizes vertical page height.
- **Cons**: Requires complex CSS Grid/Flexbox management for overflow and snapping.

---

## 🏗️ Option C: The "Smart Stack"
Keep the 3x2 grid (6 items) but use a "stack" metaphor where clicking "Next" overlays a new layer of cards with a 3D transition.

### Core Concept
- **Z-Index Layering**: The next batch of tests slides in from the right or "pops" up from depth.
- **Counter Pill**: A floating glassmorphism pill showing `[ 6 / 100 ]` that pulses when the page changes.
- **Performance**: High performance as only 6 items exist in the DOM at any given time.

### Considerations
- **Pros**: Very clean UI; maintains a fixed focal point for the user.
- **Cons**: Might feel less "exploratory" than a ribbon or list.
