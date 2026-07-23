# Soulamore Testing and QA Playbook

This directory is the shared workspace for reporting, assigning, fixing,
testing, and closing Soulamore defects. The folders act as a Kanban board:
each issue has one Markdown ticket, and its folder represents its current state.

## Source of truth

- Code and configuration are managed through Git.
- Testing tickets and attachments are stored in this shared directory.
- A ticket must exist in exactly one workflow folder at a time.
- The ticket file is the permanent audit record for that issue.
- A browser success message alone is not verification. Check stored data,
  visible UI, logs, notifications, and external delivery where applicable.

## Folder structure

```text
reports/testing/
|-- README.md
|-- templates/
|   |-- BUG_TEMPLATE.md
|   `-- VERIFICATION_TEMPLATE.md
|-- 01-inbox/
|-- 02-backlog/
|-- 03-in-progress/
|   |-- ADITYA/
|   |-- ABHISHEK/
|   |-- ARYAN/
|   `-- YASHMEET/
|-- 04-testing-verification/
|   |-- ADITYA/
|   |-- ABHISHEK/
|   |-- ARYAN/
|   `-- YASHMEET/
`-- 05-done/
```

| Folder | Meaning |
|---|---|
| `01-inbox` | Raw screenshots, recordings, logs, documents, and unprocessed reports |
| `02-backlog` | Standardized, numbered, unassigned tickets |
| `03-in-progress/NAME` | Tickets actively investigated or fixed by that developer |
| `04-testing-verification/NAME` | Resolved tickets assigned to that tester |
| `05-done` | Independently verified and closed tickets |
| `templates` | Canonical bug and test-suite templates |

## Ticket naming and unique IDs

Use:

```text
BUG-NNN_short_descriptive_summary.md
```

Example:

```text
BUG-027_peer_booking_not_visible.md
```

Use lowercase words separated by underscores. Do not put spaces, personal names,
or status names in the filename.

Before creating a ticket:

1. Search for `BUG-*.md` across every testing workflow folder.
2. Find the highest three-digit ID.
3. Use the next number.
4. Immediately create the ticket in `02-backlog` to reserve the ID.
5. Never reuse an ID, even for deleted, rejected, or duplicate reports.

If two people choose the same ID, the person whose ticket has not yet synced or
been committed must take the next ID and rename its evidence references.

PowerShell inventory:

```powershell
Get-ChildItem reports/testing -Recurse -File -Filter "BUG-*.md" |
    Sort-Object Name |
    Select-Object Name, FullName
```

## Bug lifecycle

### 1. Capture and triage

```text
01-inbox -> 02-backlog
```

1. Put raw evidence in `01-inbox`.
2. Search for an existing ticket for the same defect.
3. Reproduce the issue when safe.
4. Reserve the next unique ID.
5. Copy [BUG_TEMPLATE.md](templates/BUG_TEMPLATE.md) into `02-backlog`.
6. Rename it using the ticket naming rule.
7. Complete the metadata, environment, reproduction steps, expected result,
   actual result, impact, and evidence.
8. Set `Status` to `BACKLOG`.

Never include passwords, secret keys, tokens, cookies, private health data, or
unredacted personal information.

### 2. Assignment and investigation

```text
02-backlog -> 03-in-progress/ASSIGNEE
```

When accepting a ticket:

1. Synchronize the latest state.
2. Confirm nobody else has assigned it.
3. Move it into the developer's named folder.
4. Set `Assignee` to that developer.
5. Set `Status` to `IN_PROGRESS`.
6. Add the assignment to the Activity Log.
7. Commit or synchronize the move promptly.

An AI agent may do this only when explicitly asked to take ownership of an exact
ticket and when the assignee is known.

### 3. Resolution and QA handoff

```text
03-in-progress/DEVELOPER -> 04-testing-verification/TESTER
```

Before handoff, the developer must:

1. Record the proven root cause.
2. Explain the implemented fix.
3. List every relevant modified file.
4. Record tests and commands executed.
5. Document remaining risks or untested cases.
6. Complete Developer Verification.
7. Set `Status` to `PENDING_VERIFICATION`.
8. Assign a tester other than the developer whenever possible.
9. Move the ticket into that tester's verification folder.

Compilation alone is not sufficient verification for a user-facing defect.

