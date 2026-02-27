# Interaction & Feedback Loop Implementation Plan

**Goal Description:** 
To transition Soulamore from a "silent database" into a living, responsive platform. This phase implements automated "closed-loop" feedback (transactional emails) for critical actions, introduces a smooth cross-pollination flow from the Confession Box to the Problem Wall, and builds a viral growth loop for Soulamore Away digital postcards.

## User Review Required
> [!IMPORTANT]
> **Email Provider Selection:** This plan assumes we will use **Resend** as the email service provider (due to its generous free tier and developer-friendly templates). You will need to create a free Resend account and provide the API key so we can plug it into Firebase in the next phase.

## Proposed Changes

---

### [Component 1] Email Infrastructure & Critical Alerts
We will bypass building a custom Node.js backend by utilizing the official Firebase **"Trigger Email" Extension**. 

#### [MODIFY] `firebase-config.js`
- No major changes required here. The extension runs entirely server-side within the Firebase project.

#### [MODIFY] `assets/js/data-handler.js`
- Create a new helper function `triggerEmail(to, templateId, templateData)` that writes a strictly formatted document to the `/mail` Firestore collection.
- Hook this helper into:
  - `handleNewsletter(email)` -> Triggers the "Welcome to the Universe" sequence. 
  - **Dynamic Explorer Routing:** Modify `handleNewsletter` to randomly select from a pool of interactive routes (`confession-box.html`, `problem-wall.html`, `soulamore-away.html`, `campus/index.html`) and pass this as `{{exploreUrl}}` to the welcome template, preventing new users from being dropped on a static homepage.
  - `submitLifeline()` (in `index.html`) -> Triggers the "We Hear You" safety acknowledgement.
  - `peer-booking-handler.js` -> Triggers the appointment receipt.

#### [NEW] `assets/templates/emails/`
- Design clean, mobile-responsive HTML templates (using MJML or standard inline CSS) that match the Soulamore aesthetic (dark backgrounds, glowing accents).
  - `welcome.html`
  - `lifeline_receipt.html`
  - `booking_confirmed.html`

---

### [Component 2] The "Aftermath" Confession Loop
Creating a seamless bridge to guide users from private venting (Confession Box) to community empathy (Problem Wall) without breaking their immersion.

#### [MODIFY] `tools/confession-box/index.html`
- Build a new `#aftermath-view` `<div>` that is hidden by default.
- Modify the `submitConfession()` JavaScript function:
  - **Before:** Faded the text box out and displayed a raw "Confession Released" toast.
  - **After:** Hides the main form completely and slowly fades in the `#aftermath-view`.

#### [NEW] The Aftermath UI Flow
- The new UI state will feature minimalist typography: *"Your confession has drifted into the void."*
- Below it, a glowing, subtle button: *"In pain? Some thoughts belong to a community. Move this to the Problem Wall."*
- If clicked, it invokes `problem-wall-handler.js` to transplant the exact string they just submitted directly to the public wall as an anonymous note.

---

### [Component 3] Soulamore Away: Viral Postcards
Allowing users to send digital postcards directly to their friends' inboxes.

#### [MODIFY] `spaces/soulamore-away/index.html`
- Update the postcard creation canvas to strictly enforce standardized dimensions (e.g., 600x400) so it matches standard email widths.
- Add an input field underneath the canvas: *"Friend's Email Address"*.

#### [MODIFY] `assets/js/data-handler.js`
- Update `handlePostcard()` to capture the `friendEmail` parameter.
- Instead of just saving to the `/postcards` gallery, it will also trigger a write to the `/mail` collection.

#### [NEW] `assets/templates/emails/postcard_replica.html`
- To avoid running heavy image-generation servers (like Puppeteer), the email template will be an **HTML Embedded Replica**. 
- The template will receive the CSS Gradient Code, the Font-Family, and the Text string from Firestore and render it natively as HTML blocks *inside* the recipient's email client, making it look exactly like the digital postcard they received.
- A prominent button at the bottom: *"Send one back via Soulamore."*

---

## [Component 4] Mental Health News Feed
A dedicated page that curates daily mental health and wellness news, providing an automated "knowledge extension" for the Soulamore ecosystem.

### [NEW] `spaces/news/index.html`
- A clean, masonry-style UI that matches Soulamore's dark mode and neon accents.
- Uses `fetch()` to read a local `news.json` file.
- Displays article cards with thumbnails, titles, sources, and a "Read More" button.

