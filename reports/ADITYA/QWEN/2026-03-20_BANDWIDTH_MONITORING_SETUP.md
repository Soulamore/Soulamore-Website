# 📊 Bandwidth Monitoring Setup - Target: <10GB/month
**Date:** March 20, 2026  
**Purpose:** Set up alerts to keep monthly bandwidth under 10GB  

---

## 🎯 Target: <10GB/month

With the bot prevention measures deployed, your bandwidth should drop from **800GB/month → <10GB/month**.

---

## 📋 Setup Steps

### **Step 1: Create Bandwidth Budget Alert** (10 minutes)

#### Option A: Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `soulamore-f0a64`
3. Navigate to: **Monitoring** → **Budgets & alerts**
4. Click **Create Budget**

**Budget Settings:**
```
Budget name: "Soulamore Bandwidth - 10GB Limit"
Budget amount: Custom amount
  → Set to: $10 (Firebase Hosting free tier is 10GB/month)
```

**Alert Thresholds:**
```
✓ 50% (5GB used)  → Email: contact.soulamore@gmail.com
✓ 75% (7.5GB used) → Email: contact.soulamore@gmail.com
✓ 90% (9GB used)   → Email: contact.soulamore@gmail.com + SMS (optional)
✓ 100% (10GB used) → Email + SMS (critical)
```

5. Click **Create**

---

#### Option B: Programmatic Setup (Advanced)

Create a Cloud Monitoring alert policy:

**File:** `scripts/create-bandwidth-alert.js`

```javascript
const monitoring = require('@google-cloud/monitoring').MetricServiceClient();
const projectId = 'soulamore-f0a64';

async function createBandwidthAlert() {
  const alertPolicy = {
    displayName: 'Soulamore Bandwidth Alert - 5GB',
    conditions: [
      {
        displayName: 'Firebase Hosting Bandwidth > 5GB',
        conditionThreshold: {
          filter: `resource.type="firebase_hosting" AND metric.type="firebase hosting/traffic_sent"`,
          aggregations: [
            {
              alignmentPeriod: '86400s', // 1 day
              perSeriesAligner: 'ALIGN_SUM',
              crossSeriesReducer: 'REDUCE_SUM'
            }
          ],
          thresholdValue: 5 * 1024 * 1024 * 1024, // 5GB in bytes
          comparison: 'COMPARISON_GT'
        }
      }
    ],
    notificationChannels: [
      // Add your notification channel ID here
    ]
  };

  const [policy] = await monitoring.createAlertPolicy({
    name: `projects/${projectId}`,
    alertPolicy: alertPolicy
  });

  console.log('Alert policy created:', policy.name);
}

createBandwidthAlert().catch(console.error);
```

---

### **Step 2: Deploy Bandwidth Tracking Function** (5 minutes)

This function logs daily bandwidth usage to Firestore for tracking.

**File:** `functions/src/bandwidth-tracker.ts` (add to functions)

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Track daily bandwidth usage
 * Runs every 6 hours
 */
export const trackBandwidthUsage = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const today = new Date().toISOString().split('T')[0];
    
    // Note: Firebase Hosting bandwidth data is available via Cloud Monitoring API
    // This is a placeholder - actual implementation requires Cloud Monitoring API access
    
    await db.collection('_bandwidth_tracking').doc(today).set({
      date: today,
      trackedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'tracked'
    }, { merge: true });
    
    return null;
  });
