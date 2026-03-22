# Git Verification Checklist
- [x] Verify Git installation and configuration <!-- id: 0 -->
- [x] Verify Git installation and configuration <!-- id: 0 -->
- [x] Initialize repository and add remote <!-- id: 1 -->
- [x] Configure Git identity (Done) <!-- id: 2 -->
- [x] Verify authentication (Success) <!-- id: 3 -->
- [x] Check Git sync status (Not Synced) <!-- id: 4 -->
- [x] Stage and Commit local changes (Done) <!-- id: 5 -->
- [x] Sync with remote (Pull/Rebase) (Done) <!-- id: 6 -->
- [x] Push changes (Success) <!-- id: 7 -->

# Dependabot Debugging
- [x] Check for unexpected directories (Found "Git Tools Open Source") <!-- id: 8 -->
- [x] Review .github/dependabot.yml (Confirmed clean) <!-- id: 9 -->
- [x] Add "Git Tools Open Source" to .gitignore (Already exists) <!-- id: 10 -->
- [x] Remove directory from Git tracking (keep local) <!-- id: 11 -->
- [x] Commit and Push changes <!-- id: 12 -->

# Debugging CI Build Failure
- [x] Inspect `journal-lab` project structure (Checked) <!-- id: 13 -->
- [x] Analyze `.github/workflows/firebase-hosting-pull-request.yml` (Checked) <!-- id: 14 -->
- [x] Attempt local build of `journal-lab` (Simulated via script) <!-- id: 15 -->
- [x] Fix build issues (Added root build script) <!-- id: 16 -->

# Security Remediation
- [x] Audit and remove hardcoded secrets (scripts, HTML, JS) (Guide Provided) <!-- id: 17 -->
- [x] Update vulnerable dependencies in `journal-lab` (Completed) <!-- id: 18 -->
- [ ] Clean up committed build artifacts (journal/assets) <!-- id: 19 -->
- [x] Create Security Guide (Completed) <!-- id: 20 -->

# Branch Management
- [x] Check for local key updates (Clean status) <!-- id: 21 -->
- [x] Create and push branch `Aditya` (Done) <!-- id: 22 -->

# Problem Wall Fixes
- [x] Implement Touch Support (Mobile Panning) <!-- id: 23 -->
- [x] Implement Keyboard Navigation (Arrow Keys) <!-- id: 25 -->
- [x] Add Audio Feedback for Incoming Notes (Remote Events) <!-- id: 26 -->
- [x] Tighten Firestore Rules (Prevent Text Tampering) <!-- id: 24 -->
- [x] Remove LocalStorage Fallback & Implement Firestore Seeding <!-- id: 28 -->
- [x] Stop Storing X/Y in Firestore (Data Cleanup) <!-- id: 29 -->
- [x] Implement Hybrid Spiral Layout Engine (Spiral + 5% Overlap + Repulsion) <!-- id: 30 -->
- [x] Verify New Placement & Optimistic UI <!-- id: 31 -->
- [x] Fix Post Note Argument Mismatch & Layout Stability <!-- id: 32 -->
- [x] Debug Placeholder Notes (Fix Seeding & De-Duplication) <!-- id: 33 -->
- [x] Refine Seeding Logic (Ensure 20 Permanent Seeds + User Posts) <!-- id: 34 -->
- [x] Document Product Specification (Feature List & Logic) <!-- id: 35 -->
- [x] Compare Backup vs Current (Restore zoomToNote & resetView) <!-- id: 40 -->
- [x] verify Post Button Functionality & Fix if Broken <!-- id: 37 -->
- [x] Implement "Reset View" Button (Re-center Camera) <!-- id: 38 -->
- [x] Verify Panning/Scrolling Logic (UX Improvement) <!-- id: 39 -->
- [x] Debug Real-Time Reaction Sync (Observer not updating) <!-- id: 36 -->

