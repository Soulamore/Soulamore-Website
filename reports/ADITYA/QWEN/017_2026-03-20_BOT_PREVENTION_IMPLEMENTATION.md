# 🛡️ Bot Prevention & Anti-Scraping Implementation Plan
**Date:** March 20, 2026  
**Contributors:** Qwen Code + ANTIGRAVITY  
**Session:** Security - Bot Prevention Layer  
**Status:** 📋 READY FOR EXECUTION  

---

## 📋 Executive Summary

**Problem:** 12MB site generating 800GB+ downloads indicates aggressive bot scraping via:
- Recursive crawling (wget, httrack)
- Asset hammering (repeated JS/CSS downloads)
- Competitive scraping (therapists, blogs, peer profiles)

**Solution:** Multi-layer defense WITHOUT Cloudflare (deferred). Focus on Firebase-native protections.

---

## 🏗️ Defense Layers (Firebase-Only)

### Layer 1: robots.txt (Polite Bots) ✅
### Layer 2: Security Headers (firebase.json) ✅
### Layer 3: Firestore Rate Limiting ✅
### Layer 4: Query Limits on Public Collections ✅
### Layer 5: App Check (reCAPTCHA) ⏳ REQUIRES USER ACTION
### Layer 6: Monitoring & Alerts ⏳ REQUIRES USER ACTION

---

## 🚀 Implementation Plan

### **Layer 1: robots.txt** (5 minutes)

**File:** `robots.txt` (project root)

```txt
# Soulamore Robots.txt
# Blocks AI crawlers and limits aggressive bots

User-agent: *
Disallow: /portal/
Disallow: /api/
Disallow: /functions/
Disallow: /admin/
Disallow: /private/
Crawl-delay: 10

# Block AI/ML crawlers explicitly
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: FacebookBot
Disallow: /

# Allow only essential Google bots
User-agent: Googlebot
Allow: /
Crawl-delay: 5

User-agent: Bingbot
Allow: /
Crawl-delay: 5

# Sitemap
Sitemap: https://soulamore.com/sitemap.xml
```

**Note:** Already have `robots.txt` in project - will UPDATE with new rules.

---

### **Layer 2: Security Headers** (10 minutes)

**File:** `firebase.json`

**Add to hosting.headers:**

```json
{
  "source": "**",
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-Robots-Tag",
      "value": "noarchive, nosnippet, noimageindex"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    },
    {
      "key": "Content-Security-Policy",
      "value": "default-src 'self'; script-src 'self' https://www.gstatic.com https://apis.google.com https://www.google.com https://*.firebaseio.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.razorpay.com https://*.zeptomail.eu; img-src 'self' data: https: blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    },
    {
      "key": "Permissions-Policy",
      "value": "camera=(), microphone=(), geolocation=(), payment=(self)"
    },
    {
      "key": "Cache-Control",
      "value": "public, max-age=300, must-revalidate"
    }
  ]
}
```

**For static assets (aggressive caching):**

```json
{
  "source": "**/*.@(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

---

### **Layer 3: Firestore Rate Limiting** (30 minutes)

**File:** `functions/index.js`

**Add Rate Limiting Helper:**

```javascript
/**
 * Rate Limiting Helper
 * Limits actions per user per hour
 * 
 * @param {string} uid - User ID
 * @param {string} action - Action name (e.g., 'contact_form', 'booking')
 * @param {number} limitPerHour - Max requests per hour
 */
const rateLimit = async (uid, action, limitPerHour = 60) => {
  const key = `ratelimit_${action}_${uid}`;
  const ref = admin.firestore().collection('_rate_limits').doc(key);
  
  const now = Date.now();
  const windowStart = now - (60 * 60 * 1000); // 1 hour window

  return admin.firestore().runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const data = doc.exists ? doc.data() : { requests: [], uid, action };
    
    // Remove requests outside the window
    const recent = (data.requests || []).filter(t => t > windowStart);
    
    if (recent.length >= limitPerHour) {
      const error = new functions.https.HttpsError(
        'resource-exhausted',
        `Too many ${action} requests. Limit: ${limitPerHour}/hour. Please wait.`
      );
      throw error;
    }
    
    recent.push(now);
    tx.set(ref, { requests: recent, uid, action, updatedAt: now });
    return true;
  });
};

// === USAGE EXAMPLES ===

// Example 1: Contact Form Rate Limiting (10/hour)
exports.submitContactForm = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    // Allow anonymous but limit more strictly
    await rateLimit('anon_' + context.rawRequest.ip, 'contact_form', 5);
  } else {
    await rateLimit(context.auth.uid, 'contact_form', 10);
  }
  
  // ... rest of function
});

// Example 2: Booking Rate Limiting (5/hour)
exports.createBooking = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  await rateLimit(context.auth.uid, 'create_booking', 5);
  
  // ... rest of function
});

// Example 3: Blog Comment Rate Limiting (20/hour)
exports.addBlogComment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  await rateLimit(context.auth.uid, 'blog_comment', 20);
  
  // ... rest of function
});

// Example 4: Forum Post Rate Limiting (10/hour)
exports.createForumPost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  await rateLimit(context.auth.uid, 'forum_post', 10);
  
  // ... rest of function
});

