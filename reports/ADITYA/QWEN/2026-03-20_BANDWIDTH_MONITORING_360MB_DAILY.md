# 📊 Bandwidth Monitoring Setup - Target: <360MB/day
**Date:** March 20, 2026  
**Purpose:** Set up alerts to keep DAILY bandwidth under 360MB  

---

## 🎯 Target: <360MB/day (≈10.8GB/month)

Firebase Hosting Spark Plan (Free Tier):
- **Daily Limit:** 360MB/day
- **Monthly Limit:** ~10.8GB/month
- **Overage:** Site goes offline until next day/month resets

With bot prevention deployed, your bandwidth should drop from **~27GB/day → <360MB/day**.

---

## 📋 Setup Steps

### **Step 1: Create Daily Bandwidth Alert** (10 minutes)

#### Option A: Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `soulamore-f0a64`
3. Navigate to: **Monitoring** → **Alerting**
4. Click **Create Policy**

**Alert Configuration:**

```
Metric: Firebase Hosting → Traffic Sent
Resource: firebase_hosting
Filter: (none)
Aggregation:
  - Aligner: ALIGN_SUM
  - Alignment period: 1 day (86400 seconds)
  - Reduce across: None

Threshold:
  - Condition: Above threshold
  - Threshold value: 360 MB (377487360 bytes)
  - Advanced: Retest window = 0 minutes
```

**Notification:**

```
Notification channels:
  ✓ Email: contact.soulamore@gmail.com
  ✓ (Optional) SMS: Add your phone number

Alert name: "🚨 Soulamore Daily Bandwidth > 360MB"
Documentation: "Daily bandwidth exceeded Spark Plan limit. Site may go offline."
```

**Auto-close:**
```
✓ Auto-close when metric stops reporting
```

5. Click **Next**
6. Click **Create Policy**

---

#### Option B: Multiple Threshold Alerts (Better Coverage)

Create **3 separate alerts** for better monitoring:

### Alert 1: Warning at 50% (180MB)

```
Alert name: "⚠️ Bandwidth Warning - 180MB (50%)"
Threshold: 180MB (188743680 bytes)
Notification: Email only
Action: Review logs, check for unusual traffic
```

### Alert 2: High at 75% (270MB)

```
Alert name: "🟠 Bandwidth High - 270MB (75%)"
Threshold: 270MB (283115520 bytes)
Notification: Email + SMS
Action: Investigate immediately, prepare emergency response
```

### Alert 3: Critical at 90% (324MB)

```
Alert name: "🚨 Bandwidth Critical - 324MB (90%)"
Threshold: 324MB (339738624 bytes)
Notification: Email + SMS (multiple recipients)
Action: Emergency response - enable strict rate limiting
```

---

### **Step 2: Deploy Bandwidth Tracking Function** (5 minutes)

This function tracks daily usage and sends alerts before limit is reached.

**File:** `functions/src/bandwidth-monitor.ts` (create new file)

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Monitor daily bandwidth usage
 * Runs every hour
 * Sends alert at 50%, 75%, 90% of 360MB daily limit
 */
