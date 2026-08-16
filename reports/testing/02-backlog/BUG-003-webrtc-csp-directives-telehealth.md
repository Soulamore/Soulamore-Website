# BUG-003: Missing WebRTC Directives in Video Telehealth CSP Header

## Ticket metadata

| Field | Value |
|---|---|
| Status | `BACKLOG` |
| Severity | `MEDIUM` |
| Priority | `P2` |
| Reporter | Antigravity Security Auditor |
| Assignee | `UNASSIGNED` |
| Tester | `UNASSIGNED` |
| Date reported | 2026-08-16 |
| Area | Portal / Telehealth Video |
| Environment | Production & Staging Browsers |

## Summary

The Content Security Policy (CSP) tag in `portal/video-conference.html` lacks explicit `media-src` and `connect-src` directives for Jitsi WebRTC media and WebSocket connections (`meet.jit.si`).

## Preconditions

- Required account role: Patient / Peer / Psychologist
- Required data or configuration: Active session booking
- Starting page or URL: `portal/video-conference.html`

## Steps to reproduce

1. Open `portal/video-conference.html?roomId=test-123` in a strict CSP enforcement browser environment.
2. Check browser developer console for CSP violation notices regarding `wss://meet.jit.si`.

## Expected result

Video room connects smoothly with clean console and active media streams.

## Actual result

Browser emits CSP connect-src warnings for external WebRTC signal servers.

## Frequency

- Reproduction rate: Intermittent depending on browser strictness
- First observed: 2026-08-16
- Last reproduced: 2026-08-16

## Impact

Telehealth video sessions may experience blocked audio/video streams on strict enterprise networks.

## Evidence

- [`portal/video-conference.html`](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/video-conference.html)

## Acceptance criteria

- [ ] `connect-src wss://meet.jit.si https://meet.jit.si; media-src 'self' blob:;` added to CSP meta tag.

## Investigation notes

Audited during V2 portal verification.

## Resolution notes

### Root cause

Missing explicit WebRTC transport directives in `<meta http-equiv="Content-Security-Policy">`.

### Fix implemented

Pending fix in backlog sprint.

### Files modified

- `portal/video-conference.html`

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
