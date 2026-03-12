# 📋 Soulamore — Dashboard Status & Handoff

> **Date:** March 12, 2026 | **Status:** Audit Complete  
> **Prepared by:** Aditya (Engineering Lead)  
> **Audience:** Development Partner / Feature owners

> This document answers: *"What do we have?"* and *"What are we still missing?"* across all four portals.

---

## 🗺️ Portal Landscape Overview

Soulamore has **4 active dashboards**, each serving a distinct role in the mental wellness ecosystem:

| Portal | File | Role | Design Tier |
|--------|------|------|-------------|
| 🧑 **User Dashboard** | `portal/user-dashboard.html` | Core member experience | ⭐⭐⭐ Good |
| 🤝 **Peer Dashboard** | `portal/peer-dashboard.html` | Volunteer peer experience | ⭐⭐⭐⭐⭐ Premium |
| 🩺 **Psych Dashboard** | `portal/psych-dashboard.html` | Psychologist's clinic | ⭐⭐⭐ Good |
| 🛡️ **Admin Dashboard** | `portal/admin-dashboard.html` | Platform management | ⭐ Prototype |

---

## 1. 🧑 User Dashboard (My Space)

### What's There
The user dashboard ("My Space") is the most **emotionally designed** of the four. It prioritizes mental wellness tools over administrative tasks.

**Sidebar Navigation (10 items):**
`Home` · `My Journal` · `My Sessions` · `Peer Guidelines` · `SoulBot AI` · `Messages` · `Saved` · `My Wallet` · `My Profile` · `Settings`

**Key Features:**
- **SoulBot Hero Card** on Home — prominent glow-accented CTA with emotional framing: *"Start where you are."*
- **Quick Relief FAB** (Floating Button) — modal with 4 tools: Vent Box, Confessing, Drop It, Play.
- **Peer + Psychologist Split CTA** — dual booking cards on home view.
- **SoulBot Embedded View** — `<iframe>` chat embedded as a sidebar view *(now Coming Soon placeholder)*.
- **Mood Tracker Widget** — 4 emoji-based mood buttons on the Peer Guidelines page.
- **My Journal** — dedicated personal journaling view *(now Coming Soon placeholder)*.
- **My Wallet** — sidebar link exists (no view content confirmed).
- **Settings** — dark/light mode toggle. An "Emotional Theme" system exists but is **hidden (`display:none`)** — a major differentiator waiting to be unlocked.
- **Light/Dark Mode** — fully implemented. ✅

### 🔍 UI/UX Quality
- **Typography:** Outfit + Plus Jakarta Sans. Clean.
- **Color Accent:** Peach-orange (`--peach-glow`) + Teal toggle.
- **Card Design:** Dark glassmorphism cards, consistent across views.
- **Animation:** SoulBot FAB has `pulse-glow` keyframe animation. ✅

### ✅ Completed Views
- [x] Home — Welcome card, stat strip (sessions, streak, moods)
- [x] Progress — Weekly mood chart (Chart.js), streak tracker
- [x] Discover — Peer + blog content feed
- [x] Community / Forum — Post list, reply system (UI scaffolded)
- [x] Sessions — Upcoming + past sessions, booking links
- [x] Appointments — Schedule management
- [x] Messages — Thread list with mock conversation UI
- [x] Settings — Profile photo, notification preferences, dark/light mode

### 🚧 Coming Soon Placeholders (Not Yet Built)
| View | ID | Status |
|------|----|--------|
| 🤖 SoulBot AI | `#view-soulbot` | 🔴 Not Built |
| 📓 My Journal | `#view-journal` | 🔴 Not Built |
| 🔖 Saved for Later | `#view-saved` | 🔴 Not Built |

### ❌ Other Missing Features
1. **Wallet view is empty** — sidebar link exists but `#view-wallet` has no real content.
2. **Mood Tracker is passive** — emoji buttons have no backend. No mood history chart.
3. **No Onboarding Flow** — first-time users see no guided tour or "Welcome" state.
4. **No Notifications** — no bell icon, no alerts for new bookings or messages.
5. **No Community Posting** — users can view blogs/Wall but can't post/react from within the dashboard.
6. **Hidden Emotional Themes** — 5 unique emotional color themes exist in code but are disabled. Major differentiator.
7. **Profile Picture Upload** — shows generic `fa-user-astronaut` with no upload capability.

---

## 2. 🤝 Peer Dashboard (Peer Portal)

### What's There
The most **visually premium** of all four dashboards. Serves community volunteer peers.

**Sidebar Navigation (10 items):**
`Overview` · `My Profile` · `Sessions` · `Shared Journals` · `My Stories` · `Availability` · `Testimonials` · `My Journal` · `Saved Blogs` · `Get Supervision` · `Settings`

