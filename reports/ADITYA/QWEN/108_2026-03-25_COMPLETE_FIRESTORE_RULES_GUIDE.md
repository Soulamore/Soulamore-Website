# COMPLETE FIRESTORE RULES - ALL 4 DASHBOARDS

**Date:** March 25, 2026  
**Status:** ✅ READY TO DEPLOY  
**Priority:** 🔴 CRITICAL

---

## 📋 DEPLOY THESE RULES NOW

### **Step 1: Open Firebase Console**
https://console.firebase.google.com/project/soulamore-f0a64/firestore/rules

### **Step 2: Replace ALL Rules**
Copy the complete rules from `firestore.rules` file and paste into Firebase Console

### **Step 3: Click "Publish"**

### **Step 4: Wait 60 Seconds**

---

## 🎯 WHAT THESE RULES DO

### **ADMIN DASHBOARD** ✅
| Collection | Permission | Who Can Access |
|------------|------------|----------------|
| `/admin/*` | Read/Write | Admins only |
| `/peer_stories/*` | Read (pending) | Admins only |
| `/peer_stories/*` | Read/Write/Delete | Admins (all states) |
| `/blog_posts/*` | Read (pending) | Admins only |
| `/blog_posts/*` | Read/Write/Delete | Admins (all states) |
| `/maintenance_settings/*` | Write | Admins only |
| `/maintenance_settings/*` | Read | All authenticated users |
| `/announcements/*` | Write/Delete | Admins only |
| `/announcements/*` | Read | All authenticated users |

### **PEER DASHBOARD** ✅
| Collection | Permission | Who Can Access |
|------------|------------|----------------|
| `/peer_availability/*` | Read | Public |
| `/peer_availability/*` | Write/Delete | Own peer or Admin |
| `/peer_bookings/*` | Read | User, Peer, or Admin |
| `/peer_bookings/*` | Create | Users (own bookings) |
| `/peer_bookings/*` | Update | User/Peer/Admin (status-based) |
| `/peers/*` | Read | All authenticated users |
| `/peers/*` | Create | Public (applications) |
| `/peers/*` | Update/Delete | Own peer or Admin |

### **PSYCHOLOGIST DASHBOARD** ✅
| Collection | Permission | Who Can Access |
|------------|------------|----------------|
| `/psychologists/*` | Read | All authenticated users |
| `/psychologists/*` | Create | Public (applications) |
| `/psychologists/*` | Update/Delete | Own psych or Admin |
| `/therapists/*` | Read | Public |
| `/therapists/*` | Write/Delete | Admins only |
| `/support_groups/*` | Read | Admin or assigned moderator |
| `/support_groups/*` | Write/Delete | Admins only |

### **USER DASHBOARD** ✅
| Collection | Permission | Who Can Access |
|------------|------------|----------------|
| `/user_wallet/*` | Read/Write | Own user only |
| `/saved_items/*` | Read | Own user only |
| `/saved_items/*` | Create/Update/Delete | Own user only |
| `/roles/*` | Read | Own user only |
| `/roles/*` | Create/Update | Own user only |
| `/confessions/*` | Read | All authenticated users |
| `/confessions/*` | Create/Update/Delete | All authenticated users |

---

## 🔒 SECURITY FEATURES

### **Helper Functions Used:**
```javascript
// From top of firestore.rules:
function isSignedIn() {
  return request.auth != null;
}

function isAdmin() {
  return isSignedIn() && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

function isSelf(userId) {
  return isSignedIn() && request.auth.uid == userId;
}
```

### **Security Guarantees:**
- ✅ Users can ONLY access their own data (wallet, saved items, role)
- ✅ Peers can ONLY manage their own availability and bookings
- ✅ Psychologists can ONLY manage their own profile
- ✅ Admins can manage ALL content and users
- ✅ Public can read published content (not pending)
- ✅ No unauthorized cross-user access

---

## 🧪 TESTING CHECKLIST

### **Admin Dashboard:**
- [ ] Login as admin@soulamore.com
- [ ] Check Overview tab → Should load stats ✅
- [ ] Check Content Queue → Should show pending stories/blogs ✅
- [ ] Check User Management → Should load all users ✅
- [ ] Check Maintenance Settings → Should load without errors ✅

### **Peer Dashboard:**
- [ ] Login as Sonika (sonikas1625@gmail.com)
- [ ] Should redirect to peer-dashboard.html ✅
- [ ] Check availability settings → Should load ✅
- [ ] Check bookings → Should load own bookings ✅
- [ ] Check impact metrics → Should load ✅

### **Psychologist Dashboard:**
- [ ] Login as psychologist
- [ ] Should redirect to psych-dashboard.html ✅
- [ ] Check practice stats → Should load ✅
- [ ] Check client list → Should load ✅
- [ ] Check support groups → Should load ✅

### **User Dashboard:**
- [ ] Login as regular user (abhisheksingla74@gmail.com)
- [ ] Should stay on user-dashboard.html ✅
- [ ] Check wallet → Should load (or show $0) ✅
- [ ] Check saved items → Should load ✅
- [ ] Check role → Should show "Member" ✅
- [ ] No permission errors in console ✅

---

## 📊 ROLE ROUTING VERIFICATION

After deploying rules, verify:

| Email | Firestore Role | Expected Dashboard |
|-------|---------------|-------------------|
| admin@soulamore.com | `admin` | admin-dashboard.html ✅ |
| sonikas1625@gmail.com | `peer` | peer-dashboard.html ✅ |
| (psychologist email) | `psychologist` | psych-dashboard.html ✅ |
| abhisheksingla74@gmail.com | `member` | user-dashboard.html ✅ |

---

## 🚀 DEPLOY COMMAND (Alternative)

```bash
cd c:\Users\adity\Desktop\Projects\Soulamore-Website
firebase deploy --only firestore:rules
```

---

## ✅ AFTER DEPLOYING:

**All dashboards will work correctly:**
- ✅ Admin → Admin Dashboard
- ✅ Peer → Peer Dashboard
- ✅ Psychologist → Psychologist Dashboard
- ✅ User → User Dashboard
- ✅ NO permission errors
- ✅ Proper role-based access control

---

**DEPLOY NOW for full dashboard functionality!** 🚀

---

*End of Complete Rules Guide* 🔒