### [NEW] `assets/data/news.json`
- A lightweight JSON file containing the filtered payload from NewsAPI.
- Prevents exposing the private API key on the frontend and avoids rate limits by having the client read static data instead of querying NewsAPI directly.

### [MODIFY] `smart_news_rituals.py`
- Enhance the previously created script to explicitly overwrite `assets/data/news.json` with the latest articles.
- This creates a fully automated content pipeline: `Python Script runs (CRON/Manual) -> Fetches NewsAPI -> Updates JSON -> Frontend re-renders instantly`.

---

# [Epic 3] Cinematic Emotional Assessment Engine
A massive shift from a static "quiz library" to an interactive, emotionally intelligent diagnostic ecosystem. This engine uses clinical knowledge to provide a "guided inner experience" rather than an overwhelming form.

## System Architecture (6 Layers)

### Layer 1: Question Bank Engine (Data Structure)
- **JSON Based Library**: Questions are tagged by Domain, Subdomain, Severity Weight, Risk Weight, and Functional Impairment.
- **Scientific Backing**: Extracts methodologies from the `knowledge source` (e.g., Level 1 Cross-Cutting, Clinician-Rated Dimensions, PHQ-9 structures).

### Layer 2: Dynamic Form Builder (Frontend Cinematic UI)
- **Location**: `spaces/assessments/index.html` & `spaces/assessments/engine.html`
- **Vibe**: Typeform-style but darker, smoother, and cinematic. Midnight theme, teal/peach glows, starry background animations.
- **Mechanics**: One question per screen, micro-animations on selection, gentle progress circle, soft CSS transitions mapping to emotional themes. No overwhelming walls of text.

### Layer 3: Adaptive Question Logic
- **Branching**: If a user indicates high severity early on, branch into deeper clusters; if low, skip detailed clusters to reduce fatigue.

### Layer 4: Scoring & Pattern Engine (Deterministic)
- **Rule-Based**: AI does *not* calculate raw severity. The engine uses deterministic math to calculate Raw Scores, Severity Bands (Minimal, Mild, Moderate, Severe), and Functional Impairment Flags.
- **Composite Outputs**: Calculates patterns like "Emotional Volatility Index" or "Burnout Risk Level."

### Layer 5: AI Interpretation Layer (Hybrid Approach)
- **The Pipeline**: User Data -> Deterministic Scoring Engine -> Structured JSON Output -> Gemini Interpretation -> Final Report.
- **Strict Separation**: Gemini **never** calculates raw severity or diagnoses. It receives a rigid JSON payload representing the psychological signature (e.g., `{"domain": "emotion_regulation", "severity": "moderate", "risk_flag": false}`). 
- **Prompt Architecture**: Instruct Gemini to act as a *translator* of structured data into emotionally intelligent, grounded language using specific, verified knowledge bases.
- **Safety Gate**: If the deterministic scoring flags high risk, bypass Gemini reflection entirely and route directly to a grounding/escalation script.

### Layer 6: Recommendation Router (Deterministic Logic)
- **Routing Logic**: Driven strictly by Layer 4 (Not Gemini).
  - Low Severity -> Blog suggestions, Rituals
  - Moderate Severity -> Peer Therapy Matching, Support Groups
  - High Risk -> Immediate Crisis Resources, Peer Restriction.
- Gemini is only used to *explain* why a specific therapist/peer match was made based on the data.

## Strategic Implementation (Phase 1 MVP)
1. Build the Cinematic UI Shell (`spaces/assessments/index.html`).
2. Build the JSON Question Engine for 1 flagship module (e.g., "Emotional Regulation & Intensity").
3. Build the Deterministic Scoring JS Module.
4. Implement a Trust/Safety Disclaimer layer before starting the engine.

## Developer Instructions for Generating Future Schemas
When building the JSON files for Anxiety, Burnout, Relationships, and Mood, you MUST strictly adhere to the following architecture based on the `knowledge source` PDFs:
1. **Clinical Provenance**: Read from `assets/data/assessments/clinical_citations.json`. Every test must clearly map to its conceptual backing (e.g., Burnout maps to WHODAS 2.0).
2. **Deterministic Architecture**:
   - `subdomain`: Every question must tag a subdomain (e.g., 'cognitive', 'somatic', 'behavioral', 'relational').
   - `severity_weight`: 0 to 4 integers. Used strictly for math.
   - `risk_weight`: Separate integer. If total `risk_flags` exceeds threshold, `escalation_required` flips to `true`.
   - `functional_impairment`: Boolean flag for severe symptom questions (e.g., missing work, extreme avoidance).
