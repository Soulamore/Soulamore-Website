import os

out_dir = r"c:\Users\adity\Desktop\Projects\Soulamore-Website\reports\testing\02-backlog"
os.makedirs(out_dir, exist_ok=True)

tickets = [
    {
        "id": "BUG-001",
        "title": "Login Page Google Authorization Error 401",
        "severity": "🔴 CRITICAL",
        "desc": "Users attempting to sign in using Google OAuth receive a 401: deleted_client error. The Google Sign-In popup blocks access and states 'The OAuth client was deleted.'",
        "env": "localhost:3000 / Live Site",
        "steps": "1. Navigate to the login page.\n2. Click on the 'Sign in with Google' button.\n3. Enter Google credentials and attempt to authorize.",
        "expected": "User is successfully authenticated and redirected to their dashboard.",
        "actual": "Access is blocked. Google displays a popup containing 'Error 401: deleted_client'.",
        "media": "![image1.png](../01-inbox/Aryan/media/image1.png)"
    },
    {
        "id": "BUG-002",
        "title": "Sign Up Page Card Layout and Text Overlap",
        "severity": "🟠 HIGH",
        "desc": "The 'Create Account' modal card is improperly aligned or overlapping with the background Soulamore brand text on the right side. The loading state spinner shows 'Connecting...' above the input fields.",
        "env": "localhost:3000 / Signup Page",
        "steps": "1. Go to the Sign Up page (/portal/signup.html).\n2. Observe the modal alignment and the text behind it.\n3. Note the 'Connecting...' button placement.",
        "expected": "The Sign Up modal is centered and clean, with no overlapping text backgrounds or premature connecting status indicator.",
        "actual": "Modal card overlaps awkwardly with the background text logo and displays 'Connecting...' loader unexpectedly.",
        "media": "![image2.png](../01-inbox/Aryan/media/image2.png)"
    },
    {
        "id": "BUG-003",
        "title": "SoulBot Chat Connection Failure",
        "severity": "🔴 CRITICAL",
        "desc": "SoulBot chat client displays a connection failure message when a user sends a message. The bot outputs: 'I'm having a little trouble connecting. Please try again in a moment.'",
        "env": "SoulBot Chat Page",
        "steps": "1. Open SoulBot chat page.\n2. Type 'im feeling lost' in the message input and press send.\n3. Observe the response.",
        "expected": "SoulBot processes the user message and responds with helpful, AI-generated wellness tips.",
        "actual": "SoulBot displays: 'I'm having a little trouble connecting. Please try again in a moment.'",
        "media": "![image3.png](../01-inbox/Aryan/media/image3.png)"
    },
    {
        "id": "BUG-004",
        "title": "Clinical Self-Assessment Card Buttons Display Raw HTML Style Code",
        "severity": "🟠 HIGH",
        "desc": "The 'Start Assessment' buttons inside the Academic Pressure and Social Dynamics cards render raw HTML style attribute strings (e.g. style='padding: 10px 20px; ...'>) as raw text inside the card buttons.",
        "env": "Assessments Page",
        "steps": "1. Go to the Assessments section.\n2. Scroll down to 'Academic Pressure' and 'Social Dynamics' cards.\n3. Inspect the 'Start Assessment' buttons.",
        "expected": "The buttons should display clean, styled text: 'Start Assessment'.",
        "actual": "Buttons display raw text: 'style=\"padding: 10px 20px; ...\">Start Assessment'.",
        "media": "![image4.png](../01-inbox/Aryan/media/image4.png)"
    },
    {
        "id": "BUG-005",
        "title": "HomePage Partner With Us Button Not Working",
        "severity": "🟡 MEDIUM",
        "desc": "The 'Partner With Us' button located in the 'Ready to build a resilient campus?' section does not navigate anywhere or open the expected form/modal.",
        "env": "HomePage",
        "steps": "1. Navigate to the HomePage.\n2. Scroll down to the 'Partner With Us' section.\n3. Click the 'Partner With Us' button.",
        "expected": "Clicking the button redirects the user to the partnership program page or opens a contact modal.",
        "actual": "The button is non-functional / doesn't trigger any action.",
        "media": "![image5.png](../01-inbox/Aryan/media/image5.png)"
    },
    {
        "id": "BUG-006",
        "title": "Student Resources UI Background Too Bright",
        "severity": "🟡 MEDIUM",
        "desc": "The student resources page (/spaces/campus/student-resources) has an extremely bright light-beige background, causing visual strain for some users. Needs night mode support or tone adjustments.",
        "env": "Student Resources Page",
        "steps": "1. Open /spaces/campus/student-resources.\n2. View the background color.",
        "expected": "The UI offers a comfortable dark mode/night mode toggle or uses a less stark, softer light theme.",
        "actual": "The page background is plain white/light beige, described by users as 'painful to the eyes' (aankh me chuba).",
        "media": "![image6.png](../01-inbox/Aryan/media/image6.png)"
    },
    {
        "id": "BUG-007",
        "title": "Personal Wellness Journal Feature Not Working",
        "severity": "🟠 HIGH",
        "desc": "The personal wellness journal page is reported as completely non-functional or failing to load entries.",
        "env": "Journal Portal",
        "steps": "1. Navigate to the Journal section of the dashboard.\n2. Try to view or create a journal entry.",
        "expected": "Journal loads existing entries and allows adding new text entries.",
        "actual": "The journal feature fails to respond or load.",
        "media": "*(No screenshots provided for this bug)*"
    },
    {
        "id": "BUG-008",
        "title": "Thought Popper Component Not Positioning Properly",
        "severity": "🟡 MEDIUM",
        "desc": "The Thought Popper overlay component is misaligned, flickering, or not appearing in the expected coordinates on screen.",
        "env": "HomePage / Spaces",
        "steps": "1. View pages that trigger the Thought Popper modal/tooltips.\n2. Verify the location of the popups.",
        "expected": "Thought Popper floats gracefully and centers correctly near target content.",
        "actual": "The Thought Popper does not work properly (positioning or animation is broken).",
        "media": "*(No screenshots provided for this bug)*"
    }
]

