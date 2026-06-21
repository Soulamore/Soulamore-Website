# Data Retention Schedule — Hashlilly Private Limited
**Version:** 1.0
**Last Updated:** [INSERT DATE]
**Review Frequency:** Annually or on regulatory change

---

## Purpose

This schedule defines how long each category of personal data is retained across all Hashlilly products, the legal basis for each retention period, and the deletion method. Retention periods must be implemented as automated deletion jobs in the application backend.

---

## Retention Principles

1. **Minimum necessary:** Data is not retained longer than required for its stated purpose.
2. **Legal override:** Where law requires longer retention (tax, litigation hold), that period overrides product defaults.
3. **User deletion request:** Overrides all retention periods except legal holds. Must execute within 30 days.
4. **Automated enforcement:** All periods below must be enforced by scheduled backend jobs, not manual processes.

---

## Schedule by Data Category

### 1. Account and Identity Data

| Data Type | Product(s) | Retention Period | Trigger | Legal Basis | Deletion Method |
|---|---|---|---|---|---|
| Email address | All | Account lifetime + 30 days | Account deletion request or inactivity termination | Contract | Hard delete from users table |
| Password hash | All | Account lifetime + 30 days | Same as above | Contract | Hard delete |
| Date of birth | All | Account lifetime + 30 days | Same as above | Legal obligation (age verification) | Hard delete |
| Display name / pseudonym | All | Account lifetime + 30 days | Same | Contract | Hard delete |
| Profile photo | BoozeD In, Soulamore | Account lifetime + 30 days | Same | Contract | Delete from object storage + CDN purge |
| Account creation timestamp | All | 3 years post-deletion | Regulatory/audit | Legitimate interests | Anonymise (remove linkage to user) |

---

### 2. Wellness and Sensitive Data (Soulamore only)

| Data Type | Retention Period | Trigger | Notes |
|---|---|---|---|
| Journal entries | Account lifetime. Deleted immediately on deletion request. | User deletion request | No archiving, no backup retention beyond 24 hours |
| Mood logs and check-ins | Account lifetime. Deleted immediately on deletion request. | User deletion request | Same as above |
| Wellness responses | Account lifetime. Deleted immediately on deletion request. | User deletion request | Same as above |
| Anonymised aggregate mood trends | 24 months (no user linkage) | Rolling window | Used for product improvement only; no PII |

**Critical:** Soulamore wellness data backups must be overwritten within 24 hours. Standard database backup retention (7–30 days) does NOT apply to wellness data. Implement separate backup policy for Soulamore.

---

### 3. Professional and Network Data (BoozeD In)

| Data Type | Retention Period | Trigger | Notes |
|---|---|---|---|
| Professional profile | Account lifetime + 30 days | Deletion request | Includes job title, employer history, skills |
| Connection relationships | Account lifetime + 30 days | Deletion request | Remove all edges in network graph |
| Direct messages | 2 years from send date | Rolling | Notify users of message retention period in Privacy Policy |
| Job applications submitted | 1 year from application date | Rolling | Legal basis: legitimate interests of employer/applicant |
| Job listings posted | Duration of listing + 90 days | Listing expiry | Brief retention for dispute resolution |

---

### 4. Product Usage and Intelligence Data (That's Missing)

| Data Type | Retention Period | Trigger | Notes |
|---|---|---|---|
| Saved opportunities / watchlists | Account lifetime + 30 days | Deletion request | |
| Search history | 12 months | Rolling | Used for personalisation; purge after 12 months |
| Annotations and notes | Account lifetime + 30 days | Deletion request | User-created content |
| Usage analytics (pseudonymised) | 24 months | Rolling | No direct PII linkage |

---

### 5. Payment and Billing Data

| Data Type | Retention Period | Legal Basis | Notes |
|---|---|---|---|
| Invoice records | 7 years | Tax/legal obligation (Companies Act, Income Tax Act India) | Cannot be deleted on user request — inform user |
| Billing name and address | 7 years | Tax/legal obligation | |
| Card last 4 digits | 7 years (on invoices) | Tax/legal obligation | Full card number never stored by Hashlilly |
| Subscription history | 7 years | Tax/legal obligation | |

**Note to users:** Billing records cannot be deleted before 7 years due to legal obligations under Indian tax law. Users are informed of this in the Privacy Policy.

---

### 6. Communications Data

| Data Type | Retention Period | Trigger | Notes |
|---|---|---|---|
| Support tickets and emails | 2 years from resolution | Rolling | Needed for dispute resolution |
| Contact form submissions | 2 years from receipt | Rolling | |
| Marketing email opt-in records | Subscription period + 1 year | Unsubscribe + 1 year | Required to demonstrate consent under CASL/GDPR |
| Unsubscribe records | Indefinite (suppression list) | Never deleted | Required to honour unsubscribe; retain email as suppressed |

---

### 7. Security and System Logs

| Data Type | Retention Period | Notes |
|---|---|---|
| Authentication logs (login success/fail) | 12 months | Security monitoring, breach investigation |
| API access logs | 12 months | Rate limiting, abuse detection |
| Admin action logs | 3 years | Audit trail — append-only, cannot be deleted |
| Security incident logs | 5 years | Regulatory requirement post-breach |
| Error logs (application) | 90 days | Operational; purge PII from error payloads before storage |

---

### 8. Consent Records

| Data Type | Retention Period | Notes |
|---|---|---|
| Cookie consent records | 3 years from last consent action | GDPR enforcement standard |
| Marketing consent records | Duration of subscription + 3 years | Proof of consent if challenged |
| Sensitive data consent (Soulamore) | Account lifetime + 3 years | Proof of explicit consent for wellness data processing |
| Consent withdrawal records | 3 years | Proof of withdrawal honoured |

---

## Deletion Methods

| Data Location | Deletion Method |
|---|---|
| Primary database (PostgreSQL/MySQL) | Hard DELETE — not soft delete / not flag as deleted |
| Object storage (S3/Firebase Storage) | API delete call + lifecycle policy to overwrite |
| Search indices (Elasticsearch/Algolia) | Index document delete |
| CDN cache | Cache invalidation / purge by URL or tag |
| Backup databases | Overwrite within 24 hours for sensitive data; within 30 days for standard data |
| Email service provider | API suppression/delete call |
| Analytics platform | User deletion API call to analytics vendor |
| Log aggregation service | Retention policy set at service level |

---

## Implementation Checklist for Antigravity

- [ ] Implement automated deletion job for each retention period above
- [ ] Soulamore: configure backup overwrite within 24 hours for wellness data tables
- [ ] All products: hard deletes, not soft deletes, for personal data
- [ ] Account deletion cascade: deletion of primary account must cascade to all linked tables
- [ ] Implement suppression list for unsubscribed emails (do not re-add on re-registration)
- [ ] Log all deletion events in audit log (retain 3 years)
- [ ] Test deletion jobs quarterly — verify data is actually gone

---

*This schedule constitutes the official data retention policy of Hashlilly Private Limited. Deviations require written approval from the Data Controller (Aditya). Review annually and on any change to applicable law.*