// Example 5: SoulBot Message Rate Limiting (30/hour)
exports.sendSoulbotMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    await rateLimit('anon_' + context.rawRequest.ip, 'soulbot_anon', 10);
  } else {
    await rateLimit(context.auth.uid, 'soulbot', 30);
  }
  
  // ... rest of function
});
```

---

### **Layer 4: Query Limits on Public Collections** (20 minutes)

**File:** `firestore.rules`

**Add query limits to prevent bulk scraping:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // === HELPER FUNCTIONS ===
    
    function hasRole(requiredRole) {
      return request.auth != null && request.auth.token.role == requiredRole;
    }
    
    function isAdmin() {
      return hasRole('admin');
    }
    
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // === PUBLIC COLLECTIONS WITH ANTI-SCRAPING ===
    
    // Therapists - Public but paginated only
    match /therapists/{therapistId} {
      // Single doc reads OK
      allow get: if true;
      
      // List with limit only (prevents bulk dump)
      allow list: if request.query.limit != null 
                  && request.query.limit <= 10;
      
      // Only admins can modify
      allow create, update, delete: if isAdmin();
    }
    
    // Blog Posts - Published only, paginated
    match /blog_posts/{blogId} {
      // Published posts are public (single reads)
      allow get: if resource.data.status == 'published';
      
      // List with limit only
      allow list: if resource.data.status == 'published'
                  && request.query.limit != null
                  && request.query.limit <= 10;
      
      // Authors can read their own drafts
      allow get: if request.auth != null 
                 && resource.data.authorId == request.auth.uid;
      
      // Admins can read all
      allow get: if isAdmin();
      
      // Create requires auth
      allow create: if request.auth != null;
      
      // Only author or admin can update
      allow update, delete: if isOwner(resource.data.authorId) || isAdmin();
    }
    
    // Peer Profiles - Public listing, paginated
    match /peers/{peerId} {
      allow get: if resource.data.status == 'approved';
      allow list: if resource.data.status == 'approved'
                  && request.query.limit != null
                  && request.query.limit <= 10;
      allow create: if true; // Public application
      allow update: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Psychologist Profiles - Public listing, paginated
    match /psychologists/{psychId} {
      allow get: if resource.data.status == 'approved';
      allow list: if resource.data.status == 'approved'
                  && request.query.limit != null
                  && request.query.limit <= 10;
      allow create: if true; // Public application
      allow update: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Forum Posts - Public but paginated
    match /forum_posts/{postId} {
      allow get: if true; // Public read
      allow list: if request.query.limit != null
                  && request.query.limit <= 20; // Slightly higher for forums
      allow create: if request.auth != null;
      allow update: if isOwner(resource.data.authorId) || isAdmin();
    }
    
    // Blog Comments - Public but paginated
    match /blog_comments/{commentId} {
      allow get: if true;
      allow list: if request.query.limit != null
                  && request.query.limit <= 50;
      allow create: if request.auth != null;
      allow update, delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // === SECURED COLLECTIONS ===
    
    // Users - Private
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if false;
    }
    
    // Active Souls - Authenticated only with schema validation
    match /active_souls/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
                    && request.resource.data.keys().hasOnly(['uid', 'timestamp', 'status'])
                    && request.resource.data.uid == request.auth.uid;
      allow update: if request.auth != null 
                    && resource.data.uid == request.auth.uid
                    && request.resource.data.keys().hasOnly(['status', 'lastSeen']);
      allow delete: if false;
    }
    
    // Payments - Locked down completely
    match /payments/{paymentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null; // Via Cloud Function only
      allow update: if false; // ❌ NEVER ALLOW CLIENT UPDATES
      allow delete: if false;
    }
    
    // Roles - Admin only
    match /roles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create, update, delete: if false; // Custom Claims only
    }
    
    // Rate Limits - System only
    match /_rate_limits/{document=**} {
      allow read, write: if false; // Internal use only
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### **Layer 5: App Check Setup** (REQUIRES USER ACTION)

**User must complete in Firebase Console:**

1. Go to Firebase Console → Project Settings → App Check
2. Click "Register App"
3. Choose reCAPTCHA v3 (free) or reCAPTCHA Enterprise (recommended)
4. Get reCAPTCHA site key
5. Add to frontend code (provided below)
6. Enforce in Firebase Console

**Frontend Code (to add after user gets key):**

**File:** `assets/js/firebase-config.js`

```javascript
// Add after Firebase initialization
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js';

// Initialize App Check (AFTER user adds reCAPTCHA site key)
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY_HERE'),
  isTokenAutoRefreshEnabled: true
});

console.log('✅ App Check initialized');
```

**After setup, enforce in Firebase Console:**
- Firestore → Enforce App Check
- Cloud Functions → Enforce App Check

---

### **Layer 6: Monitoring & Alerts** (REQUIRES USER ACTION)

**User must set up in Google Cloud Console:**

#### 6.1: Firebase Hosting Usage Alert

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `soulamore-f0a64`
3. Go to **Billing** → **Budgets & alerts**
4. Click **Create Budget**
5. Set amount: 50% of expected monthly bandwidth
6. Add email alert: `contact.soulamore@gmail.com`
7. Save

#### 6.2: Scraping Detection Function

**File:** `functions/index.js`

```javascript
/**
 * Detect Scraping Patterns
 * Runs every hour to check for suspicious activity
 */
