# BUG-034: Calendar Sync and Availability Gaps in Peer & Psychologist Dashboards

---

## 📋 Ticket Metadata
- **Status:** `📝 BACKLOG`
- **Severity:** 🔴 HIGH
- **Reporter:** Aditya (Developer Audit)
- **Assignee:** Unassigned
- **Date Reported:** 2026-07-05
- **Target Release / Feature:** Provider Portal / Calendar Sync & Scheduling

---

## 🔍 Bug Description
An audit of the scheduling and calendar integration systems across the Peer Dashboard (`portal/peer-dashboard.html`), Psychologist Dashboard (`portal/psych-dashboard.html`), and Public Profiles Booking Widget has revealed several integration gaps and bugs:

1. **Multiple Availability Slots Ignored**:
   In [assets/js/peer-booking-handler.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/peer-booking-handler.js#L180), `getAvailableSlots(peerId, date)` resolves day availability using `.find()`:
   ```javascript
   const daySchedule = availability.availability.find(slot => slot.day.toLowerCase() === dayName);
   ```
   If a peer or psychologist configures multiple separate slots for a single day (e.g. Monday 10:00–12:00 and Monday 18:00–21:00), only the first matching slot is retrieved. The remaining slots are ignored, making them impossible for clients to book.

2. **Broken Google Calendar Sync on Psychologist Dashboard**:
   In [portal/psych-dashboard.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/psych-dashboard.html), the JavaScript module defines a listener and a function `connectGoogleCalendar()` for linking Google Calendar via Cloud Functions. However, the corresponding HTML button:
   - Lacks the required `id="connect-gcal-btn"` to receive status updates or clicks from the script.
   - Has a hardcoded `onclick="alert('Google Calendar integration coming soon!')"`, bypassing the actual integration.

3. **Missing Google Calendar Sync on Peer Dashboard**:
   [portal/peer-dashboard.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/peer-dashboard.html) contains no calendar sync settings or oauth bindings for peers, leaving them without automated calendar blocking.

4. **Hardcoded Weekly Snapshot in Peer Dashboard**:
   In the Peer Dashboard's availability view, the *"Weekly Snapshot"* column displays static, hardcoded HTML data representing Monday and Thursday from 6 PM to 9 PM, rather than dynamically showing the user's actual saved schedule.

### 💻 Environment Details
- **Environment:** Localhost / Live Site
- **OS / Browser:** All
- **User Account Type:** Peer Supporters & Psychologists

---

## 🛠️ Steps to Reproduce
1. Log in as a psychologist and navigate to the **Availability** tab.
2. Click the **Connect Google Calendar** button; notice that it pops up a "Coming soon" alert instead of initiating Google Auth, despite oauth handler functions being present in the JS.
3. Log in as a peer, open **Availability**, and add two distinct slots for Monday (e.g., morning and evening). Click **Save Schedule**.
4. Open the public profile page for the peer and select a Monday on the calendar.
5. Notice that only the morning slots are generated; the evening slots are completely missing from the available options.

### 📈 Expected Behavior
1. The booking widget should retrieve and parse *all* availability slots configured for a given day.
2. The psychologist dashboard calendar connection button should call the oauth sync helper function.
3. The peer dashboard should have a dynamic calendar snapshot and offer equivalent calendar sync features.

### 📉 Actual Behavior
1. Multiple slots are truncated to the first match in `getAvailableSlots`.
2. Psychologist calendar sync is locked out in HTML.
3. Peer dashboard calendar sync is missing, and the snapshot card is static.

---

## 🚀 Proposed Resolution Plan
1. **Fix Slot Generation Logic**:
   Modify `getAvailableSlots` in [assets/js/peer-booking-handler.js](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/assets/js/peer-booking-handler.js) to filter and loop over *all* matching day slots (`.filter(slot => ...)` instead of `.find(...)`) to generate options.
2. **Enable Psychologist Google Calendar Button**:
   Add `id="connect-gcal-btn"` to the HTML button in [portal/psych-dashboard.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/psych-dashboard.html) and update its click handler to trigger `connectGoogleCalendar()`.
3. **Make Peer Weekly Snapshot Dynamic**:
   Update the script in [portal/peer-dashboard.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/portal/peer-dashboard.html) or `portal/peer-availability.js` to render the snapshot list dynamically from the loaded schedule.
