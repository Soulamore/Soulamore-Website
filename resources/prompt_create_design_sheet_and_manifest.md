# AUTOMATED TASK PROMPT: Generate Design Cheat Sheet & Project Manifest

## Objective
Analyze the Soulamore project's codebase, brand styles, and typography, and generate a matching **Design System Cheat Sheet (with interactive PNG exporter)** and a **Project Startup Manifest** inside the `resources/` folder.

This task is modeled after the successful brand asset system built for "That's Missing".

---

## Deliverable 1: `resources/design_cheat_sheet.html`
Create an interactive, premium, grid-aligned HTML document featuring the design system:
1. **Interactive Color Swatches**: Group all hex code values (Background, Accent, Muted, Primary Text, Borders) extracted from the CSS/Tailwind configuration, with inline swatches.
2. **Typography System**: List Google Fonts and custom display/sans/mono font rules used, with CSS sizing rules.
3. **Square Branding Logo Card**:
   - Replicate the exact markup and CSS of the Soulamore branding logo.
   - Display the logo centered inside a perfect square container (`aspect-ratio: 1 / 1`) styled with Soulamore's brand background (including grid/noise overlays if applicable).
   - Remove any extraneous taglines/header text from the square container so it focuses purely on the brand logo mark itself.
4. **Interactive PNG Exporter**:
   - Add dropdowns to select download size (**512x512**, **1024x1024**, **2048x2048**).
   - Add an option to download **With Background** (retaining the brand background color/grid lines) or **Without Background** (transparent PNG).
   - Implement JavaScript to render the text and any vector/SVG paths of the logo dynamically onto an offscreen canvas using `Path2D` and `ctx.fillText`, triggering a browser download when clicked.

### Offscreen Canvas PNG Exporter Reference:
```javascript
async function downloadLogo() {
  const size = parseInt(document.getElementById('size-select').value) || 1024;
  const bgType = document.getElementById('bg-select').value || 'solid';
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  await document.fonts.ready;

  if (bgType === 'solid') {
    ctx.fillStyle = '#YOUR_SOULAMORE_BG_HEX';
    ctx.fillRect(0, 0, size, size);
    // Draw grid lines or noise if needed
  } else {
    ctx.clearRect(0, 0, size, size);
  }

  // Draw logo text
  ctx.fillStyle = '#YOUR_SOULAMORE_FOREGROUND_HEX';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = size * 0.16; // Scale appropriately
  ctx.font = `bold ${fontSize}px "Space Grotesk" (or Soulamore Font)`;
  ctx.fillText('SOULAMORE', size / 2, size / 2);

  // Draw any logo SVG path overlays using Path2D
  ctx.save();
  ctx.translate(size / 2, size / 2);
  // Scale and translate relative to original SVG viewBox
  const path = new Path2D('M ... SVG path coordinates');
  ctx.strokeStyle = '#YOUR_ACCENT_HEX';
  ctx.lineWidth = 12;
  ctx.stroke(path);
  ctx.restore();

  const link = document.createElement('a');
  link.download = `soulamore-logo-${size}x${size}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
```

---

## Deliverable 2: `resources/startup_manifest.md`
Create a detailed markdown document describing the Soulamore project:
1. **Mission & Vision**: Define the core values and customer problems Soulamore solves.
2. **Platform Architecture & Tech Stack**: Document the frontend, database layout, server endpoints, and any external integrations (e.g. Firebase, AI models, custom APIs).
3. **Core Features**: Break down page-by-page functionality (e.g., matching system, logs, user dashboard).
4. **Media & Brand Guide**: Summarize the design tokens (colors, typography, spacing) and standard HTML elements so external agents can build visual assets resembling the website.

---

## Action Items for the Implementing Agent
1. Read the styles and components in `src/`, `index.html`, and `tailwind.config` to locate Soulamore's brand colors, fonts, and logo HTML markup.
2. Generate `resources/design_cheat_sheet.html` with the interactive canvas PNG exporter.
3. Generate `resources/startup_manifest.md` containing the startup's architectural manual.
4. Verify compiling and layouts are fully correct.
