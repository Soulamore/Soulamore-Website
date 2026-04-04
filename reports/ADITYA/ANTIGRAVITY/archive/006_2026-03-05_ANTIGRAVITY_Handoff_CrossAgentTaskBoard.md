# Cross-Agent Task Board (2026-03-05)

## Already Done (This Pass)
| Area | Files | Outcome |
|---|---|---|
| Light-mode text softening | `assets/css/theme.css` | Shifted light-mode typography from hard black to slate tones for better brand feel. |
| Gradient patch prevention | `assets/css/global.css` | Added conditional gradient-heading safety; removed global heading force that caused rectangle patches. |
| Peer page path/orb contrast | `our-peers/about.html` | Curved path and orb made visible in light mode, with stronger section card contrast. |
| Psychologist slider contrast | `our-psychologists/about.html` | Slider track/thumb/outcome card updated for clear readability in light mode. |
| Mental Playground cards | `tools/playground.html` | Card surfaces/text/icons corrected from muddy gray to proper light-mode card treatment. |
| Legal page visibility | `company/legal.html` | Fixed light-mode tab/content card readability and made card text visible. |
| Away page cleanup | `spaces/soulamore-away/index.html` | Fixed mojibake strings/icons + postcard/challenge card light-mode contrast. |
| Assessments readability | `spaces/assessments/index.html` | Added light-mode contrast layer for hero/filter/cards and removed mojibake artifacts. |
| Crisis quote encoding | `get-help-now.html` | Corrected mojibake copy in emergency/calm/quote blocks. |
| Audit refresh | `reports/contrast-scan.json` + audit docs | Scanner rerun and remaining actionable file list updated. |
| Gradient patch root fix (light mode) | `assets/css/global.css` | Narrowed gradient heading rules to real text-gradient classes only; removed generic `h1/h2/h3` clipping that caused dark rectangular patches. |
| Peer hero parity with index style | `our-peers/about.html` | Updated subhead accent and strengthened path/orb visibility in light mode. |
| Mojibake cleanup (active pages) | `join-us/*`, `our-psychologists/*`, `spaces/soulamore-workplace/*`, `pages/seed-wall.html`, `tools/drop-it.html`, `tools/confession-box/*`, `spaces/campus/student-faqs.html` | Fixed corrupted symbols/text (checkmark, rupee, not-equal, emoji/control-glyph artifacts). |
| Global light-mode login CTA polish | `assets/css/global.css` | Updated `Log In / Sign Up` to a softer teal gradient with better readability and hover state in light mode. |
| Problem Wall theme split + header alignment | `pages/problem-wall.html` | Removed always-light header behavior, added theme-scoped header rules, and implemented true midnight dark mode + readable light mode for hero/notes/stats/widgets. |
| Home stickers alignment/content polish | `index.html` | Moved left/right floating stickers closer to hero without overlap and updated CTA copy (`You can start here`). |
| Peer hero gradient restore | `our-peers/about.html` | Restored teal→peach gradient headline behavior in light mode with stronger selector override. |
| Assessment card polish (light mode) | `spaces/assessments/index.html` | Softened card heading contrast and replaced dark tag pills with clean teal-tint tags. |

## Latest Notes (Post-Patch)
1. Removed an over-broad light-mode rule that forced gradient clipping on generic headings; this was the primary source of the "dark patch" blocks reported on index and other pages.
2. Softened forced heading/card text in light mode from hard black to semantic slate tokens (`--text-strong`, `--text-body`) for brand-consistent contrast.
3. Added targeted encoding repair pass for files containing C1 mojibake artifacts and then patched remaining known symbol strings manually.

## Current Baseline
- `scannedAt`: `2026-03-05T17:03:26.842Z`
- `totalFiles`: `118`
- `darkBodyWithoutLightMode`: `57`
- `lowOpacityTextFiles`: `106`
- `hardcodedDarkSurfaceFiles`: `87`

## To Be Done (Actionable)
1. P1: Add page-local `body.light-mode` blocks on remaining `54` non-excluded dark-body pages (listed in `reports/LIGHT_MODE_CONTRAST_AUDIT_2026-03-05.md`).
2. P1: Reduce low-opacity body text on high-traffic pages (`index`, `spaces/campus/*`, `tools/*`, `our-*`, `company/*`).
3. P1: Replace hardcoded dark inline backgrounds with semantic surface classes progressively.
4. P2: Final visual QA matrix (desktop/mobile, both themes) and deploy readiness pass.