# Final Polish & Deployment
- [x] Fix Note Overlap (Zero tolerance + 10px padding) <!-- id: 41 -->
- [x] Implement New Note Experience (Center placement + Scroll-to-note) <!-- id: 42 -->
- [x] Add "Sparkle Glow" Effect for New Notes <!-- id: 43 -->
- [x] Remove Debug Panel & Clean Code <!-- id: 44 -->
- [x] Merge `Aditya` branch to `main` <!-- id: 45 -->
- [x] Move Backup File to `_BACKUPS` Folder <!-- id: 46 -->
- [x] Implement Loading Screen Overlay <!-- id: 47 -->
- [x] Implement Collective Rituals Widget (2026-2027 Calendar) <!-- id: 50 -->
- [x] Expand Rituals to 5-Year Calendar (2026-2030) <!-- id: 51 -->
- [x] Integrate NewsAPI for Live Exam Results <!-- id: 52 -->
- [x] Add Rituals Widget to Login Page & Fix Header Injection <!-- id: 53 -->
- [x] **Problem Wall Enhancements** <!-- id: 64 -->
    - [x] Fix Real-Time Reaction Sync (Optimized updateNoteUI) <!-- id: 65 -->
    - [x] Implement Mobile Stats Bar (Online Users + Post Count) <!-- id: 66 -->
    - [x] Adjust Mobile Layout (FABs moved up) <!-- id: 67 -->
    - [x] **Real-Time Presence System** (Firestore Heartbeat) <!-- id: 72 -->
        - [x] Active Presence Jitter (Simulated Movement +1/+2)
    - [x] **Add "Next Ritual" Logic**: Implement dynamic date fetching for "Next Collective Ritual" on both Index and Problem Wall. <!-- id: 73 -->
        - [x] Create `assets/js/ritual-schedule.js` with structured data through 2030. <!-- id: 74 -->
        - [x] Fix CORS blocks by inlining data into `ritual-schedule.js`. <!-- id: 75 -->
        - [x] Fix `index.html` duplicate widget bug (removed from hero, placed properly in Community Pulse section).
        - [x] **Engagement Loading States**: Replaced static `...` with animated loading rings (`fa-circle-notch fa-spin`) for live stats.
        - [x] **Philosophy UI Polish**: Standardized the "We make space" card width (`max-width: 750px`) to align with the SoulBot section, and added `60px` top spacing to clear the navbar elements.
        - [x] **Grid Alignment**: Standardized the 'Peer Profiles' section to match `max-width: 1200px`. Matched 'Need a Sign' to `max-width: 900px` to mirror the 'Community Pulse' widget width. Reverted 'What Would Help Right Now' to 1200px so cards don't squish.
        - [x] **Bottom Cards Alignment**: Standardized 'Need Human Connection', 'A Note From The Founder' and 'Stay Connected' to match the `max-width: 900px` constraint of the 'Need a Sign' box.
        - [x] Remove conflicting inline scripts from `problem-wall.html` and `login.html`.
        - [x] Fix `.global-stats` z-index (1000) so sidebar stays above notes.
- [x] **Fix Problem Wall Layout**: Ensure full-screen immersion.
  - [x] Hide site footer (`display: none`) on `problem-wall.html` to prevent obstruction.
  - [x] Force viewport layout (`position: fixed`) to prevent scrolling issues.
- [x] **Final Polish**: Remove debuggers and verify all interactions.)** <!-- id: 73 -->
        - [x] SoulBot FAB resized to 55px (Standard) <!-- id: 74 -->
        - [x] Vertical Stacking Gap (15px) enforced <!-- id: 75 -->
    - [x] **UI Layout Audit (Mobile Overlap Fix V2)** <!-- id: 68 -->
    - [x] **UI Refinement (Compact Sidebar)** <!-- id: 76 -->
        - [x] Revert FABs to 55px (Standard) <!-- id: 77 -->
        - [x] Compact Sidebar Padding & Typography <!-- id: 78 -->
        - [x] **Clearance Fix**: Raised Sidebar Anchor to 250px (Cleared Reset Button) <!-- id: 79 -->
        - [x] **Dominant Z-Index Fix**: Fixed shattered HTML DOM nesting where `<main>` closed inside `#viewport`, enabling `.global-stats` to natively stack above `.note`s.
    - [x] **Mobile UI Refinement** <!-- id: 80 -->
        - [x] Implement Full Stats Bar (5 Metrics) <!-- id: 81 -->
        - [x] Compact Icon+Number Layout <!-- id: 82 -->

# Critical Bug Fixes (Problem Wall)
- [x] **Audit Codebase for Conflicts** (Found 25 Bugs via Audit Report) <!-- id: 100 -->
- [x] **Fix Layout Engine Conflict** (Removed core.js import / Single Source of Truth) <!-- id: 101 -->
- [x] **Fix Invisible Notes** (Pointer Events: auto) <!-- id: 102 -->
- [x] **Fix Firebase Duplicate Init** (getApps() guard) <!-- id: 103 -->
- [x] **Fix Race Conditions** (STATE init, proper DOM checks, Loader timeout) <!-- id: 104 -->
- [x] **Restore Debugger** (Top-Left + Close Button) <!-- id: 105 -->

- [ ] **Moderator Dashboard (Functional Priority)** <!-- id: 88 -->
    - [ ] Create `pages/mod-dashboard.html` (Structure) <!-- id: 89 -->
    - [ ] Implement Auth Guard (Admin/Mod Role Check) <!-- id: 90 -->
    - [ ] Fetch & Display Flagged/Hidden Notes <!-- id: 91 -->
    - [ ] Implement Approve/Reject/Ban Actions <!-- id: 92 -->
        - [x] Analyze Bottom Nav Height (~60px) <!-- id: 69 -->
        - [x] Restore Zoom to Bottom (Center) & Push FABs Up (Right) <!-- id: 70 -->
        - [x] Generate UI Audit Report V2 (`ui_audit_report.md`) <!-- id: 71 -->
