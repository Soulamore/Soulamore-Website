# BUG-004: Missing Image Alt Attributes in Legacy Templates

## Ticket metadata

| Field | Value |
|---|---|
| Status | `BACKLOG` |
| Severity | `LOW` |
| Priority | `P3` |
| Reporter | Antigravity SEO Auditor |
| Assignee | `UNASSIGNED` |
| Tester | `UNASSIGNED` |
| Date reported | 2026-08-16 |
| Area | SEO & Accessibility |
| Environment | Production & Staging Pages |

## Summary

11 presentation `<img>` tags across legacy template pages are missing descriptive `alt` attribute text, causing accessibility and Lighthouse SEO audit penalties.

## Preconditions

- Required account role: Public
- Required data or configuration: None
- Starting page or URL: `pages/get-help-now.html`, `claude give off/admin-dashboard.html`

## Steps to reproduce

1. Run `python .agent/skills/seo-fundamentals/scripts/seo_checker.py .`.
2. Inspect image validation summary.

## Expected result

100% of images contain valid descriptive `alt` attributes.

## Actual result

11 image elements flag `missing_alt` warnings.

## Frequency

- Reproduction rate: 100%
- First observed: 2026-08-16
- Last reproduced: 2026-08-16

## Impact

Slight SEO score reduction and screen reader accessibility issue.

## Evidence

- Output of `seo_checker.py`.

## Acceptance criteria

- [ ] All 11 `<img>` tags updated with descriptive `alt` attributes.

## Investigation notes

Audited during site-wide SEO pass.

## Resolution notes

### Root cause

Missing `alt=""` attributes on decorative/brand images in legacy HTML files.

### Fix implemented

Pending fix in backlog sprint.

### Files modified

- `pages/get-help-now.html`
- `claude give off/admin-dashboard.html`

### Risks and limitations

None.

## Developer verification

| Field | Value |
|---|---|
| Verified by | Antigravity SEO Checker |
| Date | 2026-08-16 |
| Build, commit, or URL | `c02e98ff` |
| Commands or test cases | `seo_checker.py` |
| Result | `FAIL` |
