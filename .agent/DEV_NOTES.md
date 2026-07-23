# Soulamore Dev Notes
> Local reference only. This file is gitignored.

---

## 🔐 Admin Account

| Field        | Value                              |
|--------------|------------------------------------|
| Email        | `admin@soulamore.com`              |
| Firebase UID | `mBRTBu2UN5MgfOAcQpAESu5C4Cx2`   |
| Firestore    | `users/mBRTBu2UN5MgfOAcQpAESu5C4Cx2` → `role: "admin"` |

---

## 🛡️ Firebase App Check Debug Token (localhost)

| Name             | Token                                  |
|------------------|----------------------------------------|
| Admin - Soulamore | `bc2d95e9-65d0-4644-a302-c7f880e56d55` |

**How to register (one-time setup per machine):**
1. Open DevTools console on `localhost:3001/portal/admin-dashboard`
2. Find log: `App Check debug token: bc2d95e9-65d0-4644-a302-c7f880e56d55`
3. Go to [Firebase Console → App Check → Apps → Manage debug tokens](https://console.firebase.google.com/u/0/project/soulamore-f0a64/appcheck)
4. Add the token above → Save
5. Hard refresh (`Ctrl+Shift+R`)

> ⚠️ This token only works on localhost. Never commit it to git or share it publicly.

---

## 🔥 Firebase Project

| Field      | Value                  |
|------------|------------------------|
| Project ID | `soulamore-f0a64`      |
| Auth Domain | `soulamore-f0a64.firebaseapp.com` |

---

## 🌿 Active Dev Branch

`fix/admin-dashboard-stats-and-campaign-center`
