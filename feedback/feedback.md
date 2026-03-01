# Soulamore User Feedback & UX Roadmap

This document serves as a persistent log for user feedback, research notes, and brainstorming sessions.

---

## 📥 Raw Feedbacks

### [2026-02-27] - Feedback from Helia (UX/First Impression)
> **Context:** Initial reaction to the "complicated" nature of the platform.

**Observations:**
- **Complexity:** "Tbh it looks complicated to me... so many parts that I can't figure out at first try."
- **Cognitive Load:** Users in distress already have "too many voices inside their head." Adding 110+ options feels like "more work for the brain."
- **Core Need:** "Sometimes all you need is a straightforward answer."
- **The Distraction Loop:** "There are many things that you can click on and redirect... I forget what i wanted to do in the first place and i get distracted."
- **The "Scary" Robot:** "These logos/icons look a bit scary to me" (referring to the SoulBot robot icon). Even if it seems like a "random comment," it indicates a lack of warmth in the AI's visual identity.

**Initial Brainstorm Points:**
- [ ] Explore a "Simplified Mode" or "Quick Help" landing page.
- [ ] Implement an AI-driven "Triage" that asks 1-2 questions to narrow down 110 tests to 3 recommendations.
- [ ] Reduce visual clutter on the assessment grid.
- [ ] **Focus Mode:** Implement a "Linear Flow" for assessments that removes external navigation/sidebars once a user starts, to prevent distraction.
- [ ] **Humanizing the AI:** Replace the mechanical "Robot" icon with something more organic or abstract-warm (e.g., a glowing pulse, a soft leaf, or a stylized 'S' that feels like a hug). Rename "SoulBot" to something less "tech-heavy" like "Soul Guide" or "The Listener."

### [2026-03-01] - Feedback from Prerit (Platform Humanity/UX)
> **Context:** Overall user experience of the Soulamore platform and its digital identity.

**Observations:**
- **Overall UI/UX:** "feels very AI/tech"
- **Human Connection:** "less human"
- **High-Level Requirement:** "make it more human if you have time"
- **Navigation/Discovery:** "i have not gone into workflows yet" (implies the entry point to advanced features is not intuitive)

**Brainstorming Update (Platform-Wide):**
- [ ] **Warm Design System:** Audit `global.css` and component styles to move away from sharp, medical, or "standard tech" aesthetics. Introduce softer curves, more organic color palettes, and grain textures to reduce the "sterile" feel.
- [ ] **Conversational Navigation:** Instead of static "Workflow" or "Expert" menus, explore a more "Human Guide" approach where the platform talks you through your options.
- [ ] **Iconography Audit:** Replace any remaining mechanical or purely technical icons with humanistic/abstract-organic symbols.
- [ ] **Human-First Language:** Review copy across `about.html` and portals to ensure the writing sounds like a caring mentor, not a software manual.
- [ ] **SoulBot Integration:** (Already in progress) Social-calibration to ensure the AI feels like a member of the team, not just a script-engine.

### [2026-03-01] - Feedback from Akshit (Problem Wall / Navigation)
> **Context:** Interaction issues with the "Problem Wall" pan/zoom controls.

**Observations:**
- **UI Ambiguity:** "Problem wall me bottom pe dekh ke lagta hai zoom option hai magar wo pan karta hai." (The control at the bottom looks like Zoom but actually performs Panning).
- **Control Conflict:** "Track padd ya scroll button se bhi pan aur zoom in/out hota hai simultaneously." (Using trackpad/scroll causes simultaneous pan and zoom, which is confusing).
- **Navigation Info:** "Double click and drag ya arrow keys kaam karti hain." (Double-click+drag and arrow keys work, but perhaps aren't discoverable enough).

**Brainstorming Update:**
- [ ] **Pan/Zoom Unification:** Resolve the conflict between scroll behavior. Ideally, `Ctrl + Scroll` for zoom and `Scroll` for Pan, or a clear toggle.
- [ ] **Icon Clarity:** Update the footer icons so that "Zoom" and "Pan" are visually distinct and match their actual function.
- [ ] **Onboarding Overlay:** Add a temporary "How to Navigate" tooltip or subtle overlay when first entering the Problem Wall.

---

## 🧠 Brainstorming Logs
*(New brainstorms go here)*

---

## 🛠️ UX Improvements Backlog
- [ ] Simplify assessment discovery.
- [ ] Add a "Start Here" prominent guide for new users.
- [ ] Create a "Minimalist Mode" for the engine.
