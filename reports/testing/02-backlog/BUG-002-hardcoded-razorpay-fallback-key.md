# BUG-002: Hardcoded Client-Side Razorpay Key Fallback in payment-handler.js

## Ticket metadata

| Field | Value |
|---|---|
| Status | `BACKLOG` |
| Severity | `HIGH` |
| Priority | `P1` |
| Reporter | Antigravity Security Auditor |
| Assignee | `UNASSIGNED` |
| Tester | `UNASSIGNED` |
| Date reported | 2026-08-16 |
| Area | Payments & Billing |
| Environment | Production & Staging |

## Summary

The payment handler script contains a hardcoded fallback test key `rzp_test_S4uV6QL9r7JLPL` directly in frontend JavaScript code when order creation fails or times out.

## Preconditions

- Required account role: Public / Any User
- Required data or configuration: Session checkout attempt
- Starting page or URL: `assets/js/payment-handler.js`

## Steps to reproduce

1. Inspect source code of `assets/js/payment-handler.js` around line 65.
2. Observe `RAZORPAY_KEY_ID = 'rzp_test_S4uV6QL9r7JLPL'` assigned as fallback string.

## Expected result

No secret or key fallbacks exist in client-side code; order generation is 100% server-enforced via Firebase Functions.

## Actual result

Fallback key is exposed in raw source code.

## Frequency

- Reproduction rate: 100%
- First observed: 2026-08-16
- Last reproduced: 2026-08-16

## Impact

Security risk of key misuse and client-side payment bypassing.

## Evidence

- [`assets/js/payment-handler.js:L65`](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/payment-handler.js#L65)

## Acceptance criteria

- [ ] Hardcoded key string removed from client bundle.
- [ ] Order generation requires strict server response.

## Investigation notes

Flagged by automated security scanner.

## Resolution notes

### Root cause

Fallback mechanism designed for offline offline dev environment left in production script.

### Fix implemented

Pending fix in backlog sprint.

### Files modified

- `assets/js/payment-handler.js`

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