3. **Never allow Gemini to calculate**: The `bands` array inside the JSON dictates the severity label (minimal, mild, moderate, severe) based solely on `raw_score`. Gemini only receives the `label`, never the raw math.

---

## Verification Plan

### Automated/System Tests 
- **Firestore Permission Checks:** Ensure the frontend can only *write* to the `/mail` collection, never *read* from it (to prevent email scraping).
- **Extension Logs:** Monitor the Firebase Functions logs to verify the Trigger Email extension successfully catches the documents and hands them off to Resend.

### Manual Verification
- Execute a test newsletter signup and verify the HTML Welcome email renders correctly in both Gmail (Desktop) and Apple Mail (Mobile).
- Submit a dummy confession, trigger the Aftermath flow, and verify the text successfully duplicates onto the Problem Wall without throwing a duplicate key error in Firestore.
- Generate a test postcard, send it to a test email, and verify the CSS gradient correctly mimics the web interface without breaking Outlook's rendering engine.

---

# Epic 4: Contextual Insight Clouds (Assessment Enhancements)

## Goal Description
The user requested a persistent, highly visible "popup cloud" or floating panel on the side of the screen during assessments. This feature will provide deep, mid-test context for specific questions—referencing external facts, Supreme Court guidelines, PDF literature, or statistical insights—without interrupting the core flow.

## User Review Required
> [!IMPORTANT]
> **UI Direction Needed:** Please review the brainstorm options and select whether you prefer a literal "Mascot/Cloud" design or a sleek "Glassmorphic Side Panel".

## Proposed Changes

### [MODIFY] `assets/data/assessments/*.json`
- Expand the simple `clinical_context` string into a richer `insight_cloud` object:
  ```json
  "insight_cloud": {
      "type": "stat | guideline | clinical | fact",
      "title": "Did you know?",
      "text": "The Supreme Court guidelines emphasize...",
      "source_name": "Read the 2024 Guidelines",
      "source_uri": "https://link-to-pdf.com"
  }
  ```
- Backfill all 4 assessments with rich, factual contexts for various questions.

### [MODIFY] `spaces/assessments/engine.html`
- **UI Addition:** Create a new absolute-positioned container (`#insight-cloud-panel`) on the right side of the screen (or bottom sheet for mobile).
- **Animation:** When `renderQuestion()` detects an `insight_cloud` object, trigger a CSS fade-in/slide-in animation for the panel.
- **Content:** The panel will display a relevant icon (e.g., a scale for guidelines, a brain for clinical), the insight text, and an optional clickable external link to the source material.
- **Removal:** When proceeding to a question *without* an insight, auto-hide the panel gracefully.

### [MODIFY] `assets/js/assessment-data.js`
- Recompile the global JavaScript data registry with the new rich JSON schemas to maintain the offline CORS fix.

## Verification Plan
1. **Automated Scripts:** Run the python compiler to ensure JSON schemas are perfectly mapped to `assessment-data.js`.
2. **Responsive Audit:** Open `engine.html` on Desktop (verify right-side panel) and Mobile (verify non-intrusive bottom sheet) to ensure the floating cloud doesn't block the question text or options.

---

# Epic 5: Lead Generation & Dynamic Resource Routing

## Goal Description
To convert highly engaged assessment users into actionable leads for Peer Therapy and Psychological support, while dynamically categorizing and recommending highly relevant blogs/tools based on their exact assessment outcome (Domain + Severity).

## Proposed Changes

### [MODIFY] `spaces/assessments/results.html`
- **Dynamic Resource Logic:** Replace the currently static `if (metrics.risk_category === ...)` logic inside the script. We will build a robust `getRecommendedPaths(domain, severity)` switch statement that returns categorized tools and (future) blog links specific to the user's struggle.
- **Lead Generation UI:** Directly below the Recommended Paths grid, inject a sleek, non-intrusive, optional form:
  - Header: *Want personalized recommendations?*
  - Fields: Name, Email, Phone Number (Optional).
  - Button: *Find My Match*.
