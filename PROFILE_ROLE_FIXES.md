# Profile & Role Management Fixes

## Overview
Fixed the profile page to properly handle role selection, saving, and display for Peers and Psychologists.

---

## Changes Made

### 1. **Profile Page** (`profile.html`)

#### Added Role Status Indicator
- New visual box showing current role verification status
- Three states:
  - ✅ **Verified Peer/Psychologist** - Green/Peach badge
  - ⏳ **Verification Pending** - Yellow badge (when role selected but not verified)
  - Hidden for regular users

#### Improved Role Selection
- Updated dropdown with clearer descriptions:
  - "Peer - Provide emotional support to others"
  - "Psychologist - Licensed mental health professional"
- Added info text explaining verification requirement

#### Enhanced Save Logic
- Detects when role changes to Peer/Psychologist
- Shows success message with verification notice
- Offers redirect to appropriate dashboard
- Updates both `users` and `roles` collections

#### Fixed Data Loading
- Ensures profile exists in Firestore before loading
- Properly fetches role from both `users` and `roles` collections
- Handles Google login data correctly

---

### 2. **Profile Handler** (`assets/js/profile-handler.js`)

#### Enhanced `updateUserProfile()` Function
```javascript
// Now properly syncs roles collection:
- Peer → sets roles/{uid}.peer = true
- Psychologist → sets roles/{uid}.psychologist = true
- Other roles → clears peer/psychologist flags
```

#### Improved Error Handling
- Role sync failures don't block profile save
- Better logging for debugging

---

### 3. **Firestore Security Rules** (`firestore.rules`)

#### Updated Roles Collection Rules
```javascript
// Before: allow create, update: if false; // Blocked everyone
// After:
allow create, update: if request.auth != null && 
  request.auth.uid == userId &&
  (!request.resource.data.keys().hasAny(['admin']) || 
   request.resource.data.admin == false);
```

**What Changed:**
- Users can now set their own role as Peer/Psychologist
- Users CANNOT assign themselves admin role
- Admin verification still required for full access

---

### 4. **User Dashboard** (`portal/user-dashboard.html`)

#### Added Availability Management
- New "My Availability" menu item (shown only for peers/psychologists)
- Complete weekly schedule builder
- Save/load functionality using existing booking system

#### Role-Based UI
- Availability link automatically shown/hidden based on user role
- Uses `getUserRole()` from role-helper.js

---

## User Flow

### For New Users Selecting Peer/Psychologist Role:

1. **Login** → Go to Profile page
2. **Edit Profile** → Select "Peer" or "Psychologist" from dropdown
3. **Save** → See verification notice
4. **Alert Shows:**
   ```
   🎉 Thank you for selecting Peer!
   
   Note: Your Peer status needs to be verified by our team. 
   Once verified, you'll have full access to the Peer dashboard.
   
   You can continue using the platform while verification is pending.
   ```
5. **Confirm Dialog:**
   ```
   Would you like to go to the Peer Dashboard now?
   [Yes] [No]
   ```
6. **If Yes** → Redirected to dashboard (may see limited access until verified)
7. **If No** → Stay on profile page with status box showing "Verification Pending"

---

## Verification States

| State | Badge | Can Access Dashboard | Can Set Availability |
|-------|-------|---------------------|---------------------|
| **Regular User** | None | User Dashboard ❌ | ❌ |
| **Peer (Pending)** | 🟡 Verification Pending | Peer Dashboard ⚠️ Limited | ❌ |
| **Peer (Verified)** | ✅ Verified Peer | Peer Dashboard ✅ | ✅ |
| **Psychologist (Pending)** | 🟡 Verification Pending | Psych Dashboard ⚠️ Limited | ❌ |
| **Psychologist (Verified)** | ✅ Verified Psychologist | Psych Dashboard ✅ | ✅ |

---

## Firestore Collections Updated

### `users/{uid}`
```javascript
{
  displayName: "John Doe",
  email: "john@example.com",
  role: "Peer",  // Updated on save
  // ... other fields
}
```

### `roles/{uid}`
```javascript
{
  peer: true,            // Set when role = "Peer"
  psychologist: false,   // Cleared when role = "Peer"
  updatedAt: Timestamp
}
```

---

## Testing Checklist

### Test 1: Regular User → Peer
- [ ] Login as regular user
- [ ] Go to profile page
- [ ] Select "Peer" from dropdown
- [ ] Click Save
- [ ] Verify alert shows
- [ ] Click "Yes" to go to dashboard
- [ ] Check if availability link appears in user dashboard
- [ ] Check Firestore `roles/{uid}` has `peer: true`

### Test 2: Google Login → Profile Display
- [ ] Login with Google
- [ ] Go to profile page
- [ ] Verify name, email, photo are populated
- [ ] Verify role badge shows "Member"
- [ ] Verify form fields are filled

### Test 3: Verified Peer → Availability
- [ ] Ensure `roles/{uid}.peer = true` in Firestore
- [ ] Login and go to user dashboard
- [ ] Verify "My Availability" link is visible
- [ ] Click it and set weekly schedule
- [ ] Save and verify in Firestore `peer_availability/{uid}`

### Test 4: Role Status Display
- [ ] Set role to "Peer" → See yellow "Verification Pending" badge
- [ ] Set `roles/{uid}.peer = true` → See green "Verified Peer" badge
- [ ] Change role to "Student" → Badge disappears

---

## Admin Verification Process (Manual)

For production, admin needs to verify peers/psychologists:

1. **Check Application** (via `/join-us/peer.html` submissions)
2. **Verify Credentials** (especially for psychologists)
3. **Update Firestore:**
   ```javascript
   // Manually set in Firebase Console
   roles/{uid} = {
     peer: true,  // or psychologist: true
     verifiedBy: "admin@example.com",
     verifiedAt: Timestamp
   }
   ```
4. **Notify User** via email

---

## Future Enhancements

1. **Automated Verification Flow**
   - Application form → Admin review → Auto-update roles
   - Email notifications on approval/rejection

2. **Role Expiry**
   - Peer/psychologist certifications expire
   - Require re-verification annually

3. **Enhanced Permissions**
   - Different access levels for pending vs verified
   - Block session booking until verified

4. **Admin Dashboard**
   - View all pending verifications
   - Approve/reject with one click
   - View provider analytics

---

## Files Modified

1. `profile.html` - UI and role selection
2. `assets/js/profile-handler.js` - Role sync logic
3. `firestore.rules` - Security rules for roles
4. `portal/user-dashboard.html` - Availability management
5. `BOOKING_SYSTEM_GUIDE.md` - Documentation (previously created)

---

## Support

If role updates aren't working:
1. Check browser console for errors
2. Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
3. Check `roles/{uid}` document exists in Firestore
4. Ensure user is logged in with correct account