template = """# {id}: {title}

---

## 📋 Ticket Metadata
- **Status:** `⬜ BACKLOG`
- **Severity:** {severity}
- **Reporter:** Aryan Harsh (Via ERROR REPORT.docx)
- **Assignee:** Aditya (Developer)
- **Date Reported:** 2026-06-23
- **Target Release / Feature:** General Fixes

---

## 🔍 Bug Description
{desc}

### 💻 Environment Details
- **Environment:** {env}
- **OS / Browser:** Windows / macOS (Reported by team)
- **User Account Type:** Authenticated User / Anonymous

---

## 🛠️ Steps to Reproduce
{steps}

### 📈 Expected Behavior
{expected}

### 📉 Actual Behavior
{actual}

---

## 📸 Screenshots & Logs
### Visual Evidence
{media}

---

## 🚀 Resolution Notes (Completed by Developer)
- **Root Cause:** 
- **Fix Implemented:** 
- **Files Modified:** 
  - 
- **Date Resolved:** 

---

## 🧪 Verification Log (Completed by Tester)
*Both the developer and a secondary tester must independently verify this resolution.*

### Developer Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** `⬜ PENDING`

### Independent Tester Verification
- **Verified By:** 
- **Verification Date:** 
- **Test Result:** `⬜ PENDING`
"""

for t in tickets:
    # Build a clean filename: e.g. BUG-001_login_page_google_authorization_error_401.md
    safe_title = t['title'].lower().replace(" ", "_").replace(":", "").replace("/", "").replace("-", "_").replace("__", "_")
    filename = f"{t['id']}_{safe_title}.md"
    filepath = os.path.join(out_dir, filename)
    content = template.format(
        id=t['id'],
        title=t['title'],
        severity=t['severity'],
        desc=t['desc'],
        env=t['env'],
        steps=t['steps'],
        expected=t['expected'],
        actual=t['actual'],
        media=t['media']
    )
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated ticket: {filename}")
