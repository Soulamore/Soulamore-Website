# Multi-Agent Coordination & Reports Protocol

**Last Updated:** March 25, 2026  
**Status:** ✅ ENFORCED

---

## 🚩 READ BEFORE ACTING
Agents **MUST** read the most recent reports in **ALL** subdirectories of `reports/` before starting any task. This ensures context is maintained across different AI tools and you are aware of recent architectural changes, known bugs, and scheduled content.

## 🛠️ FULL-STACK AUTONOMY
Agents are recognized as versatile **Full-Stack Developers** with no restricted roles. You have the authority and are expected to handle frontend, backend, security, and architecture tasks as required to complete your objective.

---

## 📁 FOLDER STRUCTURE

### ✅ Correct Location for Reports
All agent reports MUST be in: `reports/ADITYA/{AGENT_NAME}/`

**Structure:**
```
reports/
├── ADITYA/
│   ├── QWEN/          # Qwen Code reports
│   ├── ANTIGRAVITY/   # Antigravity reports
│   ├── CODEX/         # Codex reports
│   ├── CURSOR/        # Cursor reports
│   ├── KILOCODE/      # Kilocode reports
│   └── OPENCODE/      # Opencode reports
└── ABHISHEK/          # অভিষেক's work folder
```

### ❌ Wrong Locations (Should be moved)
- `docs/` - Only for actual documentation (guides, specs, manuals)
- `portal/` - Only for dashboard files
- Root directory - No reports here

---

## 📝 REPORT NAMING CONVENTION

### Standard Format (MANDATORY)
```
{NUMBER}_{YYYY-MM-DD}_{AGENT_NAME}_{Type}_{Title}.md
```

**Examples:**
- `040_2026-03-25_ANTIGRAVITY_Fix_AdminDashboardRouting.md`
- `002_2026-03-25_QWEN_Plan_NewFeatureBrainstorm.md`

### Numbering System
- **Three-digit number** (001, 002, 003...)
- **Each agent maintains their own sequence** in their folder.
- **Higher number = NEWER report.**
- **Continue sequentially** across sessions (don't reset).

### Report Types
- **Report** - General status/update
- **Plan** - Implementation plan
- **Handoff** - Agent handoff document
- **Audit** - Security/code audit
- **Fix** - Bug fix documentation
- **Guide** - How-to documentation

---

## 🏁 MANDATORY HANDOFF SECTIONS
Every session **MUST** end with a report containing:

### ✅ Completed
- Summary of production-ready work finished in this session.
- **Links**: Reference specific files or line numbers changed.

### 🚧 In-Progress
- Current state of active tasks.
- Unfinished logic or pending implementations.

### ⚠️ Blockers
- Hurdles requiring attention from the user or other agents.

### ⏭️ Next Action
- The precise first step for the next session to ensure zero friction during resumption.

---

## 📚 DOCUMENTATION vs REPORTS

| Type | Location | Content |
|------|----------|---------|
| **Docs** | `docs/` | Timeless reference (Setup guide, API specs, Manuals) |
| **Reports** | `reports/ADITYA/{AGENT}/` | Time-bound work (Session reports, Fix logs, Plans) |

---

## 🔄 MOVING EXISTING REPORTS
If you find a report in the wrong location:
1. Identify the agent from the header/content.
2. Move to the correct `reports/ADITYA/{AGENT}/` folder.
3. Update internal links if necessary.
4. Delete duplicate copies.

---

## 🔍 VERIFICATION
Before finishing your session:
1. Check root for any stray `.md` reports.
2. Ensure `docs/` only contains reference material.
3. Verify your report follows the `NNN_YYYY-MM-DD` naming convention.

---

*Maintained by the Soulamore Dev Team.*
