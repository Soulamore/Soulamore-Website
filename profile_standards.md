# Profile Design Standards & Guidelines

This document serves as the single source of truth for creating and maintaining user profiles on the Soulamore website. It defines the distinct visual identities, structural requirements, and functional behaviors for **Peer Profiles** and **Psychologist Profiles**.

---

## 1. Peer Profile Standard
**Purpose:** To provide a safe, approachable, and non-clinical space for peer-to-peer listening.
**Key Design Principles:** Soft, High-Contrast, "Friend-like", Minimalist.
**Reference Implementation:** `our-peers/zoya.html`, `our-peers/profile.html`

### A. Visual Theme: "Soul-Centric Light"
*   **Background:** Soft Mint Green (`#f0fdf4` / `var(--bg-soft)`).
*   **Cards:** Clean White (`#ffffff`) with soft, natural shadows (`0 10px 40px rgba(0,0,0,0.05)`).
*   **Typography:**
    *   Headings: `Outfit` (Bold/SemiBold) - Dark Slate (`#1e293b`).
    *   Body: `Plus Jakarta Sans` - Muted Slate (`#475569`).
*   **Accents:**
    *   Primary Accent: Soul Green (`#dcfce7` background, `#166534` text).
    *   Action Buttons: Dark Slate (`#1e293b`) or success Green (`#22c55e`) for state changes.

### B. Structural Layout & Components
The profile is a single-column layout (max-width 800px) containing a stack of `soul-card` elements.

1.  **Header Card**
    *   **Avatar:** Centered, circular, 120px, with a 4px Green border.
    *   **Name & Verified Badge:** Name in H1 (2.5rem). Pill-shaped "Verified Listener" badge (Light Blue bg `#e0f2fe`).
    *   **Theme Toggle (Fab/Icon):** A control to switch between the standard Light theme and a "Dark/Night" mode (using `localStorage` to persist `theme_preference`).

2.  **"A little about me" (Bio)**
    *   Personal narrative focusing on empathy and shared experiences.
    *   Must be readable with generous line-height (1.7 or 1.8).

3.  **"How I show up" (Vibe Tags)**
    *   Container: Flex wrap.
    *   Style: Pill tags with Green background (`var(--accent-green)`) and dark green text.
    *   *Examples:* "Patient", "Good Listener", "Slow-paced".

4.  **Expectation Setting (Lists)**
    *   **"What our conversation looks like":** Bulleted list setting process expectations.
    *   **"This space may feel right if...":** Bulleted list for user self-selection.
    *   *Styling:* Custom bullet points (e.g., green dots or checkmarks).

5.  **Boundary Box (Crucial)**
    *   **Style:** Distinct from other cards. Light Grey/Slate background (`#f8fafc`).
    *   **Border:** Left accent border (4px solid `#94a3b8`).
    *   **Content:** Mandatory disclaimer: *"I am here to listen, but I am not a medical professional."*

6.  **"Wall of Love" (Reviews System)**
    *   **Header:** Title + Aggregate Rating (e.g., "4.8 Stars").
    *   **Write Review Form:**
        *   Inputs: Name (Text), Email (Private), Rating (Interactive Stars), Message (Textarea).
        *   Button: "Publish Review" (Visual feedback on click).
    *   **Review List:** Display recent reviews with Author Name, Star Rating (Gold `#fbbf24`), and Date.

### C. Floating Action Button (FAB)
*   **Position:** Fixed Bottom-Right.
*   **Label:** "Connect Now" / "Chat".
*   **Style:** Dark pill shape, high elevation shadow. Hover effects: `translateY(-5px)`.

---

## 2. Psychologist Profile Standard
**Purpose:** To present clinical credentials, build trust, and facilitate paid bookings.
**Key Design Principles:** Professional, Premium, "Clinic-like", Calm, Deep.
**Reference Implementation:** `our-psychologists/bhagyavathi.html`, `our-psychologists/palak-shori.html`

### A. Visual Theme: "Clinical Calm / Midnight"
*   **Background:** Deep Space Dark (`#0f172a`).
*   **Cards:** Glassmorphism (`rgba(30, 41, 59, 0.7)` with blur).
*   **Typography:**
    *   Headings: `Outfit` - Starlight White (`#f1f5f9`).
    *   Body: High-opacity White/Grey.
*   **Accents:**
    *   Teal Glow (`#4ECDC4`) for success/medical vibes.
    *   Peach Glow (`#F49F75`) for warmth/humanity.
*   **Atmosphere:**
    *   **Particles.js:** Subtle floating background particles.
    *   **Ambient Audio:** Optional calming background track toggle.

### B. Structural Layout & Components
A dual-column grid layout (Left: Main Content, Right: Sidebar Details).

1.  **Hero Header (Full Width)**
    *   **Avatar:** Large (160px) in a gradient ring (Teal to Peach).
    *   **Stats Row:** Row of pill badges indicating: License Status, Languages, Video/Audio modes, and Price per Session.
    *   **CTA:** Gradient "Book Appointment" button.

2.  **Main Content (Left Column)**
    *   **Bio & Philosophy:** Professional statement and therapeutic approach.
    *   **Credentials Grid:** Icons + Text blocks highlighting degrees and specializations (e.g., "Trauma Informed", "M.Sc Psychology").
    *   **Client Testimonials:**
        *   Style: "Wall of Love" in Glass panels.
        *   Format: Quote icon + Italicized text + Client pseudonym (e.g., "Client, 22yo").
        *   Action: "Write Review" button toggles a hidden form (similar logic to Peer reviews but styled for Dark mode).

3.  **Sidebar Details (Right Column)**
    *   **Service Info:** List of Specializations (Tags), Experience (Years), Availability status (Green dot).
    *   **Crisis Policy (Mandatory):**
        *   Style: Red/Warning tinted glass panel.
        *   Content: *"Not for emergencies. Contact local helpline..."*

---

## 3. Consistency Checklist for Developers

When creating **ANY** new profile, verify:

### For Peers:
- [ ] Base Theme is **Light Mint** (`#f0fdf4`).
- [ ] Font is `Plus Jakarta Sans` (Body) / `Outfit` (Headers).
- [ ] **Boundary Box** is present and clearly visible.
- [ ] **Review System** allows star ratings and form submission.
- [ ] **Theme Toggle** allows switching to Dark Mode if requested.

### For Psychologists:
- [ ] Base Theme is **Deep Space** (`#0f172a`).
- [ ] Layout uses the **Glass Panel** effect.
- [ ] **Credentials** are explicitly listed with icons.
- [ ] **Crisis Policy** sidebar is Red-tinted and visible.
- [ ] **Book Appointment** CTA is the primary action.

### Global Requirements:
- [ ] **Mobile Responsiveness:** Stack columns on screens < 768px.
- [ ] **Navigation:** "Back to [List]" link is present at top left.
- [ ] **Performance:** Images properly sized/compressed; scripts loaded at bottom.