- [x] Add Rituals Widget to Login Page & Fix Header Injection <!-- id: 53 -->
- [ ] **Feature: Immersive Soundscapes & Visual Release** <!-- id: 54 -->
    - [ ] Create `assets/data/soundscapes.json` (Configuration) <!-- id: 55 -->
    - [ ] Implement Audio Engine (Fade-in/out, Loop Control) <!-- id: 56 -->
    - [ ] Add UI Controls to Problem Wall (Mute/Theme Toggle) <!-- id: 57 -->
    - [ ] Implement Approve/Reject/Ban Actions <!-- id: 92 -->

- [x] **Data Logic: Real-Time Stats (Pure)** <!-- id: 93 -->
    - [x] "Souls Online" = Actual Active Users (Firestore Presence) <!-- id: 94 -->
    - [x] Sync Mobile & Desktop counts <!-- id: 95 -->

# Interaction Feedback Loops (Firebase Trigger Email)
- [x] Implement `triggerEmail` in `data-handler.js`
- [x] Hook Newsletter to "Welcome Sequence" email
- [x] Hook Lifeline to "Safety Acknowledgement" email
- [x] Create HTML email templates (`welcome.html`, `lifeline_receipt.html`, `booking_confirmed.html`)
- [x] Implement "Aftermath" Confession Box UI Flow to Problem Wall
- [x] Implement Soulamore Away Viral Postcards (Email integration & HTML Replica)
- [x] Implement Dynamic "Explore" Routing for new users (Welcome Email randomizer including Peer Landing Page)

# Safety, Legal & Moderation Architecture
- [x] Download Legal & Trust/Safety Literature (MHFA, Crisis Protocols)
- [x] Implement Strict Keyword Moderation Filter (`safety-filter.js`)
- [x] Integrate filter into Confession Box and Problem Wall submission flows
- [x] Generate standard Liability Disclaimers for Peer Therapy UI

# Smart Content Integration (News API & Rituals)
- [x] Build Python scraper (`smart_news_rituals.py`) to gather daily mental health news via NewsAPI.
- [x] Save fetched articles to `knowledge source/Mental Health News Archive`.
- [ ] Ensure News API cron job architecture is solidly integrated into Knowledge Source.
- [ ] Brainstorm News Page UI (DEFERRED)

# Cinematic Emotional Assessment Engine (MVP)
- [x] Design `spaces/assessments/index.html` Landing Page (Midnight theme, stars, clinical trust signals)
- [x] Implement Playful Clinical Science Tooltips on Assessment Cards
- [x] Build Assessment Engine UI (`spaces/assessments/engine.html` - smooth Typeform style, micro-animations)
- [x] Design Layer 1 JSON Schema (`assets/data/assessments/emotional_regulation.json`) mapped to clinical domains.
- [x] Design Layer 1 JSON Schema (`assets/data/assessments/anxiety_overthinking.json`)
- [x] Design Layer 1 JSON Schema (`assets/data/assessments/burnout_career.json`)
- [x] Design Layer 1 JSON Schema (`assets/data/assessments/relationship_patterns.json`)
- [x] Implement Deterministic Scoring JS module (Layer 4)
- [x] Build the Results Page (Layer 5 Reflection & Layer 6 Recommendation Router)
- [x] Integrate Risk Management System (Mandatory Liability Disclaimers)

# Epic 7: Ecosystem Integration (Navigation & Discovery)
- [x] Add "Assessments" link to global header navigation
- [x] Add "Emotional Assessments" column to global footer navigation
- [x] Create `spaces/assessments/index.html` (Main Library Landing Page)
- [x] Inject Assessment Check-In widget onto `index.html` (Homepage)
- [x] Inject contextual Assessment Mini-Cards into `campus/index.html`

# Epic 8: Global Assessment Expansion (The 100-Test Milestone)
- [x] Update `assessment_roadmap_100.md` with Master Taxonomy Mapping <!-- id: 165 -->
- [x] Create `sorting_logic.md` for website discovery architecture <!-- id: 180 -->
- [ ] Implement 10 Core Engines (Anxiety, Depression, Burnout, etc.) <!-- id: 166 -->
- [ ] Develop `generate_assessments_v2.py` for multi-tag generation <!-- id: 167 -->
- [ ] Build contextual metadata compiler for `assessment-data.js` <!-- id: 168 -->

# Epic 9: Master Tag System & Intelligence Layer
- [ ] **Data Architecture**
    - [ ] Implement Relational Tagging Schema (Primary Domains + Context + Risk) <!-- id: 172 -->
    - [ ] Create Database-backed metadata structure <!-- id: 173 -->
