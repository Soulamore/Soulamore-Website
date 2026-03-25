# Soulamore Dashboard Status and Handoff

> Date: March 12, 2026
> Status: Audit complete
> Prepared for: Development partner / feature owners

This document answers two questions across all four dashboard surfaces:
- What is already built?
- What is still missing or only scaffolded?

---

## Portal Landscape Overview

Soulamore currently has four dashboard surfaces:

| Portal | File | Role | Current Design Tier |
|---|---|---|---|
| User Dashboard | `portal/user-dashboard.html` | Core member experience | Good |
| Peer Dashboard | `portal/peer-dashboard.html` | Volunteer peer experience | Premium |
| Psych Dashboard | `portal/psych-dashboard.html` | Psychologist practice management | Good |
| Admin Dashboard | `portal/admin-dashboard.html` | Platform management and moderation | Prototype |

---

## 1. User Dashboard

### What Exists
The user dashboard is the most emotionally framed of the four. It is built around support, reflection, and lightweight recovery tools rather than admin-heavy operations.

Sidebar navigation currently exposes:
- `Home`
- `My Journal`
- `My Sessions`
- `Peer Guidelines`
- `SoulBot AI`
- `Messages`
- `Saved`
- `My Wallet`
- `My Profile`
- `Settings`

Key implemented patterns:
- SoulBot hero card on home
- Quick Relief floating action button with modal tools
- Split CTA cards for peer support and psychologist help
- Mood tracker widget on Peer Guidelines
- dark/light theme toggle
- hidden emotional theme system in code

### Completed Views
- Home
- Progress
- Discover
- Community / Forum scaffold
- Sessions
- Appointments
- Messages
- Settings

### Coming Soon / Stub Views
- `#view-soulbot`
- `#view-journal`
- `#view-saved`

### Missing or Incomplete
1. Wallet view has no real implementation.
2. Mood tracker buttons do not persist anything.
3. No onboarding or first-run guidance.
4. No notifications system.
5. No in-dashboard posting/reacting flow for community content.
6. Emotional themes exist in code but are hidden.
7. No profile photo upload flow.

### UX Notes
- Strong emotional tone and framing.
- Good visual hierarchy.
- Dark mode is in good shape.
- User dashboard has real product personality but still depends on placeholders in key areas.

---

## 2. Peer Dashboard

### What Exists
This is currently the strongest dashboard in terms of polish and visual maturity.

Sidebar navigation currently exposes:
- `Overview`
- `My Profile`
- `Sessions`
- `Shared Journals`
- `My Stories`
- `Availability`
- `Testimonials`
- `My Journal`
- `Saved Blogs`
- `Get Supervision`
- `Settings`

Key implemented patterns:
- impact overview with charts
- availability scheduler UI
- redesigned testimonials grid
- shared journals view
- supervision CTA
- availability status toggle
- Quick Relief FAB
- SoulBot FAB
- dark/light mode support

### Completed Views
- Overview
- My Profile
- Sessions / Appointments
- Shared Journals
- Availability
- Testimonials
- Get Supervision
- Settings

### Coming Soon / Stub Views
- `#view-stories`
- `#view-blogs-editor`
- `#view-journal`

### Missing or Incomplete
1. Calendar sync cards are UI-only.
2. Impact chart still uses placeholder values.
3. Supervision flow is not functionally wired.
4. No peer verification/application progress state.
5. Still carries maintainability debt from inline styling.

### UX Notes
- Best visual benchmark among the four dashboards.
- Strongest premium feel.
- Good candidate to use as the design standard for the rest.

---

## 3. Psychologist Dashboard

### What Exists
The psychologist dashboard is the most functionally ambitious. It includes editing, client management, notes, and a more structured workflow than the user or peer dashboards.

Sidebar navigation currently exposes:
- `Practice`
- `My Blogs`
- `Clients`
- `Notes`
- `Billing`
- `Availability`
- `My Journal`
- `Saved Blogs`
- `Messages`
- `Settings`

Key implemented patterns:
- clinical overview layout
- Quill-based editor surface
- client roster table
- clinical notes list
- billing and payout scaffold
- availability scheduler UI
- saved content view
- messages view
- settings view

Important fix already completed:
- The major nesting bug where several views were incorrectly nested inside billing has already been fixed.

### Completed Views
- Practice overview
- Clients
- Notes
- Billing UI scaffold
- Availability
- Saved Blogs
- Messages
- Settings

### Coming Soon / Stub Views
- `#view-blogs`
- `#view-blogs-editor`
- `#view-journal`

### Missing or Incomplete
1. Billing is placeholder-only.
2. Client profile buttons do not route anywhere meaningful.
3. No video session launch path.
4. No client intake / pre-session questionnaire workflow.
5. Light mode is weaker than peer dashboard and still visually inconsistent.
6. No reminder / notification system.

### UX Notes
- Strong structure.
- Functional editor is a meaningful asset.
- Needs theming and workflow completion more than total redesign.

---

## 4. Admin Dashboard

### What Exists
The admin dashboard is still a prototype shell. It has the least product maturity and the most structural risk.

