---
name: cloudflare-edge-shield
description: Advanced Cloudflare edge hardening and performance optimization for Firebase/static sites.
---

# Cloudflare Edge Shield Protocol

Use this skill to implement the "Edge Shield" architecture, funneling all traffic through Cloudflare and optimizing for performance.

## 🛠️ Implementation Steps

### 1. Host Redirection (Firebase Funnel)
To prevent bypassing Cloudflare, always inject the domain router in the `<head>` of HTML files.

**Script Template**:
```html
<script>
    (function() {
        var h = window.location.hostname;
        var d = 'soulamore.com';
        if (h.includes('firebaseapp.com') || h.includes('web.app')) {
            window.location.replace('https://' + d + window.location.pathname + window.location.search);
        }
    })();
</script>
```

### 2. SEO Canonicalization
Ensure every page has a canonical link pointing to the custom domain.

```javascript
var link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
link.rel = 'canonical';
link.href = 'https://soulamore.com' + window.location.pathname;
if (!link.parentNode) document.head.appendChild(link);
```

## 🛡️ Cloudflare Manual Checklist

### SSL/TLS
- **Always Use HTTPS**: Enabled
- **HSTS**: Enabled (6 months, No-Sniff ON)

### Speed & Optimization
- **Brotli**: Enabled
- **Cloudflare Fonts**: Enabled
- **Early Hints**: Enabled
- **Browser Cache TTL**: 1 Year

### Security
- **WAF**: Enabled
- **X-Content-Type-Options**: nosniff (set via Transform Rules or Header modification)

## 📦 Reference Scripts
- `scripts/inject-domain-router.py`: Bulk injects the redirect and canonical script into all HTML files.
