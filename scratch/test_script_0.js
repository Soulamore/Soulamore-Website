
        (function() {
            var host = window.location.hostname;
            var path = window.location.pathname;
            var search = window.location.search;
            var targetDomain = 'soulamore.com';
            
            // 1. Redirect Firebase Traffic
            if (host.includes('firebaseapp.com') || host.includes('web.app')) {
                window.location.replace('https://' + targetDomain + path + search);
            }
            
            // 2. Canonical Injection
            var canonicalUrl = 'https://' + targetDomain + path;
            var link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
            link.rel = 'canonical';
            link.href = canonicalUrl;
            if (!link.parentNode) document.head.appendChild(link);
        })();
    