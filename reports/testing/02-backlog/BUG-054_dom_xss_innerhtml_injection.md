# BUG-054: DOM XSS Vulnerability in Unsanitized innerHTML Assignments

## Ticket metadata

| Field | Value |
|---|---|
| Status | `BACKLOG` |
| Severity | `CRITICAL` |
| Priority | `P0` |
| Reporter | Antigravity Security Auditor |
| Assignee | `UNASSIGNED` |
| Tester | `UNASSIGNED` |
| Date reported | 2026-08-16 |
| Area | Security / Auth & Booking Handlers |
| Environment | Production & Staging Browsers (Chrome, Firefox, Safari) |

## Summary

Dynamic string variables (`displayName`, `user.photoURL`, `message`) are injected directly into DOM containers using `.innerHTML` without string sanitization or HTML escaping.

## Preconditions

- Required account role: Authenticated User / Peer Listener / Psychologist
- Required data or configuration: User profile containing HTML or script tags (e.g. `<img src=x onerror=alert(1)>`)
- Starting page or URL: `portal/user-dashboard-v2.html`, `portal/peer-dashboard-v2.html`, `portal/admin-dashboard-v2.html`

## Steps to reproduce

1. Update user display name or photo URL to `<img src=x onerror="alert(document.cookie)">`.
2. Navigate to `portal/admin-dashboard-v2.html` or `portal/peer-dashboard-v2.html`.
3. Observe browser execution when the user name or notification renders.

## Expected result

Display name is rendered strictly as plain text (`<img src=x...>` as text), preventing script execution.

## Actual result

The browser parses the string as active HTML DOM nodes, triggering script execution.

## Frequency

- Reproduction rate: 100%
- First observed: 2026-08-16
- Last reproduced: 2026-08-16

## Impact

High security risk. An attacker can execute arbitrary JavaScript in the context of an admin or practitioner session, potentially stealing auth tokens or performing unauthorized admin actions.

## Evidence

- [`assets/js/auth-handler.js:L92`](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-handler.js#L92)
- [`assets/js/auth-guard.js:L117`](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/auth-guard.js#L117)
- [`assets/js/booking-widget.js:L49`](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/booking-widget.js#L49)

## Acceptance criteria

- [ ] Original reproduction steps no longer fail.
- [ ] All dynamic string rendering uses `.textContent` or `DOMPurify.sanitize()`.
- [ ] Related security scans pass with zero critical XSS findings.

## Investigation notes

Identified via `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`.

## Resolution notes

### Root cause

Direct assignment of unsanitized Firebase user data to `.innerHTML`.

### Fix implemented

Pending fix in backlog sprint.

### Files modified

- `assets/js/auth-handler.js`
- `assets/js/auth-guard.js`
- `assets/js/booking-widget.js`

### Risks and limitations

None.

## Developer verification

| Field | Value |
|---|---|
| Verified by | Antigravity Scanner |
| Date | 2026-08-16 |
| Build, commit, or URL | `c02e98ff` |
| Commands or test cases | `security_scan.py` |
| Result | `FAIL` |