- **Firebase Integration:** When the user submits the form, a new function `submitAssessmentLead()` will capture the inputs along with the `deterministic_metrics` and write a new document to the `/assessment_leads` Firestore collection.
- **Success State:** Upon submission, the form will gracefully transition to a "Thank You" checkmark without reloading the page.

## Verification Plan
1. **Routing Verification:** Alter the session storage manually to test different domains (`burnout_career`, `anxiety_overthinking`) and verify that the rendered tool/blog links adapt to the specific domain.
2. **Database Verification:** Fill out the lead generation form, submit, and verify that the data (including the hidden assessment scores) appears successfully in the Firestore `/assessment_leads` collection.

---

# Epic 6: Email Notification Backend

## Goal Description
To alert the Soulamore support team via email (`contact.soulamore@gmail.com`) immediately when a user requests contact through the Assessment engine (either via the general "Find My Match" form or the urgent "Crisis Escalation" form).

## Proposed Changes

### [MODIFY] `functions/index.js`
- Create a new Firebase Cloud Function `sendLeadNotificationEmail` triggered by `functions.firestore.document('assessment_leads/{leadId}').onCreate()`.
- Utilize `nodemailer` configured with **ZeptoMail SMTP** to dispatch an explicitly formatted HTML email containing the lead's Name, Contact Info, Domain, Severity Score, and Risk Flags.
- The `from` address will be `noreply@soulamore.com` and the `to` address will be `contact.soulamore@gmail.com`.
- If the `escalation_required` flag is `true`, format the email with "**URGENT: CRISIS ESCALATION**" in the subject line and highlight the response in red for immediate attention.

### [NEW] Firebase Project Configuration (Manual Action Required)
- The Google Account `contact.soulamore@gmail.com` will receive the alerts, but the transport is ZeptoMail.
- You can optionally secure the ZeptoMail credentials in the Firebase Environment config using the CLI:
  `firebase functions:config:set zeptomail.user="emailapikey" zeptomail.password="YOUR_ZEPTO_API_KEY"`
- Once set, run `firebase deploy --only functions` to activate the email trigger.

## Verification Plan
1. Set the Firebase functions config variables locally using `.runtimeconfig.json` (for the emulator) or deploy to the live project.
2. Submit a test lead via the Assessment Engine.
3. Verify that `contact.soulamore@gmail.com` receives the formatted HTML email with the correct lead details.

---

# Epic 7: Ecosystem Integration (Navigation & Discovery)

## Goal Description
The Assessment Engine currently exists as an isolated "deep link" feature. To maximize traffic and conversions, we need to weave "Assessment Contexts" naturally throughout the site—in global headers/footers, the homepage, and the Campus.

## Proposed Changes

### [MODIFY] Global Navigation & Footer (All Pages)
- **Header (`header.html` or equivalent global nav):** Add a sleek "Assessments" link to the primary navigation bar.
- **Footer (`footer.html`):** Add an "Emotional Assessments" column linking directly to the top 4 flagship tests (Burnout, Anxiety, Regulation, Relationships).

### [NEW] `spaces/assessments/index.html` (Main Directory)
- Create a beautiful, cinematic landing page that serves as the "Assessment Library".
- Categories will be organized by domains (Mood, Career, Relationships, Trauma).
- Include a "Not sure where to start?" button that routes to a generalized triage test.

### [MODIFY] Homepage (`index.html`) & Campus (`campus/index.html`)
- **Homepage:** Inject a glassmorphic "Emotional Check-In" widget near the Confession Box area, prompting users to take a 2-minute assessment.
- **Campus:** Add contextual "Mini-Cards" between blog posts (e.g., if a user is reading a blog on career stress, inject a card linking to the `burnout_career` assessment).

## Verification Plan
1. Audit the header and footer across 3 distinct pages (`index`, `campus`, `soulamore-away`) to ensure the navigation links are consistent.
2. Verify the responsive design of `spaces/assessments/index.html` on Mobile.

---

# Epic 8: Global Assessment Expansion & Lead Routing (The 100-Test Milestone)

## Goal Description
To exponentially scale the Assessment Engine from 4 flagship tests to 100 specialized tests. This requires an automated JSON generation script using Gemini, an upgraded Assessment Library UI (paginated grid + filters), and intelligent routing on the results page to match users with specific Peers or Psychologists based on the test's clinical tags.

