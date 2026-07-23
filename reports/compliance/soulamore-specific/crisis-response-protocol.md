# Crisis Response Protocol — Soulamore
**Owner:** Hashlilly Private Limited
**Version:** 1.0
**Critical:** This document defines how Soulamore responds when a user may be in mental health crisis. Must be implemented before any public launch.

---

## Overview

Soulamore, as a wellness platform targeting students and young professionals, will inevitably encounter users who are in mental health distress or crisis. This protocol defines:
1. How the platform detects potential crisis signals
2. What the platform shows the user
3. What Hashlilly's obligations and limits are
4. What Antigravity must build

---

## 1. Crisis Signal Detection

### 1a. Keyword Detection
Implement server-side and client-side detection for crisis-related keywords in journal entries and free-text inputs.

**Tier 1 — Emergency (immediate, blocking response):**
Keywords/phrases: "want to die," "end my life," "kill myself," "suicide," "suicidal," "don't want to be here anymore," "can't go on," "no reason to live," "goodbye forever," explicit self-harm methods

**Tier 2 — Concern (non-blocking, supportive nudge):**
Keywords/phrases: "feel worthless," "no one cares," "everyone would be better off," "can't take it anymore," "extremely depressed," "self-harm," "hurting myself"

**Tier 3 — Distress (passive resource surfacing):**
General expressions of persistent hopelessness, severe anxiety, or isolation that do not reach Tier 1/2 threshold.

### 1b. Mood Tracking Signals
- Multiple consecutive days of lowest-score mood entries
- Sudden significant drop in mood score after prolonged normal use
- These trigger Tier 3 response only (resource surfacing, no blocking)

### 1c. Important Limitations
- Keyword detection is imperfect and will produce false positives (users writing about others, fictional writing, research)
- The platform is NOT a crisis service and cannot provide real-time human response
- Detection exists solely to surface resources, not to assess or diagnose

---

## 2. Response by Tier

### Tier 1 — Emergency Response

**Trigger:** Tier 1 keywords detected in any user input.

**What happens (Antigravity to implement):**

1. **Journal entry / input is saved normally** — do not block saving or create friction that feels punishing
2. **Immediately after save (not before), display a full-screen, non-dismissible modal:**

```
Title: "We noticed something in what you wrote"

Body:
"What you're feeling matters, and you don't have to face it alone.

If you're having thoughts of suicide or self-harm, please reach out to a 
crisis helpline right now — they're available 24/7 and are there to listen.

[iCall — 9152987821] [tap to call]
[Vandrevala Foundation — 1860-2662-345] [tap to call]
[View more resources] → links to full crisis resources page

[I'm safe — continue to app]"
```

3. The user can dismiss the modal by tapping "I'm safe" — this is mandatory. Do NOT trap the user or prevent them from continuing.
4. **Do NOT:** alert authorities, contact emergency services, share the user's data with anyone, or disclose the content of the entry to any third party.
5. **Do NOT:** send a push notification about this — it must be in-session only.
6. Log the crisis signal event (timestamp only, no content) for internal product monitoring — no PII in the log.

### Tier 2 — Concern Response

**What happens:**

1. Entry saved normally
2. After save, a **softer, non-blocking banner** appears at the top of the screen:

```
"It sounds like things have been difficult. 
You deserve support — here are some resources if you need them.
[View Resources] [Dismiss]"
```

3. User can dismiss immediately. No blocking.

### Tier 3 — Distress Response (Passive)

1. Entry saved normally
2. Contextually surface the Wellness Resources section in the next screen or home feed
3. No explicit reference to their entry — general "here's support" placement

---

## 3. Crisis Resources Page

Build a static, always-accessible page at soulamore.com/help and in the app (accessible from footer without login):

- India, UK, US, Australia, Canada, and "other countries" (link to IASP directory: iasp.info/resources/Crisis_Centres)
- Include: text helpline, call helpline, online chat options where available
- "If you are in immediate danger, call 112 (India) / 911 (US) / 999 (UK) / 000 (Australia)"
- Do not use clickbait phrasing. Plain, direct, warm tone.

---

## 4. What Soulamore Does NOT Do

To be explicitly communicated to users and documented for regulatory/legal purposes:

- Soulamore does not provide real-time crisis intervention
- Soulamore does not monitor user entries in real-time (keyword detection is automated, not human-reviewed)
- Soulamore does not contact emergency services on behalf of users
- Soulamore does not share user content with mental health professionals unless explicitly requested by the user through a future opt-in feature
- Soulamore is not a mandated reporter in any jurisdiction — but this does not mean Hashlilly has no obligation to surface resources

---

## 5. Legal and Liability Considerations

### "Duty of Care" in India
India does not have a formal statutory duty of care for digital platforms regarding user mental health as of 2026. However, negligence law principles apply — if Soulamore creates a reasonable expectation of support and then fails to provide it, liability exposure exists.

**Mitigation:** Clear disclaimer (see Disclaimer document), explicit "not a clinical service" messaging, crisis resources always accessible, no promises of human response.

### DPDP Act
Crisis signal detection is an automated processing activity. It must be disclosed in the Privacy Policy and covered by the consent for wellness data processing.

### GDPR (if EU users)
Automated processing that produces significant effects requires disclosure. Keyword detection for crisis resource surfacing is low-significance automation, but disclose it.

---

## 6. Implementation Checklist for Antigravity

- [ ] Tier 1 keyword list implemented server-side (not client-side only — client can be bypassed)
- [ ] Tier 1 modal built — non-dismissible without explicit "I'm safe" tap, shown post-save not pre-save
- [ ] Tier 2 banner built — dismissible
- [ ] Tier 3 passive resource surfacing in feed
- [ ] /help page built — static, no auth required, accessible from footer
- [ ] In-app crisis resources accessible from main navigation without login
- [ ] Keyword detection logic logged (timestamp only) for product monitoring — no user content in logs
- [ ] Keyword list reviewed by a mental health professional before launch
- [ ] Tested: false positive handling (e.g., "my character wants to die" in a writing prompt)
- [ ] Privacy Policy updated to disclose automated keyword detection

---

## 7. Review

This protocol must be reviewed:
- Before product launch
- Annually thereafter
- After any reported incident involving a user in crisis
- After any change to applicable laws regarding platform duty of care

The keyword list and crisis resources must be updated at least annually.
