# Soulamore Testing Suite
**For:** Aditya & Abhishek

Welcome to the testing workspace. This directory is set up to support manual and automated testing of the Soulamore platform's critical features (Age Gating, Parental Consent, Cookie Banner, Dashboard Processing Consents, Security Event logs, and Data Rights).

---

## 📂 Directory Contents

*   [use_cases_report.md](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/testing/use_cases_report.md) — The main living test register listing all verified use cases, test steps, expected behaviors, and verification checklists.

---

## 🧪 Manual Testing Protocol

1.  **Check Local Dev Server**: Ensure you are running the local server (`npm run dev` or equivalent) on port 3000.
2.  **Follow the Use Case Steps**: Open [use_cases_report.md](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/testing/use_cases_report.md), select the scenario you are testing, and execute the steps.
3.  **Log Results**: 
    *   If a test passes, update the **Status** to `✅ PASS`, add your initials under **Tested By**, and log the date.
    *   If a test fails, mark it `❌ FAIL`, log the bug description, and document it in the **Updates & Testing Log** at the bottom of the file.
4.  **Version Control**: Staging and committing changes to Git (excluding files in `archive/` or other ignored temporary directories) keeps the test register unified.

---

## 🛠️ Automated Testing (Future Sprints)

The folder is structured to support Playwright E2E and Jest integration tests in future sprints. Test files should be placed under `testing/specs/` or matching component folders.