> [!IMPORTANT]
> **Adherence to Established Theme:** The automated tests MUST strictly follow the exact same visual theme, structure, and micro-behavioral flow established by the first 4 hand-crafted tests. The JSON schema must remain deterministic and identical to the V1 schema to preserve the UI experience.

## Proposed Changes

### 1. Data Schema Update (`assets/js/assessment-data.js`)
- **Schema Addition:** Inject two new fields into the root of every assessment JSON schema:
  - `target_audience`: Array of strings representing pillars (e.g., `["Students", "Workplaces", "Soulamore Away", "General"]`).
  - `tags`: Array of strings matching the Peer/Psych expertise topics (e.g., `["Academic Stress", "Anxiety", "Depression", "Relationships", "Loneliness", "Grief / Loss"]`).

## Technical Architecture: Intelligence Layer

### Relational Tagging Schema
| Table | Description |
|---|---|
| `assessments` | Core test metadata (titles, durations, engine_type). |
| `domains` | Clinical buckets (Anxiety, Mood, Trauma, etc.). |
| `tags` | Multi-type tags (Context, Demographic, Modality). |
| `assessment_tags` | Many-to-many bridge for flexible filtering. |
| `risk_profiles` | Scoring thresholds and escalation triggers. |

### Risk Calculation & Routing
```json
{
  "risk_logic": {
    "calculation": "Severity Bands + Cross-Domain Combinations + Crisis Flags",
    "output_routing": ["Report Format", "Escalation Logic", "Resource Display"]
  }
}
```

### Therapist Matching Formula
**Match Score =**
- +30: Primary Domain Match
- +20: Modality Match (CBT, DBT, EMDR)
- +15: Language/Culture Match
- +25: Risk Specialization (if High Risk)

### 2. Python Generation Script (`.agent/scripts/generate_assessments.py`)
- Programmatically iterate through `.json` files inside `knowledge source/parsed_jsons/`.
- Prompt the Google Gemini API to return strict JSON arrays shaped exactly like the `emotional_regulation` test.
- Instruct the prompt to intelligently assign `target_audience` and `tags` based on the content of the PDF.

### 3. UI Update: Assessment Library Grid (`spaces/assessments/index.html`)
- **3x2 Grid View:** Modify the assessments grid to show a maximum of 6 tests on load (3 columns x 2 rows).
- **Categorization UI:** Rename "Soulamore Away" to "Expats Problems". Build interactive **Layered Filters** (Primary Domains + Context Tags).
- **Badge Positioning:** Position tags below the title of cards to prevent overlap with clinical backing badges.

### 4. Intelligence Layer & Master Tag System
- **Relational Schema:** Transition from flat JSON to a tagged structure (`primary_domain`, `context_tags`, `risk_sensitivity`).
- **Deterministic Risk Engine:** Implement a rule-based layer that calculates risk based on severity thresholds and functional impairment flags.
- **4-Tier Routing:**
    - **Green (Low):** Reflective report + peer group suggestion.
    - **Yellow (Moderate):** Structured report + therapist match priority.
    - **Red (High):** Safety-framed language + immediate crisis resources.
    - **Emergency:** Immediate crisis hotline display; no AI interpretation.
- **Therapist Matching Algorithm:** Build a weighted scoring system based on assessment `tags` vs therapist `specializations` (Match Score Formula).
- **Gateway Discovery:** Implement a 3-question "Smart Gateway" to recommend relevant tests to new users.

### 5. Modular Rollout (20 Batches)
To manage API quota and ensure clinical quality, the 100 assessments will be generated and inserted in **20 distinct batches of 5 tests each**. Each batch will undergo a quality check before proceeding to the next.

## Verification Plan
1. **Automated Generation Test:** Execute `.agent/scripts/generate_assessments.py` on a sample batch of 5 PDFs and verify the JSON keys map exactly to the schema.
2. **UI Validation:** Load the Library, verify exactly 6 cards render initially. Click individual filter pills and verify the grid dynamically re-paints with matching tests.
3. **Routing Validation:** Complete the 'Anxiety' assessment and verify the "Recommended Support" section specifically pulls up Peers tagged with 'Anxiety', ignoring unrelated categories.