**Key Features:**
- **Impact Overview** — Chart.js radar/bar charts showing sessions given, lives impacted, peer rating.
- **Availability Scheduler** — weekly grid with Google/Outlook/Apple Calendar sync cards.
- **Staggered Testimonials** — premium asymmetric glassmorphism grid layout. ✅ (Recently redesigned)
- **Shared Journals** — peer-to-peer shared journal content view.
- **My Stories** — story submission form and list.
- **Get Supervision** — professional oversight link. ✅ (Unique feature)
- **Status Toggle** — header toggle for Available/Unavailable state.
- **Quick Relief FAB + SoulBot FAB** — dual floating buttons for self-care + AI chat.
- **Settings** — dark/light mode with immediate preview. ✅

### 🔍 UI/UX Quality
- **Color Accent:** Orange-peach primary, teal secondary. Most cohesive identity.
- **Card Design:** 24px border-radius glassmorphism cards. ✅
- **Animation:** Gradient text, hover effects, staggered card reveals.
- **Design Tier:** Highest quality — benchmark for all other dashboards.

### ✅ Completed Views
- [x] Overview — Activity summary, impact chart
- [x] My Profile — Peer bio and credentials
- [x] Sessions / Appointments — Schedule view
- [x] Shared Journals — Peer-to-peer journal view
- [x] Availability — Weekly schedule + calendar sync UI
- [x] Testimonials — Premium redesigned layout
- [x] Get Supervision — Oversight CTA
- [x] Settings — Profile and preferences

### 🚧 Coming Soon Placeholders (Not Yet Built)
| View | ID | Status |
|------|----|--------|
| 📖 My Stories | `#view-stories` | 🔴 Not Built |
| ✏️ Story/Blog Editor | `#view-blogs-editor` | 🔴 Not Built |
| 📓 My Journal | `#view-journal` | 🔴 Not Built |

### ❌ Other Missing Features
1. **Calendar Sync is non-functional** — Google/Outlook/Apple buttons are UI-only, no OAuth.
2. **Impact Chart uses placeholder data** — Chart.js shows hardcoded values, not real Firebase data.
3. **"Get Supervision" is non-functional** — needs booking form or Calendly embed.
4. **No Peer Application Status** — new peers can't see their verification/onboarding status.
5. **Inline styles pollute the CSS** — maintainability concern (existing lint warnings).

---

## 3. 🩺 Psychologist Dashboard (Clinical Dashboard)

### What's There
A **professional clinical interface** for psychologists to manage their practice on Soulamore.

**Sidebar Navigation (10 items):**
`Practice (Overview)` · `My Blogs` · `Clients` · `Notes` · `Billing` · `Availability` · *Personal:* `My Journal` · `Saved Blogs` · `Messages` · `Settings`

**Key Features:**
- **Clinical Dashboard Overview** — 2-column layout with Upcoming Sessions table + Chart.js "Content Performance" chart.
- **Blog Editor** — Full Quill.js rich-text editor (title input + category + write button). Most **functional editor** in the project.
- **Blog List** — draft/published blog management with status badges.
- **Clients View** — patient roster table with search bar, status badges ("Active"), and session times.
- **Clinical Notes** — searchable note list with "+ New Note" CTA.
- **Billing & Payouts** — earnings summary with transaction history (placeholder data).
- **Availability** — weekly schedule grid + calendar sync cards.
- **Personal Section** (Journal, Saved Blogs, Messages) — self-care tools for the psychologist.
- **Portal Identity Color:** Explicitly set to Teal (`--accent-theme: #2dd4bf`).
- **✅ HTML Bug Fixed (March 12, 2026):** The structural nesting bug where `#view-clients`, `#view-notes`, `#view-availability`, `#view-saved-blogs`, `#view-settings`, and `#view-journal` were incorrectly nested inside `#view-billing` has been resolved.

### 🔍 UI/UX Quality
- **Portal Color:** Teal accent for active sidebar states and primary buttons.
- **Card Design:** 24px border-radius cards, consistent with peer dashboard.
- **Most Functional:** Richest feature set — real Quill editor, tables, structured layouts.

### ✅ Completed Views
- [x] Practice Overview — Clients summary, sessions table, content chart
- [x] Clients — Patient roster with search and status
- [x] Notes — Clinical notes with search
- [x] Billing — Earnings + transaction history (UI only)
- [x] Availability — Weekly schedule + calendar sync UI
- [x] Saved Blogs — Bookmarks view
- [x] Messages — Secure follow-up messaging
- [x] Settings — Profile, availability, credentials

### 🚧 Coming Soon Placeholders (Not Yet Built)
| View | ID | Status |
|------|----|--------|
| 📰 My Articles | `#view-blogs` | 🔴 Not Built |
| ✏️ Article Editor | `#view-blogs-editor` | 🔴 Not Built |
| 📓 My Journal | `#view-journal` | 🔴 Not Built |