Sidebar navigation currently exposes:
- `Overview`
- `Content Queue`
- `User Mgmt`
- `Reports`
- `Settings`

Current implemented patterns:
- hardcoded KPI cards
- hardcoded approval queue
- hardcoded user management row
- admin mode badge
- static online indicator

### Missing or Critical Gaps
1. No real Firebase data connection.
2. Approve/reject flows still use placeholder `alert()` behavior.
3. Does not consistently use the shared dashboard theme system.
4. Reports view is effectively missing.
5. Settings target is not functionally implemented.
6. Admin access control is insufficient.
7. No analytics implementation.
8. No moderation tooling for bans, suspension, or history review.

### UX Notes
- This is clearly still prototype-stage.
- It should not be considered production-ready.
- It needs both security work and UI system alignment.

---

## Feature Comparison Matrix

| Feature | User | Peer | Psych | Admin |
|---|:---:|:---:|:---:|:---:|
| SoulBot FAB | Yes | Yes | Yes | No |
| Quick Relief Modal | Yes | Yes | Yes | No |
| Dark/Light Mode | Yes | Yes | Partial | No |
| Journal View | Coming Soon | Coming Soon | Coming Soon | N/A |
| Blog / Story Editor | N/A | Coming Soon | Coming Soon | N/A |
| Chart.js Visuals | No meaningful use | Yes | Yes | No |
| Real Firebase Data | Partial | Partial | Partial | No |
| Notifications | No | No | No | No |
| Availability Scheduler | N/A | Yes | Yes | N/A |
| Calendar Sync | N/A | No | No | N/A |
| Video Session Launch | N/A | N/A | No | N/A |
| Mobile Readiness | Partial | Partial | Partial | Weak |
| Avatar Upload | No | No | No | N/A |
| Native SoulBot View Built | No | No | No | N/A |

Legend:
- `Yes` = usable
- `Partial` = scaffold exists but not complete
- `Coming Soon` = placeholder only
- `No` = missing
- `N/A` = not relevant for that role

---

## Shared Backlog Across Dashboards

### SoulBot Native Dashboard Surface
Relevant to:
- User dashboard primarily
- optionally peer / psych later

Needed:
- production chat backend
- native dashboard chat component
- memory / continuity model
- crisis escalation logic

### Private Journal
Relevant to:
- User
- Peer
- Psych

Needed:
- per-user persisted journal data
- editor surface
- list / browse model
- autosave and export

### Blog / Story Publishing
Relevant to:
- Peer stories
- Psych articles
- Admin moderation

Needed:
- document model
- draft / publish lifecycle
- moderation gate
- categories / ownership

### Saved for Later
Relevant to:
- User dashboard

Needed:
- saved items collection
- bookmark actions
- filtered saved content view

---

## Priority Build Order

### Critical
1. Admin access control.
2. Admin real data wiring.
3. Cross-dashboard notifications system.

### High Impact
4. Profile photo upload.
5. Real peer impact data.
6. Wallet implementation.
7. Video session launch from psych dashboard.

### Product Differentiators
8. Turn on emotional theme system in user dashboard.
9. Add real admin analytics.
10. Wire calendar sync.

### Coming Soon Views To Build In Order
11. Journal
12. Saved for Later
13. Blog / Story publishing
14. SoulBot native dashboard experience

---

## Technical Debt and Known Issues

| Issue | Severity | Files |
|---|---|---|
| Heavy inline styling across dashboards | Medium | All dashboard files |
| Stub JS hooks referenced without full implementation | Medium | Peer and Psych dashboards |
| Journal DOM scaffolds without persisted backend | Medium | User / Peer / Psych |
| Mood tracker without DB actions | Medium | `portal/user-dashboard.html` |
| Admin dashboard missing full dashboard theme integration | High | `portal/admin-dashboard.html` |
| No strict admin role enforcement | Critical | `portal/admin-dashboard.html` |
| Approve/reject still uses alerts | High | `portal/admin-dashboard.html` |
| Psych dashboard light mode incomplete | Medium | `portal/psych-dashboard.html` |
| Chart values still hardcoded in multiple dashboards | High | `portal/peer-dashboard.html`, `portal/psych-dashboard.html` |
| No security-rule coverage for several future collections | High | Firebase / backend rules |

---

## Executive Summary

Soulamore already has a meaningful four-dashboard ecosystem, but they are not at the same maturity level.

- The peer dashboard is the visual benchmark.
- The user dashboard has the strongest emotional product framing.
- The psychologist dashboard has the richest workflow scaffolding.
- The admin dashboard is still a prototype and is the biggest operational risk.

The most important work is not new visual design. It is:
1. admin security and real data wiring
2. notifications
3. workflow completion in psych and peer surfaces
4. unlocking differentiators already hidden in code, especially emotional themes

---

## File Map

```text
portal/
|-- user-dashboard.html
|-- peer-dashboard.html
|-- psych-dashboard.html
|-- admin-dashboard.html
`-- DASHBOARD_STATUS.md
```

This file should be treated as the current dashboard build-status reference.
