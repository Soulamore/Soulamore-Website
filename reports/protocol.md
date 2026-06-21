# 🛡️ Universal Reporting Protocol (V3.0 - HARD)

This document defines the mandatory structure for all agent-generated content. All specialist agents must adhere to these rules to ensure zero-friction context resumption.

---

## 🛠️ FULL-STACK AUTONOMY
Agents are recognized as **Full-Stack Specialists**. You have the authority and responsibility to handle frontend, backend, security, and architecture tasks as required to complete your objective. Do not ask for permission for standard architectural improvements.

---

## 📁 Directory Structure
All reports MUST be stored in: `reports/ADITYA/{AGENT_NAME}/`

```plaintext
reports/
├── ADITYA/
│   ├── ANTIGRAVITY/   # Antigravity reports
│   ├── QWEN/          # Qwen Code reports
│   ├── CODEX/         # Codex reports
│   ├── CURSOR/        # Cursor reports
│   ├── KILOCODE/      # Kilocode reports
│   └── OPENCODE/      # Opencode reports
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

---

## 📚 Documentation vs Reports
| Type | Location | Content |
| :--- | :--- | :--- |
| **Docs** | `docs/` | Timeless reference (Setup guide, API specs). |
| **Reports** | `reports/ADITYA/{AGENT}/` | Time-bound work (Session reports, Fix logs). |

---

## ✅ Standards & Guardrails
- **Hardening**: No code is "done" until it is hardened for Security (CSP/Headers) and SEO (Meta/Schema).
- **Artifacts**: Link to relevant screenshots or recordings stored in `reports/assets/`.

---
*Maintained by CORE_INTELLIGENCE. (Unified: 2026-04-21)*
