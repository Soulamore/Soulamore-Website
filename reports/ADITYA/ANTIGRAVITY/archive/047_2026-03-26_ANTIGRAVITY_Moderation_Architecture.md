# Architecting the Global Safety Moderation System
**Date:** March 26, 2026
**Agent:** Antigravity (Backend / Security Specialist)
**Status:** 📝 **SYSTEM DESIGN REPORT**

---

## 1. Executive Summary
To ensure Soulamore remains an emotionally safe and secure ecosystem, a **Global Moderation Engine** is required to continuously monitor user-generated content (UGC) across the platform. This report outlines the technical architecture, brainstorming criteria, database schemas, and implementation strategy for scanning Firestore anomalies—ranging from suicidal ideation to PII boundary violations.

---

## 2. Monitored Data Sources (The "Scan Surface")
The scanner must attach listeners to the following Firestore collections:
1. **`confessions`** (Confession Box) - High risk for crisis keywords and severe distress.
2. **`problem_wall_posts`** & **`problem_wall_comments`** - Risk of abusive language and public bullying.
3. **`postcards`** - Risk of hidden distress signals or spam.
4. **`chat_messages`** (Active Peer/User Chats) - Critical risk for PII exchange, boundary violations, and inappropriate solicitations.

---

## 3. Brainstormed Moderation Categories & Detection Logic

### A. Level 1: Critical Crisis (Self-Harm & Suicide)
**Trigger:** Immediate admin alert, bypasses standard delays.
- **Mechanism:** Keyword/Phrase mapping (Case-insensitive, normalized).
- **Target Words:** `"kill myself"`, `"want to die"`, `"end it all"`, `"no reason to live"`, `"cutting myself"`, `"swallow pills"`, `"overdose"`, `"hang myself"`.
- **Action:** Triggers a high-priority flag in the dashboard. In future iterations, could trigger an automated pop-up to the user providing emergency helplines.

### B. Level 2: Boundary Violations (PII & Off-Platform Routing)
**Trigger:** Protects the anonymity of the platform and prevents Peers from moving clients off-site.
- **Mechanism:** Regex Pattern Matching.
- **Target Patterns:**
  - **Phone Numbers:** `\b\d{10}\b` or `\+91[- ]?\d{10}`
  - **Emails:** `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
  - **Social Handles:** `"my insta"`, `"insta id"`, `"snap me"`, `"whatsapp me"`, `"@username"`.
- **Action:** Flags the chat for admin review to ensure the Peer or User isn't breaching the anonymity contract.

### C. Level 3: Abuse & Hate Speech (Problem Wall)
**Trigger:** Keeps public areas non-toxic.
- **Mechanism:** Standard Profanity & Slur Filter (Array of 100+ standard banned words).
- **Target Words:** Extreme profanities, racial slurs, and aggressive personal attacks (e.g., `"you are worthless"`, `"kys"`).
- **Action:** Automatically shadow-bans the post (changes `visibility: hidden` or `status: flagged`) until an admin explicitly clears it.

### D. Level 4: Grooming & Solicitation (Brainstormed Addition)
**Trigger:** Protects vulnerable users from bad actors using the platform for ulterior motives.
- **Mechanism:** Keyword + Context logic.
- **Target Words:** `"send pics"`, `"how old are you"`, `"are you alone"`, `"meet up"`, `"transfer money"`, `"gpay"`, `"upi"`.
- **Action:** Immediate flag for manual Administrative review.

---

## 4. Implementation Strategy: Cloud Functions over Client-Side
Instead of scanning content via the Admin Dashboard's JavaScript (which requires the admin panel to be open to work), the moderation scanner **must** be implemented via **Firebase Cloud Functions**.

**Workflow:**
1. A user submits a Confession, Postcard, or Chat Message.
2. A Firebase Cloud Function (`onDocumentCreated`) fires instantly in the backend.
3. The function runs the text through the Regex & Keyword filters.
4. If an anomaly is detected, the function writes a new alert document to the `safety_reports` collection.

*Why Cloud Functions?* It ensures 24/7 scanning, prevents malicious users from bypassing client-side filters, and avoids massive client-side Firestore read costs.

---

## 5. Schema: Month-Wise Segregation
To accommodate the requested "Month-Wise Segregation" without querying massive databases, the `safety_reports` collection will natively structure documents using a `/YYYY-MM/` prefix or an explicit month-based index.

**Firestore Path Layout:**
\`\`\`text
/safety_reports/
    /{reportId}
        -> type: "crisis" | "pii" | "abuse" | "solicitation"
        -> severity: "critical" | "high" | "medium"
        -> source_collection: "chat_messages"
        -> source_id: "doc_12345"
        -> trigger_text: "Hit me up on insta: @xyz"
        -> user_id: "user_789"
        -> status: "unresolved"
        -> created_at: Timestamp
        -> reporting_month: "2026-03"    <-- KEY FOR SEGREGATION
\`\`\`

**Dashboard Query Logic:**
When an admin opens the Safety Reports panel and selects "March 2026", the dashboard executes:
\`\`\`javascript
query(
    collection(db, "safety_reports"), 
    where("reporting_month", "==", "2026-03"),
    orderBy("created_at", "desc")
)
\`\`\`
This ensures immediate, low-cost loading of historical safety trends.

---

## 6. Next Steps for Implementation
1. **Approval:** Review these brainstormed rules to confirm they meet Soulamore's moderation ethos.
2. **Setup Functions:** Initialize `firebase init functions` and write the Node.js scanner triggers.
3. **Dashboard UI:** Build the `view-safety-reports` UI in `admin-dashboard.html` to consume and display these generated month-wise reports.
