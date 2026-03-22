# Assessment Sorting & Discovery Logic

This document defines the technical and UX logic for how assessments are categorized, filtered, and discovered within the Soulamore Ecosystem.

## 1. Master Taxonomy

### 🧠 Primary Clinical Domains (Core Buckets)
*These represent the foundational clinical mapping for each assessment.*
1. **Anxiety Spectrum**
2. **Mood & Depression**
3. **Trauma & Nervous System**
4. **Attachment & Relationships**
5. **Burnout & Functional Exhaustion**
6. **Identity & Self-Concept**
7. **Loneliness & Social Isolation**
8. **Grief & Loss**
9. **Youth & Development**
10. **Migration & Cultural Transition**

### 🏷️ Context Tags (Discovery Layer)
*Non-clinical tags used for user-facing filtering and "Suites".*
- **Student**
- **Workplace**
- **Leadership**
- **Expat**
- **Romantic**
- **Family**
- **Academic**
- **Creative**
- **Digital**
- **Somatic**
- **Identity**
- **Performance**

### ⚠️ Risk Tags (Internal/Routing Only)
*Internal tags that dictate UI behavior and escalation paths. Not visible to users.*
- **Low Risk**
- **Moderate Emotional Distress**
- **High Emotional Dysregulation**
- **Trauma-Activated**
- **Functional Impairment**
- **Crisis Sensitive**

---

## 2. Sorting & Filtering Logic

### Layered Filtering (Main Library)
The discovery UI uses a non-exclusive filtering system:
1. **Primary Filter (Domains):** Horizontal pill tabs at the top (Anxiety, Burnout, etc.). 
2. **Contextual Toggles (Optional):** Checkboxes to narrow down by situation (e.g., "Show only Workplace tests").
3. **Intersection Logic:** If a test is tagged with `Anxiety Spectrum` (Primary) and `Student` (Context), it appears in **both** the Anxiety filter and the Student filter. This maximizes discoverability.

### The "Smart Gateway" (Recommendation Flow)
For new users overwhelmed by the 100-test milestone, we implement a 3-step recommendation funnel:
- **Q1 (What):** "What feels most pressing?" (Maps to Primary Domain)
- **Q2 (Where):** "Where is this affecting you most?" (Maps to Context Tags)
- **Q3 (Intensity):** "How intense is this feeling?" (Maps to Risk/Complexity)
- **Result:** Display top 3 matching tests.

---

## 3. Business Packaging (Suites)

We can group the same 100 tests into distinct "Suites" for different user segments:
- **The Expat Adaptation Suite:** Filters for `Migration` + `Loneliness` + `Expat`.
- **The Student Resilience Suite:** Filters for `Youth` + `Academic` + `Performance`.
- **The Corporate Wellness Suite:** Filters for `Burnout` + `Workplace` + `Leadership`.

---

## 4. Technical Engine Mapping

To avoid building 100 unique forms, we use **10 Clinical Engines**. 
Each engine is a template (e.g., the *Anxiety Engine*) that accepts:
- **Custom JSON Wrapper:** Contains the unique title (e.g., "The Overthinking Echo"), description, and specific scenario text.
- **Tag Injection:** Metadata that attaches to the final result for Peer/Therapist matching.
