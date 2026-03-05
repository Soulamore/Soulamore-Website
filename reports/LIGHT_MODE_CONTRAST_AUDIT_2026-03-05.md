# Light Mode Contrast Audit (2026-03-05)

## Scope
- Included: public pages, spaces, tools, join-us, auth, portal.
- Excluded: `_BACKUPS/**`, `Git Tools Open Source/**`, `journal/**`, `journal-lab/**`, `node_modules/**`, email templates.

## Current Scanner Snapshot
- Source: `reports/contrast-scan.json`
- `scannedAt`: `2026-03-05T17:03:26.842Z`
- `totalFiles`: `118`
- `darkBodyWithoutLightMode`: `57`
- `lowOpacityTextFiles`: `106`
- `hardcodedDarkSurfaceFiles`: `87`

## This Pass (Implemented)
1. Foundation
- `assets/css/theme.css`
  - Softened light-mode text tokens from hard black to slate tones:
    - `--text-primary: #1f2d3d`
    - `--text-secondary: #526377`
    - `--text-strong: #1f2d3d`
    - `--text-body: #42556d`
    - `--text-soft: #667a92`

2. Global safety and gradient patch prevention
- `assets/css/global.css`
  - Added final light-mode safety layer:
    - slate text defaults for body copy elements (`p`, `li`, `small`, `label`, subtitle/meta classes),
    - removed broad forced heading-color override that caused gradient heading regressions.
  - Added conditional gradient fallback:
    - if heading has `background: linear-gradient` but not transparent text fill, strip gradient in light mode and use readable text color,
    - keep clipping only for true gradient-text headings.

3. Targeted page fixes from visual reports
- `our-peers/about.html`
  - Increased orbit/path visibility in light mode (`#motion-path` stroke strength and dash).
  - Increased orb glow and card border/shadow readability.
- `our-psychologists/about.html`
  - Upgraded light-mode slider contrast:
    - brighter card surfaces,
    - stronger track/thumb contrast,
    - readable outcome card colors.
- `tools/playground.html`
  - Reworked light-mode activity cards:
    - white surfaces, proper borders/shadows,
    - slate text/body copy,
    - icon chips no longer washed into gray cards.
- `company/legal.html`
  - Fixed light-mode tab/card readability where card content appeared blank.
- `spaces/soulamore-away/index.html`
  - Fixed postcard and hero mojibake artifacts, improved light-mode card/form contrast.
- `spaces/assessments/index.html`
  - Added light-mode card/filter/readability contract and removed text mojibake artifacts.
- `get-help-now.html`
  - Fixed visible mojibake quote/copy strings.

## Actionable Remaining (Not Excluded)
`54` pages still have dark-body patterns without local `body.light-mode` blocks by scanner heuristic:

`404.html`, `auth/signup-success.html`, `auth/signup.html`, `community/community-calendar.html`, `community/forum.html`, `community/support-groups.html`, `company/contact.html`, `company/privacy-policy.html`, `join-us/index.html`, `join-us/peer-onboarding.html`, `join-us/peer-thank-you.html`, `join-us/peer.html`, `join-us/psychologist-onboarding.html`, `join-us/psychologist-thank-you.html`, `New Pages/Peer Landing.html`, `newsletter.html`, `our-peers/index.html`, `our-peers/zoya.html`, `our-psychologists/bhagyavathi.html`, `our-psychologists/palak-shori.html`, `our-psychologists/profile.html`, `our-psychologists/psychologists.html`, `pages/problem-wall.html`, `pages/seed-wall.html`, `portal/blog-editor.html`, `portal/logout.html`, `portal/peer-setup.html`, `portal/psych-setup.html`, `portal/signup-success.html`, `portal/verify-email.html`, `portal/video-conference.html`, `profile.html`, `spaces/assessments/landing.html`, `spaces/assessments/results.html`, `spaces/campus/index.html`, `spaces/campus/institutions.html`, `spaces/campus/safety-boundaries.html`, `spaces/campus/student-faqs.html`, `spaces/campus/what-is-campus.html`, `spaces/soulamore-away/mailbox.html`, `spaces/soulamore-away/resources.html`, `spaces/soulamore-away/who-its-for.html`, `spaces/soulamore-workplace/guidelines.html`, `spaces/soulamore-workplace/index.html`, `spaces/soulamore-workplace/plans.html`, `tools/5-step-reset.html`, `tools/breathing.html`, `tools/confession-box/guidelines.html`, `tools/confession-box/index.html`, `tools/drop-it.html`, `tools/glossary.html`, `tools/soulbot.html`, `tools/vent-box.html`.

## Risks / Notes
- This scanner is intentionally conservative and pattern-based; some pages may still look fine despite being flagged.
- The largest remaining risk remains page-level hardcoded dark surfaces + low-opacity copy in light mode.

