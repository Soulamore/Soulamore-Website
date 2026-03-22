# Multi-Agent Coordination Protocol

> [!IMPORTANT]
> This folder is the centralized hub for intelligence sharing between AI systems working on Soulamore.

## 🚩 READ BEFORE ACTING
Agents **MUST** read the most recent reports in **ALL** subdirectories of `Reports/` before starting any task. This ensures context is maintained across different AI tools and you are aware of recent architectural changes, known bugs, and scheduled content.

## 🛠️ FULL-STACK AUTONOMY
Agents are recognized as versatile **Full-Stack Developers** with no restricted roles. You have the authority and are expected to handle frontend, backend, security, and architecture tasks as required to complete your objective.

## 👥 The Development Team (Co-Managed)
The intelligence is segregated by user to track commits and work streaks, while remaining shared for cross-tool context.

### 🏠 User: ADITYA
Folders: `Reports/ADITYA/[ANTIGRAVITY, QWEN, OPENCODE, CURSOR, CODEX, KILOCODE]/`

### 🏘️ User: ABHISHEK
Folders: `Reports/ABHISHEK/[ANTIGRAVITY, QWEN, OPENCODE, CURSOR, CODEX, KILOCODE]/`

## 📝 DOCUMENTATION & CROSS-VERIFICATION
1. **DOCUMENT YOUR WORK**: After completing a task, refactor, or audit, post a comprehensive `.md` report to your designated folder.
2. **CROSS-VERIFICATION**: If you identify a conflict between your logic and a previous report from another agent, highlight it in your post and ask for user clarification.

## 📝 NAMING CONVENTION

### Standard Format
Every file in the reports folder **MUST** follow: `YYYY-MM-DD_[AGENT]_[CATEGORY]_[TITLE].md`.
- **Example**: `2026-03-16_ANTIGRAVITY_Handoff_CentralizedCoordination.md`

### Numbering System (For Sequential Ordering) - MANDATORY
To enable easy identification of report chronology, agents **MUST** add a sequential number prefix:

**Format:** `NNN_YYYY-MM-DD_[AGENT]_[CATEGORY]_[TITLE].md`

**Rules:**
1. **Three-digit number** (001, 002, 003...)
2. **001 = OLDEST report** (created first)
3. **Higher number = NEWER report** (created later)
4. **Highest number = LATEST report** (most recent)
5. **Agent-specific** (each agent maintains their own numbering in their folder)
6. **Continue sequentially** (don't reset monthly)

**Examples:**
- `001_2026-03-19_QWEN_Initial_Report.md` (First report created - OLDEST)
- `050_2026-03-20_QWEN_Mid_Session_Report.md` (Middle of session)
- `088_2026-03-22_QWEN_Final_Recovery.md` (Last report created - LATEST)

**View Reports (Oldest to Latest):**
```bash
# Windows - Oldest at top, Latest at bottom
dir reports\ADITYA\QWEN\*.md /b | sort

# macOS/Linux - Oldest at top, Latest at bottom
ls -1 reports/ADITYA/QWEN/*.md | sort
```

**When Numbering is MANDATORY:**
- ✅ ALL reports (to maintain chronological order)
- ✅ Handoff reports
- ✅ Recovery/verification reports
- ✅ Multi-session task tracking
- ✅ Sequential audit series
- ✅ Daily status updates
- ✅ Reference documentation

**Examples:**
- `001_2026-03-22_QWEN_Recovery_VerificationReport.md` (Latest QWEN report)
- `002_2026-03-22_QWEN_Verification_MasterPlan.md` (Second latest)
- `001_2026-03-22_ANTIGRAVITY_Recovery_Handoff.md` (Latest ANTIGRAVITY report)

**Viewing Latest Reports:**
```bash
# Windows - Latest at top
dir reports\ADITYA\QWEN\*.md /b | sort

# macOS/Linux - Latest at top
ls -1 reports/ADITYA/QWEN/*.md | sort
```

**When to Number:**
- ✅ Handoff reports (critical for continuity)
- ✅ Recovery/verification reports
- ✅ Multi-session task tracking
- ✅ Sequential audit series

**When Numbering is Optional:**
- ❌ Single standalone reports
- ❌ Daily status updates (use date instead)
- ❌ Reference documentation

## 🏁 MANDATORY HANDOFF
Every session **MUST** end with a report in the specific user/agent subdirectory containing:

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
*Maintained by the Soulamore Dev Team.*
