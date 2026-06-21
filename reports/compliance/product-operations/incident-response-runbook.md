# Incident Response Runbook — Hashlilly Private Limited
**Version:** 1.0
**Scope:** All Hashlilly products — soulamore.com, thatsmissing.com, boozedin.com, hashlilly.in
**Owner:** Aditya / Antigravity Lead Engineer

---

## Incident Types Covered

| Type | Examples |
|---|---|
| Security breach | Data exfiltration, unauthorized access, credential compromise |
| Service outage | Complete downtime, major feature failure, database unavailability |
| Data corruption | Accidental deletion, migration failure, data integrity loss |
| Abuse / platform violation | Coordinated spam, CSAM report, illegal content, doxxing |
| Third-party failure | Cloud provider outage, payment processor down, email provider failure |
| Legal / regulatory event | Regulator enquiry, court order, law enforcement request |

For security breaches specifically, also follow the Breach Response Playbook.

---

## Severity Levels

| Level | Definition | Response Time | Example |
|---|---|---|---|
| SEV1 | Complete service outage or confirmed data breach | Immediate — all hands | Site down; database breached |
| SEV2 | Major feature broken; partial outage; high abuse event | Within 1 hour | Payments failing; login broken; mass spam |
| SEV3 | Significant bug; degraded performance; single-user abuse | Within 4 hours | Specific feature error; one user's data issue |
| SEV4 | Minor bug; low-impact issue | Next business day | UI glitch; minor content error |

---

## Incident Response Process

### Step 1 — Detection

Incidents are detected via:
- Automated monitoring alerts (Sentry, uptime monitor, Cloudflare alerts)
- User reports (support email, in-app report)
- Internal team discovery
- Third-party security researcher notification

**Anyone detecting an incident immediately:**
1. Creates an incident ticket: label `INCIDENT-[PRODUCT]-[DATE]-[NUMBER]`
2. Notifies Aditya and Antigravity lead via [communication channel — Slack/WhatsApp/Signal]
3. Does NOT attempt to fix silently — escalate first

### Step 2 — Triage (SEV1/SEV2: within 30 minutes)

Assign Incident Commander (IC) — typically Aditya or senior Antigravity engineer.

IC establishes:
- What is the scope? (which products, which users, what data)
- Is the incident ongoing?
- What is the user impact?
- What is the data/privacy impact?
- Assign: Technical Lead, Communications Lead (if user communication needed)

### Step 3 — Containment and Mitigation

**Service outage:**
- Identify failing component (database, API, CDN, third-party dependency)
- Roll back recent deployments if outage follows a deploy
- Failover to backup/redundant system if available
- Scale infrastructure if traffic spike is the cause
- Communicate status to users via status page (see below)

**Security incident:**
- Follow Breach Response Playbook in parallel
- Isolate affected systems
- Revoke compromised credentials
- Do not delete evidence

**Abuse/content incident:**
- Remove violating content immediately
- Suspend offending account
- Preserve logs for legal purposes
- Assess if law enforcement notification is required (CSAM = mandatory report in most jurisdictions)

### Step 4 — Communication

**Status Page:**
Maintain a public status page at status.[product].com (or use Atlassian Statuspage / BetterUptime).

Update within 30 minutes of SEV1/SEV2 detection:
```
[Time] — Investigating: We are aware of an issue affecting [feature/service] 
and are investigating. We will update within [30/60] minutes.

[Time] — Identified: We have identified the cause and are working on a fix.

[Time] — Monitoring: A fix has been deployed. We are monitoring for stability.

[Time] — Resolved: The issue has been resolved. 
[Brief description of what happened and what was fixed.]
```

**Do not:** Overpromise timelines. Be honest about what you know.

**User email (SEV1 only — if user data or experience significantly impacted):**
Send within 2 hours of confirmed SEV1:
```
Subject: Service update — [Product]

We're reaching out to let you know that [Product] experienced 
[brief description] on [date]. 

[What was affected]
[What we did]
[What users should do, if anything]

We apologise for the disruption. [Contact] for questions.
```

### Step 5 — Resolution

- Deploy fix
- Verify resolution via monitoring
- Update status page: "Resolved"
- All-clear confirmed by IC

### Step 6 — Post-Incident Review (Within 5 days of resolution for SEV1/SEV2)

Document in incident record:
- Timeline of events (detection to resolution)
- Root cause analysis
- What went well
- What could be improved
- Action items to prevent recurrence (with owner and deadline)
- Was user data affected? (feeds into Breach Response Playbook if yes)

Share with Antigravity and Aditya. Update security audit and runbook if process gaps found.

---

## Handling Legal / Regulatory Requests

### Law Enforcement Request (court order, subpoena, police request)

1. Do not comply immediately — verify the request is legally valid
2. Forward to legal counsel within 24 hours
3. Do not notify the user if the order includes a non-disclosure / gag order
4. If order does not include non-disclosure: notify affected user as soon as legally permissible
5. Provide minimum information required by the order — do not volunteer additional data
6. Log: date received, authority, what was requested, what was disclosed, legal counsel involved

### Regulator Enquiry (Data Protection Authority)

1. Acknowledge receipt within 24 hours
2. Engage legal counsel immediately
3. Compile requested information — do not provide more than asked
4. All responses to regulators reviewed by legal counsel before sending
5. Maintain complete record of all regulator correspondence

---

## Monitoring Stack Recommendations for Antigravity

| What to Monitor | Tool |
|---|---|
| Application errors and crashes | Sentry |
| Uptime and response time | BetterUptime / UptimeRobot / Checkly |
| Infrastructure health | AWS CloudWatch / GCP Monitoring |
| Security events | Cloudflare Security Events |
| Log aggregation | Logtail / Axiom / Papertrail |
| Alerting | PagerDuty / OpsGenie (SEV1) / Slack alerts (SEV2+) |

**Minimum alerting rules to configure:**
- API response time > 2 seconds average (5-minute window) → SEV3 alert
- Error rate > 1% of requests → SEV2 alert
- Any 5xx response spike > 10 in 1 minute → SEV2 alert
- Uptime check failure (2 consecutive) → SEV1 alert + SMS to Aditya and Antigravity lead
- Database connection failures → SEV1 alert immediately
- Failed login attempts > 50 from one IP in 5 minutes → SEV2 security alert