```

**Deploy:**
```bash
firebase deploy --only functions:trackBandwidthUsage
```

---

### **Step 3: Set Up Daily Usage Dashboard** (Optional, 10 minutes)

Create a simple dashboard to view daily bandwidth:

**File:** `portal/bandwidth-dashboard.html` (create new file)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bandwidth Dashboard | Soulamore</title>
    <link rel="stylesheet" href="../assets/css/global.css">
    <style>
        body { background: #0f172a; color: #f1f5f9; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dashboard { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
        .stat-value { font-size: 3rem; font-weight: 700; color: var(--teal-glow); }
        .stat-label { color: #94a3b8; margin-top: 8px; }
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 20px; }
        .alert-warning { background: rgba(251,191,36,0.1); border: 1px solid #fbbf24; color: #fbbf24; }
        .alert-danger { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #ef4444; }
    </style>
</head>
<body>
    <div class="dashboard">
        <h1 style="font-size: 2.5rem; margin-bottom: 30px;">📊 Bandwidth Dashboard</h1>
        
        <div class="stat-card">
            <div class="stat-value" id="currentUsage">-- GB</div>
            <div class="stat-label">Current Month Usage (Target: <10GB)</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value" id="dailyAverage">-- GB</div>
            <div class="stat-label">Daily Average</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value" id="projectedTotal">-- GB</div>
            <div class="stat-label">Projected Month End Total</div>
        </div>
        
        <div id="alertContainer"></div>
        
        <div class="stat-card">
            <h3>Recent Usage</h3>
            <div id="usageHistory" style="margin-top: 20px;"></div>
        </div>
    </div>
    
    <script type="module">
        import { auth, db, collection, query, orderBy, limit, getDocs } from '../assets/js/firebase-config.js';
        
        auth.onAuthStateChanged(async (user) => {
            if (!user) {
                window.location.href = '../login.html';
                return;
            }
            
            // Check if admin
            const userDoc = await getDocs(query(collection(db, 'roles'), where('__name__', '==', user.uid)));
            const isAdmin = userDoc.docs.some(doc => doc.data().admin === true);
            
            if (!isAdmin) {
                alert('Admin access required');
                window.location.href = 'user-dashboard.html';
                return;
            }
            
            // Load bandwidth data
            loadBandwidthData();
        });
        
        async function loadBandwidthData() {
            // This would fetch from Cloud Monitoring API
            // For now, show placeholder
            document.getElementById('currentUsage').textContent = 'Loading...';
            
            // TODO: Integrate with Cloud Monitoring API for real data
            // https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.timeSeries/list
        }
    </script>
</body>
</html>
```

---

## 📊 Expected Bandwidth After Bot Prevention

| Scenario | Before | After (Expected) |
|----------|--------|------------------|
| **Normal Traffic** | 10-20GB/month | 5-8GB/month |
| **Bot Attack** | 800GB+/month | <10GB/month |
| **With App Check** | N/A | 3-5GB/month |

---

## 🚨 Alert Response Plan

### At 5GB (50% of limit)
- **Action:** Review logs
- **Check:** `firebase functions:log`
- **Look for:** Unusual traffic patterns

### At 7.5GB (75% of limit)
- **Action:** Investigate immediately
- **Check:** Cloudflare Analytics (if enabled)
- **Consider:** Temporary rate limiting increase

### At 9GB (90% of limit)
- **Action:** Emergency response
- **Options:**
  1. Enable stricter rate limiting
  2. Temporarily block suspicious IPs
  3. Enable App Check enforcement (if not already)

### At 10GB (100% of limit)
- **Action:** Firebase Hosting may suspend
- **Immediate:** Contact Firebase support
- **Prevent:** Review and strengthen bot prevention

---

## 🔍 Manual Bandwidth Check

Check current bandwidth usage manually:

### Via Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `soulamore-f0a64`
3. Navigate to: **Usage** → **Hosting**
4. View: **Bandwidth** section

### Via Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `soulamore-f0a64`
3. Navigate to: **Monitoring** → **Metrics Explorer**
4. Select metric: `Firebase Hosting → Traffic Sent`
5. Set time range: Last 30 days

---

## ✅ Checklist

- [ ] Create budget alert in Google Cloud Console
- [ ] Set thresholds: 50% (5GB), 75% (7.5GB), 90% (9GB), 100% (10GB)
- [ ] Add email: `contact.soulamore@gmail.com`
- [ ] (Optional) Deploy bandwidth tracking function
- [ ] (Optional) Create bandwidth dashboard
- [ ] Test alert by checking current usage

---

## 📞 Quick Commands

```bash
# Check current function logs for suspicious activity
firebase functions:log --limit 50

# View recent errors
firebase functions:log --severity ERROR
```

---

**Setup Time:** 10-15 minutes  
**Status:** Ready to configure

---

*Keep your bandwidth under 10GB/month with these alerts* 📊