- [ ] **Intelligence Layer (Deterministic Logic)**
    - [ ] Build Risk Calculation Layer (Safety first) <!-- id: 174 -->
    - [ ] Implement 4-tier Routing (Low, Moderate, High, Crisis) <!-- id: 175 -->
    - [ ] Develop Therapist-Matching Algorithm (Match Score Formula) <!-- id: 176 -->
- [ ] **UI/UX Discovery Layer**
    - [x] Implement Batch Pagination (Option A) <!-- id: 177 -->
    - [x] Final UI/UX audit
    - [/] Mobile Responsiveness Optimization
        - [x] Optimize index.html (Grid & Filters)
        - [x] Optimize engine.html (Scaling & Immersion)
        - [x] Optimize results.html (Full Media Query Suite)
        - [!] Verification blocked by browser tool error
    - [ ] Implement Multi-Tag Filtering in index.html <!-- id: 201 -->
    - [ ] Build Smart Gateway (3-question recommendation flow) <!-- id: 178 -->
    - [ ] Design Lifestyle/Business "Suites" (Expat Suite, Student Suite) <!-- id: 179 -->

# Epic 10: The 100-Test Rollout (Granular Batched Generation)
- [ ] **Anxiety Cluster**
    - [x] Batch 1: Tests 1–5 (Overthinking, Somatic, Anticipatory, Calm, Social) <!-- id: 181 -->
    - [x] Batch 2: Tests 6–10 (Nighttime, Perfectionist, Decision, Panic, Vigilant) <!-- id: 182 -->
- [x] **Mood & Depression Cluster**
    - [x] Batch 3: Tests 11–15 (Heavy Fog, Colorless, Exhaustion, Inner Critic, Withdrawal) <!-- id: 183 -->
    - [x] Batch 4: Tests 16–20 (Submerged, Winter, Resilience, Fragmented Mirror, shadows) <!-- id: 184 -->
- [x] **Academic Stress Cluster**
    - [x] Batch 5: Tests 21–25 (Exam Vortex, Scholar Fatigue, Competition, Dark, Graduation) <!-- id: 185 -->
    - [x] Batch 6: Tests 26–30 (Belonging, Perfectionist Student, Focus, Imposter, Deadline) <!-- id: 186 -->
- [x] **Expats & Migration Cluster**
    - [x] Batch 7: Tests 31–35 (Language, Cultural Shock, Nomad, Suitcase, Isolation) <!-- id: 187 -->
    - [x] Batch 8: Tests 36–40 (Long Distance, Professional, Identity Drift, Bureaucracy, Returner) <!-- id: 188 -->
- [x] **Relationship Cluster**
    - [x] Batch 9: Tests 41–45 (Attachment, Connection Gap, Friction, Loyalty, Trust) <!-- id: 189 -->
    - [x] Batch 10: Tests 46–50 (People-Pleaser, Past Echoes, Breakup, Social Intimacy, Silence) <!-- id: 190 -->
- [x] **Career & Burnout Cluster**
    - [x] Batch 11: Tests 51–55 (Desk Drifter, Office Politics, Burnout Battery, Leadership, Productivity) <!-- id: 191 -->
    - [x] Batch 12: Tests 56–60 (Slack Anxiety, Commuter Cloud, Transition, Meeting Mask, Creative Block) <!-- id: 192 -->
- [x] **Trauma & Nervous System Cluster**
    - [x] Batch 13: Tests 61–65 (Past Echoes, Hypervigilant, Fragmented, Safe Harbor, Avoidance) <!-- id: 193 -->
    - [x] Batch 14: Tests 66–70 (Body Witness, Startle, Dissociation, Guilt, Resilience) <!-- id: 194 -->
- [x] **Loneliness Cluster**
    - [x] Batch 15: Tests 71–75 (City Lights, Crowded Room, Digital, Sunday Slump, Friendship) <!-- id: 195 -->
    - [x] Batch 16: Tests 76–80 (Solo Voyager, Birthdays, Inner Void, Rejection, Shared Secret) <!-- id: 196 -->
- [x] **Grief & Loss Cluster**
    - [x] Batch 17: Tests 81–85 (Empty Chair, Cycles, Grieving Body, Location, Professional Goodbye) <!-- id: 197 -->
    - [x] Batch 18: Tests 86–90 (Petal, Collective, Unfinished, Life After, Shadows) <!-- id: 198 -->
- [x] **Adolescents & Youth Cluster**
    - [x] Batch 19: Tests 91–95 (Peer Pressure, Digital Identity, Growing Pains, Academic Ladder, Rebellion) <!-- id: 199 -->
    - [x] Batch 20: Tests 96–100 (Silent Bedroom, Foundations, Future Filter, Body Perception, Creative Spark) <!-- id: 200 -->