exports.detectScrapingPatterns = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Check for IPs making 500+ requests/hour to public collections
    const suspiciousIPs = [];
    
    // Query rate limits for high-frequency actions
    const rateLimitsSnapshot = await db.collection('_rate_limits')
      .where('updatedAt', '>=', oneHourAgo)
      .get();
    
    rateLimitsSnapshot.forEach(doc => {
      const data = doc.data();
      const requestCount = (data.requests || []).length;
      
      if (requestCount > 100) { // Threshold: 100 requests/hour
        suspiciousIPs.push({
          uid: data.uid,
          action: data.action,
          count: requestCount,
          updatedAt: data.updatedAt
        });
      }
    });
    
    // Log suspicious activity
    if (suspiciousIPs.length > 0) {
      await db.collection('_scraping_alerts').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        suspiciousIPs,
        totalSuspicious: suspiciousIPs.length
      });
      
      // Send email alert if > 5 suspicious IPs
      if (suspiciousIPs.length > 5) {
        const mailOptions = {
          from: 'Soulamore Security <noreply@soulamore.com>',
          to: 'contact.soulamore@gmail.com',
          subject: `🚨 Scraping Alert: ${suspiciousIPs.length} suspicious IPs detected`,
          text: `Detected ${suspiciousIPs.length} IPs with suspicious activity in the last hour.\n\n${JSON.stringify(suspiciousIPs, null, 2)}`
        };
        
        // Send via ZeptoMail
        // ... email sending logic
      }
    }
    
    // Clean up old rate limits (older than 24 hours)
    const oldRateLimits = await db.collection('_rate_limits')
      .where('updatedAt', '<=', now - (24 * 60 * 60 * 1000))
      .get();
    
    const batch = db.batch();
    oldRateLimits.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    return null;
  });
```

---

## 📊 Implementation Priority

### **Immediate (Today)** - 1 hour
1. ✅ Update `robots.txt` with AI crawler blocks
2. ✅ Add security headers to `firebase.json`
3. ✅ Add rate limiting helper to `functions/index.js`
4. ✅ Update `firestore.rules` with query limits

### **This Week** - 2 hours
5. ⏳ Set up App Check (requires user action in Firebase Console)
6. ⏳ Add App Check to frontend code
7. ⏳ Enforce App Check for Firestore & Functions

### **This Month** - 30 minutes
8. ⏳ Set up billing alerts in Google Cloud Console
9. ⏳ Deploy scraping detection function
10. ⏳ Monitor logs for suspicious activity

---

## 🧪 Testing Checklist

### Rate Limiting
- [ ] Contact form blocks after 10 submissions/hour
- [ ] Booking creation blocks after 5 attempts/hour
- [ ] Blog comments block after 20/hour
- [ ] SoulBot messages block after 30/hour

### Query Limits
- [ ] Therapists list with limit=10 works
- [ ] Therapists list with limit=50 fails (permission denied)
- [ ] Therapists list without limit fails (permission denied)
- [ ] Blog posts list with limit=10 works
- [ ] Blog posts list without limit fails

### Security Headers
- [ ] X-Content-Type-Options: nosniff present
- [ ] X-Frame-Options: DENY present
- [ ] CSP header present
- [ ] Referrer-Policy present

### App Check (after setup)
- [ ] App Check token generated on page load
- [ ] Firestore reads work with App Check
- [ ] Firestore reads fail without App Check (after enforcement)
- [ ] Cloud Functions work with App Check
- [ ] Cloud Functions fail without App Check (after enforcement)

---

## 📁 Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `robots.txt` | Add AI crawler blocks | P0 |
| `firebase.json` | Add security headers | P0 |
| `functions/index.js` | Add rate limiting helper | P0 |
| `firestore.rules` | Add query limits, schema validation | P0 |
| `assets/js/firebase-config.js` | Add App Check (after user gets key) | P1 |

---

## ⚠️ Breaking Changes

### After Deployment:
1. **Query limits** - All public collection queries MUST have `.limit()` clause
2. **Rate limits** - Users hitting rate limits will get errors
3. **App Check** (after enforcement) - Requests without App Check token will fail

### Migration Required:
1. Update all frontend queries to include `.limit(10)` or similar
2. Test all forms for rate limiting
3. Verify App Check works before enforcing

---

## 📞 Support Resources

### Documentation
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Rate Limiting](https://firebase.google.com/docs/functions/rate-limiting)

### Commands
```bash
# Deploy rules
firebase deploy --only firestore:rules

# Deploy functions
firebase deploy --only functions

# Deploy hosting config
firebase deploy --only hosting

# View function logs
firebase functions:log
```

---

**Implementation Plan Version:** 1.0.0  
**Last Updated:** March 20, 2026  
**Status:** Ready for Execution (P0 items)

---

*End of Bot Prevention Implementation Plan* 🛡️