## Shell Audit (Production-Only)
This section is separate from the contrast audit. It tracks shared header/footer normalization only.

### Excluded From Shell Normalization
Do not treat these as missing-header bugs in current remediation.

1. Under active developer work:
- `auth/signup.html`
- `auth/signup-success.html`
- `portal/admin-dashboard.html`
- `portal/blog-editor.html`
- `portal/logout.html`
- `portal/peer-dashboard.html`
- `portal/peer-setup.html`
- `portal/psych-dashboard.html`
- `portal/psych-dashboard-cal.html`
- `portal/psych-setup.html`
- `portal/signup-success.html`
- `portal/verify-email.html`
- `portal/video-conference.html`
- `pages/seed-wall.html`
- `spaces/assessments/engine.html`
- `spaces/assessments/smart-start.html`
- `spaces/soulamore-away/mailbox.html`

2. Intentional immersive / game-like tools that may remain chrome-free:
- `tools/breathing.html`
- `tools/drop-it.html`
- `tools/glossary.html`
- `tools/soulbot-chat.html`
- `tools/soul-rider.html`

### Actionable Shared-Shell Gaps
These are production pages still needing normalization to the shared shell contract (`components.js` + `#main-header` + `#main-footer`).

1. Auth / portal live pages
- `portal/login.html`
- `portal/forgot-password.html`
- `portal/signup.html`
- `portal/messaging.html`
- `portal/user-dashboard.html`

2. High-traffic public pages
- `resources/start-here.html`
- `pages/problem-wall.html`
- `spaces/assessments/index.html`
- `spaces/campus/index.html`
- `our-peers/about.html`
- `our-peers/index.html`
- `our-psychologists/about.html`
- `our-psychologists/psychologists.html`

3. Company pages
- `company/about.html`
- `company/contact.html`
- `company/legal.html`
- `company/for-parents.html`
- `company/press.html`
- `company/privacy-policy.html`
- `company/news-archive.html`
- `company/anonymous-voices.html`
- `company/why-soulamore-exists.html`

4. Community pages
- `community/support-groups/support-groups.html`
- `community/support-groups/expats-germany.html`
- `community/support-groups/habits-compulsions.html`
- `community/support-groups/neurodivergence.html`
- `community/support-groups/relationships.html`
- `community/support-groups/students-india.html`
- `community/support-groups/women-circles.html`
- `community/blogs/blogs.html`
- `community/blogs/blog-detail.html`
- `community/blogs/author.html`
- `community/community-calendar.html`
- `community/forum/forum.html`

5. Join-us / profile pages
- `join-us/index.html`
- `join-us/peer-onboarding.html`
- `join-us/peer-thank-you.html`
- `join-us/psychologist.html`
- `join-us/psychologist-onboarding.html`
- `join-us/psychologist-thank-you.html`
- `our-peers/profile.html`
- `our-peers/mental-wellness/profile.html`
- `our-peers/zoya.html`
- `our-psychologists/bhagyavathi.html`
- `our-psychologists/palak-shori.html`
- `our-psychologists/_psychologist-template.html`

6. Space / tool pages still on partial shell
- `spaces/campus/anxiety-and-overthinking.html`
- `spaces/campus/campus-ambassadors.html`
- `spaces/campus/exam-pressure.html`
- `spaces/campus/feeling-low.html`
- `spaces/campus/institutions.html`
- `spaces/campus/loneliness.html`
- `spaces/campus/safety-boundaries.html`
- `spaces/campus/student-faqs.html`
- `spaces/campus/student-resources.html`
- `spaces/campus/what-is-campus.html`
- `spaces/soulamore-away/index.html`
- `spaces/soulamore-away/resources.html`
- `spaces/soulamore-away/who-its-for.html`
- `tools/5-step-reset.html`
- `tools/confession-box/guidelines.html`
- `tools/confession-box/index.html`
- `tools/playground.html`
- `tools/soulbot.html`
- `tools/vent-box.html`

### Shell Priority Order
1. Fix auth/portal live pages first.
2. Normalize high-traffic public pages second.
3. Then clear company/community clusters.
4. Leave excluded dev pages and immersive tools untouched unless explicitly requested.

## Suggested Agent Split
1. Agent A: `spaces/*` + `tools/*`.
2. Agent B: `company/*` + `community/*` + `our-*`.
3. Agent C: `join-us/*` + `auth/*` + `portal/*`.
4. Agent D: final screenshot QA + regression checklist + report consolidation.

