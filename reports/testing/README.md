# Soulamore Collaborative Testing Playbook & Rules

Welcome to the **Soulamore Testing & QA Workspace**. This directory is structured to support a 4-person testing and development team collaborating asynchronously via a shared **Google Drive** folder linked to local PCs. 

This playbook defines our workflows, file-handling rules, and collision-prevention procedures to ensure efficient tracking and accurate delivery.

---

## 🏗️ Folder Structure (Filesystem Kanban Board)

To prevent file-syncing conflicts on Google Drive, we use a **Filesystem Kanban Board**. Instead of editing a single database or file, each bug is tracked in its own `.md` file, which is moved through folders to update its status.

```plaintext
reports/testing/
├── README.md                          # This Playbook & Rulebook
├── templates/
│   ├── BUG_TEMPLATE.md                # Template for reporting bugs
│   └── VERIFICATION_TEMPLATE.md       # Template for new feature test suites
├── 01-inbox/                          # Raw files, shared docx, and screenshots
├── 02-backlog/                        # Standardized bug reports (unassigned)
├── 03-in-progress/                    # Active developer fixes / investigation
│   ├── ADITYA/
│   ├── ABHISHEK/
│   ├── ARYAN/
│   └── YASHMEET/
├── 04-testing-verification/           # Resolved issues awaiting verification
│   ├── ADITYA/
│   ├── ABHISHEK/
│   ├── ARYAN/
│   └── YASHMEET/
└── 05-done/                           # Fully verified and closed tickets
```

---

## 🔄 Bug Lifecycle & Workflow Rules

### Phase 1: Triage & Logging (`01-inbox` ➔ `02-backlog`)
1. **Raw Sharing:** Drop any raw `.docx` reports, raw logs, or raw screenshots into `01-inbox/`.
2. **Standardization:** Convert the raw reports into a standardized Markdown bug file.
   - Open [BUG_TEMPLATE.md](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/testing/templates/BUG_TEMPLATE.md).
   - Copy its content and create a new file under `02-backlog/`.
   - **Nomenclature:** Name the file `BUG-[ID]_[Summary].md` (e.g., `BUG-001_dashboard_modal_consent.md`). Use 3 digits for IDs.
   - Fill in the metadata, steps to reproduce, actual/expected behaviors, and path to screenshots.

### Phase 2: Assignment (`02-backlog` ➔ `03-in-progress/[Assignee]`)
1. When a developer starts working on a bug:
   - Move the bug markdown file from `02-backlog/` to their assignee subfolder in `03-in-progress/` (e.g., `03-in-progress/ADITYA/`).
   - Edit the file and update the **Assignee** header field to your name.
   - Change the Status field to `🔄 IN_PROGRESS`.
2. **AI Automation Trigger:** Alternatively, if a developer/collaborator informs the AI agent: *"I wanna solve this bug"*, the agent will automatically move the ticket to their respective folder in `03-in-progress/`, assign it, and update the status to `🔄 IN_PROGRESS`.

### Phase 3: Resolution & QA Handover (`03-in-progress/[Assignee]` ➔ `04-testing-verification/[Tester]`)
1. Once the bug is fixed in the code:
   - **Resolution Logging (Mandatory):** Edit the bug file to fully document the solution details under **Resolution Notes** (specifically detailed Root Cause, Fix Implemented, and the exact list of Files Modified). This forms our permanent troubleshooting audit log.
   - Change the Status field to `⏳ PENDING_VERIFICATION`.
   - Update the **Developer Verification** section (Verified By, Date, Result: `✅ PASS`).
   - Move the file from your subfolder in `03-in-progress/` to the target tester's subfolder in `04-testing-verification/` (e.g., `04-testing-verification/ABHISHEK/` if Abhishek is the one verifying it).

### Phase 4: Final Sign-off (`04-testing-verification/[Tester]` ➔ `05-done`)
1. The tester opens their subfolder in `04-testing-verification/`, pulls the latest changes, runs the code, and executes the reproduce steps.
2. Edit the file to fill in the **Independent Tester Verification** section (Verified By, Date, Result).
3. If verification passes:
   - Change the Status field to `✅ DONE`.
   - Move the file from their verification subfolder to `05-done/`.
