# 🛡️ Universal Reporting Protocol (V3.0 - HARD)

This document defines the mandatory structure for all agent-generated content. All specialist agents must adhere to these rules to ensure zero-friction context resumption.

---

## 🛠️ FULL-STACK AUTONOMY
Agents are recognized as **Full-Stack Specialists**. You have the authority and responsibility to handle frontend, backend, security, and architecture tasks as required to complete your objective. Do not ask for permission for standard architectural improvements.

---

## 📁 Directory Structure
All general agent reports MUST be stored in: `reports/ADITYA/{AGENT_NAME}/`
All testing-specific plans, suites, and QA registers MUST be stored in: `reports/testing/`

```plaintext
reports/
├── ADITYA/            # General agent reports
│   ├── ANTIGRAVITY/   # Antigravity reports
│   ├── QWEN/          # Qwen Code reports
│   ├── CODEX/         # Codex reports
│   ├── CURSOR/        # Cursor reports
│   ├── KILOCODE/      # Kilocode reports
│   └── OPENCODE/      # Opencode reports
├── testing/           # Dedicated folder for testing suites & QA registers
└── PROTOCOL.md        # Local copy of this document
```

- **USER**: ADITYA
- **AGENT**: The current active agent
- **MANIFEST**: `reports/ADITYA/MANIFEST.md` must be updated after every new report.

---

## 📝 Report Naming Convention (MANDATORY)
```
{NNN}_{YYYY-MM-DD}_{AGENT}_{TYPE}_{Title}.md
```
- **NNN**: Three-digit sequential number (001, 002...). Each agent maintains their own sequence.
- **Higher number = NEWER report.**

---

## 🏁 Mandatory Handoff Sections
Every session MUST end with a report containing:

1. **✅ Completed**: Summary of production-ready work with file links.
2. **🚧 In-Progress**: Active tasks and unfinished logic.
3. **⚠️ Blockers**: Hurdles requiring user/agent attention.
4. **⏭️ Next Action**: Precise first step for the next session.

---

## 📊 Hardening Codes & Types
| Code | Type | Description |
| :--- | :--- | :--- |
| **SEC** | Security | WAF, App Check, Headers, Rules. |
| **SEO** | Search | Meta, Schema, Keywords, Vitals. |
| **PRG** | Progress | General feature implementation. |
| **BUG** | Bugfix | Troubleshooting and resolution. |
| **ARC** | Architecture | System-level design decisions. |
| **TST** | Testing | Test plans, test suites, manual verification, QA registers. |

---

## 🧪 Testing Protocol (TST)

Testing reports (e.g., test plans, test suites, manual verification checklists) serve as living registers for manual and automated feature verification. They must follow these rules:

1. **Storage & Naming**: Store all testing reports in the dedicated `reports/testing/` folder. They use a nomenclature separate from agent reports:
   ```
   TEST_[Feature_Name]_Suite.md
   ```
   *(e.g., `TEST_Soulamore_Features_Suite.md`. No sequential numbers or agent names in the filename).*
2. **Handoff Info**: Must include the standard Session Handoff sections.
3. **Use Case Structure**: Each test case must support a collaborative verification process for both Aditya (AD) and Abhishek (AB). Document them using the following format:
   - **Use Case ID & Title**
   - **Actors**
   - **Pre-conditions**
   - **Test Steps**
   - **Expected Results**
   - **Aditya (AD) Status**: `⬜ PENDING` | `✅ PASS` | `❌ FAIL [Details]`
   - **Aditya (AD) Verified Date**: Date or `—`
   - **Abhishek (AB) Status**: `⬜ PENDING` | `✅ PASS` | `❌ FAIL [Details]`
   - **Abhishek (AB) Verified Date**: Date or `—`
4. **Collaboration**: Testing reports are living registers. Both Aditya and Abhishek can directly edit their respective status and date rows in the markdown file as they execute manual or automated testing.

---

## 📚 Documentation vs Reports
| Type | Location | Content |
| :--- | :--- | :--- |
| **Docs** | `docs/` | Timeless reference (Setup guide, API specs). |
| **Reports** | `reports/ADITYA/{AGENT}/` or `reports/testing/` | Time-bound work or active verification registers. |

---

## ✅ Standards & Guardrails
- **Hardening**: No code is "done" until it is hardened for Security (CSP/Headers) and SEO (Meta/Schema).
- **Artifacts**: Link to relevant screenshots or recordings stored in `reports/assets/`.

---
*Maintained by CORE_INTELLIGENCE. (Unified: 2026-04-21)*