### ❌ Other Missing Features
1. **Billing is all `$0.00`** — no Stripe/payment integration, no real Firebase data.
2. **Client Profiles** — "Profile" button in Clients table links nowhere.
3. **No Video Call Launch** — no "Start Session" button linking to `video-conference.html`.
4. **No Client Intake Forms** — missing pre-session questionnaire flow.
5. **Missing Light Mode Styling** — Psych dashboard didn't receive the same light mode treatment as Peer. Some elements break.
6. **No Notifications/Reminders** — no upcoming session reminders or client message alerts.

---

## 4. 🛡️ Admin Dashboard

### What's There
The admin portal is the **most minimal** of the four — a clearly a **designed skeleton/prototype**.

**Sidebar Navigation (5 items):**
`Overview` · `Content Queue` · `User Mgmt` · `Reports` · `Settings`

**Key Features:**
- **Overview KPI Cards** — 3 stat cards: Pending Approvals (12), Active Users (1,204), Flagged Content (2). All **hardcoded**.
- **Content Approval Queue** — list of pending blog/story submissions with Preview, Reject, and Approve buttons. Approve fires `alert()` only.
- **User Management Table** — one hardcoded row ("Dr. Palak Shah") with an Edit button.
- **Admin Badge** — red "Admin Mode" badge in header.
- **System Status** — hardcoded green "● Online" badge.

### 🔍 UI/UX Quality
- **Design Tier:** Prototype-level. Does not use shared `dashboard-themes.css` or `global.css` variables consistently.
- **Missing `dashboard-themes.css`** — will look completely different from other dashboards.
- **Missing SoulBot Widget** — no FAB for SoulBot or Quick Relief.
- **Minimal CSS** — basic styles, inconsistent with premium feel of other portals.
- **View consistency:** Uses `display: block` for `.view-section` instead of shared `display: flex` pattern.

### ❌ What's Missing (Critical)
1. **Not connected to Firebase** — all data is hardcoded; no real approvals, users, or flags fetched.
2. **No Firebase Admin SDK** — approve/reject actions (`alert()`) don't update Firestore.
3. **Missing `dashboard-themes.css`** — visual design system not applied.
4. **Reports view is completely empty** — `#view-reports` doesn't even exist in the HTML.
5. **Settings view is non-functional** — Settings link has no view target.
6. **No Access Control** — any authenticated user can navigate to `admin-dashboard.html`. No admin role check beyond `auth-guard.js`.
7. **No Analytics** — no real-time Firebase charts for DAU, content volume, or session counts.
8. **No Moderation Tools** — no way to ban a user, disable an account, or view user history.

---

## 📊 Feature Comparison Matrix

| Feature | User | Peer | Psych | Admin |
|---------|:----:|:----:|:-----:|:-----:|
| SoulBot FAB | ✅ | ✅ | ✅ | ❌ |
| Quick Relief Modal | ✅ | ✅ | ✅ | ❌ |
| Dark/Light Mode | ✅ | ✅ | ⚠️ Partial | ❌ |
| Journal View | 🚧 CS | 🚧 CS | 🚧 CS | — |
| Blog/Stories Editor | — | 🚧 CS | 🚧 CS | — |
| Chart.js Data Viz | — | ✅ | ✅ | ❌ |
| Real Firebase Data | ⚠️ Partial | ⚠️ Partial | ⚠️ Partial | ❌ |
| Notifications System | ❌ | ❌ | ❌ | ❌ |
| Availability Scheduler | — | ✅ | ✅ | — |
| Calendar Sync (live) | — | ❌ | ❌ | — |
| Video Session Launch | — | — | ❌ | — |
| Mobile-Ready | ⚠️ Partial | ⚠️ Partial | ⚠️ Partial | ❌ |
| Profile Photo Upload | ❌ | ❌ | ❌ | — |
| SoulBot AI (built) | ❌ | ❌ | ❌ | — |

> **Legend:** ✅ Done · 🚧 CS = Coming Soon placeholder · ⚠️ Partial · ❌ Not built · — Not applicable

---

## 🚧 Coming Soon — Shared Backlog

The following sections are **stubbed with a Coming Soon card** UI. Nav links are visible but clicking them shows a placeholder screen.

### 🤖 SoulBot AI (`#view-soulbot`)
- **Dashboard:** User
- **What to build:**
  - [ ] Production AI chat backend (API route / LLM integration)
  - [ ] Frontend chat interface as native dashboard component
  - [ ] Conversation memory / session continuity
  - [ ] Safety escalation triggers for crisis detection

### 📓 Private Journal (`#view-journal`)
- **Dashboards:** User, Peer, Psychologist
- **What to build:**
  - [ ] Firestore collection per user with encryption (client-side or Cloud KMS)
  - [ ] Rich text / markdown editor (Quill or Tiptap)
  - [ ] Entry list sidebar with date-based browsing
  - [ ] Auto-save with debounce + delete / export

