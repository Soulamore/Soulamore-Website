# Incident Report: Stats Permission Failure (SAGA)

**Date**: 2026-05-12
**Project**: SAGA Germany (`saga-59bfd`)
**Status**: ✅ Resolved
**Time to Resolve**: ~4 hours across 2 sessions

---

## Summary

Landing page hero stats showed `0+` members and `0` cities with `FirebaseError: Missing or insufficient permissions` in the browser console. The error persisted through all conventional fixes (rule changes, App Check audit, cache clearing).

## Root Causes (4 layers)

| # | Cause | Fix |
|---|-------|-----|
| 1 | Firestore rules never deployed to production | `firebase deploy --only firestore:rules` |
| 2 | `syncPlatformStats()` reading `users` collection client-side | Removed function entirely |
| 3 | Duplicate Cloud Function export names in `index.ts` | Renamed to unique names |
| 4 | Firebase JS SDK v12 WebChannel bug — `permission-denied` on public reads | Switched to Firestore REST API |

## Key Lesson

**Always test rules with the REST API before assuming SDK behavior is correct:**
```powershell
Invoke-RestMethod -Uri "https://firestore.googleapis.com/v1/projects/{ID}/databases/(default)/documents/{col}/{doc}"
```

If REST returns data but SDK throws `permission-denied` → it's an SDK transport bug, not a rules issue.

## Reference

Full standard: `CORE_INTELLIGENCE/STANDARDS/FIREBASE_SDK_V12_PUBLIC_READ_BUG.md`
Full audit: `SAGA/Reports/ADITYA/ANTIGRAVITY/2026-05-12_ANTIGRAVITY_Audit_StatsPermissionFailure.md`