### 4. Independent verification

On pass:

```text
04-testing-verification/TESTER -> 05-done
```

On failure:

```text
04-testing-verification/TESTER -> 03-in-progress/DEVELOPER
```

The tester synchronizes the fixed version, repeats the original reproduction
steps, checks every acceptance criterion, runs relevant regressions, and records
the tested build or URL plus evidence.

On pass, set `Status` to `DONE` and move the ticket to `05-done`.

On failure, set `Status` to `IN_PROGRESS`, record the failure in the Verification
Log, move the same ticket back to its developer, and notify them. Do not create a
new ticket for the same unresolved defect.

## Severity and priority

| Severity | Definition |
|---|---|
| `CRITICAL` | Security, privacy, payment, data loss, crisis safety, or complete core-workflow failure |
| `HIGH` | Major feature failure without a practical workaround |
| `MEDIUM` | Partial feature failure or a reasonable workaround exists |
| `LOW` | Minor visual, wording, or low-impact behavior issue |

| Priority | Definition |
|---|---|
| `P0` | Stop other work and respond immediately |
| `P1` | Address in the current work cycle |
| `P2` | Schedule normally |
| `P3` | Address when capacity permits |

Severity measures impact; priority measures scheduling. State the concrete impact
instead of choosing `CRITICAL` merely because an issue is inconvenient.

## Evidence and portable links

Prefer a ticket-specific folder:

```text
01-inbox/BUG-NNN/
```

Use descriptive attachment names:

```text
01-page-before.png
02-browser-console-error.png
03-network-response.json
```

Use relative Markdown links:

```markdown
[Console error](../01-inbox/BUG-027/02-browser-console-error.png)
```

Never use `file:///`, a drive letter, or a person's home-directory path in a
shared report. Redact secrets and personal data from all evidence.

## Git and Google Drive safety

Google Drive and Git can both change the same files. Moving tickets reduces
conflicts but does not eliminate them.

1. Synchronize before editing or moving.
2. Only one person edits a ticket at a time.
3. Do not edit another person's assigned ticket except as its tester or with
   explicit coordination.
4. Close editors before moving a ticket.
5. Move the existing ticket; do not copy it.
6. Confirm the old path disappeared and the new path exists.
7. Commit related code and ticket changes promptly.
8. Never silently delete a Drive conflicted copy. Compare both and preserve all
   unique history.
9. If Git and Drive disagree, stop editing, preserve both versions, coordinate
   with the assignee, and reconcile them into one canonical ticket.

Suggested commits:

```text
docs(testing): add BUG-027 peer booking visibility report
docs(testing): assign BUG-027 to Aryan
docs(testing): hand BUG-027 to Abhishek for verification
docs(testing): close BUG-027 after independent verification
```

## Feature verification suites

For a group of related test cases, use:

```text
TEST_feature_name_YYYY-MM-DD.md
```

Start from
[VERIFICATION_TEMPLATE.md](templates/VERIFICATION_TEMPLATE.md).

Each case must include prerequisites, steps, expected and actual results, tester,
date, evidence, and status. Create a separate bug ticket for each discovered
product defect.

## Linking the shared reports directory

Back up any existing local `reports` directory before linking the shared Drive
folder. Verify both paths carefully.

Windows Command Prompt:

```cmd
mklink /J "C:\path\to\Soulamore-Website\reports" "G:\path\to\GoogleDrive\03 - Reports"
```

macOS:

```bash
ln -s "/Users/NAME/Library/CloudStorage/GoogleDrive-ACCOUNT/My Drive/path/03 - Reports" "/Users/NAME/path/Soulamore-Website/reports"
```

After linking, open this README locally and verify an agreed harmless temporary
file synchronizes. Keep the backup until unique content has been reconciled.

## New-report checklist

- [ ] Search for duplicates.
- [ ] Reproduce safely.
- [ ] Reserve the next ID across all workflow folders.
- [ ] Copy the bug template into `02-backlog`.
- [ ] Use a portable filename and relative evidence links.
- [ ] Record environment, exact steps, expected result, and actual result.
- [ ] Explain concrete impact.
- [ ] Remove secrets and sensitive personal data.
- [ ] Set status to `BACKLOG`.
- [ ] Synchronize and commit promptly.
