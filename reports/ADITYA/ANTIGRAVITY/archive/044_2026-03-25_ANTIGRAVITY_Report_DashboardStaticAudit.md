# AUDIT REPORT: Dashboard Static Elements & UI Standardization

> [!IMPORTANT]
> This report identifies all hardcoded and static UI components across the Soulamore dashboard ecosystem that require migration to the "Professional Dominance" (Teal/Peach) design system.

## 📊 Global Component Audit (All Dashboards)

| Component Type | Status | Requirement for "Professional Dominance" |
| :--- | :--- | :--- |
| **Workspace Headers** | Static HTML | Standardize to **109px height**. Use bold `Outfit` 700 headings. Subtitles must be #64748b (Slate) in light mode. |
| **Sidebar Icons** | Hardcoded i-tags | Use a consistent wrapper: 40px circle with `accent-theme-soft` background and `accent-theme` icon color. |
| **Stat Cards** | Varied styling | Standardize to **Solid White Elevation-1** cards with 1px base borders. Primary metric in Bold Teal/Peach. |
| **Action Buttons** | Inline styles | Remove all inline `background` and `border`. Use global classes: `.btn-dash-primary` (Teal) and `.btn-dash-secondary` (Outline). |
| **Coming Soon Blocks** | Illustrated Placeholders | Replace glassy backgrounds with clean, defined border-dashed containers. Icons must match the dashboard's primary accent. |

---

## 🏗️ Dashboard Specific Breakdowns

### 1. Admin Dashboard (`admin-dashboard.html`)
*   **Static Cards**: 
    *   `Pending Approvals`, `Active Users`, `Flagged Content` (Stat containers).
    *   `Newsletter Hub` header and export buttons.
*   **Tabs/Navigation**:
    *   Role Filter Tabs (All Users, Admins, etc.) in User Mgmt.
    *   Content Queue filter buttons (Peer Stories, Comments).
*   **Identity**: Uses **Indigo** accents currently; needs migration to **Teal (Authority)**.

### 2. Psychologist Dashboard (`psych-dashboard.html`)
*   **Static Elements**:
    *   `Upcoming Sessions` table headers and "Add" button.
    *   `Professional Resources` list (static external links).
    *   `Earnings Progress` bar and "Level 2 Clinician" text.
*   **Tabs**: Sidebar links (Practice, Clients, Notes, Billing, etc.).
*   **Placeholders**: `My Articles` and `Article Editor` "Coming Soon" sections.

### 3. Peer Dashboard (`peer-dashboard.html`)
*   **Static Elements**:
    *   `Community Impact` stat labels.
    *   `Supporter Tools` headers in sidebar (Supervision Hub, Learning Hub).
    *   `Peer Guidelines` rule cards (Empathy, Privacy, etc.).
*   **Identity**: Successfully using **Peach**; needs "Salesforce-style" depth (defined borders/shadows).

### 4. User Dashboard (`user-dashboard.html`)
*   **Static Elements**:
    *   `SoulBot Hero` section (Title, P-tag, and Button).
    *   `Support Quick Grid` (Talk to a Peer / Expert Guidance cards).
    *   `Metrics Row` labels (Sessions, Journal, Mood Streak).
*   **Placeholders**: `My Journal`, `Saved Content`, `My Wallet` (Illustrated placeholders).

---

## 🛠️ Implementation Strategy (Roadmap)

1.  **CSS Foundation**: Finalize `theme.css` with CSS variables for Teal/Peach Dark Tones.
2.  **Card Unification**: Create a universal `.dash-card-v4` class that handles the 1px border and Salesforce-style elevation.
3.  **Header Sync**: Shift all `workspace-header` definitions into `portal-shared.css` to ensure the **109px** rule is immutable.
4.  **Icon Standardization**: Replace all diverse icon containers with a single `.icon-circle-pill` mixin.

---

## ✅ Final Recommendation
Proceed with creating a **Design System Patch** that targets these specific HTML classes globally, ensuring no dashboard feels like a "templated" add-on.