4. If verification fails:
   - Add details to the Verification Log.
   - Move the file back to the developer's subfolder in `03-in-progress/` (e.g., `03-in-progress/ADITYA/`) and notify them.

---

## ⚡ Google Drive & Git Sync Safety Protocols

Since the folder is synced on Google Drive and tracked in Git, follow these rules to avoid **Conflicted Copies** or **Merge Conflicts**:

1. **Move, Don't Merge:** Moving files between directories is an atomic filesystem operation. It updates the status of a ticket instantly on Google Drive without editing the file body, reducing conflicts.
2. **Single-Editor Rule:** Do not open and edit a bug ticket markdown file that has another person listed as the assignee, unless you are the tester writing a verification log.
3. **Commit often:** When you move a file, commit the change immediately in Git. Use a clear commit message format:
   ```text
   docs(testing): move BUG-001 to in-progress (assigned to [Name])
   docs(testing): move BUG-001 to verification (resolved)
   docs(testing): move BUG-001 to done (verified by [Name])
   ```
4. **Git vs Drive:** 
   - Code changes and project configuration files are managed in Git.
   - Active testing folders and attachments can be synced via Google Drive for team members who don't run Git, but standard developers should pull/push via Git to keep them in sync.

---

## 📂 Active Test Suites Nomenclature
For running full feature suites rather than individual bug reports (such as [TEST_Soulamore_Features_Suite.md](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/reports/testing/TEST_Soulamore_Features_Suite.md)):
- Name them: `TEST_[Feature-Name]_[Date].md`
- Make sure all testers update their respective status columns inside the use case tables.

---

## 🔗 How Other Team Members (e.g., Aryan) Link Their Folders

If Aryan (or anyone else) wants to link the shared Google Drive `03 - Reports` folder into his local codebase so that changes sync in real-time, he should follow these steps:

### Step 1: Identify the two paths on his PC
1. **Google Drive Sync Path:** The path where Google Drive syncs the shared folder on his PC (e.g., `G:\My Drive\Soulamore\01 - Website\03 - Reports`).
2. **Local Codebase Path:** The path to the `Soulamore-Website` directory on his PC (e.g., `C:\Users\Aryan\Desktop\Soulamore-Website`).

### Step 2: Clear the local reports directory name
To prevent link conflicts, Aryan must rename or delete the existing `reports` directory in his local codebase:
- Rename `reports` to `reports_backup` in his codebase folder.

### Step 3: Run the linking command

#### On Windows (Command Prompt - CMD):
Open Command Prompt and run the following command (replace with his actual paths):
```cmd
mklink /J "C:\path\to\local\codebase\reports" "G:\path\to\GoogleDrive\03 - Reports"
```

#### On macOS (Terminal):
On newer macOS versions, Google Drive installs under the **File Provider** framework. The default path looks like this:
`/Users/<username>/Library/CloudStorage/GoogleDrive-<email>/My Drive/.../03 - Reports`

Aryan (or the Mac user) can run:
```bash
ln -s "/Users/Aryan/Library/CloudStorage/GoogleDrive-aryan@email.com/My Drive/Projects/Soulamore/01 - Website/03 - Reports" "/Users/Aryan/Desktop/Soulamore-Website/reports"
```

> [!TIP]
> **Easiest way to get the paths on Mac without typing:**
> 1. Open Terminal.
> 2. Type `ln -s ` (make sure there is a space after `s`).
> 3. Drag and drop the Google Drive `03 - Reports` folder from Finder directly into the Terminal window. (This automatically pastes the exact path).
> 4. Press Space.
> 5. Drag and drop the local `Soulamore-Website` folder into Terminal, and type `/reports` at the end of it.
> 6. Press **Enter**.

### Step 4: Verification
The user opens their local codebase folder. They will see the `reports` folder present, and any changes they or anyone else makes will automatically sync to everyone!
Once verified, they can safely delete `reports_backup`.