export const monitorDailyBandwidth = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async (context) => {
    const db = admin.firestore();
    const today = new Date().toISOString().split('T')[0];
    const now = Date.now();
    const dayStart = new Date(today).getTime();
    
    // 360MB daily limit in bytes
    const DAILY_LIMIT = 360 * 1024 * 1024; // 377,487,360 bytes
    const WARNING_THRESHOLD = DAILY_LIMIT * 0.50;   // 180MB
    const HIGH_THRESHOLD = DAILY_LIMIT * 0.75;      // 270MB
    const CRITICAL_THRESHOLD = DAILY_LIMIT * 0.90;  // 324MB
    
    try {
      // Get today's bandwidth from Cloud Monitoring API
      // Note: This requires Cloud Monitoring API to be enabled
      const monitoring = require('@google-cloud/monitoring');
      const client = new monitoring.MetricServiceClient();
      
      const projectId = 'soulamore-f0a64';
      const nowDate = new Date();
      const startTime = new Date(dayStart);
      
      const request = {
        name: client.projectPath(projectId),
        filter: 'metric.type="firebase hosting/traffic_sent" AND resource.type="firebase_hosting"',
        interval: {
          startTime: { seconds: Math.floor(startTime.getTime() / 1000) },
          endTime: { seconds: Math.floor(nowDate.getTime() / 1000) }
        },
        aggregation: {
          alignmentPeriod: { seconds: Math.floor((now - dayStart) / 1000) },
          perSeriesAligner: 'ALIGN_SUM',
          crossSeriesReducer: 'REDUCE_SUM'
        }
      };
      
      const [timeSeries] = await client.listTimeSeries(request);
      let currentUsage = 0;
      
      if (timeSeries && timeSeries.length > 0) {
        const points = timeSeries[0].points || [];
        if (points.length > 0) {
          currentUsage = points[0].value.int64Value || 0;
        }
      }
      
      // Calculate percentage
      const percentage = (currentUsage / DAILY_LIMIT) * 100;
      
      // Log to Firestore
      await db.collection('_bandwidth_tracking').doc(today).set({
        date: today,
        usageBytes: currentUsage,
        usageMB: currentUsage / (1024 * 1024),
        percentage: percentage,
        limit: DAILY_LIMIT,
        trackedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      // Send alerts based on thresholds
      let alertLevel = null;
      let alertMessage = '';
      
      if (currentUsage >= CRITICAL_THRESHOLD) {
        alertLevel = 'CRITICAL';
        alertMessage = `🚨 CRITICAL: ${percentage.toFixed(1)}% of daily bandwidth used (${(currentUsage / 1024 / 1024).toFixed(1)}MB / 360MB)`;
      } else if (currentUsage >= HIGH_THRESHOLD) {
        alertLevel = 'HIGH';
        alertMessage = `🟠 HIGH: ${percentage.toFixed(1)}% of daily bandwidth used (${(currentUsage / 1024 / 1024).toFixed(1)}MB / 360MB)`;
      } else if (currentUsage >= WARNING_THRESHOLD) {
        alertLevel = 'WARNING';
        alertMessage = `⚠️ WARNING: ${percentage.toFixed(1)}% of daily bandwidth used (${(currentUsage / 1024 / 1024).toFixed(1)}MB / 360MB)`;
      }
      
      // Send email alert if threshold crossed
      if (alertLevel) {
        const mailTransport = require('nodemailer').createTransport({
          host: "smtp.zeptomail.eu",
          port: 587,
          auth: {
            user: functions.config().zeptomail?.user || "emailapikey",
            pass: functions.config().zeptomail?.password
          }
        });
        
        const mailOptions = {
          from: 'Soulamore Monitoring <noreply@soulamore.com>',
          to: 'contact.soulamore@gmail.com',
          subject: `${alertMessage}`,
          text: `
Daily Bandwidth Alert - ${alertLevel}

Current Usage: ${(currentUsage / 1024 / 1024).toFixed(1)}MB
Daily Limit: 360MB
Percentage: ${percentage.toFixed(1)}%
Time: ${new Date().toISOString()}

Action Required:
- Review function logs: firebase functions:log
- Check for bot traffic patterns
- Consider enabling stricter rate limiting
- If critical: Site may go offline soon

Dashboard: https://console.firebase.google.com/project/soulamore-f0a64/usage
          `
        };
        
        await mailTransport.sendMail(mailOptions);
        console.log(`Alert sent: ${alertMessage}`);
      }
      
      // Log to console
      console.log(`Bandwidth tracking: ${(currentUsage / 1024 / 1024).toFixed(1)}MB / 360MB (${percentage.toFixed(1)}%)`);
      
      return null;
      
    } catch (error) {
      console.error('Error monitoring bandwidth:', error);
      
      // Log error to Firestore
      await db.collection('_bandwidth_errors').add({
        error: error.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    }
  });
```

**Add dependency to `functions/package.json`:**
```json
{
  "dependencies": {
    "@google-cloud/monitoring": "^3.0.0"
  }
}
```

**Install and Deploy:**
```bash
cd functions
npm install
firebase deploy --only functions:monitorDailyBandwidth
```

---

### **Step 3: Enable Cloud Monitoring API** (2 minutes)

1. Go to [Cloud Monitoring API](https://console.cloud.google.com/apis/library/monitoring.googleapis.com)
2. Select project: `soulamore-f0a64`
3. Click **Enable**

---

## 📊 Expected Bandwidth After Bot Prevention

| Scenario | Before | After (Expected) |
|----------|--------|------------------|
| **Normal Traffic** | 1-2GB/day | **100-250MB/day** ✅ |
| **Bot Attack** | 27GB+/day | **<360MB/day** ✅ |
| **With App Check** | N/A | **80-150MB/day** ✅ |
| **Firebase Limit** | 360MB/day | **360MB/day** |

---

## 🚨 Alert Response Plan

### At 180MB (50% - Warning)
- **Action:** Review logs
- **Check:** `firebase functions:log`
- **Look for:** Unusual traffic patterns, repeated errors

### At 270MB (75% - High)
- **Action:** Investigate immediately
- **Check:** Cloud Function rate limits
- **Consider:** Temporarily stricter limits (e.g., 5/hour → 3/hour)

### At 324MB (90% - Critical)
- **Action:** Emergency response
- **Options:**
  1. Enable strictest rate limiting (1-2 requests/hour per IP)
  2. Temporarily block non-essential endpoints
  3. Enable maintenance mode if necessary
  4. Prepare for site downtime

### At 360MB (100% - Limit Reached)
- **Action:** Site goes offline
- **Wait:** Reset at midnight PST (or next day)
- **Prevent:** Review and strengthen bot prevention

---

## 🔍 Manual Bandwidth Check

Check current daily usage manually:

### Via Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `soulamore-f0a64`
3. Navigate to: **Usage** → **Hosting**
4. View: **Bandwidth** section (shows daily usage)
5. **Resets:** Daily at midnight PST

### Via Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `soulamore-f0a64`
3. Navigate to: **Monitoring** → **Metrics Explorer**
4. Select metric: `Firebase Hosting → Traffic Sent`
5. Set time range: Last 24 hours
6. View: Total bytes sent

---

## 📈 Daily Usage Tracking Dashboard

Create a simple dashboard to view daily usage:

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
        .stat-value { font-size: 3rem; font-weight: 700; }
        .stat-label { color: #94a3b8; margin-top: 8px; }
        .progress-bar { width: 100%; height: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin-top: 15px; }
        .progress-fill { height: 100%; transition: width 0.3s; }
        .progress-safe { background: linear-gradient(90deg, #10b981, #4ECDC4); }
        .progress-warning { background: linear-gradient(90deg, #fbbf24, #F49F75); }
        .progress-danger { background: linear-gradient(90deg, #F49F75, #ef4444); }
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 20px; }
        .alert-warning { background: rgba(251,191,36,0.1); border: 1px solid #fbbf24; color: #fbbf24; }
        .alert-danger { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #ef4444; }
    </style>
</head>
<body>
    <div class="dashboard">
        <h1 style="font-size: 2.5rem; margin-bottom: 30px;">📊 Daily Bandwidth Dashboard</h1>
        
        <div class="stat-card">
            <div class="stat-value" id="currentUsage">-- MB</div>
            <div class="stat-label">Today's Usage (Limit: 360MB)</div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressBar" style="width: 0%;"></div>
            </div>
            <div style="text-align: right; margin-top: 8px; color: #94a3b8; font-size: 0.85rem;">
                <span id="percentageDisplay">0%</span> of 360MB
            </div>
        </div>
        
        <div id="alertContainer"></div>
        
        <div class="stat-card">
            <h3>Usage History (Last 7 Days)</h3>
            <div id="usageHistory" style="margin-top: 20px;"></div>
        </div>
        
        <div class="stat-card">
            <h3>Reset Time</h3>
            <p style="color: #94a3b8; margin-top: 10px;">
                Daily bandwidth resets at <strong>midnight PST</strong>
            </p>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 8px;">
                Next reset: <span id="nextReset">--</span>
            </p>
        </div>
    </div>
    
    <script type="module">
        import { auth, db, collection, query, orderBy, limit, getDocs } from '../assets/js/firebase-config.js';
        
        const DAILY_LIMIT_MB = 360;
        
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
            try {
                // Load today's usage
                const today = new Date().toISOString().split('T')[0];
                const todayDoc = await getDocs(query(
                    collection(db, '_bandwidth_tracking'),
                    where('date', '==', today)
                ));
                
                let currentUsageMB = 0;
                if (!todayDoc.empty) {
                    const data = todayDoc.docs[0].data();
                    currentUsageMB = data.usageMB || 0;
                }
                
                // Update UI
                const percentage = Math.min((currentUsageMB / DAILY_LIMIT_MB) * 100, 100);
                
                document.getElementById('currentUsage').textContent = `${currentUsageMB.toFixed(1)} MB`;
                document.getElementById('percentageDisplay').textContent = `${percentage.toFixed(1)}%`;
                
                const progressBar = document.getElementById('progressBar');
                progressBar.style.width = `${percentage}%`;
                
                // Update progress bar color
                progressBar.className = 'progress-fill';
                if (percentage < 50) {
                    progressBar.classList.add('progress-safe');
                } else if (percentage < 75) {
                    progressBar.classList.add('progress-warning');
                } else {
                    progressBar.classList.add('progress-danger');
                }
                
                // Show alerts
                const alertContainer = document.getElementById('alertContainer');
                if (percentage >= 90) {
                    alertContainer.innerHTML = `
                        <div class="alert alert-danger">
                            🚨 CRITICAL: ${percentage.toFixed(1)}% of daily bandwidth used!
                            Site may go offline soon. Enable emergency rate limiting.
                        </div>
                    `;
                } else if (percentage >= 75) {
                    alertContainer.innerHTML = `
                        <div class="alert alert-warning">
                            🟠 HIGH: ${percentage.toFixed(1)}% of daily bandwidth used.
                            Investigate traffic patterns immediately.
                        </div>
                    `;
                } else if (percentage >= 50) {
                    alertContainer.innerHTML = `
                        <div class="alert alert-warning">
                            ⚠️ WARNING: ${percentage.toFixed(1)}% of daily bandwidth used.
                            Review logs for unusual activity.
                        </div>
                    `;
                }
                
                // Calculate next reset (midnight PST)
                const now = new Date();
                const pstOffset = -8; // PST is UTC-8
                const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                const pst = new Date(utc + (3600000 * pstOffset));
                const tomorrow = new Date(pst);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                
                document.getElementById('nextReset').textContent = tomorrow.toLocaleString();
                
                // Load usage history
                loadUsageHistory();
                
            } catch (error) {
                console.error('Error loading bandwidth data:', error);
                document.getElementById('currentUsage').textContent = 'Error';
            }
        }
        
        async function loadUsageHistory() {
            const historyQuery = await getDocs(query(
                collection(db, '_bandwidth_tracking'),
                orderBy('date', 'desc'),
                limit(7)
            ));
            
            const historyContainer = document.getElementById('usageHistory');
            
            if (historyQuery.empty) {
                historyContainer.innerHTML = '<p style="color: #94a3b8;">No tracking data available yet.</p>';
                return;
            }
            
            let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">';
            
            historyQuery.forEach(doc => {
                const data = doc.data();
                const percentage = Math.min((data.usageMB / DAILY_LIMIT_MB) * 100, 100);
                const color = percentage < 50 ? '#10b981' : percentage < 75 ? '#fbbf24' : '#ef4444';
                
                html += `
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: ${color};">${data.usageMB.toFixed(0)}MB</div>
                        <div style="font-size: 0.85rem; color: #94a3b8;">${data.date}</div>
                        <div style="font-size: 0.75rem; color: #64748b; margin-top: 5px;">${percentage.toFixed(0)}%</div>
                    </div>
                `;
            });
            
            html += '</div>';
            historyContainer.innerHTML = html;
        }
    </script>
</body>
</html>
```

**Deploy:**
```bash
firebase deploy --only hosting:bandwidth-dashboard
```

---

## ✅ Checklist

- [ ] Enable Cloud Monitoring API
- [ ] Create alert policy at 360MB (100%)
- [ ] (Recommended) Create alerts at 50%, 75%, 90%
- [ ] Add email: `contact.soulamore@gmail.com`
- [ ] Deploy bandwidth monitoring function
- [ ] (Optional) Deploy bandwidth dashboard
- [ ] Test by checking current usage in Firebase Console

---

## 📞 Quick Commands

```bash
# Check current function logs for suspicious activity
firebase functions:log --limit 50

# View recent errors
firebase functions:log --severity ERROR

# Check bandwidth monitoring function
firebase functions:log --only monitorDailyBandwidth
```

---

## 🕐 Reset Times

**Firebase Hosting bandwidth resets:**
- **Daily:** Midnight PST (Pacific Standard Time)
- **Monthly:** 1st of each month, 12:00 AM PST

**Current PST Time:** Check at [TimeAndDate.com](https://www.timeanddate.com/worldclock/usa/los-angeles)

---

**Setup Time:** 10-15 minutes  
**Status:** Ready to configure

---

*Keep your daily bandwidth under 360MB to avoid site downtime* 📊