### 📰 Blog / Article Publishing (`#view-blogs`, `#view-blogs-editor`, `#view-stories`)
- **Dashboards:** Peer (My Stories), Psychologist (My Articles)
- **What to build:**
  - [ ] Firestore blog collection with author ownership
  - [ ] Rich text editor with formatting toolbar
  - [ ] Draft / Published status management
  - [ ] Admin review / moderation queue before publishing
  - [ ] Category tagging (Anxiety, Depression, Relationships, etc.)

### 🔖 Saved for Later (`#view-saved`)
- **Dashboard:** User
- **What to build:**
  - [ ] Firestore `savedItems` subcollection per user
  - [ ] Bookmark button on blog cards and forum posts
  - [ ] Saved list UI with filter tabs (All / Articles / Forum)
  - [ ] Unsave / remove functionality

---

## 🚨 Priority Build Order

### 🔴 Critical (Blockers)
1. **Admin Role Check** — block non-admins from `admin-dashboard.html` (Firebase custom claims).
2. **Admin Firebase Integration** — connect approval queue to real Firestore blog/story documents.
3. **Notifications System** — bell icon with real-time Firebase alerts across all 4 dashboards.

### 🟠 High Impact
4. **Profile Photo Upload** — Firebase Storage integration for user avatars.
5. **Impact Chart Real Data** — pull actual session counts from Firestore into Peer dashboard chart.
6. **Wallet View Content** — build out `#view-wallet` placeholder for users.
7. **Video Session Launch** — link Psych client list to `video-conference.html`.

### 🟡 Nice-to-Have (Differentiators)
8. **Activate Emotional Themes** — 5 hidden themes in User dashboard are built. Just `display:block` them.
9. **Admin Analytics Charts** — real-time DAU, session and content charts using Chart.js + Firebase.
10. **Calendar Sync** — OAuth for Google/Outlook/Apple across Peer and Psych dashboards.

### 🟢 Coming Soon Features (in priority order)
11. **Journal** — most personal, high-value, standalone
12. **Saved for Later** — simple read-model, easy Firestore query
13. **Blog / Article Publishing** — needs moderation workflow, coordinate with admin
14. **SoulBot AI** — requires LLM API, safety review, most complex

---

## 🔧 Technical Debt & Known Issues

| Issue | Severity | File(s) |
|-------|----------|---------|
| Inline CSS throughout all dashboard files | ⚠️ Low | All dashboards |
| `openBlogEditor()` / `saveBlog()` JS functions referenced but unimplemented | ⚠️ Medium | `peer-dashboard.html`, `psych-dashboard.html` |
| `journal-list`, `journal-empty`, `journal-editor` DOM IDs in JS with no backend | ⚠️ Medium | All dashboards |
| Mood tracker emoji buttons fire no DB actions | ⚠️ Medium | `user-dashboard.html` |
| Admin dashboard missing `dashboard-themes.css` link | 🔴 High | `admin-dashboard.html` |
| No Firebase security rules covering blog/journal collections | 🔴 High | Firebase Console |
| No admin role enforcement (any user can visit admin portal) | 🔴 Critical | `admin-dashboard.html` |
| Psych dashboard light mode styling incomplete | ⚠️ Medium | `psych-dashboard.html` |
| Admin `alert()` used for approve/reject actions | 🔴 High | `admin-dashboard.html` |
| Chart.js data is all hardcoded across Peer + Psych dashboards | 🟠 High | `peer-dashboard.html`, `psych-dashboard.html` |

---

## 💬 Executive Summary

> **What does Soulamore have?**  
> A polished, multi-role portal system with 4 dashboards. The **Peer portal is premium** and the **User portal is emotionally smart**. The **Psych portal is functionally rich** with a real blog editor and client management tools.
>
> **What's missing?**  
> The biggest gaps are: (1) a real-time notification system across all dashboards, (2) actual Firebase data in the admin portal (it's all fake right now), (3) a working video session launch flow, and (4) the emotional themes in the user dashboard are built but hidden — activating them would be a huge differentiator.
>
> **What should we prioritize?**  
> Fix the admin dashboard security and data first (critical), then add user notifications (high ROI), then activate the emotional themes as a marketing moment.

---

## 📁 File Map

```
portal/
├── user-dashboard.html       — General user (patient/mentee)
├── peer-dashboard.html       — Peer supporter ⭐ Highest quality
├── psych-dashboard.html      — Psychologist / therapist
├── admin-dashboard.html      — Platform admin (prototype only)
└── DASHBOARD_STATUS.md       — This file (partner handoff)
```

---

> 💡 **For questions** on any of the feature designs, reach out to Aditya before starting implementation.
